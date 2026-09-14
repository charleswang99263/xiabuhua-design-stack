# Material-led directions

Read [use boundary](README.md). Materials may support another language or lead a complete identity. Define the depth/shape relationships across composition, type, assets and states rather than applying one effect to generic cards. Code is our original web adaptation with illustrative, replaceable values.

## Glassmorphism

**Evidence:** contemporary UI label, not a standardized historical movement. [Malewicz’s author account](https://hype4.academy/articles/design/glassmorphism-in-user-interfaces) describes the layered translucent treatment; [Apple Materials](https://developer.apple.com/design/human-interface-guidelines/materials) is a platform example of material-based hierarchy, not the definition of glassmorphism or a skin to copy. [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) documents the web mechanism.

**Defining relationship:** translucent foreground planes reveal a distinguishable changing background; blur, edges and contrast communicate depth. A gradient alone does not create glass. Decide what sits behind each plane and how typography remains legible when it changes.

```css
.glass .plane { background: var(--surface-solid, #fff); color: var(--ink, #162129); border: 1px solid var(--edge, #8996a0); }
@supports (backdrop-filter: blur(1px)) {
  .glass .plane {
    background: var(--surface-glass, rgb(255 255 255 / .8));
    backdrop-filter: blur(var(--blur, 16px)) saturate(1.15);
  }
}
.glass[data-transparency="off"] .plane { background: var(--surface-solid, #fff); backdrop-filter: none; }
```

**Ordinary/control surface:** adapt tint/opacity/boundary by region. Dense evidence can use more opaque surfaces within the same plane hierarchy; do not automatically revert the whole body to another theme. Test changing backdrops and selected/focus states. Limit stacked filtering where it harms scrolling; feature support alone is not a performance result.

**Nearest distinction:** Neumorphism suggests continuity with one surface; glass separates planes. Platform Acrylic/material has its own semantic rules. Copying blur into a static opaque card without a meaningful backdrop is an effect, not a validated direction.

## Neumorphism

**Evidence:** author-traceable contemporary label. [Malewicz's 2019 introduction](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6) discusses the new-skeuomorphism naming; only its publicly accessible introduction was used. [Plyuto's banking concept](https://dribbble.com/shots/7994421-Skeuomorph-Mobile-Banking) is an original representative work. Neither defines a universal accessible UI system.

**Defining relationship:** shallow raised/recessed forms seem molded from a common surface, using coherent light direction and paired light/dark shadows. Low contrast is a risk to repair, not a required virtue; particular corner radii and colors are not compulsory.

```css
.neumorphic .surface { background: var(--surface, #e7eaee); padding: 1.5rem; }
.neumorphic .control {
  background: var(--surface, #e7eaee);
  border: 1px solid var(--edge, #76818d);
  box-shadow: 6px 6px 12px var(--shade, #c1c7ce), -6px -6px 12px var(--light, #fff);
}
.neumorphic .control[aria-pressed="true"] {
  box-shadow: inset 3px 3px 6px var(--shade, #c1c7ce), inset -3px -3px 6px var(--light, #fff);
}
.neumorphic .control:focus-visible { outline: 3px solid currentColor; outline-offset: 4px; }
```

**Ordinary/control surface:** use the same plane/light model in panels and actual controls. Selected, disabled and error states need text/icon/boundary distinctions in addition to relief. Test toggled state with a real semantic button; CSS alone does not update `aria-pressed`.

**Nearest distinction:** Skeuomorphism may reference paper, leather, dials or other familiar features. Neumorphism is a narrower surface-relief treatment and need not imitate a named physical device. A generic soft drop shadow does not establish a common molded surface.

## Skeuomorphism

**Evidence:** physical features retained or represented in another medium, with broad visual and interaction uses. [Museum of Arts and Design’s teaching resource, PDF page 39](https://madmuseum.org/sites/default/files/static/ed/Against%20the%20Grain_TRP_0.pdf#page=39) defines material mimicry through Martin Puryear’s wing chair. [Apple's design-principles session](https://developer.apple.com/videos/play/wwdc2026/250/) gives first-party guidance on familiar metaphors and predictable behavior; it does not supply a complete historical definition. [Malewicz's introduction](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6) also identifies familiar interface objects as continuing skeuomorphic examples.

**Defining relationship:** a recognizable object/material vocabulary—paper leaves, instrument casing, physical controls—connects appearance to a familiar reference. A visual metaphor alone can qualify; do not demand that every texture replicate real-world physics. When a representation suggests an action, make its behavior predictable. Product photography alone is not necessarily a skeuomorphic interface.

**Web adaptation:** compose a named object, its material/lighting and its useful affordances. For a dial, keep the accessible control semantic and make an SVG/CSS needle a view of the same value:

```html
<div class="skeuo">
<label>Gain <input class="gain" type="range" min="0" max="100" value="40"></label>
<output class="gain-value">40</output>
<div class="meter" aria-hidden="true"><i class="needle"></i></div>
</div>
```

```css
.skeuo .meter { position: relative; aspect-ratio: 2; border: 2px solid currentColor; border-radius: 50% 50% 0 0; overflow: hidden; }
.skeuo .needle { position: absolute; inset-inline-start: 50%; bottom: 0; inline-size: 2px; block-size: 85%; background: currentColor; transform-origin: bottom; transform: rotate(var(--angle, -18deg)); }
```

```js
const root = document.querySelector('.skeuo');
const input = root.querySelector('.gain');
const sync = () => {
  root.style.setProperty('--angle', `${Number(input.value) * 1.8 - 90}deg`);
  root.querySelector('.gain-value').textContent = input.value;
};
input.addEventListener('input', sync);
sync();
```

**Ordinary/control surface:** preserve grouping, scale labels and state meanings across the instrument or material system. Native range keyboard/touch behavior remains available; do not replace it with a pointer-only custom knob. The example establishes value-to-needle mapping; it is not a finished instrument illustration.

**Nearest distinction:** Neumorphism centers a common relief surface; skeuomorphism centers retained familiar features. A device metaphor must fit the user's task; an unrelated decorative object does not make the interface more understandable.
