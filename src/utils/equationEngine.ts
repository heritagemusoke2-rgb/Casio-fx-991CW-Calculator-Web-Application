import { decimalToFraction } from './exactMath';

export interface EquationRoot {
  label: string;
  real: number;
  imag: number;
  formatted: string;
}

export interface VertexPoint {
  type: 'Min' | 'Max';
  x: number;
  y: number;
  xFormatted: string;
  yFormatted: string;
}

export interface EquationSolution {
  type: 'SIMUL' | 'POLY';
  status: 'SOLVED' | 'NO_SOLUTION' | 'INFINITE_SOLUTIONS';
  roots: EquationRoot[];
  vertex?: VertexPoint;
}

function formatNum(n: number): string {
  if (Math.abs(n) < 1e-11) return '0';
  const frac = decimalToFraction(n);
  if (frac && frac.den > 1 && frac.den <= 1000) {
    return `${frac.num}/${frac.den}`;
  }
  return parseFloat(n.toPrecision(8)).toString();
}

function formatComplex(real: number, imag: number): string {
  if (Math.abs(imag) < 1e-10) {
    return formatNum(real);
  }
  const realStr = Math.abs(real) < 1e-10 ? '' : formatNum(real);
  const sign = imag > 0 ? (realStr ? ' + ' : '') : (realStr ? ' - ' : '-');
  const absImag = Math.abs(imag);
  const imagStr = Math.abs(absImag - 1) < 1e-10 ? 'i' : `${formatNum(absImag)}i`;
  return `${realStr}${sign}${imagStr}`;
}

/**
 * Solve simultaneous linear equations using Gaussian elimination
 * matrix A: N x (N+1) augmented matrix [A | B]
 */
export function solveSimultaneous(matrix: number[][]): EquationSolution {
  const n = matrix.length;
  const A = matrix.map((row) => [...row]);

  // Gaussian elimination with partial pivoting
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxEl = Math.abs(A[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    if (maxEl < 1e-12) {
      // Check consistency
      let inconsistent = false;
      for (let r = i; r < n; r++) {
        if (Math.abs(A[r][n]) > 1e-10) {
          inconsistent = true;
          break;
        }
      }
      return {
        type: 'SIMUL',
        status: inconsistent ? 'NO_SOLUTION' : 'INFINITE_SOLUTIONS',
        roots: [],
      };
    }

    // Swap maximum row with current row
    const tmp = A[maxRow];
    A[maxRow] = A[i];
    A[i] = tmp;

    // Eliminate below and above (Jordan elimination)
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const c = A[k][i] / A[i][i];
        for (let j = i; j <= n; j++) {
          if (i === j) {
            A[k][j] = 0;
          } else {
            A[k][j] -= c * A[i][j];
          }
        }
      }
    }
  }

  const varNames = ['x', 'y', 'z', 'w'];
  const roots: EquationRoot[] = [];

  for (let i = 0; i < n; i++) {
    const val = A[i][n] / A[i][i];
    roots.push({
      label: varNames[i] || `x${i + 1}`,
      real: val,
      imag: 0,
      formatted: formatNum(val),
    });
  }

  return {
    type: 'SIMUL',
    status: 'SOLVED',
    roots,
  };
}

/**
 * Solve Quadratic Equation: ax² + bx + c = 0
 */
export function solveQuadratic(a: number, b: number, c: number): EquationSolution {
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      return {
        type: 'POLY',
        status: Math.abs(c) < 1e-12 ? 'INFINITE_SOLUTIONS' : 'NO_SOLUTION',
        roots: [],
      };
    }
    const root = -c / b;
    return {
      type: 'POLY',
      status: 'SOLVED',
      roots: [{ label: 'x', real: root, imag: 0, formatted: formatNum(root) }],
    };
  }

  const disc = b * b - 4 * a * c;
  const roots: EquationRoot[] = [];

  if (Math.abs(disc) < 1e-12) {
    const r = -b / (2 * a);
    roots.push({ label: 'x₁ = x₂', real: r, imag: 0, formatted: formatNum(r) });
  } else if (disc > 0) {
    const sqrtDisc = Math.sqrt(disc);
    const r1 = (-b + sqrtDisc) / (2 * a);
    const r2 = (-b - sqrtDisc) / (2 * a);
    roots.push({ label: 'x₁', real: r1, imag: 0, formatted: formatNum(r1) });
    roots.push({ label: 'x₂', real: r2, imag: 0, formatted: formatNum(r2) });
  } else {
    const sqrtDisc = Math.sqrt(-disc);
    const realPart = -b / (2 * a);
    const imagPart = sqrtDisc / (2 * a);
    roots.push({
      label: 'x₁',
      real: realPart,
      imag: imagPart,
      formatted: formatComplex(realPart, imagPart),
    });
    roots.push({
      label: 'x₂',
      real: realPart,
      imag: -imagPart,
      formatted: formatComplex(realPart, -imagPart),
    });
  }

  // Vertex point
  const vx = -b / (2 * a);
  const vy = c - (b * b) / (4 * a);
  const vertex: VertexPoint = {
    type: a > 0 ? 'Min' : 'Max',
    x: vx,
    y: vy,
    xFormatted: formatNum(vx),
    yFormatted: formatNum(vy),
  };

  return {
    type: 'POLY',
    status: 'SOLVED',
    roots,
    vertex,
  };
}

/**
 * Solve Cubic Equation: ax³ + bx² + cx + d = 0 using Cardano's formula
 */
export function solveCubic(a: number, b: number, c: number, d: number): EquationSolution {
  if (Math.abs(a) < 1e-12) {
    return solveQuadratic(b, c, d);
  }

  // Normalize: x³ + px² + qx + r = 0
  const p = b / a;
  const q = c / a;
  const r = d / a;

  // Depressed cubic: t³ + pt + q = 0 by substituting x = t - p/3
  const pDep = (3 * q - p * p) / 3;
  const qDep = (2 * p * p * p - 9 * p * q + 27 * r) / 27;

  const disc = (qDep * qDep) / 4 + (pDep * pDep * pDep) / 27;
  const shift = -p / 3;
  const roots: EquationRoot[] = [];

  if (Math.abs(disc) < 1e-11) {
    if (Math.abs(qDep) < 1e-11) {
      roots.push({ label: 'x₁ = x₂ = x₃', real: shift, imag: 0, formatted: formatNum(shift) });
    } else {
      const u = Math.cbrt(-qDep / 2);
      const r1 = 2 * u + shift;
      const r2 = -u + shift;
      roots.push({ label: 'x₁', real: r1, imag: 0, formatted: formatNum(r1) });
      roots.push({ label: 'x₂ = x₃', real: r2, imag: 0, formatted: formatNum(r2) });
    }
  } else if (disc > 0) {
    const sqrtDisc = Math.sqrt(disc);
    const u = Math.cbrt(-qDep / 2 + sqrtDisc);
    const v = Math.cbrt(-qDep / 2 - sqrtDisc);
    const r1 = u + v + shift;
    roots.push({ label: 'x₁', real: r1, imag: 0, formatted: formatNum(r1) });

    const realPart = -(u + v) / 2 + shift;
    const imagPart = ((u - v) * Math.sqrt(3)) / 2;
    roots.push({
      label: 'x₂',
      real: realPart,
      imag: imagPart,
      formatted: formatComplex(realPart, imagPart),
    });
    roots.push({
      label: 'x₃',
      real: realPart,
      imag: -imagPart,
      formatted: formatComplex(realPart, -imagPart),
    });
  } else {
    // 3 distinct real roots (casus irreducibilis)
    const m = 2 * Math.sqrt(-pDep / 3);
    const theta = Math.acos((3 * qDep) / (pDep * m)) / 3;
    const r1 = m * Math.cos(theta) + shift;
    const r2 = m * Math.cos(theta - (2 * Math.PI) / 3) + shift;
    const r3 = m * Math.cos(theta - (4 * Math.PI) / 3) + shift;

    roots.push({ label: 'x₁', real: r1, imag: 0, formatted: formatNum(r1) });
    roots.push({ label: 'x₂', real: r2, imag: 0, formatted: formatNum(r2) });
    roots.push({ label: 'x₃', real: r3, imag: 0, formatted: formatNum(r3) });
  }

  return {
    type: 'POLY',
    status: 'SOLVED',
    roots,
  };
}
