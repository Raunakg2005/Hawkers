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
    ? { cls: 'chip-danger', l: { en: 'Very serious', hi: 'बहुत गंभीर' }, color: 'var(--color-danger)' }
    : w >= 15
      ? { cls: 'chip-warning', l: { en: 'Serious', hi: 'गंभीर' }, color: 'var(--color-warning)' }
      : { cls: 'chip-accent', l: { en: 'Be careful', hi: 'सावधान रहें' }, color: 'var(--color-accent)' };

const MAX_WEIGHT = Math.max(...Object.values(RISK).map((r) => r.weight));

const PAY_TIPS: { icon: LucideIcon; color: string; title: L; body: L }[] = [
  {
    icon: LockKeyhole,
    color: 'var(--color-danger)',
    title: { en: 'PIN is only for SENDING money', hi: 'PIN सिर्फ़ पैसे भेजने के लिए है' },
    body: {
      en: 'You never enter your UPI PIN to receive money. If someone says “enter PIN to get paid” — it is a scam.',
      hi: 'पैसे लेने के लिए कभी UPI PIN नहीं डालना पड़ता। कोई कहे “पैसे पाने के लिए PIN डालो” — तो यह धोखा है।',
    },
  },
  {
    icon: QrCode,
    color: 'var(--color-warning)',
    title: { en: 'Don’t scan a QR to receive', hi: 'पैसे लेने के लिए QR स्कैन न करें' },
    body: {
      en: 'Scanning a QR code is for paying. To get paid, just share your UPI ID or mobile number.',
      hi: 'QR कोड स्कैन करना पैसे देने के लिए होता है। पैसे लेने के लिए बस अपनी UPI ID या मोबाइल नंबर बताएँ।',
    },
  },
  {
    icon: CalendarCheck,
    color: 'var(--color-success)',
    title: { en: 'Daily work = paid the same day', hi: 'दिहाड़ी = उसी दिन भुगतान' },
    body: {
      en: 'For one-day work, ask for full pay before you leave the site. That is the law, not a favour.',
      hi: 'एक दिन के काम में, साइट छोड़ने से पहले पूरी मज़दूरी माँगें। यह क़ानून है, एहसान नहीं।',
    },
  },
  {
    icon: KeyRound,
    color: 'var(--color-accent)',
    title: { en: 'OTP is like your house key', hi: 'OTP आपके घर की चाबी जैसा है' },
    body: {
      en: 'Bank, police or employer will never ask for it. Don’t tell anyone — not even “for verification”.',
      hi: 'बैंक, पुलिस या मालिक कभी OTP नहीं माँगते। किसी को न बताएँ — “वेरिफ़िकेशन” के लिए भी नहीं।',
    },
  },
  {
    icon: Banknote,
    color: 'var(--color-brand)',
    title: { en: 'Check before you leave', hi: 'जाने से पहले जाँच लें' },
    body: {
      en: 'Count cash in front of them. For UPI, see the “money received” message on your phone first.',
      hi: 'नकद उनके सामने गिनें। UPI में, पहले अपने फ़ोन पर “पैसे मिले” का मैसेज देखें।',
    },
  },
];

const jump: { href: string; icon: LucideIcon; l: L }[] = [
  { href: '#check', icon: ShieldCheck, l: { en: 'Check a job', hi: 'काम जाँचें' } },
  { href: '#red-flags', icon: Flag, l: { en: 'Red flags', hi: 'ख़तरे के निशान' } },
  { href: '#compare', icon: ShieldAlert, l: { en: 'Real vs fake', hi: 'असली बनाम नकली' } },
  { href: '#before-you-go', icon: ListChecks, l: { en: 'Before you go', hi: 'जाने से पहले' } },
  { href: '#payments', icon: Wallet, l: { en: 'Safe payments', hi: 'सुरक्षित भुगतान' } },
];

export default function SafetyPage() {
  const real = JOBS.find((j) => j.id === 'bathroom-pipe-repair-powai');
  const fake = JOBS.find((j) => j.id === 'urgent-dubai-visa');

  return (
    <>
      <PageHero
        tint="var(--color-danger)"
        eyebrow={<T en="Trust & safety" hi="भरोसा और सुरक्षा" />}
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
          />
        }
        lead={
          <T
            en="Fake agents target the workers who need work the most. Answer 7 simple questions to see if a job is safe — and learn the signs that protect your money, papers and family."
            hi="नकली एजेंट उन्हीं मज़दूरों को निशाना बनाते हैं जिन्हें काम की सबसे ज़्यादा ज़रूरत है। 7 आसान सवालों के जवाब दें और जानें कि काम सुरक्षित है या नहीं — और वे निशान सीखें जो आपके पैसे, कागज़ और परिवार को बचाते हैं।"
          />
        }
        aside={
          <div className={s.sos}>
            <p className={s.sosTitle}>
              <ShieldAlert aria-hidden="true" />
              <T en="Need help right now?" hi="अभी मदद चाहिए?" />
            </p>
            <HelplineGrid compact only={['112', '1930', '181']} />
          </div>
        }
      >
        <nav className={s.jump} aria-labelledby="safety-jump">
          <span id="safety-jump" className="sr-only">
            <T en="On this page" hi="इस पेज पर" />
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
              <T en="Job safety check · 1 minute" hi="काम की सुरक्षा जाँच · 1 मिनट" />
            </span>
            <h2 className="h2" id="check-title">
              <T en="Is this job safe?" hi="क्या यह काम सुरक्षित है?" />
            </h2>
            <p className="lead">
              <T
                en="Think of the job you were offered — on the phone, at the naka or online. Tap Yes, No or Not sure. Tap the speaker to hear each question."
                hi="जो काम आपको मिला है उसके बारे में सोचें — फ़ोन पर, नाके पर या ऑनलाइन। हाँ, नहीं या पता नहीं दबाएँ। हर सवाल सुनने के लिए स्पीकर दबाएँ।"
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
              <T en="Red flags" hi="ख़तरे के निशान" />
            </span>
            <h2 className="h2" id="flags-title">
              <T en="7 signs a job may be a trap." hi="7 निशान कि काम एक जाल हो सकता है।" />
            </h2>
            <p className="lead">
              <T en="Naka checks every listing for these signs and shows a warning on the job card. Learn them — they work offline too." hi="नाका हर काम में ये निशान जाँचता है और कार्ड पर चेतावनी दिखाता है। इन्हें याद रखें — ये बिना इंटरनेट भी काम आते हैं।" />
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
                      <ReadAloud en={`${r.label.en}. ${r.why.en}`} hi={`${r.label.hi}। ${r.why.hi}`} />
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
                <T en="Spot the difference" hi="फ़र्क़ पहचानें" />
              </span>
              <h2 className="h2" id="compare-title">
                <T en="A real job and a fake one, side by side." hi="एक असली और एक नकली काम, आमने-सामने।" />
              </h2>
              <p className="lead">
                <T en="Both look like normal job posts. Here is what gives each one away." hi="दोनों आम काम की पोस्ट जैसे दिखते हैं। देखिए किस बात से पहचान होती है।" />
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
              <T en="Before you go" hi="जाने से पहले" />
            </span>
            <h2 className="h2" id="go-title">
              <T en="Six small habits that keep you safe." hi="छह छोटी आदतें जो आपको सुरक्षित रखती हैं।" />
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
              <T en="Payment safety" hi="भुगतान की सुरक्षा" />
            </span>
            <h2 className="h2" id="pay-title">
              <T en="Get paid in full. Don’t lose it to a trick." hi="पूरा पैसा पाएँ। किसी चाल में न गँवाएँ।" />
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
                <T en="Write every payment in your work diary" hi="हर भुगतान अपनी काम डायरी में लिखें" />
              </h3>
              <p>
                <T
                  en="Your diary shows who still owes you — and becomes proof of work for welfare boards and loans."
                  hi="डायरी बताती है कि किसका पैसा बाक़ी है — और कल्याण बोर्ड व कर्ज़ के लिए काम का सबूत बनती है।"
                />
              </p>
              <Link href="/my-work" className={`btn ${s.ctaBtn}`}>
                <T en="Open my work diary" hi="मेरी काम डायरी खोलें" />
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
              <T en="Emergency & help lines — tap to call, free" hi="आपातकाल और मदद की लाइनें — टैप करके कॉल करें, मुफ़्त" />
            </h2>
            <Link href="/rights#help" className="btn btn-sm btn-ghost">
              <T en="What to do if you are not paid" hi="पैसा न मिले तो क्या करें" />
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
        title: { en: 'Employer is verified', hi: 'मालिक वेरिफ़ाइड है' },
        body: {
          en: `★ ${job.employer.rating} from ${job.employer.reviews} reviews · ${job.employer.hires} hires on Naka`,
          hi: `★ ${job.employer.rating}, ${job.employer.reviews} रिव्यू · नाका पर ${job.employer.hires} बार काम दिया`,
        },
      });
    notes.push({
      good: true,
      title: { en: 'Exact place is given', hi: 'सही जगह बताई गई है' },
      body: { en: `${job.area.en} — ${job.landmark.en}`, hi: `${job.area.hi} — ${job.landmark.hi}` },
    });
    const fair = job.pay.amount >= lo && job.pay.amount <= hi;
    notes.push({
      good: fair,
      title: fair ? { en: 'Pay is fair, not “too good”', hi: 'मज़दूरी सही है, “बहुत ज़्यादा” नहीं' } : { en: 'Check the pay', hi: 'मज़दूरी जाँचें' },
      body: {
        en: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en} — usual for a ${trade.name.en.toLowerCase()} is ${rupee(lo)}–${rupee(hi)}`,
        hi: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].hi} — ${trade.name.hi} का आम रेट ${rupee(lo)}–${rupee(hi)} है`,
      },
    });
    notes.push({
      good: true,
      title: { en: 'Hours and payday are clear', hi: 'घंटे और भुगतान का दिन साफ़ है' },
      body: {
        en: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].en} · ${job.payMode.map((m) => PAY_MODE[m].en).join(' / ')}`,
        hi: `${job.hours.start}–${job.hours.end} · ${PAID_WHEN[job.paidWhen].hi} · ${job.payMode.map((m) => PAY_MODE[m].hi).join(' / ')}`,
      },
    });
    if (job.flags.length === 0)
      notes.push({ good: true, title: { en: 'No fee. No documents asked.', hi: 'कोई फ़ीस नहीं। कोई कागज़ नहीं माँगा।' } });
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
          <p className={s.verdict}>{isReal ? <T en="Real job" hi="असली काम" /> : <T en="Fake job — a trap" hi="नकली काम — एक जाल" />}</p>
          <p className={s.verdictScore}>
            <T en="Trust score" hi="भरोसा अंक" />{' '}
            <b className="money">
              <span data-count={score}>{score}</span>/100
            </b>
            <span className={`chip ${level === 'safe' ? 'chip-success' : level === 'check' ? 'chip-warning' : 'chip-danger'}`}>
              {level === 'safe' ? <T en="Looks safe" hi="सुरक्षित लगता है" /> : level === 'check' ? <T en="Check first" hi="पहले जाँचें" /> : <T en="Risky" hi="ख़तरा" />}
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
    { icon: BadgeCheck, k: { en: 'Work', hi: 'काम' }, v: job.title },
    { icon: MapPin, k: { en: 'Place', hi: 'जगह' }, v: { en: `${job.area.en}, ${job.landmark.en}`, hi: `${job.area.hi}, ${job.landmark.hi}` } },
    { icon: Clock, k: { en: 'Hours', hi: 'समय' }, v: { en: `${job.start.en}, ${job.hours.start} – ${job.hours.end}`, hi: `${job.start.hi}, ${job.hours.start} – ${job.hours.end}` } },
    {
      icon: IndianRupee,
      k: { en: 'Pay', hi: 'मज़दूरी' },
      v: { en: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en}`, hi: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].hi}` },
    },
    {
      icon: CalendarCheck,
      k: { en: 'Payday', hi: 'भुगतान' },
      v: {
        en: `${PAID_WHEN[job.paidWhen].en} · ${job.payMode.map((m) => PAY_MODE[m].en).join(' / ')}`,
        hi: `${PAID_WHEN[job.paidWhen].hi} · ${job.payMode.map((m) => PAY_MODE[m].hi).join(' / ')}`,
      },
    },
  ];
  if (job.perks.length)
    rows.push({
      icon: Handshake,
      k: { en: 'Also', hi: 'साथ में' },
      v: { en: job.perks.map((p) => PERKS[p].en).join(', '), hi: job.perks.map((p) => PERKS[p].hi).join(', ') },
    });

  return (
    <aside className={s.promise} data-reveal="right" aria-labelledby="promise-title">
      <div className={s.promiseHead}>
        <span className="icon-tile" style={{ '--tile': 'var(--color-success)' } as React.CSSProperties}>
          <Handshake aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">
            <T en="Example" hi="उदाहरण" />
          </p>
          <h3 className={s.promiseTitle} id="promise-title">
            <T en="Work Promise" hi="काम का वादा" />
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
              <T en="Employer agreed" hi="मालिक ने माना" />
            </span>
          </span>
        </p>
        <p>
          <CircleCheck aria-hidden="true" />
          <span>
            <b>
              <T en="You" hi="आप" />
            </b>
            <span className="subtle">
              <T en="Worker agreed" hi="मज़दूर ने माना" />
            </span>
          </span>
        </p>
      </div>
      <p className={s.stamp} aria-hidden="true">
        <T en="Both agreed" hi="दोनों राज़ी" />
      </p>
      <p className="subtle">
        <T
          en="When you accept a job on Naka, both sides confirm this before work starts. If pay is late, it is your proof."
          hi="नाका पर काम लेते समय, दोनों पक्ष काम शुरू होने से पहले यह पक्का करते हैं। पैसा देर से मिले तो यही आपका सबूत है।"
        />
      </p>
    </aside>
  );
}
