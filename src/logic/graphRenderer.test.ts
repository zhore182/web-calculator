// Unit tests for graph rendering engine
import { describe, test, expect } from 'vitest';
import type { GraphConfig } from './graphRenderer';
import {
  mathToPixelX,
  mathToPixelY,
  pixelToMathX,
  pixelToMathY,
  sampleFunction,
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
});
