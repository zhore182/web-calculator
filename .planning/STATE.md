# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.
**Current focus:** Phase 3 - Scientific UI Panel

## Current Position

Phase: 3 of 6 (Scientific UI Panel)
Plan: 1 of 1 in current phase
Status: Complete
Last activity: 2026-02-20 — Completed plan 03-01 (Scientific toggle panel with function buttons)

Progress: [████████░░] ~50% (Phase 3: 1/1 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 7
- Average duration: 4.7 minutes
- Total execution time: 0.55 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01    | 3     | 14min | 4.7min   |
| 02    | 3     | 15min | 5.0min   |
| 03    | 1     | 12min | 12.0min  |

**Recent Trend:**
- Last 5 plans: 02-01 (3min), 02-02 (4min), 02-03 (8min), 03-01 (12min)
- Trend: Phase 3 longer due to human verification checkpoint and responsive fix

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Toggle panel for scientific buttons — Keeps basic calculator clean; users who don't need science mode aren't overwhelmed
- Both simple + expression input modes — Preserves familiar basic experience while enabling full expression capability
- DEG/RAD only (no gradians) — Covers 99% of use cases, simpler UI
- **[01-01]** Use mathjs library for expression evaluation — Provides battle-tested PEMDAS implementation, supports implicit multiplication
- **[01-01]** Use toPrecision(12) + parseFloat for number formatting — Addresses floating-point precision (0.1+0.2=0.3), establishes single precision strategy
- **[01-01]** Changed error test from "2++3" to "2**3" — Mathjs correctly interprets "2++3" as valid (unary plus), needed truly invalid syntax
- **[01-02]** Preserve display value when switching modes — User's current work shouldn't disappear when switching between Simple and Expression modes
- **[01-02]** Live preview only shows when expression evaluates successfully — Showing partial errors or incomplete results would be confusing
- **[01-02]** Math symbols (× ÷) displayed instead of raw operators (* /) — Cleaner visual presentation matches traditional calculator displays
- **[01-02]** Expression mode uses separate input handling path — Clear separation of concerns, no risk of simple mode regression
- **[01-03]** Auto-close parentheses on '(' input — Typing '(' inserts '()' with cursor between, improves UX and reduces syntax errors
- **[01-03]** Preserve expression on syntax error — After equals with invalid/incomplete expression, show 'Syntax Error' in result but keep expression visible for correction
- **[01-03]** Separate cursor logic from UI — Pure functions in cursorHelpers.ts are testable independently without React coupling
- **[02-01]** Use mathjs custom scope for angle mode — Cleaner than expression preprocessing, overrides trig functions at evaluation time
- **[02-01]** Pre-validate factorial and sqrt domain — Provides specific error messages instead of generic mathjs errors
- **[02-01]** Log aliasing via scope (log=base10, ln=natural) — Aligns with calculator conventions (mathjs uses log() for natural log by default)
- **[02-02]** Smart auto-wrap for function input — Wrapping existing numbers (45 + sin → sin(45)) provides better UX than forcing manual parentheses
- **[02-02]** Pi displays as π symbol, internally stored as 'pi' — Mathjs evaluates 'pi' natively, symbol rendering is display-only transformation
- **[02-02]** DEG/RAD badge in display area top-right corner — Visible indicator without cluttering button panel, only in expression mode
- **[02-02]** Switching angle mode immediately re-evaluates expression — Users expect live feedback when toggling DEG/RAD
- **[02-03]** Autocomplete appears after 2+ letter characters typed — Single letter would show too many matches and trigger too early
- **[02-03]** Letter input inserts characters into expression while building autocomplete buffer — Users see what they're typing immediately, autocomplete acts as suggestion layer
- **[02-03]** Enter key maps to 'Enter' instead of '=' in keyboard hook — Allows autocomplete to intercept Enter for selection before equals handling
- **[02-03]** Autocomplete keyboard navigation takes priority over normal cursor movement — When autocomplete is visible, arrows should navigate list not cursor
- **[03-01]** Scientific panel slides in from left on desktop — Maintains visual hierarchy with basic buttons as primary
- **[03-01]** Panel stacks below basic buttons on tablet/mobile — User-approved placement, doesn't push main calculator down
- **[03-01]** Scientific buttons only functional in expression mode — Simple mode ignores them (no-op, no guard needed)
- **[03-01]** Width transition for desktop, max-height transition for mobile — Different animation axes for horizontal vs vertical layout

### Pending Todos

None yet.

### Blockers/Concerns

**Research findings to address in Phase 1 planning:**
- Expression parser state pollution: Must complete cutover from legacy left-to-right evaluation in single phase (no dual code paths)
- Floating-point precision: Establish single precision strategy upfront with epsilon comparisons and unified formatting
- DEG/RAD mode: Must flow as evaluation context to all functions, not just UI state

**Research findings to address in Phase 2 planning:**
- ~~Implicit multiplication policy: Test if mathjs supports "2π" or requires "2*π" (affects tokenizer design)~~ — RESOLVED: mathjs supports implicit multiplication natively (tested: "2(3)" works)
- History serialization: Design schema for storing expressions with mode metadata

**Research findings to address in Phase 4 planning:**
- Graphing performance: Define performance budget and test adaptive sampling for complex functions
- Axis scaling algorithm: Need auto-scale based on function range sampling

## Session Continuity

Last session: 2026-02-20
Stopped at: Completed 03-01-PLAN.md — Scientific toggle panel with function buttons
Resume file: .planning/phases/03-scientific-ui-panel/03-01-SUMMARY.md

## Phase Completion Status

**Phase 01: Expression Parser Foundation** - ✓ COMPLETE
- 01-01: PEMDAS expression parser ✓
- 01-02: Split display and mode toggle ✓
- 01-03: Expression editing with cursor management ✓

**Phase 02: Scientific Functions Panel** - ✓ COMPLETE
- 02-01: Scientific function evaluation engine ✓
- 02-02: Function input with smart auto-wrap and angle mode UI ✓
- 02-03: Keyboard autocomplete for scientific functions ✓

**Phase 03: Scientific UI Panel** - ✓ COMPLETE
- 03-01: Scientific toggle panel with function buttons ✓

**Next:** Phase 04 (to be planned)
