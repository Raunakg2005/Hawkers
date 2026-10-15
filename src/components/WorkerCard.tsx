import Link from 'next/link';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import type { Worker } from '@/data/types';
import { PAY_UNIT, TRADE, rupee } from '@/data/trades';
import { T, Tx } from './T';
import WorkerAvatar from './WorkerAvatar';
import { TradeIcon } from './TradeIcon';

export default function WorkerCard({ worker: w, index = 0 }: { worker: Worker; index?: number }) {
  const checks = [w.verified.id, w.verified.eshram, w.verified.police].filter(Boolean).length;
  return (
    <article className="worker-card" data-reveal="" style={{ '--d': index % 3, '--tile': `var(--trade-${w.trade})` } as React.CSSProperties}>
      <div className="worker-card-head">
        <WorkerAvatar name={w.name} trade={w.trade} hue={w.hue} hair={w.hair} size={68} />
        <div>
          <h3>
            <Link href={`/workers/${w.id}`} className="stretched">
              {w.name}
            </Link>
          </h3>
          <p className="worker-trade">
            <TradeIcon trade={w.trade} size={16} />
            <Tx l={TRADE[w.trade].name} /> · {w.years} <T en="yrs" hi="साल" mr="वर्षे" gu="વર્ષ" />
          </p>
        </div>
        <span className={`chip ${w.availableToday ? 'chip-success' : ''}`}>
          {w.availableToday && <span className="dot dot-live" />}
          <Tx l={w.nextFree} />
        </span>
      </div>

      <div className="worker-card-stats">
        <div>
          <span className="money">{rupee(w.rate)}</span>
          <small>
            <Tx l={PAY_UNIT[w.rateUnit]} />
          </small>
        </div>
        <div>
          <span className="money">
            <Star aria-hidden="true" className="star" /> {w.rating}
          </span>
          <small>
            {w.jobsDone} <T en="jobs" hi="काम" mr="कामे" gu="કામ" />
          </small>
        </div>
        <div>
          <span className="money">{checks}/3</span>
          <small>
            <T en="checks" hi="जाँच" mr="तपासण्या" gu="ચકાસણી" />
          </small>
        </div>
      </div>

      <ul className="worker-skills">
        {w.skills.slice(0, 3).map((s) => (
          <li key={s.en} className="chip">
            <Tx l={s} />
          </li>
        ))}
      </ul>

      <p className="worker-foot subtle">
        <MapPin aria-hidden="true" /> <Tx l={w.area} /> · {w.distanceKm} km
        {w.verified.eshram && (
          <span className="chip chip-trust" style={{ marginLeft: 'auto' }}>
            <BadgeCheck aria-hidden="true" /> e-Shram
          </span>
        )}
      </p>
    </article>
  );
}
