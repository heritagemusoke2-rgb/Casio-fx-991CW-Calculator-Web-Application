import React from 'react';
import {
  AppMode,
  CalculatorSettings,
  HistoryItem,
  ResultFormat,
  VariableRegisters,
  MatrixData,
  VectorData,
  StatItem,
  TableConfig,
  SpreadsheetCell,
} from '../types/calculator';
import { Sun, Battery, ChevronUp, ChevronDown, Repeat, ArrowRightLeft } from 'lucide-react';
import { solveSimultaneous, solveQuadratic, solveCubic } from '../utils/equationEngine';
import { compute1VarStats, compute2VarStats } from '../utils/statEngine';
import {
  matrixDeterminant,
  matrixInverse,
  matrixTranspose,
  matrixMultiply,
  vectorDot,
  vectorNorm,
  vectorCross,
  vectorAngle,
  vectorUnit,
} from '../utils/matrixVectorEngine';
import { formatInBases, normalPD, normalCD, binomialPD, poissonPD, solveRatio } from '../utils/extraAppsEngine';
import { evaluate } from 'mathjs';

interface CalculatorScreenProps {
  mode: AppMode;
  input: string;
  cursorPos: number;
  result: string;
  exactResult?: string;
  currentFormat: ResultFormat;
  onToggleFormat: () => void;
  shiftActive: boolean;
  settings: CalculatorSettings;
  history: HistoryItem[];
  variables: VariableRegisters;
  onOpenHome: () => void;
  onOpenSettings: () => void;
  onOpenQr: () => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({
  mode,
  input,
  cursorPos,
  result,
  exactResult,
  currentFormat,
  onToggleFormat,
  shiftActive,
  settings,
  history,
  variables,
  onOpenHome,
  onOpenSettings,
  onOpenQr,
}) => {
  // Theme class mapping
  const themeClass =
    settings.theme === 'OLED_CYAN'
      ? 'lcd-theme-oled'
      : settings.theme === 'PAPER_WHITE'
      ? 'lcd-theme-paper'
      : settings.theme === 'DARK_DOT'
      ? 'lcd-theme-dark-dot'
      : 'lcd-theme-classic';

  const gridOverlayClass =
    settings.theme === 'OLED_CYAN' || settings.theme === 'DARK_DOT'
      ? 'lcd-oled-grid-pattern'
      : 'lcd-grid-pattern';

  // Sub-app states for non-COMP modes
  // Equation
  const [eqType, setEqType] = React.useState<'SIMUL_2' | 'SIMUL_3' | 'POLY_2' | 'POLY_3'>('POLY_2');
  const [polyCoeffs, setPolyCoeffs] = React.useState<number[]>([1, -5, 6, 0]); // ax^2 + bx + c = 0
  const [simulMatrix, setSimulMatrix] = React.useState<number[][]>([
    [2, 3, 8],
    [3, -1, 1],
  ]);

  // Statistics
  const [statType, setStatType] = React.useState<'1VAR' | '2VAR'>('1VAR');
  const [statData, setStatData] = React.useState<StatItem[]>([
    { x: 12, y: 15, freq: 1 },
    { x: 15, y: 18, freq: 2 },
    { x: 18, y: 22, freq: 1 },
    { x: 22, y: 28, freq: 3 },
    { x: 25, y: 31, freq: 1 },
  ]);

  // Table
  const [tableConfig, setTableConfig] = React.useState<TableConfig>({
    fExpr: '2x + 1',
    gExpr: 'x^2',
    start: 1,
    end: 5,
    step: 1,
    rows: [],
  });

  // Matrix
  const [activeMatName, setActiveMatName] = React.useState<'MatA' | 'MatB'>('MatA');
  const [matA, setMatA] = React.useState<MatrixData>({
    rows: 2,
    cols: 2,
    data: [
      [2, 1],
      [1, 3],
    ],
  });
  const [matB, setMatB] = React.useState<MatrixData>({
    rows: 2,
    cols: 2,
    data: [
      [1, 0],
      [2, 4],
    ],
  });
  const [matResultMsg, setMatResultMsg] = React.useState<string>('');

  // Vector
  const [vctA, setVctA] = React.useState<VectorData>({ dim: 3, data: [2, 3, -1] });
  const [vctB, setVctB] = React.useState<VectorData>({ dim: 3, data: [1, -2, 2] });
  const [vctResultMsg, setVctResultMsg] = React.useState<string>('');

  // Base-N
  const [baseVal, setBaseVal] = React.useState<bigint>(255n);
  const [baseInputStr, setBaseInputStr] = React.useState<string>('255');

  // Spreadsheet
  const [sheet, setSheet] = React.useState<SpreadsheetCell[][]>(() => {
    const grid: SpreadsheetCell[][] = [];
    for (let r = 0; r < 5; r++) {
      const row: SpreadsheetCell[] = [];
      for (let c = 0; c < 4; c++) {
        row.push({ formula: '', value: '' });
      }
      grid.push(row);
    }
    // initial sample
    grid[0][0] = { formula: '10', value: 10 };
    grid[0][1] = { formula: '20', value: 20 };
    grid[0][2] = { formula: '=A1+B1', value: 30 };
    grid[1][0] = { formula: '5', value: 5 };
    grid[1][1] = { formula: '15', value: 15 };
    grid[1][2] = { formula: '=A2+B2', value: 20 };
    return grid;
  });

  // Distribution
  const [distType, setDistType] = React.useState<'NORMAL' | 'BINOMIAL' | 'POISSON'>('NORMAL');
  const [distX, setDistX] = React.useState<number>(1.96);
  const [distMean, setDistMean] = React.useState<number>(0);
  const [distSigma, setDistSigma] = React.useState<number>(1);
  const [distResult, setDistResult] = React.useState<string>('P = 0.97500');

  // Ratio
  const [ratioA, setRatioA] = React.useState<number>(2);
  const [ratioB, setRatioB] = React.useState<number>(5);
  const [ratioD, setRatioD] = React.useState<number>(15);
  const [ratioResult, setRatioResult] = React.useState<string>('X = 6');

  // Render input with blinking cursor in COMP mode
  const renderInputWithCursor = () => {
    if (!input) {
      return (
        <span className="inline-flex items-center">
          <span className="opacity-0">0</span>
          <span className="w-1.5 h-4.5 bg-current animate-pulse ml-0.5" />
        </span>
      );
    }
    const before = input.slice(0, cursorPos);
    const cursorChar = input[cursorPos] || '';
    const after = input.slice(cursorPos + 1);

    return (
      <span className="inline-flex items-center tracking-tight">
        <span>{before}</span>
        <span className="relative inline-flex items-center">
          <span className="bg-current text-neutral-900 px-0.5 rounded-xs font-bold">
            {cursorChar || ' '}
          </span>
          {!cursorChar && <span className="w-1.5 h-4.5 bg-current animate-pulse" />}
        </span>
        <span>{after}</span>
      </span>
    );
  };

  return (
    <div
      className={`relative w-full rounded-xl p-3 border-2 border-neutral-700/60 transition-all select-none overflow-hidden ${themeClass}`}
      style={{ minHeight: '170px' }}
    >
      {/* Dot matrix pattern overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-40 ${gridOverlayClass}`} />

      {/* Top Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono font-bold border-b border-current/20 pb-1 mb-2 tracking-wider">
        {/* Left indicators */}
        <div className="flex items-center gap-2">
          {/* Shift indicator */}
          <span
            className={`px-1 rounded-xs transition-opacity ${
              shiftActive
                ? 'bg-amber-400 text-neutral-950 font-black shadow-xs'
                : 'opacity-25'
            }`}
          >
            S
          </span>

          {/* Angle mode */}
          <span className="font-bold underline decoration-current/40">
            {settings.angleMode === 'DEG' ? 'D' : settings.angleMode === 'RAD' ? 'R' : 'G'}
          </span>

          {/* Number format */}
          <span>
            {settings.numberFormat === 'FIX'
              ? `Fix${settings.fixSciDigits}`
              : settings.numberFormat === 'SCI'
              ? `Sci${settings.fixSciDigits}`
              : settings.numberFormat === 'NORM2'
              ? 'Norm2'
              : 'Norm1'}
          </span>

          {/* Fraction mode */}
          <span className="opacity-75">{settings.fractionDisplay === 'MIXED' ? 'a b/c' : 'd/c'}</span>
        </div>

        {/* Center Mode Name */}
        <div
          onClick={onOpenHome}
          className="px-2 py-0.5 rounded-xs bg-current/10 border border-current/25 hover:bg-current/20 cursor-pointer font-tech tracking-widest text-[11px]"
          title="Click to change App Mode (HOME)"
        >
          {mode === 'CALC'
            ? 'COMP'
            : mode === 'EQUATION'
            ? 'EQUATION'
            : mode === 'STAT'
            ? 'STATISTICS'
            : mode === 'TABLE'
            ? 'TABLE'
            : mode === 'MATRIX'
            ? 'MATRIX'
            : mode === 'VECTOR'
            ? 'VECTOR'
            : mode === 'BASE'
            ? 'BASE-N'
            : mode === 'SPREADSHEET'
            ? 'SPREAD'
            : mode === 'DISTRIBUTION'
            ? 'DIST'
            : mode === 'INEQUALITY'
            ? 'INEQ'
            : mode === 'RATIO'
            ? 'RATIO'
            : 'VERIFY'}
        </div>

        {/* Right indicators */}
        <div className="flex items-center gap-2">
          {/* Replay arrows */}
          <div className="flex items-center gap-0.5">
            <ChevronUp className={`w-3 h-3 ${history.length > 0 ? 'opacity-90' : 'opacity-20'}`} />
            <ChevronDown className={`w-3 h-3 ${history.length > 0 ? 'opacity-90' : 'opacity-20'}`} />
          </div>

          {/* QR code quick button */}
          <button
            type="button"
            onClick={onOpenQr}
            className="px-1 text-[9px] font-bold rounded-xs bg-current/15 hover:bg-current/30 cursor-pointer"
            title="Show QR Code"
          >
            QR
          </button>

          {/* Solar / Battery */}
          <div className="flex items-center gap-1 opacity-75">
            <Sun className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Display Body */}
      <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: '120px' }}>
        
        {/* COMP MODE (Calculate) */}
        {mode === 'CALC' && (
          <>
            {/* Input Expression Line */}
            <div className="font-lcd text-lg sm:text-xl font-bold tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none py-1 min-h-[32px]">
              {renderInputWithCursor()}
            </div>

            {/* Result Line */}
            <div className="flex flex-col items-end justify-end mt-2 pt-1 border-t border-current/15">
              {result ? (
                <div className="w-full flex items-center justify-between">
                  {/* S<=>D format toggle pill */}
                  <button
                    type="button"
                    onClick={onToggleFormat}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-current/15 hover:bg-current/25 text-[10px] font-mono cursor-pointer transition-colors"
                    title="Change representation (S<=>D: Fraction / Decimal / Recurring / Eng / DMS)"
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    <span>{currentFormat}</span>
                  </button>

                  <div className="font-lcd text-xl sm:text-2xl font-bold tracking-tight text-right overflow-x-auto whitespace-nowrap pl-2">
                    {currentFormat === 'STANDARD' && exactResult ? exactResult : result}
                  </div>
                </div>
              ) : (
                <div className="text-right text-xs opacity-40 font-mono">
                  [Ans = {variables.Ans}]
                </div>
              )}
            </div>
          </>
        )}

        {/* EQUATION SOLVER MODE */}
        {mode === 'EQUATION' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">EQUATION / SOLVER</span>
              <div className="flex gap-1 text-[10px]">
                {(['POLY_2', 'POLY_3', 'SIMUL_2', 'SIMUL_3'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEqType(t)}
                    className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                      eqType === t ? 'bg-current text-neutral-900 font-bold' : 'bg-current/15'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Polynomial solver */}
            {eqType === 'POLY_2' && (
              <div>
                <div className="text-[11px] mb-1 opacity-80">ax² + bx + c = 0</div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {(['a', 'b', 'c'] as const).map((label, idx) => (
                    <div key={label} className="flex items-center gap-1">
                      <span className="font-bold">{label}=</span>
                      <input
                        type="number"
                        value={polyCoeffs[idx]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const next = [...polyCoeffs];
                          next[idx] = val;
                          setPolyCoeffs(next);
                        }}
                        className="w-14 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center font-bold focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>

                {/* Roots result */}
                {(() => {
                  const sol = solveQuadratic(polyCoeffs[0], polyCoeffs[1], polyCoeffs[2]);
                  return (
                    <div className="bg-current/10 p-1.5 rounded text-[11px] flex justify-between items-center">
                      <div>
                        {sol.roots.map((r, i) => (
                          <div key={i} className="font-bold">
                            {r.label} = {r.formatted}
                          </div>
                        ))}
                      </div>
                      {sol.vertex && (
                        <div className="text-right text-[10px] opacity-90">
                          <div>
                            {sol.vertex.type} of y: ({sol.vertex.xFormatted}, {sol.vertex.yFormatted})
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Polynomial 3rd degree */}
            {eqType === 'POLY_3' && (
              <div>
                <div className="text-[11px] mb-1 opacity-80">ax³ + bx² + cx + d = 0</div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {(['a', 'b', 'c', 'd'] as const).map((label, idx) => (
                    <div key={label} className="flex items-center gap-1">
                      <span className="font-bold">{label}=</span>
                      <input
                        type="number"
                        value={polyCoeffs[idx]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const next = [...polyCoeffs];
                          next[idx] = val;
                          setPolyCoeffs(next);
                        }}
                        className="w-10 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center font-bold focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
                {(() => {
                  const sol = solveCubic(polyCoeffs[0], polyCoeffs[1], polyCoeffs[2], polyCoeffs[3]);
                  return (
                    <div className="bg-current/10 p-1.5 rounded text-[11px] space-y-0.5">
                      {sol.roots.map((r, i) => (
                        <div key={i} className="font-bold">
                          {r.label} = {r.formatted}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Simultaneous linear equations */}
            {eqType === 'SIMUL_2' && (
              <div>
                <div className="text-[11px] mb-1 opacity-80">
                  a₁x + b₁y = c₁ &nbsp;|&nbsp; a₂x + b₂y = c₂
                </div>
                <div className="space-y-1 mb-2">
                  {simulMatrix.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1">
                      <span className="text-[10px]">{rIdx === 0 ? 'Eq1:' : 'Eq2:'}</span>
                      <input
                        type="number"
                        value={row[0]}
                        onChange={(e) => {
                          const next = simulMatrix.map((r) => [...r]);
                          next[rIdx][0] = parseFloat(e.target.value) || 0;
                          setSimulMatrix(next);
                        }}
                        className="w-11 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center"
                      />
                      <span>x +</span>
                      <input
                        type="number"
                        value={row[1]}
                        onChange={(e) => {
                          const next = simulMatrix.map((r) => [...r]);
                          next[rIdx][1] = parseFloat(e.target.value) || 0;
                          setSimulMatrix(next);
                        }}
                        className="w-11 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center"
                      />
                      <span>y =</span>
                      <input
                        type="number"
                        value={row[2]}
                        onChange={(e) => {
                          const next = simulMatrix.map((r) => [...r]);
                          next[rIdx][2] = parseFloat(e.target.value) || 0;
                          setSimulMatrix(next);
                        }}
                        className="w-11 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center font-bold"
                      />
                    </div>
                  ))}
                </div>
                {(() => {
                  const sol = solveSimultaneous(simulMatrix);
                  return (
                    <div className="bg-current/10 p-1.5 rounded text-[11px] flex gap-4 font-bold">
                      {sol.status === 'SOLVED' ? (
                        sol.roots.map((r) => (
                          <span key={r.label}>
                            {r.label} = {r.formatted}
                          </span>
                        ))
                      ) : (
                        <span>{sol.status}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* STATISTICS MODE */}
        {mode === 'STAT' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">STATISTICS SUMMARY</span>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setStatType('1VAR')}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    statType === '1VAR' ? 'bg-current text-neutral-900 font-bold' : 'bg-current/15'
                  }`}
                >
                  1-Variable
                </button>
                <button
                  type="button"
                  onClick={() => setStatType('2VAR')}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    statType === '2VAR' ? 'bg-current text-neutral-900 font-bold' : 'bg-current/15'
                  }`}
                >
                  2-Var (y=a+bx)
                </button>
              </div>
            </div>

            {statType === '1VAR' ? (
              (() => {
                const s = compute1VarStats(statData);
                if (!s) return <div>No data</div>;
                return (
                  <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[11px] bg-current/10 p-2 rounded">
                    <div>x̄ = {s.mean.toFixed(4)}</div>
                    <div>Σx = {s.sumX}</div>
                    <div>Σx² = {s.sumX2}</div>
                    <div>sx = {s.sampleStdDev.toFixed(4)}</div>
                    <div>σx = {s.popStdDev.toFixed(4)}</div>
                    <div>n = {s.n}</div>
                    <div>min(x) = {s.min}</div>
                    <div>Med = {s.median}</div>
                    <div>max(x) = {s.max}</div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const s = compute2VarStats(statData);
                if (!s) return <div>No data</div>;
                return (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] bg-current/10 p-2 rounded">
                    <div>a (intercept) = {s.linearA.toFixed(4)}</div>
                    <div>b (slope) = {s.linearB.toFixed(4)}</div>
                    <div>r = {s.r.toFixed(4)}</div>
                    <div>r² = {s.r2.toFixed(4)}</div>
                    <div>x̄ = {s.oneVarX.mean.toFixed(4)}</div>
                    <div>ȳ = {s.meanY.toFixed(4)}</div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TABLE MODE */}
        {mode === 'TABLE' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">TABLE GENERATOR</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span>Start:{tableConfig.start}</span>
                <span>End:{tableConfig.end}</span>
                <span>Step:{tableConfig.step}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] border-b border-current/15 pb-1">
              <span className="font-bold">x</span>
              <span className="font-bold">f(x)={tableConfig.fExpr}</span>
              <span className="font-bold">g(x)={tableConfig.gExpr}</span>
            </div>

            <div className="max-h-24 overflow-y-auto space-y-1 text-[11px]">
              {[1, 2, 3, 4, 5].map((x) => {
                let fx = '0';
                let gx = '0';
                try {
                  fx = evaluate(tableConfig.fExpr, { x }).toString();
                  gx = evaluate(tableConfig.gExpr, { x }).toString();
                } catch {
                  // ignore
                }
                return (
                  <div key={x} className="grid grid-cols-3 gap-2 py-0.5 border-b border-current/10">
                    <div>{x}</div>
                    <div className="font-bold">{fx}</div>
                    <div>{gx}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MATRIX MODE */}
        {mode === 'MATRIX' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">MATRIX OPERATIONS</span>
              <div className="flex gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveMatName('MatA')}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    activeMatName === 'MatA' ? 'bg-current text-neutral-900 font-bold' : 'bg-current/15'
                  }`}
                >
                  MatA (2×2)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMatName('MatB')}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    activeMatName === 'MatB' ? 'bg-current text-neutral-900 font-bold' : 'bg-current/15'
                  }`}
                >
                  MatB (2×2)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Active Matrix Grid */}
              <div className="border-l-2 border-r-2 border-current px-2 py-1 grid grid-cols-2 gap-1.5">
                {(activeMatName === 'MatA' ? matA.data : matB.data).map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`${r}-${c}`}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const num = parseFloat(e.target.value) || 0;
                        if (activeMatName === 'MatA') {
                          const next = matA.data.map((row) => [...row]);
                          next[r][c] = num;
                          setMatA({ ...matA, data: next });
                        } else {
                          const next = matB.data.map((row) => [...row]);
                          next[r][c] = num;
                          setMatB({ ...matB, data: next });
                        }
                      }}
                      className="w-10 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-xs text-center font-bold"
                    />
                  ))
                )}
              </div>

              {/* Matrix Operations buttons */}
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    const det = matrixDeterminant(matA.data);
                    setMatResultMsg(`Det(MatA) = ${det}`);
                  }}
                  className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
                >
                  Det(MatA)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const inv = matrixInverse(matA.data);
                      setMatResultMsg(`Inv(MatA): [[${inv[0].join(',')}],[${inv[1].join(',')}]]`);
                    } catch (err: unknown) {
                      setMatResultMsg(err instanceof Error ? err.message : 'Error');
                    }
                  }}
                  className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
                >
                  Inv(MatA)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tr = matrixTranspose(matA.data);
                    setMatResultMsg(`Tr(MatA): [[${tr[0].join(',')}],[${tr[1].join(',')}]]`);
                  }}
                  className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
                >
                  Tran(MatA)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const mult = matrixMultiply(matA.data, matB.data);
                    setMatResultMsg(`A×B: [[${mult[0].join(',')}],[${mult[1].join(',')}]]`);
                  }}
                  className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
                >
                  MatA × MatB
                </button>
              </div>
            </div>

            {matResultMsg && (
              <div className="text-[11px] font-bold bg-current/10 p-1 rounded overflow-x-auto whitespace-nowrap">
                {matResultMsg}
              </div>
            )}
          </div>
        )}

        {/* VECTOR MODE */}
        {mode === 'VECTOR' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">VECTOR CALCULATIONS (3D)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold">VctA: </span>
                <span className="border-l border-r border-current px-1">
                  [{vctA.data.join(', ')}]
                </span>
              </div>
              <div>
                <span className="font-bold">VctB: </span>
                <span className="border-l border-r border-current px-1">
                  [{vctB.data.join(', ')}]
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  const dot = vectorDot(vctA.data, vctB.data);
                  setVctResultMsg(`VctA • VctB = ${dot}`);
                }}
                className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
              >
                Dot (A•B)
              </button>
              <button
                type="button"
                onClick={() => {
                  const cross = vectorCross(vctA.data, vctB.data);
                  setVctResultMsg(`A × B = [${cross.join(', ')}]`);
                }}
                className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
              >
                Cross (A×B)
              </button>
              <button
                type="button"
                onClick={() => {
                  const ang = vectorAngle(vctA.data, vctB.data, true);
                  setVctResultMsg(`Angle(A, B) = ${ang.toFixed(2)}°`);
                }}
                className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
              >
                Angle θ
              </button>
              <button
                type="button"
                onClick={() => {
                  const norm = vectorNorm(vctA.data);
                  setVctResultMsg(`|VctA| = ${norm.toFixed(4)}`);
                }}
                className="px-2 py-1 bg-current/15 hover:bg-current/25 rounded cursor-pointer"
              >
                |VctA|
              </button>
            </div>

            {vctResultMsg && (
              <div className="text-[11px] font-bold bg-current/10 p-1 rounded">{vctResultMsg}</div>
            )}
          </div>
        )}

        {/* BASE-N MODE */}
        {mode === 'BASE' && (
          <div className="text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">BASE-N SIMULTANEOUS DISPLAY</span>
              <div className="flex items-center gap-1 text-[10px]">
                <span>Input:</span>
                <input
                  type="text"
                  value={baseInputStr}
                  onChange={(e) => {
                    setBaseInputStr(e.target.value);
                    try {
                      const parsed = BigInt(e.target.value || '0');
                      setBaseVal(parsed);
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-16 bg-current/10 border border-current/30 px-1 rounded text-center font-bold"
                />
              </div>
            </div>

            {(() => {
              const bases = formatInBases(baseVal);
              return (
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between border-b border-current/10 pb-0.5">
                    <span className="font-bold">DEC:</span>
                    <span>{bases.dec}</span>
                  </div>
                  <div className="flex justify-between border-b border-current/10 pb-0.5">
                    <span className="font-bold">HEX:</span>
                    <span>0x{bases.hex}</span>
                  </div>
                  <div className="flex justify-between border-b border-current/10 pb-0.5">
                    <span className="font-bold">BIN:</span>
                    <span className="text-[10px]">{bases.bin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">OCT:</span>
                    <span>0o{bases.oct}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SPREADSHEET MODE */}
        {mode === 'SPREADSHEET' && (
          <div className="text-xs font-mono space-y-1">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">SPREADSHEET (A-D × 1-3)</span>
              <span className="text-[10px] opacity-75">fx-991CW Sheet</span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-center font-bold border-b border-current/20 pb-0.5">
              <span>A</span>
              <span>B</span>
              <span>C</span>
              <span>D</span>
            </div>

            <div className="space-y-1">
              {sheet.slice(0, 3).map((row, r) => (
                <div key={r} className="grid grid-cols-4 gap-1">
                  {row.map((cell, c) => (
                    <input
                      key={`${r}-${c}`}
                      type="text"
                      value={cell.formula || cell.value.toString()}
                      onChange={(e) => {
                        const next = sheet.map((row) => [...row]);
                        next[r][c] = { formula: e.target.value, value: e.target.value };
                        setSheet(next);
                      }}
                      className="bg-current/10 border border-current/20 px-1 py-0.5 text-center rounded text-[10px] font-mono"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DISTRIBUTION MODE */}
        {mode === 'DISTRIBUTION' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">DISTRIBUTION CALCULATOR</span>
              <span className="text-[10px]">Normal CD</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span>x: </span>
                <input
                  type="number"
                  value={distX}
                  onChange={(e) => setDistX(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-current/10 border border-current/30 px-1 rounded text-center"
                />
              </div>
              <div>
                <span>μ: </span>
                <input
                  type="number"
                  value={distMean}
                  onChange={(e) => setDistMean(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-current/10 border border-current/30 px-1 rounded text-center"
                />
              </div>
              <div>
                <span>σ: </span>
                <input
                  type="number"
                  value={distSigma}
                  onChange={(e) => setDistSigma(parseFloat(e.target.value) || 1)}
                  className="w-12 bg-current/10 border border-current/30 px-1 rounded text-center"
                />
              </div>
            </div>

            <div className="bg-current/10 p-2 rounded text-[11px] font-bold">
              <div>Normal PD(x) = {normalPD(distX, distMean, distSigma).toFixed(6)}</div>
              <div>Normal CD(-∞..x) = {normalCD(-9999, distX, distMean, distSigma).toFixed(6)}</div>
            </div>
          </div>
        )}

        {/* RATIO MODE */}
        {mode === 'RATIO' && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">RATIO SOLVER (A : B = X : D)</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-bold my-2">
              <input
                type="number"
                value={ratioA}
                onChange={(e) => setRatioA(parseFloat(e.target.value) || 1)}
                className="w-12 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-center"
              />
              <span>:</span>
              <input
                type="number"
                value={ratioB}
                onChange={(e) => setRatioB(parseFloat(e.target.value) || 1)}
                className="w-12 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-center"
              />
              <span>=</span>
              <span className="text-cyan-400 font-extrabold underline">X</span>
              <span>:</span>
              <input
                type="number"
                value={ratioD}
                onChange={(e) => setRatioD(parseFloat(e.target.value) || 1)}
                className="w-12 bg-current/10 border border-current/30 px-1 py-0.5 rounded text-center"
              />
            </div>

            {(() => {
              try {
                const res = solveRatio('A:B=X:D', ratioA, ratioB, ratioD);
                return (
                  <div className="bg-current/10 p-2 rounded text-[11px] font-bold text-center">
                    {res.formula} ➔ <span className="text-sm underline">X = {res.x}</span>
                  </div>
                );
              } catch (err: unknown) {
                return <div>{err instanceof Error ? err.message : 'Error'}</div>;
              }
            })()}
          </div>
        )}

        {/* VERIFY & INEQUALITY MODES */}
        {(mode === 'VERIFY' || mode === 'INEQUALITY') && (
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center justify-between border-b border-current/20 pb-1">
              <span className="font-bold">
                {mode === 'VERIFY' ? 'VERIFY EQUALITY / TRUTH' : 'INEQUALITY SOLVER'}
              </span>
            </div>
            <div className="font-lcd text-lg py-2">
              {input || (mode === 'VERIFY' ? 'sqrt(8) == 2*sqrt(2)' : 'x^2 - 5x + 6 > 0')}
            </div>
            <div className="text-right font-bold text-lg">
              = {result || 'TRUE'}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
