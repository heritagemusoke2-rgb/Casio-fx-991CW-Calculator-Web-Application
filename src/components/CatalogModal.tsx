import React, { useState, useMemo } from 'react';
import { CATALOG_ITEMS, CatalogItem } from '../utils/catalogData';
import { X, Search } from 'lucide-react';

interface CatalogModalProps {
  isOpen: boolean;
  onInsert: (value: string) => void;
  onClose: () => void;
}

const CATEGORIES = ['All', 'Analysis', 'Probability', 'Hyperbolic', 'Numeric', 'Constants', 'Conversions'] as const;

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onInsert,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    return CATALOG_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.syntax.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-850 border-b border-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              CASIO CATALOG & CONSTANTS
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

        {/* Search */}
        <div className="p-3 bg-neutral-850 border-b border-neutral-750 flex items-center gap-2">
          <Search className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search functions, constants, conversions..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 p-2 bg-neutral-900 border-b border-neutral-800 overflow-x-auto text-xs whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="p-3 overflow-y-auto space-y-1.5 divide-y divide-neutral-800/60">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onInsert(item.insertValue);
                onClose();
              }}
              className="pt-2 first:pt-0 p-2 rounded-lg hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-300">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{item.description}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-1 rounded-md opacity-90 group-hover:opacity-100">
                  {item.syntax}
                </span>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No matching catalog items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
