import { Button } from './Button';

export interface ButtonPanelProps {
  onButtonClick: (value: string) => void;
}

export function ButtonPanel({ onButtonClick }: ButtonPanelProps) {
  const buttonLayout = [
    ['C',  '',   '',   '/'],
    ['7',  '8',  '9',  '*'],
    ['4',  '5',  '6',  '-'],
    ['1',  '2',  '3',  '+'],
    ['0',  '.',  '=',  '']
  ];

  const getButtonClassName = (label: string): string => {
    if (label === '0') return 'btn--wide';
    if (['/','*','-','+'].includes(label)) return 'btn--operator';
    if (label === '=') return 'btn--equals';
    if (label === 'C') return 'btn--clear';
    return '';
  };

  return (
    <div className="button-panel">
      {buttonLayout.flat().map((label, index) => (
        <Button
          key={`${label}-${index}`}
          label={label}
          onClick={onButtonClick}
          className={getButtonClassName(label)}
          disabled={label === ''}
        />
      ))}
    </div>
  );
}
