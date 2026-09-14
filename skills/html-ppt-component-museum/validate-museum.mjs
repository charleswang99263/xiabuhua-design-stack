import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('./assets/component-museum.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'one inspectable standalone runtime');
const script = scripts[0][1];
new vm.Script(script, { filename: 'component-museum.inline.js' });
const context = { matchMedia: () => ({ matches: false }), console };
vm.createContext(context);
const end = script.indexOf('function renderCatalog()');
assert.ok(end > 0, 'explicit runtime boundary exists');
vm.runInContext(`${script.slice(0, end)}\nglobalThis.test = { LOGIC, C, GROUPS, REGISTRY, S, SPACE_NODES, SPACE_EDGES, createScope, TEXT_ENTRY_POLICY, MuseumTextEntry, PEEL_FIX };`, context);
const { LOGIC: logic, C: records, GROUPS: groups, REGISTRY: registry, S: state } = context.test;
const native = value => JSON.parse(JSON.stringify(value));
let checks = 0;
function check(name, run) { run(); checks++; console.log(`PASS ${name}`); }

check('metric values, labels and units retain their fixed datasets', () => {
  assert.deepEqual(native(logic.metric('访客')), [54, 76, 42]);
  assert.deepEqual(native(logic.metric('转化')), [31, 62, 48]);
  assert.deepEqual(native(logic.metric('留存')), [72, 55, 41]);
  assert.deepEqual(native(logic.metricLabels('留存')), ['D1', 'D7', 'D30']);
});
check('radar has a common zero and proportional radii for every point', () => {
  assert.deepEqual(native(logic.radarPoint(100, 0)), [150, 25]);
  assert.deepEqual(native(logic.radarPoint(0, 3)), [150, 75]);
  for (const name of ['Alpha', 'Beta']) for (let i = 0; i < 5; i++) {
    const value = logic.radarValues(name)[i];
    const [x, y] = logic.radarPoint(value, i, 101, [190, 145]);
    assert.ok(Math.abs(Math.hypot(x - 190, y - 145) - value * 1.01) < 1e-8);
  }
  assert.deepEqual(native(logic.radarValues('Alpha')), [72, 81, 66, 74, 58]);
  assert.deepEqual(native(logic.radarValues('Beta')), [51, 92, 80, 56, 71]);
});
check('Sankey conserves both splits and line widths encode only people', () => {
  const [activated, inactive, retained, churned] = logic.flow;
  assert.equal(activated.value + inactive.value, 1000);
  assert.equal(retained.value + churned.value, activated.value);
  assert.equal(logic.flowWidth(600) / logic.flowWidth(400), 1.5);
  assert.equal(logic.flowWidth(420) + logic.flowWidth(180), logic.flowWidth(600));
  const span = edge => { const y = Number(edge.path.match(/^M[\d.]+ ([\d.]+)/)[1]); const half = logic.flowWidth(edge.value) / 2; return [y - half, y + half]; };
  assert.deepEqual(span(activated), [85, 145]);
  assert.deepEqual(span(inactive), [145, 185]);
  assert.deepEqual(span(retained), [61, 103]);
  assert.deepEqual(span(churned), [103, 121]);
});
check('matrix honors the exact threshold including equality', () => {
  assert.equal(logic.matrix(70, 40), '高价值待验证');
  assert.equal(logic.matrix(70, 70), '优先验证');
  assert.equal(logic.matrix(60, 70), '先收集证据');
  assert.equal(logic.matrix(70, 60), '高价值待验证');
});
check('local votes add exactly one and preserve caller state', () => {
  const initial = { A: 42, B: 31, C: 27 };
  assert.deepEqual(native(logic.vote(initial, 'B')), { A: 42, B: 32, C: 27 });
  assert.deepEqual(initial, { A: 42, B: 31, C: 27 });
  assert.deepEqual(native(logic.vote(initial, 'unknown')), initial);
});
check('reordering moves real objects and respects first/last boundaries', () => {
  const initial = ['input', 'feedback', 'motion'];
  assert.deepEqual(native(logic.reorder(initial, 'feedback', -1)), ['feedback', 'input', 'motion']);
  assert.deepEqual(native(logic.reorder(initial, 'input', -1)), initial);
  assert.deepEqual(native(logic.reorder(initial, 'motion', 1)), initial);
  assert.deepEqual(native(logic.promote(initial, 'motion')), ['motion', 'input', 'feedback']);
  assert.deepEqual(initial, ['input', 'feedback', 'motion']);
});
check('physics capacity is eight; rejecting input preserves the item set', () => {
  let balls = registry.physics.initial().balls;
  const initial = native(balls);
  for (let i = 0; i < 12; i++) balls = logic.addBall(balls);
  assert.equal(balls.length, 8);
  assert.deepEqual(native(balls.slice(0, 3)), initial);
  assert.equal(new Set(balls.map(x => x.label)).size, 8);
  assert.deepEqual(native(logic.addBall(balls)), native(balls));
});
check('circle collision separates overlap and exchanges approaching velocity', () => {
  const balls = [{ x: .4, y: .5, vx: .01, vy: 0 }, { x: .43, y: .5, vx: -.01, vy: 0 }];
  assert.equal(logic.collide(balls, 600, 340, 24), 1);
  assert.ok(Math.hypot((balls[1].x - balls[0].x) * 600, (balls[1].y - balls[0].y) * 340) >= 47.9999);
  assert.ok(balls[0].vx < 0 && balls[1].vx > 0);
  const coincident = [{ x: .5, y: .5, vx: 0, vy: 0 }, { x: .5, y: .5, vx: 0, vy: 0 }];
  logic.collide(coincident, 600, 340, 24);
  assert.ok(coincident.every(b => Number.isFinite(b.x) && Number.isFinite(b.y)));
});
check('3D projection changes with rotation; hit testing uses the same projected nodes', () => {
  const node = context.test.SPACE_NODES[0];
  const p = logic.project(node, { x: -.18, y: .22 }, 900, 342);
  const q = logic.project(node, { x: -.18, y: 1.1 }, 900, 342);
  assert.ok(Math.abs(p.x - q.x) > 20);
  assert.equal(logic.hit([{ ...p, i: 0 }, { ...q, i: 1 }], p.x, p.y), 0);
  assert.equal(logic.hit([{ ...p, i: 0 }], 2000, 2000), -1);
  assert.equal(context.test.SPACE_EDGES.length, 3);
});
check('async state permits success or retryable error without illegal transitions', () => {
  assert.equal(logic.state('idle', 'START'), 'running');
  assert.equal(logic.state('running', 'REJECT'), 'error');
  assert.equal(logic.state('error', 'RETRY'), 'running');
  assert.equal(logic.state('running', 'RESOLVE'), 'success');
  assert.equal(logic.state('success', 'START'), 'success');
  assert.equal(logic.state('success', 'RESET'), 'idle');
  assert.equal(logic.state('running', 'START'), 'running');
});
check('state cache restores the same object until explicit replay', () => {
  const cache = {};
  const first = logic.restore(cache, 'poll', () => ({ A: 42 }));
  first.A = 43;
  assert.strictEqual(logic.restore(cache, 'poll', () => ({ A: 0 })), first);
  assert.equal(cache.poll.A, 43);
  delete cache.poll;
  assert.equal(logic.restore(cache, 'poll', () => ({ A: 42 })).A, 42);
});
check('pixel reveal visits every cell exactly once in a deterministic sequence', () => {
  const order = native(logic.pixelOrder(144));
  assert.equal(new Set(order).size, 144);
  assert.equal(order[0], 0);
  assert.equal(order.at(-1), 143);
  assert.deepEqual(order, native(logic.pixelOrder(144)));
});
check('new mechanisms keep immediate input, bounded decoration, measured disclosure and explicit completion separate', () => {
  assert.deepEqual(native(logic.toggleBulk([], 'scope')), ['scope']);
  assert.deepEqual(native(logic.toggleBulk(['scope', 'evidence'], 'scope')), ['evidence']);
  const delays = native(logic.staggerDelays(9));
  assert.equal(delays.at(-1), 280);
  assert.ok(delays.every((delay, i) => delay >= 0 && delay <= 280 && (i === 0 || delay >= delays[i - 1])));
  assert.deepEqual(native(logic.disclosureTransition(-12, 240)), { from: 0, to: 240 });
  assert.deepEqual(native(logic.disclosureTransition(180, 72)), { from: 180, to: 72 });
  let step = { step: 0, completed: false };
  step = logic.stepper(step, 'NEXT');
  assert.deepEqual(native(step), { step: 1, completed: false });
  step = logic.stepper(step, 'NEXT');
  assert.deepEqual(native(step), { step: 2, completed: false }, 'navigation reaches the last step without claiming completion');
  step = logic.stepper(step, 'COMPLETE');
  assert.deepEqual(native(step), { step: 2, completed: true });
  assert.deepEqual(native(logic.stepper(step, 'PREV')), { step: 1, completed: false });
  assert.deepEqual(native(logic.stepper(step, 'RESET')), { step: 0, completed: false });
});
check('29 records map only to the seven explanation jobs', () => {
  assert.equal(records.length, 29);
  assert.equal(new Set(records.map(x => x.id)).size, 29);
  assert.equal(groups.length, 7);
  assert.ok(records.every(x => groups.includes(x.group)));
  const mapping = Object.fromEntries(records.map(x => [x.type, x.group]));
  assert.equal(mapping.shared, '内容聚焦');
  assert.equal(mapping.reorder, '排序与比较');
  assert.equal(mapping.steps, '时间与顺序');
  assert.equal(mapping.sticker, '内容聚焦');
  assert.equal(mapping.pixel, '输入与反馈');
  assert.equal(mapping.state, '输入与反馈');
  assert.equal(mapping.bulk, '输入与反馈');
  assert.equal(mapping.disclosure, '内容聚焦');
  assert.equal(mapping.spring, '时间与顺序');
});
check('every registry mechanism renders default and static content without DOM side effects', () => {
  assert.equal(Object.keys(registry).length, 29);
  for (const record of records) {
    const entry = registry[record.type];
    assert.ok(typeof entry.initial === 'function' && typeof entry.render === 'function' && typeof entry.setup === 'function');
    assert.ok(['implemented', 'experimental', 'needs_verification'].includes(record.quality));
    for (const staticMode of [false, true]) {
      state.static = staticMode;
      const markup = entry.render(entry.initial());
      assert.ok(markup.length > 250, `${record.type} has a substantive specimen`);
      assert.ok(markup.includes('class="demo'), `${record.type} owns its stage`);
      if (['token', 'particle', 'physics'].includes(record.type)) assert.equal(markup.includes('<canvas '), !staticMode);
    }
  }
  state.static = false;
});
check('text entry preserves exact final graphemes and has an explicit policy for every scene', () => {
  const engine=context.test.MuseumTextEntry,text='const 中文 = "👨‍👩‍👧‍👦";\n正常输出 42';
  assert.equal(engine.frame(text,1,50),text);
  assert.equal(engine.frame(text,.2,4),engine.frame(text,.2,4));
  assert.equal(engine.glyphs('👨‍👩‍👧‍👦').length,1);
  for(const record of records)assert.ok(Object.hasOwn(context.test.TEXT_ENTRY_POLICY,record.type),record.type);
  for(const type of ['metric','sankey','radar','heat','state','bulk'])assert.equal(context.test.TEXT_ENTRY_POLICY[type],'none');
});
check('sticker crease, face and reflected fold share geometry across aspect ratios', () => {
  assert.equal(context.test.PEEL_FIX.runGeometryTests().passed,15);
});
check('full-page architecture has one active stage and no obsolete runtime', () => {
  assert.ok(html.includes('id="stage"'));
  assert.ok(!/wireLegacy|wireVerified|canvasInitLegacy|新机制/.test(html));
  assert.ok(!/<script[^>]+src=|<link[^>]+(?:href=)/.test(html));
  assert.ok(html.includes('scope?.dispose()'));
  assert.ok(html.includes('resizeObserver?.disconnect()'));
});
check('shared scope owns a single RAF, freezes on pause and cancels all work on disposal', () => {
  const doc = new EventTarget();
  doc.hidden = false;
  const frames = new Map();
  let frameId = 0;
  context.document = doc;
  context.window = {};
  context.AbortController = AbortController;
  context.requestAnimationFrame = fn => { frames.set(++frameId, fn); return frameId; };
  context.cancelAnimationFrame = id => frames.delete(id);
  state.paused = false;
  state.static = false;
  state.reduced = false;
  const root = new EventTarget();
  const owned = context.test.createScope(root);
  let advances = 0;
  let completed = false;
  const nextFrame = time => {
    const pending = [...frames.values()]; frames.clear();
    pending.forEach(fn => fn(time));
  };
  owned.loop(() => advances++);
  owned.resume(); owned.resume();
  assert.equal(frames.size, 1, 'repeated resume does not duplicate loops');
  owned.schedule(40, () => { completed = true; }, true);
  nextFrame(16);
  assert.equal(advances, 1);
  state.paused = true; owned.resume();
  assert.equal(frames.size, 0);
  assert.equal(completed, false);
  state.paused = false; owned.resume();
  nextFrame(100); nextFrame(132);
  assert.equal(completed, true, 'paused wall time was excluded but resumed time advances');
  state.reduced = true; owned.motion();
  assert.equal(frames.size, 0, 'reduced mode stops continuous loops');
  owned.schedule(100, () => { throw new Error('disposed callback fired'); }, true);
  assert.equal(frames.size, 1);
  owned.dispose();
  assert.equal(frames.size, 0);
  assert.equal(owned.stats().jobs, 0);
  assert.equal(owned.stats().disposed, true);
  state.reduced = false;
});
console.log(`\nMuseum validation: ${checks} behavioral/data checks passed. Full inline JavaScript syntax passed.`);
console.log('Not covered here: browser rendering, visual quality, touch gestures, real RAF/observer lifecycle and screen reader behavior.');
