export interface SomaliPreset {
  id: string;
  category: 'maahmaah' | 'warar' | 'salaan' | 'sheeko' | 'tiknoolaji';
  categoryLabel: string;
  title: string;
  text: string;
  translation: string;
  suggestedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  suggestedDialect: 'standard' | 'benaadiri' | 'broadcaster' | 'poetic';
}

export const SOMALI_PRESETS: SomaliPreset[] = [
  {
    id: 'maahmaah-1',
    category: 'maahmaah',
    categoryLabel: 'Maahmaahyo (Proverbs)',
    title: 'Aqoon & Iftiin',
    text: 'Aqoon la\'aan waa iftiin la\'aan, qofka wax bartaana meel kasta wuu ka ifaa oo dadkiisa iyo dalkiisaba wuxuu u horseedaa horumar iyo barwaaqo.',
    translation: 'Knowledge is light; without it is darkness. One who learns illuminates everywhere and leads their people and country to prosperity.',
    suggestedVoice: 'Kore',
    suggestedDialect: 'standard',
  },
  {
    id: 'maahmaah-2',
    category: 'maahmaah',
    categoryLabel: 'Maahmaahyo (Proverbs)',
    title: 'Gacmo Wada Jir',
    text: 'Gacmo wada jir bay wax ku gooyaan, midnimaduna waa awoodda ugu weyn ee bulsho ku gaari karto guul waarta.',
    translation: 'Hands together accomplish great things, and unity is the greatest strength through which a community achieves enduring success.',
    suggestedVoice: 'Zephyr',
    suggestedDialect: 'poetic',
  },
  {
    id: 'warar-1',
    category: 'warar',
    categoryLabel: 'Warar & Idaacad (News Broadcast)',
    title: 'Wararka Caalamka & Soomaaliya',
    text: 'Kusoo dhawaada warka caawa oo aynu ku eegi doonno xaaladihii ugu dambeeyay ee dalka iyo caalamka, gaar ahaan mashaariicda horumarinta kaabayaasha dhaqaalaha iyo cimilada.',
    translation: 'Welcome to tonight\'s news broadcast where we examine the latest updates in the country and globally, focusing on economic infrastructure projects and climate.',
    suggestedVoice: 'Fenrir',
    suggestedDialect: 'broadcaster',
  },
  {
    id: 'tiknoolaji-1',
    category: 'tiknoolaji',
    categoryLabel: 'Tiknoolaji & AI (Technology)',
    title: 'Caqliga Macmalka ah ee Af-Soomaaliga',
    text: 'Farsamada caqliga macmalka ah ee codka (Voice AI) waxay u saamaxaysaa qof kasta inuu qoraalka Af-Soomaaliga ku beddelo cod dabiici ah oo la mid ah kan qofka nool, si hufan oo bilaa khaladaad ah.',
    translation: 'Voice Artificial Intelligence technology enables anyone to transform written Somali text into a natural human voice, flawlessly and without errors.',
    suggestedVoice: 'Kore',
    suggestedDialect: 'standard',
  },
  {
    id: 'sheeko-1',
    category: 'sheeko',
    categoryLabel: 'Sheeko Xikmad leh (Folk Story)',
    title: 'Dawacadii iyo Canabka',
    text: 'Bari baa dawaco gaajaysan waxay soo martay beer canab ah. Waxay aragtay xirmo canab ah oo aad u bisil oo geedka dushiisa ka laalaada. In badan bay boodday oo isku dayday inay gaarto, laakiin wey awoodi weyday. Markii dambe waxay tiri: "Canabkani wuu dhanaan yahay oo weli ma bisla!"',
    translation: 'Once, a hungry fox passed by a vineyard. It saw a ripe cluster of grapes hanging up high. It leapt many times trying to reach them, but couldn\'t. Finally it said: "These grapes are sour and unripe anyway!"',
    suggestedVoice: 'Charon',
    suggestedDialect: 'standard',
  },
  {
    id: 'salaan-1',
    category: 'salaan',
    categoryLabel: 'Salaan & Dhaqan (Greetings)',
    title: 'Bariido & Soo Dhaweyn',
    text: 'Assalamu Calaykum waraxmatullaahi wabarakaatuhu. Kusoo dhawaada walaalayaal, waxaan idiin rajeynaynaa caafimaad taam ah, nabadgelyo iyo maalin barakeysan oo kheyr badan.',
    translation: 'Peace and blessings of God be upon you. Welcome, dear brothers and sisters; we wish you sound health, safety, and a blessed and joyous day.',
    suggestedVoice: 'Puck',
    suggestedDialect: 'benaadiri',
  },
];
