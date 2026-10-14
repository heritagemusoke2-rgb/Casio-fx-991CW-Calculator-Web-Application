export type AppMode =
  | 'CALC'
  | 'EQUATION'
  | 'STAT'
  | 'TABLE'
  | 'MATRIX'
  | 'VECTOR'
  | 'BASE'
  | 'SPREADSHEET'
  | 'DISTRIBUTION'
  | 'INEQUALITY'
  | 'RATIO'
  | 'VERIFY';

export type AngleMode = 'DEG' | 'RAD' | 'GRA';

export type NumberFormatType = 'NORM1' | 'NORM2' | 'FIX' | 'SCI';

export type FractionDisplayType = 'MIXED' | 'IMPROPER';

export type ResultFormat = 'STANDARD' | 'DECIMAL' | 'RECURRING' | 'ENG' | 'SEXAGESIMAL';

export type LcdTheme = 'CLASSIC_LCD' | 'OLED_CYAN' | 'PAPER_WHITE' | 'DARK_DOT';

export interface CalculatorSettings {
  angleMode: AngleMode;
  numberFormat: NumberFormatType;
  fixSciDigits: number;
  fractionDisplay: FractionDisplayType;
  theme: LcdTheme;
  soundEnabled: boolean;
  contrast: number; // 0 to 10
}

export interface VariableRegisters {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  x: number;
  y: number;
  z: number;
  Ans: number;
  PreAns: number;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  exactResult?: string;
  angleMode: AngleMode;
  timestamp: number;
}

export type MatrixName = 'MatA' | 'MatB' | 'MatC' | 'MatD';

export interface MatrixData {
  rows: number;
  cols: number;
  data: number[][];
}

export type VectorName = 'VctA' | 'VctB' | 'VctC' | 'VctD';

export interface VectorData {
  dim: 2 | 3;
  data: number[];
}

export interface StatItem {
  x: number;
  y?: number;
  freq: number;
}

export interface TableConfig {
  fExpr: string;
  gExpr: string;
  start: number;
  end: number;
  step: number;
  rows: Array<{ x: number; fx: number | string; gx: number | string }>;
}

export interface SpreadsheetCell {
  formula: string;
  value: number | string;
}

export type EquationType = 'SIMUL' | 'POLY';
