# Roadmap: Web Calculator

## Milestones

- ✅ **v1.0 Scientific Calculator** - Phases 1-6 (shipped 2026-02-22)
- 🚧 **v1.1 Graphing Calculator Integration + Redesign** - Phases 7-11 (in progress)

## Phases

<details>
<summary>✅ v1.0 Scientific Calculator (Phases 1-6) - SHIPPED 2026-02-22</summary>

### Phase 1: Expression Input Foundation
**Goal**: Users can enter and evaluate mathematical expressions with proper PEMDAS order
**Plans**: 3 plans

Plans:
- [x] 01-01: Expression input with cursor navigation
- [x] 01-02: PEMDAS evaluation with mathjs
- [x] 01-03: Expression preview and validation

### Phase 2: Scientific Functions Core
**Goal**: Users can compute scientific operations with proper angle mode handling
**Plans**: 3 plans

Plans:
- [x] 02-01: Trigonometric functions with DEG/RAD mode
- [x] 02-02: Logarithmic and exponential functions
- [x] 02-03: Power and root functions

### Phase 3: Scientific Panel UI
**Goal**: Users can access scientific functions without cluttering the basic calculator
**Plans**: 1 plan

Plans:
- [x] 03-01: Toggle panel with slide-out animation and responsive layout

### Phase 4: Function Graphing Foundation
**Goal**: Users can visualize mathematical functions on a 2D coordinate plane
**Plans**: 2 plans

Plans:
- [x] 04-01: Canvas-based graph rendering with axes and grid
- [x] 04-02: Function curve plotting with adaptive sampling

### Phase 5: Interactive Graph Features
**Goal**: Users can explore graphs through zoom, pan, and coordinate inspection
**Plans**: 2 plans

Plans:
- [x] 05-01: Zoom and pan with cursor position preservation
- [x] 05-02: Trace coordinates and function table

### Phase 6: Scientific Calculator Polish
**Goal**: Users experience a refined scientific calculator with professional UX details
**Plans**: 2 plans

Plans:
- [x] 06-01: Scientific notation and CE/C split
- [x] 06-02: Clipboard support and keyboard shortcuts

</details>

### 🚧 v1.1 Graphing Calculator Integration + Redesign (In Progress)

**Milestone Goal:** Unify the calculator and graph into a seamless graphing calculator experience with a modern visual redesign.

#### ✅ Phase 7: Visual Design System — COMPLETE 2026-02-22
**Goal**: Establish a modern design foundation for all UI components
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md — Create design tokens and refactor all CSS to use them
- [x] 07-02-PLAN.md — Visual verification of design system (checkpoint)

#### ✅ Phase 8: Layout Integration — COMPLETE 2026-02-23
**Goal**: Users can switch between calculator and graph modes with graph filling the main area
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — Mode toggle, conditional layout, graph fills main area

#### Phase 9: Auto-Plot & Controls
**Goal**: Users can seamlessly transition to graphing with automatic plotting and accessible controls
**Depends on**: Phase 8
**Requirements**: INTG-02, INTG-05
**Success Criteria** (what must be TRUE):
  1. Switching to graph mode auto-plots the current expression if it contains variable x
  2. Graph controls (zoom, pan, trace) are accessible as overlays in graph mode
  3. Controls do not obscure the graph or expression display
  4. User can interact with controls without leaving graph mode
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

#### Phase 10: Multi-Function Plotting
**Goal**: Users can plot and manage multiple functions simultaneously on the same graph
**Depends on**: Phase 9
**Requirements**: MGRPH-01, MGRPH-02, MGRPH-03, MGRPH-04
**Success Criteria** (what must be TRUE):
  1. User can add multiple function expressions to plot simultaneously
  2. Each function renders in a distinct color on the graph
  3. User can remove individual functions from the plot
  4. User can toggle visibility of individual functions without removing them
  5. Function list shows which functions are currently plotted
**Plans**: TBD

Plans:
- [ ] 10-01: TBD

#### Phase 11: Animation & Polish
**Goal**: Users experience smooth, polished interactions across all calculator features
**Depends on**: Phase 10
**Requirements**: VIS-03, VIS-04
**Success Criteria** (what must be TRUE):
  1. Mode transitions have smooth animations (calculator ↔ graph)
  2. Button interactions have visual feedback (hover, active states)
  3. Responsive layout is polished on desktop, tablet, and mobile
  4. No visual jank or layout shifts during interactions
**Plans**: TBD

Plans:
- [ ] 11-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8 → 9 → 10 → 11

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Expression Input Foundation | v1.0 | 3/3 | Complete | 2026-02-15 |
| 2. Scientific Functions Core | v1.0 | 3/3 | Complete | 2026-02-20 |
| 3. Scientific Panel UI | v1.0 | 1/1 | Complete | 2026-02-20 |
| 4. Graphing Core | v1.0 | 2/2 | Complete | 2026-02-21 |
| 5. Graphing Interactions | v1.0 | 2/2 | Complete | 2026-02-21 |
| 6. UX Polish | v1.0 | 2/2 | Complete | 2026-02-21 |
| 7. Visual Design System | v1.1 | 2/2 | Complete | 2026-02-22 |
| 8. Layout Integration | v1.1 | 1/1 | Complete | 2026-02-23 |
| 9. Auto-Plot & Controls | v1.1 | 0/TBD | Not started | - |
| 10. Multi-Function Plotting | v1.1 | 0/TBD | Not started | - |
| 11. Animation & Polish | v1.1 | 0/TBD | Not started | - |
