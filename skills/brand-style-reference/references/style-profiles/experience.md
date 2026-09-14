# Composition, spatial and temporal strategies

Read [use boundary](README.md). These entries do not determine a complete visual identity by themselves. They may materially distinguish directions when their relationships lead the experience; they need a specified appearance and actual behavior. Code is our original adaptation, with illustrative values.

## Bento

**Evidence:** contemporary composition label, without one canonical definition. [Apple's MacBook Pro page](https://www.apple.com/macbook-pro/) is a first-party modular product-presentation example, not evidence that Apple invented or named Bento. [MDN Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts) documents explicit tracks and placement.

**Defining relationship:** related but independently meaningful modules have deliberate unequal prominence on common tracks. Size, adjacency and grouping communicate priority. This is a composition choice, not a promise that every page is a wall of cards.

```css
.bento .modules { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.bento .module { min-inline-size: 0; }
.bento .primary { grid-column: span 2; grid-row: span 2; }
.bento .wide { grid-column: span 2; }
@media (max-width: 40rem) {
  .bento .modules { grid-template-columns: 1fr; }
  .bento .primary, .bento .wide { grid-column: auto; grid-row: auto; }
}
```

**Ordinary/control surface:** retain module group/priority in secondary sections, but let an actual comparison table span the space it needs. Source order follows meaningful reading/focus order; avoid visual reordering that conceals it. **Distinction:** uniform repeated cards may be a useful card grid, not an independently differentiated direction. Masonry primarily accommodates uneven content heights; Bento deliberately assigns prominence/adjacency. These are working distinctions, not strict mathematical taxonomies.

## Immersive

**Evidence:** medium/experience facet. [MDN WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) documents browser 2D/3D graphics capability; it does not define an aesthetic. A spatial scene may be minimal, hand-drawn, photographic, pixelated or another approved language.

**Defining relationship:** viewpoint, occlusion, object placement and spatial navigation contribute meaning. Specify subject/scene, camera constraints, asset provenance, lighting/material and 2D access route before choosing a renderer. A single 3D illustration may be a valid asset-led direction, but does not by itself prove an immersive interaction.

```css
.immersive .scene { perspective: 800px; }
.immersive .world { transform-style: preserve-3d; transform: rotateY(var(--yaw, 0deg)); }
.immersive .near-plane { transform: translateZ(40px); }
.immersive .far-plane { transform: translateZ(-40px); }
```

This fragment demonstrates layered CSS-space relationships, not a finished 3D scene. Use CSS 3D for planes, SVG for a deliberate flat projection, or a supported WebGL renderer for actual mesh/camera interaction. Request/generate assets only within existing authorization. Select render resolution from a measured device budget rather than blindly using full devicePixelRatio. Lazy-load nonessential scenes; release renderer/listeners when leaving.

**Ordinary/control surface:** keep inspection details and controls in readable DOM with equivalent object selection/list navigation. Visible previous/next/reset or range controls may drive the same state as gestures. Preserve scene context when opening details. **Distinction:** spatial treatment and Motion-first can coexist; spatial depth is not evidence of temporal storytelling. Missing assets or an untested camera are unverified, not completed style proof.

## Motion-first

**Evidence:** temporal design strategy. [Material's motion guidance](https://m2.material.io/design/motion/understanding-motion.html) links motion to relationships, actions and outcomes; its timings/easing are system-specific examples. [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) documents the animation mechanism; [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) supports preference-aware substitution.

**Defining relationship:** input and state transitions organize comprehension through time. Specify trigger → previous state → transition → result, identity continuity, pacing hierarchy and interruption. Hover flourish or a video background alone does not establish this strategy.

The following small mechanism switches two real content steps with immediate state semantics, cancellable visual entry and focus retained on the clicked control. It is not a complete motion system:

```html
<div class="motion-example">
  <button type="button" data-step="0" aria-pressed="true">Observation</button>
  <button type="button" data-step="1" aria-pressed="false">Evidence</button>
  <p class="motion-status" role="status">Observation</p>
  <section data-panel="0">Actual observation content</section>
  <section data-panel="1" hidden>Actual evidence content</section>
</div>
```

```js
const stage = document.querySelector('.motion-example');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let animation;
const onClick = (event) => {
  const button = event.target.closest('button[data-step]');
  if (!button || !stage.contains(button)) return;
  animation?.cancel();
  stage.querySelectorAll('[data-panel]').forEach(panel => {
    panel.hidden = panel.dataset.panel !== button.dataset.step;
  });
  stage.querySelectorAll('button[data-step]').forEach(control => {
    control.setAttribute('aria-pressed', String(control === button));
  });
  stage.querySelector('.motion-status').textContent = button.textContent;
  const panel = stage.querySelector('[data-panel]:not([hidden])');
  if (!preference.matches && panel.animate) {
    animation = panel.animate([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
  }
};
const onPreferenceChange = () => { if (preference.matches) animation?.cancel(); };
stage.addEventListener('click', onClick);
preference.addEventListener('change', onPreferenceChange);
// In a component, invoke on unmount:
const dispose = () => {
  animation?.cancel();
  stage.removeEventListener('click', onClick);
  preference.removeEventListener('change', onPreferenceChange);
};
```

**Ordinary/control surface:** same causal language applies to filter/reorder/loading/success states; keep values and status understandable with motion removed. Essential async work keeps its true timing; reducing animation must not fake completion. **Distinction:** compare temporal directions by actual sequence/interaction, not still screenshots. A visual timing test plus state checks is needed before claiming motion fidelity.
