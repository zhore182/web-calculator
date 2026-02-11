/**
 * Pure functions for handling calculator input logic
 */

/**
 * Handles digit input (0-9)
 * @param currentDisplay - Current display value
 * @param digit - Single digit string ("0" through "9")
 * @returns Updated display value
 */
export function handleDigitInput(currentDisplay: string, digit: string): string {
  // Prevent multiple leading zeros
  if (currentDisplay === '0' && digit === '0') {
    return '0';
  }

  // Replace leading zero with non-zero digit
  if (currentDisplay === '0' && digit !== '0') {
    return digit;
  }

  // Prevent display overflow (max 16 digits)
  if (currentDisplay.length >= 16) {
    return currentDisplay;
  }

  // Append digit to current display
  return currentDisplay + digit;
}

/**
 * Handles decimal point input
 * @param currentDisplay - Current display value
 * @returns Updated display value with decimal point
 */
export function handleDecimalInput(currentDisplay: string): string {
  // Only allow one decimal point per number
  if (currentDisplay.includes('.')) {
    return currentDisplay;
  }

  // Add decimal point to current display
  return currentDisplay + '.';
}
