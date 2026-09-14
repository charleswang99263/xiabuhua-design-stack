#!/usr/bin/env python3
"""Inspect a real page in Chromium and emit structure/token/media metadata."""
import argparse
from pathlib import Path
from _runtime import need_playwright, die, write_json

JS="""() => {
 const q=s=>[...document.querySelectorAll(s)].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});
 const nav=document.querySelector('header,nav,[role=banner]');
 const sections=q('main>section,section,[data-section]');
 const buttons=q('button,a,[role=button]');
 const inputs=q('input,textarea,select');
 const imgs=q('img,video,canvas,svg');
 const css=e=>getComputedStyle(e);
 return {url:location.href,title:document.title,lang:document.documentElement.lang||null,
  nav:nav?{position:css(nav).position,height:Math.round(nav.getBoundingClientRect().height),links:nav.querySelectorAll('a').length}:null,
  sections:sections.map(e=>{const r=e.getBoundingClientRect(),s=css(e);return {height_vh:+(r.height/innerHeight).toFixed(2),width:Math.round(r.width),background:s.backgroundColor,display:s.display,position:s.position,has_media:!!e.querySelector('img,video,canvas,svg')}}),
  buttons:buttons.map(e=>{const s=css(e),r=e.getBoundingClientRect();return {tag:e.tagName,text:(e.innerText||'').trim().slice(0,80),width:Math.round(r.width),height:Math.round(r.height),radius:s.borderRadius}}),
  forms:inputs.map(e=>{const s=css(e),r=e.getBoundingClientRect();return {tag:e.tagName,type:e.type||null,width:Math.round(r.width),height:Math.round(r.height),label:!!e.labels||!!e.getAttribute('aria-label')}}),
  media:imgs.map(e=>({tag:e.tagName,width:e.getAttribute('width'),height:e.getAttribute('height'),loading:e.getAttribute('loading'),srcset:!!e.getAttribute('srcset')})),
  fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),
  custom_properties:[...document.styleSheets].flatMap(()=>[]),
  darkmode:[...document.styleSheets].length
 };
}"""

def target(x):
    return x if x.startswith(("http://","https://","file://")) else Path(x).resolve().as_uri()
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument("urls",nargs="*");ap.add_argument("--urls-file");ap.add_argument("--limit",type=int,default=20);ap.add_argument("--out")
    a=ap.parse_args(); urls=list(a.urls)
    if a.urls_file: urls += [x.strip() for x in Path(a.urls_file).read_text().splitlines() if x.strip()]
    if not urls: die("INPUT_ERROR provide URL(s) or --urls-file")
    sync=need_playwright(); results=[]
    try:
        with sync() as p:
            browser=p.chromium.launch(headless=True)
            for raw in urls[:a.limit]:
                page=browser.new_page(viewport={"width":1440,"height":900}); page.goto(target(raw),wait_until="domcontentloaded",timeout=45000); desktop=page.evaluate(JS)
                page.set_viewport_size({"width":390,"height":844}); page.wait_for_timeout(120); mobile=page.evaluate(JS)
                results.append({"source":raw,"desktop":desktop,"mobile":mobile});page.close()
            browser.close()
    except Exception as exc: die("RUNTIME_ERROR Playwright inspection failed: "+str(exc))
    write_json({"tool":"measure_structure","records":results},a.out)
if __name__=="__main__":main()
