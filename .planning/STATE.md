# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.
**Current focus:** Phase 1 - Expression Parser Foundation

## Current Position

Phase: 1 of 6 (Expression Parser Foundation)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-02-16 — Completed plan 01-02 (Split display and mode toggle)

Progress: [██░░░░░░░░] ~33% (2 plans complete in Phase 1)

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 3 minutes
- Total execution time: 0.1 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01    | 2     | 6min  | 3min     |

**Recent Trend:**
- Last 5 plans: 01-01 (3min), 01-02 (3min)
- Trend: Consistent velocity

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

Last session: 2026-02-16
Stopped at: Completed 01-02-PLAN.md — Split display and mode toggle with expression state
Resume file: .planning/phases/01-expression-parser-foundation/01-02-SUMMARY.md
