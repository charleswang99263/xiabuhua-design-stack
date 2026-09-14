/* Project-owned p5 adapter: seeded, clock-injected generative process with text fallback. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.GraphicsP5 = api;
})(typeof globalThis === 'object' ? globalThis : this, function (root) {
  'use strict';
  const runtime = root.GraphicsRuntime || (typeof require === 'function' ? require('./graphics-common.js') : null);

  function makeModel(seed, count = 42) {
    const random = runtime.seededRandom(seed);
    return Array.from({ length: count }, (_, index) => ({
      id: `particle-${index + 1}`,
      phase: random() * Math.PI * 2,
      radius: 18 + random() * 92,
      speed: .25 + random() * .7,
      size: 2 + random() * 4,
      hue: 18 + random() * 145,
    }));
  }

  function summary(model, seed) { return `p5 生成过程：seed ${seed}，${model.length} 个粒子由显式伪随机序列生成；时间由运行时时钟注入。`; }

  function mount(host, data = {}, options = {}) {
    if (!host) throw new Error('GraphicsP5.mount 需要 host');
    const scope = runtime.createScope(host, options);
    const P5 = options.p5 === false ? null : (options.p5 || root.p5);
    let currentSeed = Number.isFinite(Number(options.seed ?? data.seed)) ? Number(options.seed ?? data.seed) : 17;
    let model = makeModel(currentSeed, Number(options.count || data.count || 42)); let instance = null; let canvas = null; let fallback = true; let width = 640; let height = 320; let disposed = false;
    const wrapper = document.createElement('div'); wrapper.className = 'graphics-p5-adapter'; host.append(wrapper);
    const frame = document.createElement('div'); frame.className = 'graphics-frame'; wrapper.append(frame);
    const live = document.createElement('p'); live.className = 'graphics-summary'; live.setAttribute('aria-live', 'polite'); live.textContent = summary(model, currentSeed); wrapper.append(live);
    const status = document.createElement('p'); status.className = 'graphics-runtime-status'; wrapper.append(status);
    function drawFallback() { const ctx = canvas?.getContext?.('2d'); if (!ctx) return; ctx.clearRect(0, 0, width, height); const time = scope.clock() / 1000; model.forEach((particle, index) => { const a = particle.phase + time * particle.speed; const x = width / 2 + Math.cos(a) * particle.radius * (1 + Math.sin(time * .6 + index) * .08); const y = height / 2 + Math.sin(a * 1.31) * particle.radius * .68; ctx.fillStyle = `hsl(${particle.hue} 60% 43%)`; ctx.beginPath(); ctx.arc(x, y, particle.size, 0, Math.PI * 2); ctx.fill(); }); }
    function init() {
      if (typeof P5 !== 'function') { canvas = document.createElement('canvas'); canvas.className = 'graphics-p5-canvas'; frame.append(canvas); status.textContent = '降级：p5.js 依赖不可用，使用静态 Canvas 语义回退'; fallback = true; return; }
      try {
        instance = new P5((p) => {
          p.setup = () => { if (disposed) { p.noLoop(); return; } canvas = p.createCanvas(width, height); canvas.elt.classList.add('graphics-p5-canvas'); p.pixelDensity(Math.min(root.devicePixelRatio || 1, 2)); p.noLoop(); };
          p.draw = () => { const time = scope.clock() / 1000; p.clear(); p.noStroke(); model.forEach((particle, index) => { const a = particle.phase + time * particle.speed; const x = width / 2 + Math.cos(a) * particle.radius * (1 + Math.sin(time * .6 + index) * .08); const y = height / 2 + Math.sin(a * 1.31) * particle.radius * .68; p.fill(`hsl(${particle.hue} 60% 43%)`); p.circle(x, y, particle.size * 2); }); };
        }, frame);
        status.textContent = '运行时：p5.js 已挂载；seed 与 clock 已注入'; fallback = false;
      } catch (error) { status.textContent = `降级：p5.js 初始化失败（${error?.message || '未知错误'}）`; instance?.remove?.(); instance = null; fallback = true; canvas = document.createElement('canvas'); canvas.className = 'graphics-p5-canvas'; frame.append(canvas); }
    }
    function update(next = {}) { if (next.seed !== undefined && Number.isFinite(Number(next.seed))) currentSeed = Number(next.seed); if (next.seed !== undefined || next.count) { model = makeModel(currentSeed, Number(next.count || model.length)); live.textContent = summary(model, currentSeed); } if (fallback) drawFallback(); else instance?.redraw?.(); return api; }
    function resize(nextWidth, nextHeight) { width = Math.max(260, Number(nextWidth) || width); height = Math.max(160, Number(nextHeight) || height); if (fallback) { canvas.width = width; canvas.height = height; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; drawFallback(); } else { instance?.resizeCanvas?.(width, height, true); } return api; }
    function pause() { if (!fallback) instance?.noLoop?.(); scope.pause?.(); }
    function resume() { scope.resume?.(); if (!fallback && !scope.reduced()) instance?.redraw?.(); }
    function dispose() { if (disposed) return; disposed = true; scope.pause?.(); instance?.noLoop?.(); instance?.remove?.(); instance = null; canvas?.remove?.(); wrapper.querySelectorAll('canvas').forEach((node) => node.remove()); wrapper.remove(); scope.dispose(); }
    init(); const api = { update, resize, pause, resume, dispose, normalized: () => ({ seed: currentSeed, count: model.length, particles: model.map((particle) => ({ ...particle })) }), summary: () => live.textContent, status: () => status.textContent, p5: () => !fallback, element: wrapper, scope }; resize(); if (!fallback && !scope.reduced()) scope.loop(() => instance?.redraw?.()); if (fallback && !scope.reduced()) scope.loop(() => drawFallback()); runtime.installResize(frame, scope, resize); return api;
  }
  return { mount, makeModel, summary };
});
