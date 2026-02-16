export interface DisplayProps {
  value: string;           // Result line (bottom) - used in both modes
  hasMemory: boolean;
  expression?: string;     // Expression line (top) - shown in expression mode
  expressionMode?: boolean; // Whether in expression mode
  cursorPosition?: number; // For cursor rendering (used by Plan 03)
}

// Helper function to render math symbols in expression display
function renderExpression(expr: string): string {
  return expr
    .replace(/\*/g, '×')  // Multiply sign (U+00D7)
    .replace(/\//g, '÷'); // Division sign (U+00F7)
}

export function Display({ value, hasMemory, expression, expressionMode }: DisplayProps) {
  const displayClass = value.length > 12 ? "display display--small" : "display";

  // Show expression line if in expression mode and there's an expression to show
  const showExpressionLine = expressionMode && expression && expression.length > 0;

  return (
    <div className={displayClass} data-testid="display">
      {hasMemory && <span className="memory-indicator" data-testid="memory-indicator">M</span>}

      {/* Expression line (top) - only visible when in expression mode with content */}
      {showExpressionLine && (
        <div className="display__expression" data-testid="display-expression">
          {renderExpression(expression)}
        </div>
      )}

      {/* Result line (bottom) - main display */}
      <div className="display__result" data-testid="display-result">
        {value}
      </div>
    </div>
  );
}
