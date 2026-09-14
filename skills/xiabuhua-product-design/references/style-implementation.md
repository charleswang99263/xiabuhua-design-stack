# From visual direction to executable rules

Use while constructing candidates and preparing the selected direction for implementation. Detailed profiles are reached through [style-vocabulary.md](style-vocabulary.md). They contain researched concepts and original code adaptations, not universal templates. Read only relevant profiles. Do not compile the whole vocabulary into one stylesheet.

## 1. Write a design thesis with causes

Connect the actual requirement to a relationship the page must exhibit: “Residents should recognize a practical, welcoming repair workshop; a bold civic-poster hierarchy and tactile hard-depth controls make the invitation and next action visible.” A label such as “modern”, “editorial” or “Dark Tech” alone cannot decide layout.

Record the task structure separately from the visual language and supporting treatments. A data report may have a Swiss, editorial or illustration-led identity while keeping the same data semantics. A material-led identity may be valid without radically reordering the task. Typography roles, dominant forms, spatial/material behavior and imagery can establish substantial difference with shared semantic HTML.

Check recommendation habits against subject evidence: warmth does not automatically mean paper, trust blue, technology dark, or editorial serif. Do not default to a grid / warm-paper / dark-tech trio. If similar candidates recur in authorized prior work, justify the recurrence from this brief or broaden reference retrieval; do not rotate styles randomly to manufacture novelty. The easiest CSS fragment is not necessarily the best direction.

Before discarding an asset-dependent direction, distinguish unavailable assets from a convenience preference for CSS. Confirm what is supplied, can be produced within authorization, or is still needed. An unloaded font, generic placeholder illustration or empty 3D scene does not validate its intended identity. Keep factual interface content in real text; preserve representative Chinese as well as Latin text.

When representative content is missing, label any invented specimen data/policy as illustrative and keep unknown real facts unresolved. Do not call invented counts, records or eligibility rules “real content”. The same explicitly illustrative content can support a fair visual comparison, but cannot establish factual correctness.

## 2. Translate relationships, not only tokens

For each candidate use this compact implementation map in the existing direction record. Prose is sufficient; the user sees the visual result and concise choices, not internal bookkeeping.

| Design layer | Specify for this brief | Observable implementation evidence |
| --- | --- | --- |
| Composition | Visual center, reading path, grouping, scale relationships, expressive/dense areas | Semantic section/figure/table structure; Grid tracks/areas, flex direction, spans and source order; responsive reflow |
| Typography | Display/body/caption/UI roles, contrast of scale/weight/width, language coverage and reading measure | Role-scoped font tokens; line height, width, wrapping; actual loaded/fallback glyphs; figure/label alignment |
| Graphic language | Image subject, crop, silhouette, illustration strokes, repeated motifs and their content role | Real asset plan; SVG geometry/viewBox; object-fit/object-position; layered figures, not unrelated stock decoration |
| Material and color | What appears solid, transparent, raised, recessed or printed; where signals draw attention | Surface/ink/state tokens; explicit layer ordering; border, shadow, backdrop, mask and compositing rules |
| Motion and space | Trigger, previous/next state, persistent identity, duration/easing intent, interruption and fallback | CSS/WAAPI/state-machine behavior; DOM focus/selection preserved; reduced-motion equivalent; scene camera/assets when applicable |
| Ordinary surfaces | How the identity persists in a table, reading paragraph, form and feedback | Type/line/rhythm/caption/control treatment from the same direction; no automatic generic UI-kit shell |

Use project-selected values in implementation; profile snippets are mechanism examples. No fixed font family, brand palette, number of columns, radius or component count is compulsory across projects. Styling relationships may be locked after selection; responsive sizing and content fit remain adaptable.

## 3. Candidate distinction gate

Compare every existing candidate pair on identical representative content before asking the user (A/B, A/C and B/C for the normal three-candidate set). Keep actual requirements and factual meaning fixed, not necessarily the same section/card template. Each pair has a short record:

| Pair | Changed organizing or dominant visual relationship | Visible evidence in expressive + ordinary area | Shared task constraints | Result |
| --- | --- | --- | --- | --- |
| Existing pair; e.g. A/B | Reading path, type-led vs image-led hierarchy, fragment vs modular structure, embodied vs flat/spatial material, or time-led continuity | Exact specimen region/state and code/asset decision that produces it | What intentionally stays the same and why | distinct / variant / unverified |

- **Distinct**: the change materially affects how the same content is perceived or navigated. Explain the relation and point to rendered evidence. Surface material or imagery can carry the dominant difference; do not demand gratuitous semantic or DOM restructuring.
- **Variant**: different labels, accent values, font-family substitutions or shadows leave the dominant hierarchy/composition/graphic language unchanged. Keep useful variants, but do not count them as independent directions. Revise duplicate candidates before presenting them as three directions.
- **Unverified**: missing type/assets or unplayed motion is essential to the claim. State the gap; a style name or CSS declaration is not evidence.

For a user-requested text-only plan, record proposed conceptual differences but keep rendered distinction `unverified`. No picture/page needs to be generated against that instruction, and no actual visual pass can be claimed from prose or code specifications alone.

Optional diagnostics: hide candidate names to check recognizability; examine silhouettes and heading/body proportions; temporarily neutralize accent color if it is masking duplicated composition. These are aids, not universal grayscale tests—color and material may be defining features. No numerical novelty quota or artificial safe/bold mix.

If the brief genuinely confines viable results to close variants, disclose that constraint and present them honestly. Do not fabricate an unsuitable third style or silently relax requirements to create difference. Existing explicit selection still permits implementation without another vote.

## 4. Carry a small implementation contract

For a direction covered by the [24 specimen recipes](../../brand-style-reference/references/style-profiles/specimen-recipes.md), read the selected entry and its contract/fidelity sections. Resolve subject and supporting assets, actual palette roles, loaded typography roles, composition geometry and material/state behavior. Preserve the distinction between observed image evidence, engineering interpretation and deliberate project adaptation. The selected project's values and relationships are binding; the library's approximate palette and thematic objects are not universal requirements. A full raster poster is visual evidence, not a substitute for semantic interface implementation.

Extend the existing style agreement with:

- primary language and supporting layer roles; exact profile/source references;
- defining relationships and where each appears;
- DOM/layout strategy, typography roles and project tokens;
- required imagery/material treatment and actual asset status;
- motion/state strategy and fallback where relevant;
- pairwise distinction evidence when alternatives were requested;
- selected specimen and actual user selection evidence.

Pass this with the bounded content/layout job to executors. Shared tokens alone are insufficient. The main skill owns composition and aesthetic acceptance; html-deck-runtime implements the supplied blueprint, and component skills implement/adapt behavior. A subskill may report an incompatibility but cannot replace the identity with its default theme.

## 5. Verify three independent results

1. **Selection compliance**: Was a real selection/inherited target recorded before full implementation? A process failure does not prove the specimen looks bad.
2. **Candidate distinction**: Do alternatives provide materially different, viable expressions of this brief? Workflow compliance does not prove difference.
3. **Selected-direction fidelity**: Does the implementation preserve the chosen relationships in expressive, dense and utility states? Difference alone does not prove suitability or quality.

Technical checks cover syntax, layout geometry, responsive source order, real states, asset loading and material support. Rendered judgment covers hierarchy, recognizable identity and distinction. Do not claim a style family is validated from one primitive test or a few self-selected recommendations. When comparing versions, report both the process and visual results separately and preserve first attempts.

## Technical sources and boundary

Implementation choices above are our adaptation. [MDN Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts) supports explicit tracks/placement and overlapping areas; [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) supports background filtering, not a historical definition of glass style; [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) supports preference-aware substitutions. Checked 2026-09-07. Browser/version-sensitive mechanisms require feature detection and target-runtime verification.
