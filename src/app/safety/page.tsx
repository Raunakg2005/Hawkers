import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CircleCheck,
  CircleX,
  Clock,
  CreditCard,
  FileQuestion,
  Flag,
  Handshake,
  HandCoins,
  IndianRupee,
  KeyRound,
  ListChecks,
  LockKeyhole,
  MapPin,
  MapPinOff,
  NotebookPen,
  Plane,
  QrCode,
  Quote,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserX,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import JobCard from '@/components/JobCard';
import ReadAloud from '@/components/ReadAloud';
import { T, Tx } from '@/components/T';
import SafetyChecker from '@/components/safety/SafetyChecker';
import BeforeYouGo from '@/components/safety/BeforeYouGo';
import HelplineGrid from '@/components/rights/HelplineGrid';
import { JOBS } from '@/data/jobs';
import { PAID_WHEN, PAY_MODE, PAY_UNIT, PERKS, RISK, TRADE, rupee, trustLevel, trustScore } from '@/data/trades';
import type { Job, L, RiskFlag } from '@/data/types';
import s from './safety.module.css';

export const metadata: Metadata = {
  title: 'Trust & safety',
  description:
    'Check if a job is safe before you go: a 7-question scam checker, red flags to watch for, a real vs fake listing, a before-you-go checklist, UPI payment safety and emergency helplines.',
};

const FLAG_ICON: Record<RiskFlag, LucideIcon> = {
  'advance-fee': HandCoins,
  'no-address': MapPinOff,
  'pay-too-high': TrendingUp,
  unverified: UserX,
  vague: FileQuestion,
  'id-upfront': CreditCard,
  'far-travel': Plane,
};

const severity = (w: number) =>
  w >= 30
    ? { cls: 'chip-danger', l: { en: 'Very serious', hi: 'बहुत गंभीर', mr: 'खूप गंभीर', gu: 'ખૂબ ગંભીર' }, color: 'var(--color-danger)' }
    : w >= 15
      ? { cls: 'chip-warning', l: { en: 'Serious', hi: 'गंभीर', mr: 'गंभीर', gu: 'ગંભીર' }, color: 'var(--color-warning)' }
      : { cls: 'chip-accent', l: { en: 'Be careful', hi: 'सावधान रहें', mr: 'सावध राहा', gu: 'સાવધાન રહો' }, color: 'var(--color-accent)' };

const MAX_WEIGHT = Math.max(...Object.values(RISK).map((r) => r.weight));

const PAY_TIPS: { icon: LucideIcon; color: string; title: L; body: L }[] = [
  {
    icon: LockKeyhole,
    color: 'var(--color-danger)',
    title: { en: 'PIN is only for SENDING money', hi: 'PIN सिर्फ़ पैसे भेजने के लिए है', mr: 'PIN फक्त पैसे पाठवण्यासाठी असतो', gu: 'PIN ફક્ત પૈસા મોકલવા માટે છે' },
    body: {
      en: 'You never enter your UPI PIN to receive money. If someone says “enter PIN to get paid” — it is a scam.',
      hi: 'पैसे लेने के लिए कभी UPI PIN नहीं डालना पड़ता। कोई कहे “पैसे पाने के लिए PIN डालो” — तो यह धोखा है।',
      mr: 'पैसे घेण्यासाठी कधीच UPI PIN टाकावा लागत नाही. कोणी म्हणाले “पैसे मिळवण्यासाठी PIN टाका” — तर ही फसवणूक आहे.',
      gu: 'પૈસા લેવા માટે ક્યારેય UPI PIN નાખવો પડતો નથી. કોઈ કહે “પૈસા મેળવવા PIN નાખો” — તો આ છેતરપિંડી છે.',
    },
  },
  {
    icon: QrCode,
    color: 'var(--color-warning)',
    title: { en: 'Don’t scan a QR to receive', hi: 'पैसे लेने के लिए QR स्कैन न करें', mr: 'पैसे घेण्यासाठी QR स्कॅन करू नका', gu: 'પૈસા લેવા માટે QR સ્કૅન ન કરો' },
    body: {
      en: 'Scanning a QR code is for paying. To get paid, just share your UPI ID or mobile number.',
      hi: 'QR कोड स्कैन करना पैसे देने के लिए होता है। पैसे लेने के लिए बस अपनी UPI ID या मोबाइल नंबर बताएँ।',
      mr: 'QR कोड स्कॅन करणे पैसे देण्यासाठी असते. पैसे घेण्यासाठी फक्त तुमचा UPI ID किंवा मोबाइल नंबर सांगा.',
      gu: 'QR કોડ સ્કૅન કરવો પૈસા આપવા માટે હોય છે. પૈસા લેવા માટે બસ તમારો UPI ID કે મોબાઇલ નંબર કહો.',
    },
  },
  {
    icon: CalendarCheck,
    color: 'var(--color-success)',
    title: { en: 'Daily work = paid the same day', hi: 'दिहाड़ी = उसी दिन भुगतान', mr: 'रोजंदारी = त्याच दिवशी पैसे', gu: 'રોજનું કામ = એ જ દિવસે પૈસા' },
    body: {
      en: 'For one-day work, ask for full pay before you leave the site. That is the law, not a favour.',
      hi: 'एक दिन के काम में, साइट छोड़ने से पहले पूरी मज़दूरी माँगें। यह क़ानून है, एहसान नहीं।',
      mr: 'एका दिवसाच्या कामात, साइट सोडण्याआधी पूर्ण मजुरी मागा. हा कायदा आहे, उपकार नाही.',
      gu: 'એક દિવસના કામમાં, સાઇટ છોડતાં પહેલાં પૂરી મજૂરી માંગો. આ કાયદો છે, ઉપકાર નથી.',
    },
  },
  {
    icon: KeyRound,
    color: 'var(--color-accent)',
    title: { en: 'OTP is like your house key', hi: 'OTP आपके घर की चाबी जैसा है', mr: 'OTP म्हणजे तुमच्या घराची चावी', gu: 'OTP તમારા ઘરની ચાવી જેવો છે' },
    body: {
      en: 'Bank, police or employer will never ask for it. Don’t tell anyone — not even “for verification”.',
      hi: 'बैंक, पुलिस या मालिक कभी OTP नहीं माँगते। किसी को न बताएँ — “वेरिफ़िकेशन” के लिए भी नहीं।',
      mr: 'बँक, पोलीस किंवा मालक कधीच OTP मागत नाहीत. कोणालाही सांगू नका — “व्हेरिफिकेशन”साठीसुद्धा नाही.',
      gu: 'બેંક, પોલીસ કે માલિક ક્યારેય OTP માંગતા નથી. કોઈને ન કહો — “વેરિફિકેશન” માટે પણ નહીં.',
    },
  },
  {
    icon: Banknote,
    color: 'var(--color-brand)',
    title: { en: 'Check before you leave', hi: 'जाने से पहले जाँच लें', mr: 'निघण्याआधी तपासा', gu: 'નીકળતાં પહેલાં તપાસી લો' },
    body: {
      en: 'Count cash in front of them. For UPI, see the “money received” message on your phone first.',
      hi: 'नकद उनके सामने गिनें। UPI में, पहले अपने फ़ोन पर “पैसे मिले” का मैसेज देखें।',
      mr: 'रोख पैसे त्यांच्यासमोर मोजा. UPI असेल तर आधी तुमच्या फोनवर “पैसे मिळाले”चा मेसेज पाहा.',
      gu: 'રોકડા તેમની સામે ગણો. UPI હોય તો પહેલાં તમારા ફોન પર “પૈસા મળ્યા”નો મેસેજ જુઓ.',
    },
  },
];

const jump: { href: string; icon: LucideIcon; l: L }[] = [
  { href: '#check', icon: ShieldCheck, l: { en: 'Check a job', hi: 'काम जाँचें', mr: 'काम तपासा', gu: 'કામ તપાસો' } },
  { href: '#red-flags', icon: Flag, l: { en: 'Red flags', hi: 'ख़तरे के निशान', mr: 'धोक्याच्या खुणा', gu: 'જોખમના સંકેત' } },
  { href: '#compare', icon: ShieldAlert, l: { en: 'Real vs fake', hi: 'असली बनाम नकली', mr: 'खरे विरुद्ध खोटे', gu: 'સાચું વિરુદ્ધ નકલી' } },
  { href: '#before-you-go', icon: ListChecks, l: { en: 'Before you go', hi: 'जाने से पहले', mr: 'जाण्याआधी', gu: 'જતાં પહેલાં' } },
  { href: '#payments', icon: Wallet, l: { en: 'Safe payments', hi: 'सुरक्षित भुगतान', mr: 'सुरक्षित पेमेंट', gu: 'સુરક્ષિત પેમેન્ટ' } },
];

export default function SafetyPage() {
  const real = JOBS.find((j) => j.id === 'bathroom-pipe-repair-powai');
  const fake = JOBS.find((j) => j.id === 'urgent-dubai-visa');

  return (
    <>
      <PageHero
        tint="var(--color-danger)"
        eyebrow={<T en="Trust & safety" hi="भरोसा और सुरक्षा" mr="विश्वास आणि सुरक्षा" gu="ભરોસો અને સુરક્ષા" />}
        title={
          <T
            en={
              <>
                Check the job <span className="gradient-text">before</span> you go.
              </>
            }
            hi={
              <>
                जाने से <span className="gradient-text">पहले</span> काम जाँचें।
              </>
            }
            mr={
              <>
                जाण्याच्या <span className="gradient-text">आधी</span> काम तपासा.
              </>
            }
            gu={
              <>
                જતાં <span className="gradient-text">પહેલાં</span> કામ તપાસો.
              </>
            }
          />
        }
        lead={
          <T
            en="Fake agents target the workers who need work the most. Answer 7 simple questions to see if a job is safe — and learn the signs that protect your money, papers and family."
            hi="नकली एजेंट उन्हीं मज़दूरों को निशाना बनाते हैं जिन्हें काम की सबसे ज़्यादा ज़रूरत है। 7 आसान सवालों के जवाब दें और जानें कि काम सुरक्षित है या नहीं — और वे निशान सीखें जो आपके पैसे, कागज़ और परिवार को बचाते हैं।"
            mr="खोटे एजंट अशाच कामगारांना फसवतात ज्यांना कामाची सर्वात जास्त गरज असते. 7 सोप्या प्रश्नांची उत्तरे द्या आणि काम सुरक्षित आहे का ते पाहा — आणि तुमचे पैसे, कागदपत्रे आणि कुटुंब वाचवणाऱ्या खुणा शिका."
            gu="નકલી એજન્ટ એવા જ કામદારોને નિશાન બનાવે છે જેમને કામની સૌથી વધુ જરૂર છે. 7 સહેલા પ્રશ્નોના જવાબ આપો અને જુઓ કે કામ સુરક્ષિત છે કે નહીં — અને એવા સંકેત શીખો જે તમારા પૈસા, કાગળો અને પરિવારને બચાવે છે."
          />
        }
        aside={
          <div className={s.sos}>
            <p className={s.sosTitle}>
              <ShieldAlert aria-hidden="true" />
              <T en="Need help right now?" hi="अभी मदद चाहिए?" mr="आत्ता मदत हवी आहे?" gu="હમણાં મદદ જોઈએ છે?" />
            </p>
            <HelplineGrid compact only={['112', '1930', '181']} />
          </div>
        }
      >
        <nav className={s.jump} aria-labelledby="safety-jump">
          <span id="safety-jump" className="sr-only">
            <T en="On this page" hi="इस पेज पर" mr="या पानावर" gu="આ પેજ પર" />
          </span>
          {jump.map((j) => (
            <a key={j.href} href={j.href} className="filter-chip">
              <j.icon aria-hidden="true" />
              <Tx l={j.l} />
            </a>
          ))}
        </nav>
      </PageHero>

      {/* ───────────── Is this job safe? */}
      <section id="check" className="section" aria-labelledby="check-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Job safety check · 1 minute" hi="काम की सुरक्षा जाँच · 1 मिनट" mr="कामाची सुरक्षा तपासणी · 1 मिनिट" gu="કામની સુરક્ષા તપાસ · 1 મિનિટ" />
            </span>
            <h2 className="h2" id="check-title">
              <T en="Is this job safe?" hi="क्या यह काम सुरक्षित है?" mr="हे काम सुरक्षित आहे का?" gu="શું આ કામ સુરક્ષિત છે?" />
            </h2>
            <p className="lead">
              <T
                en="Think of the job you were offered — on the phone, at the naka or online. Tap Yes, No or Not sure. Tap the speaker to hear each question."
                hi="जो काम आपको मिला है उसके बारे में सोचें — फ़ोन पर, नाके पर या ऑनलाइन। हाँ, नहीं या पता नहीं दबाएँ। हर सवाल सुनने के लिए स्पीकर दबाएँ।"
                mr="तुम्हाला मिळालेल्या कामाचा विचार करा — फोनवर, नाक्यावर किंवा ऑनलाइन. हो, नाही किंवा माहीत नाही दाबा. प्रत्येक प्रश्न ऐकण्यासाठी स्पीकर दाबा."
                gu="તમને મળેલા કામ વિશે વિચારો — ફોન પર, નાકા પર કે ઑનલાઇન. હા, ના કે ખબર નથી દબાવો. દરેક પ્રશ્ન સાંભળવા સ્પીકર દબાવો."
              />
            </p>
          </div>
          <SafetyChecker />
        </div>
      </section>

      {/* ───────────── Red flags */}
      <section id="red-flags" className="section section-alt" aria-labelledby="flags-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Red flags" hi="ख़तरे के निशान" mr="धोक्याच्या खुणा" gu="જોખમના સંકેત" />
            </span>
            <h2 className="h2" id="flags-title">
              <T en="7 signs a job may be a trap." hi="7 निशान कि काम एक जाल हो सकता है।" mr="काम म्हणजे सापळा असू शकतो याच्या 7 खुणा." gu="કામ એક જાળ હોઈ શકે તેના 7 સંકેત." />
            </h2>
            <p className="lead">
              <T en="Naka checks every listing for these signs and shows a warning on the job card. Learn them — they work offline too." hi="नाका हर काम में ये निशान जाँचता है और कार्ड पर चेतावनी दिखाता है। इन्हें याद रखें — ये बिना इंटरनेट भी काम आते हैं।" mr="नाका प्रत्येक कामात या खुणा तपासते आणि कार्डवर इशारा दाखवते. त्या लक्षात ठेवा — इंटरनेटशिवायही उपयोगी पडतात." gu="નાકા દરેક કામમાં આ સંકેત તપાસે છે અને કાર્ડ પર ચેતવણી બતાવે છે. તેને યાદ રાખો — ઇન્ટરનેટ વગર પણ કામ આવે છે." />
            </p>
          </div>

          <ul className={s.flags}>
            {(Object.keys(RISK) as RiskFlag[])
              .sort((a, b) => RISK[b].weight - RISK[a].weight)
              .map((f, i) => {
                const r = RISK[f];
                const Icon = FLAG_ICON[f];
                const sev = severity(r.weight);
                const tile = { '--tile': sev.color } as React.CSSProperties;
                return (
                  <li key={f} className={s.flagCard} style={{ ...tile, '--d': i % 4 } as React.CSSProperties} data-reveal="">
                    <div className={s.flagTop}>
                      <span className="icon-tile lg" style={tile}>
                        <Icon aria-hidden="true" />
                      </span>
                      <ReadAloud
                        en={`${r.label.en}. ${r.why.en}`}
                        hi={`${r.label.hi}। ${r.why.hi}`}
                        mr={`${r.label.mr}. ${r.why.mr}`}
                        gu={`${r.label.gu}. ${r.why.gu}`}
                      />
                    </div>
                    <h3 className={s.flagTitle}>
                      <Tx l={r.label} />
                    </h3>
                    <p className="muted">
                      <Tx l={r.why} />
                    </p>
                    <div className={s.flagSev}>
                      <span className={`chip ${sev.cls}`}>
                        <Tx l={sev.l} />
                      </span>
                      <div className="meter" aria-hidden="true" style={{ '--meter': sev.color } as React.CSSProperties}>
                        <span style={{ transform: `scaleX(${r.weight / MAX_WEIGHT})` }} />
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </section>

      {/* ───────────── Real vs fake */}
      {real && fake && (
        <section id="compare" className="section" aria-labelledby="compare-title">
          <div className="container">
            <div className="section-head center" data-reveal="">
              <span className="eyebrow">
                <T en="Spot the difference" hi="फ़र्क़ पहचानें" mr="फरक ओळखा" gu="ફરક ઓળખો" />
              </span>
              <h2 className="h2" id="compare-title">
                <T en="A real job and a fake one, side by side." hi="एक असली और एक नकली काम, आमने-सामने।" mr="एक खरे आणि एक खोटे काम, समोरासमोर." gu="એક સાચું અને એક નકલી કામ, સામસામે." />
              </h2>
              <p className="lead">
                <T en="Both look like normal job posts. Here is what gives each one away." hi="दोनों आम काम की पोस्ट जैसे दिखते हैं। देखिए किस बात से पहचान होती है।" mr="दोन्ही साध्या कामाच्या जाहिरातीसारख्या दिसतात. कशावरून ओळखायचे ते पाहा." gu="બંને સામાન્ય કામની પોસ્ટ જેવી દેખાય છે. જુઓ કઈ વાતથી ઓળખાય છે." />
              </p>
            </div>

            <div className={s.compare}>
              <CompareColumn job={real} kind="real" />
              <span className={s.vs} aria-hidden="true">
                VS
              </span>
              <CompareColumn job={fake} kind="fake" />
            </div>
          </div>
        </section>
      )}

      {/* ───────────── Before you go */}
      <section id="before-you-go" className="section section-alt" aria-labelledby="go-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Before you go" hi="जाने से पहले" mr="जाण्याआधी" gu="જતાં પહેલાં" />
            </span>
            <h2 className="h2" id="go-title">
              <T en="Six small habits that keep you safe." hi="छह छोटी आदतें जो आपको सुरक्षित रखती हैं।" mr="तुम्हाला सुरक्षित ठेवणाऱ्या सहा छोट्या सवयी." gu="તમને સુરક્ષિત રાખતી છ નાની ટેવો." />
            </h2>
          </div>
          <div className={s.goGrid}>
            <BeforeYouGo />
            {real && <WorkPromise job={real} />}
          </div>
        </div>
      </section>

      {/* ───────────── Payment safety */}
      <section id="payments" className="section" aria-labelledby="pay-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Payment safety" hi="भुगतान की सुरक्षा" mr="पैशांची सुरक्षा" gu="પૈસાની સુરક્ષા" />
            </span>
            <h2 className="h2" id="pay-title">
              <T en="Get paid in full. Don’t lose it to a trick." hi="पूरा पैसा पाएँ। किसी चाल में न गँवाएँ।" mr="पूर्ण पैसे मिळवा. कोणत्याही युक्तीत गमावू नका." gu="પૂરા પૈસા મેળવો. કોઈ ચાલાકીમાં ગુમાવશો નહીં." />
            </h2>
          </div>
          <ul className={s.tips}>
            {PAY_TIPS.map((tip, i) => {
              const tile = { '--tile': tip.color } as React.CSSProperties;
              return (
                <li key={tip.title.en} className={s.tip} style={{ ...tile, '--d': i % 3 } as React.CSSProperties} data-reveal="">
                  <span className="icon-tile" style={tile}>
                    <tip.icon aria-hidden="true" />
                  </span>
                  <h3 className={s.tipTitle}>
                    <Tx l={tip.title} />
                  </h3>
                  <p className="muted">
                    <Tx l={tip.body} />
                  </p>
                </li>
              );
            })}
            <li className={`${s.tip} ${s.tipCta}`} data-reveal="" style={{ '--d': 2 } as React.CSSProperties}>
              <span className={s.ctaIcon}>
                <NotebookPen aria-hidden="true" />
              </span>
              <h3 className={s.tipTitle}>
                <T en="Write every payment in your work diary" hi="हर भुगतान अपनी काम डायरी में लिखें" mr="मिळालेला प्रत्येक पैसा कामाच्या डायरीत लिहा" gu="દરેક ચુકવણી તમારી કામની ડાયરીમાં લખો" />
              </h3>
              <p>
                <T
                  en="Your diary shows who still owes you — and becomes proof of work for welfare boards and loans."
                  hi="डायरी बताती है कि किसका पैसा बाक़ी है — और कल्याण बोर्ड व कर्ज़ के लिए काम का सबूत बनती है।"
                  mr="डायरी सांगते कोणाकडे पैसे बाकी आहेत — आणि कल्याण मंडळ व कर्जासाठी कामाचा पुरावा बनते."
                  gu="ડાયરી બતાવે છે કે કોની પાસે પૈસા બાકી છે — અને કલ્યાણ બોર્ડ અને લોન માટે કામનો પુરાવો બને છે."
                />
              </p>
              <Link href="/my-work" className={`btn ${s.ctaBtn}`}>
                <T en="Open my work diary" hi="मेरी काम डायरी खोलें" mr="माझी कामाची डायरी उघडा" gu="મારી કામની ડાયરી ખોલો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ───────────── Emergency helplines */}
      <section id="helplines" className="section-tight section-alt" aria-labelledby="help-title">
        <div className="container">
          <div className={s.helpHead} data-reveal="">
            <h2 className="h3" id="help-title">
              <T en="Emergency & help lines — tap to call, free" hi="आपातकाल और मदद की लाइनें — टैप करके कॉल करें, मुफ़्त" mr="आणीबाणी आणि मदतीचे नंबर — टॅप करून कॉल करा, मोफत" gu="ઇમરજન્સી અને મદદની લાઇન — ટૅપ કરીને કૉલ કરો, મફત" />
            </h2>
            <Link href="/rights#help" className="btn btn-sm btn-ghost">
              <T en="What to do if you are not paid" hi="पैसा न मिले तो क्या करें" mr="पैसे मिळाले नाहीत तर काय करावे" gu="પૈસા ન મળે તો શું કરવું" />
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <HelplineGrid compact />
        </div>
      </section>
    </>
  );
}

/* ── Annotated comparison column ─────────────────────────────────────────── */
function CompareColumn({ job, kind }: { job: Job; kind: 'real' | 'fake' }) {
  const score = trustScore(job.flags, job.employer.verified);
  const level = trustLevel(score);
  const trade = TRADE[job.trade];
  const [lo, hi] = trade.fair;
  const isReal = kind === 'real';

  type Note = { good: boolean; title: L; body?: L };
  const notes: Note[] = [];

  if (isReal) {
    if (job.employer.verified)
      notes.push({
        good: true,
        title: { en: 'Employer is verified', hi: 'मालिक वेरिफ़ाइड है', mr: 'मालक व्हेरिफाइड आहे', gu: 'માલિક વેરિફાઇડ છે' },
        body: {
          en: `★ ${job.employer.rating} from ${job.employer.reviews} reviews · ${job.employer.hires} hires on Naka`,
          hi: `★ ${job.employer.rating}, ${job.employer.reviews} रिव्यू · नाका पर ${job.employer.hires} बार काम दिया`,
          mr: `★ ${job.employer.rating}, ${job.employer.reviews} रिव्ह्यू · नाका वर ${job.employer.hires} वेळा काम दिले`,
          gu: `★ ${job.employer.rating}, ${job.employer.reviews} રિવ્યૂ · નાકા પર ${job.employer.hires} વાર કામ આપ્યું`,
        },
      });
    notes.push({
      good: true,
      title: { en: 'Exact place is given', hi: 'सही जगह बताई गई है', mr: 'नेमकी जागा सांगितली आहे', gu: 'ચોક્કસ જગ્યા કહી છે' },
      body: {
        en: `${job.area.en} — ${job.landmark.en}`,
        hi: `${job.area.hi} — ${job.landmark.hi}`,
        mr: `${job.area.mr} — ${job.landmark.mr}`,
        gu: `${job.area.gu} — ${job.landmark.gu}`,
      },
    });
    const fair = job.pay.amount >= lo && job.pay.amount <= hi;
    notes.push({
      good: fair,
      title: fair ? { en: 'Pay is fair, not “too good”', hi: 'मज़दूरी सही है, “बहुत ज़्यादा” नहीं', mr: 'मजुरी योग्य आहे, “खूप जास्त” नाही', gu: 'મજૂરી યોગ્ય છે, “ખૂબ વધારે” નહીં' } : { en: 'Check the pay', hi: 'मज़दूरी जाँचें', mr: 'मजुरी तपासा', gu: 'મજૂરી તપાસો' },
      body: {
        en: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en} — usual for a ${trade.name.en.toLowerCase()} is ${rupee(lo)}–${rupee(hi)}`,
        hi: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].hi} — ${trade.name.hi} का आम रेट ${rupee(lo)}–${rupee(hi)} है`,
        mr: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].mr} — ${trade.name.mr} साठी नेहमीचा दर ${rupee(lo)}–${rupee(hi)} आहे`,
        gu: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].gu} — ${trade.name.gu} માટે સામાન્ય ભાવ ${rupee(lo)}–${rupee(hi)} છે`,
      },
    });
    notes.push({
      good: true,
      title: { en: 'Hours and payday are clear', hi: 'घंटे और भुगतान का दिन साफ़ है', mr: 'तास आणि पैसे मिळण्याचा दिवस स्पष्ट आहे', gu: 'કલાક અને પૈસા મળવાનો દિવસ ચોખ્ખો છે' },
      body: {
        en: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].en} · ${job.payMode.map((m) => PAY_MODE[m].en).join(' / ')}`,
        hi: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].hi} · ${job.payMode.map((m) => PAY_MODE[m].hi).join(' / ')}`,
        mr: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].mr} · ${job.payMode.map((m) => PAY_MODE[m].mr).join(' / ')}`,
        gu: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].gu} · ${job.payMode.map((m) => PAY_MODE[m].gu).join(' / ')}`,
      },
    });
    if (job.flags.length === 0)
      notes.push({ good: true, title: { en: 'No fee. No documents asked.', hi: 'कोई फ़ीस नहीं। कोई कागज़ नहीं माँगा।', mr: 'फी नाही. कोणतेही कागदपत्र मागितले नाही.', gu: 'કોઈ ફી નહીં. કોઈ કાગળ માંગ્યા નથી.' } });
  } else {
    const times = Math.round((job.pay.amount / hi) * 10) / 10;
    for (const f of job.flags) {
      if (f === 'pay-too-high') {
        notes.push({
          good: false,
          title: RISK[f].label,
          body: {
            en: `${rupee(job.pay.amount)} a day is ${times}× the top usual rate (${rupee(hi)}) for a ${trade.name.en.toLowerCase()}.`,
            hi: `${rupee(job.pay.amount)} रोज़, ${trade.name.hi} के सबसे ऊँचे आम रेट (${rupee(hi)}) का ${times} गुना है।`,
            mr: `रोज ${rupee(job.pay.amount)} म्हणजे ${trade.name.mr} च्या सर्वात जास्त नेहमीच्या दराच्या (${rupee(hi)}) ${times} पट.`,
            gu: `રોજના ${rupee(job.pay.amount)}, ${trade.name.gu}ના સૌથી ઊંચા સામાન્ય ભાવ (${rupee(hi)}) કરતાં ${times} ગણા છે.`,
          },
        });
      } else {
        notes.push({ good: false, title: RISK[f].label, body: RISK[f].why });
      }
    }
  }

  const Verdict = isReal ? ShieldCheck : ShieldAlert;
  return (
    <div className={`${s.col} ${isReal ? s.colReal : s.colFake}`}>
      <div className={s.colHead} data-reveal="">
        <span className={s.verdictIcon} aria-hidden="true">
          <Verdict />
        </span>
        <div>
          <p className={s.verdict}>{isReal ? <T en="Real job" hi="असली काम" mr="खरे काम" gu="સાચું કામ" /> : <T en="Fake job — a trap" hi="नकली काम — एक जाल" mr="खोटे काम — एक सापळा" gu="નકલી કામ — એક જાળ" />}</p>
          <p className={s.verdictScore}>
            <T en="Trust score" hi="भरोसा अंक" mr="विश्वास गुण" gu="ભરોસા ગુણ" />{' '}
            <b className="money">
              <span data-count={score}>{score}</span>/100
            </b>
            <span className={`chip ${level === 'safe' ? 'chip-success' : level === 'check' ? 'chip-warning' : 'chip-danger'}`}>
              {level === 'safe' ? <T en="Looks safe" hi="सुरक्षित लगता है" mr="सुरक्षित वाटते" gu="સુરક્ષિત લાગે છે" /> : level === 'check' ? <T en="Check first" hi="पहले जाँचें" mr="आधी तपासा" gu="પહેલાં તપાસો" /> : <T en="Risky" hi="ख़तरा" mr="धोका" gu="જોખમ" />}
            </span>
          </p>
        </div>
      </div>

      <JobCard job={job} />

      {!isReal && (
        <blockquote className={s.quote} data-reveal="">
          <Quote aria-hidden="true" />
          <p>
            <Tx l={job.description} />
          </p>
        </blockquote>
      )}

      <ol className={s.notes}>
        {notes.map((n, i) => (
          <li key={n.title.en} className={n.good ? s.noteGood : s.noteBad} data-reveal="" style={{ '--d': i } as React.CSSProperties}>
            <span className={s.noteIcon} aria-hidden="true">
              {n.good ? <CircleCheck /> : <CircleX />}
            </span>
            <span className={s.noteText}>
              <b>
                <Tx l={n.title} />
              </b>
              {n.body && (
                <span>
                  <Tx l={n.body} />
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Sample Work Promise, filled from the real job ───────────────────────── */
function WorkPromise({ job }: { job: Job }) {
  const rows: { icon: LucideIcon; k: L; v: L }[] = [
    { icon: BadgeCheck, k: { en: 'Work', hi: 'काम', mr: 'काम', gu: 'કામ' }, v: job.title },
    {
      icon: MapPin,
      k: { en: 'Place', hi: 'जगह', mr: 'जागा', gu: 'જગ્યા' },
      v: {
        en: `${job.area.en}, ${job.landmark.en}`,
        hi: `${job.area.hi}, ${job.landmark.hi}`,
        mr: `${job.area.mr}, ${job.landmark.mr}`,
        gu: `${job.area.gu}, ${job.landmark.gu}`,
      },
    },
    {
      icon: Clock,
      k: { en: 'Hours', hi: 'समय', mr: 'वेळ', gu: 'સમય' },
      v: {
        en: `${job.start.en}, ${job.hours.start} – ${job.hours.end}`,
        hi: `${job.start.hi}, ${job.hours.start} – ${job.hours.end}`,
        mr: `${job.start.mr}, ${job.hours.start} – ${job.hours.end}`,
        gu: `${job.start.gu}, ${job.hours.start} – ${job.hours.end}`,
      },
    },
    {
      icon: IndianRupee,
      k: { en: 'Pay', hi: 'मज़दूरी', mr: 'मजुरी', gu: 'મજૂરી' },
      v: {
        en: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en}`,
        hi: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].hi}`,
        mr: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].mr}`,
        gu: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].gu}`,
      },
    },
    {
      icon: CalendarCheck,
      k: { en: 'Payday', hi: 'भुगतान', mr: 'पैशाचा दिवस', gu: 'પૈસાનો દિવસ' },
      v: {
        en: `${PAID_WHEN[job.paidWhen].en} · ${job.payMode.map((m) => PAY_MODE[m].en).join(' / ')}`,
        hi: `${PAID_WHEN[job.paidWhen].hi} · ${job.payMode.map((m) => PAY_MODE[m].hi).join(' / ')}`,
        mr: `${PAID_WHEN[job.paidWhen].mr} · ${job.payMode.map((m) => PAY_MODE[m].mr).join(' / ')}`,
        gu: `${PAID_WHEN[job.paidWhen].gu} · ${job.payMode.map((m) => PAY_MODE[m].gu).join(' / ')}`,
      },
    },
  ];
  if (job.perks.length)
    rows.push({
      icon: Handshake,
      k: { en: 'Also', hi: 'साथ में', mr: 'सोबत', gu: 'સાથે' },
      v: {
        en: job.perks.map((p) => PERKS[p].en).join(', '),
        hi: job.perks.map((p) => PERKS[p].hi).join(', '),
        mr: job.perks.map((p) => PERKS[p].mr).join(', '),
        gu: job.perks.map((p) => PERKS[p].gu).join(', '),
      },
    });

  return (
    <aside className={s.promise} data-reveal="right" aria-labelledby="promise-title">
      <div className={s.promiseHead}>
        <span className="icon-tile" style={{ '--tile': 'var(--color-success)' } as React.CSSProperties}>
          <Handshake aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">
            <T en="Example" hi="उदाहरण" mr="उदाहरण" gu="ઉદાહરણ" />
          </p>
          <h3 className={s.promiseTitle} id="promise-title">
            <T en="Work Promise" hi="काम का वादा" mr="कामाचे वचन" gu="કામનું વચન" />
          </h3>
        </div>
      </div>
      <dl className={s.promiseRows}>
        {rows.map((r) => (
          <div key={r.k.en}>
            <dt>
              <r.icon aria-hidden="true" />
              <Tx l={r.k} />
            </dt>
            <dd>
              <Tx l={r.v} />
            </dd>
          </div>
        ))}
      </dl>
      <div className={s.signs}>
        <p>
          <CircleCheck aria-hidden="true" />
          <span>
            <b>{job.employer.name}</b>
            <span className="subtle">
              <T en="Employer agreed" hi="मालिक ने माना" mr="मालकाने मान्य केले" gu="માલિકે માન્યું" />
            </span>
          </span>
        </p>
        <p>
          <CircleCheck aria-hidden="true" />
          <span>
            <b>
              <T en="You" hi="आप" mr="तुम्ही" gu="તમે" />
            </b>
            <span className="subtle">
              <T en="Worker agreed" hi="मज़दूर ने माना" mr="कामगाराने मान्य केले" gu="કામદારે માન્યું" />
            </span>
          </span>
        </p>
      </div>
      <p className={s.stamp} aria-hidden="true">
        <T en="Both agreed" hi="दोनों राज़ी" mr="दोघे तयार" gu="બંને સંમત" />
      </p>
      <p className="subtle">
        <T
          en="When you accept a job on Naka, both sides confirm this before work starts. If pay is late, it is your proof."
          hi="नाका पर काम लेते समय, दोनों पक्ष काम शुरू होने से पहले यह पक्का करते हैं। पैसा देर से मिले तो यही आपका सबूत है।"
          mr="नाका वर काम घेताना, काम सुरू होण्याआधी दोघेही हे पक्के करतात. पैसे उशिरा मिळाले तर हाच तुमचा पुरावा आहे."
          gu="નાકા પર કામ લેતી વખતે, કામ શરૂ થતાં પહેલાં બંને પક્ષ આ પાકું કરે છે. પૈસા મોડા મળે તો આ જ તમારો પુરાવો છે."
        />
      </p>
    </aside>
  );
}
