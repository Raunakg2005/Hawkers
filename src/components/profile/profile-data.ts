import type { L, TradeId } from '@/data/types';
import { TRADE } from '@/data/trades';

/* ==========================================================================
   Skill Card — data, types and helpers (client-side only, mock)
   ========================================================================== */

/** Tap-to-add skill suggestions per trade. Plain words a worker would use. */
export const SKILL_SUGGESTIONS: Record<TradeId, L[]> = {
  plumber: [
    { en: 'Leak repair', hi: 'लीकेज ठीक करना' },
    { en: 'Pipe fitting (CPVC, PVC)', hi: 'पाइप फ़िटिंग (CPVC, PVC)' },
    { en: 'Tap & mixer change', hi: 'नल और मिक्सर बदलना' },
    { en: 'Water tank & motor', hi: 'पानी की टंकी और मोटर' },
    { en: 'Bathroom fittings', hi: 'बाथरूम फ़िटिंग' },
    { en: 'Drain cleaning', hi: 'नाली की सफ़ाई' },
  ],
  electrician: [
    { en: 'House wiring', hi: 'घर की वायरिंग' },
    { en: 'Fan & light fitting', hi: 'पंखा और लाइट लगाना' },
    { en: 'MCB & switchboard', hi: 'MCB और स्विचबोर्ड' },
    { en: 'Inverter & battery', hi: 'इन्वर्टर और बैटरी' },
    { en: 'AC & geyser points', hi: 'AC और गीज़र पॉइंट' },
    { en: 'Finding faults', hi: 'ख़राबी ढूँढना' },
  ],
  carpenter: [
    { en: 'Door & window repair', hi: 'दरवाज़ा-खिड़की की मरम्मत' },
    { en: 'Modular kitchen', hi: 'मॉड्यूलर किचन' },
    { en: 'Wardrobe & bed', hi: 'अलमारी और पलंग' },
    { en: 'Lock & hinge fitting', hi: 'ताला और कब्ज़ा लगाना' },
    { en: 'Furniture polish', hi: 'फ़र्नीचर पॉलिश' },
  ],
  painter: [
    { en: 'Wall putty', hi: 'वॉल पुट्टी' },
    { en: 'Emulsion painting', hi: 'इमल्शन पेंट' },
    { en: 'Texture design', hi: 'टेक्सचर डिज़ाइन' },
    { en: 'Waterproofing', hi: 'वॉटरप्रूफ़िंग' },
    { en: 'Wood & metal polish', hi: 'लकड़ी और लोहे की पॉलिश' },
    { en: 'Outside building walls', hi: 'बिल्डिंग की बाहरी दीवारें' },
  ],
  mason: [
    { en: 'Brick wall', hi: 'ईंट की दीवार' },
    { en: 'Plaster', hi: 'प्लास्टर' },
    { en: 'Floor tiles', hi: 'फ़र्श की टाइल' },
    { en: 'Bathroom wall tiles', hi: 'बाथरूम की दीवार टाइल' },
    { en: 'Slab & RCC work', hi: 'स्लैब और RCC का काम' },
  ],
  cleaner: [
    { en: 'Deep home cleaning', hi: 'घर की पूरी सफ़ाई' },
    { en: 'Kitchen & bathroom', hi: 'किचन और बाथरूम' },
    { en: 'Office cleaning', hi: 'ऑफ़िस की सफ़ाई' },
    { en: 'Sofa & carpet', hi: 'सोफ़ा और कालीन' },
    { en: 'Cleaning after construction', hi: 'निर्माण के बाद की सफ़ाई' },
  ],
  labour: [
    { en: 'Loading & unloading', hi: 'लोडिंग-अनलोडिंग' },
    { en: 'Carrying cement & bricks', hi: 'सीमेंट और ईंट ढोना' },
    { en: 'Digging', hi: 'खुदाई' },
    { en: 'House shifting & packing', hi: 'सामान शिफ़्टिंग और पैकिंग' },
    { en: 'Site cleaning', hi: 'साइट की सफ़ाई' },
  ],
  driver: [
    { en: 'Tempo / mini truck', hi: 'टेम्पो / छोटा ट्रक' },
    { en: 'Car driving', hi: 'कार चलाना' },
    { en: 'Heavy vehicle licence', hi: 'भारी वाहन लाइसेंस' },
    { en: 'Knows Mumbai roads', hi: 'मुंबई के रास्ते पता हैं' },
    { en: 'Helps with loading', hi: 'सामान चढ़ाने में मदद' },
  ],
  cook: [
    { en: 'North Indian food', hi: 'उत्तर भारतीय खाना' },
    { en: 'Maharashtrian food', hi: 'महाराष्ट्रीयन खाना' },
    { en: 'Big events (100+ people)', hi: 'बड़े कार्यक्रम (100+ लोग)' },
    { en: 'Tiffin & home food', hi: 'टिफ़िन और घर का खाना' },
    { en: 'Sweets & snacks', hi: 'मिठाई और नाश्ता' },
  ],
  gardener: [
    { en: 'Plant care', hi: 'पौधों की देखभाल' },
    { en: 'Lawn cutting', hi: 'घास काटना' },
    { en: 'Terrace garden', hi: 'छत का बगीचा' },
    { en: 'Pots & soil', hi: 'गमले और मिट्टी' },
    { en: 'Tree trimming', hi: 'पेड़ की छँटाई' },
  ],
};

/** Mumbai nakas / areas. */
export const AREAS: { id: string; l: L }[] = [
  { id: 'kurla', l: { en: 'Kurla West naka', hi: 'कुर्ला पश्चिम नाका' } },
  { id: 'ghatkopar', l: { en: 'Ghatkopar', hi: 'घाटकोपर' } },
  { id: 'chembur', l: { en: 'Chembur', hi: 'चेंबूर' } },
  { id: 'sion', l: { en: 'Sion', hi: 'सायन' } },
  { id: 'dharavi', l: { en: 'Dharavi', hi: 'धारावी' } },
  { id: 'dadar', l: { en: 'Dadar', hi: 'दादर' } },
  { id: 'bandra', l: { en: 'Bandra', hi: 'बांद्रा' } },
  { id: 'santacruz', l: { en: 'Santacruz', hi: 'सांताक्रूज़' } },
  { id: 'andheri', l: { en: 'Andheri East', hi: 'अंधेरी पूर्व' } },
  { id: 'goregaon', l: { en: 'Goregaon', hi: 'गोरेगांव' } },
  { id: 'malad', l: { en: 'Malad', hi: 'मालाड' } },
  { id: 'borivali', l: { en: 'Borivali', hi: 'बोरीवली' } },
  { id: 'powai', l: { en: 'Powai', hi: 'पवई' } },
  { id: 'vikhroli', l: { en: 'Vikhroli', hi: 'विक्रोली' } },
  { id: 'bhandup', l: { en: 'Bhandup', hi: 'भांडुप' } },
  { id: 'mulund', l: { en: 'Mulund', hi: 'मुलुंड' } },
  { id: 'govandi', l: { en: 'Govandi', hi: 'गोवंडी' } },
  { id: 'thane', l: { en: 'Thane', hi: 'ठाणे' } },
  { id: 'vashi', l: { en: 'Vashi, Navi Mumbai', hi: 'वाशी, नवी मुंबई' } },
];

export const areaLabel = (id: string): L | null => AREAS.find((a) => a.id === id)?.l ?? null;

export const LANGUAGES: { id: string; l: L }[] = [
  { id: 'hindi', l: { en: 'Hindi', hi: 'हिंदी' } },
  { id: 'marathi', l: { en: 'Marathi', hi: 'मराठी' } },
  { id: 'english', l: { en: 'English', hi: 'अंग्रेज़ी' } },
  { id: 'bhojpuri', l: { en: 'Bhojpuri', hi: 'भोजपुरी' } },
  { id: 'gujarati', l: { en: 'Gujarati', hi: 'गुजराती' } },
  { id: 'urdu', l: { en: 'Urdu', hi: 'उर्दू' } },
  { id: 'bengali', l: { en: 'Bengali', hi: 'बंगाली' } },
  { id: 'tamil', l: { en: 'Tamil', hi: 'तमिल' } },
  { id: 'telugu', l: { en: 'Telugu', hi: 'तेलुगु' } },
  { id: 'kannada', l: { en: 'Kannada', hi: 'कन्नड़' } },
  { id: 'odia', l: { en: 'Odia', hi: 'ओड़िया' } },
];

export const langLabel = (id: string): L => LANGUAGES.find((x) => x.id === id)?.l ?? { en: id, hi: id };

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS: { id: DayId; short: L; tiny: L }[] = [
  { id: 'mon', short: { en: 'Mon', hi: 'सोम' }, tiny: { en: 'M', hi: 'सो' } },
  { id: 'tue', short: { en: 'Tue', hi: 'मंगल' }, tiny: { en: 'T', hi: 'मं' } },
  { id: 'wed', short: { en: 'Wed', hi: 'बुध' }, tiny: { en: 'W', hi: 'बु' } },
  { id: 'thu', short: { en: 'Thu', hi: 'गुरु' }, tiny: { en: 'T', hi: 'गु' } },
  { id: 'fri', short: { en: 'Fri', hi: 'शुक्र' }, tiny: { en: 'F', hi: 'शु' } },
  { id: 'sat', short: { en: 'Sat', hi: 'शनि' }, tiny: { en: 'S', hi: 'श' } },
  { id: 'sun', short: { en: 'Sun', hi: 'रवि' }, tiny: { en: 'S', hi: 'र' } },
];

export const YEAR_CHIPS = [1, 3, 5, 10, 20];
export const MAX_YEARS = 40;
export const PHOTO_SLOTS = 3;

/** Experience level — a friendly word instead of a bare number. */
export function yearsLevel(y: number): L {
  if (y < 1) return { en: 'Just starting', hi: 'अभी शुरुआत' };
  if (y < 3) return { en: 'Learner', hi: 'सीख रहे हैं' };
  if (y < 6) return { en: 'Skilled', hi: 'कुशल' };
  if (y < 10) return { en: 'Experienced', hi: 'अनुभवी' };
  return { en: 'Master craftsman', hi: 'उस्ताद कारीगर' };
}

/* ── The profile ──────────────────────────────────────────────────────────── */

export interface SkillProfile {
  v: 1;
  /** true once the worker pressed "Make my card" */
  complete: boolean;
  /** last wizard step reached, so an interrupted user can continue */
  step: number;
  name: string;
  trade: TradeId | null;
  otherTrades: TradeId[];
  years: number;
  skills: L[];
  area: string;
  /** free text: exact naka spot / landmark */
  spot: string;
  days: DayId[];
  availableToday: boolean;
  rate: number;
  languages: string[];
  voice: { secs: number; simulated: boolean } | null;
  photos: number;
  eshram: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PROFILE_KEY = 'naka-profile';
export const VOICE_KEY = 'naka-profile-voice';

export function emptyProfile(): SkillProfile {
  return {
    v: 1,
    complete: false,
    step: 0,
    name: '',
    trade: null,
    otherTrades: [],
    years: 3,
    skills: [],
    area: 'kurla',
    spot: '',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    availableToday: true,
    rate: 0,
    languages: ['hindi'],
    voice: null,
    photos: 0,
    eshram: false,
    createdAt: '',
    updatedAt: '',
  };
}

export function loadProfile(): SkillProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SkillProfile>;
    if (!parsed || typeof parsed !== 'object') return null;
    const base = emptyProfile();
    const p = { ...base, ...parsed } as SkillProfile;
    if (p.trade && !TRADE[p.trade]) p.trade = null;
    p.otherTrades = (p.otherTrades ?? []).filter((t) => TRADE[t]);
    p.skills = Array.isArray(p.skills) ? p.skills.filter((s) => s && typeof s.en === 'string') : [];
    p.days = Array.isArray(p.days) ? p.days : base.days;
    p.languages = Array.isArray(p.languages) ? p.languages : base.languages;
    p.years = clamp(Number(p.years) || 0, 0, MAX_YEARS);
    p.photos = clamp(Number(p.photos) || 0, 0, PHOTO_SLOTS);
    return p;
  } catch {
    return null;
  }
}

export function saveProfile(p: SkillProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked — the card still works for this visit */
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(VOICE_KEY);
  } catch {
    /* ignore */
  }
}

/* ── Money helpers ───────────────────────────────────────────────────────── */

export const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

export const fairMid = (trade: TradeId) => {
  const [lo, hi] = TRADE[trade].fair;
  return Math.round((lo + hi) / 2 / 50) * 50;
};

/** Slider limits for the rate: a bit under and over the fair band. */
export const rateRange = (trade: TradeId): [number, number] => {
  const [lo, hi] = TRADE[trade].fair;
  return [Math.floor((lo * 0.55) / 50) * 50, Math.ceil((hi * 1.5) / 50) * 50];
};

export type RateBand = 'below' | 'fair' | 'above';

export const rateBand = (trade: TradeId, rate: number): RateBand => {
  const [lo, hi] = TRADE[trade].fair;
  return rate < lo ? 'below' : rate > hi ? 'above' : 'fair';
};

/* ── Hashing (avatar hue, card number, demo QR) ──────────────────────────── */

export function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const profileHue = (p: SkillProfile) => (p.name.trim() ? hashStr(p.name.trim().toLowerCase()) % 360 : 32);

export const cardNumber = (p: SkillProfile) => {
  const n = hashStr(`${p.name.trim().toLowerCase()}|${p.createdAt}`).toString(36).toUpperCase().padStart(7, '0');
  return `NK-${n.slice(0, 3)}-${n.slice(3, 7)}`;
};

/**
 * A decorative, deterministic QR-like matrix (not a scannable code): three
 * finder squares, timing lines, one alignment square, and modules hashed from
 * the profile so every card looks unique and changes as you type.
 */
export function qrMatrix(seed: string, size = 25): boolean[][] {
  const rnd = mulberry32(hashStr(seed));
  const m: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const fixed: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));

  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        fixed[rr][cc] = true;
        const ring = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr][cc] = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (ring || core);
      }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    fixed[6][i] = fixed[i][6] = true;
    m[6][i] = m[i][6] = i % 2 === 0;
  }

  const a = size - 7;
  for (let r = -2; r <= 2; r++)
    for (let c = -2; c <= 2; c++) {
      fixed[a + r][a + c] = true;
      m[a + r][a + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
    }

  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!fixed[r][c]) m[r][c] = rnd() > 0.52;
  return m;
}

/** Completion 0–100, for the progress ring and the "card strength" hint. */
export function completion(p: SkillProfile) {
  const checks = [
    !!p.trade,
    p.years > 0,
    p.skills.length > 0,
    !!p.area,
    p.days.length > 0,
    p.rate > 0,
    p.name.trim().length > 1,
    p.languages.length > 0,
    !!p.voice,
    p.photos > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

/** What the card says out loud (Listen button). */
export function cardSpeech(p: SkillProfile) {
  const name = p.name.trim() || 'A worker';
  const nameHi = p.name.trim() || 'एक कारीगर';
  const t = p.trade ? TRADE[p.trade] : null;
  const area = areaLabel(p.area);
  const langs = p.languages.map(langLabel);
  const skillsEn = p.skills.map((s) => s.en).join(', ');
  const skillsHi = p.skills.map((s) => s.hi).join(', ');
  return {
    en: `${name}. ${t ? t.name.en : ''}, ${p.years} years of experience. ${p.rate ? `${p.rate} rupees per day.` : ''} ${area ? `Found at ${area.en}.` : ''} ${skillsEn ? `Skills: ${skillsEn}.` : ''} Speaks ${langs.map((l) => l.en).join(', ')}. ${p.availableToday ? 'Available today.' : ''}`,
    hi: `${nameHi}। ${t ? t.name.hi : ''}, ${p.years} साल का अनुभव। ${p.rate ? `${p.rate} रुपये रोज़।` : ''} ${area ? `${area.hi} पर मिलते हैं।` : ''} ${skillsHi ? `हुनर: ${skillsHi}।` : ''} भाषा: ${langs.map((l) => l.hi).join(', ')}। ${p.availableToday ? 'आज काम के लिए खाली हैं।' : ''}`,
  };
}

/** Text used for Share / WhatsApp / clipboard. */
export function shareText(p: SkillProfile, lang: 'en' | 'hi') {
  const t = p.trade ? TRADE[p.trade] : null;
  const area = areaLabel(p.area);
  if (lang === 'hi') {
    return [
      `🪪 नाका स्किल कार्ड — ${p.name.trim() || 'कारीगर'}`,
      t ? `काम: ${t.name.hi} · ${p.years} साल का अनुभव` : '',
      p.rate ? `मज़दूरी: ₹${p.rate.toLocaleString('en-IN')} / दिन` : '',
      area ? `जगह: ${area.hi}${p.spot ? ` (${p.spot})` : ''}` : '',
      p.skills.length ? `हुनर: ${p.skills.map((s) => s.hi).join(', ')}` : '',
      `भाषा: ${p.languages.map((l) => langLabel(l).hi).join(', ')}`,
      p.availableToday ? '✅ आज खाली हैं' : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
  return [
    `🪪 Naka Skill Card — ${p.name.trim() || 'Worker'}`,
    t ? `Work: ${t.name.en} · ${p.years} years experience` : '',
    p.rate ? `Rate: ₹${p.rate.toLocaleString('en-IN')} / day` : '',
    area ? `Area: ${area.en}${p.spot ? ` (${p.spot})` : ''}` : '',
    p.skills.length ? `Skills: ${p.skills.map((s) => s.en).join(', ')}` : '',
    `Languages: ${p.languages.map((l) => langLabel(l).en).join(', ')}`,
    p.availableToday ? '✅ Available today' : '',
  ]
    .filter(Boolean)
    .join('\n');
}
