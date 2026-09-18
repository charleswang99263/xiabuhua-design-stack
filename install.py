#!/usr/bin/env python3
"""Portable, dependency-free installer for the Xiabuhua design skill stack.

The installer deliberately has a small blast radius: only the six release skill
directories are managed in a host target.  Existing directories must identify
themselves through matching SKILL.md frontmatter before they are replaced.
"""
from __future__ import annotations

import argparse
import contextlib
import hashlib
import json
import os
import re
import shutil
import signal
import sys
import tempfile
import time
import uuid
from pathlib import Path
from typing import Iterable, Iterator


VERSION = "5.2.0"
# Installation manifests are persisted in user skill directories and must remain
# readable for an explicit rollback after a release upgrade. Keep this list
# bounded: accepting arbitrary older/newer versions would weaken the ownership
# and integrity checks around managed trees.
SUPPORTED_INSTALLATION_VERSIONS = frozenset(("5.1.0", VERSION))
RELEASE_SKILLS = (
    "brand-style-reference",
    "fireworks-tech-graph",
    "html-deck-runtime",
    "html-ppt-component-museum",
    "ui-interaction-reference",
    "xiabuhua-product-design",
)
ALLOWLIST = frozenset((*RELEASE_SKILLS, "frontend-slides"))
LEGACY_SKILLS = ("frontend-slides",)
PACKAGE_MANIFEST_NAME = "manifest.json"
MANIFEST_NAME = ".xiabuhua-design-stack-manifest.json"
STATE_NAME = ".xiabuhua-design-stack-state.json"
LOCK_SUFFIX = ".xiabuhua-design-stack.lock"
_FRONTMATTER = re.compile(r"\A---\s*\n(?P<body>.*?)(?:\n---\s*\n|\n\.\.\.\s*\n)", re.S)
_NAME = re.compile(r"(?m)^name:\s*[\"']?([^\"'\n#]+?)[\"']?\s*(?:#.*)?$")
_VERSION = re.compile(r"(?m)^\s*version:\s*[\"']?([^\"'\n#]+?)[\"']?\s*(?:#.*)?$")


class InstallError(RuntimeError):
    pass


def state_path_for(target: Path) -> Path:
    """Keep journals separate when several custom targets share a parent."""
    return target.parent / f".{target.name}{STATE_NAME}"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def _reject_symlink(path: Path, label: str) -> None:
    if path.is_symlink():
        raise InstallError(f"Refusing symlink {label}: {path}")


def _walk_files(root: Path) -> Iterator[Path]:
    """Walk a tree without following symlinks and reject special files."""
    _reject_symlink(root, "root")
    if not root.is_dir():
        raise InstallError(f"Expected directory: {root}")
    for current, dirs, files in os.walk(root, followlinks=False):
        current_path = Path(current)
        for name in dirs:
            p = current_path / name
            if p.is_symlink():
                raise InstallError(f"Symlinks are not supported in package: {p}")
        for name in files:
            p = current_path / name
            if p.is_symlink() or not p.is_file():
                raise InstallError(f"Unsupported package entry: {p}")
            yield p


def frontmatter_name(skill_dir: Path) -> str | None:
    path = skill_dir / "SKILL.md"
    if not path.is_file() or path.is_symlink():
        return None
    text = path.read_text(encoding="utf-8")
    match = _FRONTMATTER.match(text)
    if not match:
        return None
    found = _NAME.search(match.group("body"))
    return found.group(1).strip() if found else None


def validate_package(skills_root: Path, release_manifest: Path | None = None) -> dict[str, str]:
    """Validate the source package and return its exact file manifest."""
    _reject_symlink(skills_root, "package skills root")
    if not skills_root.is_dir():
        raise InstallError(f"Package has no skills directory: {skills_root}")
    children = list(skills_root.iterdir())
    entries = {p.name for p in children if p.is_dir()}
    unexpected_entries = sorted(p.name for p in children if p.name not in set(RELEASE_SKILLS))
    if unexpected_entries:
        raise InstallError("Package contains non-release entries: " + ", ".join(unexpected_entries))
    unexpected = sorted(entries - set(RELEASE_SKILLS))
    missing = sorted(set(RELEASE_SKILLS) - entries)
    if unexpected:
        raise InstallError("Package contains non-release skill directories: " + ", ".join(unexpected))
    if missing:
        raise InstallError("Package is incomplete; missing: " + ", ".join(missing))
    files: dict[str, str] = {}
    for name in RELEASE_SKILLS:
        directory = skills_root / name
        if frontmatter_name(directory) != name:
            raise InstallError(f"SKILL.md frontmatter name does not match package directory: {name}")
        version = _VERSION.search(_FRONTMATTER.match((directory / "SKILL.md").read_text(encoding="utf-8")).group("body"))
        if version and version.group(1).strip() != VERSION:
            raise InstallError(f"Unsupported {name} version {version.group(1).strip()!r}; expected {VERSION}")
        for file in _walk_files(directory):
            rel = file.relative_to(skills_root).as_posix()
            files[rel] = sha256(file)
    files = dict(sorted(files.items()))
    if release_manifest is not None:
        if not release_manifest.is_file() or release_manifest.is_symlink():
            raise InstallError(f"Package release manifest is missing: {release_manifest}")
        try:
            declared = json.loads(release_manifest.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise InstallError(f"Corrupt package release manifest: {release_manifest}") from exc
        if not isinstance(declared, dict) or declared.get("version") != VERSION or declared.get("skills") != list(RELEASE_SKILLS):
            raise InstallError("Package release manifest has an invalid version or skill allowlist")
        declared_files = declared.get("files")
        if not isinstance(declared_files, dict) or declared_files != files:
            raise InstallError("Package release manifest does not match the shipped skill files")
    return files


def target_tree_manifest(target: Path) -> dict[str, str]:
    skills = target / "__skills_placeholder__"
    # Callers pass a target root.  The package manifest is relative to target/skill.
    del skills
    result: dict[str, str] = {}
    for name in RELEASE_SKILLS:
        directory = target / name
        if not directory.is_dir() or directory.is_symlink():
            return {}
        for file in _walk_files(directory):
            result[file.relative_to(target).as_posix()] = sha256(file)
    return dict(sorted(result.items()))


def package_to_target_manifest(package_files: dict[str, str]) -> dict[str, str]:
    return dict(sorted(package_files.items()))


def tree_digest(files: dict[str, str]) -> str:
    h = hashlib.sha256()
    for path, digest in sorted(files.items()):
        h.update(path.encode())
        h.update(b"\0")
        h.update(digest.encode())
        h.update(b"\n")
    return h.hexdigest()


def atomic_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(value, f, indent=2, ensure_ascii=False, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(name, path)
    finally:
        with contextlib.suppress(FileNotFoundError):
            os.unlink(name)


def copy_tree_atomic(source: Path, destination: Path) -> None:
    if destination.exists() or destination.is_symlink():
        raise InstallError(f"Destination unexpectedly exists: {destination}")
    temp = destination.parent / f".{destination.name}.stage-{os.getpid()}-{time.time_ns()}"
    try:
        shutil.copytree(source, temp, symlinks=False)
        os.replace(temp, destination)
    except Exception:
        shutil.rmtree(temp, ignore_errors=True)
        raise


def _home() -> Path:
    return Path(os.path.expanduser("~")).resolve()


def default_target(host: str) -> Path:
    home = _home()
    if host == "codex":
        return home / ".agents" / "skills"
    if host == "claude":
        return home / ".claude" / "skills"
    if host == "cursor":
        return home / ".cursor" / "skills"
    raise InstallError("generic host requires an explicit --target")


def detect_host() -> str:
    """Detect only explicit current-host evidence; ambiguity is an error."""
    env_evidence = []
    for key, host in (("CODEX_HOME", "codex"), ("CLAUDE_HOME", "claude"), ("CURSOR_HOME", "cursor")):
        if os.environ.get(key):
            env_evidence.append(host)
    if len(set(env_evidence)) == 1:
        return env_evidence[0]
    if len(set(env_evidence)) > 1:
        raise InstallError("Multiple host signals found; pass --host and --target explicitly")
    candidates = []
    for host in ("codex", "claude", "cursor"):
        if default_target(host).exists():
            candidates.append(host)
    if len(candidates) == 1:
        return candidates[0]
    raise InstallError("Cannot safely detect the current host; pass --host codex|claude|cursor|generic and, for generic, --target")


def resolve_target(host: str, target: str | None) -> tuple[str, Path]:
    actual_host = detect_host() if host == "auto" else host
    if actual_host not in {"codex", "claude", "cursor", "generic"}:
        raise InstallError(f"Unsupported host: {actual_host}")
    if actual_host == "generic" and not target:
        raise InstallError("generic host requires an explicit --target")
    location = Path(target).expanduser() if target else default_target(actual_host)
    location = location.resolve()
    home = _home()
    if location in {Path("/"), home} or location == Path(__file__).resolve().parent:
        raise InstallError(f"Protected target path: {location}")
    if location.exists() and location.is_symlink():
        raise InstallError(f"Refusing symlink target: {location}")
    return actual_host, location


@contextlib.contextmanager
def install_lock(target: Path):
    parent = target.parent
    parent.mkdir(parents=True, exist_ok=True)
    lock = parent / f".{target.name}{LOCK_SUFFIX}"
    try:
        lock.mkdir()
    except FileExistsError as exc:
        raise InstallError(f"Another installation is in progress: {lock}") from exc
    atomic_json(lock / "owner.json", {"pid": os.getpid(), "started": time.time(), "target": str(target)})
    try:
        yield lock
    finally:
        shutil.rmtree(lock, ignore_errors=True)


def _owned_or_absent(directory: Path, name: str) -> None:
    if not directory.exists() and not directory.is_symlink():
        return
    if directory.is_symlink():
        raise InstallError(f"Refusing symlink skill directory: {directory}")
    found = frontmatter_name(directory)
    if found != name:
        raise InstallError(f"Existing path is not an owned {name} skill; refusing to modify: {directory}")


def _safe_remove_installed(directory: Path, name: str, expected: dict[str, str]) -> None:
    if not directory.exists():
        return
    _owned_or_absent(directory, name)
    actual = {p.relative_to(directory).as_posix(): sha256(p) for p in _walk_files(directory)}
    expected_local = {k.split("/", 1)[1]: v for k, v in expected.items() if k.startswith(name + "/")}
    if actual != expected_local:
        raise InstallError(f"Installed {name} was modified after staging; rollback is guarded")
    shutil.rmtree(directory)


def _normalize_extra_roots(extra_old_roots: Iterable[Path], target: Path, package_root: Path) -> list[Path]:
    normalized: list[Path] = []
    seen: set[Path] = set()
    for old_root in extra_old_roots:
        candidate = old_root.expanduser()
        if candidate.is_symlink():
            raise InstallError(f"Refusing symlink --extra-old-root: {candidate}")
        if not candidate.exists() or not candidate.is_dir():
            raise InstallError(f"Explicit --extra-old-root is not a directory: {candidate}")
        resolved = candidate.resolve()
        if resolved in seen:
            raise InstallError(f"Duplicate --extra-old-root: {resolved}")
        seen.add(resolved)
        # Recovery can safely validate a sibling archive location.  Allowing
        # arbitrary journal destinations would make a corrupted journal a
        # deletion/move primitive outside the selected installation.
        if resolved.parent != target.parent:
            raise InstallError(f"--extra-old-root must be a sibling of the target: {resolved}")
        if resolved in {target, package_root, Path("/"), _home()}:
            raise InstallError(f"Protected --extra-old-root: {resolved}")
        normalized.append(resolved)
    if len({p.name for p in normalized}) != len(normalized):
        raise InstallError("--extra-old-root paths must have unique directory names")
    return normalized


def _under(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def validate_journal(journal: object, state_path: Path, current_target: Path) -> dict[str, object]:
    """Fail closed before recovery can touch any path from disk JSON."""
    if not isinstance(journal, dict):
        raise InstallError("Installation journal must be a JSON object")
    required = {"state", "target", "backup", "stage", "moved", "created", "rules", "had_manifest"}
    if not required.issubset(journal) or journal.get("state") not in {"installing", "installed"}:
        raise InstallError("Installation journal is missing required recovery fields")
    if journal.get("target") != str(current_target):
        raise InstallError("Installation journal target does not match the selected target")
    if not isinstance(journal.get("had_manifest"), bool):
        raise InstallError("Installation journal had_manifest is invalid")
    if not isinstance(journal.get("moved"), list) or not all(isinstance(x, str) for x in journal["moved"]):
        raise InstallError("Installation journal moved field is invalid")
    if not isinstance(journal.get("created"), list) or not all(isinstance(x, str) for x in journal["created"]):
        raise InstallError("Installation journal created field is invalid")
    if not isinstance(journal.get("rules"), list) or not all(isinstance(x, str) for x in journal["rules"]):
        raise InstallError("Installation journal rules field is invalid")
    if set(journal["created"]) - set(RELEASE_SKILLS):
        raise InstallError("Installation journal contains an unmanaged created path")
    if set(journal["moved"]) - (set(RELEASE_SKILLS) | set(LEGACY_SKILLS) | {MANIFEST_NAME}):
        raise InstallError("Installation journal contains an unmanaged moved path")
    if len(set(journal["created"])) != len(journal["created"]) or len(set(journal["moved"])) != len(journal["moved"]):
        raise InstallError("Installation journal contains duplicate paths")
    backup = Path(journal["backup"]) if isinstance(journal.get("backup"), str) else None
    stage = Path(journal["stage"]) if isinstance(journal.get("stage"), str) else None
    if backup is None or backup.parent != current_target.parent or not backup.name.startswith(f".{current_target.name}.xiabuhua-backup-"):
        raise InstallError("Installation journal backup is outside the target transaction boundary")
    if stage is None or stage.parent != current_target.parent or not stage.name.startswith(f".{current_target.name}.xiabuhua-stage-"):
        raise InstallError("Installation journal stage is outside the target transaction boundary")
    if backup == current_target or stage == current_target or backup.is_symlink() or stage.is_symlink():
        raise InstallError("Installation journal contains a symlink or target collision")
    for name in journal["moved"]:
        if name != MANIFEST_NAME and name not in ALLOWLIST:
            raise InstallError("Installation journal contains an unmanaged moved skill")
        if name != MANIFEST_NAME and not (backup / name).exists():
            raise InstallError(f"Installation journal backup is missing: {name}")
    for name in journal["created"]:
        if (current_target / name).is_symlink():
            raise InstallError("Installation journal target contains a symlink")
    if "manifest" in journal and not isinstance(journal["manifest"], dict):
        raise InstallError("Installation journal manifest is invalid")
    if "legacy" in journal:
        if not isinstance(journal["legacy"], list):
            raise InstallError("Installation journal legacy field is invalid")
        for item in journal["legacy"]:
            if not isinstance(item, dict) or set(item) != {"from", "backup"}:
                raise InstallError("Installation journal legacy entry is invalid")
            origin, archived = Path(item["from"]), Path(item["backup"])
            if origin.parent != current_target.parent or archived.parent != backup / "legacy-roots" or archived.is_symlink():
                raise InstallError("Installation journal legacy path is outside its bounded archive")
    if "duplicates" in journal:
        if not isinstance(journal["duplicates"], list):
            raise InstallError("Installation journal duplicates field is invalid")
        duplicate_root = _home() / ".codex" / "skills"
        for item in journal["duplicates"]:
            if not isinstance(item, dict) or set(item) != {"from", "backup"}:
                raise InstallError("Installation journal duplicate entry is invalid")
            origin, archived = Path(item["from"]), Path(item["backup"])
            if origin.parent != duplicate_root or origin.name not in ALLOWLIST or archived.parent != backup / "codex-duplicate" or archived.is_symlink():
                raise InstallError("Installation journal duplicate path is outside its bounded archive")
    rules_root = journal.get("rules_root")
    if journal["rules"]:
        if not isinstance(rules_root, str):
            raise InstallError("Installation journal rules root is missing")
        root = Path(rules_root)
        for item in journal["rules"]:
            path = Path(item)
            if path.is_symlink() or not _under(path, root):
                raise InstallError("Installation journal rules path is outside its explicit root")
    return journal


def find_potential_rules(path: Path) -> list[str]:
    paths = [path] if path.is_file() else [p for p in path.rglob("*.md") if p.is_file() and not p.is_symlink()]
    hits = []
    for file in paths:
        for lineno, line in enumerate(file.read_text(encoding="utf-8").splitlines(), 1):
            if re.search(r"(?<![\w-])frontend-slides(?![\w-])", line):
                hits.append(f"{file}:{lineno}: {line.strip()}")
    return hits


def rewrite_exact_rules(path: Path) -> list[Path]:
    """Rewrite only a standalone list/reference line, preserving a .bak."""
    paths = [path] if path.is_file() else [p for p in path.rglob("*.md") if p.is_file() and not p.is_symlink()]
    changed: list[Path] = []
    pending: list[tuple[Path, str]] = []
    for file in paths:
        original = file.read_bytes().decode("utf-8")
        updated, did_change = _rewrite_rule_text(original)
        if did_change:
            backup = file.with_name(file.name + ".xiabuhua-backup")
            if backup.exists():
                raise InstallError(f"Rules backup already exists: {backup}")
            pending.append((file, "".join(updated)))
    # All backup collisions are checked before the first user file is edited.
    for file, updated in pending:
        backup = file.with_name(file.name + ".xiabuhua-backup")
        shutil.copy2(file, backup)
        with file.open("w", encoding="utf-8", newline="") as handle:
            handle.write(updated)
        changed.append(file)
    return changed


def _rewrite_rule_text(original: str) -> tuple[str, bool]:
    """Rewrite list references outside fenced/indented code and HTML comments."""
    exact = re.compile(r"^(\s*[-*+]\s+)(?:`)?frontend-slides(?:`)?(\s*(?:skill)?\s*)$")
    fence_re = re.compile(r"^\s*(`{3,}|~{3,})")
    lines = original.splitlines(keepends=True)
    updated: list[str] = []
    fence: tuple[str, int] | None = None
    in_comment = False
    did_change = False
    for line in lines:
        ending = "\n" if line.endswith("\n") else ""
        body = line[:-1] if ending else line
        if body.endswith("\r"):
            body_without_cr = body[:-1]
        else:
            body_without_cr = body
        marker = fence_re.match(body_without_cr)
        if fence:
            updated.append(line)
            if marker and marker.group(1)[0] == fence[0] and len(marker.group(1)) >= fence[1]:
                fence = None
            continue
        if marker and not (body_without_cr.startswith("    ") or body_without_cr.startswith("\t")):
            fence = (marker.group(1)[0], len(marker.group(1)))
            updated.append(line)
            continue
        if in_comment:
            updated.append(line)
            if "-->" in body_without_cr:
                in_comment = False
            continue
        comment_start = body_without_cr.find("<!--")
        if comment_start >= 0:
            if "-->" not in body_without_cr[comment_start + 4:]:
                in_comment = True
            updated.append(line)
            continue
        if body_without_cr.startswith("    ") or body_without_cr.startswith("\t"):
            updated.append(line)
            continue
        match = exact.match(body_without_cr)
        if match:
            newline_cr = "\r" if body.endswith("\r") else ""
            updated.append(f"{match.group(1)}html-deck-runtime{match.group(2)}{newline_cr}{ending}")
            did_change = True
        else:
            updated.append(line)
    return "".join(updated), did_change


def preflight_rules(path: Path) -> None:
    """Check every candidate backup before any rule or target mutation."""
    paths = [path] if path.is_file() else [p for p in path.rglob("*.md") if p.is_file() and not p.is_symlink()]
    for file in paths:
        _, changed = _rewrite_rule_text(file.read_text(encoding="utf-8"))
        if changed and file.with_name(file.name + ".xiabuhua-backup").exists():
            raise InstallError(f"Rules backup already exists: {file.with_name(file.name + '.xiabuhua-backup')}")


def build_manifest(package_files: dict[str, str]) -> dict[str, object]:
    return {"version": VERSION, "skills": list(RELEASE_SKILLS), "files": package_to_target_manifest(package_files)}


def load_manifest(target: Path) -> dict[str, object]:
    path = target / MANIFEST_NAME
    if not path.is_file() or path.is_symlink():
        raise InstallError(f"Installation manifest is missing: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise InstallError(f"Corrupt installation manifest: {path}") from exc
    if (not isinstance(data, dict)
            or not isinstance(data.get("version"), str)
            or data.get("version") not in SUPPORTED_INSTALLATION_VERSIONS
            or data.get("skills") != list(RELEASE_SKILLS)
            or not isinstance(data.get("files"), dict)):
        raise InstallError(f"Unsupported or corrupt installation manifest: {path}")
    return data


def install(package_root: Path, target: Path, extra_old_roots: Iterable[Path] = (), rules: Path | None = None,
            rewrite_rules: bool = False) -> str:
    if package_root.is_symlink() or target.is_symlink():
        raise InstallError("Release package and target roots must not be symlinks")
    package_root = package_root.resolve()
    target = target.resolve()
    if _under(target, package_root):
        raise InstallError("Target must not be inside the release package")
    package_manifest = package_root / PACKAGE_MANIFEST_NAME
    package_files = validate_package(package_root / "skills", package_manifest)
    manifest = build_manifest(package_files)
    target.parent.mkdir(parents=True, exist_ok=True)
    extra_roots = _normalize_extra_roots(extra_old_roots, target, package_root)
    if rules:
        rules = Path(rules).expanduser()
        if rules.is_symlink() or not rules.exists():
            raise InstallError(f"Explicit --rules path is missing or symlinked: {rules}")
    backup = target.parent / f".{target.name}.xiabuhua-backup-{uuid.uuid4().hex}"
    state_path = state_path_for(target)
    if state_path.is_symlink():
        raise InstallError(f"Refusing symlink installation journal: {state_path}")
    if target.exists() and target.is_symlink():
        raise InstallError(f"Refusing symlink target: {target}")
    existing_manifest = target / MANIFEST_NAME
    legacy_target = target / "frontend-slides"
    # Ownership and symlink checks happen before staging or moving any other
    # root, so a collision cannot leave a duplicate or old-root partially
    # migrated.
    for name in (*RELEASE_SKILLS, *LEGACY_SKILLS):
        _owned_or_absent(target / name, name)
    if target.resolve() == (_home() / ".agents" / "skills").resolve():
        duplicate = _home() / ".codex" / "skills"
        if duplicate.exists():
            _reject_symlink(duplicate, "Codex duplicate root")
            for name in ALLOWLIST:
                _owned_or_absent(duplicate / name, name)
    if rules:
        preflight_rules(rules)
    if target.is_dir() and existing_manifest.is_file():
        try:
            current = load_manifest(target)
            if current == manifest and target_tree_manifest(target) == package_files:
                if rules:
                    hits = find_potential_rules(rules)
                    if hits and rewrite_rules:
                        changed = rewrite_exact_rules(rules)
                        return f"Already installed; full skill-tree hashes match. Rewrote {len(changed)} exact rules file(s)."
                    if hits:
                        print("Potential legacy frontend-slides references (report only):")
                        print("\n".join(hits))
                if not legacy_target.exists() and not extra_roots:
                    return "Already installed; full skill-tree hashes match."
        except InstallError as exc:
            if existing_manifest.exists():
                raise InstallError(f"Existing installation manifest is invalid; refusing to overwrite: {existing_manifest}") from exc
    if state_path.is_file():
        try:
            previous_journal = json.loads(state_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise InstallError(f"Installation journal is corrupt: {state_path}") from exc
        if not isinstance(previous_journal, dict):
            raise InstallError("Installation journal is not a JSON object")
        if previous_journal.get("state") == "installing":
            # A previous process was interrupted after acquiring the lock.
            # Restore its moved roots before starting a fresh transaction.
            previous_journal = validate_journal(previous_journal, state_path, target)
            rollback_journal(previous_journal, state_path, guard=False)
        elif previous_journal.get("state") == "installed":
            # A completed transaction's journal is replaced by the new
            # transaction below; its backup remains available only through
            # the explicit rollback command before this install starts.
            pass
        else:
            raise InstallError("Installation journal is not a recoverable installing transaction")
    stage = Path(tempfile.mkdtemp(prefix=f".{target.name}.xiabuhua-stage-", dir=str(target.parent)))
    journal = {"state": "installing", "target": str(target), "backup": str(backup), "stage": str(stage), "moved": [], "created": [], "rules": [], "had_manifest": existing_manifest.exists()}
    if rules:
        journal["rules_root"] = str(rules.resolve() if rules.is_dir() else rules.parent.resolve())
    atomic_json(state_path, journal)
    previous: dict[str, Path] = {}
    old_handlers = {}
    for sig in (signal.SIGINT, signal.SIGTERM):
        old_handlers[sig] = signal.getsignal(sig)
        signal.signal(sig, lambda signum, frame: (_ for _ in ()).throw(KeyboardInterrupt(f"interrupted by signal {signum}")))
    try:
        staged_skills = stage / "skills"
        shutil.copytree(package_root / "skills", staged_skills)
        if {p.name for p in staged_skills.iterdir() if p.is_dir()} != set(RELEASE_SKILLS):
            raise InstallError("Staged package changed during copy")
        if validate_package(staged_skills) != package_files:
            raise InstallError("Package changed while it was being staged")
        if target.exists():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.mkdir(parents=True)
        backup.mkdir(parents=True)
        # Codex historically used ~/.codex/skills.  It is a known duplicate
        # root, so clean only owned allowlisted copies and leave all other
        # skills and plugin caches alone.
        if target.resolve() == (_home() / ".agents" / "skills").resolve():
            duplicate = _home() / ".codex" / "skills"
            if duplicate.exists():
                _reject_symlink(duplicate, "Codex duplicate root")
                duplicate_backup = backup / "codex-duplicate"
                for name in ALLOWLIST:
                    source = duplicate / name
                    if not source.exists() and not source.is_symlink():
                        continue
                    _owned_or_absent(source, name)
                    duplicate_backup.mkdir(parents=True, exist_ok=True)
                    destination = duplicate_backup / name
                    shutil.move(str(source), str(destination))
                    journal.setdefault("duplicates", []).append({"from": str(source), "backup": str(destination)})
                    atomic_json(state_path, journal)
        # Retire the known legacy skill in the selected root as part of the
        # same transaction.  No wildcard xiabuhua cleanup is performed.
        if legacy_target.exists() or legacy_target.is_symlink():
            _owned_or_absent(legacy_target, "frontend-slides")
            old = backup / "frontend-slides"
            shutil.move(str(legacy_target), str(old))
            journal["moved"].append("frontend-slides")
            atomic_json(state_path, journal)
        for name in RELEASE_SKILLS:
            destination = target / name
            _owned_or_absent(destination, name)
            if destination.exists():
                old = backup / name
                shutil.move(str(destination), str(old))
                previous[name] = old
                journal["moved"].append(name)
                atomic_json(state_path, journal)
            copy_tree_atomic(staged_skills / name, destination)
            journal["created"].append(name)
            atomic_json(state_path, journal)
        # A manifest is part of managed state; retain a prior one for rollback.
        if existing_manifest.exists():
            shutil.copy2(existing_manifest, backup / MANIFEST_NAME)
            journal["moved"].append(MANIFEST_NAME)
        atomic_json(existing_manifest, manifest)
        if rules:
            hits = find_potential_rules(rules)
            if hits and rewrite_rules:
                journal["rules"] = [str(p) for p in rewrite_exact_rules(rules)]
                atomic_json(state_path, journal)
            elif hits:
                print("Potential legacy frontend-slides references (report only):")
                print("\n".join(hits))
        if extra_roots:
            legacy_dir = backup / "legacy-roots"
            legacy_dir.mkdir()
            for old_root in extra_roots:
                destination = legacy_dir / old_root.name
                shutil.move(str(old_root), str(destination))
                journal.setdefault("legacy", []).append({"from": str(old_root), "backup": str(destination)})
                atomic_json(state_path, journal)
        journal["state"] = "installed"
        journal["manifest"] = manifest
        atomic_json(state_path, journal)
        return f"Installed {len(RELEASE_SKILLS)} skills to {target} (version {VERSION})."
    except BaseException as exc:
        try:
            rollback_journal(journal, state_path, guard=False)
        except Exception as rollback_exc:
            raise InstallError(f"Installation failed and rollback was incomplete: {rollback_exc}") from exc
        raise
    finally:
        for sig, handler in old_handlers.items():
            with contextlib.suppress(Exception):
                signal.signal(sig, handler)
        shutil.rmtree(stage, ignore_errors=True)


def rollback_journal(journal: dict[str, object], state_path: Path, guard: bool = True) -> None:
    journal = validate_journal(journal, state_path, Path(str(journal.get("target"))).resolve()) if guard else journal
    target = Path(str(journal["target"]))
    backup = Path(str(journal["backup"]))
    manifest = journal.get("manifest")
    expected = manifest.get("files", {}) if isinstance(manifest, dict) else {}
    created = list(journal.get("created", []))
    for name in created:
        directory = target / str(name)
        if directory.exists():
            if guard:
                _safe_remove_installed(directory, str(name), expected)
            else:
                shutil.rmtree(directory)
    if guard and isinstance(manifest, dict):
        current_manifest = target / MANIFEST_NAME
        if not current_manifest.is_file():
            raise InstallError("Installation manifest was removed after installation; rollback blocked")
        try:
            if json.loads(current_manifest.read_text(encoding="utf-8")) != manifest:
                raise InstallError("Installation manifest was modified after installation; rollback blocked")
        except json.JSONDecodeError as exc:
            raise InstallError("Installation manifest was modified after installation; rollback blocked") from exc
    for name in journal.get("moved", []):
        name = str(name)
        if name == MANIFEST_NAME:
            continue
        source = backup / name
        destination = target / name
        if source.exists() and not destination.exists():
            shutil.move(str(source), str(destination))
    managed_manifest = target / MANIFEST_NAME
    if managed_manifest.exists() and not journal.get("had_manifest", False):
        managed_manifest.unlink()
    elif journal.get("had_manifest", False) and (guard or MANIFEST_NAME in journal.get("moved", [])):
        previous_manifest = backup / MANIFEST_NAME
        if not previous_manifest.is_file() or previous_manifest.is_symlink():
            raise InstallError("Rollback manifest backup is missing")
        os.replace(previous_manifest, managed_manifest)
    for item in journal.get("legacy", []):
        source = Path(item["backup"])
        destination = Path(item["from"])
        if source.exists() and not destination.exists():
            shutil.move(str(source), str(destination))
    for item in journal.get("duplicates", []):
        source = Path(item["backup"])
        destination = Path(item["from"])
        if source.exists() and not destination.exists():
            shutil.move(str(source), str(destination))
    for file in journal.get("rules", []):
        edited = Path(file)
        bak = edited.with_name(edited.name + ".xiabuhua-backup")
        if bak.exists() and edited.exists():
            shutil.copy2(bak, edited)
            bak.unlink()
    shutil.rmtree(backup, ignore_errors=True)
    stage = Path(str(journal["stage"]))
    if stage.exists() and _under(stage, target.parent):
        shutil.rmtree(stage, ignore_errors=True)
    state_path.unlink(missing_ok=True)


def verify(target: Path) -> str:
    manifest = load_manifest(target)
    expected = dict(manifest["files"])
    actual = target_tree_manifest(target)
    if actual != expected:
        missing = sorted(set(expected) - set(actual))
        changed = sorted(k for k in set(expected) & set(actual) if expected[k] != actual[k])
        extra = sorted(set(actual) - set(expected))
        raise InstallError(f"Installed skill tree hash mismatch (missing={missing}, changed={changed}, extra={extra})")
    return f"Verified {len(expected)} files and full skill-tree hash {tree_digest(actual)}."


def rollback(target: Path) -> str:
    if target.is_symlink():
        raise InstallError(f"Refusing symlink rollback target: {target}")
    target = target.resolve()
    state_path = state_path_for(target)
    if state_path.is_symlink():
        raise InstallError(f"Refusing symlink installation journal: {state_path}")
    if not state_path.is_file():
        raise InstallError(f"No rollback journal for {target}")
    try:
        journal = json.loads(state_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise InstallError("Rollback journal is corrupt") from exc
    validate_journal(journal, state_path, target)
    rollback_journal(journal, state_path, guard=True)
    return f"Rolled back installation for {target}."


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install the Xiabuhua design skill stack without external dependencies.")
    parser.add_argument("action", nargs="?", choices=("install", "verify", "rollback"), default="install")
    parser.add_argument("--host", choices=("auto", "codex", "claude", "cursor", "generic"), default="auto")
    parser.add_argument("--target", help="Skill directory; required for generic hosts")
    parser.add_argument("--extra-old-root", action="append", default=[], help="Explicit old suite directory to move to the rollback backup")
    parser.add_argument("--rules", type=Path, help="Explicit markdown file/directory to scan for legacy references")
    parser.add_argument("--rewrite-rules", "--migrate-frontend-slides", "--allow-frontend-slides-migration",
                        dest="rewrite_rules", action="store_true",
                        help="Rewrite only exact standalone frontend-slides list lines; requires --rules")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        if args.rewrite_rules and not args.rules:
            raise InstallError("--rewrite-rules requires an explicit --rules path")
        host, target = resolve_target(args.host, args.target)
        del host
        with install_lock(target):
            if args.action == "verify":
                print(verify(target))
            elif args.action == "rollback":
                print(rollback(target))
            else:
                source = Path(__file__).resolve().parent
                print(install(source, target, [Path(p) for p in args.extra_old_root], args.rules, args.rewrite_rules))
        return 0
    except (InstallError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
