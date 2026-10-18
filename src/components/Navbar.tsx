import React from 'react';
import { Volume2, User, Sliders, Sparkles, BookOpen } from 'lucide-react';
import { VoiceId } from '../types';

interface NavbarProps {
  onOpenSettings: (tab?: 'account' | 'voices' | 'settings' | 'history') => void;
  onOpenAlphabet: () => void;
  selectedVoice: VoiceId;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenAlphabet,
  selectedVoice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 shadow-md shadow-sky-500/20 border border-sky-400/30">
            <Volume2 className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 text-xs text-amber-300 drop-shadow-sm select-none">★</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Codka Soomaaliga <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">AI</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Akhriska Qoraalka Af-Soomaaliga
            </p>
          </div>
        </div>

        {/* Action Controls: Person Icon & Menu/Settings */}
        <div className="flex items-center space-x-2">
          {/* Alphabet Guide button */}
          <button
            onClick={onOpenAlphabet}
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-all active:scale-95"
            title="Hagaha Xarfaha Soomaaliga"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Xarfaha</span>
          </button>

          {/* Voice options trigger with Person Icon */}
          <button
            onClick={() => onOpenSettings('voices')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 transition-all shadow-sm active:scale-95"
            title="Dooro Codka"
          >
            <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden xs:inline">
              {selectedVoice === 'Kore'
                ? 'Deeqo'
                : selectedVoice === 'Puck'
                ? 'Warsame'
                : selectedVoice === 'Fenrir'
                ? 'Garaad'
                : selectedVoice === 'Zephyr'
                ? 'Shire'
                : 'Cumar'}
            </span>
          </button>

          {/* Settings & Account trigger with Person/Settings Icon */}
          <button
            onClick={() => onOpenSettings('account')}
            type="button"
            className="flex items-center gap-1.5 p-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 transition-all shadow-sm active:scale-95"
            title="Settings & Koontada Google"
          >
            <Sliders className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
