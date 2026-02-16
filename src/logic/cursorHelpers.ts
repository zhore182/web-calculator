/**
 * Cursor manipulation and expression editing helper functions.
 * These are pure functions that operate on expression strings and cursor positions.
 */

/**
 * Insert text into expression at cursor position.
 * Returns { expression, cursorPosition } after insertion.
 */
export function insertAtCursor(
  expression: string,
  cursorPosition: number,
  text: string
): { expression: string; cursorPosition: number } {
  const before = expression.slice(0, cursorPosition);
  const after = expression.slice(cursorPosition);
  const newExpression = before + text + after;
  const newCursorPosition = cursorPosition + text.length;

  return {
    expression: newExpression,
    cursorPosition: newCursorPosition,
  };
}

/**
 * Delete character before cursor position (backspace behavior).
 * Returns { expression, cursorPosition } after deletion.
 */
export function deleteAtCursor(
  expression: string,
  cursorPosition: number
): { expression: string; cursorPosition: number } {
  // If cursor is at position 0, nothing to delete
  if (cursorPosition === 0) {
    return { expression, cursorPosition };
  }

  const before = expression.slice(0, cursorPosition - 1);
  const after = expression.slice(cursorPosition);
  const newExpression = before + after;
  const newCursorPosition = cursorPosition - 1;

  return {
    expression: newExpression,
    cursorPosition: newCursorPosition,
  };
}

/**
 * Move cursor left or right within expression bounds.
 * Returns new cursor position, clamped to [0, expression.length].
 */
export function moveCursor(
  cursorPosition: number,
  direction: 'left' | 'right',
  expressionLength: number
): number {
  if (direction === 'left') {
    return Math.max(0, cursorPosition - 1);
  } else {
    return Math.min(expressionLength, cursorPosition + 1);
  }
}

/**
 * Insert opening parenthesis with auto-close.
 * Per user decision: typing '(' inserts '()' with cursor between.
 * Returns { expression, cursorPosition }.
 */
export function insertParenthesis(
  expression: string,
  cursorPosition: number,
  _type: 'open'
): { expression: string; cursorPosition: number } {
  const before = expression.slice(0, cursorPosition);
  const after = expression.slice(cursorPosition);
  const newExpression = before + '()' + after;
  // Position cursor between the parentheses
  const newCursorPosition = cursorPosition + 1;

  return {
    expression: newExpression,
    cursorPosition: newCursorPosition,
  };
}

/**
 * Calculate cursor position from a click/tap x-coordinate on the expression display.
 * Given character widths and click position, determine which character boundary
 * the cursor should snap to.
 */
export function getCursorPositionFromClick(
  clickOffsetX: number,
  charWidth: number,
  expressionLength: number,
  scrollLeft: number
): number {
  // Adjust for scroll position
  const adjustedX = clickOffsetX + scrollLeft;

  // Calculate which character position was clicked
  // Round to nearest character boundary
  const position = Math.round(adjustedX / charWidth);

  // Clamp to valid range [0, expressionLength]
  return Math.max(0, Math.min(expressionLength, position));
}
