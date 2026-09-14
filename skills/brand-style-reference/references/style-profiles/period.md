# Period, cultural and technical image languages

See [use boundary](README.md). These terms overlap and have different evidence strength. Identify the specific era, setting or image system; don't turn them into a palette selector. All implementation rules/snippets are our original web adaptations.

## Retro-web

**Evidence:** broad historical reference lens. [Web Design Museum](https://www.webdesignmuseum.org/) supplies archived examples, not one definition of retro web. Select an actual period/page before combining browser chrome, bitmap media, link conventions or early web typography.

**Web adaptation:** use period-consistent page hierarchy, directory/link density, window framing or publishing conventions. Implement with modern semantic HTML/CSS rather than layout tables or obsolete elements. Distinguish decorative browser/OS chrome from real controls.

```css
.retro .window { border: 2px solid currentColor; }
.retro .window-title { border-block-end: 2px solid currentColor; padding: .35rem .6rem; }
.retro .directory { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: .5rem 1rem; }
.retro a { text-decoration: underline; }
@media (max-width: 35rem) { .retro .directory { grid-template-columns: 1fr; } }
```

**Ordinary/control surface:** retain link/input semantics, keyboard navigation and actual state labels; adapt historic width constraints to today's viewport without losing the period's framing relationships. **Distinction:** Pixel is an image method and may be contemporary; Y2K is a narrower cultural/material reference. CRT noise alone is not retro-web evidence.

## Y2K

**Evidence:** broad turn-of-millennium cultural label with disputed boundaries. [Web Design Museum's Y2K exhibition](https://www.webdesignmuseum.org/exhibitions/y2k-aesthetic-in-web-design) curates shiny/translucent/iridescent examples from the period; it is an archive interpretation, not a complete canon.

**Web adaptation:** select the reference's synthetic material, liquid or aerodynamic contour, display-type relationship and consumer-digital imagery. Chrome, plastic and iridescence are possible mechanisms; none authorizes a generic neon SaaS shell.

```css
.y2k .emblem { border-radius: 48% 52% 61% 39%; background: conic-gradient(from 35deg, #f9fbff, #9da8b4, #e7ceff, #f9fbff, #8da9c3, #f9fbff); box-shadow: inset 2px 2px 5px #fff, inset -3px -3px 8px #617181; }
.y2k .display { font-stretch: expanded; letter-spacing: -.035em; }
```

Use a font that actually supports the chosen width or an authored graphic; setting `font-stretch` does not create missing font axes. This emblem is only a material mechanism; real subject imagery or original shape composition is still needed. **Ordinary surface:** repeat contour, type and material-edge relationships in navigation/labels while keeping evidence legible. **Distinction:** Glass need not carry an era; retrofuturism explicitly chooses an earlier imagined future. One metallic title is a local effect.

## Retrofuturism

**Evidence:** retrospective future-imagery concept. [Academia Brasileira de Letras](https://www.academia.org.br/nossa-lingua/nova-palavra/retrofuturismo) documents the term's relationship to past visions of the future. It is not exclusively a space-age aesthetic.

**Web adaptation:** name the era and its imagined future first, then select period geometry, print/industrial materials and narrative imagery. For a space-age branch, orbital diagrams and printed annotations may work; they are not required for every branch.

```css
.retrofuture .orbit-map { position: relative; aspect-ratio: 1; }
.retrofuture .orbit { position: absolute; inset: 15%; border: 1px solid currentColor; border-radius: 50%; transform: rotate(-25deg) scaleY(.5); }
.retrofuture .plate { border-block: 2px solid currentColor; padding-block: 1rem; }
```

**Ordinary/control surface:** use consistent era-linked annotation, instrument/print framing and state labels rather than switching to a generic contemporary dashboard. **Distinction:** Cyberpunk is a different narrative/visual reference, not simply a darker palette. Unspecified spaceships and stars are generic science fiction, not evidence of a chosen historical viewpoint.

## Cyberpunk

**Evidence:** science-fiction term with author-origin evidence; [Bruce Bethke's account](https://www.infinityplus.co.uk/stories/cpunk.htm) explains its naming and distinguishes that from later genre formation. It does not prescribe a webpage color system.

**Web adaptation:** choose a relevant technological/noir setting and develop layered infrastructure, signage, density and human/technical tension through actual images and information composition. Neon, narrow type and glitch are optional signals; do not mandate black, purple or monospaced body copy.

```css
.cyber .signal-panel { position: relative; border-inline-start: 3px solid var(--signal, currentColor); padding-inline-start: 1rem; }
.cyber .technical-frame { clip-path: polygon(0 0, 92% 0, 100% 12%, 100% 100%, 0 100%); }
.cyber .status { font-variant-numeric: tabular-nums; letter-spacing: .08em; }
```

Apply clipping to decorative framing, not focus rings or essential text. A state glitch, if chosen, is brief, interruptible and never obscures values; a still image cannot validate it. **Ordinary/control surface:** repeat signage/status/line relationships in evidence and controls with a clear task path. **Distinction:** Dark tech lacks the necessary genre/world-building commitment; a neon frame alone cannot establish cyberpunk.

## Pixel

**Evidence:** image-making language, not necessarily nostalgic. [Aseprite's creator-maintained documentation](https://www.aseprite.org/docs/) provides an actual sprite/pixel-art workflow; [MDN crisp pixel-art technique](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) and [image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering) support web rendering mechanics, not a universal artistic definition.

**Web adaptation:** specify a coherent native picture grid, deliberate stepped silhouettes, sprite/type relationships and animation frame logic. Limited palettes and game feedback are options, not requirements for every pixel-art project.

```css
.pixel .sprite { inline-size: 96px; block-size: 96px; image-rendering: pixelated; }
.pixel .frame { border: 4px solid currentColor; border-radius: 0; }
```

For an authored 32×32 sprite the illustrative 96×96 display is 3×. Canvas can draw at a selected native size and display at an integer scale; test device-pixel ratio and browser zoom, since CSS size alone does not ensure perfectly even physical pixels. Do not smooth/stretch sprites arbitrarily. **Ordinary/control surface:** actual text/inputs stay readable and scalable, while borders/icons/feedback follow the picture-unit logic. **Distinction:** Retro web is period interface vocabulary; pixel imagery can belong to a new contemporary composition. A mosaic filter over an unrelated photograph is not enough to establish the direction.

## Dark-tech

**Evidence:** broad contemporary composite, no single established author or canon. [Apple Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) concerns appearance adaptation and legibility; it is not a definition of this visual label.

**Web adaptation:** specify what makes the direction technical and distinctive—instrument-like precision, technical diagram imagery, engineered material or another justified thesis—then define dark surface hierarchy and signal roles. Density and fonts follow the task; this label does not mandate a compact console.

```css
.darktech { color-scheme: dark; color: var(--ink-on-dark, #edf1f4); background: var(--base-dark, #111820); }
.darktech .elevated { background: var(--raised-dark, #23303b); border: 1px solid var(--edge-dark, #7f919f); }
.darktech .value { font-variant-numeric: tabular-nums; }
```

**Ordinary/control surface:** preserve engineered lines, imagery/annotation relationships and explicit elevation in tables, forms and feedback. Define error/focus/status separately from decorative glow. **Distinction:** changing a generic layout to dark mode is a theme variant. Compared with Cyberpunk, this language does not inherently commit to genre narrative or social tension. If it cannot be distinguished from Minimalism plus dark tokens, label it a variant instead of a third independent direction.
