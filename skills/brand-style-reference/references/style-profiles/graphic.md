# Graphic languages and authored composition

See [use and evidence boundary](README.md). Historical concepts and contemporary webpage adaptations are distinct. Read relevant sections only. All CSS below is our original adaptation; illustrative values are not prescribed style constants.

## Minimalism

**Evidence:** historical art concept; web usage is broader. [MoMA Minimalism](https://www.moma.org/collection/terms/minimalism) documents reductive geometry/material and serial approaches, including Judd. It does not define minimalist UI.

**Web adaptation:** concentrate attention through fewer competing visual relationships, proportion and useful negative space. Establish a dominant content/action axis, then preserve necessary evidence and navigation. Separate regions with spacing or rules when boxes add no meaning.

```css
.minimal .reading { max-inline-size: 62ch; margin-inline: auto; }
.minimal .reading > * + * { margin-block-start: var(--rhythm, 1.5rem); }
.minimal .records > * + * { border-block-start: 1px solid currentColor; }
```

**Ordinary surface:** grouped labels, values and controls remain explicit; reduction removes visual competition, not essential state or information. **Distinction:** Swiss adds a stronger typographic grid discipline; an empty white page is not evidence of either. Changing the accent does not create another minimalist direction.

## Swiss

**Evidence:** historical typographic style. [Swiss National Library](https://www.nb.admin.ch/en/the-international-style-1950-1970) documents typographic grids, sans serif, precise execution, rational composition and photography; Hofmann's poster is a concrete reference.

**Web adaptation:** make shared alignments, asymmetric weight and deliberate type scale govern the page. Define tracks for headings, evidence, captions and metadata; do not use a huge heading and red rectangle as a substitute for the system. Select sans roles with actual Chinese/Latin coverage when following this precedent closely.

```css
.swiss .spread { display: grid; grid-template-columns: 2fr 5fr 3fr; gap: 1rem; }
.swiss .title { grid-column: 1 / 3; }
.swiss .body { grid-column: 2; min-inline-size: 0; }
.swiss .notes { grid-column: 3; }
@media (max-width: 45rem) {
  .swiss .spread { display: block; }
}
```

**Ordinary surface:** tables, filter labels and captions inherit shared axes and spacing rhythm. Preserve semantic DOM order when visually placing elements. **Distinction:** Editorial prioritizes reading/section rhythm; Swiss prioritizes typographic order. They may combine, but combined candidates still need a distinguishing thesis. Neither red nor a particular font brand is required.

## Editorial

**Evidence:** publication practice, not one historical style. [SFMOMA's redesign account](https://www.sfmoma.org/read/expand-contract-designing-new-sfmoma-dot-org/) is a first-party example of content sequencing and varied image/text surfaces; [IBM editorial rhythm](https://www.ibm.com/design/language/layout/tips-and-techniques/) explains purposeful repetition/alternation.

**Web adaptation:** compose an article from display, body, caption, citation and margin-note roles; vary image scale and section density according to the narrative. Serif is optional. Use real `article`, `figure`, `figcaption`, headings and notes.

```css
.editorial article { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 2rem; }
.editorial .prose { grid-column: 1; max-inline-size: var(--reading-measure, 62ch); }
.editorial .wide-figure { grid-column: 1 / -1; margin: 0; }
.editorial .margin-note { grid-column: 2; align-self: start; }
@media (max-width: 45rem) {
  .editorial article { display: block; }
}
```

For Chinese, choose a measure in appropriate glyph/em terms after rendering; Latin `ch` is not a universal reading-width metric. **Ordinary surface:** evidence tables and controls use caption/rule hierarchy without turning every paragraph into a card. **Distinction:** a serif cover alone does not supply editorial rhythm; a Swiss grid alone does not define an article's narrative.

## Brutalism

**Evidence:** contested web practice label. [David Bryant Copeland's Brutalist Web Design](https://brutalist-web.design/) supplies one author-defined content-first interpretation, not the only brutalist tradition. Its actual page is a useful reference for direct web affordances.

**Web adaptation:** expose authored structure through direct type, obvious links, visible section boundaries and unembellished control/data surfaces. An expressive raw composition is also possible when grounded in a specific precedent; do not equate brutalism with broken CSS or mandatory sparsity.

```css
.brutalist a { text-decoration: underline; text-underline-offset: .16em; }
.brutalist .section { border-block-start: 2px solid currentColor; padding-block: 1rem; }
.brutalist table { border-collapse: collapse; inline-size: 100%; }
.brutalist th, .brutalist td { border: 1px solid currentColor; padding: .5rem; }
```

**Ordinary surface:** content remains literal and navigable, with clear header/data and action relationships. **Distinction:** Neo-brutalism deliberately systematizes hard edges/depth and graphic play; Swiss uses stricter typographic order. Bold type is common to many languages and is not enough to identify brutalism.

## Neo-brutalism

**Evidence:** contemporary label, without a single historical canon. [Neobrutalism components](https://www.neobrutalism.dev/docs) is a creator-maintained implementation example combining raw web influence with modern type/illustration/animation. Its defaults are not project requirements.

**Web adaptation:** repeat a coherent relationship among solid color fields, conspicuous outlines, hard offset depth and direct graphic typography. Establish a focal hierarchy rather than giving every element maximum weight.

```css
.neo .action { border: 2px solid currentColor; box-shadow: 4px 4px 0 currentColor; }
.neo .action:active { transform: translate(3px, 3px); box-shadow: 1px 1px 0 currentColor; }
.neo .action:focus-visible { outline: 3px dashed currentColor; outline-offset: 7px; }
.neo .record { border-block-start: 2px solid currentColor; }
```

**Ordinary surface:** borders, selected states, label scale and button depth retain the language in forms/lists without mandatory oversized cells. **Distinction:** one outlined button in a generic rounded-card page is a local effect. Hard shadows support this identity but are not a blanket prohibition on other details. A warm/orange specimen is as valid as a cool one when it fits the brief.

## Maximalism

**Evidence:** broad expression label. [Pentagram's Paula Scher: MAPS](https://www.pentagram.com/work/paula-scher-maps) is a designer-authored example of dense layered typography, not a universal definition of maximalist web design.

**Web adaptation:** orchestrate multiple scales, motifs, images and type voices around a legible focal sequence. Define recurring anchors and intentional collisions; richness may remain present in ordinary content rather than vanishing below the hero.

```css
.maximal .composition { display: grid; isolation: isolate; }
.maximal .pattern, .maximal .headline-art { grid-area: 1 / 1; }
.maximal .pattern { z-index: 0; pointer-events: none; }
.maximal .headline-art { z-index: 1; }
.maximal .task-content { position: relative; z-index: 2; }
```

**Ordinary surface:** retain authored labels, pattern rhythm and scale contrasts while keeping actual values/control hit areas unobstructed. **Distinction:** abundance with hierarchy differs from clutter; collage requires meaningful fragments, while maximalism may be wholly typographic or geometric.

## Collage

**Evidence:** historical technique. [Tate Collage](https://www.tate.org.uk/art/art-terms/c/collage) documents assembled fragments/materials. This supports the technique, not a mandatory beige scrapbook aesthetic.

**Web adaptation:** each fragment has a content/provenance role; seams, crops, overlaps and scale relationships contribute meaning. Use layered `figure` elements, meaningful source captions, cut silhouettes and controlled transform origins. Keep DOM reading order coherent.

```css
.collage .spread { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); }
.collage .fragment-a { grid-area: 1 / 1 / 3 / 5; transform: rotate(-3deg); }
.collage .fragment-b { grid-area: 2 / 4 / 4 / 7; transform: rotate(4deg); }
.collage .reading { position: relative; z-index: 2; }
@media (max-width: 40rem) {
  .collage .spread { display: block; }
  .collage .fragment-a, .collage .fragment-b { transform: none; }
}
```

**Ordinary surface:** source labels, torn section edges or arranged evidence fragments continue the identity; form fields need not rotate. **Distinction:** collage can be sparse; maximalism can lack collage entirely. Random stickers and colorful card grids do not establish juxtaposition.

## Hand-drawn

**Evidence:** broad authored-expression label. [MoMA's custom-alphabet account](https://www.moma.org/explore/inside_out/2010/03/29/different-strokes-custom-alphabets-help-us-introduce-audiences-to-artists/) shows specific lettering developed for artists, not a universal handwriting font prescription.

**Web adaptation:** specify a repeatable stroke vocabulary, imperfect contour rhythm and illustration subject. Use original SVG paths or supplied illustration; keep text equivalents for graphic lettering and real text for controls/body.

```css
.handdrawn .annotation path { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.handdrawn .annotation { overflow: visible; pointer-events: none; }
.handdrawn .note { border-inline-start: 2px solid currentColor; padding-inline-start: .8rem; }
```

**Ordinary surface:** a consistent drawn marker, icon set or annotation system remains visible with readable labels. Decorative SVG is hidden from accessibility APIs; meaningful art has a text alternative. **Distinction:** hand gesture is different from smooth organic curves. A script font alone does not create an illustration language.

## Humanist-organic

**Evidence:** broad composite; humanist typography and organic modernism are related possibilities, not synonyms or one canon. [V&A's Aalto account](https://www.vam.ac.uk/articles/modernism-and-the-natural-world-the-designs-of-alvar-aalto-andaino-aalto) is a precedent for human/natural form in modern design, not a webpage style definition.

**Web adaptation:** select whether human imagery, material tactility, body-related proportion or natural contours leads the direction. Preserve useful geometric structure beneath the authored forms. Choose type for warmth and language coverage without prescribing a family.

```css
.organic .image-frame { border-radius: 45% 55% 38% 62% / 42% 37% 63% 58%; overflow: hidden; }
.organic .image-frame img { display: block; inline-size: 100%; object-fit: cover; }
.organic .reading { line-height: var(--body-leading, 1.65); }
```

**Ordinary surface:** carry human-scale type/spacing and subject-linked accents into sections and feedback; don't replace dense tables with unusable blobs. **Distinction:** this may be regular and polished; hand-drawn requires gesture. A beige background plus rounded cards is insufficient.

## Geometric-modern

**Evidence:** broad design descriptor with multiple roots. [MoMA Geometric abstraction](https://www.moma.org/collection/terms/geometric-abstraction) documents geometric form as a visual basis; select an actual precedent rather than treating all modern movements as interchangeable.

**Web adaptation:** decide a small shape/proportion system, then use it to organize meaning, image crops, markers and repeated relationships. Avoid decorative geometry unrelated to the content.

```css
.geometric .module { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; }
.geometric .symbol { aspect-ratio: 1; border: 2px solid currentColor; }
.geometric .symbol[data-kind="cycle"] { border-radius: 50%; }
```

**Ordinary surface:** status symbols and repeated cell proportions carry the same logic, with text labels for meaning. **Distinction:** Swiss organizes communication through type/grid; this direction foregrounds shape relationships. Art Deco adds period-specific ornament and crafted detail.

## Art-deco

**Evidence:** historical design grouping. [V&A Art Deco](https://www.vam.ac.uk/articles/an-introduction-to-art-deco) documents the varied sources and machine-age context, with the 1925 exhibition and Lalique as examples. No single palette captures it.

**Web adaptation:** select a period-specific ornamental grammar, such as stepped/axial lines, and carry its proportions through framing, titles and transitions. Type must support that grammar and the actual script; avoid falsely labelling any luxury serif as Deco.

```css
.deco .title-frame { position: relative; border-block: 1px solid currentColor; padding: 1.5rem; }
.deco .title-frame::before { content: ""; position: absolute; inset: .4rem 1rem; border-block: 1px solid currentColor; pointer-events: none; }
.deco .ornament { display: block; margin-inline: auto; inline-size: min(12rem, 70%); }
```

Use original SVG stepped/fan/linear geometry appropriate to the chosen reference. **Ordinary surface:** repeat fine rule, caption and section framing relationships while keeping fields/data plain enough to operate. **Distinction:** black/gold or a border alone is a color/material variant, not historical specificity.

## Regional-cultural

**Evidence:** a source lens, not one style. [Cooper Hewitt on Indigenous design/planning](https://www.cooperhewitt.org/2017/02/16/the-people-are-beautiful-already-indigenous-design-and-planning/) demonstrates community-specific context and explicitly distinguishes Indigenous design from a generic vernacular category. Do not universalize that case.

**Web adaptation:** identify actual place, community, period, writing/printing/craft and authorized assets. Translate specific compositional or material relationships; document what is original, adapted or supplied. Avoid generic traditional-pattern packs.

```css
.local .bilingual { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.local .reading { text-align: start; margin-inline: auto; }
@media (max-width: 40rem) { .local .bilingual { grid-template-columns: 1fr; } }
```

**Ordinary surface:** use actual language tags/direction, local terminology, source captions and appropriate glyph coverage. Never infer a writing direction from a region name. **Distinction:** geography, a flag or a borrowed border does not define visual identity; the chosen evidence must determine the specific relationships.
