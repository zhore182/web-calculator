import { Display } from './Display';
import { ButtonPanel } from './ButtonPanel';
import '../styles/Calculator.css';

export interface CalculatorProps {
  displayValue: string;
  onButtonClick: (value: string) => void;
  hasMemory: boolean;
}

export default function Calculator({ displayValue, onButtonClick, hasMemory }: CalculatorProps) {
  return (
    <div className="calculator">
      <Display value={displayValue} hasMemory={hasMemory} />
      <ButtonPanel onButtonClick={onButtonClick} />
    </div>
  );
}
