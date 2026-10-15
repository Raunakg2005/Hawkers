'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Bus, CalendarDays, CircleCheck, Clock, Coffee, Handshake, HardHat, Hourglass, IndianRupee, Info, MapPin, Minus, Pencil, Plus, Send, TriangleAlert, Utensils, WalletCards, Wrench } from 'lucide-react';
import type { L, Lang, PaidWhen, Perk, Worker } from '@/data/types';
import { PAID_WHEN, PAY_UNIT, PERKS, TRADE, rupee } from '@/data/trades';
import { T, Tx } from '@/components/T';
import ReadAloud from '@/components/ReadAloud';
import WorkerAvatar from '@/components/WorkerAvatar';
import { useLang } from '@/lib/prefs';
import { localeOf } from '@/lib/i18n';
import FairBand, { fairStatus } from './FairBand';
import s from './workers.module.css';

type When = 'today' | 'tomorrow' | 'pick';

const PERK_OPTIONS: { id: Perk; Icon: typeof Utensils }[] = [
  { id: 'food', Icon: Utensils },
  { id: 'tea', Icon: Coffee },
  { id: 'tools', Icon: Wrench },
  { id: 'travel', Icon: Bus },
  { id: 'safety', Icon: HardHat },
];

const PAYDAYS: PaidWhen[] = ['same-day', 'weekly', 'on-completion', 'monthly'];

interface Offer {
  ref: string;
  tasks: L;
  place: string;
  date: L;
  span: number;
  hours: { start: string; end: string };
  rate: number;
  total: number;
  paidWhen: PaidWhen;
  perks: Perk[];
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function dateLabel(when: When, picked: string): L {
  if (when === 'today') return { en: 'Today', hi: 'आज', mr: 'आज', gu: 'આજે' };
  if (when === 'tomorrow') return { en: 'Tomorrow', hi: 'कल', mr: 'उद्या', gu: 'આવતીકાલે' };
  const d = new Date(picked + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return { en: 'Date to be fixed', hi: 'तारीख़ तय होनी है', mr: 'तारीख ठरायची आहे', gu: 'તારીખ નક્કી કરવાની છે' };
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const fmt = (lang: Lang) => d.toLocaleDateString(localeOf(lang), opts);
  return { en: fmt('en'), hi: fmt('hi'), mr: fmt('mr'), gu: fmt('gu') };
}

export default function HirePanel({ worker: w }: { worker: Worker }) {
  const { t } = useLang();
  const uid = useId();
  const first = w.name.split(' ')[0];
  const monthly = w.rateUnit === 'month';
  const trade = TRADE[w.trade];

  const [when, setWhen] = useState<When>(w.availableToday ? 'today' : 'tomorrow');
  const [picked, setPicked] = useState('');
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [span, setSpan] = useState(1);
  const [rate, setRate] = useState<number>(w.rate);
  const [perks, setPerks] = useState<Perk[]>(['tea']);
  const [tasks, setTasks] = useState('');
  const [place, setPlace] = useState('');
  const [hours, setHours] = useState({ start: '09:00', end: '18:00' });
  const [paidWhen, setPaidWhen] = useState<PaidWhen>(monthly ? 'monthly' : 'same-day');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<Offer | null>(null);
  const [toast, setToast] = useState(false);
  const placeRef = useRef<HTMLInputElement>(null);
  const promiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinDate(isoDay(new Date()));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(false), 4500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const perDay = monthly ? rate / 26 : w.rateUnit === 'hour' ? rate * 8 : rate;
  const status = fairStatus(w.trade, perDay);
  const belowFair = !monthly && status === 'below';
  const belowAsk = rate > 0 && rate < w.rate;
  const total = rate * span;
  const unitL = PAY_UNIT[w.rateUnit];

  const togglePerk = (p: Perk) => setPerks((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (place.trim().length < 3) {
      setError(t('Add the work address or a landmark so the worker knows where to come.', 'काम का पता या कोई निशानी लिखें ताकि कारीगर को पता हो कहाँ आना है।', 'कामाचा पत्ता किंवा एखादी खूण लिहा, म्हणजे कारागिराला कुठे यायचे ते कळेल.', 'કામનું સરનામું કે કોઈ નિશાની લખો, જેથી કારીગરને ખબર પડે કે ક્યાં આવવાનું છે.'));
      placeRef.current?.focus();
      return;
    }
    if (!rate || rate <= 0) {
      setError(t('Enter the pay you are offering.', 'आप कितनी मज़दूरी देंगे, यह लिखें।', 'तुम्ही किती मजुरी देणार ते लिहा.', 'તમે કેટલી મજૂરી આપશો તે લખો.'));
      return;
    }
    setError(null);
    const typed = tasks.trim();
    const fallback: L = { en: `${trade.verb.en} work`, hi: `${trade.verb.hi} का काम`, mr: `${trade.verb.mr} संबंधी काम`, gu: `${trade.verb.gu}નું કામ` };
    setSent({
      ref: 'NK-' + String(Date.now()).slice(-5),
      tasks: typed ? { en: typed, hi: typed, mr: typed, gu: typed } : fallback,
      place: place.trim(),
      date: dateLabel(when, picked),
      span,
      hours,
      rate,
      total,
      paidWhen,
      perks,
    });
    setToast(true);
    requestAnimationFrame(() => {
      promiseRef.current?.focus();
      promiseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const spanUnit: L = monthly
    ? { en: span === 1 ? 'month' : 'months', hi: span === 1 ? 'महीना' : 'महीने', mr: span === 1 ? 'महिना' : 'महिने', gu: span === 1 ? 'મહિનો' : 'મહિના' }
    : { en: span === 1 ? 'day' : 'days', hi: 'दिन', mr: 'दिवस', gu: 'દિવસ' };

  return (
    <div className={s.hireWrap}>
      {sent ? (
        <WorkPromise p={sent} worker={w} refEl={promiseRef} onEdit={() => setSent(null)} />
      ) : (
        <form className={s.hireForm} onSubmit={send} noValidate aria-labelledby={`${uid}-h`}>
          <div className={s.hireHead}>
            <span className="icon-tile sm" style={{ '--tile': 'var(--color-brand)' } as React.CSSProperties}>
              <Handshake aria-hidden="true" />
            </span>
            <div>
              <h2 id={`${uid}-h`} className={s.hireTitle}>
                <T en={`Hire ${first}, make a fair offer`} hi={`${first} को बुलाएँ, सही ऑफ़र दें`} mr={`${first} यांना बोलवा, योग्य ऑफर द्या`} gu={`${first}ને બોલાવો, યોગ્ય ઑફર આપો`} />
              </h2>
              <p className="subtle">
                <T en="Both of you will see the same written terms." hi="आप दोनों को एक जैसी लिखी शर्तें दिखेंगी।" mr="तुम्हा दोघांना सारख्याच लिहिलेल्या अटी दिसतील." gu="તમને બંનેને એકસરખી લખેલી શરતો દેખાશે." />
              </p>
            </div>
          </div>

          {/* When */}
          <fieldset className={s.fs}>
            <legend className="label">
              <CalendarDays aria-hidden="true" /> <T en="When do you need them?" hi="कब चाहिए?" mr="कधी हवे आहेत?" gu="ક્યારે જોઈએ છે?" />
            </legend>
            <div className={`segmented ${s.segFull}`}>
              <button type="button" aria-pressed={when === 'today'} onClick={() => setWhen('today')} disabled={!w.availableToday}>
                <T en="Today" hi="आज" mr="आज" gu="આજે" />
              </button>
              <button type="button" aria-pressed={when === 'tomorrow'} onClick={() => setWhen('tomorrow')}>
                <T en="Tomorrow" hi="कल" mr="उद्या" gu="આવતીકાલે" />
              </button>
              <button type="button" aria-pressed={when === 'pick'} onClick={() => setWhen('pick')}>
                <T en="Pick date" hi="तारीख़ चुनें" mr="तारीख निवडा" gu="તારીખ પસંદ કરો" />
              </button>
            </div>
            {!w.availableToday && (
              <p className={s.note}>
                <Info aria-hidden="true" />
                <span>
                  {first}: <Tx l={w.nextFree} />
                </span>
              </p>
            )}
            {when === 'pick' && (
              <label className="field">
                <span className="sr-only">
                  <T en="Start date" hi="शुरू होने की तारीख़" mr="सुरुवातीची तारीख" gu="શરૂ થવાની તારીખ" />
                </span>
                <input className="input" type="date" min={minDate} value={picked} onChange={(e) => setPicked(e.target.value)} />
              </label>
            )}
          </fieldset>

          {/* How long */}
          <div className={s.twoCol}>
            <div className="field">
              <span className="label" id={`${uid}-span`}>
                <T en={monthly ? 'For how many months?' : 'For how many days?'} hi={monthly ? 'कितने महीने?' : 'कितने दिन?'} mr={monthly ? 'किती महिने?' : 'किती दिवस?'} gu={monthly ? 'કેટલા મહિના?' : 'કેટલા દિવસ?'} />
              </span>
              <div className={s.stepper} role="group" aria-labelledby={`${uid}-span`}>
                <button type="button" onClick={() => setSpan((n) => Math.max(1, n - 1))} aria-label={t('One less', 'एक कम', 'एक कमी', 'એક ઓછું')} disabled={span <= 1}>
                  <Minus aria-hidden="true" />
                </button>
                <output aria-live="polite">
                  <b>{span}</b> <Tx l={spanUnit} />
                </output>
                <button type="button" onClick={() => setSpan((n) => Math.min(30, n + 1))} aria-label={t('One more', 'एक और', 'एक जास्त', 'એક વધારે')}>
                  <Plus aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="field">
              <span className="label">
                <Clock aria-hidden="true" /> <T en="Hours" hi="समय" mr="वेळ" gu="સમય" />
              </span>
              <div className={s.timeRow}>
                <input className="input" type="time" aria-label={t('Start time', 'शुरू का समय', 'सुरू होण्याची वेळ', 'શરૂ થવાનો સમય')} value={hours.start} onChange={(e) => setHours((h) => ({ ...h, start: e.target.value }))} />
                <span aria-hidden="true">, </span>
                <input className="input" type="time" aria-label={t('End time', 'ख़त्म होने का समय', 'संपण्याची वेळ', 'પૂરું થવાનો સમય')} value={hours.end} onChange={(e) => setHours((h) => ({ ...h, end: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Rate */}
          <div className="field">
            <label className="label" htmlFor={`${uid}-rate`}>
              <IndianRupee aria-hidden="true" /> <T en="Your offer" hi="आपका ऑफ़र" mr="तुमची ऑफर" gu="તમારી ઑફર" />{' '}
              <span className="subtle">
                (<Tx l={unitL} />)
              </span>
            </label>
            <div className={s.moneyInput}>
              <span aria-hidden="true">₹</span>
              <input
                id={`${uid}-rate`}
                className="input"
                type="number"
                inputMode="numeric"
                min={0}
                step={50}
                value={rate || ''}
                onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                aria-describedby={`${uid}-rate-hint`}
              />
            </div>
            <div id={`${uid}-rate-hint`} aria-live="polite" className={s.rateHints}>
              {!monthly && rate > 0 && <FairBand trade={w.trade} perDay={perDay} compact />}
              {belowFair ? (
                <div className="callout callout-danger">
                  <TriangleAlert aria-hidden="true" />
                  <div>
                    <strong>
                      <T en="This is below fair pay." hi="यह सही मज़दूरी से कम है।" mr="ही योग्य मजुरीपेक्षा कमी आहे." gu="આ યોગ્ય મજૂરીથી ઓછું છે." />
                    </strong>{' '}
                    <T
                      en={`${trade.name.en} work here usually pays at least ${rupee(trade.fair[0])} a day. Low offers are often declined.`}
                      hi={`यहाँ ${trade.name.hi} को आम तौर पर कम से कम ${rupee(trade.fair[0])} रोज़ मिलते हैं। कम ऑफ़र अक्सर मना हो जाते हैं।`}
                      mr={`इथे ${trade.name.mr} कामाला साधारणपणे रोज किमान ${rupee(trade.fair[0])} मिळतात. कमी ऑफर अनेकदा नाकारल्या जातात.`}
                      gu={`અહીં ${trade.name.gu}ને સામાન્ય રીતે રોજના ઓછામાં ઓછા ${rupee(trade.fair[0])} મળે છે. ઓછી ઑફર ઘણી વાર ના પાડી દેવાય છે.`}
                    />
                    <button type="button" className={`btn btn-sm ${s.inlineFix}`} onClick={() => setRate(Math.max(w.rate, trade.fair[0]))}>
                      <T en={`Offer ${rupee(Math.max(w.rate, trade.fair[0]))}`} hi={`${rupee(Math.max(w.rate, trade.fair[0]))} दें`} mr={`${rupee(Math.max(w.rate, trade.fair[0]))} द्या`} gu={`${rupee(Math.max(w.rate, trade.fair[0]))} આપો`} />
                    </button>
                  </div>
                </div>
              ) : belowAsk ? (
                <p className={s.note}>
                  <Info aria-hidden="true" />
                  <span>
                    <T
                      en={`${first} usually asks ${rupee(w.rate)}. They may say no or suggest a different rate.`}
                      hi={`${first} आम तौर पर ${rupee(w.rate)} लेते हैं। वे मना कर सकते हैं या दूसरा रेट बता सकते हैं।`}
                      mr={`${first} साधारणपणे ${rupee(w.rate)} घेतात. ते नकार देऊ शकतात किंवा दुसरा दर सांगू शकतात.`}
                      gu={`${first} સામાન્ય રીતે ${rupee(w.rate)} લે છે. તેઓ ના પાડી શકે અથવા બીજો દર કહી શકે.`}
                    />
                  </span>
                </p>
              ) : null}
            </div>
            <p className={s.total}>
              <span>
                <T en="Total for" hi="कुल , " mr="एकूण , " gu="કુલ , " /> {span} <Tx l={spanUnit} />
              </span>
              <b className="money">{rupee(total)}</b>
            </p>
          </div>

          {/* Payday */}
          <label className="field">
            <span className="label">
              <WalletCards aria-hidden="true" /> <T en="When will you pay?" hi="भुगतान कब करेंगे?" mr="पैसे कधी देणार?" gu="પૈસા ક્યારે આપશો?" />
            </span>
            <select className="select" value={paidWhen} onChange={(e) => setPaidWhen(e.target.value as PaidWhen)}>
              {PAYDAYS.map((p) => (
                <option key={p} value={p}>
                  {t(PAID_WHEN[p].en, PAID_WHEN[p].hi, PAID_WHEN[p].mr, PAID_WHEN[p].gu)}
                </option>
              ))}
            </select>
          </label>

          {/* Perks */}
          <fieldset className={s.fs}>
            <legend className="label">
              <T en="What will you provide?" hi="आप क्या देंगे?" mr="तुम्ही काय देणार?" gu="તમે શું આપશો?" />
            </legend>
            <div className={s.perkRow}>
              {PERK_OPTIONS.map(({ id, Icon }) => (
                <button key={id} type="button" className="filter-chip" aria-pressed={perks.includes(id)} onClick={() => togglePerk(id)}>
                  <Icon aria-hidden="true" />
                  <Tx l={PERKS[id]} />
                </button>
              ))}
            </div>
          </fieldset>

          {/* Tasks & place */}
          <label className="field">
            <span className="label">
              <T en="What needs doing?" hi="क्या काम करना है?" mr="काय काम करायचे आहे?" gu="શું કામ કરવાનું છે?" /> <span className="subtle">(<T en="optional" hi="ज़रूरी नहीं" mr="गरजेचे नाही" gu="જરૂરી નથી" />)</span>
            </span>
            <textarea
              className={`textarea ${s.shortArea}`}
              value={tasks}
              maxLength={200}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={t('e.g. Kitchen tap leaking, change 2 bathroom taps', 'जैसे: किचन का नल टपक रहा है, बाथरूम के 2 नल बदलने हैं', 'उदा. किचनचा नळ गळतोय, बाथरूमचे 2 नळ बदलायचे आहेत', 'જેમ કે: રસોડાનો નળ ટપકે છે, બાથરૂમના 2 નળ બદલવાના છે')}
            />
          </label>
          <label className="field">
            <span className="label">
              <MapPin aria-hidden="true" /> <T en="Work address / landmark" hi="काम का पता / निशानी" mr="कामाचा पत्ता / खूण" gu="કામનું સરનામું / નિશાની" />
            </span>
            <input
              ref={placeRef}
              className="input"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                if (error) setError(null);
              }}
              aria-invalid={!!error && place.trim().length < 3}
              aria-describedby={`${uid}-err`}
              placeholder={t('e.g. Flat 302, Sai Krupa CHS, near Kurla station', 'जैसे: फ़्लैट 302, साई कृपा सोसाइटी, कुर्ला स्टेशन के पास', 'उदा. फ्लॅट 302, साई कृपा सोसायटी, कुर्ला स्टेशनजवळ', 'જેમ કે: ફ્લેટ 302, સાઈ કૃપા સોસાયટી, કુર્લા સ્ટેશન પાસે')}
              autoComplete="street-address"
            />
          </label>

          <p id={`${uid}-err`} role="alert" className={s.err}>
            {error && (
              <>
                <TriangleAlert aria-hidden="true" />
                {error}
              </>
            )}
          </p>

          <button type="submit" className="btn btn-primary btn-lg btn-block">
            <Send aria-hidden="true" />
            <T en="Send offer" hi="ऑफ़र भेजें" mr="ऑफर पाठवा" gu="ઑફર મોકલો" />
          </button>
          <p className={`subtle ${s.center}`}>
            <T en="No fee. Nothing is charged to you or the worker." hi="कोई फ़ीस नहीं। न आपसे, न कारीगर से कोई पैसा।" mr="कोणतीही फी नाही. ना तुमच्याकडून, ना कारागिराकडून कोणतेही पैसे." gu="કોઈ ફી નહીં. ન તમારી પાસેથી, ન કારીગર પાસેથી કોઈ પૈસા." />
          </p>
        </form>
      )}

      <div aria-live="polite" role="status">
        {toast && sent && (
          <div className="toast">
            <CircleCheck aria-hidden="true" />
            <T en={`Offer sent to ${first} (demo). Most workers reply within an hour.`} hi={`${first} को ऑफ़र भेजा गया (डेमो)। ज़्यादातर कारीगर एक घंटे में जवाब देते हैं।`} mr={`${first} यांना ऑफर पाठवली (डेमो). बहुतेक कारागीर एका तासात उत्तर देतात.`} gu={`${first}ને ઑફર મોકલી (ડેમો). મોટા ભાગના કારીગરો એક કલાકમાં જવાબ આપે છે.`} />
          </div>
        )}
      </div>
    </div>
  );
}

function WorkPromise({ p, worker: w, refEl, onEdit }: { p: Offer; worker: Worker; refEl: React.RefObject<HTMLDivElement | null>; onEdit: () => void }) {
  const first = w.name.split(' ')[0];
  const monthly = w.rateUnit === 'month';
  const unitL = PAY_UNIT[w.rateUnit];
  const spanEn = monthly ? (p.span === 1 ? 'month' : 'months') : p.span === 1 ? 'day' : 'days';
  const spanHi = monthly ? (p.span === 1 ? 'महीना' : 'महीने') : 'दिन';
  const spanMr = monthly ? (p.span === 1 ? 'महिना' : 'महिने') : 'दिवस';
  const spanGu = monthly ? (p.span === 1 ? 'મહિનો' : 'મહિના') : 'દિવસ';
  const perksEn = p.perks.length ? p.perks.map((k) => PERKS[k].en).join(', ') : 'Nothing extra';
  const perksHi = p.perks.length ? p.perks.map((k) => PERKS[k].hi).join(', ') : 'कुछ अतिरिक्त नहीं';
  const perksMr = p.perks.length ? p.perks.map((k) => PERKS[k].mr).join(', ') : 'काही जास्तीचे नाही';
  const perksGu = p.perks.length ? p.perks.map((k) => PERKS[k].gu).join(', ') : 'કંઈ વધારાનું નહીં';

  const speech: L = {
    en: `Work promise for ${w.name}. Work: ${p.tasks.en}. Place: ${p.place}. Starts ${p.date.en}, for ${p.span} ${spanEn}, from ${p.hours.start} to ${p.hours.end}. Pay ${p.rate} rupees ${unitL.en.replace('/', 'per')}, total ${p.total} rupees. ${PAID_WHEN[p.paidWhen].en}. Provided: ${perksEn}.`,
    hi: `${w.name} के लिए काम का वादा। काम: ${p.tasks.hi}। जगह: ${p.place}। ${p.date.hi} से शुरू, ${p.span} ${spanHi}, ${p.hours.start} से ${p.hours.end} तक। मज़दूरी ${p.rate} रुपये ${unitL.hi.replace('/', 'प्रति')}, कुल ${p.total} रुपये। ${PAID_WHEN[p.paidWhen].hi}। मिलेगा: ${perksHi}।`,
    mr: `${w.name} यांच्यासाठी कामाचे वचन. काम: ${p.tasks.mr}. जागा: ${p.place}. सुरुवात: ${p.date.mr}, ${p.span} ${spanMr}, वेळ ${p.hours.start} ते ${p.hours.end}. मजुरी ${p.rate} रुपये ${unitL.mr.replace('/', 'प्रति')}, एकूण ${p.total} रुपये. ${PAID_WHEN[p.paidWhen].mr}. मिळेल: ${perksMr}.`,
    gu: `${w.name} માટે કામનું વચન. કામ: ${p.tasks.gu}. જગ્યા: ${p.place}. શરૂઆત: ${p.date.gu}, ${p.span} ${spanGu}, સમય ${p.hours.start} થી ${p.hours.end}. મજૂરી ${p.rate} રૂપિયા ${unitL.gu.replace('/', 'પ્રતિ')}, કુલ ${p.total} રૂપિયા. ${PAID_WHEN[p.paidWhen].gu}. મળશે: ${perksGu}.`,
  };

  return (
    <div ref={refEl} tabIndex={-1} className={s.promise} aria-labelledby="promise-title">
      <div className={s.promiseTop}>
        <div>
          <span className="eyebrow">
            <T en="Work Promise" hi="काम का वादा" mr="कामाचे वचन" gu="કામનું વચન" />
          </span>
          <h2 id="promise-title" className={s.hireTitle}>
            <T en="Same terms, both sides" hi="दोनों तरफ़ एक जैसी शर्तें" mr="दोन्ही बाजूंना सारख्याच अटी" gu="બંને બાજુ એકસરખી શરતો" />
          </h2>
        </div>
        <span className={s.promiseRef}>{p.ref}</span>
      </div>

      <div className={s.parties}>
        <div>
          <WorkerAvatar name={w.name} trade={w.trade} hue={w.hue} hair={w.hair} size={44} />
          <span>
            <b>{w.name}</b>
            <small>
              <Tx l={TRADE[w.trade].name} />
            </small>
          </span>
        </div>
        <Handshake aria-hidden="true" className={s.partiesIcon} />
        <div>
          <span className={s.youAvatar} aria-hidden="true">
            <T en="You" hi="आप" mr="तुम्ही" gu="તમે" />
          </span>
          <span>
            <b>
              <T en="You" hi="आप" mr="तुम्ही" gu="તમે" />
            </b>
            <small>
              <T en="Employer" hi="मालिक" mr="मालक" gu="માલિક" />
            </small>
          </span>
        </div>
      </div>

      <dl className={`kv ${s.promiseKv}`}>
        <div>
          <Wrench aria-hidden="true" />
          <div>
            <dt>
              <T en="Work" hi="काम" mr="काम" gu="કામ" />
            </dt>
            <dd>
              <Tx l={p.tasks} />
            </dd>
          </div>
        </div>
        <div>
          <MapPin aria-hidden="true" />
          <div>
            <dt>
              <T en="Place" hi="जगह" mr="जागा" gu="જગ્યા" />
            </dt>
            <dd>{p.place}</dd>
          </div>
        </div>
        <div>
          <CalendarDays aria-hidden="true" />
          <div>
            <dt>
              <T en="Starts" hi="शुरू" mr="सुरुवात" gu="શરૂઆત" />
            </dt>
            <dd>
              <Tx l={p.date} /> · {p.span} <T en={spanEn} hi={spanHi} mr={spanMr} gu={spanGu} />
            </dd>
          </div>
        </div>
        <div>
          <Clock aria-hidden="true" />
          <div>
            <dt>
              <T en="Hours" hi="समय" mr="वेळ" gu="સમય" />
            </dt>
            <dd>
              {p.hours.start}, {p.hours.end}
            </dd>
          </div>
        </div>
        <div>
          <IndianRupee aria-hidden="true" />
          <div>
            <dt>
              <T en="Pay" hi="मज़दूरी" mr="मजुरी" gu="મજૂરી" />
            </dt>
            <dd>
              <span className="money">{rupee(p.rate)}</span> <Tx l={unitL} /> ·{' '}
              <T en="total" hi="कुल" mr="एकूण" gu="કુલ" /> <span className="money">{rupee(p.total)}</span>
            </dd>
          </div>
        </div>
        <div>
          <WalletCards aria-hidden="true" />
          <div>
            <dt>
              <T en="Payday" hi="भुगतान" mr="पगार" gu="પગાર" />
            </dt>
            <dd>
              <Tx l={PAID_WHEN[p.paidWhen]} />
            </dd>
          </div>
        </div>
        <div>
          <CircleCheck aria-hidden="true" />
          <div>
            <dt>
              <T en="You provide" hi="आप देंगे" mr="तुम्ही देणार" gu="તમે આપશો" />
            </dt>
            <dd>
              <T en={perksEn} hi={perksHi} mr={perksMr} gu={perksGu} />
            </dd>
          </div>
        </div>
      </dl>

      <p className={`chip chip-warning ${s.waiting}`}>
        <Hourglass aria-hidden="true" />
        <T en={`Waiting for ${first} to accept`} hi={`${first} के जवाब का इंतज़ार`} mr={`${first} यांच्या उत्तराची वाट पाहत आहोत`} gu={`${first}ના જવાબની રાહ જોવાય છે`} />
      </p>
      <p className="subtle">
        <T
          en={`${first} gets these exact terms by SMS and voice call in their language. Any change must be agreed by both of you again.`}
          hi={`${first} को यही शर्तें SMS और आवाज़ वाले कॉल से उनकी भाषा में मिलेंगी। कोई भी बदलाव दोनों की सहमति से ही होगा।`}
          mr={`${first} यांना याच अटी SMS आणि फोन कॉलवर त्यांच्या भाषेत मिळतील. कोणताही बदल तुम्हा दोघांच्या संमतीनेच होईल.`}
          gu={`${first}ને આ જ શરતો SMS અને ફોન કૉલથી તેમની ભાષામાં મળશે. કોઈ પણ ફેરફાર તમારા બંનેની સંમતિથી જ થશે.`}
        />
      </p>
      <div className="row">
        <ReadAloud en={speech.en} hi={speech.hi} mr={speech.mr} gu={speech.gu} className="btn btn-sm" />
        <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
          <Pencil aria-hidden="true" />
          <T en="Change offer" hi="ऑफ़र बदलें" mr="ऑफर बदला" gu="ઑફર બદલો" />
        </button>
      </div>
    </div>
  );
}
