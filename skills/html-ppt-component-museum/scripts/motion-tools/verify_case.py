#!/usr/bin/env python3
"""Run real Chromium floor checks and optional case-specific probes."""
import argparse
from pathlib import Path
from _runtime import need_playwright, die, write_json
WIDTHS=(320,375,414,768,1440)
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument("target");ap.add_argument("--layer",choices=("dom","svg","canvas2d","webgl"));ap.add_argument("--flag",action="append",default=[]);ap.add_argument("--out");a=ap.parse_args();sync=need_playwright()
    target=a.target if a.target.startswith(("http://","https://","file://")) else Path(a.target).resolve().as_uri()
    result={"tool":"verify_case","target":a.target,"viewports":WIDTHS,"checks":{},"flags":a.flag}
    try:
        with sync() as p:
            b=p.chromium.launch(headless=True);pg=b.new_page(viewport={"width":1440,"height":900});errors=[];pg.on("pageerror",lambda e:errors.append(str(e)));pg.goto(target,wait_until="load",timeout=45000);pg.wait_for_timeout(500)
            result["checks"]["errors"]=errors
            overflow={}
            for w in WIDTHS:pg.set_viewport_size({"width":w,"height":860});pg.wait_for_timeout(80);overflow[w]=pg.evaluate("()=>document.documentElement.scrollWidth-innerWidth")
            result["checks"]["horizontal_overflow"]=overflow
            pg.set_viewport_size({"width":1440,"height":900})
            result["checks"]["h1"]=pg.locator("h1").count()==1;result["checks"]["lang"]=bool(pg.evaluate("()=>document.documentElement.lang"))
            result["checks"]["real_wheel"]=False;result["checks"]["real_hover"]=False
            before=pg.evaluate("()=>({y:scrollY,html:document.body.innerText})");pg.mouse.wheel(0,300);pg.wait_for_timeout(150);after=pg.evaluate("()=>({y:scrollY,html:document.body.innerText})");result["checks"]["real_wheel"]=(before["y"]!=after["y"] or before["html"]!=after["html"])
            first=pg.locator("button,a,[role=button]").first
            if first.count():before=first.evaluate("(e)=>getComputedStyle(e).transform");first.hover();pg.wait_for_timeout(100);result["checks"]["real_hover"]=first.evaluate("(e)=>getComputedStyle(e).transform")!=before
            if a.layer:result["checks"]["declared_layer"]=pg.evaluate("(layer)=>({dom:document.querySelectorAll('body *').length>0,svg:document.querySelectorAll('svg').length>0,canvas2d:document.querySelectorAll('canvas').length>0,webgl:document.querySelectorAll('canvas').length>0}[layer])",a.layer)
            b.close()
    except Exception as exc:die("RUNTIME_ERROR verification failed: "+str(exc))
    result["verdict"]="PASS" if not result["checks"]["errors"] and not any(v>1 for v in result["checks"]["horizontal_overflow"].values()) and result["checks"]["h1"] and result["checks"]["lang"] else "FAIL"
    write_json(result,a.out)
    if result["verdict"]!="PASS":raise SystemExit(1)
if __name__=="__main__":main()
