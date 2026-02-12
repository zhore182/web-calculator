import { useState, useCallback } from 'react';
import Calculator from './components/Calculator';
import { handleDigitInput, handleDecimalInput } from './logic/inputHandlers';
import { handleOperatorInput, handleEqualsInput, handleClearInput } from './logic/operationHandlers';
import type { CalculatorState } from './logic/operationHandlers';
import { useKeyboardInput } from './hooks/useKeyboardInput';

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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

  const handleButtonClick = useCallback((value: string) => {
    // Handle clear input (always works, even from Error state)
    if (value === 'C') {
      applyState(handleClearInput());
      return;
    }

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
      // Ignore if display shows Error
      if (displayValue !== 'Error') {
        applyState(handleEqualsInput(getCurrentState()));
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
  }, [displayValue, previousValue, operator, waitingForOperand]);

  useKeyboardInput(handleButtonClick);

  return <Calculator displayValue={displayValue} onButtonClick={handleButtonClick} />;
}

export default App;
