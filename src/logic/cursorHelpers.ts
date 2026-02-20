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

/**
 * Insert a function into expression with smart auto-wrap behavior.
 * If a complete number exists before cursor, wraps it: 45| + sin → sin(45)|
 * Otherwise inserts empty function call with auto-closed parentheses: | + sin → sin(|)
 *
 * @param expression - The current expression string
 * @param cursorPosition - Current cursor position
 * @param funcName - Function name in lowercase (sin, cos, log, etc.)
 * @returns Updated expression and cursor position
 */
export function insertFunction(
  expression: string,
  cursorPosition: number,
  funcName: string
): { expression: string; cursorPosition: number } {
  // Check for a completed number immediately before cursor
  // A number is a sequence of digits possibly with a decimal point
  let numStart = cursorPosition;
  let hasNumber = false;

  // Scan backwards from cursor to find start of number
  while (numStart > 0) {
    const char = expression[numStart - 1];
    if (/[0-9.]/.test(char)) {
      numStart--;
      hasNumber = true;
    } else {
      break;
    }
  }

  if (hasNumber) {
    // Extract the number
    const number = expression.slice(numStart, cursorPosition);

    // Build new expression: before number + funcName(number) + after cursor
    const before = expression.slice(0, numStart);
    const after = expression.slice(cursorPosition);
    const newExpression = before + funcName + '(' + number + ')' + after;

    // Position cursor after closing parenthesis
    const newCursorPosition = numStart + funcName.length + 1 + number.length + 1;

    return {
      expression: newExpression,
      cursorPosition: newCursorPosition,
    };
  } else {
    // No number before cursor - insert empty function call with auto-close
    const before = expression.slice(0, cursorPosition);
    const after = expression.slice(cursorPosition);
    const newExpression = before + funcName + '()' + after;

    // Position cursor between parentheses
    const newCursorPosition = cursorPosition + funcName.length + 1;

    return {
      expression: newExpression,
      cursorPosition: newCursorPosition,
    };
  }
}

/**
 * Insert a mathematical constant (pi or e) at cursor position.
 * The constant is inserted as a string that mathjs can evaluate.
 *
 * @param expression - The current expression string
 * @param cursorPosition - Current cursor position
 * @param constant - The constant string ('pi' or 'e')
 * @returns Updated expression and cursor position
 */
export function insertConstant(
  expression: string,
  cursorPosition: number,
  constant: string
): { expression: string; cursorPosition: number } {
  return insertAtCursor(expression, cursorPosition, constant);
}
