import React, { useState, useEffect, useCallback } from 'react';
import {
  AppMode,
  CalculatorSettings,
  HistoryItem,
  ResultFormat,
  VariableRegisters,
} from './types/calculator';
import { evaluateExpression } from './utils/mathEngine';
import { sound } from './utils/sound';
import { CalculatorChassis } from './components/CalculatorChassis';
import { CalculatorScreen } from './components/CalculatorScreen';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { HomeMenuModal } from './components/HomeMenuModal';
import { SettingsModal } from './components/SettingsModal';
import { CatalogModal } from './components/CatalogModal';
import { VariableModal } from './components/VariableModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { QuickGuideModal } from './components/QuickGuideModal';
import { QrCodeModal } from './components/QrCodeModal';
import {
  Calculator as CalcIcon,
  Equal,
  BarChart3,
  Table,
  Grid,
  Navigation,
  Binary,
  Sheet,
  TrendingUp,
  Percent,
  Compass,
  Volume2,
  VolumeX,
  History as HistoryIcon,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const INITIAL_SETTINGS: CalculatorSettings = {
  angleMode: 'DEG',
  numberFormat: 'NORM1',
  fixSciDigits: 2,
  fractionDisplay: 'IMPROPER',
  theme: 'CLASSIC_LCD',
  soundEnabled: true,
  contrast: 5,
};

const INITIAL_VARIABLES: VariableRegisters = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  x: 0,
  y: 0,
  z: 0,
  Ans: 0,
  PreAns: 0,
};

export default function App() {
  // App state
  const [mode, setMode] = useState<AppMode>('CALC');
  const [input, setInput] = useState<string>('0');
  const [cursorPos, setCursorPos] = useState<number>(1);
  const [result, setResult] = useState<string>('');
  const [exactResult, setExactResult] = useState<string | undefined>(undefined);
  const [currentFormat, setCurrentFormat] = useState<ResultFormat>('STANDARD');
  const [formatCycleIndex, setFormatCycleIndex] = useState<number>(0);
  const [shiftActive, setShiftActive] = useState<boolean>(false);
  const [settings, setSettings] = useState<CalculatorSettings>(INITIAL_SETTINGS);
  const [variables, setVariables] = useState<VariableRegisters>(INITIAL_VARIABLES);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  // Modals state
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Play sound helper
  const playClick = useCallback(
    (type: 'normal' | 'func' | 'ac' | 'exe' = 'normal') => {
      if (settings.soundEnabled) {
        sound.playKeyClick(type);
      }
    },
    [settings.soundEnabled]
  );

  const playError = useCallback(() => {
    if (settings.soundEnabled) {
      sound.playErrorTone();
    }
  }, [settings.soundEnabled]);

  // Insert character or function into input
  const handleInsert = useCallback(
    (char: string) => {
      playClick('normal');
      setHistoryIdx(-1);

      setInput((prev) => {
        if (prev === '0' && !['+', '-', '×', '÷', '^', '²', '³', '!', '/'].includes(char)) {
          setCursorPos(char.length);
          return char;
        }
        const before = prev.slice(0, cursorPos);
        const after = prev.slice(cursorPos);
        const next = before + char + after;
        setCursorPos(cursorPos + char.length);
        return next;
      });

      if (shiftActive) {
        setShiftActive(false);
      }
    },
    [cursorPos, shiftActive, playClick]
  );

  // Backspace
  const handleBackspace = useCallback(() => {
    playClick('func');
    setHistoryIdx(-1);

    setInput((prev) => {
      if (prev.length <= 1 || cursorPos === 0) {
        setCursorPos(1);
        return '0';
      }
      const before = prev.slice(0, cursorPos - 1);
      const after = prev.slice(cursorPos);
      const next = before + after;
      setCursorPos(Math.max(0, cursorPos - 1));
      return next || '0';
    });
  }, [cursorPos, playClick]);

  // Clear all
  const handleClearAll = useCallback(() => {
    playClick('ac');
    setInput('0');
    setCursorPos(1);
    setResult('');
    setExactResult(undefined);
    setHistoryIdx(-1);
    setShiftActive(false);
  }, [playClick]);

  // Calculate
  const handleCalculate = useCallback(() => {
    playClick('exe');
    if (!input.trim()) return;

    const evalRes = evaluateExpression(input, settings, variables);

    if (evalRes.success && evalRes.numericValue !== undefined) {
      setResult(evalRes.decimalResult);
      setExactResult(evalRes.standardResult !== evalRes.decimalResult ? evalRes.standardResult : undefined);
      setCurrentFormat('STANDARD');
      setFormatCycleIndex(0);

      // Update variables Ans & PreAns
      setVariables((prev) => ({
        ...prev,
        PreAns: prev.Ans,
        Ans: evalRes.numericValue!,
      }));

      // Add to history
      const item: HistoryItem = {
        id: Date.now().toString(),
        expression: input,
        result: evalRes.decimalResult,
        exactResult: evalRes.standardResult,
        angleMode: settings.angleMode,
        timestamp: Date.now(),
      };
      setHistory((prev) => [item, ...prev].slice(0, 30));
      setHistoryIdx(-1);
    } else {
      playError();
      setResult(evalRes.errorMessage ? 'Syntax ERROR' : 'Math ERROR');
      setExactResult(undefined);
    }
  }, [input, settings, variables, playClick, playError]);

  // Toggle representation format (S<=>D)
  const handleToggleFormat = useCallback(() => {
    playClick('func');
    if (!result) return;

    const evalRes = evaluateExpression(input, settings, variables);
    if (!evalRes.success || evalRes.numericValue === undefined) return;

    const availableFormats: ResultFormat[] = ['STANDARD', 'DECIMAL'];
    if (evalRes.recurringResult) availableFormats.push('RECURRING');
    if (evalRes.engResult) availableFormats.push('ENG');
    if (evalRes.sexagesimalResult) availableFormats.push('SEXAGESIMAL');

    const nextIndex = (formatCycleIndex + 1) % availableFormats.length;
    setFormatCycleIndex(nextIndex);
    const nextFmt = availableFormats[nextIndex];
    setCurrentFormat(nextFmt);

    if (nextFmt === 'STANDARD') {
      setResult(evalRes.decimalResult);
      setExactResult(evalRes.standardResult);
    } else if (nextFmt === 'DECIMAL') {
      setResult(evalRes.decimalResult);
      setExactResult(evalRes.decimalResult);
    } else if (nextFmt === 'RECURRING') {
      setResult(evalRes.recurringResult || evalRes.decimalResult);
      setExactResult(evalRes.recurringResult);
    } else if (nextFmt === 'ENG') {
      setResult(evalRes.engResult || evalRes.decimalResult);
      setExactResult(evalRes.engResult);
    } else if (nextFmt === 'SEXAGESIMAL') {
      setResult(evalRes.sexagesimalResult || evalRes.decimalResult);
      setExactResult(evalRes.sexagesimalResult);
    }
  }, [result, input, settings, variables, formatCycleIndex, playClick]);

  // Directional navigation
  const handleNavigate = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK') => {
      playClick('func');
      if (dir === 'LEFT') {
        setCursorPos((prev) => Math.max(0, prev - 1));
      } else if (dir === 'RIGHT') {
        setCursorPos((prev) => Math.min(input.length, prev + 1));
      } else if (dir === 'UP') {
        if (history.length > 0) {
          const nextIdx = Math.min(history.length - 1, historyIdx + 1);
          setHistoryIdx(nextIdx);
          const item = history[nextIdx];
          setInput(item.expression);
          setCursorPos(item.expression.length);
          setResult(item.result);
          setExactResult(item.exactResult);
        }
      } else if (dir === 'DOWN') {
        if (historyIdx > 0) {
          const nextIdx = historyIdx - 1;
          setHistoryIdx(nextIdx);
          const item = history[nextIdx];
          setInput(item.expression);
          setCursorPos(item.expression.length);
          setResult(item.result);
          setExactResult(item.exactResult);
        } else if (historyIdx === 0) {
          setHistoryIdx(-1);
          setInput('0');
          setCursorPos(1);
          setResult('');
          setExactResult(undefined);
        }
      } else if (dir === 'OK') {
        handleCalculate();
      }
    },
    [history, historyIdx, input.length, playClick, handleCalculate]
  );

  // Store into variable
  const handleStoreVariable = (reg: keyof VariableRegisters, val: number) => {
    setVariables((prev) => ({
      ...prev,
      [reg]: val,
    }));
    playClick('func');
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside modal input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInsert(e.key);
      } else if (e.key === '.') {
        handleInsert('.');
      } else if (e.key === '+') {
        handleInsert('+');
      } else if (e.key === '-') {
        handleInsert('-');
      } else if (e.key === '*') {
        handleInsert('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInsert('÷');
      } else if (e.key === '(' || e.key === ')') {
        handleInsert(e.key);
      } else if (e.key === '^') {
        handleInsert('^');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClearAll();
      } else if (e.key.toLowerCase() === 'h') {
        setIsHomeOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        handleToggleFormat();
      } else if (e.key.toLowerCase() === 's') {
        handleInsert('sin(');
      } else if (e.key.toLowerCase() === 'c') {
        handleInsert('cos(');
      } else if (e.key.toLowerCase() === 't') {
        handleInsert('tan(');
      } else if (e.key.toLowerCase() === 'l') {
        handleInsert('ln(');
      } else if (e.key.toLowerCase() === 'r') {
        handleInsert('√(');
      } else if (e.key.toLowerCase() === 'p') {
        handleInsert('π');
      } else if (e.key.toLowerCase() === 'v') {
        setIsVariablesOpen(true);
      } else if (e.key === 'ArrowLeft') {
        handleNavigate('LEFT');
      } else if (e.key === 'ArrowRight') {
        handleNavigate('RIGHT');
      } else if (e.key === 'ArrowUp') {
        handleNavigate('UP');
      } else if (e.key === 'ArrowDown') {
        handleNavigate('DOWN');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleInsert,
    handleCalculate,
    handleBackspace,
    handleClearAll,
    handleToggleFormat,
    handleNavigate,
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* 1. Universal Top Navigation Bar (Contract: 1 row, 3 zones) */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-base font-bold tracking-tight text-white font-tech">
            Casio fx-991CW ClassWiz
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
          <button
            type="button"
            onClick={() => setIsHomeOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Applications (12)
          </button>
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Constants & Catalog
          </button>
          <button
            type="button"
            onClick={() => setIsVariablesOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Variable Registers
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Calculation Settings
          </button>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            User Manual
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700/60 cursor-pointer"
            title={settings.soundEnabled ? 'Mute Sound' : 'Enable Keypad Audio'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-start justify-center gap-8">
        
        {/* Left Companion Panel (Quick Apps & Memory Inspector on Large Screens) */}
        <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0">
          
          {/* Quick Apps Matrix */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-md">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-300">
              <span className="font-tech tracking-wider">CLASSWIZ APPS</span>
              <span className="text-[10px] text-cyan-400 font-mono">12 MODES</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { m: 'CALC', label: '1. Calculate', icon: CalcIcon },
                { m: 'EQUATION', label: '2. Equation', icon: Equal },
                { m: 'STAT', label: '3. Statistics', icon: BarChart3 },
                { m: 'TABLE', label: '4. Table', icon: Table },
                { m: 'MATRIX', label: '5. Matrix', icon: Grid },
                { m: 'VECTOR', label: '6. Vector', icon: Navigation },
                { m: 'BASE', label: '7. Base-N', icon: Binary },
                { m: 'SPREADSHEET', label: '8. Sheet', icon: Sheet },
                { m: 'DISTRIBUTION', label: '9. Distrib', icon: TrendingUp },
                { m: 'RATIO', label: 'B. Ratio', icon: Percent },
              ].map((app) => {
                const isCurrent = mode === app.m;
                return (
                  <button
                    key={app.m}
                    type="button"
                    onClick={() => setMode(app.m as AppMode)}
                    className={`py-2 px-2.5 rounded-lg text-left text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-500 text-neutral-950 font-bold shadow-xs'
                        : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <span className="truncate">{app.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory Registers live view */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-md">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold text-neutral-300">
              <span className="font-tech tracking-wider">MEMORY REGISTERS</span>
              <button
                type="button"
                onClick={() => setIsVariablesOpen(true)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              {(['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'Ans'] as (keyof VariableRegisters)[]).map(
                (k) => (
                  <div
                    key={k}
                    className="p-1.5 rounded-md bg-neutral-850 border border-neutral-800 flex flex-col"
                  >
                    <span className="text-[9px] text-neutral-500 font-bold">{k}</span>
                    <span className="text-neutral-200 font-semibold truncate">{variables[k]}</span>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

        {/* Center: The Iconic Casio fx-991CW Calculator */}
        <div className="flex-1 flex justify-center w-full">
          <CalculatorChassis
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenQr={() => setIsQrOpen(true)}
          >
            {/* Screen */}
            <CalculatorScreen
              mode={mode}
              input={input}
              cursorPos={cursorPos}
              result={result}
              exactResult={exactResult}
              currentFormat={currentFormat}
              onToggleFormat={handleToggleFormat}
              shiftActive={shiftActive}
              settings={settings}
              history={history}
              variables={variables}
              onOpenHome={() => setIsHomeOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenQr={() => setIsQrOpen(true)}
            />

            {/* Keypad */}
            <CalculatorKeypad
              shiftActive={shiftActive}
              onToggleShift={() => {
                playClick('func');
                setShiftActive((prev) => !prev);
              }}
              onInsert={handleInsert}
              onBackspace={handleBackspace}
              onClearAll={handleClearAll}
              onCalculate={handleCalculate}
              onOpenHome={() => setIsHomeOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenCatalog={() => setIsCatalogOpen(true)}
              onOpenVariables={() => setIsVariablesOpen(true)}
              onToggleFormat={handleToggleFormat}
              onNavigate={handleNavigate}
            />
          </CalculatorChassis>
        </div>

        {/* Right Companion Panel: Calculation History Stack */}
        <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-md">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-1.5">
                <HistoryIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-tech tracking-wider">LIVE HISTORY</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {history.length} ITEMS
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-xs">
                  Run calculations to see live history stack here.
                </div>
              ) : (
                history.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setInput(item.expression);
                      setCursorPos(item.expression.length);
                      setResult(item.result);
                      setExactResult(item.exactResult);
                    }}
                    className="p-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 cursor-pointer transition-all group"
                  >
                    <div className="text-[10px] text-neutral-500 font-mono truncate">
                      {item.expression}
                    </div>
                    <div className="text-xs font-bold text-cyan-300 font-mono truncate">
                      = {item.exactResult || item.result}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick specs banner */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>fx-991CW Features</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Equipped with ClassWiz Natural Textbook Display, High-Resolution 4-Gradation LCD, S⇔D exact radical/fraction conversion, and complete scientific app suite.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-neutral-850 text-neutral-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Casio fx-991CW ClassWiz Scientific Calculator</span>
          <span>·</span>
          <span>Natural Textbook Display</span>
          <span>·</span>
          <span>540+ Scientific Functions</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-neutral-300 cursor-pointer"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-neutral-300 cursor-pointer"
          >
            Help & Keys
          </button>
        </div>
      </footer>

      {/* Modals */}
      <HomeMenuModal
        isOpen={isHomeOpen}
        activeMode={mode}
        onSelectMode={(m) => {
          setMode(m);
          setResult('');
          setExactResult(undefined);
          if (m === 'CALC') setInput('0');
        }}
        onClose={() => setIsHomeOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
        onClose={() => setIsSettingsOpen(false)}
      />

      <CatalogModal
        isOpen={isCatalogOpen}
        onInsert={handleInsert}
        onClose={() => setIsCatalogOpen(false)}
      />

      <VariableModal
        isOpen={isVariablesOpen}
        variables={variables}
        currentAns={variables.Ans}
        onRecall={(varName) => handleInsert(varName)}
        onStore={handleStoreVariable}
        onClose={() => setIsVariablesOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onSelect={(item) => {
          setInput(item.expression);
          setCursorPos(item.expression.length);
          setResult(item.result);
          setExactResult(item.exactResult);
        }}
        onClear={() => setHistory([])}
        onClose={() => setIsHistoryOpen(false)}
      />

      <QuickGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <QrCodeModal
        isOpen={isQrOpen}
        expression={input}
        result={exactResult || result || '0'}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}
