import type { Duration, Lang, TradeId } from '@/data/types';
import { localeOf } from '@/lib/i18n';

/** Words people actually say at a naka (English, Hindi, Marathi, Gujarati, Hinglish) → filters. */
const TRADE_WORDS: Record<TradeId, string[]> = {
  plumber: ['plumb', 'pipe', 'tap', 'leak', 'प्लंबर', 'नल', 'पाइप', 'nal', 'नळ', 'પ્લમ્બર', 'નળ', 'પાઇપ'],
  electrician: ['electric', 'wiring', 'light', 'fan', 'bijli', 'बिजली', 'वायरिंग', 'इलेक्ट्रीशियन', 'वीज', 'इलेक्ट्रिशियन', 'ઇલેક્ટ્રિશિયન', 'વીજળી', 'વાયરિંગ', 'લાઇટ'],
  carpenter: ['carpent', 'wood', 'furniture', 'door', 'badhai', 'बढ़ई', 'लकड़ी', 'फ़र्नीचर', 'फर्नीचर', 'सुतार', 'लाकूड', 'સુથાર', 'લાકડું', 'ફર્નિચર'],
  painter: ['paint', 'colour', 'color', 'पेंट', 'पेंटर', 'रंग', 'रंगारी', 'પેઇન્ટ', 'પેઇન્ટર', 'રંગ'],
  mason: ['mason', 'tile', 'brick', 'plaster', 'mistri', 'मिस्त्री', 'राजमिस्त्री', 'टाइल', 'ईंट', 'गवंडी', 'वीट', 'કડિયા', 'ટાઇલ', 'ઈંટ', 'મિસ્ત્રી'],
  cleaner: ['clean', 'sweep', 'safai', 'सफ़ाई', 'सफाई', 'झाड़ू', 'स्वच्छता', 'साफसफाई', 'સફાઈ', 'ઝાડુ'],
  labour: ['helper', 'labour', 'labor', 'loading', 'mazdoor', 'मज़दूर', 'मजदूर', 'हेल्पर', 'लोडिंग', 'कामगार', 'हमाल', 'મજૂર', 'હેલ્પર', 'લોડિંગ'],
  driver: ['driver', 'drive', 'tempo', 'ड्राइवर', 'गाड़ी', 'टेम्पो', 'गाडी', 'ડ્રાઇવર', 'ગાડી', 'ટેમ્પો'],
  cook: ['cook', 'kitchen', 'khana', 'रसोइया', 'खाना', 'कुक', 'स्वयंपाक', 'आचारी', 'રસોઇયા', 'રસોઈ', 'જમવાનું'],
  gardener: ['garden', 'plant', 'mali', 'माली', 'बगीचा', 'पौधे', 'बाग', 'झाडे', 'માળી', 'બગીચો', 'છોડ'],
};

const DURATION_WORDS: Record<Duration, string[]> = {
  daily: ['today', 'aaj', 'आज', 'daily', 'dihadi', 'दिहाड़ी', 'one day', 'एक दिन', 'रोजंदारी', 'एक दिवस', 'આજે', 'રોજ', 'એક દિવસ'],
  short: ['few days', 'week', 'कुछ दिन', 'हफ़्ते', 'हफ्ते', 'short', 'काही दिवस', 'आठवडा', 'થોડા દિવસ', 'અઠવાડિયું'],
  long: ['month', 'permanent', 'naukri', 'महीने', 'महीना', 'नौकरी', 'long', 'महिना', 'कायम', 'મહિનો', 'મહિના', 'નોકરી', 'કાયમી'],
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
export function getRecognition(lang: Lang): Recognition | null {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = localeOf(lang);
  r.interimResults = false;
  r.maxAlternatives = 1;
  return r;
}
