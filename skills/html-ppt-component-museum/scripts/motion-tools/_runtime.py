"""Shared dependency and output helpers for local motion evidence tools."""
import json, shutil, sys
from pathlib import Path

def die(message, code=2):
    print("motion-tools: " + message, file=sys.stderr)
    raise SystemExit(code)

def need_playwright():
    try:
        from playwright.sync_api import sync_playwright
        return sync_playwright
    except Exception as exc:
        die("DEPENDENCY_ERROR playwright: install Python playwright and its Chromium browser (" + str(exc) + ")")

def need_binary(name):
    path=shutil.which(name)
    if not path: die("DEPENDENCY_ERROR " + name + ": executable is not on PATH")
    return path

def read_json(path):
    p=Path(path)
    if not p.exists(): die("INPUT_ERROR file not found: " + str(p))
    try: return json.loads(p.read_text())
    except Exception as exc: die("INPUT_ERROR invalid JSON: " + str(exc))

def write_json(value, out=None):
    text=json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    if out: Path(out).write_text(text)
    print(text, end="")
