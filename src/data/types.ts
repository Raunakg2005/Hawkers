export type Lang = 'en' | 'hi';

/** A bilingual string. */
export type L = { en: string; hi: string };

export type TradeId =
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'painter'
  | 'mason'
  | 'cleaner'
  | 'labour'
  | 'driver'
  | 'cook'
  | 'gardener';

/** How long the work lasts — the single most important filter for irregular work. */
export type Duration = 'daily' | 'short' | 'long';

export type PayUnit = 'day' | 'job' | 'month' | 'hour';
export type PaidWhen = 'same-day' | 'weekly' | 'on-completion' | 'monthly';
export type PayMode = 'cash' | 'upi' | 'bank';
export type Perk = 'food' | 'tea' | 'tools' | 'travel' | 'safety' | 'stay';

/** Things that make a listing look risky. Computed into a trust score. */
export type RiskFlag = 'advance-fee' | 'no-address' | 'pay-too-high' | 'unverified' | 'vague' | 'id-upfront' | 'far-travel';

export interface Employer {
  name: string;
  kind: L;
  verified: boolean;
  rating: number;
  reviews: number;
  hires: number;
  since: number;
  phone: string;
}

export interface Job {
  id: string;
  title: L;
  trade: TradeId;
  duration: Duration;
  /** e.g. "1 day", "4 days", "6 months" */
  length: L;
  employer: Employer;
  area: L;
  city: string;
  landmark: L;
  distanceKm: number;
  /** position on the illustrated map, 0–100 */
  map: { x: number; y: number };
  pay: { amount: number; unit: PayUnit };
  paidWhen: PaidWhen;
  payMode: PayMode[];
  hours: { start: string; end: string };
  start: L;
  perks: Perk[];
  workersNeeded: number;
  description: L;
  bring: L[];
  postedHoursAgo: number;
  flags: RiskFlag[];
}

export interface Endorsement {
  by: string;
  role: L;
  text: L;
  when: string;
  rating: number;
}

export interface Worker {
  id: string;
  name: string;
  trade: TradeId;
  otherTrades: TradeId[];
  years: number;
  area: L;
  distanceKm: number;
  rate: number;
  rateUnit: PayUnit;
  availableToday: boolean;
  nextFree: L;
  languages: string[];
  rating: number;
  jobsDone: number;
  verified: { id: boolean; eshram: boolean; police: boolean };
  skills: L[];
  intro: L;
  endorsements: Endorsement[];
  works: { title: L; hue: number }[];
  hue: number;
  /** avatar illustration only */
  hair?: 'short' | 'long';
}

export type SchemeNeed = 'id' | 'health' | 'insurance' | 'pension' | 'loan' | 'housing' | 'food' | 'family';

export interface Scheme {
  id: string;
  name: string;
  short: L;
  needs: SchemeNeed[];
  benefit: L;
  who: L;
  cost: L;
  docs: string[];
  how: L[];
  where: L;
  helpline?: string;
  site: string;
}
