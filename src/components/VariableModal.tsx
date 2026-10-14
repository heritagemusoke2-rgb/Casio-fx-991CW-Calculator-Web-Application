import React, { useState } from 'react';
import { VariableRegisters } from '../types/calculator';
import { X, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface VariableModalProps {
  isOpen: boolean;
  variables: VariableRegisters;
  currentAns: number;
  onRecall: (varName: string) => void;
  onStore: (varName: keyof VariableRegisters, val: number) => void;
  onClose: () => void;
}

export const VariableModal: React.FC<VariableModalProps> = ({
  isOpen,
  variables,
  currentAns,
  onRecall,
  onStore,
  onClose,
}) => {
  const [storeValInput, setStoreValInput] = useState<string>(currentAns.toString());

  if (!isOpen) return null;

  const registers: (keyof VariableRegisters)[] = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z', 'Ans', 'PreAns'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              VARIABLE REGISTERS (A-F, x, y, z, Ans)
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

        {/* Store value input */}
        <div className="p-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="text-[11px] text-neutral-400 mb-1">Value to store:</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={storeValInput}
              onChange={(e) => setStoreValInput(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 font-mono focus:outline-hidden focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => setStoreValInput(currentAns.toString())}
              className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg whitespace-nowrap"
            >
              Use Ans
            </button>
          </div>
        </div>

        {/* Variable list */}
        <div className="p-3.5 overflow-y-auto space-y-1.5">
          {registers.map((reg) => {
            const val = variables[reg];
            const isAns = reg === 'Ans' || reg === 'PreAns';
            return (
              <div
                key={reg}
                className="flex items-center justify-between p-2.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-neutral-700 border border-neutral-600 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                    {reg}
                  </span>
                  <div>
                    <div className="font-mono text-xs text-neutral-100 font-medium">
                      = {val}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onRecall(reg);
                      onClose();
                    }}
                    title={`Recall variable ${reg}`}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 cursor-pointer"
                  >
                    <ArrowUpFromLine className="w-3 h-3 text-cyan-400" />
                    <span>Recall</span>
                  </button>
                  {!isAns && (
                    <button
                      type="button"
                      onClick={() => {
                        const num = parseFloat(storeValInput);
                        if (!Number.isNaN(num)) {
                          onStore(reg, num);
                        }
                      }}
                      title={`Store value into ${reg}`}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 cursor-pointer"
                    >
                      <ArrowDownToLine className="w-3 h-3" />
                      <span>Store</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
