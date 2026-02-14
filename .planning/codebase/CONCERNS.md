# Concerns

## High Priority

### 1. Test Coverage Gaps
- **Files**: `src/logic/inputHandlers.ts`, `src/logic/memoryHandlers.ts`, `src/logic/historyHandlers.ts`, all components
- **Risk**: Refactoring could introduce undetected bugs
- **Impact**: Only `operationHandlers.ts` and `useKeyboardInput.ts` have tests

### 2. Unbounded History Growth
- **File**: `src/logic/historyHandlers.ts:53-58`
- **Issue**: No limit on history entries stored in localStorage
- **Risk**: Eventually hits storage quota with no cleanup or user notification
- **Current**: Silent catch on quota exceeded — user never knows history wasn't saved

### 3. Floating-Point Precision
- **File**: `src/logic/operationHandlers.ts:46-47`
- **Issue**: Uses `toPrecision(12)` as band-aid for floating-point artifacts
- **Risk**: Edge cases with very large numbers or extreme precision still fail
- **Note**: Acceptable for a basic calculator but fragile under edge cases

## Medium Priority

### 4. Error State Recovery
- **File**: `src/App.tsx:96-126`
- **Issue**: Error state ("Error" displayed) is sticky — only "C" clears it
- **Risk**: Users may not know to press Clear after division by zero
- **Suggestion**: Auto-clear on digit input or show recovery hint

### 5. History Entry ID Collisions
- **File**: `src/logic/historyHandlers.ts:26`
- **Issue**: Uses `Date.now()` as unique ID
- **Risk**: Rapid calculations within same millisecond could share IDs

### 6. No Input Bounds Validation
- **File**: `src/logic/inputHandlers.ts:11-29`
- **Issue**: Max 16 digits enforced on input, but no check for `Infinity` or `NaN` in calculation results
- **Risk**: Display could show unexpected values in edge cases

### 7. Memory Value Unbounded
- **File**: `src/App.tsx:16`
- **Issue**: `memoryValue` stored as JavaScript `number` with no bounds checking
- **Risk**: Memory can overflow or accumulate precision loss over many M+ operations

## Low Priority

### 8. Accessibility Gaps
- **File**: `src/styles/Calculator.css:31-38`
- **Issue**: Memory indicator uses opacity 0.7 which reduces contrast; no ARIA labels on buttons
- **Risk**: May not meet WCAG contrast ratios

### 9. Unused CSS Class
- **File**: `src/components/ButtonPanel.tsx:18`, `src/styles/Calculator.css`
- **Issue**: `.btn--wide` class applied to "0" button but no CSS implements column spanning
- **Risk**: Dead code

### 10. Desktop-First CSS
- **File**: `src/styles/Calculator.css:198-271`
- **Issue**: Desktop styles defined first with `max-width` overrides for mobile
- **Risk**: Slightly larger CSS payload on mobile; not standard mobile-first approach

### 11. Unused File
- **File**: `src/App.css`
- **Issue**: Empty file, imported but contains no styles
- **Risk**: Minor dead code

## Security

- **XSS**: Low risk — display values are numbers only, no innerHTML usage
- **localStorage**: JSON.parse wrapped in try-catch, no eval or dynamic execution
- **No sensitive data**: No API keys, credentials, or PII in codebase
