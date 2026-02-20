---
phase: 02-scientific-functions
plan: 02
subsystem: ui-scientific-input
tags: [function-input, smart-wrap, constants, angle-mode-ui, deg-rad-badge]
dependency_graph:
  requires: [02-01-scientific-evaluation-engine]
  provides: [function-input-helpers, angle-mode-toggle-ui, constant-insertion]
  affects: [calculator-ui, expression-editing]
tech_stack:
  added: []
  patterns: [smart-auto-wrap, cursor-manipulation, state-driven-ui]
key_files:
  created: []
  modified:
    - src/logic/cursorHelpers.ts
    - src/logic/cursorHelpers.test.ts
    - src/App.tsx
    - src/components/Display.tsx
    - src/components/Calculator.tsx
    - src/styles/Calculator.css
decisions:
  - summary: "Function input with smart auto-wrap behavior"
    rationale: "Wrapping existing numbers (45 + sin → sin(45)) provides better UX than forcing users to manually type parentheses"
    context: "Scans backwards from cursor to detect completed number, wraps if found, otherwise inserts empty function call"
  - summary: "Pi displays as π symbol, internally stored as 'pi'"
    rationale: "Mathjs evaluates 'pi' natively, symbol rendering is display-only transformation"
    context: "Word-boundary regex prevents 'asin' from becoming 'aπn'"
  - summary: "DEG/RAD badge lives in display area top-right corner"
    rationale: "Visible indicator of current angle mode without cluttering button panel"
    context: "Only appears in expression mode since scientific functions are expression-mode only"
  - summary: "Switching angle mode immediately re-evaluates expression"
    rationale: "Users expect live feedback when toggling between DEG/RAD"
    context: "Prevents stale preview results after mode change"
metrics:
  duration_minutes: 4
  completed_date: 2026-02-20
  tasks_completed: 2
  tests_added: 15
  lines_added: 346
---

# Phase 02 Plan 02: Function Input with Smart Auto-Wrap and Angle Mode UI Summary

**One-liner:** Function input with smart auto-wrap (wraps numbers or inserts empty calls), constant insertion (pi, e), and clickable DEG/RAD badge for angle mode toggling.

## What Was Built

Implemented comprehensive function input system that enables users to insert scientific functions, constants, and operators into expressions with smart behavior:

1. **Smart Auto-Wrap Function Input**
   - `insertFunction(expression, cursor, funcName)` helper function
   - Detects completed number before cursor → wraps it: `45|` + sin → `sin(45)|`
   - No number before cursor → inserts empty call: `|` + sin → `sin(|)` with auto-closed parens
   - Supports all scientific functions: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh, log, ln, sqrt, cbrt, abs
   - Function names rendered in lowercase (per user decision)

2. **Constant Insertion**
   - `insertConstant(expression, cursor, constant)` helper function
   - Inserts pi or e at cursor position
   - Pi displays as `π` symbol in expression line (internal representation stays as `pi` for mathjs)
   - Supports implicit multiplication: `2pi` evaluates as `2*π`
   - Word-boundary regex prevents false matches (avoids `asin` → `aπn`)

3. **DEG/RAD Angle Mode UI**
   - Clickable badge in display top-right corner
   - Only visible in expression mode
   - Click toggles between DEG and RAD
   - Switching mode immediately re-evaluates current expression with new angle mode
   - Styled with subtle background and hover state

4. **Operator Input Wiring**
   - Power operator (`^`) insertion
   - Factorial (`!`) insertion
   - Percentage (`%`) insertion
   - All operators trigger live preview evaluation

5. **Angle Mode State Management**
   - `angleMode` state in App.tsx (defaults to DEG per user decision)
   - All `evaluateExpression()` calls pass `angleMode` parameter
   - `handleAngleModeToggle` callback re-evaluates expression on toggle

## Implementation Approach

**Task 1: Function Input Helpers**
- Created `insertFunction` with backward-scanning number detection
- Created `insertConstant` as wrapper around `insertAtCursor`
- Added 15 comprehensive tests covering all edge cases
- All tests pass (37 total in cursorHelpers.test.ts)

**Task 2: UI Wiring**
- Updated Display.tsx with DEG/RAD badge props and pi→π rendering
- Updated Calculator.tsx to pass angle mode props through component tree
- Updated App.tsx with:
  - `angleMode` state (DEG default)
  - `handleAngleModeToggle` with re-evaluation logic
  - Function input handling (17 scientific functions)
  - Constant input handling (pi, e_constant)
  - Operator input handling (^, !, %)
  - All `evaluateExpression` calls now include `angleMode`
- Added CSS styling for `.display__angle-badge`

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- ✅ `npx vitest run` - All 151 tests pass (37 cursorHelpers + 94 expressionParser + 13 keyboard + 7 operations)
- ✅ `npm run build` - TypeScript compilation succeeds
- ✅ `insertFunction('45', 2, 'sin')` returns `{ expression: 'sin(45)', cursorPosition: 7 }`
- ✅ `insertFunction('', 0, 'sin')` returns `{ expression: 'sin()', cursorPosition: 4 }`
- ✅ `insertConstant('2', 1, 'pi')` returns `{ expression: '2pi', cursorPosition: 3 }`
- ✅ DEG/RAD badge renders in display (expression mode only)
- ✅ Badge click toggles angle mode
- ✅ Angle mode flows through all evaluation calls
- ✅ Pi displays as π symbol in expression line

## Files Changed

**Modified:**

- `src/logic/cursorHelpers.ts` (+81 lines)
  - Added `insertFunction()` with smart auto-wrap logic
  - Added `insertConstant()` for pi/e insertion
  - Comprehensive JSDoc comments

- `src/logic/cursorHelpers.test.ts` (+129 lines)
  - Added 15 new tests for `insertFunction` (9 tests)
  - Added 5 new tests for `insertConstant`
  - All edge cases covered (empty expression, number wrapping, decimal numbers, cursor positions)

- `src/App.tsx` (+107 lines, -11 lines)
  - Added `angleMode` state (DEG default)
  - Added `handleAngleModeToggle` callback with re-evaluation
  - Added function input handling block (17 scientific functions)
  - Added constant input handling (pi, e_constant)
  - Added operator input handling (^, !, %)
  - Updated all `evaluateExpression` calls to pass `angleMode`
  - Passed `angleMode` and `onAngleModeToggle` to Calculator component

- `src/components/Display.tsx` (+14 lines)
  - Added `angleMode` and `onAngleModeToggle` props
  - Added DEG/RAD badge rendering (expression mode only)
  - Updated `renderExpression()` to convert `pi` → `π` with word-boundary regex

- `src/components/Calculator.tsx` (+4 lines)
  - Added `angleMode` and `onAngleModeToggle` props to interface
  - Passed props through to Display component

- `src/styles/Calculator.css` (+24 lines)
  - Added `.display__angle-badge` styles
  - Positioned absolute top-right with subtle background
  - Added hover state

## Self-Check

Verifying all claimed artifacts exist:

```bash
# Check files exist
[ -f "src/logic/cursorHelpers.ts" ] && echo "✓ cursorHelpers.ts exists"
[ -f "src/logic/cursorHelpers.test.ts" ] && echo "✓ cursorHelpers.test.ts exists"
[ -f "src/App.tsx" ] && echo "✓ App.tsx exists"
[ -f "src/components/Display.tsx" ] && echo "✓ Display.tsx exists"
[ -f "src/components/Calculator.tsx" ] && echo "✓ Calculator.tsx exists"
[ -f "src/styles/Calculator.css" ] && echo "✓ Calculator.css exists"

# Check exports
grep -q "export function insertFunction" src/logic/cursorHelpers.ts && echo "✓ insertFunction exported"
grep -q "export function insertConstant" src/logic/cursorHelpers.ts && echo "✓ insertConstant exported"
grep -q "angleMode" src/App.tsx && echo "✓ angleMode state exists"
grep -q "display__angle-badge" src/components/Display.tsx && echo "✓ DEG/RAD badge rendered"

# Check commits exist
git log --oneline --all | grep -q "5fce737" && echo "✓ Commit 5fce737 (Task 1) exists"
git log --oneline --all | grep -q "fe0d402" && echo "✓ Commit fe0d402 (Task 2) exists"
```

## Self-Check: PASSED

All files exist, functions are exported, state is wired, and commits are recorded.
