#!/usr/bin/env python3
"""Measure real wheel churn, mid-flight state, idle liveness and scroll hijack."""
import argparse, json
from pathlib import Path
from _runtime import need_playwright, die, write_json

SAMPLE="""() => [...document.querySelectorAll('body *')].map(e => {
 const s=getComputedStyle(e), r=e.getBoundingClientRect();
 if(r.width<2||r.height<2)return null;
 return [s.transform,s.opacity,s.strokeDashoffset,s.backgroundColor,s.color];
})"""

def url(target):
    if target.startswith(("http://","https://","file://")): return target
    p=Path(target).resolve()
    if not p.exists(): die("INPUT_ERROR target missing: "+str(p))
    return p.as_uri()

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("target"); ap.add_argument("--against")
    ap.add_argument("--target",dest="floor",type=float,default=0)
    ap.add_argument("--bursts",type=int,default=8); ap.add_argument("--ticks",type=int,default=5)
    ap.add_argument("--delta",type=int,default=130); ap.add_argument("--dwell",type=int,default=320)
    ap.add_argument("--settle",type=int,default=800); ap.add_argument("--width",type=int,default=1440); ap.add_argument("--height",type=int,default=900); ap.add_argument("--out")
    a=ap.parse_args(); sync=need_playwright()
    def run(pg,target):
        pg.goto(url(target),wait_until="domcontentloaded",timeout=45000); pg.wait_for_timeout(a.settle)
        pg.mouse.move(a.width/2,a.height/2); pg.wait_for_timeout(200)
        frames=[pg.evaluate(SAMPLE)]; mid=0
        for _ in range(a.bursts):
            for _ in range(a.ticks): pg.mouse.wheel(0,a.delta); pg.wait_for_timeout(20)
            mid=max(mid,pg.evaluate("()=>[...document.querySelectorAll('body *')].filter(e=>{const o=+getComputedStyle(e).opacity;return o>.03&&o<.97}).length"))
            pg.wait_for_timeout(a.dwell); frames.append(pg.evaluate(SAMPLE))
        a0=pg.evaluate(SAMPLE); pg.wait_for_timeout(1500); a1=pg.evaluate(SAMPLE)
        tracked=live=0; props=[0]*5
        for i in range(min(len(x) for x in frames)):
            vals=[x[i] for x in frames]
            if any(v is None for v in vals): continue
            tracked+=1; moved=False
            for k in range(5):
                if len({v[k] for v in vals})>1:
                    props[k]+=1
                    if k<3:moved=True
            live+=int(moved)
        idle=sum(1 for i in range(min(len(a0),len(a1))) if a0[i] and a1[i] and any(a0[i][k]!=a1[i][k] for k in range(3)))
        sy=pg.evaluate("()=>Math.round(scrollY)")
        return {"target":target,"tracked":tracked,"live":live,"churn_percent":round(100*live/max(1,tracked),2),"mid_flight":mid,"idle":idle,"scrollY":sy,"hijacked":sy==0,"by_property":{"transform":props[0],"opacity":props[1],"stroke":props[2],"background":props[3],"color":props[4]}}
    try:
        with sync() as p:
            browser=p.chromium.launch(headless=True); pg=browser.new_page(viewport={"width":a.width,"height":a.height})
            result={"tool":"measure_churn","measurement":run(pg,a.target)}
            if a.against: result["against"]=run(pg,a.against)
            pg.close(); browser.close()
    except Exception as exc: die("RUNTIME_ERROR Playwright capture failed: "+str(exc))
    if a.floor and result["measurement"]["churn_percent"]<a.floor: write_json(result,a.out); die("ASSERTION_ERROR churn floor missed",1)
    write_json(result,a.out)
if __name__=="__main__":main()
