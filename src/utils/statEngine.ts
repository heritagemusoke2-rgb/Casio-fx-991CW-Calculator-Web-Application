import { StatItem } from '../types/calculator';

export interface OneVarResults {
  mean: number;
  sumX: number;
  sumX2: number;
  sampleStdDev: number;
  popStdDev: number;
  sampleVar: number;
  popVar: number;
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
}

export interface TwoVarResults {
  oneVarX: OneVarResults;
  meanY: number;
  sumY: number;
  sumY2: number;
  sumXY: number;
  sampleStdDevY: number;
  popStdDevY: number;
  linearA: number; // intercept
  linearB: number; // slope
  r: number; // correlation
  r2: number;
}

export function compute1VarStats(items: StatItem[]): OneVarResults | null {
  const expanded: number[] = [];
  let totalN = 0;
  let sumX = 0;
  let sumX2 = 0;

  for (const item of items) {
    const f = Math.max(1, Math.round(item.freq || 1));
    for (let i = 0; i < f; i++) {
      expanded.push(item.x);
      sumX += item.x;
      sumX2 += item.x * item.x;
    }
    totalN += f;
  }

  if (totalN === 0) return null;

  expanded.sort((a, b) => a - b);

  const mean = sumX / totalN;
  const popVar = (sumX2 - totalN * mean * mean) / totalN;
  const popStdDev = Math.sqrt(Math.max(0, popVar));

  const sampleVar = totalN > 1 ? (sumX2 - totalN * mean * mean) / (totalN - 1) : 0;
  const sampleStdDev = Math.sqrt(Math.max(0, sampleVar));

  const getPercentile = (p: number) => {
    const idx = (expanded.length - 1) * p;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    if (low === high) return expanded[low];
    return expanded[low] + (expanded[high] - expanded[low]) * (idx - low);
  };

  const min = expanded[0];
  const max = expanded[expanded.length - 1];
  const q1 = getPercentile(0.25);
  const median = getPercentile(0.5);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  return {
    mean,
    sumX,
    sumX2,
    sampleStdDev,
    popStdDev,
    sampleVar,
    popVar,
    n: totalN,
    min,
    q1,
    median,
    q3,
    max,
    iqr,
  };
}

export function compute2VarStats(items: StatItem[]): TwoVarResults | null {
  const oneVarX = compute1VarStats(items);
  if (!oneVarX || items.length === 0) return null;

  let totalN = 0;
  let sumY = 0;
  let sumY2 = 0;
  let sumXY = 0;

  for (const item of items) {
    const yVal = item.y ?? 0;
    const f = Math.max(1, Math.round(item.freq || 1));
    sumY += yVal * f;
    sumY2 += yVal * yVal * f;
    sumXY += item.x * yVal * f;
    totalN += f;
  }

  if (totalN < 2) return null;

  const meanY = sumY / totalN;
  const popVarY = (sumY2 - totalN * meanY * meanY) / totalN;
  const popStdDevY = Math.sqrt(Math.max(0, popVarY));
  const sampleVarY = (sumY2 - totalN * meanY * meanY) / (totalN - 1);
  const sampleStdDevY = Math.sqrt(Math.max(0, sampleVarY));

  const ssXX = oneVarX.sumX2 - (oneVarX.sumX * oneVarX.sumX) / totalN;
  const ssYY = sumY2 - (sumY * sumY) / totalN;
  const ssXY = sumXY - (oneVarX.sumX * sumY) / totalN;

  let linearB = 0;
  let linearA = 0;
  let r = 0;

  if (Math.abs(ssXX) > 1e-12) {
    linearB = ssXY / ssXX;
    linearA = meanY - linearB * oneVarX.mean;
  }
  if (Math.abs(ssXX * ssYY) > 1e-12) {
    r = ssXY / Math.sqrt(ssXX * ssYY);
  }

  return {
    oneVarX,
    meanY,
    sumY,
    sumY2,
    sumXY,
    sampleStdDevY,
    popStdDevY,
    linearA,
    linearB,
    r,
    r2: r * r,
  };
}
