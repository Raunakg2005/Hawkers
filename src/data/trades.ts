import type { Duration, L, PaidWhen, PayMode, PayUnit, Perk, RiskFlag, TradeId } from './types';

export interface Trade {
  id: TradeId;
  name: L;
  /** plural / "what you'll do" phrasing used in headings */
  verb: L;
  /** indicative fair day-rate band (₹) for a Mumbai-like metro — mock guidance, not an official rate */
  fair: [number, number];
}

export const TRADES: Trade[] = [
  { id: 'plumber', name: { en: 'Plumber', hi: 'प्लंबर' }, verb: { en: 'Pipes & taps', hi: 'पाइप और नल' }, fair: [800, 1200] },
  { id: 'electrician', name: { en: 'Electrician', hi: 'बिजली मिस्त्री' }, verb: { en: 'Wiring & repairs', hi: 'वायरिंग और मरम्मत' }, fair: [850, 1300] },
  { id: 'carpenter', name: { en: 'Carpenter', hi: 'बढ़ई' }, verb: { en: 'Wood & furniture', hi: 'लकड़ी और फ़र्नीचर' }, fair: [850, 1300] },
  { id: 'painter', name: { en: 'Painter', hi: 'पेंटर' }, verb: { en: 'Walls & polish', hi: 'दीवार और पॉलिश' }, fair: [750, 1100] },
  { id: 'mason', name: { en: 'Mason', hi: 'राजमिस्त्री' }, verb: { en: 'Brick & tiles', hi: 'ईंट और टाइल' }, fair: [850, 1250] },
  { id: 'cleaner', name: { en: 'Cleaner', hi: 'सफ़ाई कर्मी' }, verb: { en: 'Homes & offices', hi: 'घर और ऑफ़िस' }, fair: [600, 850] },
  { id: 'labour', name: { en: 'Helper / Labour', hi: 'हेल्पर / मज़दूर' }, verb: { en: 'Loading & site work', hi: 'लोडिंग और साइट काम' }, fair: [650, 900] },
  { id: 'driver', name: { en: 'Driver', hi: 'ड्राइवर' }, verb: { en: 'Tempo & car', hi: 'टेम्पो और कार' }, fair: [800, 1200] },
  { id: 'cook', name: { en: 'Cook', hi: 'रसोइया' }, verb: { en: 'Homes & events', hi: 'घर और कार्यक्रम' }, fair: [700, 1100] },
  { id: 'gardener', name: { en: 'Gardener', hi: 'माली' }, verb: { en: 'Plants & lawns', hi: 'पौधे और लॉन' }, fair: [600, 900] },
];

export const TRADE = Object.fromEntries(TRADES.map((t) => [t.id, t])) as Record<TradeId, Trade>;

export const DURATIONS: Record<Duration, { name: L; hint: L }> = {
  daily: { name: { en: 'Today / 1 day', hi: 'आज / 1 दिन' }, hint: { en: 'Daily wage', hi: 'दिहाड़ी' } },
  short: { name: { en: 'Few days', hi: 'कुछ दिन' }, hint: { en: 'Short-term', hi: 'थोड़े समय का' } },
  long: { name: { en: 'Months', hi: 'महीनों का' }, hint: { en: 'Long-term', hi: 'लंबे समय का' } },
};

export const PAY_UNIT: Record<PayUnit, L> = {
  day: { en: '/ day', hi: '/ दिन' },
  job: { en: 'full job', hi: 'पूरा काम' },
  month: { en: '/ month', hi: '/ महीना' },
  hour: { en: '/ hour', hi: '/ घंटा' },
};

export const PAID_WHEN: Record<PaidWhen, L> = {
  'same-day': { en: 'Paid same evening', hi: 'उसी शाम भुगतान' },
  weekly: { en: 'Paid every Saturday', hi: 'हर शनिवार भुगतान' },
  'on-completion': { en: 'Paid when work is done', hi: 'काम पूरा होने पर भुगतान' },
  monthly: { en: 'Paid on the 1st of month', hi: 'हर महीने की 1 तारीख़' },
};

export const PAY_MODE: Record<PayMode, L> = {
  cash: { en: 'Cash', hi: 'नकद' },
  upi: { en: 'UPI', hi: 'UPI' },
  bank: { en: 'Bank', hi: 'बैंक' },
};

export const PERKS: Record<Perk, L> = {
  food: { en: 'Lunch given', hi: 'खाना मिलेगा' },
  tea: { en: 'Tea & water', hi: 'चाय-पानी' },
  tools: { en: 'Tools given', hi: 'औज़ार मिलेंगे' },
  travel: { en: 'Travel paid', hi: 'किराया मिलेगा' },
  safety: { en: 'Safety gear', hi: 'सुरक्षा सामान' },
  stay: { en: 'Stay given', hi: 'रहने की जगह' },
};

export const RISK: Record<RiskFlag, { label: L; why: L; weight: number }> = {
  'advance-fee': {
    label: { en: 'Asks you to pay money first', hi: 'पहले पैसे माँग रहा है' },
    why: { en: 'Real employers never charge a "registration" or "joining" fee.', hi: 'असली मालिक कभी "रजिस्ट्रेशन" या "जॉइनिंग" फ़ीस नहीं लेते।' },
    weight: 45,
  },
  'no-address': {
    label: { en: 'No clear work address', hi: 'काम का पता साफ़ नहीं' },
    why: { en: 'You should know exactly where you are going before you travel.', hi: 'जाने से पहले आपको सही पता पता होना चाहिए।' },
    weight: 20,
  },
  'pay-too-high': {
    label: { en: 'Pay is far above normal', hi: 'मज़दूरी बहुत ज़्यादा है' },
    why: { en: 'Pay 2–3× the usual rate is a common trick to lure workers.', hi: 'आम रेट से 2–3 गुना पैसा अक्सर धोखे का तरीका होता है।' },
    weight: 20,
  },
  unverified: {
    label: { en: 'Employer not verified', hi: 'मालिक की पहचान जाँची नहीं गई' },
    why: { en: 'Phone and ID of this employer are not checked yet.', hi: 'इस मालिक का फ़ोन और ID अभी जाँचा नहीं गया है।' },
    weight: 15,
  },
  vague: {
    label: { en: 'Work not described', hi: 'काम का विवरण नहीं' },
    why: { en: 'Hours, tasks or pay timing are missing.', hi: 'समय, काम या भुगतान का दिन नहीं बताया।' },
    weight: 10,
  },
  'id-upfront': {
    label: { en: 'Wants your Aadhaar/ATM card', hi: 'आधार/ATM कार्ड माँग रहा है' },
    why: { en: 'Never hand over original documents, ATM card or OTP.', hi: 'असली कागज़, ATM कार्ड या OTP कभी न दें।' },
    weight: 30,
  },
  'far-travel': {
    label: { en: 'Travel to another state', hi: 'दूसरे राज्य जाना होगा' },
    why: { en: 'Check with family and get the full address in writing first.', hi: 'पहले परिवार से बात करें और पूरा पता लिखित में लें।' },
    weight: 10,
  },
};

/** 0–100. Higher is safer. */
export function trustScore(flags: RiskFlag[], verified: boolean) {
  const base = verified ? 100 : 92;
  return Math.max(5, base - flags.reduce((s, f) => s + RISK[f].weight, 0));
}

export function trustLevel(score: number): 'safe' | 'check' | 'risky' {
  return score >= 80 ? 'safe' : score >= 50 ? 'check' : 'risky';
}

export const rupee = (n: number) => '₹' + n.toLocaleString('en-IN');
