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
  { id: 'plumber', name: { en: 'Plumber', hi: 'प्लंबर', mr: 'प्लंबर', gu: 'પ્લમ્બર' }, verb: { en: 'Pipes & taps', hi: 'पाइप और नल', mr: 'पाइप आणि नळ', gu: 'પાઇપ અને નળ' }, fair: [800, 1200] },
  { id: 'electrician', name: { en: 'Electrician', hi: 'बिजली मिस्त्री', mr: 'इलेक्ट्रिशियन', gu: 'ઇલેક્ટ્રિશિયન' }, verb: { en: 'Wiring & repairs', hi: 'वायरिंग और मरम्मत', mr: 'वायरिंग आणि दुरुस्ती', gu: 'વાયરિંગ અને રિપેરિંગ' }, fair: [850, 1300] },
  { id: 'carpenter', name: { en: 'Carpenter', hi: 'बढ़ई', mr: 'सुतार', gu: 'સુથાર' }, verb: { en: 'Wood & furniture', hi: 'लकड़ी और फ़र्नीचर', mr: 'लाकूड आणि फर्निचर', gu: 'લાકડું અને ફર્નિચર' }, fair: [850, 1300] },
  { id: 'painter', name: { en: 'Painter', hi: 'पेंटर', mr: 'पेंटर', gu: 'પેઇન્ટર' }, verb: { en: 'Walls & polish', hi: 'दीवार और पॉलिश', mr: 'भिंती आणि पॉलिश', gu: 'દીવાલો અને પૉલિશ' }, fair: [750, 1100] },
  { id: 'mason', name: { en: 'Mason', hi: 'राजमिस्त्री', mr: 'गवंडी', gu: 'કડિયો' }, verb: { en: 'Brick & tiles', hi: 'ईंट और टाइल', mr: 'वीट आणि टाइल्स', gu: 'ઈંટ અને ટાઇલ્સ' }, fair: [850, 1250] },
  { id: 'cleaner', name: { en: 'Cleaner', hi: 'सफ़ाई कर्मी', mr: 'सफाई कामगार', gu: 'સફાઈ કામદાર' }, verb: { en: 'Homes & offices', hi: 'घर और ऑफ़िस', mr: 'घर आणि ऑफिस', gu: 'ઘર અને ઑફિસ' }, fair: [600, 850] },
  { id: 'labour', name: { en: 'Helper / Labour', hi: 'हेल्पर / मज़दूर', mr: 'हेल्पर / मजूर', gu: 'હેલ્પર / મજૂર' }, verb: { en: 'Loading & site work', hi: 'लोडिंग और साइट काम', mr: 'लोडिंग आणि साइटवरचे काम', gu: 'લોડિંગ અને સાઇટનું કામ' }, fair: [650, 900] },
  { id: 'driver', name: { en: 'Driver', hi: 'ड्राइवर', mr: 'ड्रायव्हर', gu: 'ડ્રાઇવર' }, verb: { en: 'Tempo & car', hi: 'टेम्पो और कार', mr: 'टेम्पो आणि कार', gu: 'ટેમ્પો અને કાર' }, fair: [800, 1200] },
  { id: 'cook', name: { en: 'Cook', hi: 'रसोइया', mr: 'स्वयंपाकी', gu: 'રસોઇયો' }, verb: { en: 'Homes & events', hi: 'घर और कार्यक्रम', mr: 'घर आणि कार्यक्रम', gu: 'ઘર અને પ્રસંગો' }, fair: [700, 1100] },
  { id: 'gardener', name: { en: 'Gardener', hi: 'माली', mr: 'माळी', gu: 'માળી' }, verb: { en: 'Plants & lawns', hi: 'पौधे और लॉन', mr: 'झाडे आणि लॉन', gu: 'છોડ અને લૉન' }, fair: [600, 900] },
];

export const TRADE = Object.fromEntries(TRADES.map((t) => [t.id, t])) as Record<TradeId, Trade>;

export const DURATIONS: Record<Duration, { name: L; hint: L }> = {
  daily: { name: { en: 'Today / 1 day', hi: 'आज / 1 दिन', mr: 'आज / 1 दिवस', gu: 'આજે / 1 દિવસ' }, hint: { en: 'Daily wage', hi: 'दिहाड़ी', mr: 'रोजंदारी', gu: 'રોજમદારી' } },
  short: { name: { en: 'Few days', hi: 'कुछ दिन', mr: 'काही दिवस', gu: 'થોડા દિવસ' }, hint: { en: 'Short-term', hi: 'थोड़े समय का', mr: 'थोड्या काळासाठी', gu: 'થોડા સમય માટે' } },
  long: { name: { en: 'Months', hi: 'महीनों का', mr: 'काही महिने', gu: 'મહિનાઓ' }, hint: { en: 'Long-term', hi: 'लंबे समय का', mr: 'जास्त काळासाठी', gu: 'લાંબા સમય માટે' } },
};

export const PAY_UNIT: Record<PayUnit, L> = {
  day: { en: '/ day', hi: '/ दिन', mr: '/ दिवस', gu: '/ દિવસ' },
  job: { en: 'full job', hi: 'पूरा काम', mr: 'पूर्ण काम', gu: 'આખું કામ' },
  month: { en: '/ month', hi: '/ महीना', mr: '/ महिना', gu: '/ મહિનો' },
  hour: { en: '/ hour', hi: '/ घंटा', mr: '/ तास', gu: '/ કલાક' },
};

export const PAID_WHEN: Record<PaidWhen, L> = {
  'same-day': { en: 'Paid same evening', hi: 'उसी शाम भुगतान', mr: 'त्याच संध्याकाळी पैसे', gu: 'એ જ સાંજે ચુકવણી' },
  weekly: { en: 'Paid every Saturday', hi: 'हर शनिवार भुगतान', mr: 'दर शनिवारी पैसे', gu: 'દર શનિવારે ચુકવણી' },
  'on-completion': { en: 'Paid when work is done', hi: 'काम पूरा होने पर भुगतान', mr: 'काम पूर्ण झाल्यावर पैसे', gu: 'કામ પૂરું થાય ત્યારે ચુકવણી' },
  monthly: { en: 'Paid on the 1st of month', hi: 'हर महीने की 1 तारीख़', mr: 'दर महिन्याच्या 1 तारखेला', gu: 'દર મહિનાની 1 તારીખે' },
};

export const PAY_MODE: Record<PayMode, L> = {
  cash: { en: 'Cash', hi: 'नकद', mr: 'रोख', gu: 'રોકડા' },
  upi: { en: 'UPI', hi: 'UPI', mr: 'UPI', gu: 'UPI' },
  bank: { en: 'Bank', hi: 'बैंक', mr: 'बँक', gu: 'બેંક' },
};

export const PERKS: Record<Perk, L> = {
  food: { en: 'Lunch given', hi: 'खाना मिलेगा', mr: 'जेवण मिळेल', gu: 'જમવાનું મળશે' },
  tea: { en: 'Tea & water', hi: 'चाय-पानी', mr: 'चहा-पाणी', gu: 'ચા-પાણી' },
  tools: { en: 'Tools given', hi: 'औज़ार मिलेंगे', mr: 'अवजारे मिळतील', gu: 'ઓજારો મળશે' },
  travel: { en: 'Travel paid', hi: 'किराया मिलेगा', mr: 'प्रवास खर्च मिळेल', gu: 'ભાડું મળશે' },
  safety: { en: 'Safety gear', hi: 'सुरक्षा सामान', mr: 'सुरक्षा साहित्य', gu: 'સુરક્ષાનાં સાધનો' },
  stay: { en: 'Stay given', hi: 'रहने की जगह', mr: 'राहण्याची सोय', gu: 'રહેવાની વ્યવસ્થા' },
};

export const RISK: Record<RiskFlag, { label: L; why: L; weight: number }> = {
  'advance-fee': {
    label: { en: 'Asks you to pay money first', hi: 'पहले पैसे माँग रहा है', mr: 'आधी पैसे मागत आहे', gu: 'પહેલાં પૈસા માગે છે' },
    why: { en: 'Real employers never charge a "registration" or "joining" fee.', hi: 'असली मालिक कभी "रजिस्ट्रेशन" या "जॉइनिंग" फ़ीस नहीं लेते।', mr: 'खरे मालक कधीही "रजिस्ट्रेशन" किंवा "जॉइनिंग" फी घेत नाहीत.', gu: 'સાચા માલિક ક્યારેય "રજિસ્ટ્રેશન" કે "જોઇનિંગ" ફી લેતા નથી.' },
    weight: 45,
  },
  'no-address': {
    label: { en: 'No clear work address', hi: 'काम का पता साफ़ नहीं', mr: 'कामाचा पत्ता स्पष्ट नाही', gu: 'કામનું સરનામું સ્પષ્ટ નથી' },
    why: { en: 'You should know exactly where you are going before you travel.', hi: 'जाने से पहले आपको सही पता पता होना चाहिए।', mr: 'निघण्याआधी तुम्ही नक्की कुठे जात आहात हे तुम्हाला माहीत असले पाहिजे.', gu: 'જતાં પહેલાં તમને ખબર હોવી જોઈએ કે તમે બરાબર ક્યાં જઈ રહ્યા છો.' },
    weight: 20,
  },
  'pay-too-high': {
    label: { en: 'Pay is far above normal', hi: 'मज़दूरी बहुत ज़्यादा है', mr: 'मजुरी खूपच जास्त आहे', gu: 'મજૂરી ખૂબ વધારે છે' },
    why: { en: 'Pay 2–3× the usual rate is a common trick to lure workers.', hi: 'आम रेट से 2–3 गुना पैसा अक्सर धोखे का तरीका होता है।', mr: 'नेहमीपेक्षा 2–3 पट मजुरी ही कामगारांना फसवण्याची नेहमीची युक्ती असते.', gu: 'સામાન્ય દર કરતાં 2–3 ગણી મજૂરી એ કામદારોને ફસાવવાની જાણીતી ચાલ છે.' },
    weight: 20,
  },
  unverified: {
    label: { en: 'Employer not verified', hi: 'मालिक की पहचान जाँची नहीं गई', mr: 'मालकाची ओळख पडताळलेली नाही', gu: 'માલિકની ઓળખ ચકાસાયેલ નથી' },
    why: { en: 'Phone and ID of this employer are not checked yet.', hi: 'इस मालिक का फ़ोन और ID अभी जाँचा नहीं गया है।', mr: 'या मालकाचा फोन आणि ID अजून तपासलेले नाहीत.', gu: 'આ માલિકનો ફોન અને ID હજી તપાસાયાં નથી.' },
    weight: 15,
  },
  vague: {
    label: { en: 'Work not described', hi: 'काम का विवरण नहीं', mr: 'कामाची माहिती दिलेली नाही', gu: 'કામની વિગત નથી' },
    why: { en: 'Hours, tasks or pay timing are missing.', hi: 'समय, काम या भुगतान का दिन नहीं बताया।', mr: 'वेळ, काम किंवा पैसे कधी मिळणार हे सांगितलेले नाही.', gu: 'સમય, કામ કે પૈસા ક્યારે મળશે તે જણાવ્યું નથી.' },
    weight: 10,
  },
  'id-upfront': {
    label: { en: 'Wants your Aadhaar/ATM card', hi: 'आधार/ATM कार्ड माँग रहा है', mr: 'आधार/ATM कार्ड मागत आहे', gu: 'આધાર/ATM કાર્ડ માગે છે' },
    why: { en: 'Never hand over original documents, ATM card or OTP.', hi: 'असली कागज़, ATM कार्ड या OTP कभी न दें।', mr: 'मूळ कागदपत्रे, ATM कार्ड किंवा OTP कधीही देऊ नका.', gu: 'અસલ દસ્તાવેજ, ATM કાર્ડ કે OTP ક્યારેય ન આપો.' },
    weight: 30,
  },
  'far-travel': {
    label: { en: 'Travel to another state', hi: 'दूसरे राज्य जाना होगा', mr: 'दुसऱ्या राज्यात जावे लागेल', gu: 'બીજા રાજ્યમાં જવું પડશે' },
    why: { en: 'Check with family and get the full address in writing first.', hi: 'पहले परिवार से बात करें और पूरा पता लिखित में लें।', mr: 'आधी कुटुंबाशी बोला आणि पूर्ण पत्ता लेखी घ्या.', gu: 'પહેલાં પરિવાર સાથે વાત કરો અને પૂરું સરનામું લખીને લો.' },
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
