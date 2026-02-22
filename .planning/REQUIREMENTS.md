# Requirements: Web Calculator

**Defined:** 2026-02-22
**Core Value:** The calculator must correctly evaluate mathematical expressions — from simple arithmetic to scientific functions — and display results clearly.

## v1.1 Requirements

### Calc/Graph Integration

- [ ] **INTG-01**: User can switch between calculator mode and graph mode via a single toggle
- [ ] **INTG-02**: Switching to graph mode auto-plots the current expression if it contains a variable (x)
- [ ] **INTG-03**: Graph fills the main area in graph mode, replacing the button panel
- [ ] **INTG-04**: Expression display remains visible on top in graph mode
- [ ] **INTG-05**: Graph controls (zoom, pan, trace) remain accessible as overlays in graph mode

### Multi-Function Graphing

- [ ] **MGRPH-01**: User can add multiple function expressions to plot simultaneously
- [ ] **MGRPH-02**: Each function is rendered in a distinct color on the graph
- [ ] **MGRPH-03**: User can remove individual functions from the plot
- [ ] **MGRPH-04**: User can toggle visibility of individual functions without removing them

### Visual Redesign

- [ ] **VIS-01**: Calculator uses a modern design system (color palette, typography, spacing, border radius)
- [ ] **VIS-02**: Layout uses refined grid with clear visual hierarchy across all modes
- [ ] **VIS-03**: Mode transitions and button interactions have smooth animations
- [ ] **VIS-04**: Responsive layout is polished across desktop, tablet, and mobile breakpoints

## v2 Requirements

### Advanced Functions

- **ADV-01**: User can compute combinations (nCr) and permutations (nPr)
- **ADV-02**: User can compute arbitrary base logarithm (log_b(x))
- **ADV-03**: ANS button recalls previous result for use in new calculation

### Enhanced Graphing

- **EGRPH-01**: User can find roots/zeros of plotted functions automatically
- **EGRPH-02**: User can export graph as PNG image

### UX Polish

- **UX-01**: Dark/light theme toggle
- **UX-02**: Undo/redo support (Ctrl+Z/Ctrl+Y)
- **UX-03**: Accessibility (screen reader, high contrast, ARIA)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Computer Algebra System (CAS) | Enormous complexity, different product category |
| 3D graphing | Requires WebGL, high complexity, niche need |
| Matrix operations | Complex UI, different calculator mode |
| Equation solver | Symbolic algebra, different UI paradigm |
| Cloud sync | Privacy concerns, auth complexity, backend required |
| Voice/handwriting input | Accuracy issues, unnecessary complexity |
| Step-by-step solutions | CAS-level complexity, different product |
| Engineering functions (hex/oct/bin) | Not needed for standard scientific |
| Mobile app | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INTG-01 | Phase 8 | Pending |
| INTG-02 | Phase 9 | Pending |
| INTG-03 | Phase 8 | Pending |
| INTG-04 | Phase 8 | Pending |
| INTG-05 | Phase 9 | Pending |
| MGRPH-01 | Phase 10 | Pending |
| MGRPH-02 | Phase 10 | Pending |
| MGRPH-03 | Phase 10 | Pending |
| MGRPH-04 | Phase 10 | Pending |
| VIS-01 | Phase 7 | Pending |
| VIS-02 | Phase 8 | Pending |
| VIS-03 | Phase 11 | Pending |
| VIS-04 | Phase 11 | Pending |

**Coverage:**
- v1.1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-02-22*
*Last updated: 2026-02-22 after roadmap creation*
