import { describe, it, expect } from 'vitest';
import {
  insertAtCursor,
  deleteAtCursor,
  moveCursor,
  insertParenthesis,
  getCursorPositionFromClick,
  insertFunction,
  insertConstant,
} from './cursorHelpers';

describe('insertAtCursor', () => {
  it('should insert text at the beginning of an empty expression', () => {
    const result = insertAtCursor('', 0, '5');
    expect(result).toEqual({
      expression: '5',
      cursorPosition: 1,
    });
  });

  it('should insert text at the end of an expression', () => {
    const result = insertAtCursor('5', 1, '+');
    expect(result).toEqual({
      expression: '5+',
      cursorPosition: 2,
    });
  });

  it('should insert text in the middle of an expression', () => {
    const result = insertAtCursor('5+', 1, '3');
    expect(result).toEqual({
      expression: '53+',
      cursorPosition: 2,
    });
  });

  it('should insert multi-character text', () => {
    const result = insertAtCursor('2+', 2, '10');
    expect(result).toEqual({
      expression: '2+10',
      cursorPosition: 4,
    });
  });
});

describe('deleteAtCursor', () => {
  it('should do nothing when cursor is at position 0', () => {
    const result = deleteAtCursor('123', 0);
    expect(result).toEqual({
      expression: '123',
      cursorPosition: 0,
    });
  });

  it('should delete character before cursor at end of expression', () => {
    const result = deleteAtCursor('123', 3);
    expect(result).toEqual({
      expression: '12',
      cursorPosition: 2,
    });
  });

  it('should delete character in the middle of expression', () => {
    const result = deleteAtCursor('5+3', 2);
    expect(result).toEqual({
      expression: '53',
      cursorPosition: 1,
    });
  });

  it('should handle deleting from single character expression', () => {
    const result = deleteAtCursor('5', 1);
    expect(result).toEqual({
      expression: '',
      cursorPosition: 0,
    });
  });
});

describe('moveCursor', () => {
  it('should not move left from position 0 (clamped)', () => {
    const result = moveCursor(0, 'left', 5);
    expect(result).toBe(0);
  });

  it('should not move right from end (clamped)', () => {
    const result = moveCursor(5, 'right', 5);
    expect(result).toBe(5);
  });

  it('should move left from middle position', () => {
    const result = moveCursor(3, 'left', 5);
    expect(result).toBe(2);
  });

  it('should move right from middle position', () => {
    const result = moveCursor(3, 'right', 5);
    expect(result).toBe(4);
  });

  it('should move left from position 1 to 0', () => {
    const result = moveCursor(1, 'left', 3);
    expect(result).toBe(0);
  });

  it('should move right from position 0 to 1', () => {
    const result = moveCursor(0, 'right', 3);
    expect(result).toBe(1);
  });
});

describe('insertParenthesis', () => {
  it('should insert () with cursor in between in empty expression', () => {
    const result = insertParenthesis('', 0, 'open');
    expect(result).toEqual({
      expression: '()',
      cursorPosition: 1,
    });
  });

  it('should insert () at end of expression', () => {
    const result = insertParenthesis('2+', 2, 'open');
    expect(result).toEqual({
      expression: '2+()',
      cursorPosition: 3,
    });
  });

  it('should insert () in middle of expression', () => {
    const result = insertParenthesis('2+3', 2, 'open');
    expect(result).toEqual({
      expression: '2+()3',
      cursorPosition: 3,
    });
  });

  it('should insert () at beginning of expression', () => {
    const result = insertParenthesis('2+3', 0, 'open');
    expect(result).toEqual({
      expression: '()2+3',
      cursorPosition: 1,
    });
  });
});

describe('getCursorPositionFromClick', () => {
  it('should position cursor at start when clicking near left edge', () => {
    // Character width 10px, clicking at x=2 (near start)
    const result = getCursorPositionFromClick(2, 10, 5, 0);
    expect(result).toBe(0);
  });

  it('should position cursor at end when clicking past end', () => {
    // Character width 10px, expression length 5, clicking at x=60 (past end)
    const result = getCursorPositionFromClick(60, 10, 5, 0);
    expect(result).toBe(5);
  });

  it('should position cursor at nearest character boundary in middle', () => {
    // Character width 10px, clicking at x=25 (between chars 2 and 3)
    const result = getCursorPositionFromClick(25, 10, 5, 0);
    expect(result).toBe(3); // Rounds to 3
  });

  it('should account for scroll position', () => {
    // Character width 10px, clicking at x=5, scrolled 20px
    const result = getCursorPositionFromClick(5, 10, 10, 20);
    expect(result).toBe(3); // (5 + 20) / 10 = 2.5, rounds to 3
  });

  it('should clamp negative results to 0', () => {
    // Edge case: clicking before start with scroll
    const result = getCursorPositionFromClick(0, 10, 5, 0);
    expect(result).toBe(0);
  });
});

describe('insertFunction', () => {
  it('should insert empty function call in empty expression', () => {
    const result = insertFunction('', 0, 'sin');
    expect(result).toEqual({
      expression: 'sin()',
      cursorPosition: 4, // Between parentheses
    });
  });

  it('should wrap complete number at end of expression', () => {
    const result = insertFunction('45', 2, 'sin');
    expect(result).toEqual({
      expression: 'sin(45)',
      cursorPosition: 7, // After closing paren
    });
  });

  it('should wrap complete number after operator', () => {
    const result = insertFunction('2+45', 4, 'cos');
    expect(result).toEqual({
      expression: '2+cos(45)',
      cursorPosition: 9,
    });
  });

  it('should insert empty function when cursor after operator', () => {
    const result = insertFunction('2+', 2, 'tan');
    expect(result).toEqual({
      expression: '2+tan()',
      cursorPosition: 6, // Between parentheses
    });
  });

  it('should wrap decimal number', () => {
    const result = insertFunction('3.14', 4, 'sin');
    expect(result).toEqual({
      expression: 'sin(3.14)',
      cursorPosition: 9,
    });
  });

  it('should insert empty function when cursor after multiplication operator', () => {
    const result = insertFunction('2+3*', 4, 'log');
    expect(result).toEqual({
      expression: '2+3*log()',
      cursorPosition: 8, // Between parentheses (4 + 'log'.length(3) + 1)
    });
  });

  it('should wrap number when cursor in middle of expression', () => {
    const result = insertFunction('123+456', 3, 'sin');
    expect(result).toEqual({
      expression: 'sin(123)+456',
      cursorPosition: 8,
    });
  });

  it('should insert empty function when cursor at beginning of expression', () => {
    const result = insertFunction('123', 0, 'cos');
    expect(result).toEqual({
      expression: 'cos()123',
      cursorPosition: 4,
    });
  });

  it('should wrap number with various function names', () => {
    const result1 = insertFunction('90', 2, 'sqrt');
    expect(result1).toEqual({
      expression: 'sqrt(90)',
      cursorPosition: 8,
    });

    const result2 = insertFunction('100', 3, 'log');
    expect(result2).toEqual({
      expression: 'log(100)',
      cursorPosition: 8,
    });

    const result3 = insertFunction('1', 1, 'ln');
    expect(result3).toEqual({
      expression: 'ln(1)',
      cursorPosition: 5,
    });
  });
});

describe('insertConstant', () => {
  it('should insert pi in empty expression', () => {
    const result = insertConstant('', 0, 'pi');
    expect(result).toEqual({
      expression: 'pi',
      cursorPosition: 2,
    });
  });

  it('should insert pi after number (implicit multiplication)', () => {
    const result = insertConstant('2', 1, 'pi');
    expect(result).toEqual({
      expression: '2pi',
      cursorPosition: 3,
    });
  });

  it('should insert e after operator', () => {
    const result = insertConstant('2+', 2, 'e');
    expect(result).toEqual({
      expression: '2+e',
      cursorPosition: 3,
    });
  });

  it('should insert pi in middle of expression', () => {
    const result = insertConstant('2*3', 2, 'pi');
    expect(result).toEqual({
      expression: '2*pi3',
      cursorPosition: 4,
    });
  });

  it('should insert e at beginning', () => {
    const result = insertConstant('123', 0, 'e');
    expect(result).toEqual({
      expression: 'e123',
      cursorPosition: 1,
    });
  });
});
