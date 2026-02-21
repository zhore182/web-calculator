// Unit tests for graph rendering engine
import { describe, test, expect } from 'vitest';
import type { GraphConfig } from './graphRenderer';
import {
  mathToPixelX,
  mathToPixelY,
  pixelToMathX,
  pixelToMathY,
  sampleFunction,
  DEFAULT_VIEWPORT,
  zoomViewport,
  panViewport,
  clampViewport,
  evaluateAtX,
  generateTableData,
} from './graphRenderer';

describe('graphRenderer', () => {
  const testConfig: GraphConfig = {
    width: 400,
    height: 300,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    angleMode: 'RAD',
  };

  describe('Coordinate transforms', () => {
    test('mathToPixelX converts math x-coordinate to pixel x-coordinate', () => {
      // At xMin (-10), pixel should be 0
      expect(mathToPixelX(-10, testConfig)).toBe(0);

      // At xMax (10), pixel should be width (400)
      expect(mathToPixelX(10, testConfig)).toBe(400);

      // At center (0), pixel should be width/2 (200)
      expect(mathToPixelX(0, testConfig)).toBe(200);

      // At x=5, pixel should be 300 (3/4 of width)
      expect(mathToPixelX(5, testConfig)).toBe(300);
    });

    test('mathToPixelY converts math y-coordinate to pixel y-coordinate', () => {
      // At yMin (-10), pixel should be height (300) - y is flipped
      expect(mathToPixelY(-10, testConfig)).toBe(300);

      // At yMax (10), pixel should be 0
      expect(mathToPixelY(10, testConfig)).toBe(0);

      // At center (0), pixel should be height/2 (150)
      expect(mathToPixelY(0, testConfig)).toBe(150);

      // At y=5, pixel should be 75 (1/4 down from top)
      expect(mathToPixelY(5, testConfig)).toBe(75);
    });

    test('pixelToMathX is inverse of mathToPixelX', () => {
      const mathX = 3.5;
      const pixelX = mathToPixelX(mathX, testConfig);
      const reversedMathX = pixelToMathX(pixelX, testConfig);

      expect(reversedMathX).toBeCloseTo(mathX, 10);
    });

    test('pixelToMathY is inverse of mathToPixelY', () => {
      const mathY = -7.3;
      const pixelY = mathToPixelY(mathY, testConfig);
      const reversedMathY = pixelToMathY(pixelY, testConfig);

      expect(reversedMathY).toBeCloseTo(mathY, 10);
    });

    test('pixelToMathX converts pixel x-coordinate to math x-coordinate', () => {
      // At pixel 0, math should be xMin (-10)
      expect(pixelToMathX(0, testConfig)).toBe(-10);

      // At pixel width (400), math should be xMax (10)
      expect(pixelToMathX(400, testConfig)).toBe(10);

      // At pixel width/2 (200), math should be 0
      expect(pixelToMathX(200, testConfig)).toBe(0);
    });

    test('pixelToMathY converts pixel y-coordinate to math y-coordinate', () => {
      // At pixel 0, math should be yMax (10) - y is flipped
      expect(pixelToMathY(0, testConfig)).toBe(10);

      // At pixel height (300), math should be yMin (-10)
      expect(pixelToMathY(300, testConfig)).toBe(-10);

      // At pixel height/2 (150), math should be 0
      expect(pixelToMathY(150, testConfig)).toBe(0);
    });
  });

  describe('Function sampling', () => {
    test('sampleFunction with "x" expression returns identity line points', () => {
      const points = sampleFunction('x', testConfig);

      // Should have config.width samples
      expect(points.length).toBe(testConfig.width);

      // First point should be at xMin
      expect(points[0].x).toBeCloseTo(-10, 1);
      expect(points[0].y).toBeCloseTo(-10, 1);

      // Last point should be at xMax
      const lastPoint = points[points.length - 1];
      expect(lastPoint.x).toBeCloseTo(10, 1);
      expect(lastPoint.y).toBeCloseTo(10, 1);

      // Middle point should be near origin
      const midPoint = points[Math.floor(points.length / 2)];
      expect(midPoint.x).toBeCloseTo(0, 1);
      expect(midPoint.y).toBeCloseTo(0, 1);
    });

    test('sampleFunction with "x^2" returns correct parabola values', () => {
      const points = sampleFunction('x^2', testConfig);

      expect(points.length).toBe(testConfig.width);

      // Check specific points
      // At x=0, y should be 0
      const originPoint = points.find(p => Math.abs(p.x) < 0.1);
      expect(originPoint).toBeDefined();
      expect(originPoint!.y).toBeCloseTo(0, 1);

      // At x≈3, y should be ≈9 (within tolerance for discrete sampling)
      const x3Point = points.find(p => Math.abs(p.x - 3) < 0.2);
      expect(x3Point).toBeDefined();
      if (x3Point && x3Point.y !== null) {
        expect(x3Point.y).toBeGreaterThan(7);
        expect(x3Point.y).toBeLessThan(11);
      }

      // At x≈-3, y should be ≈9 (parabola is symmetric)
      const xNeg3Point = points.find(p => Math.abs(p.x + 3) < 0.2);
      expect(xNeg3Point).toBeDefined();
      if (xNeg3Point && xNeg3Point.y !== null) {
        expect(xNeg3Point.y).toBeGreaterThan(7);
        expect(xNeg3Point.y).toBeLessThan(11);
      }
    });

    test('sampleFunction with invalid expression returns all null y-values', () => {
      const points = sampleFunction('invalid**syntax', testConfig);

      expect(points.length).toBe(testConfig.width);

      // All y-values should be null
      const allNull = points.every(p => p.y === null);
      expect(allNull).toBe(true);
    });

    test('sampleFunction handles discontinuities (e.g., 1/x at x=0)', () => {
      const points = sampleFunction('1/x', testConfig);

      // Find point near x=0
      const nearZeroPoint = points.find(p => Math.abs(p.x) < 0.1);

      // Should either be null (division by zero) or large magnitude
      // At x≈0.05, 1/x = 20, so expect magnitude > 10
      if (nearZeroPoint && nearZeroPoint.y !== null) {
        expect(Math.abs(nearZeroPoint.y)).toBeGreaterThan(10);
      }
    });

    test('sampleFunction respects angle mode for trig functions', () => {
      const degConfig: GraphConfig = { ...testConfig, angleMode: 'DEG' };
      const radConfig: GraphConfig = { ...testConfig, angleMode: 'RAD' };

      // sin(90) in DEG mode should be 1
      const degPoints = sampleFunction('sin(90)', degConfig);
      expect(degPoints[0].y).toBeCloseTo(1, 5);

      // sin(90) in RAD mode should be sin(90 radians) ≈ 0.894
      const radPoints = sampleFunction('sin(90)', radConfig);
      expect(radPoints[0].y).toBeCloseTo(Math.sin(90), 5);
    });

    test('sampleFunction uses log as base-10 and ln as natural log', () => {
      // log(100) should be 2 (base 10)
      const logPoints = sampleFunction('log(100)', testConfig);
      expect(logPoints[0].y).toBeCloseTo(2, 5);

      // ln(e) should be 1 (natural log)
      const lnPoints = sampleFunction('ln(2.718281828)', testConfig);
      expect(lnPoints[0].y).toBeCloseTo(1, 3);
    });
  });

  describe('Trace point evaluation', () => {
    test('evaluateAtX returns correct value for x^2 at x=3', () => {
      const result = evaluateAtX('x^2', 3, 'RAD');
      expect(result).toBe(9);
    });

    test('evaluateAtX returns null for invalid expression', () => {
      const result = evaluateAtX('invalid**syntax', 5, 'RAD');
      expect(result).toBeNull();
    });

    test('evaluateAtX respects angle mode for sin(90)', () => {
      // sin(90) in DEG mode should be 1
      const degResult = evaluateAtX('sin(90)', 0, 'DEG');
      expect(degResult).toBeCloseTo(1, 5);

      // sin(90) in RAD mode should be sin(90 radians) ≈ 0.894
      const radResult = evaluateAtX('sin(90)', 0, 'RAD');
      expect(radResult).toBeCloseTo(Math.sin(90), 5);
    });

    test('evaluateAtX returns null for non-finite results', () => {
      const result = evaluateAtX('1/0', 0, 'RAD');
      expect(result).toBeNull();
    });
  });

  describe('Table data generation', () => {
    test('generateTableData returns correct default row count', () => {
      const data = generateTableData('x', testConfig);
      expect(data.length).toBe(21);
    });

    test('generateTableData returns custom row count', () => {
      const data = generateTableData('x', testConfig, 10);
      expect(data.length).toBe(10);
    });

    test('generateTableData x values span viewport range', () => {
      const data = generateTableData('x', testConfig);

      // First x should be xMin
      expect(data[0].x).toBeCloseTo(-10, 5);

      // Last x should be xMax
      expect(data[data.length - 1].x).toBeCloseTo(10, 5);
    });

    test('generateTableData returns correct y values for x^2', () => {
      const data = generateTableData('x^2', testConfig, 5);

      // At x=-10, y should be 100
      expect(data[0].y).toBeCloseTo(100, 1);

      // At x=0, y should be 0
      const midPoint = data[2]; // Middle of 5 points
      expect(midPoint.x).toBeCloseTo(0, 1);
      expect(midPoint.y).toBeCloseTo(0, 1);

      // At x=10, y should be 100
      expect(data[4].y).toBeCloseTo(100, 1);
    });

    test('generateTableData returns null y for undefined points', () => {
      // 1/x at x=0 should return null
      const config: GraphConfig = {
        ...testConfig,
        xMin: -1,
        xMax: 1,
      };

      const data = generateTableData('1/x', config, 3);

      // Middle point should be at x=0
      expect(data[1].x).toBeCloseTo(0, 5);

      // y should be null (division by zero)
      expect(data[1].y).toBeNull();
    });
  });

  describe('Viewport manipulation', () => {
    test('DEFAULT_VIEWPORT has expected values', () => {
      expect(DEFAULT_VIEWPORT).toEqual({
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
      });
    });

    test('zoomViewport with factor 0.5 (zoom in) centered at origin halves range', () => {
      const result = zoomViewport(testConfig, 0.5, 0, 0);

      // Range should be halved from 20 to 10
      expect(result.xMax - result.xMin).toBeCloseTo(10, 5);
      expect(result.yMax - result.yMin).toBeCloseTo(10, 5);

      // Should be centered at origin
      expect(result.xMin).toBeCloseTo(-5, 5);
      expect(result.xMax).toBeCloseTo(5, 5);
      expect(result.yMin).toBeCloseTo(-5, 5);
      expect(result.yMax).toBeCloseTo(5, 5);
    });

    test('zoomViewport with factor 2 (zoom out) centered at origin doubles range', () => {
      const result = zoomViewport(testConfig, 2, 0, 0);

      // Range should be doubled from 20 to 40
      expect(result.xMax - result.xMin).toBeCloseTo(40, 5);
      expect(result.yMax - result.yMin).toBeCloseTo(40, 5);

      // Should be centered at origin
      expect(result.xMin).toBeCloseTo(-20, 5);
      expect(result.xMax).toBeCloseTo(20, 5);
      expect(result.yMin).toBeCloseTo(-20, 5);
      expect(result.yMax).toBeCloseTo(20, 5);
    });

    test('zoomViewport centered off-origin keeps point at same relative position', () => {
      const centerX = 5;
      const centerY = 3;
      const result = zoomViewport(testConfig, 0.5, centerX, centerY);

      // The specified point should remain at the same position in the viewport
      // Before zoom: (5, 3) is at 75% across horizontally (15/20 from left)
      // After zoom: (5, 3) should still be at 75% across horizontally
      const beforeXRatio = (centerX - testConfig.xMin) / (testConfig.xMax - testConfig.xMin);
      const afterXRatio = (centerX - result.xMin) / (result.xMax - result.xMin);

      const beforeYRatio = (centerY - testConfig.yMin) / (testConfig.yMax - testConfig.yMin);
      const afterYRatio = (centerY - result.yMin) / (result.yMax - result.yMin);

      expect(afterXRatio).toBeCloseTo(beforeXRatio, 5);
      expect(afterYRatio).toBeCloseTo(beforeYRatio, 5);

      // Also verify range changed
      expect(result.xMax - result.xMin).toBeCloseTo(10, 5);
    });

    test('panViewport with positive dx shifts viewport left', () => {
      // Drag right 100 pixels should shift viewport left
      const result = panViewport(testConfig, 100, 0);

      // 100 pixels is 1/4 of width (400), so should shift by 5 math units (1/4 of 20)
      expect(result.xMin).toBeCloseTo(-15, 5);
      expect(result.xMax).toBeCloseTo(5, 5);

      // Y should be unchanged
      expect(result.yMin).toBe(-10);
      expect(result.yMax).toBe(10);
    });

    test('panViewport with positive dy shifts viewport up', () => {
      // Drag down 100 pixels should shift viewport up
      const result = panViewport(testConfig, 0, 100);

      // 100 pixels is 1/3 of height (300), so should shift by ~6.67 math units (1/3 of 20)
      expect(result.yMin).toBeCloseTo(-10 + 20/3, 5);
      expect(result.yMax).toBeCloseTo(10 + 20/3, 5);

      // X should be unchanged
      expect(result.xMin).toBe(-10);
      expect(result.xMax).toBe(10);
    });

    test('clampViewport prevents range below 0.01', () => {
      const tinyViewport = { xMin: 0, xMax: 0.005, yMin: 0, yMax: 0.005 };
      const result = clampViewport(tinyViewport);

      expect(result.xMax - result.xMin).toBeCloseTo(0.01, 5);
      expect(result.yMax - result.yMin).toBeCloseTo(0.01, 5);
    });

    test('clampViewport prevents range above 10000', () => {
      const hugeViewport = { xMin: -6000, xMax: 6000, yMin: -6000, yMax: 6000 };
      const result = clampViewport(hugeViewport);

      expect(result.xMax - result.xMin).toBeCloseTo(10000, 5);
      expect(result.yMax - result.yMin).toBeCloseTo(10000, 5);
    });
  });
});
