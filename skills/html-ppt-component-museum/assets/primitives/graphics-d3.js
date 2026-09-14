/* Project-owned D3 adapter: data meaning stays in SVG + HTML, not in a canvas. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.GraphicsD3 = api;
})(typeof globalThis === 'object' ? globalThis : this, function (root) {
  'use strict';
  const runtime = root.GraphicsRuntime || (typeof require === 'function' ? require('./graphics-common.js') : null);

  function normalize(data) {
    const rows = Array.isArray(data) ? data : (data?.rows || []);
    return rows.map((row, index) => ({
      id: String(row?.id ?? `row-${index}`),
      label: String(row?.label ?? row?.id ?? `项目 ${index + 1}`),
      value: row?.value === null || row?.value === undefined || row?.value === '' || row?.value === 'unknown' ? null : (Number.isFinite(Number(row?.value)) ? Number(row.value) : null),
      unit: data?.unit || row?.unit || '',
    }));
  }

  function summary(rows, title = 'D3 数据图') {
    const values = rows.filter((row) => row.value != null);
    const peak = values.slice().sort((a, b) => b.value - a.value)[0];
    return `${title}：${rows.length} 项，${values.length} 项有数值${peak ? `；最高为 ${peak.label} ${peak.value}${peak.unit ? ` ${peak.unit}` : ''}` : ''}。未知值保留为未知。`;
  }

  function mount(host, data, options = {}) {
    if (!host) throw new Error('GraphicsD3.mount 需要 host');
    const scope = runtime.createScope(host, options);
    const d3Candidate = options.d3 === false ? null : (options.d3 || root.d3);
    const d3 = d3Candidate && typeof d3Candidate.scaleBand === 'function' && typeof d3Candidate.axisBottom === 'function' ? d3Candidate : null;
    const wrapper = document.createElement('div');
    wrapper.className = 'graphics-d3-adapter';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img'); svg.setAttribute('tabindex', '0');
    const titleNode = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    const descNode = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    svg.append(titleNode, descNode);
    const frame = document.createElement('div'); frame.className = 'graphics-frame'; frame.append(svg);
    const live = document.createElement('p'); live.className = 'graphics-summary'; live.setAttribute('aria-live', 'polite');
    const table = document.createElement('div'); table.className = 'graphics-data-list';
    wrapper.append(frame, live, table); host.append(wrapper);
    let rows = normalize(data);
    let selected = null;
    let width = 640, height = 320;
    const margin = { top: 24, right: 18, bottom: 58, left: 52 };
    const updateSummary = () => {
      const head = data?.title || options.title || 'D3 数据图';
      const selectedRow = rows.find((row) => row.id === selected);
      live.textContent = selectedRow ? `${selectedRow.label}：${runtime.textValue(selectedRow.value, selectedRow.unit)}。` : summary(rows, head);
      titleNode.textContent = head;
      descNode.textContent = live.textContent;
      table.replaceChildren(...rows.map((row) => {
        const item = document.createElement('button');
        item.type = 'button'; item.className = 'graphics-data-row'; item.dataset.id = row.id;
        item.textContent = `${row.label}：${runtime.textValue(row.value, row.unit)}`;
        item.setAttribute('aria-pressed', String(row.id === selected));
        item.addEventListener('click', () => { selected = row.id; updateSummary(); paint(); });
        return item;
      }));
    };
    function paint() {
      if (!d3) { paintFallback(); return; }
      const innerWidth = Math.max(1, width - margin.left - margin.right);
      const innerHeight = Math.max(1, height - margin.top - margin.bottom);
      const finite = rows.filter((row) => row.value != null).map((row) => row.value);
      const extent = finite.length ? [Math.min(0, Math.min(...finite)), Math.max(0, Math.max(...finite))] : [0, 1];
      if (extent[0] === extent[1]) extent[1] = extent[0] + 1;
      const x = d3.scaleBand().domain(rows.map((row) => row.id)).range([0, innerWidth]).padding(.2);
      const y = d3.scaleLinear().domain(extent).nice().range([innerHeight, 0]);
      const select = d3.select(svg).attr('viewBox', `0 0 ${width} ${height}`);
      select.selectAll('g.runtime-grid').data([0]).join('g').attr('class', 'runtime-grid')
        .attr('transform', `translate(${margin.left},${margin.top})`).call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth).tickFormat(''));
      select.selectAll('g.runtime-x').data([0]).join('g').attr('class', 'runtime-x')
        .attr('transform', `translate(${margin.left},${margin.top + innerHeight})`).call(d3.axisBottom(x).tickFormat((id) => rows.find((row) => row.id === id)?.label || id));
      select.selectAll('g.runtime-y').data([0]).join('g').attr('class', 'runtime-y')
        .attr('transform', `translate(${margin.left},${margin.top})`).call(d3.axisLeft(y).ticks(4));
      const marks = select.selectAll('rect.runtime-mark').data(rows, (row) => row.id).join(
        (enter) => enter.append('rect').attr('class', 'runtime-mark').attr('rx', 2),
        (update) => update,
        (exit) => exit.interrupt('runtime-update').remove(),
      ).attr('tabindex', 0).attr('role', 'img').attr('aria-label', (row) => `${row.label}：${runtime.textValue(row.value, row.unit)}`)
        .on('click', (_, row) => { selected = row.id; updateSummary(); paint(); })
        .on('focus', (_, row) => { selected = row.id; updateSummary(); });
      const target = scope.reduced() ? marks : marks.transition('runtime-update').duration(220);
      target.attr('x', (row) => margin.left + x(row.id)).attr('width', x.bandwidth())
        .attr('y', (row) => row.value == null ? margin.top + innerHeight : margin.top + Math.min(y(row.value), y(0)))
        .attr('height', (row) => row.value == null ? 5 : Math.max(2, Math.abs(y(row.value) - y(0))))
        .attr('fill', (row) => row.id === selected ? 'var(--accent)' : row.value == null ? 'var(--line)' : 'var(--accent2)')
        .attr('opacity', (row) => row.value == null ? .45 : 1);
    }
    function paintFallback() {
      svg.replaceChildren(titleNode, descNode);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const ns = 'http://www.w3.org/2000/svg'; const max = Math.max(1, ...rows.map((row) => Math.abs(row.value || 0)));
      const zeroY = height - 40;
      rows.forEach((row, i) => {
        const rect = document.createElementNS(ns, 'rect'); rect.setAttribute('class', 'runtime-mark');
        const magnitude = row.value == null ? 5 : Math.max(2, Math.abs(row.value) / max * (height - 100));
        const y = row.value == null ? zeroY : row.value < 0 ? zeroY : zeroY - magnitude;
        rect.setAttribute('x', String(56 + i * ((width - 72) / Math.max(1, rows.length)))); rect.setAttribute('y', String(y));
        rect.setAttribute('width', String(Math.max(8, (width - 72) / Math.max(1, rows.length) * .64))); rect.setAttribute('height', String(magnitude)); rect.setAttribute('fill', row.id === selected ? 'var(--accent)' : row.value == null ? 'var(--line)' : 'var(--accent2)'); svg.append(rect);
      });
    }
    function update(next) { data = next || data; rows = normalize(data); selected = rows.some((row) => row.id === selected) ? selected : null; updateSummary(); paint(); return api; }
    function resize(nextWidth, nextHeight) { width = Math.max(260, Number(nextWidth) || width); height = Math.max(200, Number(nextHeight) || height); paint(); return api; }
    function pause() { scope.pause?.(); }
    function resume() { scope.resume?.(); }
    function dispose() { svg.querySelectorAll('*').forEach((node) => node.__d3__?.interrupt?.('runtime-update')); d3 && d3.select(svg).selectAll('*').interrupt('runtime-update').interrupt(); scope.dispose(); wrapper.remove(); }
    const api = { update, resize, pause, resume, dispose, summary: () => summary(rows, data?.title || options.title), normalized: () => rows.map((row) => ({ ...row })), scope, element: wrapper };
    runtime.installResize(frame, scope, resize); update(data); return api;
  }
  return { mount, normalize, summary };
});
