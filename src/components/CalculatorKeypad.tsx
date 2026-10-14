import React from 'react';
import { NavigationPad } from './NavigationPad';
import {
  Home,
  RotateCcw,
  Settings as SettingsIcon,
  Layers,
  BookMarked,
  Wrench,
  ArrowRightLeft,
  Delete,
} from 'lucide-react';

interface CalculatorKeypadProps {
  shiftActive: boolean;
  onToggleShift: () => void;
  onInsert: (char: string) => void;
  onBackspace: () => void;
  onClearAll: () => void;
  onCalculate: () => void;
  onOpenHome: () => void;
  onOpenSettings: () => void;
  onOpenCatalog: () => void;
  onOpenVariables: () => void;
  onToggleFormat: () => void;
  onNavigate: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK') => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  shiftActive,
  onToggleShift,
  onInsert,
  onBackspace,
  onClearAll,
  onCalculate,
  onOpenHome,
  onOpenSettings,
  onOpenCatalog,
  onOpenVariables,
  onToggleFormat,
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-2.5 pt-2 select-none">
      
      {/* Upper Function Keys & Navigation Block */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Function Matrix */}
        <div className="flex-1 grid grid-cols-4 gap-1.5">
          {/* HOME */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={onOpenHome}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="HOME Menu (H)"
            >
              <Home className="w-3.5 h-3.5 mb-0.5 text-cyan-400" />
              <span className="text-[10px] font-bold tracking-tight">HOME</span>
            </button>
          </div>

          {/* BACK */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={() => onNavigate('LEFT')}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Back"
            >
              <RotateCcw className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[10px] font-bold tracking-tight">BACK</span>
            </button>
          </div>

          {/* SETTINGS */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Settings"
            >
              <SettingsIcon className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-tight">SETTING</span>
            </button>
          </div>

          {/* VARIABLE */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={onOpenVariables}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Variables (A-F, x, y, z)"
            >
              <Layers className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
              <span className="text-[9px] font-bold tracking-tight">VARIABLE</span>
            </button>
          </div>

          {/* CATALOG */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={onOpenCatalog}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Catalog (Constants & Analysis)"
            >
              <BookMarked className="w-3.5 h-3.5 mb-0.5 text-purple-400" />
              <span className="text-[9px] font-bold tracking-tight">CATALOG</span>
            </button>
          </div>

          {/* TOOLS */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={() => onInsert('Abs(')}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Tools / Abs"
            >
              <Wrench className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-tight">TOOLS</span>
            </button>
          </div>

          {/* FORMAT (S<=>D) */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={onToggleFormat}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
              title="FORMAT (S<=>D Fraction/Decimal/Eng)"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-tight">FORMAT</span>
            </button>
          </div>

          {/* x quick key */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-amber-400/90 font-mono h-3.5 flex items-center"></span>
            <button
              type="button"
              onClick={() => onInsert('x')}
              className="w-full py-1.5 px-1 rounded-md casio-btn-primary flex flex-col items-center justify-center text-neutral-100 hover:text-white transition-all cursor-pointer"
              title="x variable"
            >
              <span className="text-xs font-bold italic font-serif">x</span>
              <span className="text-[9px] font-bold">VAR</span>
            </button>
          </div>
        </div>

        {/* Right Circular Navigation Pad */}
        <div className="shrink-0 flex items-center justify-center pl-1">
          <NavigationPad
            onUp={() => onNavigate('UP')}
            onDown={() => onNavigate('DOWN')}
            onLeft={() => onNavigate('LEFT')}
            onRight={() => onNavigate('RIGHT')}
            onOk={() => onNavigate('OK')}
          />
        </div>
      </div>

      {/* Scientific Key Matrix with Secondary Shift Markings */}
      <div className="grid grid-cols-5 gap-1.5">
        
        {/* SHIFT KEY */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center font-bold">
            {shiftActive ? '● ACTIVE' : 'SHIFT'}
          </span>
          <button
            type="button"
            onClick={onToggleShift}
            className={`w-full py-2 rounded-md casio-btn-shift font-bold text-xs cursor-pointer transition-all ${
              shiftActive ? 'ring-2 ring-amber-400 shadow-md scale-95' : ''
            }`}
          >
            SHIFT
          </button>
        </div>

        {/* Fraction a/b */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">d/c</span>
          <button
            type="button"
            onClick={() => onInsert('/')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Fraction"
          >
            <span className="inline-flex flex-col items-center leading-none text-[10px]">
              <span>■</span>
              <span className="w-2.5 h-[1px] bg-current my-0.5" />
              <span>■</span>
            </span>
          </button>
        </div>

        {/* Square Root */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">³√</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'cbrt(' : '√(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Square Root"
          >
            √■
          </button>
        </div>

        {/* x² */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">x³</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? '³' : '²')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Square x²"
          >
            x²
          </button>
        </div>

        {/* x^y */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">ⁿ√■</span>
          <button
            type="button"
            onClick={() => onInsert('^')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Power x^y"
          >
            x^■
          </button>
        </div>

        {/* log */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">10^x</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? '10^(' : 'log(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Common log (base 10)"
          >
            log
          </button>
        </div>

        {/* ln */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">e^x</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'e^(' : 'ln(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Natural logarithm ln"
          >
            ln
          </button>
        </div>

        {/* (-) Negative Sign */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">A</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'A' : '(-)')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Negative Sign"
          >
            (-)
          </button>
        </div>

        {/* Degree, Minute, Second */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">B</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'B' : '°')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Sexagesimal (Degrees/Minutes/Seconds)"
          >
            ° ' "
          </button>
        </div>

        {/* x⁻¹ (Inverse) */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">x!</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? '!' : '^(-1)')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Inverse / Factorial"
          >
            x⁻¹
          </button>
        </div>

        {/* sin */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">sin⁻¹</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'asin(' : 'sin(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-cyan-200 cursor-pointer"
            title="Sine"
          >
            sin
          </button>
        </div>

        {/* cos */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">cos⁻¹</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'acos(' : 'cos(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-cyan-200 cursor-pointer"
            title="Cosine"
          >
            cos
          </button>
        </div>

        {/* tan */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">tan⁻¹</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'atan(' : 'tan(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-xs text-cyan-200 cursor-pointer"
            title="Tangent"
          >
            tan
          </button>
        </div>

        {/* Left Parenthesis ( */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">C</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'C' : '(')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-sm text-neutral-200 cursor-pointer"
            title="Left parenthesis"
          >
            (
          </button>
        </div>

        {/* Right Parenthesis ) */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">D</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'D' : ')')}
            className="w-full py-2 rounded-md casio-btn-primary font-bold text-sm text-neutral-200 cursor-pointer"
            title="Right parenthesis"
          >
            )
          </button>
        </div>
      </div>

      {/* Main Numeric & Operator Pad */}
      <div className="grid grid-cols-5 gap-1.5 mt-1">
        {/* ROW 1: 7, 8, 9, DEL, AC */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">CONST</span>
          <button
            type="button"
            onClick={() => (shiftActive ? onOpenCatalog() : onInsert('7'))}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            7
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">CONV</span>
          <button
            type="button"
            onClick={() => (shiftActive ? onOpenCatalog() : onInsert('8'))}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            8
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">RESET</span>
          <button
            type="button"
            onClick={() => onInsert('9')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            9
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">INS</span>
          <button
            type="button"
            onClick={onBackspace}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-xs text-amber-300 flex items-center justify-center cursor-pointer"
            title="Delete (Backspace)"
          >
            <Delete className="w-4 h-4 mr-0.5" />
            <span>DEL</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">OFF</span>
          <button
            type="button"
            onClick={onClearAll}
            className="w-full py-3 rounded-md casio-btn-ac font-bold text-sm tracking-wider cursor-pointer"
            title="All Clear (ESC)"
          >
            AC
          </button>
        </div>

        {/* ROW 2: 4, 5, 6, ×, ÷ */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">MATRIX</span>
          <button
            type="button"
            onClick={() => onInsert('4')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            4
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">VECTOR</span>
          <button
            type="button"
            onClick={() => onInsert('5')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            5
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">STAT</span>
          <button
            type="button"
            onClick={() => onInsert('6')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            6
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">nPr</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? ' nPr ' : '×')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-base text-amber-300 font-mono cursor-pointer"
            title="Multiply (×)"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">nCr</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? ' nCr ' : '÷')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-base text-amber-300 font-mono cursor-pointer"
            title="Divide (÷)"
          >
            ÷
          </button>
        </div>

        {/* ROW 3: 1, 2, 3, +, - */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center"></span>
          <button
            type="button"
            onClick={() => onInsert('1')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            1
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center"></span>
          <button
            type="button"
            onClick={() => onInsert('2')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            2
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center"></span>
          <button
            type="button"
            onClick={() => onInsert('3')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            3
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">Pol</span>
          <button
            type="button"
            onClick={() => onInsert('+')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-base text-amber-300 font-mono cursor-pointer"
            title="Add (+)"
          >
            +
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">Rec</span>
          <button
            type="button"
            onClick={() => onInsert('-')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-base text-amber-300 font-mono cursor-pointer"
            title="Subtract (-)"
          >
            -
          </button>
        </div>

        {/* ROW 4: 0, ., ×10ˣ, Ans, EXE */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">Rnd</span>
          <button
            type="button"
            onClick={() => onInsert('0')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            0
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">Ran#</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'random()' : '.')}
            className="w-full py-3 rounded-md casio-btn-num font-bold text-base font-mono cursor-pointer"
          >
            .
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">π</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'π' : '×10^')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Exponential ×10^ / Pi π"
          >
            ×10ˣ
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">PreAns</span>
          <button
            type="button"
            onClick={() => onInsert(shiftActive ? 'PreAns' : 'Ans')}
            className="w-full py-3 rounded-md casio-btn-primary font-bold text-xs text-neutral-200 cursor-pointer"
            title="Previous Answer"
          >
            Ans
          </button>
        </div>

        {/* EXE / EQUALS KEY */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-amber-400 font-mono h-3 flex items-center">%</span>
          <button
            type="button"
            onClick={() => (shiftActive ? onInsert('%') : onCalculate())}
            className="w-full py-3 rounded-md casio-btn-exe font-bold text-base tracking-wider cursor-pointer"
            title="Execute / Calculate (=)"
          >
            EXE
          </button>
        </div>

      </div>
    </div>
  );
};
