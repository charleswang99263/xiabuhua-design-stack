import assert from 'node:assert/strict';
import MC from './runtime.js';

const names = [
  ['textSplitReveal', () => MC.textSplitReveal('alpha\nbeta').step(.5)],
  ['magneticHover', () => MC.magneticHover().update({x: 120, y: 80}, {left: 0, top: 0, width: 240, height: 160})],
  ['clipCurtain', () => MC.clipCurtain().step(.5)],
  ['scrollVelocity', () => MC.scrollVelocity().sample(130, 16)],
  ['horizontalRail', () => MC.horizontalRail({count: 4}).step(.5)],
  ['parallaxDepth', () => MC.parallaxDepth().update(180, 80, 360, 160)],
  ['customCursor', () => { const x = MC.customCursor(); x.target(180, 80); return x.tick(16); }],
  ['routeTransition', () => { const x = MC.routeTransition(); x.begin('next'); return x.enter(); }],
  ['pinnedSequence', () => MC.pinnedSequence({steps: 3}).step(.5)],
  ['counterReveal', () => MC.counterReveal(98.7).step(.5)],
  ['gooMask', () => MC.gooMask().update(180, 80)],
  ['scrollOwner', () => MC.scrollOwner().update(320)],
  ['adaptiveHeader', () => MC.adaptiveHeader().update([120, 130, 125])],
  ['annotationRing', () => MC.annotationRing().update({x: 10, y: 10, width: 100, height: 60}, .8)],
  ['verletCurtain', () => MC.verletCurtain().poke(2, 22)],
  ['nativeReveal', () => MC.nativeReveal().step(.5)],
  ['cornerPin', () => MC.cornerPin().update([0, 0, 180, 8, 8, 120, 190, 110])],
  ['verletCardChain', () => MC.verletCardChain().setHead(180, 80)],
  ['slackString', () => MC.slackString().update({x: 180, y: 80}, .7)],
  ['cumulativeEmergence', () => MC.cumulativeEmergence({cap: 2}).deal()],
];

for (const [name, run] of names) {
  const state = run();
  assert.ok(state && typeof state.phase === 'string', name);
}

// Real input contracts are intentionally different.
assert.match(MC.scrollVelocity().input, /native scroll/);
assert.match(MC.parallaxDepth().input, /pointer\/touch\/keyboard/);
assert.match(MC.slackString().input, /real drag/);
assert.equal(MC.cornerPin().update([0, 0, 1]).phase, 'fallback');
assert.equal(MC.cumulativeEmergence({cap: 2}).deal().live, 1);

// Lifecycle: after dispose, no state mutation is accepted.
const disposed = MC.scrollVelocity();
disposed.dispose();
assert.equal(disposed.sample(200, 16).phase, 'disposed');
const curtain = MC.verletCurtain();
curtain.dispose();
assert.equal(curtain.poke(1, 10).phase, 'disposed');

// Negative source facts represented as local checks.
assert.equal(MC.horizontalRail({count: 3, mobile: true}).state.pinned, false);
assert.equal(MC.nativeReveal({reduced: true}).state.progress, 1);
assert.equal(MC.gooMask({reduced: true}).update(1, 2).reveal, 1);

console.log('motion-complete: 20/20 recipe APIs exercised; 3 real-input distinctions; 3 lifecycle/negative checks PASS');
