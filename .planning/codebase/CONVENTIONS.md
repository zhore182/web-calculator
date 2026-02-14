# Conventions

## TypeScript

- **Strict mode** enabled (`tsconfig.app.json`): `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **Type imports** use `import type` syntax: `import type { CalculatorState } from './logic/operationHandlers'`
- **Interfaces** preferred over type aliases for object shapes
- **Props interfaces** exported and named `{Component}Props`

## Import Organization

Order observed in `src/App.tsx`:
1. React imports: `import { useState, useCallback, useEffect, useRef } from 'react'`
2. Local components: `import Calculator from './components/Calculator'`
3. Logic/utilities: `import { handleDigitInput } from './logic/inputHandlers'`
4. Type imports: `import type { CalculatorState } from './logic/operationHandlers'`
5. Styles: `import './App.css'`

All imports use relative paths.

## Code Style

- **Pure functions** for all business logic — accept state, return new state, no side effects
- **`useCallback`** for stable function references passed as props
- **`useEffect`** for side effects (localStorage sync, keyboard listener setup)
- **`useRef`** for mutable values that shouldn't trigger re-renders (e.g., `historyLoadedRef`)
- **Default exports** for React components
- **Named exports** for logic functions and interfaces

## Error Handling

- **Division by zero**: `calculate()` returns `null`, caller sets display to `"Error"`
- **Error state**: Display shows `"Error"` string; only "C" (clear) recovers
- **localStorage failures**: Try-catch with silent failure (graceful degradation)
- **Input guards**: Keyboard hook guards against repeat keys, modifier keys, and form field focus

## Patterns

### State Helper Pattern (`src/App.tsx`)
```typescript
const getCurrentState = (): CalculatorState => ({
  displayValue, previousValue, operator, waitingForOperand
});

const applyState = (newState: CalculatorState) => {
  setDisplayValue(newState.displayValue);
  setPreviousValue(newState.previousValue);
  setOperator(newState.operator);
  setWaitingForOperand(newState.waitingForOperand);
};
```

### Centralized Handler Pattern (`src/App.tsx`)
Single `handleButtonClick` dispatches to appropriate logic function based on button value, using early returns for each case (digits, operators, equals, clear, memory, etc.).

### CSS
- BEM-like naming: `.btn`, `.btn--operator`, `.btn--wide`, `.btn--equals`
- Desktop-first responsive: base styles for desktop, `@media (max-width)` overrides for tablet/mobile
- Single CSS file for all components (`src/styles/Calculator.css`)
