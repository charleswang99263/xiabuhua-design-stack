/* Original bounded text-entry primitive. No React Bits code or dependency.
 * mount(element, text, {mode, duration, scope, isReduced}) -> finish/cancel.
 * scope supplies schedule(ms, fn), cleanup(fn), clock(), and optionally on().
 * The true text is always in accessible DOM; visuals are aria-hidden overlays.
 */
(function(root){
 const running=new WeakMap();
 const glyphs=text=>typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(String(text))].map(x=>x.segment):Array.from(String(text));
 const alphabet=Array.from('01アイウエオカキクケコ<>/{}');
 function frame(text,progress,tick=0){
  const chars=glyphs(text),reveal=Math.floor(Math.max(0,Math.min(1,progress))*chars.length);
  return chars.map((ch,i)=>i<reveal||/\s|[()[\]{}.,;:'"=><+*/-]/u.test(ch)?ch:alphabet[(i*17+tick*7)%alphabet.length]).join('');
 }
 const css=`
.text-entry-host{position:relative;display:block;isolation:isolate}
.text-entry-source{display:block}
.text-entry-visual{position:absolute;inset:0;display:block;pointer-events:none;user-select:none;white-space:inherit;color:inherit}
.text-entry-piece{display:inline-block;white-space:pre}
.text-entry-controls{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}
.text-entry-controls button{min-height:44px}
.text-entry-lab{padding:26px;border:1px solid var(--line);background:var(--surface);min-height:220px}
.text-entry-lab h4{font:650 32px/1.4 var(--display);margin:15px 0}
.text-entry-note{font-size:12px;color:var(--muted);line-height:1.8}
`;
 function mount(element,text,options={}){
  if(!element)return()=>{};running.get(element)?.();
  const scope=options.scope,isReduced=options.isReduced||(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
  let mode=options.mode||'fade';const source=String(text);const chars=glyphs(source);
  if(chars.length>140)mode='fade';
  if(!scope?.schedule||mode==='none'||isReduced()){element.textContent=source;element.dataset.textEntryState='complete';return()=>{}}
  element.classList.add('text-entry-host');element.textContent='';
  const real=document.createElement('span'),visual=document.createElement('span');
  real.className='text-entry-source';real.textContent=source;real.style.opacity='0';
  visual.className='text-entry-visual';visual.setAttribute('aria-hidden','true');element.append(real,visual);
  let done=false,cancelJob=null;const duration=Math.max(80,Math.min(1800,Number(options.duration)||420)),start=scope.clock();
  const finish=()=>{if(done)return;done=true;cancelJob?.();real.style.opacity='';visual.remove();element.dataset.textEntryState='complete';if(running.get(element)===finish)running.delete(element)};
  running.set(element,finish);scope.cleanup(finish);element.dataset.textEntryState='running';
  const pieces=[];
  if(mode==='words'){
   const tokens=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'word'}).segment(source)].map(x=>x.segment):source.split(/(\s+)/);
   for(const word of tokens){const span=document.createElement('span');span.className='text-entry-piece';span.textContent=word;visual.append(span);pieces.push(span)}
  }else visual.textContent=source;
  const draw=()=>{
   if(done)return;if(isReduced()){finish();return}
   const t=Math.max(0,Math.min(1,(scope.clock()-start)/duration));
   if(mode==='decode')visual.textContent=frame(source,t,Math.floor(t*28));
   else if(mode==='type')visual.textContent=chars.map((ch,i)=>i<Math.ceil(t*chars.length)?ch:/\s/.test(ch)?ch:'\u2007').join('');
   else if(mode==='words')pieces.forEach((span,i)=>{const local=Math.max(0,Math.min(1,(t-i/Math.max(1,pieces.length)*.55)/.45));span.style.opacity=local;span.style.transform='translateY('+((1-local)*7)+'px)'});
   else{visual.style.opacity=t;visual.style.transform='translateY('+((1-t)*5)+'px)';if(mode==='blur')visual.style.filter='blur('+((1-t)*5)+'px)'}
   if(t>=1)finish();else cancelJob=scope.schedule(32,draw);
  };
  if(scope.on)scope.on(document,'museum-motion',()=>{if(isReduced())finish()});
  draw();return finish;
 }
 root.MuseumTextEntry={glyphs,frame,mount,css};
 if(typeof module==='object'&&module.exports)module.exports=root.MuseumTextEntry;
})(globalThis);
