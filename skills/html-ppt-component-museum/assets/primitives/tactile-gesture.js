/* Gesture transition: reversible progress with distance/velocity commit and bounded thumb travel. */
(function (root, factory) { const api = factory(root.TactileCommon || {}); if (typeof module === 'object' && module.exports) module.exports = api; if (root) root.TactileGesture = api; })(typeof globalThis === 'object' ? globalThis : this, function (common) {
  const clamp = common.clamp || ((v, a, b) => Math.max(a, Math.min(b, v)));
  function decide(progress, velocity, options = {}) { const threshold = clamp(Number(options.threshold) || .58, .05, .95); const velocityThreshold = Math.max(.01, Number(options.velocity) || 1.1); return progress >= threshold || (Number(velocity) || 0) >= velocityThreshold; }
  function createGesture(options = {}) {
    let disposed = false;
    const state = { progress: 0, phase: 'idle', committed: false, cancelReason: null };
    return {
      state,
      begin() { if (!disposed) { state.phase = 'dragging'; state.committed = false; state.cancelReason = null; } return state; },
      update(progress, velocity = 0) { if (disposed) return state; state.progress = clamp(progress); state.velocity = Number(velocity) || 0; state.phase = 'preview'; state.committed = false; state.cancelReason = null; return state; },
      release() { if (disposed) return state; if (!decide(state.progress, state.velocity, options)) return this.cancel('threshold'); state.committed = true; state.phase = 'committed'; state.cancelReason = null; return state; },
      cancel(reason = 'cancelled') { if (disposed) return state; Object.assign(state, { progress: 0, committed: false, phase: 'cancelled', cancelReason: reason }); return state; },
      dispose() { disposed = true; state.phase = 'disposed'; },
    };
  }
  function setup(root, data = {}, scope, options = {}) {
    const host = root?.matches?.('[data-tactile-gesture]') ? root : root?.querySelector?.('[data-tactile-gesture]');
    const track = host?.querySelector?.('[data-gesture-track]'), thumb = host?.querySelector?.('[data-gesture-thumb]');
    if (!host || !track || !thumb || !scope) return () => {};
    const model = createGesture(options); let pointerId = null, lastTime = 0, lastPointer = null, disposed = false, grabOffset = 0;
    const capture = (method, id) => { try { thumb[method]?.(id); } catch (_) { /* synthetic or already-lost pointers have no capture */ } };
    const metrics = () => {
      const style = typeof getComputedStyle === 'function' ? getComputedStyle(track) : { paddingLeft: '0', paddingRight: '0', borderLeftWidth: '0', borderRightWidth: '0' };
      const paddingLeft = Number.parseFloat(style.paddingLeft) || 0, paddingRight = Number.parseFloat(style.paddingRight) || 0;
      const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0, borderRight = Number.parseFloat(style.borderRightWidth) || 0;
      const innerWidth = Math.max(0, track.getBoundingClientRect().width - borderLeft - borderRight - paddingLeft - paddingRight);
      const thumbWidth = Math.max(1, thumb.getBoundingClientRect().width || thumb.offsetWidth || 1);
      return { rect: track.getBoundingClientRect(), borderLeft, paddingLeft, travel: Math.max(0, innerWidth - thumbWidth), thumbWidth };
    };
    const paint = state => {
      if (disposed) return;
      const m = metrics(); Object.assign(data, state); host.dataset.gesturePhase = state.phase;
      thumb.style.transform = `translate3d(${state.progress * m.travel}px,0,0)`; host.setAttribute('aria-valuenow', String(Math.round(state.progress * 100))); options.report?.(state);
    };
    const down = event => {
      if (options.reduced || common.reducedMotion?.() || disposed) return;
      const m = metrics(), thumbRect = thumb.getBoundingClientRect();
      pointerId = event.pointerId; lastPointer = event.clientX; lastTime = common.now?.() || Date.now();
      // Preserve the point grabbed inside the thumb; the thumb must not jump under the pointer.
      grabOffset = clamp(event.clientX - thumbRect.left, 0, m.thumbWidth); model.begin(); capture('setPointerCapture', pointerId); paint(model.state); event.preventDefault?.();
    };
    const move = event => {
      if (event.pointerId !== pointerId || disposed) return;
      const m = metrics(), time = common.now?.() || Date.now(), dt = Math.max(1, time - lastTime), previous = lastPointer;
      lastPointer = event.clientX; lastTime = time;
      const contentStart = m.rect.left + m.borderLeft + m.paddingLeft, desiredLeft = event.clientX - contentStart - grabOffset;
      model.update(desiredLeft / Math.max(1, m.travel), (event.clientX - previous) / dt); paint(model.state);
    };
    const end = event => { if (event.pointerId !== pointerId) return; pointerId = null; capture('releasePointerCapture', event.pointerId); paint(model.release()); };
    const cancel = event => { if (event?.pointerId != null && event.pointerId !== pointerId) return; pointerId = null; capture('releasePointerCapture', event?.pointerId); paint(model.cancel(event?.type === 'lostpointercapture' ? 'lostpointercapture' : 'pointercancel')); };
    common.listen?.(scope, thumb, 'pointerdown', down); common.listen?.(scope, thumb, 'pointermove', move); common.listen?.(scope, thumb, 'pointerup', end); common.listen?.(scope, thumb, 'pointercancel', cancel); common.listen?.(scope, thumb, 'lostpointercapture', cancel);
    common.listen?.(scope, thumb, 'keydown', event => {
      let next = model.state.progress; if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next += .16; else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next -= .16; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = 1; else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); paint(model.release()); return; } else if (event.key === 'Escape') { event.preventDefault(); paint(model.cancel('escape')); return; } else return;
      event.preventDefault(); paint(model.update(next));
    });
    common.listen?.(scope, window, 'resize', () => paint(model.state));
    const dispose = () => { if (disposed) return; disposed = true; pointerId = null; model.dispose(); thumb.style.removeProperty('transform'); }; common.addCleanup?.(scope, dispose); paint(model.state); return dispose;
  }
  return Object.freeze({ decide, createGesture, setup });
});
