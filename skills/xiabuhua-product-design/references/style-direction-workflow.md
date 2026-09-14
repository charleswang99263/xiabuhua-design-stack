# Style direction and inheritance

Use before designing new visual work or a substantial redesign. This is the shared direction workflow for the design suite, including standalone slides. It does not apply to a read-only audit, requirement discussion, backend-only work, or a routine change that inherits an existing product. Follow explicit user instructions over this default.

## 1. Resolve the smallest useful brief

Read the actual request, representative content, existing references and constraints. Record facts, assumptions and unknowns. Resolve:

- user task, audience and intended understanding/action/feeling;
- content forms and density: long reading, comparison, operation, storytelling, imagery, data;
- brand and user preferences, including deliberate aesthetic exclusions;
- language/font coverage, devices, media, asset availability, runtime and accessibility constraints.

This precedes detailed page inventories, template selection and component shopping. A technical preflight is allowed now; its default theme is not art direction. Do not infer a style from the industry keyword alone. A report can be editorial, analytical, archival or another justified expression; an AI product does not imply dark gradients or cards.

## 2. Establish or inherit direction

Check for an already chosen reference, approved specimen or existing system first. For inherited work, record its source and the changed scope, then execute without reopening a style vote. A user's explicit choice of an exact style/reference as the target is direction evidence; a mood adjective alone usually is not.

For genuinely unresolved new art direction, derive a recommendation and two viable alternatives from the brief where feasible. Disclose genuinely constrained sets or variants rather than fabricate an unsuitable third. Use [style-vocabulary.md](style-vocabulary.md) as a searchable vocabulary, not a closed menu or industry-to-style lookup. Brand references are optional evidence after the requirements are understood. No preset quota, random style rotation, fashionable-source quota or fixed novelty score.

For each direction, state:

- which needs it serves and why it is credible;
- observable composition, typography, palette/material, imagery and motion choices;
- what makes it materially different from the other candidates;
- content/asset or implementation tradeoffs and what is excluded.

Separate task structure from visual language and supporting material/composition/motion. Read the relevant vocabulary-linked profiles and [style-implementation.md](style-implementation.md). Translate each direction into DOM/layout, typography roles, assets/material and state behavior, including an ordinary/dense surface. Do not treat “analytical”, “Bento” and “motion-first” as three competing visual identities by themselves.

Keep all candidates plausible and comparably developed. Do not manufacture an unsuitable extreme to make the recommendation win. Differences must extend beyond recoloring the same layout. One coherent direction can combine facets with named jobs (for example reading structure plus asset language); combining many labels is not a thesis.

Run the pairwise distinction gate from style-implementation before presenting the specimens. For every existing pair (A/B, A/C and B/C when there are three), record the changed organizing or dominant visual relationship, the specimen evidence and whether the pair is distinct, a variant or unverified. Shared semantic HTML and task-critical tables may remain the same; superficial token substitution is insufficient. Replace duplicates or disclose a genuinely constrained variant set rather than claiming three distinct directions.

## 3. Make compact, content-real specimens

Show the directions, not just names. Reuse the same representative content and scope in all candidates. A specimen contains typography, surface/material, a real control and a task-bearing composition. Include a dense/utility area when that is central to the brief. For a deck, show a cover and a representative content slide; for a report, include a chart/table or reading section, not just a title.

Use the cheapest faithful medium: a small HTML specimen, editable design slice or image where raster exploration materially helps. Do not build three full products. Keep labels and design-process metadata outside the product surface. Describe unavailable assets honestly; a placeholder cannot validate a direction that depends on the missing asset. Pure CSS/vector work is valid when that is the intended medium, not a substitute for requested photography or illustration.

Ask whether the recommendation's specific elements match the intended outcome and offer the available viable alternatives. Omit nonexistent options in a constrained set. Example question shape for three: “A uses [composition], [type/material] and [motion]; is that the expected direction? B prioritizes […]; C prioritizes […].” Use actual specimen links/images. Wait for the user's selection before full implementation. User silence or tool completion is not approval.

The first-turn output for unresolved direction is the viable candidate set (normally three, with constrained sets disclosed) plus the question, with `pending_confirmation`. Stop before creating the complete requested site/report/deck. “Quick demo”, “local prototype”, a fully specified functional brief or a delegated run does not itself waive this step. If the runtime cannot wait interactively, return the question to the caller and stop; the caller can relay a real or explicitly simulated user selection. Do not create another status such as “recommended/executed” to bypass the gate. Fidelity and direction approval are separate dimensions.

## 4. Record one shared agreement

Use the existing DESIGN.md, a small design-delta note, or the task's chosen source of truth. Do not create parallel specifications only for ceremony. Use these fields (prose/table is sufficient; no mandatory JSON):

| Field | Meaning |
| --- | --- |
| status | candidate / pending_confirmation / approved / inherited |
| evidence | exact user selection or existing source; source revision when relevant |
| selected specimen | directly inspectable artifact and representative content |
| rationale | need-to-design reasoning, with assumptions separated |
| implementation map | primary/supporting layer roles; defining relationships; DOM/layout, type roles, graphics/assets, material and state strategy |
| candidate distinction | pairwise evidence and distinct/variant/unverified result when alternatives were explored |
| locked | composition principles and density range; typography roles; palette/surface roles; material/asset language; shape/line language; motion intent and intensity |
| flexible | responsive reflow, line wrapping, local sizing, content-fit layout and state details within those principles |
| acceptance | what must remain recognizable in secondary surfaces and actual rendered output |
| changes | necessary adjustments, reason, impact and any new user selection |

“Locked” means preserve design intent, not copy the cover layout into every page or prohibit fixing overflow. Use actual token values when settled, but also record relationships that tokens cannot express. A template's values are not approval evidence. If approval occurred elsewhere, carry the evidence forward; do not fabricate a transcript or infer approval from a file named approved.

## 5. Pass direction to execution skills

Pass the agreement/specimen, implementation map, current task/content, allowed adaptations and delivery target together. The main design skill owns macro direction and narrative composition. Execution skills own platform technique, implementation of the supplied layout, component behavior and truthful implementation inside that direction.

- `approved` or `inherited`: execute; do not restart candidate selection.
- `candidate` or `pending_confirmation`: only the requested exploration/specimen work may proceed; do not scale it into a final product.
- missing agreement: resolve whether direction is inherited; otherwise return to this workflow.

If a candidate component/template conflicts, adapt or reject it. Surface a material incompatibility with evidence and the smallest repair. Accessibility, content truth, safety and actual runtime constraints remain requirements. Ask to revise direction only when the necessary repair changes its identity, scope or commitments. Do not silently substitute another aesthetic. User-selected dark, glass, maximalist, pixel or plain/system-font work must not be “corrected” into the executor's preferred taste.

Pass an exact selected visual target into image-to-code/Figma/other workflows that require one; do not edit third-party plugin caches to force agreement. Supply tokens and visual examples to chart, diagram and raster tasks as well. Keep data mappings, process semantics and platform conventions intact while adapting expression.

## 6. Prove before scaling, then check drift

Implement one representative content/interaction slice, not only the hero. Compare it with the selected specimen at the relevant size and state. Confirm typography, content hierarchy, composition, material/imagery and motion all survive actual content. Correct execution drift locally; return to the user only for a material direction change. Then expand through shared components and tokens.

In final QA, inspect both high-expression and ordinary surfaces. Record preserved invariants, necessary adaptations and remaining deviations. A consistent site can still miss its approved direction. A syntactically valid token file or a screenshot hash does not establish aesthetic fidelity.

Report selection compliance, candidate distinction and selected-direction fidelity separately. A skipped confirmation flags the process, not the aesthetic quality of that specimen. Passing the confirmation gate does not prove styles differ. See style-implementation for evidence criteria.

If prior outputs are available within the authorized context, compare composition, typography pairings, density, imagery and motion for unearned repetition. Similar tasks may reasonably share patterns. Do not force arbitrary novelty, mine unrelated private projects, or introduce a persistent preference/history store. Acceptance is fitness to this brief plus fidelity to this user's choice.
