import { Button } from './Button';

export interface ScientificPanelProps {
  onButtonClick: (value: string) => void;
  visible: boolean;
}

export function ScientificPanel({ onButtonClick, visible }: ScientificPanelProps) {
  const buttonLayout = [
    // Row 1: Basic trig + pi
    ['sin', 'cos', 'tan', 'pi'],
    // Row 2: Inverse trig + e constant
    ['asin', 'acos', 'atan', 'e_constant'],
    // Row 3: Hyperbolic trig + factorial
    ['sinh', 'cosh', 'tanh', '!'],
    // Row 4: Logarithms + sqrt + power
    ['log', 'ln', 'sqrt', '^'],
    // Row 5: Other functions + parentheses
    ['abs', 'cbrt', '(', ')']
  ];

  const getButtonLabel = (value: string): string => {
    if (value === 'pi') return 'π';
    if (value === 'e_constant') return 'e';
    if (value === '^') return 'x^y';
    if (value === '!') return 'x!';
    return value;
  };

  const panelClassName = visible
    ? 'scientific-panel scientific-panel--visible'
    : 'scientific-panel';

  return (
    <div className={panelClassName}>
      <div className="scientific-panel__grid">
        {buttonLayout.flat().map((value, index) => (
          <Button
            key={`${value}-${index}`}
            label={getButtonLabel(value)}
            onClick={onButtonClick}
            className="btn--scientific"
          />
        ))}
      </div>
    </div>
  );
}
