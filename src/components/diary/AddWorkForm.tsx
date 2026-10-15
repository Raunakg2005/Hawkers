'use client';

import { useState } from 'react';
import { CircleAlert, Clock, HandCoins, Plus } from 'lucide-react';
import { T, Tx } from '@/components/T';
import { TradeIcon, tradeColor } from '@/components/TradeIcon';
import { TRADE, TRADES, rupee } from '@/data/trades';
import type { TradeId } from '@/data/types';
import { useLang } from '@/lib/prefs';
import { KNOWN_EMPLOYERS, type DiaryEntry } from './diary-data';
import s from './diary.module.css';

/** "Add today's work" — 5 quick inputs, big targets, sensible defaults. */
export default function AddWorkForm({
  today,
  defaultTrade,
  pastEmployers,
  onAdd,
}: {
  today: string;
  defaultTrade: TradeId;
  pastEmployers: string[];
  onAdd: (e: Omit<DiaryEntry, 'id'>) => void;
}) {
  const { t } = useLang();
  const [employer, setEmployer] = useState('');
  const [trade, setTrade] = useState<TradeId>(defaultTrade);
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(true);
  const [date, setDate] = useState(today);
  const [errors, setErrors] = useState<{ employer?: boolean; amount?: boolean }>({});

  const fair = TRADE[trade].fair;
  const quick = Array.from(new Set([fair[0], Math.round((fair[0] + fair[1]) / 2 / 50) * 50, fair[1]]));
  const suggestions = Array.from(new Set([...pastEmployers, ...KNOWN_EMPLOYERS]));
  const amt = Number(amount);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = { employer: employer.trim().length < 2, amount: !(amt > 0 && amt < 100000) };
    setErrors(errs);
    if (errs.employer || errs.amount) {
      const el = document.getElementById(errs.employer ? 'work-employer' : 'work-amount');
      el?.focus();
      return;
    }
    onAdd({
      date: date || today,
      employer: employer.trim(),
      trade,
      amount: Math.round(amt),
      paid,
      paidOn: paid ? date || today : undefined,
      verified: false,
    });
    setEmployer('');
    setAmount('');
    setPaid(true);
    setDate(today);
    setErrors({});
  };

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className="field">
        <label className="label" htmlFor="work-employer">
          <T en="Who did you work for?" hi="किसके यहाँ काम किया?" mr="कोणाकडे काम केले?" gu="કોને ત્યાં કામ કર્યું?" />
        </label>
        <input
          id="work-employer"
          className="input"
          list="employer-list"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
          placeholder={t('Name of employer or contractor', 'मालिक या ठेकेदार का नाम', 'मालकाचे किंवा ठेकेदाराचे नाव', 'માલિક કે કૉન્ટ્રાક્ટરનું નામ')}
          aria-invalid={errors.employer || undefined}
          aria-describedby={errors.employer ? 'err-employer' : undefined}
          autoComplete="off"
          maxLength={50}
        />
        <datalist id="employer-list">
          {suggestions.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        {errors.employer && (
          <p id="err-employer" className={s.fieldErr}>
            <CircleAlert aria-hidden="true" />
            <T en="Please write the employer's name." hi="कृपया मालिक का नाम लिखें।" mr="कृपया मालकाचे नाव लिहा." gu="મહેરબાની કરીને માલિકનું નામ લખો." />
          </p>
        )}
      </div>

      <fieldset className={s.fs}>
        <legend className="label">
          <T en="What work?" hi="कौन सा काम?" mr="कोणते काम?" gu="કયું કામ?" />
          <span className={s.legendValue}>
            · <Tx l={TRADE[trade].name} />
          </span>
        </legend>
        <div className={`scroller ${s.tradePick}`} role="radiogroup" aria-label={t('Type of work', 'काम का प्रकार', 'कामाचा प्रकार', 'કામનો પ્રકાર')}>
          {TRADES.map((tr) => (
            <button
              key={tr.id}
              type="button"
              role="radio"
              aria-checked={trade === tr.id}
              className={s.tradeOpt}
              style={{ '--tile': tradeColor(tr.id) } as React.CSSProperties}
              onClick={() => setTrade(tr.id)}
              title={t(tr.name.en, tr.name.hi, tr.name.mr, tr.name.gu)}
            >
              <span className={s.tradeOptIcon}>
                <TradeIcon trade={tr.id} />
              </span>
              <span className={s.tradeOptName}>
                <Tx l={tr.name} />
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="label" htmlFor="work-amount">
          <T en="How much? (₹)" hi="कितने पैसे? (₹)" mr="किती पैसे? (₹)" gu="કેટલા પૈસા? (₹)" />
        </label>
        <div className={s.amountRow}>
          <span className={s.rupeePrefix} aria-hidden="true">
            ₹
          </span>
          <input
            id="work-amount"
            className={`input ${s.amountInput}`}
            inputMode="numeric"
            pattern="[0-9]*"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
            placeholder={String(quick[1])}
            aria-invalid={errors.amount || undefined}
            aria-describedby={errors.amount ? 'err-amount' : 'amount-hint'}
          />
        </div>
        <div className={s.quickRow}>
          {quick.map((q) => (
            <button key={q} type="button" className="filter-chip" aria-pressed={amt === q} onClick={() => setAmount(String(q))}>
              {rupee(q)}
            </button>
          ))}
        </div>
        {errors.amount ? (
          <p id="err-amount" className={s.fieldErr}>
            <CircleAlert aria-hidden="true" />
            <T en="Please write the amount in rupees." hi="कृपया रुपये लिखें।" mr="कृपया रुपये लिहा." gu="મહેરબાની કરીને રૂપિયા લખો." />
          </p>
        ) : (
          <p id="amount-hint" className="subtle">
            <T
              en={`Fair for ${TRADE[trade].name.en}: ${rupee(fair[0])}, ${rupee(fair[1])} a day`}
              hi={`${TRADE[trade].name.hi} के लिए सही: ${rupee(fair[0])}, ${rupee(fair[1])} रोज़`}
              mr={`${TRADE[trade].name.mr} साठी योग्य: रोज ${rupee(fair[0])}, ${rupee(fair[1])}`}
              gu={`${TRADE[trade].name.gu} માટે યોગ્ય: રોજના ${rupee(fair[0])}, ${rupee(fair[1])}`}
            />
          </p>
        )}
      </div>

      <div className={s.formRow}>
        <fieldset className={s.fs}>
          <legend className="label">
            <T en="Got the money?" hi="पैसे मिल गए?" mr="पैसे मिळाले का?" gu="પૈસા મળી ગયા?" />
          </legend>
          <div className={`segmented ${s.paidSeg}`}>
            <button type="button" aria-pressed={paid} onClick={() => setPaid(true)}>
              <HandCoins aria-hidden="true" />
              <T en="Paid" hi="मिल गए" mr="मिळाले" gu="મળી ગયા" />
            </button>
            <button type="button" aria-pressed={!paid} onClick={() => setPaid(false)}>
              <Clock aria-hidden="true" />
              <T en="Not yet" hi="अभी नहीं" mr="अजून नाही" gu="હજી નહીં" />
            </button>
          </div>
        </fieldset>
        <div className="field">
          <label className="label" htmlFor="work-date">
            <T en="Date" hi="तारीख़" mr="तारीख" gu="તારીખ" />
          </label>
          <input id="work-date" type="date" className="input" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-block">
        <Plus aria-hidden="true" />
        <T en="Save this work" hi="यह काम सेव करें" mr="हे काम सेव्ह करा" gu="આ કામ સેવ કરો" />
      </button>
    </form>
  );
}
