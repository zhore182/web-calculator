import { Display } from './Display';
import { ButtonPanel } from './ButtonPanel';
import { HistoryPanel } from './HistoryPanel';
import { ModeToggle } from './ModeToggle';
import { Autocomplete } from './Autocomplete';
import type { HistoryEntry } from '../logic/historyHandlers';
import type { ExpressionMode } from '../logic/expressionParser';
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
}: CalculatorProps) {
  // In expression mode: Display shows expression on top line, preview/result on bottom
  // In simple mode: Display shows only displayValue on bottom line
  const displayResultValue = expressionMode === 'expression' && previewResult
    ? previewResult
    : displayValue;

  return (
    <div className="calculator">
      <ModeToggle mode={expressionMode} onModeChange={onModeChange} />
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
      <ButtonPanel onButtonClick={onButtonClick} />
      <HistoryPanel
        entries={historyEntries}
        onClear={onHistoryClear}
        onEntryClick={onHistoryEntryClick}
      />
    </div>
  );
}
