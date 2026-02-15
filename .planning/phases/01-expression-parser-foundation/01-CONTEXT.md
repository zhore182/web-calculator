# Phase 1: Expression Parser Foundation - Context

**Gathered:** 2026-02-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the existing left-to-right evaluation engine with a PEMDAS-capable expression parser. Add expression display with live result preview, support expression editing with cursor navigation, and provide a toggle between simple mode (legacy behavior) and expression mode. This is the architectural foundation that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### Expression Display
- Split display with two lines: expression on top, result on bottom
- Math symbols in the expression display (√, π, ×, ÷) not raw text (sqrt, pi, *, /)
- Horizontal scroll for long expressions (most recent input always visible)
- Live result preview only updates when the expression is complete and evaluable (not partial)

### Mode Switching
- Toggle switch or segmented control positioned above the display
- Default mode on first load: simple mode (familiar basic calculator)
- Switching modes preserves current value and calculator state (no reset)
- Both modes use the same split display layout — only evaluation logic differs
- Mode preference not persisted (always starts in simple mode)

### Expression Editing
- Auto-close parentheses: typing '(' inserts '()' with cursor between
- Click/tap within expression to position cursor at that point
- Blinking line cursor (standard text cursor style) between characters
- Calculator buttons insert at cursor position in expression mode (not always at end)
- Arrow keys move cursor left/right within expression

### Error Handling
- Incomplete expressions (like '2+3*') show 'Syntax Error' in the result line on equals press
- Expression stays visible on top line during error — user can see what went wrong
- After error, expression is preserved — user can backspace and correct (not auto-cleared)
- Implicit multiplication supported: '2(3)' = 6, '2π' = 6.28...

### Claude's Discretion
- Expression parser library choice and integration approach
- Exact cursor rendering implementation
- How state maps between simple and expression modes internally
- Performance optimization for live evaluation
- Exact error message wording beyond "Syntax Error"

</decisions>

<specifics>
## Specific Ideas

- Split display inspired by modern phone calculators (expression top, result bottom)
- Math symbol rendering should feel like a physical scientific calculator, not a code editor
- Simple mode should feel exactly like the current basic calculator — no visual regression

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-expression-parser-foundation*
*Context gathered: 2026-02-15*
