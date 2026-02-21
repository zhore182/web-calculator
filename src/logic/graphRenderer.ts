// Canvas-based graph rendering engine for 2D function plotting
import { evaluate } from 'mathjs';

export interface GraphConfig {
  width: number;       // Canvas pixel width
  height: number;      // Canvas pixel height
  xMin: number;        // Math x-axis minimum (default: -10)
  xMax: number;        // Math x-axis maximum (default: 10)
  yMin: number;        // Math y-axis minimum (default: -10)
  yMax: number;        // Math y-axis maximum (default: 10)
  angleMode: 'DEG' | 'RAD';
}

export interface ViewportBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const DEFAULT_VIEWPORT: ViewportBounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export interface Point {
  x: number;
  y: number | null;  // null for undefined/discontinuous points
}

/**
 * Converts math x-coordinate to canvas pixel x-coordinate
 */
export function mathToPixelX(mathX: number, config: GraphConfig): number {
  const mathWidth = config.xMax - config.xMin;
  return ((mathX - config.xMin) / mathWidth) * config.width;
}

/**
 * Converts math y-coordinate to canvas pixel y-coordinate
 * Note: Canvas y-axis is flipped (0 at top, increases downward)
 */
export function mathToPixelY(mathY: number, config: GraphConfig): number {
  const mathHeight = config.yMax - config.yMin;
  return config.height - ((mathY - config.yMin) / mathHeight) * config.height;
}

/**
 * Converts canvas pixel x-coordinate to math x-coordinate
 */
export function pixelToMathX(pixelX: number, config: GraphConfig): number {
  const mathWidth = config.xMax - config.xMin;
  return config.xMin + (pixelX / config.width) * mathWidth;
}

/**
 * Converts canvas pixel y-coordinate to math y-coordinate
 */
export function pixelToMathY(pixelY: number, config: GraphConfig): number {
  const mathHeight = config.yMax - config.yMin;
  return config.yMin + ((config.height - pixelY) / config.height) * mathHeight;
}

/**
 * Clamps viewport bounds to prevent degenerate ranges
 */
export function clampViewport(bounds: ViewportBounds): ViewportBounds {
  const MIN_RANGE = 0.01;
  const MAX_RANGE = 10000;

  let { xMin, xMax, yMin, yMax } = bounds;

  // Ensure x range is within limits
  let xRange = xMax - xMin;
  if (xRange < MIN_RANGE) {
    const xCenter = (xMin + xMax) / 2;
    xMin = xCenter - MIN_RANGE / 2;
    xMax = xCenter + MIN_RANGE / 2;
    xRange = MIN_RANGE;
  }
  if (xRange > MAX_RANGE) {
    const xCenter = (xMin + xMax) / 2;
    xMin = xCenter - MAX_RANGE / 2;
    xMax = xCenter + MAX_RANGE / 2;
  }

  // Ensure y range is within limits
  let yRange = yMax - yMin;
  if (yRange < MIN_RANGE) {
    const yCenter = (yMin + yMax) / 2;
    yMin = yCenter - MIN_RANGE / 2;
    yMax = yCenter + MIN_RANGE / 2;
    yRange = MIN_RANGE;
  }
  if (yRange > MAX_RANGE) {
    const yCenter = (yMin + yMax) / 2;
    yMin = yCenter - MAX_RANGE / 2;
    yMax = yCenter + MAX_RANGE / 2;
  }

  return { xMin, xMax, yMin, yMax };
}

/**
 * Zooms viewport in or out centered on a specific point
 * @param config Current graph configuration
 * @param factor Zoom factor (< 1 = zoom in, > 1 = zoom out)
 * @param centerX Math x-coordinate to zoom toward
 * @param centerY Math y-coordinate to zoom toward
 */
export function zoomViewport(
  config: GraphConfig,
  factor: number,
  centerX: number,
  centerY: number
): ViewportBounds {
  const { xMin, xMax, yMin, yMax } = config;

  // Calculate distances from center to each edge
  const leftDist = centerX - xMin;
  const rightDist = xMax - centerX;
  const bottomDist = centerY - yMin;
  const topDist = yMax - centerY;

  // Scale these distances by the zoom factor
  const newLeftDist = leftDist * factor;
  const newRightDist = rightDist * factor;
  const newBottomDist = bottomDist * factor;
  const newTopDist = topDist * factor;

  // Calculate new bounds
  const newXMin = centerX - newLeftDist;
  const newXMax = centerX + newRightDist;
  const newYMin = centerY - newBottomDist;
  const newYMax = centerY + newTopDist;

  return clampViewport({ xMin: newXMin, xMax: newXMax, yMin: newYMin, yMax: newYMax });
}

/**
 * Pans viewport by a pixel delta
 * @param config Current graph configuration
 * @param dxPixels Horizontal pixel delta (positive = drag right = shift viewport left)
 * @param dyPixels Vertical pixel delta (positive = drag down = shift viewport up)
 */
export function panViewport(
  config: GraphConfig,
  dxPixels: number,
  dyPixels: number
): ViewportBounds {
  const { width, height, xMin, xMax, yMin, yMax } = config;

  // Convert pixel delta to math delta
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const dxMath = (dxPixels / width) * xRange;
  const dyMath = (dyPixels / height) * yRange;

  // Apply pan (note: positive dxPixels means drag right, which shifts viewport left)
  const newXMin = xMin - dxMath;
  const newXMax = xMax - dxMath;
  // Note: Canvas y is flipped, so positive dyPixels (drag down) shifts viewport up
  const newYMin = yMin + dyMath;
  const newYMax = yMax + dyMath;

  return { xMin: newXMin, xMax: newXMax, yMin: newYMin, yMax: newYMax };
}

/**
 * Determines adaptive tick spacing based on axis range
 */
function getTickStep(range: number): number {
  if (range > 100) return 10;
  if (range > 20) return 5;
  return 1;
}

/**
 * Renders the x and y axes
 */
export function renderAxes(ctx: CanvasRenderingContext2D, config: GraphConfig): void {
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  // Draw x-axis (at y=0, or at bottom/top if 0 is off-screen)
  const yAxisPixel = mathToPixelY(0, config);
  if (yAxisPixel >= 0 && yAxisPixel <= config.height) {
    ctx.moveTo(0, yAxisPixel);
    ctx.lineTo(config.width, yAxisPixel);
  }

  // Draw y-axis (at x=0, or at left/right if 0 is off-screen)
  const xAxisPixel = mathToPixelX(0, config);
  if (xAxisPixel >= 0 && xAxisPixel <= config.width) {
    ctx.moveTo(xAxisPixel, 0);
    ctx.lineTo(xAxisPixel, config.height);
  }

  ctx.stroke();
}

/**
 * Renders grid lines at integer tick intervals
 */
export function renderGrid(ctx: CanvasRenderingContext2D, config: GraphConfig): void {
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
  ctx.lineWidth = 0.5;

  const xRange = config.xMax - config.xMin;
  const yRange = config.yMax - config.yMin;
  const xStep = getTickStep(xRange);
  const yStep = getTickStep(yRange);

  ctx.beginPath();

  // Vertical grid lines
  const xStart = Math.ceil(config.xMin / xStep) * xStep;
  for (let x = xStart; x <= config.xMax; x += xStep) {
    const pixelX = mathToPixelX(x, config);
    ctx.moveTo(pixelX, 0);
    ctx.lineTo(pixelX, config.height);
  }

  // Horizontal grid lines
  const yStart = Math.ceil(config.yMin / yStep) * yStep;
  for (let y = yStart; y <= config.yMax; y += yStep) {
    const pixelY = mathToPixelY(y, config);
    ctx.moveTo(0, pixelY);
    ctx.lineTo(config.width, pixelY);
  }

  ctx.stroke();
}

/**
 * Renders numeric labels at tick marks along axes
 */
export function renderTickLabels(ctx: CanvasRenderingContext2D, config: GraphConfig): void {
  ctx.fillStyle = '#888';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const xRange = config.xMax - config.xMin;
  const yRange = config.yMax - config.yMin;
  const xStep = getTickStep(xRange);
  const yStep = getTickStep(yRange);

  const yAxisPixel = mathToPixelY(0, config);
  const xAxisPixel = mathToPixelX(0, config);

  // X-axis labels
  const xStart = Math.ceil(config.xMin / xStep) * xStep;
  for (let x = xStart; x <= config.xMax; x += xStep) {
    if (x === 0) continue; // Skip origin to avoid overlap
    const pixelX = mathToPixelX(x, config);

    // Position label below x-axis (or at bottom if axis off-screen)
    let labelY = yAxisPixel + 4;
    if (yAxisPixel < 0) labelY = 4;
    if (yAxisPixel > config.height) labelY = config.height - 14;

    ctx.fillText(x.toString(), pixelX, labelY);
  }

  // Y-axis labels
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const yStart = Math.ceil(config.yMin / yStep) * yStep;
  for (let y = yStart; y <= config.yMax; y += yStep) {
    if (y === 0) continue; // Skip origin to avoid overlap
    const pixelY = mathToPixelY(y, config);

    // Position label to right of y-axis (or at left if axis off-screen)
    let labelX = xAxisPixel + 4;
    if (xAxisPixel < 0) labelX = 4;
    if (xAxisPixel > config.width) labelX = config.width - 30;

    ctx.fillText(y.toString(), labelX, pixelY);
  }
}

/**
 * Evaluates an expression at a single x value
 * @returns The y value, or null if evaluation fails or result is non-finite
 */
export function evaluateAtX(expression: string, x: number, angleMode: 'DEG' | 'RAD'): number | null {
  // Create evaluation scope with angle mode and log aliasing
  const scope: Record<string, any> = {};

  // Log aliasing: log() = base 10, ln() = natural log
  scope.log = (n: number) => Math.log10(n);
  scope.ln = (n: number) => Math.log(n);

  // Angle mode handling for trig functions
  if (angleMode === 'DEG') {
    // Override trig functions to convert degrees to radians
    scope.sin = (n: number) => Math.sin(n * Math.PI / 180);
    scope.cos = (n: number) => Math.cos(n * Math.PI / 180);
    scope.tan = (n: number) => Math.tan(n * Math.PI / 180);

    // Override inverse trig to convert radians to degrees
    scope.asin = (n: number) => Math.asin(n) * 180 / Math.PI;
    scope.acos = (n: number) => Math.acos(n) * 180 / Math.PI;
    scope.atan = (n: number) => Math.atan(n) * 180 / Math.PI;
  }

  try {
    // Set x in scope and evaluate
    scope.x = x;
    const result = evaluate(expression, scope);

    // Check for valid numeric result
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (error) {
    // Evaluation failed
    return null;
  }
}

/**
 * Samples a function expression at evenly-spaced x-values
 */
export function sampleFunction(expression: string, config: GraphConfig): Point[] {
  const points: Point[] = [];
  const sampleCount = config.width; // 1 sample per pixel column

  for (let i = 0; i < sampleCount; i++) {
    const x = config.xMin + (i / (sampleCount - 1)) * (config.xMax - config.xMin);
    const y = evaluateAtX(expression, x, config.angleMode);
    points.push({ x, y });
  }

  return points;
}

/**
 * Renders a function curve from sampled points
 */
export function renderCurve(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  config: GraphConfig
): void {
  ctx.strokeStyle = '#4a9eff';
  ctx.lineWidth = 2;
  ctx.beginPath();

  let pathStarted = false;

  for (const point of points) {
    if (point.y === null) {
      // Discontinuity - lift the pen
      pathStarted = false;
      continue;
    }

    const pixelX = mathToPixelX(point.x, config);
    const pixelY = mathToPixelY(point.y, config);

    // Skip points outside canvas bounds
    if (pixelY < -100 || pixelY > config.height + 100) {
      pathStarted = false;
      continue;
    }

    if (!pathStarted) {
      ctx.moveTo(pixelX, pixelY);
      pathStarted = true;
    } else {
      ctx.lineTo(pixelX, pixelY);
    }
  }

  ctx.stroke();
}

/**
 * Renders a trace point (filled circle with crosshairs) at a math coordinate
 */
export function renderTracePoint(
  ctx: CanvasRenderingContext2D,
  mathX: number,
  mathY: number,
  config: GraphConfig
): void {
  const pixelX = mathToPixelX(mathX, config);
  const pixelY = mathToPixelY(mathY, config);

  const color = '#ff6b6b'; // Contrasting red

  // Draw crosshair lines to axes
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 3]); // Dashed line
  ctx.beginPath();

  // Vertical line to x-axis
  const yAxisPixel = mathToPixelY(0, config);
  const xAxisYPosition = yAxisPixel >= 0 && yAxisPixel <= config.height ? yAxisPixel : config.height;
  ctx.moveTo(pixelX, pixelY);
  ctx.lineTo(pixelX, xAxisYPosition);

  // Horizontal line to y-axis
  const xAxisPixel = mathToPixelX(0, config);
  const yAxisXPosition = xAxisPixel >= 0 && xAxisPixel <= config.width ? xAxisPixel : 0;
  ctx.moveTo(pixelX, pixelY);
  ctx.lineTo(yAxisXPosition, pixelY);

  ctx.stroke();
  ctx.setLineDash([]); // Reset to solid line

  // Draw filled circle at the point
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pixelX, pixelY, 5, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Generates table data with evenly-spaced x values across viewport
 */
export function generateTableData(
  expression: string,
  config: GraphConfig,
  rowCount: number = 21
): Array<{ x: number; y: number | null }> {
  const data: Array<{ x: number; y: number | null }> = [];

  for (let i = 0; i < rowCount; i++) {
    const x = config.xMin + (i / (rowCount - 1)) * (config.xMax - config.xMin);
    const y = evaluateAtX(expression, x, config.angleMode);
    data.push({ x, y });
  }

  return data;
}

/**
 * Main render function - orchestrates all graph rendering steps
 */
export function renderGraph(
  ctx: CanvasRenderingContext2D,
  expression: string,
  config: GraphConfig
): void {
  // Clear canvas
  ctx.clearRect(0, 0, config.width, config.height);

  // Render coordinate system components
  renderGrid(ctx, config);
  renderAxes(ctx, config);
  renderTickLabels(ctx, config);

  // If expression is empty, only render the empty coordinate system
  if (expression.trim() === '') {
    return;
  }

  // Sample and render the function curve
  const points = sampleFunction(expression, config);
  renderCurve(ctx, points, config);
}
