# Xiabuhua Design Stack 5.2.0 installer

`install.py` is a standard-library Python 3 installer. A release package must
contain `manifest.json` at its root with the schema shown below; the installer
compares every declared file hash before touching a target. It copies the complete
contents of the six release skills and writes an installation hash manifest. It has no npm,
pip, network, GitHub, or dependency download step.

## Install

Use an explicit host in automation. Interactive use may use `auto`, but auto
detection succeeds only when exactly one current-host signal is present
(`CODEX_HOME`, `CLAUDE_HOME`, `CURSOR_HOME`, or exactly one existing default
skill directory).

```sh
python3 install.py install --host codex
python3 install.py install --host claude
python3 install.py install --host cursor
python3 install.py install --host generic --target /path/to/skills
```

The default targets are `~/.agents/skills`, `~/.claude/skills`, and
`~/.cursor/skills`. Codex uses `~/.agents/skills` as its canonical root. A
known `~/.codex/skills` duplicate is cleaned only for allowlisted, owned skill
directories; unrelated skills are left in place. Copies managed by Claude or
Cursor plugins are outside this installer and are reported as requiring host
plugin removal when encountered by the host, never deleted as caches here.

An existing skill directory is replaceable only when its `SKILL.md` frontmatter
contains the same `name` as its directory. This ownership check prevents an
active or unrelated directory from being overwritten. Every replacement is a
complete directory replacement, which removes stale package assets inside the
owned skill while preserving unknown sibling skills and files.

To move a known old suite out of discovery, pass each root explicitly:

```sh
python3 install.py install --host codex \
  --extra-old-root /path/to/old-xiabuhua-suite
```

The old root is moved beside the target into a timestamped rollback backup. No
other `xiabuhua-*` directory is found or removed by wildcard. For recoverable
bounded journaling, an explicit old root must be a sibling of the selected
target and each supplied root name must be unique.

## Rules references

The installer never scans or rewrites arbitrary rules. `--rules` is an explicit
markdown file or directory. Without `--rewrite-rules`, possible standalone
`frontend-slides` references are reported only:

```sh
python3 install.py install --host codex --rules /path/to/AGENTS.md
```

With the explicit opt-in, only a line consisting of a list marker and the
standalone skill name is changed to `html-deck-runtime`; the original file is
saved as `FILE.xiabuhua-backup`:

```sh
python3 install.py install --host codex --rules /path/to/rules \
  --rewrite-rules
```

Sentences, code samples, unrelated mentions, and files outside `--rules` are
not changed. A backup collision stops the operation.

## Verify and rollback

```sh
python3 install.py verify --host codex
python3 install.py rollback --host codex
```

The manifest schema is intentionally stable:

```json
{
  "version": "5.2.0",
  "skills": ["...six exact names..."],
  "files": {"skill-name/path": "sha256"}
}
```

`verify` checks every file hash and the full skill-tree mapping. A successful
repeat install is a no-op when those hashes match. The installer stages and
hash-checks the full package before touching the target, uses an exclusive lock
for concurrent runs, and records an interruption journal. A copy failure rolls
back the transaction. A user edit after installation blocks explicit rollback
instead of overwriting it.

Protected target paths and symlinked roots or skill directories are rejected.
The package must contain all six exact skill directories, matching frontmatter,
and no symlink or unsupported entry. The installer does not install
`frontend-slides`; that name is allowlisted for safe legacy cleanup in the
selected target and Codex duplicate root, with ownership checks, while
unrelated skill directories remain untouched.

## Upgrade from 5.1

The 5.2 installer accepts known 5.1.0 installation manifests as upgrade inputs and can verify a restored 5.1.0 installation after rollback. Package validation still requires the complete current 5.2.0 payload. Unknown versions are rejected; ownership, full-tree hashing and post-install edit protection remain enforced.

The repository uses `.gitattributes` to preserve exact file bytes on Windows and other platforms. Do not normalize line endings in a downloaded release before running its manifest check.
