import type { Duration, L, PaidWhen, PayMode, PayUnit, Perk, TradeId } from '@/data/types';

export type Kind = 'household' | 'shop' | 'contractor' | 'society';
export type Start = 'today' | 'tomorrow' | 'date';

export interface Draft {
  step: number;
  seen: number;
  kind: Kind;
  name: string;
  trade: TradeId | null;
  title: string;
  ideaIdx: number | null;
  description: string;
  area: string;
  landmark: string;
  start: Start;
  date: string;
  duration: Duration;
  length: number;
  hoursStart: string;
  hoursEnd: string;
  amount: number;
  unit: PayUnit;
  paidWhen: PaidWhen;
  payMode: PayMode[];
  perks: Perk[];
  workersNeeded: number;
}

export const DEFAULT_DRAFT: Draft = {
  step: 0,
  seen: 0,
  kind: 'household',
  name: '',
  trade: null,
  title: '',
  ideaIdx: null,
  description: '',
  area: '',
  landmark: '',
  start: 'tomorrow',
  date: '',
  duration: 'daily',
  length: 1,
  hoursStart: '09:00',
  hoursEnd: '18:00',
  amount: 0,
  unit: 'day',
  paidWhen: 'same-day',
  payMode: ['upi', 'cash'],
  perks: ['tea'],
  workersNeeded: 1,
};

export const KINDS: Record<Kind, L> = {
  household: { en: 'Household', hi: 'घर' },
  shop: { en: 'Shop / office', hi: 'दुकान / ऑफ़िस' },
  contractor: { en: 'Contractor', hi: 'ठेकेदार' },
  society: { en: 'Housing society', hi: 'हाउसिंग सोसाइटी' },
};

/** Areas around the Kurla naka, with distance from it (km). */
export const AREAS: { id: string; name: L; km: number; map: { x: number; y: number } }[] = [
  { id: 'kurla-w', name: { en: 'Kurla West', hi: 'कुर्ला पश्चिम' }, km: 0.5, map: { x: 48, y: 50 } },
  { id: 'kurla-e', name: { en: 'Kurla East', hi: 'कुर्ला पूर्व' }, km: 1.2, map: { x: 54, y: 52 } },
  { id: 'saki-naka', name: { en: 'Saki Naka', hi: 'साकी नाका' }, km: 2.0, map: { x: 44, y: 40 } },
  { id: 'ghatkopar', name: { en: 'Ghatkopar', hi: 'घाटकोपर' }, km: 3.0, map: { x: 60, y: 42 } },
  { id: 'chembur', name: { en: 'Chembur', hi: 'चेंबूर' }, km: 3.4, map: { x: 62, y: 62 } },
  { id: 'powai', name: { en: 'Powai', hi: 'पवई' }, km: 4.2, map: { x: 66, y: 28 } },
  { id: 'santacruz', name: { en: 'Santacruz East', hi: 'सांताक्रूज़ पूर्व' }, km: 4.5, map: { x: 32, y: 50 } },
  { id: 'vikhroli', name: { en: 'Vikhroli', hi: 'विक्रोली' }, km: 4.6, map: { x: 70, y: 36 } },
  { id: 'andheri-e', name: { en: 'Andheri East', hi: 'अंधेरी पूर्व' }, km: 5.5, map: { x: 34, y: 32 } },
  { id: 'dadar', name: { en: 'Dadar', hi: 'दादर' }, km: 6.0, map: { x: 36, y: 72 } },
  { id: 'bandra-w', name: { en: 'Bandra West', hi: 'बांद्रा पश्चिम' }, km: 7.5, map: { x: 24, y: 58 } },
  { id: 'mulund', name: { en: 'Mulund', hi: 'मुलुंड' }, km: 9.2, map: { x: 80, y: 18 } },
];

/** Two one-tap title ideas per trade — fewer words to type on a phone. */
export const IDEAS: Record<TradeId, L[]> = {
  plumber: [
    { en: 'Fix leaking tap and pipe', hi: 'टपकता नल और पाइप ठीक करना' },
    { en: 'Fit new bathroom fittings', hi: 'बाथरूम में नई फ़िटिंग लगाना' },
  ],
  electrician: [
    { en: 'Fix wiring and switches', hi: 'वायरिंग और स्विच ठीक करना' },
    { en: 'Install fan and inverter', hi: 'पंखा और इन्वर्टर लगाना' },
  ],
  carpenter: [
    { en: 'Repair doors and cupboards', hi: 'दरवाज़े और अलमारी की मरम्मत' },
    { en: 'Make a new wardrobe', hi: 'नई अलमारी बनाना' },
  ],
  painter: [
    { en: 'Paint a 1BHK flat', hi: '1BHK फ़्लैट की पुताई' },
    { en: 'Wall touch-up and waterproofing', hi: 'दीवार टच-अप और वॉटरप्रूफ़िंग' },
  ],
  mason: [
    { en: 'Lay new floor tiles', hi: 'फ़र्श पर नई टाइल लगाना' },
    { en: 'Repair wall cracks and plaster', hi: 'दीवार की दरार और प्लास्टर ठीक करना' },
  ],
  cleaner: [
    { en: 'Deep clean a flat', hi: 'फ़्लैट की पूरी सफ़ाई' },
    { en: 'Daily office cleaning', hi: 'रोज़ ऑफ़िस की सफ़ाई' },
  ],
  labour: [
    { en: 'Loading and unloading goods', hi: 'सामान चढ़ाना-उतारना' },
    { en: 'Helper at building site', hi: 'बिल्डिंग साइट पर हेल्पर' },
  ],
  driver: [
    { en: 'Tempo driver for house shifting', hi: 'घर शिफ़्टिंग के लिए टेम्पो ड्राइवर' },
    { en: 'Car driver for the day', hi: 'दिन भर के लिए कार ड्राइवर' },
  ],
  cook: [
    { en: 'Cook for a family function', hi: 'घर के कार्यक्रम के लिए रसोइया' },
    { en: 'Daily lunch and dinner', hi: 'रोज़ दोपहर और रात का खाना' },
  ],
  gardener: [
    { en: 'Terrace garden upkeep', hi: 'छत के बगीचे की देखभाल' },
    { en: 'Society lawn trimming', hi: 'सोसाइटी के लॉन की कटाई' },
  ],
};

export const STEPS: { title: L; short: L }[] = [
  { title: { en: 'What work?', hi: 'कौन सा काम?' }, short: { en: 'Work', hi: 'काम' } },
  { title: { en: 'Where & when?', hi: 'कहाँ और कब?' }, short: { en: 'Place & time', hi: 'जगह और समय' } },
  { title: { en: 'Fair pay', hi: 'सही मज़दूरी' }, short: { en: 'Pay', hi: 'मज़दूरी' } },
  { title: { en: 'Check & publish', hi: 'जाँचें और डालें' }, short: { en: 'Review', hi: 'जाँच' } },
];

/** Restore a saved draft defensively — anything malformed falls back to defaults. */
export function reviveDraft(raw: unknown): Draft | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = { ...DEFAULT_DRAFT, ...(raw as Partial<Draft>) };
  if (!Array.isArray(d.payMode) || !Array.isArray(d.perks)) return null;
  d.step = Math.min(3, Math.max(0, Number(d.step) || 0));
  d.seen = Math.min(3, Math.max(d.step, Number(d.seen) || 0));
  d.amount = Math.max(0, Number(d.amount) || 0);
  d.length = Math.max(1, Number(d.length) || 1);
  d.workersNeeded = Math.max(1, Number(d.workersNeeded) || 1);
  return d;
}
