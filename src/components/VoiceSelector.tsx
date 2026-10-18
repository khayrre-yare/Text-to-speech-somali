import React from 'react';
import { VoiceId, DialectId, VoiceOption, DialectOption } from '../types';
import { Sparkles, Radio, Award, User, Volume2 } from 'lucide-react';

export const VOICES: VoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore',
    somaliName: 'Cod Dhedig (Deeqo)',
    gender: 'female',
    description: 'Cod dhedig oo dabiici ah, xasiloon, ku fiican wax-akhriska, maqaallada & waxbarashada.',
    tag: 'Dhedig • Xasiloon & Dabiici',
  },
  {
    id: 'Puck',
    name: 'Puck',
    somaliName: 'Cod Lab (Warsame)',
    gender: 'male',
    description: 'Cod lab dhalinyaro ah, firfircoon, ku habboon wadahadalka caadiga ah & tiknoolajiyadda.',
    tag: 'Lab • Firfircoon & Casri',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    somaliName: 'Cod Lab (Garaad)',
    gender: 'male',
    description: 'Cod lab oo awood leh sida wariyayaasha idaacadaha (BBC / Radio Muqdisho).',
    tag: 'Lab • Wariye & Idaacad',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    somaliName: 'Cod Lab (Oday Shire)',
    gender: 'male',
    description: 'Cod lab culus oo xikmadaysan, ku habboon sheekooyinka, maahmaahyada & suugaanta.',
    tag: 'Lab • Culus & Sheeko',
  },
  {
    id: 'Charon',
    name: 'Charon',
    somaliName: 'Cod Lab (Cumar)',
    gender: 'male',
    description: 'Cod macaan oo dhexdhexaad ah, aad ugu fiican tilmaamaha iyo qoraallada dheer.',
    tag: 'Lab • Macaan & Dhexdhexaad',
  },
];

export const DIALECTS: DialectOption[] = [
  {
    id: 'standard',
    name: 'Standard Maxaa Tiri',
    somaliTitle: 'Af-Soomaali Rasmi ah',
    description: 'Lahjadda rasmiga ah ee guud ahaan dalka laga fahmo oo aad u cad.',
    badge: 'Standard',
  },
  {
    id: 'broadcaster',
    name: 'News Broadcaster',
    somaliTitle: 'Codka Idaacadda',
    description: 'Akhris rasmi ah oo joogsiyaal xisaabsan leh, sida idaacadaha caanka ah.',
    badge: 'Idaacad',
  },
  {
    id: 'benaadiri',
    name: 'Benaadiri Dialect',
    somaliTitle: 'Lahjadda Benaadiriga',
    description: 'Cod leh laxan jilicsan oo xeebeedka koonfureed u gaar ah.',
    badge: 'Xeebeed',
  },
  {
    id: 'poetic',
    name: 'Poetic & Literary',
    somaliTitle: 'Suugaan & Gabay',
    description: 'Cod ku habboon tixaha, xikmadaha, iyo gabayada dhaqanka.',
    badge: 'Xikmad',
  },
];

interface VoiceSelectorProps {
  selectedVoice: VoiceId;
  onSelectVoice: (voice: VoiceId) => void;
  selectedDialect: DialectId;
  onSelectDialect: (dialect: DialectId) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedDialect,
  onSelectDialect,
}) => {
  return (
    <div className="space-y-4">
      {/* Voice Personas */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            Dooro Qofka Akhriyaya (Voice Model)
          </label>
          <span className="text-[11px] text-slate-400">
            5 Cod oo Dabiici ah
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {VOICES.map((v) => {
            const isSelected = selectedVoice === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVoice(v.id)}
                className={`relative text-left p-3 rounded-xl border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-950/60 to-slate-900/90 border-sky-500/80 ring-1 ring-sky-500/40 shadow-lg shadow-sky-950/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/50'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                      }`}
                    >
                      {v.gender === 'female' ? '♀' : '♂'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {v.somaliName}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.id}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {v.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Volume2 className="w-3 h-3 text-sky-400" />
                    {v.tag}
                  </span>
                  {isSelected && (
                    <span className="text-sky-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                      Doortay
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dialect / Delivery Style */}
      <div className="pt-2 border-t border-slate-850">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 mb-2.5">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          Qaabka Dhawaaqa & Lahjadda (Cadence & Style)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIALECTS.map((d) => {
            const isSelected = selectedDialect === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelectDialect(d.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/70 text-white shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200">
                    {d.somaliTitle}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {d.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {d.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
