import React from 'react';
import { HistoryItem } from '../types/calculator';
import { X, Trash2, CornerDownLeft, Copy, Check } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onSelect,
  onClear,
  onClose,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              CALCULATION HISTORY ({history.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-neutral-400 hover:text-rose-400 p-1 rounded-md hover:bg-neutral-800 transition-colors"
                title="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3.5 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No calculation history yet. Run calculations in COMP mode to see them here.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1 font-mono">
                  <span>[{item.angleMode}]</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="font-mono text-xs text-neutral-300 overflow-x-auto whitespace-nowrap mb-1">
                  {item.expression}
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-cyan-300">
                    = {item.exactResult || item.result}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.result, item.id)}
                      className="p-1.5 rounded-md hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
                      title="Copy result"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-[11px] text-cyan-300 font-medium cursor-pointer"
                      title="Load into display"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      <span>Use</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
