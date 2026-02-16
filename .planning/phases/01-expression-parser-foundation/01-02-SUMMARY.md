---
phase: 01-expression-parser-foundation
plan: 02
subsystem: ui-foundation
tags: [ui, expression-mode, state-management, display]

dependency_graph:
  requires:
    - evaluateExpression (from 01-01)
    - ExpressionResult (from 01-01)
    - ExpressionMode (from 01-01)
  provides:
    - ModeToggle component (Simple/Expression mode switcher)
    - Split two-line Display (expression top, result bottom)
    - Expression state management in App.tsx
    - Live preview evaluation in expression mode
  affects:
    - Future cursor management and advanced input (Phase 1 Plan 3)
    - Scientific functions UI (Phase 2)

tech_stack:
  patterns:
    - Two-line display layout: Expression on top, result on bottom
    - State preservation: Display value preserved when switching modes
    - Live preview: Real-time evaluation shows results as user types
    - Symbol rendering: Display converts * → × and / → ÷ for better UX
    - Mode-specific input handling: Separate logic paths for simple vs expression modes

key_files:
  created:
    - src/components/ModeToggle.tsx: "Segmented control for Simple/Expression mode toggle (28 lines)"
  modified:
    - src/components/Display.tsx: "Updated for split two-line layout with expression rendering (39 lines)"
    - src/components/Calculator.tsx: "Wired expression state props and ModeToggle (61 lines)"
    - src/App.tsx: "Added expression state management and mode-specific input handling (231 lines)"
    - src/styles/Calculator.css: "Added mode toggle and split display styles with responsive breakpoints (334 lines)"

decisions:
  - decision: "Preserve display value when switching modes"
    rationale: "User's current work shouldn't disappear when switching between Simple and Expression modes"
    impact: "Better UX - users can switch modes freely without losing context"
  - decision: "Live preview only shows when expression evaluates successfully"
    rationale: "Showing partial errors or incomplete results would be confusing - only show preview when expression is valid and complete"
    alternatives: "Always show preview (cluttered), show error messages (noisy)"
  - decision: "Math symbols (× ÷) displayed instead of raw operators (* /)"
    rationale: "Cleaner visual presentation matches traditional calculator displays"
    implementation: "renderExpression() helper converts on display only - internal state uses raw operators"
  - decision: "Expression mode uses separate input handling path"
    rationale: "Expression mode needs cursor management and different evaluation logic than simple mode"
    impact: "Clear separation of concerns, no risk of simple mode regression"

metrics:
  duration_minutes: 3
  completed_date: "2026-02-16"
  files_created: 1
  files_modified: 4
  lines_added: 308
  commits: 2
---

# Phase 01 Plan 02: Split Display and Mode Toggle Summary

**One-liner:** Two-line calculator display with expression/result split, Simple/Expression mode toggle, live preview evaluation, and math symbol rendering.

## What Was Built

Created the visual foundation and state architecture for expression mode:

1. **ModeToggle component**: Segmented control UI for switching between Simple and Expression modes
   - Accessible design with ARIA roles (radiogroup/radio)
   - Active state highlighting
   - Compact, responsive layout

2. **Split two-line Display**: Expression on top, result on bottom
   - Expression line: smaller font, gray text, horizontal scroll
   - Result line: large font, main display area
   - Math symbol rendering: `*` → `×`, `/` → `÷`
   - Conditional visibility: expression line only shows when in expression mode with content

3. **Expression state management in App.tsx**:
   - `expressionMode`: 'simple' | 'expression'
   - `expression`: The expression string being built
   - `cursorPosition`: Cursor location for future cursor rendering (Plan 03)
   - `previewResult`: Live evaluation result

4. **Mode-specific input handling**:
   - **Expression mode**: Builds expression string, evaluates in real-time, shows preview
   - **Simple mode**: Unchanged behavior (left-to-right evaluation) - no regressions
   - Mode switching preserves current display value

5. **Live preview evaluation**: Real-time PEMDAS evaluation as user types
   - Uses `evaluateExpression()` from Plan 01
   - Preview only shows when expression is complete and valid
   - Errors handled gracefully (no noisy error messages)

## Implementation Details

### ModeToggle Component

```typescript
export interface ModeToggleProps {
  mode: 'simple' | 'expression';
  onModeChange: (mode: 'simple' | 'expression') => void;
}
```

- Renders as segmented control with two buttons
- Uses CSS classes: `.mode-toggle`, `.mode-toggle__option`, `.mode-toggle__option--active`
- Accessible: `role="radiogroup"` and `role="radio"` with `aria-checked`

### Display Component

```typescript
export interface DisplayProps {
  value: string;           // Result line (bottom)
  hasMemory: boolean;
  expression?: string;     // Expression line (top)
  expressionMode?: boolean;
  cursorPosition?: number; // For Plan 03
}
```

**Helper function:**
```typescript
function renderExpression(expr: string): string {
  return expr
    .replace(/\*/g, '×')  // Multiply sign (U+00D7)
    .replace(/\//g, '÷'); // Division sign (U+00F7)
}
```

**Layout:**
- Top line (`.display__expression`): Shows rendered expression with horizontal scroll
- Bottom line (`.display__result`): Shows current value/result
- Memory indicator: Preserved in top-left corner

### App.tsx State Management

**New state variables:**
```typescript
const [expressionMode, setExpressionMode] = useState<ExpressionMode>('simple');
const [expression, setExpression] = useState('');
const [cursorPosition, setCursorPosition] = useState(0);
const [previewResult, setPreviewResult] = useState('');
```

**Mode change handler:**
- Switching TO expression mode: expression starts empty, display value preserved as preview result
- Switching FROM expression mode: current result becomes display value, expression state cleared

**Expression mode input handling:**
- Digits, operators, decimal, parentheses: Append to expression at cursor position
- After each input: Evaluate expression and update preview if successful
- Equals: Evaluate, create history entry, set result as display value, clear expression
- Clear: Clear all expression state

**Simple mode:**
- Completely unchanged behavior - uses existing input handlers
- No regressions in left-to-right evaluation

### CSS Styling

**Mode toggle:**
- Compact rounded container with subtle background
- Active segment highlighted with lighter background
- Responsive scaling on mobile breakpoints

**Split display:**
- Display uses flexbox column layout with `justify-content: flex-end`
- Expression line: `font-size: 1rem`, `color: #aaa`, horizontal scroll (scrollbar hidden)
- Result line: `font-size: 2.5rem`, `color: #1a1a1a`
- Responsive: expression line font scales down to 0.85rem on phones, 0.75rem on narrow phones

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed unused TypeScript parameter warning**
- **Found during:** Build verification after Task 1
- **Issue:** `cursorPosition` parameter declared in DisplayProps but never used in function body (TypeScript error TS6133)
- **Fix:** Removed `cursorPosition` from function parameters since it's only needed for Plan 03 (cursor rendering). The prop definition remains in DisplayProps interface for future use.
- **Files modified:** `src/components/Display.tsx`
- **Commit:** d6347a5 (fixed before final commit)
- **Impact:** Build passes cleanly, no type errors

## Verification Results

All success criteria met:

✓ **Mode toggle renders** above display with "Simple" and "Expression" options
✓ **Default mode is "Simple"** on page load
✓ **Switching to "Expression" mode** shows split display layout
✓ **Typing in expression mode** builds expression string visible on top line
  - Example: Typing "2", "+", "3", "*", "4" shows "2+3×4" on top line, "14" on bottom
✓ **Math symbols render** correctly (× for multiply, ÷ for division)
✓ **Pressing = in expression mode** evaluates with PEMDAS
  - "2+3*4" evaluates to "14" (not "20")
  - "(2+3)*4" evaluates to "20"
✓ **Simple mode behavior unchanged** - no visual or functional regression
✓ **Build passes** with no TypeScript errors
✓ **All 44 tests pass** (no regressions)

### Manual Testing Scenarios

**Expression mode:**
1. Switch to Expression mode → Expression line appears
2. Type "2+3*4" → Shows "2+3×4" on top, "14" on bottom (live preview)
3. Press "=" → Result "14" shown, expression cleared, history entry created
4. Type "2**3" (invalid) → No preview shown (error handling)

**Mode switching:**
1. In Simple mode with "42" displayed
2. Switch to Expression mode → "42" preserved as display value
3. Switch back to Simple mode → "42" still displayed

**Simple mode regression test:**
1. Type "2", "+", "3", "=" → Result "5" (left-to-right evaluation)
2. Type "4", "*", "5", "=" → Result "20"
3. Memory, history, keyboard input all work as before

## Next Steps

This plan establishes the visual and state foundation for expression mode. Plan 03 will add:
1. Cursor rendering and positioning in expression display
2. Arrow key navigation for cursor movement
3. Backspace/Delete for editing expressions
4. Advanced input handling (insert at cursor, select all, etc.)

The expression evaluation engine is complete and working. The UI now supports both simple and expression modes. Ready for advanced input handling in Plan 03.

## Files Changed

**Created:**
- `/Users/angel-ai/angelProjects/web-calculator/src/components/ModeToggle.tsx` (28 lines)

**Modified:**
- `/Users/angel-ai/angelProjects/web-calculator/src/components/Display.tsx` (39 lines, +25 from original 14)
- `/Users/angel-ai/angelProjects/web-calculator/src/components/Calculator.tsx` (61 lines, +26 from original 35)
- `/Users/angel-ai/angelProjects/web-calculator/src/App.tsx` (231 lines, +89 from original 142)
- `/Users/angel-ai/angelProjects/web-calculator/src/styles/Calculator.css` (334 lines, +62 from original 272)

## Commits

| Task | Type | Hash    | Message                                              |
| ---- | ---- | ------- | ---------------------------------------------------- |
| 1    | feat | d6347a5 | add ModeToggle component and split display layout    |
| 2    | feat | d042a5d | wire expression state and mode toggle into App       |

## Self-Check: PASSED

**Files created verification:**
```bash
✓ FOUND: src/components/ModeToggle.tsx
```

**Files modified verification:**
```bash
✓ FOUND: src/components/Display.tsx (updated for split layout)
✓ FOUND: src/components/Calculator.tsx (wired expression props)
✓ FOUND: src/App.tsx (expression state management)
✓ FOUND: src/styles/Calculator.css (mode toggle and split display styles)
```

**Commits verification:**
```bash
✓ FOUND: d6347a5 (feat(01-02): add ModeToggle component and split display layout)
✓ FOUND: d042a5d (feat(01-02): wire expression state and mode toggle into App)
```

**Build verification:**
```bash
✓ npm run build: PASSED (no TypeScript errors)
✓ npm test -- --run: PASSED (44/44 tests passing)
```

**Functional verification:**
- ✓ Mode toggle visible and functional
- ✓ Expression mode shows two-line display
- ✓ Math symbols render correctly (× ÷)
- ✓ Live preview evaluation works
- ✓ Simple mode unchanged (no regressions)
- ✓ Mode switching preserves display value

All verification checks passed. Plan 01-02 complete and ready for Plan 01-03 (cursor management and advanced input).
