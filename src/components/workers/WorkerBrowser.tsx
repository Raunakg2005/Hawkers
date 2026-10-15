'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Briefcase, RotateCcw, Search, SearchX, X } from 'lucide-react';
import type { TradeId, Worker } from '@/data/types';
import { TRADE, TRADES } from '@/data/trades';
import { WORKERS } from '@/data/workers';
import { T, Tx } from '@/components/T';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import WorkerCard from '@/components/WorkerCard';
import { useLang } from '@/lib/prefs';
import s from './workers.module.css';

type Sort = 'near' | 'rating' | 'exp';
type Km = 2 | 5 | 10 | null;

const DISTANCES: { v: Km; en: string; hi: string }[] = [
  { v: 2, en: '2 km', hi: '2 km' },
  { v: 5, en: '5 km', hi: '5 km' },
  { v: 10, en: '10 km', hi: '10 km' },
  { v: null, en: 'Any', hi: 'कोई भी' },
];

const SORTS: { v: Sort; en: string; hi: string }[] = [
  { v: 'near', en: 'Nearest first', hi: 'सबसे पास वाले' },
  { v: 'rating', en: 'Top rated', hi: 'सबसे अच्छी रेटिंग' },
  { v: 'exp', en: 'Most experienced', hi: 'सबसे ज़्यादा अनुभव' },
];

const isTrade = (v: string | null): v is TradeId => !!v && v in TRADE;

const haystack = (w: Worker) =>
  [w.name, TRADE[w.trade].name.en, TRADE[w.trade].name.hi, w.area.en, w.area.hi, ...w.otherTrades.flatMap((t) => [TRADE[t].name.en, TRADE[t].name.hi]), ...w.skills.flatMap((k) => [k.en, k.hi])]
    .join(' ')
    .toLowerCase();

/** Reads ?trade= from the URL. Must be rendered inside <Suspense>. */
export function WorkerBrowserFromUrl() {
  const params = useSearchParams();
  const trade = params.get('trade');
  return <WorkerBrowser initialTrade={isTrade(trade) ? trade : null} />;
}

export default function WorkerBrowser({ initialTrade }: { initialTrade: TradeId | null }) {
  const { t } = useLang();
  const [trade, setTrade] = useState<TradeId | null>(initialTrade);
  const [today, setToday] = useState(false);
  const [km, setKm] = useState<Km>(null);
  const [sort, setSort] = useState<Sort>('near');
  const [q, setQ] = useState('');

  const pickTrade = (next: TradeId | null) => {
    setTrade(next);
    // keep the URL shareable without a navigation
    try {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set('trade', next);
      else url.searchParams.delete('trade');
      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
  };

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = WORKERS.filter(
      (w) =>
        (!trade || w.trade === trade || w.otherTrades.includes(trade)) &&
        (!today || w.availableToday) &&
        (km === null || w.distanceKm <= km) &&
        (!needle || haystack(w).includes(needle)),
    );
    return list.sort((a, b) => {
      // a worker whose MAIN trade matches always comes before a side-trade match
      if (trade && (a.trade === trade) !== (b.trade === trade)) return a.trade === trade ? -1 : 1;
      if (sort === 'rating') return b.rating - a.rating || b.jobsDone - a.jobsDone;
      if (sort === 'exp') return b.years - a.years;
      return a.distanceKm - b.distanceKm;
    });
  }, [trade, today, km, sort, q]);

  const active = !!trade || today || km !== null || !!q;
  const reset = () => {
    pickTrade(null);
    setToday(false);
    setKm(null);
    setQ('');
  };

  const countFor = (id: TradeId) => WORKERS.filter((w) => w.trade === id || w.otherTrades.includes(id)).length;

  return (
    <div className={s.browser}>
      <div className={`card ${s.filters}`} role="search">
        <div className={s.filterTop}>
          <label className={s.searchBox}>
            <span className="sr-only">
              <T en="Search by name or skill" hi="नाम या हुनर से खोजें" />
            </span>
            <Search aria-hidden="true" />
            <input
              className="input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Search name or skill — e.g. “tiles”, “inverter”', 'नाम या हुनर खोजें — जैसे “टाइल”, “इन्वर्टर”')}
              enterKeyHint="search"
            />
            {q && (
              <button type="button" className={s.clearQ} onClick={() => setQ('')} aria-label={t('Clear search', 'खोज मिटाएँ')}>
                <X aria-hidden="true" />
              </button>
            )}
          </label>
          <label className={s.sortField}>
            <span className="label">
              <T en="Sort" hi="क्रम" />
            </span>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.map((o) => (
                <option key={o.v} value={o.v}>
                  {t(o.en, o.hi)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div role="group" aria-label={t('Trade', 'काम का प्रकार')}>
          <div className={`scroller ${s.tradeRow}`}>
            <button type="button" className="filter-chip" aria-pressed={trade === null} onClick={() => pickTrade(null)}>
              <T en="All trades" hi="सभी काम" />
            </button>
            {TRADES.map((tr) => (
              <button
                key={tr.id}
                type="button"
                className={`filter-chip ${s.tradeChip}`}
                aria-pressed={trade === tr.id}
                onClick={() => pickTrade(trade === tr.id ? null : tr.id)}
                style={{ '--tile': tradeColor(tr.id) } as React.CSSProperties}
              >
                <TradeIcon trade={tr.id} />
                <Tx l={tr.name} />
                <span className={s.count}>{countFor(tr.id)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.filterBottom}>
          <div className={s.toggle}>
            <button type="button" role="switch" className="switch" aria-checked={today} aria-labelledby="f-today" onClick={() => setToday((v) => !v)} />
            <span id="f-today" className={s.toggleLabel} onClick={() => setToday((v) => !v)}>
              <span className="dot dot-live" aria-hidden="true" />
              <T en="Available today" hi="आज खाली" />
            </span>
          </div>

          <div className={s.distance} role="group" aria-labelledby="f-km">
            <span id="f-km" className="label">
              <T en="Within" hi="कितनी दूरी तक" />
            </span>
            <div className="segmented">
              {DISTANCES.map((d) => (
                <button key={String(d.v)} type="button" aria-pressed={km === d.v} onClick={() => setKm(d.v)}>
                  <T en={d.en} hi={d.hi} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={s.resultsBar}>
        <p aria-live="polite" className={s.resultsCount}>
          <b className="money">{results.length}</b>{' '}
          <T en={results.length === 1 ? 'worker found' : 'workers found'} hi="कारीगर मिले" />
          {trade && (
            <span className="muted">
              {' · '}
              <Tx l={TRADE[trade].name} />
            </span>
          )}
        </p>
        {active && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            <T en="Clear filters" hi="फ़िल्टर हटाएँ" />
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="cards-grid">
          {results.map((w, i) => (
            <WorkerCard key={w.id} worker={w} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <SearchX aria-hidden="true" />
          <p className="h3">
            <T en="No one matches all of that — yet." hi="इन सब शर्तों पर अभी कोई नहीं मिला।" />
          </p>
          <p>
            <T
              en="Try a wider distance or turn off “Available today”. Or post the job — workers nearby get a voice alert and come to you."
              hi="दूरी बढ़ाकर देखें या “आज खाली” बंद करें। या काम डाल दें — पास के कारीगरों को आवाज़ में सूचना जाएगी और वे आप तक आएँगे।"
            />
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              <T en="Clear filters" hi="फ़िल्टर हटाएँ" />
            </button>
            <Link href={trade ? `/post-job?trade=${trade}` : '/post-job'} className="btn btn-accent">
              <Briefcase aria-hidden="true" />
              <T en="Post a job instead" hi="इसके बजाय काम डालें" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
