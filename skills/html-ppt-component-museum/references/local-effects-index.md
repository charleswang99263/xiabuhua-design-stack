# Local effects and online exploration

Use this index before external browsing. Common, repeatedly used mechanisms with a known contract should reuse the tested local source; complexity alone is not a reason to re-research them each time. Exploratory visual direction, novel assets, a missing capability or a project-specific high-craft target can justify live React Bits exploration. A local example still needs testing in its consuming project.

## Maintained original sources

| Local source | Reuse interface | Covered behavior | Boundary |
| --- | --- | --- | --- |
| [Text Entry](../assets/primitives/text-entry.js) | `MuseumTextEntry.mount(element, text, {mode, duration, scope, isReduced})` returns finish/cancel | decode, words, blur, type, fade, none; true accessible text, bounded duration, stable reserved layout, pause/skip/cancel | Short display text; long text falls back to fade; don't scramble values/errors. Does not claim GSAP line-splitting parity. |
| [Sticker Peel](../assets/primitives/sticker-peel.js) | `PEEL_FIX.geometry(w,h,p)`, `.render(data, helpers)`, `.setup(root,data,scope,options)` | Full 0–100 reveal; one crease governs clipping and reflected fold; responsive resize and pointer/keyboard controls | A flat rectangular paper simulation, not an arbitrary 3D cloth solver. |
| [Scroll Stack](../assets/primitives/scroll-stack.js) | `createScrollStack(stages)` returns registry, CSS and stage data; each stage supplies unique safe `id`, `kicker`, `title`, `body`, `note` | Local scroll, stable anchors, sticky stacking, explicit step navigation, state restoration and reduced/static list | Curated short collections; not every Lenis/full-page/virtualized effect or arbitrary media layout. |

For text/peel, `scope` supplies active-time `clock()`, `schedule(ms,fn)`, `on(target,event,fn)`, and `cleanup(fn)`; it must pause scheduled visual work when hidden/offscreen/paused and dispose it on unmount. The museum's `createScope` is the existing adapter. The scroll module can receive state options when used outside the museum. Preserve these lifecycle contracts when porting to React or a standalone document; read each source's exports instead of assuming identical APIs to React Bits.

The standalone museum embeds exact copies via `scripts/sync-primitives.cjs`. Edit original sources, run the compiler, then `--check` and the validator. Do not hand-edit embedded copies. End products can inline only the selected original source/CSS. No external library or network request is required by these primitives.

Existing local registry mechanisms remain available for card expansion, FLIP/drag ordering, before/after comparison, progress, bulk selection and measured disclosure. Reuse their component-specific state contracts rather than deriving behavior from decorative presets.

## React Bits mapping: checked 2026-09-09

These links describe reference families, not bundled third-party implementations. The visual research pass used Chrome previews for Decrypted Text, Split Text, Scroll Stack and Spotlight Card; other rows use official catalog/source evidence. None of the external source files is shipped in this library.

| Official reference | Current local route | When to explore online |
| --- | --- | --- |
| [Decrypted Text](https://reactbits.dev/text-animations/decrypted-text) | Text Entry `decode`, Code Spotlight | New sequencing/direction requirements not covered by local decoding |
| [Split Text](https://reactbits.dev/text-animations/split-text) | Text Entry `words`; existing title beats | Actual line-based splitting, advanced GSAP scroll choreography |
| [Blur Text](https://reactbits.dev/text-animations/blur-text) | Text Entry `blur` | Complex multi-stage blur/transform composition |
| [Text Type](https://reactbits.dev/text-animations/text-type) | Text Entry `type` with skip/final text | Scripted multi-sentence editing/cursor behaviors beyond bounded entrance |
| [Rotating Text](https://reactbits.dev/text-animations/rotating-text) | Local short-sentence switching with Text Entry; Quote Theater retains full context | True coordinated exit/entry and rotating word-slot layouts; not claimed as an identical local component |
| [Scroll Stack](https://reactbits.dev/components/scroll-stack) | Original local Scroll Stack | Full-page scroll physics, advanced variants and media-driven choreography |
| [Animated List](https://reactbits.dev/components/animated-list) | Existing bulk/reorder mechanisms when job is selection/order | Streaming list insertion/removal, virtualization: not yet a separately shipped animated-list primitive |
| [Spotlight Card](https://reactbits.dev/components/spotlight-card) | Candidate for future local surface feedback | Exact pointer/focus/touch spotlight requirement; not shipped in this increment |
| [Tilted Card](https://reactbits.dev/components/tilted-card) | Candidate for future local spatial feedback | Specific image/caption tilt target; not interchangeable with topology-based 3D Token Field |
| [Flowing Menu](https://reactbits.dev/components/flowing-menu) | Online exploration | Signature navigation/image marquee; validate non-hover fallback |
| [Dock](https://reactbits.dev/components/dock) | Candidate, not shipped | Actual magnifying navigation need; don't replace an established navigation system automatically |

## Promotion rule

Promote a mechanism into local reuse when its task recurs, adaptation boundaries are known, maintaining it is cheaper than repeated discovery, and input/state/resize/reduced/static/disposal checks can be repeated. A complex reusable scroll mechanism can qualify; a simple but brand-specific effect may stay exploratory. Record source principle, original implementation provenance, local API, suitable/excluded cases and tested boundaries. Add it under the existing explanation job, not a “new effects” category.

Local-first does not mean frozen aesthetics. Keep type, color, spacing, material and intensity inherited from the parent. Use online sources for the demonstrated gap and return the resulting adaptation/validation to the existing contract; do not start a second style selection process.

## Source use

[React Bits LICENSE.md](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md), checked 2026-09-09, permits use as part of applications/websites/products and restricts selling, sublicensing or redistributing components themselves, including bundles and ports. This library therefore stores original implementations plus reference links, not repackaged React Bits components. If a future task requires exact upstream code, inspect the applicable license and intended distribution separately. No blanket claim that all third-party code can be copied into a reusable component package.
