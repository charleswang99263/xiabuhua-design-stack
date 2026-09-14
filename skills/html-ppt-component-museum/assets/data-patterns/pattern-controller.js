/* Project-owned controller for the static data-pattern gallery.
 * It owns timing/state/query semantics only; SVG remains a pure render output. */
(function (root) {
  'use strict';
  const DYNAMIC = {
    G9: { views: ['scatter', 'bar', 'donut'], duration: 3000 },
    G12: { bars: 50, delay: 36, settle: 640 },
    G16: { entities: 8, frames: 8, interval: 1150 },
    G17: { series: 1, points: 50, interval: 300 },
    G18: { days: 180, duration: 2600 }
  };
  function controller(id, options) {
    const config = Object.assign({}, DYNAMIC[id] || {}, options || {});
    let state = 'idle', timer = null, frame = 0, destroyed = false, view = config.views ? config.views[0] : null;
    const listeners = new Set();
    function emit() { listeners.forEach((fn) => fn({ id, state, frame, view, config })); }
    function clear() { if (timer !== null) { clearTimeout(timer); clearInterval(timer); timer = null; } }
    function step() {
      if (destroyed) return;
      if (id === 'G9') { frame = (frame + 1) % config.views.length; view = config.views[frame]; }
      else if (id === 'G16') frame = (frame + 1) % config.frames;
      else if (id === 'G12') frame = Math.min(config.bars, frame + 1);
      else if (id === 'G17') frame = (frame + 1) % config.points;
      else if (id === 'G18') frame = Math.min(config.days, frame + 1);
      emit();
    }
    function play() {
      if (destroyed) return;
      clear(); state = 'playing'; emit();
      if (id === 'G9') timer = setInterval(step, config.duration);
      else if (id === 'G16' || id === 'G17') timer = setInterval(step, config.interval);
      else if (id === 'G12') timer = setInterval(() => { step(); if (frame >= config.bars) { clear(); state = 'complete'; emit(); } }, config.delay);
      else if (id === 'G18') timer = setInterval(() => { step(); if (frame >= config.days) { clear(); state = 'complete'; emit(); } }, config.duration / config.days);
      else timer = setTimeout(() => { state = 'complete'; emit(); }, config.duration || config.settle || config.interval);
    }
    function pause() { if (state === 'playing') { clear(); state = 'paused'; emit(); } }
    function stop() { clear(); frame = 0; view = config.views ? config.views[0] : null; state = 'stopped'; emit(); }
    function replay() { stop(); play(); }
    function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
    function destroy() { clear(); destroyed = true; listeners.clear(); state = 'destroyed'; }
    return { id, config, play, pause, stop, replay, step, subscribe, destroy, getState: () => ({ id, state, frame, view }) };
  }
  function queryController(nodes, edges) {
    const byId = new Map((nodes || []).map((n) => [n.id, n]));
    const adjacency = new Map();
    (edges || []).forEach((e) => { if (!adjacency.has(e.source)) adjacency.set(e.source, []); adjacency.get(e.source).push(e.target); });
    let focused = null, pinned = new Set();
    function focus(id) { if (!byId.has(id)) return null; focused = id; return snapshot(); }
    function pin(id) { if (!byId.has(id)) return null; pinned.has(id) ? pinned.delete(id) : pinned.add(id); return snapshot(); }
    function key(event) {
      if (!focused && event.key === 'ArrowRight' && nodes && nodes[0]) return focus(nodes[0].id);
      if (focused && event.key === 'Enter') return pin(focused);
      if (focused && event.key === 'ArrowRight') return focus((adjacency.get(focused) || [])[0] || focused);
      return snapshot();
    }
    function snapshot() { return { focused, pinned: Array.from(pinned), neighbors: focused ? (adjacency.get(focused) || []) : [] }; }
    return { focus, pin, key, snapshot };
  }
  function bindSvg(svg, ctl) {
    if (!svg || !ctl) return () => {};
    const update = (s) => { svg.setAttribute('data-pattern-state', s.state); svg.setAttribute('data-pattern-frame', String(s.frame)); if (s.view) svg.setAttribute('data-pattern-view', s.view); const label = svg.querySelector('[data-pattern-state-label]'); if (label) label.textContent = s.view ? `${s.state} · ${s.view}` : `${s.state} · frame ${s.frame}`; };
    const off = ctl.subscribe(update); update(ctl.getState());
    svg.addEventListener('keydown', (event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); ctl.getState().state === 'playing' ? ctl.pause() : ctl.play(); } });
    return off;
  }
  function bindQuery(container, query) {
    if (!container || !query) return () => {};
    const handler = (event) => { const node = event.target.closest('[data-node-id]'); if (node) query.focus(node.getAttribute('data-node-id')); if (event.key === 'Enter' && node) query.pin(node.getAttribute('data-node-id')); };
    container.addEventListener('click', handler); container.addEventListener('keydown', handler); return () => { container.removeEventListener('click', handler); container.removeEventListener('keydown', handler); };
  }
  root.DataPatternController = { DYNAMIC, controller, queryController, bindSvg, bindQuery };
  if (typeof module !== 'undefined') module.exports = root.DataPatternController;
})(typeof window !== 'undefined' ? window : globalThis);
