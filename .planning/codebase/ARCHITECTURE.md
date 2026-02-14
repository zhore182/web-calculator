# Architecture

## Pattern

**Component-Based with Centralized State** — React functional components with pure business logic functions separated into a dedicated logic layer.

## Layers

### 1. Component Layer (`src/components/`)
Presentational and container components:
- `Calculator.tsx` — Container orchestrating Display, ButtonPanel, HistoryPanel
- `Display.tsx` — Shows current value and memory indicator
- `Button.tsx` — Atomic button element
- `ButtonPanel.tsx` — 4-column grid of calculator buttons
- `HistoryPanel.tsx` — History list with click-to-restore and clear

### 2. Logic Layer (`src/logic/`)
Pure functions — no side effects, accept state and return new state:
- `operationHandlers.ts` — Arithmetic operations, `calculate()`, `handleOperatorInput()`, `handleEqualsInput()`
- `inputHandlers.ts` — Digit and decimal point input with validation
- `memoryHandlers.ts` — M+, M-, MR, MC operations
- `historyHandlers.ts` — History entry creation, localStorage persistence

### 3. State Management (`src/App.tsx`)
Centralized in root component using `useState` hooks:
```typescript
const [displayValue, setDisplayValue] = useState('0');
const [previousValue, setPreviousValue] = useState<string | null>(null);
const [operator, setOperator] = useState<string | null>(null);
const [waitingForOperand, setWaitingForOperand] = useState(false);
const [memoryValue, setMemoryValue] = useState(0);
const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
```

### 4. Hooks Layer (`src/hooks/`)
- `useKeyboardInput.ts` — Custom hook for keyboard event handling with guards for repeat keys, modifier keys, and form field focus

### 5. Styling Layer (`src/styles/`)
- `Calculator.css` — All component styles with responsive breakpoints

## Data Flow

Unidirectional, top-down:

```
User Input (click/keyboard)
  → App.handleButtonClick()
    → Pure logic function (e.g., handleDigitInput())
      → Returns new state
    → setState() updates
      → React re-renders affected components
```

## Entry Points

- `src/main.tsx` — Application entry, renders `<App />` to `#root`
- `index.html` — HTML template with Vite module script

## Key Abstractions

### CalculatorState (`src/logic/operationHandlers.ts`)
```typescript
export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForOperand: boolean;
}
```

### HistoryEntry (`src/logic/historyHandlers.ts`)
```typescript
export interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
}
```

## Persistence

- History entries persisted to `localStorage` under key `calculator-history`
- Loaded on mount via `useEffect` with ref guard (`historyLoadedRef`) to prevent double-loading in StrictMode
- Silent failure on storage errors (quota exceeded, privacy mode)
