import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory audio cache to prevent hitting Gemini TTS free tier quota repeatedly
const audioCache = new Map<string, { audio: string; mimeType: string; wordCount: number }>();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Check health & environment
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// API: Synthesize Somali Speech
app.post('/api/somali/speak', async (req, res) => {
  try {
    const {
      text,
      voice = 'Kore',
      style = 'Clear, authentic, native Somali pronunciation with precise enunciation of pharyngeal consonants (c, x, q, dh, kh)',
      dialect = 'standard', // 'standard', 'benaadiri', 'broadcaster', 'poetic'
      speed = 'normal', // 'normal', 'slow', 'expressive'
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Fadlan geli qoraal Soomaali ah (Text is required).' });
    }

    const cleanText = text.trim();
    if (cleanText.length > 3000) {
      return res.status(400).json({ error: 'Qoraalku wuu ka badan yahay 3,000 oo xaraf. Fadlan soo gaabi.' });
    }

    const ai = getGeminiClient();

    // Cache key for deduplicating requests to preserve API quota
    const cacheKey = `${voice}_${dialect}_${cleanText.toLowerCase()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return res.json({
        success: true,
        audio: cached.audio,
        mimeType: cached.mimeType,
        text: cleanText,
        wordCount: cached.wordCount,
        voice,
        dialect,
        fromCache: true,
      });
    }

    // Contextual voice prompt instructions for natural Somali enunciation
    let dialectInstruction = '';
    if (dialect === 'benaadiri') {
      dialectInstruction = 'Adopt an authentic coastal southern Benaadiri melodic tone and accent.';
    } else if (dialect === 'broadcaster') {
      dialectInstruction = 'Deliver in an authoritative, prestigious Somali news broadcast style (Radio Mogadishu / BBC Somali), highly articulated with crisp pauses.';
    } else if (dialect === 'poetic') {
      dialectInstruction = 'Deliver with poetic Somali eloquence, resonant vowels, respectful cadence, and measured pauses.';
    } else {
      dialectInstruction = 'Speak in standard, modern Somali (Maxaa tiri) with high clarity, natural warmth, and authentic native rhythm.';
    }

    // STRICT PHONETIC RULES FOR AF-SOOMAALI:
    // 1. In Somali, 'C' / 'c' is the voiced pharyngeal fricative [ʕ] (Arabic Ayn / ع). NEVER 'ch', 'k', 's', or 'j'.
    // 2. Doubled consonants 'bb', 'dd', 'gg', 'mm', 'nn', 'rr', 'll', 'tt' must be strictly geminated with double duration closure hold.
    const speechStylePrompt = `You are a native Somali speaker reading text in Af-Soomaali.
MANDATORY PRONUNCIATION RULES:
1. THE LETTER 'C' / 'c': In the Somali Latin script, 'C' and 'c' represents the voiced pharyngeal fricative [ʕ] (Arabic Ayn / ع). Examples: 'Cali' [ʕali], 'Cunto' [ʕunto], 'Caano' [ʕaːno], 'Cumar' [ʕumar], 'Macallin' [maʕallin], 'Cusub' [ʕusub]. You must NEVER pronounce 'C' as 'ch', 'k', 's', 'ts', or 'j'. It must ALWAYS be articulated deep in the throat as [ʕ] (Ayn).
2. GEMINATE DOUBLE CONSONANTS: In Somali, doubled consonants ('bb', 'dd', 'gg', 'mm', 'nn', 'rr', 'll', 'tt') indicate phonemic gemination. You MUST prolong the closure and hold the consonant for twice the duration with audible tension and stress (e.g. 'waddada', 'taggayaa', 'ballan', 'gabbadh', 'qaddir', 'abbahaa'). Never weaken or pronounce doubled consonants as single consonants.
3. THE LETTER 'X' / 'x': Voiceless pharyngeal fricative [ħ] (Arabic Haa / ح), as in 'Xasan', 'Xurmo'.
4. THE LETTER 'Q' / 'q': Voiceless uvular stop [q] (Arabic Qaaf / ق).
5. THE LETTER 'DH' / 'dh': Voiced retroflex stop [ɖ].
6. VOWELS: Double vowels (aa, ee, ii, oo, uu) must be held twice as long as single vowels (a, e, i, o, u).
${dialectInstruction} ${style}. Tone: authentic, natural, human-like native speaker.`;

    let response: any;
    let usedModel = 'gemini-3.8-flash-lite-tts';

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: speechStylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn('Primary TTS model failed, attempting fallback to gemini-3.8-flash-tts:', primaryErr?.message);
      // Fallback model
      usedModel = 'gemini-3.8-flash-tts';
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: speechStylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });
    }

    const candidate = response?.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.status(500).json({
        error: 'Codka lama soo saari karin. Fadlan mar kale isku day.',
      });
    }

    const base64Audio = audioPart.inlineData.data;
    const mimeType = audioPart.inlineData.mimeType || 'audio/wav';

    // Calculate approximate word tokens for UI highlighting & timing
    const words = cleanText.split(/\s+/).filter(Boolean);

    // Save in cache
    audioCache.set(cacheKey, {
      audio: base64Audio,
      mimeType,
      wordCount: words.length,
    });

    res.json({
      success: true,
      audio: base64Audio,
      mimeType,
      text: cleanText,
      wordCount: words.length,
      voice,
      dialect,
      model: usedModel,
    });
  } catch (error: any) {
    console.error('Error in /api/somali/speak:', error);
    const isQuota =
      error?.status === 'RESOURCE_EXHAUSTED' ||
      error?.message?.includes('429') ||
      error?.message?.includes('quota') ||
      error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isQuota) {
      return res.status(429).json({
        success: false,
        quotaExceeded: true,
        error: 'Xadka tijaabada ee Gemini TTS (Free tier: 10 requests/day) ayaa buuxsamay maanta.',
        suggestion: 'Mashiinku wuxuu si toos ah ugu wareegayaa codka qalabkaaga (Device Speech) si aad u dhageysato.',
      });
    }

    res.status(500).json({
      error: error?.message || 'Khalad ayaa dhacay xilliga codka la soo saarayay.',
    });
  }
});

// API: Analyze, proofread, and phonetically enhance Somali text
app.post('/api/somali/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert native linguist and proofreader of the Somali language (Af-Soomaali).
Analyze the following Somali text to ensure it reads cleanly, without spelling mistakes, missing double vowels (aa, ee, ii, oo, uu), or corrupted consonants (c, x, q, dh, kh).

Original text:
"""${text}"""

Provide a JSON response with:
1. "correctedText": The perfected Somali text with accurate spelling, proper casing, and punctuation for natural reading.
2. "isClean": boolean indicating whether original text was already 100% correct.
3. "improvements": array of strings describing key corrections made (e.g., fixed vowel elongation, fixed spelling, added punctuation for pauses) in Somali & English.
4. "phoneticGuide": array of objects for tricky Somali sounds in the text, where each object has:
   - "word": string
   - "sound": string explaining the pronunciation (e.g., "X is voiceless pharyngeal fricative like in 'Xasan'")
   - "tip": short tip in Somali/English.
5. "summary": A brief 1-sentence assessment in Somali (e.g. "Qoraalkaagu hadda wuu saxan yahay oo diyaar u yahay akhris.").

Format MUST be valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/somali/analyze:', error);
    res.status(500).json({
      error: error?.message || 'Khalad ayaa ku yimid falanqeynta qoraalka.',
    });
  }
});

// API: Translate foreign text (English, Arabic, etc.) to flawless natural Somali
app.post('/api/somali/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'auto' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Translate the following text into natural, idiomatic, and modern Somali (Af-Soomaali).
Avoid robotic word-for-word translation; make it sound like a native Somali speaker speaking clearly and eloquently.

Source Text:
"""${text}"""

Return a JSON object with:
{
  "somaliText": "Flawless Somali translation",
  "literalMeaning": "Brief English explanation or nuance",
  "formality": "conversational" | "formal" | "poetic"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/somali/translate:', error);
    res.status(500).json({
      error: error?.message || 'Turjumaaddu ma guuleysan.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Codka Soomaaliga AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
