import { useState, useCallback, useEffect, useRef } from 'react';
import Calculator from './components/Calculator';
import { handleDigitInput, handleDecimalInput } from './logic/inputHandlers';
import { handleOperatorInput, handleEqualsInput, handleClearInput } from './logic/operationHandlers';
import type { CalculatorState } from './logic/operationHandlers';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { memoryAdd, memorySubtract, memoryRecall, memoryClear } from './logic/memoryHandlers';
import { createHistoryEntry, loadHistory, saveHistory, clearHistory } from './logic/historyHandlers';
import type { HistoryEntry } from './logic/historyHandlers';

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  const hasMemory = memoryValue !== 0;
  const historyLoadedRef = useRef(false);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistoryEntries(loadHistory());
    historyLoadedRef.current = true;
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (historyLoadedRef.current) {
      saveHistory(historyEntries);
    }
  }, [historyEntries]);

  const getCurrentState = (): CalculatorState => ({
    displayValue,
    previousValue,
    operator,
    waitingForOperand,
  });

  const applyState = (newState: CalculatorState) => {
    setDisplayValue(newState.displayValue);
    setPreviousValue(newState.previousValue);
    setOperator(newState.operator);
    setWaitingForOperand(newState.waitingForOperand);
  };

  const handleHistoryClear = useCallback(() => {
    setHistoryEntries(clearHistory());
  }, []);

  const handleHistoryEntryClick = useCallback((entry: HistoryEntry) => {
    setDisplayValue(entry.result);
    setWaitingForOperand(true);
  }, []);

  const handleButtonClick = useCallback((value: string) => {
    // Handle clear input (always works, even from Error state)
    if (value === 'C') {
      applyState(handleClearInput());
      return;
    }

    // Handle memory operations
    if (value === 'MC') { setMemoryValue(memoryClear()); return; }
    if (value === 'MR') { setDisplayValue(memoryRecall(memoryValue)); setWaitingForOperand(true); return; }
    if (value === 'M+') { setMemoryValue(memoryAdd(memoryValue, displayValue)); setWaitingForOperand(true); return; }
    if (value === 'M-') { setMemoryValue(memorySubtract(memoryValue, displayValue)); setWaitingForOperand(true); return; }

    // Handle digit input (0-9)
    if (/^[0-9]$/.test(value)) {
      // If waiting for operand, start a new number
      if (waitingForOperand) {
        setDisplayValue(value);
        setWaitingForOperand(false);
      } else {
        setDisplayValue(prev => handleDigitInput(prev, value));
      }
      return;
    }

    // Handle decimal point input
    if (value === '.') {
      // If waiting for operand, start fresh with "0."
      if (waitingForOperand) {
        setDisplayValue('0.');
        setWaitingForOperand(false);
      } else {
        setDisplayValue(prev => handleDecimalInput(prev));
      }
      return;
    }

    // Handle equals input
    if (value === '=') {
      if (displayValue !== 'Error') {
        const currentState = getCurrentState();
        // Only create history entry if there's a complete operation
        if (currentState.previousValue !== null && currentState.operator !== null) {
          const newState = handleEqualsInput(currentState);
          // Only add to history if result is not Error
          if (newState.displayValue !== 'Error') {
            const entry = createHistoryEntry(
              currentState.previousValue,
              currentState.operator,
              currentState.displayValue,
              newState.displayValue
            );
            setHistoryEntries(prev => [entry, ...prev]);
          }
          applyState(newState);
        }
      }
      return;
    }

    // Handle operator input (+, -, *, /)
    if (['+', '-', '*', '/'].includes(value)) {
      // Ignore if display shows Error
      if (displayValue !== 'Error') {
        applyState(handleOperatorInput(getCurrentState(), value));
      }
      return;
    }
  }, [displayValue, previousValue, operator, waitingForOperand, memoryValue]);

  useKeyboardInput(handleButtonClick);

  return (
    <Calculator
      displayValue={displayValue}
      onButtonClick={handleButtonClick}
      hasMemory={hasMemory}
      historyEntries={historyEntries}
      onHistoryClear={handleHistoryClear}
      onHistoryEntryClick={handleHistoryEntryClick}
    />
  );
}

export default App;
