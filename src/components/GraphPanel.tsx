// React component for Canvas-based graph rendering
import { useRef, useEffect, useState } from 'react';
import type { GraphConfig, ViewportBounds } from '../logic/graphRenderer';
import { renderGraph, zoomViewport, panViewport, pixelToMathX, pixelToMathY, DEFAULT_VIEWPORT } from '../logic/graphRenderer';

export interface GraphPanelProps {
  expression: string;        // The function expression to plot (e.g., "sin(x)", "x^2")
  angleMode: 'DEG' | 'RAD';
  visible: boolean;          // Whether graph panel is shown
  viewport: ViewportBounds;
  onViewportChange: (viewport: ViewportBounds) => void;
}

export function GraphPanel({ expression, angleMode, visible, viewport, onViewportChange }: GraphPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef<GraphConfig | null>(null);
  const dragStateRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

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

    // Store config in ref for event handlers
    configRef.current = config;

    // Render the graph
    renderGraph(ctx, expression, config);
  }, [expression, angleMode, visible, viewport]);

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!configRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    // Convert to math coordinates
    const mathX = pixelToMathX(pixelX, configRef.current);
    const mathY = pixelToMathY(pixelY, configRef.current);

    // Determine zoom factor (scroll down = zoom out, scroll up = zoom in)
    const factor = e.deltaY > 0 ? 1.2 : 0.8;

    // Apply zoom centered on mouse position
    const newViewport = zoomViewport(configRef.current, factor, mathX, mathY);
    onViewportChange(newViewport);
  };

  // Mouse down handler - start drag
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragStateRef.current = {
      dragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    setIsDragging(true);
  };

  // Mouse move handler - pan during drag
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStateRef.current.dragging || !configRef.current) return;

    const dx = e.clientX - dragStateRef.current.lastX;
    const dy = e.clientY - dragStateRef.current.lastY;

    // Update last position
    dragStateRef.current.lastX = e.clientX;
    dragStateRef.current.lastY = e.clientY;

    // Apply pan
    const newViewport = panViewport(configRef.current, dx, dy);
    onViewportChange(newViewport);
  };

  // Mouse up handler - end drag
  const handleMouseUp = () => {
    dragStateRef.current.dragging = false;
    setIsDragging(false);
  };

  // Mouse leave handler - end drag if dragging
  const handleMouseLeave = () => {
    if (dragStateRef.current.dragging) {
      dragStateRef.current.dragging = false;
      setIsDragging(false);
    }
  };

  // Touch start handler
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragStateRef.current = {
        dragging: true,
        lastX: touch.clientX,
        lastY: touch.clientY,
      };
      setIsDragging(true);
    }
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!dragStateRef.current.dragging || !configRef.current || e.touches.length !== 1) return;

    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const dx = touch.clientX - dragStateRef.current.lastX;
    const dy = touch.clientY - dragStateRef.current.lastY;

    dragStateRef.current.lastX = touch.clientX;
    dragStateRef.current.lastY = touch.clientY;

    const newViewport = panViewport(configRef.current, dx, dy);
    onViewportChange(newViewport);
  };

  // Touch end handler
  const handleTouchEnd = () => {
    dragStateRef.current.dragging = false;
    setIsDragging(false);
  };

  // Zoom in button handler
  const handleZoomIn = () => {
    if (!configRef.current) return;

    // Zoom in (factor 0.7) centered on viewport center
    const centerX = (viewport.xMin + viewport.xMax) / 2;
    const centerY = (viewport.yMin + viewport.yMax) / 2;
    const newViewport = zoomViewport(configRef.current, 0.7, centerX, centerY);
    onViewportChange(newViewport);
  };

  // Zoom out button handler
  const handleZoomOut = () => {
    if (!configRef.current) return;

    // Zoom out (factor 1.4) centered on viewport center
    const centerX = (viewport.xMin + viewport.xMax) / 2;
    const centerY = (viewport.yMin + viewport.yMax) / 2;
    const newViewport = zoomViewport(configRef.current, 1.4, centerX, centerY);
    onViewportChange(newViewport);
  };

  // Reset button handler
  const handleReset = () => {
    onViewportChange(DEFAULT_VIEWPORT);
  };

  // Don't render canvas when not visible
  if (!visible) {
    return null;
  }

  const canvasClassName = isDragging
    ? 'graph-panel__canvas graph-panel__canvas--dragging'
    : 'graph-panel__canvas';

  return (
    <div className="graph-panel">
      <div className="graph-panel__controls">
        <button
          className="graph-panel__control-btn"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          +
        </button>
        <button
          className="graph-panel__control-btn"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          −
        </button>
        <button
          className="graph-panel__control-btn"
          onClick={handleReset}
          title="Reset view"
        >
          ⟲
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        style={{ width: '100%', height: '200px' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
