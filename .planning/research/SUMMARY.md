# Project Research Summary

**Project:** Web Calculator Enhancement (Scientific + Graphing)
**Domain:** Web-based Scientific Calculator with Function Graphing
**Researched:** 2026-02-14
**Confidence:** MEDIUM-HIGH

## Executive Summary

Scientific calculators are well-understood products with decades of established patterns from physical calculators (TI-83/84, Casio fx series). The key finding is that this project requires a fundamental architecture shift: the existing left-to-right evaluation engine cannot coexist with proper expression parsing (PEMDAS). Research strongly recommends a complete cutover to expression-based evaluation using mathjs (~150KB) as the parsing foundation, which serves both scientific functions and graphing capabilities.

The recommended approach is a three-phase build: (1) Replace evaluation engine with expression parser and add scientific functions, (2) Build graphing capabilities on top of the parser, (3) Polish UX with advanced features. The critical risk is attempting gradual migration from the legacy evaluation logic, which creates dual code paths that produce inconsistent results. Prevention requires complete replacement in a single phase, not incremental refactoring.

The technology stack is lightweight—only one new dependency (mathjs) with custom Canvas rendering for graphs. The existing React 19 + TypeScript + Vite setup requires no framework changes. The main architectural challenge is preserving the existing simple mode while cleanly separating the new expression-based evaluation path.

## Key Findings

### Recommended Stack

The stack research reveals minimal new dependencies are needed. The existing React 19/TypeScript/Vite foundation is solid and requires no changes. The single critical addition is **mathjs** for expression parsing—it provides battle-tested PEMDAS handling, scientific functions, and unit awareness in ~150KB minified.

**Core technologies:**
- **mathjs**: Expression parser with built-in scientific functions (sin, cos, tan, log, sqrt, factorial) — the de facto standard for JS math evaluation, handles operator precedence and parentheses natively
- **Custom Canvas rendering**: Function graphing engine (~200-300 lines) — gives full control over styling with zero dependencies, sufficient for single-function y=f(x) plotting
- **Native JavaScript Math**: Core scientific computations (IEEE 754 compliant, 15-17 significant digits) — combined with better result formatting instead of arbitrary-precision libraries

**What NOT to use:**
- eval()/Function() for parsing (security risk, no error handling)
- Heavy graphing libraries like function-plot, Plotly.js (overkill for single-function plotting)
- Arbitrary precision libraries like decimal.js (not needed unless users report precision problems)

### Expected Features

Scientific calculator features fall into well-defined tiers based on user expectations from physical calculator standards. Deviation from these conventions causes user confusion and abandonment.

**Must have (table stakes):**
- **Trigonometric functions** (sin, cos, tan, inverse) with DEG/RAD mode toggle — universal scientific calculator standard
- **Logarithms** (log₁₀, ln) and exponentiation (x², x³, xʸ, √x) — core scientific calculations
- **Constants** (π, e) — essential for trig/geometry/exponential work
- **Parentheses with PEMDAS** — required for expression-based input (2+3×4 must equal 14, not 20)
- **Expression display** — users need to see full calculation "2+3×4" not just current number
- **Function graphing basics** — plot y=f(x), zoom/pan, axis labels, grid lines
- **Error handling** — inform invalid operations (√-1, 1/0, tan(90°)) without breaking calculator state

**Should have (competitive differentiators):**
- **ANS button** — use previous result in new calculation (common in physical calculators)
- **History editing** — click history entry to load and modify (extends existing history feature)
- **Keyboard function shortcuts** — type "sin(30)" instead of clicking buttons
- **Multiple function plotting** — overlay 2-3 functions with different colors for comparison
- **Hyperbolic functions** (sinh, cosh, tanh) — advanced math students, engineers

**Defer (v2+):**
- **Trace mode** — read exact (x,y) coordinates on curve (nice-to-have, medium complexity)
- **Find roots/intersections** — numerical analysis features (high complexity, power user feature)
- **Statistical functions** — different user workflow, separate feature set
- **Parametric/polar graphing** — niche use cases, high complexity

**Anti-features (explicitly avoid):**
- Computer Algebra System (symbolic manipulation) — different product category, enormous complexity
- 3D graphing — WebGL complexity, performance issues, niche need
- Programming mode (hex, binary, bitwise) — different user base, confusing UI
- Step-by-step solutions — CAS-level complexity, different product (WolframAlpha territory)

### Architecture Approach

The current architecture uses centralized state in App.tsx with pure functions in src/logic/ for left-to-right evaluation. This must evolve to support expression-based evaluation while preserving the existing simple mode. The key insight is that the expression parser becomes the foundation for both scientific functions AND graphing—the same parser that evaluates "2+3*sin(45)" also evaluates "sin(x)" by substituting x values.

**Major components:**
1. **Expression Parser (expressionParser.ts)** — mathjs-based evaluation engine that replaces legacy left-to-right logic, serves as foundation for both calculator and graphing features
2. **Scientific UI Layer** — ScientificPanel (toggle panel for scientific buttons), ModeToggle (simple/expression mode switch), AngleToggle (DEG/RAD indicator)
3. **Graph Engine (graphEngine.ts)** — reuses expression parser to evaluate f(x) across x-range, renders via custom Canvas (not SVG for performance)
4. **State Extension** — ExpressionState {expression, cursorPosition, result}, GraphState {expression, visible, xRange, yRange}, AngleMode ('deg'|'rad')

**Key architectural decisions:**
- **Complete cutover, not gradual migration** — simple mode preserved exactly, expression mode is separate code path
- **AngleMode as evaluation context** — DEG/RAD flows through to parser, not just UI state
- **Canvas over SVG** — function plotting with thousands of points requires Canvas performance
- **Build order dependency** — Expression Parser → Scientific Functions → Graph Engine (graph depends on parser)

### Critical Pitfalls

Research identified 15 pitfalls across critical/moderate/minor severity. The top 5 that could cause rewrites:

1. **Expression Parser State Pollution from Legacy Evaluation** — Trying to bolt on PEMDAS while keeping left-to-right evaluation creates dual paths that conflict. **Prevention:** Complete cutover in single phase, remove old evaluation code entirely, redirect all inputs (buttons, keyboard, paste) to single tokenizer.

2. **Floating-Point Precision Theater** — Using scattered `toPrecision(12)` fixes creates bandaid-over-bandaid pattern. Scientific functions expose deeper issues (sin(π) showing 1.22e-16 instead of 0). **Prevention:** Single precision strategy upfront with epsilon for zero-comparisons (Math.abs(x) < 1e-10), unified formatting utility, snap-to-exact at special points (0, π, π/2) for graphing.

3. **DEG/RAD Mode as UI State Instead of Computation Context** — Mode toggle updates React state but doesn't flow to evaluator. User switches to DEG, types sin(90), expects 1, gets 0.89. **Prevention:** Mode is evaluation context passed to all functions, stored with history entries for correct replay, visually prominent indicator.

4. **Expression Parser Without Proper Error Boundaries** — Parser throws on invalid input (2++3), crashes app or breaks calculator state. **Prevention:** Wrap all parser calls in try-catch, distinguish valid/invalid/incomplete states, show live validation feedback, never store unparseable expressions in history.

5. **Unbounded Graph Rendering Performance Cliff** — Fixed sample count works for y=x but browser hangs on y=sin(1/x) which needs dense sampling. **Prevention:** Adaptive sampling (more points where function changes rapidly), Canvas with dirty rectangle optimization, debounce real-time input, set 100ms computation budget.

## Implications for Roadmap

Based on research, suggested phase structure follows technical dependencies and pitfall avoidance:

### Phase 1: Expression Parser + Scientific Functions
**Rationale:** Expression parser is the foundation for everything else. Cannot add scientific functions without PEMDAS, cannot graph without expression evaluation. Must be complete cutover to avoid dual evaluation paths (Pitfall 1).

**Delivers:**
- Full expression-based calculator with PEMDAS operator precedence
- All table-stakes scientific functions (trig, log, exp, constants)
- DEG/RAD mode toggle integrated into evaluation context
- Expression display showing full formula before evaluation
- Scientific notation for large/small numbers
- Proper error handling with domain validation

**Addresses features:**
- Trigonometric functions (sin, cos, tan, inverse) with DEG/RAD mode
- Logarithms (log, ln) and exponentiation (x², x³, xʸ, √x)
- Constants (π, e), factorial, absolute value
- Parentheses with order of operations
- Expression display, error messages, decimal precision

**Avoids pitfalls:**
- Pitfall 1: Complete cutover, no legacy evaluation code left
- Pitfall 2: Unified precision strategy established upfront
- Pitfall 3: Mode as evaluation context from day one
- Pitfall 4: Error boundaries designed into parser integration
- Pitfall 6: Domain validation alongside each function
- Pitfall 7: Cap history to 50 entries before complex expressions

**Stack elements:** mathjs, native Math functions, extended state types

**Complexity:** HIGH — this is the architectural transformation that enables everything else

### Phase 2: Function Graphing
**Rationale:** Graphing reuses the expression parser built in Phase 1. Evaluates "sin(x)" by substituting x values. Depends on parser but is otherwise independent feature. Addresses second major milestone (inline y=f(x) plotting).

**Delivers:**
- Function input field with expression validation
- Custom Canvas-based graph renderer
- Plot y=f(x) with automatic axis scaling
- Zoom in/out and pan/drag navigation
- Axis labels, grid lines, tick marks
- Single function plotting (multiple functions deferred to v2)

**Uses:**
- Expression parser from Phase 1 (reuse for f(x) evaluation)
- Canvas rendering (custom implementation, no library)
- AngleMode context (graphs respect DEG/RAD setting)

**Implements architecture components:**
- GraphPanel, GraphInput components
- graphEngine.ts (function evaluator + renderer)
- useGraphRenderer hook
- GraphState management

**Avoids pitfalls:**
- Pitfall 5: Adaptive sampling, debounced input, Canvas optimization
- Pitfall 10: Smart default bounds, auto-scale to function range
- Pitfall 15: Re-render graph on mode changes

**Complexity:** HIGH — performance-critical rendering, coordinate transformations

### Phase 3: UX Enhancements
**Rationale:** Polish features that improve usability but don't change core functionality. Can be implemented incrementally after core features are solid. Low risk of architecture conflicts.

**Delivers:**
- ANS button (recall previous result)
- History editing (click to load into expression field)
- Keyboard function shortcuts (type "sin(30)")
- Live parenthesis balance indicator
- Arrow key navigation within expressions
- Copy/paste support improvements
- Enhanced keyboard shortcuts documentation

**Addresses features:**
- History editing (extends existing history display)
- ANS button (common calculator feature)
- Keyboard power user features (shortcuts, auto-complete)
- Expression editing improvements

**Complexity:** LOW-MEDIUM — mostly UI enhancements on stable foundation

### Phase Ordering Rationale

- **Phase 1 must come first:** Expression parser is dependency for both scientific functions and graphing. Cannot split—PEMDAS without scientific functions makes no sense, and bolting parser onto existing evaluation creates Pitfall 1.

- **Phase 2 depends on Phase 1:** Graphing reuses parser infrastructure. Building graphing first would require throwaway evaluation logic.

- **Phase 3 is independent polish:** UX enhancements can be done in any order after core functionality exists. Could even be interleaved with earlier phases as time permits.

- **Pitfall avoidance drives structure:** Phase 1's "complete cutover" requirement prevents incremental migration. Phase 2's performance requirements (Pitfall 5) need careful upfront design, not afterthought optimization.

- **Feature dependencies align with phases:** FEATURES.md shows Trigonometric Functions → DEG/RAD toggle, Function Graphing → Expression Parser. The suggested phases respect these dependencies.

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Graphing):** Performance optimization for complex functions may need library investigation if custom Canvas proves insufficient. Research adaptive sampling algorithms. Validate mathjs performance for rapid repeated evaluation.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Expression Parser):** mathjs API is well-documented, expression parsing patterns are established. Implementation is straightforward integration.
- **Phase 3 (UX Enhancements):** Standard React patterns, no novel technical challenges.

**Validation recommended:**
- Test mathjs bundle size impact (claimed ~150KB, verify actual)
- Benchmark mathjs evaluation performance for graphing (1000+ evaluations per frame)
- Verify DEG/RAD handling in mathjs (may need wrapper functions)
- Check implicit multiplication support in mathjs (does "2π" parse?)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | mathjs is established standard, Canvas rendering is straightforward, no framework risks |
| Features | MEDIUM-HIGH | Table stakes based on physical calculator conventions (HIGH), differentiators less validated (MEDIUM) |
| Architecture | HIGH | Expression parser as foundation is sound, component boundaries are clean, state evolution is logical |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls well-documented in domain (floating-point, parsing errors, mode handling), moderate pitfalls based on implementation patterns |

**Overall confidence:** MEDIUM-HIGH

Research is grounded in established domain knowledge (scientific calculators, expression parsing, graph rendering) with clear technology choices. Lower confidence on competitive differentiators and specific library APIs.

### Gaps to Address

**During Phase 1 planning:**
- **Implicit multiplication policy:** Does mathjs support "2π" or require "2*π"? Test early, affects tokenizer design (Pitfall 8).
- **History serialization format:** How to store expressions with mode metadata? Design schema before implementing (Pitfall 7).
- **Error message UX:** What does "good" error feedback look like? User research or competitive analysis needed.

**During Phase 2 planning:**
- **Graphing performance benchmarks:** What's acceptable frame rate on target devices? Define performance budget before building.
- **Axis scaling algorithm:** Auto-scale based on function range—need algorithm for sampling function to determine bounds.
- **Mobile graph interaction:** Pan/zoom gestures on touch vs mouse—design responsive controls.

**Deferred validation:**
- **Feature popularity:** Which differentiators do users actually want? Can validate post-MVP with analytics.
- **Competitive landscape 2026:** What features do current web calculators offer? Validate against Desmos, Symbolab, web2.0calc if accessible.
- **Accessibility requirements:** Screen reader support, keyboard-only navigation—addressed in Phase 3 or later.

## Sources

### Primary (HIGH confidence)
- **STACK.md** — Technology recommendations based on established JavaScript math libraries (mathjs as standard), Canvas rendering patterns, IEEE 754 floating-point knowledge
- **ARCHITECTURE.md** — React component patterns, state management approaches, parsing architecture (PEG, recursive descent patterns)
- **PITFALLS.md** — Floating-point precision issues (IEEE 754 well-documented), parser error handling patterns, React state management anti-patterns

### Secondary (MEDIUM confidence)
- **FEATURES.md** — Scientific calculator conventions from TI-83/84, Casio fx series (decades-old standards), web calculator UX patterns observed in training data
- Physical calculator standards (DEG/RAD toggle, PEMDAS, expression display) — universal expectations
- Mathematical function requirements (domain/range validation) — well-established domain knowledge

### Tertiary (LOW confidence, needs validation)
- mathjs bundle size claim (~150KB minified) — verify actual impact
- Complexity estimates for features (Medium vs High ratings) — implementation-dependent
- Competitive differentiators (what sets product apart) — no current market data
- 2025-2026 web calculator UX trends — training data cutoff limits

### Limitations
- No verification with current (2026) web calculator implementations
- Feature popularity/usage data not available
- No competitive analysis of specific products (Desmos, Symbolab, etc.)
- Performance benchmarks are estimates, hardware-dependent

---
*Research completed: 2026-02-14*
*Ready for roadmap: yes*
