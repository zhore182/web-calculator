# Web Calculator

## What This Is

A web-based scientific calculator with graphing capabilities. Started as a basic four-function calculator with memory and history, now evolving into a full scientific calculator with expression input and function plotting. Built as a client-side React app — no backend needed.

## Core Value

The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.

## Requirements

### Validated

- ✓ Basic arithmetic (add, subtract, multiply, divide) — existing
- ✓ Digit input with decimal support (max 16 digits) — existing
- ✓ Memory operations (M+, M-, MR, MC) with indicator — existing
- ✓ Calculation history with localStorage persistence — existing
- ✓ History click-to-restore — existing
- ✓ Keyboard input support (digits, operators, Enter, Escape) — existing
- ✓ Clear/reset functionality — existing
- ✓ Responsive design (desktop, tablet, mobile) — existing

### Active

- [ ] Scientific functions (sin, cos, tan, log, ln, sqrt, powers, factorial, pi, e)
- [ ] Toggle panel for scientific buttons (slide-out, keeps basic view clean)
- [ ] DEG/RAD angle mode toggle for trig functions
- [ ] Expression input mode with parentheses and proper order of operations
- [ ] Mode toggle between simple (left-to-right) and expression input
- [ ] Function plotting (y=f(x)) as inline panel below/beside calculator
- [ ] Graph input field for entering function expressions

### Out of Scope

- Engineering functions (hex/oct/bin, bitwise, unit conversions) — not needed for standard scientific
- Gradians angle mode — DEG/RAD covers vast majority of use cases
- Multiple function overlay on graphs — single function at a time for v1
- Zoom/pan on graphs — keep graphing simple for v1
- Mobile app — web-first
- Backend/server — client-side only

## Context

Brownfield project with a solid React + TypeScript + Vite foundation. Architecture separates pure logic functions from components, which should extend cleanly for scientific operations. The existing `CalculatorState` interface and handler pattern (pure functions accepting state, returning new state) will need expansion for expression parsing and scientific functions.

Key existing patterns to preserve:
- Pure functions in `src/logic/` for all business logic
- Centralized state in `App.tsx`
- `useCallback` for stable handler references
- Co-located test files (`*.test.ts`)
- BEM-like CSS naming in single stylesheet

Known concerns from codebase map:
- Floating-point precision uses `toPrecision(12)` — may need attention for scientific functions
- No operator precedence currently (left-to-right only) — expression mode will address this
- Test coverage gaps in inputHandlers, memoryHandlers, historyHandlers

## Constraints

- **Tech stack**: React 19 + TypeScript + Vite (existing, no changes)
- **No new backend**: Must remain a client-side SPA
- **No heavy dependencies**: Prefer lightweight or zero-dependency solutions for math parsing and graphing
- **Browser support**: Modern browsers with ES2022 support

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Toggle panel for scientific buttons | Keeps basic calculator clean; users who don't need science mode aren't overwhelmed | — Pending |
| Both simple + expression input modes | Preserves familiar basic experience while enabling full expression capability | — Pending |
| DEG/RAD only (no gradians) | Covers 99% of use cases, simpler UI | — Pending |
| Inline graph panel | Graph stays in context with calculator, no navigation needed | — Pending |
| Single function plot (no multi-overlay) | Keeps graphing scope manageable for v1 | — Pending |

---
*Last updated: 2026-02-14 after initialization*
