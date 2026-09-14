/* Liquid tabs: semantic selection plus an indicator measured in its own containing block. */
(function (root, factory) { const api = factory(root.TactileCommon || {}); if (typeof module === 'object' && module.exports) module.exports = api; if (root) root.TactileTabs = api; })(typeof globalThis === 'object' ? globalThis : this, function (common) {
  function createTabs(options = {}) {
    let disposed = false, selected = Number(options.initial) || 0;
    const state = { selected, phase: 'idle', indicator: null };
    return {
      state,
      select(index, rects = []) { if (disposed) return state; const next = Math.max(0, Math.min(Math.max(0, rects.length - 1), Number(index) || 0)); selected = next; state.selected = next; state.indicator = rects[next] || null; state.phase = options.reduced ? 'settled' : 'moving'; return state; },
      measure(rects = []) { if (disposed) return state; state.indicator = rects[selected] || null; return state; },
      settle() { if (!disposed) state.phase = 'settled'; return state; },
      dispose() { disposed = true; state.phase = 'disposed'; },
    };
  }
  function setup(root, data = {}, scope, options = {}) {
    const host = root?.matches?.('[data-tactile-tabs]') ? root : root?.querySelector?.('[data-tactile-tabs]');
    const tabs = [...(host?.querySelectorAll?.('[role=tab]') || [])], indicator = host?.querySelector?.('[data-tabs-indicator]');
    if (!host || !tabs.length || !scope) return () => {};
    // Keep the declared aria-controls relationship intact, creating only missing local panels for the lab fixture.
    tabs.forEach((tab, index) => {
      const id = tab.getAttribute('aria-controls');
      if (id && !host.querySelector(`#${typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id.replace(/[^a-zA-Z0-9_-]/g, '\\$&')}`)) {
        const panel = document.createElement('div'); panel.id = id; panel.setAttribute('role', 'tabpanel'); panel.innerHTML = `<strong>${tab.textContent || `Tab ${index + 1}`}</strong>Selection content for ${tab.textContent || `tab ${index + 1}`}.`; host.append(panel);
      }
    });
    const panels = tabs.map(tab => { const id = tab.getAttribute('aria-controls'); return id ? host.querySelector(`#${typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id.replace(/[^a-zA-Z0-9_-]/g, '\\$&')}`) : null; });
    const initial = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'), model = createTabs({ ...options, initial: initial >= 0 ? initial : 0 });
    let disposed = false, rafId = null, version = 0;
    // The indicator is absolute inside the tablist, so all coordinates share that containing block.
    const containing = () => indicator?.offsetParent || indicator?.parentElement || host;
    const rects = () => {
      const box = containing(), cr = box.getBoundingClientRect();
      return tabs.map(tab => { const r = tab.getBoundingClientRect(); return { left: r.left - cr.left, width: r.width, top: r.bottom - cr.top, height: r.height }; });
    };
    const paint = state => {
      if (disposed) return;
      Object.assign(data, state); tabs.forEach((tab, i) => { const active = i === state.selected; tab.setAttribute('aria-selected', active ? 'true' : 'false'); tab.tabIndex = active ? 0 : -1; });
      panels.forEach((panel, i) => { if (!panel) return; const active = i === state.selected; panel.hidden = !active; panel.setAttribute('aria-hidden', String(!active)); });
      if (indicator && state.indicator) {
        const indicatorHeight = Math.max(1, indicator.getBoundingClientRect().height || Number.parseFloat(getComputedStyle(indicator).height) || 3);
        // Use the tab bottom so the line sits below the label instead of crossing its glyphs.
        indicator.style.width = `${state.indicator.width}px`; indicator.style.top = `${state.indicator.top - indicatorHeight}px`; indicator.style.transform = `translate3d(${state.indicator.left}px,0,0)`;
      }
      host.dataset.tabsPhase = state.phase; options.report?.(state);
    };
    const select = index => { const next = model.select(index, rects()); paint(model.state); const token = ++version; if (rafId != null) common.cancelRaf?.(rafId); rafId = common.raf?.(() => { if (!disposed && token === version) paint(model.settle()); }); };
    tabs.forEach((tab, i) => {
      common.listen?.(scope, tab, 'click', () => select(i));
      common.listen?.(scope, tab, 'keydown', event => { let next = i; if (event.key === 'ArrowRight') next = (i + 1) % tabs.length; else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = tabs.length - 1; else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(i); return; } else return; event.preventDefault(); tabs[next].focus(); select(next); });
    });
    common.listen?.(scope, window, 'resize', () => { version += 1; if (rafId != null) common.cancelRaf?.(rafId); paint(model.measure(rects())); });
    const dispose = () => { if (disposed) return; disposed = true; version += 1; if (rafId != null) common.cancelRaf?.(rafId); model.dispose(); indicator?.style.removeProperty('transform'); indicator?.style.removeProperty('width'); indicator?.style.removeProperty('top'); };
    common.addCleanup?.(scope, dispose); select(model.state.selected); return dispose;
  }
  return Object.freeze({ createTabs, setup });
});
