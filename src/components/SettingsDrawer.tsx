import React, { useState } from 'react';
import { VoiceId, DialectId, GeneratedClip } from '../types';
import { VOICES, DIALECTS } from './VoiceSelector';
import {
  X,
  User,
  Sliders,
  Check,
  Volume2,
  Trash2,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  LogOut,
  ShieldCheck,
  Clock,
  Radio,
} from 'lucide-react';

interface GoogleUser {
  name: string;
  email: string;
  avatarUrl: string;
  connectedAt: string;
}

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: VoiceId;
  onSelectVoice: (voice: VoiceId) => void;
  selectedDialect: DialectId;
  onSelectDialect: (dialect: DialectId) => void;
  playbackSpeed: number;
  onSelectSpeed: (speed: number) => void;
  clips: GeneratedClip[];
  onPlayClip: (clip: GeneratedClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAllClips: () => void;
  onOpenAlphabet: () => void;
  initialTab?: 'account' | 'voices' | 'settings' | 'history';
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
  selectedDialect,
  onSelectDialect,
  playbackSpeed,
  onSelectSpeed,
  clips,
  onPlayClip,
  onDeleteClip,
  onClearAllClips,
  onOpenAlphabet,
  initialTab = 'voices',
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'voices' | 'settings' | 'history'>(initialTab);

  // Google Account state stored in localStorage
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('codka_soomaaliga_google_user');
      if (saved) return JSON.parse(saved);
      // Default initial state connected to owhaydar@gmail.com
      return {
        name: 'O. Wahaydar',
        email: 'owhaydar@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        connectedAt: 'Hadda kuxiran (Active)',
      };
    } catch {
      return null;
    }
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  if (!isOpen) return null;

  const handleConnectGoogle = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const user: GoogleUser = {
        name: 'O. Wahaydar',
        email: 'owhaydar@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        connectedAt: new Date().toLocaleDateString(),
      };
      setGoogleUser(user);
      localStorage.setItem('codka_soomaaliga_google_user', JSON.stringify(user));
      setIsConnecting(false);
    }, 600);
  };

  const handleDisconnectGoogle = () => {
    setGoogleUser(null);
    localStorage.removeItem('codka_soomaaliga_google_user');
  };

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

  // Clean names of the voices
  const PERSON_NAMES: Record<string, string> = {
    Kore: 'Deeqo',
    Puck: 'Warsame',
    Fenrir: 'Garaad',
    Zephyr: 'Shire',
    Charon: 'Cumar',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Hagaajinta & Dookhyada (Settings)
              </h3>
              <p className="text-xs text-slate-400">
                Codadka, Koontada Google-ka & Lahjadaha
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

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'voices'
                ? 'text-sky-400 border-sky-400 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Codadka
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'account'
                ? 'text-sky-400 border-sky-400 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Koontada Google
            {googleUser && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-sky-400 border-sky-400 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Hagaajin
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'text-sky-400 border-sky-400 bg-slate-900'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Kaydka ({clips.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* 1. VOICES TAB - ONLY ICON AND PERSON NAME */}
          {activeTab === 'voices' && (
            <div className="space-y-2.5 animate-fade-in">
              {VOICES.map((v) => {
                const isSelected = selectedVoice === v.id;
                const personName = PERSON_NAMES[v.id] || v.name;
                return (
                  <div
                    key={v.id}
                    onClick={() => onSelectVoice(v.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500/80 ring-1 ring-sky-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Person Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm transition-colors ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950 shadow-sky-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>

                      {/* Magaca Qofka Kaliya */}
                      <span className="text-sm font-bold text-white tracking-tight">
                        {personName}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center pr-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-slate-950">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. GOOGLE ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  Koontada Google-ka (Google Account)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ku xir koontadaada Google si aad u keydsato codadka aad soo saarto.
                </p>
              </div>

              {googleUser ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4 shadow-xl">
                  {/* User Profile Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                          OW
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {googleUser.name}
                          <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                            Kuxiran
                          </span>
                        </h5>
                        <p className="text-xs text-slate-400 font-mono">
                          {googleUser.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Isku-xirka Tooska ah (Auto-Sync Audio):</span>
                      <button
                        type="button"
                        onClick={() => setAutoSync(!autoSync)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          autoSync ? 'bg-sky-500' : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            autoSync ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 pt-1">
                      <span>Codadka la keydiyay:</span>
                      <span className="font-semibold text-slate-200">{clips.length} Cod</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleDisconnectGoogle}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Ka bax Koontada Google
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">
                      Ku xir Google (Connect Google Account)
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Ku kaydi dhammaan codadka aad soo saarto koontadaada Google si aad mar kasta u hesho.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    disabled={isConnecting}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    {isConnecting ? (
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Ku gal Google (Sign in with Google)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. SETTINGS & DIALECTS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <Radio className="w-3.5 h-3.5 text-blue-400" />
                  Qaabka Dhawaaqa & Lahjadda (Cadence & Style)
                </h4>
                <div className="space-y-2">
                  {DIALECTS.map((d) => {
                    const isSelected = selectedDialect === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => onSelectDialect(d.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500/70 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            {d.somaliTitle}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {d.description}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            isSelected
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {d.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Speed control */}
              <div className="pt-3 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Xawaaraha Akhriska (Reading Speed)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0.75, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onSelectSpeed(s)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        playbackSpeed === s
                          ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Phonetics Guide Link */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAlphabet();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Hagaha Xarfaha Dhuunta (C, X, Q, DH)
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Codadkii Hore ee La Duubay
                </h4>
                {clips.length > 0 && (
                  <button
                    onClick={onClearAllClips}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Nadiifi
                  </button>
                )}
              </div>

              {clips.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <p>Weli ma jiro cod la keydiyay.</p>
                  <p className="text-[11px] text-slate-600">
                    Cod kasta oo aad ku akhriso 'Aqri' wuxuu ka muuqanayaa halkan.
                  </p>
                </div>
              ) : (
                clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                  >
                    <p className="text-slate-200 line-clamp-2">
                      "{clip.text}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                      <span>{clip.voice} • {new Date(clip.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onPlayClip(clip);
                            onClose();
                          }}
                          className="p-1 rounded bg-sky-500 text-slate-950 hover:bg-sky-400"
                          title="Dhegeyso"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                        <button
                          onClick={() => downloadWav(clip)}
                          className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                          title="Soo deji WAV"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteClip(clip.id)}
                          className="p-1 rounded bg-slate-800 text-slate-500 hover:text-rose-400"
                          title="Tirtir"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Codka Soomaaliga AI • v3.8 Studio
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Xir
          </button>
        </div>
      </div>
    </div>
  );
};
