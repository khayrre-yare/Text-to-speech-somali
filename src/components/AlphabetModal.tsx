import React from 'react';
import { X, BookOpen, Volume2, Info } from 'lucide-react';
import { SOMALI_LETTERS, SomaliLetterInfo } from '../data/somaliAlphabet';

interface AlphabetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySample?: (sampleText: string) => void;
}

export const AlphabetModal: React.FC<AlphabetModalProps> = ({
  isOpen,
  onClose,
  onPlaySample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Hagaha Xarfaha & Dhawaaqa Af-Soomaaliga
              </h3>
              <p className="text-xs text-slate-400">
                Sida mashiinku u dhuuxo una akhriyo xarfaha dhuunta iyo shaqallada dhaadheer
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/30 flex items-start gap-3 text-xs text-sky-200">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Af-Soomaaligu wuxuu adeegsadaa farta Laatiinka laga bilaabo 1972-kii. Xarfaha sida <strong>C</strong> (Cayn), <strong>X</strong> (Xaa), <strong>Q</strong> (Qaaf), iyo <strong>DH</strong> ayaa dhuunta iyo carabka laga soo saaraa si la mid ah ama ka duwan luuqadaha kale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SOMALI_LETTERS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {item.letter}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.ipa}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-850 space-y-1 mb-2">
                    <div className="text-xs font-semibold text-slate-200">
                      Tusaale: <span className="text-amber-300 font-normal">{item.example}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      {item.exampleTranslation}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 italic">
                    💡 {item.tip}
                  </span>
                  {onPlaySample && (
                    <button
                      type="button"
                      onClick={() => onPlaySample(item.example)}
                      className="shrink-0 ml-2 px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      Dhegeyso
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Xir
          </button>
        </div>
      </div>
    </div>
  );
};
