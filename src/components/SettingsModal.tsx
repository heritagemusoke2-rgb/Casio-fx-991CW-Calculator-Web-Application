import React from 'react';
import { AngleMode, CalculatorSettings, FractionDisplayType, LcdTheme, NumberFormatType } from '../types/calculator';
import { X, Volume2, VolumeX, Monitor, Compass, Hash } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: CalculatorSettings;
  onUpdateSettings: (newSettings: Partial<CalculatorSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              CALCULATOR SETTINGS
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
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-neutral-200">
          
          {/* Angle Unit */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Angle Unit</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['DEG', 'RAD', 'GRA'] as AngleMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateSettings({ angleMode: mode })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    settings.angleMode === mode
                      ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-sm'
                      : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750 text-neutral-300'
                  }`}
                >
                  {mode === 'DEG' ? 'Degree (°)' : mode === 'RAD' ? 'Radian (rad)' : 'Gradian (grad)'}
                </button>
              ))}
            </div>
          </div>

          {/* Number Format */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>Number Display Format</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(
                [
                  { id: 'NORM1', label: 'Norm 1 (Auto Exp)' },
                  { id: 'NORM2', label: 'Norm 2 (Standard)' },
                  { id: 'FIX', label: 'Fix (Fixed Decimals)' },
                  { id: 'SCI', label: 'Sci (Sci Notation)' },
                ] as { id: NumberFormatType; label: string }[]
              ).map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ numberFormat: fmt.id })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all cursor-pointer ${
                    settings.numberFormat === fmt.id
                      ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-sm'
                      : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750 text-neutral-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {(settings.numberFormat === 'FIX' || settings.numberFormat === 'SCI') && (
              <div className="flex items-center justify-between p-2.5 bg-neutral-800 rounded-lg border border-neutral-700 text-xs">
                <span>Digits (0 - 9):</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => onUpdateSettings({ fixSciDigits: d })}
                      className={`w-6 h-6 rounded flex items-center justify-center font-mono ${
                        settings.fixSciDigits === d
                          ? 'bg-cyan-500 text-neutral-950 font-bold'
                          : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fraction Display */}
          <div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Fraction Format
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'IMPROPER', label: 'd/c (Improper Fraction)' },
                  { id: 'MIXED', label: 'a b/c (Mixed Fraction)' },
                ] as { id: FractionDisplayType; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onUpdateSettings({ fractionDisplay: f.id })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    settings.fractionDisplay === f.id
                      ? 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400 shadow-sm'
                      : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750 text-neutral-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Theme */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>LCD Display Appearance</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'CLASSIC_LCD', label: 'Classic Olive LCD', bg: 'bg-[#b8c7b3] text-[#172417]' },
                  { id: 'OLED_CYAN', label: 'OLED High Contrast', bg: 'bg-[#0d1e2d] text-[#8be9fd]' },
                  { id: 'PAPER_WHITE', label: 'Paper Gray LCD', bg: 'bg-[#e2e8df] text-[#0f1c12]' },
                  { id: 'DARK_DOT', label: 'Dark Matrix', bg: 'bg-[#111417] text-[#38bdf8]' },
                ] as { id: LcdTheme; label: string; bg: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                    settings.theme === t.id
                      ? 'ring-2 ring-cyan-400 border-transparent'
                      : 'border-neutral-700 hover:border-neutral-500'
                  } bg-neutral-800`}
                >
                  <span className={`w-4 h-4 rounded-full border border-neutral-600 ${t.bg}`} />
                  <span className="text-neutral-200">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
              <span className="text-xs font-medium text-neutral-200">Keypad Haptic Sound</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-850 border-t border-neutral-750 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
