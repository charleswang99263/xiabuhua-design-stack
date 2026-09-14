# Brand, Marketing, Portfolio, And Editorial Site Method

Use this reference for a public-facing site where perception, narrative,
credibility, reading, lead generation, or a next action matter more than a
dense application workflow. It covers brand sites, marketing pages,
portfolios, case-study sites, campaign microsites, and editorial landing
experiences.

This is a site-method layer, not a visual recipe. `xiabuhua-product-design`
still owns the product logic, system, and quality bar. `brand-style-reference`
owns macro visual precedents and their adaptation matrix. `ui-interaction-reference`
owns concrete external UI primitives after their communication job is known.
Do not turn this reference into a fixed aesthetic, a conversion hack list, or
a license to invent proof.

## 1. Establish the brief before the page

Separate facts, assumptions, and unknowns. Inspect the real offer, audience,
content, assets, destinations, analytics needs, technical stack, and delivery
constraints before selecting a direction.

Record:

| Field | Decision to make |
| --- | --- |
| Site job | What must the visitor understand, feel, decide, or do? |
| Audience | Who arrives, with what context, intent, vocabulary, and objections? |
| Offer | What is being offered, to whom, under what conditions, and with what limit? |
| Trust posture | What must be proven before a visitor acts? What must not be implied? |
| Primary conversion | The single most important next action and its real destination. |
| Secondary paths | Lower-commitment actions such as reading, comparing, subscribing, or contacting. |
| Evidence | Existing case studies, demos, data, credentials, testimonials, or source material. |
| Constraints | Brand, legal, accessibility, localization, CMS, performance, analytics, and launch constraints. |
| Explicit avoidances | Styles, claims, interaction patterns, dependencies, or references to exclude. |

Write a one-sentence promise using the audience's language. If the promise
cannot name a subject, outcome, or meaningful difference, the page is not ready
for visual treatment. Mark unsupported claims as unknown; resolve or remove
them instead of filling the gap with confident copy.

### Site profile

Classify the dominant mode so the page is judged by the right standard:

- **Conversion**: make a qualified next action easy after understanding and trust are established.
- **Portfolio/case study**: make the work, contribution, decisions, and outcomes inspectable.
- **Editorial**: make a reading journey clear, paced, legible, and worth continuing.
- **Brand/manifesto**: make a point of view memorable while preserving a truthful path to learn more or act.
- **Hybrid**: name the primary mode and the secondary mode; do not let them compete equally in every section.

For a multi-route site, map routes by visitor question and exit path, not by a
generic sitemap. Every route needs an entry condition, a job, a next action,
real content, and an owner.

Before detailed page design, use [style-direction-workflow.md](style-direction-workflow.md). Agree a content-real direction from the minimum brief, then develop the full page argument within it. Preliminary content and asset checks must inform the specimens. The selected direction takes precedence over defaults or examples in this method.

## 2. Turn the brief into a page argument

Treat the page as an argument with a sequence of questions, not a stack of
sections. A useful default sequence is:

`orientation → relevance → mechanism → evidence → offer → objection handling → action`

Change the sequence when the subject, audience, or evidence requires it. The
sequence is a reasoning tool, not a reusable layout template.

For each section, fill this contract:

| Field | Question |
| --- | --- |
| Visitor question | What does the visitor need answered at this point? |
| Claim | What is the smallest meaningful statement the section makes? |
| Evidence | What real artifact, behavior, source, or example supports it? |
| Visual device | What image, type treatment, diagram, interaction, or composition makes it graspable? |
| Action | What can the visitor do next, and why now? |
| Objection | Which doubt is reduced here, if any? |
| Fallback | What remains understandable without the enhancement, asset, or script? |
| Exit | Where can the visitor go without losing context? |

Use one dominant idea per viewport. Repetition is justified only when it
changes the visitor's decision state, answers a new objection, or provides a
useful route back to the action. Delete sections that merely fill the page.

### Evidence and CTA map

Maintain a compact map connecting claims to proof and actions:

| Claim / visitor belief | Evidence source | Scope and caveat | CTA | Destination and success state |
| --- | --- | --- | --- | --- |
| What should become believable? | Which real source supports it? | Who/when/where does it apply? | What result does the action promise? | What actually opens, submits, or completes? |

Evidence is not limited to numerical proof. It can be a working demo, process
trace, before/after artifact, named methodology, attributable quote, source
link, or inspectable case detail. Label illustrative material as illustrative.
Do not use invented customer names, logos, testimonials, performance numbers,
awards, scarcity, review counts, or UI states that imply a real system.

CTA rules:

- Make the primary CTA describe the result (`View the work`, `Book a call`,
  `Read the case study`), not an empty command (`Learn more`).
- Give the visitor enough context to understand the commitment, destination,
  and expected outcome before asking for it.
- Keep secondary actions available without making them visually equal to the
  primary path.
- Map every visible CTA to a real route, anchor, form, mail action, or explicit
  unavailable state. A styled button with no destination is a defect.
- Do not repeat a CTA only to decorate section endings; repeat it when the
  visitor has reached a new decision point.

## 3. Derive art direction from the subject

Expand the user-approved or inherited direction into a project-owned visual thesis. Do not reopen selection or substitute a familiar marketing style. Ground it in the subject's real world:

- **Subject vocabulary**: tools, materials, places, gestures, artifacts,
  rituals, language, and visual evidence native to the topic.
- **Audience posture**: expert, warm, precise, rebellious, calm, premium,
  public-interest, playful, or another deliberate stance.
- **Narrative rhythm**: how dense and fast the visitor should read, compare,
  pause, inspect, or act.
- **Material and image behavior**: documentary, diagrammatic, tactile,
  typographic, archival, rendered, or deliberately mixed.
- **Signature**: the justified memorable structure, behaviors, or content treatments that
  expresses the thesis and survives the rest of the site.

Ask whether the direction could be pasted onto an unrelated business. If yes,
replace generic decoration with a subject-specific decision. A visual device
should encode meaning, guide attention, clarify evidence, establish atmosphere,
or support action. Gradients, oversized type, noise, parallax, cursor trails,
and unusual grids are options only when the subject and communication job earn
them.

When using external references, borrow a principle (such as editorial pacing,
restrained accent hierarchy, or evidence-led composition), then recalculate
type, contrast, spacing, assets, and responsive behavior for this project.
Record explicit exclusions. Never reproduce a site's logo, proprietary font,
copy, asset, section order, or recognizable styling package.

## 4. Audit type and copy as one system

Typography is part of the argument: it sets voice, reading speed, hierarchy,
and trust. Copy determines whether the visual hierarchy says something true.
Audit both together before polishing motion or imagery.

### Type audit

- Define roles for display, section heading, body, metadata, labels, code/data,
  and UI actions only where the content requires them.
- Verify language coverage, numeral behavior, punctuation, fallback fonts,
  licensing, font loading, and rendering across target browsers and devices.
- Test the real shortest, average, longest, and multilingual strings. Tune
  measure, line-height, tracking, and breaks from rendered content; do not
  force every heading into one line.
- Preserve hierarchy under zoom and text scaling. A dramatic display face is
  not a substitute for readable body text or usable controls.
- Treat CJK, mixed-language, and long-word behavior as first-class content,
  not a late localization fix.

### Copy audit

For each route, verify:

- the opening makes audience, subject, and meaningful difference concrete;
- headings advance the argument rather than restating a slogan;
- body copy answers one question at a time and earns its length;
- action labels name an outcome and match the destination;
- claims include the required scope, date, source, or qualification;
- case studies separate context, contribution, process, result, and limits;
- testimonials and social proof are attributable and permitted;
- errors, empty states, form help, and unavailable content give a next step;
- no filler, lorem ipsum, invented specificity, unexplained jargon, or fake
  urgency remains.

Run a content stress pass with short, long, missing, translated, and
user-provided values. If the layout only works with the art-directed sentence,
the system is not finished.

## 5. Keep an asset-truth ledger

Every visible image, video, font, logo, icon, illustration, 3D model, chart,
quote, and customer mark needs a traceable status. Maintain an asset ledger
with at least:

| Field | Required record |
| --- | --- |
| Asset and role | What it communicates and where it appears. |
| Source and owner | Original file, URL, creator, or data owner. |
| Rights | License, permission, attribution, expiry, and redistribution limits. |
| Truth status | Real / illustrative / placeholder / generated / pending verification. |
| Variants | Crop, aspect ratio, density, locale, dark/light, and responsive versions. |
| Accessibility | Alt text, caption, transcript, decorative status, or equivalent. |
| Runtime contract | Loading, dimensions, format, fallback, and interaction behavior. |
| Replacement path | Who can replace it and what must remain stable. |

Distinguish source editability, generated artifact, preview, and runtime asset.
A generated image or screenshot can be a valid bitmap asset when its ownership,
rights, resolution, and intended use are explicit; it is not automatically an
editable UI source or evidence of a real product. Reserve media dimensions,
provide responsive formats, lazy-load below-the-fold media, and avoid layout
shift. If an asset is unavailable, use a clearly labeled placeholder or change
the composition. Never hide an unverified asset behind polish.

## 6. Steer motion and WebGL by value and budget

Give each effect a job: feedback, continuity, orientation, attention, progress,
direct manipulation, or justified expression. If removing it does not reduce
understanding, feedback, identity, or narrative value, simplify it.

Choose the lowest suitable complexity tier:

| Tier | Suitable for | Required fallback |
| --- | --- | --- |
| 0 — static/CSS | Type, color, hover, focus, simple reveal, responsive composition. | Static layout and semantic states. |
| 1 — lightweight DOM motion | Section transitions, local presence, scroll-linked emphasis, interruptible interaction. | Immediate or short-fade state change with no dependency on motion. |
| 2 — canvas/media | Art-directed 2D motion, ambient texture, chart or image treatment with a clear narrative job. | Poster, image, video, or HTML explanation. |
| 3 — WebGL/3D | Spatial manipulation, product geometry, material exploration, or a subject whose meaning depends on 3D. | Same promise through poster/video/2D/HTML; never a blank canvas. |

Declare a per-page budget before implementation. These are starting guardrails,
to be measured against the actual subject and target devices, not immutable
recipes:

- one primary signature scene or interaction per page; do not stack several
  attention channels in the first viewport;
- one primary motion controller per property; avoid CSS, animation libraries,
  and view transitions fighting over the same transform;
- enhancement code and heavy media must not block the first understandable
  content or the primary action;
- one WebGL canvas at most unless a documented route-level need justifies more;
  lazy-load it, cap device-pixel-ratio, pause it offscreen/hidden, and measure
  target-device frame time, memory, and input responsiveness;
- set explicit asset, JavaScript, and network budgets for the launch target;
  if measurement is unavailable, treat the budget as a release blocker rather
  than silently increasing complexity;
- define a designed reduced-motion, low-power, no-WebGL, no-JavaScript, and
  failed-media variant where those conditions can occur;
- keep focus, keyboard, touch, cancellation, resize, route back/forward, and
  content loading usable while the effect is running.

WebGL is an enhancement, not a trust or navigation dependency. A static poster
must retain the subject, proposition, and CTA; a keyboard and touch path must
not require pointer choreography; and a reduced-motion mode must preserve
meaning rather than merely hide the effect. Test on representative lower-power
hardware, not only the development machine.

## 7. Prove a vertical slice, then scale

Build one representative path before multiplying sections or routes. It should
include the real opening promise, one evidence pattern, the primary CTA, the
intended type and asset behavior, the responsive composition, and the chosen
motion/fallback path. Verify it with realistic content before expanding.

For a portfolio or case-study site, the slice should show the work and the
author's contribution, not only a cover image. For an editorial site, it should
prove reading measure, navigation, captions, references, and continuation. For
a conversion page, it should prove the claim → evidence → CTA progression and
the actual success/error behavior of the action.

## 8. Responsive and production QA

Responsive design is a content and interaction adaptation, not a desktop page
shrunk to a breakpoint. Test the compositions and journeys at representative
wide, narrow, touch, zoomed, and text-scaled states. Let content determine
where the layout changes; do not preserve a dramatic crop or line break at the
expense of comprehension.

### Minimum QA passes

1. **Structure**: routes, anchors, titles, metadata, canonical/share assets,
   headings, landmarks, links, forms, and source files are present and valid.
2. **Content**: real/representative copy, long strings, missing data,
   localization, captions, alt text, and evidence qualifications remain true.
3. **Visual**: hierarchy, optical balance, crop, contrast, type rendering,
   spacing, alignment, loading placeholders, and section transitions hold in
   rendered screenshots.
4. **Interaction**: every CTA works; keyboard order/focus is visible; touch
   targets work; anchors preserve context; forms show loading/success/error;
   effects can be interrupted; back/forward and reload do not strand the user.
5. **Responsive/accessibility**: narrow layout, zoom, text scaling, reduced
   motion, screen-reader names, color contrast, media alternatives, and safe
   areas where relevant.
6. **Runtime/performance**: no console errors, broken requests, layout shift,
   blocked first content, runaway animation, unbounded scroll work, or
   avoidable bundle/media cost; verify on the deployment-like build and target
   network/device conditions.
7. **Truth and rights**: asset ledger is complete, claims are sourced, labels
   match behavior, analytics events do not claim unimplemented outcomes, and
   placeholder/fallback states are intentional.

Separate deterministic checks from rendered judgment. Machines can check links,
headings, asset existence, dimensions, token use, budgets, and console output;
visual review must judge hierarchy, legibility, subject fit, crop quality,
coherence, and whether the visitor can complete the intended task.

## 9. Declare a finish mode

Choose the finish mode before implementation and state what the artifact may
claim:

| Mode | Must contain | Must not claim |
| --- | --- | --- |
| **Directional** | Brief, page argument, evidence/CTA map, art direction, type/copy direction, asset plan, and a representative composition. | A working funnel, approved claims, production-ready assets, or runtime quality. |
| **Demonstrable** | A clickable vertical slice with realistic content, states, responsive behavior, and designed motion/fallbacks. | Integrated production data, real conversion performance, or complete site coverage unless verified. |
| **Shippable** | Real routes, assets, copy, destinations, forms/analytics as applicable, accessibility, responsive behavior, performance budgets, fallback paths, and deployment-like QA evidence. | Business lift or external approval that has not been measured or granted. |

Do not call a polished screenshot an implemented site, a simulated form a live
lead flow, or a generated preview the editable source. If scope ends at an
earlier mode, document the exact boundary and the next acceptance gate.

## 10. Stop rules

Stop exploration and move to implementation when one to three references have
supplied the needed principles and further browsing would not change a project
decision. Stop adding sections when they answer no new visitor question,
objection, or route need. Stop adding motion, 3D, or a dependency when its
communication job is unclear, its fallback is weak, its measured cost exceeds
the declared budget, or it competes with the CTA/content hierarchy.

Stop the release when any of these remain unresolved:

- a primary claim, testimonial, customer mark, metric, or visual proof is not
  sourced or labeled;
- a visible CTA has no truthful destination, completion state, or recovery path;
- the page is unreadable or unusable under narrow width, zoom, text scaling,
  reduced motion, keyboard, touch, or failed enhancement conditions;
- a WebGL/media enhancement blocks the first understandable content or has no
  equivalent fallback;
- P0/P1 task, accessibility, truth, rights, security, or performance defects
  remain for the declared finish mode.

Prefer a smaller truthful page with a coherent argument over a larger page
whose proof, assets, or interactions are simulated.

## Compact acceptance checklist

- [ ] Site mode, audience, promise, primary CTA, constraints, and avoidances are explicit.
- [ ] Every route/section has a visitor question, claim, evidence, action, fallback, and exit.
- [ ] Claims, proof, testimonials, logos, metrics, and urgency are real, sourced, scoped, or labeled.
- [ ] Primary and secondary CTAs map to real destinations and visible outcomes.
- [ ] Art direction is subject-specific, project-owned, and not a copied brand recipe.
- [ ] Type roles, language coverage, copy hierarchy, and long-content behavior survive rendering.
- [ ] Asset truth, rights, ownership, accessibility, variants, and runtime behavior are recorded.
- [ ] Motion/WebGL has a communication job, explicit complexity/cost budget, and reduced/fallback mode.
- [ ] A representative vertical slice works before the rest of the site is multiplied.
- [ ] Wide, narrow, touch, keyboard, zoom/text scaling, reduced-motion, slow-network, and failed-media states are reviewed.
- [ ] Production-like build has no broken links, console errors, layout shift, inert controls, or blocked primary action.
- [ ] Finish mode, evidence ledger, unresolved risks, owner, and next gate are stated at handoff.
