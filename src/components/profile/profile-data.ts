import type { L, Lang, TradeId } from '@/data/types';
import { TRADE } from '@/data/trades';

/* ==========================================================================
   Skill Card — data, types and helpers (client-side only, mock)
   ========================================================================== */

/** Tap-to-add skill suggestions per trade. Plain words a worker would use. */
export const SKILL_SUGGESTIONS: Record<TradeId, L[]> = {
  plumber: [
    { en: 'Leak repair', hi: 'लीकेज ठीक करना', mr: 'गळती दुरुस्त करणे', gu: 'લીકેજ ઠીક કરવું' },
    { en: 'Pipe fitting (CPVC, PVC)', hi: 'पाइप फ़िटिंग (CPVC, PVC)', mr: 'पाईप फिटिंग (CPVC, PVC)', gu: 'પાઇપ ફિટિંગ (CPVC, PVC)' },
    { en: 'Tap & mixer change', hi: 'नल और मिक्सर बदलना', mr: 'नळ आणि मिक्सर बदलणे', gu: 'નળ અને મિક્સર બદલવા' },
    { en: 'Water tank & motor', hi: 'पानी की टंकी और मोटर', mr: 'पाण्याची टाकी आणि मोटर', gu: 'પાણીની ટાંકી અને મોટર' },
    { en: 'Bathroom fittings', hi: 'बाथरूम फ़िटिंग', mr: 'बाथरूम फिटिंग', gu: 'બાથરૂમ ફિટિંગ' },
    { en: 'Drain cleaning', hi: 'नाली की सफ़ाई', mr: 'गटार साफ करणे', gu: 'ગટર સાફ કરવી' },
  ],
  electrician: [
    { en: 'House wiring', hi: 'घर की वायरिंग', mr: 'घराची वायरिंग', gu: 'ઘરનું વાયરિંગ' },
    { en: 'Fan & light fitting', hi: 'पंखा और लाइट लगाना', mr: 'पंखा आणि लाईट बसवणे', gu: 'પંખો અને લાઇટ લગાવવા' },
    { en: 'MCB & switchboard', hi: 'MCB और स्विचबोर्ड', mr: 'MCB आणि स्विचबोर्ड', gu: 'MCB અને સ્વિચબોર્ડ' },
    { en: 'Inverter & battery', hi: 'इन्वर्टर और बैटरी', mr: 'इन्व्हर्टर आणि बॅटरी', gu: 'ઇન્વર્ટર અને બેટરી' },
    { en: 'AC & geyser points', hi: 'AC और गीज़र पॉइंट', mr: 'AC आणि गीझर पॉइंट', gu: 'AC અને ગીઝર પોઇન્ટ' },
    { en: 'Finding faults', hi: 'ख़राबी ढूँढना', mr: 'बिघाड शोधणे', gu: 'ખામી શોધવી' },
  ],
  carpenter: [
    { en: 'Door & window repair', hi: 'दरवाज़ा-खिड़की की मरम्मत', mr: 'दार-खिडकी दुरुस्ती', gu: 'દરવાજા-બારીનું સમારકામ' },
    { en: 'Modular kitchen', hi: 'मॉड्यूलर किचन', mr: 'मॉड्युलर किचन', gu: 'મોડ્યુલર કિચન' },
    { en: 'Wardrobe & bed', hi: 'अलमारी और पलंग', mr: 'कपाट आणि पलंग', gu: 'કબાટ અને પલંગ' },
    { en: 'Lock & hinge fitting', hi: 'ताला और कब्ज़ा लगाना', mr: 'कुलूप आणि बिजागरी बसवणे', gu: 'તાળું અને મિજાગરું લગાવવું' },
    { en: 'Furniture polish', hi: 'फ़र्नीचर पॉलिश', mr: 'फर्निचर पॉलिश', gu: 'ફર્નિચર પોલિશ' },
  ],
  painter: [
    { en: 'Wall putty', hi: 'वॉल पुट्टी', mr: 'वॉल पुट्टी', gu: 'વૉલ પુટ્ટી' },
    { en: 'Emulsion painting', hi: 'इमल्शन पेंट', mr: 'इमल्शन पेंट', gu: 'ઇમલ્શન પેઇન્ટ' },
    { en: 'Texture design', hi: 'टेक्सचर डिज़ाइन', mr: 'टेक्स्चर डिझाइन', gu: 'ટેક્સચર ડિઝાઇન' },
    { en: 'Waterproofing', hi: 'वॉटरप्रूफ़िंग', mr: 'वॉटरप्रूफिंग', gu: 'વૉટરપ્રૂફિંગ' },
    { en: 'Wood & metal polish', hi: 'लकड़ी और लोहे की पॉलिश', mr: 'लाकूड आणि लोखंडाची पॉलिश', gu: 'લાકડા અને લોખંડની પોલિશ' },
    { en: 'Outside building walls', hi: 'बिल्डिंग की बाहरी दीवारें', mr: 'बिल्डिंगच्या बाहेरच्या भिंती', gu: 'બિલ્ડિંગની બહારની દીવાલો' },
  ],
  mason: [
    { en: 'Brick wall', hi: 'ईंट की दीवार', mr: 'विटांची भिंत', gu: 'ઈંટની દીવાલ' },
    { en: 'Plaster', hi: 'प्लास्टर', mr: 'प्लास्टर', gu: 'પ્લાસ્ટર' },
    { en: 'Floor tiles', hi: 'फ़र्श की टाइल', mr: 'जमिनीची फरशी', gu: 'ફ્લોરની ટાઇલ્સ' },
    { en: 'Bathroom wall tiles', hi: 'बाथरूम की दीवार टाइल', mr: 'बाथरूमच्या भिंतीच्या टाइल्स', gu: 'બાથરૂમની દીવાલની ટાઇલ્સ' },
    { en: 'Slab & RCC work', hi: 'स्लैब और RCC का काम', mr: 'स्लॅब आणि RCC चे काम', gu: 'સ્લેબ અને RCCનું કામ' },
  ],
  cleaner: [
    { en: 'Deep home cleaning', hi: 'घर की पूरी सफ़ाई', mr: 'घराची पूर्ण साफसफाई', gu: 'ઘરની પૂરી સફાઈ' },
    { en: 'Kitchen & bathroom', hi: 'किचन और बाथरूम', mr: 'किचन आणि बाथरूम', gu: 'કિચન અને બાથરૂમ' },
    { en: 'Office cleaning', hi: 'ऑफ़िस की सफ़ाई', mr: 'ऑफिसची साफसफाई', gu: 'ઑફિસની સફાઈ' },
    { en: 'Sofa & carpet', hi: 'सोफ़ा और कालीन', mr: 'सोफा आणि गालिचा', gu: 'સોફા અને ગાલીચો' },
    { en: 'Cleaning after construction', hi: 'निर्माण के बाद की सफ़ाई', mr: 'बांधकामानंतरची साफसफाई', gu: 'બાંધકામ પછીની સફાઈ' },
  ],
  labour: [
    { en: 'Loading & unloading', hi: 'लोडिंग-अनलोडिंग', mr: 'लोडिंग-अनलोडिंग', gu: 'લોડિંગ-અનલોડિંગ' },
    { en: 'Carrying cement & bricks', hi: 'सीमेंट और ईंट ढोना', mr: 'सिमेंट आणि विटा उचलणे', gu: 'સિમેન્ટ અને ઈંટો ઊંચકવી' },
    { en: 'Digging', hi: 'खुदाई', mr: 'खोदकाम', gu: 'ખોદકામ' },
    { en: 'House shifting & packing', hi: 'सामान शिफ़्टिंग और पैकिंग', mr: 'सामान शिफ्टिंग आणि पॅकिंग', gu: 'સામાન શિફ્ટિંગ અને પેકિંગ' },
    { en: 'Site cleaning', hi: 'साइट की सफ़ाई', mr: 'साईटची साफसफाई', gu: 'સાઇટની સફાઈ' },
  ],
  driver: [
    { en: 'Tempo / mini truck', hi: 'टेम्पो / छोटा ट्रक', mr: 'टेम्पो / छोटा ट्रक', gu: 'ટેમ્પો / નાનો ટ્રક' },
    { en: 'Car driving', hi: 'कार चलाना', mr: 'कार चालवणे', gu: 'કાર ચલાવવી' },
    { en: 'Heavy vehicle licence', hi: 'भारी वाहन लाइसेंस', mr: 'मोठ्या गाडीचे लायसन्स', gu: 'મોટા વાહનનું લાઇસન્સ' },
    { en: 'Knows Mumbai roads', hi: 'मुंबई के रास्ते पता हैं', mr: 'मुंबईचे रस्ते माहीत आहेत', gu: 'મુંબઈના રસ્તા ખબર છે' },
    { en: 'Helps with loading', hi: 'सामान चढ़ाने में मदद', mr: 'सामान चढवायला मदत', gu: 'સામાન ચડાવવામાં મદદ' },
  ],
  cook: [
    { en: 'North Indian food', hi: 'उत्तर भारतीय खाना', mr: 'उत्तर भारतीय जेवण', gu: 'ઉત્તર ભારતીય જમવાનું' },
    { en: 'Maharashtrian food', hi: 'महाराष्ट्रीयन खाना', mr: 'महाराष्ट्रीय जेवण', gu: 'મહારાષ્ટ્રીયન જમવાનું' },
    { en: 'Big events (100+ people)', hi: 'बड़े कार्यक्रम (100+ लोग)', mr: 'मोठे कार्यक्रम (100+ लोक)', gu: 'મોટા પ્રસંગ (100+ લોકો)' },
    { en: 'Tiffin & home food', hi: 'टिफ़िन और घर का खाना', mr: 'डबा आणि घरचे जेवण', gu: 'ટિફિન અને ઘરનું જમવાનું' },
    { en: 'Sweets & snacks', hi: 'मिठाई और नाश्ता', mr: 'मिठाई आणि नाश्ता', gu: 'મીઠાઈ અને નાસ્તો' },
  ],
  gardener: [
    { en: 'Plant care', hi: 'पौधों की देखभाल', mr: 'झाडांची काळजी', gu: 'છોડની સંભાળ' },
    { en: 'Lawn cutting', hi: 'घास काटना', mr: 'गवत कापणे', gu: 'ઘાસ કાપવું' },
    { en: 'Terrace garden', hi: 'छत का बगीचा', mr: 'गच्चीवरची बाग', gu: 'અગાસી પરનો બગીચો' },
    { en: 'Pots & soil', hi: 'गमले और मिट्टी', mr: 'कुंड्या आणि माती', gu: 'કૂંડા અને માટી' },
    { en: 'Tree trimming', hi: 'पेड़ की छँटाई', mr: 'झाडांची छाटणी', gu: 'ઝાડની છટણી' },
  ],
};

/** Mumbai nakas / areas. */
export const AREAS: { id: string; l: L }[] = [
  { id: 'kurla', l: { en: 'Kurla West naka', hi: 'कुर्ला पश्चिम नाका', mr: 'कुर्ला पश्चिम नाका', gu: 'કુર્લા પશ્ચિમ નાકા' } },
  { id: 'ghatkopar', l: { en: 'Ghatkopar', hi: 'घाटकोपर', mr: 'घाटकोपर', gu: 'ઘાટકોપર' } },
  { id: 'chembur', l: { en: 'Chembur', hi: 'चेंबूर', mr: 'चेंबूर', gu: 'ચેમ્બુર' } },
  { id: 'sion', l: { en: 'Sion', hi: 'सायन', mr: 'सायन', gu: 'સાયન' } },
  { id: 'dharavi', l: { en: 'Dharavi', hi: 'धारावी', mr: 'धारावी', gu: 'ધારાવી' } },
  { id: 'dadar', l: { en: 'Dadar', hi: 'दादर', mr: 'दादर', gu: 'દાદર' } },
  { id: 'bandra', l: { en: 'Bandra', hi: 'बांद्रा', mr: 'वांद्रे', gu: 'બાંદ્રા' } },
  { id: 'santacruz', l: { en: 'Santacruz', hi: 'सांताक्रूज़', mr: 'सांताक्रूझ', gu: 'સાંતાક્રુઝ' } },
  { id: 'andheri', l: { en: 'Andheri East', hi: 'अंधेरी पूर्व', mr: 'अंधेरी पूर्व', gu: 'અંધેરી પૂર્વ' } },
  { id: 'goregaon', l: { en: 'Goregaon', hi: 'गोरेगांव', mr: 'गोरेगाव', gu: 'ગોરેગાંવ' } },
  { id: 'malad', l: { en: 'Malad', hi: 'मालाड', mr: 'मालाड', gu: 'મલાડ' } },
  { id: 'borivali', l: { en: 'Borivali', hi: 'बोरीवली', mr: 'बोरिवली', gu: 'બોરીવલી' } },
  { id: 'powai', l: { en: 'Powai', hi: 'पवई', mr: 'पवई', gu: 'પવઈ' } },
  { id: 'vikhroli', l: { en: 'Vikhroli', hi: 'विक्रोली', mr: 'विक्रोळी', gu: 'વિક્રોલી' } },
  { id: 'bhandup', l: { en: 'Bhandup', hi: 'भांडुप', mr: 'भांडुप', gu: 'ભાંડુપ' } },
  { id: 'mulund', l: { en: 'Mulund', hi: 'मुलुंड', mr: 'मुलुंड', gu: 'મુલુંડ' } },
  { id: 'govandi', l: { en: 'Govandi', hi: 'गोवंडी', mr: 'गोवंडी', gu: 'ગોવંડી' } },
  { id: 'thane', l: { en: 'Thane', hi: 'ठाणे', mr: 'ठाणे', gu: 'થાણે' } },
  { id: 'vashi', l: { en: 'Vashi, Navi Mumbai', hi: 'वाशी, नवी मुंबई', mr: 'वाशी, नवी मुंबई', gu: 'વાશી, નવી મુંબઈ' } },
];

export const areaLabel = (id: string): L | null => AREAS.find((a) => a.id === id)?.l ?? null;

export const LANGUAGES: { id: string; l: L }[] = [
  { id: 'hindi', l: { en: 'Hindi', hi: 'हिंदी', mr: 'हिंदी', gu: 'હિન્દી' } },
  { id: 'marathi', l: { en: 'Marathi', hi: 'मराठी', mr: 'मराठी', gu: 'મરાઠી' } },
  { id: 'english', l: { en: 'English', hi: 'अंग्रेज़ी', mr: 'इंग्रजी', gu: 'અંગ્રેજી' } },
  { id: 'bhojpuri', l: { en: 'Bhojpuri', hi: 'भोजपुरी', mr: 'भोजपुरी', gu: 'ભોજપુરી' } },
  { id: 'gujarati', l: { en: 'Gujarati', hi: 'गुजराती', mr: 'गुजराती', gu: 'ગુજરાતી' } },
  { id: 'urdu', l: { en: 'Urdu', hi: 'उर्दू', mr: 'उर्दू', gu: 'ઉર્દૂ' } },
  { id: 'bengali', l: { en: 'Bengali', hi: 'बंगाली', mr: 'बंगाली', gu: 'બંગાળી' } },
  { id: 'tamil', l: { en: 'Tamil', hi: 'तमिल', mr: 'तमिळ', gu: 'તમિલ' } },
  { id: 'telugu', l: { en: 'Telugu', hi: 'तेलुगु', mr: 'तेलुगू', gu: 'તેલુગુ' } },
  { id: 'kannada', l: { en: 'Kannada', hi: 'कन्नड़', mr: 'कन्नड', gu: 'કન્નડ' } },
  { id: 'odia', l: { en: 'Odia', hi: 'ओड़िया', mr: 'ओडिया', gu: 'ઓડિયા' } },
];

export const langLabel = (id: string): L => LANGUAGES.find((x) => x.id === id)?.l ?? { en: id, hi: id, mr: id, gu: id };

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS: { id: DayId; short: L; tiny: L }[] = [
  { id: 'mon', short: { en: 'Mon', hi: 'सोम', mr: 'सोम', gu: 'સોમ' }, tiny: { en: 'M', hi: 'सो', mr: 'सो', gu: 'સો' } },
  { id: 'tue', short: { en: 'Tue', hi: 'मंगल', mr: 'मंगळ', gu: 'મંગળ' }, tiny: { en: 'T', hi: 'मं', mr: 'मं', gu: 'મં' } },
  { id: 'wed', short: { en: 'Wed', hi: 'बुध', mr: 'बुध', gu: 'બુધ' }, tiny: { en: 'W', hi: 'बु', mr: 'बु', gu: 'બુ' } },
  { id: 'thu', short: { en: 'Thu', hi: 'गुरु', mr: 'गुरु', gu: 'ગુરુ' }, tiny: { en: 'T', hi: 'गु', mr: 'गु', gu: 'ગુ' } },
  { id: 'fri', short: { en: 'Fri', hi: 'शुक्र', mr: 'शुक्र', gu: 'શુક્ર' }, tiny: { en: 'F', hi: 'शु', mr: 'शु', gu: 'શુ' } },
  { id: 'sat', short: { en: 'Sat', hi: 'शनि', mr: 'शनि', gu: 'શનિ' }, tiny: { en: 'S', hi: 'श', mr: 'श', gu: 'શ' } },
  { id: 'sun', short: { en: 'Sun', hi: 'रवि', mr: 'रवि', gu: 'રવિ' }, tiny: { en: 'S', hi: 'र', mr: 'र', gu: 'ર' } },
];

export const YEAR_CHIPS = [1, 3, 5, 10, 20];
export const MAX_YEARS = 40;
export const PHOTO_SLOTS = 3;

/** Experience level — a friendly word instead of a bare number. */
export function yearsLevel(y: number): L {
  if (y < 1) return { en: 'Just starting', hi: 'अभी शुरुआत', mr: 'आत्ताच सुरुवात', gu: 'હમણાં જ શરૂઆત' };
  if (y < 3) return { en: 'Learner', hi: 'सीख रहे हैं', mr: 'शिकत आहेत', gu: 'શીખી રહ્યા છે' };
  if (y < 6) return { en: 'Skilled', hi: 'कुशल', mr: 'कुशल', gu: 'કુશળ' };
  if (y < 10) return { en: 'Experienced', hi: 'अनुभवी', mr: 'अनुभवी', gu: 'અનુભવી' };
  return { en: 'Master craftsman', hi: 'उस्ताद कारीगर', mr: 'उस्ताद कारागीर', gu: 'ઉસ્તાદ કારીગર' };
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
    // Cards saved before Marathi / Gujarati existed: fill in the missing languages.
    p.skills = p.skills.map((s) => withAllLangs(s));
    p.days = Array.isArray(p.days) ? p.days : base.days;
    p.languages = Array.isArray(p.languages) ? p.languages : base.languages;
    p.years = clamp(Number(p.years) || 0, 0, MAX_YEARS);
    p.photos = clamp(Number(p.photos) || 0, 0, PHOTO_SLOTS);
    return p;
  } catch {
    return null;
  }
}

/** A saved skill with every language filled in (known suggestion, else the typed text). */
function withAllLangs(s: Partial<L> & { en: string }): L {
  const known = Object.values(SKILL_SUGGESTIONS)
    .flat()
    .find((x) => x.en.toLowerCase() === s.en.toLowerCase());
  if (known) return known;
  return { en: s.en, hi: s.hi || s.en, mr: s.mr || s.en, gu: s.gu || s.en };
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
export function cardSpeech(p: SkillProfile): L {
  const name = p.name.trim();
  const t = p.trade ? TRADE[p.trade] : null;
  const area = areaLabel(p.area);
  const langs = p.languages.map(langLabel);
  const skills = (l: Lang) => p.skills.map((s) => s[l] || s.en).join(', ');
  const langList = (l: Lang) => langs.map((x) => x[l]).join(', ');
  return {
    en: `${name || 'A worker'}. ${t ? t.name.en : ''}, ${p.years} years of experience. ${p.rate ? `${p.rate} rupees per day.` : ''} ${area ? `Found at ${area.en}.` : ''} ${skills('en') ? `Skills: ${skills('en')}.` : ''} Speaks ${langList('en')}. ${p.availableToday ? 'Available today.' : ''}`,
    hi: `${name || 'एक कारीगर'}। ${t ? t.name.hi : ''}, ${p.years} साल का अनुभव। ${p.rate ? `${p.rate} रुपये रोज़।` : ''} ${area ? `${area.hi} पर मिलते हैं।` : ''} ${skills('hi') ? `हुनर: ${skills('hi')}।` : ''} भाषा: ${langList('hi')}। ${p.availableToday ? 'आज काम के लिए खाली हैं।' : ''}`,
    mr: `${name || 'एक कारागीर'}. ${t ? t.name.mr : ''}, ${p.years} वर्षांचा अनुभव. ${p.rate ? `रोज ${p.rate} रुपये.` : ''} ${area ? `${area.mr} इथे भेटतात.` : ''} ${skills('mr') ? `कौशल्य: ${skills('mr')}.` : ''} भाषा: ${langList('mr')}. ${p.availableToday ? 'आज कामासाठी मोकळे आहेत.' : ''}`,
    gu: `${name || 'એક કારીગર'}. ${t ? t.name.gu : ''}, ${p.years} વર્ષનો અનુભવ. ${p.rate ? `રોજના ${p.rate} રૂપિયા.` : ''} ${area ? `${area.gu} પર મળે છે.` : ''} ${skills('gu') ? `આવડત: ${skills('gu')}.` : ''} ભાષા: ${langList('gu')}. ${p.availableToday ? 'આજે કામ માટે ખાલી છે.' : ''}`,
  };
}

/** Labels for the Share / WhatsApp text, per language. */
const SHARE: Record<Lang, { title: string; worker: string; work: string; exp: (y: number) => string; rate: string; day: string; area: string; skills: string; langs: string; today: string }> = {
  en: { title: 'Naka Skill Card', worker: 'Worker', work: 'Work', exp: (y) => `${y} years experience`, rate: 'Rate', day: 'day', area: 'Area', skills: 'Skills', langs: 'Languages', today: 'Available today' },
  hi: { title: 'नाका स्किल कार्ड', worker: 'कारीगर', work: 'काम', exp: (y) => `${y} साल का अनुभव`, rate: 'मज़दूरी', day: 'दिन', area: 'जगह', skills: 'हुनर', langs: 'भाषा', today: 'आज खाली हैं' },
  mr: { title: 'नाका स्किल कार्ड', worker: 'कारागीर', work: 'काम', exp: (y) => `${y} वर्षांचा अनुभव`, rate: 'मजुरी', day: 'दिवस', area: 'ठिकाण', skills: 'कौशल्य', langs: 'भाषा', today: 'आज मोकळे आहेत' },
  gu: { title: 'નાકા સ્કિલ કાર્ડ', worker: 'કારીગર', work: 'કામ', exp: (y) => `${y} વર્ષનો અનુભવ`, rate: 'મજૂરી', day: 'દિવસ', area: 'જગ્યા', skills: 'આવડત', langs: 'ભાષા', today: 'આજે ખાલી છે' },
};

/** Text used for Share / WhatsApp / clipboard. */
export function shareText(p: SkillProfile, lang: Lang) {
  const t = p.trade ? TRADE[p.trade] : null;
  const area = areaLabel(p.area);
  const w = SHARE[lang];
  return [
    `🪪 ${w.title} — ${p.name.trim() || w.worker}`,
    t ? `${w.work}: ${t.name[lang]} · ${w.exp(p.years)}` : '',
    p.rate ? `${w.rate}: ₹${p.rate.toLocaleString('en-IN')} / ${w.day}` : '',
    area ? `${w.area}: ${area[lang]}${p.spot ? ` (${p.spot})` : ''}` : '',
    p.skills.length ? `${w.skills}: ${p.skills.map((s) => s[lang] || s.en).join(', ')}` : '',
    `${w.langs}: ${p.languages.map((l) => langLabel(l)[lang]).join(', ')}`,
    p.availableToday ? `✅ ${w.today}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
