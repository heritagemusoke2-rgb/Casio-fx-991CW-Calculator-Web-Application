import React from 'react';

interface NavigationPadProps {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onOk: () => void;
}

export const NavigationPad: React.FC<NavigationPadProps> = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onOk,
}) => {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center select-none">
      {/* Outer metallic circular bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 p-1 shadow-lg border border-neutral-600/50">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-800 via-neutral-900 to-neutral-750 flex items-center justify-center relative overflow-hidden">
          
          {/* Subtle directional indentations */}
          {/* UP */}
          <button
            type="button"
            onClick={onUp}
            title="Up Arrow (Replay / Prev)"
            aria-label="Up Arrow"
            className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-7 flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-neutral-400 group-hover:border-b-cyan-400 transition-colors" />
          </button>

          {/* DOWN */}
          <button
            type="button"
            onClick={onDown}
            title="Down Arrow (Replay / Next)"
            aria-label="Down Arrow"
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-7 flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-400 group-hover:border-t-cyan-400 transition-colors" />
          </button>

          {/* LEFT */}
          <button
            type="button"
            onClick={onLeft}
            title="Left Arrow (Cursor Left)"
            aria-label="Left Arrow"
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-10 flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-neutral-400 group-hover:border-r-cyan-400 transition-colors" />
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onClick={onRight}
            title="Right Arrow (Cursor Right)"
            aria-label="Right Arrow"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-10 flex items-center justify-center text-neutral-400 hover:text-white active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-neutral-400 group-hover:border-l-cyan-400 transition-colors" />
          </button>

          {/* Center OK Button */}
          <button
            type="button"
            onClick={onOk}
            title="OK / Select"
            aria-label="OK Button"
            className="w-11 h-11 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-800 text-neutral-200 hover:text-white active:scale-90 shadow-md border border-neutral-500/60 flex items-center justify-center text-[11px] font-bold tracking-wider cursor-pointer z-10 hover:border-cyan-400/80 transition-all"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
