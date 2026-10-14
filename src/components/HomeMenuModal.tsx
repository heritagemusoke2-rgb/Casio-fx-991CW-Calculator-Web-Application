import React from 'react';
import { AppMode } from '../types/calculator';
import {
  Calculator,
  Equal,
  BarChart3,
  Table,
  Grid,
  Navigation,
  Binary,
  Sheet,
  TrendingUp,
  Percent,
  Split,
  CheckCircle,
  X,
} from 'lucide-react';

interface HomeMenuModalProps {
  isOpen: boolean;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onClose: () => void;
}

interface AppCard {
  mode: AppMode;
  num: string;
  name: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

const APPS: AppCard[] = [
  { mode: 'CALC', num: '1', name: 'Calculate', sub: 'Standard scientific math', icon: Calculator },
  { mode: 'EQUATION', num: '2', name: 'Equation', sub: 'Simultaneous & Polynomials', icon: Equal },
  { mode: 'STAT', num: '3', name: 'Statistics', sub: '1-Var & 2-Var regression', icon: BarChart3 },
  { mode: 'TABLE', num: '4', name: 'Table', sub: 'Generate f(x) and g(x)', icon: Table },
  { mode: 'MATRIX', num: '5', name: 'Matrix', sub: 'MatA-D, Det, Inverse up to 4×4', icon: Grid },
  { mode: 'VECTOR', num: '6', name: 'Vector', sub: 'VctA-D, Dot & Cross prod', icon: Navigation },
  { mode: 'BASE', num: '7', name: 'Base-N', sub: 'DEC / HEX / BIN / OCT logic', icon: Binary },
  { mode: 'SPREADSHEET', num: '8', name: 'Spreadsheet', sub: '5×10 grid with formulas', icon: Sheet },
  { mode: 'DISTRIBUTION', num: '9', name: 'Distribution', sub: 'Normal, Binomial, Poisson', icon: TrendingUp },
  { mode: 'INEQUALITY', num: 'A', name: 'Inequality', sub: 'Poly inequalities degree 2-4', icon: Split },
  { mode: 'RATIO', num: 'B', name: 'Ratio', sub: 'A:B = X:D proportional solver', icon: Percent },
  { mode: 'VERIFY', num: 'C', name: 'Verify', sub: 'Equality & comparison check', icon: CheckCircle },
];

export const HomeMenuModal: React.FC<HomeMenuModalProps> = ({
  isOpen,
  activeMode,
  onSelectMode,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              CASIO CLASSWIZ APPS (HOME)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
            title="Close (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 12-App Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {APPS.map((app) => {
            const Icon = app.icon;
            const isSelected = activeMode === app.mode;
            return (
              <button
                key={app.mode}
                type="button"
                onClick={() => {
                  onSelectMode(app.mode);
                  onClose();
                }}
                className={`relative flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-100 shadow-md ring-1 ring-cyan-500/50'
                    : 'bg-neutral-800/80 border-neutral-700/60 hover:bg-neutral-750 hover:border-neutral-500 text-neutral-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isSelected
                        ? 'bg-cyan-500 text-neutral-950 font-bold'
                        : 'bg-neutral-700 text-neutral-300 group-hover:bg-neutral-600'
                    }`}
                  >
                    {app.num}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected
                        ? 'text-cyan-400'
                        : 'text-neutral-400 group-hover:text-cyan-400'
                    } transition-colors`}
                  />
                </div>
                <div className="text-xs font-semibold tracking-tight">{app.name}</div>
                <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{app.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="px-5 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>Press [HOME] key anytime</span>
          <span>fx-991CW ClassWiz</span>
        </div>
      </div>
    </div>
  );
};
