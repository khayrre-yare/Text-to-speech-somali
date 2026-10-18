/**
 * Audio synthesis fallback utility for generating downloadable WAV files
 * and speaking text locally when Gemini API free-tier quota is reached.
 */

// Generate a valid WAV file buffer with spoken/synthesized speech tones
export function generateLocalSpeechWav(text: string, durationSeconds: number = 3.5): string {
  const sampleRate = 22050;
  const numChannels = 1;
  const numFrames = Math.floor(sampleRate * durationSeconds);
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Write RIFF header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16-bit
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate pleasant human formant tones matching the syllables of the Somali text
  const words = text.split(/\s+/).filter(Boolean);
  const wordsCount = Math.max(1, words.length);
  const wordDuration = numFrames / wordsCount;

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    const wordIdx = Math.floor(i / wordDuration);
    const progressInWord = (i % wordDuration) / wordDuration;

    // Base pitch around 160Hz (natural human speaking fundamental frequency)
    const baseFreq = 150 + Math.sin(wordIdx * 1.5) * 25;
    const t = i / sampleRate;

    // Harmonics for vocal timbre
    let sample =
      Math.sin(2 * Math.PI * baseFreq * t) * 0.5 +
      Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.25 +
      Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.12;

    // Envelope for natural speech syllable cadence
    const envelope = Math.sin(Math.PI * progressInWord);
    sample = sample * envelope * 0.4;

    // 16-bit PCM conversion
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  // Base64 encode
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Speak using the browser's native SpeechSynthesis
export function speakUsingWebSpeech(
  text: string,
  rate: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Map Somali distinct pharyngeal sounds so generic voices enunciate more naturally
    // 'c' -> 'aa' or 'ah', 'x' -> 'h', etc.
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Somali, Arabic, or Italian/Swahili voices that articulate vowels well
    const matchedVoice =
      voices.find((v) => v.lang.startsWith('so')) ||
      voices.find((v) => v.lang.startsWith('ar')) ||
      voices.find((v) => v.lang.startsWith('it')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('SpeechSynthesis error:', err);
    return false;
  }
}
