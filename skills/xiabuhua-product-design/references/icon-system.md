# Icon System Reference

Use this reference when choosing or handing off interface icons. It defines the default for a new, unconstrained user product; it does not replace an established or explicitly requested icon system.

## Default choice

- Prefer **Hugeicons Free Stroke Rounded** for new unconstrained products. Keep one family and one semantic vocabulary across the product.
- Use **Iconoir** as the explicit alternative when its visual language, platform fit, or licensing better matches the confirmed direction.
- A style specimen comparison is needed only when the icon direction is still unresolved. The approved September 2026 comparison used Hugeicons `4.3.3`; this records the selection evidence, not an evergreen version pin.
- If a mandatory brand requirement (such as a true filled selected variant) conflicts with the available free set, report that specific asset gap and present a compatible licensed family or authorized asset option. Do not silently replace the requirement with a container/color treatment or restart the whole style review.
- Preserve an established or user-requested library. Do not reopen a settled choice or silently swap families for convenience.

## Package and licensing

For React, use `@hugeicons/react` with `@hugeicons/core-free-icons`. Do not use the deprecated `hugeicons-react` package. Paid Hugeicons styles may not be silently substituted for the Free Stroke Rounded set; record the selected set, package versions, source icon names, retrieval/version evidence, and applicable license before handoff.

## Selection and rendering rules

- Choose icons by meaning and interaction role first; use the same family for equivalent semantics and states. Check the family against typography, density and brand geometry in a real navigation/button/content sample, not only a catalog grid.
- Keep utility controls clear and quiet; give primary navigation a recognizable selected treatment; allow richer feature-entry icons when the hierarchy calls for them. Declare size, stroke weight, optical box and icon-label gap as shared tokens instead of per-screen adjustments.
- Define selected states using the available set (for example color plus a container or indicator). Do not invent a matching free filled variant, synthesize one by setting `fill`, or rely on color alone. If a symbol is missing, inspect same-family synonyms before adding a justified, optically matched exception.
- Treat 16, 20, and 24 px as useful render checkpoints, not mandatory universal sizes. Select the size from the control contract and inspect the actual rendered component.
- Check optical weight and visible bounds in default, selected, disabled, and dark/inverse states. Document a small optical offset only when rendered evidence requires it.
- Do not mix arbitrary families, unmanaged Unicode glyphs, emoji, or placeholder symbols into production UI. A low-fidelity wireframe may use temporary placeholders only when clearly marked and replaced before handoff.
- Large illustrations, logos, and expressive subject artwork are separate asset decisions; do not force them into the interface icon library.
- Hide decorative SVGs from assistive technology when the control already has a name; a meaningful standalone icon needs its own accessible alternative.
- Icon-only buttons need an accessible name (`aria-label` or equivalent visible/assistive label) and a target that follows the component geometry contract.

## Handoff record

For each production-intent icon, record: family and icon name/ID, package or source file, version/retrieval evidence, license, editable representation, optical box/stroke policy, and runtime mapping. Verify the source resolves in the target build and that the rendered states remain recognizable and legible.

## Official sources

- [Hugeicons React quick start](https://hugeicons.com/docs/integrations/react/quick-start)
- [Hugeicons catalog](https://hugeicons.com/icons)
- [Iconoir React](https://iconoir.com/docs/packages/iconoir-react)
