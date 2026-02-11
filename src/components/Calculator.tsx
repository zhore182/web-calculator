import { Display } from './Display';
import { ButtonPanel } from './ButtonPanel';
import '../styles/Calculator.css';

export interface CalculatorProps {
  displayValue: string;
  onButtonClick: (value: string) => void;
}

export default function Calculator({ displayValue, onButtonClick }: CalculatorProps) {
  return (
    <div className="calculator">
      <Display value={displayValue} />
      <ButtonPanel onButtonClick={onButtonClick} />
    </div>
  );
}
