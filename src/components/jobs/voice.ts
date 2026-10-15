import type { Duration, TradeId } from '@/data/types';

/** Words people actually say at a naka (English, Hindi, Hinglish) → filters. */
const TRADE_WORDS: Record<TradeId, string[]> = {
  plumber: ['plumb', 'pipe', 'tap', 'leak', 'प्लंबर', 'नल', 'पाइप', 'nal'],
  electrician: ['electric', 'wiring', 'light', 'fan', 'bijli', 'बिजली', 'वायरिंग', 'इलेक्ट्रीशियन'],
  carpenter: ['carpent', 'wood', 'furniture', 'door', 'badhai', 'बढ़ई', 'लकड़ी', 'फ़र्नीचर', 'फर्नीचर'],
  painter: ['paint', 'colour', 'color', 'पेंट', 'पेंटर', 'रंग'],
  mason: ['mason', 'tile', 'brick', 'plaster', 'mistri', 'मिस्त्री', 'राजमिस्त्री', 'टाइल', 'ईंट'],
  cleaner: ['clean', 'sweep', 'safai', 'सफ़ाई', 'सफाई', 'झाड़ू'],
  labour: ['helper', 'labour', 'labor', 'loading', 'mazdoor', 'मज़दूर', 'मजदूर', 'हेल्पर', 'लोडिंग'],
  driver: ['driver', 'drive', 'tempo', 'ड्राइवर', 'गाड़ी', 'टेम्पो'],
  cook: ['cook', 'kitchen', 'khana', 'रसोइया', 'खाना', 'कुक'],
  gardener: ['garden', 'plant', 'mali', 'माली', 'बगीचा', 'पौधे'],
};

const DURATION_WORDS: Record<Duration, string[]> = {
  daily: ['today', 'aaj', 'आज', 'daily', 'dihadi', 'दिहाड़ी', 'one day', 'एक दिन'],
  short: ['few days', 'week', 'कुछ दिन', 'हफ़्ते', 'हफ्ते', 'short'],
  long: ['month', 'permanent', 'naukri', 'महीने', 'महीना', 'नौकरी', 'long'],
};

export function parseSpeech(text: string): { trade?: TradeId; duration?: Duration } {
  const q = text.toLowerCase();
  const trade = (Object.keys(TRADE_WORDS) as TradeId[]).find((t) => TRADE_WORDS[t].some((w) => q.includes(w)));
  const duration = (Object.keys(DURATION_WORDS) as Duration[]).find((d) => DURATION_WORDS[d].some((w) => q.includes(w)));
  return { trade, duration };
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

/** Browser speech recognition, if the device has it (Chrome/Android do). */
export function getRecognition(lang: 'en' | 'hi'): Recognition | null {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  r.interimResults = false;
  r.maxAlternatives = 1;
  return r;
}
