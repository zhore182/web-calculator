---
phase: 05-graphing-interactions
plan: 02
subsystem: graph-ui
tags: [trace, function-table, coordinate-readout, mouse-interaction]

# Dependency graph
requires:
  - phase: 05-01
    provides: "Dynamic viewport, zoom/pan interactions, coordinate transforms"
provides:
  - "Cursor trace with red dot on curve and x,y coordinate readout"
  - "Toggleable function table showing x/f(x) value pairs"
  - "evaluateAtX and generateTableData pure functions"
affects: [phase-06-ux-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Trace state managed locally in GraphPanel", "Table toggle button with active state indicator"]

key-files:
  created:
    - src/components/FunctionTable.tsx
  modified:
    - src/logic/graphRenderer.ts
    - src/logic/graphRenderer.test.ts
    - src/components/GraphPanel.tsx
    - src/styles/Calculator.css

key-decisions:
  - "Trace evaluates at mouse x-position on every mouse move (not snapping to sample points)"
  - "Function table managed as local state in GraphPanel (no prop drilling needed)"
  - "Table toggle button uses ≡ icon in zoom controls bar"
  - "Table shows 21 rows spanning current viewport xMin..xMax"

patterns-established:
  - "Local component state for UI toggles that don't affect parent (showTable in GraphPanel)"
  - "Coordinate readout as absolute-positioned overlay with pointer-events: none"

# Metrics
duration: 4min
completed: 2026-02-21
tasks_completed: 2
files_modified: 5
commits: 1
---

# Phase 05 Plan 02: Trace and Function Table Summary

**Cursor trace with coordinate readout and toggleable x/f(x) value table for graph inspection**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-21
- **Completed:** 2026-02-21
- **Tasks:** 2 (1 implementation + 1 human-verify checkpoint)
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments
- Cursor trace shows red dot on curve with dashed crosshairs to axes
- Coordinate readout overlay at bottom-left displays x,y to 4 decimal places
- Toggleable function table with 21 rows of x/f(x) pairs for current viewport
- Table auto-updates when viewport changes via zoom/pan
- 9 new tests for evaluateAtX and generateTableData functions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add trace rendering, table data generation, and trace/table UI** - `6e38525` (feat)
2. **Task 2: Verify all Phase 5 graph interactions** - human-verify checkpoint (approved)

## Files Created/Modified

- `src/components/FunctionTable.tsx` - New scrollable table component with x and f(x) columns
- `src/logic/graphRenderer.ts` - Added evaluateAtX, renderTracePoint, generateTableData functions
- `src/logic/graphRenderer.test.ts` - 9 new tests for trace and table functions
- `src/components/GraphPanel.tsx` - Added trace state, mouse move handler, table toggle, coordinate readout
- `src/styles/Calculator.css` - Trace readout overlay, function table styles, table button active state

## Decisions Made

**Trace evaluation:** Evaluates expression at mouse x-position on every mouse move using evaluateAtX, rather than snapping to pre-sampled points. Provides smooth, accurate coordinate display.

**Table state management:** showTable state is local to GraphPanel component. No need to lift state to App.tsx since table visibility is a purely UI concern that doesn't affect other components.

**Table toggle placement:** Added ≡ button to the existing zoom controls overlay bar (next to +/-/Reset). Uses blue accent active state when table is visible.

**Table row count:** 21 rows evenly distributed across viewport xMin..xMax range. Updates automatically when viewport changes through zoom or pan.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Verification

**Checkpoint (Task 2): human-verify**

User tested the complete Phase 5 interaction suite:
1. Zoom via mouse wheel and +/- buttons - working correctly
2. Pan via click-drag - working correctly
3. Reset button returns to -10..10 - working correctly
4. Trace dot follows curve on hover with coordinate readout - working correctly
5. Function table toggles on/off with correct values - working correctly
6. Table updates on zoom/pan - working correctly
7. Combined test with 1/x - working correctly (clarified that "undefined" only appears when x=0 is within viewport range)

**Result:** Approved - all verification steps passed.

## Next Phase Readiness

**Phase 5 Complete:** All Phase 5 success criteria met. Users can:
- Zoom in/out on graphs using mouse wheel or +/- controls
- Pan/drag to navigate different graph regions
- Trace curves to see exact x,y coordinates at any point
- View function tables showing x/y value pairs for the current viewport

**Ready for Phase 6 (UX Polish):** All core calculator and graphing features complete. Next phase can add scientific notation, better error handling, and keyboard shortcuts.

---

## Self-Check: PASSED

**Modified files verified:**
```
FOUND: src/components/FunctionTable.tsx
FOUND: src/logic/graphRenderer.ts
FOUND: src/logic/graphRenderer.test.ts
FOUND: src/components/GraphPanel.tsx
FOUND: src/styles/Calculator.css
```

**Commits verified:**
```
FOUND: 6e38525 (Task 1: feat(05-02): add trace rendering, table data generation, and trace/table UI)
```

All files modified as expected. Task commit recorded. Ready for state update.
