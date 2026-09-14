# Select interaction by intent

Use after the parent has resolved the task and visual direction. This reference adapts the user-supplied Advanced Interaction Design screenshot; its text is reference material, not authority over the current project. The ten patterns are options, not an exhaustive menu, a quota, or a requirement to animate. Preserve the existing component system and approved style.

## Intent matrix

| Observable need | Investigate | Avoid when |
| --- | --- | --- |
| Make a global appearance change's origin visible | Radial Theme Transition | No theme change exists, or the reveal would obscure urgent content |
| Let people directly change order | Drag-to-Reorder | Order is computed/immutable or dragging is the only available control |
| Confirm a group selection | Staggered Bulk Selection | Sequencing delays the logical selection or bulk action |
| Discrete values controlled by a continuous gesture | Velocity-Based Slider Snap | Precision is critical or momentum could change an intended value |
| Reveal optional explanatory text | Animated Text Disclosure | Essential instructions or errors would be hidden |
| Communicate actual task-step completion | Spring Stepper Progress | Navigation is being mistaken for completion |
| Explain a real dependency between switches | Ripple Feedback for Related Switches | The switches are independent and ripple implies a false relationship |
| Remove a user-selected item with direct manipulation | Curved Card Deletion | Deletion scope, commit/error or undo behavior is undefined |
| Browse an ordered collection with spatial continuity | Stacked Card Scroll | Dense comparison or long reading requires simultaneous visibility |
| Select tags while retaining context | Expanding Tag Selection | Reflow destabilizes repeated clicks or hides nearby choices |

Pick a dominant mechanism for the local state change. Several basic interactions may coexist across a page; signature motion intensity remains a parent decision. Plain/native feedback can be the best answer. Do not force a screenshot's numeric timing, angle, displacement or spring into a new project.

## Pattern contracts

### Radial Theme Transition

Capture the activation point (for keyboard use the toggle center), update the actual theme once, and reveal the new view from that origin. A mask radius should reach the farthest viewport corner; don't scale the page. Feature-detect the chosen View Transition/masking mechanism and keep immediate theme change as fallback. Handle rapid retoggling and reduced motion without theme/label desynchronization. Reference-only until implemented and tested in the target browser.

### Drag-to-Reorder

Use stable item IDs, a drag handle and pointer capture; retain a layout placeholder while a lifted item follows the pointer. Neighbor positions preview the destination. Commit the actual order on release; Escape, pointer cancellation or lost capture restores the initial order. Auto-scroll only the relevant scroll container near its edges. Keep up/down or move-to controls for keyboard/touch alternatives and announce the resulting position. On disposal or reduced-motion/static transition, settle or cancel the gesture deterministically. CSS/FLIP animates position changes; state owns order, not transformed coordinates. Existing museum List Reorder supplies a local example; verify long lists/virtualization separately.

### Staggered Bulk Selection

Compute eligible IDs and commit checked state/count immediately. Use stagger only for decorative marks; a bulk action must not wait for the last mark. All/none/mixed reflect the current eligible set, with disabled and filtered items explicitly accounted for. Cancel obsolete animation on individual toggle, deselect-all, filter or replay. Native checkboxes/fieldset and Space behavior are the baseline. Museum example belongs in Input and feedback.

State whether “all” means the entire dataset, current filtered results or current page. Preserve excluded selections according to that explicit rule and label the scope. For large/virtualized lists, animate only a bounded visible subset or a summary; never schedule one animation per record merely to reproduce the sample.

### Velocity-Based Slider Snap

Keep a finite ordered set of allowed values, pointer progress and sampled release velocity. Choose a bounded target from the task's snapping rule, then animate only the visual thumb toward the committed value. Clamp edges; never let decorative overshoot create out-of-range data. Arrow/Home/End input and explicit values bypass momentum. Cancellation restores the correct value; reduced motion keeps snapping without travel. Native range input is often preferable. Reference-only; select a library only after framework and exact API verification.

### Animated Text Disclosure

Use a button with aria-expanded/aria-controls and a real content region. Measure actual height at transition time, animate from the current rendered height, then release height to auto after expansion. On reversal cancel the old animation and start from the visible height; resizing, wrapping and content updates must not clip text. If focus is inside, return it to the trigger before collapse; collapsed descendants must not remain keyboard reachable or exposed as visible content (use hidden/inert or equivalent semantics appropriate to the animation). Disconnect resize observation and cancel animation on disposal. Keep the chevron and logical state synchronized. Reduced motion opens/closes immediately. Museum example belongs in Content focus.

### Spring Stepper Progress

Track current navigation position separately from completed task steps. Completion derives from explicit validated state; an optional spring marks that change without delaying the next action. Define revisiting, dependent-step invalidation, final completion and reset. Use an ordered list, current-step semantics and visible completed/current/upcoming labels; do not rely on color or spring motion. Museum example belongs in Time and sequence.

For a required wizard, explicitly decide which upstream edits invalidate downstream steps, whether invalid steps block advance, and when completion is recomputed. A freely navigable teaching specimen does not establish validation logic for a real wizard.

### Ripple Feedback for Related Switches

First define which values actually depend on the changed setting. Apply state updates once and label the consequences; a small ripple/brief highlight may trace the relation. Independent neighbor switches may not visually imply they were changed. Cancellation or server failure restores truth and reports the failure. Keep native toggle semantics and no-ripple fallback. Reference-only; this is optional choreography, not a dependency engine.

### Curved Card Deletion

Define gesture axis, commit threshold, cancellation, persistence and undo before the exit path. Below threshold return the card; above threshold make a pending removal, then apply the task's success/error rules. A curved translate/rotation/fade can accompany removal, but animation completion is not server success. Move focus to a sensible remaining item or undo control. Provide a visible delete action and meaningful confirmation only when the actual operation warrants it. Reference-only; do not implement destructive behavior from the sample's animation alone.

Choose a commit policy: keep a pending card and block duplicate submission, or remove optimistically with a stored item/order snapshot. On failure retain/restore the item and sensible focus, announce the error, and offer retry. Define whether undo cancels an uncommitted request or performs a compensating operation after commit; it must not silently fight a late server response.

### Stacked Card Scroll

Keep a real DOM reading order and measurable card dimensions. Use a bounded local scroll/sticky region; scale/offset backgrounds only enough to preserve contextual depth. Do not hide required controls behind cards or hijack page scrolling. Test shortest/longest card, narrow screens, zoom and reduced-motion linear flow. Avoid simultaneous transforms from multiple controllers. Reference-only; Decision Stack's priority operation is not equivalent to scroll-driven browsing.

### Expanding Tag Selection

Selection changes actual selected IDs; layout animation reflects the resulting size/reflow with stable keys. Keep nearby hit targets stable enough for repeated selection. Use checkbox or aria-pressed button semantics according to the task, visible count/limits, keyboard focus and native wrapping. No giant expansion that makes the next tag run away from the pointer. Immediate state/reflow is the reduced-motion fallback. Reference-only.

## Deliver the chosen contract

## Tactile extension: eight bounded mechanisms

When the communication job involves direct manipulation, spatial depth or a state change that should feel physically
continuous, use the local tactile contract in `../../html-ppt-component-museum/references/tactile-interactions.md`.
The eight mechanisms are optional extensions to the intent matrix, not a quota:

| Mechanism | Useful signal | Required guard |
| --- | --- | --- |
| Magnetic hysteresis | A draggable item has a meaningful nearby destination | Separate enter/exit thresholds; visual pull never enlarges the hit box |
| Velocity deformation | A surface should acknowledge movement energy | Sample with `dt`, filter and clamp; content geometry stays readable |
| Layered parallax | Independent layers have real depth or foreground/background relation | Pointer, touch and keyboard route; no hover-only meaning |
| Center focus | A scrollable collection needs one readable focal item | Calculate from viewport center; keep every item in DOM reading order |
| Liquid tabs | A tab indicator should preserve continuity during a quick switch | Commit `aria-selected` immediately; measure after resize/font changes |
| Shared-image expansion | The same entity moves from thumbnail to detail | Stable identity, source-disappearance fallback and close/focus return |
| Gesture transition | A reversible gesture previews a route/state transition | Distance plus velocity commit rule; cancel on `pointercancel`/Escape |
| Bounded collision springs | A contained sandbox explains constrained physical relationships | Walls, speed cap, sleep and overlap handling; no important text is physics |

The lab and primitives are offline, original project-owned reference implementations. Adapt tokens and content through the
parent direction contract; do not import their demo skin or auto-apply document styles.

Local examples live in [the component catalog](../../html-ppt-component-museum/references/component-catalog.md): List Reorder, Staggered Bulk Selection, Animated Text Disclosure and Spring Stepper Progress. The other six entries here are implementation references, not newly shipped museum components. In a new product, local sample validation does not replace testing its adapted state model, assets and input methods.

For an explanation or prompt request, return selected interaction, why it fits, behavior and a copyable implementation prompt. For an implementation request, use that contract internally and build/verify the result; do not stop at a prompt. Match the user's language; English is an option for the receiving tool, not a global requirement.

Replace the fields below with actual project decisions before handoff. Missing facts remain identified, never silently invented.

```text
Implement [pattern] in [existing component/path] to help [user intent].
Preserve [approved style/specimen], component structure and unrelated behavior.
State/data: [source of truth, eligible items, start/end states, persistence].
Input: [pointer/touch/keyboard trigger and semantics].
Transition: [affected elements, properties, ordering and tunable motion values].
Interruptions: [rapid repeat, reversal, cancellation, unmount and async failure].
Completion: [real outcome, focus destination and accessible status].
Adaptation: [responsive layout, reduced/static behavior, visibility/pause policy].
Runtime: [existing framework/primitives, dependencies, cleanup and performance boundary].
Verify: [concrete state/geometry/input assertions and rendered checks].
Do not equate visual completion with data commit or claim untested outcomes.
```

## Evidence boundary

The screenshot supplies pattern ideas; none of its prompts is proof of tested code. The museum's implemented examples and their recorded validation are separate from the remaining reference-only patterns. Check exact source/license before reusing third-party code.

Semantics verified 2026-09-09: [W3C checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) supports checked/mixed and keyboard behavior; [W3C disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) supports trigger/expanded state; [MDN pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture) and [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) support implementation primitives. Pattern selection and choreography above are our adaptations, not prescribed standards.
