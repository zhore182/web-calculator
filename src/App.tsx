import { useState, useCallback, useEffect, useRef } from 'react';
import Calculator from './components/Calculator';
import { handleDigitInput, handleDecimalInput } from './logic/inputHandlers';
import { handleOperatorInput, handleEqualsInput, handleClearInput } from './logic/operationHandlers';
import type { CalculatorState } from './logic/operationHandlers';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { memoryAdd, memorySubtract, memoryRecall, memoryClear } from './logic/memoryHandlers';
import { createHistoryEntry, loadHistory, saveHistory, clearHistory } from './logic/historyHandlers';
import type { HistoryEntry } from './logic/historyHandlers';
import { evaluateExpression } from './logic/expressionParser';
import type { ExpressionMode, AngleMode } from './logic/expressionParser';
import { insertAtCursor, deleteAtCursor, moveCursor, insertParenthesis, insertFunction, insertConstant } from './logic/cursorHelpers';

// Scientific function names for autocomplete
const SCIENTIFIC_FUNCTIONS = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'log', 'ln', 'sqrt', 'cbrt', 'abs', 'nthRoot'
];

function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  // Expression mode state
  const [expressionMode, setExpressionMode] = useState<ExpressionMode>('simple');
  const [expression, setExpression] = useState('');        // The expression string being built
  const [cursorPosition, setCursorPosition] = useState(0); // Cursor position within expression
  const [previewResult, setPreviewResult] = useState('');   // Live result preview
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG'); // Default DEG per user decision

  // Autocomplete state
  const [typingBuffer, setTypingBuffer] = useState('');        // Letters typed so far
  const [autocompleteMatches, setAutocompleteMatches] = useState<string[]>([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);

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

  const handleModeChange = useCallback((mode: ExpressionMode) => {
    setExpressionMode(mode);
    // Per user decision: preserve current value when switching modes
    // When switching TO expression mode: expression starts empty, display value preserved as result
    // When switching FROM expression mode: current result becomes display value
    if (mode === 'expression') {
      setExpression('');
      setCursorPosition(0);
      setPreviewResult(displayValue);
    }
    // Simple mode: displayValue is already the current value, just clear expression state
    if (mode === 'simple') {
      setExpression('');
      setCursorPosition(0);
      setPreviewResult('');
    }
  }, [displayValue]);

  const handleExpressionClick = useCallback((position: number) => {
    setCursorPosition(position);
  }, []);

  const handleAngleModeToggle = useCallback(() => {
    setAngleMode(prev => {
      const newMode = prev === 'DEG' ? 'RAD' : 'DEG';
      // Per user decision: switching angle mode immediately re-evaluates
      if (expression) {
        const result = evaluateExpression(expression, newMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        }
      }
      return newMode;
    });
  }, [expression]);

  const handleAutocompleteSelect = useCallback((funcName: string) => {
    // Remove the typed buffer from expression
    const bufferStart = cursorPosition - typingBuffer.length;
    const exprWithoutBuffer = expression.slice(0, bufferStart) + expression.slice(cursorPosition);

    // Insert function at buffer start position
    const { expression: newExpr, cursorPosition: newCursor } = insertFunction(
      exprWithoutBuffer, bufferStart, funcName
    );

    setExpression(newExpr);
    setCursorPosition(newCursor);
    setTypingBuffer('');
    setAutocompleteVisible(false);
    setAutocompleteMatches([]);
    setAutocompleteIndex(0);

    // Try live preview
    const result = evaluateExpression(newExpr, angleMode);
    if (result.status === 'success' && result.display) {
      setPreviewResult(result.display);
    } else {
      setPreviewResult('');
    }
  }, [expression, cursorPosition, typingBuffer, angleMode]);

  const handleButtonClick = useCallback((value: string) => {
    // Handle clear input (always works, even from Error state)
    if (value === 'C') {
      if (expressionMode === 'expression') {
        setExpression('');
        setCursorPosition(0);
        setPreviewResult('');
        setDisplayValue('0');
      } else {
        applyState(handleClearInput());
      }
      return;
    }

    // Handle memory operations (both modes)
    if (value === 'MC') { setMemoryValue(memoryClear()); return; }
    if (value === 'MR') { setDisplayValue(memoryRecall(memoryValue)); setWaitingForOperand(true); return; }
    if (value === 'M+') { setMemoryValue(memoryAdd(memoryValue, displayValue)); setWaitingForOperand(true); return; }
    if (value === 'M-') { setMemoryValue(memorySubtract(memoryValue, displayValue)); setWaitingForOperand(true); return; }

    // EXPRESSION MODE input handling
    if (expressionMode === 'expression') {
      // Autocomplete keyboard navigation (takes priority when visible)
      if (autocompleteVisible) {
        if (value === 'ArrowDown') {
          setAutocompleteIndex(prev => (prev + 1) % autocompleteMatches.length);
          return;
        }
        if (value === 'ArrowUp') {
          setAutocompleteIndex(prev => (prev - 1 + autocompleteMatches.length) % autocompleteMatches.length);
          return;
        }
        if (value === 'Enter') {
          handleAutocompleteSelect(autocompleteMatches[autocompleteIndex]);
          return;
        }
        if (value === 'Escape') {
          setAutocompleteVisible(false);
          setTypingBuffer('');
          return;
        }
      }

      // Clear typing buffer on non-letter input (except autocomplete navigation keys)
      if (!/^[a-z]$/.test(value) && value !== 'ArrowDown' && value !== 'ArrowUp' && value !== 'Enter' && value !== 'Escape') {
        if (typingBuffer) {
          setTypingBuffer('');
          setAutocompleteVisible(false);
        }
      }

      // Handle letter input for function name typing
      if (/^[a-z]$/.test(value)) {
        const newBuffer = typingBuffer + value;
        setTypingBuffer(newBuffer);

        // Also insert the letter into the expression at cursor
        const { expression: newExpr, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, value);
        setExpression(newExpr);
        setCursorPosition(newCursor);

        // Filter matches
        if (newBuffer.length >= 2) {
          const matches = SCIENTIFIC_FUNCTIONS.filter(fn => fn.startsWith(newBuffer));
          if (matches.length > 0) {
            setAutocompleteMatches(matches);
            setAutocompleteIndex(0);
            setAutocompleteVisible(true);
          } else {
            setAutocompleteVisible(false);
          }
        }

        // Try live preview
        const result = evaluateExpression(newExpr, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult('');
        }
        return;
      }

      // Handle scientific function input
      const scientificFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan',
        'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
        'log', 'ln', 'sqrt', 'cbrt', 'abs'];

      if (scientificFunctions.includes(value)) {
        const { expression: newExpr, cursorPosition: newCursor } = insertFunction(expression, cursorPosition, value);
        setExpression(newExpr);
        setCursorPosition(newCursor);
        // Try live preview
        const result = evaluateExpression(newExpr, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult('');
        }
        return;
      }

      // Handle constant input (pi, e)
      if (value === 'pi' || value === 'e_constant') {
        const constantStr = value === 'pi' ? 'pi' : 'e';
        const { expression: newExpr, cursorPosition: newCursor } = insertConstant(expression, cursorPosition, constantStr);
        setExpression(newExpr);
        setCursorPosition(newCursor);
        // Try live preview
        const result = evaluateExpression(newExpr, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult('');
        }
        return;
      }

      // Handle factorial and percentage
      if (value === '!' || value === '%') {
        const { expression: newExpr, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, value);
        setExpression(newExpr);
        setCursorPosition(newCursor);
        const result = evaluateExpression(newExpr, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult('');
        }
        return;
      }

      // Handle power operator
      if (value === '^') {
        const { expression: newExpr, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, '^');
        setExpression(newExpr);
        setCursorPosition(newCursor);
        const result = evaluateExpression(newExpr, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult('');
        }
        return;
      }

      // Handle digit input (0-9)
      if (/^[0-9]$/.test(value)) {
        const { expression: newExpression, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, value);
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        }
        return;
      }

      // Handle decimal point input
      if (value === '.') {
        const { expression: newExpression, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, '.');
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        }
        return;
      }

      // Handle operator input (+, -, *, /)
      if (['+', '-', '*', '/'].includes(value)) {
        const { expression: newExpression, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, value);
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult(''); // Clear preview if expression is incomplete
        }
        return;
      }

      // Handle opening parenthesis with auto-close
      if (value === '(') {
        const { expression: newExpression, cursorPosition: newCursor } = insertParenthesis(expression, cursorPosition, 'open');
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult(''); // Clear preview if expression is incomplete
        }
        return;
      }

      // Handle closing parenthesis
      if (value === ')') {
        const { expression: newExpression, cursorPosition: newCursor } = insertAtCursor(expression, cursorPosition, ')');
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult(''); // Clear preview if expression is incomplete
        }
        return;
      }

      // Handle backspace
      if (value === 'Backspace') {
        const { expression: newExpression, cursorPosition: newCursor } = deleteAtCursor(expression, cursorPosition);
        setExpression(newExpression);
        setCursorPosition(newCursor);

        // Try to evaluate and show preview
        const result = evaluateExpression(newExpression, angleMode);
        if (result.status === 'success' && result.display) {
          setPreviewResult(result.display);
        } else {
          setPreviewResult(''); // Clear preview if expression is incomplete
        }
        return;
      }

      // Handle arrow keys for cursor movement
      if (value === 'ArrowLeft') {
        const newCursor = moveCursor(cursorPosition, 'left', expression.length);
        setCursorPosition(newCursor);
        return;
      }

      if (value === 'ArrowRight') {
        const newCursor = moveCursor(cursorPosition, 'right', expression.length);
        setCursorPosition(newCursor);
        return;
      }

      // Handle equals input in expression mode (both '=' button and 'Enter' key)
      if (value === '=' || value === 'Enter') {
        const result = evaluateExpression(expression, angleMode);
        if (result.status === 'success' && result.display) {
          // Create history entry
          const entry = createHistoryEntry(expression, '=', '', result.display);
          setHistoryEntries(prev => [entry, ...prev]);

          // Set result as display value and clear expression
          setDisplayValue(result.display);
          setExpression('');
          setCursorPosition(0);
          setPreviewResult('');
        } else if (result.status === 'error') {
          // Per user decision: on error, show "Syntax Error" in result line, keep expression visible for correction
          setPreviewResult('Syntax Error');
        }
        return;
      }

      return; // End expression mode handling
    }

    // SIMPLE MODE input handling (unchanged from original)
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
  }, [displayValue, previousValue, operator, waitingForOperand, memoryValue, expressionMode, expression, cursorPosition, angleMode, autocompleteVisible, autocompleteMatches, autocompleteIndex, typingBuffer, handleAutocompleteSelect]);

  useKeyboardInput(handleButtonClick);

  return (
    <Calculator
      displayValue={displayValue}
      onButtonClick={handleButtonClick}
      hasMemory={hasMemory}
      historyEntries={historyEntries}
      onHistoryClear={handleHistoryClear}
      onHistoryEntryClick={handleHistoryEntryClick}
      expressionMode={expressionMode}
      expression={expression}
      cursorPosition={cursorPosition}
      previewResult={previewResult}
      onModeChange={handleModeChange}
      onExpressionClick={handleExpressionClick}
      angleMode={angleMode}
      onAngleModeToggle={handleAngleModeToggle}
      autocompleteMatches={autocompleteMatches}
      autocompleteIndex={autocompleteIndex}
      autocompleteVisible={autocompleteVisible}
      onAutocompleteSelect={handleAutocompleteSelect}
    />
  );
}

export default App;
