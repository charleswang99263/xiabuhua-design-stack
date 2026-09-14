---
name: html-deck-runtime
description: Execute parent-provided fixed-stage HTML slide decks and page-by-page print/PDF exports, with basic PPTX inventory support. The parent workflow owns content, typography, narrative, and composition; this skill owns stage runtime, navigation, editing, media fitting, export, and technical QA. Do not use for legacy PPT conversion, responsive explainers, scrolling narratives, reports, or ordinary websites.
metadata:
  version: "5.1.0"
---

# HTML Deck Runtime

The HTML Deck Runtime is an execution layer for fixed-stage browser slide decks
and page-by-page print/PDF export, with a basic PPTX inventory helper. It receives the slide
content, authored layout, interaction behavior, assets, and runtime constraints
from the parent workflow and turns them into a build-tool-free HTML artifact.

This skill is deliberately narrow. It does not design responsive explainers,
scrolling narratives, reports, or ordinary websites. Those outputs keep their
own layout and rendering model in the parent workflow or a more suitable skill.

If the input is missing content, layout, interaction, or a material runtime
constraint, return that gap to the parent workflow. This skill follows the
specification it receives and does not create upstream decision records.

## Execution contract

The parent input should define, as applicable:

- slide order, source text, notes, links, media, units, and caveats;
- the authored layout for each slide in a fixed coordinate space; 1920×1080 is
  the compatibility default and may be replaced by explicit stage dimensions;
- interaction requirements and any editable regions;
- asset paths, loading expectations, and offline constraints;
- print/PDF requirements and the technical acceptance checks to run.

The received content and layout remain authoritative. Preserve source wording,
ordering, numbers, notes, links, media, and meaningful semantics during HTML
execution. Ask the parent to resolve an ambiguity that would change the
message or layout.

## Fixed-stage output

- Produce one self-contained HTML file with inline CSS and JavaScript unless
  the parent explicitly supplies a different artifact contract.
- Author every slide in a fixed stage. The runtime defaults to 1920×1080 for
  compatibility with existing decks; set `width` and `height` on `<deck-stage>`
  when the parent handoff specifies another stage. The stage remains fixed and
  scales uniformly to fit the viewport.
- Scale the whole stage uniformly to fit the viewport; letterbox or pillarbox
  when the viewport has another aspect ratio.
- Do not reflow slide content through device breakpoints.
- Keep `.slide` elements stacked in the stage. Switch them with
  `visibility`, `opacity`, and `pointer-events`; do not use `display: none` for
  navigation state.
- Include the complete contents of `viewport-base.css` in every produced deck.
  It is the single authority for stage geometry, slide visibility, print, and
  reduced-motion CSS. Its selectors require either the runtime's
  `<deck-stage>` host or the explicit standalone opt-in class/data attribute.
  Add `runtime/deck-stage.js` only when reusable custom-element navigation and
  input routing are needed; it sets stage custom properties and contains no
  duplicate execution CSS.
- The normal custom-element path is authored
  `<deck-stage width="…" height="…">` markup plus inlined `viewport-base.css`
  and, when needed, the runtime script. If the script is loaded in `<head>`,
  the runtime waits for parser-attached slide children before initialization.
- Support `prefers-reduced-motion` for authored transitions and runtime motion.
- Never negate CSS functions directly. Use `calc(-1 * clamp(...))` when a
  negative calculated value is required.

The parent supplies the authored CSS for surfaces, type, spacing, media
treatment, and other presentation details. The execution CSS supplies only
stage geometry, positioning, visibility, input routing, printing, and reduced
motion behavior.

## Runtime behavior

Use `runtime/deck-stage.js` when a reusable custom element is useful. It is a
minimal reference implementation and accepts authored slide content and CSS;
it does not prescribe presentation values.

Required behavior:

- navigate with the interaction contract supplied by the parent; the reference
  runtime supports previous/next, Home/End, PageUp/PageDown, number keys,
  touch swipes, and wheel gestures;
- ignore navigation while focus is inside `input`, `textarea`, `select`, or a
  `contenteditable` region, unless the parent explicitly maps the control;
- keep hidden slides out of hit testing and keyboard focus;
- preserve a slide's internal state while it is hidden;
- move focus to the newly active slide only when navigation started from deck
  content, and restore the previous focus when the receiving view requests it;
- expose a `slidechange` event with the current index, previous index, total,
  active slide, previous slide, and navigation reason;
- keep controls and editable chrome outside the authored slide canvas.

When inline editing is requested, make editable regions explicit, preserve
selection and focus during slide changes, and expose save/cancel behavior from
the parent input. Do not silently rewrite source content.

## Content and asset fitting

Fit text and media inside the authored fixed-stage slide bounds. Preserve source
aspect ratios and crop only where the supplied layout permits it. Before
shrinking text or clipping content, report the overflow to the parent or split
the slide according to the supplied content plan. Keep links keyboard reachable
and provide meaningful `alt` text when the source requires it.

For PPTX inventory, use `scripts/extract-pptx.py`. It reports basic slide and
shape order, text exposed by `python-pptx`, geometry, image assets, and
unsupported categories. It rejects legacy `.ppt` and is not a full PowerPoint
conversion.

## Technical QA

Read `execution-qa.md` before final delivery. At minimum verify:

- the configured stage dimensions and uniform viewport scaling;
- no text or media overflow, clipping, or unintended overlap;
- only the active slide receives pointer and keyboard input;
- every navigation mode requested by the parent works; enabled touch/wheel modes respect edit focus and surrounding scroll boundaries, without adding unrequested input modes;
- links, media, and relative assets resolve under the stated offline/online
  contract;
- print/PDF output contains the expected page count, order, dimensions, and
  source content.

Use rendered output for the final check when the environment permits it. A
successful build or HTTP response alone does not establish artifact validity.

## Export and handoff

Use `scripts/export-pdf.sh` when the parent requests PDF output and verify the
rendered pages after export. The helper requires preinstalled Playwright and a
browser, uses the validated deck dimensions and print media, and never installs
or downloads dependencies or opens the output. Deployment is outside this
skill's execution contract; if the parent supplies an approved hosting
workflow, hand off the validated HTML artifact and its exact path.

Report the artifact path, slide count, interaction checks, export checks, and
any unresolved runtime limitation. Keep upstream decision records outside this
skill's output.

## Supporting files

| File | Purpose |
| --- | --- |
| `viewport-base.css` | Canonical parameterized stage, slide, print, and reduced-motion CSS |
| `runtime/deck-stage.js` | Optional HTML Deck Runtime navigation and input behavior |
| `execution-qa.md` | Technical acceptance checks |
| `scripts/extract-pptx.py` | Produce a basic, position-aware PPTX inventory |
| `scripts/export-pdf.sh` | Render a validated HTML deck to PDF |


## Host compatibility

For missing tools or runtime setup, read [environment](../xiabuhua-product-design/references/environment.md).
