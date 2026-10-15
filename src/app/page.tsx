import Link from 'next/link';
import { ArrowRight, Briefcase, IdCard, Landmark, MapPin, NotebookPen, ShieldAlert, ShieldCheck, UsersRound } from 'lucide-react';
import CityStage from '@/components/city/CityStage';
import Words from '@/components/city/Words';
import { T, Tx } from '@/components/T';
import BlockDrop, { DropWords } from '@/components/scrollfx/BlockDrop';
import Hotbar from '@/components/scrollfx/Hotbar';
import PixelCurtain from '@/components/scrollfx/PixelCurtain';
import XpStats from '@/components/scrollfx/XpStats';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import { DURATIONS, TRADES } from '@/data/trades';
import { JOBS } from '@/data/jobs';
import { SCHEMES } from '@/data/schemes';
import type { L } from '@/data/types';

/* One morning at the naka, in six acts. Each act answers one goal of the brief. */

const RAIL: L[] = [
  { en: 'The wait', hi: 'इंतज़ार', mr: 'प्रतीक्षा', gu: 'રાહ' },
  { en: 'Find work', hi: 'काम', mr: 'काम', gu: 'કામ' },
  { en: 'Your skill', hi: 'हुनर', mr: 'कौशल्य', gu: 'આવડત' },
  { en: 'Trust', hi: 'भरोसा', mr: 'विश्वास', gu: 'ભરોસો' },
  { en: 'Rights', hi: 'अधिकार', mr: 'हक्क', gu: 'અધિકાર' },
  { en: 'Sunrise', hi: 'सुबह', mr: 'सकाळ', gu: 'સવાર' },
];

const SKILL_POINTS: L[] = [
  { en: 'No typing needed', hi: 'टाइप करने की ज़रूरत नहीं', mr: 'टाइप करण्याची गरज नाही', gu: 'ટાઇપ કરવાની જરૂર નથી' },
  { en: 'Past employers vouch for you', hi: 'पुराने मालिक आपकी गवाही देते हैं', mr: 'जुने मालक तुमची हमी देतात', gu: 'જૂના માલિકો તમારી ખાતરી આપે છે' },
  { en: 'Works on a shared phone', hi: 'साझा फ़ोन पर भी चलता है', mr: 'शेअर केलेल्या फोनवरही चालते', gu: 'વહેંચેલા ફોન પર પણ ચાલે છે' },
];

function Rail() {
  return (
    <nav className="story-rail" aria-label="Story">
      <ol>
        {RAIL.map((l, i) => (
          <li key={l.en} data-i={i}>
            <a href={`#act-${i}`}>
              <span className="rail-bar" aria-hidden="true" />
              <span className="rail-label">
                <Tx l={l} />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <CityStage rail={<Rail />}>
        {/* ── Act 1 · The wait ─────────────────────────────────────────── */}
        <section id="act-0" className="act act-hero side-left" aria-labelledby="hero-title">
          <div className="act-copy">
            <p className="act-kicker" data-a="">
              <T en="Beyond the waiting line" hi="इंतज़ार की कतार से आगे" mr="प्रतीक्षेच्या रांगेपलीकडे" gu="રાહની કતારથી આગળ" />
            </p>
            <h1 id="hero-title" className="act-display">
              <T
                en={<Words t="Skill doesn’t need a *résumé.*" />}
                hi={<Words t="हुनर को *बायोडाटा* नहीं चाहिए।" />}
                mr={<Words t="कौशल्याला *बायोडाटा* लागत नाही." />}
                gu={<Words t="આવડતને *બાયોડેટા* જોઈતો નથી." />}
              />
            </h1>
            <p className="act-lead" data-a="">
              <T
                en="Every morning, hawkers wait at the naka: plumbers, carpenters, electricians, painters, sweepers, labourers. Naka brings fair, nearby work to them."
                hi="हर सुबह नाके पर कारीगर इंतज़ार करते हैं: प्लंबर, बढ़ई, बिजली मिस्त्री, पेंटर, सफ़ाई कर्मी, मज़दूर। नाका पास का, सही दाम वाला काम उन तक लाता है।"
                mr="रोज सकाळी नाक्यावर कारागीर वाट पाहतात: प्लंबर, सुतार, इलेक्ट्रिशियन, रंगारी, सफाई कामगार, मजूर. नाका जवळचे, योग्य मजुरीचे काम त्यांच्यापर्यंत आणतो."
                gu="દરરોજ સવારે નાકા પર કારીગરો રાહ જુએ છે: પ્લમ્બર, સુથાર, ઇલેક્ટ્રિશિયન, પેઇન્ટર, સફાઈ કામદાર, મજૂર. નાકા નજીકનું, યોગ્ય ભાવનું કામ તેમના સુધી લાવે છે."
              />
            </p>
            <div className="act-ctas" data-a="">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <Briefcase aria-hidden="true" />
                <T en="I need work" hi="मुझे काम चाहिए" mr="मला काम हवे आहे" gu="મને કામ જોઈએ છે" />
              </Link>
              <Link href="/workers" className="btn btn-glass btn-lg">
                <UsersRound aria-hidden="true" />
                <T en="I need a worker" hi="मुझे कारीगर चाहिए" mr="मला कारागीर हवा आहे" gu="મને કારીગર જોઈએ છે" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Act 2 · Seen: work appears across the city ───────────────── */}
        <section id="act-1" className="act side-left" aria-labelledby="act-1-title">
          <div className="act-copy">
            <span className="act-icon" data-a="" style={{ '--tone': 'var(--marigold-400)' } as React.CSSProperties}>
              <MapPin aria-hidden="true" />
            </span>
            <h2 id="act-1-title" className="act-title">
              <T
                en={<Words t="Work shows up nearby. *Pay first.*" />}
                hi={<Words t="पास का काम दिखता है। *मज़दूरी सबसे पहले।*" />}
                mr={<Words t="जवळचे काम दिसते. *मजुरी सर्वात आधी.*" />}
                gu={<Words t="નજીકનું કામ દેખાય છે. *મજૂરી સૌથી પહેલાં.*" />}
              />
            </h2>
            <p className="act-lead" data-a="">
              <T
                en="Today, a few days, or months. Every job shows rupees, hours and distance from your naka, before anything else."
                hi="आज, कुछ दिन या महीनों का काम। हर काम पर रुपये, समय और आपके नाके से दूरी, सबसे पहले।"
                mr="आजचे, काही दिवसांचे किंवा महिन्यांचे काम. प्रत्येक कामावर रुपये, वेळ आणि तुमच्या नाक्यापासूनचे अंतर, सर्वात आधी."
                gu="આજનું, થોડા દિવસનું કે મહિનાઓનું કામ. દરેક કામ પર રૂપિયા, સમય અને તમારા નાકાથી અંતર, સૌથી પહેલાં."
              />
            </p>
            <ul className="act-chips" data-a="">
              {(['daily', 'short', 'long'] as const).map((d) => (
                <li key={d} className={`dur-chip dur-${d}`}>
                  <Tx l={DURATIONS[d].name} />
                </li>
              ))}
            </ul>
            <div className="act-ctas" data-a="">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <T en="Find work" hi="काम ढूँढें" mr="काम शोधा" gu="કામ શોધો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Act 3 · Show your skill ──────────────────────────────────── */}
        <section id="act-2" className="act side-left" aria-labelledby="act-2-title">
          <div className="act-copy">
            <span className="act-icon" data-a="" style={{ '--tone': 'var(--marigold-300)' } as React.CSSProperties}>
              <IdCard aria-hidden="true" />
            </span>
            <h2 id="act-2-title" className="act-title">
              <T
                en={<Words t="Say your skill. *Get a card.*" />}
                hi={<Words t="अपना हुनर बोलिए। *कार्ड पाइए।*" />}
                mr={<Words t="तुमचे कौशल्य सांगा. *कार्ड मिळवा.*" />}
                gu={<Words t="તમારી આવડત કહો. *કાર્ડ મેળવો.*" />}
              />
            </h2>
            <p className="act-lead" data-a="">
              <T
                en="Pick your trade from pictures and say a short intro. Get a skill card with a QR code."
                hi="तस्वीरों से अपना काम चुनें, छोटा परिचय बोलें। QR कोड वाला स्किल कार्ड पाएँ।"
                mr="चित्रांमधून तुमचे काम निवडा, छोटी ओळख बोला. QR कोड असलेले स्किल कार्ड मिळवा."
                gu="ચિત્રોમાંથી તમારું કામ પસંદ કરો, ટૂંકો પરિચય બોલો. QR કોડવાળું સ્કિલ કાર્ડ મેળવો."
              />
            </p>
            <ul className="act-points" data-a="">
              {SKILL_POINTS.map((l) => (
                <li key={l.en}>
                  <Tx l={l} />
                </li>
              ))}
            </ul>
            <div className="act-ctas" data-a="">
              <Link href="/profile" className="btn btn-primary btn-lg">
                <T en="Make my skill card" hi="मेरा स्किल कार्ड बनाएँ" mr="माझे स्किल कार्ड बनवा" gu="મારું સ્કિલ કાર્ડ બનાવો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Act 4 · Trust: the scam cracks, the shield forms ─────────── */}
        <section id="act-3" className="act side-right" aria-labelledby="act-3-title">
          <div className="act-copy">
            <span className="act-icon" data-a="" style={{ '--tone': 'var(--teal-400)' } as React.CSSProperties}>
              <ShieldCheck aria-hidden="true" />
            </span>
            <h2 id="act-3-title" className="act-title">
              <T
                en={<Words t="Know a job is safe *before you go.*" />}
                hi={<Words t="जाने से पहले *जानें कि काम सुरक्षित है।*" />}
                mr={<Words t="जाण्याआधी *काम सुरक्षित आहे का ते जाणा.*" />}
                gu={<Words t="જતાં પહેલાં *જાણો કે કામ સુરક્ષિત છે.*" />}
              />
            </h2>
            <p className="act-lead" data-a="">
              <T
                en="Pay, payday and hours agreed before you go. Risky listings are flagged, with the warning signs explained."
                hi="जाने से पहले मज़दूरी, भुगतान का दिन और समय तय। ख़तरे वाले काम पर निशान, चेतावनी के संकेत समझाए गए।"
                mr="जाण्याआधी मजुरी, पैसे मिळण्याचा दिवस आणि वेळ ठरलेली. धोकादायक कामांवर खूण, धोक्याच्या खुणा समजावलेल्या."
                gu="જતાં પહેલાં મજૂરી, ચુકવણીનો દિવસ અને સમય નક્કી. જોખમી કામ પર નિશાન, ચેતવણીનાં ચિહ્નો સમજાવેલાં."
              />
            </p>
            <p className="act-warn" data-a="">
              <ShieldAlert aria-hidden="true" />
              <T en="Never pay to get a job." hi="काम पाने के लिए कभी पैसे न दें।" mr="काम मिळवण्यासाठी कधीही पैसे देऊ नका." gu="કામ મેળવવા ક્યારેય પૈસા ન આપો." />
            </p>
            <div className="act-ctas" data-a="">
              <Link href="/safety" className="btn btn-primary btn-lg">
                <T en="Check a job" hi="काम जाँचें" mr="काम तपासा" gu="કામ તપાસો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Act 5 · Rights: the office unfolds ───────────────────────── */}
        <section id="act-4" className="act side-left" aria-labelledby="act-4-title">
          <div className="act-copy">
            <span className="act-icon" data-a="" style={{ '--tone': 'var(--indigo-300)' } as React.CSSProperties}>
              <Landmark aria-hidden="true" />
            </span>
            <h2 id="act-4-title" className="act-title">
              <T
                en={<Words t="Your rights, *in plain words.*" />}
                hi={<Words t="आपके अधिकार, *सीधी भाषा में।*" />}
                mr={<Words t="तुमचे हक्क, *सोप्या भाषेत.*" />}
                gu={<Words t="તમારા અધિકાર, *સરળ ભાષામાં.*" />}
              />
            </h2>
            <p className="act-lead" data-a="">
              <T
                en="Schemes in plain words, the papers to carry, where to register, and who to call when something goes wrong."
                hi="सीधी भाषा में योजनाएँ, कौन से कागज़ लें, कहाँ पंजीकरण करें, और गड़बड़ हो तो किसे फ़ोन करें।"
                mr="सोप्या भाषेत योजना, कोणती कागदपत्रे न्यावी, कुठे नोंदणी करावी, आणि काही चुकले तर कोणाला फोन करावा."
                gu="સરળ ભાષામાં યોજનાઓ, કયા કાગળો લેવા, ક્યાં નોંધણી કરવી, અને કંઈ ખોટું થાય તો કોને ફોન કરવો."
              />
            </p>
            <p className="act-fact" data-a="">
              <T
                en="₹2 lakh accident cover costs ₹20 a year. Most workers never hear about it."
                hi="₹20 सालाना में ₹2 लाख का दुर्घटना बीमा। ज़्यादातर मज़दूरों को पता ही नहीं।"
                mr="वर्षाला ₹20 मध्ये ₹2 लाखांचा अपघात विमा. बहुतेक कामगारांना याबद्दल माहितीच नसते."
                gu="વર્ષે ₹20માં ₹2 લાખનો અકસ્માત વીમો. મોટા ભાગના કામદારોને એની ખબર જ નથી."
              />
            </p>
            <div className="act-ctas" data-a="">
              <Link href="/rights" className="btn btn-primary btn-lg">
                <T en="Find schemes for me" hi="मेरे लिए योजनाएँ ढूँढें" mr="माझ्यासाठी योजना शोधा" gu="મારા માટે યોજનાઓ શોધો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Act 6 · Sunrise: everyone connected ──────────────────────── */}
        <section id="act-5" className="act act-finale side-center" aria-labelledby="act-5-title">
          <div className="act-copy">
            <h2 id="act-5-title" className="act-display">
              <T
                en={<Words t="Stop waiting. *Start working.*" />}
                hi={<Words t="इंतज़ार बंद। *काम शुरू।*" />}
                mr={<Words t="वाट पाहणे बंद. *काम सुरू.*" />}
                gu={<Words t="રાહ જોવાનું બંધ. *કામ શરૂ.*" />}
              />
            </h2>
            <div className="act-ctas" data-a="">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <MapPin aria-hidden="true" />
                <T en="Find work near me" hi="मेरे पास काम खोजें" mr="माझ्या जवळ काम शोधा" gu="મારી નજીક કામ શોધો" />
              </Link>
              <Link href="/post-job" className="btn btn-glass btn-lg">
                <Briefcase aria-hidden="true" />
                <T en="Post a job" hi="काम डालें" mr="काम टाका" gu="કામ મૂકો" />
              </Link>
            </div>
            <Link href="/my-work" className="act-aside" data-a="">
              <NotebookPen aria-hidden="true" />
              <T
                en="Irregular work? Keep every day’s pay in your work diary."
                hi="काम रोज़ नहीं मिलता? हर दिन की कमाई अपनी काम-डायरी में रखें।"
                mr="काम रोज मिळत नाही? प्रत्येक दिवसाची कमाई तुमच्या कामाच्या डायरीत ठेवा."
                gu="કામ રોજ નથી મળતું? દરેક દિવસની કમાણી તમારી કામની ડાયરીમાં રાખો."
              />
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </CityStage>

      <div className="fx-world">
        {/* Effect 4 · the promise lands block by block */}
        <BlockDrop
          after={
            <p className="bd-after">
              <T
                en="Work comes some days and not others. Naka is built around that: short jobs, clear pay, and a record of every day you worked."
                hi="काम किसी दिन मिलता है, किसी दिन नहीं। नाका इसी के लिए बना है: छोटे काम, साफ़ मज़दूरी, और हर काम के दिन का हिसाब।"
                mr="काम कधी मिळते, कधी नाही. नाका यासाठीच बनले आहे: छोटी कामे, स्पष्ट मजुरी, आणि प्रत्येक कामाच्या दिवसाची नोंद."
                gu="કામ ક્યારેક મળે, ક્યારેક નહીં. નાકા એના માટે જ બન્યું છે: નાનાં કામ, સ્પષ્ટ મજૂરી, અને દરેક કામના દિવસનો હિસાબ."
              />
            </p>
          }
        >
          <T
            en={<DropWords t="Built for *irregular* work." />}
            hi={<DropWords t="*अनियमित* काम के लिए बना।" />}
            mr={<DropWords t="*अनियमित* कामासाठी बनवलेले." />}
            gu={<DropWords t="*અનિયમિત* કામ માટે બનેલું." />}
          />
        </BlockDrop>

        {/* Effect 2 · every trade in the hotbar, with its fair day-rate */}
        <Hotbar
            head={
              <>
                <h2 className="fx-title">
                  <T en="Every trade has a slot." hi="हर हुनर की अपनी जगह।" mr="प्रत्येक कौशल्याला स्वतःची जागा." gu="દરેક આવડતની પોતાની જગ્યા." />
                </h2>
                <p className="fx-sub">
                  <T
                    en="A fair day-rate for each trade, so nobody works for less."
                    hi="हर काम की सही दिहाड़ी, ताकि कोई कम में काम न करे।"
                    mr="प्रत्येक कामाची योग्य रोजंदारी, जेणेकरून कोणी कमी पैशात काम करू नये."
                    gu="દરેક કામની યોગ્ય રોજમદારી, જેથી કોઈ ઓછામાં કામ ન કરે."
                  />
                </p>
              </>
            }
            slots={TRADES.map((t) => (
              <span key={t.id} className="hb-item" style={{ '--tile': tradeColor(t.id) } as React.CSSProperties}>
                <TradeIcon trade={t.id} />
                <small>
                  <Tx l={t.name} />
                </small>
              </span>
            ))}
            details={TRADES.map((t) => (
              <div key={t.id}>
                <p className="hb-name">
                  <Tx l={t.name} />
                </p>
                <p className="hb-rate">
                  ₹{t.fair[0].toLocaleString('en-IN')}-{t.fair[1].toLocaleString('en-IN')}{' '}
                  <T en="/ day" hi="/ दिन" mr="/ दिवस" gu="/ દિવસ" />
                </p>
                <p className="hb-verb">
                  <Tx l={t.verb} />
                  {' · '}
                  <T en="sample guide rate" hi="नमूना दर" mr="नमुना दर" gu="નમૂના દર" />
                </p>
              </div>
            ))}
          />

        {/* Effects 1 + 3 · the stats break out of stone, then level up */}
        <PixelCurtain>
        <XpStats
          head={
            <h2 className="fx-title">
              <T en="Everything you need, one level at a time." hi="जो चाहिए सब, एक-एक लेवल करके।" mr="जे हवे ते सगळे, एकेक लेव्हल करून." gu="જે જોઈએ તે બધું, એક પછી એક લેવલ." />
            </h2>
          }
          stats={[
            { value: JOBS.length, label: <T en="sample jobs near the naka" hi="नाके के पास नमूना काम" mr="नाक्याजवळ नमुना कामे" gu="નાકા પાસે નમૂના કામ" /> },
            { value: TRADES.length, label: <T en="trades with a fair-pay guide" hi="सही-मज़दूरी गाइड वाले हुनर" mr="योग्य-मजुरी मार्गदर्शक असलेली कौशल्ये" gu="યોગ્ય-મજૂરી માર્ગદર્શિકાવાળી આવડત" /> },
            { value: SCHEMES.length, label: <T en="welfare schemes explained" hi="सरकारी योजनाएँ समझाई गईं" mr="सरकारी योजना समजावल्या" gu="સરકારી યોજનાઓ સમજાવી" /> },
            { value: 4, label: <T en="languages, with read-aloud" hi="भाषाएँ, सुनने की सुविधा के साथ" mr="भाषा, ऐकण्याच्या सोयीसह" gu="ભાષાઓ, સાંભળવાની સુવિધા સાથે" /> },
          ]}
        />
        </PixelCurtain>
      </div>
    </>
  );
}
