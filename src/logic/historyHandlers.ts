/**
 * History management for calculator
 * Provides functions to create, load, save, and clear calculation history
 */

export interface HistoryEntry {
  id: number;
  expression: string; // e.g. "5 + 3"
  result: string;     // e.g. "8"
}

/**
 * Creates a history entry from a calculation
 * Maps operator symbols for display: * becomes x, / becomes ÷
 */
export function createHistoryEntry(
  previousValue: string,
  operator: string,
  currentValue: string,
  result: string
): HistoryEntry {
  // Map operators to user-friendly symbols
  const displayOperator = operator === '*' ? 'x' : operator === '/' ? '÷' : operator;

  return {
    id: Date.now(),
    expression: `${previousValue} ${displayOperator} ${currentValue}`,
    result
  };
}

/**
 * Loads history from localStorage
 * Returns empty array if localStorage is unavailable or data is invalid
 */
export function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem('calculator-history');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    // Handle quota exceeded, privacy mode, or parse errors
    return [];
  }
}

/**
 * Saves history to localStorage
 * Silently fails if localStorage is unavailable
 */
export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem('calculator-history', JSON.stringify(entries));
  } catch (error) {
    // Silently fail on quota exceeded or privacy mode
  }
}

/**
 * Clears all history entries
 * Returns empty array (caller handles persistence via saveHistory)
 */
export function clearHistory(): HistoryEntry[] {
  return [];
}
