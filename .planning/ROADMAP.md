# Roadmap: Web Calculator

## Overview

Transform the existing basic calculator into a scientific calculator with graphing capabilities through six focused phases. The journey begins by replacing the left-to-right evaluation engine with a proper expression parser (Phase 1), enabling scientific functions (Phase 2), exposing them through a toggle panel UI (Phase 3), building graphing capabilities (Phase 4), adding interactive graph features (Phase 5), and polishing the UX (Phase 6). This sequence follows technical dependencies: expression parsing is the foundation for both scientific functions and graphing.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Expression Parser Foundation** - Replace left-to-right evaluation with PEMDAS-capable expression engine
- [ ] **Phase 2: Scientific Functions** - Add trigonometric, logarithmic, and exponential functions with angle mode support
- [ ] **Phase 3: Scientific UI Panel** - Create toggle panel for scientific buttons without cluttering basic calculator
- [ ] **Phase 4: Graphing Core** - Build basic function plotting with y=f(x) input and Canvas rendering
- [ ] **Phase 5: Graphing Interactions** - Add zoom, pan, trace, and function table features to graphs
- [ ] **Phase 6: UX Polish** - Enhance user experience with scientific notation, better error handling, and keyboard shortcuts

## Phase Details

### Phase 1: Expression Parser Foundation
**Goal**: Users can enter and evaluate mathematical expressions with proper order of operations (PEMDAS)
**Depends on**: Nothing (first phase)
**Requirements**: EXPR-01, EXPR-02, EXPR-03, EXPR-05, EXPR-06, MODE-01
**Success Criteria** (what must be TRUE):
  1. User can type full expressions like "2+3*4" and get 14 (not 20)
  2. User can use parentheses for grouping and they are evaluated correctly
  3. User can see the full expression in the display before pressing equals
  4. User can backspace to delete characters within an expression
  5. User can toggle between simple mode (left-to-right) and expression mode (PEMDAS) without losing calculator state
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Expression parser engine (TDD: mathjs integration, PEMDAS evaluation, error handling)
- [x] 01-02-PLAN.md — Split display UI and mode toggle (two-line display, Simple/Expression mode switch, expression state)
- [x] 01-03-PLAN.md — Cursor management and expression editing (click-to-position, arrow keys, auto-close parens, final integration)

### Phase 2: Scientific Functions
**Goal**: Users can perform scientific calculations including trigonometric, logarithmic, and exponential functions
**Depends on**: Phase 1 (requires expression parser for function evaluation)
**Requirements**: SCI-01, SCI-02, SCI-03, SCI-04, SCI-05, SCI-06, SCI-07, SCI-08, SCI-09, SCI-10, MODE-02
**Success Criteria** (what must be TRUE):
  1. User can compute trigonometric functions (sin, cos, tan, inverse, hyperbolic) with correct results
  2. User can toggle between DEG and RAD angle modes and see the current mode clearly displayed
  3. User can compute logarithms (log, ln) and exponentiation (x^2, x^3, x^y, sqrt)
  4. User can insert constants (pi, e) and compute factorial, absolute value, and percentage
  5. User receives clear error messages for invalid operations (like sqrt of negative number)
**Plans**: TBD

Plans:
- [ ] TBD (populated during planning)

### Phase 3: Scientific UI Panel
**Goal**: Scientific functions are accessible through a clean toggle panel that doesn't clutter the basic calculator interface
**Depends on**: Phase 2 (scientific functions must exist to expose in UI)
**Requirements**: UI-01, MODE-03
**Success Criteria** (what must be TRUE):
  1. User can toggle scientific button panel on/off with a clear control
  2. Scientific panel slides out smoothly without disrupting calculator state
  3. Basic calculator view remains clean when scientific panel is hidden
  4. Toggling the panel preserves all calculator state (expression, memory, history, mode)
**Plans**: TBD

Plans:
- [ ] TBD (populated during planning)

### Phase 4: Graphing Core
**Goal**: Users can plot mathematical functions on a 2D graph inline with the calculator
**Depends on**: Phase 1 (requires expression parser to evaluate f(x))
**Requirements**: GRPH-01, GRPH-02, GRPH-05, GRPH-06
**Success Criteria** (what must be TRUE):
  1. User can enter a function expression (y=f(x)) in a dedicated input field
  2. Function plots as a curve on a Canvas-based 2D graph below/beside the calculator
  3. Graph displays labeled axes with tick marks and grid lines
  4. User can clear the graph and enter a new function expression
  5. Graph respects current angle mode (DEG/RAD) for trigonometric functions
**Plans**: TBD

Plans:
- [ ] TBD (populated during planning)

### Phase 5: Graphing Interactions
**Goal**: Users can interact with graphs through zoom, pan, trace, and function table features
**Depends on**: Phase 4 (requires basic graphing capability)
**Requirements**: GRPH-03, GRPH-04, GRPH-07, GRPH-08
**Success Criteria** (what must be TRUE):
  1. User can zoom in/out on the graph using controls or mouse wheel
  2. User can pan/drag to navigate different regions of the graph
  3. User can trace the curve to see exact x,y coordinates at any point
  4. User can view a function table showing x/y value pairs for the plotted function
**Plans**: TBD

Plans:
- [ ] TBD (populated during planning)

### Phase 6: UX Polish
**Goal**: Final user experience enhancements including scientific notation, improved error handling, and keyboard support
**Depends on**: Phase 5 (all core functionality complete)
**Requirements**: EXPR-04, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. Very large or very small numbers display in scientific notation automatically
  2. Clear Entry (CE) clears current input while Clear (C) resets entire calculator state
  3. User can copy calculation results and paste expressions into the calculator
  4. User can type scientific function names and parentheses using keyboard shortcuts
**Plans**: TBD

Plans:
- [ ] TBD (populated during planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Expression Parser Foundation | 3/3 | ✓ Complete | 2026-02-15 |
| 2. Scientific Functions | 0/TBD | Not started | - |
| 3. Scientific UI Panel | 0/TBD | Not started | - |
| 4. Graphing Core | 0/TBD | Not started | - |
| 5. Graphing Interactions | 0/TBD | Not started | - |
| 6. UX Polish | 0/TBD | Not started | - |
