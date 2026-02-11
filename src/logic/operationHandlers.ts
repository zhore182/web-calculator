/**
 * Pure functions for handling calculator operations and state transitions
 */

/**
 * Calculator state interface
 */
export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForOperand: boolean;
}

/**
 * Performs arithmetic calculation
 * @param a - First operand
 * @param b - Second operand
 * @param operator - Arithmetic operator (+, -, *, /)
 * @returns Calculation result, or null if division by zero
 */
export function calculate(a: number, b: number, operator: string): number | null {
  let result: number;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      // Division by zero protection
      if (b === 0) {
        return null;
      }
      result = a / b;
      break;
    default:
      return a;
  }

  // Remove floating-point artifacts (e.g., 0.1 + 0.2 = 0.3, not 0.30000000000000004)
  return parseFloat(result.toPrecision(12));
}

/**
 * Handles operator input (+, -, *, /)
 * @param state - Current calculator state
 * @param operator - Operator string
 * @returns Updated calculator state
 */
export function handleOperatorInput(state: CalculatorState, operator: string): CalculatorState {
  const { displayValue, previousValue, operator: currentOperator, waitingForOperand } = state;

  // If displayValue is "Error", ignore operator input
  if (displayValue === 'Error') {
    return state;
  }

  // If user pressed operator twice in a row, just replace the operator
  if (waitingForOperand && previousValue !== null) {
    return {
      ...state,
      operator,
    };
  }

  // If there's a previous value, current operator, and we're NOT waiting for operand,
  // compute the intermediate result
  if (previousValue !== null && currentOperator !== null && !waitingForOperand) {
    const result = calculate(parseFloat(previousValue), parseFloat(displayValue), currentOperator);

    // Handle division by zero
    if (result === null) {
      return {
        displayValue: 'Error',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
      };
    }

    return {
      displayValue: String(result),
      previousValue: String(result),
      operator,
      waitingForOperand: true,
    };
  }

  // Starting a new operation - save current display as previousValue
  return {
    displayValue,
    previousValue: displayValue,
    operator,
    waitingForOperand: true,
  };
}

/**
 * Handles equals input (=)
 * @param state - Current calculator state
 * @returns Updated calculator state with calculation result
 */
export function handleEqualsInput(state: CalculatorState): CalculatorState {
  const { displayValue, previousValue, operator } = state;

  // Nothing to compute if no previousValue or no operator
  if (previousValue === null || operator === null) {
    return state;
  }

  // If displayValue is "Error", ignore equals input
  if (displayValue === 'Error') {
    return state;
  }

  // Calculate the result
  const result = calculate(parseFloat(previousValue), parseFloat(displayValue), operator);

  // Handle division by zero
  if (result === null) {
    return {
      displayValue: 'Error',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    };
  }

  // Return result and clear operator/previousValue for fresh start
  return {
    displayValue: String(result),
    previousValue: null,
    operator: null,
    waitingForOperand: true,
  };
}

/**
 * Handles clear input (C)
 * @returns Initial calculator state
 */
export function handleClearInput(): CalculatorState {
  return {
    displayValue: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
  };
}
