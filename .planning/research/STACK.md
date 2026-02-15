# Stack Research: Scientific Calculator + Graphing

**Dimension:** Stack
**Confidence:** MEDIUM-HIGH

## Expression Parsing

### Recommended: math.js

- **Library:** `mathjs` (latest stable)
- **Why:** Battle-tested expression parser with full PEMDAS, scientific functions built-in (sin, cos, tan, log, sqrt, pow, etc.), supports custom function definitions, unit-aware, and handles parenthesized expressions natively
- **Why not roll your own:** Expression parsing with proper operator precedence, associativity, parentheses, and function calls is a solved problem. A hand-rolled parser will have edge cases for months
- **Confidence:** HIGH — mathjs is the de facto standard for JS math expression evaluation

### Alternative: Custom parser with Pratt parsing

- **When:** If mathjs feels too heavy (it's ~150KB minified) and you want zero dependencies
- **Tradeoff:** Significant development effort, but full control over syntax and error messages
- **Recommendation:** Start with mathjs, consider custom parser only if bundle size becomes a real concern

### What NOT to use

- **eval() / Function():** Security risk, no error handling, no custom function support
- **expr-eval:** Smaller but less maintained, fewer built-in functions
- **algebra.js:** Focused on symbolic algebra, not numeric evaluation

## Graphing / Plotting

### Recommended: Custom Canvas rendering

- **Why:** For single-function plotting (y=f(x)), a Canvas-based renderer is straightforward (~200-300 lines), gives full control over styling, and adds zero dependencies
- **Approach:** Evaluate expression at N points across viewport, draw path on `<canvas>`, add axis lines and labels
- **Confidence:** HIGH — simple function plotting doesn't need a library

### Alternative: function-plot

- **Library:** `function-plot` (built on d3.js)
- **Why:** Full-featured function plotter with zoom/pan, axis labels, derivatives
- **Why NOT:** Pulls in d3.js (~200KB), overkill for single-function plotting
- **When to consider:** If you later want multi-function overlay, derivatives, or interactive features

### What NOT to use

- **Chart.js / Recharts / Nivo:** Data visualization libraries, not function plotters — wrong tool
- **Plotly.js:** Very heavy (~3MB), designed for dashboards not calculators
- **Three.js:** 3D rendering, complete overkill

## Scientific Math Functions

### Recommended: Native JavaScript Math + mathjs

- **Built-in Math:** `Math.sin`, `Math.cos`, `Math.tan`, `Math.log`, `Math.sqrt`, `Math.pow`, `Math.PI`, `Math.E` — these are fast and precise
- **mathjs additions:** Factorial, permutations, combinations, inverse trig (asin, acos, atan), hyperbolic functions, log base N
- **DEG/RAD:** Simple wrapper: `deg2rad = (deg) => deg * Math.PI / 180`
- **Confidence:** HIGH — native Math is IEEE 754 compliant

## Floating-Point Precision

### Recommended: Stay with native numbers, improve formatting

- **Why:** For a calculator, native 64-bit floats give 15-17 significant digits — more than sufficient
- **Approach:** Better result formatting (handle scientific notation for very large/small numbers, clean trailing zeros) rather than switching to arbitrary precision
- **Confidence:** HIGH

### Alternative: decimal.js

- **When:** If users report precision issues with scientific calculations
- **Tradeoff:** Slower computation, larger bundle, more complex integration
- **Recommendation:** Don't add until you have evidence of precision problems

## No New Framework Dependencies

- **React 19** — keep as-is
- **TypeScript** — keep as-is
- **Vite** — keep as-is
- **Vitest** — keep as-is
- **No state management library needed** — useState + useCallback is sufficient for calculator state

## Summary

| Component | Choice | Size Impact | Confidence |
|-----------|--------|-------------|------------|
| Expression parser | mathjs | ~150KB min | HIGH |
| Graphing | Custom Canvas | ~0KB | HIGH |
| Scientific math | Native Math + mathjs | included | HIGH |
| Precision | Native floats + better formatting | ~0KB | HIGH |

**Total new dependency:** 1 (mathjs)

---
*Stack research: 2026-02-14*
