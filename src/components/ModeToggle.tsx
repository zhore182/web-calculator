export interface ModeToggleProps {
  mode: 'simple' | 'expression';
  onModeChange: (mode: 'simple' | 'expression') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Calculator mode">
      <button
        className={`mode-toggle__option ${mode === 'simple' ? 'mode-toggle__option--active' : ''}`}
        role="radio"
        aria-checked={mode === 'simple'}
        onClick={() => onModeChange('simple')}
        type="button"
      >
        Simple
      </button>
      <button
        className={`mode-toggle__option ${mode === 'expression' ? 'mode-toggle__option--active' : ''}`}
        role="radio"
        aria-checked={mode === 'expression'}
        onClick={() => onModeChange('expression')}
        type="button"
      >
        Expression
      </button>
    </div>
  );
}
