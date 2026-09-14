# Execution QA

Use this checklist against the rendered artifact and its source.

- [ ] The authored stage matches the configured positive finite dimensions
      (1920×1080 by default for compatibility) and scales uniformly to the
      viewport without slide-content reflow.
- [ ] Every slide stays within its stage; no text or media is clipped, overflows,
      or unintentionally overlaps another panel.
- [ ] Only the active slide is visible, hit-testable, and keyboard reachable;
      hidden slides retain state without receiving input. If multiple decks
      exist, pointer/focus ownership leaves exactly one deck consuming body
      keyboard events.
- [ ] Each navigation mode enabled by the parent works as specified. Test touch
      swipes or wheel only when enabled; do not add input modes to satisfy QA.
- [ ] Navigation does not steal input from text fields, selects, or editable
      regions; focus can be restored after a slide change.
- [ ] Links are reachable and point to the supplied targets; images and media
      resolve under the stated online or offline asset contract.
- [ ] Reduced-motion behavior leaves the deck usable.
- [ ] Print/PDF output has the expected page count and order, one fixed-size
      slide per page at the validated stage dimensions, and preserves the
      source content required by the artifact contract. Export uses print
      media/runtime API and does not install or download dependencies.
- [ ] The canonical CSS is scoped to an explicit runtime host or standalone
      opt-in; generic embedding-page `.slide`, media, and reduced-motion rules
      remain unaffected.
- [ ] The produced deck includes the complete `viewport-base.css` contents as
      its single stage/slide/print/reduced-motion source. If reusable runtime
      navigation is used, `runtime/deck-stage.js` is included as behavior only
      and does not inject a second execution stylesheet.

The checklist covers technical execution only; upstream presentation decisions
remain in the parent workflow.
