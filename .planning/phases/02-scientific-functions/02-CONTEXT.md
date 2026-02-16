# Phase 2: Scientific Functions - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Add trigonometric, logarithmic, and exponential functions to the existing expression parser, with angle mode (DEG/RAD) support. This phase adds the evaluation capabilities and function input mechanisms — the dedicated scientific button panel UI is Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Function input style
- Both buttons and keyboard entry supported
- Function names display in lowercase: `sin(`, `cos(`, `log(`, etc.
- Smart auto-wrap: if there's a completed number/result, pressing a function button wraps it (e.g., `45` + sin → `sin(45)`); otherwise inserts `sin(` at cursor
- Keyboard typing supports autocomplete popup: after 2-3 characters, show matching function names (sin, sinh, sqrt...) for selection

### Angle mode UX
- DEG/RAD toggle lives in the display area as a small indicator/badge in a corner
- Default angle mode is DEG
- Clicking the indicator toggles between DEG and RAD (no separate toggle control)
- Switching angle mode immediately re-evaluates the current expression/result

### Error messages & edge cases
- Specific error messages for domain errors: "Cannot take sqrt of negative number", "Cannot divide by zero", "Factorial requires non-negative integer"
- Division by zero shows error message, NOT Infinity
- sqrt of negative numbers shows error, NOT complex numbers (real-number domain only)
- Expression preserved on error (consistent with Phase 1) — user can backspace and correct

### Constants & special values
- Pi displays as symbol `π` in expression, e displays as `e`
- Implicit multiplication with constants: `2` then pi → `2π` (evaluates as 2*pi)
- Percentage means divide by 100: `50%` = 0.5, so `200*50%` = 100
- Factorial is integers only: `5!` = 120, `3.5!` shows error

### Claude's Discretion
- Autocomplete popup styling and behavior details
- Exact position/styling of DEG/RAD badge within display
- How to handle very large factorial results (overflow threshold)
- Button layout for scientific functions (Phase 3 handles panel, but basic buttons needed here for testing)

</decisions>

<specifics>
## Specific Ideas

- Smart wrap behavior mirrors how scientific calculators work: press a number, then a function key, and it wraps the number
- Autocomplete should feel lightweight, not a heavy dropdown — just enough to disambiguate (sin vs sinh vs sqrt)
- DEG/RAD badge should be subtle but clearly readable — similar to how Casio calculators show the angle mode indicator

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-scientific-functions*
*Context gathered: 2026-02-15*
