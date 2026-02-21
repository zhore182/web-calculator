---
phase: 05-graphing-interactions
plan: 01
subsystem: graph-ui
tags: [ui, interaction, zoom, pan, touch]
dependency_graph:
  requires:
    - 04-01 (graph rendering engine)
    - 04-02 (graph UI integration)
  provides:
    - Dynamic viewport state management
    - Mouse wheel zoom centered on cursor
    - Click-drag pan with touch support
    - Zoom control buttons (+/-/Reset)
  affects:
    - GraphPanel: Added interaction event handlers
    - graphRenderer: Added viewport manipulation helpers
tech_stack:
  added:
    - React event handlers (onWheel, onMouse*, onTouch*)
    - useRef for drag state and config caching
    - useState for cursor state
  patterns:
    - Pure viewport manipulation functions (zoomViewport, panViewport, clampViewport)
    - Event handler refs to avoid stale closures
    - Pixel-to-math coordinate conversion for mouse position
key_files:
  created: []
  modified:
    - src/logic/graphRenderer.ts
    - src/logic/graphRenderer.test.ts
    - src/App.tsx
    - src/components/Calculator.tsx
    - src/components/GraphPanel.tsx
    - src/styles/Calculator.css
decisions:
  - Zoom preserves cursor position (not zoom-to-center) — Better UX for exploring graph regions
  - Viewport bounds clamped to 0.01-10000 range — Prevents degenerate or excessive zoom levels
  - Touch events use same pan logic as mouse drag — Consistent mobile/desktop behavior
  - Zoom controls overlay in top-right corner — Non-intrusive, always accessible
  - Grab/grabbing cursor states — Visual feedback for drag capability
metrics:
  tasks_completed: 2
  duration_minutes: 5.5
  completed_date: 2026-02-21
---

# Phase 05 Plan 01: Graph Zoom and Pan Interactions Summary

**One-liner:** Interactive graph navigation with mouse wheel zoom, click-drag pan, touch support, and overlay zoom controls.

## What Was Built

Added full zoom and pan interactivity to the graph panel, enabling users to explore different regions and scales of plotted functions. Users can now zoom in to examine function details (roots, extrema) and pan to view regions beyond the default -10 to 10 viewport.

### Task 1: Dynamic Viewport State and Zoom/Pan Logic

**Core additions to `src/logic/graphRenderer.ts`:**
- `DEFAULT_VIEWPORT` constant: `{ xMin: -10, xMax: 10, yMin: -10, yMax: 10 }`
- `ViewportBounds` type: `{ xMin, xMax, yMin, yMax }`
- `clampViewport(bounds)`: Prevents degenerate ranges (<0.01) and excessive zoom (>10000)
- `zoomViewport(config, factor, centerX, centerY)`: Zooms in/out while preserving the specified point's position in the viewport. Factor <1 = zoom in, >1 = zoom out.
- `panViewport(config, dxPixels, dyPixels)`: Converts pixel delta to math delta and shifts viewport accordingly. Positive dx = drag right = shift left.

**Test coverage:** 8 new tests covering zoom at origin, zoom off-origin with position preservation, pan in both axes, and clamp behavior.

**State management in `src/App.tsx`:**
- Added `graphViewport` state initialized to `DEFAULT_VIEWPORT`
- Added `handleGraphViewportChange` callback
- Viewport resets to default when graph is cleared
- Props passed through Calculator → GraphPanel

**Commit:** `fbf184e` — "feat(05-01): add dynamic viewport state and zoom/pan logic"

### Task 2: Wire Zoom/Pan Interactions and UI Controls

**Event handlers in `src/components/GraphPanel.tsx`:**

1. **Mouse wheel zoom:**
   - `onWheel` handler converts mouse position to math coordinates
   - Calls `zoomViewport()` with factor 1.2 (scroll down = zoom out) or 0.8 (scroll up = zoom in)
   - Zoom centered on cursor position — point under cursor stays under cursor

2. **Click-drag pan:**
   - `onMouseDown` → start drag, record initial position
   - `onMouseMove` → calculate pixel delta, call `panViewport()`, update last position
   - `onMouseUp` / `onMouseLeave` → end drag
   - Canvas cursor changes from `grab` to `grabbing` during drag

3. **Touch support:**
   - `onTouchStart`, `onTouchMove`, `onTouchEnd` mirror mouse drag behavior
   - Uses `e.touches[0]` for single-finger pan
   - Prevents default to avoid page scroll during graph pan

4. **Zoom control buttons:**
   - "+" button: `zoomViewport(config, 0.7, centerX, centerY)` — zoom in centered on viewport midpoint
   - "−" button: `zoomViewport(config, 1.4, centerX, centerY)` — zoom out centered on viewport midpoint
   - "⟲" button: Reset to `DEFAULT_VIEWPORT`
   - Styled as semi-transparent overlay in top-right corner

**Styling in `src/styles/Calculator.css`:**
- `.graph-panel__controls`: Absolute positioned overlay with `rgba(30,30,30,0.7)` background
- `.graph-panel__control-btn`: 24x24px buttons with hover/active states
- `.graph-panel__canvas`: `cursor: grab`, `.graph-panel__canvas--dragging`: `cursor: grabbing`
- Responsive adjustments for tablet/mobile (smaller buttons, adjusted positioning)

**Implementation details:**
- `configRef` stores current GraphConfig for event handlers (avoids stale closures)
- `dragStateRef` tracks drag state without triggering re-renders
- `isDragging` state controls cursor className

**Commit:** `c529cf0` — "feat(05-01): add zoom/pan interactions and UI controls"

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

1. **Tests:** All 172 tests pass (including 8 new viewport manipulation tests)
2. **Build:** Clean TypeScript compilation, no errors
3. **Manual verification (pending):**
   - Mouse wheel zoom on `sin(x)` — should show more detail when zoomed in
   - Click-drag pan on `x^2` to x=20 region — should move viewport
   - Reset button returns to -10..10
   - +/- buttons zoom in/out
   - Touch drag on mobile viewport simulation

## Next Steps

Per plan dependencies, Phase 05 Plan 02 can now proceed (likely graph axis auto-scaling or function tracing).

## Self-Check: PASSED

**Files created:** None (all modifications)

**Files modified — verified:**
- src/logic/graphRenderer.ts — FOUND
- src/logic/graphRenderer.test.ts — FOUND
- src/App.tsx — FOUND
- src/components/Calculator.tsx — FOUND
- src/components/GraphPanel.tsx — FOUND
- src/styles/Calculator.css — FOUND

**Commits — verified:**
- fbf184e — FOUND: "feat(05-01): add dynamic viewport state and zoom/pan logic"
- c529cf0 — FOUND: "feat(05-01): add zoom/pan interactions and UI controls"

All claims verified.
