import { evaluate } from 'mathjs';
import { AngleMode, CalculatorSettings, VariableRegisters } from '../types/calculator';
import {
  decimalToFraction,
  primeFactorization,
  toEngineering,
  toPiMultiple,
  toRecurringDecimal,
  toSexagesimal,
  toSurdString,
} from './exactMath';

export interface EvalResult {
  success: boolean;
  numericValue?: number;
  standardResult: string;
  decimalResult: string;
  recurringResult?: string;
  engResult?: string;
  sexagesimalResult?: string;
  primeFactors?: string;
  errorMessage?: string;
}

/**
 * Clean & normalize Casio display expression into mathjs executable expression
 */
export function sanitizeExpression(
  expr: string,
  angleMode: AngleMode,
  vars: VariableRegisters
): string {
  let s = expr.trim();
  if (!s) return '0';

  // Replace visual multiplication and division symbols
  s = s.replace(/×/g, '*').replace(/÷/g, '/');

  // Replace powers
  s = s.replace(/²/g, '^2').replace(/³/g, '^3');

  // Replace square roots
  s = s.replace(/√\(/g, 'sqrt(');
  s = s.replace(/√([0-9a-zA-Z.]+)/g, 'sqrt($1)');

  // Replace Ans and PreAns
  s = s.replace(/\bPreAns\b/g, `(${vars.PreAns})`);
  s = s.replace(/\bAns\b/g, `(${vars.Ans})`);

  // Replace constants
  s = s.replace(/π/g, 'pi');

  // Replace scientific notation (e.g. 2×10^3 or 2e3)
  s = s.replace(/×10\^/g, '*10^');

  // Replace log(x) with log10(x), ln(x) with log(x)
  s = s.replace(/\blog10\(/g, 'log10_temp(');
  s = s.replace(/\bln\(/g, 'log(');
  s = s.replace(/\blog\(/g, 'log10(');
  s = s.replace(/\blog10_temp\(/g, 'log10(');

  // Replace Abs
  s = s.replace(/Abs\(/g, 'abs(');

  // Substitute variables (A, B, C, D, E, F, x, y, z) when standalone
  const varKeys: (keyof VariableRegisters)[] = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z'];
  for (const k of varKeys) {
    const reg = new RegExp(`(?<![a-zA-Z0-9_])${k}(?![a-zA-Z0-9_])`, 'g');
    s = s.replace(reg, `(${vars[k]})`);
  }

  // Handle angle conversions for trig functions
  // sin, cos, tan, asin, acos, atan
  if (angleMode === 'DEG') {
    // Forward trig: argument in degrees -> convert to radians for Math/mathjs
    s = s.replace(/\bsin\(([^)]+)\)/g, 'sin(($1) * deg)');
    s = s.replace(/\bcos\(([^)]+)\)/g, 'cos(($1) * deg)');
    s = s.replace(/\btan\(([^)]+)\)/g, 'tan(($1) * deg)');
    // Inverse trig: result in radians -> convert to degrees
    s = s.replace(/\basin\(([^)]+)\)/g, '(asin($1) / deg)');
    s = s.replace(/\bacos\(([^)]+)\)/g, '(acos($1) / deg)');
    s = s.replace(/\batan\(([^)]+)\)/g, '(atan($1) / deg)');
  } else if (angleMode === 'GRA') {
    // 400 grads = 2pi rad => 1 grad = pi/200 rad
    s = s.replace(/\bsin\(([^)]+)\)/g, 'sin(($1) * (pi / 200))');
    s = s.replace(/\bcos\(([^)]+)\)/g, 'cos(($1) * (pi / 200))');
    s = s.replace(/\btan\(([^)]+)\)/g, 'tan(($1) * (pi / 200))');
    s = s.replace(/\basin\(([^)]+)\)/g, '(asin($1) * (200 / pi))');
    s = s.replace(/\bacos\(([^)]+)\)/g, '(acos($1) * (200 / pi))');
    s = s.replace(/\batan\(([^)]+)\)/g, '(atan($1) * (200 / pi))');
  }

  // Handle Combinations nCr and Permutations nPr
  // e.g. 5 nCr 2 -> combinations(5, 2)
  s = s.replace(/(\d+)\s*nCr\s*(\d+)/g, 'combinations($1, $2)');
  s = s.replace(/(\d+)\s*nPr\s*(\d+)/g, 'permutations($1, $2)');

  // Handle implicit multiplication like 2(3) -> 2*(3), 5pi -> 5*pi
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(\))(\d)/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');
  s = s.replace(/(\d)(pi|sqrt|log|sin|cos|tan|abs)/g, '$1*$2');

  return s;
}

/**
 * Format numeric value according to Casio Number Format settings
 */
export function formatBySettings(val: number, settings: CalculatorSettings): string {
  if (!Number.isFinite(val)) {
    if (Number.isNaN(val)) return 'Math ERROR';
    return val > 0 ? 'Infinity' : '-Infinity';
  }

  // Clean tiny floating point noise
  if (Math.abs(val) < 1e-13) return '0';

  if (settings.numberFormat === 'FIX') {
    return val.toFixed(settings.fixSciDigits);
  } else if (settings.numberFormat === 'SCI') {
    return val.toExponential(settings.fixSciDigits);
  } else if (settings.numberFormat === 'NORM2') {
    if (Math.abs(val) !== 0 && (Math.abs(val) < 1e-9 || Math.abs(val) >= 1e10)) {
      return val.toExponential(9).replace(/e\+?/, '×10^');
    }
  } else {
    // NORM1: switches to exponential at < 1e-2 or >= 1e10
    if (Math.abs(val) !== 0 && (Math.abs(val) < 1e-2 || Math.abs(val) >= 1e10)) {
      return val.toExponential(9).replace(/e\+?/, '×10^');
    }
  }

  // Standard clean decimal
  const str = parseFloat(val.toPrecision(12)).toString();
  return str;
}

/**
 * Execute standard calculation
 */
export function evaluateExpression(
  expr: string,
  settings: CalculatorSettings,
  vars: VariableRegisters
): EvalResult {
  try {
    const sanitized = sanitizeExpression(expr, settings.angleMode, vars);
    const scope = {
      deg: Math.PI / 180,
    };

    const raw = evaluate(sanitized, scope);
    let numVal: number;

    if (typeof raw === 'number') {
      numVal = raw;
    } else if (raw && typeof raw === 'object' && 'toDecimal' in raw) {
      numVal = Number((raw as { toDecimal: () => string }).toDecimal());
    } else if (typeof raw === 'boolean') {
      return {
        success: true,
        numericValue: raw ? 1 : 0,
        standardResult: raw ? 'TRUE' : 'FALSE',
        decimalResult: raw ? '1' : '0',
      };
    } else {
      numVal = Number(raw);
    }

    if (!Number.isFinite(numVal)) {
      return {
        success: false,
        standardResult: 'Math ERROR',
        decimalResult: 'Math ERROR',
        errorMessage: 'Calculation produced infinity or undefined value',
      };
    }

    // Clean floating point jitter (e.g. 1.0000000000000002 -> 1, sin(180) -> 0)
    if (Math.abs(numVal) < 1e-12) numVal = 0;
    if (Math.abs(numVal - Math.round(numVal)) < 1e-11) {
      numVal = Math.round(numVal);
    }

    const decimalStr = formatBySettings(numVal, settings);

    // Exact representation check:
    // 1. Surd / radical
    const surd = toSurdString(numVal);
    // 2. Pi multiple
    const piForm = toPiMultiple(numVal);
    // 3. Rational fraction
    const frac = decimalToFraction(numVal);

    let standardResult = decimalStr;
    let recurringResult: string | undefined;

    if (surd) {
      standardResult = surd;
    } else if (piForm) {
      standardResult = piForm;
    } else if (frac && frac.den > 1) {
      if (settings.fractionDisplay === 'MIXED' && Math.abs(frac.num) > frac.den) {
        const whole = Math.floor(Math.abs(frac.num) / frac.den);
        const rem = Math.abs(frac.num) % frac.den;
        const sign = frac.num < 0 ? '-' : '';
        standardResult = `${sign}${whole} ${rem}/${frac.den}`;
      } else {
        standardResult = `${frac.num}/${frac.den}`;
      }
      recurringResult = toRecurringDecimal(frac.num, frac.den) || undefined;
    }

    const engResult = toEngineering(numVal);
    const sexagesimalResult = toSexagesimal(numVal);
    const primeFactors = Number.isInteger(numVal) && numVal > 1 && numVal <= 1000000000 ? primeFactorization(numVal) : undefined;

    return {
      success: true,
      numericValue: numVal,
      standardResult,
      decimalResult: decimalStr,
      recurringResult,
      engResult,
      sexagesimalResult,
      primeFactors,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Syntax ERROR';
    return {
      success: false,
      standardResult: 'Syntax ERROR',
      decimalResult: 'Syntax ERROR',
      errorMessage: msg,
    };
  }
}
