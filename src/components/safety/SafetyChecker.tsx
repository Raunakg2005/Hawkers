'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock,
  CreditCard,
  HandCoins,
  MapPin,
  PhoneCall,
  Plane,
  RotateCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Siren,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { L, RiskFlag } from '@/data/types';
import { RISK, trustLevel, trustScore } from '@/data/trades';
import { T, Tx } from '@/components/T';
import ReadAloud from '@/components/ReadAloud';
import TrustBadge from '@/components/TrustBadge';
import { useLang } from '@/lib/prefs';
import s from './safety-ui.module.css';

type Answer = 'yes' | 'no' | 'unsure';
type Level = 'safe' | 'check' | 'risky';

interface Q {
  id: string;
  flag: RiskFlag;
  /** the answer that signals danger */
  risky: 'yes' | 'no';
  icon: LucideIcon;
  q: L;
  hint: L;
  short: L;
}

const QUESTIONS: Q[] = [
  {
    id: 'fee',
    flag: 'advance-fee',
    risky: 'yes',
    icon: HandCoins,
    q: {
      en: 'Did they ask you to pay any fee?',
      hi: 'क्या उन्होंने कोई फ़ीस या पैसे माँगे?',
      mr: 'त्यांनी तुमच्याकडे काही फी किंवा पैसे मागितले का?',
      gu: 'શું તેમણે તમારી પાસે કોઈ ફી કે પૈસા માંગ્યા?',
    },
    hint: {
      en: 'Registration, joining, uniform, visa or “security” money.',
      hi: 'रजिस्ट्रेशन, जॉइनिंग, वर्दी, वीज़ा या “सिक्योरिटी” के पैसे।',
      mr: 'रजिस्ट्रेशन, जॉइनिंग, गणवेश, व्हिसा किंवा “सिक्युरिटी”चे पैसे.',
      gu: 'રજિસ્ટ્રેશન, જોઇનિંગ, યુનિફોર્મ, વિઝા કે “સિક્યોરિટી”ના પૈસા.',
    },
    short: { en: 'Asked for a fee', hi: 'फ़ीस माँगी', mr: 'फी मागितली', gu: 'ફી માંગી' },
  },
  {
    id: 'address',
    flag: 'no-address',
    risky: 'no',
    icon: MapPin,
    q: {
      en: 'Do you know the exact work address?',
      hi: 'क्या आपको काम का पूरा पता मालूम है?',
      mr: 'कामाचा पूर्ण पत्ता तुम्हाला माहीत आहे का?',
      gu: 'શું તમને કામનું પૂરું સરનામું ખબર છે?',
    },
    hint: {
      en: 'Building name, area and a landmark — not just “come, I will tell you”.',
      hi: 'बिल्डिंग का नाम, इलाक़ा और कोई निशानी — सिर्फ़ “आओ, बता दूँगा” नहीं।',
      mr: 'इमारतीचे नाव, भाग आणि जवळची एखादी खूण — फक्त “ये, सांगतो” असे नाही.',
      gu: 'બિલ્ડિંગનું નામ, વિસ્તાર અને કોઈ નિશાની — ફક્ત “આવ, કહું છું” એવું નહીં.',
    },
    short: { en: 'Exact address known', hi: 'पूरा पता मालूम', mr: 'पूर्ण पत्ता माहीत', gu: 'પૂરું સરનામું ખબર' },
  },
  {
    id: 'pay',
    flag: 'pay-too-high',
    risky: 'yes',
    icon: TrendingUp,
    q: {
      en: 'Is the pay more than double the usual rate?',
      hi: 'क्या मज़दूरी आम रेट से दोगुनी से भी ज़्यादा है?',
      mr: 'मजुरी नेहमीच्या दरापेक्षा दुप्पटीपेक्षा जास्त आहे का?',
      gu: 'શું મજૂરી સામાન્ય ભાવ કરતાં બમણાથી પણ વધારે છે?',
    },
    hint: {
      en: 'Like ₹2,500 a day for helper work that usually pays ₹800.',
      hi: 'जैसे हेल्पर के काम के ₹2,500 रोज़, जबकि आम तौर पर ₹800 मिलते हैं।',
      mr: 'जसे हेल्परच्या कामाचे रोज ₹2,500, जिथे साधारणपणे ₹800 मिळतात.',
      gu: 'જેમ કે હેલ્પરના કામના રોજના ₹2,500, જ્યારે સામાન્ય રીતે ₹800 મળે છે.',
    },
    short: { en: 'Pay too good to be true', hi: 'ज़रूरत से ज़्यादा मज़दूरी', mr: 'खरी वाटणार नाही इतकी जास्त मजुरी', gu: 'સાચી ન લાગે એટલી વધારે મજૂરી' },
  },
  {
    id: 'id',
    flag: 'id-upfront',
    risky: 'yes',
    icon: CreditCard,
    q: {
      en: 'Do they want your Aadhaar, ATM card or OTP?',
      hi: 'क्या वे आपका आधार, ATM कार्ड या OTP माँग रहे हैं?',
      mr: 'ते तुमचे आधार, ATM कार्ड किंवा OTP मागत आहेत का?',
      gu: 'શું તેઓ તમારું આધાર, ATM કાર્ડ કે OTP માંગે છે?',
    },
    hint: {
      en: 'Showing a photocopy is okay. Handing over the original card, PIN or OTP is not.',
      hi: 'फ़ोटोकॉपी दिखाना ठीक है। असली कार्ड, PIN या OTP देना बिल्कुल नहीं।',
      mr: 'झेरॉक्स दाखवणे ठीक आहे. पण खरे कार्ड, PIN किंवा OTP अजिबात देऊ नका.',
      gu: 'ઝેરોક્સ બતાવવી બરાબર છે. પણ અસલ કાર્ડ, PIN કે OTP બિલકુલ ન આપો.',
    },
    short: { en: 'Wants ID / ATM / OTP', hi: 'ID / ATM / OTP माँगा', mr: 'ID / ATM / OTP मागितला', gu: 'ID / ATM / OTP માંગ્યો' },
  },
  {
    id: 'verified',
    flag: 'unverified',
    risky: 'no',
    icon: BadgeCheck,
    q: {
      en: 'Is the employer verified on Karigar?',
      hi: 'क्या मालिक कारीगर पर वेरिफ़ाइड है?',
      mr: 'मालक कारागीर वर व्हेरिफाइड आहे का?',
      gu: 'શું માલિક કારીગર પર વેરિફાઇડ છે?',
    },
    hint: {
      en: 'Look for the tick badge next to their name on the job card.',
      hi: 'काम के कार्ड पर उनके नाम के पास टिक का निशान देखें।',
      mr: 'कामाच्या कार्डवर त्यांच्या नावाजवळ टिकची खूण पाहा.',
      gu: 'કામના કાર્ડ પર તેમના નામ પાસે ટિકનું નિશાન જુઓ.',
    },
    short: { en: 'Employer verified', hi: 'मालिक वेरिफ़ाइड', mr: 'मालक व्हेरिफाइड', gu: 'માલિક વેરિફાઇડ' },
  },
  {
    id: 'clear',
    flag: 'vague',
    risky: 'no',
    icon: Clock,
    q: {
      en: 'Are the working hours and payday clear?',
      hi: 'क्या काम के घंटे और भुगतान का दिन साफ़ बताया है?',
      mr: 'कामाचे तास आणि पैसे मिळण्याचा दिवस स्पष्ट सांगितला आहे का?',
      gu: 'શું કામના કલાક અને પૈસા મળવાનો દિવસ ચોખ્ખો કહ્યો છે?',
    },
    hint: {
      en: 'You should know start time, end time and the day you get paid.',
      hi: 'आपको शुरू होने का समय, ख़त्म होने का समय और पैसे मिलने का दिन पता होना चाहिए।',
      mr: 'काम सुरू होण्याची वेळ, संपण्याची वेळ आणि पैसे मिळण्याचा दिवस तुम्हाला माहीत असायला हवा.',
      gu: 'કામ શરૂ થવાનો સમય, પૂરો થવાનો સમય અને પૈસા મળવાનો દિવસ તમને ખબર હોવો જોઈએ.',
    },
    short: { en: 'Hours & payday clear', hi: 'घंटे और भुगतान का दिन साफ़', mr: 'तास आणि पैशाचा दिवस स्पष्ट', gu: 'કલાક અને પૈસાનો દિવસ ચોખ્ખો' },
  },
  {
    id: 'far',
    flag: 'far-travel',
    risky: 'yes',
    icon: Plane,
    q: {
      en: 'Is the work in another state or country?',
      hi: 'क्या काम दूसरे राज्य या देश में है?',
      mr: 'काम दुसऱ्या राज्यात किंवा परदेशात आहे का?',
      gu: 'શું કામ બીજા રાજ્યમાં કે વિદેશમાં છે?',
    },
    hint: {
      en: 'Far work can be real — but check much more carefully first.',
      hi: 'दूर का काम असली भी हो सकता है — पर पहले बहुत ध्यान से जाँचें।',
      mr: 'लांबचे काम खरेही असू शकते — पण आधी खूप नीट तपासा.',
      gu: 'દૂરનું કામ સાચું પણ હોઈ શકે — પણ પહેલાં ખૂબ ધ્યાનથી તપાસો.',
    },
    short: { en: 'Far away / abroad', hi: 'दूर / विदेश', mr: 'लांब / परदेश', gu: 'દૂર / વિદેશ' },
  },
];

const N = QUESTIONS.length;

const ANSWER_LABEL: Record<Answer, L> = {
  yes: { en: 'Yes', hi: 'हाँ', mr: 'हो', gu: 'હા' },
  no: { en: 'No', hi: 'नहीं', mr: 'नाही', gu: 'ના' },
  unsure: { en: 'Not sure', hi: 'पता नहीं', mr: 'माहीत नाही', gu: 'ખબર નથી' },
};

const ANSWER_ICON: Record<Answer, LucideIcon> = { yes: Check, no: X, unsure: CircleHelp };

/**
 * Score with the same weights the job cards use (RISK + trustScore), plus two
 * honest rules: "not sure" costs half the weight and can never read as safe,
 * and paying a fee or handing over ID/OTP is always risky.
 */
function assess(answers: Record<string, Answer>) {
  const hits = QUESTIONS.filter((q) => answers[q.id] === q.risky);
  const unsure = QUESTIONS.filter((q) => answers[q.id] === 'unsure');
  const flags = hits.map((q) => q.flag);
  let score = trustScore(flags, answers.verified === 'yes') - unsure.reduce((sum, q) => sum + RISK[q.flag].weight / 2, 0);
  score = Math.max(5, Math.round(score));
  if (unsure.length) score = Math.min(score, 79);
  if (flags.includes('advance-fee') || flags.includes('id-upfront')) score = Math.min(score, 45);
  return { score, level: trustLevel(score) as Level, hits, unsure };
}

const LEVEL: Record<Level, { icon: LucideIcon; title: L; summary: L; steps: L[] }> = {
  safe: {
    icon: ShieldCheck,
    title: { en: 'Looks safe', hi: 'सुरक्षित लगता है', mr: 'सुरक्षित वाटते', gu: 'સુરક્ષિત લાગે છે' },
    summary: {
      en: 'No big warning signs in your answers. Still take the usual care.',
      hi: 'आपके जवाबों में कोई बड़ा ख़तरा नहीं दिखा। फिर भी हमेशा की तरह सावधान रहें।',
      mr: 'तुमच्या उत्तरांमध्ये मोठा धोका दिसला नाही. तरीही नेहमीसारखी काळजी घ्या.',
      gu: 'તમારા જવાબોમાં કોઈ મોટું જોખમ દેખાયું નથી. છતાં હંમેશની જેમ ધ્યાન રાખો.',
    },
    steps: [
      {
        en: 'Send the address and employer’s number to your family.',
        hi: 'पता और मालिक का नंबर परिवार को भेजें।',
        mr: 'पत्ता आणि मालकाचा नंबर कुटुंबाला पाठवा.',
        gu: 'સરનામું અને માલિકનો નંબર પરિવારને મોકલો.',
      },
      {
        en: 'Agree the work, pay and payday before you start — a Work Promise.',
        hi: 'काम शुरू करने से पहले काम, मज़दूरी और भुगतान का दिन तय करें — काम का वादा।',
        mr: 'काम सुरू करण्याआधी काम, मजुरी आणि पैसे मिळण्याचा दिवस ठरवा — कामाचे वचन.',
        gu: 'કામ શરૂ કરતાં પહેલાં કામ, મજૂરી અને પૈસા મળવાનો દિવસ નક્કી કરો — કામનું વચન.',
      },
      {
        en: 'For one-day work, take your pay before you leave.',
        hi: 'एक दिन के काम में, जाने से पहले अपनी मज़दूरी ले लें।',
        mr: 'एका दिवसाच्या कामात, निघण्याआधी तुमची मजुरी घ्या.',
        gu: 'એક દિવસના કામમાં, નીકળતાં પહેલાં તમારી મજૂરી લઈ લો.',
      },
    ],
  },
  check: {
    icon: ShieldQuestion,
    title: { en: 'Check first', hi: 'पहले जाँचें', mr: 'आधी तपासा', gu: 'પહેલાં તપાસો' },
    summary: {
      en: 'Some things are missing or unclear. Get clear answers before you travel.',
      hi: 'कुछ बातें ग़ायब या साफ़ नहीं हैं। जाने से पहले साफ़ जवाब लें।',
      mr: 'काही गोष्टी माहीत नाहीत किंवा स्पष्ट नाहीत. जाण्याआधी स्पष्ट उत्तरे घ्या.',
      gu: 'અમુક વાતો ખૂટે છે કે ચોખ્ખી નથી. જતાં પહેલાં ચોખ્ખા જવાબ લો.',
    },
    steps: [
      {
        en: 'Call the employer and ask what is missing: address, hours, payday.',
        hi: 'मालिक को फ़ोन करें और जो ग़ायब है वह पूछें: पता, घंटे, भुगतान का दिन।',
        mr: 'मालकाला फोन करा आणि जे माहीत नाही ते विचारा: पत्ता, तास, पैसे मिळण्याचा दिवस.',
        gu: 'માલિકને ફોન કરો અને જે ખૂટે છે તે પૂછો: સરનામું, કલાક, પૈસા મળવાનો દિવસ.',
      },
      {
        en: 'Ask other workers at your naka if they know this employer.',
        hi: 'अपने नाके पर दूसरे मज़दूरों से पूछें कि क्या वे इस मालिक को जानते हैं।',
        mr: 'तुमच्या नाक्यावरच्या इतर कामगारांना विचारा की ते या मालकाला ओळखतात का.',
        gu: 'તમારા નાકા પરના બીજા કામદારોને પૂછો કે તેઓ આ માલિકને ઓળખે છે કે નહીં.',
      },
      {
        en: 'Do not go alone to a far place. Tell your family first.',
        hi: 'दूर की जगह अकेले न जाएँ। पहले परिवार को बताएँ।',
        mr: 'लांबच्या ठिकाणी एकटे जाऊ नका. आधी कुटुंबाला सांगा.',
        gu: 'દૂરની જગ્યાએ એકલા ન જાઓ. પહેલાં પરિવારને કહો.',
      },
    ],
  },
  risky: {
    icon: ShieldAlert,
    title: { en: 'Risky — don’t go yet', hi: 'ख़तरा — अभी न जाएँ', mr: 'धोका — आत्ता जाऊ नका', gu: 'જોખમ — હમણાં ન જાઓ' },
    summary: {
      en: 'This looks like a scam or unsafe work. Protect your money and papers.',
      hi: 'यह धोखा या असुरक्षित काम लगता है। अपने पैसे और कागज़ बचाएँ।',
      mr: 'हे फसवणुकीचे किंवा धोकादायक काम वाटते. तुमचे पैसे आणि कागदपत्रे जपा.',
      gu: 'આ છેતરપિંડી કે જોખમી કામ લાગે છે. તમારા પૈસા અને કાગળો સાચવો.',
    },
    steps: [
      {
        en: 'Do not pay any money. Never share OTP, PIN or your ATM card.',
        hi: 'कोई पैसा न दें। OTP, PIN या ATM कार्ड कभी न दें।',
        mr: 'कोणतेही पैसे देऊ नका. OTP, PIN किंवा ATM कार्ड कधीच देऊ नका.',
        gu: 'કોઈ પૈસા ન આપો. OTP, PIN કે ATM કાર્ડ ક્યારેય ન આપો.',
      },
      {
        en: 'Already paid or shared an OTP? Call 1930 at once — a fast call can stop the money.',
        hi: 'पैसे दे दिए या OTP बता दिया? तुरंत 1930 पर कॉल करें — जल्दी कॉल करने से पैसा रुक सकता है।',
        mr: 'पैसे दिले किंवा OTP सांगितला? लगेच 1930 वर कॉल करा — लवकर कॉल केल्यास पैसे थांबू शकतात.',
        gu: 'પૈસા આપી દીધા કે OTP કહી દીધો? તરત 1930 પર કૉલ કરો — જલદી કૉલ કરવાથી પૈસા અટકી શકે છે.',
      },
      {
        en: 'If you feel unsafe or someone is stopping you from leaving, call 112.',
        hi: 'अगर ख़तरा लगे या कोई आपको जाने से रोके, तो 112 पर कॉल करें।',
        mr: 'धोका वाटला किंवा कोणी तुम्हाला जाऊ देत नसेल, तर 112 वर कॉल करा.',
        gu: 'જોખમ લાગે કે કોઈ તમને જવા ન દે, તો 112 પર કૉલ કરો.',
      },
    ],
  },
};

export default function SafetyChecker() {
  const { t, tl } = useLang();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [step, setStep] = useState(0);
  const [shared, setShared] = useState(false);
  const interacted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]).length;
  const done = step >= N;
  const result = useMemo(() => assess(answers), [answers]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Move focus to the new question / result so screen-reader and keyboard users follow along.
  useEffect(() => {
    if (interacted.current) headingRef.current?.focus({ preventScroll: false });
  }, [step]);

  const go = (i: number) => {
    interacted.current = true;
    window.clearTimeout(timer.current);
    setStep(i);
  };

  const pick = (q: Q, a: Answer) => {
    const next = { ...answers, [q.id]: a };
    setAnswers(next);
    const idx = QUESTIONS.indexOf(q);
    const after = QUESTIONS.findIndex((qq, i) => i > idx && !next[qq.id]);
    const before = QUESTIONS.findIndex((qq) => !next[qq.id]);
    const target = after !== -1 ? after : before !== -1 ? before : N;
    window.clearTimeout(timer.current);
    // short pause so the pressed state is seen before moving on
    timer.current = window.setTimeout(() => go(target), 260);
  };

  const reset = () => {
    setAnswers({});
    setShared(false);
    go(0);
  };

  const share = async () => {
    const word = LEVEL[result.level].title;
    const text = tl({
      en: `Karigar safety check: ${word.en} (${result.score}/100). I am checking a job before I go. If I don't call you by evening, please call me.`,
      hi: `कारीगर सुरक्षा जाँच: ${word.hi} (${result.score}/100)। मैं एक काम पर जाने से पहले जाँच रहा/रही हूँ। शाम तक मेरा फ़ोन न आए तो मुझे कॉल करना।`,
      mr: `कारागीर सुरक्षा तपासणी: ${word.mr} (${result.score}/100). एका कामावर जाण्याआधी मी तपासत आहे. संध्याकाळपर्यंत माझा फोन आला नाही तर मला कॉल करा.`,
      gu: `કારીગર સુરક્ષા તપાસ: ${word.gu} (${result.score}/100). એક કામ પર જતાં પહેલાં હું તપાસ કરું છું. સાંજ સુધી મારો ફોન ન આવે તો મને કૉલ કરજો.`,
    });
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
      setShared(true);
    } catch {
      /* share sheet closed — nothing to do */
    }
  };

  const current = QUESTIONS[step];

  return (
    <div className={s.checker}>
      <div className={s.main}>
        <div className={s.progressRow}>
          <p className={s.progressText} aria-live="polite">
            {done ? (
              <T en="Your result" hi="आपका नतीजा" mr="तुमचा निकाल" gu="તમારું પરિણામ" />
            ) : (
              <T en={`Question ${step + 1} of ${N}`} hi={`सवाल ${step + 1} / ${N}`} mr={`प्रश्न ${step + 1} / ${N}`} gu={`પ્રશ્ન ${step + 1} / ${N}`} />
            )}
          </p>
          <ol className={s.dots}>
            {QUESTIONS.map((q, i) => {
              const a = answers[q.id];
              const status = !a ? 'empty' : a === 'unsure' ? 'unsure' : a === q.risky ? 'bad' : 'good';
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    className={s.dot}
                    data-status={status}
                    aria-current={i === step ? 'step' : undefined}
                    onClick={() => go(i)}
                    aria-label={t(
                      `Question ${i + 1}: ${q.short.en}${a ? ` — ${ANSWER_LABEL[a].en}` : ''}`,
                      `सवाल ${i + 1}: ${q.short.hi}${a ? ` — ${ANSWER_LABEL[a].hi}` : ''}`,
                      `प्रश्न ${i + 1}: ${q.short.mr}${a ? ` — ${ANSWER_LABEL[a].mr}` : ''}`,
                      `પ્રશ્ન ${i + 1}: ${q.short.gu}${a ? ` — ${ANSWER_LABEL[a].gu}` : ''}`,
                    )}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${done ? 1 : answeredCount / N})` }} />
        </div>

        {!done && current ? (
          <div key={current.id} className={s.qView}>
            <div className={s.qTop}>
              <span className={s.qIcon} aria-hidden="true">
                <current.icon />
              </span>
              <ReadAloud
                en={`${current.q.en} ${current.hint.en}`}
                hi={`${current.q.hi} ${current.hint.hi}`}
                mr={`${current.q.mr} ${current.hint.mr}`}
                gu={`${current.q.gu} ${current.hint.gu}`}
                className="btn btn-sm"
              />
            </div>
            <h3 className={s.qText} ref={headingRef} tabIndex={-1} id="safety-q">
              <Tx l={current.q} />
            </h3>
            <p className={s.qHint}>
              <Tx l={current.hint} />
            </p>
            <div className={s.answerRow} role="group" aria-labelledby="safety-q">
              {(['yes', 'no', 'unsure'] as Answer[]).map((a) => {
                const Icon = ANSWER_ICON[a];
                return (
                  <button key={a} type="button" className={s.ansBtn} aria-pressed={answers[current.id] === a} onClick={() => pick(current, a)}>
                    <span className={s.ansIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <Tx l={ANSWER_LABEL[a]} />
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button type="button" className={`btn btn-ghost btn-sm ${s.back}`} onClick={() => go(step - 1)}>
                <ArrowLeft aria-hidden="true" />
                <T en="Back" hi="पीछे" mr="मागे" gu="પાછળ" />
              </button>
            )}
          </div>
        ) : (
          <Result result={result} headingRef={headingRef} onReset={reset} onShare={share} shared={shared} />
        )}
      </div>

      {/* ── Running summary: what you answered, tap to change */}
      <aside className={s.aside} aria-labelledby="safety-answers">
        <div className={s.asideHead}>
          <h3 className={s.asideTitle} id="safety-answers">
            <T en="Your answers" hi="आपके जवाब" mr="तुमची उत्तरे" gu="તમારા જવાબ" />
          </h3>
          {answeredCount > 0 && <TrustBadge score={result.score} />}
        </div>
        <ul className={s.answerList}>
          {QUESTIONS.map((q, i) => {
            const a = answers[q.id];
            const bad = a === q.risky;
            const Icon = q.icon;
            return (
              <li key={q.id}>
                <button type="button" className={s.answerItem} aria-current={i === step ? 'step' : undefined} onClick={() => go(i)}>
                  <Icon aria-hidden="true" className={s.answerIcon} />
                  <span className={s.answerShort}>
                    <Tx l={q.short} />
                  </span>
                  {a ? (
                    <span className={`chip ${a === 'unsure' ? 'chip-warning' : bad ? 'chip-danger' : 'chip-success'}`}>
                      {a === 'unsure' ? <CircleHelp aria-hidden="true" /> : bad ? <CircleX aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
                      <Tx l={ANSWER_LABEL[a]} />
                    </span>
                  ) : (
                    <span className="subtle">—</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="subtle">
          <T
            en="Tap any line to change the answer. Nothing is saved or sent."
            hi="जवाब बदलने के लिए किसी भी लाइन पर टैप करें। कुछ भी सेव या भेजा नहीं जाता।"
            mr="उत्तर बदलण्यासाठी कोणत्याही ओळीवर टॅप करा. काहीही सेव्ह होत नाही किंवा पाठवले जात नाही."
            gu="જવાબ બદલવા કોઈ પણ લાઇન પર ટૅપ કરો. કંઈ પણ સેવ થતું નથી કે મોકલાતું નથી."
          />
        </p>
      </aside>
    </div>
  );
}

function Result({
  result,
  headingRef,
  onReset,
  onShare,
  shared,
}: {
  result: ReturnType<typeof assess>;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onReset: () => void;
  onShare: () => void;
  shared: boolean;
}) {
  const { t } = useLang();
  const { level, score, hits, unsure } = result;
  const info = LEVEL[level];
  const Icon = info.icon;
  const speech: L = {
    en: `${info.title.en}. ${info.summary.en} ${hits.map((q) => RISK[q.flag].label.en).join('. ')}. ${info.steps.map((x) => x.en).join(' ')}`,
    hi: `${info.title.hi}। ${info.summary.hi} ${hits.map((q) => RISK[q.flag].label.hi).join('। ')}। ${info.steps.map((x) => x.hi).join(' ')}`,
    mr: `${info.title.mr}. ${info.summary.mr} ${hits.map((q) => RISK[q.flag].label.mr).join('. ')}. ${info.steps.map((x) => x.mr).join(' ')}`,
    gu: `${info.title.gu}. ${info.summary.gu} ${hits.map((q) => RISK[q.flag].label.gu).join('. ')}. ${info.steps.map((x) => x.gu).join(' ')}`,
  };
  return (
    <div className={`${s.result} ${s[level]}`}>
      <div className={s.resultHead}>
        <span className={s.resultIcon} aria-hidden="true">
          <Icon />
        </span>
        <div className={s.resultTitle}>
          <h3 ref={headingRef} tabIndex={-1}>
            <Tx l={info.title} />
          </h3>
          <p>
            <Tx l={info.summary} />
          </p>
        </div>
      </div>

      <div className={s.scoreRow}>
        <span className={s.scoreLabel}>
          <T en="Safety score" hi="सुरक्षा अंक" mr="सुरक्षा गुण" gu="સુરક્ષા ગુણ" />
        </span>
        <div
          className={`meter ${s.scoreMeter}`}
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
          aria-label={t('Safety score', 'सुरक्षा अंक', 'सुरक्षा गुण', 'સુરક્ષા ગુણ')}
        >
          <span style={{ transform: `scaleX(${score / 100})` }} />
        </div>
        <span className={`money ${s.scoreNum}`}>
          {score}
          <small>/100</small>
        </span>
      </div>

      <div className={s.resultCols}>
        <div>
          <h4 className={s.subTitle}>
            <T en="Why" hi="क्यों" mr="का" gu="કેમ" />
          </h4>
          <ul className={s.reasons}>
            {hits.map((q) => (
              <li key={q.id} className={s.reasonBad}>
                <CircleX aria-hidden="true" />
                <span>
                  <b>
                    <Tx l={RISK[q.flag].label} />
                  </b>
                  <span>
                    <Tx l={RISK[q.flag].why} />
                  </span>
                </span>
              </li>
            ))}
            {unsure.map((q) => (
              <li key={q.id} className={s.reasonUnsure}>
                <CircleHelp aria-hidden="true" />
                <span>
                  <b>
                    <T
                      en={`Not sure: ${q.short.en}`}
                      hi={`पता नहीं: ${q.short.hi}`}
                      mr={`माहीत नाही: ${q.short.mr}`}
                      gu={`ખબર નથી: ${q.short.gu}`}
                    />
                  </b>
                  <span>
                    <T en="Find this out before you go." hi="जाने से पहले यह पता करें।" mr="जाण्याआधी हे माहीत करून घ्या." gu="જતાં પહેલાં આ જાણી લો." />
                  </span>
                </span>
              </li>
            ))}
            {hits.length === 0 && unsure.length === 0 && (
              <li className={s.reasonGood}>
                <CircleCheck aria-hidden="true" />
                <span>
                  <b>
                    <T
                      en="No red flags in your answers"
                      hi="आपके जवाबों में कोई ख़तरे का निशान नहीं"
                      mr="तुमच्या उत्तरांमध्ये धोक्याच्या खुणा नाहीत"
                      gu="તમારા જવાબોમાં કોઈ જોખમના સંકેત નથી"
                    />
                  </b>
                  <span>
                    <T
                      en="No fee, clear address, fair pay, verified employer."
                      hi="कोई फ़ीस नहीं, साफ़ पता, सही मज़दूरी, वेरिफ़ाइड मालिक।"
                      mr="फी नाही, स्पष्ट पत्ता, योग्य मजुरी, व्हेरिफाइड मालक."
                      gu="કોઈ ફી નહીં, ચોખ્ખું સરનામું, યોગ્ય મજૂરી, વેરિફાઇડ માલિક."
                    />
                  </span>
                </span>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h4 className={s.subTitle}>
            <T en="What to do now" hi="अब क्या करें" mr="आता काय करायचे" gu="હવે શું કરવું" />
          </h4>
          <ol className={s.nextSteps}>
            {info.steps.map((x, i) => (
              <li key={i}>
                <span className={s.nextNum} aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <Tx l={x} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={s.actions}>
        {level !== 'safe' && (
          <a href="tel:1930" className="btn btn-primary">
            <PhoneCall aria-hidden="true" />
            <T en="Lost money? Call 1930" hi="पैसे गए? 1930 पर कॉल करें" mr="पैसे गेले? 1930 वर कॉल करा" gu="પૈસા ગયા? 1930 પર કૉલ કરો" />
          </a>
        )}
        {level === 'risky' && (
          <a href="tel:112" className="btn btn-danger">
            <Siren aria-hidden="true" />
            <T en="In danger? Call 112" hi="ख़तरे में? 112 पर कॉल करें" mr="धोक्यात आहात? 112 वर कॉल करा" gu="જોખમમાં છો? 112 પર કૉલ કરો" />
          </a>
        )}
        <button type="button" className="btn" onClick={onShare}>
          {shared ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
          {shared ? (
            <T en="Shared" hi="भेज दिया" mr="पाठवले" gu="મોકલી દીધું" />
          ) : (
            <T en="Share with family" hi="परिवार को भेजें" mr="कुटुंबाला पाठवा" gu="પરિવારને મોકલો" />
          )}
        </button>
        <ReadAloud en={speech.en} hi={speech.hi} mr={speech.mr} gu={speech.gu} className="btn" />
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          <RotateCcw aria-hidden="true" />
          <T en="Check another job" hi="दूसरा काम जाँचें" mr="दुसरे काम तपासा" gu="બીજું કામ તપાસો" />
        </button>
      </div>
    </div>
  );
}
