import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Ban, Clock, HardHat, MapPin, Scale, ShieldCheck, Smartphone, WalletCards, Droplets } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { T } from '@/components/T';
import PostJobWizard, { PostJobWizardFromUrl } from '@/components/post-job/PostJobWizard';
import s from '@/components/post-job/postjob.module.css';

export const metadata: Metadata = {
  title: 'Post a job',
  description: 'Post a job for nearby daily-wage workers in 2 minutes, with clear pay, hours and payday, a live fair-pay check and no fees.',
};

const GOOD = [
  {
    icon: WalletCards,
    title: { en: 'Pay daily work the same evening', hi: 'दिहाड़ी का पैसा उसी शाम दें', mr: 'रोजंदारीचे पैसे त्याच संध्याकाळी द्या', gu: 'રોજમદારીના પૈસા એ જ સાંજે આપો' },
    body: { en: 'For many workers, today’s wage is tonight’s dinner.', hi: 'कई कारीगरों के लिए आज की मज़दूरी ही आज रात का खाना है।', mr: 'अनेक कामगारांसाठी आजची मजुरी म्हणजेच आज रात्रीचे जेवण.', gu: 'ઘણા કામદારો માટે આજની મજૂરી એટલે જ આજ રાતનું જમવાનું.' },
  },
  {
    icon: Ban,
    title: { en: 'No fees, ever', hi: 'कभी कोई फ़ीस नहीं', mr: 'कधीही कोणतीही फी नाही', gu: 'ક્યારેય કોઈ ફી નહીં' },
    body: {
      en: 'Never ask for a deposit, “registration” money or original ID cards.',
      hi: 'कभी जमा राशि, “रजिस्ट्रेशन” का पैसा या असली ID कार्ड न माँगें।',
      mr: 'कधीही डिपॉझिट, “रजिस्ट्रेशन”चे पैसे किंवा मूळ ID कार्ड मागू नका.',
      gu: 'ક્યારેય ડિપોઝિટ, “રજિસ્ટ્રેશન”ના પૈસા કે અસલ ID કાર્ડ ન માગો.',
    },
  },
  {
    icon: HardHat,
    title: { en: 'Provide safety gear', hi: 'सुरक्षा का सामान दें', mr: 'सुरक्षेचे साहित्य द्या', gu: 'સલામતીનો સામાન આપો' },
    body: { en: 'Helmet, gloves and a harness for site, height or electrical work.', hi: 'साइट, ऊँचाई या बिजली के काम के लिए हेलमेट, दस्ताने और हार्नेस।', mr: 'साइट, उंचावरचे किंवा विजेच्या कामासाठी हेल्मेट, हातमोजे आणि हार्नेस.', gu: 'સાઇટ, ઊંચાઈ કે વીજળીના કામ માટે હેલ્મેટ, હાથમોજાં અને હાર્નેસ.' },
  },
  {
    icon: MapPin,
    title: { en: 'A clear address', hi: 'साफ़ पता', mr: 'स्पष्ट पत्ता', gu: 'સાફ સરનામું' },
    body: { en: 'Exact place and a contact person on site, no “call for address”.', hi: 'सही जगह और साइट पर संपर्क व्यक्ति, “पता फ़ोन पर” नहीं।', mr: 'अचूक जागा आणि साइटवर संपर्कासाठी एक माणूस, “पत्ता फोनवर” नाही.', gu: 'ચોક્કસ જગ્યા અને સાઇટ પર સંપર્ક માટે એક માણસ, “સરનામું ફોન પર” નહીં.' },
  },
  {
    icon: Droplets,
    title: { en: 'Water, breaks, a toilet', hi: 'पानी, आराम, शौचालय', mr: 'पाणी, विश्रांती, शौचालय', gu: 'પાણી, આરામ, શૌચાલય' },
    body: { en: 'Basic dignity makes people want to come back.', hi: 'बुनियादी सम्मान से लोग दोबारा आना चाहते हैं।', mr: 'साधा मान-सन्मान दिला तर लोक पुन्हा यायला तयार होतात.', gu: 'થોડું માન-સન્માન આપો તો લોકો ફરી આવવા માગે છે.' },
  },
];

export default function PostJobPage() {
  return (
    <>
      <PageHero
        tint="var(--color-brand)"
        eyebrow={<T en="For employers" hi="काम देने वालों के लिए" mr="काम देणाऱ्यांसाठी" gu="કામ આપનારાઓ માટે" />}
        title={
          <T
            en={
              <>
                Post a job in <span className="gradient-text">2 minutes.</span>
              </>
            }
            hi={
              <>
                <span className="gradient-text">2 मिनट</span> में काम डालें।
              </>
            }
            mr={
              <>
                <span className="gradient-text">2 मिनिटांत</span> काम टाका.
              </>
            }
            gu={
              <>
                <span className="gradient-text">2 મિનિટમાં</span> કામ મૂકો.
              </>
            }
          />
        }
        lead={
          <T
            en="Four short steps. Workers nearby hear your job in their language, with the pay, place, hours and payday written clearly, so the right person shows up."
            hi="चार छोटे कदम। पास के कारीगर आपका काम अपनी भाषा में सुनते हैं, मज़दूरी, जगह, समय और भुगतान का दिन साफ़ लिखा, ताकि सही आदमी पहुँचे।"
            mr="चार छोट्या पायऱ्या. जवळचे कामगार तुमचे काम त्यांच्या भाषेत ऐकतात, मजुरी, जागा, वेळ आणि पगाराचा दिवस स्पष्ट लिहिलेला, म्हणजे योग्य माणूस पोहोचतो."
            gu="ચાર નાનાં પગલાં. નજીકના કામદારો તમારું કામ પોતાની ભાષામાં સાંભળે છે, મજૂરી, જગ્યા, સમય અને પગારનો દિવસ સાફ લખેલો, જેથી યોગ્ય માણસ પહોંચે."
          />
        }
      >
        <ul className={s.heroChips}>
          <li className="chip chip-success">
            <ShieldCheck aria-hidden="true" />
            <T en="Free, no commission" hi="मुफ़्त, कोई कमीशन नहीं" mr="मोफत, कोणतेही कमिशन नाही" gu="મફત, કોઈ કમિશન નહીં" />
          </li>
          <li className="chip chip-accent">
            <Smartphone aria-hidden="true" />
            <T en="No login needed" hi="लॉगिन की ज़रूरत नहीं" mr="लॉगिनची गरज नाही" gu="લૉગિનની જરૂર નથી" />
          </li>
          <li className="chip chip-brand">
            <Clock aria-hidden="true" />
            <T en="Saved as you type" hi="लिखते-लिखते सेव" mr="लिहिता लिहिता जतन होते" gu="લખતાં લખતાં સચવાય છે" />
          </li>
        </ul>
      </PageHero>

      <section className={`container ${s.layout}`} aria-labelledby="pj-form-title">
        <h2 id="pj-form-title" className="sr-only">
          <T en="Job details" hi="काम की जानकारी" mr="कामाची माहिती" gu="કામની માહિતી" />
        </h2>
        <div className={s.mainCol}>
          <Suspense fallback={<PostJobWizard initialTrade={null} />}>
            <PostJobWizardFromUrl />
          </Suspense>
        </div>

        <aside className={s.aside}>
          <div className={s.guide} data-reveal="right">
            <span className="eyebrow">
              <T en="Good employers on Naka" hi="नाका के अच्छे मालिक" mr="नाक्यावरचे चांगले मालक" gu="નાકાના સારા માલિકો" />
            </span>
            <h2 className="h3">
              <T en="Five promises that get you the best workers" hi="पाँच वादे जिनसे सबसे अच्छे कारीगर मिलते हैं" mr="पाच वचने, ज्यामुळे सर्वात चांगले कारागीर मिळतात" gu="પાંચ વચન, જેનાથી સૌથી સારા કારીગરો મળે છે" />
            </h2>
            <ul className={s.goodList}>
              {GOOD.map((g) => (
                <li key={g.title.en}>
                  <span className="icon-tile sm" style={{ '--tile': 'var(--color-trust)' } as React.CSSProperties}>
                    <g.icon aria-hidden="true" />
                  </span>
                  <span>
                    <b>
                      <T en={g.title.en} hi={g.title.hi} mr={g.title.mr} gu={g.title.gu} />
                    </b>
                    <span className="muted">
                      <T en={g.body.en} hi={g.body.hi} mr={g.body.mr} gu={g.body.gu} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`callout callout-warning ${s.law}`} data-reveal="right" style={{ '--d': 1 } as React.CSSProperties}>
            <Scale aria-hidden="true" />
            <div>
              <strong>
                <T en="Minimum wage is the law." hi="न्यूनतम मज़दूरी क़ानून है।" mr="किमान मजुरी हा कायदा आहे." gu="લઘુતમ મજૂરી એ કાયદો છે." />
              </strong>{' '}
              <T
                en="Paying below your state’s minimum wage is illegal under the Code on Wages, 2019, even for one day of work. The fair band we show is above it."
                hi="वेतन संहिता, 2019 के तहत राज्य की न्यूनतम मज़दूरी से कम देना ग़ैर-क़ानूनी है, एक दिन के काम के लिए भी। हमारा दिखाया सही दाम उससे ऊपर है।"
                mr="वेतन संहिता, 2019 नुसार राज्याच्या किमान मजुरीपेक्षा कमी देणे बेकायदेशीर आहे, अगदी एका दिवसाच्या कामासाठीसुद्धा. आम्ही दाखवलेली योग्य मर्यादा त्यापेक्षा जास्त आहे."
                gu="વેતન સંહિતા, 2019 મુજબ રાજ્યની લઘુતમ મજૂરીથી ઓછું આપવું ગેરકાયદેસર છે, એક દિવસના કામ માટે પણ. અમે બતાવેલી યોગ્ય મર્યાદા તેનાથી વધારે છે."
              />{' '}
              <Link href="/rights#rights" className={s.lawLink}>
                <T en="Workers’ rights" hi="मज़दूरों के अधिकार" mr="कामगारांचे हक्क" gu="કામદારોના હક" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
