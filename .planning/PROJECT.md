# Web Calculator

## What This Is

A web-based scientific calculator with graphing capabilities. Features PEMDAS expression input, 20+ scientific functions with DEG/RAD angle modes, a toggle panel UI, Canvas-based 2D function graphing with zoom/pan/trace, and full keyboard support. Built as a client-side React app — no backend needed.

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
- ✓ Scientific functions (sin, cos, tan, log, ln, sqrt, powers, factorial, pi, e) — v1.0
- ✓ Toggle panel for scientific buttons (slide-out, keeps basic view clean) — v1.0
- ✓ DEG/RAD angle mode toggle for trig functions — v1.0
- ✓ Expression input mode with parentheses and proper order of operations — v1.0
- ✓ Mode toggle between simple (left-to-right) and expression input — v1.0
- ✓ Function plotting (y=f(x)) as inline panel below/beside calculator — v1.0
- ✓ Graph input field for entering function expressions — v1.0
- ✓ Graph zoom, pan, trace coordinates, function table — v1.0
- ✓ Scientific notation for extreme numbers — v1.0
- ✓ CE/C clear split — v1.0
- ✓ Clipboard copy/paste — v1.0
- ✓ Keyboard shortcuts for scientific operators — v1.0

### Active

- [ ] Unified calc/graph input — one input field with mode switch, no separate graph input
- [ ] Auto-plot on mode switch — switching to graph mode auto-plots current expression if graphable
- [ ] Graph fills main area — graph replaces button panel in graph mode, expression display stays on top
- [ ] Multi-function plotting — multiple functions with different colors, add/remove
- [ ] Full visual redesign — modern layout, color palette, typography, spacing, animations

### Out of Scope

- Engineering functions (hex/oct/bin, bitwise, unit conversions) — not needed for standard scientific
- Gradians angle mode — DEG/RAD covers vast majority of use cases
- Mobile app — web-first
- Backend/server — client-side only
- Computer Algebra System (CAS) — enormous complexity, different product category
- 3D graphing — requires WebGL, high complexity, niche need
- Matrix operations — complex UI, different calculator mode
- Equation solver — symbolic algebra, different UI paradigm
- Cloud sync — privacy concerns, auth complexity, backend required
- Voice/handwriting input — accuracy issues, unnecessary complexity
- Step-by-step solutions — CAS-level complexity, different product

## Current Milestone: v1.1 Graphing Calculator Integration + Redesign

**Goal:** Unify the calculator and graph into a seamless graphing calculator experience with a modern visual redesign.

**Target features:**
- Unified input with calc/graph mode switch
- Auto-plot current expression when entering graph mode
- Graph fills main area (replaces buttons) in graph mode
- Multi-function plotting with different colors
- Full visual redesign (modern layout, colors, typography, animations)

## Context

Shipped v1.0 with 5,454 LOC TypeScript/CSS. 192 tests passing.
Tech stack: React 19, TypeScript, Vite, Vitest, mathjs, Canvas API.
Architecture: pure logic functions in `src/logic/`, centralized state in App.tsx, BEM-like CSS.
v1.1 focus: Calculator and graph currently feel like separate tools — need to unify into one cohesive graphing calculator experience.

## Constraints

- **Tech stack**: React 19 + TypeScript + Vite (existing, no changes)
- **No new backend**: Must remain a client-side SPA
- **No heavy dependencies**: Prefer lightweight or zero-dependency solutions
- **Browser support**: Modern browsers with ES2022 support

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Toggle panel for scientific buttons | Keeps basic calculator clean | ✓ Good — responsive slide-out works well |
| Both simple + expression input modes | Preserves familiar basic experience | ✓ Good — seamless mode switching |
| DEG/RAD only (no gradians) | Covers 99% of use cases | ✓ Good — simpler UI |
| Inline graph panel | Graph stays in context with calculator | ✓ Good — no navigation needed |
| Single function plot (no multi-overlay) | Keeps graphing scope manageable for v1 | ✓ Good — clean UX |
| mathjs for expression evaluation | Battle-tested PEMDAS, implicit multiplication | ✓ Good — zero custom parser bugs |
| toPrecision(12) + parseFloat formatting | Addresses floating-point precision | ✓ Good — 0.1+0.2=0.3 works |
| Canvas API for graphing | No extra dependency, full control | ✓ Good — smooth rendering |
| Zoom preserves cursor position | Better UX for exploring graph regions | ✓ Good — intuitive behavior |
| Scientific notation at 1e12/1e-6 thresholds | Aligns with 12-digit precision limit | ✓ Good — clean display |

---
*Last updated: 2026-02-22 after v1.1 milestone start*
