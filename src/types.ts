export type VoiceId = 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';

export type DialectId = 'standard' | 'benaadiri' | 'broadcaster' | 'poetic';

export interface VoiceOption {
  id: VoiceId;
  name: string;
  somaliName: string;
  gender: 'female' | 'male';
  description: string;
  tag: string;
}

export interface DialectOption {
  id: DialectId;
  name: string;
  somaliTitle: string;
  description: string;
  badge: string;
}

export interface GeneratedClip {
  id: string;
  text: string;
  audioBase64: string;
  mimeType: string;
  voice: VoiceId;
  dialect: DialectId;
  timestamp: number;
  duration?: number;
  wordCount: number;
}

export interface AnalysisResult {
  correctedText: string;
  isClean: boolean;
  improvements: string[];
  phoneticGuide?: Array<{
    word: string;
    sound: string;
    tip: string;
  }>;
  summary: string;
}

export interface TranslationResult {
  somaliText: string;
  literalMeaning: string;
  formality: string;
}
