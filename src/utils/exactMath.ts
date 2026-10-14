/**
 * Exact math routines for Casio ClassWiz Natural Textbook format
 */

export interface Rational {
  num: bigint;
  den: bigint;
}

export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/**
 * Find continued fraction representation of a decimal number
 */
export function decimalToFraction(val: number, maxDenom = 100000): { num: number; den: number } | null {
  if (!Number.isFinite(val)) return null;
  if (Math.abs(val) > 1e12) return null;
  if (Number.isInteger(val)) return { num: val, den: 1 };

  const sign = val < 0 ? -1 : 1;
  const x = Math.abs(val);

  let m00 = 0, m01 = 1, m10 = 1, m11 = 0;
  let c = x;

  for (let i = 0; i < 20; i++) {
    const a = Math.floor(c);
    const num = a * m10 + m00;
    const den = a * m11 + m01;

    if (den > maxDenom) break;

    const approx = num / den;
    if (Math.abs(approx - x) < 1e-10) {
      return { num: sign * num, den };
    }

    m00 = m10;
    m01 = m11;
    m10 = num;
    m11 = den;

    const diff = c - a;
    if (Math.abs(diff) < 1e-11) break;
    c = 1 / diff;
  }

  return null;
}

/**
 * Check if a number can be formatted as a multiple of Pi
 */
export function toPiMultiple(val: number): string | null {
  if (Math.abs(val) < 1e-9) return null;
  const ratio = val / Math.PI;
  const frac = decimalToFraction(ratio, 120);
  if (!frac) return null;

  const { num, den } = frac;
  if (den === 1) {
    if (num === 1) return 'π';
    if (num === -1) return '-π';
    return `${num}π`;
  }
  if (num === 1) return `π/${den}`;
  if (num === -1) return `-π/${den}`;
  return `${num}π/${den}`;
}

/**
 * Check if a number is a surd (square root of an integer or simple rational)
 */
export function toSurdString(val: number): string | null {
  if (!Number.isFinite(val) || Math.abs(val) < 1e-6 || Math.abs(val) > 10000) return null;
  const sign = val < 0 ? '-' : '';
  const pos = Math.abs(val);

  // Check simple multiples of sqrt(2), sqrt(3), sqrt(5), sqrt(6), sqrt(7)
  const bases = [2, 3, 5, 6, 7];
  for (const b of bases) {
    const r = pos / Math.sqrt(b);
    const frac = decimalToFraction(r, 60);
    if (frac && Math.abs(frac.num / frac.den * Math.sqrt(b) - pos) < 1e-9) {
      if (frac.den === 1) {
        if (frac.num === 1) return `${sign}√${b}`;
        return `${sign}${frac.num}√${b}`;
      }
      if (frac.num === 1) return `${sign}√${b}/${frac.den}`;
      return `${sign}${frac.num}√${b}/${frac.den}`;
    }
  }

  // Check if square is a clean rational
  const sq = pos * pos;
  const sqFrac = decimalToFraction(sq, 200);
  if (sqFrac && sqFrac.num > 0) {
    // Simplify sqrt(num / den)
    const { num, den } = sqFrac;
    let nCoeff = 1;
    let nRad = num;
    for (let k = Math.floor(Math.sqrt(num)); k >= 2; k--) {
      if (nRad % (k * k) === 0) {
        nCoeff *= k;
        nRad /= (k * k);
        break;
      }
    }

    let dCoeff = 1;
    let dRad = den;
    for (let k = Math.floor(Math.sqrt(den)); k >= 2; k--) {
      if (dRad % (k * k) === 0) {
        dCoeff *= k;
        dRad /= (k * k);
        break;
      }
    }

    // Rationalize denominator if dRad > 1
    if (dRad > 1) {
      nRad *= dRad;
      const finalDen = dCoeff * dCoeff * dRad;
      const g = gcdBigInt(BigInt(nCoeff), BigInt(finalDen));
      const simpNum = nCoeff / Number(g);
      const simpDen = finalDen / Number(g);

      if (simpDen === 1) {
        return `${sign}${simpNum > 1 ? simpNum : ''}√${nRad}`;
      }
      return `${sign}${simpNum > 1 ? simpNum : ''}√${nRad}/${simpDen}`;
    } else {
      if (nRad === 1) {
        // Just a fraction
        return null;
      }
      if (dCoeff === 1) {
        return `${sign}${nCoeff > 1 ? nCoeff : ''}√${nRad}`;
      }
      return `${sign}${nCoeff > 1 ? nCoeff : ''}√${nRad}/${dCoeff}`;
    }
  }

  return null;
}

/**
 * Format to Sexagesimal (Degrees, Minutes, Seconds)
 * e.g. 12.5 -> 12°30'0"
 */
export function toSexagesimal(val: number): string {
  if (!Number.isFinite(val)) return 'Error';
  const sign = val < 0 ? '-' : '';
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const minRemainder = (abs - deg) * 60;
  const min = Math.floor(minRemainder);
  const sec = Math.round((minRemainder - min) * 60 * 100) / 100;
  return `${sign}${deg}°${min}'${sec}"`;
}

/**
 * Format to Engineering notation
 * e.g. 15000 -> 15×10³, 0.005 -> 5×10⁻³
 */
export function toEngineering(val: number): string {
  if (!Number.isFinite(val)) return 'Error';
  if (val === 0) return '0';

  const sign = val < 0 ? '-' : '';
  const abs = Math.abs(val);
  const exp = Math.floor(Math.log10(abs));
  const engExp = Math.floor(exp / 3) * 3;
  const mantissa = abs / Math.pow(10, engExp);
  const roundedMantissa = Math.round(mantissa * 1e6) / 1e6;

  if (engExp === 0) return `${sign}${roundedMantissa}`;
  return `${sign}${roundedMantissa}×10^(${engExp})`;
}

/**
 * Prime Factorization (Casio FACT function)
 * e.g. 120 -> 2³ × 3 × 5
 */
export function primeFactorization(n: number): string {
  if (!Number.isInteger(n) || n <= 1 || n > 1e11) {
    return n.toString();
  }

  let num = n;
  const factors: Map<number, number> = new Map();

  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      num /= d;
    }
  }
  if (num > 1) {
    factors.set(num, (factors.get(num) || 0) + 1);
  }

  const parts: string[] = [];
  factors.forEach((power, prime) => {
    if (power === 1) {
      parts.push(`${prime}`);
    } else {
      parts.push(`${prime}^${power}`);
    }
  });

  return parts.join(' × ');
}

/**
 * Detect recurring decimal
 * e.g. 1/7 = 0.(142857)
 */
export function toRecurringDecimal(num: number, den: number): string | null {
  if (den === 0 || !Number.isInteger(num) || !Number.isInteger(den)) return null;

  const sign = (num < 0) !== (den < 0) ? '-' : '';
  let n = Math.abs(num);
  const d = Math.abs(den);

  const integerPart = Math.floor(n / d);
  let rem = n % d;
  if (rem === 0) return null;

  const seenReminders = new Map<number, number>();
  let decimals = '';

  while (rem !== 0 && !seenReminders.has(rem) && decimals.length < 24) {
    seenReminders.set(rem, decimals.length);
    rem *= 10;
    decimals += Math.floor(rem / d);
    rem %= d;
  }

  if (rem === 0) return null; // terminating decimal

  const loopStart = seenReminders.get(rem)!;
  const nonRepeat = decimals.slice(0, loopStart);
  const repeat = decimals.slice(loopStart);

  if (repeat.length === 0) return null;
  return `${sign}${integerPart}.${nonRepeat}(${repeat})`;
}
