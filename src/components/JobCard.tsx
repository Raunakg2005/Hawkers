import Link from 'next/link';
import { BadgeCheck, CalendarDays, Clock, MapPin, Star, UsersRound } from 'lucide-react';
import type { Job } from '@/data/types';
import { DURATIONS, PAID_WHEN, PAY_UNIT, PERKS, TRADE, rupee, trustScore } from '@/data/trades';
import { T, Tx } from './T';
import { TradeTile } from './TradeIcon';
import TrustBadge from './TrustBadge';
import ReadAloud from './ReadAloud';

export function jobSpeech(job: Job) {
  const pay = `${job.pay.amount} rupees ${job.pay.unit === 'day' ? 'per day' : job.pay.unit === 'month' ? 'per month' : 'for the full job'}`;
  const payHi = `${job.pay.amount} रुपये ${job.pay.unit === 'day' ? 'रोज़' : job.pay.unit === 'month' ? 'महीना' : 'पूरे काम के'}`;
  return {
    en: `${job.title.en}. ${pay}. ${PAID_WHEN[job.paidWhen].en}. At ${job.area.en}, ${job.distanceKm} kilometres away. Starts ${job.start.en}, from ${job.hours.start} to ${job.hours.end}.`,
    hi: `${job.title.hi}। ${payHi}। ${PAID_WHEN[job.paidWhen].hi}। ${job.area.hi}, ${job.distanceKm} किलोमीटर दूर। ${job.start.hi} शुरू, ${job.hours.start} से ${job.hours.end} तक।`,
  };
}

/**
 * The core unit of the product. Designed to be "read" in 3 seconds:
 * icon (what) → big rupee (how much) → place/time/day (where & when) → trust.
 * Uses a stretched link so the Listen button can sit inside without nesting
 * interactive elements.
 */
export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const score = trustScore(job.flags, job.employer.verified);
  const speech = jobSpeech(job);
  return (
    <article className={`job-card${score < 50 ? ' is-risky' : ''}`} data-reveal="" style={{ '--d': index % 3 } as React.CSSProperties}>
      <div className="job-card-top">
        <TradeTile trade={job.trade} />
        <div className="job-card-title">
          <span className={`chip chip-${job.duration}`}>
            <Tx l={DURATIONS[job.duration].hint} /> · <Tx l={job.length} />
          </span>
          <h3>
            <Link href={`/jobs/${job.id}`} className="stretched">
              <Tx l={job.title} />
            </Link>
          </h3>
          <p className="job-card-employer">
            {job.employer.name}
            {job.employer.verified ? (
              <BadgeCheck className="ok" aria-label="Verified" />
            ) : null}
            {job.employer.rating > 0 && (
              <span className="rating">
                <Star aria-hidden="true" /> {job.employer.rating}
              </span>
            )}
          </p>
        </div>
        <div className="job-card-listen">
          <ReadAloud en={speech.en} hi={speech.hi} />
        </div>
      </div>

      <div className="job-card-pay">
        <span className="money">{rupee(job.pay.amount)}</span>
        <span className="unit">
          <Tx l={PAY_UNIT[job.pay.unit]} />
        </span>
        <span className="when">
          <Tx l={PAID_WHEN[job.paidWhen]} />
        </span>
      </div>

      <ul className="job-card-facts">
        <li>
          <MapPin aria-hidden="true" />
          <span>
            <Tx l={job.area} />
            {job.distanceKm > 0 && <b> · {job.distanceKm} km</b>}
          </span>
        </li>
        <li>
          <Clock aria-hidden="true" />
          <span>
            {job.hours.start} – {job.hours.end}
          </span>
        </li>
        <li>
          <CalendarDays aria-hidden="true" />
          <span>
            <Tx l={job.start} />
          </span>
        </li>
        {job.workersNeeded > 1 && (
          <li>
            <UsersRound aria-hidden="true" />
            <span>
              {job.workersNeeded} <T en="people" hi="लोग" />
            </span>
          </li>
        )}
      </ul>

      <div className="job-card-foot">
        <TrustBadge score={score} compact />
        {job.perks.slice(0, 2).map((p) => (
          <span key={p} className="chip">
            <Tx l={PERKS[p]} />
          </span>
        ))}
        <span className="subtle posted">
          {job.postedHoursAgo < 24 ? (
            <T en={`${job.postedHoursAgo}h ago`} hi={`${job.postedHoursAgo} घंटे पहले`} />
          ) : (
            <T en="1 day ago" hi="1 दिन पहले" />
          )}
        </span>
      </div>
      <span className="sr-only">
        <Tx l={TRADE[job.trade].name} />
      </span>
    </article>
  );
}
