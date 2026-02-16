---
phase: 01-expression-parser-foundation
plan: 03
subsystem: ui-expression-editing
tags: [cursor, keyboard-navigation, expression-editing, click-to-position, ux]

dependency_graph:
  requires:
    - evaluateExpression (from 01-01)
    - Expression state management (from 01-02)
    - Split Display component (from 01-02)
  provides:
    - Cursor helper functions (insertAtCursor, deleteAtCursor, moveCursor)
    - Click-to-position cursor functionality
    - Arrow key navigation (left/right)
    - Blinking cursor rendering
    - Auto-close parentheses
    - Expression editing at cursor position
  affects:
    - Future scientific button panel (Phase 2)
    - History expression re-editing (Phase 5)

tech_stack:
  patterns:
    - Cursor management: Pure functions for cursor manipulation separate from UI
    - Click-to-position: Character width calculation for positioning cursor
    - Auto-scroll: Expression container scrolls to keep cursor visible
    - Blinking cursor: CSS animation for visual feedback
    - Keyboard navigation: Arrow keys, backspace, parentheses
    - Error preservation: Syntax errors keep expression visible for correction

key_files:
  created:
    - src/logic/cursorHelpers.ts: "Pure functions for cursor manipulation and expression editing (142 lines)"
    - src/logic/cursorHelpers.test.ts: "Comprehensive tests for cursor helpers (198 lines, 40 tests)"
  modified:
    - src/components/Display.tsx: "Added cursor rendering and click-to-position (103 lines)"
    - src/App.tsx: "Cursor-aware expression editing and keyboard handlers (287 lines)"
    - src/hooks/useKeyboardInput.ts: "Arrow key and parentheses support (39 lines)"
    - src/styles/Calculator.css: "Blinking cursor animation and text cursor styles (349 lines)"
    - src/components/Calculator.tsx: "Wired click handler and cursor position prop (70 lines)"

decisions:
  - decision: "Auto-close parentheses on '(' input"
    rationale: "Typing '(' inserts '()' with cursor between - improves UX and reduces syntax errors"
    implementation: "insertParenthesis() function in cursorHelpers.ts"
  - decision: "Preserve expression on syntax error"
    rationale: "After equals press with incomplete/invalid expression, show 'Syntax Error' in result but keep expression visible for correction"
    impact: "Better error recovery - user can backspace and fix rather than retyping entire expression"
  - decision: "Separate cursor logic from UI"
    rationale: "Pure functions in cursorHelpers.ts testable independently, no React coupling"
    alternatives: "Inline in components (harder to test), useReducer pattern (overcomplicated for this scope)"
  - decision: "Click-to-position using monospace character width"
    rationale: "Monospace font allows simple character width calculation for cursor positioning"
    implementation: "getCursorPositionFromClick() calculates position from clientX offset"

metrics:
  duration_minutes: 8
  completed_date: "2026-02-16"
  files_created: 2
  files_modified: 5
  lines_added: 447
  tests_added: 40
  commits: 2
---

# Phase 01 Plan 03: Expression Editing with Cursor Management Summary

**One-liner:** Full expression editing experience with blinking cursor, click-to-position, arrow key navigation, cursor-aware insertion/deletion, auto-close parentheses, and error preservation.

## What Was Built

Completed the expression editing UX by implementing full cursor management and editing capabilities:

1. **Cursor helper functions** (`src/logic/cursorHelpers.ts`):
   - `insertAtCursor()`: Insert text at cursor position, return new expression and cursor position
   - `deleteAtCursor()`: Backspace behavior - delete character before cursor
   - `moveCursor()`: Move cursor left/right with boundary clamping
   - `insertParenthesis()`: Auto-close parentheses (insert "()" with cursor between)
   - `getCursorPositionFromClick()`: Calculate cursor position from click coordinates
   - All pure functions - no React dependencies, fully testable

2. **Cursor rendering in Display** (`src/components/Display.tsx`):
   - Blinking line cursor rendered between characters
   - Expression split at cursor position: `beforeCursor | cursor | afterCursor`
   - CSS animation for 1s blink cycle
   - Click handler for positioning cursor via mouse/tap
   - Auto-scroll to keep cursor visible as it moves

3. **Keyboard navigation**:
   - **ArrowLeft/ArrowRight**: Move cursor through expression
   - **Backspace**: Delete character before cursor
   - **Parentheses '(' and ')'**: Auto-close on '(' input
   - Updated `useKeyboardInput.ts` hook with new key mappings

4. **Expression editing in App.tsx**:
   - All button clicks insert at cursor position (not always at end)
   - Cursor position updates after each operation
   - Expression mode uses cursor-aware editing
   - Simple mode behavior completely unchanged (zero regressions)

5. **Error handling flow**:
   - Incomplete expression on equals → "Syntax Error" in result line
   - Expression preserved on top line for correction
   - User can backspace, arrow keys to edit, then retry equals

## Implementation Details

### Cursor Helper Functions

**`insertAtCursor(expression: string, cursorPosition: number, text: string)`**
```typescript
// Insert "5" at position 2 in "12+3"
// Before: "12|+3" (cursor at 2)
// After:  "125|+3" (cursor at 3)
return {
  expression: expression.slice(0, cursorPosition) + text + expression.slice(cursorPosition),
  cursorPosition: cursorPosition + text.length
};
```

**`deleteAtCursor(expression: string, cursorPosition: number)`**
```typescript
// Delete at position 3 in "12+3"
// Before: "12+|3" (cursor at 3)
// After:  "12|3" (cursor at 2)
if (cursorPosition === 0) return { expression, cursorPosition }; // No-op at start
return {
  expression: expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition),
  cursorPosition: cursorPosition - 1
};
```

**`moveCursor(cursorPosition: number, direction: 'left' | 'right', expressionLength: number)`**
```typescript
// Clamp to [0, expressionLength]
const delta = direction === 'left' ? -1 : 1;
return Math.max(0, Math.min(expressionLength, cursorPosition + delta));
```

**`insertParenthesis(expression: string, cursorPosition: number, type: 'open')`**
```typescript
// Insert "()" at position 2
// Before: "2+|3" (cursor at 2)
// After:  "2+(|)3" (cursor at 3, between parentheses)
return {
  expression: expression.slice(0, cursorPosition) + '()' + expression.slice(cursorPosition),
  cursorPosition: cursorPosition + 1
};
```

**`getCursorPositionFromClick(clickOffsetX: number, charWidth: number, expressionLength: number, scrollLeft: number)`**
```typescript
// Calculate position from click X coordinate
// Account for scroll position and round to nearest character boundary
const adjustedX = clickOffsetX + scrollLeft;
const position = Math.round(adjustedX / charWidth);
return Math.max(0, Math.min(expressionLength, position));
```

### Display Component Cursor Rendering

**Expression rendering with cursor:**
```typescript
const beforeCursor = expression.substring(0, cursorPosition);
const afterCursor = expression.substring(cursorPosition);

return (
  <div className="display__expression" onClick={handleClick}>
    <span>{renderExpression(beforeCursor)}</span>
    <span className="display__cursor">|</span>
    <span>{renderExpression(afterCursor)}</span>
  </div>
);
```

**Auto-scroll to keep cursor visible:**
```typescript
useEffect(() => {
  if (expressionRef.current && cursorPosition > 0) {
    // Scroll to show cursor if near right edge
    const container = expressionRef.current;
    const cursorX = cursorPosition * CHAR_WIDTH;
    if (cursorX > container.scrollLeft + container.clientWidth - 20) {
      container.scrollLeft = cursorX - container.clientWidth + 40;
    }
  }
}, [cursorPosition]);
```

### App.tsx Expression Mode Handling

**Button click routing for expression mode:**
```typescript
if (expressionMode === 'expression') {
  // Cursor-aware editing
  if (value >= '0' && value <= '9') {
    const result = insertAtCursor(expression, cursorPosition, value);
    setExpression(result.expression);
    setCursorPosition(result.cursorPosition);
    // Attempt live preview...
  } else if (value === 'Backspace') {
    const result = deleteAtCursor(expression, cursorPosition);
    setExpression(result.expression);
    setCursorPosition(result.cursorPosition);
    // Update preview...
  } else if (value === '(') {
    const result = insertParenthesis(expression, cursorPosition, 'open');
    setExpression(result.expression);
    setCursorPosition(result.cursorPosition);
  } else if (value === 'ArrowLeft') {
    setCursorPosition(moveCursor(cursorPosition, 'left', expression.length));
  } else if (value === 'ArrowRight') {
    setCursorPosition(moveCursor(cursorPosition, 'right', expression.length));
  } else if (value === '=') {
    const result = evaluateExpression(expression);
    if (result.status === 'success') {
      setDisplayValue(result.display!);
      addToHistory(`${expression} = ${result.display}`);
      setExpression('');
      setCursorPosition(0);
      setPreviewResult('');
    } else {
      // ERROR PRESERVATION: Keep expression visible, show error in preview
      setPreviewResult('Syntax Error');
    }
  }
  return; // Early exit - simple mode code below never executes
}

// Simple mode logic here (unchanged)...
```

### CSS Cursor Animation

```css
.display__cursor {
  display: inline-block;
  width: 1px;
  height: 1.2em;
  background-color: #1a1a1a;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin: 0 -0.5px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.display__expression {
  cursor: text;  /* Show text cursor on hover */
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Hide scrollbar */
}
```

## Deviations from Plan

**None** - plan executed exactly as written. All tasks completed without requiring auto-fixes or architectural decisions.

**Notes:**
- Tests written before implementation (TDD approach)
- All 40 cursor helper tests passing
- Build succeeds with no TypeScript errors
- Manual verification completed with 9/9 checks passing (confirmed by human)

## Verification Results

All success criteria met:

✓ **Blinking cursor visible** in expression mode between characters
✓ **Click/tap positions cursor** within expression at character boundaries
✓ **Arrow keys navigate cursor** left/right with boundary clamping
✓ **Buttons insert at cursor position** (not always at end)
✓ **Backspace deletes character before cursor** and updates cursor position
✓ **Auto-close parentheses work** - typing '(' inserts '()' with cursor between
✓ **Incomplete expressions show "Syntax Error"** on equals, expression preserved
✓ **After error, user can backspace and correct** expression and retry
✓ **All keyboard inputs work** (digits, operators, arrows, backspace, parens) in expression mode
✓ **Simple mode is completely unchanged** (no regressions)

### Human Verification Checkpoint (Task 3)

**Status:** APPROVED - All 9 verification checks passed

1. ✓ Simple mode regression test (2+3*4=20 left-to-right)
2. ✓ Expression mode PEMDAS (2+3*4=14)
3. ✓ Parentheses evaluation (2*(3+4)=14)
4. ✓ Auto-close parentheses (typing '(' inserts '()')
5. ✓ Cursor editing (arrow keys, click-to-position)
6. ✓ Backspace updates cursor correctly
7. ✓ Error handling preserves expression
8. ✓ Implicit multiplication (2(3)=6)
9. ✓ Mode switching preserves state

## Test Coverage

**Unit Tests:**
- 40 tests in `src/logic/cursorHelpers.test.ts`
- Coverage includes:
  - `insertAtCursor`: Empty string, start/middle/end insertion, cursor position updates
  - `deleteAtCursor`: At position 0 (no-op), middle, end, cursor updates
  - `moveCursor`: Left from 0 (clamped), right from end (clamped), normal movement
  - `insertParenthesis`: Empty expression, middle, end positions
  - `getCursorPositionFromClick`: Character boundary snapping, scroll offset handling

**Integration Tests:**
- Manual verification of complete expression editing flow
- Simple mode regression testing (unchanged behavior)
- Mode switching state preservation
- Error handling and recovery

## Phase 1 Completion

**This plan completes Phase 01: Expression Parser Foundation**

All Phase 1 objectives achieved:
1. ✓ PEMDAS expression evaluation engine (mathjs)
2. ✓ Two-line display (expression + result)
3. ✓ Simple/Expression mode toggle
4. ✓ Full expression editing with cursor management
5. ✓ Error handling and recovery
6. ✓ Live preview evaluation
7. ✓ Keyboard and click input support

**Ready for Phase 2:** Scientific functions can now be added with confidence that the expression editing UX is complete.

## Files Changed

**Created:**
- `/Users/angel-ai/angelProjects/web-calculator/src/logic/cursorHelpers.ts` (142 lines)
- `/Users/angel-ai/angelProjects/web-calculator/src/logic/cursorHelpers.test.ts` (198 lines, 40 tests)

**Modified:**
- `/Users/angel-ai/angelProjects/web-calculator/src/components/Display.tsx` (103 lines, +64 from original 39)
- `/Users/angel-ai/angelProjects/web-calculator/src/App.tsx` (287 lines, +56 from original 231)
- `/Users/angel-ai/angelProjects/web-calculator/src/hooks/useKeyboardInput.ts` (39 lines, +10 from original 29)
- `/Users/angel-ai/angelProjects/web-calculator/src/styles/Calculator.css` (349 lines, +15 from original 334)
- `/Users/angel-ai/angelProjects/web-calculator/src/components/Calculator.tsx` (70 lines, +9 from original 61)

## Commits

| Task | Type | Hash    | Message                                                     |
| ---- | ---- | ------- | ----------------------------------------------------------- |
| 1    | feat | d52ac1d | implement cursor editing and expression manipulation        |
| 2    | feat | 1041108 | add cursor rendering and click-to-position                  |
| 3    | n/a  | n/a     | Human verification checkpoint (no code changes)             |

## Self-Check: PASSED

**Files created verification:**
```bash
✓ FOUND: src/logic/cursorHelpers.ts
✓ FOUND: src/logic/cursorHelpers.test.ts
```

**Files modified verification:**
```bash
✓ FOUND: src/components/Display.tsx (cursor rendering)
✓ FOUND: src/App.tsx (cursor-aware editing)
✓ FOUND: src/hooks/useKeyboardInput.ts (arrow keys, parentheses)
✓ FOUND: src/styles/Calculator.css (cursor animation)
✓ FOUND: src/components/Calculator.tsx (click handler)
```

**Commits verification:**
```bash
✓ FOUND: d52ac1d (feat(01-03): implement cursor editing and expression manipulation)
✓ FOUND: 1041108 (feat(01-03): add cursor rendering and click-to-position)
```

**Test execution verification:**
```bash
✓ All 40 cursor helper tests passing
✓ Build succeeds with no errors
✓ Human verification: 9/9 checks passed
```

All verification checks passed. Plan 01-03 complete. Phase 01 complete.
