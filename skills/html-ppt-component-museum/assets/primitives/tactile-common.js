/* Project-owned tactile helpers. Dependency-free and safe to mount more than once. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TactileCommon = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : min));
  const clamp01 = value => clamp(value, 0, 1);
  const lerp = (a, b, t) => a + (b - a) * clamp01(t);
  const magnitude = (x, y) => Math.sqrt(x * x + y * y);
  const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
  const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = (fn) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : setTimeout(() => fn(now()), 16));
  const cancelRaf = id => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id));
  const addCleanup = (scope, fn) => {
    if (scope && typeof scope.cleanup === 'function') scope.cleanup(fn);
    return fn;
  };
  const listen = (scope, target, type, fn, options) => {
    if (!target || typeof target.addEventListener !== 'function') return () => {};
    target.addEventListener(type, fn, options);
    const off = () => target.removeEventListener(type, fn, options);
    if (scope && typeof scope.cleanup === 'function') scope.cleanup(off);
    return off;
  };
  const readRect = element => {
    const rect = element && typeof element.getBoundingClientRect === 'function' ? element.getBoundingClientRect() : { left: 0, top: 0, width: 1, height: 1 };
    return { left: rect.left || 0, top: rect.top || 0, width: Math.max(1, rect.width || element?.clientWidth || 1), height: Math.max(1, rect.height || element?.clientHeight || 1) };
  };
  const writeState = (element, state, report) => {
    if (!element) return;
    element.dataset.tactileState = state;
    if (typeof report === 'function') report(state);
  };
  const watchActive = (scope, element, callback) => {
    let inView = true;
    const active = () => inView && scope?.isActive ? scope.isActive() : inView && (scope?.paused !== true) && !(typeof document !== 'undefined' && document.visibilityState === 'hidden');
    const check = () => callback(Boolean(active()));
    listen(scope, typeof document !== 'undefined' ? document : null, 'visibilitychange', check);
    scope?.onLifecycle?.(check);
    let observer = null;
    if (typeof IntersectionObserver === 'function' && element) { observer = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting !== false; check(); }); observer.observe(element); addCleanup(scope, () => observer.disconnect()); }
    check();
    return () => { observer?.disconnect(); };
  };
  return Object.freeze({ clamp, clamp01, lerp, magnitude, now, reducedMotion, raf, cancelRaf, addCleanup, listen, readRect, writeState, watchActive });
});
