import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './expressionParser';

describe('expressionParser', () => {
  describe('Basic arithmetic with PEMDAS', () => {
    it('should evaluate multiplication before addition (2+3*4 = 14, not 20)', () => {
      const result = evaluateExpression('2+3*4');
      expect(result.status).toBe('success');
      expect(result.value).toBe(14);
      expect(result.display).toBe('14');
    });

    it('should evaluate multiplication before subtraction (10-2*3 = 4)', () => {
      const result = evaluateExpression('10-2*3');
      expect(result.status).toBe('success');
      expect(result.value).toBe(4);
      expect(result.display).toBe('4');
    });

    it('should evaluate division before addition (6/2+1 = 4)', () => {
      const result = evaluateExpression('6/2+1');
      expect(result.status).toBe('success');
      expect(result.value).toBe(4);
      expect(result.display).toBe('4');
    });

    it('should handle simple addition (2+3 = 5)', () => {
      const result = evaluateExpression('2+3');
      expect(result.status).toBe('success');
      expect(result.value).toBe(5);
      expect(result.display).toBe('5');
    });

    it('should handle division with decimal result (10/3)', () => {
      const result = evaluateExpression('10/3');
      expect(result.status).toBe('success');
      expect(result.value).toBeCloseTo(3.333333333, 6);
      expect(result.display).toContain('3.333');
    });
  });

  describe('Parentheses', () => {
    it('should evaluate parentheses first ((2+3)*4 = 20)', () => {
      const result = evaluateExpression('(2+3)*4');
      expect(result.status).toBe('success');
      expect(result.value).toBe(20);
      expect(result.display).toBe('20');
    });

    it('should evaluate parentheses first (2*(3+4) = 14)', () => {
      const result = evaluateExpression('2*(3+4)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(14);
      expect(result.display).toBe('14');
    });

    it('should handle nested parentheses ((1+2)*(3+4) = 21)', () => {
      const result = evaluateExpression('((1+2)*(3+4))');
      expect(result.status).toBe('success');
      expect(result.value).toBe(21);
      expect(result.display).toBe('21');
    });

    it('should handle single number in parentheses ((5) = 5)', () => {
      const result = evaluateExpression('(5)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(5);
      expect(result.display).toBe('5');
    });
  });

  describe('Implicit multiplication', () => {
    it('should handle implicit multiplication 2(3) = 6', () => {
      const result = evaluateExpression('2(3)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(6);
      expect(result.display).toBe('6');
    });

    it('should handle implicit multiplication (2)(3) = 6', () => {
      const result = evaluateExpression('(2)(3)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(6);
      expect(result.display).toBe('6');
    });

    it('should handle implicit multiplication with expressions 2(3+4) = 14', () => {
      const result = evaluateExpression('2(3+4)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(14);
      expect(result.display).toBe('14');
    });
  });

  describe('Error handling', () => {
    it('should return error for incomplete expression (2+3*)', () => {
      const result = evaluateExpression('2+3*');
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
      expect(result.error).toBeTruthy();
    });

    it('should return error for invalid operators (2**3)', () => {
      const result = evaluateExpression('2**3');
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });

    it('should return error for unmatched closing parenthesis ())', () => {
      const result = evaluateExpression(')');
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });

    it('should handle empty string', () => {
      const result = evaluateExpression('');
      expect(result.status).toBe('incomplete');
    });

    it('should return error for single operator (/)', () => {
      const result = evaluateExpression('/');
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });
  });

  describe('Floating-point precision', () => {
    it('should format 0.1+0.2 as "0.3" (not "0.30000000000000004")', () => {
      const result = evaluateExpression('0.1+0.2');
      expect(result.status).toBe('success');
      expect(result.value).toBeCloseTo(0.3, 10);
      expect(result.display).toBe('0.3');
    });

    it('should format 1/3 with reasonable decimal representation', () => {
      const result = evaluateExpression('1/3');
      expect(result.status).toBe('success');
      expect(result.value).toBeCloseTo(0.3333333333, 6);
      expect(result.display).toMatch(/^0\.333/);
    });

    it('should handle large numbers correctly', () => {
      const result = evaluateExpression('999999999*2');
      expect(result.status).toBe('success');
      expect(result.value).toBe(1999999998);
      expect(result.display).toBe('1999999998');
    });

    it('should handle very small numbers correctly', () => {
      const result = evaluateExpression('0.000001*2');
      expect(result.status).toBe('success');
      expect(result.value).toBeCloseTo(0.000002, 10);
      expect(result.display).toBe('0.000002');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero', () => {
      const result = evaluateExpression('0');
      expect(result.status).toBe('success');
      expect(result.value).toBe(0);
      expect(result.display).toBe('0');
    });

    it('should handle unary minus (-5)', () => {
      const result = evaluateExpression('-5');
      expect(result.status).toBe('success');
      expect(result.value).toBe(-5);
      expect(result.display).toBe('-5');
    });

    it('should handle factorial (5!) - preparing for Phase 2', () => {
      const result = evaluateExpression('5!');
      expect(result.status).toBe('success');
      expect(result.value).toBe(120);
      expect(result.display).toBe('120');
    });
  });
});
