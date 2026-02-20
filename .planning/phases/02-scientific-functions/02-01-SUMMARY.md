---
phase: 02-scientific-functions
plan: 01
subsystem: expression-evaluation
tags: [scientific-functions, angle-mode, domain-errors, tdd]
dependency_graph:
  requires: [01-01-expression-parser]
  provides: [scientific-evaluation-engine, angle-mode-support, domain-error-handling]
  affects: [calculator-core]
tech_stack:
  added: []
  patterns: [custom-mathjs-scope, pre-validation, domain-checking]
key_files:
  created: []
  modified:
    - src/logic/expressionParser.ts
    - src/logic/expressionParser.test.ts
decisions:
  - summary: "Use mathjs custom scope for angle mode instead of expression preprocessing"
    rationale: "Cleaner implementation that doesn't require regex manipulation of trig function arguments"
    context: "DEG mode overrides trig functions to convert degrees↔radians at evaluation time"
  - summary: "Pre-validate factorial and sqrt domain constraints before mathjs evaluation"
    rationale: "Provides specific user-friendly error messages instead of generic mathjs errors"
    context: "Regex-based validation detects domain violations (negative sqrt, non-integer factorial) early"
  - summary: "Log aliasing via scope (log=base10, ln=natural)"
    rationale: "Mathjs uses log() for natural log by default, but users expect log=base10"
    context: "Custom scope overrides align with calculator conventions"
metrics:
  duration_minutes: 3
  completed_date: 2026-02-20
  tasks_completed: 1
  tests_added: 70
  lines_added: 575
---

# Phase 02 Plan 01: Scientific Function Evaluation Engine Summary

**One-liner:** Extended expression parser with scientific function evaluation, DEG/RAD angle mode support, and domain-specific error messages using mathjs custom scope.

## What Was Built

Implemented comprehensive scientific function evaluation engine that extends the basic expression parser with:

1. **Angle Mode System (DEG/RAD)**
   - Added `AngleMode` type exported from expressionParser.ts
   - DEG mode: Trig functions accept degrees, inverse trig returns degrees
   - RAD mode: Uses mathjs default radian-based behavior
   - Implemented via custom mathjs scope with function overrides

2. **Scientific Functions**
   - Trigonometric: sin, cos, tan (angle-mode aware)
   - Inverse trig: asin, acos, atan (angle-mode aware)
   - Hyperbolic: sinh, cosh, tanh, asinh, acosh, atanh
   - Logarithms: log (base 10), ln (natural log)
   - Exponentiation: ^ operator
   - Roots: sqrt, cbrt, nthRoot
   - Other: abs, factorial (!), percentage (%)
   - Constants: pi, e (with implicit multiplication support)

3. **Domain Error Handling**
   - `sqrt(-1)` → "Cannot take sqrt of negative number"
   - `1/0` → "Cannot divide by zero"
   - `3.5!` → "Factorial requires non-negative integer"
   - `(-1)!` → "Factorial requires non-negative integer"
   - Pre-validation catches errors before mathjs evaluation

4. **Test Coverage**
   - 94 total tests (70 new scientific function tests)
   - All 11 scientific requirements covered (SCI-01 through SCI-10, MODE-02)
   - Tests organized by requirement with clear labels

## Implementation Approach

**TDD Process:**
- RED: Wrote 70 failing tests covering all scientific requirements
- GREEN: Implemented using mathjs custom scope pattern
- REFACTOR: Extracted helper function to reduce duplication in factorial validation

**Key Technical Decisions:**

1. **Custom Scope Pattern**: Used mathjs `evaluate(expr, scope)` to override functions rather than preprocessing expressions. This is cleaner and more maintainable.

2. **Pre-validation Strategy**: Regex-based validation for factorial and sqrt happens before mathjs evaluation. This provides specific error messages instead of generic "Syntax Error".

3. **Percentage Preprocessing**: Simple regex replacement of `N%` with `(N/100)` before evaluation. Handles both standalone (`50%` → 0.5) and in-expression (`200*50%` → 100) cases.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- ✅ `npx vitest run` - All 94 tests pass (24 existing + 70 new)
- ✅ `npm run build` - TypeScript compilation succeeds
- ✅ `evaluateExpression("sin(90)", "DEG")` returns `{ status: 'success', value: 1, display: '1' }`
- ✅ `evaluateExpression("sqrt(-1)")` returns `{ status: 'error', error: 'Cannot take sqrt of negative number' }`
- ✅ `evaluateExpression("1/0")` returns `{ status: 'error', error: 'Cannot divide by zero' }`
- ✅ All scientific functions (trig, inverse trig, hyperbolic, log, ln, powers, roots, factorial, abs, percentage) evaluate correctly
- ✅ Angle mode properly affects trig/inverse trig functions
- ✅ Domain errors produce specific user-friendly messages

## Files Changed

**Modified:**
- `src/logic/expressionParser.ts` (175 lines added)
  - Added `AngleMode` type export
  - Updated `evaluateExpression()` signature with angleMode parameter
  - Added custom scope creation for angle mode and log aliasing
  - Added `validateFactorials()` helper function
  - Added `checkSqrtDomain()` helper function
  - Added percentage preprocessing
  - Added division-by-zero detection

- `src/logic/expressionParser.test.ts` (400 lines added)
  - Added 70 new test cases organized by requirement (SCI-01 through SCI-10, MODE-02)
  - Added helper function for approximate comparisons
  - Comprehensive coverage of all scientific functions and edge cases

## Self-Check

Verifying all claimed artifacts exist:

```bash
# Check files exist
[ -f "src/logic/expressionParser.ts" ] && echo "✓ expressionParser.ts exists"
[ -f "src/logic/expressionParser.test.ts" ] && echo "✓ expressionParser.test.ts exists"

# Check exports
grep -q "export type AngleMode" src/logic/expressionParser.ts && echo "✓ AngleMode type exported"
grep -q "angleMode: AngleMode" src/logic/expressionParser.ts && echo "✓ evaluateExpression accepts angleMode"

# Check commit exists
git log --oneline --all | grep -q "7b5014f" && echo "✓ Commit 7b5014f exists"
```

## Self-Check: PASSED

All files exist, exports are present, and commit is recorded.
