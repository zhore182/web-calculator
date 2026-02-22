# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-14)

**Core value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.
**Current focus:** Phase 6 - UX Polish (Complete)

## Current Position

Phase: 6 of 6 (UX Polish)
Plan: 2 of 2 in current phase
Status: Complete
Last activity: 2026-02-21 — Completed Phase 6 (Scientific notation, CE/C, clipboard, keyboard shortcuts)

Progress: [██████████] 100% (All 6 phases complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 13
- Average duration: 4.5 minutes
- Total execution time: 1.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01    | 3     | 14min | 4.7min   |
| 02    | 3     | 15min | 5.0min   |
| 03    | 1     | 12min | 12.0min  |
| 04    | 2     | 6min  | 3.0min   |
| 05    | 2     | 9min  | 4.8min   |
| 06    | 2     | 5min  | 2.5min   |

**Recent Trend:**
- Last 5 plans: 05-01 (5.5min), 05-02 (4min), 06-01 (2min), 06-02 (3min)
- Trend: Fast execution for polish tasks

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
- **[04-01]** Separate pure rendering logic from React component — Makes coordinate transforms and sampling testable without React coupling
- **[04-01]** Sample count = canvas width (1 sample per pixel column) — Produces smooth curves without oversample cost
- **[04-01]** Render null when not visible instead of hiding with CSS — Avoids unnecessary canvas rendering and memory allocation
- **[04-01]** Hardcoded viewport bounds (-10 to 10) for Phase 4 — Zoom and pan functionality deferred to Phase 5
- **[04-02]** Graph input uses native HTML input, keyboard hook already ignores focused inputs — No conflict with calculator keyboard handling
- **[04-02]** Separate graphInputValue from graphExpression — Graph only re-renders on explicit Plot action, not every keystroke
- **[04-02]** Enter key in graph input triggers plot — User convenience, matches common form submission pattern
- **[05-01]** Zoom preserves cursor position (not zoom-to-center) — Better UX for exploring graph regions, point under cursor stays under cursor after zoom
- **[05-01]** Viewport bounds clamped to 0.01-10000 range — Prevents degenerate zoom (too small) or excessive zoom (too large)
- **[05-01]** Touch events use same pan logic as mouse drag — Consistent mobile/desktop behavior
- **[05-01]** Zoom controls overlay in top-right corner — Non-intrusive, always accessible regardless of graph content
- **[05-02]** Trace evaluates at mouse x-position on every mouse move — Smooth, accurate coordinate display without snapping to samples
- **[05-02]** Function table managed as local state in GraphPanel — No prop drilling needed, table visibility is purely UI concern
- **[05-02]** Table toggle button (≡) in zoom controls bar — Consistent with existing overlay pattern
- **[05-02]** Table shows 21 rows spanning viewport xMin..xMax — Auto-updates when viewport changes through zoom/pan
- **[06-01]** Scientific notation threshold at |value| >= 1e12 or |value| < 1e-6 — Aligns with 12-digit toPrecision limit, numbers requiring >12 digits go to scientific notation
- **[06-01]** CE (Clear Entry) preserves pending operation, C (Clear All) resets everything — Two-level clearing provides granular control
- **[06-01]** Delete key maps to CE, Escape to C — Intuitive keyboard mapping for two clearing levels
- **[06-02]** Ctrl/Cmd+C/V intercepted before modifier guard — Allows copy/paste while blocking other Ctrl combos
- **[06-02]** Copy targets previewResult if available, else displayValue — Copies most relevant value
- **[06-02]** Pasted text sanitized to math characters only — Prevents non-math content injection
- **[06-02]** ^, !, % mapped directly in keyMap — Shift+number produces these natively, no special handling

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

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed all 6 phases — Milestone v1.0 complete
Resume file: .planning/phases/06-ux-polish/06-02-SUMMARY.md

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

**Phase 04: Graphing Core** - ✓ COMPLETE
- 04-01: Graph rendering engine and GraphPanel component ✓
- 04-02: Graph UI integration (input field, plot/clear, angle mode) ✓

**Phase 05: Graphing Interactions** - ✓ COMPLETE
- 05-01: Graph zoom and pan interactions ✓
- 05-02: Trace and function table ✓

**Phase 06: UX Polish** - ✓ COMPLETE
- 06-01: Scientific notation and CE/C split ✓
- 06-02: Clipboard copy/paste and keyboard shortcuts ✓

**All phases complete — Milestone v1.0 ready for /gsd:complete-milestone**
