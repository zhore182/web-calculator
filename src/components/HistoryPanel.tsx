import type { HistoryEntry } from '../logic/historyHandlers';

export interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onEntryClick: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ entries, onClear, onEntryClick }: HistoryPanelProps) {
  return (
    <div className="history-panel" data-testid="history-panel">
      <div className="history-header">
        <span className="history-title">History</span>
        {entries.length > 0 && (
          <button
            className="history-clear-btn"
            onClick={onClear}
            data-testid="history-clear-btn"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="history-entries" data-testid="history-entries">
        {entries.length === 0 ? (
          <div className="history-empty">No calculations yet</div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              className="history-entry"
              onClick={() => onEntryClick(entry)}
              data-testid={`history-entry-${entry.id}`}
            >
              <span className="history-expression">{entry.expression} =</span>
              <span className="history-result">{entry.result}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
