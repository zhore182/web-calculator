// React component for Canvas-based graph rendering
import { useRef, useEffect } from 'react';
import type { GraphConfig, ViewportBounds } from '../logic/graphRenderer';
import { renderGraph } from '../logic/graphRenderer';

export interface GraphPanelProps {
  expression: string;        // The function expression to plot (e.g., "sin(x)", "x^2")
  angleMode: 'DEG' | 'RAD';
  visible: boolean;          // Whether graph panel is shown
  viewport: ViewportBounds;
  onViewportChange: (viewport: ViewportBounds) => void;
}

export function GraphPanel({ expression, angleMode, visible, viewport }: GraphPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution for crisp rendering on retina displays
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 280;
    const displayHeight = 200;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Scale context to match device pixel ratio
    ctx.scale(dpr, dpr);

    // Create GraphConfig using dynamic viewport
    const config: GraphConfig = {
      width: displayWidth,
      height: displayHeight,
      xMin: viewport.xMin,
      xMax: viewport.xMax,
      yMin: viewport.yMin,
      yMax: viewport.yMax,
      angleMode,
    };

    // Render the graph
    renderGraph(ctx, expression, config);
  }, [expression, angleMode, visible, viewport]);

  // Don't render canvas when not visible
  if (!visible) {
    return null;
  }

  return (
    <div className="graph-panel">
      <canvas
        ref={canvasRef}
        className="graph-panel__canvas"
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
}
