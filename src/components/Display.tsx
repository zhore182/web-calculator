export interface DisplayProps {
  value: string;
  hasMemory: boolean;
}

export function Display({ value, hasMemory }: DisplayProps) {
  const displayClass = value.length > 12 ? "display display--small" : "display";

  return (
    <div className={displayClass} data-testid="display">
      {hasMemory && <span className="memory-indicator" data-testid="memory-indicator">M</span>}
      {value}
    </div>
  );
}
