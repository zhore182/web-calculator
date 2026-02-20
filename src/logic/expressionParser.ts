// Expression parser using mathjs for PEMDAS-compliant evaluation
import { evaluate } from 'mathjs';

export interface ExpressionResult {
  status: 'success' | 'error' | 'incomplete';
  value?: number;
  display?: string;  // Formatted result string
  error?: string;    // Error message (e.g., "Syntax Error")
}

export type ExpressionMode = 'simple' | 'expression';
export type AngleMode = 'DEG' | 'RAD';

/**
 * Evaluates a mathematical expression string using mathjs.
 * Supports PEMDAS, parentheses, and implicit multiplication.
 *
 * @param expr - The expression string to evaluate
 * @param angleMode - Angle mode for trigonometric functions (DEG or RAD)
 * @returns ExpressionResult with status, value, display string, or error
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): ExpressionResult {
  // Handle empty string
  if (expr.trim() === '') {
    return { status: 'incomplete' };
  }

  // Pre-process: Validate factorial expressions
  const factorialError = validateFactorials(expr);
  if (factorialError) {
    return {
      status: 'error',
      error: factorialError
    };
  }

  // Pre-process: Check for sqrt of negative numbers
  const sqrtError = checkSqrtDomain(expr);
  if (sqrtError) {
    return {
      status: 'error',
      error: sqrtError
    };
  }

  // Pre-process: Replace % with /100 for percentage operator
  const processedExpr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  try {
    // Create scope with custom functions for angle mode and log aliasing
    const scope: Record<string, any> = {};

    // Log aliasing: log() = base 10, ln() = natural log
    scope.log = (x: number) => Math.log10(x);
    scope.ln = (x: number) => Math.log(x);

    // Angle mode handling for trig functions
    if (angleMode === 'DEG') {
      // Override trig functions to convert degrees to radians
      scope.sin = (x: number) => Math.sin(x * Math.PI / 180);
      scope.cos = (x: number) => Math.cos(x * Math.PI / 180);
      scope.tan = (x: number) => Math.tan(x * Math.PI / 180);

      // Override inverse trig to convert radians to degrees
      scope.asin = (x: number) => Math.asin(x) * 180 / Math.PI;
      scope.acos = (x: number) => Math.acos(x) * 180 / Math.PI;
      scope.atan = (x: number) => Math.atan(x) * 180 / Math.PI;
    }
    // For RAD mode, we use mathjs defaults (no overrides needed for trig)

    // Evaluate expression using mathjs with custom scope
    const result = evaluate(processedExpr, scope);

    // Check for division by zero (Infinity or -Infinity)
    if (typeof result === 'number' && !isFinite(result)) {
      return {
        status: 'error',
        error: 'Cannot divide by zero'
      };
    }

    // Check for NaN
    if (typeof result !== 'number' || isNaN(result)) {
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
 * Validates factorial expressions to ensure they use non-negative integers.
 * Returns an error message if validation fails, null otherwise.
 */
function validateFactorials(expr: string): string | null {
  // Match factorial patterns: number followed by ! OR (expression)!
  const simplePattern = /(-?\d+(?:\.\d+)?)\s*!/g;
  const parenPattern = /\(([^()]+)\)\s*!/g;

  // Helper to check if a number is a valid factorial operand
  const checkFactorialOperand = (num: number): string | null => {
    if (num < 0 || !Number.isInteger(num)) {
      return 'Factorial requires non-negative integer';
    }
    return null;
  };

  // Check simple number factorials (e.g., 5!, 3.5!, -1!)
  let match;
  while ((match = simplePattern.exec(expr)) !== null) {
    const num = parseFloat(match[1]);
    const error = checkFactorialOperand(num);
    if (error) return error;
  }

  // Check parenthesized expression factorials (e.g., (-5)!, (3.5)!)
  while ((match = parenPattern.exec(expr)) !== null) {
    const innerValue = parseFloat(match[1]);
    if (!isNaN(innerValue)) {
      const error = checkFactorialOperand(innerValue);
      if (error) return error;
    }
    // If we can't parse it as a simple number, let mathjs handle it
  }

  return null;
}

/**
 * Checks if expression contains sqrt of a negative number.
 * Returns an error message if domain violation detected, null otherwise.
 */
function checkSqrtDomain(expr: string): string | null {
  // Match sqrt(expression) patterns
  const sqrtPattern = /sqrt\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)/g;

  let match;
  while ((match = sqrtPattern.exec(expr)) !== null) {
    const numStr = match[1];
    const num = parseFloat(numStr);

    // Check if negative
    if (num < 0) {
      return 'Cannot take sqrt of negative number';
    }
  }

  return null;
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
