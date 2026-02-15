# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.
**Current focus:** Phase 1 - Expression Parser Foundation

## Current Position

Phase: 1 of 6 (Expression Parser Foundation)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-02-15 — Roadmap created with 6 phases

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: N/A
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: N/A
- Trend: N/A

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Toggle panel for scientific buttons — Keeps basic calculator clean; users who don't need science mode aren't overwhelmed
- Both simple + expression input modes — Preserves familiar basic experience while enabling full expression capability
- DEG/RAD only (no gradians) — Covers 99% of use cases, simpler UI

### Pending Todos

None yet.

### Blockers/Concerns

**Research findings to address in Phase 1 planning:**
- Expression parser state pollution: Must complete cutover from legacy left-to-right evaluation in single phase (no dual code paths)
- Floating-point precision: Establish single precision strategy upfront with epsilon comparisons and unified formatting
- DEG/RAD mode: Must flow as evaluation context to all functions, not just UI state

**Research findings to address in Phase 2 planning:**
- Implicit multiplication policy: Test if mathjs supports "2π" or requires "2*π" (affects tokenizer design)
- History serialization: Design schema for storing expressions with mode metadata

**Research findings to address in Phase 4 planning:**
- Graphing performance: Define performance budget and test adaptive sampling for complex functions
- Axis scaling algorithm: Need auto-scale based on function range sampling

## Session Continuity

Last session: 2026-02-15
Stopped at: Roadmap creation complete, ready to begin Phase 1 planning
Resume file: None
