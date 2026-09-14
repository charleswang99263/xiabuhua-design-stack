---
name: brand-style-reference
metadata:
  version: "5.1.0"
description: >-
  Select and adapt style and brand visual references for product design, web
  apps, mobile apps, landing pages, dashboards, reports, HTML presentations,
  and interactive explainers. Use when a design brief would benefit from
  concrete precedents for visual tone, typography, color, composition, density,
  imagery, components, or motion. Match the brief to 1-3 relevant brand
  references, extract reusable principles, and translate them into an original
  project-owned direction without copying trademarks, assets, layouts, content,
  or a brand system wholesale.
---

# Style And Brand Reference

Use this skill as the main design workflow's reference branch. Supply evidence from different visual sources as peers; the main skill and user own the direction decision. This branch is not a preset selector, a design system to install or a cloning instruction.

## Direction ownership

The main design skill owns the direction decision and user selection. Read the project's style agreement before selecting references. For `approved`/`inherited` work, search only for details/evidence that fit its composition, typography, material/assets and motion; do not propose a replacement identity or restart a vote. For unresolved new direction, contribute candidate evidence to [the shared workflow](../xiabuhua-product-design/references/style-direction-workflow.md), not an independent approval process. `candidate`/`pending_confirmation` permits exploration only.

Requirements choose the vocabulary; the brand index retrieves evidence afterward. The index is not an industry-to-brand mapping. Template font/color values do not outrank an approved specimen, and exact counts of references are not success criteria.

## Peer reference families

- [Style vocabulary](../xiabuhua-product-design/references/style-vocabulary.md): overlapping expression, composition, material and interaction facets.
- [Executable style profiles](references/style-profiles/README.md): source-grounded definitions, close-neighbor distinctions and original DOM/CSS/SVG/state mappings. Read only selected profiles; examples are adaptable relationships, not universal presets.
- [24 specimen recipes](references/style-profiles/specimen-recipes.md): when turning a selected direction into implementation, read its entry for element selection, role-based palettes, typography/composition, material rules and fidelity checks. Freeze the project-specific recipe in the main style agreement; do not transplant every sample's staircase, serif heading or colors into unrelated projects.
- [Brand reference index](references/brand-index.md): 74 public-site interpretations, useful only where their principles fit this brief.
- [Composition specimen index](references/presentation-styles/INDEX.md): migrated presentation-origin specimens, including 34 former template references and other examples. Their origin gives them no priority for decks, websites or reports.

Choose any source family by the same requirement-fit criteria. There is no safe/bold allocation, compulsory template, preferred source, or rule that a deck must use presentation-origin material. Specimen values describe that example; they never freeze the new project's system. The execution skill `html-deck-runtime` neither owns nor retrieves these references.

## Reference Workflow

### 1. Describe the brief

Identify:

- product/content type and primary task
- audience and trust posture
- desired tone and emotional temperature
- information density and reading rhythm
- media, data, and interaction needs
- platform and accessibility constraints
- explicit aesthetic avoidances

### 2. Select references

Read the relevant peer index above. Shortlist at most three useful references with
different jobs:

- **structure**: composition, hierarchy, navigation, or density
- **expression**: color, typography, imagery, material, or atmosphere
- **interaction language**: pacing, continuity, feedback philosophy, or content behavior

One reference may cover multiple jobs. Prefer one strong reference over three
weak ones. Do not choose brands only because they are fashionable.

### 3. Inspect the source documents

Read each selected file in full:

`references/brands/<slug>/DESIGN.md` or the exact selected path listed by `references/presentation-styles/INDEX.md`

Do not load the whole library. Treat every upstream document as an
interpretation of a public site, not as an authoritative brand standard.
Verify live behavior when current accuracy matters.

### 4. Build an adaptation matrix

For each candidate, record:

| Reference | Job | Principle to borrow | Why it fits | Project adaptation | Explicit exclusion |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Borrow relationships and principles, not a recognizable composition. Examples:

- borrow a restrained accent hierarchy, not the exact palette
- borrow editorial pacing, not the same hero structure
- borrow screenshot-as-evidence, not the source product mockup
- borrow keyboard-first density, not proprietary interaction chrome

### 5. Supply project-owned direction evidence

For unresolved candidates, synthesize reference principles with the brief and submit the alternatives to the main workflow for user selection. For approved/inherited direction, refine only the permitted details. Define project tokens, component contracts and asset/motion rules within the selected specimen. Record adaptations and check the dense/body surface as well as the expressive surface.

This skill defines interaction language, not concrete external components. Use
`ui-interaction-reference` only after a component's communication job is clear.

For substantial work, add the adaptation matrix or a concise version to the
project `DESIGN.md`. For a bounded delta, note only the relevant influence and
changed rules in the delivery summary.

## Guardrails

- Never copy logos, trademarks, proprietary fonts, illustrations, photography,
  product screenshots, copy, or branded assets.
- Never reproduce one site's page structure, section order, and styling as a
  package.
- Do not import exact tokens by default. Recalculate contrast, spacing, type,
  touch targets, and responsive behavior for the current product.
- Do not let a marketing-site reference override product usability, platform
  conventions, accessibility, performance, or existing design-system rules.
- Avoid "Brand A clone" language in project documentation. Name the specific
  design principle being adapted.
- Preserve deliberate differences. The final system should remain identifiable
  as the current product.

## Library Notes

The local library is a snapshot of
`VoltAgent/awesome-design-md` at commit `664b3e7` from 2026-06-16. It contains
74 reference documents under `references/brands/`; upstream license terms are
stored in `references/UPSTREAM_LICENSE.txt`.

Presentation-origin references were migrated from the former html-deck-runtime library during the 4.0 upgrade; their provenance and license are retained in `references/presentation-styles/`. They are optional examples at the same level as other style evidence.

The brand library is strongest for visual language and marketing surfaces. It does
not replace full-product journey mapping, state coverage, mobile platform
behavior, accessibility, motion reduction, engineering architecture, or
rendered QA.


## Host compatibility

For missing tools or runtime setup, read [environment](../xiabuhua-product-design/references/environment.md).
