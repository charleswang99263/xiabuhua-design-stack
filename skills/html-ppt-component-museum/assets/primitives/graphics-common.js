/* Xiabuhua 5.0 graphics runtime contract. Project-owned orchestration only. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.GraphicsRuntime = Object.assign(root.GraphicsRuntime || {}, api);
})(typeof globalThis === 'object' ? globalThis : this, function (root) {
  'use strict';

  function reducedMotion(options) {
    if (typeof options?.reducedMotion === 'boolean') return options.reducedMotion;
    return !!root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  }

  function seededRandom(seed) {
    let value = (Number(seed) || 1) >>> 0;
    return function random() {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function safeSize(host, width, height) {
    const rect = host?.getBoundingClientRect?.() || {};
    return {
      width: Math.max(1, Math.round(Number(width) || rect.width || host?.clientWidth || 640)),
      height: Math.max(1, Math.round(Number(height) || rect.height || host?.clientHeight || 360)),
    };
  }

  function makeLocalScope(host, options = {}) {
    const callbacks = new Set();
    const cleanups = [];
    const jobs = new Set();
    let frame = 0;
    let running = false;
    let paused = false;
    let disposed = false;
    let visible = true;
    let elapsed = 0;
    let previous = 0;
    let loop = null;
    const reduced = reducedMotion(options);
    const abort = typeof AbortController === 'function' ? new AbortController() : null;
    const allowed = () => !disposed && !paused && visible && !root.document?.hidden;
    const scheduleFrame = () => {
      if (!allowed() || frame || (!loop && !jobs.size)) return;
      frame = root.requestAnimationFrame?.(tick) || 0;
    };
    function tick(now) {
      frame = 0;
      if (!allowed()) return;
      const dt = previous ? Math.min(48, Math.max(0, now - previous)) : 16.667;
      previous = now;
      elapsed += dt;
      for (const job of [...jobs]) {
        if (elapsed >= job.at) {
          jobs.delete(job);
          job.fn();
        }
      }
      if (loop && !reduced) loop(dt, elapsed);
      scheduleFrame();
    }
    function on(element, event, handler, opts) {
      if (!element?.addEventListener) return () => {};
      const optionsWithSignal = abort ? Object.assign({}, opts, { signal: abort.signal }) : opts;
      element.addEventListener(event, handler, optionsWithSignal);
      return () => element.removeEventListener(event, handler, optionsWithSignal);
    }
    function cleanup(fn) { if (typeof fn === 'function') cleanups.push(fn); return fn; }
    function schedule(ms, fn, essential = false) {
      if (disposed) return () => {};
      if ((reduced || paused) && !essential) { fn(); return () => {}; }
      const job = { at: elapsed + Math.max(0, Number(ms) || 0), fn };
      jobs.add(job); scheduleFrame();
      return () => jobs.delete(job);
    }
    function resume() { paused = false; running = true; scheduleFrame(); }
    function pause() { paused = true; running = false; if (frame) root.cancelAnimationFrame?.(frame); frame = 0; previous = 0; }
    const visibilityObserver = root.IntersectionObserver && host ? new root.IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting !== false;
      if (!visible) pause(); else if (!disposed) resume();
    }) : null;
    visibilityObserver?.observe(host);
    cleanup(() => visibilityObserver?.disconnect());
    const scope = {
      root: host,
      on,
      cleanup,
      schedule,
      loop(fn) { loop = fn; if (!reduced) resume(); },
      resume,
      pause,
      clock: () => elapsed,
      reduced: () => reduced,
      dispose() {
        if (disposed) return;
        disposed = true; pause(); jobs.clear(); abort?.abort();
        [...cleanups].reverse().forEach((fn) => { try { fn(); } catch (_) { /* cleanup is best effort */ } });
        callbacks.clear();
      },
      stats: () => ({ raf: !!frame, jobs: jobs.size, disposed, running, visible }),
      isExternal: false,
    };
    return scope;
  }

  function adoptScope(host, external, options = {}) {
    if (!external) return makeLocalScope(host, options);
    const cleanups = [];
    const on = (element, event, handler, opts) => external.on?.(element, event, handler, opts) || (() => {});
    return {
      root: host,
      on,
      cleanup(fn) { cleanups.push(fn); external.cleanup?.(fn); return fn; },
      schedule: (...args) => external.schedule?.(...args) || (() => {}),
      loop: (fn) => external.loop?.(fn),
      resume: () => external.resume?.(),
      pause: () => external.pause?.(),
      clock: () => external.clock?.() || 0,
      reduced: () => !!(external.reduced?.() || reducedMotion(options)),
      dispose() { cleanups.splice(0).reverse().forEach((fn) => { try { fn(); } catch (_) {} }); },
      stats: () => external.stats?.() || { external: true },
      isExternal: true,
    };
  }

  function createScope(host, options = {}) { return adoptScope(host, options.scope, options); }

  function installResize(host, scope, resize) {
    if (!host || typeof resize !== 'function') return () => {};
    const observer = root.ResizeObserver ? new root.ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      resize(Math.max(1, Math.round(rect?.width || host.clientWidth || 640)), Math.max(1, Math.round(rect?.height || host.clientHeight || 360)));
    }) : null;
    if (observer) observer.observe(host);
    const listener = () => { const size = safeSize(host); resize(size.width, size.height); };
    const off = scope.on(root, 'resize', listener);
    const dispose = () => { observer?.disconnect(); off?.(); };
    scope.cleanup(dispose);
    const size = safeSize(host); resize(size.width, size.height);
    return dispose;
  }

  function textValue(value, unit = '') {
    return value == null || value === '' ? '未知 / 未采集' : `${value}${unit ? ` ${unit}` : ''}`;
  }

  return { createScope, installResize, safeSize, seededRandom, textValue, reducedMotion };
});
