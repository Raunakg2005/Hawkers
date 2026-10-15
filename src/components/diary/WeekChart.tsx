'use client';

import { useState } from 'react';
import { BadgeCheck, CalendarX2 } from 'lucide-react';
import { T, Tx } from '@/components/T';
import { TradeTile } from '@/components/TradeIcon';
import { rupee } from '@/data/trades';
import { useLang } from '@/lib/prefs';
import { WEEKDAY_SHORT, addDays, dateKey, fmtDate, parseKey, shortRupee, type DiaryEntry } from './diary-data';
import s from './diary.module.css';

/**
 * Last 7 days as tappable bars. Each bar stacks money received (solid) and
 * money still owed (striped). Tap a bar to see that day's work below.
 */
export default function WeekChart({ entries, today }: { entries: DiaryEntry[]; today: string }) {
  const { t, lang } = useLang();
  const [sel, setSel] = useState(today);

  const days = Array.from({ length: 7 }, (_, i) => {
    const key = dateKey(addDays(parseKey(today), i - 6));
    const list = entries.filter((e) => e.date === key);
    const paid = list.filter((e) => e.paid).reduce((a, e) => a + e.amount, 0);
    const owed = list.filter((e) => !e.paid).reduce((a, e) => a + e.amount, 0);
    return { key, list, paid, owed, total: paid + owed, dow: parseKey(key).getDay() };
  });

  const worked = days.filter((d) => d.total > 0);
  const total = days.reduce((a, d) => a + d.total, 0);
  const max = Math.max(1000, ...days.map((d) => d.total));
  const avg = worked.length ? Math.round(total / worked.length) : 0;
  const best = worked.reduce<(typeof days)[number] | null>((b, d) => (!b || d.total > b.total ? d : b), null);
  const selected = days.find((d) => d.key === sel) ?? days[6];

  const summary = t(
    `Last 7 days: ${rupee(total)} earned over ${worked.length} days.${best ? ` Best day ${fmtDate(best.key, 'en')} with ${rupee(best.total)}.` : ''}`,
    `पिछले 7 दिन: ${worked.length} दिन में ${rupee(total)} कमाए।${best ? ` सबसे अच्छा दिन ${fmtDate(best.key, 'hi')}, ${rupee(best.total)}।` : ''}`,
    `मागील 7 दिवस: ${worked.length} दिवसांत ${rupee(total)} कमावले.${best ? ` सर्वात चांगला दिवस ${fmtDate(best.key, 'mr')}, ${rupee(best.total)}.` : ''}`,
    `છેલ્લા 7 દિવસ: ${worked.length} દિવસમાં ${rupee(total)} કમાયા.${best ? ` સૌથી સારો દિવસ ${fmtDate(best.key, 'gu')}, ${rupee(best.total)}.` : ''}`,
  );

  return (
    <div className={s.chartWrap}>
      <p id="chart-summary" className="sr-only">
        {summary}
      </p>

      <div className={s.chart} role="group" aria-label={t('Earnings, last 7 days', 'पिछले 7 दिन की कमाई', 'मागील 7 दिवसांची कमाई', 'છેલ્લા 7 દિવસની કમાણી')} aria-describedby="chart-summary">
        {avg > 0 && (
          <div className={s.avgLine} style={{ '--y': (avg / max).toFixed(3) } as React.CSSProperties} aria-hidden="true">
            <span>
              <T en={`avg ${shortRupee(avg)}`} hi={`औसत ${shortRupee(avg)}`} mr={`सरासरी ${shortRupee(avg)}`} gu={`સરેરાશ ${shortRupee(avg)}`} />
            </span>
          </div>
        )}
        {days.map((d, i) => {
          const isToday = d.key === today;
          const on = d.key === selected.key;
          const label = `${fmtDate(d.key, lang)}${isToday ? ` (${t('today', 'आज', 'आज', 'આજે')})` : ''}: ${
            d.total ? `${rupee(d.total)}${d.owed ? `, ${rupee(d.owed)} ${t('not paid yet', 'अभी बाक़ी', 'अजून बाकी', 'હજી બાકી')}` : ''}` : t('no work', 'कोई काम नहीं', 'काम नाही', 'કોઈ કામ નહીં')
          }`;
          return (
            <button
              key={d.key}
              type="button"
              className={`${s.barCol} ${isToday ? s.barToday : ''} ${on ? s.barSel : ''}`}
              aria-pressed={on}
              aria-label={label}
              title={label}
              onClick={() => setSel(d.key)}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className={s.barValue} aria-hidden="true">
                {d.total ? shortRupee(d.total) : '—'}
              </span>
              <span className={s.barTrack} aria-hidden="true">
                <span className={s.bar} style={{ '--h': `${(d.total / max) * 100}%` } as React.CSSProperties}>
                  {d.owed > 0 && <span className={s.barOwed} style={{ flexGrow: d.owed }} />}
                  {d.paid > 0 && <span className={s.barPaid} style={{ flexGrow: d.paid }} />}
                </span>
              </span>
              <span className={s.barDay} aria-hidden="true">
                <span>{isToday ? <T en="Today" hi="आज" mr="आज" gu="આજે" /> : <Tx l={WEEKDAY_SHORT[d.dow]} />}</span>
                <small>{parseKey(d.key).getDate()}</small>
              </span>
            </button>
          );
        })}
      </div>

      <ul className={s.legend} aria-hidden="true">
        <li>
          <i className={s.lgPaid} />
          <T en="Paid" hi="मिल गया" mr="मिळाले" gu="મળી ગયા" />
        </li>
        <li>
          <i className={s.lgOwed} />
          <T en="Not paid yet" hi="अभी बाक़ी" mr="अजून बाकी" gu="હજી બાકી" />
        </li>
        <li>
          <i className={s.lgToday} />
          <T en="Today" hi="आज" mr="आज" gu="આજે" />
        </li>
      </ul>

      <div className={s.dayDetail} aria-live="polite">
        <p className={s.dayDetailHead}>
          <strong>{fmtDate(selected.key, lang, { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          {selected.total > 0 && <span className="money">{rupee(selected.total)}</span>}
        </p>
        {selected.list.length ? (
          <ul className={s.dayList}>
            {selected.list.map((e) => (
              <li key={e.id}>
                <TradeTile trade={e.trade} size="sm" />
                <span className={s.dayEmployer}>
                  {e.employer}
                  {e.verified && <BadgeCheck aria-label={t('Confirmed by employer', 'मालिक ने पक्का किया', 'मालकाने पक्के केले', 'માલિકે પાકું કર્યું')} className={s.okIcon} />}
                </span>
                <span className={`chip ${e.paid ? 'chip-success' : 'chip-warning'}`}>{e.paid ? <T en="Paid" hi="मिल गया" mr="मिळाले" gu="મળી ગયા" /> : <T en="Not yet" hi="बाक़ी" mr="बाकी" gu="બાકી" />}</span>
                <span className="money">{rupee(e.amount)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`subtle ${s.noWork}`}>
            <CalendarX2 aria-hidden="true" />
            {selected.key === today ? (
              <T
                en="Nothing written for today yet. Add it below when you finish work."
                hi="आज का कुछ नहीं लिखा। काम ख़त्म होने पर नीचे जोड़ें।"
                mr="आजचे अजून काही लिहिलेले नाही. काम संपल्यावर खाली जोडा."
                gu="આજનું હજી કંઈ લખ્યું નથી. કામ પૂરું થાય ત્યારે નીચે ઉમેરો."
              />
            ) : (
              <T en="No work written for this day." hi="इस दिन का कोई काम नहीं लिखा।" mr="या दिवसाचे कोणतेही काम लिहिलेले नाही." gu="આ દિવસનું કોઈ કામ લખ્યું નથી." />
            )}
          </p>
        )}
      </div>

      <table className="sr-only">
        <caption>
          <T en="Earnings by day, last 7 days" hi="पिछले 7 दिन, दिन के हिसाब से कमाई" mr="मागील 7 दिवस, दिवसानुसार कमाई" gu="છેલ્લા 7 દિવસ, દિવસ પ્રમાણે કમાણી" />
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <T en="Day" hi="दिन" mr="दिवस" gu="દિવસ" />
            </th>
            <th scope="col">
              <T en="Paid" hi="मिल गया" mr="मिळाले" gu="મળી ગયા" />
            </th>
            <th scope="col">
              <T en="Not paid yet" hi="अभी बाक़ी" mr="अजून बाकी" gu="હજી બાકી" />
            </th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.key}>
              <th scope="row">{fmtDate(d.key, lang)}</th>
              <td>{rupee(d.paid)}</td>
              <td>{rupee(d.owed)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
