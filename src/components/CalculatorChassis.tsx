import React from 'react';
import { Volume2, VolumeX, History, HelpCircle, Sun, QrCode } from 'lucide-react';

interface CalculatorChassisProps {
  children: React.ReactNode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenQr: () => void;
}

export const CalculatorChassis: React.FC<CalculatorChassisProps> = ({
  children,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenGuide,
  onOpenQr,
}) => {
  return (
    <div className="relative mx-auto my-4 max-w-[420px] w-full select-none">
      
      {/* Top Quick Utility Floating Toolbar */}
      <div className="flex items-center justify-between mb-3 px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-neutral-300 font-tech font-bold tracking-wider">fx-991CW CLASSWIZ</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Keypad Sound' : 'Enable Keypad Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
            title="Calculation History"
          >
            <History className="w-3.5 h-3.5 text-neutral-300 hover:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={onOpenQr}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
            title="ClassWiz QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-neutral-300 hover:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-pointer"
            title="User Guide & Keyboard Shortcuts"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-300 hover:text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Calculator Body Chassis */}
      <div className="relative rounded-[26px] bg-gradient-to-b from-[#2b3038] via-[#1e2229] to-[#15181e] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] border border-neutral-700/60">
        
        {/* Top Header Bar: CASIO Brand + Solar Cell + Model */}
        <div className="flex items-center justify-between mb-3 px-1">
          {/* Brand Logo */}
          <div className="flex flex-col">
            <span className="font-sans font-black tracking-widest text-neutral-300 text-sm leading-tight drop-shadow-xs">
              CASIO
            </span>
            <span className="text-[9px] font-bold text-neutral-400 tracking-wider font-tech">
              NATURAL-V.P.A.M.
            </span>
          </div>

          {/* Dual Power Solar Cell Replica */}
          <div className="w-24 h-6 rounded-xs solar-panel border border-neutral-800/80 flex items-center justify-between px-1.5 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none" />
            <div className="w-[1px] h-full bg-neutral-800/80 mx-1" />
            <div className="w-[1px] h-full bg-neutral-800/80 mx-1" />
            <div className="w-[1px] h-full bg-neutral-800/80 mx-1" />
            <span className="text-[7px] text-amber-200/50 font-mono tracking-tighter uppercase self-center pl-1">
              TWO WAY POWER
            </span>
          </div>

          {/* Model Name */}
          <div className="text-right">
            <div className="text-xs font-black tracking-wide text-neutral-200 font-tech">
              fx-991CW
            </div>
            <div className="text-[9px] font-extrabold tracking-widest text-cyan-400/90 font-mono">
              CLASSWIZ
            </div>
          </div>
        </div>

        {/* Screen & Keypad Container */}
        {children}

        {/* Bottom subtle Casio edge markings */}
        <div className="mt-4 pt-2 border-t border-neutral-700/40 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
          <span>HIGH DEFINITION 4-GRADATION DISPLAY</span>
          <span>540+ FUNCTIONS</span>
        </div>
      </div>
    </div>
  );
};
