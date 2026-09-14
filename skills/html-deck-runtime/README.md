# HTML Deck Runtime

This capability executes fixed-stage HTML decks. The parent workflow owns the
content, authored layout, assets, and presentation decisions; this runtime
owns stage sizing, navigation, input routing, print media, and technical QA.
It does not target responsive explainers, scrolling narratives, reports, or
ordinary websites.

Use `<deck-stage width="…" height="…">` with `runtime/deck-stage.js` for the
reusable runtime path. A legacy standalone deck may instead use
`class="deck-viewport" data-html-deck-runtime-standalone` and its own navigation.
In both cases, inline the complete contents of `viewport-base.css`; it is the only runtime
source for stage, slide, print, and reduced-motion CSS. Runtime attributes
`width`, `height`, and `noscale` can change after initialization.

`scripts/export-pdf.sh` uses a preinstalled Playwright package and browser,
the deck's positive finite stage dimensions, and print media to produce a
selectable-text PDF. It does not install packages, download browsers, or open
the output file. It fails when the deck target is missing or ambiguous.

`scripts/extract-pptx.py` creates a basic `.pptx` inventory with slide and
shape order, text that `python-pptx` exposes, position/size, image assets, and
unsupported categories. Legacy `.ppt` input is rejected; this is not a full
PowerPoint conversion.

Read `execution-qa.md` before delivery. The project validation fixture covers
two-deck ownership, attribute changes, non-16:9 geometry, and scoped CSS.

## Files

| File | Purpose |
| --- | --- |
| `SKILL.md` | Execution contract |
| `viewport-base.css` | Canonical opt-in stage, slide, print, and reduced-motion CSS |
| `runtime/deck-stage.js` | Optional custom-element runtime |
| `execution-qa.md` | Technical acceptance checks |
| `scripts/extract-pptx.py` | Basic PPTX inventory |
| `scripts/export-pdf.sh` | Selectable-text PDF export |

## License

The source license for the migrated execution material is in `LICENSE`.
