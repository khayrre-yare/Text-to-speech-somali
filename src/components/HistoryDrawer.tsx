import React from 'react';
import { GeneratedClip } from '../types';
import { X, Play, Download, Trash2, Clock, Volume2, Calendar } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clips: GeneratedClip[];
  onPlayClip: (clip: GeneratedClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  clips,
  onPlayClip,
  onDeleteClip,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const downloadWav = (clip: GeneratedClip) => {
    try {
      const byteCharacters = atob(clip.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: clip.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codka-soomaaliga-${clip.id}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Kaydka Codadka (History)
              </h3>
              <p className="text-xs text-slate-400">
                {clips.length} {clips.length === 1 ? 'Cod ayaa la keydiyay' : 'Codad ayaa la keydiyay'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {clips.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-500">
              <Clock className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-sm">Weli ma jiro cod la keydiyay.</p>
              <p className="text-xs text-slate-600">
                Cod kasta oo aad soo saarto wuxuu si toos ah ugu kaydsami doonaa halkan.
              </p>
            </div>
          ) : (
            clips.map((clip) => {
              const dateStr = new Date(clip.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={clip.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2.5 group"
                >
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    "{clip.text}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sky-400">
                        {clip.voice}
                      </span>
                      <span>•</span>
                      <span>{clip.dialect}</span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPlayClip(clip)}
                        className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
                        title="Dhegeyso mar kale"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => downloadWav(clip)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Soo deji WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClip(clip.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500 transition-colors"
                        title="Tirtir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {clips.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              Nadiifi Dhammaan (Clear all)
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Xir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
