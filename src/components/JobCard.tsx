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
  const payMr = `${job.pay.amount} रुपये ${job.pay.unit === 'day' ? 'रोज' : job.pay.unit === 'month' ? 'महिना' : 'पूर्ण कामाचे'}`;
  const payGu = `${job.pay.amount} રૂપિયા ${job.pay.unit === 'day' ? 'રોજના' : job.pay.unit === 'month' ? 'મહિને' : 'આખા કામના'}`;
  return {
    en: `${job.title.en}. ${pay}. ${PAID_WHEN[job.paidWhen].en}. At ${job.area.en}, ${job.distanceKm} kilometres away. Starts ${job.start.en}, from ${job.hours.start} to ${job.hours.end}.`,
    hi: `${job.title.hi}। ${payHi}। ${PAID_WHEN[job.paidWhen].hi}। ${job.area.hi}, ${job.distanceKm} किलोमीटर दूर। ${job.start.hi} शुरू, ${job.hours.start} से ${job.hours.end} तक।`,
    mr: `${job.title.mr}. ${payMr}. ${PAID_WHEN[job.paidWhen].mr}. ${job.area.mr}, ${job.distanceKm} किलोमीटर दूर. सुरुवात ${job.start.mr}, ${job.hours.start} ते ${job.hours.end}.`,
    gu: `${job.title.gu}. ${payGu}. ${PAID_WHEN[job.paidWhen].gu}. ${job.area.gu}, ${job.distanceKm} કિલોમીટર દૂર. શરૂઆત ${job.start.gu}, ${job.hours.start} થી ${job.hours.end} સુધી.`,
  };
}

/**
 * The core unit of the product. Designed to be "read" in 3 seconds:
 * icon (what) → big rupee (how much) → place/time/day (where & when) → trust.
 * Uses a stretched link so the Listen button can sit inside without nesting
 * interactive elements.
 */
export default function JobCard({ job, index = 0, href }: { job: Job; index?: number; /** null = preview card with no link */ href?: string | null }) {
  const link = href === undefined ? `/jobs/${job.id}` : href;
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
            {link ? (
              <Link href={link} className="stretched">
                <Tx l={job.title} />
              </Link>
            ) : (
              <Tx l={job.title} />
            )}
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
          <ReadAloud en={speech.en} hi={speech.hi} mr={speech.mr} gu={speech.gu} />
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
            {job.hours.start}, {job.hours.end}
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
              {job.workersNeeded} <T en="people" hi="लोग" mr="लोक" gu="લોકો" />
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
          {job.postedHoursAgo < 1 ? (
            <T en="Just now" hi="अभी" mr="आत्ताच" gu="હમણાં જ" />
          ) : job.postedHoursAgo < 24 ? (
            <T en={`${job.postedHoursAgo}h ago`} hi={`${job.postedHoursAgo} घंटे पहले`} mr={`${job.postedHoursAgo} तासांपूर्वी`} gu={`${job.postedHoursAgo} કલાક પહેલાં`} />
          ) : (
            <T en="1 day ago" hi="1 दिन पहले" mr="1 दिवसापूर्वी" gu="1 દિવસ પહેલાં" />
          )}
        </span>
      </div>
      <span className="sr-only">
        <Tx l={TRADE[job.trade].name} />
      </span>
    </article>
  );
}
