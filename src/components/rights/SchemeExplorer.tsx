'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  ExternalLink,
  IndianRupee,
  LayoutGrid,
  MapPin,
  PhoneCall,
  RotateCcw,
  SearchX,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { Scheme, SchemeNeed } from '@/data/types';
import { DOCS, NEEDS, SCHEMES } from '@/data/schemes';
import { T, Tx } from '@/components/T';
import ReadAloud from '@/components/ReadAloud';
import { useLang } from '@/lib/prefs';
import { DOC_ICON, NEED_META, schemeSpeech, telHref } from './meta';
import s from './rights-ui.module.css';

/* ── Quick eligibility helper ───────────────────────────────────────────────
   Deliberately rough: three questions, simple rules taken from each scheme's
   published age / income / occupation limits. The UI always says "likely"
   and asks the worker to confirm at a CSC or on the official site. */

type Age = 'a18' | 'a41' | 'a51' | 'a60';
type Income = 'low' | 'mid' | 'high';
type Work = 'construction' | 'vendor' | 'other';
type Answers = { age?: Age; income?: Income; work?: Work };
type Complete = Required<Answers>;

const AGE: { id: Age; l: { en: string; hi: string } }[] = [
  { id: 'a18', l: { en: '18 – 40', hi: '18 – 40' } },
  { id: 'a41', l: { en: '41 – 50', hi: '41 – 50' } },
  { id: 'a51', l: { en: '51 – 60', hi: '51 – 60' } },
  { id: 'a60', l: { en: 'Above 60', hi: '60 से ज़्यादा' } },
];
const INCOME: { id: Income; l: { en: string; hi: string } }[] = [
  { id: 'low', l: { en: 'Up to ₹10,000', hi: '₹10,000 तक' } },
  { id: 'mid', l: { en: '₹10,000 – 15,000', hi: '₹10,000 – 15,000' } },
  { id: 'high', l: { en: 'More than ₹15,000', hi: '₹15,000 से ज़्यादा' } },
];
const WORK: { id: Work; l: { en: string; hi: string } }[] = [
  { id: 'construction', l: { en: 'Building / construction', hi: 'बिल्डिंग / निर्माण' } },
  { id: 'vendor', l: { en: 'Street vendor', hi: 'रेहड़ी-पटरी' } },
  { id: 'other', l: { en: 'Other daily work', hi: 'दूसरा दिहाड़ी काम' } },
];

const RULES: Record<string, (a: Complete) => boolean> = {
  'e-shram': (a) => a.age !== 'a60',
  'pm-sym': (a) => a.age === 'a18' && a.income !== 'high',
  pmsby: () => true,
  pmjjby: (a) => a.age === 'a18' || a.age === 'a41',
  'pm-jay': (a) => a.income !== 'high',
  'pm-svanidhi': (a) => a.work === 'vendor',
  bocw: (a) => a.work === 'construction' && a.age !== 'a60',
  onorc: (a) => a.income !== 'high',
  'pmay-u': (a) => a.income !== 'high',
};

const isComplete = (a: Answers): a is Complete => !!(a.age && a.income && a.work);

type Filter = 'all' | SchemeNeed;
const NEED_IDS = Object.keys(NEEDS) as SchemeNeed[];

export default function SchemeExplorer() {
  const { t } = useLang();
  const [need, setNeed] = useState<Filter>('all');
  const [answers, setAnswers] = useState<Answers>({});
  const [onlyLikely, setOnlyLikely] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const likely = useMemo(() => {
    if (!isComplete(answers)) return null;
    return new Set(SCHEMES.filter((sc) => RULES[sc.id]?.(answers)).map((sc) => sc.id));
  }, [answers]);

  const visible = (sc: Scheme) => (need === 'all' || sc.needs.includes(need)) && (!onlyLikely || !likely || likely.has(sc.id));
  const shown = SCHEMES.filter(visible).length;

  // Links like /rights#pm-jay must always land on a visible card.
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (SCHEMES.some((sc) => sc.id === id)) {
        setNeed('all');
        setOnlyLikely(false);
      }
    };
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);

  const answer = <K extends keyof Answers>(k: K, v: Answers[K]) => setAnswers((a) => ({ ...a, [k]: v }));
  const clearAnswers = () => {
    setAnswers({});
    setOnlyLikely(false);
  };
  const showLikely = () => {
    setNeed('all');
    setOnlyLikely(true);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const answered = [answers.age, answers.income, answers.work].filter(Boolean).length;

  return (
    <div className={s.explorer}>
      {/* ── 1 · What do you need? */}
      <div className="section-head" data-reveal="">
        <span className="eyebrow">
          <T en="Step 1 · Tap what you need" hi="कदम 1 · जो चाहिए उस पर टैप करें" />
        </span>
        <h2 className="h2">
          <T en="What do you need help with?" hi="आपको किस चीज़ में मदद चाहिए?" />
        </h2>
      </div>

      <div className={s.needGrid} role="group" aria-label={t('Filter schemes by need', 'ज़रूरत के हिसाब से योजनाएँ छाँटें')} data-reveal="">
        <button type="button" className={s.needBtn} aria-pressed={need === 'all'} onClick={() => setNeed('all')} style={{ '--tile': 'var(--color-heading)' } as React.CSSProperties}>
          <span className={s.needIcon}>
            <LayoutGrid aria-hidden="true" />
          </span>
          <span className={s.needLabel}>
            <T en="Show all" hi="सब दिखाएँ" />
          </span>
          <span className={s.needCount}>{SCHEMES.length}</span>
        </button>
        {NEED_IDS.map((id) => {
          const meta = NEED_META[id];
          const Icon = meta.icon;
          const count = SCHEMES.filter((sc) => sc.needs.includes(id)).length;
          return (
            <button
              key={id}
              type="button"
              className={s.needBtn}
              aria-pressed={need === id}
              onClick={() => setNeed(need === id ? 'all' : id)}
              style={{ '--tile': meta.color } as React.CSSProperties}
            >
              <span className={s.needIcon}>
                <Icon aria-hidden="true" />
              </span>
              <span className={s.needLabel}>
                <Tx l={NEEDS[id].label} />
              </span>
              <span className={s.needCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2 · Quick eligibility helper */}
      <div className={s.elig} data-reveal="">
        <div className={s.eligHead}>
          <span className="icon-tile" style={{ '--tile': 'var(--color-accent)' } as React.CSSProperties}>
            <Sparkles aria-hidden="true" />
          </span>
          <div>
            <h3 className="h3">
              <T en="Not sure? Answer 3 quick questions" hi="पक्का नहीं पता? 3 छोटे सवालों के जवाब दें" />
            </h3>
            <p className="muted">
              <T en="We will mark the schemes that are likely for you. Nothing is saved or sent." hi="हम उन योजनाओं पर निशान लगाएँगे जो शायद आपके लिए हैं। कुछ भी सेव या भेजा नहीं जाता।" />
            </p>
          </div>
          <span className={`chip ${s.eligProgress}`} aria-live="polite">
            {answered}/3
          </span>
        </div>

        <div className={s.questions}>
          <Question n={1} q={{ en: 'Your age', hi: 'आपकी उम्र' }} options={AGE} value={answers.age} onPick={(v) => answer('age', v)} />
          <Question n={2} q={{ en: 'Money you earn in a month', hi: 'महीने की कमाई' }} options={INCOME} value={answers.income} onPick={(v) => answer('income', v)} />
          <Question n={3} q={{ en: 'Your main work', hi: 'आपका मुख्य काम' }} options={WORK} value={answers.work} onPick={(v) => answer('work', v)} />
        </div>

        <div className={s.eligResult} aria-live="polite">
          {likely ? (
            <div className={s.eligDone}>
              <p className={s.eligCount}>
                <BadgeCheck aria-hidden="true" />
                <T
                  en={
                    <>
                      <b>{likely.size}</b> schemes are <b>likely</b> for you
                    </>
                  }
                  hi={
                    <>
                      <b>{likely.size}</b> योजनाएँ <b>शायद</b> आपके लिए हैं
                    </>
                  }
                />
              </p>
              <ul className={s.likelyChips}>
                {SCHEMES.filter((sc) => likely.has(sc.id)).map((sc) => (
                  <li key={sc.id}>
                    <a href={`#${sc.id}`} className="chip chip-success">
                      {sc.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="row">
                <button type="button" className="btn btn-accent" aria-pressed={onlyLikely} onClick={() => (onlyLikely ? setOnlyLikely(false) : showLikely())}>
                  <BadgeCheck aria-hidden="true" />
                  {onlyLikely ? <T en="Show all schemes again" hi="फिर से सब योजनाएँ दिखाएँ" /> : <T en="Show only these" hi="सिर्फ़ ये दिखाएँ" />}
                </button>
                <button type="button" className="btn btn-ghost" onClick={clearAnswers}>
                  <RotateCcw aria-hidden="true" />
                  <T en="Start again" hi="फिर से शुरू करें" />
                </button>
              </div>
              <p className="subtle">
                <T
                  en="This is a rough guide, not a promise. Rules change — confirm at a CSC centre or the official website."
                  hi="यह सिर्फ़ अंदाज़ा है, वादा नहीं। नियम बदलते रहते हैं — CSC सेंटर या सरकारी वेबसाइट पर पक्का करें।"
                />
              </p>
            </div>
          ) : (
            <p className="subtle">
              <T en="Pick one answer in each row." hi="हर लाइन में एक जवाब चुनें।" />
            </p>
          )}
        </div>
      </div>

      {/* ── 3 · Scheme cards */}
      <div ref={listRef} className={s.listHead}>
        <p className={s.showing} aria-live="polite">
          <T
            en={
              <>
                Showing <b>{shown}</b> of {SCHEMES.length} schemes
              </>
            }
            hi={
              <>
                {SCHEMES.length} में से <b>{shown}</b> योजनाएँ
              </>
            }
          />
          {need !== 'all' && (
            <span className="chip chip-trust">
              <Tx l={NEEDS[need].label} />
            </span>
          )}
          {onlyLikely && likely && (
            <span className="chip chip-success">
              <T en="Likely for you" hi="शायद आपके लिए" />
            </span>
          )}
        </p>
        {(need !== 'all' || onlyLikely) && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setNeed('all');
              setOnlyLikely(false);
            }}
          >
            <RotateCcw aria-hidden="true" />
            <T en="Clear filter" hi="फ़िल्टर हटाएँ" />
          </button>
        )}
      </div>

      {shown === 0 && (
        <div className="empty">
          <SearchX aria-hidden="true" />
          <p>
            <T en="No scheme matches both choices." hi="दोनों चुनावों से मिलती कोई योजना नहीं।" />
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setNeed('all');
              setOnlyLikely(false);
            }}
          >
            <T en="Show all schemes" hi="सब योजनाएँ दिखाएँ" />
          </button>
        </div>
      )}

      <div className={s.schemeGrid}>
        {SCHEMES.map((sc, i) => (
          <SchemeCard key={sc.id} scheme={sc} index={i} hidden={!visible(sc)} likely={likely?.has(sc.id) ?? false} />
        ))}
      </div>
    </div>
  );
}

function Question<V extends string>({
  n,
  q,
  options,
  value,
  onPick,
}: {
  n: number;
  q: { en: string; hi: string };
  options: { id: V; l: { en: string; hi: string } }[];
  value?: V;
  onPick: (v: V) => void;
}) {
  return (
    <div className={s.question}>
      <p className={s.qLabel} id={`elig-q${n}`}>
        <span className={s.qNum} aria-hidden="true">
          {n}
        </span>
        <Tx l={q} />
      </p>
      <div className={s.qOptions} role="radiogroup" aria-labelledby={`elig-q${n}`}>
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className="filter-chip" onClick={() => onPick(o.id)}>
            <Tx l={o.l} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SchemeCard({ scheme: sc, index, hidden, likely }: { scheme: Scheme; index: number; hidden: boolean; likely: boolean }) {
  const { t } = useLang();
  const main = NEED_META[sc.needs[0]];
  const MainIcon = main.icon;
  const speech = schemeSpeech(sc);
  return (
    <article
      id={sc.id}
      className={`${s.scheme}${likely ? ` ${s.isLikely}` : ''}`}
      hidden={hidden}
      data-reveal=""
      style={{ '--d': index % 2, '--tile': main.color } as React.CSSProperties}
      aria-labelledby={`${sc.id}-name`}
    >
      <header className={s.schemeTop}>
        <span className="icon-tile lg" style={{ '--tile': main.color } as React.CSSProperties}>
          <MainIcon aria-hidden="true" />
        </span>
        <div className={s.schemeTitle}>
          <h3 id={`${sc.id}-name`}>{sc.name}</h3>
          <p className={s.schemeShort}>
            <Tx l={sc.short} />
          </p>
        </div>
        <ReadAloud en={speech.en} hi={speech.hi} label={t(`Listen: ${sc.name}`, `सुनें: ${sc.name}`)} />
      </header>

      <ul className={s.schemeNeeds} aria-label={t('Helps with', 'इसमें मदद')}>
        {likely && (
          <li>
            <span className="chip chip-success">
              <BadgeCheck aria-hidden="true" />
              <T en="Likely for you" hi="शायद आपके लिए" />
            </span>
          </li>
        )}
        {sc.needs.map((nd) => {
          const Icon = NEED_META[nd].icon;
          return (
            <li key={nd}>
              <span className="chip" style={{ '--tile': NEED_META[nd].color } as React.CSSProperties}>
                <Icon aria-hidden="true" className={s.chipIcon} />
                <Tx l={NEEDS[nd].label} />
              </span>
            </li>
          );
        })}
      </ul>

      <p className={s.benefit}>
        <Tx l={sc.benefit} />
      </p>

      <ul className={s.facts}>
        <li>
          <UsersRound aria-hidden="true" />
          <div>
            <span className={s.factLabel}>
              <T en="Who can apply" hi="कौन ले सकता है" />
            </span>
            <span className={s.factValue}>
              <Tx l={sc.who} />
            </span>
          </div>
        </li>
        <li>
          <IndianRupee aria-hidden="true" />
          <div>
            <span className={s.factLabel}>
              <T en="Cost to you" hi="आपका ख़र्च" />
            </span>
            <span className={s.factValue}>
              <Tx l={sc.cost} />
            </span>
          </div>
        </li>
        <li>
          <MapPin aria-hidden="true" />
          <div>
            <span className={s.factLabel}>
              <T en="Where to go" hi="कहाँ जाएँ" />
            </span>
            <span className={s.factValue}>
              <Tx l={sc.where} />
            </span>
          </div>
        </li>
      </ul>

      <div className={s.block}>
        <h4 className={s.blockTitle}>
          <T en="Papers to carry" hi="साथ ले जाने वाले कागज़" />
        </h4>
        <ul className={s.docChips}>
          {sc.docs.map((d) => {
            const Icon = DOC_ICON[d];
            const doc = DOCS[d];
            if (!doc) return null;
            return (
              <li key={d}>
                <a href="#documents" className={s.docChip}>
                  {Icon && <Icon aria-hidden="true" />}
                  <Tx l={doc.name} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={s.block}>
        <h4 className={s.blockTitle}>
          <T en="How to apply" hi="आवेदन कैसे करें" />
        </h4>
        <ol className={s.steps}>
          {sc.how.map((step, i) => (
            <li key={i}>
              <span className={s.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <Tx l={step} />
              </span>
            </li>
          ))}
        </ol>
      </div>

      <footer className={s.schemeFoot}>
        {sc.helpline && (
          <a href={telHref(sc.helpline)} className="btn btn-primary">
            <PhoneCall aria-hidden="true" />
            <T en={`Call ${sc.helpline}`} hi={`कॉल करें ${sc.helpline}`} />
          </a>
        )}
        <a href={sc.site} target="_blank" rel="noopener noreferrer" className="btn">
          <ExternalLink aria-hidden="true" />
          <T en="Official website" hi="सरकारी वेबसाइट" />
          <span className="sr-only">
            <T en="(opens in a new tab)" hi="(नए टैब में खुलेगा)" />
          </span>
        </a>
      </footer>
    </article>
  );
}
