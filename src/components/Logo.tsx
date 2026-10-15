/** Karigar mark: rising sun of opportunity over an interlocking craftsman trowel and wrench emblem. */
export default function Logo({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="karigar-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--marigold-300, #ffbd4d)" />
          <stop offset="100%" stopColor="var(--marigold-600, #d96a02)" />
        </linearGradient>
        <linearGradient id="karigar-subtle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--marigold-400, #f58a07)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--marigold-600, #d96a02)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Sun disk aura */}
      <circle cx="24" cy="22" r="14" fill="url(#karigar-subtle)" />

      {/* Radiant sunbeams */}
      <path
        d="M24 3v3.5M13.5 7.5l2.2 2.8M34.5 7.5l-2.2 2.8M6 16.5l3.5 1.2M42 16.5l-3.5 1.2M4 27h3.8M44 27h-3.8"
        stroke="url(#karigar-g)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Trowel (Artisan / Mason blade pointing upward) */}
      <path
        d="M24 7.5L34 22H14L24 7.5z"
        fill="url(#karigar-g)"
      />

      {/* Center spine / handle connector */}
      <path
        d="M24 16v9"
        stroke="var(--color-bg, #0d0f1a)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Interlocking wrench / gear ring (Mechanic, Electrician, Plumber) */}
      <circle
        cx="24"
        cy="33"
        r="8"
        fill="none"
        stroke="url(#karigar-g)"
        strokeWidth="3.2"
      />
      <circle
        cx="24"
        cy="33"
        r="3.2"
        fill="url(#karigar-g)"
      />

      {/* Wrench jaw accent on right side */}
      <path
        d="M32 30h3.5a2.5 2.5 0 0 1 0 5H32"
        stroke="url(#karigar-g)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Foundation base bar */}
      <path
        d="M12 43h24"
        stroke="url(#karigar-g)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
