export interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  className?: string;
  disabled?: boolean;
}

export function Button({ label, onClick, className = "", disabled = false }: ButtonProps) {
  const buttonClass = className ? `btn ${className}` : "btn";

  return (
    <button
      className={buttonClass}
      onClick={() => onClick(label)}
      data-testid={`btn-${label}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
