import React from 'react';
import { X, Keyboard, Sparkles, BookOpen } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              CASIO fx-991CW USER GUIDE & SHORTCUTS
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-300">
          
          {/* Key Features */}
          <div className="p-3.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-100">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Authentic fx-991CW ClassWiz Highlights</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
              <li><strong>Natural Textbook Display:</strong> Displays fractions, roots, and powers exactly as printed in textbooks.</li>
              <li><strong>FORMAT (S⇔D) Key:</strong> Cycles between exact fraction/surd/pi form, decimal, recurring decimal, engineering notation, and degrees/minutes/seconds.</li>
              <li><strong>HOME Menu:</strong> Access 12 complete applications: Calculate, Equations, Statistics, Table, Matrix, Vector, Base-N, Spreadsheet, Distribution, Inequality, Ratio, and Verify.</li>
              <li><strong>Replay Arrows:</strong> Navigate up/down in Calculate mode to browse and re-evaluate past calculations.</li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-100">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>PC / Mac Keyboard Shortcuts</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>Numbers & Math</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  0-9 . + - * /
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>Calculate (EXE)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  Enter
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>Delete (DEL)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  Backspace
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>All Clear (AC)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  Escape
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>HOME Menu</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  H
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>FORMAT (S⇔D)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  F
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>Square Root (√)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  R
                </kbd>
              </div>

              <div className="p-2.5 bg-neutral-800 rounded-lg border border-neutral-700/60 flex items-center justify-between">
                <span>Trig (sin, cos, tan)</span>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-600 rounded font-mono text-[10px] text-cyan-300">
                  S / C / T
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-neutral-400">
              Click the yellow <strong>SHIFT</strong> button to activate secondary functions printed above the keys (arcsin, arccos, cube, 10ˣ, eˣ, RanInt, constants).
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-850 border-t border-neutral-750 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
