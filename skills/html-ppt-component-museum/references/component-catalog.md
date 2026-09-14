# Component Catalog 4.3

Choose by the explanation job. The standalone museum at `assets/component-museum.html` is a responsive experiment workbench: a searchable purpose directory and one active demonstration stage. It starts with a complete same-object Before / After specimen. It never runs all live stages in the directory.

The seven jobs below are the navigation. Maturity (`implemented`, `experimental`, `needs_verification`) is secondary metadata, never a category or an ordering preference. Every entry exposes a real input, visible result, suitable use, limitation, implementation, source principle and review date. All narrative, interview, task and business data are explicitly simulated. The catalog contains 29 mechanisms. Check [local reusable effects](local-effects-index.md) before online discovery and [text-entry policy](text-entry-review.md) for scene-specific choices.

## 内容聚焦 / Content focus

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Kinetic Title Engine | Sequence a short claim | Three timed beats: context, emphasis, explanation. Step, complete or replay; final text remains visible. |
| Quote Theater | Keep a quote with its context | Switch between three clearly fictional quotes; scenario and design implication change together. |
| Code Spotlight | Explain one rule at a time | Five keyboard-selectable pseudocode lines with optional character decoding, word entry, fade or direct text. Original code, explanation and result remain truthful; decoding never executes code. |
| Shared Element Detail | Preserve list-to-detail context | A whole card expands into a complete note with the same visual/title; return restores the source card and focus. |
| Sticker Peel | Reveal an optional aside | One geometric crease drives face clipping, reflected back and reveal from 0–100%. Pointer, click and keys share the same progress; full reveal exposes the complete note. |
| Animated Text Disclosure | Focus one explanation at a time | Select a clause to reveal its measured-height explanation; interruption and reversal continue from the visible height. |
| Text Entry Studio | Compare short-text entrances | Decode, word, blur, typing, fade and none share the same source text. Change sentence, replay or finish immediately; accessible text stays correct. |

## 证据与数据 / Evidence and data

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Metric Pulse Card | Compare named segments | Switch fixed visitor, conversion and retention data; axes, units, bars and labels stay aligned. Groups are independent, not a funnel. |
| Sankey Story Strip | Explain conserved volume | 1,000 = 600 + 400 and 600 = 420 + 180 people; focus changes opacity only, never width. |
| Radar Capability Compass | Compare fixed dimensions | Alpha / Beta use one 0–100 scale and a shared origin; exact values appear next to the radar. |
| Risk Heat Tile | Show risk and missing evidence | Select 18 labeled sample records; hatched unknowns remain distinct from the 1–9 risk scale. |

## 空间与生成 / Spatial and generative experiments

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| 3D Token Field | Explore a fixed topology | Real 3D rotation and perspective projected onto Canvas; pointer hits use the same projected positions; arrows and Enter work. |
| Generative Particle Thesis | Explore an input disturbance | 25 deterministic initial particles; click or Enter adds a counted input signal. This is generative art, not a statistical trend. |
| Physics Priority Map | Explore collision and capacity | Native circle collision, gravity and boundaries; labeled items stop at eight. Positions do not encode business priority. |

## 时间与顺序 / Time and sequence

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Narrative Timeline Rail | Revisit stages and outputs | Research, build and release each show a stage description, time and concrete exit artifacts. |
| Sticky Step Reveal | Match narration to its trigger | A shared anchor updates from a local web scroll region or explicit slide-style step buttons. Progress and content agree. |
| Spring Stepper Progress | Separate navigation from completion | Previous/next navigate immediately; a separate completion action marks the final step, while reset returns to the first step. |
| Scroll Stack | Browse stages with spatial continuity | Four cards stack in a local scroll region; stable anchors drive current stage, buttons and keys offer equivalent navigation. Reduced/static modes show readable linear content. |

## 流程与依赖 / Flow and dependency

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Morphing Flow Path | Explain execution and recovery | Timed input, validation and success/error branches; retry preserves the original input. No external service is called. |
| Spatial Route Map | Explain immediate relationships | Select fixed topology nodes by pointer or keyboard; connected edges and a complete explanation update together. |

## 排序与比较 / Sorting and comparison

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Decision Stack | Discuss explicit priorities | Promote one option to the top, preserving the relative order of the others; animated movement and result show the choice. |
| Before After Scanner | Compare the same object | Two full task interfaces share the same task and facts; drag, touch or range keys reveal either version. |
| Tension Matrix | Explain a two-input rule | Value/certainty sliders drive a point and verdict. Both values must exceed 60 for the upper recommendation. |
| List Reorder | Show a changed sequence | Buttons retain keyboard control; pointer/touch drag shows a live placeholder, reorders in place, auto-scrolls a scroll region, and Escape/cancel restores the original order. |

## 输入与反馈 / Input and feedback

| Mechanism | Explanation job | Actual interaction and readable result |
| --- | --- | --- |
| Interaction Prompt Board | Guide a meaningful next choice | Choose process, comparison or evidence; the recommendation opens its actual mechanism. |
| Live Poll Simulator | Demonstrate a local distribution | A vote adds exactly one to 42 / 31 / 27; total and proportion update. Nothing is submitted. |
| Pixel Transition | Change complete content states | A deterministic 16 × 9 mask covers the draft, swaps to a full archive result, then reveals it. It can reverse. |
| State Button | Explain asynchronous recovery | Choose simulated success/timeout, then run. Running blocks duplicate submit; error preserves inputs and can retry. |
| Staggered Bulk Selection | Explain grouped input feedback | Checkbox selection and count update immediately; bounded staggered marks are decorative and never delay the logical result. |

## Runtime and accessibility contract

- A registry entry owns `initial`, `render` and `setup`. One shared scope owns listeners, animation frames, timed jobs, Web Animations and disposal. Switching mechanisms disposes the old scope before mounting the next.
- Only the selected Canvas experiment starts a loop. Hidden documents, off-screen stages, pause, reduced motion and static mode stop continuous updates. Resize and intersection observers are disconnected on disposal.
- The workbench preserves each mechanism's local state while browsing. Replay explicitly resets the selected mechanism. If an asynchronous demonstration is interrupted, returning provides a recoverable error with preserved sample input.
- Reduced motion removes visual transition timing while retaining meaningful async process duration. Static mode freezes a readable snapshot, disables specimen controls and shows a Canvas-free SVG/HTML alternative. Canvas failure also falls back automatically.
- Real controls have at least 44 px touch targets. Pointer actions have visible button or keyboard paths. Range controls retain native arrow-key behavior; card return restores focus.
- Swiss is rational sans-serif, grid and square geometry. Collage uses serif headings, paper texture, stamps and offset surfaces. Dark Tech uses monospaced headings, rounded geometry and restrained technical material. These are illustrative skins, not project approvals.

## Source and reuse boundaries

The shipped implementation is project-owned HTML/CSS/SVG/Canvas with no CDN and no third-party source bundled. Motion Layout / shared-element and FLIP ideas, React Bits Sticker Peel / Pixel Transition, and Aceternity Sticky Scroll Reveal are reference principles only. React Bits source is not copied or renamed; its license and redistribution conditions require an item-level review before any future source reuse. These existing external principles were reviewed 2026-09-07; the new interaction contracts and W3C checkbox/disclosure semantics were checked 2026-09-09. See the [pattern-selection reference](../../ui-interaction-reference/references/interaction-pattern-selection.md) for the ten-pattern scope and sources.

Mechanism and project direction remain separate. The consuming project supplies its confirmed typography, composition, palette, material, assets and motion decisions. The museum does not reopen a style vote. For HTML PPT, port only the selected mechanism to the consuming deck's parent-specified fixed stage; normal websites remain responsive.

Run `node validate-museum.mjs` for full inline JavaScript syntax, data/geometry, state, sorting, capacity, registry rendering and lifecycle checks. This is not visual QA. Real browser acceptance must still inspect all mechanisms, three skins, phone layout, input methods, pause/replay/reduced/static behavior and missing-Canvas fallback.
