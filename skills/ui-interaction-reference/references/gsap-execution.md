# GSAP Execution Contract

Read after the parent selects GSAP for a real timeline, scroll sequence, SVG effect or imperative choreography. For unresolved tool selection, use the parent's [motion system](../../xiabuhua-product-design/references/motion-system.md). This is a scoped execution reference inside the existing six-skill stack, not a seventh discovered skill, a fork of eight upstream skills, or a bundled GSAP runtime.

## Scope and handoff

Receive the approved/inherited visual direction, trigger, source/destination states, target elements, interruption/reversal policy, reduced-motion variant and verification target. Preserve these decisions. A single CSS transition or an established Motion component need not migrate to GSAP. Do not choose GSAP merely because its upstream skill recommends it for unspecified animation requests.

Use the existing project dependency and lockfile where compatible. If absent, add `gsap` to the consuming project only when the task needs it; React integration may also need `@gsap/react`. Follow the project's dependency/authorization rules. Reading this reference or installing the design stack never authorizes global installs, network configuration, payments or publishing. Record actual runtime versions; skill revision and runtime package version are different things.

For HyperFrames video compositions, use the available HyperFrames GSAP skill and composition runtime contract. Do not add web scroll triggers to deterministic video playback by default. In ordinary web UI, the HyperFrames skill is not a prerequisite. Morphicons is an optional icon-shape driver, not an icon source or a required GSAP companion; one owner must control each SVG path.

## Read only the needed topic

The audited upstream snapshot is [greensock/gsap-skills at aed9cfd](https://github.com/greensock/gsap-skills/tree/aed9cfd3277740755f6bfc1155c7aa645403b760), checked 2026-09-18. It is a reference source, not an installed dependency. Start with the relevant row, not all eight skills. If matching official skills are already installed, read only the applicable ones and check their provenance; their broad recommendations do not override the parent contract. If remote material is unavailable, first inspect the consuming project lockfile, installed package and local API evidence. Do not register or call an unknown plugin based on a guessed API. Use verified local APIs where they satisfy the task; otherwise report the gap and a bounded fallback without silently dropping required behavior.

| Implementation need | Optional upstream topic | Primary API reference |
| --- | --- | --- |
| Tweens and ordered multi-element choreography | `gsap-core`, `gsap-timeline` | [GSAP](https://gsap.com/docs/v3/GSAP/), [Timeline](https://gsap.com/docs/v3/GSAP/Timeline/) |
| React lifecycle, selectors and asynchronous handlers | `gsap-react` | [React integration](https://gsap.com/resources/React/), [context](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/) |
| Scroll-linked progress or pinned scenes | `gsap-scrolltrigger` | [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| Layout transition, SVG or split text | Relevant section of `gsap-plugins` | [Flip](https://gsap.com/docs/v3/Plugins/Flip/), [MorphSVG](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) |
| Hot-path updates or many animated targets | `gsap-performance`, relevant `gsap-utils` section | [quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo%28%29/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) |
| Vue/Svelte or other framework lifecycle | `gsap-frameworks` | Framework mount/unmount API plus [context](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/) |

Resolve each topic under `skills/<topic>/SKILL.md` in the pinned upstream tree. For behavior/defaults, prioritize the applicable runtime's official API docs over condensed skills. Updating the audited snapshot requires checking changed rules and affected behavior; do not automatically vendor or follow upstream installation instructions.

## Implementation invariants

- Build one owned timeline for coordinated events; prefer labels and position parameters over cascaded timers. Local timeline defaults are safer than changing app-wide `gsap.defaults()` for one component.
- Keep application state, persistence and task completion independent of the decorative playhead. For progress UI, real progress drives the presentation; timeline completion cannot mark backend work complete.
- Scope selectors to the component/root. Use `useGSAP` with a scope in React when available, or an owned `gsap.context()` reverted on teardown. With changing dependencies, choose and document rebuild/revert behavior; avoid duplicate timelines after re-render or development remount.
- Put event-created animations into the owned context (`contextSafe` in React, or a context method). Separately remove listeners, clear timers, abort/ignore stale async work, disconnect observers and remove owned ticker callbacks. A context is not an async cancellation mechanism.
- Reuse/reverse a suitable timeline or replace only owned tweens on repeated input. Preserve the visible state and logical state without jumps, accumulated loops or completion callbacks from obsolete requests.
- One system owns a given element/property. Do not let CSS, Motion, GSAP, View Transitions or an icon morph driver compete over the same transform/path. Do not use global kill-all or revert-all operations to clean up a local component.
- Register only used plugins. Preserve content when JavaScript/dependencies fail; do not leave headings, task results or controls permanently hidden in a pre-animation style. Keep links, button names and accessible text valid when splitting text.
- Prefer transform/opacity when equivalent, but measure actual rendering cost: these properties are not a universal GPU/compositor guarantee. Batch geometry reads and writes; keep high-frequency values out of React render state.
- Use media-aware setup for responsive and reduced-motion variants. Restore a legible state when preferences change, and call owned cleanup on teardown. Stop inactive/offscreen loops; resume only work that is still logically active.

## Scroll and plugin pitfalls

- Create scroll scenes in document order where possible; refresh after relevant fonts/images/layout settle, not every frame. Animate a child of a pinned element when moving the pin itself would invalidate measurements. Keep reading and input reachable without scroll animation.
- ScrollTrigger **higher** `refreshPriority` values refresh earlier (`1` before default `0`; negatives later). The audited upstream skill reverses this rule. Prefer natural creation order unless there is an actual dependency.
- `Flip.from()` defaults to size-based resizing; request `scale: true` explicitly when scaling is intended. The audited upstream skill incorrectly calls `true` the default. Measure the before state, apply the actual layout change, then animate from the snapshot.
- `contextSafe` records newly created GSAP objects for cleanup; it does **not** promise all callbacks become no-ops after unmount. Listener removal and asynchronous cancellation remain the component's responsibility.
- A draw/morph plugin does not make arbitrary filled, multi-path or off-grid icons equivalent. Keep source geometry, accessible meaning and the selected [icon system](../../xiabuhua-product-design/references/icon-system.md) intact.

## Acceptance and maintenance

Verify actual input first and settled frames separately: repeated/reversed input, interrupted async work, mount/unmount, navigation away/back, responsive geometry and live reduced-motion changes. For scrolling, use real wheel/touch input and verify reading order, pin release and focus access; a programmatic seek alone is insufficient. Check for remaining listeners/tickers/ScrollTriggers after teardown and meaningful console errors. Claims about frame rate require a measurement on the relevant device.

Pass back implemented properties/controllers, actual dependency versions, behavior evidence and limitations. The parent retains final visual/state acceptance. This document contains project-authored integration guidance and links; no upstream skill source, runtime library or icon assets are redistributed here. GSAP skill-repository licensing is separate from the runtime's license; consult the runtime terms if redistribution or embedding requires it.
