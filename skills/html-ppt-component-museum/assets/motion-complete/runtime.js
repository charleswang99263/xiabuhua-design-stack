/* Xiabuhua project-owned motion runtime. No external source or asset is embedded.
 * Each recipe is a small stateful API with explicit input, cancel, reduced and dispose paths.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MotionComplete = api;
})(typeof globalThis === 'object' ? globalThis : this, function (root) {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));
  const expFollow = (current, target, response, dt) => current + (target - current) * (1 - Math.exp(-Math.max(0, response) * Math.max(0, dt)));
  const reduced = options => options && typeof options.reduced === 'boolean' ? options.reduced : !!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const disposable = (state, clean) => ({ state, dispose() { if (state.phase !== 'disposed') { state.phase = 'disposed'; clean?.(); } } });

  function textSplitReveal(text, options = {}) {
    const source = String(text), lines = String(options.lines || source).split(/\n/), duration = Number(options.duration) || 700, stagger = Number(options.stagger) || 80;
    const state = { source, lines, progress: reduced(options) ? 1 : 0, phase: reduced(options) ? 'settled' : 'idle' };
    return Object.assign(disposable(state), { input: 'in-view', channel: 'DOM line wrappers', timing: { duration, stagger, from: '105%', to: '0%' }, step(p) { state.progress = clamp(p, 0, 1); state.phase = state.progress >= 1 ? 'settled' : 'running'; return state; }, cancel() { state.progress = 0; state.phase = 'cancelled'; return state; }, finish() { state.progress = 1; state.phase = 'settled'; return state; } });
  }

  function magneticHover(options = {}) {
    const strength = Number(options.strength) || .35, state = { x: 0, y: 0, phase: 'idle', candidate: null };
    return Object.assign(disposable(state), { input: 'mousemove/pointer', channel: 'transform with unchanged hitbox', update(point, rect) { if (state.phase === 'disposed' || reduced(options)) return state; const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2; state.x = (Number(point.x) - cx) * strength; state.y = (Number(point.y) - cy) * strength; state.phase = 'active'; return state; }, leave() { state.x = 0; state.y = 0; state.phase = 'settled'; return state; }, cancel() { return this.leave(); } });
  }

  function clipCurtain(options = {}) {
    const state = { progress: reduced(options) ? 1 : 0, direction: options.direction || 'right', phase: reduced(options) ? 'settled' : 'idle' };
    return Object.assign(disposable(state), { input: 'in-view', channel: 'clip-path plus inner scale', timing: { duration: Number(options.duration) || 800, ease: 'cubic-bezier(0.77,0,0.18,1)', innerScale: 1.15 }, step(p) { state.progress = clamp(p, 0, 1); state.phase = state.progress >= 1 ? 'settled' : 'running'; return state; }, reverse() { state.progress = 0; state.phase = 'reversed'; return state; }, cancel() { return this.reverse(); } });
  }

  function scrollVelocity(options = {}) {
    const state = { velocity: 0, skew: 0, phase: 'idle' }, max = Number(options.maxSkew) || 5, decay = Number(options.decay) || .9;
    return Object.assign(disposable(state), { input: 'native scroll delta', channel: 'skewY with will-change threshold', sample(delta, dt) { if (state.phase === 'disposed') return state; const raw = (Number(delta) || 0) / Math.max(1, Number(dt) || 16); state.velocity = state.velocity + (raw - state.velocity) * .22; state.skew = clamp(state.velocity * .08, -max, max); state.phase = Math.abs(state.skew) > .05 ? 'moving' : 'rest'; return state; }, tick() { state.velocity *= decay; state.skew = clamp(state.velocity * .08, -max, max); return state; }, settle() { state.velocity = 0; state.skew = 0; state.phase = 'rest'; return state; } });
  }

  function horizontalRail(options = {}) {
    const count = Math.max(1, Number(options.count) || 1), state = { progress: 0, xPercent: 0, pinned: options.mobile ? false : true, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'vertical scroll', channel: 'pinned horizontal rail', timing: { scrub: 1, snap: 1 / Math.max(1, count - 1), end: 'rail width' }, step(p) { state.progress = clamp(p, 0, 1); state.xPercent = -100 * (count - 1) * state.progress; state.phase = state.progress === 1 ? 'settled' : 'scrubbing'; return state; }, cancel() { state.progress = 0; state.xPercent = 0; state.phase = 'cancelled'; return state; } });
  }

  function parallaxDepth(options = {}) {
    const depths = options.depths || [.2, .5, .8], state = { x: 0, y: 0, offsets: depths.map(() => ({ x: 0, y: 0 })), phase: 'idle' };
    return Object.assign(disposable(state), { input: 'pointer/touch/keyboard', channel: 'bounded layer transforms', update(x, y, width, height, mode) { const nx = clamp((Number(x) / Math.max(1, Number(width)) - .5) * 2, -1, 1), ny = clamp((Number(y) / Math.max(1, Number(height)) - .5) * 2, -1, 1); state.x = x; state.y = y; state.offsets = reduced(options) ? depths.map(() => ({ x: 0, y: 0 })) : depths.map(d => ({ x: -nx * d * 100, y: -ny * d * 100 })); state.phase = mode || 'pointer'; return state; }, neutral(width, height) { return this.update(Number(width) / 2, Number(height) / 2, width, height, 'neutral'); }, cancel() { return this.neutral(1, 1); } });
  }

  function customCursor(options = {}) {
    const state = { x: 0, y: 0, targetX: 0, targetY: 0, expanded: false, phase: 'idle' }, response = Number(options.response) || 8;
    return Object.assign(disposable(state), { input: 'document pointer', channel: 'fixed cursor with fine-pointer guard', target(x, y) { state.targetX = x; state.targetY = y; state.phase = 'tracking'; return state; }, tick(dt) { if (!reduced(options)) { state.x = expFollow(state.x, state.targetX, response, (Number(dt) || 16) / 1000); state.y = expFollow(state.y, state.targetY, response, (Number(dt) || 16) / 1000); } return state; }, hover(value) { state.expanded = !!value; return state; }, cancel() { state.targetX = state.x; state.targetY = state.y; state.expanded = false; state.phase = 'settled'; return state; } });
  }

  function routeTransition(options = {}) {
    const state = { route: options.route || null, phase: 'idle', progress: 1 };
    return Object.assign(disposable(state), { input: 'route key change', channel: 'DOM view continuity', timing: { enter: .45, exit: .25, mode: 'wait' }, begin(route) { state.route = route; state.progress = 0; state.phase = 'exiting'; return state; }, enter() { state.progress = 1; state.phase = 'entered'; return state; }, cancel() { state.progress = 1; state.phase = 'cancelled'; return state; } });
  }

  function pinnedSequence(options = {}) {
    const steps = Math.max(1, Number(options.steps) || 3), state = { progress: 0, active: 0, pinned: !options.mobile, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'scroll/step', channel: 'labelled step content', timing: { end: '200vh', scrub: 1.5 }, step(p) { state.progress = clamp(p, 0, 1); state.active = Math.min(steps - 1, Math.floor(state.progress * steps)); state.phase = state.progress === 1 ? 'settled' : 'scrubbing'; return state; }, cancel() { state.progress = 0; state.active = 0; state.phase = 'cancelled'; return state; } });
  }

  function counterReveal(target, options = {}) {
    const finalValue = Number(target) || 0, state = { value: reduced(options) ? finalValue : 0, target: finalValue, phase: reduced(options) ? 'settled' : 'idle' };
    return Object.assign(disposable(state), { input: 'viewport entry', channel: 'truthful number text', timing: { duration: Number(options.duration) || 1400, ease: 'power2.out', once: true }, step(p) { state.value = finalValue * clamp(p, 0, 1); state.phase = state.value === finalValue ? 'settled' : 'running'; return state; }, finish() { state.value = finalValue; state.phase = 'settled'; return state; }, cancel() { state.value = 0; state.phase = 'cancelled'; return state; } });
  }

  function gooMask(options = {}) {
    const count = Math.max(1, Number(options.count) || 6), state = { points: Array.from({ length: count }, () => ({ x: 0, y: 0 })), phase: 'idle', reveal: 0 };
    return Object.assign(disposable(state), { input: 'pointer drag/hover', channel: 'SVG mask and filter', timing: { blur: 22, matrix: '22 -9', lag: '.12→.19−i×.014' }, update(x, y) { if (reduced(options)) { state.points[0] = { x, y }; state.reveal = 1; state.phase = 'settled'; return state; } let lead = { x, y }; state.points.forEach((p, i) => { const k = i ? Math.max(.1, .19 - i * .014) : .12; p.x += (lead.x - p.x) * k; p.y += (lead.y - p.y) * k; lead = p; }); state.reveal = 1; state.phase = 'dragging'; return state; }, clear() { state.reveal = 0; state.phase = 'cleared'; return state; }, cancel() { return this.clear(); } });
  }

  function scrollOwner(options = {}) {
    const state = { position: 0, phase: 'idle', destroyed: false };
    return Object.assign(disposable(state, () => { state.destroyed = true; }), { input: 'wheel/native scroll', channel: 'one scroll clock', timing: { lerp: Number(options.lerp) || .085 }, update(value) { if (!state.destroyed) { state.position = Number(value) || 0; state.phase = 'moving'; } return state; }, settle() { state.phase = 'settled'; return state; }, cancel() { state.position = 0; state.phase = 'cancelled'; return state; } });
  }

  function adaptiveHeader(options = {}) {
    const threshold = Number(options.threshold) || 145, state = { dark: false, luminance: 255, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'scroll + computed background', channel: 'header theme', update(rgb) { const c = Array.isArray(rgb) ? rgb : [255, 255, 255]; state.luminance = c[0] * .299 + c[1] * .587 + c[2] * .114; state.dark = state.luminance < threshold; state.phase = 'settled'; return state; }, cancel() { state.dark = false; state.phase = 'cancelled'; return state; } });
  }

  function annotationRing(options = {}) {
    const state = { bbox: null, draw: 0, pointerEnabled: false, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'painted bbox + dwell', channel: 'SVG ellipse and leader', timing: { perimeter: 341, scale: 1.22, reducedFade: 200 }, update(bbox, amount = 1) { state.bbox = bbox; state.draw = clamp(amount, 0, 1); state.pointerEnabled = state.draw > .5; state.phase = 'visible'; return state; }, clear() { state.draw = 0; state.pointerEnabled = false; state.phase = 'cleared'; return state; }, cancel() { return this.clear(); } });
  }

  function verletCurtain(options = {}) {
    const columns = Math.max(1, Number(options.columns) || 24), rows = Math.max(1, Number(options.rows) || 24), state = { columns, rows, links: columns * (rows - 1), horizontalLinks: 0, split: 0, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'pointer repulsion + wheel energy', channel: 'canvas2d independent vertical strings', timing: { passes: 5, anchor: .35, yBias: .35, falloff: 4.2, wheelDecay: .94 }, poke(column, amount) { if (state.phase === 'disposed') return state; state.split = Math.max(state.split, Math.abs(Number(amount) || 0)); state.phase = 'parted'; return state; }, settle() { if (state.phase === 'disposed') return state; state.split = 0; state.phase = 'settled'; return state; }, cancel() { return this.settle(); } });
  }

  function nativeReveal(options = {}) {
    const state = { support: options.support !== false, progress: reduced(options) ? 1 : 0, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'view/trigger timeline', channel: 'CSS finished state + optional native timeline', timing: { duration: .35, stagger: 60 }, step(p) { state.progress = clamp(p, 0, 1); state.phase = state.progress === 1 ? 'settled' : 'running'; return state; }, cancel() { state.progress = 1; state.phase = 'settled'; return state; } });
  }

  function cornerPin(options = {}) {
    const state = { quad: null, valid: false, phase: 'idle' };
    const validQuad = q => Array.isArray(q) && q.length === 8 && q.every(Number.isFinite);
    return Object.assign(disposable(state), { input: 'four corner positions', channel: 'DOM matrix3d', timing: { cssFloor: .016, tilt: 'asin(h/w)×.85' }, update(quad) { state.valid = validQuad(quad); state.quad = state.valid ? quad.slice() : null; state.phase = state.valid ? 'warped' : 'fallback'; return state; }, cancel() { state.quad = null; state.valid = false; state.phase = 'flat'; return state; }, validQuad });
  }

  function verletCardChain(options = {}) {
    const count = Math.max(1, Number(options.count) || 7), state = { count, rest: Number(options.rest) || 118, nodes: Array.from({ length: count + 1 }, (_, i) => ({ x: 0, y: i * (Number(options.rest) || 118) })), phase: 'idle' };
    return Object.assign(disposable(state), { input: 'pointer head', channel: 'Verlet nodes plus corner-pin cards', timing: { gravity: .55, damping: .965, iterations: 16 }, setHead(x, y) { state.nodes[0] = { x, y }; state.phase = 'dragging'; return state; }, settle() { state.phase = 'settled'; return state; }, cancel() { state.phase = 'cancelled'; return state; } });
  }

  function slackString(options = {}) {
    const state = { anchor: options.anchor || { x: 0, y: 0 }, datum: options.datum || { x: 1, y: 0 }, sag: Number(options.sag) || 0, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'exact datum + real drag', channel: 'soft body with exact endpoints', timing: { dt: 1 / 120, tipK: 1600, bodyIterations: 3, stiffness: .5 }, update(datum, sag) { state.datum = { x: Number(datum.x) || 0, y: Number(datum.y) || 0 }; state.sag = clamp(Number(sag) || 0, 0, 1); state.phase = 'sagging'; return state; }, rest() { state.sag = 0; state.phase = 'settled'; return state; }, cancel() { return this.rest(); } });
  }

  function cumulativeEmergence(options = {}) {
    const state = { tick: Number(options.tick) || 167, cap: Number(options.cap) || 46, dealt: 0, live: 0, phase: 'idle' };
    return Object.assign(disposable(state), { input: 'visible dealing clock', channel: 'DOM cards with arrival z-order', timing: { tick: state.tick, skips: [1, 2, 3], noTransition: true }, deal() { state.dealt += 1; state.live = Math.min(state.cap, state.live + 1); state.phase = 'dealing'; return state; }, retire() { state.live = Math.max(0, state.live - 1); return state; }, settle() { state.phase = 'settled'; return state; }, cancel() { state.phase = 'cancelled'; return state; } });
  }

  const recipes = Object.freeze({ textSplitReveal, magneticHover, clipCurtain, scrollVelocity, horizontalRail, parallaxDepth, customCursor, routeTransition, pinnedSequence, counterReveal, gooMask, scrollOwner, adaptiveHeader, annotationRing, verletCurtain, nativeReveal, cornerPin, verletCardChain, slackString, cumulativeEmergence });
  return Object.freeze({ clamp, expFollow, reduced, recipes, textSplitReveal, magneticHover, clipCurtain, scrollVelocity, horizontalRail, parallaxDepth, customCursor, routeTransition, pinnedSequence, counterReveal, gooMask, scrollOwner, adaptiveHeader, annotationRing, verletCurtain, nativeReveal, cornerPin, verletCardChain, slackString, cumulativeEmergence });
});
