# Domain Pitfalls: Scientific Calculator & Graphing Web App

**Domain:** Web-based scientific calculator with graphing capabilities
**Researched:** 2026-02-14
**Confidence:** MEDIUM (based on training data and established domain knowledge)

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Expression Parser State Pollution from Legacy Evaluation
**What goes wrong:** Trying to bolt on a proper expression parser (PEMDAS) while keeping the old left-to-right evaluation logic creates dual evaluation paths that conflict. Users type "2+3*4" expecting 14 (PEMDAS), but legacy code paths still execute left-to-right giving 20.

**Why it happens:** Incremental refactoring that leaves old button handlers calling `eval()` methods while new input pathways use the parser. The transition boundary is never clean - some inputs go through old code, some through new code.

**Consequences:**
- Inconsistent results depending on input method (button clicks vs keyboard)
- Test suite must maintain two evaluation models
- User confusion and trust erosion
- Technical debt that requires complete rewrite

**Prevention:**
1. **Complete cutover, not gradual migration** - Replace evaluation engine in single phase
2. Redirect all input sources (buttons, keyboard, paste) to single tokenizer
3. Remove old evaluation code completely, don't leave "fallback paths"
4. Add integration tests that verify PEMDAS for all input methods

**Detection:**
- Different results from UI buttons vs keyboard input for same expression
- Legacy `calculate()` or `eval()` functions still present after parser implementation
- Conditionals checking input source before evaluation

**Phase mapping:** Expression Parser phase - must be all-or-nothing replacement

---

### Pitfall 2: Floating-Point Precision Theater (Bandaid Over Bandaid)
**What goes wrong:** Using `toPrecision(12)` fixes display issues but scientific functions expose deeper precision problems. `sin(Math.PI)` shows `1.2246467991473532e-16` instead of `0`. Each new function gets its own precision hack until code is littered with inconsistent rounding logic.

**Why it happens:** Treating floating-point precision as a display problem rather than a numerical computation problem. The existing `toPrecision(12)` bandaid shows this mindset is already present.

**Consequences:**
- Different rounding/precision logic in calculator core vs scientific functions vs graphing
- Graphs show artifacts at axis crossings (sin(π) doesn't touch x-axis)
- Compound operations accumulate errors unpredictably
- "Equal" comparisons fail mysteriously
- Each bug fix adds another magic number

**Prevention:**
1. **Single precision strategy upfront** - Define epsilon for zero-comparisons (e.g., `Math.abs(x) < 1e-10`)
2. Use a number formatting utility for ALL output, not scattered `toPrecision` calls
3. For graphing: snap to exact values at known special points (0, π, π/2, etc.)
4. Document acceptable error bounds for each function class
5. Consider using `decimal.js` or `big.js` if precision requirements are strict

**Detection:**
- Multiple different precision values scattered in code (`.toFixed(10)`, `toPrecision(12)`, `Math.round(x * 1e10) / 1e10`)
- Conditional precision based on operation type
- Graph rendering shows non-zero values at expected zeros
- Tests with hardcoded "close enough" comparisons

**Phase mapping:**
- Scientific Functions phase: Establish precision strategy before implementing functions
- Graphing phase: Special-point snapping logic

---

### Pitfall 3: Degree/Radian Mode as UI State Instead of Computation Context
**What goes wrong:** Storing DEG/RAD as component state that doesn't flow through to evaluation. User switches to DEG mode, types `sin(90)`, expects `1`, gets `0.8939966636005579` because the parser/evaluator doesn't know about mode.

**Why it happens:** Separation between UI (React state) and computation logic (pure functions). The mode toggle updates state but evaluation functions are called with raw numbers.

**Consequences:**
- Mode changes don't affect calculations
- Copy/paste of expressions changes meaning in different modes
- History replay gives different results than original execution
- Graphing uses different mode than calculator

**Prevention:**
1. **Mode is evaluation context, not UI state** - Pass mode to all evaluation functions
2. Store mode with each history entry (for correct replay)
3. Mode indicator must be visually prominent and unambiguous
4. Add mode to expression serialization: `{"expr": "sin(90)", "mode": "DEG", "result": 1}`
5. Consider storing expressions as-entered with conversion explicit: `sin(90°)` vs `sin(90 rad)`

**Detection:**
- Mode state in React component but not in evaluator function signatures
- History entries without mode metadata
- No tests verifying mode affects trig function results
- Mode toggle handler only updates UI state

**Phase mapping:** Scientific Functions phase - mode must be part of computation model from day one

---

### Pitfall 4: Expression Parser Without Proper Error Boundaries
**What goes wrong:** Parser throws exceptions on invalid input, crashes app or leaves calculator in broken state. User types `2++3`, gets white screen or calculator stops responding to input.

**Why it happens:**
- Parser libraries often throw on syntax errors
- Treating parsing as infallible operation
- Not distinguishing incomplete input (still typing) from invalid input (syntax error)

**Consequences:**
- React error boundary catches exception, unmounts calculator
- LocalStorage corrupted with invalid state
- Partial expressions in history break replay
- No user feedback about what's wrong

**Prevention:**
1. **Wrap all parser calls in try-catch** - Never let exceptions bubble to React
2. Distinguish three states: valid, invalid, incomplete
3. Show live validation feedback (red highlight for syntax errors)
4. Preserve last valid state if parse fails
5. Never store unparseable expressions in history
6. Add error recovery: partial parse results, suggested corrections

**Detection:**
- Parser calls without try-catch blocks
- No error state in calculator UI component
- Console errors during normal typing
- App crashes when typing invalid expressions

**Phase mapping:** Expression Parser phase - error handling is core requirement, not afterthought

---

### Pitfall 5: Unbounded Graph Rendering Performance Cliff
**What goes wrong:** Naively rendering 1000+ points for graph causes frame drops or browser hang. Works fine for simple functions like `y=x`, becomes unusable for `y=sin(1/x)` which needs dense sampling near x=0.

**Why it happens:**
- Fixed sample count chosen for simple cases
- Every point mutation triggers React re-render
- No consideration for function complexity (continuous vs discontinuous)
- Canvas redraws entire graph on any change

**Consequences:**
- Browser hangs on complex functions
- Mobile devices become unusable
- Zoom/pan operations lag severely
- User assumes app is broken

**Prevention:**
1. **Adaptive sampling** - More points where function changes rapidly, fewer in linear regions
2. Use Web Workers for heavy computation (parsing/evaluation off main thread)
3. Canvas-based rendering with dirty rectangle optimization, not SVG
4. Debounce real-time expression input (don't re-graph on every keystroke)
5. Set maximum computation time budget (e.g., 100ms), show "too complex" if exceeded
6. RequestAnimationFrame for smooth updates
7. Consider library like `function-plot` that handles this

**Detection:**
- Frame rate drops below 30fps during graphing
- Main thread blocked during graph computation
- Fixed `for(let i=0; i<1000; i++)` loops for sampling
- Re-rendering entire graph on zoom/pan instead of transform

**Phase mapping:** Graphing phase - performance must be designed in, not optimized later

---

### Pitfall 6: Scientific Function Domain/Range Not Validated
**What goes wrong:** `sqrt(-1)` returns `NaN`, which then propagates through calculations silently. Or worse, displays `NaN` but allows further operations that produce meaningless results. Logs of negative numbers, division by zero in `tan(90°)` - all produce silent failures.

**Why it happens:**
- JavaScript `Math` functions return `NaN`/`Infinity` instead of throwing
- No validation before calling native functions
- NaN handling not designed into evaluation pipeline

**Consequences:**
- Mysterious `NaN` results with no error message
- Compound expressions: `2 + sqrt(-1)` shows `NaN`, hides which operation failed
- Graphing shows gaps with no indication of domain violations
- Cascading failures: `NaN + 5 = NaN`

**Prevention:**
1. **Validate domain for each function class:**
   - `sqrt(x)`: x >= 0 (unless supporting complex numbers)
   - `log(x)`: x > 0
   - `tan(x)`: x ≠ π/2 + nπ (in radians)
   - `asin(x), acos(x)`: -1 <= x <= 1
2. Return `{ok: false, error: "Domain error: sqrt requires non-negative input"}` instead of throwing
3. Show error in UI with affected operation highlighted
4. For graphing: skip invalid points, don't draw line through gaps
5. Add "Clear Error" to reset to valid state

**Detection:**
- `NaN` or `Infinity` in test outputs without error flags
- No domain validation before `Math.sqrt`, `Math.log`, etc.
- Graph rendering doesn't handle discontinuities
- Error messages just say "Error" without specifics

**Phase mapping:** Scientific Functions phase - validation alongside each function

---

## Moderate Pitfalls

### Pitfall 7: History Explosion Not Addressed When Adding Complex Expressions
**What goes wrong:** Existing unbounded localStorage history becomes critical issue with complex expressions. Scientific calculator users iterate on expressions (tweaking graphs, trying values), filling history with megabytes of similar entries. localStorage quota exceeded, app crashes on startup trying to parse corrupted history.

**Why it happens:** Basic calculator generates small history entries. Scientific expressions with full AST/mode/context metadata are 10-100x larger. Problem scales non-linearly.

**Prevention:**
1. **Cap history before scientific features** - e.g., 50 most recent entries
2. Store expression strings, not full AST (reconstruct on replay)
3. Add "Clear History" and "Clear Old" options
4. Consider IndexedDB for larger storage quota
5. Compress similar consecutive entries ("sin(89)", "sin(90)", "sin(91)" → "sin exploration")
6. Add LRU eviction when quota approached

**Detection:**
- localStorage size keeps growing
- `localStorage.setItem` throws `QuotaExceededError`
- Slow app startup due to history parsing
- No history size limit visible in code

**Phase mapping:** Expression Parser phase - fix before adding complex data

---

### Pitfall 8: Implicit Multiplication Ambiguity
**What goes wrong:** User types `2π` or `5sin(30)` expecting implicit multiplication. Parser either rejects as syntax error or misinterprets as variable names.

**Why it happens:** Math notation convention (implicit multiplication) conflicts with programming syntax. Parsers default to strict syntax requiring explicit `*`.

**Prevention:**
1. **Decide and document:** Support implicit multiplication or don't
2. If supporting: tokenizer must recognize patterns (number before symbol/function)
3. Clear error messages if not supporting: "Did you mean 2*π?"
4. Test edge cases: `2π` vs `2p` (variable), `sin2x` vs `sin(2x)`
5. Be consistent: if `2π` works, `2sin(x)` should work

**Detection:**
- User feedback: "Calculator doesn't understand 2π"
- No tokenizer tests for adjacent number-symbol
- Parser rejects mathematical notation that looks valid

**Phase mapping:** Expression Parser phase - tokenizer design decision

---

### Pitfall 9: Parentheses Balancing Only Checked at Evaluation
**What goes wrong:** User types `sin(90`, doesn't see error until hitting `=`. Wasted effort, poor UX.

**Prevention:**
1. Live parenthesis balance indicator in UI
2. Visual matching: highlight matching pair on hover
3. Auto-close optional but should be toggle-able (some users hate it)
4. Show error state immediately, not on evaluation

**Detection:**
- No live validation in input handler
- Unbalanced parentheses only caught by parser

**Phase mapping:** Expression Parser phase - UI affordances alongside parser

---

### Pitfall 10: Graph Axis Scaling Not Coordinated with Function Range
**What goes wrong:** Default axes show -10 to 10, but user graphs `y=1000x`. Line barely visible as near-vertical streak. Or `y=sin(x)` with x from -100 to 100, oscillations blur into solid band.

**Prevention:**
1. Auto-scale to function output range (sample first, then set bounds)
2. "Fit to data" button for manual resets
3. Preserve aspect ratio option for trig functions (circle should be circular)
4. Default bounds appropriate for common cases (±10 for trig, wider for polynomials)
5. Zoom/pan controls with keyboard shortcuts

**Detection:**
- Hardcoded axis bounds
- No "auto-scale" functionality
- User complaints about invisible graphs

**Phase mapping:** Graphing phase - smart defaults, user controls

---

### Pitfall 11: Constants (π, e) as String Replacements Instead of Tokenized Values
**What goes wrong:** Simple string replacement `"π"` → `"3.14159"` breaks with expressions like `πr²` (becomes `3.14159r²` which is invalid) or loses precision compared to `Math.PI`.

**Prevention:**
1. Tokenize constants as distinct token type
2. Use `Math.PI` and `Math.E` for full precision
3. Handle implicit multiplication around constants
4. Display as symbols (π) but compute with full precision

**Detection:**
- String `.replace("π", "3.14159")` in code
- Precision differences in tests involving π
- Constants break implicit multiplication

**Phase mapping:** Expression Parser phase - token types for constants

---

## Minor Pitfalls

### Pitfall 12: Memory Functions (M+, MR) Ignored in Scientific Context
**What goes wrong:** Users expect to store intermediate results, especially when iterating on expressions. Basic calculator lacks this, becomes painful for scientific use.

**Prevention:**
1. Add memory functions alongside scientific functions
2. Show memory indicator when non-zero
3. Consider multiple memory slots or variable assignments

**Phase mapping:** Scientific Functions phase - UX enhancement

---

### Pitfall 13: Keyboard Shortcuts Incomplete
**What goes wrong:** Mouse-only UX is slow for power users. Copy/paste works but no keyboard shortcuts for functions, mode switching, clearing.

**Prevention:**
1. Map common functions to keys (S for sin, L for log, etc.)
2. Ctrl+D/Ctrl+R for mode toggle
3. Document shortcuts (help overlay)
4. Don't conflict with browser shortcuts

**Phase mapping:** Scientific Functions phase - accessibility

---

### Pitfall 14: Mobile Touch Target Sizes Inadequate for Dense Button Layouts
**What goes wrong:** Scientific calculator has 40+ buttons. On mobile, buttons become tiny and mis-taps are frequent.

**Prevention:**
1. Responsive layout with mode toggles to reduce visible buttons
2. Minimum 44x44px touch targets
3. Consider swipe gestures for function groups
4. Test on actual mobile devices, not just browser DevTools

**Phase mapping:** Scientific Functions phase - mobile UX

---

### Pitfall 15: Graph Doesn't Update When Mode Changes
**What goes wrong:** User graphs `y=sin(x)` in RAD mode, switches to DEG, graph doesn't update. Confusion about what mode graph is in.

**Prevention:**
1. Re-evaluate and re-render graph on mode change
2. Show mode in graph area, not just calculator
3. Consider: store mode with graph, allow viewing multiple graphs in different modes

**Phase mapping:** Graphing phase - mode awareness

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| Expression Parser | State pollution from legacy evaluation (Pitfall 1) | Complete cutover, remove old code |
| Expression Parser | Error handling as afterthought (Pitfall 4) | Design error boundaries upfront |
| Expression Parser | History storage not limited (Pitfall 7) | Cap history before complex expressions |
| Scientific Functions | Precision bandaid pattern continues (Pitfall 2) | Unified precision strategy before implementation |
| Scientific Functions | Mode as UI state (Pitfall 3) | Mode as evaluation context from start |
| Scientific Functions | Domain validation forgotten (Pitfall 6) | Validation alongside each function |
| Graphing | Performance cliff (Pitfall 5) | Adaptive sampling, Web Workers, canvas optimization |
| Graphing | Auto-scaling ignored (Pitfall 10) | Smart defaults and fit-to-data |

---

## Sources

**Confidence note:** This research is based on training data reflecting common implementation patterns and mistakes in calculator and graphing applications. Key insights drawn from:

- Established floating-point precision issues (IEEE 754 well-documented)
- Parser implementation common patterns (PEG, recursive descent, Shunting Yard)
- Canvas rendering performance patterns
- React state management patterns

**Verification recommended for:**
- Specific library capabilities (e.g., function-plot, decimal.js current APIs)
- React 19 specific features that might simplify error boundaries or performance
- Current browser localStorage quota limits (varies by browser)

**HIGH confidence areas:** Floating-point precision, expression parsing error handling, DEG/RAD mode design
**MEDIUM confidence areas:** Specific library recommendations, React 19 patterns
**LOW confidence areas:** Performance benchmarks (hardware-dependent), specific storage quotas
