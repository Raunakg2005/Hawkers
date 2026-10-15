/**
 * Static illustration under the WebGL canvas: what low-data / no-WebGL
 * visitors see, and what everyone sees for the first few hundred ms.
 * Colours are tokens, so it follows the theme too.
 */
export default function HeroPoster() {
  const people = [0, 1, 2, 3, 4, 5, 6];
  const colors = ['plumber', 'labour', 'electrician', 'painter', 'carpenter', 'cleaner', 'driver'];
  return (
    <svg className="hero-poster" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="hp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--scene-sky)" />
          <stop offset="1" stopColor="var(--scene-fog)" />
        </linearGradient>
        <radialGradient id="hp-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--marigold-300)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--marigold-300)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#hp-sky)" />
      <circle cx="1180" cy="430" r="260" fill="url(#hp-sun)" />
      <g fill="var(--scene-building-2)">
        {Array.from({ length: 22 }).map((_, i) => {
          const h = 140 + ((i * 97) % 260);
          return <rect key={i} x={i * 76 - 20} y={700 - h} width={64} height={h} rx={4} />;
        })}
      </g>
      <g fill="var(--scene-building)">
        {Array.from({ length: 14 }).map((_, i) => {
          const h = 90 + ((i * 53) % 170);
          return <rect key={i} x={i * 122 + 10} y={720 - h} width={96} height={h} rx={4} />;
        })}
      </g>
      <rect y="700" width="1600" height="200" fill="var(--scene-road)" />
      <rect y="690" width="1600" height="16" fill="var(--scene-ground)" />
      <g>
        {people.map((i) => (
          <g key={i} transform={`translate(${880 + i * 92} 600)`}>
            <ellipse cx="0" cy="100" rx="34" ry="8" fill="rgba(0,0,0,0.18)" />
            <rect x="-14" y="44" width="28" height="56" rx="12" fill="#2b2f45" />
            <rect x="-20" y="0" width="40" height="58" rx="18" fill={`var(--trade-${colors[i]})`} />
            <circle cx="0" cy="-16" r="15" fill="#a8693a" />
            <path d="M-17 -18a17 15 0 0 1 34 0z" fill="#ffc21a" />
          </g>
        ))}
      </g>
      <g stroke="var(--color-text-subtle)" strokeWidth="6" strokeLinecap="round">
        <line x1="1530" y1="700" x2="1530" y2="430" />
        <line x1="1530" y1="432" x2="1470" y2="432" />
      </g>
      <circle cx="1468" cy="440" r="9" fill="var(--marigold-300)" />
    </svg>
  );
}
