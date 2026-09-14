> Reference-source material only. Former workflow directions below describe the historical source and are not instructions for the current project. The main design workflow owns selection and acceptance; all styles are peers.

# Narrative and Artifact QA

Use this reference for presentations that need to explain, persuade, teach, report, convert source material, or survive export. Read only the sections that match the current mode. It supplements `SKILL.md`; it does not change the 1920×1080 fixed stage, build-tool-free single-file output, density modes, or the style-inheritance contract. An approved or inherited direction bypasses redundant style discovery.

## Boundary and order

The order is: narrative brief → scenario route → slide blueprint → narrative gate → approved/inherited style agreement (or shared direction workflow) → cover + representative-body specimen check → design-token freeze → generation → deterministic visual lint → cross-slide coherence → artifact-specific QA.

Data and report factual accuracy belong to the validated source, data owner, or data-validation workflow. Visual QA can verify that a number, unit, caveat, citation, or note is present and legible; it cannot establish that the number is true. If a claim has no validated source, label it as an assumption/TBD or remove it—do not make visual polish stand in for evidence.

## Narrative brief and scenario router

Capture a compact brief before making layout decisions. If the user has not supplied a field, infer a provisional value and mark it as an assumption.

| Field | Required decision |
| --- | --- |
| Audience and occasion | Who is looking, in what time/attention setting, and with what prior knowledge? |
| Decision or action | What should the audience decide, remember, or do after the last slide? |
| Starting tension | What problem, question, misconception, or opportunity makes the deck necessary? |
| One-sentence outcome | What is the single defensible message of the deck? |
| Evidence burden | Which claims need measured data, a source quote, a demo, a comparison, or only an illustration? |
| Source of truth | Which supplied files, validated tables, links, or owner decisions govern the content? |
| Delivery mode | Live/speaker-led, async/reading-first, teaching, or conversion with fidelity constraints? |
| Non-goals and unknowns | What must not be implied, and what is still unverified? |

Route the deck by its dominant communication job. A deck can borrow another route, but choose one primary route so sequencing and density have a clear owner.

| Route | Narrative spine | Default emphasis |
| --- | --- | --- |
| Decision / persuasion | tension → insight → evidence → options/trade-off → decision and next action | A claim-led title, selective proof, explicit owner/date/action |
| Teaching / tutorial | question → mental model → steps → worked example → practice/check | Progressive disclosure, stable vocabulary, visible transitions |
| Report / async review | executive answer → scope/method → findings → implications → recommendation → appendix | Self-contained slides, definitions, denominators, as-of dates, source labels |
| Source conversion | source intent/order → faithful extraction → web-native restyling → fidelity check | Preserve text, images, notes, order, units, caveats, and claims unless a change is agreed |
| Showcase / narrative portfolio | premise → selected evidence → interpretation → result → invitation | Fewer proof points, stronger pacing, clear evidence captions |

Do not invent a dramatic arc when the source is a factual report. Conversely, do not let a report route become a wall of pasted text: split claims, methods, findings, and implications into distinct jobs while retaining traceability.

## Slide blueprint

Draft one row per slide before full styling. A blueprint is a control surface for content and QA, not a template that forces every slide to look alike.

| Field | What to record |
| --- | --- |
| `slide_id` / order | Stable identifier, section, and intended position |
| `role` | Title, section beat, explanation, comparison, evidence, quote, demo, transition, appendix, or closing |
| `takeaway` | One sentence the audience should retain; write it as a claim where appropriate |
| `support` | The minimum proof: data, quote, screenshot, diagram, example, or explanation |
| `source_ref` | Source ID and location (file/page/slide/range/URL); use `TBD` rather than an invented citation |
| `visual_form` | Chosen layout or visual grammar and why it serves the takeaway |
| `speaker_or_reader_note` | What is said aloud, or what context an async reader needs |
| `transition` | Why this slide follows the prior one and what question it opens next |
| `density` / constraints | Low/high density, text limits, required labels, and known risks |
| `status` | Draft, evidence pending, approved for styling, rendered, or needs revision |

Blueprint rules:

- Give each slide one primary job and one primary takeaway. A section beat may be intentionally sparse, but should still orient the audience.
- Prefer titles that state the finding or decision over labels such as “Analysis” or “Overview.” Keep a label when it is needed for navigation, then add the claim as the visual headline.
- Keep evidence attached to the claim it supports. Do not use a decorative chart, stock image, or fabricated metric to imply proof.
- Split when a slide needs competing takeaways, competing evidence levels, or text small enough to evade comfortable reading.
- For conversions, preserve a mapping from source slide to output slide(s), including notes and any intentional omission or transformation.

## Narrative gate

Run this gate after the blueprint and before full generation. It is a content-structure gate, not a visual or fact-validation substitute.

Pass only when:

1. The audience, action, starting tension, and one-sentence outcome are explicit.
2. Every slide can be summarized by its role and takeaway without reading its decoration.
3. The sequence answers a real question at each turn; sections have an orienting beat and a meaningful exit.
4. Evidence is sufficient for the claim, traceable to a source, and clearly separated from assumptions or illustrative material.
5. No adjacent slides repeat the same job, and no critical method, definition, caveat, or trade-off is missing.
6. The ending resolves the deck's promise with a decision, implication, practice, or next action appropriate to the route.

If a check fails, revise the blueprint or split/reorder slides before styling. “Looks polished” is not a pass. Record unresolved evidence as a gate risk so it cannot disappear during visual iteration.

## Design-token freeze

Once the style agreement is approved or inherited and before building the full deck, freeze the deck-level system in `:root` or an equivalent documented block. The selected specimen is the visual comparison anchor. Record the agreement evidence and locked fields alongside the deck when the project has a design record:

- `status`: `approved` or `inherited` (never promote `candidate` or `pending_confirmation` here);
- evidence: user message/source and selected specimen;
- locked: composition, typography, palette, material, assets, and motion;
- flexible: responsive density and wrapping;
- change reasons and approval triggers.

The frozen system includes:

- display/body fonts and the authored 1920×1080 type scale;
- background, surface, text, accent, border, and status colors;
- stage padding, grid columns, alignment anchors, gaps, and spacing rhythm;
- radius, border, shadow, image treatment, chart treatment, and source-label treatment;
- reveal, transition, and reduced-motion behavior.

Slide-specific variation is allowed when it has a narrative reason (for example, a section beat or a full-bleed quote), but it must use the same tokens and grammar. If accessibility, readability, or overflow requires a token change, change it globally, note the reason, and rerun visual lint and coherence checks. Do not tune each slide into a separate mini-theme.

## Deterministic visual lint

Run lint from rendered browser state, not only source inspection. A minimal build-tool-free lint can collect `getBoundingClientRect()`, computed styles, text metrics, and screenshot evidence for every slide by making each slide active in turn. `scrollHeight` alone is insufficient: grid panels can overlap while their own scroll boxes remain valid.

### Checks and dispositions

| Check | Deterministic signal | Disposition |
| --- | --- | --- |
| Fixed stage | `.deck-stage` and every `.slide` are 1920×1080; uniform scale is applied by the viewport controller | Block if wrong or if a responsive rule reflows slide content |
| Bounds | Non-chrome content has `left/top >= 0` and `right/bottom <= 1920/1080`, allowing only documented decorative bleed | Block on clipped content; warn on intentional bleed without a note |
| Overlap | Pairwise bounding-box intersection for unrelated panels, text blocks, images, and controls; ignore declared background/overlay pairs | Block on cover-up or unreadable collision; warn on tight but legible proximity |
| Text fit | `scrollWidth/scrollHeight`, line boxes, ellipsis, orphan lines, and screenshot review of long titles/source labels | Block on lost text; warn on awkward wrap or cramped but readable copy |
| Legibility | Computed authored-stage font size, contrast, line height, and source-label size against the route/role thresholds below | Warn by default; block only when text is unreadable or a required source is absent |
| Runtime | Font/image load status, `.active/.visible` switching, keyboard/touch/wheel behavior, and reduced-motion mode | Block broken navigation, missing assets, or all-slides-visible regressions |
| Chrome separation | Controls/progress/edit UI remain outside the slide design system and do not cover content | Block if controls hide content or become the slide's accidental focal point |

### Context-sensitive thresholds

Treat thresholds as warnings that guide a fix, not universal aesthetic laws. Derive them from the selected density and each slide's `role`:

| Context | Warning baseline |
| --- | --- |
| Low density / speaker-led | One takeaway; normally 1–3 bullets or equivalent short beats; warn below 28px body copy and below 64px primary titles; split before shrinking further |
| High density / reading-first | Normally 4–8 bullets or 4–6 cards when the slide remains self-contained; warn below 24px body copy and below 56px primary titles; use more slides when proof cannot breathe |
| Title / section / quote / closing | Bullet limits do not apply; keep one dominant message, preserve generous hierarchy, and warn when supporting copy competes with it |
| Evidence / table / annotated diagram | Prefer fewer, larger marks; warn when labels or legends fall below 20px, when units/denominators are not adjacent to values, or when annotations collide |
| Source labels / footnotes | Keep legible and attached to the relevant claim; if a source cannot be read at the intended viewing size, shorten the label or move detail to notes/appendix rather than silently dropping traceability |

These numbers are starting points for the fixed stage, not replacements for screenshot judgment. A warning can be accepted only with a documented reason (for example, a dense appendix table requested by the user); a block cannot be waived by adding decoration.

## Cross-slide coherence

After individual slides pass, review the cover and representative body against
the selected specimen, then review the deck as a sequence and as a
thumbnail/contact sheet. Check:

- title grammar, section labels, numbering, page markers, and source-label placement are predictable;
- alignment anchors, margins, grid rhythm, color roles, chart scales, units, legends, and image crops remain consistent;
- visual grammar changes only when the narrative role changes; transitions make the change legible;
- evidence density and type scale have a purposeful cadence rather than random spikes;
- repeated slides add a new implication instead of restating the same card grid;
- opening, section beats, and closing form a recognizable arc, with no abrupt unfinished ending.

Fix coherence issues at the token, blueprint, or section level first. Avoid one-off CSS patches that make later slides harder to reason about.

## Source and evidence fidelity

Maintain a lightweight source register for substantive claims:

`claim_id · slide_id · exact claim · source_id/location · as-of date · unit/denominator · transformation · caveat · validation status · owner`

For supplied reports or PPTX, also retain source slide/page, speaker notes, image identity, and any transformation (crop, resize, aggregation, paraphrase, or split). Keep original and illustrative material visibly distinct. Preserve dates, units, denominators, qualifiers, and confidence; never upgrade “may,” “estimated,” or “illustrative” into a definitive claim through headline styling.

Visual lint may check that the registered source appears, is legible, and is attached to the right claim. Truth, freshness, calculations, and business interpretation must be checked against the validated data/source workflow by the appropriate owner.

## Artifact-specific QA

Choose the checks that match the requested deliverable. Do not claim editable-PPTX quality from an HTML preview or a PDF screenshot.

### HTML presentation

- Open the actual file in a browser and inspect every slide at the authored 1920×1080 view, a 1280×720 desktop view, and one phone viewport. The stage may letterbox; slide content must not reflow.
- Capture screenshots after fonts/assets settle. Check bounds, overlap, title/source wrapping, backgrounds, and section transitions visually; run the deterministic checks above as evidence.
- Exercise arrow keys, Space/Page Up/Down, wheel, touch/swipe when enabled, progress controls, and inline editing if present. Confirm active/visible state and no hidden slide receives pointer events.
- Test `prefers-reduced-motion`, missing/slow font and image behavior where practical, and local relative asset paths. A successful build or HTTP response is not visual completion.

### PDF export

- Export only after the HTML gate. Verify page count, order, fixed page aspect/size, one slide per page, final visual state, clipping, fonts, images, source labels, and intentional page breaks.
- Inspect the generated PDF pages, not just the HTML screenshots. Confirm text is selectable when the export path promises it; otherwise state that it is a static image PDF.
- Animations, editing, and browser navigation are not preserved. Treat that as an expected format difference and do not mark it as a defect unless the user requested those capabilities in the PDF.

### Editable PPTX

- Validate the actual `.pptx` package: it opens without repair prompts, retains slide size and order, and preserves editable text boxes/shapes/charts rather than a single flattened screenshot when editability is promised.
- Extract text and notes to compare with the blueprint/source register; check font substitution, line wraps, hyperlinks, images, alt text where required, and speaker notes.
- Render the PPTX to images or open it in a compatible viewer and repeat bounds, overlap, readability, and coherence checks. A visually matching render can still fail if objects are flattened, fonts are substituted, or notes/links are missing.

Record which artifact checks were run and any intentional limitations. If only HTML is requested, do not imply that PDF or editable-PPTX QA was performed.

## Compact handoff checklist

- [ ] Route and narrative brief are explicit; facts, assumptions, and unknowns are separated.
- [ ] Style agreement is approved or inherited; evidence and selected specimen are recorded.
- [ ] Cover and representative body/dense-content view match the locked direction; any drift has a reason or approval trigger.
- [ ] Every slide has a role, takeaway, support, source reference, and transition.
- [ ] Narrative gate passed before full styling.
- [ ] Tokens are frozen and global exceptions are documented.
- [ ] Rendered visual lint passed, with warnings accepted only in context.
- [ ] Cross-slide coherence reviewed as a sequence and contact sheet.
- [ ] Source fidelity checked; data truth remains with validated sources/owners.
- [ ] The QA set matches the actual output: HTML, PDF, editable PPTX, or a stated subset.
