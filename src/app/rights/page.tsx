import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarCheck,
  FolderCheck,
  Gavel,
  HardHat,
  IndianRupee,
  Info,
  Landmark,
  LockKeyholeOpen,
  MessageCircle,
  NotebookPen,
  PhoneCall,
  Scale,
  ShieldUser,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import ReadAloud from '@/components/ReadAloud';
import { T, Tx } from '@/components/T';
import SchemeExplorer from '@/components/rights/SchemeExplorer';
import DocChecklist from '@/components/rights/DocChecklist';
import HelplineGrid from '@/components/rights/HelplineGrid';
import { RIGHTS } from '@/data/schemes';
import type { L } from '@/data/types';
import s from './rights.module.css';

export const metadata: Metadata = {
  title: 'Rights & support',
  description:
    'Government schemes for daily-wage workers in plain words — e-Shram, Ayushman Bharat, pension, accident cover, ration — the papers you need, your rights at work and free helplines.',
};

const RIGHT_ICONS: { icon: LucideIcon; color: string }[] = [
  { icon: IndianRupee, color: 'var(--color-success)' },
  { icon: CalendarCheck, color: 'var(--color-brand)' },
  { icon: Timer, color: 'var(--color-accent)' },
  { icon: HardHat, color: 'var(--trade-labour)' },
  { icon: LockKeyholeOpen, color: 'var(--color-trust)' },
  { icon: ShieldUser, color: 'var(--trade-painter)' },
];

const FACTS: { href: string; big: L; small: L; color: string }[] = [
  {
    href: '#pmsby',
    big: { en: '₹20 / year', hi: '₹20 / साल', mr: '₹20 / वर्ष', gu: '₹20 / વર્ષ' },
    small: { en: 'gets your family ₹2 lakh accident cover', hi: 'में परिवार को ₹2 लाख का दुर्घटना बीमा', mr: 'भरून कुटुंबाला ₹2 लाखांचा अपघात विमा', gu: 'ભરીને પરિવારને ₹2 લાખનો અકસ્માત વીમો' },
    color: 'var(--color-trust)',
  },
  {
    href: '#pm-jay',
    big: { en: '₹5 lakh', hi: '₹5 लाख', mr: '₹5 लाख', gu: '₹5 લાખ' },
    small: { en: 'free hospital treatment every year', hi: 'तक हर साल मुफ़्त अस्पताल इलाज', mr: 'पर्यंत दरवर्षी हॉस्पिटलमध्ये मोफत उपचार', gu: 'સુધી દર વર્ષે મફત હૉસ્પિટલ સારવાર' },
    color: 'var(--color-danger)',
  },
  {
    href: '#pm-sym',
    big: { en: '₹3,000 / month', hi: '₹3,000 / महीना', mr: '₹3,000 / महिना', gu: '₹3,000 / મહિનો' },
    small: { en: 'pension after age 60', hi: '60 की उम्र के बाद पेंशन', mr: '60 वर्षांनंतर पेन्शन', gu: '60 વર્ષની ઉંમર પછી પેન્શન' },
    color: 'var(--trade-painter)',
  },
];

const GRIEVANCE: { icon: LucideIcon; title: L; body: L; color: string; action?: { href: string; label: L; tel?: boolean } }[] = [
  {
    icon: MessageCircle,
    color: 'var(--color-brand)',
    title: { en: 'Talk', hi: 'बात करें', mr: 'बोलून बघा', gu: 'વાત કરો' },
    body: {
      en: 'Ask the employer calmly for your money. Take a co-worker or naka leader along as a witness.',
      hi: 'मालिक से शांति से अपने पैसे माँगें। किसी साथी मज़दूर या नाका प्रमुख को गवाह के तौर पर साथ ले जाएँ।', mr: 'मालकाकडे शांतपणे तुमचे पैसे मागा. सोबत एखादा साथीदार कामगार किंवा नाका प्रमुख साक्षीदार म्हणून न्या.', gu: 'માલિક પાસે શાંતિથી તમારા પૈસા માગો. સાથે કોઈ સાથી કામદાર કે નાકાના આગેવાનને સાક્ષી તરીકે લઈ જાઓ.',
      mr: 'मालकाकडे शांतपणे तुमचे पैसे मागा. सोबत एखादा साथीदार कामगार किंवा नाका प्रमुख साक्षीदार म्हणून न्या.',
      gu: 'માલિક પાસે શાંતિથી તમારા પૈસા માગો. સાથે કોઈ સાથી કામદાર કે નાકાના આગેવાનને સાક્ષી તરીકે લઈ જાઓ.',
    },
  },
  {
    icon: NotebookPen,
    color: 'var(--color-accent)',
    title: { en: 'Record', hi: 'लिखकर रखें', mr: 'लिहून ठेवा', gu: 'લખીને રાખો' },
    body: {
      en: 'Write down the dates, hours and money owed. Keep photos, call logs and UPI screenshots.',
      hi: 'तारीख़, घंटे और बकाया पैसा लिख लें। फ़ोटो, कॉल रिकॉर्ड और UPI के स्क्रीनशॉट संभालकर रखें।', mr: 'तारखा, तास आणि बाकी पैसे लिहून ठेवा. फोटो, कॉल रेकॉर्ड आणि UPI चे स्क्रीनशॉट जपून ठेवा.', gu: 'તારીખો, કલાકો અને બાકી પૈસા લખી લો. ફોટા, કૉલ રેકોર્ડ અને UPIના સ્ક્રીનશૉટ સાચવીને રાખો.',
      mr: 'तारखा, तास आणि बाकी पैसे लिहून ठेवा. फोटो, कॉल रेकॉर्ड आणि UPI चे स्क्रीनशॉट जपून ठेवा.',
      gu: 'તારીખો, કલાકો અને બાકી પૈસા લખી લો. ફોટા, કૉલ રેકોર્ડ અને UPIના સ્ક્રીનશૉટ સાચવીને રાખો.',
    },
    action: { href: '/my-work', label: { en: 'Open work diary', hi: 'काम डायरी खोलें', mr: 'कामाची डायरी उघडा', gu: 'કામની ડાયરી ખોલો' } },
  },
  {
    icon: PhoneCall,
    color: 'var(--color-trust)',
    title: { en: 'Call a helpline', hi: 'हेल्पलाइन पर कॉल करें', mr: 'हेल्पलाइनला कॉल करा', gu: 'હેલ્પલાઇન પર કૉલ કરો' },
    body: {
      en: 'Call free legal aid on 15100. They explain your options in Hindi and your language.',
      hi: 'मुफ़्त क़ानूनी मदद 15100 पर कॉल करें। वे हिंदी और आपकी भाषा में रास्ता बताते हैं।', mr: 'मोफत कायदेशीर मदतीसाठी 15100 वर कॉल करा. ते हिंदीत आणि तुमच्या भाषेत मार्ग सांगतात.', gu: 'મફત કાનૂની મદદ માટે 15100 પર કૉલ કરો. તેઓ હિન્દીમાં અને તમારી ભાષામાં રસ્તો બતાવે છે.',
      mr: 'मोफत कायदेशीर मदतीसाठी 15100 वर कॉल करा. ते हिंदीत आणि तुमच्या भाषेत मार्ग सांगतात.',
      gu: 'મફત કાનૂની મદદ માટે 15100 પર કૉલ કરો. તેઓ હિન્દીમાં અને તમારી ભાષામાં રસ્તો બતાવે છે.',
    },
    action: { href: 'tel:15100', label: { en: 'Call 15100', hi: '15100 पर कॉल करें', mr: '15100 वर कॉल करा', gu: '15100 પર કૉલ કરો' }, tel: true },
  },
  {
    icon: Gavel,
    color: 'var(--color-success)',
    title: { en: 'Free legal aid', hi: 'मुफ़्त क़ानूनी मदद', mr: 'मोफत कायदेशीर मदत', gu: 'મફત કાનૂની મદદ' },
    body: {
      en: 'Go to the Legal Services office (DLSA) at your district court, or the Labour office. A lawyer is free for workers.',
      hi: 'अपने ज़िला न्यायालय में विधिक सेवा कार्यालय (DLSA) या श्रम कार्यालय जाएँ। मज़दूरों के लिए वकील मुफ़्त है।', mr: 'तुमच्या जिल्हा न्यायालयातील विधी सेवा कार्यालयात (DLSA) किंवा कामगार कार्यालयात जा. कामगारांसाठी वकील मोफत असतो.', gu: 'તમારી જિલ્લા કોર્ટમાં કાનૂની સેવા કચેરી (DLSA) અથવા શ્રમ કચેરીમાં જાઓ. કામદારો માટે વકીલ મફત છે.',
      mr: 'तुमच्या जिल्हा न्यायालयातील विधी सेवा कार्यालयात (DLSA) किंवा कामगार कार्यालयात जा. कामगारांसाठी वकील मोफत असतो.',
      gu: 'તમારી જિલ્લા કોર્ટમાં કાનૂની સેવા કચેરી (DLSA) અથવા શ્રમ કચેરીમાં જાઓ. કામદારો માટે વકીલ મફત છે.',
    },
  },
];

const jump: { href: string; icon: LucideIcon; l: L }[] = [
  { href: '#schemes', icon: Landmark, l: { en: 'Schemes', hi: 'योजनाएँ', mr: 'योजना', gu: 'યોજનાઓ' } },
  { href: '#documents', icon: FolderCheck, l: { en: 'My papers', hi: 'मेरे कागज़', mr: 'माझी कागदपत्रे', gu: 'મારા દસ્તાવેજ' } },
  { href: '#rights', icon: Scale, l: { en: 'My rights', hi: 'मेरे अधिकार', mr: 'माझे हक्क', gu: 'મારા અધિકાર' } },
  { href: '#help', icon: PhoneCall, l: { en: 'Get help', hi: 'मदद पाएँ', mr: 'मदत मिळवा', gu: 'મદદ મેળવો' } },
];

export default function RightsPage() {
  return (
    <>
      <PageHero
        tint="var(--color-trust)"
        eyebrow={<T en="Rights & support" hi="अधिकार और सहायता" mr="हक्क आणि मदत" gu="અધિકાર અને સહાય" />}
        title={
          <T
            en={
              <>
                Your work has <span className="gradient-text">rights.</span> Your family has support.
              </>
            }
            hi={
              <>
                आपके काम के <span className="gradient-text">अधिकार</span> हैं। परिवार के लिए सहायता है।
              </>
            }
          />
        }
        lead={
          <T
            en="Government schemes and labour laws in plain words — what you get, which papers to carry, where to go, and who to call when something goes wrong."
            hi="सरकारी योजनाएँ और श्रम क़ानून आसान शब्दों में — क्या मिलेगा, कौन से कागज़ ले जाएँ, कहाँ जाएँ, और कुछ गड़बड़ हो तो किसे फ़ोन करें।"
            mr="सरकारी योजना आणि कामगार कायदे सोप्या शब्दांत — काय मिळेल, कोणती कागदपत्रे न्यायची, कुठे जायचे, आणि काही चुकले तर कोणाला फोन करायचा."
            gu="સરકારી યોજનાઓ અને શ્રમ કાયદા સરળ શબ્દોમાં — શું મળશે, કયા દસ્તાવેજ લઈ જવા, ક્યાં જવું, અને કંઈ ખોટું થાય તો કોને ફોન કરવો."
          />
        }
        aside={
          <div className={s.facts} data-tilt="">
            <p className={s.factsHead}>
              <T en="Did you know?" hi="क्या आप जानते हैं?" mr="तुम्हाला माहीत आहे का?" gu="શું તમે જાણો છો?" />
            </p>
            <ul>
              {FACTS.map((f) => (
                <li key={f.href} style={{ '--tile': f.color } as React.CSSProperties}>
                  <a href={f.href}>
                    <span className={`money ${s.factBig}`}>
                      <Tx l={f.big} />
                    </span>
                    <span className={s.factSmall}>
                      <Tx l={f.small} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <nav className={s.jump} aria-labelledby="rights-jump">
          <span id="rights-jump" className="sr-only">
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

      {/* ───────────── Schemes: need picker → eligibility → cards */}
      <section id="schemes" className="section">
        <div className="container">
          <SchemeExplorer />
        </div>
      </section>

      {/* ───────────── My documents */}
      <section id="documents" className="section section-alt" aria-labelledby="docs-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Step 2 · Get your papers ready" hi="कदम 2 · अपने कागज़ तैयार करें" mr="पायरी 2 · तुमची कागदपत्रे तयार ठेवा" gu="પગલું 2 · તમારા દસ્તાવેજ તૈયાર રાખો" />
            </span>
            <h2 className="h2" id="docs-title">
              <T en="My documents checklist" hi="मेरे कागज़ों की सूची" mr="माझ्या कागदपत्रांची यादी" gu="મારા દસ્તાવેજોની યાદી" />
            </h2>
            <p className="lead">
              <T
                en="Most schemes need the same few papers. Tick what you have — the rest, you can get made at an Aadhaar centre, bank or CSC."
                hi="ज़्यादातर योजनाओं में वही कुछ कागज़ लगते हैं। जो आपके पास हैं उन पर निशान लगाएँ — बाक़ी आधार केंद्र, बैंक या CSC पर बनवा सकते हैं।"
                mr="बहुतेक योजनांसाठी तीच काही कागदपत्रे लागतात. तुमच्याकडे असलेल्यांवर खूण करा — बाकीची आधार केंद्र, बँक किंवा CSC मध्ये काढून घेता येतात."
                gu="મોટાભાગની યોજનાઓમાં એ જ થોડા દસ્તાવેજ જોઈએ છે. તમારી પાસે હોય તેના પર ટિક કરો — બાકીના આધાર કેન્દ્ર, બેંક કે CSC પર બનાવડાવી શકો છો."
              />
            </p>
          </div>
          <DocChecklist />
        </div>
      </section>

      {/* ───────────── Know your rights */}
      <section id="rights" className="section" aria-labelledby="rights-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Know your rights" hi="अपने अधिकार जानें" mr="तुमचे हक्क जाणून घ्या" gu="તમારા અધિકાર જાણો" />
            </span>
            <h2 className="h2" id="rights-title">
              <T en="The law is on your side." hi="क़ानून आपके साथ है।" mr="कायदा तुमच्या बाजूने आहे." gu="કાયદો તમારી સાથે છે." />
            </h2>
            <p className="lead">
              <T
                en="These rules protect daily-wage work too — paid in cash or UPI, with or without a written contract."
                hi="ये नियम दिहाड़ी काम पर भी लागू होते हैं — नकद या UPI से भुगतान हो, लिखित समझौता हो या न हो।"
                mr="हे नियम रोजंदारीच्या कामालाही लागू होतात — पैसे रोख मिळोत की UPI ने, लेखी करार असो वा नसो."
                gu="આ નિયમો રોજમદારી કામને પણ લાગુ પડે છે — ચુકવણી રોકડમાં થાય કે UPIથી, લેખિત કરાર હોય કે ન હોય."
              />
            </p>
          </div>

          <ul className={s.rightsGrid}>
            {RIGHTS.map((r, i) => {
              const meta = RIGHT_ICONS[i % RIGHT_ICONS.length];
              const Icon = meta.icon;
              const tile = { '--tile': meta.color } as React.CSSProperties;
              return (
                <li key={r.title.en} className={s.rightCard} style={{ ...tile, '--d': i % 3 } as React.CSSProperties} data-reveal="">
                  <div className={s.rightTop}>
                    <span className="icon-tile lg" style={tile}>
                      <Icon aria-hidden="true" />
                    </span>
                    <span className={s.rightN} aria-hidden="true">
                      0{i + 1}
                    </span>
                    <ReadAloud en={`${r.title.en}. ${r.body.en}`} hi={`${r.title.hi}। ${r.body.hi}`} />
                  </div>
                  <h3 className="h3">
                    <Tx l={r.title} />
                  </h3>
                  <p className="muted">
                    <Tx l={r.body} />
                  </p>
                  <span className={`chip ${s.law}`}>
                    <Scale aria-hidden="true" />
                    {r.law}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────────── Grievance routes + helplines */}
      <section id="help" className="section section-alt" aria-labelledby="help-title">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="When something goes wrong" hi="जब कुछ गड़बड़ हो" mr="काही चुकीचे घडले तर" gu="જ્યારે કંઈ ખોટું થાય" />
            </span>
            <h2 className="h2" id="help-title">
              <T en="Not paid? Cheated? Hurt at work? Do this, in order." hi="पैसा नहीं मिला? धोखा हुआ? काम पर चोट लगी? यह करें, इसी क्रम में।" mr="पैसे मिळाले नाहीत? फसवणूक झाली? कामावर दुखापत झाली? हे करा, याच क्रमाने." gu="પૈસા ન મળ્યા? છેતરપિંડી થઈ? કામ પર ઈજા થઈ? આ કરો, આ જ ક્રમમાં." />
            </h2>
          </div>

          <ol className={s.flow}>
            {GRIEVANCE.map((g, i) => {
              const tile = { '--tile': g.color } as React.CSSProperties;
              return (
                <li key={g.title.en} className={s.flowStep} style={{ ...tile, '--d': i } as React.CSSProperties} data-reveal="">
                  <div className={s.flowTop}>
                    <span className={s.flowNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="icon-tile" style={tile}>
                      <g.icon aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="h3">
                    <Tx l={g.title} />
                  </h3>
                  <p className="muted">
                    <Tx l={g.body} />
                  </p>
                  {g.action &&
                    (g.action.tel ? (
                      <a href={g.action.href} className={`btn btn-sm btn-primary ${s.flowAction}`}>
                        <PhoneCall aria-hidden="true" />
                        <Tx l={g.action.label} />
                      </a>
                    ) : (
                      <Link href={g.action.href} className={`btn btn-sm ${s.flowAction}`}>
                        <NotebookPen aria-hidden="true" />
                        <Tx l={g.action.label} />
                      </Link>
                    ))}
                </li>
              );
            })}
          </ol>

          <div className={s.helpHead} data-reveal="">
            <h3 className="h3">
              <T en="Free helplines — tap a card to call" hi="मुफ़्त हेल्पलाइन — कॉल करने के लिए कार्ड पर टैप करें" mr="मोफत हेल्पलाइन — कॉल करण्यासाठी कार्डवर टॅप करा" gu="મફત હેલ્પલાઇન — કૉલ કરવા માટે કાર્ડ પર ટૅપ કરો" />
            </h3>
            <p className="muted">
              <T en="All calls are free. Lines work 24×7 unless stated." hi="सभी कॉल मुफ़्त हैं। ज़्यादातर लाइनें 24 घंटे चालू रहती हैं।" mr="सगळे कॉल मोफत आहेत. बहुतेक लाइन 24 तास चालू असतात." gu="બધા કૉલ મફત છે. મોટાભાગની લાઇન 24 કલાક ચાલુ રહે છે." />
            </p>
          </div>
          <HelplineGrid />
        </div>
      </section>

      {/* ───────────── Disclaimer */}
      <section className="section-tight">
        <div className="container">
          <div className={`callout callout-warning ${s.disclaimer}`} role="note" data-reveal="">
            <Info aria-hidden="true" />
            <div className="stack">
              <p className={s.disclaimerTitle}>
                <T en="Please confirm before you apply" hi="आवेदन से पहले पक्का कर लें" mr="अर्ज करण्याआधी खात्री करून घ्या" gu="અરજી કરતાં પહેલાં ખાતરી કરી લો" />
              </p>
              <p>
                <T
                  en="This page is a simplified guide. Amounts and rules change and can differ by state. Always confirm on the official website or at your nearest CSC (Common Service Centre)."
                  hi="यह पेज एक आसान गाइड है। रकम और नियम बदलते रहते हैं और हर राज्य में अलग हो सकते हैं। हमेशा सरकारी वेबसाइट या पास के CSC (कॉमन सर्विस सेंटर) पर पक्का करें।"
                  mr="हे पान एक सोपी माहिती आहे. रक्कम आणि नियम बदलत असतात आणि प्रत्येक राज्यात वेगळे असू शकतात. नेहमी सरकारी वेबसाइटवर किंवा जवळच्या CSC (सेवा केंद्र) मध्ये खात्री करा."
                  gu="આ પેજ એક સરળ માર્ગદર્શિકા છે. રકમ અને નિયમો બદલાતા રહે છે અને દરેક રાજ્યમાં અલગ હોઈ શકે છે. હંમેશાં સરકારી વેબસાઇટ પર અથવા નજીકના CSC (સેવા કેન્દ્ર) પર ખાતરી કરો."
                />
              </p>
              <p>
                <b>
                  <T
                    en="Government schemes are never sold. If an agent asks for money to “get” you a free card — say no and call 14434."
                    hi="सरकारी योजनाएँ बेची नहीं जातीं। अगर कोई एजेंट मुफ़्त कार्ड “बनवाने” के पैसे माँगे — मना करें और 14434 पर कॉल करें।"
                    mr="सरकारी योजना कधीही विकल्या जात नाहीत. कोणी एजंट मोफत कार्ड “काढून देण्यासाठी” पैसे मागत असेल — नाही म्हणा आणि 14434 वर कॉल करा."
                    gu="સરકારી યોજનાઓ ક્યારેય વેચાતી નથી. જો કોઈ એજન્ટ મફત કાર્ડ “બનાવી આપવા” પૈસા માગે — ના પાડો અને 14434 પર કૉલ કરો."
                  />
                </b>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
