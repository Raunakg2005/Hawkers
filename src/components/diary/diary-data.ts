import type { L, TradeId } from '@/data/types';
import { JOBS } from '@/data/jobs';
import { TRADE } from '@/data/trades';

/* ==========================================================================
   Work diary — types, mock seed, date & money helpers (client-side only)
   ========================================================================== */

export interface DiaryEntry {
  id: string;
  /** local date, YYYY-MM-DD */
  date: string;
  employer: string;
  trade: TradeId;
  amount: number;
  paid: boolean;
  paidOn?: string;
  /** employer confirmed the work day on Naka (seeded entries) vs. self-recorded */
  verified: boolean;
}

export const DIARY_KEY = 'naka-diary';
export const AVAIL_KEY = 'naka-available-today';
export const PROFILE_KEY = 'naka-profile';

/** Days of building work the welfare board asks for (in the last 12 months). */
export const BOARD_DAYS = 90;
export const DUE_NUDGE_DAYS = 7;

/* ── Dates (always local time, never UTC, so "today" is the worker's today) */

export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const addDays = (d: Date, n: number) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
};

export const daysBetween = (a: Date, b: Date) => Math.round((parseKey(dateKey(b)).getTime() - parseKey(dateKey(a)).getTime()) / 86_400_000);

/** Monday of the week containing d. */
export const weekStart = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

export const fmtDate = (k: string, lang: 'en' | 'hi', opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', opts).format(parseKey(k));

export const WEEKDAY_SHORT: L[] = [
  { en: 'Sun', hi: 'रवि' },
  { en: 'Mon', hi: 'सोम' },
  { en: 'Tue', hi: 'मंगल' },
  { en: 'Wed', hi: 'बुध' },
  { en: 'Thu', hi: 'गुरु' },
  { en: 'Fri', hi: 'शुक्र' },
  { en: 'Sat', hi: 'शनि' },
];

/* ── Employers we know (for phone numbers + suggestions) */

export const EMPLOYER_PHONES: Record<string, string> = Object.fromEntries(JOBS.map((j) => [j.employer.name, j.employer.phone.replace(/[^\d+]/g, '')]));

export const KNOWN_EMPLOYERS = Array.from(new Set(JOBS.filter((j) => j.employer.verified).map((j) => j.employer.name)));

/* ── Seed: a plumber who also takes helper work, past ~2.5 weeks */

const SEED: [daysAgo: number, employer: string, trade: TradeId, amount: number, paid: boolean][] = [
  [1, 'Sai Constructions', 'labour', 750, false],
  [2, 'Sai Constructions', 'labour', 750, false],
  [3, 'Mrs. Shalini Rao', 'plumber', 1100, true],
  [5, 'Mr. Fernandes', 'plumber', 900, true],
  [6, 'Sunflower CHS', 'plumber', 1000, true],
  [8, 'Sai Constructions', 'labour', 750, true],
  [9, 'Sai Constructions', 'labour', 750, true],
  [10, 'Rahul Patil', 'plumber', 1200, false],
  [12, 'Om Packers', 'labour', 800, true],
  [15, 'Annapurna Caterers', 'labour', 700, true],
  [17, 'Sunflower CHS', 'plumber', 1000, true],
];

export function seedEntries(today = new Date()): DiaryEntry[] {
  return SEED.map(([ago, employer, trade, amount, paid], i) => {
    const date = dateKey(addDays(today, -ago));
    return {
      id: `seed-${i}`,
      date,
      employer,
      trade,
      amount,
      paid,
      paidOn: paid ? date : undefined,
      verified: true,
    };
  });
}

export function loadEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed))
        return parsed.filter(
          (e): e is DiaryEntry => e && typeof e.id === 'string' && typeof e.date === 'string' && typeof e.amount === 'number' && !!TRADE[e.trade as TradeId],
        );
    }
  } catch {
    /* fall through to seed */
  }
  const seeded = seedEntries();
  saveEntries(seeded);
  return seeded;
}

export function saveEntries(list: DiaryEntry[]) {
  try {
    localStorage.setItem(DIARY_KEY, JSON.stringify(list));
  } catch {
    /* storage blocked — diary works for this visit only */
  }
}

/* ── Profile bridge: read name/trade from the Skill Card if one exists */

export function readProfile(): { name: string; trade: TradeId | null } | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return { name: typeof p?.name === 'string' ? p.name : '', trade: p?.trade && TRADE[p.trade as TradeId] ? (p.trade as TradeId) : null };
  } catch {
    return null;
  }
}

export function readAvailable(today: string): boolean {
  try {
    const raw = localStorage.getItem(AVAIL_KEY);
    if (!raw) return false;
    const v = JSON.parse(raw);
    return v?.date === today && v?.on === true;
  } catch {
    return false;
  }
}

export function writeAvailable(today: string, on: boolean) {
  try {
    localStorage.setItem(AVAIL_KEY, JSON.stringify({ date: today, on }));
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === 'object') localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...p, availableToday: on }));
    }
  } catch {
    /* ignore */
  }
}

/* ── Money */

export const shortRupee = (n: number) => (n >= 1000 ? `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `₹${n}`);

/** Polite bilingual payment reminder. Active language first. */
export function reminderText(e: DiaryEntry, worker: string, lang: 'en' | 'hi') {
  const amt = `₹${e.amount.toLocaleString('en-IN')}`;
  const en = `Namaste ${e.employer} ji, this is ${worker || 'your worker'} (${TRADE[e.trade].name.en}). A gentle reminder: ${amt} for my work on ${fmtDate(e.date, 'en', { day: 'numeric', month: 'long' })} is still pending. Please pay when you can — UPI or cash is fine. Thank you!`;
  const hi = `नमस्ते ${e.employer} जी, मैं ${worker || 'आपका कारीगर'} (${TRADE[e.trade].name.hi}) बोल रहा/रही हूँ। ${fmtDate(e.date, 'hi', { day: 'numeric', month: 'long' })} के काम के ${amt} अभी बाक़ी हैं। कृपया जब हो सके भुगतान कर दें — UPI या नकद, दोनों चलेगा। धन्यवाद!`;
  return lang === 'hi' ? `${hi}\n\n${en}` : `${en}\n\n${hi}`;
}

export function smsHref(e: DiaryEntry, worker: string, lang: 'en' | 'hi') {
  const phone = EMPLOYER_PHONES[e.employer] ?? '';
  return `sms:${phone}?body=${encodeURIComponent(reminderText(e, worker, lang))}`;
}

/* ── CSV work record */

export function workRecordCsv(list: DiaryEntry[], worker: string) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows: (string | number)[][] = [
    ['Naka work record'],
    ['Worker', worker || '—'],
    ['Made on', dateKey(new Date())],
    ['Verified work days (last 12 months)', verifiedDays(list)],
    [],
    ['Date', 'Employer', 'Work', 'Amount (Rs)', 'Paid', 'Paid on', 'Confirmed by employer'],
    ...[...list]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => [e.date, e.employer, TRADE[e.trade].name.en, e.amount, e.paid ? 'Yes' : 'Not yet', e.paidOn ?? '', e.verified ? 'Yes' : 'No']),
  ];
  return '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
}

/** Unique dates with employer-confirmed work in the last 12 months. */
export function verifiedDays(list: DiaryEntry[], today = new Date()) {
  const from = dateKey(addDays(today, -365));
  return new Set(list.filter((e) => e.verified && e.date >= from).map((e) => e.date)).size;
}

/* ── Jobs shown as upcoming / applied */

export const UPCOMING: { id: string; status: 'confirmed' | 'applied' }[] = [
  { id: 'site-helper-kurla', status: 'confirmed' },
  { id: 'bathroom-pipe-repair-powai', status: 'applied' },
  { id: 'tiles-flooring-vikhroli', status: 'applied' },
];
