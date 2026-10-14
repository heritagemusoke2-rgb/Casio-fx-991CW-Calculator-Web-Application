import React from 'react';
import { X, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  expression: string;
  result: string;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  expression,
  result,
  onClose,
}) => {
  if (!isOpen) return null;

  // Use encoded Casio-like web link
  const content = `https://classwiz.casio.com/calc?exp=${encodeURIComponent(expression)}&res=${encodeURIComponent(result)}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}&bgcolor=d1dcce&color=112211`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-neutral-200">CASIO CLASSWIZ QR CODE</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container with LCD green style */}
        <div className="p-4 rounded-xl bg-[#d1dcce] border-4 border-[#889988] shadow-inner mb-4 flex flex-col items-center">
          <img
            src={qrImgUrl}
            alt="Casio ClassWiz QR Code"
            className="w-48 h-48 mix-blend-multiply"
          />
          <span className="font-mono text-[10px] text-[#112211] font-bold mt-2">
            SCAN WITH SMARTPHONE CAMERA
          </span>
        </div>

        <div className="font-mono text-xs text-neutral-300 bg-neutral-800 p-2.5 rounded-lg border border-neutral-700 w-full text-left mb-4">
          <div className="text-[10px] text-neutral-400">Calculation:</div>
          <div className="truncate font-semibold text-cyan-300">{expression} = {result}</div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
