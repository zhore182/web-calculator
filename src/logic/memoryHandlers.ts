/**
 * Pure functions for handling calculator memory operations
 */

/**
 * Adds the current display value to memory
 * @param currentMemory - Current memory value
 * @param displayValue - Current display value (numeric string or "Error")
 * @returns Updated memory value
 */
export function memoryAdd(currentMemory: number, displayValue: string): number {
  // If display shows Error, don't modify memory
  if (displayValue === 'Error') {
    return currentMemory;
  }

  // Parse display value and add to current memory
  const value = parseFloat(displayValue);
  return currentMemory + value;
}

/**
 * Subtracts the current display value from memory
 * @param currentMemory - Current memory value
 * @param displayValue - Current display value (numeric string or "Error")
 * @returns Updated memory value
 */
export function memorySubtract(currentMemory: number, displayValue: string): number {
  // If display shows Error, don't modify memory
  if (displayValue === 'Error') {
    return currentMemory;
  }

  // Parse display value and subtract from current memory
  const value = parseFloat(displayValue);
  return currentMemory - value;
}

/**
 * Recalls the memory value to display
 * @param currentMemory - Current memory value
 * @returns Memory value as display string
 */
export function memoryRecall(currentMemory: number): string {
  return String(currentMemory);
}

/**
 * Clears the memory
 * @returns Zero (cleared memory value)
 */
export function memoryClear(): number {
  return 0;
}
