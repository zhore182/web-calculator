import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './expressionParser';

// Helper for approximate comparisons
const expectApprox = (value: number | undefined, expected: number, precision = 6) => {
  expect(value).toBeDefined();
  expect(value).toBeCloseTo(expected, precision);
};

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

  describe('SCI-01: Trigonometric functions with angle mode', () => {
    describe('DEG mode', () => {
      it('should evaluate sin(90) = 1 in DEG mode', () => {
        const result = evaluateExpression('sin(90)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });

      it('should evaluate cos(0) = 1 in DEG mode', () => {
        const result = evaluateExpression('cos(0)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });

      it('should evaluate tan(45) = 1 in DEG mode', () => {
        const result = evaluateExpression('tan(45)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });

      it('should evaluate sin(30) = 0.5 in DEG mode', () => {
        const result = evaluateExpression('sin(30)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 0.5);
      });

      it('should evaluate cos(60) = 0.5 in DEG mode', () => {
        const result = evaluateExpression('cos(60)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 0.5);
      });
    });

    describe('RAD mode', () => {
      it('should evaluate sin(pi/2) = 1 in RAD mode', () => {
        const result = evaluateExpression('sin(pi/2)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });

      it('should evaluate cos(pi) = -1 in RAD mode', () => {
        const result = evaluateExpression('cos(pi)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, -1);
      });

      it('should evaluate tan(pi/4) = 1 in RAD mode', () => {
        const result = evaluateExpression('tan(pi/4)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });

      it('should evaluate cos(0) = 1 in RAD mode', () => {
        const result = evaluateExpression('cos(0)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, 1);
      });
    });
  });

  describe('SCI-02: Inverse trigonometric functions', () => {
    describe('DEG mode', () => {
      it('should evaluate asin(1) = 90 in DEG mode', () => {
        const result = evaluateExpression('asin(1)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 90);
      });

      it('should evaluate acos(0) = 90 in DEG mode', () => {
        const result = evaluateExpression('acos(0)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 90);
      });

      it('should evaluate atan(1) = 45 in DEG mode', () => {
        const result = evaluateExpression('atan(1)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 45);
      });

      it('should evaluate asin(0.5) = 30 in DEG mode', () => {
        const result = evaluateExpression('asin(0.5)', 'DEG');
        expect(result.status).toBe('success');
        expectApprox(result.value, 30);
      });
    });

    describe('RAD mode', () => {
      it('should evaluate asin(1) ≈ pi/2 in RAD mode', () => {
        const result = evaluateExpression('asin(1)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, Math.PI / 2);
      });

      it('should evaluate acos(0) ≈ pi/2 in RAD mode', () => {
        const result = evaluateExpression('acos(0)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, Math.PI / 2);
      });

      it('should evaluate atan(1) ≈ pi/4 in RAD mode', () => {
        const result = evaluateExpression('atan(1)', 'RAD');
        expect(result.status).toBe('success');
        expectApprox(result.value, Math.PI / 4);
      });
    });

    describe('Domain errors for inverse trig', () => {
      it('should return error for asin(2) - outside domain', () => {
        const result = evaluateExpression('asin(2)', 'DEG');
        expect(result.status).toBe('error');
        expect(result.error).toBeDefined();
      });

      it('should return error for acos(-2) - outside domain', () => {
        const result = evaluateExpression('acos(-2)', 'DEG');
        expect(result.status).toBe('error');
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('SCI-03: Hyperbolic functions', () => {
    it('should evaluate sinh(0) = 0', () => {
      const result = evaluateExpression('sinh(0)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate cosh(0) = 1', () => {
      const result = evaluateExpression('cosh(0)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 1);
    });

    it('should evaluate tanh(0) = 0', () => {
      const result = evaluateExpression('tanh(0)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate asinh(0) = 0', () => {
      const result = evaluateExpression('asinh(0)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate acosh(1) = 0', () => {
      const result = evaluateExpression('acosh(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate atanh(0) = 0', () => {
      const result = evaluateExpression('atanh(0)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate sinh(1)', () => {
      const result = evaluateExpression('sinh(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, Math.sinh(1));
    });

    it('should evaluate cosh(1)', () => {
      const result = evaluateExpression('cosh(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, Math.cosh(1));
    });

    it('should evaluate tanh(1)', () => {
      const result = evaluateExpression('tanh(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, Math.tanh(1));
    });
  });

  describe('SCI-04: Logarithmic functions', () => {
    it('should evaluate log(100) = 2 (base 10)', () => {
      const result = evaluateExpression('log(100)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 2);
    });

    it('should evaluate log(1) = 0 (base 10)', () => {
      const result = evaluateExpression('log(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate log(1000) = 3 (base 10)', () => {
      const result = evaluateExpression('log(1000)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 3);
    });

    it('should evaluate ln(e) = 1 (natural log)', () => {
      const result = evaluateExpression('ln(e)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 1);
    });

    it('should evaluate ln(1) = 0 (natural log)', () => {
      const result = evaluateExpression('ln(1)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0);
    });

    it('should evaluate ln(2.71828) ≈ 1', () => {
      const result = evaluateExpression('ln(2.71828)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 1, 4);
    });
  });

  describe('SCI-05: Exponentiation', () => {
    it('should evaluate 2^2 = 4', () => {
      const result = evaluateExpression('2^2');
      expect(result.status).toBe('success');
      expect(result.value).toBe(4);
    });

    it('should evaluate 2^3 = 8', () => {
      const result = evaluateExpression('2^3');
      expect(result.status).toBe('success');
      expect(result.value).toBe(8);
    });

    it('should evaluate 2^10 = 1024', () => {
      const result = evaluateExpression('2^10');
      expect(result.status).toBe('success');
      expect(result.value).toBe(1024);
    });

    it('should evaluate 5^2 = 25', () => {
      const result = evaluateExpression('5^2');
      expect(result.status).toBe('success');
      expect(result.value).toBe(25);
    });

    it('should evaluate 3^3 = 27', () => {
      const result = evaluateExpression('3^3');
      expect(result.status).toBe('success');
      expect(result.value).toBe(27);
    });
  });

  describe('SCI-06: Root functions', () => {
    it('should evaluate sqrt(16) = 4', () => {
      const result = evaluateExpression('sqrt(16)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(4);
    });

    it('should evaluate sqrt(2) ≈ 1.41421356237', () => {
      const result = evaluateExpression('sqrt(2)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 1.41421356237, 10);
    });

    it('should evaluate cbrt(27) = 3', () => {
      const result = evaluateExpression('cbrt(27)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 3);
    });

    it('should evaluate cbrt(8) = 2', () => {
      const result = evaluateExpression('cbrt(8)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 2);
    });

    it('should evaluate nthRoot(16, 4) = 2', () => {
      const result = evaluateExpression('nthRoot(16, 4)');
      expect(result.status).toBe('success');
      expectApprox(result.value, 2);
    });

    it('should evaluate sqrt(-1) with domain error', () => {
      const result = evaluateExpression('sqrt(-1)');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Cannot take sqrt of negative number');
    });

    it('should evaluate sqrt(-4) with domain error', () => {
      const result = evaluateExpression('sqrt(-4)');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Cannot take sqrt of negative number');
    });
  });

  describe('SCI-07: Mathematical constants', () => {
    it('should evaluate pi constant', () => {
      const result = evaluateExpression('pi');
      expect(result.status).toBe('success');
      expectApprox(result.value, Math.PI, 10);
    });

    it('should evaluate e constant', () => {
      const result = evaluateExpression('e');
      expect(result.status).toBe('success');
      expectApprox(result.value, Math.E, 10);
    });

    it('should evaluate 2*pi with explicit multiplication', () => {
      const result = evaluateExpression('2*pi');
      expect(result.status).toBe('success');
      expectApprox(result.value, 2 * Math.PI, 10);
    });

    it('should evaluate 2pi with implicit multiplication', () => {
      const result = evaluateExpression('2pi');
      expect(result.status).toBe('success');
      expectApprox(result.value, 2 * Math.PI, 10);
    });

    it('should evaluate 3e with implicit multiplication', () => {
      const result = evaluateExpression('3e');
      expect(result.status).toBe('success');
      expectApprox(result.value, 3 * Math.E, 10);
    });
  });

  describe('SCI-08: Factorial function', () => {
    it('should evaluate 5! = 120', () => {
      const result = evaluateExpression('5!');
      expect(result.status).toBe('success');
      expect(result.value).toBe(120);
    });

    it('should evaluate 0! = 1', () => {
      const result = evaluateExpression('0!');
      expect(result.status).toBe('success');
      expect(result.value).toBe(1);
    });

    it('should evaluate 10! = 3628800', () => {
      const result = evaluateExpression('10!');
      expect(result.status).toBe('success');
      expect(result.value).toBe(3628800);
    });

    it('should evaluate 3! = 6', () => {
      const result = evaluateExpression('3!');
      expect(result.status).toBe('success');
      expect(result.value).toBe(6);
    });

    it('should return error for 3.5! (non-integer)', () => {
      const result = evaluateExpression('3.5!');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Factorial requires non-negative integer');
    });

    it('should return error for (-1)! (negative)', () => {
      const result = evaluateExpression('(-1)!');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Factorial requires non-negative integer');
    });

    it('should return error for (-5)! (negative)', () => {
      const result = evaluateExpression('(-5)!');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Factorial requires non-negative integer');
    });

    it('should return error for 2.7! (non-integer)', () => {
      const result = evaluateExpression('2.7!');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Factorial requires non-negative integer');
    });
  });

  describe('SCI-09: Absolute value function', () => {
    it('should evaluate abs(-5) = 5', () => {
      const result = evaluateExpression('abs(-5)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(5);
    });

    it('should evaluate abs(3) = 3', () => {
      const result = evaluateExpression('abs(3)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(3);
    });

    it('should evaluate abs(-7) = 7', () => {
      const result = evaluateExpression('abs(-7)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(7);
    });

    it('should evaluate abs(0) = 0', () => {
      const result = evaluateExpression('abs(0)');
      expect(result.status).toBe('success');
      expect(result.value).toBe(0);
    });
  });

  describe('SCI-10: Percentage operator', () => {
    it('should evaluate 50% = 0.5', () => {
      const result = evaluateExpression('50%');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0.5);
    });

    it('should evaluate 200*50% = 100', () => {
      const result = evaluateExpression('200*50%');
      expect(result.status).toBe('success');
      expectApprox(result.value, 100);
    });

    it('should evaluate 100% = 1', () => {
      const result = evaluateExpression('100%');
      expect(result.status).toBe('success');
      expectApprox(result.value, 1);
    });

    it('should evaluate 25% = 0.25', () => {
      const result = evaluateExpression('25%');
      expect(result.status).toBe('success');
      expectApprox(result.value, 0.25);
    });

    it('should evaluate 80*25% = 20', () => {
      const result = evaluateExpression('80*25%');
      expect(result.status).toBe('success');
      expectApprox(result.value, 20);
    });
  });

  describe('Division by zero error', () => {
    it('should return specific error for 1/0', () => {
      const result = evaluateExpression('1/0');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Cannot divide by zero');
    });

    it('should return specific error for 5/0', () => {
      const result = evaluateExpression('5/0');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Cannot divide by zero');
    });

    it('should return specific error for 10/(5-5)', () => {
      const result = evaluateExpression('10/(5-5)');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Cannot divide by zero');
    });
  });

  describe('EXPR-04: Scientific notation for extreme numbers', () => {
    it('should display scientific notation for 1e15', () => {
      const result = evaluateExpression('10^15');
      expect(result.status).toBe('success');
      expect(result.display).toMatch(/e\+15/);
    });

    it('should display scientific notation for 0.0000001 (1e-7)', () => {
      const result = evaluateExpression('0.0000001');
      expect(result.status).toBe('success');
      expect(result.display).toMatch(/1e-7/);
    });

    it('should NOT display scientific notation for 42', () => {
      const result = evaluateExpression('42');
      expect(result.status).toBe('success');
      expect(result.display).toBe('42');
      expect(result.display).not.toMatch(/e/);
    });

    it('should NOT display scientific notation for 999999999999 (just under threshold)', () => {
      const result = evaluateExpression('999999999999');
      expect(result.status).toBe('success');
      expect(result.display).toBe('999999999999');
      expect(result.display).not.toMatch(/e/);
    });

    it('should display scientific notation for 1000000000000 (at threshold 1e12)', () => {
      const result = evaluateExpression('1000000000000');
      expect(result.status).toBe('success');
      expect(result.display).toMatch(/e\+12/);
    });

    it('should NOT display scientific notation for 0', () => {
      const result = evaluateExpression('0');
      expect(result.status).toBe('success');
      expect(result.display).toBe('0');
      expect(result.display).not.toMatch(/e/);
    });

    it('should display negative scientific notation for -1e15', () => {
      const result = evaluateExpression('-10^15');
      expect(result.status).toBe('success');
      expect(result.display).toMatch(/-.*e\+15/);
    });
  });
});
