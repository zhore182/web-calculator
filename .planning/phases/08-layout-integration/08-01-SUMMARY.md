---
phase: 08-layout-integration
plan: 01
subsystem: ui
tags: [react, typescript, css, mode-toggle, graph, layout]

# Dependency graph
requires:
  - phase: 07-visual-design-system
    provides: CSS design tokens used throughout Calculator.css
  - phase: 04-graphing-core
    provides: GraphPanel component being integrated into new layout
provides:
  - Three-option mode toggle (Simple | Expression | Graph) replacing two-option toggle
  - appMode state ('calc' | 'graph') managed in App.tsx
  - Conditional layout: graph mode shows graph filling main area, calc mode unchanged
  - calculator--graph-mode CSS class and layout rules
affects: [09-graph-expression-sync, 10-polish, future graph feature phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Unified onModeSelect callback — single handler for all three mode options
    - appMode + expressionMode dual-state — app-level mode vs expression input mode
    - Conditional JSX rendering with isGraphMode flag
    - CSS class composition with filter(Boolean).join(' ')

key-files:
  created: []
  modified:
    - src/components/ModeToggle.tsx
    - src/App.tsx
    - src/components/Calculator.tsx
    - src/styles/Calculator.css

key-decisions:
  - "Unified onModeSelect callback (single handler) over split onModeChange + onAppModeChange for cleaner API"
  - "appMode state lives in App.tsx — Calculator.tsx is a pure display component forwarding to ModeToggle"
  - "Graph mode auto-switches expressionMode to 'expression' — expression mode is natural companion to graphing"
  - "Graph mode auto-pre-fills graphExpression from current expression for immediate visual feedback"
  - "calculator--graph-mode CSS class scoping — no existing calc-mode CSS changed"

patterns-established:
  - "isGraphMode flag in Calculator.tsx — all conditional rendering gates on this single boolean"
  - "Graph mode hides: SCI toggle, panels, graph-controls, history — graph IS the primary content"
  - "calculator__graph-main wrapper div with flex:1 — allows graph canvas to fill available space"

# Metrics
duration: 8min
completed: 2026-02-23
---

# Phase 8 Plan 1: Mode Toggle and Conditional Layout Summary

**Three-option mode toggle (Simple | Expression | Graph) with conditional layout — graph fills main area replacing button panel, calculator mode unchanged**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-23T15:21:20Z
- **Completed:** 2026-02-23T15:29:00Z
- **Tasks:** 2 of 3 complete (Task 3 is human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- ModeToggle extended from two-option to three-option toggle with new unified `onModeSelect` API
- App.tsx manages `appMode` state and unified handler — switching to graph auto-sets expression mode and pre-fills graph expression
- Calculator.tsx conditionally renders all panels based on `appMode` using single `isGraphMode` flag
- Calculator.css adds `.calculator--graph-mode` and `.calculator__graph-main` scoped styles — no existing CSS changed

## Task Commits

Each task was committed atomically:

1. **Task 1: Add app-level mode state and extend mode toggle** - `e097bf4` (feat)
2. **Task 2: Implement conditional layout for calculator vs graph mode** - `a4b3b1b` (feat)
3. **Task 3: Human verification of mode toggle and layout** - awaiting checkpoint

## Files Created/Modified
- `src/components/ModeToggle.tsx` - New three-option toggle with `expressionMode`, `appMode`, `onModeSelect` props
- `src/App.tsx` - Added `appMode` state, `handleModeSelect` unified callback, new props to Calculator
- `src/components/Calculator.tsx` - Accepts `appMode` and `onModeSelect`; conditional rendering for graph mode
- `src/styles/Calculator.css` - Added `.calculator--graph-mode`, `.calculator__graph-main`, responsive breakpoints

## Decisions Made
- Unified `onModeSelect` callback (one handler for all three options) is cleaner than splitting into `onModeChange` + `onAppModeChange`
- `appMode` state lives in App.tsx so Calculator.tsx stays as a display component that forwards callbacks
- Graph mode automatically switches to expression mode — expression is the natural companion to graphing
- CSS scoped to `.calculator--graph-mode` so existing calc-mode styles are completely untouched

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript check and build passed cleanly on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Mode toggle and layout switching are complete and verified buildable
- Dev server running on http://localhost:5173 for human verification
- After checkpoint approval: graph expression sync (Phase 9) can build on this foundation
- The `graphExpression` state in App.tsx is pre-populated from `expression` when entering graph mode — graph expression sync phase can refine this wiring

---
*Phase: 08-layout-integration*
*Completed: 2026-02-23*

## Self-Check: PASSED

- FOUND: src/components/ModeToggle.tsx
- FOUND: src/App.tsx
- FOUND: src/components/Calculator.tsx
- FOUND: src/styles/Calculator.css
- FOUND: .planning/phases/08-layout-integration/08-01-SUMMARY.md
- FOUND commit: e097bf4 (Task 1)
- FOUND commit: a4b3b1b (Task 2)
