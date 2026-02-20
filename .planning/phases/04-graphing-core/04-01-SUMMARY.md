---
phase: 04-graphing-core
plan: 01
subsystem: graphing
tags: [canvas, rendering, graphing, react, coordinate-transforms]
dependency_graph:
  requires: [expressionParser, mathjs]
  provides: [graphRenderer, GraphPanel]
  affects: []
tech_stack:
  added: [Canvas API, device pixel ratio scaling]
  patterns: [pure rendering functions, ref-based canvas rendering]
key_files:
  created:
    - src/logic/graphRenderer.ts
    - src/logic/graphRenderer.test.ts
    - src/components/GraphPanel.tsx
  modified:
    - src/styles/Calculator.css
decisions:
  - decision: "Separate pure rendering logic from React component"
    rationale: "Makes coordinate transforms and sampling testable without React coupling"
    alternatives: ["Single component with rendering logic", "Hook-based approach"]
  - decision: "Sample count = canvas width (1 sample per pixel column)"
    rationale: "Produces smooth curves without oversample cost"
    alternatives: ["Fixed sample count", "Adaptive sampling based on function complexity"]
  - decision: "Render null when not visible instead of hiding with CSS"
    rationale: "Avoids unnecessary canvas rendering and memory allocation"
    alternatives: ["display:none CSS", "opacity:0 with rendering"]
  - decision: "Hardcoded viewport bounds (-10 to 10) for Phase 4"
    rationale: "Zoom and pan functionality deferred to Phase 5"
    alternatives: ["Immediate zoom implementation", "Auto-scale based on function"]
metrics:
  duration: 230
  completed_date: "2026-02-20"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
  tests_added: 12
  commits: 2
---

# Phase 04 Plan 01: Graph Rendering Engine Summary

Canvas-based graph rendering engine with coordinate transforms, axes, grid, labels, and function curve plotting, plus React component wrapper.

## Tasks Completed

### Task 1: Create graph rendering engine with axes, grid, and curve plotting
**Commit:** 50474fa

Created `graphRenderer.ts` with pure rendering functions:

**Core exports:**
- `GraphConfig` interface - Configuration for canvas dimensions and viewport bounds
- `renderGraph()` - Main orchestration function
- Coordinate transforms: `mathToPixelX/Y`, `pixelToMathX/Y` (bidirectional mapping)

**Rendering functions:**
- `renderAxes()` - Draws x-axis and y-axis at y=0 and x=0 positions (shifted if origin off-screen)
- `renderGrid()` - Adaptive grid lines with tick spacing (step=1, 5, or 10 based on range)
- `renderTickLabels()` - Numeric labels at tick marks, skipping origin to avoid overlap
- `sampleFunction()` - Evaluates expression at N evenly-spaced x-values across viewport
- `renderCurve()` - Draws sampled points as connected path, handling discontinuities (null y-values)

**Implementation details:**
- Uses mathjs `evaluate()` with custom scope for angle mode (DEG overrides trig functions)
- Log aliasing via scope: `log()` = base 10, `ln()` = natural log
- Graceful error handling: evaluation failures → null y-values → gaps in curve
- Curve color: `#4a9eff` (calculator's accent blue), 2px line width

**Testing:**
Created `graphRenderer.test.ts` with 12 unit tests:
- Coordinate transform correctness (math → pixel → math round-trip)
- Function sampling: identity line (y=x), parabola (y=x²), invalid expressions
- Discontinuity handling (1/x at x=0)
- Angle mode respect (sin(90) in DEG vs RAD)
- Log aliasing verification (log(100)=2, ln(e)=1)

All tests pass. No TypeScript errors.

**Files:**
- `src/logic/graphRenderer.ts` (269 lines)
- `src/logic/graphRenderer.test.ts` (180 lines)

---

### Task 2: Create GraphPanel React component with Canvas rendering
**Commit:** 323fc69

Created `GraphPanel.tsx` React component:

**Props:**
- `expression: string` - Function expression to plot
- `angleMode: 'DEG' | 'RAD'` - Trig evaluation mode
- `visible: boolean` - Whether graph panel is shown

**Implementation:**
- Uses `useRef<HTMLCanvasElement>` for canvas reference
- `useEffect` triggers `renderGraph()` when expression, angleMode, or visible changes
- Canvas resolution scaled by `window.devicePixelRatio` for crisp rendering on retina displays
- Hardcoded viewport defaults: xMin=-10, xMax=10, yMin=-10, yMax=10 (Phase 4 scope)
- Returns `null` when not visible (no hidden canvas allocation)

**CSS additions to `Calculator.css`:**
- `.graph-panel` - Container with top border and padding
- `.graph-panel__canvas` - Canvas element with dark background (#1a1a1a), rounded corners

**Responsive sizing:**
- Desktop: 280px wide × 200px tall
- Tablet (481-768px): 180px tall
- Phone (max 480px): 160px tall
- Narrow phone (max 340px): 140px tall

**Files:**
- `src/components/GraphPanel.tsx` (59 lines)
- `src/styles/Calculator.css` (modified, +18 lines)

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Verification

1. `npm test` - All 164 tests pass (12 new graphRenderer tests)
2. `npm run build` - No TypeScript compilation errors
3. GraphPanel component exports correctly
4. graphRenderer.ts exports renderGraph and GraphConfig as specified

---

## Integration Points

**Depends on:**
- `src/logic/expressionParser.ts` - For angle mode scope pattern and log aliasing
- mathjs library - For expression evaluation

**Provides for future plans:**
- `renderGraph(ctx, expression, config)` - Ready for integration into Calculator component
- `GraphPanel` component - Ready to render when expression mode is active
- Coordinate transform functions - Available for future trace/zoom features (Phase 5)

**Next steps (Phase 04 Plan 02):**
- Integrate GraphPanel into Calculator component
- Add graph visibility toggle (only in expression mode)
- Wire up expression and angle mode props from Calculator state

---

## Technical Notes

**Canvas rendering pattern:**
- Set canvas width/height attributes to `displaySize * devicePixelRatio`
- Scale context by `dpr` to map logical pixels to physical pixels
- Use CSS to set display size (width/height style props)

**Discontinuity handling:**
- Division by zero, domain errors (sqrt(-1)), or evaluation errors → null y-value
- `renderCurve()` lifts pen at null points, creating visual gaps
- Also skips points far outside visible bounds (y < -100 or y > height + 100) to avoid off-canvas rendering

**Adaptive tick spacing:**
- Range ≤ 20: step = 1
- Range 20-100: step = 5
- Range > 100: step = 10

---

## Self-Check: PASSED

**Created files verified:**
```
FOUND: src/logic/graphRenderer.ts
FOUND: src/logic/graphRenderer.test.ts
FOUND: src/components/GraphPanel.tsx
```

**Commits verified:**
```
FOUND: 50474fa (Task 1)
FOUND: 323fc69 (Task 2)
```

All files exist. All commits recorded. Ready for state update.
