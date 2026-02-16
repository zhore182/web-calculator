import { useRef, useEffect } from 'react';
import { getCursorPositionFromClick } from '../logic/cursorHelpers';

export interface DisplayProps {
  value: string;           // Result line (bottom) - used in both modes
  hasMemory: boolean;
  expression?: string;     // Expression line (top) - shown in expression mode
  expressionMode?: boolean; // Whether in expression mode
  cursorPosition?: number; // For cursor rendering (used by Plan 03)
  onExpressionClick?: (position: number) => void; // Click-to-position callback
}

// Helper function to render math symbols in expression display
function renderExpression(expr: string): string {
  return expr
    .replace(/\*/g, '×')  // Multiply sign (U+00D7)
    .replace(/\//g, '÷'); // Division sign (U+00F7)
}

export function Display({
  value,
  hasMemory,
  expression = '',
  expressionMode,
  cursorPosition = 0,
  onExpressionClick
}: DisplayProps) {
  const displayClass = value.length > 12 ? "display display--small" : "display";
  const expressionRef = useRef<HTMLDivElement>(null);

  // Show expression line if in expression mode (even if empty, to show cursor)
  const showExpressionLine = expressionMode;

  // Auto-scroll to keep cursor visible
  useEffect(() => {
    if (expressionRef.current && expressionMode) {
      const container = expressionRef.current;
      const charWidth = 10; // Approximate character width in pixels (monospace)
      const cursorX = cursorPosition * charWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

      // If cursor is near right edge, scroll to show it
      if (cursorX > scrollLeft + containerWidth - 20) {
        container.scrollLeft = cursorX - containerWidth + 20;
      }
      // If cursor is near left edge, scroll to show it
      else if (cursorX < scrollLeft + 20) {
        container.scrollLeft = Math.max(0, cursorX - 20);
      }
    }
  }, [cursorPosition, expressionMode]);

  const handleExpressionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onExpressionClick || !expressionRef.current) return;

    const rect = expressionRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollLeft = expressionRef.current.scrollLeft;
    const charWidth = 10; // Approximate character width in pixels (monospace)

    const position = getCursorPositionFromClick(
      clickX,
      charWidth,
      expression.length,
      scrollLeft
    );

    onExpressionClick(position);
  };

  // Render expression with cursor
  const renderExpressionWithCursor = () => {
    if (!expressionMode) return null;

    const displayExpression = renderExpression(expression);
    const beforeCursor = displayExpression.slice(0, cursorPosition);
    const afterCursor = displayExpression.slice(cursorPosition);

    return (
      <>
        <span>{beforeCursor}</span>
        <span className="display__cursor">|</span>
        <span>{afterCursor}</span>
      </>
    );
  };

  return (
    <div className={displayClass} data-testid="display">
      {hasMemory && <span className="memory-indicator" data-testid="memory-indicator">M</span>}

      {/* Expression line (top) - visible in expression mode */}
      {showExpressionLine && (
        <div
          ref={expressionRef}
          className="display__expression"
          data-testid="display-expression"
          onClick={handleExpressionClick}
        >
          {renderExpressionWithCursor()}
        </div>
      )}

      {/* Result line (bottom) - main display */}
      <div className="display__result" data-testid="display-result">
        {value}
      </div>
    </div>
  );
}
