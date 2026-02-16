// Expression parser using mathjs for PEMDAS-compliant evaluation
import { evaluate } from 'mathjs';

export interface ExpressionResult {
  status: 'success' | 'error' | 'incomplete';
  value?: number;
  display?: string;  // Formatted result string
  error?: string;    // Error message (e.g., "Syntax Error")
}

export type ExpressionMode = 'simple' | 'expression';

/**
 * Evaluates a mathematical expression string using mathjs.
 * Supports PEMDAS, parentheses, and implicit multiplication.
 *
 * @param expr - The expression string to evaluate
 * @returns ExpressionResult with status, value, display string, or error
 */
export function evaluateExpression(expr: string): ExpressionResult {
  // Handle empty string
  if (expr.trim() === '') {
    return { status: 'incomplete' };
  }

  try {
    // Evaluate expression using mathjs
    const result = evaluate(expr);

    // Check for NaN or Infinity
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return {
        status: 'error',
        error: 'Syntax Error'
      };
    }

    // Format result for display
    const display = formatResult(result);

    return {
      status: 'success',
      value: result,
      display
    };
  } catch (error) {
    // Any mathjs evaluation error
    return {
      status: 'error',
      error: 'Syntax Error'
    };
  }
}

/**
 * Formats a numeric result for display, handling floating-point precision.
 * Uses toPrecision(12) then strips trailing zeros for clean output.
 *
 * @param value - The numeric value to format
 * @returns Formatted string representation
 */
export function formatResult(value: number): string {
  // Handle special cases
  if (isNaN(value) || !isFinite(value)) {
    return 'Error';
  }

  // Use toPrecision for clean formatting, then parse to remove trailing zeros
  // This addresses the floating-point precision issue (e.g., 0.1 + 0.2 = 0.3)
  const precision = 12;
  const formatted = parseFloat(value.toPrecision(precision)).toString();

  return formatted;
}
