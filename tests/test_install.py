import contextlib
import importlib.util
import io
import json
import shutil
import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("design_stack_install", ROOT / "install.py")
installer = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(installer)


def owned_skill(name: str, content: str = "old") -> str:
    return f"---\nname: {name}\nmetadata:\n  version: \"5.1.0\"\n---\n{content}\n"


class InstallerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="design-stack-install-test-")
        self.root = Path(self.tmp.name)
        self.package = self.root / "package"
        shutil.copytree(ROOT / "skills", self.package / "skills")
        files = installer.validate_package(self.package / "skills")
        (self.package / installer.PACKAGE_MANIFEST_NAME).write_text(json.dumps({
            "version": installer.VERSION,
            "skills": list(installer.RELEASE_SKILLS),
            "files": files,
        }))
        self.target = self.root / "target" / "skills"

    def tearDown(self):
        self.tmp.cleanup()

    def install(self, target=None, **kwargs):
        return installer.install(self.package, target or self.target, **kwargs)

    def test_full_copy_verify_idempotence_and_unknown_preservation(self):
        self.target.mkdir(parents=True)
        (self.target / "unrelated-skill").mkdir()
        (self.target / "unrelated-skill" / "SKILL.md").write_text("user-owned")
        self.assertIn("Installed 6 skills", self.install())
        manifest = json.loads((self.target / installer.MANIFEST_NAME).read_text())
        self.assertEqual(manifest.keys(), {"version", "skills", "files"})
        self.assertEqual(manifest["version"], "5.2.0")
        self.assertEqual(manifest["skills"], list(installer.RELEASE_SKILLS))
        self.assertEqual(installer.target_tree_manifest(self.target), manifest["files"])
        self.assertIn("Verified", installer.verify(self.target))
        self.assertIn("Already installed", self.install())
        self.assertTrue((self.target / "unrelated-skill" / "SKILL.md").exists())

    def test_existing_unowned_path_is_rejected_before_mutation(self):
        self.target.mkdir(parents=True)
        (self.target / installer.RELEASE_SKILLS[0]).mkdir()
        (self.target / installer.RELEASE_SKILLS[0] / "SKILL.md").write_text(owned_skill("some-other-skill"))
        with self.assertRaises(installer.InstallError):
            self.install()
        self.assertEqual(front := (self.target / installer.RELEASE_SKILLS[0] / "SKILL.md").read_text(), owned_skill("some-other-skill"))
        self.assertFalse((self.target / installer.RELEASE_SKILLS[1]).exists())

    def test_corrupt_package_rejected_without_touching_target(self):
        self.target.mkdir(parents=True)
        marker = self.target / "user.txt"
        marker.write_text("keep")
        (self.package / "skills" / installer.RELEASE_SKILLS[0] / "SKILL.md").write_text("not frontmatter")
        with self.assertRaises(installer.InstallError):
            self.install()
        self.assertEqual(marker.read_text(), "keep")
        self.assertFalse((self.target / installer.RELEASE_SKILLS[0]).exists())

    def test_real_failure_rolls_back_all_created_skills(self):
        self.target.mkdir(parents=True)
        old = self.target / installer.RELEASE_SKILLS[0]
        old.mkdir()
        (old / "SKILL.md").write_text(owned_skill(installer.RELEASE_SKILLS[0], "before"))
        original = installer.copy_tree_atomic
        calls = {"count": 0}

        def fail_on_second(source, destination):
            calls["count"] += 1
            if calls["count"] == 2:
                raise OSError("simulated disk failure")
            return original(source, destination)

        installer.copy_tree_atomic = fail_on_second
        try:
            with self.assertRaises(OSError):
                self.install()
        finally:
            installer.copy_tree_atomic = original
        self.assertEqual((old / "SKILL.md").read_text(), owned_skill(installer.RELEASE_SKILLS[0], "before"))
        self.assertFalse((self.target / installer.RELEASE_SKILLS[1]).exists())
        self.assertFalse(installer.state_path_for(self.target).exists())

    def test_mutated_file_blocks_guarded_rollback(self):
        self.install()
        skill = self.target / installer.RELEASE_SKILLS[0] / "SKILL.md"
        skill.write_text(skill.read_text() + "user edit\n")
        with self.assertRaises(installer.InstallError):
            installer.rollback(self.target)
        self.assertIn("user edit", skill.read_text())

    def test_first_install_rollback_removes_manifest_too(self):
        self.install()
        installer.rollback(self.target)
        self.assertFalse((self.target / installer.MANIFEST_NAME).exists())

    def test_first_install_retires_owned_frontend_slides(self):
        legacy = self.target / "frontend-slides"
        legacy.mkdir(parents=True)
        (legacy / "SKILL.md").write_text(owned_skill("frontend-slides", "legacy"))
        self.install()
        self.assertFalse(legacy.exists())
        self.assertIn("Verified", installer.verify(self.target))
        installer.rollback(self.target)
        self.assertEqual((legacy / "SKILL.md").read_text(), owned_skill("frontend-slides", "legacy"))

    @patch.object(installer.time, "time", return_value=1700000000)
    def test_upgrade_rollback_restores_prior_manifest_and_verify(self, frozen_clock):
        self.install()
        # Model a real 5.1.0 installation left in place before the 5.2.0
        # package is applied. Keep the old tree and its hashes intact so this
        # exercises the compatibility path in load_manifest().
        for name in installer.RELEASE_SKILLS:
            skill_file = self.target / name / "SKILL.md"
            skill_file.write_text(skill_file.read_text().replace('version: "5.2.0"', 'version: "5.1.0"'))
        prior_path = self.target / installer.MANIFEST_NAME
        prior_data = json.loads(prior_path.read_text())
        prior_data["version"] = "5.1.0"
        prior_data["files"] = installer.target_tree_manifest(self.target)
        prior_manifest = json.dumps(prior_data, sort_keys=True, indent=2).encode() + b"\n"
        prior_path.write_bytes(prior_manifest)
        source_file = self.package / "skills" / "brand-style-reference" / "SKILL.md"
        source_file.write_text(source_file.read_text() + "upgrade\n")
        files = installer.validate_package(self.package / "skills")
        (self.package / installer.PACKAGE_MANIFEST_NAME).write_text(json.dumps({
            "version": installer.VERSION, "skills": list(installer.RELEASE_SKILLS), "files": files,
        }))
        self.install()
        installer.rollback(self.target)
        self.assertEqual((self.target / installer.MANIFEST_NAME).read_bytes(), prior_manifest)
        self.assertIn("Verified", installer.verify(self.target))

    def test_unknown_installed_manifest_version_is_rejected(self):
        self.install()
        path = self.target / installer.MANIFEST_NAME
        data = json.loads(path.read_text())
        before_tree = installer.target_tree_manifest(self.target)
        for version in ("9.9.9", [], {}):
            with self.subTest(version=version):
                data["version"] = version
                path.write_text(json.dumps(data))
                before_manifest = path.read_bytes()
                with self.assertRaisesRegex(installer.InstallError, "Unsupported or corrupt installation manifest"):
                    installer.verify(self.target)
                with self.assertRaisesRegex(installer.InstallError, "Existing installation manifest is invalid"):
                    self.install()
                self.assertEqual(path.read_bytes(), before_manifest)
                self.assertEqual(installer.target_tree_manifest(self.target), before_tree)

    def test_upgrade_staging_failure_preserves_previous_manifest(self):
        self.install()
        prior_manifest = (self.target / installer.MANIFEST_NAME).read_bytes()
        source_file = self.package / "skills" / "brand-style-reference" / "SKILL.md"
        source_file.write_text(source_file.read_text() + "upgrade\n")
        files = installer.validate_package(self.package / "skills")
        (self.package / installer.PACKAGE_MANIFEST_NAME).write_text(json.dumps({
            "version": installer.VERSION, "skills": list(installer.RELEASE_SKILLS), "files": files,
        }))
        with patch.object(installer.shutil, "copytree", side_effect=OSError("staging failed")):
            with self.assertRaisesRegex(OSError, "staging failed"):
                self.install()
        self.assertEqual((self.target / installer.MANIFEST_NAME).read_bytes(), prior_manifest)
        self.assertIn("Verified", installer.verify(self.target))

    def test_corrupt_or_foreign_recovery_journal_does_not_touch_external_path(self):
        self.target.parent.mkdir(parents=True)
        state = installer.state_path_for(self.target)
        outside = self.root / "outside"
        outside.mkdir()
        marker = outside / "marker"
        marker.write_text("keep")
        state.write_text(json.dumps(["installing"]))
        with self.assertRaises(installer.InstallError):
            self.install()
        self.assertEqual(marker.read_text(), "keep")
        self.assertEqual(state.read_text(), json.dumps(["installing"]))

    def test_package_transport_change_against_explicit_manifest_is_rejected(self):
        source_file = self.package / "skills" / "brand-style-reference" / "SKILL.md"
        source_file.write_text(source_file.read_text() + "tampered\n")
        self.target.mkdir(parents=True)
        marker = self.target / "keep"
        marker.write_text("keep")
        with self.assertRaises(installer.InstallError):
            self.install()
        self.assertEqual(marker.read_text(), "keep")

    def test_codex_duplicate_root_only_allowlisted_owned_copy_is_moved(self):
        home = self.root / "home"
        canonical = home / ".agents" / "skills"
        duplicate = home / ".codex" / "skills"
        duplicate.mkdir(parents=True)
        copied = duplicate / "brand-style-reference"
        copied.mkdir()
        (copied / "SKILL.md").write_text(owned_skill("brand-style-reference"))
        unknown = duplicate / "unrelated"
        unknown.mkdir()
        (unknown / "marker").write_text("keep")
        original_home = installer._home
        installer._home = lambda: home
        try:
            self.install(canonical)
        finally:
            installer._home = original_home
        self.assertFalse(copied.exists())
        self.assertTrue((unknown / "marker").exists())

    def test_rules_are_report_only_unless_explicit_and_exact(self):
        rules = self.root / "rules.md"
        rules.write_bytes(b"- frontend-slides\r\nUse frontend-slides in this sentence.\r\n```md\r\n- frontend-slides\r\n```\r\n    - frontend-slides\r\n<!--\r\n- frontend-slides\r\n-->\r\nfrontend-slides\r\n- other-skill\r\n")
        original = rules.read_bytes()
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            self.install(rules=rules)
        self.assertIn("Potential legacy frontend-slides", output.getvalue())
        self.assertIn("- frontend-slides", rules.read_text())
        # A repeat install is a no-op, so test the explicit rewrite helper directly.
        changed = installer.rewrite_exact_rules(rules)
        self.assertEqual(changed, [rules])
        self.assertEqual(rules.read_bytes(), original.replace(b"- frontend-slides", b"- html-deck-runtime", 1))
        self.assertIn("- html-deck-runtime", rules.read_text())
        self.assertIn("Use frontend-slides in this sentence.", rules.read_text())
        self.assertIn("```md\n- frontend-slides\n```", rules.read_text())
        self.assertIn("    - frontend-slides", rules.read_text())
        self.assertIn("<!--\n- frontend-slides\n-->", rules.read_text())
        self.assertIn("\nfrontend-slides\n", rules.read_text())
        self.assertTrue(rules.with_name(rules.name + ".xiabuhua-backup").exists())

    def test_generic_target_and_auto_ambiguity(self):
        self.assertIn("Installed", self.install(self.root / "custom" / "skills"))
        old_home = installer._home
        installer._home = lambda: self.root / "home-without-evidence"
        try:
            with self.assertRaises(installer.InstallError):
                installer.resolve_target("auto", None)
        finally:
            installer._home = old_home


if __name__ == "__main__":
    unittest.main()
