---
name: xiabuhua-product-design
metadata:
  version: "5.2.0"
description: >-
  Design and deliver distinctive, production-grade digital products, including
  complete React + Vite desktop web apps, full-featured mobile apps, multi-route
  product experiences, design systems, motion-rich interfaces, coded prototypes,
  dashboards, and focused UI redesigns. Use for product UI/UX, visual direction,
  interaction architecture, navigation and state design, high-craft frontend
  work, mobile app design, design critique, design-system definition,
  implementation guidance, and rendered quality assurance. Route specialized
  execution to brand-style-reference, ui-interaction-reference, Figma,
  MasterGo, imagegen, html-deck-runtime, html-ppt-component-museum, Data
  Analytics, browser, or platform-specific engineering skills when relevant.
---

# Xiabuhua Product Design

Own user tasks, the confirmed visual direction, system decisions and final rendered acceptance. Specialized skills execute bounded jobs; none restarts art direction. Use the current host's tools, not assumed Codex APIs.

## Start with scope and direction

1. Identify the actual task, representative content/data, existing product and constraints. Distinguish facts, assumptions and unknowns. A technical preflight may precede styling, but must not choose a default theme.
2. For a bounded **delta**, inherit the established system and record only the change. For a **feature**, cover the connected task and states. For a new **product**, maintain one DESIGN.md using [design-contract-template](references/design-contract-template.md).
3. New unresolved visual work uses [style-direction-workflow](references/style-direction-workflow.md): normally show a recommendation and two viable, content-real alternatives; disclose constrained sets instead of inventing a third. Return the specimens and pending confirmation before full implementation. A supplied selected style/reference or explicit instruction to use a direction is inheritance evidence; do not ask again. Read-only research and nonvisual changes need no style vote.
4. Use [style-vocabulary](references/style-vocabulary.md) only for relevant directions. Translate the chosen [specimen recipe](../brand-style-reference/references/style-profiles/specimen-recipes.md) through [style-implementation](references/style-implementation.md). Freeze element choices, palette roles, typography, composition, material and permitted adaptations in the same agreement. Library example values are not universal presets.

## Read only what the job needs

Choose one primary delivery method. Add conditional references only for an actual unresolved issue; do not load the whole library or all skills in advance.

| Task | Read / route | Boundary |
|---|---|---|
| Operational web application | [web-app-method](references/web-app-method.md) | Real tasks/navigation/states; a report with filters is not automatically an app |
| Report / research / mixed evidence | [report-method](references/report-method.md) | Narrative and evidence first; no compulsory dashboard shell |
| Brand / editorial / marketing site | [brand-site-method](references/brand-site-method.md) | Argument, assets, proof and actions; static composition must stand on its own |
| Mobile product | [mobile-app-method](references/mobile-app-method.md) | Platform inputs, safe areas and lifecycle, not a shrunk desktop |
| Fixed-stage HTML presentation | [presentation-method](references/presentation-method.md) → html-deck-runtime | Main owns narrative/type/layout; runtime only stage/navigation/print |
| Data charts or structured diagrams | [chart-design-contract](references/chart-design-contract.md) | Data meaning/topology cannot be overridden by visual style |
| Cross-view or multi-mechanism motion choreography | [motion-system](references/motion-system.md) | State, timing, coordination and interruption; zero motion is valid |
| Known single tactile mechanism / bounded control refinement | Museum selected tactile contract + required primitive | Inherit the parent direction; skip full motion-system and external exploration unless a coordination gap exists |
| Cross-surface critique/method | [design-method](references/design-method.md) | Audit the user's actual scope; no automatic rebuild |

For multiple screens, use [interaction-contract](references/interaction-contract.md) as the shared state/route source. For native design files, read [design-file-native-quality](references/design-file-native-quality.md); for artifact/editability claims read [design-artifact-pipeline](references/design-artifact-pipeline.md). Read [icon-system](references/icon-system.md) when selecting or changing icons (Hugeicons Free Stroke Rounded for new unconstrained products; preserve existing/user choices), [component geometry](references/component-geometry-and-system-truth.md) for changed component/icon systems, and [design QA](references/design-qa-checklist.md) for feature/product handoff. Do not require these for every tiny edit.

## Execute within one design contract

Map the task-critical path, branches, data, permissions, empty/loading/error/recovery and responsive behavior. Design semantic tokens and shared components against representative content. Prove one complete vertical slice, including a dense/utility surface, before scaling; repair specimen drift first. Keep interaction semantics in real controls and data in one model rather than deriving business state from animated pixels.

[Executor handoff](references/executor-handoff.md) is read when crossing a skill/tool boundary. Pass the selected agreement, bounded content job, asset status, runtime constraints and acceptance evidence. A missing asset, incompatible device or factual problem returns as a specific gap, not a silent change of style.

| Need | Executor |
|---|---|
| Visual precedents / chosen profile details | brand-style-reference; read only selected entries |
| Common local interactive mechanism / data or graphics lab | html-ppt-component-museum; use local index before external exploration |
| New mechanism, handfeel diagnosis or gap beyond local sources | ui-interaction-reference; owns concrete interaction specification, not macro style |
| Selected GSAP timeline, scroll, SVG or imperative choreography | ui-interaction-reference → [GSAP execution](../ui-interaction-reference/references/gsap-execution.md); read only relevant official topics; parent keeps motion intent and acceptance |
| Fixed stage / paged deck export | html-deck-runtime; never for ordinary scrolling sites or reports |
| Flow / sequence / state / architecture | fireworks-tech-graph with parent type/line/palette and truthful topology |
| Data calculation / source validation / report production | Available Data Analytics workflow; preserve its evidence rules, adapt visual identity only |
| Bitmap asset | Available image generation workflow; never replace required imagery with crude CSS placeholders |
| Editable design file | Available Figma/Sketch/MasterGo workflow; without a connected tool use supplied exports and state the lower artifact fidelity |
| Rendered verification | Available browser and screenshot tools; stronger automated checks when the risk warrants them |

No fixed chain requires calling every child. A simple text correction stays local; a static chart may only need the chart contract and SVG. A known component does not require another online search. Framework/library choice follows task, existing project and measured cost, not novelty.

For a chart/report paradigm beyond the short contract, use the [complete data/report index](references/data-report-patterns.md) and read only the selected chart or report entry. It contains 61 chart specifications and 12 report skeleton specifications, not a claim of 73 prebuilt production components. For expanded motion/media/measurement work, use the [extended motion index](references/motion-extended/index.md); intent, recipe, arc, case and tool classifications overlap and must not be added as a component total. For mobile component state examples, use [mobile component patterns](references/mobile-component-patterns.md) only when relevant. These references fill the parent agreement rather than creating parallel approval or documentation workflows.

## Acceptance

Verify independent results: selection compliance, direction fidelity, content/data correctness, interaction behavior and runtime health. Compare target and render for focal hierarchy, type roles, main color regions, asset quality, material, ordinary surfaces and justified adaptations. Inspect a settled static frame separately from real pointer/keyboard/touch progression; animated screenshots alone prove neither.

Test relevant loading/empty/error, interruption/retry, focus, text scaling, reduced motion, narrow layout and resource cleanup. Use deterministic checks for model/topology/geometry; visual review for legibility/composition; actual inputs for interaction. Validate diagnostic tests against a deliberately broken fixture when they could falsely pass. Never present a universal quality score or unmeasured speed claim.

For graphs and timelines, use the exact contracts above: no false causality, invented samples, animation-driven business commits or hidden critical text. Production-critical failures must be repaired; other unresolved deviations require explicit scope/impact in handoff. A diagram, prototype, editable source and implemented product are different deliverables.

Hand off the usable artifact, selected direction, meaningful verification, asset/runtime boundaries and unresolved issues. Delta work needs a delta record, not a large new documentation stack. See [environment](references/environment.md) only for host/runtime setup or missing capabilities.
