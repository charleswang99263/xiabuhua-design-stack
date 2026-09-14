# Component Geometry And System Truth

Use this reference when designing or reviewing controls, icons, reusable components, component libraries, design-system boards, or design-to-code handoff.

## Geometry Before Optical Correction

Define component geometry explicitly before applying visual nudges:

- outer control frame and minimum interactive target
- internal content box
- icon optical box and visible vector bounds
- label frame, type style, and line height
- spacing between icon, label, badge, and trailing affordance
- alignment axis and distribution rule
- state-dependent dimensions
- allowed optical offsets, if any

Start with deterministic geometric centering. Then inspect the rendered component at actual size and apply a small documented optical offset only when the glyph, icon mass, or font metrics visibly require it. Do not use arbitrary per-screen nudges to compensate for an undefined component contract.

## Single-Line Controls

- Set an explicit line height; do not rely on the font's default text bounding box.
- Vertically center the label frame inside the content box. When the design tool supports it reliably, use an auto-layout/stack alignment or make the single-line label frame span the control height.
- Center the combined icon-label group, not the icon and text independently.
- Keep the visible icon mass aligned to the label's optical center; raw vector bounds may include asymmetric whitespace.
- Separate visual height from interactive height. A compact visible control may use a larger transparent hit target when the platform supports it.
- Test long labels and text scaling before freezing width, padding, or truncation.

The familiar `44 x 44` touch target is a default minimum for handheld touch contexts, not a universal visible component size. Follow the target platform or product standard when it is stricter, and declare any deliberate exception.

## Component Geometry Contract

For shared components, record at least:

- semantic name and task
- size variants and min/max content behavior
- padding, gap, icon box, label line height, radius, border, and elevation tokens
- alignment and distribution rules
- default, pressed, selected, disabled, loading, error, and focus states as applicable
- pointer/touch target behavior
- text overflow, localization, text scaling, and responsive behavior
- documented optical offsets with rendered evidence

Validate nested geometry. A centered outer frame does not prove that the label inside a nested group, badge, or icon is centered.

## Icon Truth

Every production-intent icon must have three separately declared properties:

1. **Provenance**: where it came from and whether the project may use it.
2. **Design-source editability**: vector path, native symbol/component, managed font mapping, or intentionally raster-only asset.
3. **Runtime fidelity**: how the shipped platform renders the same icon and states.

Record:

- source library, file, or original authoring asset
- icon name/ID and version or retrieval date when the source can change
- license or project ownership when external reuse is involved
- design representation: editable vector, native symbol/component, managed icon-font mapping, or intentional raster source
- optical box, stroke/fill policy, corner language, and baseline rule
- default, selected, disabled, and inverse treatment as needed

Unmanaged text glyphs, emoji, and arbitrary Unicode characters are acceptable only for low-fidelity wireframes. A managed icon font or platform-native symbol can be production-valid when its name/codepoint mapping, version, license/platform availability, and runtime fallback are documented. Export an editable vector for cross-tool handoff where practical and permitted; do not falsely claim vector editability when the runtime source is font- or platform-owned.

Raster icons can be traceable production assets when their source, ownership, resolution variants, and runtime use are explicit; they simply do not satisfy editable-vector claims. AI-generated icon previews can guide direction but do not establish a stable production icon system by themselves.

## Design-System Truth Levels

Name the actual level instead of using “design system” as a blanket claim:

1. **Specification board**: visual tokens, measurements, examples, or usage notes only.
2. **Shared styles/tokens**: native variables or styles exist and are bound to consuming layers.
3. **Reusable design component library**: native masters/components, variants, properties, and instances exist and are used by screens.
4. **Production component library**: code components, tokens, documented states, and tested behavior exist in the implementation.

A swatch page is not proof of token binding. Repeated groups are not proof of components. A native master with no instances is not proof of adoption. A design component library is not automatically synchronized with production code.

For each handoff, declare the highest verified level and evidence:

- variable/style definitions and binding counts
- component masters/sets and instance usage
- variant/state coverage
- consumer screens inspected
- code mapping and tests when claiming production parity

## Required Render Checks

Inspect representative components at actual size and in context:

- icon-only, text-only, and icon-label controls
- selected/unselected navigation items
- short and long labels
- compact and large size variants
- light/dark or high-contrast contexts when supported
- text scaling, localization, and disabled/loading/error states

Machine checks can verify frames, bindings, source IDs, and token values. Human inspection decides optical balance, visual weight, recognizability, and whether the system feels coherent.
