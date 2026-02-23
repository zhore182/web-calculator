export interface ModeToggleProps {
  expressionMode: 'simple' | 'expression';
  appMode: 'calc' | 'graph';
  onModeSelect: (mode: 'simple' | 'expression' | 'graph') => void;
}

export function ModeToggle({ expressionMode, appMode, onModeSelect }: ModeToggleProps) {
  // Active state: if in graph mode, Graph button is active.
  // If in calc mode, whichever of Simple/Expression matches expressionMode is active.
  const simpleActive = appMode === 'calc' && expressionMode === 'simple';
  const expressionActive = appMode === 'calc' && expressionMode === 'expression';
  const graphActive = appMode === 'graph';

  return (
    <div className="mode-toggle" role="radiogroup" aria-label="Calculator mode">
      <button
        className={`mode-toggle__option ${simpleActive ? 'mode-toggle__option--active' : ''}`}
        role="radio"
        aria-checked={simpleActive}
        onClick={() => onModeSelect('simple')}
        type="button"
      >
        Simple
      </button>
      <button
        className={`mode-toggle__option ${expressionActive ? 'mode-toggle__option--active' : ''}`}
        role="radio"
        aria-checked={expressionActive}
        onClick={() => onModeSelect('expression')}
        type="button"
      >
        Expression
      </button>
      <button
        className={`mode-toggle__option ${graphActive ? 'mode-toggle__option--active' : ''}`}
        role="radio"
        aria-checked={graphActive}
        onClick={() => onModeSelect('graph')}
        type="button"
        data-testid="mode-graph"
      >
        Graph
      </button>
    </div>
  );
}
