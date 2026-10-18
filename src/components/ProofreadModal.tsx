import React from 'react';
import { AnalysisResult } from '../types';
import { X, CheckCircle2, Sparkles, Volume2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ProofreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  result: AnalysisResult | null;
  isLoading: boolean;
  onApplyCorrection: (newText: string) => void;
}

export const ProofreadModal: React.FC<ProofreadModalProps> = ({
  isOpen,
  onClose,
  originalText,
  result,
  isLoading,
  onApplyCorrection,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Saxitaanka & Nadiifinta Higgaadda Soomaaliga
              </h3>
              <p className="text-xs text-slate-400">
                Hubinta khaladaadka higgaadda iyo diyaarinta akhris sugan oo dabiici ah
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-3 border-sky-500/30 border-t-sky-400 animate-spin" />
              <p className="text-sm font-medium text-slate-300">
                AI ayaa falanqeynaysa naxwaha iyo higgaadda Af-Soomaaliga...
              </p>
              <p className="text-xs text-slate-500">
                Waxaan hubinaynaa shaqallada dhaadheer (aa, ee, ii, oo, uu) iyo xarfaha dhuunta (c, x, q, dh).
              </p>
            </div>
          ) : result ? (
            <>
              {/* Summary Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  result.isClean
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                {result.isClean ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-sm">
                    {result.isClean
                      ? 'Qoraalkaagu wuu saxan yahay! (No Errors Found)'
                      : 'Waxaan saxnay dhowr qalad oo higgaad ah'}
                  </p>
                  <p className="opacity-90 leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Improvements List */}
              {result.improvements && result.improvements.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Waxyaabaha La Saxay (Corrections Made):
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Side by side or corrected comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Qoraalka la Hagaajiyay (Optimized Text):</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 text-slate-100 text-sm leading-relaxed font-normal">
                  {result.correctedText}
                </div>
              </div>

              {/* Phonetics Guide if available */}
              {result.phoneticGuide && result.phoneticGuide.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Tilmaamaha Dhawaaqa Erayada Adag:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.phoneticGuide.map((g, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="font-bold text-sky-400">{g.word}</div>
                        <div className="text-slate-300 text-[11px]">{g.sound}</div>
                        <div className="text-slate-500 text-[10px] italic">{g.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Wax natiijo ah lama helin.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Xir (Close)
          </button>

          {result && (
            <button
              type="button"
              onClick={() => {
                onApplyCorrection(result.correctedText);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Qaado Qoraalkan Saxan (Use Corrected)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
