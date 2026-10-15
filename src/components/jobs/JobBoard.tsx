'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowDownWideNarrow, BadgeCheck, CalendarClock, ChevronDown, LayoutList, Map as MapIcon, Mic, MicOff, Search, ShieldAlert, SlidersHorizontal, Utensils, X } from 'lucide-react';
import type { Duration, Job, TradeId } from '@/data/types';
import { JOBS } from '@/data/jobs';
import { DURATIONS, TRADES, trustScore } from '@/data/trades';
import { useLang } from '@/lib/prefs';
import JobCard from '../JobCard';
import { TradeIcon } from '../TradeIcon';
import { T, Tx } from '../T';
import JobsMap from './JobsMap';
import { getRecognition, parseSpeech } from './voice';

type Sort = 'near' | 'pay' | 'new';

const dayValue = (j: Job) => (j.pay.unit === 'day' ? j.pay.amount : j.pay.unit === 'month' ? j.pay.amount / 26 : j.pay.unit === 'hour' ? j.pay.amount * 8 : j.pay.amount / 3);

export default function JobBoard() {
  const params = useSearchParams();
  const { t, lang } = useLang();

  const [q, setQ] = useState('');
  const [trade, setTrade] = useState<TradeId | 'all'>(() => {
    const p = params.get('trade');
    return p && TRADES.some((x) => x.id === p) ? (p as TradeId) : 'all';
  });
  const [duration, setDuration] = useState<Duration | 'all'>('all');
  const [sort, setSort] = useState<Sort>('near');
  const [sameDay, setSameDay] = useState(false);
  const [food, setFood] = useState(false);
  const [verified, setVerified] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [showRisky, setShowRisky] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const recRef = useRef<ReturnType<typeof getRecognition>>(null);

  useEffect(() => () => recRef.current?.stop(), []);

  const applySpeech = (text: string) => {
    setHeard(text);
    const parsed = parseSpeech(text);
    if (parsed.trade) setTrade(parsed.trade);
    if (parsed.duration) setDuration(parsed.duration);
    if (!parsed.trade && !parsed.duration) setQ(text);
  };

  const listen = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = getRecognition(lang);
    if (!rec) {
      // No speech engine (e.g. desktop Firefox): demo the flow with a sample phrase.
      setListening(true);
      window.setTimeout(() => {
        setListening(false);
        applySpeech({ en: 'plumber work today', hi: 'आज प्लंबर का काम', mr: 'आज प्लंबरचे काम', gu: 'આજે પ્લમ્બરનું કામ' }[lang]);
      }, 1400);
      return;
    }
    recRef.current = rec;
    rec.onresult = (e) => applySpeech(e.results[0][0].transcript);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return JOBS.filter((j) => {
      if (trade !== 'all' && j.trade !== trade) return false;
      if (sameDay && j.paidWhen !== 'same-day') return false;
      if (food && !j.perks.includes('food')) return false;
      if (verified && !j.employer.verified) return false;
      if (needle) {
        const hay = `${j.title.en} ${j.title.hi} ${j.title.mr} ${j.title.gu} ${j.area.en} ${j.area.hi} ${j.area.mr} ${j.area.gu} ${j.employer.name} ${j.trade}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, trade, sameDay, food, verified]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length, daily: 0, short: 0, long: 0 };
    base.forEach((j) => c[j.duration]++);
    return c;
  }, [base]);

  const results = useMemo(() => {
    const list = base.filter((j) => duration === 'all' || j.duration === duration);
    const sorted = [...list].sort((a, b) =>
      sort === 'near' ? a.distanceKm - b.distanceKm : sort === 'pay' ? dayValue(b) - dayValue(a) : a.postedHoursAgo - b.postedHoursAgo,
    );
    const safe = sorted.filter((j) => trustScore(j.flags, j.employer.verified) >= 50);
    const risky = sorted.filter((j) => trustScore(j.flags, j.employer.verified) < 50);
    return { safe, risky };
  }, [base, duration, sort]);

  const activeExtras = [sameDay, food, verified].filter(Boolean).length;
  const reset = () => {
    setQ('');
    setTrade('all');
    setDuration('all');
    setSameDay(false);
    setFood(false);
    setVerified(false);
    setHeard('');
  };

  return (
    <div className="job-board">
      {/* search + voice */}
      <div className="board-search">
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">{t('Search jobs', 'काम खोजें', 'काम शोधा', 'કામ શોધો')}</span>
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('Search: area, work, employer…', 'खोजें: इलाक़ा, काम, मालिक…', 'शोधा: भाग, काम, मालक…', 'શોધો: વિસ્તાર, કામ, માલિક…')}
            enterKeyHint="search"
          />
          {q && (
            <button type="button" className="clear" onClick={() => setQ('')} aria-label={t('Clear search', 'खोज साफ़ करें', 'शोध पुसा', 'શોધ સાફ કરો')}>
              <X aria-hidden="true" />
            </button>
          )}
        </label>
        <button type="button" className={`mic-btn${listening ? ' is-listening' : ''}`} onClick={listen} aria-pressed={listening}>
          {listening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
          <span>{listening ? t('Listening…', 'सुन रहे हैं…', 'ऐकत आहोत…', 'સાંભળીએ છીએ…') : t('Speak', 'बोलें', 'बोला', 'બોલો')}</span>
        </button>
      </div>
      {heard && (
        <p className="heard" aria-live="polite">
          <T en="You said" hi="आपने कहा" mr="तुम्ही म्हणालात" gu="તમે કહ્યું" />: <q>{heard}</q>
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            <X aria-hidden="true" /> <T en="Clear" hi="हटाएँ" mr="काढा" gu="હટાવો" />
          </button>
        </p>
      )}

      {/* duration — the first question for irregular work */}
      <div className="duration-tabs" role="group" aria-label={t('How long?', 'कितने समय का?', 'किती दिवसांचे?', 'કેટલા સમયનું?')}>
        {(['all', 'daily', 'short', 'long'] as const).map((d) => (
          <button key={d} type="button" aria-pressed={duration === d} onClick={() => setDuration(d)} className={`dur-tab dur-${d}`}>
            <span className="dur-label">{d === 'all' ? <T en="All work" hi="सारे काम" mr="सगळी कामे" gu="બધાં કામ" /> : <Tx l={DURATIONS[d].name} />}</span>
            <span className="dur-count">{counts[d]}</span>
          </button>
        ))}
      </div>

      {/* trades */}
      <div className="scroller trade-row" role="group" aria-label={t('Type of work', 'काम का प्रकार', 'कामाचा प्रकार', 'કામનો પ્રકાર')}>
        <button type="button" className="filter-chip" aria-pressed={trade === 'all'} onClick={() => setTrade('all')}>
          <T en="All trades" hi="सभी काम" mr="सर्व कामे" gu="બધાં કામ" />
        </button>
        {TRADES.map((tr) => (
          <button
            key={tr.id}
            type="button"
            className="filter-chip trade-chip"
            aria-pressed={trade === tr.id}
            onClick={() => setTrade(trade === tr.id ? 'all' : tr.id)}
            style={{ '--tile': `var(--trade-${tr.id})` } as React.CSSProperties}
          >
            <TradeIcon trade={tr.id} />
            <Tx l={tr.name} />
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="board-toolbar">
        <p className="result-count" aria-live="polite">
          <strong>{results.safe.length}</strong> <T en="jobs near Kurla West naka" hi="काम कुर्ला पश्चिम नाके के पास" mr="कामे कुर्ला पश्चिम नाक्याजवळ" gu="કામ કુર્લા પશ્ચિમ નાકા પાસે" />
        </p>
        <div className="row">
          <button type="button" className="btn btn-sm" aria-expanded={moreOpen} aria-controls="more-filters" onClick={() => setMoreOpen((o) => !o)}>
            <SlidersHorizontal aria-hidden="true" />
            <T en="Filters" hi="फ़िल्टर" mr="फिल्टर" gu="ફિલ્ટર" />
            {activeExtras > 0 && <span className="badge-count">{activeExtras}</span>}
            <ChevronDown aria-hidden="true" className={moreOpen ? 'rot' : ''} />
          </button>
          <label className="sort-select">
            <ArrowDownWideNarrow aria-hidden="true" />
            <span className="sr-only">{t('Sort by', 'क्रम', 'क्रम', 'ક્રમ')}</span>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="near">{t('Nearest first', 'सबसे पास', 'सर्वात जवळ', 'સૌથી નજીક')}</option>
              <option value="pay">{t('Highest pay', 'सबसे ज़्यादा मज़दूरी', 'सर्वात जास्त मजुरी', 'સૌથી વધુ મજૂરી')}</option>
              <option value="new">{t('Newest', 'सबसे नए', 'सर्वात नवीन', 'સૌથી નવાં')}</option>
            </select>
          </label>
          <div className="segmented" role="group" aria-label={t('View', 'देखें', 'पाहा', 'જુઓ')}>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <LayoutList aria-hidden="true" /> <T en="List" hi="सूची" mr="यादी" gu="યાદી" />
            </button>
            <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
              <MapIcon aria-hidden="true" /> <T en="Map" hi="नक़्शा" mr="नकाशा" gu="નકશો" />
            </button>
          </div>
        </div>
      </div>

      {moreOpen && (
        <div className="more-filters" id="more-filters">
          <button type="button" className="filter-chip" aria-pressed={sameDay} onClick={() => setSameDay((v) => !v)}>
            <CalendarClock aria-hidden="true" /> <T en="Paid same day" hi="उसी दिन भुगतान" mr="त्याच दिवशी पैसे" gu="એ જ દિવસે ચુકવણી" />
          </button>
          <button type="button" className="filter-chip" aria-pressed={food} onClick={() => setFood((v) => !v)}>
            <Utensils aria-hidden="true" /> <T en="Lunch given" hi="खाना मिलेगा" mr="जेवण मिळेल" gu="જમવાનું મળશે" />
          </button>
          <button type="button" className="filter-chip" aria-pressed={verified} onClick={() => setVerified((v) => !v)}>
            <BadgeCheck aria-hidden="true" /> <T en="Verified employers only" hi="सिर्फ़ जाँचे हुए मालिक" mr="फक्त पडताळलेले मालक" gu="ફક્ત ચકાસાયેલ માલિક" />
          </button>
        </div>
      )}

      {results.safe.length === 0 && !(view === 'map' && showRisky && results.risky.length) ? (
        <div className="empty">
          <Search aria-hidden="true" />
          <p>
            <T en="No jobs match right now. Try fewer filters." hi="अभी कोई काम नहीं मिला। कम फ़िल्टर लगाकर देखें।" mr="आत्ता कोणतेही काम सापडले नाही. कमी फिल्टर लावून पाहा." gu="હમણાં કોઈ કામ મળ્યું નથી. ઓછાં ફિલ્ટર લગાવીને જુઓ." />
          </p>
          <button type="button" className="btn btn-primary" onClick={reset}>
            <T en="Show all jobs" hi="सारे काम दिखाएँ" mr="सगळी कामे दाखवा" gu="બધાં કામ બતાવો" />
          </button>
        </div>
      ) : view === 'map' ? (
        <JobsMap jobs={[...results.safe, ...(showRisky ? results.risky : [])]} />
      ) : (
        <div className="cards-grid">
          {results.safe.map((j, i) => (
            <JobCard key={j.id} job={j} index={i} />
          ))}
        </div>
      )}

      {results.risky.length > 0 && (
        <section className="risky-fold" aria-labelledby="risky-h">
          <div className="callout callout-danger">
            <ShieldAlert aria-hidden="true" />
            <div className="stack" style={{ flex: 1 }}>
              <h2 id="risky-h" className="h3">
                <T en={`${results.risky.length} listings hidden — they look risky`} hi={`${results.risky.length} काम छिपाए गए — ये ख़तरनाक लगते हैं`} mr={`${results.risky.length} कामे लपवली — ती धोकादायक वाटतात`} gu={`${results.risky.length} કામ છુપાવ્યાં — એ જોખમી લાગે છે`} />
              </h2>
              <p className="muted">
                <T
                  en="They ask for fees, hide the address or promise unreal pay. Our Trust Shield keeps them out of your way."
                  hi="ये फ़ीस माँगते हैं, पता छिपाते हैं या झूठी मज़दूरी का वादा करते हैं। ट्रस्ट शील्ड इन्हें आपसे दूर रखती है।"
                  mr="हे फी मागतात, पत्ता लपवतात किंवा खोट्या मजुरीचे वचन देतात. ट्रस्ट शील्ड यांना तुमच्यापासून दूर ठेवते."
                  gu="આ લોકો ફી માંગે છે, સરનામું છુપાવે છે અથવા ખોટી મજૂરીનું વચન આપે છે. ટ્રસ્ટ શીલ્ડ એમને તમારાથી દૂર રાખે છે."
                />
              </p>
              <button type="button" className="btn btn-sm btn-danger" aria-expanded={showRisky} onClick={() => setShowRisky((v) => !v)}>
                {showRisky ? <T en="Hide them" hi="छिपाएँ" mr="लपवा" gu="છુપાવો" /> : <T en="Show them anyway" hi="फिर भी दिखाएँ" mr="तरीही दाखवा" gu="તો પણ બતાવો" />}
              </button>
            </div>
          </div>
          {showRisky && view === 'list' && (
            <div className="cards-grid" style={{ marginTop: 'var(--space-5)' }}>
              {results.risky.map((j, i) => (
                <JobCard key={j.id} job={j} index={i} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
