/* Shared-image expansion: same entity/image continuity, crop geometry, source-loss fallback and focus return. */
(function (root, factory) {
  const api = factory(root.TactileCommon || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TactileExpand = api;
})(typeof globalThis === 'object' ? globalThis : this, function (common) {
  const clamp = common.clamp || ((value, min, max) => Math.max(min, Math.min(max, value)));
  function createExpansion(options = {}) {
    let disposed = false;
    const state = { expandedId: null, sourceId: null, phase: 'closed', fallback: false, geometry: null, token: 0 };
    return {
      state,
      open(id, source = true, geometry = null) {
        if (disposed || !id) return state;
        state.token += 1;
        Object.assign(state, { expandedId: String(id), sourceId: source ? String(id) : null, phase: options.reduced ? 'open' : 'opening', fallback: !source, geometry });
        return state;
      },
      settle() { if (!disposed && state.expandedId) state.phase = 'open'; return state; },
      close() { if (disposed) return state; state.token += 1; Object.assign(state, { expandedId: null, phase: 'closed', geometry: null }); return state; },
      cancel() { return this.close(); },
      dispose() { disposed = true; state.token += 1; state.phase = 'disposed'; },
    };
  }
  function rectGeometry(sourceRect, targetRect) {
    if (!sourceRect || !targetRect || !sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height) return null;
    const sx = sourceRect.width / targetRect.width, sy = sourceRect.height / targetRect.height;
    return { dx: sourceRect.left + sourceRect.width / 2 - targetRect.left - targetRect.width / 2, dy: sourceRect.top + sourceRect.height / 2 - targetRect.top - targetRect.height / 2, sx: clamp(sx, .08, 2), sy: clamp(sy, .08, 2), sourceAspect: sourceRect.width / sourceRect.height, targetAspect: targetRect.width / targetRect.height };
  }
  function setup(root, data = {}, scope, options = {}) {
    const host = root?.matches?.('[data-tactile-expand]') ? root : root?.querySelector?.('[data-tactile-expand]');
    const dialog = host?.querySelector?.('[data-expand-dialog]');
    const close = host?.querySelector?.('[data-expand-close]');
    const cards = [...(host?.querySelectorAll?.('[data-expand-id]') || [])];
    if (!host || !dialog || !cards.length || !scope) return () => {};
    const model = createExpansion(options); let disposed = false, lastSource = null, settleId = null;
    const detailImage = dialog.querySelector('[data-expand-image]');
    const report = state => { Object.assign(data, state); host.dataset.expandPhase = state.phase; host.dataset.expandId = state.expandedId || ''; host.dataset.expandFallback = String(Boolean(state.fallback)); options.report?.(state); };
    const paint = state => { report(state); dialog.hidden = !state.expandedId; dialog.setAttribute('aria-hidden', String(!state.expandedId)); cards.forEach(card => card.setAttribute('aria-expanded', card.dataset.expandId === state.expandedId ? 'true' : 'false')); const title = dialog.querySelector('[data-expand-title]'); if (title) title.textContent = state.expandedId ? `详情：${state.expandedId}` : '详情'; };
    const measure = source => {
      const sourceRect = source?.getBoundingClientRect?.();
      const wasHidden = dialog.hidden; if (wasHidden) { dialog.hidden = false; dialog.setAttribute('aria-hidden', 'true'); }
      const geometry = rectGeometry(sourceRect, dialog.getBoundingClientRect?.());
      if (wasHidden) dialog.hidden = true;
      return geometry;
    };
    const applyGeometry = geometry => { if (!geometry) { dialog.style.removeProperty('--expand-dx'); dialog.style.removeProperty('--expand-dy'); dialog.style.removeProperty('--expand-sx'); dialog.style.removeProperty('--expand-sy'); return; } dialog.style.setProperty('--expand-dx', `${geometry.dx}px`); dialog.style.setProperty('--expand-dy', `${geometry.dy}px`); dialog.style.setProperty('--expand-sx', String(geometry.sx)); dialog.style.setProperty('--expand-sy', String(geometry.sy)); dialog.dataset.expandGeometry = `${geometry.sourceAspect.toFixed(3)}:${geometry.targetAspect.toFixed(3)}`; };
    const open = card => {
      if (disposed) return;
      lastSource = card;
      if (detailImage) { const image = card.querySelector('img'); if (image?.getAttribute('src')) detailImage.src = image.getAttribute('src'); detailImage.alt = image?.alt || `详情：${card.dataset.expandId}`; }
      const sourceExists = document.body.contains(card);
      const geometry = sourceExists ? measure(card) : null;
      const state = model.open(card.dataset.expandId, sourceExists, geometry); applyGeometry(geometry); paint(state);
      dialog.classList.remove('is-settled'); void dialog.offsetWidth; dialog.classList.add('is-settled');
      if (settleId != null) clearTimeout(settleId);
      settleId = setTimeout(() => { settleId = null; if (!disposed && model.state.token === state.token) { paint(model.settle()); dialog.classList.add('is-settled'); } }, options.duration || 240);
      dialog.querySelector('[data-expand-title]')?.focus?.();
    };
    const closeDialog = () => { if (disposed || !model.state.expandedId) return; if (settleId != null) { clearTimeout(settleId); settleId = null; } const closingToken = model.state.token; model.state.phase = 'closing'; paint(model.state); dialog.classList.remove('is-settled'); void dialog.offsetWidth; settleId = setTimeout(() => { settleId = null; if (!disposed && model.state.token === closingToken) { paint(model.close()); dialog.classList.remove('is-settled'); lastSource?.focus?.(); } }, options.duration || 240); };
    cards.forEach(card => common.listen?.(scope, card, 'click', () => open(card)));
    common.listen?.(scope, close, 'click', closeDialog);
    common.listen?.(scope, dialog, 'keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeDialog(); } });
    common.listen?.(scope, window, 'resize', () => { if (model.state.expandedId && lastSource?.isConnected) { const geometry = measure(lastSource); model.state.geometry = geometry; applyGeometry(geometry); } });
    const dispose = () => { if (disposed) return; disposed = true; if (settleId != null) clearTimeout(settleId); model.dispose(); dialog.hidden = true; dialog.classList.remove('is-settled'); };
    common.addCleanup?.(scope, dispose); paint(model.state); return dispose;
  }
  return Object.freeze({ createExpansion, rectGeometry, setup });
});
