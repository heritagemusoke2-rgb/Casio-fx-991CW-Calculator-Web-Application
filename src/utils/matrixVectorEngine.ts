import { MatrixData, VectorData } from '../types/calculator';

/**
 * Determinant of square matrix (up to 4x4)
 */
export function matrixDeterminant(m: number[][]): number {
  const n = m.length;
  if (n !== m[0].length) throw new Error('Dimension ERROR: Matrix must be square');

  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (n === 3) {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  }

  // 4x4 Laplace expansion
  let det = 0;
  for (let j = 0; j < 4; j++) {
    const sub = getSubMatrix(m, 0, j);
    const subDet = matrixDeterminant(sub);
    const sign = j % 2 === 0 ? 1 : -1;
    det += sign * m[0][j] * subDet;
  }
  return det;
}

function getSubMatrix(m: number[][], remRow: number, remCol: number): number[][] {
  return m
    .filter((_, r) => r !== remRow)
    .map((row) => row.filter((_, c) => c !== remCol));
}

/**
 * Transpose of matrix
 */
export function matrixTranspose(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const res: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const row: number[] = [];
    for (let r = 0; r < rows; r++) {
      row.push(m[r][c]);
    }
    res.push(row);
  }
  return res;
}

/**
 * Inverse of square matrix using Adjugate / Gaussian method
 */
export function matrixInverse(m: number[][]): number[][] {
  const det = matrixDeterminant(m);
  if (Math.abs(det) < 1e-12) {
    throw new Error('Math ERROR: Singular matrix has no inverse');
  }

  const n = m.length;
  if (n === 1) return [[1 / m[0][0]]];
  if (n === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }

  const adj: number[][] = [];
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) {
      const sub = getSubMatrix(m, r, c);
      const sign = (r + c) % 2 === 0 ? 1 : -1;
      row.push((sign * matrixDeterminant(sub)) / det);
    }
    adj.push(row);
  }

  return matrixTranspose(adj);
}

/**
 * Multiply two matrices
 */
export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const rA = a.length;
  const cA = a[0].length;
  const rB = b.length;
  const cB = b[0].length;

  if (cA !== rB) {
    throw new Error('Dimension ERROR: Columns of A must equal Rows of B');
  }

  const res: number[][] = [];
  for (let i = 0; i < rA; i++) {
    const row: number[] = [];
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) {
        sum += a[i][k] * b[k][j];
      }
      row.push(sum);
    }
    res.push(row);
  }
  return res;
}

/**
 * Add / Subtract matrices
 */
export function matrixAddSub(a: number[][], b: number[][], isSub = false): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error('Dimension ERROR: Matrices must have identical dimensions');
  }
  return a.map((row, r) => row.map((val, c) => (isSub ? val - b[r][c] : val + b[r][c])));
}

// ----------------- VECTOR OPERATIONS -----------------

export function vectorDot(u: number[], v: number[]): number {
  if (u.length !== v.length) throw new Error('Dimension ERROR: Vectors must have same dimension');
  return u.reduce((sum, val, i) => sum + val * v[i], 0);
}

export function vectorNorm(u: number[]): number {
  return Math.sqrt(u.reduce((sum, val) => sum + val * val, 0));
}

export function vectorCross(u: number[], v: number[]): number[] {
  if (u.length !== 3 || v.length !== 3) {
    throw new Error('Dimension ERROR: Cross product is only defined for 3D vectors');
  }
  return [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
}

export function vectorAngle(u: number[], v: number[], inDeg = true): number {
  const dot = vectorDot(u, v);
  const normU = vectorNorm(u);
  const normV = vectorNorm(v);
  if (normU === 0 || normV === 0) throw new Error('Math ERROR: Zero vector has no angle');

  const cosTheta = Math.max(-1, Math.min(1, dot / (normU * normV)));
  const rad = Math.acos(cosTheta);
  return inDeg ? (rad * 180) / Math.PI : rad;
}

export function vectorUnit(u: number[]): number[] {
  const norm = vectorNorm(u);
  if (norm === 0) throw new Error('Math ERROR: Zero vector has no unit vector');
  return u.map((x) => x / norm);
}
