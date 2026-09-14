# High-Craft Desktop Web App Method

Use for production-grade desktop web products, especially React + Vite applications with multiple routes, rich interaction, high visual standards, and demanding motion.

Use the shared [style direction workflow](style-direction-workflow.md) before new visual work. This platform method governs task behavior and implementation; it supplies no competing theme.

## Contents

1. Real stack
2. Product shell
3. Route and state architecture
4. React component architecture
5. Desktop visual craft
6. Responsive behavior
7. Motion integration
8. Web quality baseline
9. Required QA

## 1. Start From The Real Stack

Inspect before changing:

- package manager, React and Vite versions
- routing, data fetching, state, forms, tables, charts, animation, icons, and styling libraries
- existing tokens, component library, Storybook, tests, and lint/build rules
- authentication, roles, API contracts, persistence, and feature flags
- supported browsers, viewport range, and deployment target

Preserve established choices unless they block the intended quality or behavior. Add dependencies only for a clear capability gap.

## 2. Define The Product Shell

Design the reusable shell before isolated pages:

- global navigation and route hierarchy
- page title, context, breadcrumbs, and history behavior
- command/search surface
- notification, account, help, and system status
- content canvas, panels, overlays, and responsive collapse
- global loading, error, permission, and offline behavior

Desktop products should exploit screen space without becoming visually noisy. Use stable regions for repeated work and preserve context during drill-down.

## 3. Route And State Architecture

For each route, define:

- user job and entry condition
- required data and permission
- primary, secondary, and destructive actions
- URL-addressable state: filters, tabs, sort, pagination, selection, expanded detail
- loading, empty, error, stale, success, and recovery states
- exit path and preserved context

Use links for navigation and buttons for actions. Ensure browser back/forward, refresh, deep links, and modifier-click behavior remain truthful.

## 4. React Component Architecture

- Organize by product/feature boundaries and shared system primitives.
- Keep state at the narrowest truthful owner; derive values instead of duplicating state.
- Use compound components or composition for complex reusable UI.
- Prefer explicit variants over many boolean props.
- Separate visual components from data orchestration where it improves reuse and testing.
- Keep expensive or frequently updating regions isolated.
- Do not define components inside components.
- Design error boundaries and suspense/loading boundaries around user-recognizable regions.

Use the codebase's existing patterns. These rules are architecture guidance, not grounds for an unrelated refactor.

## 5. Desktop Visual Craft

Define a strong but durable desktop language:

- an intentional type system for display, interface, and data roles
- semantic color and surface hierarchy using the emphasis level in the approved direction
- a grid that supports scanning, comparison, and resizable content
- precise borders, elevation, dividers, and selected/focus treatment
- high-quality icons and real imagery where the subject requires it
- one signature interaction or spatial idea tied to the product

Secondary routes, settings, forms, empty states, and dialogs must share the same craft. Do not put all visual ambition into a dashboard or landing-like first screen.

## 6. Responsive Desktop Behavior

Design at minimum:

- wide desktop
- standard laptop
- narrow desktop/tablet landscape
- a deliberate mobile fallback only if the product promises responsive mobile use

Specify:

- fixed, fluid, and min/max regions
- sidebar collapse and panel priority
- table/list adaptation
- overflow and long-content behavior
- stable scrollbar space when layout animation is used
- pointer, keyboard, and coarse-touch differences

Do not shrink a desktop layout uniformly. Recompose around task priority.

## 7. Motion Integration

Read `motion-system.md` when motion is more than basic feedback.

Default technology selection:

- CSS transitions/animations for simple local state feedback
- Motion for React for enter/exit, layout, shared layout, gestures, and interruptible springs
- GSAP for authored timelines, complex scroll choreography, or imperative sequencing
- native View Transition API for route/view continuity when browser support and graceful fallback fit
- Three.js or React Three Fiber only when 3D is central to the product concept

Use one primary orchestration system per interaction surface. Avoid competing libraries controlling the same property or element.

## 8. Web Quality Baseline

### Interaction and accessibility

- semantic elements before ARIA
- visible `:focus-visible` treatment
- keyboard-complete menus, dialogs, lists, grids, and drag alternatives
- labels, validation, and first-error focus for forms
- `aria-live` for meaningful asynchronous updates
- no disabled zoom or blocked paste
- reduced-motion behavior that preserves meaning

### Content and layout

- reserve media dimensions
- handle long and missing content
- use `min-width: 0` where flex/grid text must truncate
- avoid `transition: all`
- keep overlays within viewport and contain overscroll
- use safe-area insets for full-bleed responsive surfaces

### Performance

- start independent requests together; avoid serial waterfalls
- lazy-load heavy routes, editors, charts, 3D, and optional effects
- import heavy libraries through analyzable paths
- virtualize large collections
- avoid DOM layout reads during render and interleaved read/write loops
- animate compositor-friendly properties by default
- pause hidden ambient motion and media
- verify Core Web Vitals where the app is production-bound

## 9. Required Web QA

Verify:

- direct load and refresh on every critical route
- browser back/forward and deep-linked state
- keyboard-only completion of primary journeys
- mouse, trackpad, and coarse-pointer interaction
- long lists, slow data, empty data, errors, and stale refresh
- unsaved work and destructive actions
- responsive layouts and zoom/text enlargement
- reduced motion and theme modes
- bundle/build success plus rendered interaction performance

For a production app, a screenshot of the showcase route is not sufficient evidence.
