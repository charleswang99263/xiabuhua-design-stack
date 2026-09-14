import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = fileURLToPath(new URL('..', import.meta.url));
const contentType = (file) => file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : 'text/plain';
const server = http.createServer((request, response) => {
  const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '');
  const file = path.resolve(root, relative || 'assets/runtime-lab.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { response.writeHead(404); response.end('missing'); return; }
  response.writeHead(200, { 'content-type': `${contentType(file)}; charset=utf-8`, 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(response);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(`http://127.0.0.1:${port}/assets/runtime-lab.html`);
await page.waitForFunction(() => window.__graphicsLab?.instances?.().p5);

const initial = await page.evaluate(() => ({
  d3Marks: document.querySelectorAll('#d3-stage .runtime-mark').length,
  p5Canvases: document.querySelectorAll('#p5-stage canvas').length,
  threeStatus: document.querySelector('#three-stage .graphics-runtime-status')?.textContent || '',
  summaries: [...document.querySelectorAll('.graphics-summary')].map((node) => node.textContent),
  d3Normalized: window.__graphicsLab.instances().d3.normalized(),
}));
assert.equal(initial.d3Marks, 5, 'D3 paints one keyed mark per row');
assert.equal(initial.p5Canvases, 1, 'p5 owns exactly one canvas');
assert.equal(initial.d3Normalized.find((row) => row.id === 'unknown').value, null, 'D3 preserves null as unknown instead of coercing to zero');
assert.match(initial.threeStatus, /GPU：Three\.js WebGLRenderer 已启用/, 'softwareGL run must prove the actual WebGL path');
const gridGeometry = await page.evaluate(() => ({
  grid: document.querySelector('.grid').getBoundingClientRect().toJSON(),
  stages: [...document.querySelectorAll('.stage')].map((stage) => stage.getBoundingClientRect().toJSON()),
  populated: document.querySelectorAll('.grid canvas, .grid .runtime-mark, .grid .graphics-summary').length,
}));
assert.equal(gridGeometry.populated >= 8, true, 'screenshot target grid contains populated specimens');
assert.ok(gridGeometry.grid.width > 0 && gridGeometry.grid.height > 0, 'screenshot target grid has a visible bounding box');
await page.locator('.grid').screenshot({ path: '/tmp/runtime-lab-grid.png' });
const stableHeights = await page.evaluate(async () => {
  const values = [];
  for (let i = 0; i < 7; i += 1) {
    values.push([...document.querySelectorAll('.stage')].map((stage) => Math.round(stage.getBoundingClientRect().height * 100) / 100));
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return values;
});
assert.ok(stableHeights.every((value) => value.every((height, index) => Math.abs(height - stableHeights[0][index]) <= 1)), '3-second stage bounding boxes remain stable');
const actualThree = await page.evaluate(() => {
  const three = window.__graphicsLab.instances().three;
  const canvas = three.element.querySelector('.graphics-three-canvas');
  three.resize(canvas.clientWidth, canvas.clientHeight); // draw synchronously before the WebGL buffer is discarded
  const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
  const pixels = gl ? new Uint8Array(canvas.width * canvas.height * 4) : new Uint8Array();
  if (gl && pixels.length) gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let painted = 0;
  for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] > 0 && (pixels[i] !== 245 || pixels[i + 1] !== 245 || pixels[i + 2] !== 240)) painted += 1;
  return { gpu: three.gpu(), status: three.status(), scene: three.sceneGraph?.(), paintedPixels: painted, contextLost: !!gl?.isContextLost?.() };
});
assert.equal(actualThree.gpu, true, 'actual WebGL specimen reports GPU=true');
assert.deepEqual(actualThree.scene, { nodes: 5, edges: 5 }, 'actual WebGL specimen has a real scene graph');
assert.equal(actualThree.contextLost, false, 'software WebGL context remains available for screenshot');
assert.ok(actualThree.paintedPixels > 20, `Three canvas paints visible non-background pixels (got ${actualThree.paintedPixels})`);

await page.click('#updateData');
await page.waitForFunction(() => document.querySelector('#d3-stage .graphics-summary')?.textContent.includes('139'));
assert.match(await page.locator('#d3-stage .graphics-summary').textContent(), /139/);

const threeUpdate = await page.evaluate(() => {
  const instance = window.__graphicsLab.instances().three;
  const next = [
    { id: 'new-input', label: '新输入', x: -1, y: .4, z: 0 },
    { id: 'new-output', label: '新输出', x: 1, y: .4, z: .1 },
    { id: 'new-check', label: '新复核', x: 0, y: -.8, z: -.1 },
  ];
  instance.update({ rows: next, edges: [['new-input', 'new-output'], ['new-output', 'new-check'], ['new-check', 'new-input']] });
  const controls = [...instance.element.querySelectorAll('.graphics-three-controls button')].map((button) => button.textContent);
  const beforeGraph = instance.sceneGraph();
  instance.element.querySelector('[data-id="new-output"]').click();
  const selected = instance.summary();
  instance.update({ rows: next.slice(0, 2), edges: [['new-input', 'new-output']] });
  const canvas = instance.element.querySelector('.graphics-three-canvas'); const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl'); const pixels = gl ? new Uint8Array(canvas.width * canvas.height * 4) : new Uint8Array(); if (gl && pixels.length) gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels); let paintedAfterUpdate = 0; for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] > 0 && (pixels[i] !== 245 || pixels[i + 1] !== 245 || pixels[i + 2] !== 240)) paintedAfterUpdate += 1;
  return { ids: instance.normalized().map((row) => row.id), controls, beforeGraph, graph: instance.sceneGraph(), selected, afterSummary: instance.summary(), paintedAfterUpdate };
});
assert.deepEqual(threeUpdate.ids, ['new-input', 'new-output'], 'Three update removes old ids and preserves new model ids');
assert.deepEqual(threeUpdate.controls, ['新输入', '新输出', '新复核'], 'Three controls rebuild from updated model');
assert.deepEqual(threeUpdate.beforeGraph, { nodes: 3, edges: 3 }, 'Three keyed scene adds new meshes and edges');
assert.deepEqual(threeUpdate.graph, { nodes: 2, edges: 1 }, 'Three keyed scene removes stale meshes and edges');
assert.match(threeUpdate.selected, /新输出/);
assert.match(threeUpdate.afterSummary, /已选 新输出/);
assert.ok(threeUpdate.paintedAfterUpdate > 20, `Three WebGL canvas remains visibly painted after update (got ${threeUpdate.paintedAfterUpdate})`);

const beforeResize = await page.evaluate(() => document.querySelector('#d3-stage svg').getBoundingClientRect().width);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(80);
const afterResize = await page.evaluate(() => ({ width: document.querySelector('#d3-stage svg').getBoundingClientRect().width, threeCanvas: document.querySelector('#three-stage canvas')?.width || 0 }));
assert.ok(afterResize.width > 0 && afterResize.width <= 390, 'D3 remains inside the narrow viewport');
assert.ok(afterResize.threeCanvas > 0, 'Three canvas drawing buffer remains allocated after resize');
assert.ok(beforeResize !== afterResize.width, 'ResizeObserver changes the measured D3 viewport');
for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  await page.setViewportSize(viewport);
  const samples = [];
  for (let i = 0; i < 3; i += 1) {
    await page.waitForTimeout(120);
    samples.push(await page.evaluate(() => [...document.querySelectorAll('.stage')].map((stage) => Math.round(stage.getBoundingClientRect().height * 100) / 100)));
  }
  assert.ok(samples.every((value) => value.every((height, index) => Math.abs(height - samples[0][index]) <= 1)), `stage heights stabilize at ${viewport.width}x${viewport.height}`);
}

const oldSnapshots = [];
for (let i = 0; i < 20; i += 1) {
  oldSnapshots.push(await page.evaluate(() => {
    const old = window.__graphicsLab.instances();
    window.__graphicsLab.remount();
    return {
      scopes: [old.d3.scope.stats(), old.three.scope.stats(), old.p5.scope.stats()],
      oldCanvases: old.three.element.querySelectorAll('canvas').length + old.p5.element.querySelectorAll('canvas').length,
      oldD3Connected: old.d3.element.isConnected,
    };
  }));
  await page.waitForTimeout(45);
}
await page.waitForTimeout(120);
const lifecycle = await page.evaluate(() => {
  const instances = window.__graphicsLab.instances();
  return { canvases: document.querySelectorAll('.stage canvas').length, d3: instances.d3.scope.stats(), three: instances.three.scope.stats(), p5: instances.p5.scope.stats(), p5Status: instances.p5.status(), threeStatus: instances.three.status() };
});
assert.ok(lifecycle.canvases <= 3, `remount left at most three runtime canvases (got ${lifecycle.canvases})`);
assert.ok(oldSnapshots.every((snapshot) => snapshot.scopes.every((scope) => scope.disposed === true)), 'every disposed specimen scope is marked disposed');
assert.ok(oldSnapshots.every((snapshot) => snapshot.oldCanvases === 0 && snapshot.oldD3Connected === false), 'disposed specimen DOM is detached and has no old canvases');
assert.equal(lifecycle.d3.scope?.disposed, undefined);
assert.doesNotMatch(lifecycle.p5Status, /error/i);
assert.doesNotMatch(lifecycle.threeStatus, /GPU.*fallback/i);

const motionStates = await page.evaluate(async () => {
  const host = document.createElement('div'); document.body.append(host);
  const reduced = GraphicsP5.mount(host, { seed: 9 }, { p5: window.p5, reducedMotion: true });
  const reducedStats = reduced.scope.stats(); reduced.resume(); const reducedAfterResume = reduced.scope.stats(); reduced.dispose(); host.remove();
  const live = window.__graphicsLab.instances().p5; const stage = document.querySelector('#p5-stage'); stage.style.transform = 'translateY(5000px)';
  await new Promise((resolve) => setTimeout(resolve, 120));
  const offscreenStats = live.scope.stats(); stage.style.transform = ''; live.resume();
  return { reducedStats, reducedAfterResume, offscreenStats };
});
assert.equal(motionStates.reducedStats.raf, false, 'reduced motion does not start a continuous RAF');
assert.equal(motionStates.reducedAfterResume.raf, false, 'reduced motion remains static after resume');
assert.equal(motionStates.offscreenStats.raf, false, 'offscreen scope pauses its RAF');

const failures = await page.evaluate(() => {
  const d3Host = document.createElement('div'); document.body.append(d3Host);
  const d3 = GraphicsD3.mount(d3Host, { rows: [{ id: 'positive', label: '正值', value: 2 }, { id: 'negative', label: '负值', value: -2 }, { id: 'missing-label', value: null }] }, { d3: false });
  const threeHost = document.createElement('div'); document.body.append(threeHost); const three = GraphicsThree.mount(threeHost, null, { THREE: false });
  const p5Host = document.createElement('div'); document.body.append(p5Host); const p5 = GraphicsP5.mount(p5Host, { seed: 3 }, { p5: false });
  const deterministicHost = document.createElement('div'); document.body.append(deterministicHost); const deterministic = GraphicsP5.mount(deterministicHost, { seed: 3 }, { p5: false });
  const result = { d3: d3.summary(), d3Normalized: d3.normalized(), d3Bars: [...d3.element.querySelectorAll('rect.runtime-mark')].map((rect) => ({ y: Number(rect.getAttribute('y')), height: Number(rect.getAttribute('height')) })), three: three.status(), threeGpu: three.gpu(), p5: p5.status(), p5Canvas: p5Host.querySelectorAll('canvas').length, sameSeed: JSON.stringify(p5.normalized()) === JSON.stringify(deterministic.normalized()) };
  d3.dispose(); three.dispose(); p5.dispose(); deterministic.dispose(); d3Host.remove(); threeHost.remove(); p5Host.remove(); deterministicHost.remove(); return result;
});
assert.match(failures.d3, /3 项/);
assert.equal(failures.d3Normalized.find((row) => row.id === 'negative').value, -2);
assert.equal(failures.d3Normalized.find((row) => row.id === 'missing-label').label, 'missing-label');
assert.ok(failures.d3Bars[0].y < failures.d3Bars[1].y, 'D3 fallback preserves positive versus negative bar direction');
assert.equal(failures.threeGpu, false, 'Three dependency fallback does not claim GPU');
assert.match(failures.three, /降级/);
assert.equal(failures.p5Canvas, 1, 'p5 fallback still provides a static canvas');
assert.match(failures.p5, /降级/);
assert.equal(failures.sameSeed, true, 'same p5 seed produces the same normalized model');
assert.deepEqual(errors, [], `browser errors: ${errors.join('; ')}`);

await browser.close();
await new Promise((resolve) => server.close(resolve));
console.log('PASS runtime browser contract: D3 update, Three scene/fallback, p5 seed canvas, resize, 20 remounts, failure states');
console.log(`WebGL status: ${actualThree.status}; painted pixels initial=${actualThree.paintedPixels}, after update=${threeUpdate.paintedAfterUpdate}; forced dependency fallback: ${failures.three}`);
