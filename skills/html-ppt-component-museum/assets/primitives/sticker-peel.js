/*
 * Sticker Peel geometry repair.
 *
 * This is a project-owned helper. It does not copy the implementation of any
 * external component. The museum can either require this file in a local test
 * or copy the exported strings/object into its single-file runtime.
 */
(function factory(root, make) {
  const api = make();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PEEL_FIX = api;
})(typeof globalThis === 'object' ? globalThis : this, function makePeelFix() {
  const EPSILON = 1e-7;

  const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
  const fmt = (value) => Number(value.toFixed(3));
  const point = (x, y) => ({ x: fmt(x), y: fmt(y) });
  const pointList = (points) => points.map((p) => `${p.x},${p.y}`).join(' ');

  const samePoint = (a, b, tolerance = 0.001) => Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance;
  const dedupe = (points) => points.filter((p, i) => i === 0 || !samePoint(p, points[i - 1]));

  function clipPolygon(input, inside, intersection) {
    if (!input.length) return [];
    const output = [];
    let previous = input[input.length - 1];
    let previousInside = inside(previous);
    for (const current of input) {
      const currentInside = inside(current);
      if (currentInside !== previousInside) output.push(intersection(previous, current));
      if (currentInside) output.push(current);
      previous = current;
      previousInside = currentInside;
    }
    return dedupe(output.map((p) => point(p.x, p.y)));
  }

  function clipToRect(points, width, height) {
    let result = points;
    const edges = [
      [(p) => p.x >= -EPSILON, (a, b) => point(0, a.y + ((0 - a.x) / (b.x - a.x)) * (b.y - a.y))],
      [(p) => p.x <= width + EPSILON, (a, b) => point(width, a.y + ((width - a.x) / (b.x - a.x)) * (b.y - a.y))],
      [(p) => p.y >= -EPSILON, (a, b) => point(a.x + ((0 - a.y) / (b.y - a.y)) * (b.x - a.x), 0)],
      [(p) => p.y <= height + EPSILON, (a, b) => point(a.x + ((height - a.y) / (b.y - a.y)) * (b.x - a.x), height)],
    ];
    for (const [inside, intersection] of edges) {
      result = clipPolygon(result, inside, (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        // Axis-parallel edges can have a zero denominator only when both points
        // are on the same boundary; such segments never cross this clip edge.
        if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) return a;
        return intersection(a, b);
      });
    }
    return result;
  }

  function polygonArea(points) {
    if (points.length < 3) return 0;
    let twice = 0;
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      twice += a.x * b.y - b.x * a.y;
    }
    return Math.abs(twice) / 2;
  }

  function creaseIntersections(width, height, t) {
    const rectangle = [point(0, 0), point(width, 0), point(width, height), point(0, height)];
    const hits = [];
    for (let i = 0; i < rectangle.length; i += 1) {
      const a = rectangle[i];
      const b = rectangle[(i + 1) % rectangle.length];
      const sa = a.x + a.y - t;
      const sb = b.x + b.y - t;
      if (Math.abs(sa) <= EPSILON) hits.push(a);
      if (sa * sb < -EPSILON * EPSILON) {
        const ratio = sa / (sa - sb);
        hits.push(point(a.x + ratio * (b.x - a.x), a.y + ratio * (b.y - a.y)));
      }
    }
    const unique = dedupe(hits.sort((a, b) => a.x - b.x || a.y - b.y));
    if (unique.length === 1) return [unique[0], unique[0]];
    return unique.slice(0, 2);
  }

  /**
   * One diagonal crease controls every visible polygon.
   *
   * The remaining face is the rectangle half-plane x+y <= t. The lower-right
   * area x+y >= t is reflected over x+y=t for the folded back. This makes the
   * whole rectangle sweep from closed (t=w+h) to open (t=0), including wide
   * hosts where a fixed min(width,height) triangle would be too small.
   */
  function geometry(width, height, progress) {
    const w = Math.max(1, Number(width) || 1);
    const h = Math.max(1, Number(height) || 1);
    const p = clamp01(progress);
    const t = (w + h) * (1 - p);
    const rectangle = [point(0, 0), point(w, 0), point(w, h), point(0, h)];
    const face = clipPolygon(
      rectangle,
      (q) => q.x + q.y <= t + EPSILON,
      (a, b) => {
        const ratio = (t - (a.x + a.y)) / ((b.x + b.y) - (a.x + a.y));
        return point(a.x + ratio * (b.x - a.x), a.y + ratio * (b.y - a.y));
      },
    );
    const removed = clipPolygon(
      rectangle,
      (q) => q.x + q.y >= t - EPSILON,
      (a, b) => {
        const ratio = (t - (a.x + a.y)) / ((b.x + b.y) - (a.x + a.y));
        return point(a.x + ratio * (b.x - a.x), a.y + ratio * (b.y - a.y));
      },
    );
    const reflectedRemoved = removed.map((q) => point(t - q.y, t - q.x));
    const foldBack = clipToRect(reflectedRemoved, w, h);
    const crease = creaseIntersections(w, h, t);
    return {
      width: fmt(w),
      height: fmt(h),
      progress: fmt(p),
      sweep: fmt(t),
      closed: p <= EPSILON,
      crease,
      face,
      reveal: removed,
      foldBack,
      reflection: reflectedRemoved,
    };
  }

  function cssPolygon(points, width, height) {
    const safePoints = points.length ? points : [{ x: 0, y: 0 }];
    return `polygon(${safePoints.map((p) => `${fmt((p.x / width) * 100)}% ${fmt((p.y / height) * 100)}%`).join(', ')})`;
  }

  // All selectors are prefixed so this repair can coexist with the museum's
  // legacy .sticker-* specimen while the parent integrates the replacement.
  const css = String.raw`
.peel-fix-root .peel-fix-object{position:relative;isolation:isolate;touch-action:none;user-select:none;height:302px;margin:5px 12px;overflow:visible;cursor:grab}
.peel-fix-root .peel-fix-object.dragging{cursor:grabbing}
.peel-fix-root .peel-fix-under{position:absolute;inset:9px;background:var(--surface);border:1px solid var(--line);padding:25px;display:flex;flex-direction:column;justify-content:center;transform:rotate(-2deg);overflow:hidden}
.peel-fix-root .peel-fix-under h4{font:650 24px var(--display);margin:12px 0}
.peel-fix-root .peel-fix-under p{font-size:12px;color:var(--muted);line-height:1.8}
.peel-fix-root .peel-fix-paper{position:absolute;inset:0;background:#f1c959;color:#3e3321;box-shadow:4px 10px 15px #352b2025;padding:26px;z-index:2;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}
.peel-fix-root .peel-fix-paper:after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#6a52120a 0px,#6a52120a 1px,transparent 1px,transparent 5px)}
.peel-fix-root .peel-fix-paper .paper-stamp{font:10px var(--mono);border:1px solid #5c4b2c;padding:5px 8px;display:inline-block;transform:rotate(-5deg)}
.peel-fix-root .peel-fix-paper h4{font:650 33px/1.2 var(--display);letter-spacing:-.04em;margin:32px 0 18px}
.peel-fix-root .peel-fix-paper p{font-size:12px;line-height:1.8;color:#6c593a;max-width:220px}
.peel-fix-root .peel-fix-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4}
.peel-fix-root .peel-fix-reveal{fill:none;opacity:0}
.peel-fix-root .peel-fix-fold{fill:url(#peel-fix-fold-gradient);filter:drop-shadow(3px 7px 5px #352b2035);opacity:0;transform-origin:100% 100%}
.peel-fix-root .peel-fix-crease{stroke:#8d7021aa;stroke-width:1.5;stroke-dasharray:4 3;opacity:0}
.peel-fix-root .peel-fix-object[data-peel-open="true"] .peel-fix-reveal,.peel-fix-root .peel-fix-object[data-peel-open="true"] .peel-fix-fold,.peel-fix-root .peel-fix-object[data-peel-open="true"] .peel-fix-crease{opacity:1}
.peel-fix-root .peel-fix-help h4{font:650 22px var(--display);margin:12px 0}
.peel-fix-root .peel-fix-help p{font-size:12px;color:var(--muted);line-height:1.9}
@media(max-width:1120px){.peel-fix-root .peel-fix-object{margin:5px 8px}.peel-fix-root .peel-fix-paper h4{font-size:28px}}
@media(max-width:580px){.peel-fix-root .peel-fix-object{height:295px;margin:5px}.peel-fix-root .peel-fix-help{padding:10px 8px}.peel-fix-root .peel-fix-paper h4{font-size:28px}}
@media(prefers-reduced-motion:reduce){.peel-fix-root .peel-fix-fold{filter:none}}
`;

  const noteMarkup = () => `
<div class="peel-fix-under"><span class="eyebrow">UNDER THE SURFACE</span><h4>保留一点<br>探索的余地。</h4><p>用于轻松叙事中的补充说明。<br>关键操作、风险和必读规则不应藏在贴纸后。</p></div>`;

  function render(data, helpers) {
    const d = data || { peel: 0 };
    d.peel = Math.max(0, Math.min(100, Number(d.peel) || 0));
    const button = helpers && helpers.button
      ? helpers.button(d.peel > 50 ? '合上贴纸' : '剥离贴纸', 'peel', '', 'primary')
      : '<button class="primary" data-peel>剥离贴纸</button>';
    const actions = helpers && helpers.actions ? helpers.actions(button) : `<div class="demo-actions">${button}</div>`;
    const fallbackHead = '<div class="demo-head"><div><div class="eyebrow">MATERIAL / OPTIONAL REVEAL</div><h3>有些注释，适合亲手揭开</h3><p>拖动纸张右下角，或点击剥离。重要任务信息应直接可见。</p></div><span class="tag">原创纸张实验</span></div>';
    return `<div class="demo peel-fix-root">${helpers && helpers.head ? helpers.head('MATERIAL / OPTIONAL REVEAL', '有些注释，适合亲手揭开', '拖动纸张右下角，或点击剥离。重要任务信息应直接可见。', '原创纸张实验') : fallbackHead}<div class="sticker-layout"><div class="peel-fix-object" tabindex="0" role="button" aria-label="剥离或合上贴纸" aria-expanded="${d.peel > 50}" data-peel-open="${d.peel > 0}" data-peel-value="${d.peel}">${noteMarkup()}<div class="peel-fix-paper"><span class="paper-stamp">FIELD NOTE / 07</span><h4>有一条旁注，<br>等你发现。</h4><p>从右下角慢慢揭开<br>或使用下方按钮</p></div><svg class="peel-fix-svg" aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none"><defs><linearGradient id="peel-fix-fold-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e1b340"/><stop offset=".47" stop-color="#fff0bb"/><stop offset=".5" stop-color="#8d702152"/><stop offset=".52" stop-color="#8d702100"/></linearGradient></defs><polygon class="peel-fix-reveal" data-peel-reveal/><polygon class="peel-fix-fold" data-peel-fold/><line class="peel-fix-crease" data-peel-crease/></svg></div><div class="peel-fix-help"><div class="eyebrow">DRAG / TAP / KEYBOARD</div><h4>纸张折角，<br>承接手势的进度。</h4><p>剥离比例跟随拖动距离。松手后保持当前状态，随时可以合上再看一次。</p>${actions}</div></div></div>`;
  }

  function setup(root, data, scope, options) {
    const obj = root && root.querySelector('.peel-fix-object');
    if (!obj || !scope) return;
    const paper = obj.querySelector('.peel-fix-paper');
    const svg = obj.querySelector('.peel-fix-svg');
    const reveal = obj.querySelector('[data-peel-reveal]');
    const fold = obj.querySelector('[data-peel-fold]');
    const crease = obj.querySelector('[data-peel-crease]');
    const button = root.querySelector('[data-peel]');
    let drag = null;
    let moved = false;
    let lastGeometry = geometry(1, 1, data.peel / 100);
    const announce = (text) => {
      const report = options && options.report;
      if (typeof report === 'function') report(text);
      else if (typeof globalThis.report === 'function') globalThis.report(text);
    };
    const live = () => !root.closest('.static-mode') && obj.getAttribute('aria-disabled') !== 'true' && !root.classList.contains('is-paused') && !root.classList.contains('is-suspended');
    const paint = (raw) => {
      const rect = obj.getBoundingClientRect ? obj.getBoundingClientRect() : { width: 1, height: 1 };
      const width = Math.max(1, rect.width || obj.clientWidth || 1);
      const height = Math.max(1, rect.height || obj.clientHeight || 1);
      const p = clamp01((Number(raw) || 0) / 100);
      const g = geometry(width, height, p);
      lastGeometry = g;
      data.peel = Math.round(p * 100 * 100) / 100;
      obj.dataset.peelValue = String(data.peel);
      obj.dataset.peelOpen = String(p > EPSILON);
      obj.setAttribute('aria-expanded', String(data.peel > 50));
      if (paper) paper.style.clipPath = cssPolygon(g.face, g.width, g.height);
      if (svg) svg.setAttribute('viewBox', `0 0 ${g.width} ${g.height}`);
      if (reveal) reveal.setAttribute('points', pointList(g.reveal));
      if (fold) fold.setAttribute('points', pointList(g.foldBack));
      if (crease) {
        crease.setAttribute('x1', String(g.crease[0].x));
        crease.setAttribute('y1', String(g.crease[0].y));
        crease.setAttribute('x2', String(g.crease[1].x));
        crease.setAttribute('y2', String(g.crease[1].y));
      }
      if (button) button.textContent = data.peel > 50 ? '合上贴纸' : '剥离贴纸';
    };
    const set = (value, shouldAnnounce = true) => {
      if (!live()) return;
      const next = Math.max(0, Math.min(100, Number(value) || 0));
      paint(next);
      if (shouldAnnounce) announce(`贴纸已揭开 ${Math.round(next)}%。${next > 50 ? '底层旁注可见：重要信息不应藏在可选交互后。' : '拖动或点击可揭示补充内容。'}`);
    };
    let cancelTween = null, tweenTarget = null;
    const stopTween = () => { cancelTween?.(); cancelTween = null; tweenTarget = null; };
    const toggle = () => {
      const target = tweenTarget === null ? (data.peel > 50 ? 0 : 100) : 100 - tweenTarget;
      stopTween(); tweenTarget = target;
      const reduced = options?.isReduced?.() || matchMedia('(prefers-reduced-motion:reduce)').matches;
      if (reduced || !scope.clock) { set(target); return; }
      const from = data.peel, start = scope.clock();
      const advance = () => {
        if (options?.isReduced?.()) { paint(target); stopTween(); return; }
        const t = Math.min(1, (scope.clock() - start) / 420);
        paint(from + (target - from) * (1 - Math.pow(1 - t, 3)));
        if (t < 1) cancelTween = scope.schedule(24, advance);
        else { stopTween(); set(target); }
      };
      cancelTween = scope.schedule(0, advance);
    };
    const onKey = (event) => {
      if (!live()) return;
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); return; }
      stopTween();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); set(data.peel + 10); return; }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); set(data.peel - 10); return; }
      if (event.key === 'Home') { event.preventDefault(); set(0); return; }
      if (event.key === 'End') { event.preventDefault(); set(100); }
    };
    const onDown = (event) => {
      if (!live() || (event.button !== undefined && event.button !== 0)) return;
      stopTween();
      moved = false;
      drag = { x: event.clientX, y: event.clientY, peel: data.peel };
      obj.classList.add('dragging');
      try { obj.setPointerCapture(event.pointerId); } catch (_) { /* Safari may omit capture for synthetic events. */ }
    };
    const onMove = (event) => {
      if (!drag || !live()) return;
      const dx = (drag.x - event.clientX) / Math.max(1, obj.clientWidth || lastGeometry.width);
      const dy = (drag.y - event.clientY) / Math.max(1, obj.clientHeight || lastGeometry.height);
      if (Math.abs(dx) + Math.abs(dy) > 0.025) moved = true;
      // Equal normalized axes keep the gesture diagonal on both wide and tall boxes.
      set(drag.peel + ((dx + dy) / 2) * 100, false);
    };
    const onEnd = () => { drag = null; obj.classList.remove('dragging'); };
    scope.on(button, 'click', toggle);
    scope.on(obj, 'click', () => { if (!moved) toggle(); moved = false; });
    scope.on(obj, 'keydown', onKey);
    scope.on(obj, 'pointerdown', onDown);
    scope.on(obj, 'pointermove', onMove);
    scope.on(obj, 'pointerup', onEnd);
    scope.on(obj, 'pointercancel', onEnd);
    scope.on(obj, 'lostpointercapture', onEnd);
    scope.on(window, 'resize', () => paint(data.peel));
    scope.on(document, 'museum-theme', () => paint(data.peel));
    scope.on(document, 'museum-motion', () => paint(data.peel));
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => paint(data.peel)) : null;
    observer && observer.observe(obj);
    scope.cleanup(() => { stopTween(); drag = null; obj.classList.remove('dragging'); observer && observer.disconnect(); });
    paint(data.peel);
  }

  const registry = {
    id: 'sticker-peel',
    type: 'sticker',
    initial: () => ({ peel: 0 }),
    render: (data, helpers) => render(data, helpers),
    setup,
  };

  function assert(condition, message) {
    if (!condition) throw new Error(`peel geometry invariant failed: ${message}`);
  }
  function runGeometryTests() {
    const sizes = [[480, 302], [302, 480], [302, 302]];
    const progresses = [0, 0.1, 0.5, 0.9, 1];
    let count = 0;
    for (const [w, h] of sizes) for (const p of progresses) {
      const g = geometry(w, h, p);
      const all = [...g.face, ...g.reveal, ...g.foldBack, ...g.crease];
      all.forEach((q) => assert(q.x >= -EPSILON && q.x <= w + EPSILON && q.y >= -EPSILON && q.y <= h + EPSILON, `${w}x${h} p=${p} point ${q.x},${q.y} out of bounds`));
      const has = (points, target) => points.some((q) => samePoint(q, target, 0.01));
      g.crease.forEach((q) => {
        assert(has(g.face, q), `${w}x${h} p=${p} face misses crease point`);
        assert(has(g.reveal, q), `${w}x${h} p=${p} reveal misses crease point`);
        assert(has(g.foldBack, q), `${w}x${h} p=${p} fold misses crease point`);
      });
      const faceArea = polygonArea(g.face);
      const revealArea = polygonArea(g.reveal);
      assert(Math.abs(faceArea + revealArea - w * h) < Math.max(0.1, w * h * 0.00002), `${w}x${h} p=${p} face/reveal area mismatch`);
      if (p === 0) assert(g.closed && revealArea === 0 && polygonArea(g.foldBack) === 0, 'closed fold must be degenerate');
      if (p === 1) assert(faceArea === 0 && Math.abs(revealArea - w * h) < 0.1, 'full open must reveal the whole host');
      count += 1;
    }
    return { passed: count, sizes, progresses };
  }

  return { EPSILON, clamp01, geometry, css, render, setup, registry, polygonArea, runGeometryTests };
});

// Plain Node verification: node design-stack-v4/research/peel-fix.js
if (typeof module === 'object' && module.exports && require.main === module) {
  const result = module.exports.runGeometryTests();
  console.log(`peel geometry invariants: ${result.passed} cases passed`);
}
