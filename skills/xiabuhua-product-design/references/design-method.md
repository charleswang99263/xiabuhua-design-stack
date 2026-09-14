# Cross-Surface Product Design Method

Use this reference for feature/product planning, cross-surface work, and design review. Use the web, mobile, and motion references for implementation-specific decisions.

## Contents

1. Scope profile
2. Product map before screens
3. Art direction
4. System architecture
5. State and feedback
6. Content is interface
7. Vertical-slice method
8. Cross-route consistency
9. Quality gates

## 1. Scope Profile

Declare four things before designing:

| Dimension | Options |
| --- | --- |
| Scope | delta / feature / product |
| Surface | desktop web / mobile app / responsive web / report / presentation |
| Fidelity | concept / interactive prototype / production |
| Source of truth | existing product / selected reference / new art direction |

Set three design dials only when they help make choices:

- **Layout variation**: predictable and systematic to editorial and asymmetric.
- **Motion intensity**: nearly static to motion-led.
- **Visual density**: spacious and focused to operationally dense.

The dials describe consequences, not style. Record what each value changes in layout, component behavior, and QA.

## 2. Product Map Before Screens

After the minimum brief and direction confirmation in [style-direction-workflow.md](style-direction-workflow.md), map feature/product work. Technical and content feasibility can be checked earlier without choosing a tool-default aesthetic.

Map:

1. user roles and top jobs
2. route/screen inventory
3. navigation hierarchy and entry points
4. primary journeys, branches, and exits
5. entities, data dependencies, and permissions
6. shared shell and feature boundaries
7. states, system feedback, and recovery

Each screen must have a job, entry condition, exit path, data contract, and owner in the journey. Remove screens that exist only to fill a sitemap.

## 3. Art Direction

Use [style-direction-workflow.md](style-direction-workflow.md) before detailed visual work. Record approved/inherited evidence and the selected specimen, or remain at candidate exploration. The vocabulary in [style-vocabulary.md](style-vocabulary.md) offers facets, not templates.

Create a visual thesis specific to the product:

- **Subject vocabulary**: materials, tools, environments, imagery, and behaviors from the product's real world.
- **Audience posture**: focused, expert, calm, expressive, trustworthy, playful, or another intentional stance.
- **Typography**: roles, hierarchy, rhythm, and character; choose families that support content and language coverage.
- **Palette and material**: semantic roles, surface behavior, contrast, texture, imagery, borders, and elevation.
- **Composition**: grid, rhythm, density, alignment, and controlled exceptions.
- **Signature**: only the memorable interactions, structures or content treatments the thesis needs; neither one mandatory gimmick nor a quota of effects.

Review the direction before building:

- Could the same plan be pasted onto an unrelated product?
- Does each structural device encode real information?
- Is the signature useful or merely decorative?
- Does the distribution of expression match the selected direction and preserve hierarchy?
- Does the direction remain coherent on secondary and utility screens?

## 4. System Architecture

Use a layered token model:

1. **primitive** values: raw color, size, type, radius, duration, easing
2. **semantic** roles: text, surface, border, action, status, focus, motion
3. **component** decisions: button, field, navigation, dialog, card, table, list

Prefer a DTCG-compatible token shape for new cross-tool systems when practical. Do not over-engineer tokens for a small delta.

Define component contracts by:

- anatomy and content slots
- explicit variants
- supported sizes and density
- state ownership
- responsive/platform adaptation
- keyboard, touch, and assistive behavior
- data and error boundaries

Prefer composition and explicit variants over proliferating boolean props.

## 5. State And Feedback

Evaluate these state families and implement those that can occur:

- rest: default, hover, focus, active, selected, disabled
- async: initial loading, incremental loading, refreshing, processing
- data: empty, no results, partial, stale, offline
- outcome: success, error, invalid, destructive confirmation
- access: signed out, permission denied, unavailable
- recovery: cancel, retry, undo, resume, restore

For AI products, distinguish thinking, tool execution, partial result, evidence, completion, failure, cancellation, and retry. Never use one generic spinner to represent every state.

## 6. Content Is Interface

- Use end-user language, active verbs, and stable action names.
- Make button labels describe the result.
- Keep labels, examples, helper text, and errors to one job each.
- Explain errors with a fix or next step.
- Use empty states to direct a meaningful first action.
- Test short, average, long, multilingual, missing, and user-generated content.

## 7. Vertical-Slice Method

Before scaling a product, complete one path that exercises:

- navigation and hierarchy
- representative data and content
- a primary action
- validation and async feedback
- error and recovery
- responsive or device adaptation
- the core component and motion language

Review the slice in the rendered surface. Update the system before expanding; avoid page-by-page styling drift.

## 8. Cross-Route Consistency

Audit the full product for:

- stable navigation and mental model
- consistent labels and action hierarchy
- shared component behavior
- predictable placement of primary and destructive actions
- preserved user context across route changes
- truthful URL/history behavior on web
- consistent permission, offline, and recovery patterns
- no orphan routes, dead ends, or decorative placeholders

Consistency does not mean identical layouts. Let task structure determine each screen while preserving system behavior.

## 9. Quality Gates

### Functional completeness

- Critical journeys work end to end.
- Every visible control has behavior.
- State transitions and recovery are observable.
- Destructive actions are confirmable or reversible.

### Visual craft

- Hierarchy, typography, spacing, alignment, assets, and copy survive realistic content.
- Secondary screens receive the same care as showcase screens.
- No unearned repetition or filler. Judge cards, gradients, ornament, plain surfaces and familiar type by the brief and approved direction; do not enforce a universal aesthetic blacklist.
- Compare the selected specimen with the actual body/utility surfaces, assets and motion; cross-route consistency alone does not prove direction fidelity.

### Accessibility

- Semantic structure and labels are present.
- Focus is visible and not obscured.
- Keyboard order follows the task.
- Touch targets and spacing fit the input environment.
- Text scaling and reduced motion preserve meaning.

### Performance

- Avoid avoidable waterfalls and oversized bundles.
- Virtualize or progressively render large collections.
- Reserve image/media dimensions and prevent layout shift.
- Keep interaction responsive during data and motion work.
- Test on representative lower-powered hardware when motion or media is central.

### Rendered evidence

Capture or inspect representative:

- desktop and narrow viewports
- light/dark themes when supported
- default, loading, long-content, error, and success states
- keyboard/focus and reduced-motion states
- mobile safe-area, keyboard-open, permission, and offline states when applicable

Classify findings:

- **P0**: task blocked, severe accessibility failure, data loss, or unusable layout
- **P1**: major journey, system, performance, or visual-quality failure
- **P2**: noticeable state, responsive, consistency, or polish defect
- **P3**: optional refinement

Resolve P0-P1 before handoff. Resolve P2 before production completion, or record an explicit acceptance with impact, owner, and due action.
