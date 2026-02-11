import { useState } from 'react';
import Calculator from './components/Calculator';
import { handleDigitInput, handleDecimalInput } from './logic/inputHandlers';

function App() {
  const [displayValue, setDisplayValue] = useState('0');

  const handleButtonClick = (value: string) => {
    // Handle digit input (0-9)
    if (/^[0-9]$/.test(value)) {
      setDisplayValue(prev => handleDigitInput(prev, value));
      return;
    }

    // Handle decimal point input
    if (value === '.') {
      setDisplayValue(prev => handleDecimalInput(prev));
      return;
    }

    // TODO: Phase 3 - handle operators, equals, clear
  };

  return <Calculator displayValue={displayValue} onButtonClick={handleButtonClick} />;
}

export default App;
