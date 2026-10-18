import React, { useState } from 'react';
import { SOMALI_PRESETS, SomaliPreset } from '../data/somaliPresets';
import { Sparkles, ArrowRight, Quote, Radio, BookOpen, HeartHandshake, Cpu } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: SomaliPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Dhammaan (All)', icon: Sparkles },
    { id: 'maahmaah', label: 'Maahmaahyo', icon: Quote },
    { id: 'warar', label: 'Warar & Idaacad', icon: Radio },
    { id: 'tiknoolaji', label: 'Tiknoolaji & AI', icon: Cpu },
    { id: 'sheeko', label: 'Sheekooyin', icon: BookOpen },
    { id: 'salaan', label: 'Salaan & Bariido', icon: HeartHandshake },
  ];

  const filteredPresets =
    activeCategory === 'all'
      ? SOMALI_PRESETS
      : SOMALI_PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
          <Quote className="w-3.5 h-3.5 text-amber-400" />
          Tusaalooyin Qoraal Soomaali ah (Sample Presets)
        </label>
        <span className="text-[11px] text-slate-400">
          Riix si toos ah loogu akhriyo
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="group cursor-pointer p-3 rounded-xl bg-slate-900/40 hover:bg-slate-850/80 border border-slate-800 hover:border-sky-500/50 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 flex items-center gap-1">
                  {preset.title}
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                  {preset.suggestedVoice}
                </span>
              </div>
              <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                "{preset.text}"
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[180px] italic">
                {preset.translation}
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                Dooro <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
