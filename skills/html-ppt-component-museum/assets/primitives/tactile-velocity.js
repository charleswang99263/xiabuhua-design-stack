/* Velocity deformation: filtered, capped movement energy for a decorative shell. */
(function (root, factory) {
  const api = factory(root.TactileCommon || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TactileVelocity = api;
})(typeof globalThis === 'object' ? globalThis : this, function (common) {
  const clamp = common.clamp || ((v, a, b) => Math.max(a, Math.min(b, v)));
  function sample(previous, next, dt, options = {}) {
    const safeDt = clamp(Number(dt) || 16, 1, 120);
    const rawX = (Number(next.x) - Number(previous.x)) / safeDt, rawY = (Number(next.y) - Number(previous.y)) / safeDt;
    const alpha = clamp(Number(options.filter) || .22, .01, 1);
    const vx = (Number(options.vx) || 0) + (rawX - (Number(options.vx) || 0)) * alpha, vy = (Number(options.vy) || 0) + (rawY - (Number(options.vy) || 0)) * alpha;
    const speed = Math.sqrt(vx * vx + vy * vy), cap = Math.max(.01, Number(options.cap) || 1.2);
    return { vx, vy, speed, normalized: clamp(speed / cap, 0, 1), dt: safeDt };
  }
  function deformation(velocity, options = {}) { const cap = Math.max(.01, Number(options.cap) || 1.2), amount = clamp((Number(velocity.speed) || 0) / cap, 0, 1), maxScale = Number(options.maxScale) || .12, maxSkew = Number(options.maxSkew) || 9; return { scaleX: 1 + amount * maxScale, scaleY: 1 - amount * maxScale * .62, skew: clamp((Number(velocity.vx) || 0) / cap, -1, 1) * maxSkew, amount }; }
  function createVelocity(options = {}) { let previous = null, velocity = { vx: 0, vy: 0, speed: 0, normalized: 0 }, disposed = false; const state = { velocity, deformation: deformation(velocity, options), phase: 'idle' }; return { state, update(position, time) { if (disposed) return state; if (!previous) previous = { ...position, time }; velocity = sample(previous, position, Math.max(1, (Number(time) || 0) - previous.time), { ...options, ...velocity }); previous = { ...position, time: Number(time) || 0 }; state.velocity = velocity; state.deformation = deformation(velocity, options); state.phase = velocity.speed ? 'moving' : 'rest'; return state; }, settle() { velocity = { vx: 0, vy: 0, speed: 0, normalized: 0 }; state.velocity = velocity; state.deformation = deformation(velocity, options); state.phase = 'rest'; return state; }, dispose() { disposed = true; previous = null; state.phase = 'disposed'; } }; }
  function setup(root, data = {}, scope, options = {}) {
    const host = root?.matches?.('[data-tactile-velocity]') ? root : root?.querySelector?.('[data-tactile-velocity]'), shell = host?.querySelector?.('[data-velocity-shell]');
    if (!host || !shell || !scope) return () => {};
    const model = createVelocity(options); let rafId = null, disposed = false, active = true, lastTime = common.now?.() || Date.now();
    const paint = state => { Object.assign(data, state); const d = state.deformation; host.dataset.velocityPhase = state.phase; shell.style.transform = `translate3d(0,0,0) rotate(${d.skew}deg) scale(${d.scaleX},${d.scaleY})`; shell.style.setProperty('--velocity-energy', String(d.amount)); options.report?.(state); };
    const stop = () => { if (rafId != null) common.cancelRaf?.(rafId); rafId = null; };
    const loop = time => { rafId = null; if (disposed || !active) return; lastTime = time; model.update({ x: Number(data.x) || 0, y: Number(data.y) || 0 }, time); paint(model.state); rafId = common.raf?.(loop); };
    const start = () => { if (!disposed && active && !options.reduced && !common.reducedMotion?.() && rafId == null) rafId = common.raf?.(loop); };
    common.watchActive?.(scope, host, value => { active = value; if (!active) { stop(); model.settle(); paint(model.state); } else { lastTime = common.now?.() || Date.now(); start(); } });
    const move = event => { if (!active || disposed) return; data.x = event.clientX; data.y = event.clientY; model.update({ x: data.x, y: data.y }, common.now?.() || Date.now()); paint(model.state); };
    common.listen?.(scope, host, 'pointermove', move); common.listen?.(scope, host, 'pointerleave', () => { model.settle(); paint(model.state); });
    common.listen?.(scope, host, 'keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); data.x = (Number(data.x) || 0) + (event.key === 'ArrowRight' ? 24 : -24); model.update({ x: data.x, y: data.y || 0 }, common.now?.() || Date.now()); paint(model.state); } });
    start(); const dispose = () => { if (disposed) return; disposed = true; stop(); model.dispose(); shell.style.removeProperty('transform'); }; common.addCleanup?.(scope, dispose); return dispose;
  }
  return Object.freeze({ sample, deformation, createVelocity, setup });
});
