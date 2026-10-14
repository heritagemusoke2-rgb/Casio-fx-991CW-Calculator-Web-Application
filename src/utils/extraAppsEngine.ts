/**
 * Engines for Base-N, Spreadsheet, Distributions, Ratio, and Verify
 */

// ----------------- BASE-N -----------------
export type BaseType = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export function parseInBase(str: string, base: BaseType): bigint {
  const clean = str.trim().replace(/^0b|^0x|^0o/i, '');
  if (!clean) return 0n;

  if (base === 'DEC') return BigInt(clean);
  if (base === 'HEX') return BigInt('0x' + clean);
  if (base === 'BIN') return BigInt('0b' + clean);
  if (base === 'OCT') return BigInt('0o' + clean);
  return 0n;
}

export function formatInBases(val: bigint): { dec: string; hex: string; bin: string; oct: string } {
  // 32-bit signed / unsigned display
  const u32 = BigInt.asUintN(32, val);
  const s32 = BigInt.asIntN(32, val);

  return {
    dec: s32.toString(10),
    hex: u32.toString(16).toUpperCase().padStart(8, '0'),
    bin: u32.toString(2).padStart(32, '0').replace(/(.{4})/g, '$1 ').trim(),
    oct: u32.toString(8).padStart(11, '0'),
  };
}

// ----------------- DISTRIBUTIONS -----------------

export function normalPD(x: number, mean: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const factor = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * sigma * sigma);
  return factor * Math.exp(exponent);
}

// Error function approximation
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

export function normalCD(lower: number, upper: number, mean: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const cdf = (val: number) => 0.5 * (1 + erf((val - mean) / (sigma * Math.sqrt(2))));
  return cdf(upper) - cdf(lower);
}

export function binomialPD(x: number, n: number, p: number): number {
  if (x < 0 || x > n || p < 0 || p > 1) return 0;
  let comb = 1;
  for (let i = 1; i <= x; i++) {
    comb = (comb * (n - i + 1)) / i;
  }
  return comb * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

export function poissonPD(x: number, lambda: number): number {
  if (x < 0 || lambda <= 0) return 0;
  let fact = 1;
  for (let i = 1; i <= x; i++) fact *= i;
  return (Math.pow(lambda, x) * Math.exp(-lambda)) / fact;
}

// ----------------- RATIO SOLVER -----------------

export function solveRatio(
  type: 'A:B=X:D' | 'A:B=C:X',
  a: number,
  b: number,
  other: number
): { x: number; formula: string } {
  if (type === 'A:B=X:D') {
    // a/b = X/d => X = (a * d) / b
    if (b === 0) throw new Error('Math ERROR: Division by zero');
    const x = (a * other) / b;
    return { x, formula: `X = (${a} × ${other}) / ${b}` };
  } else {
    // a/b = c/X => X = (b * c) / a
    if (a === 0) throw new Error('Math ERROR: Division by zero');
    const x = (b * other) / a;
    return { x, formula: `X = (${b} × ${other}) / ${a}` };
  }
}
