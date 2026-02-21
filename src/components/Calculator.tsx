import { Display } from './Display';
import { ButtonPanel } from './ButtonPanel';
import { HistoryPanel } from './HistoryPanel';
import { ModeToggle } from './ModeToggle';
import { Autocomplete } from './Autocomplete';
import { ScientificPanel } from './ScientificPanel';
import { GraphPanel } from './GraphPanel';
import type { HistoryEntry } from '../logic/historyHandlers';
import type { ExpressionMode } from '../logic/expressionParser';
import type { ViewportBounds } from '../logic/graphRenderer';
import '../styles/Calculator.css';

export interface CalculatorProps {
  displayValue: string;
  onButtonClick: (value: string) => void;
  hasMemory: boolean;
  historyEntries: HistoryEntry[];
  onHistoryClear: () => void;
  onHistoryEntryClick: (entry: HistoryEntry) => void;
  expressionMode: ExpressionMode;
  expression: string;
  cursorPosition: number;
  previewResult: string;
  onModeChange: (mode: ExpressionMode) => void;
  onExpressionClick?: (position: number) => void;
  angleMode: 'DEG' | 'RAD';
  onAngleModeToggle: () => void;
  autocompleteMatches: string[];
  autocompleteIndex: number;
  autocompleteVisible: boolean;
  onAutocompleteSelect: (funcName: string) => void;
  scientificPanelOpen: boolean;
  onScientificToggle: () => void;
  graphExpression: string;
  graphInputValue: string;
  graphVisible: boolean;
  graphViewport: ViewportBounds;
  onGraphPlot: () => void;
  onGraphClear: () => void;
  onGraphInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGraphInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onGraphViewportChange: (viewport: ViewportBounds) => void;
}

export default function Calculator({
  displayValue,
  onButtonClick,
  hasMemory,
  historyEntries,
  onHistoryClear,
  onHistoryEntryClick,
  expressionMode,
  expression,
  cursorPosition,
  previewResult,
  onModeChange,
  onExpressionClick,
  angleMode,
  onAngleModeToggle,
  autocompleteMatches,
  autocompleteIndex,
  autocompleteVisible,
  onAutocompleteSelect,
  scientificPanelOpen,
  onScientificToggle,
  graphExpression,
  graphInputValue,
  graphVisible,
  graphViewport,
  onGraphPlot,
  onGraphClear,
  onGraphInputChange,
  onGraphInputKeyDown,
  onGraphViewportChange,
}: CalculatorProps) {
  // In expression mode: Display shows expression on top line, preview/result on bottom
  // In simple mode: Display shows only displayValue on bottom line
  const displayResultValue = expressionMode === 'expression' && previewResult
    ? previewResult
    : displayValue;

  const calculatorClassName = scientificPanelOpen
    ? 'calculator calculator--sci-open'
    : 'calculator';

  const toggleClassName = scientificPanelOpen
    ? 'scientific-toggle scientific-toggle--active'
    : 'scientific-toggle';

  return (
    <div className={calculatorClassName}>
      <ModeToggle mode={expressionMode} onModeChange={onModeChange} />
      <button
        className={toggleClassName}
        onClick={onScientificToggle}
        data-testid="scientific-toggle"
      >
        SCI
      </button>
      <div style={{ position: 'relative' }}>
        <Display
          value={displayResultValue}
          hasMemory={hasMemory}
          expression={expression}
          expressionMode={expressionMode === 'expression'}
          cursorPosition={cursorPosition}
          onExpressionClick={onExpressionClick}
          angleMode={angleMode}
          onAngleModeToggle={onAngleModeToggle}
        />
        <Autocomplete
          matches={autocompleteMatches}
          selectedIndex={autocompleteIndex}
          onSelect={onAutocompleteSelect}
          visible={autocompleteVisible}
        />
      </div>
      <div className="calculator__panels">
        <ScientificPanel
          onButtonClick={onButtonClick}
          visible={scientificPanelOpen}
        />
        <ButtonPanel onButtonClick={onButtonClick} />
      </div>
      <div className="graph-controls">
        <div className="graph-controls__input-row">
          <span className="graph-controls__label">y =</span>
          <input
            className="graph-controls__input"
            type="text"
            value={graphInputValue}
            onChange={onGraphInputChange}
            onKeyDown={onGraphInputKeyDown}
            placeholder="f(x), e.g. sin(x)"
            data-testid="graph-input"
          />
        </div>
        <div className="graph-controls__buttons">
          <button className="graph-controls__btn graph-controls__btn--plot" onClick={onGraphPlot}>
            Plot
          </button>
          <button className="graph-controls__btn graph-controls__btn--clear" onClick={onGraphClear}>
            Clear
          </button>
        </div>
      </div>
      <GraphPanel
        expression={graphExpression}
        angleMode={angleMode}
        visible={graphVisible}
        viewport={graphViewport}
        onViewportChange={onGraphViewportChange}
      />
      <HistoryPanel
        entries={historyEntries}
        onClear={onHistoryClear}
        onEntryClick={onHistoryEntryClick}
      />
    </div>
  );
}
