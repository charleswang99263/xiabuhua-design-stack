# Interaction Contract

Use this reference for Feature or Product work with multiple screens, routes, gates, or recovery branches. A Delta does not need a new full manifest when the host product already has an authoritative route model; record only the changed edges and verify them against that model.

## One Contract, Several Projections

Maintain one authoritative interaction contract. Treat hotspots, prototype links, review diagrams, route tables, test cases, and implementation routes as projections of it rather than independent descriptions.

If the design tool cannot generate those projections from one file, name the authoritative source explicitly and compare every projection back to it before handoff. Never silently maintain two “sources of truth.”

The contract should answer:

- which screens or states exist and which are entries or terminals
- what user or system trigger creates each transition
- where the transition lands
- whether authentication, permission, connectivity, payment, or another gate intervenes
- which context and user state survive the transition
- where cancel, retry, failure, and completion return
- which visible control or gesture owns the transition

## Minimum Manifest

For Feature and Product work, record at least:

### Manifest

- `version`: contract version
- `graphMode`: `journey` for task flows with outcomes, or `navigation` for persistent route maps
- `interactionTarget`: explicit platform, input mode, unit, and minimum width/height; do not silently assume `44 x 44` across pointer, iOS, Android, or mixed-platform artifacts
- `gateTypes`: allowed gate vocabulary, including `none`; extend it deliberately instead of inventing values edge by edge

### Screen

- `id`: stable machine-readable identifier
- `name`: reviewer-facing name
- `role`: entry, task, gate, recovery, success, terminal, or another declared role
- `entry`: whether the flow can start here
- `terminal`: whether no onward task transition is required

### Edge

- `id`: stable unique identifier
- `source`: source screen or state ID
- `trigger`: specific control, gesture, or system event
- `target`: destination screen or state ID
- `gate`: `none` or a declared gate type
- `gateId`: stable identifier for an interrupted gated intent
- `requiredOutcomes`: required resolution outcomes such as success, cancel, denied, failure, or retry
- `resolvesGate`: gate ID and outcome for a distinct resolution edge; do not use metadata-only targets as a substitute for an executable edge
- `returnContext`: required for gated edges; identifies where and how the interrupted intent resumes
- `preservedState`: state that must survive navigation or the gate
- `cancelTarget`: destination when the user abandons the action, when applicable
- `retryTarget`: destination for retry or recovery, when applicable
- `hotspot`: width and height of the interactive target when the artifact exposes hotspots

Use `templates/interaction-manifest.json` as a starting point. Validate it with `scripts/validate_interaction_manifest.py`.

## Gate And Return Rules

A gate is part of the interaction, not an unrelated detour.

- Preserve the interrupted intent and enough context to resume it.
- Declare the post-success destination or resume trigger.
- Declare cancel and failure behavior when they differ from the source.
- Do not send every successful login or permission grant to a generic home screen.
- Do not represent permission denial as a dead end when settings, retry, or degraded use exists.

## Review Views

Keep two projections when a full graph would be unreadable:

1. **Journey map**: the small set of paths needed for product review.
2. **Edge inventory**: every transition, gate, cancel, retry, and recovery edge needed for build and QA.

Both must derive from the same contract. A clean diagram is not evidence of complete edge coverage.

## Verification

Machine-check where the artifact permits it:

- screen and edge IDs are unique
- at least one entry exists; all non-entry screens are reachable from an entry
- every edge references existing source and target screens
- every required field is present
- gated edges target a gate-role screen, declare a valid `returnContext`, and have distinct resolution edges for every required outcome
- resolution edges preserve the state required by the interrupted gate edge
- hotspot dimensions meet the declared minimum
- non-entry task screens have at least one incoming edge
- non-terminal task screens have at least one outgoing edge
- terminal screens have no outgoing edges
- in `journey` mode, at least one terminal exists and every non-terminal screen can reach a terminal

Then verify in the rendered prototype:

- the named trigger is visible and discoverable
- the hotspot matches the visible control rather than a nearby area
- the destination and back behavior match the contract
- preserved state actually remains preserved
- gate success, cancel, denial, failure, and retry behave as declared

Do not call a prototype interaction-complete because a link count matches. Complete the task path as a user.
