/**
 * Unit tests for operation chaining logic
 *
 * These tests verify that the calculator can chain operations (e.g., 2 + 3 + 4 = 9)
 * by computing intermediate results when an operator is pressed while a previous
 * operation is pending.
 */

import { describe, it, expect } from 'vitest';
import {
  handleOperatorInput,
  handleEqualsInput,
  handleClearInput,
  type CalculatorState,
} from './operationHandlers';

describe('Operation Chaining', () => {
  describe('Basic two-operator chain (2 + 3 + 4 = 9)', () => {
    it('should compute intermediate result when second operator is pressed', () => {
      // Start: user has entered "2"
      let state: CalculatorState = {
        displayValue: '2',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };

      // Press "+" operator
      state = handleOperatorInput(state, '+');
      expect(state).toEqual({
        displayValue: '2',
        previousValue: '2',
        operator: '+',
        waitingForOperand: true,
      });

      // User types "3"
      state = {
        displayValue: '3',
        previousValue: '2',
        operator: '+',
        waitingForOperand: false,
      };

      // Press "+" operator again - should compute 2 + 3 = 5 and show intermediate result
      state = handleOperatorInput(state, '+');
      expect(state.displayValue).toBe('5');
      expect(state.previousValue).toBe('5');
      expect(state.operator).toBe('+');
      expect(state.waitingForOperand).toBe(true);

      // User types "4"
      state = {
        displayValue: '4',
        previousValue: '5',
        operator: '+',
        waitingForOperand: false,
      };

      // Press "=" - should compute 5 + 4 = 9
      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('9');
      expect(state.previousValue).toBeNull();
      expect(state.operator).toBeNull();
    });
  });

  describe('Three-operator chain (1 + 2 + 3 + 4 = 10)', () => {
    it('should accumulate intermediate results through multiple operators', () => {
      // Start with "1"
      let state: CalculatorState = {
        displayValue: '1',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };

      // Press "+"
      state = handleOperatorInput(state, '+');

      // Type "2"
      state = {
        ...state,
        displayValue: '2',
        waitingForOperand: false,
      };

      // Press "+" - should show intermediate result 3
      state = handleOperatorInput(state, '+');
      expect(state.displayValue).toBe('3');
      expect(state.previousValue).toBe('3');

      // Type "3"
      state = {
        ...state,
        displayValue: '3',
        waitingForOperand: false,
      };

      // Press "+" - should show intermediate result 6
      state = handleOperatorInput(state, '+');
      expect(state.displayValue).toBe('6');
      expect(state.previousValue).toBe('6');

      // Type "4"
      state = {
        ...state,
        displayValue: '4',
        waitingForOperand: false,
      };

      // Press "=" - should show final result 10
      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('10');
    });
  });

  describe('Mixed operators (2 + 3 * 4 = 20)', () => {
    it('should evaluate left-to-right without operator precedence', () => {
      // Start with "2"
      let state: CalculatorState = {
        displayValue: '2',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };

      // Press "+"
      state = handleOperatorInput(state, '+');

      // Type "3"
      state = {
        ...state,
        displayValue: '3',
        waitingForOperand: false,
      };

      // Press "*" - should compute 2 + 3 = 5 first
      state = handleOperatorInput(state, '*');
      expect(state.displayValue).toBe('5');
      expect(state.previousValue).toBe('5');
      expect(state.operator).toBe('*');

      // Type "4"
      state = {
        ...state,
        displayValue: '4',
        waitingForOperand: false,
      };

      // Press "=" - should compute 5 * 4 = 20
      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('20');
    });
  });

  describe('Operator replacement mid-chain', () => {
    it('should replace operator without computing when pressed twice in a row', () => {
      // Start with "5" and press "+"
      let state: CalculatorState = {
        displayValue: '5',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };

      state = handleOperatorInput(state, '+');
      expect(state.operator).toBe('+');
      expect(state.waitingForOperand).toBe(true);

      // Press "-" immediately (before typing a number)
      state = handleOperatorInput(state, '-');
      expect(state.displayValue).toBe('5'); // Display unchanged
      expect(state.previousValue).toBe('5'); // Previous value unchanged
      expect(state.operator).toBe('-'); // Operator replaced
      expect(state.waitingForOperand).toBe(true);

      // Now type "3" and press "="
      state = {
        ...state,
        displayValue: '3',
        waitingForOperand: false,
      };

      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('2'); // 5 - 3 = 2
    });
  });

  describe('Division by zero mid-chain', () => {
    it('should show Error when dividing by zero during chaining', () => {
      // Start with "5 + 0"
      let state: CalculatorState = {
        displayValue: '0',
        previousValue: '5',
        operator: '+',
        waitingForOperand: false,
      };

      // Press "/" - should compute 5 + 0 = 5 first
      state = handleOperatorInput(state, '/');
      expect(state.displayValue).toBe('5');
      expect(state.operator).toBe('/');

      // Type "0"
      state = {
        ...state,
        displayValue: '0',
        waitingForOperand: false,
      };

      // Press "+" - should trigger division by zero
      state = handleOperatorInput(state, '+');
      expect(state.displayValue).toBe('Error');
      expect(state.previousValue).toBeNull();
      expect(state.operator).toBeNull();
    });
  });

  describe('Chain after clear', () => {
    it('should start fresh chain after clear button is pressed', () => {
      // Do some operation to get into non-initial state
      let state: CalculatorState = {
        displayValue: '10',
        previousValue: '5',
        operator: '+',
        waitingForOperand: false,
      };

      // Press clear
      state = handleClearInput();
      expect(state).toEqual({
        displayValue: '0',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      });

      // Start new chain: "3 + 4 = 7"
      state = {
        ...state,
        displayValue: '3',
      };

      state = handleOperatorInput(state, '+');

      state = {
        ...state,
        displayValue: '4',
        waitingForOperand: false,
      };

      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('7');
    });
  });

  describe('Chaining with decimals (1.5 + 2.5 + 3 = 7)', () => {
    it('should handle decimal intermediate results correctly', () => {
      // Start with "1.5"
      let state: CalculatorState = {
        displayValue: '1.5',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };

      // Press "+"
      state = handleOperatorInput(state, '+');

      // Type "2.5"
      state = {
        ...state,
        displayValue: '2.5',
        waitingForOperand: false,
      };

      // Press "+" - should compute 1.5 + 2.5 = 4
      state = handleOperatorInput(state, '+');
      expect(state.displayValue).toBe('4');
      expect(state.previousValue).toBe('4');

      // Type "3"
      state = {
        ...state,
        displayValue: '3',
        waitingForOperand: false,
      };

      // Press "=" - should compute 4 + 3 = 7
      state = handleEqualsInput(state);
      expect(state.displayValue).toBe('7');
    });
  });
});
