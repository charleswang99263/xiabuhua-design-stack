# Full-Feature Mobile App Method

Use for high-fidelity mobile products intended for real use, including React Native, Expo, iOS, Android, and platform-aware prototypes.

Use the shared [style direction workflow](style-direction-workflow.md) before new visual work; inherit an existing target for a delta. Platform conventions constrain behavior, not every brand or art-direction choice.

## Contents

1. Platform intent
2. Anti-default decisions
3. Platform review evidence
4. Complete app map
5. Navigation
6. Ergonomics
7. Safe areas, keyboard, and text
8. Native inputs and feedback
9. State and claim truth
10. Visual craft
11. Peak-end feedback
12. Mobile design system
13. React Native/Expo runtime quality
14. Data, offline, and lifecycle
15. Accessibility
16. Verification ladder
17. Device matrix

## 1. Declare Platform Intent

Decide whether the product is:

- iOS-first
- Android-first
- one shared cross-platform product with explicit platform adaptations
- responsive web presented on mobile

Do not disguise a responsive website as a native app. Record which navigation, gestures, controls, typography, system surfaces, permissions, and feedback follow each platform.

## 2. Make Anti-Default Decisions

For each prominent surface, record the user task, content constraint, platform context, and the reason for the chosen pattern. Also record which familiar default was rejected and why. Defaults are hypotheses, not acceptance criteria.

Avoid importing a generic centered hero, arbitrary card grid, 8pt-only spacing rule, 60/30/10 color formula, Tailwind utility defaults, or iOS conventions onto Android without evidence. Use the expression level established by the approved direction while routine controls remain legible and respect platform behavior. Do not impose a signature count.

## 3. Review Platforms With Evidence

Use the relevant platform documentation and native behavior as evidence for platform-specific decisions, including navigation, permissions, text scaling, system surfaces, back behavior, and controls. iOS guidance is not a cross-platform visual preset; Android guidance is not merely an alternate color theme.

Triangulate decisions with: the task and real content, the target OS conventions, the existing product vocabulary, and a rendered build with real taps. When sources conflict, document the chosen behavior and the user value it protects. Do not treat a screenshot, design trend, or copied pattern as proof of runtime behavior.

## 4. Map The Complete App

Define:

- launch, onboarding, sign-in, account recovery, and sign-out
- top-level navigation and each navigation stack
- primary and secondary journeys
- search, notifications, settings, account, help, and legal surfaces as relevant
- permissions and privacy explanations
- offline, reconnect, background/foreground, interrupted, and resumed behavior
- deep links, push entry points, and external handoffs
- update, migration, and destructive data behavior when applicable

Every screen needs an entry, task, data/state contract, and exit. Avoid beautiful orphan screens.

## 5. Navigation And Spatial Model

- Use native-feeling stacks for hierarchy and tabs for stable peer destinations.
- Preserve expected back behavior, including gestures and Android system back.
- Keep modal, sheet, full-screen, and pushed-page semantics distinct.
- Maintain user context when moving between list and detail.
- Avoid nesting navigation models that make location unclear.
- Use shared-element or directional motion only when it truthfully explains hierarchy or continuity.

## 6. Ergonomics And Reachability

- Place frequent primary actions in comfortable reach when the task allows.
- Keep critical destructive actions separated from frequent actions.
- Design for one-handed use, moving environments, coarse touch, and interrupted attention.
- Use a comfortably sized touch target as a strong default, expressed in the target platform's unit: points on iOS, dp on Android, and CSS pixels on mobile web. Follow the current platform component guidance when it is stricter or materially different.
- Provide non-drag alternatives for essential drag interactions.
- Keep gesture areas clear of system navigation and home indicators.

## 7. Safe Areas, Keyboard, And Text

Design and test:

- notches, Dynamic Island/cutouts, home indicators, and system bars
- portrait plus any genuinely supported orientations
- keyboard open, dismissal, focus movement, autofill, and error visibility
- long localized text and right-to-left layout when required
- Dynamic Type or system font scaling at larger settings
- status bar, navigation bar, tab bar, sheets, and scroll-edge behavior

Do not hard-code a single phone frame as the layout model.

## 8. Native Inputs And Feedback

- Prefer familiar platform controls for navigation, menus, pickers, sheets, context actions, and authentication.
- Use press states that respond immediately.
- Pair meaningful completion, warning, and selection moments with restrained haptics when supported.
- Never use haptics, color, or motion as the only signal.
- Use camera, location, biometrics, media, sharing, and other device capabilities only with clear user value and permission timing.

Ask for permission in context, explain the benefit before the system prompt when helpful, and provide a path when permission is denied.

## 9. State And Claim Truth

Treat every visible status as a claim about the underlying data or event. Define explicit states such as idle, loading, partial, stale, offline, queued, running, success, failed, canceled, expired, and permission denied where they apply.

- Say “saved” only after persistence is acknowledged; label optimistic updates as pending until confirmed.
- Show progress only when there is a trustworthy signal; otherwise describe the current phase without inventing a percentage.
- Keep timestamps, source, freshness, and uncertainty visible when they affect a decision.
- Every failure or interruption should state what happened, what was preserved, and the next available action.

Do not let decorative motion, color, or a success screen imply a stronger outcome than the system actually achieved.

## 10. Mobile Visual Craft

High-end mobile design comes from precision:

- a coherent type and icon system that survives scaling
- disciplined spacing and optical alignment
- clear surface hierarchy without excessive cards
- high-quality imagery, crop, and transitions
- deliberate light/dark appearance
- concise copy and strong state feedback
- platform-aware controls inside a distinctive product language

Use one memorable product signature, not a different novelty on every screen. Settings, forms, permission states, and errors need the same polish as the main flow.

## 11. Peak-End Feedback

Spend feedback budget on moments that change confidence or behavior: first meaningful action, high-stakes confirmation, completion, failure recovery, and return after interruption. Press states should be immediate; haptics, motion, and sound should reinforce a meaningful event rather than decorate every tap.

Feedback must be brief, interruptible, and safe to repeat. Respect reduced-motion settings, haptic availability, and user attention; never make color, motion, or haptics the only signal. The end state should make the result and the next step unmistakable.

## 12. Mobile Design System

Define:

- semantic tokens with light/dark and platform mappings
- typography roles and scaling behavior
- spacing, radius, borders, elevation, and overlay behavior
- navigation, buttons, fields, lists, cards, sheets, dialogs, toasts, and banners
- component variants and state contracts
- icons, imagery, haptics, and motion roles
- safe-area and keyboard primitives

For React Native/Expo:

- use native stack/tabs where appropriate
- use optimized image components
- virtualize large lists
- keep list items lightweight and references stable
- keep native dependencies in the app package
- use Reanimated/gesture tooling for continuous gesture-linked motion
- organize design-system imports through a clear shared boundary

## 13. React Native/Expo Runtime Quality

These are implementation checks, not substitutes for the product and platform principles above:

- Keep gesture-linked and continuous animation off the JS thread where the framework supports it; avoid layout loops, unnecessary re-renders, and unbounded work during transitions.
- Virtualize long lists, use stable keys and references, keep rows lightweight, and size/cache images intentionally. Test realistic media and data volume rather than a short fixture.
- Treat safe-area, keyboard, permission, background, and deep-link handling as runtime integrations with explicit fallbacks. Cancel subscriptions and asynchronous effects when screens unmount or tasks are superseded.
- Record native dependency and runtime assumptions. Minimize new native modules, test the release-like build, and inspect startup, frame stability, memory, and crash behavior on a lower-powered representative device.

## 14. Data, Offline, And Lifecycle

Specify:

- first load, refresh, pagination, optimistic action, and conflict behavior
- cached, stale, partial, and offline data
- app backgrounding during uploads, payments, generation, or forms
- cancellation, retry, resume, and duplicate submission protection
- session expiration and permission changes outside the app
- local draft persistence and recovery

The UI must explain what happened and what the user can do next.

## 15. Mobile Accessibility

- Preserve semantic labels, roles, hints, order, and grouped reading.
- Support screen readers and switch/keyboard input where the platform provides it.
- Do not encode meaning only by color, position, gesture, motion, or haptic feedback.
- Keep focus visible and predictable.
- Support large text without clipping or hiding actions.
- Respect reduced motion and reduce large spatial/parallax movement.
- Keep critical targets comfortably sized and separated.

## 16. Verification Ladder

Verify in an ascending-cost ladder, keeping evidence attached to each critical journey:

1. **Contract/static:** screen and state inventory, route/back semantics, token and accessibility checks, and no inert controls.
2. **Rendered:** representative small/large devices, safe areas, light/dark appearance, large text, keyboard, and real content.
3. **Interaction:** real taps, gestures, focus movement, navigation return, permission decisions, cancellation, and retry.
4. **Network/lifecycle:** slow network, offline, stale data, refresh, background/foreground, interruption, resume, and duplicate submission.
5. **Runtime:** release-like build, low-powered device, long lists, media, animation, startup, frame stability, memory, and crash signals.
6. **Human review:** hierarchy, optical balance, platform fit, claim truth, and whether peak/end feedback improves confidence without noise.

Passing static checks does not validate touch behavior or visual hierarchy; a polished screenshot does not validate lifecycle or runtime quality.

## 17. Required Device Matrix

Select a representative matrix, not every device:

- small and current large phone
- iOS and Android when both are supported
- light and dark appearance
- default and large text
- keyboard-open and safe-area edge cases
- slow network, offline, permission denied, and interrupted task
- low-powered representative device for long lists, images, and animation

Verify primary journeys with real taps/gestures in a runnable build when possible. Static frames alone cannot validate a full app.
