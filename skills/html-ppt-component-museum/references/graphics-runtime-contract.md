# Graphics runtime contract

Xiabuhua 5.0 treats D3, Three.js and p5.js as local mechanisms inside a museum scope. They never own the page lifecycle.

| runtime | communication job | required fallback |
|---|---|---|
| D3 7.9.0 | Data with coordinates, units, keyed updates and readable labels | SVG bars plus HTML summary/table; no Canvas-only conclusion |
| Three.js r186 / npm 0.186.0 | Spatial depth, connected nodes and scene state | 2D Canvas projection with an explicit “WebGL unavailable” status |
| p5.js 2.3.1 | Seeded generative process or particle experiment | Static Canvas frame plus text summary; no dependency means labelled fallback |

## Adapter boundary

Each adapter exposes `mount(host, data, options)`, returning `update`, `resize`, `pause`, `resume`, `dispose`, `normalized`, `summary`, and a runtime status. `graphics-common.js` adapts an existing museum scope when supplied, or creates a local scope with one RAF, ResizeObserver, visibility pause, reduced-motion policy and cleanup registry.

`assets/runtime-lab.html` is intentionally a three-runtime comparison surface and loads all three local browser distributions. It is not the consuming-page loading template. Product pages should select the communication job first and lazy-load only the required renderer (D3, Three.js or p5), then provide that renderer's static fallback and summary path.

`dispose` is idempotent and must remove listeners, observers, DOM nodes, timers and animation work. A mounted specimen owns its own wrapper. Switching specimens must call `dispose` before replacing the host content. Each adapter observes a dedicated fixed-ratio `.graphics-frame`, rather than its content-expanding host, so `resize(width, height)` cannot create a height feedback loop. It measures that frame and caps device pixel ratio at 2.

## Ownership rules

Three resources are acquired through `createGpuOwnership()`. Shared geometry/material/texture keys are reference counted and disposed only at zero references. A renderer is local to its specimen and is stopped with `setAnimationLoop(null)` before `dispose()`. Geometry and materials are released by identity; renderer disposal alone is not treated as complete cleanup.

The lab drives p5 with `noLoop()` + the museum scope's loop and calls `redraw()` explicitly. p5's `instance.remove()` is required during dispose, so remounting leaves at most one p5 canvas per host. p5 random values are generated from an explicit seed and draw time comes from the injected scope clock; the draw loop does not call `Date.now()` or unseeded random.

## D3 lifecycle

D3 marks use stable `id` keys in `selection.join`. Named `runtime-update` transitions are interrupted on every update/dispose, including descendants. The summary and data buttons remain the accessible source of truth. Reduced motion skips transition duration while still updating the data and selected state.

## Acceptance matrix

- Data update: add/change/remove D3 rows and verify keyed marks, labels and HTML summary update.
- Interaction: keyboard focus and 44px buttons select D3 rows, Three nodes and p5 pause/resume controls.
- Responsive: 390×844, 768×1024 and 1440×900 must keep axes, labels and drawing buffers inside the host.
- Lifecycle: 20 mount → pause → resume → dispose cycles leave no owned scope work, no observer, no runtime canvas and no retained GPU ownership references.
- Reduced/offscreen: no continuous loop while reduced, hidden or outside the viewport; static summary remains.
- Failure: blocked/missing D3, Three or p5 shows a distinct dependency fallback state; WebGL fallback must never claim GPU rendering.
- Determinism: same seed + same model yields the same normalized model and summary text. Pixel hashes are not compared across GPU/browser/font environments.

Vendored third-party files and their licenses are listed in `assets/vendor/THIRD-PARTY-NOTICES.md`; p5's full LGPL-2.1 text, official source archive and package metadata are retained separately.
