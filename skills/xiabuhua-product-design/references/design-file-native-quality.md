# Native Design File Quality

Use this reference when the deliverable is an editable Figma or Sketch source, or when design-file quality materially affects implementation handoff. It complements `design-artifact-pipeline.md`: that file defines artifact truth; this file defines what a healthy native design source looks like and how to build or review one.

## 1. Define The Native-File Contract

Before editing, identify:

- the authoritative source: code, existing design file, reference capture, or approved specification
- target tool and file, page, frame/artboard, and layer IDs when known
- declared delivery level: concept, editable specification, reusable component library, or clickable prototype
- screen/state/device scope and the journeys the file must represent
- existing libraries, design tokens/styles, reusable components, and production-code mappings
- what may be created, what must be preserved, and how review history is protected

Do not claim parity with code, component-library maturity, or prototype completeness unless the native file contains the structures that support the claim.

## 2. Run A Readiness Scan Before Mutation

Inspect the smallest relevant subtree and record gaps that would force the agent to guess:

| Signal | Healthy evidence | Gap to expose |
| --- | --- | --- |
| Purpose | components describe purpose, usage, and constraints | appearance-only or missing descriptions |
| Naming | semantic page, frame, layer, component, and variant names | default or inconsistent names |
| Layout | Auto Layout or Stacks encode responsive relationships | repeated manual coordinates for structured UI |
| System binding | colors, type, spacing, radii, and effects use native variables/styles | raw values beside systemized peers |
| Reuse | screens consume instances with properties or overrides | repeated one-off groups or detached components |
| States | relevant default, pressed, focus, disabled, loading, error, selected states exist | visual happy path only |
| Content | representative copy, data, localization, and assets | placeholders that hide layout weakness |
| Code bridge | Code Connect, documented mapping, or explicit parity record | inferred or stale component mapping |
| Accessibility | target size, contrast, focus/order, text scaling, and annotations | inaccessible or undocumented behavior |
| File organization | clear foundations, components, screens, flows, and handoff areas | one undifferentiated canvas |

Keep an inference ledger for every material guess: evidence, inference, confidence, affected node, and how a reviewer can confirm it. A readiness score may summarize findings, but the issue inventory and evidence are authoritative.

## 3. Reuse Before Creating

Use this priority order:

1. matching local component/style already used by nearby screens
2. linked or approved library asset compatible with the target system
3. a wrapper or local extension around a close component when its public properties are insufficient
4. a new native component built from existing tokens
5. a one-off group only when the content is genuinely unique

Do not detach a component merely to make a small visual edit. Do not introduce a second token or component system beside an established one. If code and design disagree, show both sources and resolve the owner before scaling the mismatch.

## 4. Structure Before Pixels

Plan the page/frame hierarchy, regions, layout model, component responsibilities, and reusable assets before detailed styling.

- Structured rows, columns, forms, cards, lists, navigation, and repeated modules use the tool's native layout system.
- Free positioning is reserved for overlays, masks, diagrams, or deliberately freeform artwork.
- Repeated UI becomes one component/symbol source with instances and controlled properties/overrides.
- Complex logos, photos, illustrations, screenshots, and detailed icons remain real assets; do not approximate them with generic primitives.
- Build the outer container and major regions before details so later edits do not require unsafe reparenting or full reconstruction.

## 5. Build In Small, Reversible Batches

One mutation batch should have one inspectable job: create a wrapper, configure one region, add one component family, transfer one asset set, or fix one mismatch category.

After every meaningful batch:

1. re-read structure and returned IDs
2. capture the affected region at its intended size
3. compare it with the approved direction or reference anchor
4. fix the largest structural mismatch before polish
5. record changed node IDs and pending checks

Patch existing work instead of rebuilding tuned sections. Before reordering, reparenting, replacing, or deleting, record the target IDs and child counts; confirm the same invariants afterward. Stop after a failed mutation, inspect the error/current state, and correct the cause before retrying.

## 6. Figma Adapter

Use the available official Figma skills for execution. This reference adds the Xiabuhua quality boundary around them.

- Discover Code Connect mappings, existing screens, libraries, variables, and styles before searching broadly or drawing primitives.
- Prefer component instances, bound variables, text/effect styles, and documented component properties over hardcoded layers.
- Build repeated or source-component-shaped content as a component on the first pass; do not defer componentization to cleanup.
- Create the page/view wrapper first, then build and validate one major section at a time inside it.
- When the source is a rendered web product, use the rendered capture as a visual anchor while preserving native instances and variable bindings in the editable result. The capture is evidence, not the final source.
- Import traceable SVG source for icons instead of reconstructing them from rotated primitives. Preserve asset provenance and intended editability.
- Assert the actual product font and relevant styles after generation; a successfully loaded fallback font is still a mismatch.
- For a design system, create foundations before components, alias semantics to primitives, set appropriate variable scopes and code syntax, cap variant matrices, and use instance-swap properties for interchangeable icons/assets.
- Keep Figma mutations sequential. Persist exact returned IDs for long workflows and validate metadata plus rendered screenshots before building on a phase.

## 7. Sketch Adapter

Use Sketch's MCP guides and native API rather than porting Figma terminology mechanically.

- Start with document information, the scoped layer tree, design assets, linked Libraries, Symbol overrides, and the relevant MCP/layout/use guides.
- When matching a URL, screenshot, or code source, freeze a reference anchor at the target width and extract a fidelity specification: regions, verbatim copy, typography, colors, dimensions, spacing, and asset sources.
- Use Stacks for structured layouts and preserve explicit freeform placement only where it communicates the design.
- Reuse Library or local Symbols, Text Styles, Layer Styles, Color Variables/swatches, and Frame Templates. Repeated UI should normally use one Symbol Source, instances, and deliberate overrides.
- Use small targeted `run_code` scripts. Separate probing, creation, styling, asset transfer, and reordering so failures remain recoverable.
- Build one top-level region at a time and run a screenshot region gate before moving on.
- For image variation inside repeated content, prepare image layers in the Symbol Source and use supported overrides rather than attaching ad-hoc images to instances.
- Patch individual stack, style, override, order, or geometry defects. If a mutation loses layers or changes child counts unexpectedly, stop and require Undo/Revert before continuing.

## 8. Visual And Structural Gates

Run both classes; neither substitutes for the other.

### Structural gate

- expected pages, screens, states, components/symbols, and assets exist
- native layout relationships survive content changes
- repeated UI uses reusable sources and consuming instances
- tokens/styles are bound rather than merely displayed on a specification page
- names, properties/overrides, IDs, and code mappings are stable and understandable
- no accidental detachments, unresolved fonts/assets, placeholder content, or orphaned sources

### Rendered gate

- hierarchy, density, rhythm, alignment, optical balance, and crop quality match the approved direction
- text does not clip at long labels, localization, text scaling, or compact widths
- real images/icons/logos replace temporary geometry before handoff
- default and relevant interaction states remain legible and coherent
- representative device/viewport variants preserve the same product language without pretending desktop and mobile are identical

When fidelity to a reference is the task, compare at a matching width and classify deltas in this order: missing region, wrong structure/order, missing or wrong content, spacing/sizing, typography/color, then asset polish. Do not stop while major deltas remain.

## 9. Handoff Evidence

Report:

- file/page/frame or artboard name and stable ID/URL
- authoritative source and reference-anchor dimensions when applicable
- native components/symbols, variables/styles, properties/overrides, and libraries used or created
- readiness gaps resolved and material inferences still open
- structural checks and rendered views/states inspected
- code-parity evidence, prototype journeys, and runtime validation when they actually exist
- remaining major and minor deltas, with no visual-polish claim above the verified artifact level

The file is ready only when another designer can locate and edit the source, an engineer can understand system mappings, and the declared screens/states pass both structural and rendered review.
