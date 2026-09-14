# Design Artifact Truth Pipeline

Use this reference when work produces editable design files, generated design documents, clickable prototypes, previews, exports, or production code. The goal is to make every claim traceable to the artifact that actually supports it.

## Declare The Delivery Level

Use the lowest truthful level:

1. **Concept**: direction, composition, or visual exploration; not an implementation specification.
2. **Editable design specification**: inspectable layers, measurements, styles, and states; interactions may be documented rather than executable.
3. **Clickable prototype**: a design artifact with tested transitions for declared journeys; not production behavior.
4. **Production implementation**: executable product code connected to the declared data and platform boundaries.

Do not infer a higher level from visual polish. A bitmap mockup is not an editable component system, a linked design file is not a built app, and successful generation is not user-level acceptance.

## Artifact Contract

Before generation or handoff, record:

- authoritative source: the file or manifest whose edits should drive regeneration
- generated artifact: the file produced from that source, if any
- delivery level and what is explicitly out of scope
- generator or tool version when reproducibility depends on it
- input assets and their provenance
- expected page, board, screen, component, and hotspot scope
- output path and overwrite/versioning policy
- evidence path for previews, reports, logs, or checksums
- known manual steps that can create drift

Protect review history when comparison or approval depends on it: generate to a new version or evidence directory rather than silently replacing the reviewed result. A Delta inside an established repository may follow the repository's existing version policy instead of creating parallel archives.

For a Delta, use a compact record: reference the existing artifact contract and record only the affected source/output, changed scope, overwrite policy, and affected QA. Do not require generator details, global counts, or full journey evidence when they do not apply.

## Source, Output, Preview, Evidence

Keep these roles distinct:

- **Source**: editable input or generator definition.
- **Output**: produced Sketch/Figma/MasterGo/code artifact.
- **Preview**: raster, PDF, or browser rendering used to inspect appearance.
- **Evidence**: machine report and human review record tied to a specific output.

A preview cannot prove layer editability. A source file cannot prove the generated output rendered correctly. A checksum cannot prove the task flow works.

## Evidence Ledger

For each handoff, record:

- artifact path or URL
- source revision, timestamp, or checksum when available
- delivery level
- generated counts obtained from the current artifact rather than copied from a prior report
- validator commands and outcomes
- representative rendered views and states inspected
- journeys completed in the prototype or runtime
- unverified boundaries and why they remain unverified

Regenerate numeric evidence from the current artifact. If the tool cannot expose a trustworthy count, label the number as manual or approximate instead of presenting it as exact.

## Truth Boundaries

- A design-system page is a specification board until native variables/styles and reusable components are verified.
- A repeated visual group is not a component instance merely because it looks consistent.
- An unmanaged text glyph does not establish icon provenance. A raster icon may be traceable but must not be described as an editable vector; record provenance, editability, and runtime fidelity separately.
- A generated image may be inspiration or a bitmap asset; it is not editable UI source.
- A prototype hotspot proves only the declared transition after that transition is tested.
- A build, export, save, upload, or HTTP success proves only that operation.

## Pipeline

1. Freeze or identify the authoritative source and artifact contract.
2. Generate or edit the artifact without changing the declared output boundary.
3. Run structural and contract validators against the current output.
4. Render representative screens, components, states, and long-content cases.
5. Execute declared journeys and recovery branches.
6. Test the production runtime only when production implementation exists.
7. Publish the evidence ledger with clear pass, fail, not-applicable, and unverified states.

If a stage is unavailable, do not simulate its evidence. Mark the boundary and keep the delivery claim at the supported level.
