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
  household: { en: 'Household', hi: 'घर', mr: 'घर', gu: 'ઘર' },
  shop: { en: 'Shop / office', hi: 'दुकान / ऑफ़िस', mr: 'दुकान / ऑफिस', gu: 'દુકાન / ઑફિસ' },
  contractor: { en: 'Contractor', hi: 'ठेकेदार', mr: 'ठेकेदार', gu: 'કોન્ટ્રાક્ટર' },
  society: { en: 'Housing society', hi: 'हाउसिंग सोसाइटी', mr: 'हाउसिंग सोसायटी', gu: 'હાઉસિંગ સોસાયટી' },
};

/** Areas around the Kurla naka, with distance from it (km). */
export const AREAS: { id: string; name: L; km: number; map: { x: number; y: number } }[] = [
  { id: 'kurla-w', name: { en: 'Kurla West', hi: 'कुर्ला पश्चिम', mr: 'कुर्ला पश्चिम', gu: 'કુર્લા પશ્ચિમ' }, km: 0.5, map: { x: 48, y: 50 } },
  { id: 'kurla-e', name: { en: 'Kurla East', hi: 'कुर्ला पूर्व', mr: 'कुर्ला पूर्व', gu: 'કુર્લા પૂર્વ' }, km: 1.2, map: { x: 54, y: 52 } },
  { id: 'saki-naka', name: { en: 'Saki Naka', hi: 'साकी नाका', mr: 'साकी नाका', gu: 'સાકી નાકા' }, km: 2.0, map: { x: 44, y: 40 } },
  { id: 'ghatkopar', name: { en: 'Ghatkopar', hi: 'घाटकोपर', mr: 'घाटकोपर', gu: 'ઘાટકોપર' }, km: 3.0, map: { x: 60, y: 42 } },
  { id: 'chembur', name: { en: 'Chembur', hi: 'चेंबूर', mr: 'चेंबूर', gu: 'ચેમ્બુર' }, km: 3.4, map: { x: 62, y: 62 } },
  { id: 'powai', name: { en: 'Powai', hi: 'पवई', mr: 'पवई', gu: 'પવઈ' }, km: 4.2, map: { x: 66, y: 28 } },
  { id: 'santacruz', name: { en: 'Santacruz East', hi: 'सांताक्रूज़ पूर्व', mr: 'सांताक्रूझ पूर्व', gu: 'સાંતાક્રુઝ પૂર્વ' }, km: 4.5, map: { x: 32, y: 50 } },
  { id: 'vikhroli', name: { en: 'Vikhroli', hi: 'विक्रोली', mr: 'विक्रोळी', gu: 'વિક્રોલી' }, km: 4.6, map: { x: 70, y: 36 } },
  { id: 'andheri-e', name: { en: 'Andheri East', hi: 'अंधेरी पूर्व', mr: 'अंधेरी पूर्व', gu: 'અંધેરી પૂર્વ' }, km: 5.5, map: { x: 34, y: 32 } },
  { id: 'dadar', name: { en: 'Dadar', hi: 'दादर', mr: 'दादर', gu: 'દાદર' }, km: 6.0, map: { x: 36, y: 72 } },
  { id: 'bandra-w', name: { en: 'Bandra West', hi: 'बांद्रा पश्चिम', mr: 'वांद्रे पश्चिम', gu: 'બાંદ્રા પશ્ચિમ' }, km: 7.5, map: { x: 24, y: 58 } },
  { id: 'mulund', name: { en: 'Mulund', hi: 'मुलुंड', mr: 'मुलुंड', gu: 'મુલુંડ' }, km: 9.2, map: { x: 80, y: 18 } },
];

/** Two one-tap title ideas per trade — fewer words to type on a phone. */
export const IDEAS: Record<TradeId, L[]> = {
  plumber: [
    { en: 'Fix leaking tap and pipe', hi: 'टपकता नल और पाइप ठीक करना', mr: 'गळणारा नळ आणि पाईप दुरुस्त करणे', gu: 'ટપકતો નળ અને પાઇપ રિપેર કરવા' },
    { en: 'Fit new bathroom fittings', hi: 'बाथरूम में नई फ़िटिंग लगाना', mr: 'बाथरूममध्ये नवीन फिटिंग बसवणे', gu: 'બાથરૂમમાં નવી ફિટિંગ લગાવવી' },
  ],
  electrician: [
    { en: 'Fix wiring and switches', hi: 'वायरिंग और स्विच ठीक करना', mr: 'वायरिंग आणि स्विच दुरुस्त करणे', gu: 'વાયરિંગ અને સ્વિચ રિપેર કરવા' },
    { en: 'Install fan and inverter', hi: 'पंखा और इन्वर्टर लगाना', mr: 'पंखा आणि इन्व्हर्टर बसवणे', gu: 'પંખો અને ઇન્વર્ટર લગાવવા' },
  ],
  carpenter: [
    { en: 'Repair doors and cupboards', hi: 'दरवाज़े और अलमारी की मरम्मत', mr: 'दरवाजे आणि कपाटाची दुरुस्ती', gu: 'દરવાજા અને કબાટનું રિપેરિંગ' },
    { en: 'Make a new wardrobe', hi: 'नई अलमारी बनाना', mr: 'नवीन कपाट बनवणे', gu: 'નવો કબાટ બનાવવો' },
  ],
  painter: [
    { en: 'Paint a 1BHK flat', hi: '1BHK फ़्लैट की पुताई', mr: '1BHK फ्लॅटचे रंगकाम', gu: '1BHK ફ્લેટનું રંગકામ' },
    { en: 'Wall touch-up and waterproofing', hi: 'दीवार टच-अप और वॉटरप्रूफ़िंग', mr: 'भिंतीचे टच-अप आणि वॉटरप्रूफिंग', gu: 'દીવાલ ટચ-અપ અને વોટરપ્રૂફિંગ' },
  ],
  mason: [
    { en: 'Lay new floor tiles', hi: 'फ़र्श पर नई टाइल लगाना', mr: 'जमिनीवर नवीन टाइल्स बसवणे', gu: 'ફર્શ પર નવી ટાઇલ્સ લગાવવી' },
    { en: 'Repair wall cracks and plaster', hi: 'दीवार की दरार और प्लास्टर ठीक करना', mr: 'भिंतीच्या भेगा आणि प्लास्टर दुरुस्त करणे', gu: 'દીવાલની તિરાડો અને પ્લાસ્ટર રિપેર કરવા' },
  ],
  cleaner: [
    { en: 'Deep clean a flat', hi: 'फ़्लैट की पूरी सफ़ाई', mr: 'फ्लॅटची पूर्ण साफसफाई', gu: 'ફ્લેટની પૂરી સાફસફાઈ' },
    { en: 'Daily office cleaning', hi: 'रोज़ ऑफ़िस की सफ़ाई', mr: 'रोज ऑफिसची साफसफाई', gu: 'રોજ ઑફિસની સાફસફાઈ' },
  ],
  labour: [
    { en: 'Loading and unloading goods', hi: 'सामान चढ़ाना-उतारना', mr: 'माल चढवणे-उतरवणे', gu: 'માલ ચડાવવો-ઉતારવો' },
    { en: 'Helper at building site', hi: 'बिल्डिंग साइट पर हेल्पर', mr: 'बिल्डिंग साइटवर हेल्पर', gu: 'બિલ્ડિંગ સાઇટ પર હેલ્પર' },
  ],
  driver: [
    { en: 'Tempo driver for house shifting', hi: 'घर शिफ़्टिंग के लिए टेम्पो ड्राइवर', mr: 'घर शिफ्टिंगसाठी टेम्पो ड्रायव्हर', gu: 'ઘર શિફ્ટિંગ માટે ટેમ્પો ડ્રાઇવર' },
    { en: 'Car driver for the day', hi: 'दिन भर के लिए कार ड्राइवर', mr: 'दिवसभरासाठी कार ड्रायव्हर', gu: 'આખા દિવસ માટે કાર ડ્રાઇવર' },
  ],
  cook: [
    { en: 'Cook for a family function', hi: 'घर के कार्यक्रम के लिए रसोइया', mr: 'घरच्या कार्यक्रमासाठी स्वयंपाकी', gu: 'ઘરના પ્રસંગ માટે રસોઇયો' },
    { en: 'Daily lunch and dinner', hi: 'रोज़ दोपहर और रात का खाना', mr: 'रोज दुपारचे आणि रात्रीचे जेवण', gu: 'રોજ બપોરનું અને રાતનું જમવાનું' },
  ],
  gardener: [
    { en: 'Terrace garden upkeep', hi: 'छत के बगीचे की देखभाल', mr: 'गच्चीवरच्या बागेची देखभाल', gu: 'અગાશીના બગીચાની દેખભાળ' },
    { en: 'Society lawn trimming', hi: 'सोसाइटी के लॉन की कटाई', mr: 'सोसायटीच्या लॉनची कापणी', gu: 'સોસાયટીના લૉનની કાપણી' },
  ],
};

export const STEPS: { title: L; short: L }[] = [
  { title: { en: 'What work?', hi: 'कौन सा काम?', mr: 'कोणते काम?', gu: 'કયું કામ?' }, short: { en: 'Work', hi: 'काम', mr: 'काम', gu: 'કામ' } },
  { title: { en: 'Where & when?', hi: 'कहाँ और कब?', mr: 'कुठे आणि कधी?', gu: 'ક્યાં અને ક્યારે?' }, short: { en: 'Place & time', hi: 'जगह और समय', mr: 'जागा आणि वेळ', gu: 'જગ્યા અને સમય' } },
  { title: { en: 'Fair pay', hi: 'सही मज़दूरी', mr: 'योग्य मजुरी', gu: 'યોગ્ય મજૂરી' }, short: { en: 'Pay', hi: 'मज़दूरी', mr: 'मजुरी', gu: 'મજૂરી' } },
  { title: { en: 'Check & publish', hi: 'जाँचें और डालें', mr: 'तपासा आणि प्रकाशित करा', gu: 'તપાસો અને પ્રકાશિત કરો' }, short: { en: 'Review', hi: 'जाँच', mr: 'तपासणी', gu: 'તપાસ' } },
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
