import React, { useState } from 'react';
import { X, Languages, ArrowRight, Volume2, Sparkles, Copy, Check } from 'lucide-react';
import { TranslationResult } from '../types';

interface TranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseSomaliText: (text: string) => void;
}

export const TranslatorModal: React.FC<TranslatorModalProps> = ({
  isOpen,
  onClose,
  onUseSomaliText,
}) => {
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/somali/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Khalad ayaa dhacay turjumaadda.');
      }
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Khalad ayaa dhacay');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.somaliText) {
      navigator.clipboard.writeText(result.somaliText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                U Turjun Af-Soomaali (Translate to Somali)
              </h3>
              <p className="text-xs text-slate-400">
                Geli Ingiriis ama Carabi si aad ugu beddesho Af-Soomaali dabiici ah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Qoraalka Asalka ah (English / Arabic / Other):
            </label>
            <textarea
              rows={3}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="e.g. Welcome everyone to our event today! We are excited to present our new software."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Turjumayaa...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  U Turjun Soomaali
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Af-Soomaali Dabiici ah:
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Waa la guuriyay' : 'Nuqul'}
                </button>
              </div>

              <p className="text-sm text-slate-100 leading-relaxed font-medium">
                {result.somaliText}
              </p>

              {result.literalMeaning && (
                <p className="text-xs text-slate-400 italic border-t border-slate-800/80 pt-2">
                  Sharaxaad: {result.literalMeaning}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onUseSomaliText(result.somaliText);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Geli Mashiinka Codka (Use in Voice Reader)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
