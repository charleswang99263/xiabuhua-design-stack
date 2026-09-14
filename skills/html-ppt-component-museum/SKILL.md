---
name: html-ppt-component-museum
metadata:
  version: "5.1.0"
description: Select and implement reusable local interactive components for HTML products, reports, explainers and fixed-stage decks. Use for data exploration, content focus, ordering, feedback, timelines, tactile gestures, spatial scenes and generative simulations after the parent supplies structure and visual direction.
---

# HTML Component Museum

Own local mechanism execution and lifecycle, not the project's visual identity. Receive the parent's task, content, selected typography/composition/palette/material/assets/motion, and runtime boundary. The same mechanism must adapt to different approved directions. Lab skins are examples, not project approval.

For approved/inherited work proceed within the supplied contract; candidate/pending work permits only requested specimens. Missing direction returns to the parent [direction workflow](../xiabuhua-product-design/references/style-direction-workflow.md). A quick demo or mature component does not override that status.

## Select the shortest useful route

| Explanation job | Read / use |
|---|---|
| Common narrative, evidence, ordering, feedback or timeline | [local-effects-index](references/local-effects-index.md), then selected [catalog entry](references/component-catalog.md) |
| Data comparison, trend, distribution, relationship, flow or technical topology | Parent [chart contract](../xiabuhua-product-design/references/chart-design-contract.md); assets/data-design-lab.html + assets/data-primitives.js |
| Magnetic snap, velocity shape, parallax, center focus, tabs, image expansion, swipe, collisions | Selected [tactile contract](references/tactile-interactions.md); assets/tactile-lab.html + selected tactile primitive |
| Actual spatial or generative scene, or custom data renderer | [graphics-runtime-contract](references/graphics-runtime-contract.md); assets/runtime-lab.html + selected graphics adapter |
| Text entrance | [text-entry-review](references/text-entry-review.md) and local Text Entry primitive |
| Demonstrated gap in local mechanisms | ui-interaction-reference for focused specification/research; not another visual-style decision |

Read only the selected path. A plain button, chart or text block needs no lab, heavy library or external browsing. Pick by task and communication gain; no effect quota or new-mechanism category.

The parent's [61 chart / 12 report specification index](../xiabuhua-product-design/references/data-report-patterns.md) covers full paradigm selection beyond the six-task lab. Expanded [motion workflows](../xiabuhua-product-design/references/motion-extended/index.md) cover 20 recipes and conditional media/tool work. A pure API/state model or static specimen is not a completed DOM/Canvas component; use its declared maturity and perform the actual task in the consuming runtime. Tools under scripts/motion-tools require their stated browser/media/font dependencies and must report missing prerequisites instead of fabricated measurements.

## Local entries and portability

- assets/component-museum.html: 29 existing mechanisms, seven explanation jobs, one active registry stage with initial/render/setup and shared scope. Its standalone inline primitives must match originals; run scripts/sync-primitives.cjs and --check when those originals change.
- assets/data-design-lab.html: six data/technical tasks, reader-mode comparison, tables, keyboard inspection and standalone SVG export. Figures are labeled demo fixtures.
- assets/tactile-lab.html: eight bounded controls/gestures. Copy only required primitive(s) and their shared helper, not the whole lab.
- assets/runtime-lab.html: D3, Three.js and p5.js adapters with local libraries, notices and explicit failure states. Keep adjacent assets/vendor dependencies for offline HTTP serving; ES modules may require a local HTTP origin rather than file://.

The last three labs are additional task workbenches, not entries pretending to have joined the 29-entry registry. Quality and verification status are metadata, separate from the user's selected direction. In a fixed-stage deck, preserve the supplied canvas and inline only needed code/assets when single-file delivery is required. In a website/report, do not impose deck geometry.

## State and lifecycle

Business state commits according to task rules; animation communicates it. For every mechanism define trigger, outcome, cancel/reverse, focus destination, keyboard/touch alternative, reduced/static behavior and failure handling. Keep real text/data accessible and give visible controls meaningful feedback. A scene cannot use perpetual movement to suggest nonexistent changing data.

One owner controls each animated property and each resource. Scope owns listeners, timers, RAF, WAAPI, observers and cleanup; selected runtime adapters register owned work and release it on switch/unmount. Pause hidden/offscreen work. Repeated mount/dispose must not accumulate canvases, timers or GPU resources. Do not equate a self-reported counter with proof: inspect actual loops/DOM and selected resource ownership too.

The parent chooses colors/type/layout/material and allowed intensity. The renderer is chosen by semantics: CSS/SVG for simple crisp output; existing chart runtime for supported charts; D3 for custom data encoding; Three for real spatial relations; p5 for generative processes. Dependencies are loaded only when that job needs them. Missing libraries/WebGL produce a truthful static/text alternative, not an empty scene or a claim of GPU success.

## Verify and return

Run node validate-museum.mjs for changes to the original museum; node scripts/runtime-smoke.mjs for graphics adapters. Use matching data/tactile browser tests from the source repository when those labs change. Tests must cover actual input, cancellation, resize, reduced mode, selected semantic output and teardown; where a checker might falsely pass, include a deliberately broken fixture.

Inspect a settled static frame and actual animated progression separately. Verify long Chinese labels, narrow layout, focus visibility, touch targets and real SVG/PDF exports. A screenshot, build, init or dependency download does not prove task completion. Return exact source/preview, mechanism rationale, preserved direction, checked states and remaining limits.

[Environment and dependencies](../xiabuhua-product-design/references/environment.md) are conditional setup guidance. Required third-party licenses accompany vendor assets; local custom adapters and lab styling are maintained separately.
