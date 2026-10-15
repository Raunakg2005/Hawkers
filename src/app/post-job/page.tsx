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
  description: 'Post a job for nearby daily-wage workers in 2 minutes — with clear pay, hours and payday, a live fair-pay check and no fees.',
};

const GOOD = [
  {
    icon: WalletCards,
    title: { en: 'Pay daily work the same evening', hi: 'दिहाड़ी का पैसा उसी शाम दें' },
    body: { en: 'For many workers, today’s wage is tonight’s dinner.', hi: 'कई कारीगरों के लिए आज की मज़दूरी ही आज रात का खाना है।' },
  },
  {
    icon: Ban,
    title: { en: 'No fees, ever', hi: 'कभी कोई फ़ीस नहीं' },
    body: {
      en: 'Never ask for a deposit, “registration” money or original ID cards.',
      hi: 'कभी जमा राशि, “रजिस्ट्रेशन” का पैसा या असली ID कार्ड न माँगें।',
    },
  },
  {
    icon: HardHat,
    title: { en: 'Provide safety gear', hi: 'सुरक्षा का सामान दें' },
    body: { en: 'Helmet, gloves and a harness for site, height or electrical work.', hi: 'साइट, ऊँचाई या बिजली के काम के लिए हेलमेट, दस्ताने और हार्नेस।' },
  },
  {
    icon: MapPin,
    title: { en: 'A clear address', hi: 'साफ़ पता' },
    body: { en: 'Exact place and a contact person on site — no “call for address”.', hi: 'सही जगह और साइट पर संपर्क व्यक्ति — “पता फ़ोन पर” नहीं।' },
  },
  {
    icon: Droplets,
    title: { en: 'Water, breaks, a toilet', hi: 'पानी, आराम, शौचालय' },
    body: { en: 'Basic dignity makes people want to come back.', hi: 'बुनियादी सम्मान से लोग दोबारा आना चाहते हैं।' },
  },
];

export default function PostJobPage() {
  return (
    <>
      <PageHero
        tint="var(--color-brand)"
        eyebrow={<T en="For employers" hi="काम देने वालों के लिए" />}
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
          />
        }
        lead={
          <T
            en="Four short steps. Workers nearby hear your job in their language — with the pay, place, hours and payday written clearly, so the right person shows up."
            hi="चार छोटे कदम। पास के कारीगर आपका काम अपनी भाषा में सुनते हैं — मज़दूरी, जगह, समय और भुगतान का दिन साफ़ लिखा, ताकि सही आदमी पहुँचे।"
          />
        }
      >
        <ul className={s.heroChips}>
          <li className="chip chip-success">
            <ShieldCheck aria-hidden="true" />
            <T en="Free — no commission" hi="मुफ़्त — कोई कमीशन नहीं" />
          </li>
          <li className="chip chip-accent">
            <Smartphone aria-hidden="true" />
            <T en="No login needed" hi="लॉगिन की ज़रूरत नहीं" />
          </li>
          <li className="chip chip-brand">
            <Clock aria-hidden="true" />
            <T en="Saved as you type" hi="लिखते-लिखते सेव" />
          </li>
        </ul>
      </PageHero>

      <section className={`container ${s.layout}`} aria-labelledby="pj-form-title">
        <h2 id="pj-form-title" className="sr-only">
          <T en="Job details" hi="काम की जानकारी" />
        </h2>
        <div className={s.mainCol}>
          <Suspense fallback={<PostJobWizard initialTrade={null} />}>
            <PostJobWizardFromUrl />
          </Suspense>
        </div>

        <aside className={s.aside}>
          <div className={s.guide} data-reveal="right">
            <span className="eyebrow">
              <T en="Good employers on Naka" hi="नाका के अच्छे मालिक" />
            </span>
            <h2 className="h3">
              <T en="Five promises that get you the best workers" hi="पाँच वादे जिनसे सबसे अच्छे कारीगर मिलते हैं" />
            </h2>
            <ul className={s.goodList}>
              {GOOD.map((g) => (
                <li key={g.title.en}>
                  <span className="icon-tile sm" style={{ '--tile': 'var(--color-trust)' } as React.CSSProperties}>
                    <g.icon aria-hidden="true" />
                  </span>
                  <span>
                    <b>
                      <T en={g.title.en} hi={g.title.hi} />
                    </b>
                    <span className="muted">
                      <T en={g.body.en} hi={g.body.hi} />
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
                <T en="Minimum wage is the law." hi="न्यूनतम मज़दूरी क़ानून है।" />
              </strong>{' '}
              <T
                en="Paying below your state’s minimum wage is illegal under the Code on Wages, 2019 — even for one day of work. The fair band we show is above it."
                hi="वेतन संहिता, 2019 के तहत राज्य की न्यूनतम मज़दूरी से कम देना ग़ैर-क़ानूनी है — एक दिन के काम के लिए भी। हमारा दिखाया सही दाम उससे ऊपर है।"
              />{' '}
              <Link href="/rights#rights" className={s.lawLink}>
                <T en="Workers’ rights" hi="मज़दूरों के अधिकार" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
