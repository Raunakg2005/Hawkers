import { CircleAlert, CircleCheck, ThumbsUp, TriangleAlert } from 'lucide-react';
import type { TradeId } from '@/data/types';
import { TRADE, rupee } from '@/data/trades';
import { T, Tx } from '@/components/T';
import s from './workers.module.css';

export type FairStatus = 'below' | 'fair' | 'above' | 'extreme';

/** Where a day-rate sits against the trade's indicative fair band. */
export function fairStatus(trade: TradeId, perDay: number): FairStatus {
  const [lo, hi] = TRADE[trade].fair;
  if (perDay < lo) return 'below';
  if (perDay > hi * 2) return 'extreme';
  if (perDay > hi) return 'above';
  return 'fair';
}

const STATUS = {
  below: { cls: 'chip-danger', Icon: TriangleAlert, en: 'Below fair pay', hi: 'सही मज़दूरी से कम' },
  fair: { cls: 'chip-success', Icon: CircleCheck, en: 'Fair pay', hi: 'सही मज़दूरी' },
  above: { cls: 'chip-trust', Icon: ThumbsUp, en: 'Generous pay', hi: 'बढ़िया मज़दूरी' },
  extreme: { cls: 'chip-warning', Icon: CircleAlert, en: 'Unusually high', hi: 'असामान्य रूप से ज़्यादा' },
} as const;

export function FairChip({ status }: { status: FairStatus }) {
  const st = STATUS[status];
  return (
    <span className={`chip ${st.cls}`}>
      <st.Icon aria-hidden="true" />
      <T en={st.en} hi={st.hi} />
    </span>
  );
}

/**
 * A ruler showing the fair band for a trade (green zone) and a marker for the
 * offered / asked day-rate. Status is always shown as icon + word + colour.
 * Pure render — works in server and client components.
 */
export default function FairBand({ trade, perDay, approx = false, compact = false }: { trade: TradeId; perDay: number; approx?: boolean; compact?: boolean }) {
  const [fLo, fHi] = TRADE[trade].fair;
  const lo = Math.round(fLo * 0.6);
  const hi = Math.round(fHi * 1.5);
  const pct = (v: number) => Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
  const status = fairStatus(trade, perDay);
  const value = Math.round(perDay);

  return (
    <div className={`${s.fair} ${compact ? s.fairCompact : ''}`} data-status={status}>
      <div className={s.fairHead}>
        <FairChip status={status} />
        <span className="subtle">
          <T en="Fair band for" hi="सही दाम —" /> <Tx l={TRADE[trade].name} />:{' '}
          <b className={s.fairRange}>
            {rupee(fLo)}–{rupee(fHi)}
          </b>{' '}
          <T en="/ day" hi="/ दिन" />
        </span>
      </div>
      <div
        className={s.fairTrack}
        role="img"
        aria-label={`${approx ? '≈ ' : ''}${rupee(value)} / day. Fair band ${rupee(fLo)} to ${rupee(fHi)}.`}
        style={{ '--f0': pct(fLo), '--f1': pct(fHi), '--x': pct(perDay) } as React.CSSProperties}
      >
        <span className={s.fairZone} aria-hidden="true" />
        <span className={s.fairMarker} aria-hidden="true">
          <span className={s.fairBubble}>
            {approx ? '≈ ' : ''}
            {rupee(value)}
          </span>
        </span>
      </div>
      <div className={s.fairScale} aria-hidden="true">
        <span>
          <T en="Low" hi="कम" />
        </span>
        <span>
          <T en="Fair" hi="सही" />
        </span>
        <span>
          <T en="High" hi="ज़्यादा" />
        </span>
      </div>
    </div>
  );
}
