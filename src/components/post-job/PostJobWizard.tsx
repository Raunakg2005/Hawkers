'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Eye,
  HardHat,
  House,
  IndianRupee,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Store,
  TriangleAlert,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import type { Duration, Job, L, Lang, PaidWhen, PayMode, PayUnit, Perk, TradeId } from '@/data/types';
import { DURATIONS, PAID_WHEN, PAY_MODE, PAY_UNIT, PERKS, TRADE, TRADES, rupee } from '@/data/trades';
import { T, Tx } from '@/components/T';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import JobCard from '@/components/JobCard';
import FairBand, { fairStatus } from '@/components/workers/FairBand';
import { useLang } from '@/lib/prefs';
import { localeOf } from '@/lib/i18n';
import { AREAS, DEFAULT_DRAFT, IDEAS, KINDS, STEPS, reviveDraft, type Draft, type Kind } from './postjob-data';
import s from './postjob.module.css';

const KEY = 'naka-job-draft';
const KIND_ICON = { household: House, shop: Store, contractor: HardHat, society: Building2 } as const;
const UNITS: PayUnit[] = ['day', 'hour', 'job', 'month'];
const PAYDAYS: PaidWhen[] = ['same-day', 'weekly', 'on-completion', 'monthly'];
const MODES: PayMode[] = ['upi', 'cash', 'bank'];
const PERK_LIST = Object.keys(PERKS) as Perk[];
const DURATION_LIST: Duration[] = ['daily', 'short', 'long'];

type ErrKey = 'trade' | 'title' | 'area' | 'date' | 'hours' | 'amount' | 'payMode';

const ERR: Record<ErrKey, L> = {
  trade: { en: 'Choose the type of work.', hi: 'काम का प्रकार चुनें।', mr: 'कामाचा प्रकार निवडा.', gu: 'કામનો પ્રકાર પસંદ કરો.' },
  title: { en: 'Give the job a short title (at least 4 letters).', hi: 'काम का छोटा नाम लिखें (कम से कम 4 अक्षर)।', mr: 'कामाचे छोटे नाव लिहा (किमान 4 अक्षरे).', gu: 'કામનું ટૂંકું નામ લખો (ઓછામાં ઓછા 4 અક્ષર).' },
  area: { en: 'Choose the area where the work is.', hi: 'काम का इलाका चुनें।', mr: 'कामाचा भाग निवडा.', gu: 'કામનો વિસ્તાર પસંદ કરો.' },
  date: { en: 'Pick the start date.', hi: 'शुरू होने की तारीख़ चुनें।', mr: 'सुरुवातीची तारीख निवडा.', gu: 'શરૂ થવાની તારીખ પસંદ કરો.' },
  hours: { en: 'End time must be after start time.', hi: 'ख़त्म होने का समय, शुरू के समय के बाद होना चाहिए।', mr: 'संपण्याची वेळ सुरू होण्याच्या वेळेनंतर असायला हवी.', gu: 'પૂરું થવાનો સમય શરૂ થવાના સમય પછી હોવો જોઈએ.' },
  amount: { en: 'Enter the pay amount.', hi: 'मज़दूरी की रकम लिखें।', mr: 'मजुरीची रक्कम लिहा.', gu: 'મજૂરીની રકમ લખો.' },
  payMode: { en: 'Choose at least one way to pay.', hi: 'भुगतान का कम से कम एक तरीका चुनें।', mr: 'पैसे देण्याची किमान एक पद्धत निवडा.', gu: 'પૈસા આપવાની ઓછામાં ઓછી એક રીત પસંદ કરો.' },
};

const isTrade = (v: string | null): v is TradeId => !!v && v in TRADE;
const mins = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};
const isoDay = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

function validate(step: number, d: Draft): ErrKey[] {
  const e: ErrKey[] = [];
  if (step === 0) {
    if (!d.trade) e.push('trade');
    if (d.title.trim().length < 4) e.push('title');
  }
  if (step === 1) {
    if (!d.area) e.push('area');
    if (d.start === 'date' && !d.date) e.push('date');
    if (!(mins(d.hoursEnd) > mins(d.hoursStart))) e.push('hours');
  }
  if (step === 2) {
    if (!(d.amount > 0)) e.push('amount');
    if (!d.payMode.length) e.push('payMode');
  }
  return e;
}

const FIELD_ID: Record<ErrKey, string> = {
  trade: 'pj-trade',
  title: 'pj-title',
  area: 'pj-area',
  date: 'pj-date',
  hours: 'pj-hours-end',
  amount: 'pj-amount',
  payMode: 'pj-paymode',
};

/** Reads ?trade= so "Post a job" links from a worker profile arrive pre-filled. Render inside <Suspense>. */
export function PostJobWizardFromUrl() {
  const p = useSearchParams();
  const tr = p.get('trade');
  return <PostJobWizard initialTrade={isTrade(tr) ? tr : null} />;
}

export default function PostJobWizard({ initialTrade }: { initialTrade: TradeId | null }) {
  const { t, lang } = useLang();
  const [d, setD] = useState<Draft>({ ...DEFAULT_DRAFT, trade: initialTrade });
  const [loaded, setLoaded] = useState(false);
  const [restored, setRestored] = useState(false);
  const [errors, setErrors] = useState<ErrKey[]>([]);
  const [published, setPublished] = useState<Job | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [announce, setAnnounce] = useState('');
  const headRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  // Restore a saved draft (client only → no hydration mismatch)
  useEffect(() => {
    setMinDate(isoDay(new Date()));
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? reviveDraft(JSON.parse(raw)) : null;
      if (saved && (saved.trade || saved.title || saved.amount)) {
        setD(initialTrade && !saved.trade ? { ...saved, trade: initialTrade } : saved);
        setRestored(true);
      }
    } catch {
      /* corrupt or blocked storage — start fresh */
    }
    setLoaded(true);
  }, [initialTrade]);

  // Auto-save
  useEffect(() => {
    if (!loaded || published) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch {
      /* ignore */
    }
  }, [d, loaded, published]);

  // Focus + scroll on step change (only after a user action)
  useEffect(() => {
    if (!navigated.current) return;
    navigated.current = false;
    headRef.current?.focus({ preventScroll: true });
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) {
      const y = top.getBoundingClientRect().top + window.scrollY - 96;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [d.step, published]);

  const patch = (p: Partial<Draft>) => {
    setD((prev) => ({ ...prev, ...p }));
    if (errors.length) setErrors((cur) => cur.filter((k) => !(Object.keys(p) as string[]).some((f) => k === f || (k === 'hours' && f.startsWith('hours')))));
  };

  /* ── derived values */
  const trade = d.trade ? TRADE[d.trade] : null;
  const area = AREAS.find((a) => a.id === d.area);
  const dayMins = mins(d.hoursEnd) - mins(d.hoursStart);
  const hoursOk = dayMins > 0;
  const hoursPerDay = hoursOk ? dayMins / 60 : 8;
  const totalDays = d.duration === 'daily' ? 1 : d.duration === 'short' ? d.length : d.length * 26;
  const perDay = d.unit === 'day' ? d.amount : d.unit === 'hour' ? d.amount * hoursPerDay : d.unit === 'month' ? d.amount / 26 : d.amount / totalDays;
  const fair = d.trade && d.amount > 0 ? fairStatus(d.trade, perDay) : null;
  const totalCost = Math.round(perDay * totalDays * d.workersNeeded);

  const fairTarget = () => {
    if (!trade) return 0;
    const mid = (trade.fair[0] + trade.fair[1]) / 2;
    const r = (v: number, step: number) => Math.ceil(v / step) * step;
    if (d.unit === 'day') return r(mid, 50);
    if (d.unit === 'hour') return r(mid / hoursPerDay, 10);
    if (d.unit === 'month') return r(mid * 26, 500);
    return r(mid * totalDays, 100);
  };

  const lengthL: L =
    d.duration === 'daily'
      ? { en: '1 day', hi: '1 दिन', mr: '1 दिवस', gu: '1 દિવસ' }
      : d.duration === 'short'
        ? { en: `${d.length} days`, hi: `${d.length} दिन`, mr: `${d.length} दिवस`, gu: `${d.length} દિવસ` }
        : {
            en: `${d.length} ${d.length === 1 ? 'month' : 'months'}`,
            hi: `${d.length} ${d.length === 1 ? 'महीना' : 'महीने'}`,
            mr: `${d.length} ${d.length === 1 ? 'महिना' : 'महिने'}`,
            gu: `${d.length} ${d.length === 1 ? 'મહિનો' : 'મહિના'}`,
          };

  const startL: L = useMemo(() => {
    if (d.start === 'today') return { en: 'Today', hi: 'आज', mr: 'आज', gu: 'આજે' };
    if (d.start === 'tomorrow') return { en: 'Tomorrow', hi: 'कल', mr: 'उद्या', gu: 'આવતીકાલે' };
    const dt = new Date(d.date + 'T00:00:00');
    if (!d.date || Number.isNaN(dt.getTime())) return { en: 'Date to be fixed', hi: 'तारीख़ तय होनी है', mr: 'तारीख ठरायची आहे', gu: 'તારીખ નક્કી કરવાની છે' };
    const o: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const fmt = (l: Lang) => dt.toLocaleDateString(localeOf(l), o);
    return { en: fmt('en'), hi: fmt('hi'), mr: fmt('mr'), gu: fmt('gu') };
  }, [d.start, d.date]);

  const titleL: L = (() => {
    const idea = d.trade && d.ideaIdx !== null ? IDEAS[d.trade][d.ideaIdx] : null;
    const typed = d.title.trim();
    if (idea && [idea.en, idea.hi, idea.mr, idea.gu].includes(typed)) return idea;
    return typed ? { en: typed, hi: typed, mr: typed, gu: typed } : { en: 'Your job title', hi: 'आपके काम का नाम', mr: 'तुमच्या कामाचे नाव', gu: 'તમારા કામનું નામ' };
  })();

  const job: Job = {
    id: 'draft',
    title: titleL,
    trade: d.trade ?? 'labour',
    duration: d.duration,
    length: lengthL,
    employer: {
      name: d.name.trim() || KINDS[d.kind][lang] || KINDS[d.kind].en,
      kind: KINDS[d.kind],
      verified: true,
      rating: 0,
      reviews: 0,
      hires: 0,
      since: 2026,
      phone: '',
    },
    area: area?.name ?? { en: 'Area not chosen', hi: 'इलाका नहीं चुना', mr: 'भाग निवडलेला नाही', gu: 'વિસ્તાર પસંદ કર્યો નથી' },
    city: 'Mumbai',
    landmark: { en: d.landmark.trim(), hi: d.landmark.trim(), mr: d.landmark.trim(), gu: d.landmark.trim() },
    distanceKm: area?.km ?? 0,
    map: area?.map ?? { x: 50, y: 50 },
    pay: { amount: d.amount, unit: d.unit },
    paidWhen: d.paidWhen,
    payMode: d.payMode,
    hours: { start: d.hoursStart, end: d.hoursEnd },
    start: startL,
    perks: d.perks,
    workersNeeded: d.workersNeeded,
    description: { en: d.description.trim(), hi: d.description.trim(), mr: d.description.trim(), gu: d.description.trim() },
    bring: [],
    postedHoursAgo: 0,
    flags: [],
  };

  const checks: { id: string; ok: boolean; step: number; label: L }[] = [
    { id: 'title', ok: d.title.trim().length >= 6, step: 0, label: { en: 'A clear job title', hi: 'काम का साफ़ नाम', mr: 'कामाचे स्पष्ट नाव', gu: 'કામનું સાફ નામ' } },
    { id: 'desc', ok: d.description.trim().length >= 40, step: 0, label: { en: 'Tasks described (40+ letters)', hi: 'काम का विवरण (40+ अक्षर)', mr: 'कामाचे वर्णन (40+ अक्षरे)', gu: 'કામની વિગત (40+ અક્ષર)' } },
    { id: 'address', ok: !!area && d.landmark.trim().length >= 4, step: 1, label: { en: 'Exact area and landmark', hi: 'सही इलाका और निशानी', mr: 'अचूक भाग आणि खूण', gu: 'ચોક્કસ વિસ્તાર અને નિશાની' } },
    { id: 'hours', ok: hoursOk, step: 1, label: { en: 'Start and end time', hi: 'शुरू और ख़त्म का समय', mr: 'सुरू आणि संपण्याची वेळ', gu: 'શરૂ અને પૂરું થવાનો સમય' } },
    { id: 'payday', ok: d.payMode.length > 0, step: 2, label: { en: 'Payday and payment mode written', hi: 'भुगतान का दिन और तरीका लिखा', mr: 'पगाराचा दिवस आणि पद्धत लिहिली', gu: 'પગારનો દિવસ અને રીત લખી' } },
    { id: 'fair', ok: fair !== null && fair !== 'below', step: 2, label: { en: 'Pay at or above the fair rate', hi: 'मज़दूरी सही दाम या उससे ज़्यादा', mr: 'मजुरी योग्य दराइतकी किंवा जास्त', gu: 'મજૂરી યોગ્ય દર જેટલી કે વધારે' } },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const scoreTone = score >= 85 ? 'good' : score >= 50 ? 'ok' : 'low';

  /* ── navigation */
  const goTo = (target: number) => {
    if (target > d.step) {
      for (let st = d.step; st < target; st++) {
        const e = validate(st, d);
        if (e.length) {
          setErrors(e);
          if (st !== d.step) {
            navigated.current = true;
            setD((p) => ({ ...p, step: st }));
          }
          requestAnimationFrame(() => document.getElementById(FIELD_ID[e[0]])?.focus());
          setAnnounce(t(ERR[e[0]].en, ERR[e[0]].hi, ERR[e[0]].mr, ERR[e[0]].gu));
          return;
        }
      }
    }
    setErrors([]);
    navigated.current = true;
    setD((p) => ({ ...p, step: target, seen: Math.max(p.seen, target) }));
    setAnnounce(t(`Step ${target + 1} of 4: ${STEPS[target].title.en}`, `कदम ${target + 1} / 4: ${STEPS[target].title.hi}`, `पायरी ${target + 1} / 4: ${STEPS[target].title.mr}`, `પગલું ${target + 1} / 4: ${STEPS[target].title.gu}`));
  };

  const publish = () => {
    for (let st = 0; st < 3; st++) {
      const e = validate(st, d);
      if (e.length) {
        setErrors(e);
        navigated.current = true;
        setD((p) => ({ ...p, step: st }));
        setAnnounce(t(ERR[e[0]].en, ERR[e[0]].hi, ERR[e[0]].mr, ERR[e[0]].gu));
        requestAnimationFrame(() => document.getElementById(FIELD_ID[e[0]])?.focus());
        return;
      }
    }
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    navigated.current = true;
    setPublished({ ...job, postedHoursAgo: 0 });
    setAnnounce(t('Your job is live (demo).', 'आपका काम लाइव है (डेमो)।', 'तुमचे काम लाइव्ह झाले (डेमो).', 'તમારું કામ લાઇવ થઈ ગયું (ડેમો).'));
  };

  const startOver = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setPublished(null);
    setRestored(false);
    setErrors([]);
    navigated.current = true;
    setD({ ...DEFAULT_DRAFT });
    setAnnounce(t('Started a new job post.', 'नया काम डालना शुरू किया।', 'नवीन काम टाकायला सुरुवात केली.', 'નવું કામ મૂકવાનું શરૂ કર્યું.'));
  };

  const has = (k: ErrKey) => errors.includes(k);
  const errProps = (k: ErrKey) => ({ 'aria-invalid': has(k) || undefined, 'aria-describedby': has(k) ? `${FIELD_ID[k]}-err` : undefined });
  const errMsg = (k: ErrKey) =>
    has(k) ? (
      <p id={`${FIELD_ID[k]}-err`} className={s.err}>
        <TriangleAlert aria-hidden="true" />
        <Tx l={ERR[k]} />
      </p>
    ) : null;

  const toggle = <V,>(list: V[], v: V) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  /* ── published */
  if (published) {
    const pt = TRADE[published.trade];
    return (
      <div ref={topRef} className={s.success}>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <div className={s.burst} aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} style={{ '--a': `${(360 / 28) * i + (i % 3) * 5}deg`, '--r': `${110 + (i % 4) * 34}px`, '--k': i % 6 } as React.CSSProperties} />
          ))}
          <span className={s.ring} />
          <span className={`${s.ring} ${s.ring2}`} />
        </div>
        <span className={s.successIcon}>
          <CircleCheck aria-hidden="true" />
        </span>
        <h2 ref={headRef} tabIndex={-1} className="h2">
          <T en="Your job is live (demo)" hi="आपका काम लाइव है (डेमो)" mr="तुमचे काम लाइव्ह झाले (डेमो)" gu="તમારું કામ લાઇવ થઈ ગયું (ડેમો)" />
        </h2>
        <p className="lead">
          <T
            en={`${pt.name.en} workers near ${published.area.en} now get a voice alert in their own language. Calls reach you on a private Naka number, your phone stays hidden.`}
            hi={`${published.area.hi} के पास के ${pt.name.hi} को अब उनकी अपनी भाषा में आवाज़ से सूचना मिल रही है। कॉल नाका के प्राइवेट नंबर से आएँगे, आपका नंबर छिपा रहेगा।`}
            mr={`${published.area.mr} जवळच्या ${pt.name.mr} कामगारांना आता त्यांच्या भाषेत आवाजात सूचना मिळत आहे. फोन नाकाच्या प्रायव्हेट नंबरवरून येतील, तुमचा नंबर लपलेला राहील.`}
            gu={`${published.area.gu} પાસેના ${pt.name.gu} કામદારોને હવે તેમની પોતાની ભાષામાં અવાજથી સૂચના મળી રહી છે. ફોન નાકાના પ્રાઇવેટ નંબરથી આવશે, તમારો નંબર છુપાયેલો રહેશે.`}
          />
        </p>
        <div
          className={`${s.successCard} ${s.preview}`}
          onClickCapture={(e) => {
            // demo listing has no detail page yet
            if ((e.target as HTMLElement).closest('a')) e.preventDefault();
          }}
        >
          <JobCard job={published} href={null} />
        </div>
        <ol className={s.next}>
          <li>
            <span>1</span>
            <T en="Workers tap “I’m interested”" hi="कारीगर “मुझे यह काम चाहिए” दबाते हैं" mr="कामगार “मला हे काम हवे आहे” दाबतात" gu="કામદારો “મને આ કામ જોઈએ છે” દબાવે છે" />
          </li>
          <li>
            <span>2</span>
            <T en="You see their skill card and endorsements" hi="आप उनका स्किल कार्ड और राय देखते हैं" mr="तुम्ही त्यांचे स्किल कार्ड आणि मत पाहता" gu="તમે તેમનું સ્કિલ કાર્ડ અને અભિપ્રાય જુઓ છો" />
          </li>
          <li>
            <span>3</span>
            <T en="Agree → both get the same Work Promise" hi="सहमति → दोनों को एक जैसा काम का वादा" mr="संमती → दोघांनाही सारखेच कामाचे वचन" gu="સંમતિ → બંનેને એકસરખું કામનું વચન" />
          </li>
        </ol>
        <div className={s.successActions}>
          <Link href="/jobs" className="btn btn-primary btn-lg">
            <Eye aria-hidden="true" />
            <T en="See it with other jobs" hi="बाकी कामों के साथ देखें" mr="इतर कामांसोबत पाहा" gu="બીજાં કામો સાથે જુઓ" />
          </Link>
          <Link href={`/workers?trade=${published.trade}`} className="btn btn-lg">
            <UsersRound aria-hidden="true" />
            <T en="Invite workers directly" hi="सीधे कारीगर बुलाएँ" mr="थेट कारागीर बोलवा" gu="સીધા કારીગર બોલાવો" />
          </Link>
          <button type="button" className="btn btn-ghost btn-lg" onClick={startOver}>
            <Plus aria-hidden="true" />
            <T en="Post another job" hi="एक और काम डालें" mr="आणखी एक काम टाका" gu="બીજું એક કામ મૂકો" />
          </button>
        </div>
      </div>
    );
  }

  const step = d.step;
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div ref={topRef} className={s.wizard}>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {/* ── Progress */}
      <div className={s.progress}>
        <ol className={s.steps}>
          {STEPS.map((st, i) => {
            const state = i === step ? 'current' : i <= d.seen ? 'done' : 'todo';
            return (
              <li key={st.short.en} data-state={state}>
                <button type="button" onClick={() => goTo(i)} disabled={i > d.seen + 1 || i === step} aria-current={i === step ? 'step' : undefined}>
                  <span className={s.stepDot}>{state === 'done' ? <Check aria-hidden="true" /> : i + 1}</span>
                  <span className={s.stepLabel}>
                    <Tx l={st.short} />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className={s.saveRow}>
          <span className={s.saved} aria-live="polite">
            <Save aria-hidden="true" />
            {restored ? <T en="Draft restored · saves on this phone" hi="ड्राफ़्ट वापस आया · इसी फ़ोन पर सेव" mr="ड्राफ्ट परत आला · याच फोनवर जतन" gu="ડ્રાફ્ટ પાછો આવ્યો · આ જ ફોનમાં સચવાય છે" /> : <T en="Saves automatically on this phone" hi="इसी फ़ोन पर अपने-आप सेव होता है" mr="याच फोनवर आपोआप जतन होते" gu="આ જ ફોનમાં આપમેળે સચવાય છે" />}
          </span>
          {(restored || d.trade || d.title) && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={startOver}>
              <RotateCcw aria-hidden="true" />
              <T en="Start over" hi="फिर से शुरू करें" mr="पुन्हा सुरू करा" gu="ફરીથી શરૂ કરો" />
            </button>
          )}
        </div>
      </div>

      <form
        className={s.panel}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) goTo(step + 1);
          else publish();
        }}
      >
        <header className={s.panelHead}>
          <span className={s.stepCount}>
            <T en={`Step ${step + 1} of 4`} hi={`कदम ${step + 1} / 4`} mr={`पायरी ${step + 1} / 4`} gu={`પગલું ${step + 1} / 4`} />
          </span>
          <h2 ref={headRef} tabIndex={-1} className="h3">
            <Tx l={STEPS[step].title} />
          </h2>
        </header>

        {/* ───── Step 1 · What work */}
        {step === 0 && (
          <div className={s.body} key="s0">
            <fieldset className={s.fs}>
              <legend className="label">
                <T en="Who is hiring?" hi="काम कौन दे रहा है?" mr="काम कोण देत आहे?" gu="કામ કોણ આપે છે?" />
              </legend>
              <div className={s.chips}>
                {(Object.keys(KINDS) as Kind[]).map((k) => {
                  const Icon = KIND_ICON[k];
                  return (
                    <button key={k} type="button" className="filter-chip" aria-pressed={d.kind === k} onClick={() => patch({ kind: k })}>
                      <Icon aria-hidden="true" />
                      <Tx l={KINDS[k]} />
                    </button>
                  );
                })}
              </div>
              <label className="field">
                <span className="label">
                  <T en="Name shown to workers" hi="कारीगरों को दिखने वाला नाम" mr="कामगारांना दिसणारे नाव" gu="કામદારોને દેખાતું નામ" /> <span className="subtle">(<T en="optional" hi="ज़रूरी नहीं" mr="गरजेचे नाही" gu="જરૂરી નથી" />)</span>
                </span>
                <input
                  className="input"
                  value={d.name}
                  maxLength={40}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder={t('e.g. Mrs. Rao, Gupta Mobiles', 'जैसे: श्रीमती राव, गुप्ता मोबाइल्स', 'उदा. श्रीमती राव, गुप्ता मोबाइल्स', 'જેમ કે: શ્રીમતી રાવ, ગુપ્તા મોબાઇલ્સ')}
                  autoComplete="organization"
                />
              </label>
            </fieldset>

            <fieldset className={s.fs}>
              <legend className="label">
                <T en="Type of work" hi="काम का प्रकार" mr="कामाचा प्रकार" gu="કામનો પ્રકાર" />
              </legend>
              <div id="pj-trade" tabIndex={-1} className={s.tradeGrid} {...errProps('trade')}>
                {TRADES.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    className={s.tradeTile}
                    aria-pressed={d.trade === tr.id}
                    onClick={() => patch({ trade: tr.id, ideaIdx: d.trade === tr.id ? d.ideaIdx : null })}
                    style={{ '--tile': tradeColor(tr.id) } as React.CSSProperties}
                  >
                    <span className={s.tradeIcon}>
                      <TradeIcon trade={tr.id} />
                    </span>
                    <b>
                      <Tx l={tr.name} />
                    </b>
                    <small>
                      <Tx l={tr.verb} />
                    </small>
                    <Check aria-hidden="true" className={s.tick} />
                  </button>
                ))}
              </div>
              {errMsg('trade')}
            </fieldset>

            <div className="field">
              <label className="label" htmlFor="pj-title">
                <T en="Short title" hi="छोटा नाम" mr="छोटे नाव" gu="ટૂંકું નામ" />
              </label>
              {d.trade && (
                <div className={s.ideas}>
                  <span className="subtle">
                    <Sparkles aria-hidden="true" /> <T en="Quick pick:" hi="जल्दी चुनें:" mr="पटकन निवडा:" gu="ઝટપટ પસંદ કરો:" />
                  </span>
                  {IDEAS[d.trade].map((idea, i) => (
                    <button
                      key={idea.en}
                      type="button"
                      className={`chip chip-brand ${s.ideaChip}`}
                      aria-pressed={d.ideaIdx === i && [idea.en, idea.hi, idea.mr, idea.gu].includes(d.title)}
                      onClick={() => patch({ title: t(idea.en, idea.hi, idea.mr, idea.gu), ideaIdx: i })}
                    >
                      <Tx l={idea} />
                    </button>
                  ))}
                </div>
              )}
              <input
                id="pj-title"
                className="input"
                value={d.title}
                maxLength={70}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder={t('e.g. Fix leaking bathroom pipe', 'जैसे: बाथरूम की टपकती पाइप ठीक करनी है', 'उदा. बाथरूमचा गळणारा पाईप दुरुस्त करायचा आहे', 'જેમ કે: બાથરૂમની ટપકતી પાઇપ રિપેર કરવાની છે')}
                {...errProps('title')}
              />
              {errMsg('title')}
            </div>

            <div className="field">
              <label className="label" htmlFor="pj-desc">
                <T en="What exactly needs doing?" hi="ठीक-ठीक क्या काम है?" mr="नेमके काय काम आहे?" gu="બરાબર શું કામ છે?" />
              </label>
              <textarea
                id="pj-desc"
                className="textarea"
                value={d.description}
                maxLength={500}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder={t(
                  'e.g. Two bathrooms. Basin pipe leaks, shower mixer needs a new cartridge. We will buy parts, you tell us what. 3rd floor, lift available.',
                  'जैसे: दो बाथरूम। बेसिन की पाइप टपक रही है, शावर मिक्सर में नया कार्ट्रिज लगाना है। सामान हम लाएँगे, आप बताइए क्या। तीसरी मंज़िल, लिफ़्ट है।',
                  'उदा. दोन बाथरूम. बेसिनचा पाईप गळतोय, शॉवर मिक्सरमध्ये नवीन कार्ट्रिज बसवायचे आहे. सामान आम्ही आणू, तुम्ही फक्त काय लागेल ते सांगा. तिसरा मजला, लिफ्ट आहे.',
                  'જેમ કે: બે બાથરૂમ. બેસિનની પાઇપ ટપકે છે, શાવર મિક્સરમાં નવું કાર્ટ્રિજ નાખવાનું છે. સામાન અમે લાવીશું, તમે ફક્ત શું જોઈએ એ કહો. ત્રીજો માળ, લિફ્ટ છે.',
                )}
                aria-describedby="pj-desc-hint"
              />
              <p id="pj-desc-hint" className={s.hint}>
                <span>
                  <T en="Say how big the work is, which floor, and what you will provide." hi="बताइए काम कितना बड़ा है, कौन सी मंज़िल, और आप क्या देंगे।" mr="काम किती मोठे आहे, कितवा मजला, आणि तुम्ही काय देणार ते सांगा." gu="કામ કેટલું મોટું છે, કયો માળ, અને તમે શું આપશો એ જણાવો." />
                </span>
                <span className={d.description.trim().length >= 40 ? s.countOk : s.count}>
                  {d.description.trim().length >= 40 && <Check aria-hidden="true" />}
                  {d.description.trim().length}/40+
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ───── Step 2 · Where & when */}
        {step === 1 && (
          <div className={s.body} key="s1">
            <div className={s.twoCol}>
              <div className="field">
                <label className="label" htmlFor="pj-area">
                  <MapPin aria-hidden="true" /> <T en="Area" hi="इलाका" mr="भाग" gu="વિસ્તાર" />
                </label>
                <select id="pj-area" className="select" value={d.area} onChange={(e) => patch({ area: e.target.value })} {...errProps('area')}>
                  <option value="">{t('Choose area…', 'इलाका चुनें…', 'भाग निवडा…', 'વિસ્તાર પસંદ કરો…')}</option>
                  {AREAS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {t(a.name.en, a.name.hi, a.name.mr, a.name.gu)} · {a.km} km
                    </option>
                  ))}
                </select>
                {errMsg('area')}
              </div>
              <div className="field">
                <label className="label" htmlFor="pj-landmark">
                  <T en="Building & landmark" hi="बिल्डिंग और निशानी" mr="बिल्डिंग आणि खूण" gu="બિલ્ડિંગ અને નિશાની" />
                </label>
                <input
                  id="pj-landmark"
                  className="input"
                  value={d.landmark}
                  maxLength={80}
                  onChange={(e) => patch({ landmark: e.target.value })}
                  placeholder={t('e.g. Tower B, near Galleria Mall', 'जैसे: टावर B, गैलेरिया मॉल के पास', 'उदा. टॉवर B, गॅलेरिया मॉलजवळ', 'જેમ કે: ટાવર B, ગેલેરિયા મૉલ પાસે')}
                />
              </div>
            </div>
            <p className={s.privacy}>
              <CircleCheck aria-hidden="true" />
              <T
                en="Workers see the area now. The flat number is shared only after you both agree."
                hi="कारीगर अभी सिर्फ़ इलाका देखेंगे। फ़्लैट नंबर दोनों की सहमति के बाद ही बताया जाएगा।"
                mr="कामगारांना आत्ता फक्त भाग दिसेल. फ्लॅट नंबर तुम्हा दोघांची संमती झाल्यावरच सांगितला जाईल."
                gu="કામદારોને હમણાં ફક્ત વિસ્તાર દેખાશે. ફ્લેટ નંબર તમારા બંનેની સંમતિ પછી જ જણાવાશે."
              />
            </p>

            <fieldset className={s.fs}>
              <legend className="label">
                <CalendarDays aria-hidden="true" /> <T en="Start" hi="कब से" mr="कधीपासून" gu="ક્યારથી" />
              </legend>
              <div className={`segmented ${s.seg}`}>
                {(
                  [
                    ['today', 'Today', 'आज', 'आज', 'આજે'],
                    ['tomorrow', 'Tomorrow', 'कल', 'उद्या', 'આવતીકાલે'],
                    ['date', 'Pick a date', 'तारीख़ चुनें', 'तारीख निवडा', 'તારીખ પસંદ કરો'],
                  ] as const
                ).map(([v, en, hi, mr, gu]) => (
                  <button key={v} type="button" aria-pressed={d.start === v} onClick={() => patch({ start: v })}>
                    <T en={en} hi={hi} mr={mr} gu={gu} />
                  </button>
                ))}
              </div>
              {d.start === 'date' && (
                <label className="field">
                  <span className="sr-only">
                    <T en="Start date" hi="शुरू की तारीख़" mr="सुरुवातीची तारीख" gu="શરૂઆતની તારીખ" />
                  </span>
                  <input id="pj-date" className="input" type="date" min={minDate} value={d.date} onChange={(e) => patch({ date: e.target.value })} {...errProps('date')} />
                </label>
              )}
              {errMsg('date')}
            </fieldset>

            <fieldset className={s.fs}>
              <legend className="label">
                <T en="How long is the work?" hi="काम कितने समय का है?" mr="काम किती दिवसांचे आहे?" gu="કામ કેટલા સમયનું છે?" />
              </legend>
              <div className={s.durGrid}>
                {DURATION_LIST.map((du) => (
                  <button
                    key={du}
                    type="button"
                    className={s.durTile}
                    aria-pressed={d.duration === du}
                    style={{ '--tile': `var(--color-${du})` } as React.CSSProperties}
                    onClick={() =>
                      patch({
                        duration: du,
                        length: du === 'daily' ? 1 : du === 'short' ? Math.min(14, Math.max(2, d.length)) : Math.min(12, Math.max(1, d.duration === 'long' ? d.length : 1)),
                        unit: du === 'long' ? 'month' : d.unit === 'month' ? 'day' : d.unit,
                        paidWhen: du === 'long' ? 'monthly' : du === 'short' && d.paidWhen === 'monthly' ? 'weekly' : du === 'daily' ? 'same-day' : d.paidWhen,
                      })
                    }
                  >
                    <b>
                      <Tx l={DURATIONS[du].name} />
                    </b>
                    <small>
                      <Tx l={DURATIONS[du].hint} />
                    </small>
                  </button>
                ))}
              </div>
              {d.duration !== 'daily' && (
                <div className={s.inline}>
                  <span className="label" id="pj-len">
                    {d.duration === 'short' ? <T en="Number of days" hi="कितने दिन" mr="किती दिवस" gu="કેટલા દિવસ" /> : <T en="Number of months" hi="कितने महीने" mr="किती महिने" gu="કેટલા મહિના" />}
                  </span>
                  <Stepper
                    labelledBy="pj-len"
                    value={d.length}
                    min={d.duration === 'short' ? 2 : 1}
                    max={d.duration === 'short' ? 14 : 12}
                    onChange={(v) => patch({ length: v })}
                    unit={
                      d.duration === 'short'
                        ? { en: 'days', hi: 'दिन', mr: 'दिवस', gu: 'દિવસ' }
                        : { en: d.length === 1 ? 'month' : 'months', hi: d.length === 1 ? 'महीना' : 'महीने', mr: d.length === 1 ? 'महिना' : 'महिने', gu: d.length === 1 ? 'મહિનો' : 'મહિના' }
                    }
                    less={t('One less', 'एक कम', 'एक कमी', 'એક ઓછું')}
                    more={t('One more', 'एक और', 'एक जास्त', 'એક વધારે')}
                  />
                </div>
              )}
            </fieldset>

            <fieldset className={s.fs}>
              <legend className="label">
                <Clock aria-hidden="true" /> <T en="Working hours" hi="काम का समय" mr="कामाची वेळ" gu="કામનો સમય" />
              </legend>
              <div className={s.timeRow}>
                <label className="field">
                  <span className="subtle">
                    <T en="From" hi="से" mr="पासून" gu="થી" />
                  </span>
                  <input id="pj-hours-start" className="input" type="time" value={d.hoursStart} onChange={(e) => patch({ hoursStart: e.target.value })} />
                </label>
                <label className="field">
                  <span className="subtle">
                    <T en="To" hi="तक" mr="पर्यंत" gu="સુધી" />
                  </span>
                  <input id="pj-hours-end" className="input" type="time" value={d.hoursEnd} onChange={(e) => patch({ hoursEnd: e.target.value })} {...errProps('hours')} />
                </label>
                <p className={s.hoursOut} aria-live="polite">
                  {hoursOk ? (
                    <>
                      <b>{Math.round(hoursPerDay * 10) / 10}</b> <T en="hours / day" hi="घंटे / दिन" mr="तास / दिवस" gu="કલાક / દિવસ" />
                    </>
                  ) : (
                    ', '
                  )}
                </p>
              </div>
              {errMsg('hours')}
              {hoursOk && hoursPerDay > 9 && (
                <p className="callout callout-warning">
                  <TriangleAlert aria-hidden="true" />
                  <T
                    en="More than 9 hours a day counts as overtime, usually paid at double the rate."
                    hi="दिन में 9 घंटे से ज़्यादा काम ओवरटाइम है, इसका आम तौर पर दोगुना रेट मिलता है।"
                    mr="दिवसाला 9 तासांपेक्षा जास्त काम म्हणजे ओव्हरटाइम, त्याचा साधारणपणे दुप्पट दर मिळतो."
                    gu="દિવસમાં 9 કલાકથી વધારે કામ એટલે ઓવરટાઇમ, એનો સામાન્ય રીતે બમણો દર મળે છે."
                  />
                </p>
              )}
            </fieldset>
          </div>
        )}

        {/* ───── Step 3 · Pay */}
        {step === 2 && (
          <div className={s.body} key="s2">
            <div className="field">
              <label className="label" htmlFor="pj-amount">
                <IndianRupee aria-hidden="true" /> <T en="Pay per worker" hi="हर कारीगर की मज़दूरी" mr="प्रत्येक कामगाराची मजुरी" gu="દરેક કામદારની મજૂરી" />
              </label>
              <div className={s.payRow}>
                <div className={s.moneyInput}>
                  <span aria-hidden="true">₹</span>
                  <input
                    id="pj-amount"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={d.unit === 'hour' ? 10 : 50}
                    value={d.amount || ''}
                    placeholder={trade ? String(trade.fair[0]) : '800'}
                    onChange={(e) => patch({ amount: Math.max(0, Number(e.target.value)) })}
                    {...errProps('amount')}
                  />
                </div>
                <div className={`segmented ${s.unitSeg}`} role="group" aria-label={t('Pay is counted per', 'मज़दूरी किस हिसाब से', 'मजुरी कशानुसार', 'મજૂરી કયા હિસાબે')}>
                  {UNITS.map((u) => (
                    <button key={u} type="button" aria-pressed={d.unit === u} onClick={() => patch({ unit: u })}>
                      <Tx l={PAY_UNIT[u]} />
                    </button>
                  ))}
                </div>
              </div>
              {errMsg('amount')}
            </div>

            {/* Live fair-pay meter */}
            <div className={s.fairBox} aria-live="polite">
              {d.trade && d.amount > 0 ? (
                <>
                  <FairBand trade={d.trade} perDay={perDay} approx={d.unit !== 'day'} />
                  {d.unit !== 'day' && (
                    <p className="subtle">
                      <T en="Worked out as a day-rate:" hi="एक दिन के हिसाब से:" mr="एका दिवसाच्या हिशोबाने:" gu="એક દિવસના હિસાબે:" /> <b className="money">≈ {rupee(Math.round(perDay))}</b> <T en="/ day" hi="/ दिन" mr="/ दिवस" gu="/ દિવસ" />
                    </p>
                  )}
                  {fair === 'below' && trade && (
                    <div className="callout callout-danger">
                      <TriangleAlert aria-hidden="true" />
                      <div className={s.calloutBody}>
                        <strong>
                          <T en="This is below fair pay." hi="यह सही मज़दूरी से कम है।" mr="ही योग्य मजुरीपेक्षा कमी आहे." gu="આ યોગ્ય મજૂરીથી ઓછું છે." />
                        </strong>
                        <span>
                          <T
                            en={`${trade.name.en} work near Kurla usually pays ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} a day. Skilled workers will pick other jobs, and very low pay can be below the legal minimum wage.`}
                            hi={`कुर्ला के पास ${trade.name.hi} को आम तौर पर ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} रोज़ मिलते हैं। हुनरमंद कारीगर दूसरे काम चुन लेंगे, और बहुत कम मज़दूरी क़ानूनी न्यूनतम वेतन से भी कम हो सकती है।`}
                            mr={`कुर्ल्याजवळ ${trade.name.mr} कामाला साधारणपणे रोज ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} मिळतात. कुशल कारागीर दुसरी कामे निवडतील, आणि खूप कमी मजुरी कायदेशीर किमान वेतनापेक्षाही कमी असू शकते.`}
                            gu={`કુર્લા પાસે ${trade.name.gu}ને સામાન્ય રીતે રોજના ${rupee(trade.fair[0])}, ${rupee(trade.fair[1])} મળે છે. કુશળ કારીગરો બીજાં કામ પસંદ કરી લેશે, અને બહુ ઓછી મજૂરી કાયદેસરના લઘુતમ વેતનથી પણ ઓછી હોઈ શકે.`}
                          />
                        </span>
                        <button type="button" className="btn btn-sm" onClick={() => patch({ amount: fairTarget() })}>
                          <T en={`Use a fair ${rupee(fairTarget())}`} hi={`सही रेट ${rupee(fairTarget())} लगाएँ`} mr={`योग्य दर ${rupee(fairTarget())} लावा`} gu={`યોગ્ય દર ${rupee(fairTarget())} રાખો`} />
                        </button>
                      </div>
                    </div>
                  )}
                  {fair === 'fair' && (
                    <p className="callout callout-trust">
                      <CircleCheck aria-hidden="true" />
                      <T en="Fair pay. Workers see a green “Fair pay” mark on your job." hi="सही मज़दूरी। कारीगरों को आपके काम पर हरा “सही मज़दूरी” निशान दिखेगा।" mr="योग्य मजुरी. कामगारांना तुमच्या कामावर हिरवी “योग्य मजुरी” खूण दिसेल." gu="યોગ્ય મજૂરી. કામદારોને તમારા કામ પર લીલું “યોગ્ય મજૂરી” નિશાન દેખાશે." />
                    </p>
                  )}
                  {fair === 'above' && (
                    <p className="callout callout-trust">
                      <Sparkles aria-hidden="true" />
                      <T en="Generous! Expect quick replies from experienced workers." hi="बढ़िया! अनुभवी कारीगर जल्दी जवाब देंगे।" mr="छान! अनुभवी कारागीर लवकर उत्तर देतील." gu="સરસ! અનુભવી કારીગરો જલદી જવાબ આપશે." />
                    </p>
                  )}
                  {fair === 'extreme' && (
                    <p className="callout callout-warning">
                      <CircleAlert aria-hidden="true" />
                      <T
                        en="Very high pay looks like a trick to workers, our safety check will warn them. If the work is heavy, risky or at night, say so in the description."
                        hi="बहुत ज़्यादा मज़दूरी कारीगरों को धोखा लगती है, हमारी सुरक्षा जाँच उन्हें सावधान करेगी। अगर काम भारी, जोखिम वाला या रात का है, तो विवरण में लिखें।"
                        mr="खूप जास्त मजुरी कामगारांना फसवणूक वाटते, आमची सुरक्षा तपासणी त्यांना सावध करेल. काम जड, धोक्याचे किंवा रात्रीचे असेल तर वर्णनात तसे लिहा."
                        gu="બહુ વધારે મજૂરી કામદારોને છેતરપિંડી જેવી લાગે છે, અમારી સલામતી તપાસ તેમને સાવધ કરશે. જો કામ ભારે, જોખમી કે રાતનું હોય, તો વિગતમાં લખો."
                      />
                    </p>
                  )}
                </>
              ) : (
                <p className={s.fairEmpty}>
                  <IndianRupee aria-hidden="true" />
                  <T en="Type an amount to see how fair it is." hi="रकम लिखें, हम बताएँगे कि यह कितनी सही है।" mr="रक्कम लिहा, ती किती योग्य आहे ते आम्ही सांगू." gu="રકમ લખો, એ કેટલી યોગ્ય છે તે અમે કહીશું." />
                </p>
              )}
            </div>

            <fieldset className={s.fs}>
              <legend className="label">
                <WalletCards aria-hidden="true" /> <T en="When will you pay?" hi="भुगतान कब करेंगे?" mr="पैसे कधी देणार?" gu="પૈસા ક્યારે આપશો?" />
              </legend>
              <div className={s.payGrid}>
                {PAYDAYS.map((p) => (
                  <button key={p} type="button" className={s.payTile} aria-pressed={d.paidWhen === p} onClick={() => patch({ paidWhen: p })}>
                    <span className={s.radio} aria-hidden="true" />
                    <Tx l={PAID_WHEN[p]} />
                    {p === 'same-day' && (
                      <span className={`chip chip-success ${s.best}`}>
                        <T en="Best for daily work" hi="दिहाड़ी के लिए सबसे अच्छा" mr="रोजंदारीसाठी सर्वात चांगले" gu="રોજમદારી માટે સૌથી સારું" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {d.duration === 'daily' && d.paidWhen !== 'same-day' && (
                <p className={s.nudge}>
                  <CircleAlert aria-hidden="true" />
                  <T
                    en="Daily-wage workers often need the money the same evening for food and rent."
                    hi="दिहाड़ी कारीगरों को अक्सर खाने और किराए के लिए उसी शाम पैसे चाहिए होते हैं।"
                    mr="रोजंदारीवरच्या कामगारांना जेवण आणि भाड्यासाठी अनेकदा त्याच संध्याकाळी पैसे लागतात."
                    gu="રોજમદારી કરતા કામદારોને ઘણી વાર જમવા અને ભાડા માટે એ જ સાંજે પૈસા જોઈએ છે."
                  />
                </p>
              )}
            </fieldset>

            <div className={s.twoCol}>
              <fieldset className={s.fs}>
                <legend className="label">
                  <T en="How will you pay?" hi="कैसे भुगतान करेंगे?" mr="पैसे कसे देणार?" gu="પૈસા કેવી રીતે આપશો?" />
                </legend>
                <div id="pj-paymode" tabIndex={-1} className={s.chips} {...errProps('payMode')}>
                  {MODES.map((m) => (
                    <button key={m} type="button" className="filter-chip" aria-pressed={d.payMode.includes(m)} onClick={() => patch({ payMode: toggle(d.payMode, m) })}>
                      <Tx l={PAY_MODE[m]} />
                    </button>
                  ))}
                </div>
                {errMsg('payMode')}
              </fieldset>
              <div className={s.fs}>
                <span className="label" id="pj-workers">
                  <UsersRound aria-hidden="true" /> <T en="Workers needed" hi="कितने कारीगर चाहिए" mr="किती कामगार हवेत" gu="કેટલા કામદારો જોઈએ" />
                </span>
                <Stepper
                  labelledBy="pj-workers"
                  value={d.workersNeeded}
                  min={1}
                  max={50}
                  onChange={(v) => patch({ workersNeeded: v })}
                  unit={{ en: d.workersNeeded === 1 ? 'person' : 'people', hi: 'लोग', mr: d.workersNeeded === 1 ? 'व्यक्ती' : 'लोक', gu: d.workersNeeded === 1 ? 'વ્યક્તિ' : 'લોકો' }}
                  less={t('One less', 'एक कम', 'एक कमी', 'એક ઓછું')}
                  more={t('One more', 'एक और', 'एक जास्त', 'એક વધારે')}
                />
              </div>
            </div>

            <fieldset className={s.fs}>
              <legend className="label">
                <T en="What will you provide?" hi="आप क्या देंगे?" mr="तुम्ही काय देणार?" gu="તમે શું આપશો?" />
              </legend>
              <div className={s.chips}>
                {PERK_LIST.map((p) => (
                  <button key={p} type="button" className="filter-chip" aria-pressed={d.perks.includes(p)} onClick={() => patch({ perks: toggle(d.perks, p) })}>
                    {d.perks.includes(p) ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                    <Tx l={PERKS[p]} />
                  </button>
                ))}
              </div>
            </fieldset>

            {d.amount > 0 && (
              <p className={s.totalBar}>
                <span>
                  <T en="Estimated total" hi="कुल अनुमान" mr="एकूण अंदाज" gu="કુલ અંદાજ" />
                  <small>
                    {d.workersNeeded} × <Tx l={lengthL} />
                  </small>
                </span>
                <b className="money">{rupee(totalCost)}</b>
              </p>
            )}
          </div>
        )}

        {/* ───── Step 4 · Review */}
        {step === 3 && (
          <div className={s.body} key="s3">
            <div className={s.reviewGrid}>
              <div className={s.previewCol}>
                <p className={s.previewLabel}>
                  <Eye aria-hidden="true" />
                  <T en="This is exactly what workers will see" hi="कारीगरों को बिल्कुल यही दिखेगा" mr="कामगारांना अगदी हेच दिसेल" gu="કામદારોને બરાબર આ જ દેખાશે" />
                </p>
                <div
                  className={s.preview}
                  onClickCapture={(e) => {
                    if ((e.target as HTMLElement).closest('a')) e.preventDefault();
                  }}
                >
                  <JobCard job={job} href={null} />
                </div>
                {job.description.en && (
                  <p className={s.previewDesc}>
                    <Tx l={job.description} />
                  </p>
                )}
              </div>

              <div className={s.clarity} data-tone={scoreTone}>
                <div className={s.clarityHead}>
                  <div>
                    <span className="eyebrow">
                      <T en="Clarity score" hi="साफ़-साफ़ स्कोर" mr="स्पष्टता स्कोअर" gu="સ્પષ્ટતા સ્કોર" />
                    </span>
                    <p className={s.score}>
                      <b className="money">{score}</b>
                      <span>/100</span>
                    </p>
                  </div>
                  <span className={`chip ${scoreTone === 'good' ? 'chip-success' : scoreTone === 'ok' ? 'chip-warning' : 'chip-danger'}`}>
                    {scoreTone === 'good' ? <CircleCheck aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
                    {scoreTone === 'good' ? (
                      <T en="Clear & fair" hi="साफ़ और सही" mr="स्पष्ट आणि योग्य" gu="સાફ અને યોગ્ય" />
                    ) : scoreTone === 'ok' ? (
                      <T en="Almost there" hi="बस थोड़ा और" mr="थोडेच बाकी" gu="બસ થોડું બાકી" />
                    ) : (
                      <T en="Needs more detail" hi="और जानकारी चाहिए" mr="अजून माहिती हवी" gu="વધુ માહિતી જોઈએ" />
                    )}
                  </span>
                </div>
                <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={t('Clarity score', 'साफ़-साफ़ स्कोर', 'स्पष्टता स्कोअर', 'સ્પષ્ટતા સ્કોર')}>
                  <span style={{ transform: `scaleX(${score / 100})` }} />
                </div>
                <ul className={s.checklist}>
                  {checks.map((c) => (
                    <li key={c.id} data-ok={c.ok}>
                      {c.ok ? <CircleCheck aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
                      <span>
                        <Tx l={c.label} />
                        <span className="sr-only">{c.ok ? t(', done', ', हो गया', ', झाले', ', થઈ ગયું') : t(', missing', ', बाकी', ', बाकी', ', બાકી')}</span>
                      </span>
                      {!c.ok && (
                        <button type="button" className={s.fix} onClick={() => goTo(c.step)}>
                          <T en="Fix" hi="ठीक करें" mr="दुरुस्त करा" gu="સુધારો" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="subtle">
                  <T en="Clear jobs get more replies, and fewer arguments on payday." hi="साफ़ लिखे काम पर ज़्यादा जवाब आते हैं, और भुगतान के दिन कम झगड़े।" mr="स्पष्ट लिहिलेल्या कामाला जास्त उत्तरे येतात, आणि पगाराच्या दिवशी कमी वाद." gu="સાફ લખેલા કામ પર વધુ જવાબ આવે છે, અને પગારના દિવસે ઓછા ઝઘડા." />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer nav */}
        <footer className={s.foot}>
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft aria-hidden="true" />
              <T en="Back" hi="पीछे" mr="मागे" gu="પાછળ" />
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="submit" className="btn btn-primary btn-lg">
              <T en="Next" hi="आगे" mr="पुढे" gu="આગળ" />
              <span className={s.nextHint}>
                · <Tx l={STEPS[step + 1].short} />
              </span>
              <ArrowRight aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary btn-lg">
              <Briefcase aria-hidden="true" />
              <T en="Publish job" hi="काम डालें" mr="काम प्रकाशित करा" gu="કામ પ્રકાશિત કરો" />
            </button>
          )}
        </footer>
      </form>
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  unit,
  labelledBy,
  less,
  more,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit: L;
  labelledBy: string;
  less: string;
  more: string;
}) {
  return (
    <div className={s.stepper} role="group" aria-labelledby={labelledBy}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={less}>
        <Minus aria-hidden="true" />
      </button>
      <output aria-live="polite">
        <b>{value}</b> <Tx l={unit} />
      </output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={more}>
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
}
