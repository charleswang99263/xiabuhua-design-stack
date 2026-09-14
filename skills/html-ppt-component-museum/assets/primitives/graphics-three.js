/* Project-owned Three adapter. WebGL is optional; fallback never reports GPU success. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.GraphicsThree = api;
})(typeof globalThis === 'object' ? globalThis : this, function (root) {
  'use strict';
  const runtime = root.GraphicsRuntime || (typeof require === 'function' ? require('./graphics-common.js') : null);

  function createGpuOwnership() {
    const entries = new Map();
    return {
      acquire(key, create) {
        let entry = entries.get(key);
        if (!entry) { entry = { resource: create(), refs: 0 }; entries.set(key, entry); }
        entry.refs += 1; return entry.resource;
      },
      release(key) {
        const entry = entries.get(key); if (!entry) return;
        entry.refs -= 1;
        if (entry.refs <= 0) { entry.resource?.dispose?.(); entries.delete(key); }
      },
      stats: () => ({ resources: entries.size, refs: [...entries.values()].reduce((total, entry) => total + entry.refs, 0) }),
      dispose() { for (const entry of entries.values()) entry.resource?.dispose?.(); entries.clear(); },
    };
  }

  const NODES = [
    { id: 'input', label: '输入', x: -1.45, y: .55, z: 0 },
    { id: 'context', label: '上下文', x: 0, y: 1.18, z: -.15 },
    { id: 'route', label: '路由', x: 1.45, y: .5, z: .15 },
    { id: 'answer', label: '回答', x: .85, y: -.85, z: .2 },
    { id: 'review', label: '复核', x: -.75, y: -.88, z: -.08 },
  ];
  const DEFAULT_EDGES = [['input', 'context'], ['context', 'route'], ['route', 'answer'], ['answer', 'review'], ['review', 'input']];

  function normalize(data) {
    const source = Array.isArray(data) ? data : data?.rows;
    return Array.isArray(source) && source.length
      ? source.map((row, i) => ({ ...NODES[i % NODES.length], ...row, id: String(row.id || NODES[i % NODES.length].id) }))
      : NODES.map((row) => ({ ...row }));
  }

  function edgePairs(rows, data) {
    const valid = new Set(rows.map((row) => row.id));
    const source = Array.isArray(data?.edges) ? data.edges : null;
    if (source) return source.map((edge) => Array.isArray(edge) ? edge : [edge.source, edge.target]).filter(([from, to]) => valid.has(from) && valid.has(to));
    const defaults = DEFAULT_EDGES.filter(([from, to]) => valid.has(from) && valid.has(to));
    if (defaults.length) return defaults;
    return rows.length > 1 ? rows.map((row, i) => [row.id, rows[(i + 1) % rows.length].id]) : [];
  }

  function mount(host, data, options = {}) {
    if (!host) throw new Error('GraphicsThree.mount 需要 host');
    const scope = runtime.createScope(host, options);
    const THREE = options.THREE === false ? null : (options.THREE || root.THREE);
    const wrapper = document.createElement('div'); wrapper.className = 'graphics-three-adapter'; host.append(wrapper);
    const frame = document.createElement('div'); frame.className = 'graphics-frame'; wrapper.append(frame);
    const canvas = document.createElement('canvas'); canvas.className = 'graphics-three-canvas'; canvas.setAttribute('aria-hidden', 'true'); frame.append(canvas);
    const status = document.createElement('p'); status.className = 'graphics-runtime-status'; wrapper.append(status);
    const live = document.createElement('p'); live.className = 'graphics-summary'; live.setAttribute('aria-live', 'polite'); wrapper.append(live);
    const controls = document.createElement('div'); controls.className = 'graphics-three-controls'; wrapper.append(controls);
    const owner = options.gpuOwnership || createGpuOwnership();
    let currentData = data; let rows = normalize(data); let edges = edgePairs(rows, data); let selected = null; let width = 640; let height = 360;
    let renderer = null; let scene = null; let camera = null; let group = null; let fallback = true; let disposed = false; let angle = 0; let api;
    let nodeGeometry = null; let lineMaterial = null;
    const nodeMap = new Map(); const lineMap = new Map(); const resourceKeys = new Set();
    const NODE_GEOMETRY_KEY = 'node-sphere-0.17'; const LINE_MATERIAL_KEY = 'edge-line';
    const setSummary = () => { const row = rows.find((item) => item.id === selected); live.textContent = row ? `已选 ${row.label}：空间节点，坐标 ${Number(row.x).toFixed(2)}, ${Number(row.y).toFixed(2)}, ${Number(row.z).toFixed(2)}。` : `Three 空间关系场：${rows.length} 个节点，${edges.length} 条连接。选择节点查看坐标。`; };
    const selectRow = (id) => { selected = rows.some((row) => row.id === id) ? id : null; setSummary(); paint(); };
    function rebuildControls() {
      controls.replaceChildren(...rows.map((row) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = row.label; button.dataset.id = row.id; button.setAttribute('aria-pressed', String(row.id === selected)); button.addEventListener('click', () => selectRow(row.id)); return button; }));
    }
    function acquireBaseResources() {
      if (nodeGeometry) return;
      nodeGeometry = owner.acquire(NODE_GEOMETRY_KEY, () => new THREE.SphereGeometry(.17, 16, 10)); resourceKeys.add(NODE_GEOMETRY_KEY);
      lineMaterial = owner.acquire(LINE_MATERIAL_KEY, () => new THREE.LineBasicMaterial({ color: 0x246c51, transparent: true, opacity: .75 })); resourceKeys.add(LINE_MATERIAL_KEY);
    }
    function syncScene() {
      if (selected && !rows.some((row) => row.id === selected)) selected = null;
      rebuildControls(); setSummary();
      if (fallback) { paint(); return; }
      acquireBaseResources();
      const nextIds = new Set(rows.map((row) => row.id));
      for (const [id, entry] of nodeMap) if (!nextIds.has(id)) { group.remove(entry.mesh); nodeMap.delete(id); owner.release(entry.materialKey); resourceKeys.delete(entry.materialKey); }
      rows.forEach((row) => { let entry = nodeMap.get(row.id); if (!entry) { const materialKey = `node-material-${row.id}`; const material = owner.acquire(materialKey, () => new THREE.MeshStandardMaterial({ color: 0x8fc5ec, roughness: .55, metalness: .1 })); resourceKeys.add(materialKey); const mesh = new THREE.Mesh(nodeGeometry, material); group.add(mesh); entry = { mesh, materialKey }; nodeMap.set(row.id, entry); } entry.mesh.position.set(Number(row.x) || 0, Number(row.y) || 0, Number(row.z) || 0); entry.mesh.userData = row; });
      const nextEdges = new Set(edges.map(([from, to]) => `${from}->${to}`));
      for (const [key, entry] of lineMap) if (!nextEdges.has(key)) { group.remove(entry.line); lineMap.delete(key); owner.release(entry.geometryKey); resourceKeys.delete(entry.geometryKey); }
      const byId = new Map(rows.map((row) => [row.id, row]));
      edges.forEach(([from, to]) => { const key = `${from}->${to}`; const a = byId.get(from), b = byId.get(to); if (!a || !b) return; const points = [new THREE.Vector3(Number(a.x) || 0, Number(a.y) || 0, Number(a.z) || 0), new THREE.Vector3(Number(b.x) || 0, Number(b.y) || 0, Number(b.z) || 0)]; let entry = lineMap.get(key); if (!entry) { const geometryKey = `edge-${key}`; const geometry = owner.acquire(geometryKey, () => new THREE.BufferGeometry().setFromPoints(points)); resourceKeys.add(geometryKey); entry = { line: new THREE.Line(geometry, lineMaterial), geometryKey }; group.add(entry.line); lineMap.set(key, entry); } else entry.line.geometry.setFromPoints(points); });
      paint();
    }
    function initThree() {
      if (!THREE || !THREE.WebGLRenderer) { status.textContent = '降级：Three.js 依赖不可用，使用 2D Canvas 投影'; return false; }
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2)); renderer.setClearColor(0xf5f5f0, 1);
        scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(35, 1, .1, 100); camera.position.set(0, .15, 6.2); camera.lookAt(0, 0, 0); scene.add(new THREE.AmbientLight(0xffffff, 1.4)); const keyLight = new THREE.DirectionalLight(0xffd1b4, 2.1); keyLight.position.set(2, 3, 4); scene.add(keyLight); group = new THREE.Group(); scene.add(group); fallback = false; status.textContent = 'GPU：Three.js WebGLRenderer 已启用'; return true;
      } catch (error) { status.textContent = `降级：WebGL 不可用（${error?.message || '初始化失败'}）`; renderer?.dispose?.(); renderer = null; for (const key of resourceKeys) owner.release(key); resourceKeys.clear(); nodeGeometry = null; lineMaterial = null; nodeMap.clear(); lineMap.clear(); group?.clear?.(); return false; }
    }
    function project(row) { const scale = Math.min(width, height) * .105; const c = Math.cos(angle), s = Math.sin(angle); const x = row.x * c - row.z * s; const z = row.x * s + row.z * c; return { x: width / 2 + x * scale, y: height / 2 - row.y * scale + z * 3, z }; }
    function fallbackPaint() { const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, width, height); const map = new Map(rows.map((row) => [row.id, project(row)])); ctx.strokeStyle = '#246c51'; ctx.lineWidth = 2; edges.forEach(([a, b]) => { if (!map.has(a) || !map.has(b)) return; ctx.beginPath(); ctx.moveTo(map.get(a).x, map.get(a).y); ctx.lineTo(map.get(b).x, map.get(b).y); ctx.stroke(); }); rows.forEach((row) => { const p = map.get(row.id); ctx.fillStyle = row.id === selected ? '#dd4928' : '#20241f'; ctx.beginPath(); ctx.arc(p.x, p.y, row.id === selected ? 12 : 8, 0, Math.PI * 2); ctx.fill(); }); }
    function paint() { if (disposed) return; controls.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.id === selected))); if (fallback) fallbackPaint(); else { nodeMap.forEach((entry) => { entry.mesh.material.color.set(entry.mesh.userData.id === selected ? 0xdd4928 : 0x8fc5ec); entry.mesh.scale.setScalar(entry.mesh.userData.id === selected ? 1.25 : 1); }); renderer.render(scene, camera); } }
    function animate(dt) { if (disposed || fallback) return; angle += dt * .00035; group.rotation.y = angle; renderer.render(scene, camera); }
    function update(next) { if (next !== undefined && next !== null) currentData = next; rows = normalize(currentData); edges = edgePairs(rows, currentData); syncScene(); return api; }
    function resize(nextWidth, nextHeight) { width = Math.max(260, Number(nextWidth) || width); height = Math.max(180, Number(nextHeight) || height); canvas.width = Math.floor(width * Math.min(root.devicePixelRatio || 1, 2)); canvas.height = Math.floor(height * Math.min(root.devicePixelRatio || 1, 2)); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; if (renderer) { renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); } paint(); return api; }
    function pause() { scope.pause?.(); }
    function resume() { scope.resume?.(); }
    function dispose() { if (disposed) return; disposed = true; scope.pause?.(); renderer?.setAnimationLoop?.(null); lineMap.clear(); nodeMap.clear(); for (const key of resourceKeys) owner.release(key); resourceKeys.clear(); renderer?.dispose?.(); renderer = null; canvas.remove(); wrapper.replaceChildren(); wrapper.remove(); scope.dispose(); if (!options.gpuOwnership) owner.dispose(); }
    initThree(); api = { update, resize, pause, resume, dispose, normalized: () => rows.map((row) => ({ ...row })), summary: () => live.textContent, status: () => status.textContent, gpu: () => !fallback, sceneGraph: () => ({ nodes: nodeMap.size || rows.length, edges: lineMap.size || edges.length }), gpuOwnership: owner, element: wrapper, scope }; syncScene(); resize(); if (!fallback) scope.loop(animate); runtime.installResize(frame, scope, resize); paint(); return api;
  }
  return { mount, normalize, edgePairs, createGpuOwnership };
});
