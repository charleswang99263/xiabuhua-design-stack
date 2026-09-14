#!/usr/bin/env node
/*
 * Node Playwright bridge for the local motion tools.
 * It performs real browser work; it never consumes a precomputed JSON result.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch (error) { console.error('DEPENDENCY_ERROR playwright: set NODE_PATH to the bundled runtime'); process.exit(2); }
const { chromium } = playwright;
const fail = (message, code = 2) => { console.error('motion-node-bridge:', message); process.exit(code); };
const args = process.argv.slice(2), command = args.shift();
const val = (name, fallback = null) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const has = name => args.includes(name);
const target = val('--target', args.find(x => !x.startsWith('-')));
const resolveTarget = value => { if (!value) fail('target is required'); if (/^(https?|file):/.test(value)) return value; const p = path.resolve(value); if (!fs.existsSync(p)) fail('target not found: ' + p); return 'file://' + p; };
const write = (value, output) => { const text = JSON.stringify(value, null, 2) + '\n'; if (output) fs.writeFileSync(path.resolve(output), text); process.stdout.write(text); };
const sample = () => [...document.querySelectorAll('body *')].map((element, index) => { const style = getComputedStyle(element), rect = element.getBoundingClientRect(); return { index, transform: style.transform, opacity: style.opacity, stroke: style.strokeDashoffset, background: style.backgroundColor, color: style.color, width: rect.width, height: rect.height }; }).filter(x => x.width > 1 && x.height > 1);
const launch = async () => {
  try { return await chromium.launch({ headless: true }); } catch (error) { fail('RUNTIME_ERROR browser launch: ' + error.message); }
};
async function inspectStructure(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(resolveTarget(target), { waitUntil: 'domcontentloaded', timeout: 45000 });
  const inspect = () => page.evaluate(() => {
    const visible = selector => [...document.querySelectorAll(selector)].filter(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const css = element => getComputedStyle(element);
    const nav = document.querySelector('header,nav,[role=banner]');
    return { url: location.href, title: document.title, lang: document.documentElement.lang || null, nav: nav ? { position: css(nav).position, height: Math.round(nav.getBoundingClientRect().height), links: nav.querySelectorAll('a').length } : null, sections: visible('main>section,section,[data-section]').map(x => { const r=x.getBoundingClientRect(),s=css(x); return { height_vh: +(r.height/innerHeight).toFixed(2), width: Math.round(r.width), background:s.backgroundColor, position:s.position, has_media:!!x.querySelector('img,video,canvas,svg') }; }), buttons: visible('button,a,[role=button]').map(x => { const r=x.getBoundingClientRect(),s=css(x); return { text:(x.innerText||'').trim(), width:Math.round(r.width), height:Math.round(r.height), transform:s.transform, radius:s.borderRadius }; }), forms: visible('input,textarea,select').length, media: visible('img,video,canvas,svg').length, fonts: [...document.fonts].map(x => ({ family:x.family, status:x.status })), scrollHeight: document.documentElement.scrollHeight };
  });
  const desktop = await inspect();
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(100); const mobile = await inspect();
  await page.close(); return { tool: 'measure_structure_node', desktop, mobile };
}
async function inspectChurn(browser) {
  const page = await browser.newPage({ viewport: { width: Number(val('--width', 1440)), height: Number(val('--height', 900)) } });
  await page.goto(resolveTarget(target), { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(Number(val('--settle', 400)));
  const frames = [await page.evaluate(sample)]; const bursts = Number(val('--bursts', 4)), ticks = Number(val('--ticks', 3)), delta = Number(val('--delta', 130));
  for (let b=0;b<bursts;b++) { for (let t=0;t<ticks;t++) { await page.mouse.wheel(0, delta); await page.waitForTimeout(20); } await page.waitForTimeout(80); frames.push(await page.evaluate(sample)); }
  const idle0=await page.evaluate(sample); await page.waitForTimeout(500); const idle1=await page.evaluate(sample);
  const tracked=Math.min(...frames.map(x=>x.length)); let live=0; const byProperty={transform:0,opacity:0,stroke:0,background:0,color:0};
  for(let i=0;i<tracked;i++){let moved=false;for(const p of Object.keys(byProperty)){if(new Set(frames.map(f=>f[i]?.[p])).size>1){byProperty[p]++;if(['transform','opacity','stroke'].includes(p))moved=true}}if(moved)live++}
  const result={tool:'measure_churn_node',tracked,live,churn_percent:+(live*100/Math.max(1,tracked)).toFixed(2),mid_flight:0,idle:idle0.filter((x,i)=>idle1[i]&&x.transform!==idle1[i].transform).length,scrollY:await page.evaluate('scrollY'),hijacked:await page.evaluate('scrollY')===0,by_property:byProperty};
  await page.close(); const floor=Number(val('--target',0)); if(floor&&result.churn_percent<floor)fail('ASSERTION_ERROR churn floor missed',1); return result;
}
async function verify(browser) {
  const page=await browser.newPage({ viewport: { width: 1440, height: 900 } }), errors=[]; page.on('pageerror',e=>errors.push(String(e))); page.on('console',m=>m.type()==='error'&&errors.push(m.text()));
  await page.goto(resolveTarget(target), { waitUntil:'load', timeout:45000 }); await page.waitForTimeout(250); const widths=[320,375,414,768,1440], overflow={};
  for(const width of widths){await page.setViewportSize({width,height:860});await page.waitForTimeout(50);overflow[width]=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)}
  await page.setViewportSize({width:1440,height:900}); const before=await page.locator('#motion').getAttribute('data-motion').catch(()=>null); await page.mouse.wheel(0,240); await page.waitForTimeout(120); const after=await page.locator('#motion').getAttribute('data-motion').catch(()=>null); const button=page.locator('button,a,[role=button]').first(); let hover=false;
  if(await button.count()){const beforeStyle=await button.evaluate(e=>getComputedStyle(e).transform);await button.hover();await page.waitForTimeout(100);hover=beforeStyle!==await button.evaluate(e=>getComputedStyle(e).transform)}
  const checks={errors,overflow,h1:await page.locator('h1').count()===1,lang:!!await page.locator('html').getAttribute('lang'),real_wheel:before!==after,real_hover:hover}; await page.close(); return {tool:'verify_case_node',checks,verdict:!errors.length&&Object.values(overflow).every(x=>x<=1)&&checks.h1&&checks.lang&&checks.real_wheel?'PASS':'FAIL'};
}
async function record(browser) {
  const output=path.resolve(val('--out','motion-node-record'));fs.mkdirSync(output,{recursive:true}); const dir=fs.mkdtempSync(path.join(output,'video-')); const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir,size:{width:1440,height:900}}}); const page=await context.newPage(); await page.goto(resolveTarget(target),{waitUntil:'load',timeout:45000}); await page.screenshot({path:path.join(output,'fixture.png'),fullPage:false}); await page.mouse.move(200,200); await page.mouse.wheel(0,400); await page.waitForTimeout(300); await context.close(); const videos=fs.readdirSync(dir).filter(x=>x.endsWith('.webm')); if(!videos.length){fs.rmSync(dir,{recursive:true,force:true});fail('RUNTIME_ERROR no WebM produced')} const webm=path.join(output,'fixture.webm');fs.copyFileSync(path.join(dir,videos[0]),webm);fs.rmSync(dir,{recursive:true,force:true}); const ff=spawnSync('ffmpeg',['-v','error','-y','-i',webm,'-vf','fps=12,scale=720:-1',path.join(output,'fixture.gif')],{encoding:'utf8'}); return {tool:'record_showcases_node',screenshot:path.join(output,'fixture.png'),webm,webm_bytes:fs.statSync(webm).size,gif:ff.status===0?path.join(output,'fixture.gif'):null,gif_optional:ff.status!==0}; 
}
(async()=>{const browser=await launch();try{if(command==='structure')write(await inspectStructure(browser),val('--out'));else if(command==='churn')write({measurement:await inspectChurn(browser)},val('--out'));else if(command==='verify'){const result=await verify(browser);write(result,val('--out'));if(result.verdict!=='PASS')process.exitCode=1}else if(command==='record')write(await record(browser));else fail('command must be structure|churn|verify|record')}catch(error){if(error?.code)process.exitCode=error.code;else if(process.exitCode===undefined)fail('RUNTIME_ERROR '+error.message)}finally{await browser.close()}})();
