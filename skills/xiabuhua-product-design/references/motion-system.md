# Product Motion System

Use when motion is a meaningful part of navigation, feedback, explanation, brand expression, or direct manipulation. Motion must make state and spatial relationships easier to understand.

## Contents

1. Motion jobs
2. Motion hierarchy
3. Motion contract
4. Choreography
5. Technology selection
6. Performance
7. Reduced motion
8. Motion QA

The approved/inherited style agreement defines motion intent and intensity. A mechanism can have different material/type/line treatments; external demos do not supply a default skin. Strong, quiet or absent motion can each be correct. For candidate work, demonstrate motion only within the requested specimen scope.

## 1. Give Every Motion A Job

Classify each animation:

- **feedback**: confirms press, selection, validation, success, or failure
- **continuity**: preserves object identity across state or route changes
- **orientation**: explains hierarchy, direction, origin, or destination
- **attention**: points to a new or urgent change
- **progress**: communicates waiting, staged work, or partial completion
- **direct manipulation**: follows drag, swipe, scrub, resize, or physics
- **expression**: carries a justified brand or narrative signature

Remove motion that has no clear job.

For text appearance, preserve the real accessible text and data semantics. Short display copy may use a local bounded word/decode/blur/typing entrance when it fits the approved direction; values, errors, inputs and task results remain immediately readable. Consult the museum's [scene text review](../../html-ppt-component-museum/references/text-entry-review.md) and [local effect sources](../../html-ppt-component-museum/references/local-effects-index.md) before new online research. Never overlay competing text entrances on an existing continuity/height/step transition merely to increase animation.

For a concrete local refinement, use [interaction pattern selection](../../ui-interaction-reference/references/interaction-pattern-selection.md) after resolving intent and direction. Choose one dominant mechanism for that local state change; a page can contain several necessary basic interactions. No fixed count of effects, spring parameters, angles or stagger interval applies to every project.

## 2. Build A Motion Hierarchy

Define four levels:

| Level | Typical use | Character |
| --- | --- | --- |
| Micro | press, toggle, hover, focus | immediate and subtle |
| Component | expand, reorder, validation, local enter/exit | interruptible and state-linked |
| View | panel, modal, list-detail, route transition | spatial and coordinated |
| Signature | onboarding, hero interaction, product-defining moment | authored and used sparingly |

Do not give every interaction signature-level choreography.

## 3. Specify Motion As A Contract

For each reusable pattern, define:

- trigger and user intent
- source and destination state
- affected elements and hierarchy
- property, duration or spring, easing, delay, and stagger
- interruption and reversal behavior
- input lock or continued interaction
- completion state and focus destination
- logical state/commit timing versus decorative animation timing; group-selection scope and completion-versus-navigation where relevant
- reduced-motion replacement
- performance and device constraints

Use semantic motion tokens such as:

- duration: instant / fast / standard / deliberate
- easing: enter / exit / move / emphasize
- spring: responsive / gentle / expressive
- distance: micro / local / view
- stagger: compact / narrative

Values should be tuned in the rendered product, not selected mechanically.

## 4. Choreography Principles

- Animate cause before consequence when the sequence matters.
- Keep related elements moving as a group.
- Preserve object identity with shared position, shape, or content.
- Use directional movement only when direction carries meaning.
- Let exits clear the path without delaying the user's next action.
- Keep important input responsive while animation runs.
- Allow interruption, reversal, cancellation, and rapid repeated input.
- Coordinate motion according to the selected direction; use multiple sequences only where the reading/task rhythm earns them.
- Pause ambient loops, video, and animation when offscreen or in a hidden tab.

## 5. Technology Selection

### Web / React

- CSS: simple hover, focus, color, opacity, and local transforms.
- Motion for React: layout changes, presence, shared layout, gestures, springs, and interruptible component animation.
- GSAP: complex authored timelines, scroll-driven sequences, advanced SVG, and imperative choreography. Once selected, read the [GSAP execution contract](../../ui-interaction-reference/references/gsap-execution.md); it routes exact official topics without loading eight general-purpose skills or changing the approved design.
- View Transition API: route/view continuity and shared elements with graceful fallback.
- Web Animations API: focused imperative animation without a larger framework.
- React Three Fiber/Three.js: only when spatial 3D is integral to the experience.

### Mobile

- Native transition and navigation APIs for platform-standard movement.
- Reanimated and gesture handlers for continuous gesture-driven interactions.
- Native haptics as supporting feedback, never as the only signal.

Use one primary controller for a property/element. Avoid CSS, Motion, GSAP, and a view-transition system competing over the same transform.

## 6. Performance Rules

- Prefer transform and opacity.
- Animate layout-affecting properties only after testing the actual element and surrounding layout.
- Keep animated layers small; use `will-change` sparingly.
- Avoid reading layout and writing styles repeatedly in the same frame.
- Keep high-frequency animation values outside React render state.
- Isolate heavy charts, editors, 3D, and data work from motion-critical regions.
- Lazy-load large animation and 3D dependencies.
- Virtualize long animated collections and limit simultaneous work.
- Test at 60Hz and, where relevant, 120Hz; a 120Hz frame budget is about 8ms.
- Test on representative lower-powered devices, not only the development machine.

## 7. Reduced Motion

Reduced motion is a designed variant:

- preserve state change and meaning
- replace large translation, zoom, parallax, and autoplay with immediate changes or short fades
- remove unnecessary looping and peripheral movement
- keep progress and completion legible
- avoid making motion the only way to understand hierarchy or success

Set a global reduced-motion policy in the chosen library and verify it manually. Apply the policy to JavaScript/Canvas/WebGL/physics loops as well as CSS. Pause offscreen and hidden-tab work, respond to preference changes, and provide a stable end state. Use deck steps, page scroll, or application state as the trigger appropriate to the delivery target.

## 8. Motion QA

### Separate the still frame, choreography and handfeel

First inspect a settled frame with movement suppressed, including a dense content area. Missing imagery, weak hierarchy or generic layout is a composition/asset problem; spring tuning will not repair it. Then inspect real input progression independently of any automatic demonstration.

For authored scroll sequences, map each track's meaningful start/change/end onto the same scroll axis. Identify dead intervals, competing focal changes, unreadable overlap, and whether a user can interrupt or skip. Intentional reading pauses are valid; do not fill every interval with motion. For reference-driven work, actually inspect the relevant frames/interaction, not a video title or still image guessed into a timeline.

For pointer-following, estimate velocity with explicit timestamps, cap unstable delta after tab suspension, and distinguish a first-order follower from a physical spring. An exponential follower can use `alpha = 1 - exp(-response * dt)`; a spring requires its own integration/settling rules. Values are project parameters, not universal handfeel presets. Avoid multiple controllers correcting the same transform after filtering.

Build only the test surface needed by the mechanism: read state, pause/replay, deterministic clock/seed and owned-resource counters. Keep these in a namespaced development interface. A seek operation does not prove actual pointer, wheel or gesture handling. Define each check around a complaint (unreachable target, stuck cancellation, late state commit, dead timeline interval), then verify it catches a deliberately broken case. Do not invent aggregate “motion quality” scores.

When the selected mechanism uses spatial/generative graphics, read the museum's [graphics contract](../../html-ppt-component-museum/references/graphics-runtime-contract.md). For tactile controls use [tactile interactions](../../html-ppt-component-museum/references/tactile-interactions.md); these are optional detail execution, never a new style chooser.

Test:

- first run and repeated use
- rapid clicking/tapping, reversal, and interruption
- route back/forward and gesture cancellation
- loading that resolves early or late
- content with different size and aspect ratio
- resize, orientation, and safe-area changes
- reduced motion
- low-powered hardware and concurrent data work
- focus destination and screen-reader announcements after transitions

Reject:

- input blocked for decoration
- motion that implies false hierarchy
- perpetual movement of data marks or cards that implies a nonexistent state change or distracts from the task
- unbounded parallax
- stagger that makes common tasks slower
- jank, flash, layout shift, or elements teleporting at completion
- transitions that leave invisible elements interactive
- animation completion presented as data persistence or task completion; delayed checkbox state used to stage a decorative sequence
