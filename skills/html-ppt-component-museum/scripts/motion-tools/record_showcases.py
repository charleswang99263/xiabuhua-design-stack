#!/usr/bin/env python3
"""Record real local case pages with Playwright and encode GIF/WebP when ffmpeg exists."""
import argparse, shutil, subprocess, tempfile
from pathlib import Path
from _runtime import need_playwright, need_binary, die, write_json

DRIVERS={"char-curtain":[(180,470),(1260,430),(320,520),(800,450)],"ink-crowd":[(250,350),(1150,280),(700,200)],"lyre-crows":[(280,300),(1120,450),(320,580)],"press-stack":"wheel","string-clock":[(720,650),(1050,350),(450,400)],"toy-flipbook":[(260,450),(1180,450),(350,450)],"wheel-rail":"wheel"}
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument("cases_dir",type=Path);ap.add_argument("--out",type=Path,default=Path("motion-showcases"));ap.add_argument("--case",action="append")
    a=ap.parse_args();sync=need_playwright();ffmpeg=need_binary("ffmpeg");a.out.mkdir(parents=True,exist_ok=True)
    names=a.case or list(DRIVERS);result={"tool":"record_showcases","viewport":[1440,900],"cases":[]}
    try:
        with sync() as p:
            browser=p.chromium.launch(headless=True)
            for name in names:
                html=a.cases_dir/name/"index.html"
                if not html.exists():die("INPUT_ERROR missing case: "+str(html))
                with tempfile.TemporaryDirectory(prefix="motion-showcase-") as td:
                    ctx=browser.new_context(viewport={"width":1440,"height":900},record_video_dir=td,record_video_size={"width":1440,"height":900});page=ctx.new_page();page.goto(html.resolve().as_uri(),wait_until="load");page.wait_for_timeout(500)
                    page.screenshot(path=str(a.out/(name+".png")))
                    driver=DRIVERS[name]
                    if driver=="wheel":
                        for _ in range(6):page.mouse.wheel(0,300);page.wait_for_timeout(120)
                    else:
                        for x,y in driver:page.mouse.move(x,y);page.wait_for_timeout(120)
                    ctx.close(); webms=list(Path(td).glob("*.webm"))
                    if not webms:die("RUNTIME_ERROR no WebM recorded for "+name)
                    gif=a.out/(name+".gif");subprocess.run([ffmpeg,"-v","error","-y","-i",str(webms[0]),"-vf","fps=12,scale=720:-1",str(gif)],check=True)
                    result["cases"].append({"id":name,"driver":driver,"screenshot":str(a.out/(name+".png")),"gif":str(gif),"cleanup":True})
            browser.close()
    except SystemExit:raise
    except Exception as exc:die("RUNTIME_ERROR showcase recording failed: "+str(exc))
    write_json(result)
if __name__=="__main__":main()
