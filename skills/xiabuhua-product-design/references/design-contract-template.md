# DESIGN.md Contract Template

Use by default for new products and substantial redesigns. For a Feature, use it only when the work spans multiple iterations or the project already maintains `DESIGN.md`; otherwise keep the same contracts in the feature handoff. Keep it current as decisions change. Remove irrelevant sections instead of filling them with placeholders.

## Contents

1. Product and artifact contract
2. Product map and interaction contract
3. Platform and art direction
4. Tokens, component geometry, and system truth
5. Content, motion, assets, and icons
6. Quality budgets and vertical slice
7. Acceptance, evidence, consistency, and decisions

```markdown
# [Project Name] DESIGN.md

## 1. Product Contract

- Primary users and roles:
- Top jobs:
- Desired outcomes and success signals:
- Scope: delta / feature / product
- Delivery level: concept / editable design spec / clickable prototype / production
- Target platforms, devices, browsers:
- Technical stack and repository constraints:
- Existing source of truth:
- In scope:
- Explicitly out of scope:
- Must preserve:

### Artifact Contract

| Role | Authoritative artifact | Generated from | Editable | Verification | Last verified |
| --- | --- | --- | --- | --- | --- |
| Product/design contract | | | yes/no | | |
| Interaction contract | | | yes/no | | |
| Design source | | | yes/no | | |
| Preview/export | | | yes/no | | |
| Production implementation | | | yes/no | | |

State explicitly which rows do not exist. A preview is not the editable source, a clickable prototype is not production, and a specification board is not automatically a component library.

## 2. Product Map

### Route / Screen Inventory

| Route or screen | User job | Entry | Primary action | Data / permission | Exit |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

### Navigation Model

- Global navigation:
- Hierarchical navigation:
- Modal/sheet/overlay rules:
- Back/history/deep-link behavior:
- Preserved context:

### Critical Journeys

| Journey | Start | Key steps | Success | Failure / recovery |
| --- | --- | --- | --- | --- |
| | | | | |

### Interaction Contract

Use one machine-readable manifest for feature/product work with multiple screens. Hotspots, flow diagrams, route maps, and implementation handoff must be derived from or checked against it.

| Edge ID | Source | Trigger/control | Target | Gate + gate ID | Required/resolved outcome | Return context | Preserved state |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | none or declared gate | | | |

- Interaction-contract artifact:
- Contract validator and last result:
- Review map generated from:
- Prototype hotspots checked against:

## 3. Platform Profile

- Desktop web behavior:
- Responsive/narrow behavior:
- iOS adaptations:
- Android adaptations:
- Keyboard, pointer, touch, gesture:
- Safe-area and software-keyboard behavior:
- Offline, background, resume, and interrupted-task behavior:

Remove platform rows that do not apply.

## 4. Art Direction

Complete before detailed visual implementation; inherit an existing target for a delta. Follow `references/style-direction-workflow.md` in the main skill.

- Direction status: candidate / pending_confirmation / approved / inherited
- User selection or inherited-source evidence:
- Selected specimen and representative content:
- Candidate rationale and meaningful alternatives (if explored):
- Primary visual language, task structure and supporting layer roles:
- Pairwise distinction evidence: each existing pair (A/B, A/C, B/C for three); distinct / variant / unverified:
- Implementation map: DOM/layout, type roles, graphics/assets, material, state/motion:
- Locked composition, density, type roles, palette/surface, material/assets, shape and motion:
- Flexible responsive, wrapping, sizing and state adaptations:
- Direction changes requiring user selection:
- Rendered specimen-to-output check and justified deviations:
- Separate results: selection compliance / candidate distinction / selected-direction fidelity:

- Visual thesis:
- Subject vocabulary:
- Audience posture:
- Composition principle:
- Signature element:
- Imagery/material language:
- Explicit aesthetic avoidances:

### Reference Adaptation

| Reference | Role | Principle retained | Project-specific adaptation | Explicit exclusion |
| --- | --- | --- | --- | --- |
| | structure / expression / interaction | | | |

References are ingredients, not templates. Do not copy branded assets, content,
or a recognizable page composition. The final tokens and rules belong to this
project.

### Design Dials

| Dial | Value (1-10) | Observable consequence |
| --- | ---: | --- |
| Layout variation | | |
| Motion intensity | | |
| Visual density | | |

## 5. Token System

Prefer primitive -> semantic -> component layers for feature/product work.

### Color And Surface

| Semantic role | Light | Dark | Usage |
| --- | --- | --- | --- |
| text.primary | | | |
| surface.canvas | | | |
| surface.raised | | | |
| border.subtle | | | |
| action.primary | | | |
| status.success/warning/error/info | | | |
| focus.ring | | | |

### Typography

| Role | Family | Size / scale | Weight | Line height | Usage |
| --- | --- | --- | --- | --- | --- |
| display | | | | | |
| title | | | | | |
| body | | | | | |
| label | | | | | |
| data / utility | | | | | |

### Layout And Shape

- Breakpoints / device classes:
- Grid and content bounds:
- Page/screen margins:
- Spacing rhythm:
- Stable dimensions:
- Radius, border, divider, and elevation:
- Long-content and overflow behavior:

## 6. Component Contracts

| Component | Anatomy / slots | Explicit variants | Relevant states | Platform/responsive behavior |
| --- | --- | --- | --- | --- |
| | | | | |

### Component Geometry

- Control height and supported density:
- Single-line text-frame and line-height rule:
- Icon optical box, baseline, and icon-label gap:
- Minimum touch/click target:
- Long-label, text-scaling, and localization behavior:
- Rendered optical-alignment evidence:

### Design-System Truth Level

Declare exactly one current level and list evidence:

- [ ] Visual specification board only
- [ ] Shared variables/styles/tokens
- [ ] Reusable design-file components with instances and variants
- [ ] Production component library with documented API and tests

- Token source and bindings:
- Component/master source:
- Instance/variant evidence:
- Production-code mapping, if any:

### External Component Decisions

Document only external references that materially affect the build.

| Component job | Source/item | Adaptation | Dependencies | Accessibility/performance | License decision |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

State families to review:

- rest: default, hover, focus, active, selected, disabled
- async: initial load, incremental load, refresh, processing
- data: empty, no result, partial, stale, offline
- outcome: success, error, invalid, destructive
- access: signed out, permission denied, unavailable
- recovery: cancel, retry, undo, resume, restore

Implement only states that can occur.

## 7. Content And Data

- Real or representative content source:
- Naming and action vocabulary:
- Empty-state first action:
- Error and recovery language:
- Short/average/long/multilingual content cases:
- Data freshness and precision:
- Privacy, trust, and evidence rules:

## 8. Motion System

| Pattern | Job | Trigger | Behavior | Interruption | Reduced-motion variant |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

- Primary motion technology:
- Duration/easing/spring tokens:
- Route/view transition rules:
- Gesture-linked motion:
- Signature sequence:
- Performance constraints:
- Explicitly avoided motion:

## 9. Assets And Icons

- Read [icon-system](icon-system.md) for the default family decision, package and license rules, and render checks.
- Existing asset sources:
- Icon library and optical rules:
- Required photography/illustration/generated assets:
- Crop, resolution, masking, and fallback:
- Theme/platform variants:
- Traceable source/library and license:
- Editable source format:
- Optical box, stroke/fill, baseline, and selected-state rules:
- Placeholder-only assets that must not ship:

## 10. Quality Budgets

### Accessibility

- Semantic and assistive requirements:
- Focus and keyboard requirements:
- Touch-target standard:
- Text scaling / Dynamic Type:
- Contrast:
- Reduced motion:

### Performance

- Loading and bundle expectations:
- Interaction responsiveness:
- List/media/3D constraints:
- Motion frame-rate target:
- Representative low-powered device:

### Product Integrity

- Destructive and unsaved-work behavior:
- Permissions and authentication:
- Offline/recovery:
- URL/history or deep-link truthfulness:
- Data protection:

## 11. Vertical Slice

- Representative journey:
- Routes/screens included:
- Components and states exercised:
- Motion patterns exercised:
- Acceptance evidence:
- Decisions to resolve before scaling:

## 12. Acceptance Matrix

| Journey / surface | Viewport / device | Required states | Input modes | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

P0-P1 issues must be resolved before handoff. P2 must be resolved before production completion or explicitly accepted with impact, owner, and due action.

### Five-Layer QA Record

| Layer | Deterministic checks | Rendered/task checks | Evidence | Status |
| --- | --- | --- | --- | --- |
| Structural | files, pages, screens, IDs, counts, links | artifact opens and expected surfaces are present | | |
| Component | tokens, variants, instances, target sizes | optical balance, long content, state coherence | | |
| Visual | bounds, clipping, contrast where computable | hierarchy, crop, spacing rhythm, legibility | | |
| Interaction | edge coverage, valid targets, no orphans | task completion, gates, back/cancel/retry/return | | |
| Runtime | build/tests/integrity where applicable | real device/browser behavior and performance | | |

If a layer is outside the declared delivery level, mark it `not applicable` with a reason. Do not mark it passed.

## 13. Evidence Ledger

| Claim | Exact artifact/view | Source revision or hash | Check method | Result | Limitation |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 14. Contract Consistency

- Approved/inherited direction, evidence and selected specimen agree with every visual executor:
- Dense/secondary rendered surfaces preserve the agreed direction:
- Current scope agrees with later design decisions:
- Screen inventory agrees with interaction contract:
- Interaction contract agrees with hotspots and diagrams:
- Declared design-system level agrees with actual tokens/components/instances:
- Generated counts and timestamps come from the current artifact, not copied prose:

## 15. Decision Log

| Date | Decision | Basis | Consequence |
| --- | --- | --- | --- |
| | | | |
```

For a bounded delta, do not create this file solely for process compliance. Record only changed tokens, components, states, constraints, and rendered QA evidence.
