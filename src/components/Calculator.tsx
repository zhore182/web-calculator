import { Display } from './Display';
import { ButtonPanel } from './ButtonPanel';
import { HistoryPanel } from './HistoryPanel';
import type { HistoryEntry } from '../logic/historyHandlers';
import '../styles/Calculator.css';

export interface CalculatorProps {
  displayValue: string;
  onButtonClick: (value: string) => void;
  hasMemory: boolean;
  historyEntries: HistoryEntry[];
  onHistoryClear: () => void;
  onHistoryEntryClick: (entry: HistoryEntry) => void;
}

export default function Calculator({
  displayValue,
  onButtonClick,
  hasMemory,
  historyEntries,
  onHistoryClear,
  onHistoryEntryClick,
}: CalculatorProps) {
  return (
    <div className="calculator">
      <Display value={displayValue} hasMemory={hasMemory} />
      <ButtonPanel onButtonClick={onButtonClick} />
      <HistoryPanel
        entries={historyEntries}
        onClear={onHistoryClear}
        onEntryClick={onHistoryEntryClick}
      />
    </div>
  );
}
