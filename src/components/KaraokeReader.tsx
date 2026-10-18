import React, { useMemo } from 'react';

interface KaraokeReaderProps {
  text: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onWordClick?: (word: string, index: number) => void;
}

export const KaraokeReader: React.FC<KaraokeReaderProps> = ({
  text,
  currentTime,
  duration,
  isPlaying,
  onWordClick,
}) => {
  // Tokenize text into words with punctuation
  const words = useMemo(() => {
    if (!text) return [];
    return text.trim().split(/\s+/);
  }, [text]);

  // Estimate active word index based on time ratio
  const activeWordIndex = useMemo(() => {
    if (!isPlaying || duration <= 0 || words.length === 0) return -1;
    const progress = Math.min(1, Math.max(0, currentTime / duration));
    return Math.floor(progress * words.length);
  }, [isPlaying, currentTime, duration, words.length]);

  if (!text) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400"></span>
          Akhriska Tooska ah (Word-by-word Sync)
        </span>
        <span className="text-[11px] text-slate-500">
          {words.length} Erey • Riix erey kasta si aad u eegto
        </span>
      </div>

      <div className="text-base sm:text-lg leading-relaxed text-slate-300 font-normal select-text">
        {words.map((word, idx) => {
          const isActive = idx === activeWordIndex;
          const isPassed = activeWordIndex > -1 && idx < activeWordIndex;
          
          // Check for Somali distinct characters
          const hasPharyngeals = /[cxqdhCXQDH]/.test(word);

          return (
            <span
              key={`${word}-${idx}`}
              onClick={() => onWordClick?.(word, idx)}
              className={`inline-block mx-1 my-0.5 px-1 py-0.5 rounded transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-sky-400 text-slate-950 font-bold scale-105 shadow-md shadow-sky-500/30'
                  : isPassed
                  ? 'text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
