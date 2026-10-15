import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Ban, Briefcase, IdCard, MessageSquareQuote, ShieldCheck, Star, UsersRound } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { T } from '@/components/T';
import WorkerBrowser, { WorkerBrowserFromUrl } from '@/components/workers/WorkerBrowser';
import { WORKERS } from '@/data/workers';
import s from '@/components/workers/workers.module.css';

export const metadata: Metadata = {
  title: 'Hire skilled workers',
  description: 'Find verified plumbers, electricians, painters, masons and helpers near you — with clear rates, real endorsements and fair-pay guidance.',
};

const VERIFY = [
  {
    icon: IdCard,
    color: 'var(--color-accent)',
    title: { en: 'ID checked', hi: 'पहचान की जाँच' },
    body: {
      en: 'A Naka volunteer at the naka matches the worker’s face to a government ID. We never store the ID number itself.',
      hi: 'नाके पर नाका का साथी सरकारी पहचान पत्र से चेहरा मिलाता है। हम ID नंबर अपने पास नहीं रखते।',
    },
  },
  {
    icon: BadgeCheck,
    color: 'var(--color-trust)',
    title: { en: 'e-Shram linked', hi: 'ई-श्रम से जुड़ा' },
    body: {
      en: 'Registered on the government’s e-Shram portal — so they are covered by accident insurance and welfare schemes.',
      hi: 'सरकार के ई-श्रम पोर्टल पर पंजीकृत — यानी दुर्घटना बीमा और कल्याण योजनाओं का फ़ायदा मिलता है।',
    },
  },
  {
    icon: ShieldCheck,
    color: 'var(--color-success)',
    title: { en: 'Police verified', hi: 'पुलिस सत्यापन' },
    body: {
      en: 'For work inside homes, many workers choose a police verification. It is free for them — Naka helps file it.',
      hi: 'घर के अंदर के काम के लिए कई कारीगर पुलिस सत्यापन करवाते हैं। उनके लिए मुफ़्त है — नाका मदद करता है।',
    },
  },
  {
    icon: MessageSquareQuote,
    color: 'var(--color-brand)',
    title: { en: 'Real endorsements', hi: 'असली सिफ़ारिशें' },
    body: {
      en: 'Only employers who actually hired the worker through Naka can rate them. No paid or fake reviews.',
      hi: 'सिर्फ़ वही मालिक रेटिंग दे सकते हैं जिन्होंने सच में नाका से काम करवाया। कोई नकली या पैसे वाली रेटिंग नहीं।',
    },
  },
];

export default function WorkersPage() {
  const freeToday = WORKERS.filter((w) => w.availableToday).length;
  const allChecks = WORKERS.filter((w) => w.verified.id && w.verified.eshram).length;
  const avg = WORKERS.reduce((sum, w) => sum + w.rating, 0) / WORKERS.length;

  return (
    <>
      <PageHero
        tint="var(--color-accent)"
        eyebrow={<T en="For households, shops & contractors" hi="घर, दुकान और ठेकेदारों के लिए" />}
        title={
          <T
            en={
              <>
                Hire skilled hands, <span className="gradient-text">the fair way.</span>
              </>
            }
            hi={
              <>
                हुनरमंद कारीगर, <span className="gradient-text">सही तरीके से।</span>
              </>
            }
          />
        }
        lead={
          <T
            en="Verified plumbers, electricians, painters, masons and helpers from nakas near you. See their real work and what past employers said — then make a clear, fair offer."
            hi="आपके पास के नाकों से जाँचे हुए प्लंबर, बिजली मिस्त्री, पेंटर, राजमिस्त्री और हेल्पर। उनका असली काम और पुराने मालिकों की राय देखें — फिर साफ़ और सही ऑफ़र दें।"
          />
        }
        aside={
          <div className={s.heroStats} data-reveal="zoom">
            <div>
              <UsersRound aria-hidden="true" />
              <b className="money" data-count={freeToday}>
                {freeToday}
              </b>
              <span>
                <T en="free today" hi="आज खाली" />
              </span>
            </div>
            <div>
              <BadgeCheck aria-hidden="true" />
              <b className="money" data-count={allChecks}>
                {allChecks}
              </b>
              <span>
                <T en="ID + e-Shram checked" hi="ID + ई-श्रम जाँचे" />
              </span>
            </div>
            <div>
              <Star aria-hidden="true" className="star" />
              <b className="money">{avg.toFixed(1)}</b>
              <span>
                <T en="average rating" hi="औसत रेटिंग" />
              </span>
            </div>
          </div>
        }
      />

      <section className={`container ${s.listSection}`} aria-labelledby="workers-list">
        <h2 id="workers-list" className="sr-only">
          <T en="Workers near you" hi="आपके पास के कारीगर" />
        </h2>
        <Suspense fallback={<WorkerBrowser initialTrade={null} />}>
          <WorkerBrowserFromUrl />
        </Suspense>
      </section>

      <section className="section section-alt" id="verify">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="How we verify" hi="हम कैसे जाँचते हैं" />
            </span>
            <h2 className="h2">
              <T en="Trust that goes both ways." hi="भरोसा — दोनों तरफ़ से।" />
            </h2>
            <p className="lead">
              <T
                en="Workers check employers before they travel. Employers see what has been verified — shown with a tick and a word, never hidden in small print."
                hi="कारीगर जाने से पहले मालिक को जाँचते हैं। मालिक देखते हैं कि क्या-क्या जाँचा गया है — सही के निशान और शब्द के साथ, छोटे अक्षरों में छिपा नहीं।"
              />
            </p>
          </div>
          <div className={s.verifyGrid}>
            {VERIFY.map((v, i) => (
              <article key={v.title.en} className={s.verifyCard} data-reveal="tilt" style={{ '--d': i, '--tile': v.color } as React.CSSProperties}>
                <span className="icon-tile">
                  <v.icon aria-hidden="true" />
                </span>
                <span className={s.verifyStep}>0{i + 1}</span>
                <h3 className="h3">
                  <T en={v.title.en} hi={v.title.hi} />
                </h3>
                <p className="muted">
                  <T en={v.body.en} hi={v.body.hi} />
                </p>
              </article>
            ))}
          </div>
          <p className={`callout callout-trust ${s.noFee}`} data-reveal="">
            <Ban aria-hidden="true" />
            <span>
              <strong>
                <T en="No middlemen, no commission. " hi="कोई दलाल नहीं, कोई कमीशन नहीं। " />
              </strong>
              <T
                en="The full amount you offer goes to the worker. Naka never charges workers to be listed."
                hi="आप जो भी देते हैं, पूरा पैसा कारीगर को मिलता है। नाका कारीगरों से लिस्टिंग का कोई पैसा नहीं लेता।"
              />
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={s.ctaBand} data-reveal="zoom">
            <div>
              <span className="eyebrow">
                <T en="Can’t find the right person?" hi="सही कारीगर नहीं मिला?" />
              </span>
              <h2 className="h2">
                <T en="Post the job. Let the work find them." hi="काम डालिए। काम खुद कारीगर तक पहुँचेगा।" />
              </h2>
              <p className="lead">
                <T
                  en="Two minutes, no login. Workers nearby hear it in their language — with your pay, place and payday written clearly."
                  hi="दो मिनट, कोई लॉगिन नहीं। पास के कारीगर इसे अपनी भाषा में सुनते हैं — मज़दूरी, जगह और भुगतान का दिन साफ़ लिखा हुआ।"
                />
              </p>
            </div>
            <Link href="/post-job" className="btn btn-primary btn-lg" data-magnetic="">
              <Briefcase aria-hidden="true" />
              <T en="Post a job" hi="काम डालें" />
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
