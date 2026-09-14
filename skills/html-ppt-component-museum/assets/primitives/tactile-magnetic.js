/* Magnetic hysteresis: bounded pointer follow with separate enter/exit thresholds. */
(function (root, factory) {
  const api = factory(root.TactileCommon || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TactileMagnetic = api;
})(typeof globalThis === 'object' ? globalThis : this, function (common) {
  const clamp = common.clamp || ((v, a, b) => Math.max(a, Math.min(b, v)));
  function nearestTarget(point, targets) {
    return (targets || []).reduce((best, target) => {
      if (!target || target.disabled) return best;
      const dx = point.x - Number(target.x || 0), dy = point.y - Number(target.y || 0);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return !best || distance < best.distance ? { target, distance } : best;
    }, null);
  }
  function hysteresis(previous, distance, enter = 72, exit = 108) {
    const active = previous != null;
    const threshold = active ? Math.max(enter, exit) : Math.min(enter, exit);
    return distance <= threshold ? previous : null;
  }
  function createMagnetic(options = {}) {
    const enter = Math.max(1, Number(options.enter) || 72), exit = Math.max(enter, Number(options.exit) || enter * 1.5), switchMargin = Math.max(1, Number(options.switchMargin) || 8);
    let candidate = null, committed = null, disposed = false;
    const state = { candidateId: null, committedId: null, distance: Infinity, progress: 0, phase: 'idle' };
    const set = patch => Object.assign(state, patch);
    return {
      state,
      update(point, targets = []) {
        if (disposed) return state;
        const nearest = nearestTarget(point, targets);
        const current = candidate && targets.find(t => t && t.id === candidate.id && !t.disabled);
        if (current) {
          const dx = point.x - Number(current.x || 0), dy = point.y - Number(current.y || 0), distance = Math.sqrt(dx * dx + dy * dy);
          // Keep hysteresis against noise, but let a clearly closer eligible target win on a direct move.
          const shouldSwitch = nearest && nearest.target.id !== current.id && nearest.distance <= enter && nearest.distance + switchMargin < distance;
          candidate = shouldSwitch ? nearest.target : (distance <= exit ? current : null);
        } else candidate = nearest && nearest.distance <= enter ? nearest.target : null;
        const distance = candidate ? Math.sqrt((point.x - Number(candidate.x || 0)) ** 2 + (point.y - Number(candidate.y || 0)) ** 2) : (nearest?.distance ?? Infinity);
        set({ candidateId: candidate?.id ?? null, distance, progress: candidate ? clamp(1 - distance / exit, 0, 1) : 0, phase: candidate ? 'attracting' : 'dragging' });
        return state;
      },
      // Preserve the target return value for callers; setup() reports the state object below.
      commit() { if (disposed) return null; committed = candidate; set({ committedId: committed?.id ?? null, phase: committed ? 'committed' : 'cancelled' }); return committed; },
      cancel() { candidate = null; if (!disposed) set({ candidateId: null, progress: 0, phase: 'cancelled' }); return state; },
      dispose() { disposed = true; candidate = null; committed = null; set({ candidateId: null, committedId: null, phase: 'disposed' }); },
    };
  }
  function setup(root, data = {}, scope, options = {}) {
    const host = root?.matches?.('[data-tactile-magnetic]') ? root : root?.querySelector?.('[data-tactile-magnetic]');
    if (!host || !scope) return () => {};
    const object = host.querySelector('[data-magnetic-object]'), targets = [...host.querySelectorAll('[data-magnetic-target]')];
    if (!object || !targets.length) return () => {};
    const model = createMagnetic(options); let pointerId = null, disposed = false, lastPointer = null;
    let grabOffset = { x: 0, y: 0 }, basePosition = null, translation = { x: 0, y: 0 }, dragStartTranslation = { x: 0, y: 0 };
    const attractionStrength = clamp(Number(options.attraction) || .18, 0, .45);
    const report = state => { if (disposed) return; Object.assign(data, state); host.dataset.magneticCandidate = state.candidateId || ''; host.dataset.magneticPhase = state.phase; options.report?.(state); };
    const read = element => common.readRect ? common.readRect(element) : element.getBoundingClientRect();
    const hostPoint = event => { const r = read(host); return { x: event.clientX - r.left, y: event.clientY - r.top }; };
    const measure = () => {
      const hr = read(host), or = read(object), width = Math.max(1, or.width || object.offsetWidth || 1), height = Math.max(1, or.height || object.offsetHeight || 1);
      if (!basePosition) basePosition = { x: or.left - hr.left - translation.x, y: or.top - hr.top - translation.y };
      return { hr, or, width, height, maxX: Math.max(0, hr.width - width), maxY: Math.max(0, hr.height - height) };
    };
    const targetData = () => { const hr = read(host); return targets.map(el => { const r = read(el); return { id: el.dataset.magneticTarget, x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, disabled: el.disabled || el.hasAttribute?.('disabled') }; }); };
    const paint = (pointer, forcedCenter = null) => {
      const metrics = measure(), point = forcedCenter || pointer;
      const desiredX = forcedCenter ? point.x - metrics.width / 2 : point.x - grabOffset.x, desiredY = forcedCenter ? point.y - metrics.height / 2 : point.y - grabOffset.y;
      const boundedX = clamp(desiredX, 0, metrics.maxX), boundedY = clamp(desiredY, 0, metrics.maxY), center = { x: boundedX + metrics.width / 2, y: boundedY + metrics.height / 2 };
      const state = model.update(center, targetData()), target = targets.find(el => el.dataset.magneticTarget === state.candidateId);
      let attractX = 0, attractY = 0;
      if (target && state.progress > 0 && !options.reduced && !common.reducedMotion?.()) { const td = targetData().find(item => item.id === state.candidateId); attractX = (td.x - center.x) * state.progress * attractionStrength; attractY = (td.y - center.y) * state.progress * attractionStrength; }
      // Attraction is visual only; clamp it as well so the object never escapes the host bounds.
      translation = { x: clamp(boundedX + attractX, 0, metrics.maxX) - basePosition.x, y: clamp(boundedY + attractY, 0, metrics.maxY) - basePosition.y };
      object.style.setProperty('--magnetic-x', `${translation.x}px`); object.style.setProperty('--magnetic-y', `${translation.y}px`);
      targets.forEach(el => el.toggleAttribute('data-magnetic-active', el.dataset.magneticTarget === state.candidateId)); report(state); return state;
    };
    const settleVisual = target => {
      const metrics = measure(), td = targetData().find(item => item.id === target?.id);
      if (!td) return;
      const x = clamp(td.x - metrics.width / 2, 0, metrics.maxX), y = clamp(td.y - metrics.height / 2, 0, metrics.maxY);
      translation = { x: x - basePosition.x, y: y - basePosition.y };
      object.style.setProperty('--magnetic-x', `${translation.x}px`); object.style.setProperty('--magnetic-y', `${translation.y}px`);
      targets.forEach(el => el.toggleAttribute('data-magnetic-active', el.dataset.magneticTarget === target.id));
    };
    const commitCurrent = () => {
      const target = model.commit();
      if (target) { settleVisual(target); model.state.distance = 0; model.state.progress = 1; }
      else restoreVisual();
      report(model.state);
      return target;
    };
    const restoreVisual = (position = dragStartTranslation) => { translation = { x: position.x, y: position.y }; object.style.setProperty('--magnetic-x', `${translation.x}px`); object.style.setProperty('--magnetic-y', `${translation.y}px`); targets.forEach(el => el.removeAttribute('data-magnetic-active')); };
    const capture = (method, id) => { try { object[method]?.(id); } catch (_) { /* pointer may already have lost capture */ } };
    const down = event => {
      if (disposed) return;
      const metrics = measure(), pointer = hostPoint(event); dragStartTranslation = { x: translation.x, y: translation.y }; pointerId = event.pointerId; lastPointer = pointer;
      grabOffset = { x: pointer.x - (metrics.or.left - metrics.hr.left), y: pointer.y - (metrics.or.top - metrics.hr.top) };
      capture('setPointerCapture', pointerId); model.cancel(); model.state.phase = 'dragging'; targets.forEach(el => el.removeAttribute('data-magnetic-active')); report(model.state); event.preventDefault?.();
    };
    const move = event => { if (event.pointerId !== pointerId || disposed) return; lastPointer = hostPoint(event); paint(lastPointer); };
    const end = event => { if (event.pointerId !== pointerId) return; pointerId = null; capture('releasePointerCapture', event.pointerId); commitCurrent(); };
    const cancel = event => { if (event?.pointerId != null && event.pointerId !== pointerId) return; pointerId = null; capture('releasePointerCapture', event?.pointerId); restoreVisual(); report(model.cancel()); };
    common.listen?.(scope, object, 'pointerdown', down); common.listen?.(scope, object, 'pointermove', move); common.listen?.(scope, object, 'pointerup', end); common.listen?.(scope, object, 'pointercancel', cancel); common.listen?.(scope, object, 'lostpointercapture', cancel);
    common.listen?.(scope, object, 'keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); pointerId = null; restoreVisual(); report(model.cancel()); }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); const first = targets.find(el => !el.disabled && !el.hasAttribute?.('disabled')); if (first) { const r = read(first), hr = read(host), center = { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2 }; model.update(center, targetData()); commitCurrent(); } }
    });
    common.listen?.(scope, window, 'resize', () => {
      if (pointerId != null && lastPointer) paint(lastPointer);
      else { const metrics = measure(); basePosition = { x: metrics.or.left - metrics.hr.left - translation.x, y: metrics.or.top - metrics.hr.top - translation.y }; }
    });
    const dispose = () => { if (disposed) return; disposed = true; pointerId = null; model.dispose(); object.style.removeProperty('--magnetic-x'); object.style.removeProperty('--magnetic-y'); targets.forEach(el => el.removeAttribute('data-magnetic-active')); };
    common.addCleanup?.(scope, dispose); return dispose;
  }
  return Object.freeze({ nearestTarget, hysteresis, createMagnetic, setup });
});
