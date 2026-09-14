# UI Interaction Source Index

Use this compact index to select a source. Always inspect the current item page
before reusing new external code. For maintained original local mechanisms, use the [museum local index](../../html-ppt-component-museum/references/local-effects-index.md) and its validation record first; no live lookup is required merely because the mechanism was inspired by React Bits.

## Contents

1. Source comparison
2. Uiverse
3. React Bits
4. Aceternity UI
5. Selection by job
6. Rejection rules

## Source Comparison

| Source | Best for | Default technology | Main risk | Retrieval |
| --- | --- | --- | --- | --- |
| Uiverse | micro-controls and CSS interaction details | HTML/CSS, Tailwind, exported React | uneven community quality | live search |
| React Bits | expressive animation and interactive primitives | React, JS/TS, CSS/Tailwind | variable heavy dependencies | docs + GitHub |
| Aceternity UI | heroes, storytelling, landing-page sections | React/Next.js, Tailwind, Motion | generic AI landing-page look, paid content | AI catalog + item page |
| Motion official | state continuity, layout/reorder, presence | React / JS / Vue as documented | paid examples or framework mismatch | exact docs + examples |

## Motion official mechanisms

- Docs: https://motion.dev/docs/react-layout-animations
- Use layout/reorder/shared-element and presence mechanisms for content continuity and state feedback.
- The framework does not prescribe visual identity. Respect the current project's runtime; do not add React to a single-file deck for one reference.
- Inspect exact examples and free/paid boundaries before copying; Motion+ examples are not automatically available.

## Uiverse

- Home: https://uiverse.io/
- Open archive: https://github.com/uiverse-io/galaxy
- Strong categories: buttons, inputs, checkboxes, switches, loaders, cards,
  tooltips, hover states, CSS patterns.
- Use when a small control or state transition needs a quick implementation
  reference and framework overhead should stay low.
- Prefer semantic native elements over decorative wrappers.
- Verify keyboard, focus-visible, disabled, error, contrast, and touch behavior;
  community entries often demonstrate only the happy visual state.
- The live catalog is larger and newer than the Galaxy archive. Search the site
  first and use the archive only when a stable source file is useful.
- Verify each item's MIT notice and original creator. Preserve required license
  notices in substantial copied code.

## React Bits

- Docs: https://reactbits.dev/get-started/index
- Repository: https://github.com/DavidHDev/react-bits
- Strong categories: text animation, backgrounds, cursor interactions, image
  effects, canvas/WebGL, 3D, physics, scrolling, transitions.
- Provides JS/TS and CSS/Tailwind variants and supports shadcn/jsrepo
  installation.
- Dependencies are per component and may include Motion, GSAP, Three.js,
  React Three Fiber, OGL, Matter.js, Lenis, or gesture libraries. Inspect the
  exact component instead of inheriting the documentation site's full stack.
- A candidate source for expressive React/Vite work, interactive explainers and creative tools; it is not a required source or a style priority.
- License: MIT plus Commons Clause. End-product use and modification are
  allowed; selling, sublicensing, redistributing, or porting the components as
  a competing component product is prohibited.

## Aceternity UI

- Home: https://ui.aceternity.com/
- Machine-readable catalog: https://ui.aceternity.com/ai-recommendations
- License: https://ui.aceternity.com/licence
- Strong categories: hero treatments, background effects, parallax, timelines,
  text reveals, cards, globes, carousels, bento grids, marketing sections.
- Default stack: React 18+ or Next.js 13+, TypeScript, Tailwind, Motion, and
  shadcn-compatible installation.
- Use for expressive marketing, portfolio, launch, and narrative surfaces.
  Avoid using it as the default language for operational tools or dense SaaS.
- Separate free components from Pro components, blocks, and templates.
- Paid assets require explicit approval before purchase or use. The Pro license
  allows end products but prohibits source redistribution, marketplace resale,
  and derivative templates for sale.
- Aurora, beams, spotlights, bento, glow and animated text are optional treatments. Use only those consistent with the selected direction and reading rhythm; do not import the source site’s entire treatment. An intentionally maximalist direction can coordinate multiple effects while preserving hierarchy.

## Selection By Job

| Job | Start with | Typical candidates |
| --- | --- | --- |
| Button, switch, checkbox, input feedback | Uiverse | hover, press, loading, toggle |
| Loading or progress with low overhead | Uiverse | CSS loader, progress state |
| Animated title or text transition | React Bits | blur, split, scramble, reveal |
| Interactive background or canvas | React Bits | particles, grid, waves, WebGL |
| 3D or physics explanation | React Bits | R3F, OGL, Matter.js primitives |
| Hero or launch-page moment | Aceternity | parallax, spotlight, reveal |
| Timeline or editorial scroll | Aceternity | tracing beam, timeline, sticky reveal |
| HTML PPT evidence component | Museum first | external source only for a needed primitive |
| Dense product workflow | Existing UI kit first | use these sources only for a justified signature interaction |

## Rejection Rules

Reject or redesign a candidate when:

- it communicates no product state or content relationship
- it obscures the primary action or reading order
- it depends on hover for essential behavior
- it has no keyboard, touch, or reduced-motion path
- it causes layout shift, text clipping, or unreadable contrast
- its dependency or rendering cost is disproportionate to its role
- it duplicates an existing component in the project
- its license or free/pro status is unclear
- effects compete with the task or violate the selected motion hierarchy


## Current reference snapshot — 2026-09-07

This is a dated discovery index, not an install list. Refresh serious candidates at use time. “New” on a site is not a verified release date. Do not bundle React Bits component source or ported components in a redistributed skill; its current MIT + Commons Clause distinguishes end-product use from component redistribution.

| Mechanism / exact reference | Candidate use | Verified evidence / remaining check |
| --- | --- | --- |
| [Text Loop](https://reactbits.dev/text-animations/text-loop) | Wave-path display typography for a suitable expressive direction | Official catalog and rendered preview inspected; input/accessibility integration still per project |
| [Morph Slider](https://reactbits.dev/components/morph-slider) | Image displacement narrative, not precise before/after comparison | Preview switch and documented OGL/GSAP dependencies inspected; runtime and reduced-motion need integration QA |
| [Sticker Peel](https://reactbits.dev/animations/sticker-peel) | Tactile reveal for a suitable collage/illustrative direction | Preview/props/GSAP dependency inspected; keyboard/touch route must be designed |
| [Scroll Expand](https://reactbits.dev/animations/scroll-expand) | Scroll-linked content emphasis | Catalog/link verified, not accepted implementation |
| [Pixel Transition](https://reactbits.dev/animations/pixel-transition) | Pixel-language content transition | Catalog/link verified, not accepted implementation |
| [Sticky Scroll Reveal](https://ui.aceternity.com/components/sticky-scroll-reveal) | Synchronized explanation | Official content API inspected; adapt trigger for decks |
| [Layout Grid](https://ui.aceternity.com/components/layout-grid) | Item-to-detail continuity | Official click/layout behavior documented; preserve project composition |
| [Layout animations](https://motion.dev/docs/react-layout-animations) | Reorder, size/position continuity, shared elements | Official mechanism documented; use a project-owned treatment |
