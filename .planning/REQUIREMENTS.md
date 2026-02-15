# Requirements: Web Calculator

**Defined:** 2026-02-14
**Core Value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.

## v1 Requirements

### Scientific Functions

- [ ] **SCI-01**: User can compute trigonometric functions (sin, cos, tan) with current angle mode
- [ ] **SCI-02**: User can compute inverse trigonometric functions (asin, acos, atan)
- [ ] **SCI-03**: User can compute hyperbolic functions (sinh, cosh, tanh) and their inverses
- [ ] **SCI-04**: User can compute logarithms (log base 10 and natural log ln)
- [ ] **SCI-05**: User can compute exponentiation (x^2, x^3, x^y)
- [ ] **SCI-06**: User can compute square root and nth root
- [ ] **SCI-07**: User can insert constants pi and e into expressions
- [ ] **SCI-08**: User can compute factorial (n!) for non-negative integers
- [ ] **SCI-09**: User can compute absolute value of a number
- [ ] **SCI-10**: User can compute percentage of a value

### Expression Input

- [ ] **EXPR-01**: User can type full expressions with proper order of operations (PEMDAS)
- [ ] **EXPR-02**: User can use parentheses for grouping in expressions
- [ ] **EXPR-03**: User can see the full expression in the display before evaluating
- [ ] **EXPR-04**: User can see results in scientific notation for very large or very small numbers
- [ ] **EXPR-05**: User can backspace/delete characters within an expression
- [ ] **EXPR-06**: User can navigate cursor within expression using arrow keys to edit

### Calculator Modes

- [ ] **MODE-01**: User can toggle between simple mode (left-to-right) and expression mode (PEMDAS)
- [ ] **MODE-02**: User can toggle between DEG and RAD angle modes, with current mode always visible
- [ ] **MODE-03**: User can toggle a scientific button panel on/off without losing calculator state

### Graphing

- [ ] **GRPH-01**: User can enter a function expression (y=f(x)) in a text input field
- [ ] **GRPH-02**: User can plot the function as a curve on a 2D graph inline with the calculator
- [ ] **GRPH-03**: User can zoom in and out on the graph
- [ ] **GRPH-04**: User can pan/drag to navigate the graph viewport
- [ ] **GRPH-05**: Graph displays labeled axes with tick marks and grid lines
- [ ] **GRPH-06**: User can clear the graph and enter a new function
- [ ] **GRPH-07**: User can trace the curve to see x,y coordinates at any point
- [ ] **GRPH-08**: User can view a function table showing x/y value pairs for the plotted function

### UI/UX

- [ ] **UI-01**: Scientific buttons appear in a toggle panel that slides out
- [ ] **UI-02**: Clear entry (CE) clears current input; Clear all (C) resets calculator state
- [ ] **UI-03**: User can copy calculation results and paste expressions
- [ ] **UI-04**: Keyboard input supports scientific functions and parentheses

## v2 Requirements

### Advanced Functions

- **ADV-01**: User can compute combinations (nCr) and permutations (nPr)
- **ADV-02**: User can compute arbitrary base logarithm (log_b(x))
- **ADV-03**: ANS button recalls previous result for use in new calculation

### Enhanced Graphing

- **EGRPH-01**: User can plot multiple functions overlaid with different colors
- **EGRPH-02**: User can find roots/zeros of plotted functions automatically
- **EGRPH-03**: User can export graph as PNG image

### UX Polish

- **UX-01**: Dark/light theme toggle
- **UX-02**: Keyboard autocomplete for function names
- **UX-03**: Undo/redo support (Ctrl+Z/Ctrl+Y)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Computer Algebra System (CAS) | Enormous complexity, different product category |
| Programming mode (hex, bin, bitwise) | Different user base, confusing UI |
| 3D graphing | Requires WebGL, high complexity, niche need |
| Matrix operations | Complex UI, different calculator mode |
| Equation solver | Symbolic algebra, different UI paradigm |
| Backend/server | Must remain client-side SPA |
| Cloud sync | Privacy concerns, auth complexity, backend required |
| Voice/handwriting input | Accuracy issues, unnecessary complexity |
| Step-by-step solutions | CAS-level complexity, different product (Wolfram) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| (To be populated during roadmap creation) | | |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 0
- Unmapped: 27

---
*Requirements defined: 2026-02-14*
*Last updated: 2026-02-14 after initial definition*
