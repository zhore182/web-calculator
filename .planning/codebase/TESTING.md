# Testing

## Framework

- **Test runner**: Vitest 4.0.18
- **DOM environment**: jsdom (configured in `vite.config.ts`)
- **React testing**: @testing-library/react 16.3.2
- **Test command**: `npm run test` (runs `vitest`)

## Configuration

```typescript
// vite.config.ts
test: {
  environment: 'jsdom',
}
```

No coverage tools or thresholds configured.

## Test Files

Tests are co-located with source files using `*.test.ts` suffix:

| Test File | Lines | Coverage |
|-----------|-------|----------|
| `src/logic/operationHandlers.test.ts` | ~295 | Operation chaining, division by zero, decimals |
| `src/hooks/useKeyboardInput.test.ts` | ~143 | Key mapping, guards, cleanup |

## Untested Files

- `src/logic/inputHandlers.ts` — No tests
- `src/logic/memoryHandlers.ts` — No tests
- `src/logic/historyHandlers.ts` — No tests
- `src/components/*` — No component tests

## Test Patterns

### Structure
```typescript
describe('Feature', () => {
  describe('Sub-feature', () => {
    it('should do expected behavior', () => {
      // Arrange → Act → Assert
    });
  });
});
```

### State Transformation Testing (`operationHandlers.test.ts`)
Tests simulate multi-step calculator interactions by threading state through handler functions:
```typescript
let state: CalculatorState = { displayValue: '2', previousValue: null, operator: null, waitingForOperand: false };
state = handleOperatorInput(state, '+');
expect(state.operator).toBe('+');
state = handleDigitInput(state, '3');
state = handleEqualsInput(state);
expect(state.displayValue).toBe('5');
```

### Hook Testing (`useKeyboardInput.test.ts`)
Uses `renderHook` from @testing-library/react:
```typescript
renderHook(() => useKeyboardInput(onButtonClick));
dispatchKey({ key: '5' });
expect(onButtonClick).toHaveBeenCalledWith('5');
```

### Mocking
```typescript
import { vi } from 'vitest';
onButtonClick = vi.fn<(value: string) => void>();
afterEach(() => { vi.restoreAllMocks(); });
```

### Helper Functions
```typescript
function dispatchKey(options: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent('keydown', { ...options, bubbles: true }));
}
```
