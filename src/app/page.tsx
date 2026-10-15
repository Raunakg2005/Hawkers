import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Briefcase,
  Eye,
  Handshake,
  HeartHandshake,
  IdCard,
  Landmark,
  Languages,
  MapPin,
  Mic,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Sprout,
  TrendingUp,
  Type,
  UsersRound,
  WalletCards,
  WifiOff,
} from 'lucide-react';
import HeroCanvas from '@/components/HeroCanvas';
import HeroPoster from '@/components/HeroPoster';
import JobCard from '@/components/JobCard';
import { T, Tx } from '@/components/T';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import { TRADES } from '@/data/trades';
import { JOBS } from '@/data/jobs';
import { SCHEMES } from '@/data/schemes';

export default function Home() {
  const demoJob = JOBS[0];
  return (
    <>
      {/* ───────────── 1 · 3D scroll story */}
      <section className="hero-story" data-story="" aria-labelledby="hero-title">
        <div className="hero-stage">
          <HeroPoster />
          <HeroCanvas />
          <div className="hero-scrim" aria-hidden="true" />

          <div className="container hero-overlay">
            <div className="beat beat-1">
              <span className="eyebrow">
                <T en="Beyond the waiting line" hi="इंतज़ार की कतार से आगे" />
              </span>
              <h1 id="hero-title" className="display">
                <T
                  en={
                    <>
                      Skill doesn’t need a <span className="gradient-text">résumé.</span>
                    </>
                  }
                  hi={
                    <>
                      हुनर को <span className="gradient-text">बायोडाटा</span> नहीं चाहिए।
                    </>
                  }
                />
              </h1>
              <p className="lead">
                <T
                  en="Every morning, crores of plumbers, painters, masons and helpers wait at a naka hoping the right person walks by. Naka brings the work to them — nearby, fair and safe."
                  hi="हर सुबह करोड़ों प्लंबर, पेंटर, राजमिस्त्री और हेल्पर नाके पर इंतज़ार करते हैं कि सही आदमी आ जाए। नाका काम को उन तक लाता है — पास में, सही दाम पर, सुरक्षित।"
                />
              </p>
            </div>

            <div className="beat beat-2" aria-hidden="true">
              <span className="eyebrow">
                <T en="Step 1 · Seen" hi="कदम 1 · पहचान" />
              </span>
              <p className="beat-title">
                <T en="Work appears nearby — with the pay written first." hi="पास का काम दिखता है — सबसे पहले मज़दूरी लिखी हुई।" />
              </p>
            </div>

            <div className="beat beat-3" aria-hidden="true">
              <span className="eyebrow">
                <T en="Step 2 · Connected" hi="कदम 2 · जुड़ाव" />
              </span>
              <p className="beat-title">
                <T en="Every skill finds its job. The whole city opens up." hi="हर हुनर को काम मिलता है। पूरा शहर खुल जाता है।" />
              </p>
            </div>

            <div className="hero-actions">
              <Link href="/jobs" className="btn btn-primary btn-lg" data-magnetic="">
                <Briefcase aria-hidden="true" />
                <T en="I need work" hi="मुझे काम चाहिए" />
              </Link>
              <Link href="/workers" className="btn btn-lg hero-btn-2" data-magnetic="">
                <UsersRound aria-hidden="true" />
                <T en="I need a worker" hi="मुझे कारीगर चाहिए" />
              </Link>
            </div>

            <ol className="story-dots" aria-hidden="true">
              <li className="d1" />
              <li className="d2" />
              <li className="d3" />
            </ol>
            <div className="scroll-hint" aria-hidden="true">
              <i className="mouse" />
              <T en="Scroll" hi="नीचे स्क्रॉल करें" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 2 · Trades marquee */}
      <section className="marquee" aria-label="Trades">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1}>
              {TRADES.map((t) => (
                <li key={t.id} style={{ '--tile': tradeColor(t.id) } as React.CSSProperties}>
                  <TradeIcon trade={t.id} />
                  <Tx l={t.name} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ───────────── 3 · The problem */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="The waiting line, today" hi="आज की इंतज़ार की कतार" />
            </span>
            <h2 className="h2">
              <T en="Years of experience. Zero visibility." hi="सालों का अनुभव। फिर भी कोई पहचान नहीं।" />
            </h2>
            <p className="lead">
              <T
                en="A mason with 17 years of perfect tile lines has no profile, no network beyond the naka, and no proof of the work he has done. Employers who need him don’t know where to look."
                hi="17 साल से सीधी टाइल लगाने वाले राजमिस्त्री की कोई प्रोफ़ाइल नहीं, नाके से आगे कोई पहचान नहीं, किए हुए काम का कोई सबूत नहीं। जिन्हें उसकी ज़रूरत है, उन्हें पता नहीं कहाँ ढूँढें।"
              />
            </p>
          </div>

          <div className="problem-grid">
            <article className="stat-card" data-reveal="tilt">
              <p className="stat">
                ~<span data-count="90">90</span>%
              </p>
              <p>
                <T en="of India’s workers earn in the informal economy" hi="भारत के मज़दूर असंगठित क्षेत्र में कमाते हैं" />
              </p>
            </article>
            <article className="stat-card" data-reveal="tilt" style={{ '--d': 1 } as React.CSSProperties}>
              <p className="stat">
                <span data-count="30">30</span>
                <small>
                  <T en=" crore+" hi=" करोड़+" />
                </small>
              </p>
              <p>
                <T en="unorganised workers registered on e-Shram — most still find work by word of mouth" hi="मज़दूर ई-श्रम पर पंजीकृत — ज़्यादातर अब भी जान-पहचान से काम ढूँढते हैं" />
              </p>
            </article>
            <article className="stat-card" data-reveal="tilt" style={{ '--d': 2 } as React.CSSProperties}>
              <p className="stat">
                <span data-count="0">0</span>
              </p>
              <p>
                <T en="résumés, logins or English needed to use Naka" hi="बायोडाटा, लॉगिन या अंग्रेज़ी — नाका के लिए कुछ नहीं चाहिए" />
              </p>
            </article>
          </div>

          <div className="pain-row" data-reveal="">
            {[
              { en: 'Work depends on who walks by', hi: 'काम इस पर निर्भर कि कौन आ जाए' },
              { en: 'Pay is settled after the work', hi: 'मज़दूरी काम के बाद तय होती है' },
              { en: 'Fake agents take “registration fees”', hi: 'नकली एजेंट “रजिस्ट्रेशन फ़ीस” लेते हैं' },
              { en: 'Welfare schemes feel out of reach', hi: 'सरकारी योजनाएँ पहुँच से बाहर लगती हैं' },
            ].map((p) => (
              <span key={p.en} className="chip chip-danger">
                <Tx l={p} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 4 · How it works — sticky stacking cards */}
      <section className="section section-alt" id="how">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="How Naka works" hi="नाका कैसे काम करता है" />
            </span>
            <h2 className="h2">
              <T en="Four taps from the kerb to a fair day’s pay." hi="नाके से सही मज़दूरी तक — बस चार टैप।" />
            </h2>
          </div>

          <div className="steps">
            {STEPS.map((s, i) => (
              <article key={s.n} className="step-card" data-stack-card="" style={{ '--i': i, '--tile': s.color } as React.CSSProperties}>
                <div className="step-text">
                  <span className="step-n">0{s.n}</span>
                  <h3 className="h2">
                    <Tx l={s.title} />
                  </h3>
                  <p className="lead">
                    <Tx l={s.body} />
                  </p>
                  <Link href={s.href} className="btn">
                    <Tx l={s.cta} />
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
                <div className="step-visual" aria-hidden="true">
                  <s.icon />
                  <ul>
                    {s.points.map((pt) => (
                      <li key={pt.en}>
                        <BadgeCheck />
                        <Tx l={pt} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 5 · Phone demo */}
      <section className="section">
        <div className="container demo">
          <div className="demo-copy" data-reveal="left">
            <span className="eyebrow">
              <T en="Designed for a ₹6,000 phone" hi="₹6,000 के फ़ोन के लिए बना" />
            </span>
            <h2 className="h2">
              <T en="Readable in three seconds. Even without reading." hi="तीन सेकंड में समझ आए। बिना पढ़े भी।" />
            </h2>
            <p className="lead">
              <T
                en="Every job card follows the same order: icon for the trade, the rupees in big numbers, then place, time and day. Tap the speaker to hear it in your language."
                hi="हर काम का कार्ड एक ही क्रम में: काम का चित्र, बड़े अक्षरों में रुपये, फिर जगह, समय और दिन। स्पीकर दबाएँ और अपनी भाषा में सुनें।"
              />
            </p>
            <ul className="feature-list">
              {FEATURES.map((f) => (
                <li key={f.title.en}>
                  <span className="icon-tile sm" style={{ '--tile': f.color } as React.CSSProperties}>
                    <f.icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>
                      <Tx l={f.title} />
                    </strong>
                    <span className="muted">
                      <Tx l={f.body} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="phone-wrap" data-reveal="zoom">
            <div className="phone" data-tilt="">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-bar">
                  <span>9:41</span>
                  <span className="chip chip-success">
                    <span className="dot dot-live" />
                    <T en="Available today" hi="आज खाली हूँ" />
                  </span>
                </div>
                <p className="phone-hello">
                  <T en="Namaste Ramesh 👋" hi="नमस्ते रमेश 👋" />
                </p>
                <p className="phone-sub">
                  <T en="3 plumbing jobs near Kurla naka" hi="कुर्ला नाका के पास प्लंबिंग के 3 काम" />
                </p>
                <JobCard job={demoJob} />
                <div className="phone-voice">
                  <Mic aria-hidden="true" />
                  <T en="“Plumber work near me”" hi="“मेरे पास प्लंबर का काम”" />
                </div>
              </div>
            </div>
            <div className="float-chip fc-1" data-parallax="0.08">
              <ShieldCheck aria-hidden="true" />
              <T en="Employer verified" hi="मालिक की जाँच हुई" />
            </div>
            <div className="float-chip fc-2" data-parallax="-0.06">
              <WalletCards aria-hidden="true" />
              <T en="Paid same evening" hi="उसी शाम भुगतान" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 6 · Two sides */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="One naka, two sides" hi="एक नाका, दो पक्ष" />
            </span>
            <h2 className="h2">
              <T en="Built for the worker first. Better for the employer too." hi="पहले मज़दूर के लिए बना। मालिक के लिए भी बेहतर।" />
            </h2>
          </div>
          <div className="sides">
            <article className="side-card side-worker" data-tilt="" data-reveal="">
              <Sprout className="side-bg" aria-hidden="true" />
              <h3 className="h3">
                <T en="If you work with your hands" hi="अगर आप हाथ से काम करते हैं" />
              </h3>
              <ul>
                {WORKER_POINTS.map((p) => (
                  <li key={p.en}>
                    <BadgeCheck aria-hidden="true" />
                    <Tx l={p} />
                  </li>
                ))}
              </ul>
              <div className="row">
                <Link className="btn btn-primary" href="/profile">
                  <IdCard aria-hidden="true" />
                  <T en="Make my skill card" hi="मेरा स्किल कार्ड बनाएँ" />
                </Link>
                <Link className="btn btn-ghost" href="/jobs">
                  <T en="See jobs" hi="काम देखें" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
            <article className="side-card side-employer" data-tilt="" data-reveal="" style={{ '--d': 1 } as React.CSSProperties}>
              <Handshake className="side-bg" aria-hidden="true" />
              <h3 className="h3">
                <T en="If you need reliable hands" hi="अगर आपको भरोसेमंद कारीगर चाहिए" />
              </h3>
              <ul>
                {EMPLOYER_POINTS.map((p) => (
                  <li key={p.en}>
                    <BadgeCheck aria-hidden="true" />
                    <Tx l={p} />
                  </li>
                ))}
              </ul>
              <div className="row">
                <Link className="btn btn-accent" href="/post-job">
                  <Briefcase aria-hidden="true" />
                  <T en="Post a job" hi="काम डालें" />
                </Link>
                <Link className="btn btn-ghost" href="/workers">
                  <T en="Browse workers" hi="कारीगर देखें" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ───────────── 7 · Design principles (Self-Determination Theory) */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Design thinking · Self-Determination Theory" hi="डिज़ाइन सोच · आत्म-निर्णय सिद्धांत" />
            </span>
            <h2 className="h2">
              <T en="Dignity is a design requirement." hi="सम्मान — डिज़ाइन की ज़रूरी शर्त।" />
            </h2>
            <p className="lead">
              <T
                en="People stick with tools that respect three human needs: control over their choices, a sense of being good at something, and belonging. Every screen in Naka is checked against them."
                hi="लोग उन्हीं चीज़ों से जुड़ते हैं जो तीन ज़रूरतों का सम्मान करें: अपने फ़ैसले ख़ुद लेना, अपने हुनर पर गर्व, और अपनापन। नाका की हर स्क्रीन इन पर परखी गई है।"
              />
            </p>
          </div>
          <div className="sdt-grid">
            {SDT.map((s, i) => (
              <article key={s.title.en} className="sdt-card" data-reveal="tilt" style={{ '--d': i, '--tile': s.color } as React.CSSProperties}>
                <span className="icon-tile lg">
                  <s.icon aria-hidden="true" />
                </span>
                <h3 className="h3">
                  <Tx l={s.title} />
                </h3>
                <p className="muted">
                  <Tx l={s.body} />
                </p>
                <ul>
                  {s.how.map((h) => (
                    <li key={h.en}>
                      <Tx l={h} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="a11y-strip" data-reveal="">
            {A11Y.map((a) => (
              <div key={a.en}>
                <a.icon aria-hidden="true" />
                <T en={a.en} hi={a.hi} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 8 · Rights teaser */}
      <section className="section section-alt">
        <div className="container rights-teaser">
          <div data-reveal="left">
            <span className="eyebrow">
              <T en="Rights & support" hi="अधिकार और सहायता" />
            </span>
            <h2 className="h2">
              <T en="₹2 lakh accident cover costs ₹20 a year. Most workers never hear about it." hi="₹20 सालाना में ₹2 लाख का दुर्घटना बीमा। ज़्यादातर मज़दूरों को पता ही नहीं।" />
            </h2>
            <p className="lead">
              <T
                en="Naka turns government schemes into plain answers: what you get, who can apply, which papers to carry, and where to go — with the helpline one tap away."
                hi="नाका सरकारी योजनाओं को आसान जवाब में बदलता है: क्या मिलेगा, कौन ले सकता है, कौन से कागज़ चाहिए, और कहाँ जाना है — हेल्पलाइन बस एक टैप दूर।"
              />
            </p>
            <Link className="btn btn-primary" href="/rights">
              <Landmark aria-hidden="true" />
              <T en="Find schemes for me" hi="मेरे लिए योजनाएँ खोजें" />
            </Link>
          </div>
          <ul className="scheme-cloud" data-reveal="right">
            {SCHEMES.map((s, i) => (
              <li key={s.id} style={{ '--i': i } as React.CSSProperties}>
                <Link href={`/rights#${s.id}`}>
                  <strong>{s.name}</strong>
                  <span>
                    <Tx l={s.short} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── 9 · SDG impact */}
      <section className="section">
        <div className="container">
          <div className="section-head center" data-reveal="">
            <span className="eyebrow">
              <T en="Impact · UN Sustainable Development Goals" hi="असर · संयुक्त राष्ट्र सतत विकास लक्ष्य" />
            </span>
            <h2 className="h2">
              <T en="Small daily wins that add up to big goals." hi="रोज़ की छोटी जीत, बड़े लक्ष्यों की ओर।" />
            </h2>
          </div>
          <div className="sdg-grid">
            {SDGS.map((g, i) => (
              <article key={g.n} className="sdg-card" data-reveal="" style={{ '--d': i, '--sdg': g.color } as React.CSSProperties}>
                <span className="sdg-n">{g.n}</span>
                <h3>
                  <Tx l={g.title} />
                </h3>
                <p className="muted">
                  <Tx l={g.body} />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 10 · Personas */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head" data-reveal="">
            <span className="eyebrow">
              <T en="Who we designed for" hi="किसके लिए बनाया" />
            </span>
            <h2 className="h2">
              <T en="Design personas from the naka." hi="नाके से निकले डिज़ाइन पर्सोना।" />
            </h2>
          </div>
          <div className="persona-grid">
            {PERSONAS.map((p, i) => (
              <figure key={p.name} className="persona" data-reveal="" style={{ '--d': i, '--tile': p.color } as React.CSSProperties}>
                <blockquote>
                  <Tx l={p.quote} />
                </blockquote>
                <figcaption>
                  <strong>{p.name}</strong>
                  <span>
                    <Tx l={p.role} />
                  </span>
                  <span className="persona-need">
                    <MousePointerClick aria-hidden="true" /> <Tx l={p.need} />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 11 · Final CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-panel" data-reveal="zoom">
            <div className="cta-glow" aria-hidden="true" />
            <span className="eyebrow">
              <T en="Your naka, in your pocket" hi="आपका नाका, आपकी जेब में" />
            </span>
            <h2 className="display">
              <T en="Stop waiting. Start working." hi="इंतज़ार बंद। काम शुरू।" />
            </h2>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link href="/jobs" className="btn btn-primary btn-lg" data-magnetic="">
                <MapPin aria-hidden="true" />
                <T en="Find work near me" hi="मेरे पास काम खोजें" />
              </Link>
              <Link href="/post-job" className="btn btn-lg" data-magnetic="">
                <Briefcase aria-hidden="true" />
                <T en="Post a job" hi="काम डालें" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────── content */

const STEPS = [
  {
    n: 1,
    icon: Mic,
    color: 'var(--color-brand)',
    href: '/profile',
    title: { en: 'Say your skill. Get a card.', hi: 'अपना हुनर बोलिए। कार्ड पाइए।' },
    body: {
      en: 'Pick your trade from pictures, tap your years of experience, record a 20-second intro. Naka builds a Skill Card with a QR code you can show at any naka or site.',
      hi: 'चित्रों से अपना काम चुनें, अनुभव के साल चुनें, 20 सेकंड का परिचय रिकॉर्ड करें। नाका QR कोड वाला स्किल कार्ड बनाता है जो आप किसी भी नाके या साइट पर दिखा सकते हैं।',
    },
    cta: { en: 'Make a skill card', hi: 'स्किल कार्ड बनाएँ' },
    points: [
      { en: 'No typing needed', hi: 'टाइप करने की ज़रूरत नहीं' },
      { en: 'Past employers vouch for you', hi: 'पुराने मालिक आपकी गवाही देते हैं' },
      { en: 'Works on a shared phone', hi: 'साझा फ़ोन पर भी चलता है' },
    ],
  },
  {
    n: 2,
    icon: MapPin,
    color: 'var(--color-short)',
    href: '/jobs',
    title: { en: 'See work near you — pay first.', hi: 'पास का काम देखें — पहले मज़दूरी।' },
    body: {
      en: 'Today, a few days, or months — filter by what your week needs. Every listing shows rupees, hours, distance and when you get paid, before anything else.',
      hi: 'आज का, कुछ दिनों का, या महीनों का — अपने हफ़्ते के हिसाब से चुनें। हर काम में सबसे पहले रुपये, समय, दूरी और भुगतान का दिन दिखता है।',
    },
    cta: { en: 'Browse jobs', hi: 'काम देखें' },
    points: [
      { en: 'Daily, short & long-term', hi: 'दिहाड़ी, थोड़े दिन और लंबा काम' },
      { en: 'Map with distance from your naka', hi: 'नाके से दूरी के साथ नक़्शा' },
      { en: 'Fair-pay meter for every trade', hi: 'हर काम के लिए सही-मज़दूरी मीटर' },
    ],
  },
  {
    n: 3,
    icon: ShieldCheck,
    color: 'var(--color-trust)',
    href: '/safety',
    title: { en: 'Check it. Agree in writing.', hi: 'जाँचिए। लिखित में तय कीजिए।' },
    body: {
      en: 'A Trust Shield flags fees, missing addresses and too-good-to-be-true pay. Before you go, both sides confirm a simple Work Promise: tasks, hours, pay, payday.',
      hi: 'ट्रस्ट शील्ड फ़ीस, ग़ायब पता और ज़रूरत से ज़्यादा मज़दूरी जैसे ख़तरे बताती है। जाने से पहले दोनों पक्ष आसान “काम का वादा” पक्का करते हैं: काम, समय, मज़दूरी, भुगतान का दिन।',
    },
    cta: { en: 'Check a job', hi: 'काम जाँचें' },
    points: [
      { en: 'Scam signals in plain words', hi: 'धोखे के संकेत आसान शब्दों में' },
      { en: 'Share job details with family', hi: 'काम की जानकारी परिवार को भेजें' },
      { en: 'One-tap helpline', hi: 'एक टैप में हेल्पलाइन' },
    ],
  },
  {
    n: 4,
    icon: WalletCards,
    color: 'var(--color-long)',
    href: '/my-work',
    title: { en: 'Get paid. Build a record.', hi: 'भुगतान पाइए। रिकॉर्ड बनाइए।' },
    body: {
      en: 'Your work diary tracks days worked, money received and money still owed. That history becomes proof of work for welfare boards and loans.',
      hi: 'आपकी काम डायरी में काम के दिन, मिला पैसा और बकाया पैसा दर्ज रहता है। यही रिकॉर्ड कल्याण बोर्ड और कर्ज़ के लिए काम का सबूत बनता है।',
    },
    cta: { en: 'Open my diary', hi: 'मेरी डायरी खोलें' },
    points: [
      { en: 'Reminders for unpaid dues', hi: 'बकाया पैसे की याद' },
      { en: '90-day work proof for BOCW', hi: 'BOCW के लिए 90 दिन का सबूत' },
      { en: 'Weekly earnings at a glance', hi: 'हफ़्ते की कमाई एक नज़र में' },
    ],
  },
];

const FEATURES = [
  { icon: AudioLines, color: 'var(--color-brand)', title: { en: 'Voice first', hi: 'आवाज़ पहले' }, body: { en: 'Search by speaking, hear every card read aloud.', hi: 'बोलकर खोजें, हर कार्ड सुनें।' } },
  { icon: Languages, color: 'var(--color-accent)', title: { en: 'Hindi & English, instantly', hi: 'हिंदी और अंग्रेज़ी, तुरंत' }, body: { en: 'One tap on अ switches everything.', hi: 'अ पर एक टैप, सब बदल जाता है।' } },
  { icon: WifiOff, color: 'var(--color-trust)', title: { en: 'Low data mode', hi: 'कम डेटा मोड' }, body: { en: 'Turns off 3D and motion on slow 2G.', hi: 'धीमे 2G पर 3D और एनिमेशन बंद।' } },
];

const WORKER_POINTS = [
  { en: 'Get found for your trade, not your English', hi: 'अंग्रेज़ी से नहीं, अपने हुनर से पहचाने जाएँ' },
  { en: 'Know the pay and payday before you go', hi: 'जाने से पहले मज़दूरी और भुगतान का दिन जानें' },
  { en: 'Set your own rate and days off', hi: 'अपना रेट और छुट्टी ख़ुद तय करें' },
  { en: 'Turn your work history into welfare benefits', hi: 'काम के रिकॉर्ड से सरकारी लाभ पाएँ' },
];

const EMPLOYER_POINTS = [
  { en: 'Verified workers with real endorsements', hi: 'असली गवाही वाले जाँचे हुए कारीगर' },
  { en: 'Fair-pay guide so offers are accepted fast', hi: 'सही मज़दूरी गाइड, ताकि ऑफ़र जल्दी माना जाए' },
  { en: 'Clear Work Promise — fewer disputes', hi: 'साफ़ “काम का वादा” — कम झगड़े' },
  { en: 'Rehire the people you trust in one tap', hi: 'भरोसेमंद लोगों को एक टैप में दोबारा बुलाएँ' },
];

const SDT = [
  {
    icon: HeartHandshake,
    color: 'var(--color-brand)',
    title: { en: 'Autonomy', hi: 'स्वतंत्रता' },
    body: { en: 'Workers stay in charge: they choose jobs, set rates and decide when they are available.', hi: 'मज़दूर ख़ुद फ़ैसला करें: कौन सा काम, क्या रेट, कब खाली।' },
    how: [
      { en: '“Available today” switch', hi: '“आज खाली हूँ” बटन' },
      { en: 'Own rate, never auctioned', hi: 'अपना रेट, बोली नहीं' },
      { en: 'Keep using the physical naka', hi: 'असली नाका भी चलता रहे' },
    ],
  },
  {
    icon: TrendingUp,
    color: 'var(--color-trust)',
    title: { en: 'Competence', hi: 'हुनर का गर्व' },
    body: { en: 'Skill is shown, not certified: photos of work, years, endorsements and badges earned on the job.', hi: 'हुनर दिखाया जाए, सर्टिफ़िकेट नहीं: काम की फ़ोटो, साल, गवाही और काम से मिले बैज।' },
    how: [
      { en: 'Skill Card with QR', hi: 'QR वाला स्किल कार्ड' },
      { en: 'Before/after work gallery', hi: 'काम की फ़ोटो गैलरी' },
      { en: 'Earned badges, not tests', hi: 'परीक्षा नहीं, काम से बैज' },
    ],
  },
  {
    icon: UsersRound,
    color: 'var(--color-accent)',
    title: { en: 'Relatedness', hi: 'अपनापन' },
    body: { en: 'Work in India travels through people. Naka keeps crews, mentors and trusted employers together.', hi: 'भारत में काम लोगों से मिलता है। नाका टीम, उस्ताद और भरोसेमंद मालिकों को साथ रखता है।' },
    how: [
      { en: 'Vouch for a fellow worker', hi: 'साथी की गवाही दें' },
      { en: 'Hire as a crew', hi: 'पूरी टोली को काम' },
      { en: 'Share job with family', hi: 'परिवार को काम भेजें' },
    ],
  },
];

const A11Y = [
  { icon: Eye, en: 'Icons + colour + words, never colour alone', hi: 'चित्र + रंग + शब्द, सिर्फ़ रंग नहीं' },
  { icon: Type, en: '3 text sizes', hi: '3 अक्षर आकार' },
  { icon: AudioLines, en: 'Read aloud everywhere', hi: 'हर जगह सुनने की सुविधा' },
  { icon: Smartphone, en: '48px+ tap targets', hi: '48px+ बड़े बटन' },
  { icon: WifiOff, en: 'Works on 2G', hi: '2G पर चलता है' },
  { icon: Languages, en: 'हिंदी / English', hi: 'हिंदी / English' },
];

const SDGS = [
  { n: 8, color: '#a21942', title: { en: 'Decent work & growth', hi: 'अच्छा काम और विकास' }, body: { en: 'More paid days, clear terms, safer sites.', hi: 'ज़्यादा काम के दिन, साफ़ शर्तें, सुरक्षित साइट।' } },
  { n: 10, color: '#dd1367', title: { en: 'Reduced inequalities', hi: 'असमानता कम' }, body: { en: 'Access without English, literacy or a résumé.', hi: 'बिना अंग्रेज़ी, पढ़ाई या बायोडाटा के पहुँच।' } },
  { n: 1, color: '#e5243b', title: { en: 'No poverty', hi: 'ग़रीबी नहीं' }, body: { en: 'Insurance, pension and ration reach the worker.', hi: 'बीमा, पेंशन और राशन मज़दूर तक पहुँचे।' } },
  { n: 5, color: '#ff3a21', title: { en: 'Gender equality', hi: 'लैंगिक समानता' }, body: { en: 'Women crews, equal pay checks, safety lines.', hi: 'महिला टीमें, बराबर मज़दूरी, सुरक्षा हेल्पलाइन।' } },
];

const PERSONAS = [
  {
    name: 'Ramesh, 41',
    color: 'var(--trade-plumber)',
    role: { en: 'Plumber, 14 yrs · Kurla naka', hi: 'प्लंबर, 14 साल · कुर्ला नाका' },
    quote: { en: '“Some days I wait till noon and go home with nothing. I’m good at my work — people just can’t find me.”', hi: '“कभी-कभी दोपहर तक इंतज़ार करके ख़ाली हाथ घर जाता हूँ। काम अच्छा करता हूँ — बस लोग मुझे ढूँढ नहीं पाते।”' },
    need: { en: 'Be found by trade & area', hi: 'काम और इलाक़े से पहचान' },
  },
  {
    name: 'Sunita, 34',
    color: 'var(--trade-painter)',
    role: { en: 'Painter, leads a women’s crew', hi: 'पेंटर, महिला टीम की मुखिया' },
    quote: { en: '“Contractors pay us less than men for the same wall. I want the rate written before we start.”', hi: '“ठेकेदार एक ही दीवार के लिए हमें आदमियों से कम देते हैं। मुझे काम से पहले रेट लिखित में चाहिए।”' },
    need: { en: 'Pay agreed upfront', hi: 'पहले से तय मज़दूरी' },
  },
  {
    name: 'Arjun, 22',
    color: 'var(--trade-labour)',
    role: { en: 'Helper, new to Mumbai', hi: 'हेल्पर, मुंबई में नया' },
    quote: { en: '“An agent took ₹2,000 for a Dubai job. There was no job. I didn’t know who to ask.”', hi: '“एक एजेंट ने दुबई के काम के लिए ₹2,000 ले लिए। काम था ही नहीं। पता नहीं था किससे पूछूँ।”' },
    need: { en: 'Spot scams, get help', hi: 'धोखा पहचानें, मदद पाएँ' },
  },
  {
    name: 'Shalini, 52',
    color: 'var(--color-accent)',
    role: { en: 'Homeowner, Powai', hi: 'घर मालकिन, पवई' },
    quote: { en: '“I need a plumber I can trust inside my home — today, not next week.”', hi: '“मुझे ऐसा प्लंबर चाहिए जिस पर घर के अंदर भरोसा कर सकूँ — आज, अगले हफ़्ते नहीं।”' },
    need: { en: 'Verified help, fast', hi: 'जाँची हुई मदद, जल्दी' },
  },
];
