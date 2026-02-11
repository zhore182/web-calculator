export interface DisplayProps {
  value: string;
}

export function Display({ value }: DisplayProps) {
  const displayClass = value.length > 12 ? "display display--small" : "display";

  return (
    <div className={displayClass} data-testid="display">
      {value}
    </div>
  );
}
