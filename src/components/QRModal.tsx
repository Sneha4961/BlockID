import React, { useState } from "react";
import { QrCode, XCircle, Copy, Check, ShieldCheck } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, title, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-xs text-slate-400">Cryptographically verifiable QR payload</p>
        </div>

        {/* QR Code Visual Box */}
        <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mx-auto border border-slate-200">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              data
            )}`}
            alt="QR Code"
            className="w-48 h-48 mx-auto"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all max-h-24 overflow-y-auto scrollbar-thin">
          {data}
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? "Payload Copied!" : "Copy Raw Payload JSON"}
        </button>
      </div>
    </div>
  );
};
