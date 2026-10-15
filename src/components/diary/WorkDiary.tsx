'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  ChartColumn,
  Briefcase,
  CalendarCheck,
  CircleCheck,
  Clock,
  Download,
  FileSignature,
  HandCoins,
  History,
  Hourglass,
  IdCard,
  Moon,
  NotebookPen,
  PartyPopper,
  Plus,
  Scale,
  Sun,
  Sunrise,
  Trash2,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { T, Tx } from '@/components/T';
import { TradeTile } from '@/components/TradeIcon';
import ReadAloud from '@/components/ReadAloud';
import { JOBS } from '@/data/jobs';
import { PAY_UNIT, TRADE, rupee } from '@/data/trades';
import type { TradeId } from '@/data/types';
import { useLang } from '@/lib/prefs';
import Toast, { type ToastMsg } from '@/components/profile/Toast';
import WeekChart from './WeekChart';
import AddWorkForm from './AddWorkForm';
import { useCountUp } from './useCountUp';
import {
  BOARD_DAYS,
  DUE_NUDGE_DAYS,
  UPCOMING,
  addDays,
  dateKey,
  daysBetween,
  fmtDate,
  loadEntries,
  parseKey,
  readAvailable,
  readProfile,
  saveEntries,
  smsHref,
  verifiedDays,
  weekStart,
  workRecordCsv,
  writeAvailable,
  type DiaryEntry,
} from './diary-data';
import s from './diary.module.css';

function Money({ value, className }: { value: number; className?: string }) {
  const v = useCountUp(value);
  return <span className={`money ${className ?? ''}`}>{rupee(v)}</span>;
}

function Count({ value, className }: { value: number; className?: string }) {
  const v = useCountUp(value);
  return <span className={`money ${className ?? ''}`}>{v}</span>;
}

function PanelHead({ icon: Icon, tile, title, aside, id }: { icon: typeof Wallet; tile: string; title: React.ReactNode; aside?: React.ReactNode; id: string }) {
  return (
    <div className={s.panelHead}>
      <span className="icon-tile sm" style={{ '--tile': tile } as React.CSSProperties}>
        <Icon aria-hidden="true" />
      </span>
      <h2 id={id} className={s.panelTitle}>
        {title}
      </h2>
      {aside && <div className={s.panelAside}>{aside}</div>}
    </div>
  );
}

export default function WorkDiary() {
  const { t, lang } = useLang();
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [today, setToday] = useState('');
  const [hour, setHour] = useState(9);
  const [name, setName] = useState('');
  const [trade, setTrade] = useState<TradeId>('plumber');
  const [available, setAvailable] = useState(false);
  const [toast, setToast] = useState<ToastMsg | null>(null);

  useEffect(() => {
    const now = new Date();
    const key = dateKey(now);
    setToday(key);
    setHour(now.getHours());
    setEntries(loadEntries());
    const prof = readProfile();
    if (prof) {
      setName(prof.name.trim().split(/\s+/)[0] ?? '');
      if (prof.trade) setTrade(prof.trade);
    }
    setAvailable(readAvailable(key));
    setReady(true);
  }, []);

  const commit = useCallback((next: DiaryEntry[]) => {
    setEntries(next);
    saveEntries(next);
  }, []);

  const showToast = (text: React.ReactNode, action?: ToastMsg['action']) => setToast({ id: Date.now(), text, action });
  const closeToast = useCallback(() => setToast(null), []);

  /* ── derived numbers */
  const stats = useMemo(() => {
    if (!today) return null;
    const t0 = parseKey(today);
    const weekFrom = dateKey(addDays(t0, -6));
    const week = entries.filter((e) => e.date >= weekFrom && e.date <= today);
    const weekEarned = week.reduce((a, e) => a + e.amount, 0);
    const weekReceived = week.filter((e) => e.paid).reduce((a, e) => a + e.amount, 0);
    const dues = entries.filter((e) => !e.paid).sort((a, b) => a.date.localeCompare(b.date));
    const owed = dues.reduce((a, e) => a + e.amount, 0);
    const owedFrom = new Set(dues.map((e) => e.employer)).size;
    const month = today.slice(0, 7);
    const monthDays = new Set(entries.filter((e) => e.date.startsWith(month)).map((e) => e.date)).size;
    const proofDays = verifiedDays(entries, t0);
    const selfDays = new Set(entries.filter((e) => !e.verified).map((e) => e.date)).size;
    const pastEmployers = Array.from(new Set([...entries].sort((a, b) => b.date.localeCompare(a.date)).map((e) => e.employer)));
    return { weekEarned, weekReceived, dues, owed, owedFrom, monthDays, proofDays, selfDays, pastEmployers };
  }, [entries, today]);

  const groups = useMemo(() => {
    if (!today) return [];
    const thisWeek = dateKey(weekStart(parseKey(today)));
    const lastWeek = dateKey(addDays(parseKey(thisWeek), -7));
    const map = new Map<string, DiaryEntry[]>();
    for (const e of [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))) {
      const wk = dateKey(weekStart(parseKey(e.date)));
      if (!map.has(wk)) map.set(wk, []);
      map.get(wk)!.push(e);
    }
    return Array.from(map, ([wk, list]) => ({
      wk,
      kind: wk === thisWeek ? 'this' : wk === lastWeek ? 'last' : 'older',
      list,
      total: list.reduce((a, e) => a + e.amount, 0),
    }));
  }, [entries, today]);

  if (!ready || !stats) {
    return (
      <div className={s.skeleton} aria-busy="true">
        <span className="sr-only">
          <T en="Opening your diary…" hi="आपकी डायरी खुल रही है…" />
        </span>
        <div className={s.skelBlock} />
        <div className={s.skelRow}>
          <div className={s.skelBlock} />
          <div className={s.skelBlock} />
          <div className={s.skelBlock} />
        </div>
      </div>
    );
  }

  /* ── actions */
  const toggleAvailable = () => {
    const on = !available;
    setAvailable(on);
    writeAvailable(today, on);
    showToast(
      on ? (
        <T en="You're marked available. Employers nearby can call you." hi="आप खाली दिख रहे हैं। पास के मालिक आपको बुला सकते हैं।" />
      ) : (
        <T en="Marked busy for today." hi="आज के लिए व्यस्त दिखा रहे हैं।" />
      ),
    );
  };

  const addEntry = (e: Omit<DiaryEntry, 'id'>) => {
    const entry: DiaryEntry = { ...e, id: `e-${Date.now().toString(36)}` };
    commit([entry, ...entries]);
    showToast(
      <T en={`Saved! ${rupee(e.amount)} added to your diary.`} hi={`सेव हुआ! ${rupee(e.amount)} डायरी में जुड़ गए।`} />,
    );
  };

  const markPaid = (id: string) => {
    const prev = entries;
    const entry = entries.find((x) => x.id === id);
    commit(entries.map((x) => (x.id === id ? { ...x, paid: true, paidOn: today } : x)));
    showToast(<T en={`${rupee(entry?.amount ?? 0)} marked as received.`} hi={`${rupee(entry?.amount ?? 0)} मिल गए — दर्ज हुआ।`} />, {
      label: <T en="Undo" hi="वापस" />,
      run: () => commit(prev),
    });
  };

  const remove = (id: string) => {
    const prev = entries;
    commit(entries.filter((x) => x.id !== id));
    showToast(<T en="Entry deleted." hi="एंट्री हटाई गई।" />, { label: <T en="Undo" hi="वापस" />, run: () => commit(prev) });
  };

  const download = () => {
    try {
      const blob = new Blob([workRecordCsv(entries, name)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `naka-work-record-${today}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      showToast(<T en="Work record downloaded." hi="काम का रिकॉर्ड डाउनलोड हुआ।" />);
    } catch {
      showToast(<T en="Download did not work on this phone." hi="इस फ़ोन पर डाउनलोड नहीं हुआ।" />);
    }
  };

  const greet =
    hour < 12
      ? { en: 'Good morning', hi: 'सुप्रभात', icon: Sunrise }
      : hour < 17
        ? { en: 'Good afternoon', hi: 'नमस्ते', icon: Sun }
        : { en: 'Good evening', hi: 'शुभ संध्या', icon: Moon };
  const GreetIcon = greet.icon;
  const monthName = fmtDate(today, lang, { month: 'long' });
  const proofPct = Math.min(1, stats.proofDays / BOARD_DAYS);
  const proofLeft = Math.max(0, BOARD_DAYS - stats.proofDays);

  const summarySpeech = {
    en: `${greet.en}${name ? ` ${name}` : ''}. In the last 7 days you earned ${stats.weekEarned} rupees. ${stats.owed ? `${stats.owed} rupees is still owed to you.` : 'Nobody owes you money.'} You worked ${stats.monthDays} days this month.`,
    hi: `${greet.hi}${name ? ` ${name}` : ''}। पिछले 7 दिन में आपने ${stats.weekEarned} रुपये कमाए। ${stats.owed ? `${stats.owed} रुपये अभी आपको मिलने बाक़ी हैं।` : 'किसी पर आपका पैसा बाक़ी नहीं है।'} इस महीने आपने ${stats.monthDays} दिन काम किया।`,
  };

  return (
    <div className={s.diary}>
      {/* ── Header row */}
      <header className={s.head}>
        <div className={s.hello}>
          <p className={s.today}>
            <CalendarCheck aria-hidden="true" />
            {fmtDate(today, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h2 className={s.greet}>
            <GreetIcon aria-hidden="true" className={s.greetIcon} />
            <span>
              <T en={greet.en} hi={greet.hi} />
              {name ? `, ${name}` : <T en=", friend" hi=", साथी" />}
            </span>
          </h2>
          <div className="row">
            <ReadAloud en={summarySpeech.en} hi={summarySpeech.hi} className="btn btn-sm" label={t('Hear my summary', 'मेरा हिसाब सुनें')} />
            {!name && (
              <Link href="/profile" className="btn btn-sm btn-ghost">
                <IdCard aria-hidden="true" />
                <T en="Make your skill card" hi="अपना स्किल कार्ड बनाएँ" />
              </Link>
            )}
          </div>
        </div>

        <div className={`${s.avail} ${available ? s.availOn : ''}`}>
          <span className={s.availDot} aria-hidden="true">
            {available ? <span className="dot dot-live" /> : <span className="dot" />}
          </span>
          <span className={s.availText}>
            <strong id="avail-label">
              <T en="Available for work today" hi="आज काम के लिए खाली हूँ" />
            </strong>
            <span>
              {available ? (
                <T en="Employers nearby can see and call you" hi="पास के मालिक आपको देख और बुला सकते हैं" />
              ) : (
                <T en="Turn on so employers can call you" hi="चालू करें ताकि मालिक आपको बुला सकें" />
              )}
            </span>
          </span>
          <button type="button" role="switch" aria-checked={available} aria-labelledby="avail-label" className={`switch ${s.bigSwitch}`} onClick={toggleAvailable} />
        </div>
      </header>

      {/* ── Summary tiles */}
      <ul className={s.tiles} aria-label={t('Summary', 'सारांश')}>
        <li className={s.tile} style={{ '--tile': 'var(--color-brand)', '--d': 0 } as React.CSSProperties} data-reveal="">
          <span className="icon-tile sm">
            <Wallet aria-hidden="true" />
          </span>
          <span className={s.tileLabel}>
            <T en="Earned in last 7 days" hi="पिछले 7 दिन की कमाई" />
          </span>
          <Money value={stats.weekEarned} className={s.tileNum} />
          <span className={s.tileSub}>
            <CircleCheck aria-hidden="true" />
            <T en={`${rupee(stats.weekReceived)} in hand`} hi={`${rupee(stats.weekReceived)} हाथ में`} />
          </span>
        </li>
        <li className={`${s.tile} ${stats.owed ? s.tileWarn : ''}`} style={{ '--tile': stats.owed ? 'var(--color-warning)' : 'var(--color-success)', '--d': 1 } as React.CSSProperties} data-reveal="">
          <span className="icon-tile sm">
            <HandCoins aria-hidden="true" />
          </span>
          <span className={s.tileLabel}>
            <T en="Money still owed to you" hi="आपके बाक़ी पैसे" />
          </span>
          <Money value={stats.owed} className={s.tileNum} />
          <span className={s.tileSub}>
            {stats.owed ? (
              <a href="#dues" className={s.tileLink}>
                <T en={`From ${stats.owedFrom} ${stats.owedFrom === 1 ? 'employer' : 'employers'}`} hi={`${stats.owedFrom} मालिकों से`} />
                <ArrowRight aria-hidden="true" />
              </a>
            ) : (
              <T en="All paid. Well done!" hi="सब मिल गया। बढ़िया!" />
            )}
          </span>
        </li>
        <li className={s.tile} style={{ '--tile': 'var(--color-trust)', '--d': 2 } as React.CSSProperties} data-reveal="">
          <span className="icon-tile sm">
            <CalendarCheck aria-hidden="true" />
          </span>
          <span className={s.tileLabel}>
            <T en="Days worked this month" hi="इस महीने काम के दिन" />
          </span>
          <span className={s.tileNumRow}>
            <Count value={stats.monthDays} className={s.tileNum} />
            <span className={s.tileUnit}>
              <T en="days" hi="दिन" />
            </span>
          </span>
          <span className={s.tileSub}>
            <Clock aria-hidden="true" />
            <T en={`in ${monthName}`} hi={`${monthName} में`} />
          </span>
        </li>
      </ul>

      <div className={s.cols}>
        {/* ── Main column */}
        <div className={s.colMain}>
          <section className={`card ${s.panel} ${s.oChart}`} aria-labelledby="chart-title">
            <PanelHead
              id="chart-title"
              icon={ChartColumn}
              tile="var(--color-accent)"
              title={<T en="Last 7 days" hi="पिछले 7 दिन" />}
              aside={
                <span className="subtle">
                  <T en="Tap a day" hi="दिन दबाएँ" />
                </span>
              }
            />
            <WeekChart entries={entries} today={today} />
          </section>

          <section className={`card ${s.panel} ${s.oHistory}`} aria-labelledby="history-title">
            <PanelHead id="history-title" icon={History} tile="var(--color-text-muted)" title={<T en="My work history" hi="मेरा काम का हिसाब" />} />
            {groups.length === 0 ? (
              <div className="empty">
                <NotebookPen aria-hidden="true" />
                <p>
                  <T en="Nothing written yet. Add your first day of work." hi="अभी कुछ नहीं लिखा। अपने पहले काम का दिन जोड़ें।" />
                </p>
              </div>
            ) : (
              <div className={s.weeks}>
                {groups.map((g) => (
                  <div key={g.wk} className={s.week}>
                    <h3 className={s.weekHead}>
                      <span>
                        {g.kind === 'this' ? (
                          <T en="This week" hi="इस हफ़्ते" />
                        ) : g.kind === 'last' ? (
                          <T en="Last week" hi="पिछले हफ़्ते" />
                        ) : (
                          <T en={`Week of ${fmtDate(g.wk, 'en', { day: 'numeric', month: 'short' })}`} hi={`${fmtDate(g.wk, 'hi', { day: 'numeric', month: 'short' })} वाला हफ़्ता`} />
                        )}
                      </span>
                      <span className={s.weekTotal}>
                        {g.list.length} <T en={g.list.length === 1 ? 'job' : 'jobs'} hi="काम" /> · <b>{rupee(g.total)}</b>
                      </span>
                    </h3>
                    <ul className={s.entries}>
                      {g.list.map((e) => (
                        <li key={e.id} className={s.entry}>
                          <span className={s.entryDate}>
                            <b>{parseKey(e.date).getDate()}</b>
                            <small>{fmtDate(e.date, lang, { weekday: 'short' })}</small>
                          </span>
                          <TradeTile trade={e.trade} size="sm" />
                          <span className={s.entryMain}>
                            <span className={s.entryEmployer}>{e.employer}</span>
                            <span className={s.entryMeta}>
                              <Tx l={TRADE[e.trade].name} />
                              {e.verified ? (
                                <span className={s.verified}>
                                  <BadgeCheck aria-hidden="true" />
                                  <T en="Confirmed" hi="पक्का" />
                                </span>
                              ) : (
                                <span className={s.selfRec}>
                                  <NotebookPen aria-hidden="true" />
                                  <T en="Written by you" hi="आपने लिखा" />
                                </span>
                              )}
                            </span>
                          </span>
                          <span className={s.entryRight}>
                            <span className="money">{rupee(e.amount)}</span>
                            <span className={`chip ${e.paid ? 'chip-success' : 'chip-warning'} ${s.entryChip}`}>
                              {e.paid ? <T en="Paid" hi="मिला" /> : <T en="Due" hi="बाक़ी" />}
                            </span>
                          </span>
                          <button
                            type="button"
                            className={`icon-btn ${s.delBtn}`}
                            onClick={() => remove(e.id)}
                            aria-label={t(`Delete ${e.employer}, ${fmtDate(e.date, 'en')}`, `${e.employer}, ${fmtDate(e.date, 'hi')} हटाएँ`)}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Side column */}
        <div className={s.colSide}>
          <section className={`card ${s.panel} ${s.addPanel} ${s.oAdd}`} aria-labelledby="add-title">
            <PanelHead
              id="add-title"
              icon={Plus}
              tile="var(--color-brand)"
              title={<T en="Add today's work" hi="आज का काम जोड़ें" />}
              aside={
                <ReadAloud
                  en="Write who you worked for, what work, how much money, and whether you got paid. Then press Save."
                  hi="लिखें किसके यहाँ काम किया, कौन सा काम, कितने पैसे, और पैसे मिले या नहीं। फिर सेव दबाएँ।"
                />
              }
            />
            <AddWorkForm today={today} defaultTrade={trade} pastEmployers={stats.pastEmployers} onAdd={addEntry} />
          </section>

          <section id="dues" className={`card ${s.panel} ${s.oDues}`} aria-labelledby="dues-title">
            <PanelHead
              id="dues-title"
              icon={HandCoins}
              tile="var(--color-warning)"
              title={<T en="Money owed to you" hi="आपके बाक़ी पैसे" />}
              aside={stats.owed > 0 ? <span className={`money ${s.duesTotal}`}>{rupee(stats.owed)}</span> : undefined}
            />
            {stats.dues.length === 0 ? (
              <div className={s.allPaid}>
                <PartyPopper aria-hidden="true" />
                <p>
                  <strong>
                    <T en="Nobody owes you money" hi="किसी पर आपका पैसा बाक़ी नहीं" />
                  </strong>
                  <span className="subtle">
                    <T en="When you mark work as “Not yet”, it shows here." hi="जब आप काम को “अभी नहीं” लिखेंगे, वो यहाँ दिखेगा।" />
                  </span>
                </p>
              </div>
            ) : (
              <ul className={s.dues}>
                {stats.dues.map((e) => {
                  const age = daysBetween(parseKey(e.date), parseKey(today));
                  const old = age > DUE_NUDGE_DAYS;
                  return (
                    <li key={e.id} className={`${s.due} ${old ? s.dueOld : ''}`}>
                      <div className={s.dueTop}>
                        <TradeTile trade={e.trade} size="sm" />
                        <span className={s.dueWho}>
                          <strong>{e.employer}</strong>
                          <span className="subtle">
                            {fmtDate(e.date, lang)} ·{' '}
                            {age === 0 ? <T en="today" hi="आज" /> : <T en={`${age} ${age === 1 ? 'day' : 'days'} ago`} hi={`${age} दिन पहले`} />}
                          </span>
                        </span>
                        <span className={`money ${s.dueAmt}`}>{rupee(e.amount)}</span>
                      </div>
                      {old && (
                        <p className={`callout callout-warning ${s.nudge}`}>
                          <TriangleAlert aria-hidden="true" />
                          <span>
                            <T
                              en={`Waiting ${age} days is too long. You have a right to your wages — free help is available.`}
                              hi={`${age} दिन का इंतज़ार बहुत ज़्यादा है। मज़दूरी पाना आपका हक़ है — मुफ़्त मदद मिल सकती है।`}
                            />{' '}
                            <Link href="/rights#rights" className={s.inlineLink}>
                              <T en="Get help with unpaid wages" hi="बाक़ी मज़दूरी के लिए मदद" />
                              <ArrowRight aria-hidden="true" />
                            </Link>
                          </span>
                        </p>
                      )}
                      <div className={s.dueActions}>
                        <button type="button" className="btn btn-sm btn-success" onClick={() => markPaid(e.id)}>
                          <CircleCheck aria-hidden="true" />
                          <T en="Mark paid" hi="पैसे मिल गए" />
                        </button>
                        <a className="btn btn-sm" href={smsHref(e, name, lang)}>
                          <BellRing aria-hidden="true" />
                          <T en="Send reminder" hi="याद दिलाएँ" />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className={`card ${s.panel} ${s.oJobs}`} aria-labelledby="jobs-title">
            <PanelHead
              id="jobs-title"
              icon={Briefcase}
              tile="var(--color-accent)"
              title={<T en="Coming up" hi="आने वाला काम" />}
              aside={
                <Link href="/jobs" className={s.inlineLink}>
                  <T en="Find more" hi="और खोजें" />
                  <ArrowRight aria-hidden="true" />
                </Link>
              }
            />
            <ul className={s.jobs}>
              {UPCOMING.map(({ id, status }) => {
                const job = JOBS.find((j) => j.id === id);
                if (!job) return null;
                return (
                  <li key={id} className={s.job}>
                    <TradeTile trade={job.trade} size="sm" />
                    <span className={s.jobMain}>
                      <Link href={`/jobs/${job.id}`} className={`stretched ${s.jobTitle}`}>
                        <Tx l={job.title} />
                      </Link>
                      <span className="subtle">
                        {job.employer.name} · <Tx l={job.start} />, {job.hours.start}
                      </span>
                      <span className={s.jobFoot}>
                        {status === 'confirmed' ? (
                          <span className="chip chip-success">
                            <FileSignature aria-hidden="true" />
                            <T en="Confirmed — Work Promise signed" hi="पक्का — काम का वादा साइन हुआ" />
                          </span>
                        ) : (
                          <span className="chip chip-accent">
                            <Hourglass aria-hidden="true" />
                            <T en="Applied — waiting" hi="अर्ज़ी दी — इंतज़ार" />
                          </span>
                        )}
                        <span className={s.jobPay}>
                          {rupee(job.pay.amount)} <Tx l={PAY_UNIT[job.pay.unit]} />
                        </span>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={`card ${s.panel} ${s.proof} ${s.oProof}`} aria-labelledby="proof-title">
            <PanelHead id="proof-title" icon={Scale} tile="var(--color-trust)" title={<T en="Proof of work" hi="काम का सबूत" />} />
            <div className={s.proofTop}>
              <Count value={stats.proofDays} className={s.proofNum} />
              <span className={s.proofOf}>
                / {BOARD_DAYS} <T en="days" hi="दिन" />
              </span>
            </div>
            <div
              className={`meter ${s.proofMeter}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={BOARD_DAYS}
              aria-valuenow={Math.min(stats.proofDays, BOARD_DAYS)}
              aria-label={t('Confirmed work days toward 90', '90 में से पक्के काम के दिन')}
            >
              <span style={{ transform: `scaleX(${proofPct})` }} />
            </div>
            <p>
              {proofLeft > 0 ? (
                <T
                  en={`${proofLeft} more days of building work and you can register with the Construction Workers' Welfare Board — pension, accident cover and scholarships for your children.`}
                  hi={`${proofLeft} दिन और निर्माण का काम, फिर आप निर्माण कामगार कल्याण बोर्ड में नाम लिखा सकते हैं — पेंशन, दुर्घटना बीमा और बच्चों की छात्रवृत्ति।`}
                />
              ) : (
                <T
                  en="You have 90 days! You can now register with the Construction Workers' Welfare Board."
                  hi="आपके 90 दिन पूरे! अब आप निर्माण कामगार कल्याण बोर्ड में नाम लिखा सकते हैं।"
                />
              )}
            </p>
            <p className="subtle">
              <T
                en={`Counted: days confirmed by employers on Naka in the last 12 months.${stats.selfDays ? ` ${stats.selfDays} days written by you — ask the employer to confirm them.` : ''}`}
                hi={`गिनती: पिछले 12 महीनों में नाका पर मालिकों ने जो दिन पक्के किए।${stats.selfDays ? ` आपके लिखे ${stats.selfDays} दिन — मालिक से पक्का करवाएँ।` : ''}`}
              />
            </p>
            <div className={s.proofActions}>
              <button type="button" className="btn btn-accent" onClick={download}>
                <Download aria-hidden="true" />
                <T en="Download work record" hi="काम का रिकॉर्ड डाउनलोड करें" />
              </button>
              <Link href="/rights#bocw" className={s.inlineLink}>
                <T en="About the welfare board" hi="कल्याण बोर्ड के बारे में" />
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Toast msg={toast} onDone={closeToast} />
    </div>
  );
}
