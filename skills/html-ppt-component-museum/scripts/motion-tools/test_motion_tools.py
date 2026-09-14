#!/usr/bin/env python3
"""Check all six tools fail honestly when optional runtime dependencies are absent."""
import subprocess, sys
from pathlib import Path

ROOT=Path(__file__).parent
cases=[
  ("measure_churn.py",["/tmp/motion-lab.html"]),
  ("measure_structure.py",["http://127.0.0.1:9"]),
  ("measure_frames.py",["sheet","/tmp/motion-no.mp4"]),
  ("record_showcases.py",["/tmp/motion-cases"]),
  ("subset_fonts.py",["list"]),
  ("verify_case.py",["/tmp/motion-lab.html"]),
]
seen=[]
for tool,args in cases:
    p=subprocess.run([sys.executable,str(ROOT/tool),*args],capture_output=True,text=True)
    text=p.stderr+p.stdout
    assert p.returncode!=0,(tool,p.returncode)
    assert "DEPENDENCY_ERROR" in text or "INPUT_ERROR" in text,(tool,text)
    seen.append(tool)
print("motion-tools dependency/error contract: %d/6 explicit failures PASS"%len(seen))
