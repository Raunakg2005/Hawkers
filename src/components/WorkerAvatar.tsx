import type { TradeId } from '@/data/types';

const SKIN = ['#8d5524', '#a8693a', '#c68642', '#7a4a26', '#b0794a'];

/**
 * Illustrated avatar (no real photos — privacy by default). Shirt colour is
 * the trade colour; builders get a hard hat, cooks a cap.
 */
export default function WorkerAvatar({ name, trade, hue, hair = 'short', size = 64 }: { name: string; trade: TradeId; hue: number; hair?: 'short' | 'long'; size?: number }) {
  const skin = SKIN[name.length % SKIN.length];
  // unique per name + size so two avatars of the same person on a page don't share a gradient id
  const gid = `bg-${name.replace(/\W/g, '')}-${size}`;
  const hat = trade === 'mason' || trade === 'labour' || trade === 'electrician' || trade === 'plumber';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="worker-avatar" role="img" aria-label={name}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 85% 82%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 40) % 360} 80% 66%)`} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${gid})`} />
      <path d="M10 64c2-13 11-19 22-19s20 6 22 19z" fill={`var(--trade-${trade})`} />
      <path d="M27 44h10v6a5 5 0 0 1-10 0z" fill={skin} />
      <ellipse cx="32" cy="31" rx="11" ry="12.5" fill={skin} />
      {hair === 'long' ? (
        <path d="M20.5 31c0-9 5-14.5 11.5-14.5S43.5 22 43.5 31c-1-5-4-8.5-11.5-9.5C25 22.5 22 26 20.5 31zM40 22c4 2 6 8 5 16l-3-1c1-6 0-11-2-15z" fill="#1c1410" />
      ) : (
        <path d="M21 29c0-8 4.5-12.5 11-12.5S43 21 43 29c-2.5-4-6-5.5-11-5.5S23.5 25 21 29z" fill="#1c1410" />
      )}
      {hat && (
        <g>
          <path d="M19 26a13 11 0 0 1 26 0z" fill="#ffc21a" />
          <rect x="16" y="24.5" width="32" height="4" rx="2" fill="#f0a500" />
          <rect x="30.5" y="15.5" width="3" height="9" rx="1.5" fill="#f0a500" />
        </g>
      )}
      {trade === 'cook' && <path d="M22 22c0-6 4-8 10-8s10 2 10 8l-1 3H23z" fill="#fff" />}
      <circle cx="28" cy="32" r="1.4" fill="#1c1410" />
      <circle cx="36" cy="32" r="1.4" fill="#1c1410" />
      <path d="M28.5 37.5q3.5 2.6 7 0" stroke="#1c1410" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
