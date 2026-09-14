#!/usr/bin/env python3
"""Subset licensed fonts with fontTools and emit real WOFF2 @font-face CSS."""
import argparse, base64, re, subprocess, sys, tempfile
from pathlib import Path
from _runtime import die
def main():
    ap=argparse.ArgumentParser(description=__doc__);sub=ap.add_subparsers(dest="op",required=True)
    sub.add_parser("list")
    p=sub.add_parser("pack");p.add_argument("--out",required=True);p.add_argument("--text-from");p.add_argument("--tmp");p.add_argument("faces",nargs="+")
    a=ap.parse_args()
    try:
        from fontTools.ttLib import TTFont
    except Exception as exc:die("DEPENDENCY_ERROR fontTools: install fonttools and brotli ("+str(exc)+")")
    roots=[Path.home()/".claude/skills/motion-web/assets/fonts",Path.home()/"Downloads"]
    files={f.stem:f for root in roots if root.exists() for f in root.rglob("*") if f.suffix.lower() in (".ttf",".otf") and "System" not in str(f)}
    if a.op=="list":
        print("\\n".join(f"{k}\\t{v}" for k,v in sorted(files.items())));return
    text="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:()[]{}<>/+-_=—"
    if a.text_from:
        text=re.sub(r"<(script|style)[\\s\\S]*?</\\1>"," ",Path(a.text_from).read_text(),flags=re.I);text=re.sub(r"<[^>]+>"," ",text)
    blocks=[]
    with tempfile.TemporaryDirectory(prefix="motion-font-") as td:
        for spec in a.faces:
            if "=" not in spec:die("INPUT_ERROR face must be CSSName=FileStem")
            css,stem=spec.split("=",1);src=files.get(stem)
            if not src:die("INPUT_ERROR licensed font stem not found: "+stem)
            # Refuse fonts whose license metadata is absent; caller must document provenance.
            font=TTFont(src); names=" ".join(str(x.toUnicode()) for x in font["name"].names if x.nameID in (0,13,14))
            if not any(x in names.lower() for x in ("open font","apache","ofl","sil")):die("LICENSE_ERROR font metadata does not identify OFL/Apache: "+stem)
            out=Path(a.tmp or td)/(css+".woff2");cmd=[sys.executable,"-m","fontTools.subset",str(src),"--text="+text,"--flavor=woff2","--output-file="+str(out)]
            run=subprocess.run(cmd,capture_output=True,text=True)
            if run.returncode:die("RUNTIME_ERROR subset failed: "+run.stderr[-500:])
            b64=base64.b64encode(out.read_bytes()).decode();blocks.append('@font-face{font-family:"%s";src:url(data:font/woff2;base64,%s) format("woff2");font-display:swap}'%(css,b64))
    Path(a.out).write_text("\\n".join(blocks));print("fontTools: %d face(s) -> %s"%(len(blocks),a.out))
if __name__=="__main__":main()
