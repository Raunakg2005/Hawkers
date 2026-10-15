'use client';

import { useState } from 'react';
import { LocateFixed } from 'lucide-react';
import type { Job } from '@/data/types';
import { rupee, trustScore } from '@/data/trades';
import { useLang } from '@/lib/prefs';
import JobCard from '../JobCard';
import { TradeIcon } from '../TradeIcon';
import { T } from '../T';

/** Your naka on the illustrated map (0–100 coordinates). */
export const HOME = { x: 46, y: 54 };

const AREAS = [
  { n: 'Goregaon', h: 'गोरेगांव', x: 18, y: 12 },
  { n: 'Malad', h: 'मालाड', x: 8, y: 26 },
  { n: 'Andheri', h: 'अंधेरी', x: 36, y: 20 },
  { n: 'Powai', h: 'पवई', x: 64, y: 22 },
  { n: 'Mulund', h: 'मुलुंड', x: 86, y: 9 },
  { n: 'Vikhroli', h: 'विक्रोली', x: 80, y: 32 },
  { n: 'Santacruz', h: 'सांताक्रूज़', x: 26, y: 40 },
  { n: 'Ghatkopar', h: 'घाटकोपर', x: 63, y: 41 },
  { n: 'Kurla', h: 'कुर्ला', x: 47, y: 62 },
  { n: 'Bandra', h: 'बांद्रा', x: 18, y: 55 },
  { n: 'Chembur', h: 'चेंबूर', x: 72, y: 70 },
  { n: 'Dadar', h: 'दादर', x: 28, y: 86 },
];

/**
 * Illustrated (not geographic) map: distance rings around your naka and one
 * pin per job, coloured by duration. Pins are real buttons for keyboard and
 * screen-reader users.
 */
export default function JobsMap({ jobs }: { jobs: Job[] }) {
  const { t, lang } = useLang();
  const [sel, setSel] = useState<string | null>(jobs[0]?.id ?? null);
  const selected = jobs.find((j) => j.id === sel) ?? null;

  return (
    <div className="jobs-map-wrap">
      <div className="jobs-map" role="group" aria-label={t('Map of jobs around your naka', 'आपके नाके के आसपास कामों का नक़्शा')}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0H0V5" fill="none" stroke="var(--color-border)" strokeWidth="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="var(--color-surface-2)" />
          <rect width="100" height="100" fill="url(#map-grid)" />
          {/* Arabian Sea on the west */}
          <path d="M0 0H6C3 20 9 34 4 48C0 60 8 74 3 88L6 100H0Z" fill="color-mix(in srgb, var(--sky-400) 22%, transparent)" />
          {/* Thane creek on the east */}
          <path d="M100 40C94 52 97 66 92 78C89 88 94 96 92 100H100Z" fill="color-mix(in srgb, var(--sky-400) 18%, transparent)" />
          {/* main roads */}
          <g stroke="var(--color-border-strong)" strokeWidth="1.1" fill="none" strokeLinecap="round">
            <path d="M12 0C16 30 20 60 24 100" />
            <path d="M58 0C54 30 50 50 46 100" />
            <path d="M0 44C30 46 60 52 100 46" />
            <path d="M30 100C50 80 70 60 96 18" />
          </g>
          {/* local train line */}
          <path d="M40 0C38 30 42 60 36 100" stroke="var(--color-text-subtle)" strokeWidth="0.5" strokeDasharray="1.4 1" fill="none" />
          {/* distance rings */}
          {[10, 22, 36].map((r, i) => (
            <circle key={r} cx={HOME.x} cy={HOME.y} r={r} fill="none" stroke="var(--color-brand)" strokeOpacity={0.35 - i * 0.08} strokeWidth="0.35" strokeDasharray="1 1" />
          ))}
        </svg>

        {AREAS.map((a) => (
          <span key={a.n} className="map-area" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
            {lang === 'hi' ? a.h : a.n}
          </span>
        ))}
        <span className="map-ring-label" style={{ left: `${HOME.x + 7}%`, top: `${HOME.y - 7}%` }}>
          2 km
        </span>
        <span className="map-ring-label" style={{ left: `${HOME.x + 16}%`, top: `${HOME.y - 16}%` }}>
          5 km
        </span>

        <span className="map-home" style={{ left: `${HOME.x}%`, top: `${HOME.y}%` }}>
          <LocateFixed aria-hidden="true" />
          <span>
            <T en="Your naka" hi="आपका नाका" />
          </span>
        </span>

        {jobs.map((j) => {
          const risky = trustScore(j.flags, j.employer.verified) < 50;
          return (
            <button
              key={j.id}
              type="button"
              className={`map-pin pin-${j.duration}${risky ? ' is-risky' : ''}`}
              style={{ left: `${j.map.x}%`, top: `${j.map.y}%`, '--tile': `var(--trade-${j.trade})` } as React.CSSProperties}
              aria-pressed={sel === j.id}
              aria-label={`${lang === 'hi' ? j.title.hi : j.title.en}, ${rupee(j.pay.amount)}, ${j.distanceKm} km`}
              onClick={() => setSel(j.id)}
            >
              <TradeIcon trade={j.trade} />
              <span className="pin-pay">{rupee(j.pay.amount)}</span>
            </button>
          );
        })}

        <div className="map-legend" aria-hidden="true">
          <span className="chip chip-daily">
            <span className="dot" /> <T en="Today" hi="आज" />
          </span>
          <span className="chip chip-short">
            <span className="dot" /> <T en="Few days" hi="कुछ दिन" />
          </span>
          <span className="chip chip-long">
            <span className="dot" /> <T en="Months" hi="महीने" />
          </span>
        </div>
      </div>

      <div className="jobs-map-side" aria-live="polite">
        {selected ? (
          <JobCard key={selected.id} job={selected} />
        ) : (
          <p className="muted">
            <T en="Tap a pin to see the job." hi="काम देखने के लिए पिन दबाएँ।" />
          </p>
        )}
      </div>
    </div>
  );
}
