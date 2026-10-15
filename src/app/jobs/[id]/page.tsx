import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Bus,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock,
  Footprints,
  Gift,
  Hourglass,
  Landmark,
  MapPin,
  Package,
  ScrollText,
  ShieldCheck,
  Star,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { JOBS, getJob } from '@/data/jobs';
import { DURATIONS, PAID_WHEN, PAY_MODE, PAY_UNIT, PERKS, RISK, TRADE, rupee, trustLevel, trustScore } from '@/data/trades';
import type { Job, L, RiskFlag } from '@/data/types';
import JobCard, { jobSpeech } from '@/components/JobCard';
import JobActions from '@/components/jobs/JobActions';
import ReadAloud from '@/components/ReadAloud';
import TrustBadge from '@/components/TrustBadge';
import { T, Tx } from '@/components/T';
import { TradeTile } from '@/components/TradeIcon';

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return { title: 'Job not found' };
  return { title: job.title.en, description: `${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en} · ${job.area.en} · ${PAID_WHEN[job.paidWhen].en}` };
}

/** Rough per-day value so any listing can be compared with the fair band. */
function perDay(job: Job) {
  const days = parseInt(job.length.en, 10) || 1;
  switch (job.pay.unit) {
    case 'day':
      return job.pay.amount;
    case 'month':
      return Math.round(job.pay.amount / 26);
    case 'hour':
      return job.pay.amount * 8;
    default:
      return Math.round(job.pay.amount / days);
  }
}

/** Position on the meter: red | amber | green (fair band) | amber | red */
function fairPosition(v: number, [lo, hi]: [number, number]) {
  if (v < lo) return Math.max(2, (v / lo) * 30);
  if (v <= hi) return 30 + ((v - lo) / (hi - lo)) * 32;
  return Math.min(98, 62 + ((v - hi) / hi) * 38);
}

const CHECKS: { flag: RiskFlag; ok: L }[] = [
  { flag: 'unverified', ok: { en: 'Employer phone & ID verified', hi: 'मालिक का फ़ोन और ID जाँचा गया', mr: 'मालकाचा फोन आणि ID पडताळला', gu: 'માલિકનો ફોન અને ID ચકાસાયેલ' } },
  { flag: 'advance-fee', ok: { en: 'No fee asked from you', hi: 'आपसे कोई फ़ीस नहीं माँगी', mr: 'तुमच्याकडे कोणतीही फी मागितली नाही', gu: 'તમારી પાસે કોઈ ફી માંગી નથી' } },
  { flag: 'no-address', ok: { en: 'Full work address given', hi: 'काम का पूरा पता दिया है', mr: 'कामाचा पूर्ण पत्ता दिला आहे', gu: 'કામનું પૂરું સરનામું આપ્યું છે' } },
  { flag: 'pay-too-high', ok: { en: 'Pay is in the normal range', hi: 'मज़दूरी सामान्य दायरे में है', mr: 'मजुरी नेहमीइतकीच आहे', gu: 'મજૂરી સામાન્ય હદમાં છે' } },
  { flag: 'vague', ok: { en: 'Tasks, hours and payday are clear', hi: 'काम, समय और भुगतान का दिन साफ़ है', mr: 'काम, वेळ आणि पैसे मिळण्याचा दिवस स्पष्ट आहे', gu: 'કામ, સમય અને ચુકવણીનો દિવસ સ્પષ્ટ છે' } },
  { flag: 'id-upfront', ok: { en: 'Does not ask for ATM card / OTP', hi: 'ATM कार्ड / OTP नहीं माँगा', mr: 'ATM कार्ड / OTP मागितला नाही', gu: 'ATM કાર્ડ / OTP માંગ્યો નથી' } },
];

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const trade = TRADE[job.trade];
  const score = trustScore(job.flags, job.employer.verified);
  const level = trustLevel(score);
  const risky = level === 'risky';
  const daily = perDay(job);
  const pos = fairPosition(daily, trade.fair);
  const fairState = daily < trade.fair[0] ? 'low' : daily > trade.fair[1] * 1.6 ? 'suspicious' : daily > trade.fair[1] ? 'high' : 'fair';
  const speech = jobSpeech(job);
  const similar = JOBS.filter((j) => j.id !== job.id && (j.trade === job.trade || j.duration === job.duration) && trustScore(j.flags, j.employer.verified) >= 50).slice(0, 3);
  const km = job.distanceKm;
  const scoreColor = level === 'safe' ? 'var(--color-success)' : level === 'check' ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <div className="page jobs-detail-page">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/jobs">
            <ArrowLeft aria-hidden="true" />
            <T en="All jobs" hi="सारे काम" mr="सगळी कामे" gu="બધાં કામ" />
          </Link>
          <span aria-hidden="true">/</span>
          <span>
            <Tx l={trade.name} />
          </span>
        </nav>

        {risky && (
          <div className="callout callout-danger" style={{ marginBottom: 'var(--space-6)' }} data-reveal="">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>
                <T en="Warning: this listing looks like a scam." hi="सावधान: यह काम धोखा लगता है।" mr="सावधान: हे काम फसवणूक वाटते." gu="સાવધાન: આ કામ છેતરપિંડી લાગે છે." />
              </strong>
              <p className="muted">
                <T en="Read the red flags below. Do not pay money or share documents." hi="नीचे लाल निशान पढ़ें। पैसे न दें, कागज़ न भेजें।" mr="खालच्या लाल खुणा वाचा. पैसे देऊ नका, कागदपत्रे पाठवू नका." gu="નીચેનાં લાલ નિશાન વાંચો. પૈસા ન આપો, કાગળો ન મોકલો." />
              </p>
            </div>
          </div>
        )}

        <div className="job-detail">
          <div>
            <header className="jd-head" data-reveal="">
              <TradeTile trade={job.trade} size="lg" />
              <div>
                <div className="row">
                  <span className={`chip chip-${job.duration}`}>
                    <Tx l={DURATIONS[job.duration].hint} /> · <Tx l={job.length} />
                  </span>
                  <TrustBadge score={score} />
                </div>
                <h1>
                  <Tx l={job.title} />
                </h1>
                <div className="row">
                  <span className="muted">
                    <T en="Posted by" hi="डाला गया" mr="टाकणारे" gu="મૂકનાર" /> <strong style={{ color: 'var(--color-heading)' }}>{job.employer.name}</strong>
                  </span>
                  <ReadAloud en={speech.en} hi={speech.hi} mr={speech.mr} gu={speech.gu} className="btn btn-sm" />
                </div>
              </div>
            </header>

            {/* The Work Promise */}
            <section className="jd-section" aria-labelledby="promise-h" data-reveal="">
              <h2 id="promise-h">
                <ScrollText aria-hidden="true" />
                <T en="Work Promise, the terms, before you go" hi="काम का वादा, जाने से पहले सारी शर्तें" mr="कामाचे वचन, जाण्याआधी सगळ्या अटी" gu="કામનું વચન, જતાં પહેલાં બધી શરતો" />
              </h2>
              <div className="promise">
                <dl className="promise-grid">
                  <div className="fact fact-big">
                    <span className="icon-tile" style={{ '--tile': 'var(--color-brand)' } as React.CSSProperties}>
                      <Banknote aria-hidden="true" />
                    </span>
                    <div>
                      <dt>
                        <T en="Pay" hi="मज़दूरी" mr="मजुरी" gu="મજૂરી" />
                      </dt>
                      <dd>
                        <span className="money">{rupee(job.pay.amount)}</span> <Tx l={PAY_UNIT[job.pay.unit]} />
                      </dd>
                    </div>
                  </div>
                  <Fact icon={<WalletCards />} tile="var(--color-success)" label={{ en: 'When paid', hi: 'कब मिलेगा', mr: 'कधी मिळेल', gu: 'ક્યારે મળશે' }}>
                    <Tx l={PAID_WHEN[job.paidWhen]} />
                  </Fact>
                  <Fact icon={<Landmark />} tile="var(--color-success)" label={{ en: 'How paid', hi: 'कैसे मिलेगा', mr: 'कसे मिळेल', gu: 'કેવી રીતે મળશે' }}>
                    {job.payMode.map((m, i) => (
                      <span key={m}>
                        {i > 0 && ' · '}
                        <Tx l={PAY_MODE[m]} />
                      </span>
                    ))}
                  </Fact>
                  <Fact icon={<Clock />} tile="var(--color-accent)" label={{ en: 'Hours', hi: 'समय', mr: 'वेळ', gu: 'સમય' }}>
                    {job.hours.start}, {job.hours.end}
                  </Fact>
                  <Fact icon={<CalendarDays />} tile="var(--color-accent)" label={{ en: 'Starts', hi: 'कब से', mr: 'कधीपासून', gu: 'ક્યારથી' }}>
                    <Tx l={job.start} />
                  </Fact>
                  <Fact icon={<Hourglass />} tile="var(--color-accent)" label={{ en: 'How long', hi: 'कितने दिन', mr: 'किती दिवस', gu: 'કેટલા દિવસ' }}>
                    <Tx l={job.length} />
                  </Fact>
                  <Fact icon={<UsersRound />} tile="var(--color-accent)" label={{ en: 'People needed', hi: 'कितने लोग', mr: 'किती लोक', gu: 'કેટલા લોકો' }}>
                    {job.workersNeeded}
                  </Fact>
                  <Fact icon={<MapPin />} tile="var(--color-trust)" label={{ en: 'Place', hi: 'जगह', mr: 'ठिकाण', gu: 'જગ્યા' }}>
                    <Tx l={job.area} />
                    <br />
                    <small className="muted">
                      <Tx l={job.landmark} />
                    </small>
                  </Fact>
                  <Fact icon={<Gift />} tile="var(--color-trust)" label={{ en: 'You get', hi: 'आपको मिलेगा', mr: 'तुम्हाला मिळेल', gu: 'તમને મળશે' }}>
                    {job.perks.length ? (
                      job.perks.map((p, i) => (
                        <span key={p}>
                          {i > 0 && ', '}
                          <Tx l={PERKS[p]} />
                        </span>
                      ))
                    ) : (
                      <T en="Nothing mentioned" hi="कुछ नहीं बताया" mr="काहीच सांगितले नाही" gu="કંઈ જણાવ્યું નથી" />
                    )}
                  </Fact>
                  <Fact icon={<Package />} tile="var(--color-trust)" label={{ en: 'Bring', hi: 'साथ लाएँ', mr: 'सोबत आणा', gu: 'સાથે લાવો' }}>
                    {job.bring.length ? job.bring.map((b) => <Tx key={b.en} l={b} />) : <T en="Nothing" hi="कुछ नहीं" mr="काही नाही" gu="કંઈ નહીં" />}
                  </Fact>
                </dl>
                <p className="lead" style={{ marginTop: 'var(--space-5)', color: 'var(--color-text)' }}>
                  <Tx l={job.description} />
                </p>
              </div>
            </section>

            {/* Fair pay */}
            <section className="jd-section" aria-labelledby="fair-h" data-reveal="">
              <h2 id="fair-h">
                <Banknote aria-hidden="true" />
                <T en="Is the pay fair?" hi="क्या मज़दूरी सही है?" mr="मजुरी योग्य आहे का?" gu="શું મજૂરી યોગ્ય છે?" />
              </h2>
              <div className="card fair-meter">
                <p>
                  {fairState === 'fair' && <T en={`Yes, about ${rupee(daily)} a day is normal for a ${trade.name.en.toLowerCase()} here.`} hi={`हाँ, यहाँ ${trade.name.hi} के लिए लगभग ${rupee(daily)} रोज़ सामान्य है।`} mr={`होय, इथे ${trade.name.mr} साठी रोज सुमारे ${rupee(daily)} नेहमीचे आहे.`} gu={`હા, અહીં ${trade.name.gu} માટે રોજના લગભગ ${rupee(daily)} સામાન્ય છે.`} />}
                  {fairState === 'high' && <T en={`Good pay, about ${rupee(daily)} a day, above the usual rate.`} hi={`अच्छी मज़दूरी, लगभग ${rupee(daily)} रोज़, आम रेट से ज़्यादा।`} mr={`चांगली मजुरी, रोज सुमारे ${rupee(daily)}, नेहमीच्या दरापेक्षा जास्त.`} gu={`સારી મજૂરી, રોજના લગભગ ${rupee(daily)}, સામાન્ય ભાવ કરતાં વધારે.`} />}
                  {fairState === 'low' && <T en={`Below normal, about ${rupee(daily)} a day. You can ask for more.`} hi={`सामान्य से कम, लगभग ${rupee(daily)} रोज़। आप ज़्यादा माँग सकते हैं।`} mr={`नेहमीपेक्षा कमी, रोज सुमारे ${rupee(daily)}. तुम्ही जास्त मागू शकता.`} gu={`સામાન્ય કરતાં ઓછી, રોજના લગભગ ${rupee(daily)}. તમે વધારે માંગી શકો છો.`} />}
                  {fairState === 'suspicious' && <T en={`Too good to be true, ${rupee(daily)} a day is far above normal. Be careful.`} hi={`सच होने के लिए बहुत अच्छा, ${rupee(daily)} रोज़ सामान्य से बहुत ज़्यादा है। सावधान रहें।`} mr={`खरे वाटण्याइतके चांगले नाही, रोज ${rupee(daily)} हे नेहमीपेक्षा खूपच जास्त आहे. सावध राहा.`} gu={`સાચું માનવા જેવું નથી, રોજના ${rupee(daily)} સામાન્ય કરતાં ઘણા વધારે છે. સાવધાન રહો.`} />}
                </p>
                <div className="fair-track" role="img" aria-label={`Fair band ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])}, this job ${rupee(daily)} per day`}>
                  <span className="fair-marker" style={{ left: `${pos}%` }} />
                </div>
                <div className="fair-labels">
                  <span>
                    <T en="Low" hi="कम" mr="कमी" gu="ઓછી" />
                  </span>
                  <span>
                    <T en="Fair" hi="सही" mr="योग्य" gu="યોગ્ય" /> {rupee(trade.fair[0])}, {rupee(trade.fair[1])}
                  </span>
                  <span>
                    <T en="Too high" hi="बहुत ज़्यादा" mr="खूप जास्त" gu="ઘણી વધારે" />
                  </span>
                </div>
                <p className="subtle">
                  <T en="Indicative city band from Naka listings, not an official minimum wage." hi="नाका के कामों से शहर का अनुमानित दायरा, सरकारी न्यूनतम मज़दूरी नहीं।" mr="नाकावरच्या कामांवरून शहरातला अंदाजे दर, ही सरकारी किमान मजुरी नाही." gu="નાકાનાં કામ પરથી શહેરનો અંદાજિત દર, સરકારી લઘુતમ મજૂરી નથી." />{' '}
                  <Link href="/rights#rights" style={{ textDecoration: 'underline' }}>
                    <T en="Know your wage rights" hi="मज़दूरी के अधिकार जानें" mr="मजुरीचे हक्क जाणून घ्या" gu="મજૂરીના હક જાણો" />
                  </Link>
                </p>
              </div>
            </section>

            {/* Trust shield */}
            <section className="jd-section" aria-labelledby="shield-h" data-reveal="">
              <h2 id="shield-h">
                <ShieldCheck aria-hidden="true" />
                <T en="Trust Shield check" hi="ट्रस्ट शील्ड जाँच" mr="ट्रस्ट शील्ड तपासणी" gu="ટ્રસ્ટ શીલ્ડ ચકાસણી" />
              </h2>
              <div className="card stack">
                <div className="shield-score">
                  <div className="score-ring" style={{ '--v': score, '--c': scoreColor } as React.CSSProperties}>
                    <span>{score}</span>
                  </div>
                  <div className="stack">
                    <TrustBadge score={score} compact />
                    <p className="muted">
                      <T en="We check every listing for common tricks used on workers." hi="हम हर काम में मज़दूरों के साथ होने वाले आम धोखों की जाँच करते हैं।" mr="कामगारांना फसवण्याच्या नेहमीच्या युक्त्या आम्ही प्रत्येक कामात तपासतो." gu="કામદારો સાથે થતી સામાન્ય છેતરપિંડી માટે અમે દરેક કામ તપાસીએ છીએ." />
                    </p>
                  </div>
                </div>
                <ul className="shield-list">
                  {CHECKS.map((c) => {
                    const bad = job.flags.includes(c.flag) || (c.flag === 'unverified' && !job.employer.verified);
                    return (
                      <li key={c.flag} className={bad ? 'bad' : 'ok'}>
                        {bad ? <CircleX aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
                        <span>
                          <strong>{bad ? <Tx l={RISK[c.flag].label} /> : <Tx l={c.ok} />}</strong>
                          {bad && (
                            <span className="muted">
                              <Tx l={RISK[c.flag].why} />
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/safety" className="btn btn-sm" style={{ justifySelf: 'start' }}>
                  <T en="How to stay safe" hi="सुरक्षित कैसे रहें" mr="सुरक्षित कसे राहावे" gu="સુરક્ષિત કેવી રીતે રહેવું" />
                </Link>
              </div>
            </section>

            {/* Getting there */}
            {km > 0 && (
              <section className="jd-section" aria-labelledby="route-h" data-reveal="">
                <h2 id="route-h">
                  <MapPin aria-hidden="true" />
                  <T en={`Getting there, ${km} km from your naka`} hi={`कैसे पहुँचें, आपके नाके से ${km} किमी`} mr={`कसे पोहोचाल, तुमच्या नाक्यापासून ${km} किमी`} gu={`કેવી રીતે પહોંચશો, તમારા નાકાથી ${km} કિમી`} />
                </h2>
                <div className="route">
                  {km <= 3 && (
                    <div>
                      <Footprints aria-hidden="true" />
                      <span>
                        <strong>~{Math.round(km * 13)} min</strong>
                        <small className="muted">
                          <T en="Walk" hi="पैदल" mr="चालत" gu="ચાલીને" />
                        </small>
                      </span>
                    </div>
                  )}
                  <div>
                    <Bus aria-hidden="true" />
                    <span>
                      <strong>~{Math.round(km * 4 + 10)} min</strong>
                      <small className="muted">
                        <T en="Bus · ₹10-20" hi="बस · ₹10-20" mr="बस · ₹10-20" gu="બસ · ₹10-20" />
                      </small>
                    </span>
                  </div>
                  <div>
                    <MapPin aria-hidden="true" />
                    <span>
                      <strong>~{rupee(Math.round(26 + Math.max(0, km - 1.5) * 17))}</strong>
                      <small className="muted">
                        <T en="Auto fare" hi="ऑटो किराया" mr="रिक्षाचे भाडे" gu="રિક્ષાનું ભાડું" />
                      </small>
                    </span>
                  </div>
                </div>
                {job.perks.includes('travel') && (
                  <p className="chip chip-success" style={{ justifySelf: 'start' }}>
                    <T en="Travel is paid by the employer" hi="किराया मालिक देंगे" mr="भाडे मालक देतील" gu="ભાડું માલિક આપશે" />
                  </p>
                )}
              </section>
            )}
          </div>

          <aside className="job-aside stack">
            <JobActions
              id={job.id}
              pay={rupee(job.pay.amount)}
              unit={PAY_UNIT[job.pay.unit]}
              paid={PAID_WHEN[job.paidWhen]}
              hours={`${job.hours.start}, ${job.hours.end}`}
              start={job.start}
              phone={job.employer.phone}
              employer={job.employer.name}
              risky={risky}
              share={{
                en: `Job on Naka: ${job.title.en}, ${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].en}, ${job.area.en}. Employer: ${job.employer.name}, ${job.employer.phone}.`,
                hi: `नाका पर काम: ${job.title.hi}, ${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].hi}, ${job.area.hi}। मालिक: ${job.employer.name}, ${job.employer.phone}।`,
                mr: `नाकावर काम: ${job.title.mr}, ${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].mr}, ${job.area.mr}. मालक: ${job.employer.name}, ${job.employer.phone}.`,
                gu: `નાકા પર કામ: ${job.title.gu}, ${rupee(job.pay.amount)} ${PAY_UNIT[job.pay.unit].gu}, ${job.area.gu}. માલિક: ${job.employer.name}, ${job.employer.phone}.`,
              }}
            />

            <div className="card employer">
              <div className="employer-top">
                <span className="employer-initial" aria-hidden="true">
                  {job.employer.name.replace(/^(Mrs?\.|Mr\.)\s*/, '').charAt(0)}
                </span>
                <div>
                  <strong style={{ color: 'var(--color-heading)', display: 'block' }}>{job.employer.name}</strong>
                  <span className="muted">
                    <Tx l={job.employer.kind} /> · <T en={`on Naka since ${job.employer.since}`} hi={`${job.employer.since} से नाका पर`} mr={`${job.employer.since} पासून नाकावर`} gu={`${job.employer.since}થી નાકા પર`} />
                  </span>
                </div>
              </div>
              {job.employer.verified ? (
                <span className="chip chip-trust" style={{ justifySelf: 'start' }}>
                  <BadgeCheck aria-hidden="true" /> <T en="Phone & ID verified" hi="फ़ोन और ID जाँचा गया" mr="फोन आणि ID पडताळलेले" gu="ફોન અને ID ચકાસાયેલ" />
                </span>
              ) : (
                <span className="chip chip-warning" style={{ justifySelf: 'start' }}>
                  <T en="Not verified yet" hi="अभी जाँच नहीं हुई" mr="अजून पडताळणी झाली नाही" gu="હજી ચકાસણી થઈ નથી" />
                </span>
              )}
              <div className="employer-stats">
                <div>
                  <strong>
                    {job.employer.rating > 0 ? (
                      <>
                        <Star aria-hidden="true" className="star" style={{ width: 16, height: 16, display: 'inline' }} /> {job.employer.rating}
                      </>
                    ) : (
                      ', '
                    )}
                  </strong>
                  <small>
                    {job.employer.reviews} <T en="reviews" hi="रिव्यू" mr="रिव्ह्यू" gu="રિવ્યૂ" />
                  </small>
                </div>
                <div>
                  <strong>{job.employer.hires}</strong>
                  <small>
                    <T en="hires" hi="लोगों को काम" mr="लोकांना काम" gu="લોકોને કામ" />
                  </small>
                </div>
                <div>
                  <strong>{job.employer.verified ? '100%' : ', '}</strong>
                  <small>
                    <T en="paid on time" hi="समय पर भुगतान" mr="वेळेवर पैसे" gu="સમયસર ચુકવણી" />
                  </small>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="section-tight" aria-labelledby="sim-h">
            <h2 id="sim-h" className="h2" style={{ marginBottom: 'var(--space-6)' }}>
              <T en="Similar work nearby" hi="पास में ऐसे ही काम" mr="जवळपास अशीच कामे" gu="નજીકમાં આવાં જ કામ" />
            </h2>
            <div className="cards-grid">
              {similar.map((j, i) => (
                <JobCard key={j.id} job={j} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Fact({ icon, tile, label, children }: { icon: React.ReactNode; tile: string; label: L; children: React.ReactNode }) {
  return (
    <div className="fact">
      <span className="icon-tile" style={{ '--tile': tile } as React.CSSProperties} aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt>
          <Tx l={label} />
        </dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}
