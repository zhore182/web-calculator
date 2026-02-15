# Architecture Research: Scientific Calculator + Graphing

**Dimension:** Architecture
**Confidence:** MEDIUM-HIGH

## Current Architecture

```
User Input → App.handleButtonClick() → Pure logic fn → New state → Re-render
```

- Centralized state in App.tsx (useState hooks)
- Pure functions in src/logic/ (operationHandlers, inputHandlers, memoryHandlers, historyHandlers)
- Left-to-right evaluation only (no operator precedence)
- CalculatorState: { displayValue, previousValue, operator, waitingForOperand }

## Proposed Architecture

### New Components

```
src/
├── components/
│   ├── Calculator.tsx          # Updated — orchestrates all panels
│   ├── Display.tsx             # Updated — shows expression in expression mode
│   ├── ButtonPanel.tsx         # Existing basic buttons
│   ├── ScientificPanel.tsx     # NEW — toggle panel for scientific buttons
│   ├── ModeToggle.tsx          # NEW — simple/expression mode switch
│   ├── AngleToggle.tsx         # NEW — DEG/RAD switch
│   ├── GraphPanel.tsx          # NEW — inline graph below calculator
│   └── GraphInput.tsx          # NEW — function expression input for graphing
├── logic/
│   ├── operationHandlers.ts    # Existing — basic ops (keep for simple mode)
│   ├── expressionParser.ts     # NEW — mathjs-based expression evaluation
│   ├── scientificHandlers.ts   # NEW — scientific function button handlers
│   ├── graphEngine.ts          # NEW — function evaluation + Canvas rendering
│   └── formatters.ts           # NEW — result formatting (scientific notation, etc.)
├── hooks/
│   ├── useKeyboardInput.ts     # Updated — add scientific key bindings
│   └── useGraphRenderer.ts     # NEW — Canvas rendering hook
```

### State Evolution

Current CalculatorState needs expansion:

```typescript
// Extended state for expression mode
interface ExpressionState {
  expression: string;           // Full expression string "2+3*sin(45)"
  cursorPosition: number;       // Cursor position within expression
  result: string | null;        // Evaluated result (null = not yet evaluated)
}

// Calculator mode
type CalculatorMode = 'simple' | 'expression';
type AngleMode = 'deg' | 'rad';

// Graph state
interface GraphState {
  expression: string;           // Function expression "sin(x)"
  visible: boolean;             // Is graph panel shown
  xRange: [number, number];     // Viewport x range
  yRange: [number, number];     // Viewport y range
}
```

### Data Flow

**Simple Mode (existing):**
```
Button click → handleButtonClick → operationHandlers → setState
```

**Expression Mode (new):**
```
Button click → append to expression string → display expression
    → on "=" → expressionParser.evaluate(expression, angleMode) → display result
```

**Graphing:**
```
User types f(x) → graphEngine.evaluate(expression, xRange) → Canvas render
```

### Component Boundaries

| Component | Inputs | Outputs | Talks to |
|-----------|--------|---------|----------|
| ScientificPanel | onButtonClick | button value | App (via callback) |
| ModeToggle | currentMode | mode change | App (via callback) |
| AngleToggle | currentAngle | angle change | App (via callback) |
| GraphPanel | expression, ranges | none (renders Canvas) | graphEngine |
| GraphInput | value | expression change | App (via callback) |

### Key Architectural Decisions

1. **Expression parser is the foundation** — both expression mode AND graphing depend on parsing math expressions. Build this first.

2. **Simple mode preserved exactly** — the existing left-to-right evaluation stays for simple mode. Expression mode is a separate code path, not a modification of the existing one.

3. **Graph evaluator reuses expression parser** — the same parser that evaluates "2+3*sin(45)" also evaluates "sin(x)" by substituting x values.

4. **AngleMode flows through evaluation context** — DEG/RAD is not UI state that transforms input. It's passed to the evaluation engine so trig functions know which mode they're in.

5. **Canvas, not SVG** — for function plotting with potentially thousands of points, Canvas is more performant than SVG DOM nodes.

## Suggested Build Order

1. **Expression Parser + Scientific Functions** — the core engine that everything else depends on
2. **Scientific UI (toggle panel, buttons, mode toggle, DEG/RAD)** — surface the engine capabilities
3. **Expression Input Mode** — full expression editing in the display
4. **Graph Engine + Graph Panel** — function plotting (depends on expression parser)

### Dependencies

```
Expression Parser ──→ Expression Mode
       │
       ├──→ Scientific Functions (use parser for complex expressions)
       │
       └──→ Graph Engine (evaluates f(x) using parser)
```

## Integration Points

- **History** — expression mode should save full expressions to history, not just "a op b = c"
- **Memory** — M+/M- work with the displayed result regardless of mode
- **Keyboard** — needs extension for parentheses, scientific function shortcuts
- **Display** — must show full expressions (potentially scrollable) in expression mode

---
*Architecture research: 2026-02-14*
