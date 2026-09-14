# Five-Layer Design QA

Use this reference before handing off Feature or Product work. For a Delta, run only the affected layers plus one adjacent regression check; do not require a full-product audit unless the change alters shared navigation, tokens, or components.

Keep machine checks and rendered human checks separate. A machine can prove structure and consistency; it cannot by itself prove optical balance, discoverability, comprehension, or task success.

## Severity

- **P0**: blocks the primary task, corrupts or loses user state/data, or makes the delivery claim false.
- **P1**: breaks a major branch, gate, recovery path, accessibility requirement, or shared component.
- **P2**: visible or interaction defect with a practical workaround.
- **P3**: polish issue with no meaningful task impact.

Fix P0 and P1 before handoff. Fix P2 before calling a production implementation complete unless it is explicitly accepted with an owner and next action.

## Layer 1: Structural Truth

Machine-check when possible:

- expected pages, boards, screens, components, states, and assets exist
- naming and IDs are unique and stable
- fonts, colors, variables, styles, and external assets resolve
- output dimensions and target device/viewports match the contract
- counts are generated from the current artifact and tied to its revision
- no broken links, missing files, or unresolved references

Human-check:

- the inventory covers the declared product scope
- the file is organized so another designer or engineer can locate source, specifications, flows, and evidence

## Layer 2: Component And Geometry Truth

Machine-check when possible:

- component instances, variants, tokens, and style bindings actually exist
- repeated components use the intended reusable source
- control frames, content boxes, icon boxes, spacing, and touch targets meet the declared geometry contract
- text styles and icon sources are consistent and traceable

Human rendered check:

- labels and icon-label groups are optically centered
- icons share a coherent visual weight, baseline, and selected-state language
- long labels, localization, Dynamic Type/text scaling, and compact widths do not break the component
- disabled, pressed, loading, error, and selected variants remain legible and aligned

Read `component-geometry-and-system-truth.md` for the contract and claim levels.

## Layer 3: Visual And Content Quality

Human rendered check is authoritative:

- approved/inherited direction has actual selection/source evidence and an inspectable specimen
- composition, type roles, material/imagery, color hierarchy and motion match that specimen on both expressive and ordinary surfaces
- content-fit adaptations are recorded; a substituted template/palette is not silently accepted
- candidates, when explored, differ in meaningful structure/type/asset/motion terms rather than recoloring
- pairwise records identify the changed organizing or dominant visual relationship and its actual specimen evidence; variants/unverified directions are not counted as distinct
- the approved implementation map survives dense/control surfaces; check loaded language-specific type and required assets, not only token names
- selection compliance, candidate distinction and selected-direction fidelity are reported separately; none substitutes for the others

- hierarchy, rhythm, alignment, density, and contrast match the intended task
- real or representative content does not clip, collide, or expose placeholder assumptions
- imagery and color remain coherent across the product rather than only on the hero screen
- safe areas, keyboard, overlays, scroll boundaries, and responsive states are visually correct
- accessibility contrast and non-color cues are sufficient for the target context

Use automated screenshot comparison only as change detection, not as proof of visual quality.

## Layer 4: Interaction Contract

Machine-check when possible:

- screen and edge references are valid and IDs are unique
- declared gates include return context
- hotspots meet minimum target dimensions
- every declared edge is represented in the prototype or implementation projection

Human task check:

- triggers are visible and map to the expected targets
- back, cancel, retry, denial, failure, completion, and recovery paths work
- the user can complete each primary journey without a dead end
- preserved state survives navigation and gates

Link-count equality is not enough. Complete the task from entry to outcome.

## Layer 5: Real Runtime

Apply only when executable implementation exists. Otherwise mark this layer `not applicable`, not passed.

Verify in the target environment:

- navigation, deep links, data loading, persistence, permissions, offline/degraded behavior, and app lifecycle
- keyboard, pointer, touch, focus, screen reader, text scaling, reduced motion, and safe areas as applicable
- realistic content volume, media, lists, motion, and performance budgets
- error reporting, retries, destructive confirmation, success feedback, and recovery

Build success, upload success, or HTTP 200 is not runtime acceptance. Inspect the visible product and complete the primary tasks.

## Handoff Record

Use `templates/design-qa-report.md`. For every layer, record:

- scope and artifact revision
- machine evidence and command, if applicable
- rendered views, devices, states, and journeys inspected
- result: pass, fail, not applicable, or unverified
- issue severity, owner, and next action

Do not reuse counts or screenshots from an earlier artifact without revalidation.
