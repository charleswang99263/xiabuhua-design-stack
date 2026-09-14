# Tactile interactions: local museum contract

This page documents the eight original, dependency-free mechanisms in `assets/primitives/tactile-*.js`. They are lab
specimens and reusable starting points, not a new visual theme or a mandatory effect quota. A consuming page supplies its
own direction, tokens, content and lifecycle scope.

## Contract fields

Before mounting a mechanism, record four fields:

| Field | Required answer |
| --- | --- |
| Trigger | The exact pointer/touch/keyboard/programmatic input and active area |
| State | Source of truth, semantic commit and probe-visible visual state |
| Cancel | Escape, pointer cancellation/lost capture, reversal, hidden/reduced mode, remount and disposal |
| Fallback | Keyboard/static/reduced equivalent, error recovery and a stable 44px target |

State is committed independently of animation. The primitives clamp continuous values, use elapsed time for velocity and
springs, and only mutate the local host. They do not install a global stylesheet, capture page scroll, use network I/O, or
choose a parent style.

## Catalog

| Primitive | Best use | Observable probe | Key boundary |
| --- | --- | --- | --- |
| `tactile-magnetic.js` | A draggable object with meaningful nearby targets | candidate ID, enter/exit distance, commit/cancel phase | One eligible nearest candidate; attraction never changes hit geometry |
| `tactile-velocity.js` | Decorative shell acknowledging movement energy | filtered velocity, deformation amount and settle time | Clamp and filter movement; never deform readable content |
| `tactile-parallax.js` | Three or more layers with real depth ordering | max layer offset and input mode | Bounded pointer/touch/keyboard offsets; neutral reduced/static frame |
| `tactile-focus.js` | Ordered cards where one should be legible at viewport center | focused ID and center distance | DOM order remains readable; resize and zoom remeasure |
| `tactile-tabs.js` | Continuous indicator between semantic tabs | selected index, resolved `aria-controls`, visible panel and measured indicator rectangle | `aria-selected` commits immediately; rapid changes cancel stale settle |
| `tactile-expand.js` | Same entity from thumbnail to a detail region | entity ID, source/target crop geometry, fallback and close/focus return | Re-measure aspect/resize; source may disappear; close and Escape always remain available |
| `tactile-gesture.js` | Reversible drag preview of a state/route transition | progress, commit threshold and cancel reason | Distance plus velocity commit; capture loss and reverse drag cancel |
| `tactile-collision.js` | Small explanatory sandbox with bounded bodies | wall conservation, overlap resolution and deterministic reset | Speed cap, bounded `dt`, sleep and static/reduced replacement |

## Lifecycle and input policy

The `setup(root, data, scope, options)` adapters accept the museum's local scope shape (`on`/`cleanup`) and return a
disposer. A consuming runtime may provide an equivalent scope. Every pointer gesture uses capture where available and
handles `pointerup`, `pointercancel`, `lostpointercapture` and Escape. Controls remain usable with keyboard; touch uses
pointer events and `touch-action` is scoped to the gesture surface. A hidden or disposed host cannot receive late timer/RAF
writes. Reduced motion removes travel/continuous loops while preserving semantic selection, expansion, cancellation and the
static result.

## Verification

Use one oracle per question rather than a composite score. Recommended checks are: magnetic candidate enters before it
exits; velocity amount is capped; parallax offsets differ by depth and return to zero; focus follows the center; tab
selection and indicator agree after resize; expansion closes and returns focus; gesture cancellation restores zero; collision
bodies remain within walls and deterministic reset reproduces initial state. Exercise real pointer and keyboard events in a
browser, then repeat a cancellation and a reduced-motion path. The standalone [tactile lab](../assets/tactile-lab.html) is a
live offline demonstration of all eight.
