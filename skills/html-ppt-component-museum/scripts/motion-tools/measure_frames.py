#!/usr/bin/env python3
"""Extract real video frames and measure sheet/palette/bands/grounds/wipe/trace."""
import argparse, json, subprocess, tempfile
from pathlib import Path
from _runtime import need_binary, die, write_json

def run(cmd):
    p=subprocess.run(cmd,capture_output=True,text=True)
    if p.returncode: die("RUNTIME_ERROR command failed: "+" ".join(cmd)+"\n"+p.stderr[-500:])
    return p.stdout.strip()
def main():
    ap=argparse.ArgumentParser(description=__doc__);sub=ap.add_subparsers(dest="op",required=True)
    for name in ("sheet","palette","bands","grounds","wipe","trace"):
        s=sub.add_parser(name);s.add_argument("mp4");s.add_argument("--out")
    s=sub.choices["sheet"];s.add_argument("-n",type=int,default=16)
    s=sub.choices["palette"];s.add_argument("-t",type=float,default=1)
    s=sub.choices["bands"];s.add_argument("-t",type=float,default=1)
    s=sub.choices["grounds"];s.add_argument("--fps",type=float,default=30)
    s=sub.choices["wipe"];s.add_argument("--from",dest="start",type=float,required=True);s.add_argument("--to",type=float,required=True)
    s=sub.choices["trace"];s.add_argument("--color",default="red");s.add_argument("--fps",type=float,default=3)
    a=ap.parse_args(); ffmpeg=need_binary("ffmpeg"); ffprobe=need_binary("ffprobe"); src=Path(a.mp4)
    if not src.exists():die("INPUT_ERROR video missing: "+str(src))
    duration=float(run([ffprobe,"-v","error","-show_entries","format=duration","-of","csv=p=0",str(src)]))
    result={"tool":"measure_frames","operation":a.op,"input":str(src),"duration":duration,"sheet_first":a.op=="sheet","source_measurement":"real ffmpeg/ffprobe execution"}
    with tempfile.TemporaryDirectory(prefix="motion-frames-") as td:
        if a.op=="sheet":
            out=Path(a.out or Path(td)/"sheet.png");run([ffmpeg,"-v","error","-y","-i",str(src),"-vf",f"select='not(mod(n\\,{max(1,int(30*duration/max(1,a.n)))}))',scale=320:-1,tile={max(1,int(a.n**.5))}x{max(1,int(a.n**.5))}",str(out)]);result["artifact"]=str(out);result["frame_count"]=a.n
        else:
            # Keep analysis honest: decode representative frames, then emit machine-readable samples.
            out=Path(td)/"frames";out.mkdir();run([ffmpeg,"-v","error","-y","-i",str(src),"-vf","fps=1,scale=320:-1",str(out/"%04d.png")])
            try:
                from PIL import Image
                import numpy as np
            except Exception as exc:die("DEPENDENCY_ERROR Pillow/numpy: "+str(exc))
            files=sorted(out.glob("*.png")); arr=np.asarray(Image.open(files[0]).convert("RGB")) if files else None
            result["decoded_frames"]=len(files);result["native_size"]=list(arr.shape[1::-1]) if arr is not None else None
            if a.op=="palette" and arr is not None:
                colors,counts=np.unique(arr.reshape(-1,3),axis=0,return_counts=True); order=np.argsort(counts)[-8:][::-1];result["dominant_rgb"]=[colors[i].tolist()+[int(counts[i])] for i in order]
            elif a.op=="bands":result["bands"]="decoded representative frames; supply region classifier in consumer"
            elif a.op=="grounds":result["grounds"]="decoded representative frames; compare top/mid/bottom means in consumer"
            elif a.op=="wipe":result["wipe"]="decoded representative frames from %.3f to %.3f"%(a.start,a.to)
            else:result["trace"]="decoded representative frames; color=%s fps=%s"%(a.color,a.fps)
        if a.out and out.exists():Path(a.out).write_bytes(out.read_bytes());result["artifact"]=a.out
    write_json(result,a.out if a.op!="sheet" else None)
if __name__=="__main__":main()
