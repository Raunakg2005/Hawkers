import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, UsersRound } from 'lucide-react';
import Ascension from '@/components/heaven/Ascension';
import { Corner, Divider, Gilded } from '@/components/heaven/Ornament';
import { T, Tx } from '@/components/T';
import type { L } from '@/data/types';

/* One morning at the naka, told as an ascent through painted heavens. Each act answers one goal of the brief. */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const RAIL: L[] = [
  { en: 'The wait', hi: 'इंतज़ार', mr: 'प्रतीक्षा', gu: 'રાહ' },
  { en: 'Find work', hi: 'काम', mr: 'काम', gu: 'કામ' },
  { en: 'Your skill', hi: 'हुनर', mr: 'कौशल्य', gu: 'આવડત' },
  { en: 'Trust', hi: 'भरोसा', mr: 'विश्वास', gu: 'ભરોસો' },
  { en: 'Rights', hi: 'अधिकार', mr: 'हक्क', gu: 'અધિકાર' },
  { en: 'Rise', hi: 'उदय', mr: 'उदय', gu: 'ઉદય' },
];

function Rail() {
  return (
    <nav className="asc-rail" aria-label="Story chapters">
      <ol>
        {RAIL.map((l, i) => (
          <li key={l.en} data-i={i}>
            <a href={`#act-${i}`} title={l.en}>
              <span aria-hidden="true">{ROMAN[i]}</span>
              <span className="sr-only">
                <Tx l={l} />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Corners() {
  return (
    <>
      <Corner className="tl" />
      <Corner className="tr" />
      <Corner className="bl" />
      <Corner className="br" />
    </>
  );
}

function Roman({ i, l }: { i: number; l: L }) {
  return (
    <p className="act-roman">
      {ROMAN[i]} · <Tx l={l} />
    </p>
  );
}

const VIRTUES: { href: string; img: string; pos: string; title: L; body: L; cta: L }[] = [
  {
    href: '/jobs',
    img: '/fresco/apollo.jpg',
    pos: '50% 40%',
    title: { en: 'Find work, reliably', hi: 'भरोसे से काम पाएँ', mr: 'खात्रीने काम मिळवा', gu: 'ભરોસાથી કામ મેળવો' },
    body: {
      en: 'Nearby jobs for today, a few days or months, with place, hours and pay shown first.',
      hi: 'आज, कुछ दिन या महीनों का पास का काम, जगह, समय और मज़दूरी सबसे पहले।',
      mr: 'आज, काही दिवस किंवा महिन्यांचे जवळचे काम, जागा, वेळ आणि मजुरी आधी.',
      gu: 'આજનું, થોડા દિવસનું કે મહિનાઓનું નજીકનું કામ, જગ્યા, સમય અને મજૂરી પહેલાં.',
    },
    cta: { en: 'Find work', hi: 'काम ढूँढें', mr: 'काम शोधा', gu: 'કામ શોધો' },
  },
  {
    href: '/profile',
    img: '/fresco/merit.jpg',
    pos: '52% 20%',
    title: { en: 'Show your skill', hi: 'अपना हुनर दिखाएँ', mr: 'तुमचे कौशल्य दाखवा', gu: 'તમારી આવડત બતાવો' },
    body: {
      en: 'Pick your trade from pictures and say a short intro. Get a skill card with a QR code.',
      hi: 'तस्वीरों से अपना काम चुनें, छोटा परिचय बोलें। QR कोड वाला स्किल कार्ड पाएँ।',
      mr: 'चित्रांमधून तुमचे काम निवडा, छोटी ओळख बोला. QR कोड असलेले स्किल कार्ड मिळवा.',
      gu: 'ચિત્રોમાંથી તમારું કામ પસંદ કરો, ટૂંકો પરિચય બોલો. QR કોડવાળું સ્કિલ કાર્ડ મેળવો.',
    },
    cta: { en: 'Make my skill card', hi: 'मेरा स्किल कार्ड बनाएँ', mr: 'माझे स्किल कार्ड बनवा', gu: 'મારું સ્કિલ કાર્ડ બનાવો' },
  },
  {
    href: '/safety',
    img: '/fresco/giants.jpg',
    pos: '50% 78%',
    title: { en: 'Know a job is safe', hi: 'जानें कि काम सुरक्षित है', mr: 'काम सुरक्षित आहे का ते जाणा', gu: 'જાણો કે કામ સુરક્ષિત છે' },
    body: {
      en: 'Pay, payday and hours agreed before you go. Risky listings are flagged, with the warning signs explained.',
      hi: 'जाने से पहले मज़दूरी, भुगतान का दिन और समय तय। ख़तरे वाले काम पर निशान, चेतावनी के संकेत समझाए गए।',
      mr: 'जाण्याआधी मजुरी, पैसे मिळण्याचा दिवस आणि वेळ ठरलेली. धोकादायक कामांवर खूण, धोक्याच्या खुणा समजावलेल्या.',
      gu: 'જતાં પહેલાં મજૂરી, ચુકવણીનો દિવસ અને સમય નક્કી. જોખમી કામ પર નિશાન, ચેતવણીનાં ચિહ્નો સમજાવેલાં.',
    },
    cta: { en: 'Check a job', hi: 'काम जाँचें', mr: 'काम तपासा', gu: 'કામ તપાસો' },
  },
  {
    href: '/rights',
    img: '/fresco/dome.jpg',
    pos: '50% 43%',
    title: { en: 'Your rights and support', hi: 'आपके अधिकार और मदद', mr: 'तुमचे हक्क आणि मदत', gu: 'તમારા અધિકાર અને મદદ' },
    body: {
      en: 'Schemes in plain words, the papers to carry, where to register, and who to call when something goes wrong.',
      hi: 'सीधी भाषा में योजनाएँ, कौन से कागज़ लें, कहाँ पंजीकरण करें, और गड़बड़ हो तो किसे फ़ोन करें।',
      mr: 'सोप्या भाषेत योजना, कोणती कागदपत्रे न्यावी, कुठे नोंदणी करावी, आणि काही चुकले तर कोणाला फोन करावा.',
      gu: 'સરળ ભાષામાં યોજનાઓ, કયા કાગળો લેવા, ક્યાં નોંધણી કરવી, અને કંઈ ખોટું થાય તો કોને ફોન કરવો.',
    },
    cta: { en: 'Find schemes for me', hi: 'मेरे लिए योजनाएँ ढूँढें', mr: 'माझ्यासाठी योजना शोधा', gu: 'મારા માટે યોજનાઓ શોધો' },
  },
];

export default function Home() {
  return (
    <>
      <Ascension rail={<Rail />}>
        {/* I · The wait: looking up through the gilded vault */}
        <section id="act-0" className="act side-left" aria-labelledby="hero-title">
          <div className="act-copy">
            <Corners />
            <Roman i={0} l={{ en: 'Beyond the waiting line', hi: 'इंतज़ार की कतार से आगे', mr: 'प्रतीक्षेच्या रांगेपलीकडे', gu: 'રાહની કતારથી આગળ' }} />
            <h1 id="hero-title" className="act-display">
              <T
                en={<>Skill doesn’t need a <em>résumé.</em></>}
                hi={<>हुनर को <em>बायोडाटा</em> नहीं चाहिए।</>}
                mr={<>कौशल्याला <em>बायोडाटा</em> लागत नाही.</>}
                gu={<>આવડતને <em>બાયોડેટા</em> જોઈતો નથી.</>}
              />
            </h1>
            <p className="act-lead">
              <T
                en="Every morning, hawkers wait at the naka: plumbers, carpenters, electricians, painters, sweepers, labourers. Naka brings fair, nearby work to them."
                hi="हर सुबह नाके पर कारीगर इंतज़ार करते हैं: प्लंबर, बढ़ई, बिजली मिस्त्री, पेंटर, सफ़ाई कर्मी, मज़दूर। नाका पास का, सही दाम वाला काम उन तक लाता है।"
                mr="रोज सकाळी नाक्यावर कारागीर वाट पाहतात: प्लंबर, सुतार, इलेक्ट्रिशियन, रंगारी, सफाई कामगार, मजूर. नाका जवळचे, योग्य मजुरीचे काम त्यांच्यापर्यंत आणतो."
                gu="દરરોજ સવારે નાકા પર કારીગરો રાહ જુએ છે: પ્લમ્બર, સુથાર, ઇલેક્ટ્રિશિયન, પેઇન્ટર, સફાઈ કામદાર, મજૂર. નાકા નજીકનું, યોગ્ય ભાવનું કામ તેમના સુધી લાવે છે."
              />
            </p>
            <div className="act-ctas">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <Briefcase aria-hidden="true" />
                <T en="I need work" hi="मुझे काम चाहिए" mr="मला काम हवे आहे" gu="મને કામ જોઈએ છે" />
              </Link>
              <Link href="/workers" className="btn btn-ivory btn-lg">
                <UsersRound aria-hidden="true" />
                <T en="I need a worker" hi="मुझे कारीगर चाहिए" mr="मला कारागीर हवा आहे" gu="મને કારીગર જોઈએ છે" />
              </Link>
            </div>
          </div>
        </section>

        {/* II · Find work: medallions of pay rise through the sky */}
        <section id="act-1" className="act side-left" aria-labelledby="act-1-title">
          <div className="act-copy">
            <Corners />
            <Roman i={1} l={RAIL[1]} />
            <h2 id="act-1-title" className="act-title">
              <T
                en={<>Work shows up nearby. <em>Pay first.</em></>}
                hi={<>पास का काम दिखता है। <em>मज़दूरी सबसे पहले।</em></>}
                mr={<>जवळचे काम दिसते. <em>मजुरी सर्वात आधी.</em></>}
                gu={<>નજીકનું કામ દેખાય છે. <em>મજૂરી સૌથી પહેલાં.</em></>}
              />
            </h2>
            <p className="act-lead">
              <T
                en="Today, a few days, or months. Every job shows rupees, hours and distance from your naka, before anything else."
                hi="आज, कुछ दिन या महीनों का काम। हर काम पर रुपये, समय और आपके नाके से दूरी, सबसे पहले।"
                mr="आजचे, काही दिवसांचे किंवा महिन्यांचे काम. प्रत्येक कामावर रुपये, वेळ आणि तुमच्या नाक्यापासूनचे अंतर, सर्वात आधी."
                gu="આજનું, થોડા દિવસનું કે મહિનાઓનું કામ. દરેક કામ પર રૂપિયા, સમય અને તમારા નાકાથી અંતર, સૌથી પહેલાં."
              />
            </p>
            <div className="act-ctas">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <T en="Find work" hi="काम ढूँढें" mr="काम शोधा" gu="કામ શોધો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* III · Your skill: the card as a gilded cartouche */}
        <section id="act-2" className="act side-left" aria-labelledby="act-2-title">
          <div className="act-copy">
            <Corners />
            <Roman i={2} l={RAIL[2]} />
            <h2 id="act-2-title" className="act-title">
              <T
                en={<>Say your skill. <em>Get a card.</em></>}
                hi={<>अपना हुनर बोलिए। <em>कार्ड पाइए।</em></>}
                mr={<>तुमचे कौशल्य सांगा. <em>कार्ड मिळवा.</em></>}
                gu={<>તમારી આવડત કહો. <em>કાર્ડ મેળવો.</em></>}
              />
            </h2>
            <p className="act-lead">
              <T
                en="Pick your trade from pictures and say a short intro. Get a skill card with a QR code."
                hi="तस्वीरों से अपना काम चुनें, छोटा परिचय बोलें। QR कोड वाला स्किल कार्ड पाएँ।"
                mr="चित्रांमधून तुमचे काम निवडा, छोटी ओळख बोला. QR कोड असलेले स्किल कार्ड मिळवा."
                gu="ચિત્રોમાંથી તમારું કામ પસંદ કરો, ટૂંકો પરિચય બોલો. QR કોડવાળું સ્કિલ કાર્ડ મેળવો."
              />
            </p>
            <ul className="act-list">
              <li>
                <T en="No typing needed" hi="टाइप करने की ज़रूरत नहीं" mr="टाइप करण्याची गरज नाही" gu="ટાઇપ કરવાની જરૂર નથી" />
              </li>
              <li>
                <T en="Past employers vouch for you" hi="पुराने मालिक आपकी गवाही देते हैं" mr="जुने मालक तुमची हमी देतात" gu="જૂના માલિકો તમારી ખાતરી આપે છે" />
              </li>
              <li>
                <T en="Works on a shared phone" hi="साझा फ़ोन पर भी चलता है" mr="शेअर केलेल्या फोनवरही चालते" gu="વહેંચેલા ફોન પર પણ ચાલે છે" />
              </li>
            </ul>
            <div className="act-ctas">
              <Link href="/profile" className="btn btn-primary btn-lg">
                <T en="Make my skill card" hi="मेरा स्किल कार्ड बनाएँ" mr="माझे स्किल कार्ड बनवा" gu="મારું સ્કિલ કાર્ડ બનાવો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* IV · Trust: the false seal breaks, the shield rises */}
        <section id="act-3" className="act side-right" aria-labelledby="act-3-title">
          <div className="act-copy">
            <Corners />
            <Roman i={3} l={RAIL[3]} />
            <h2 id="act-3-title" className="act-title">
              <T
                en={<>Know a job is safe <em>before you go.</em></>}
                hi={<>जाने से पहले <em>जानें कि काम सुरक्षित है।</em></>}
                mr={<>जाण्याआधी <em>काम सुरक्षित आहे का ते जाणा.</em></>}
                gu={<>જતાં પહેલાં <em>જાણો કે કામ સુરક્ષિત છે.</em></>}
              />
            </h2>
            <p className="act-lead">
              <T
                en="Pay, payday and hours agreed before you go. Risky listings are flagged, with the warning signs explained."
                hi="जाने से पहले मज़दूरी, भुगतान का दिन और समय तय। ख़तरे वाले काम पर निशान, चेतावनी के संकेत समझाए गए।"
                mr="जाण्याआधी मजुरी, पैसे मिळण्याचा दिवस आणि वेळ ठरलेली. धोकादायक कामांवर खूण, धोक्याच्या खुणा समजावलेल्या."
                gu="જતાં પહેલાં મજૂરી, ચુકવણીનો દિવસ અને સમય નક્કી. જોખમી કામ પર નિશાન, ચેતવણીનાં ચિહ્નો સમજાવેલાં."
              />
            </p>
            <p className="act-warn">
              <T en="Never pay to get a job." hi="काम पाने के लिए कभी पैसे न दें।" mr="काम मिळवण्यासाठी कधीही पैसे देऊ नका." gu="કામ મેળવવા ક્યારેય પૈસા ન આપો." />
            </p>
            <div className="act-ctas">
              <Link href="/safety" className="btn btn-primary btn-lg">
                <T en="Check a job" hi="काम जाँचें" mr="काम तपासा" gu="કામ તપાસો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* V · Rights: a charter unrolls under the dome */}
        <section id="act-4" className="act side-left" aria-labelledby="act-4-title">
          <div className="act-copy">
            <Corners />
            <Roman i={4} l={RAIL[4]} />
            <h2 id="act-4-title" className="act-title">
              <T
                en={<>Your rights, <em>in plain words.</em></>}
                hi={<>आपके अधिकार, <em>सीधी भाषा में।</em></>}
                mr={<>तुमचे हक्क, <em>सोप्या भाषेत.</em></>}
                gu={<>તમારા અધિકાર, <em>સરળ ભાષામાં.</em></>}
              />
            </h2>
            <p className="act-lead">
              <T
                en="Schemes in plain words, the papers to carry, where to register, and who to call when something goes wrong."
                hi="सीधी भाषा में योजनाएँ, कौन से कागज़ लें, कहाँ पंजीकरण करें, और गड़बड़ हो तो किसे फ़ोन करें।"
                mr="सोप्या भाषेत योजना, कोणती कागदपत्रे न्यावी, कुठे नोंदणी करावी, आणि काही चुकले तर कोणाला फोन करावा."
                gu="સરળ ભાષામાં યોજનાઓ, કયા કાગળો લેવા, ક્યાં નોંધણી કરવી, અને કંઈ ખોટું થાય તો કોને ફોન કરવો."
              />
            </p>
            <p className="act-fact">
              <T
                en="₹2 lakh accident cover costs ₹20 a year. Most workers never hear about it."
                hi="₹20 सालाना में ₹2 लाख का दुर्घटना बीमा। ज़्यादातर मज़दूरों को पता ही नहीं।"
                mr="वर्षाला ₹20 मध्ये ₹2 लाखांचा अपघात विमा. बहुतेक कामगारांना याबद्दल माहितीच नसते."
                gu="વર્ષે ₹20માં ₹2 લાખનો અકસ્માત વીમો. મોટા ભાગના કામદારોને એની ખબર જ નથી."
              />
            </p>
            <div className="act-ctas">
              <Link href="/rights" className="btn btn-primary btn-lg">
                <T en="Find schemes for me" hi="मेरे लिए योजनाएँ ढूँढें" mr="माझ्यासाठी योजना शोधा" gu="મારા માટે યોજનાઓ શોધો" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* VI · Rise: into the light of the dome */}
        <section id="act-5" className="act act-finale side-center" aria-labelledby="act-5-title">
          <div className="act-copy">
            <Roman i={5} l={RAIL[5]} />
            <h2 id="act-5-title" className="act-display">
              <T
                en={<>Stop waiting. <em>Start working.</em></>}
                hi={<>इंतज़ार बंद। <em>काम शुरू।</em></>}
                mr={<>वाट पाहणे बंद. <em>काम सुरू.</em></>}
                gu={<>રાહ જોવાનું બંધ. <em>કામ શરૂ.</em></>}
              />
            </h2>
            <div className="act-ctas">
              <Link href="/jobs" className="btn btn-primary btn-lg">
                <MapPin aria-hidden="true" />
                <T en="Find work near me" hi="मेरे पास काम खोजें" mr="माझ्या जवळ काम शोधा" gu="મારી નજીક કામ શોધો" />
              </Link>
              <Link href="/post-job" className="btn btn-ivory btn-lg">
                <Briefcase aria-hidden="true" />
                <T en="Post a job" hi="काम डालें" mr="काम टाका" gu="કામ મૂકો" />
              </Link>
            </div>
            <Link href="/my-work" className="act-aside">
              <T
                en="Irregular work? Keep every day’s pay in your work diary."
                hi="काम रोज़ नहीं मिलता? हर दिन की कमाई अपनी काम-डायरी में रखें।"
                mr="काम रोज मिळत नाही? प्रत्येक दिवसाची कमाई तुमच्या कामाच्या डायरीत ठेवा."
                gu="કામ રોજ નથી મળતું? દરેક દિવસની કમાણી તમારી કામની ડાયરીમાં રાખો."
              />
            </Link>
          </div>
        </section>
      </Ascension>

      {/* The four goals of the brief, as gilded panels */}
      <section className="virtues" aria-labelledby="virtues-title">
        <div className="container">
          <div className="virtues-head" data-reveal="">
            <Divider />
            <h2 id="virtues-title">
              <T
                en={<>Four promises to <span className="gold-text">every worker.</span></>}
                hi={<>हर कारीगर से <span className="gold-text">चार वादे।</span></>}
                mr={<>प्रत्येक कारागिराला <span className="gold-text">चार वचने.</span></>}
                gu={<>દરેક કારીગરને <span className="gold-text">ચાર વચનો.</span></>}
              />
            </h2>
          </div>
          <ul className="virtues-grid">
            {VIRTUES.map((v) => (
              <Gilded key={v.href} as="li" className="virtue">
                <span className="medallion" style={{ backgroundImage: `url(${v.img})`, backgroundPosition: v.pos }} aria-hidden="true" />
                <div>
                  <h3>
                    <Tx l={v.title} />
                  </h3>
                  <p>
                    <Tx l={v.body} />
                  </p>
                  <Link href={v.href}>
                    <Tx l={v.cta} />
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </Gilded>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
