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
    - src/hooks/useKeyboardInput.ts

key-decisions:
  - "Unified onModeSelect callback (single handler) over split onModeChange + onAppModeChange for cleaner API"
  - "appMode state lives in App.tsx — Calculator.tsx is a pure display component forwarding to ModeToggle"
  - "Graph mode auto-switches expressionMode to 'expression' — expression mode is natural companion to graphing"
  - "Graph mode auto-pre-fills graphExpression from current expression for immediate visual feedback"
  - "calculator--graph-mode CSS class scoping — no existing calc-mode CSS changed"
  - "setGraphVisible(false) on mode exit — graph resets rather than persisting in old position"
  - "Live expression-to-graph sync via useEffect — typing in graph mode updates graph in real-time, no Plot button needed"

patterns-established:
  - "isGraphMode flag in Calculator.tsx — all conditional rendering gates on this single boolean"
  - "Graph mode hides: SCI toggle, panels, graph-controls, history — graph IS the primary content"
  - "calculator__graph-main wrapper div with flex:1 — allows graph canvas to fill available space"

# Metrics
duration: 8min
completed: 2026-02-23
---

# Phase 8 Plan 1: Mode Toggle and Conditional Layout Summary

**Three-option mode toggle (Simple | Expression | Graph) with graph-fills-main-area layout, live expression-to-graph sync, and correct graph-hide-on-mode-exit behavior**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-02-23T15:21:20Z
- **Completed:** 2026-02-23T15:46:00Z
- **Tasks:** 3 of 3 complete
- **Files modified:** 5

## Accomplishments
- ModeToggle extended from two-option to three-option toggle with new unified `onModeSelect` API
- App.tsx manages `appMode` state and unified handler — switching to graph auto-sets expression mode and pre-fills graph expression
- Calculator.tsx conditionally renders all panels based on `appMode` using single `isGraphMode` flag
- Calculator.css adds `.calculator--graph-mode` and `.calculator__graph-main` scoped styles — no existing CSS changed
- Switching back to calc mode now correctly hides the graph panel (graphVisible reset to false)
- Typing in graph mode updates the graph in real-time via useEffect expression sync

## Task Commits

Each task was committed atomically:

1. **Task 1: Add app-level mode state and extend mode toggle** - `e097bf4` (feat)
2. **Task 2: Implement conditional layout for calculator vs graph mode** - `a4b3b1b` (feat)
3. **Task 3: Fix graph mode UX issues (post-checkpoint fixes)** - `7e65c0c` (fix)

## Files Created/Modified
- `src/components/ModeToggle.tsx` - New three-option toggle with `expressionMode`, `appMode`, `onModeSelect` props
- `src/App.tsx` - Added `appMode` state, `handleModeSelect` unified callback, `setGraphVisible(false)` on exit, `useEffect` for live expression sync
- `src/components/Calculator.tsx` - Accepts `appMode` and `onModeSelect`; conditional rendering for graph mode
- `src/styles/Calculator.css` - Added `.calculator--graph-mode`, `.calculator__graph-main`, responsive breakpoints
- `src/hooks/useKeyboardInput.ts` - Added `^`, `!`, `%` keyboard shortcuts for scientific operators

## Decisions Made
- Unified `onModeSelect` callback (one handler for all three options) is cleaner than splitting into `onModeChange` + `onAppModeChange`
- `appMode` state lives in App.tsx so Calculator.tsx stays as a display component that forwards callbacks
- Graph mode automatically switches to expression mode — expression is the natural companion to graphing
- CSS scoped to `.calculator--graph-mode` so existing calc-mode styles are completely untouched
- Live expression sync via `useEffect` — cleaner than requiring a "Plot" button; graph updates as user types in graph mode
- `setGraphVisible(false)` on mode exit — prevents graph from persisting in calc mode at old position

## Deviations from Plan

### Auto-fixed Issues (post-checkpoint, based on user-reported bugs)

**1. [Rule 1 - Bug] Graph panel remained visible when switching back to calc mode**
- **Found during:** Task 3 (human verify checkpoint — user reported)
- **Issue:** `handleModeSelect` in App.tsx didn't call `setGraphVisible(false)` when switching to 'simple' or 'expression', so `graphVisible` stayed `true` and the graph panel rendered at the bottom of calc mode
- **Fix:** Added `setGraphVisible(false)` in the else branch of `handleModeSelect` (line 121 in App.tsx)
- **Files modified:** `src/App.tsx`
- **Verification:** Build passes, logic confirmed correct
- **Committed in:** `7e65c0c`

**2. [Rule 2 - Missing Critical] No way to modify graph expression after entering graph mode**
- **Found during:** Task 3 (human verify checkpoint — user reported)
- **Issue:** `graphExpression` was only set at mode-switch time; typing in the expression display didn't update the graph. User had no way to modify what was being plotted.
- **Fix:** Added `useEffect` in App.tsx: when `appMode === 'graph'` and `expression` changes, calls `setGraphExpression(expression)` immediately. This gives real-time graph updates as user types.
- **Files modified:** `src/App.tsx`
- **Verification:** Build passes, effect correctly scoped to graph mode only
- **Committed in:** `7e65c0c`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical functionality)
**Impact on plan:** Both fixes required for graph mode to be usable. No scope creep — fixes address exactly what the plan intended.

## Issues Encountered

Initial implementation omitted `setGraphVisible(false)` on mode exit and didn't wire expression typing to graph updates. Both identified via user testing at checkpoint and fixed immediately.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Mode toggle and layout switching are complete and verified by user
- Graph mode correctly shows expression input at top, graph filling main area
- Returning to calc mode correctly hides graph
- Live expression-to-graph sync works (user types, graph updates)
- Ready for Phase 9: Expression Input enhancements (extended keyboard, more operators in graph mode)
- Graph interaction improvements (Phase 10) can build on the graph-fills-main-area layout

---
*Phase: 08-layout-integration*
*Completed: 2026-02-23*

## Self-Check: PASSED

- FOUND: src/components/ModeToggle.tsx
- FOUND: src/App.tsx
- FOUND: src/components/Calculator.tsx
- FOUND: src/styles/Calculator.css
- FOUND: src/hooks/useKeyboardInput.ts
- FOUND: .planning/phases/08-layout-integration/08-01-SUMMARY.md
- FOUND commit: e097bf4 (Task 1)
- FOUND commit: a4b3b1b (Task 2)
- FOUND commit: 7e65c0c (Task 3 fixes)
