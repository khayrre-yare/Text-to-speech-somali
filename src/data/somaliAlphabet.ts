export interface SomaliLetterInfo {
  letter: string;
  name: string;
  ipa: string;
  description: string;
  example: string;
  exampleTranslation: string;
  tip: string;
}

export const SOMALI_LETTERS: SomaliLetterInfo[] = [
  {
    letter: 'C / c',
    name: 'Cayn',
    ipa: '[ʕ]',
    description: 'Voiced pharyngeal fricative. Similar to the Arabic letter ‘Ayn (ع). Produced deep in the throat by constricting the pharynx.',
    example: 'Cali, Caanaha, Cunto, Cilmi',
    exampleTranslation: 'Ali, Milk, Food, Knowledge',
    tip: 'Never pronounce it like English "C" or "S". Tighten your throat muscles to produce a deep resonant sound.',
  },
  {
    letter: 'X / x',
    name: 'Xaa',
    ipa: '[ħ]',
    description: 'Voiceless pharyngeal fricative. Similar to Arabic Haa (ح). A sharp, raspy "h" sound exhaled with throat friction.',
    example: 'Xasan, Xurmo, Xiddig, Xisaab',
    exampleTranslation: 'Hassan, Respect, Star, Mathematics',
    tip: 'Breathe out warm air from deep down your throat as if fogging a mirror with intensity.',
  },
  {
    letter: 'Q / q',
    name: 'Qaaf',
    ipa: '[q]',
    description: 'Voiceless uvular stop. Similar to Arabic Qaaf (ق). Produced by pressing the back of the tongue against the uvula.',
    example: 'Qalbi, Qorrax, Qurux, Qoys',
    exampleTranslation: 'Heart, Sun, Beauty, Family',
    tip: 'Much deeper in the mouth than English "k". The sound originates at the very back of the soft palate.',
  },
  {
    letter: 'DH / dh',
    name: 'Dha',
    ipa: '[ɖ]',
    description: 'Voiced retroflex stop. The tongue curls backward touching the roof of the palate with a firm snap.',
    example: 'Dhoobo, Dhul, Dhalo, Dhagax',
    exampleTranslation: 'Mud, Earth/Land, Glass, Stone',
    tip: 'Curl the tip of your tongue up and back against the hard palate before releasing.',
  },
  {
    letter: 'KH / kh',
    name: 'Khaa',
    ipa: '[χ]',
    description: 'Voiceless uvular fricative. Similar to Arabic Khaa (خ) or German "ch" in "Bach" or Scottish "loch".',
    example: 'Khudaar, Khibrad, Khatar, Khariidad',
    exampleTranslation: 'Vegetables, Experience, Danger, Map',
    tip: 'Gently vibrate the back of the palate while blowing air outwards.',
  },
  {
    letter: 'Shibaannada Laba-laabma (Double Consonants)',
    name: 'B, D, G, R, M, N',
    ipa: '[bː, dː, ɡː, rː, mː, nː]',
    description: 'In Somali, consonants like B, D, G, R, M, N are doubled (geminated) to indicate stress and length, which often alters meaning.',
    example: 'Wad (drive) vs Wadd (lead), Tag (go) vs Tagg (stand firm)',
    exampleTranslation: 'Notice the pronounced hold on the consonant.',
    tip: 'Hold the consonant sound momentarily before releasing the following vowel.',
  },
  {
    letter: 'Shaqallada Dhaadheer (Long Vowels)',
    name: 'AA, EE, II, OO, UU',
    ipa: '[aː, eː, iː, oː, uː]',
    description: 'Somali has 5 short vowels and 5 distinct long vowels. Doubling a vowel doubles its duration and can fundamentally change the word meaning.',
    example: 'Beri (yesterday) vs Beeri (farmed/planted); Hadal (speak) vs Haadal (soar)',
    exampleTranslation: 'Short vs Long vowel contrast',
    tip: 'Hold the vowel sound twice as long as the single vowel counterpart.',
  },
];
