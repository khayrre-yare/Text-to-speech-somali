import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SettingsDrawer } from './components/SettingsDrawer';
import { AlphabetModal } from './components/AlphabetModal';
import { VoiceId, DialectId, GeneratedClip } from './types';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Download,
  Trash2,
  Copy,
  Check,
  User,
  Sparkles,
  ArrowDown,
  Info,
  Sliders,
} from 'lucide-react';

import { speakUsingWebSpeech, generateLocalSpeechWav } from './utils/audioSynthesisFallback';

const SPECIAL_SOMALI_CHARS = ['c', 'x', 'q', 'dh', 'kh', 'aa', 'ee', 'ii', 'oo', 'uu'];

export default function App() {
  // Main text state
  const [inputText, setInputText] = useState<string>(
    'Cali wuxuu cabbaa caano macaan maalin kasta. Waddada dheer ee magaalada taggaya buu maray.'
  );

  // Selected Voice & Dialect
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>('Kore');
  const [selectedDialect, setSelectedDialect] = useState<DialectId>('standard');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Audio Playback State
  const [currentClip, setCurrentClip] = useState<GeneratedClip | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Network & UI states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [quotaNotice, setQuotaNotice] = useState<boolean>(false);

  // Settings & Drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [initialSettingsTab, setInitialSettingsTab] = useState<'account' | 'voices' | 'settings' | 'history'>('voices');
  const [isAlphabetOpen, setIsAlphabetOpen] = useState<boolean>(false);

  // History state
  const [historyClips, setHistoryClips] = useState<GeneratedClip[]>(() => {
    try {
      const saved = localStorage.getItem('codka_soomaaliga_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio & Textarea refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('codka_soomaaliga_history', JSON.stringify(historyClips));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [historyClips]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Update speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Primary action: Synthesize & Read (AQRI)
  const handleAqri = async () => {
    const textToRead = inputText.trim();
    if (!textToRead) {
      setErrorMessage('Fadlan halkan geli qoraalka aad rabto in la aqriyo.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const response = await fetch('/api/somali/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRead,
          voice: selectedVoice,
          dialect: selectedDialect,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.quotaExceeded || response.status === 429) {
          // Seamless fallback: Synthesize playable/downloadable WAV and speak via device voice
          const fallbackWav = generateLocalSpeechWav(textToRead);
          const fallbackClip: GeneratedClip = {
            id: Date.now().toString(),
            text: textToRead,
            audioBase64: fallbackWav,
            mimeType: 'audio/wav',
            voice: selectedVoice,
            dialect: selectedDialect,
            timestamp: Date.now(),
            wordCount: textToRead.split(/\s+/).length,
          };

          setCurrentClip(fallbackClip);
          setHistoryClips((prev) => [fallbackClip, ...prev.slice(0, 19)]);

          if (audioRef.current) {
            audioRef.current.src = `data:audio/wav;base64,${fallbackWav}`;
            audioRef.current.load();
          }

          // Trigger clear, audible speech synthesis
          speakUsingWebSpeech(
            textToRead,
            playbackSpeed,
            () => setIsPlaying(true),
            () => setIsPlaying(false)
          );

          setQuotaNotice(true);
          return;
        }

        throw new Error(data.error || 'Khalad ayaa ku yimid codka.');
      }

      setQuotaNotice(false);

      const newClip: GeneratedClip = {
        id: Date.now().toString(),
        text: textToRead,
        audioBase64: data.audio,
        mimeType: data.mimeType || 'audio/wav',
        voice: selectedVoice,
        dialect: selectedDialect,
        timestamp: Date.now(),
        wordCount: data.wordCount || textToRead.split(/\s+/).length,
      };

      setCurrentClip(newClip);
      setHistoryClips((prev) => [newClip, ...prev.slice(0, 19)]);

      if (audioRef.current) {
        audioRef.current.src = `data:${newClip.mimeType};base64,${newClip.audioBase64}`;
        audioRef.current.load();
        audioRef.current.play().catch((e) => {
          console.warn('Auto-play was handled by browser.', e);
        });
      }
    } catch (err: any) {
      console.error(err);
      // Even on general network errors, fallback so the user can still listen!
      const fallbackWav = generateLocalSpeechWav(textToRead);
      const fallbackClip: GeneratedClip = {
        id: Date.now().toString(),
        text: textToRead,
        audioBase64: fallbackWav,
        mimeType: 'audio/wav',
        voice: selectedVoice,
        dialect: selectedDialect,
        timestamp: Date.now(),
        wordCount: textToRead.split(/\s+/).length,
      };
      setCurrentClip(fallbackClip);
      speakUsingWebSpeech(textToRead, playbackSpeed, () => setIsPlaying(true), () => setIsPlaying(false));
      setQuotaNotice(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play / Pause Toggle
  const togglePlayPause = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (!audioRef.current || !currentClip) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Replay
  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  // Download WAV file (Fallaarta la degista)
  const handleDownloadWav = () => {
    if (!currentClip) return;
    try {
      const byteCharacters = atob(currentClip.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: currentClip.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codka-soomaaliga-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  // Quick insert special Somali character
  const handleInsertChar = (char: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setInputText((prev) => prev + char);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = inputText;
    const newText = text.substring(0, start) + char + text.substring(end);
    setInputText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 10);
  };

  // Open settings with tab
  const handleOpenSettingsWithTab = (tab: 'account' | 'voices' | 'settings' | 'history' = 'voices') => {
    setInitialSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} preload="auto" />

      {/* Simplified Top Navigation */}
      <Navbar
        onOpenSettings={handleOpenSettingsWithTab}
        onOpenAlphabet={() => setIsAlphabetOpen(true)}
        selectedVoice={selectedVoice}
      />

      {/* Main Container - Focused strictly on Text Input, "Aqri" button, and Download Arrow */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="w-full space-y-5">
          {/* Main Card: Text Input Area */}
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
            {/* Quick Action Bar inside the box */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Geli Qoraalka Soomaaliga:
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inputText);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800"
                  title="Nuqul ka qaad"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Waa la guuriyay' : 'Nuqul'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputText('')}
                  disabled={!inputText}
                  className="hover:text-rose-400 transition-colors flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 disabled:opacity-30"
                  title="Tirtir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tirtir</span>
                </button>
              </div>
            </div>

            {/* Spacious Textarea */}
            <textarea
              ref={textareaRef}
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Halkan ku qor qoraalka Af-Soomaaliga ah ee aad rabto in la aqriyo..."
              className="w-full bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 text-base sm:text-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all leading-relaxed resize-y font-normal"
            />

            {/* Character & Word count + Somali Letter Quick Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-850">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 mr-1">Xarfaha:</span>
                {SPECIAL_SOMALI_CHARS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleInsertChar(char)}
                    className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-300 transition-all active:scale-95"
                    title={`Ku dar '${char}'`}
                  >
                    {char}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                {inputText.trim().split(/\s+/).filter(Boolean).length} Erey • {inputText.length} Xaraf
              </div>
            </div>
          </div>

          {/* Underneath: The Prominent "Aqri" Button */}
          <div className="w-full flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleAqri}
              disabled={isGenerating || !inputText.trim()}
              className="w-full py-4 sm:py-5 px-8 rounded-2xl font-bold text-lg sm:text-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-slate-950 flex items-center justify-center gap-3 shadow-xl shadow-sky-600/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Waa la aqrinayaa...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6 fill-current" />
                  <span>Aqri</span>
                </>
              )}
            </button>

            {/* Error Notice if any */}
            {errorMessage && (
              <div className="w-full p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quota Notice if active */}
            {quotaNotice && (
              <div className="w-full p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <p className="font-semibold text-amber-300">
                    Xadka maalinlaha ah ee Gemini TTS waa la gaaray (Free tier quota)
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Qoraalkaaga waxaa si guul leh loogu aqriyay codka qalabkaaga (Device Voice) si uusan adeeggu kuugu kala go'in. Fallaarta la degista WAV-na waa diyaar!
                  </p>
                </div>
              </div>
            )}

            {/* When Reading is Ready/Completed: Audio Controls & Download Arrow ("fallaarta la degista") Appear */}
            {currentClip && (
              <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-sky-500/40 shadow-2xl space-y-3 animate-fade-in">
                {/* Top row with Voice label & Download Arrow */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-300">
                      Codka: <strong className="text-sky-400">{currentClip.voice}</strong> ({currentClip.dialect})
                    </span>
                  </div>

                  {/* Fallaarta La Degista (Download Arrow Button) */}
                  <button
                    type="button"
                    onClick={handleDownloadWav}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/25 transition-all active:scale-95 cursor-pointer"
                    title="Degso Codka (Download WAV)"
                  >
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                    <span>Degso Codka</span>
                  </button>
                </div>

                {/* Scrubber timeline */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Transport buttons: Play/Pause, Replay, Speed */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      title={isPlaying ? 'Hakad' : 'Aqri'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReplay}
                      className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Dib uga bilow"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    {[0.75, 1.0, 1.25, 1.5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                          playbackSpeed === s
                            ? 'bg-sky-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Settings & Voice Personas Drawer with Google Account */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedVoice={selectedVoice}
        onSelectVoice={(v) => setSelectedVoice(v)}
        selectedDialect={selectedDialect}
        onSelectDialect={(d) => setSelectedDialect(d)}
        playbackSpeed={playbackSpeed}
        onSelectSpeed={(s) => setPlaybackSpeed(s)}
        clips={historyClips}
        onPlayClip={(clip) => {
          setCurrentClip(clip);
          setInputText(clip.text);
          setSelectedVoice(clip.voice);
          setSelectedDialect(clip.dialect);
          if (audioRef.current) {
            audioRef.current.src = `data:${clip.mimeType};base64,${clip.audioBase64}`;
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
          }
        }}
        onDeleteClip={(id) => setHistoryClips((prev) => prev.filter((c) => c.id !== id))}
        onClearAllClips={() => setHistoryClips([])}
        onOpenAlphabet={() => setIsAlphabetOpen(true)}
        initialTab={initialSettingsTab}
      />

      {/* Somali Phonetics & Alphabet Guide Modal */}
      <AlphabetModal
        isOpen={isAlphabetOpen}
        onClose={() => setIsAlphabetOpen(false)}
        onPlaySample={(sample) => {
          setIsAlphabetOpen(false);
          setInputText(sample);
          handleAqri();
        }}
      />
    </div>
  );
}
