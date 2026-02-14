# Structure

## Directory Layout

```
web-calculator/
├── src/
│   ├── components/
│   │   ├── Button.tsx            # Atomic button component
│   │   ├── ButtonPanel.tsx       # 4-column grid of buttons
│   │   ├── Calculator.tsx        # Main container component
│   │   ├── Display.tsx           # Current value + memory indicator
│   │   └── HistoryPanel.tsx      # History list and clear button
│   ├── hooks/
│   │   ├── useKeyboardInput.ts       # Keyboard event handling hook
│   │   └── useKeyboardInput.test.ts  # Hook tests
│   ├── logic/
│   │   ├── operationHandlers.ts      # Arithmetic operations
│   │   ├── operationHandlers.test.ts # Operation tests
│   │   ├── inputHandlers.ts          # Digit/decimal input
│   │   ├── memoryHandlers.ts         # M+, M-, MR, MC
│   │   └── historyHandlers.ts        # History CRUD + localStorage
│   ├── styles/
│   │   └── Calculator.css        # All component styles + responsive
│   ├── App.tsx                   # Root component, state management
│   ├── App.css                   # Empty (unused)
│   ├── index.css                 # Global reset + body styles
│   └── main.tsx                  # Entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite + Vitest configuration
├── tsconfig.json                 # Project references
├── tsconfig.app.json             # App TypeScript config (strict)
├── tsconfig.node.json            # Build tool TypeScript config
├── eslint.config.js              # ESLint configuration
└── README.md                     # Template docs
```

## Key Locations

| What | Where |
|------|-------|
| Root component | `src/App.tsx` |
| All components | `src/components/` |
| Business logic | `src/logic/` |
| Custom hooks | `src/hooks/` |
| Styles | `src/styles/Calculator.css` |
| Tests | Co-located as `*.test.ts` |
| Entry point | `src/main.tsx` |
| Build config | `vite.config.ts` |
| TypeScript config | `tsconfig.app.json` (strict) |

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase | `Calculator`, `ButtonPanel`, `HistoryPanel` |
| Files (components) | PascalCase.tsx | `Calculator.tsx`, `Display.tsx` |
| Files (logic) | camelCase.ts | `operationHandlers.ts`, `inputHandlers.ts` |
| Files (hooks) | camelCase.ts | `useKeyboardInput.ts` |
| Files (tests) | `{source}.test.ts` | `operationHandlers.test.ts` |
| Functions | camelCase | `handleDigitInput`, `calculateResult` |
| Event handlers | `handle{Action}` | `handleButtonClick`, `handleEqualsInput` |
| Interfaces | PascalCase | `CalculatorState`, `HistoryEntry`, `CalculatorProps` |
| CSS classes | kebab-case + BEM-like | `.btn--operator`, `.history-entry` |
| Constants | N/A (none used) | — |
