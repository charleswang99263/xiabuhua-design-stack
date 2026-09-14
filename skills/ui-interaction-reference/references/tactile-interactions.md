# Tactile router

Use the canonical museum contract in `../../html-ppt-component-museum/references/tactile-interactions.md` when a chosen
interaction needs direct manipulation, spatial depth or physically continuous feedback. This file only routes selection;
it does not duplicate implementation contracts.

| Need | Local starting primitive | Choose it when |
| --- | --- | --- |
| Meaningful drop target | `tactile-magnetic.js` | Attraction clarifies a target and hysteresis can prevent jitter |
| Movement energy | `tactile-velocity.js` | A decorative shell may acknowledge speed without deforming content |
| Real depth layers | `tactile-parallax.js` | Foreground/midground/background are meaningful and bounded |
| One readable card | `tactile-focus.js` | An ordered scroller benefits from center distance focus |
| Tab continuity | `tactile-tabs.js` | A measured indicator should follow immediate semantic selection |
| Thumbnail to detail | `tactile-expand.js` | The same image/entity needs crop continuity and return focus |
| Reversible drag preview | `tactile-gesture.js` | Distance/velocity can decide commit and cancellation is meaningful |
| Contained simulation | `tactile-collision.js` | Bounded bodies explain a relationship in a sandbox |

All eight remain optional mechanisms, never a quota or global style override. Require the parent visual direction and task
contract first. The museum reference owns trigger/state/cancel/fallback fields, reduced/static behavior, lifecycle and
probe guidance; the tactile lab demonstrates all eight offline. Reuse the local primitives before browsing external sources,
and validate the consuming page with real pointer/touch/keyboard input.
