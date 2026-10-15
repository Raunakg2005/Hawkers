/**
 * Gilded ornament, drawn as SVG so it stays crisp and themeable. The gold is a
 * shared gradient (defined once by <GoldDefs/> in the layout).
 */

export function GoldDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a5414" />
          <stop offset="0.22" stopColor="#c99a3a" />
          <stop offset="0.42" stopColor="#fbe7a9" />
          <stop offset="0.55" stopColor="#d9ac4c" />
          <stop offset="0.78" stopColor="#8f6619" />
          <stop offset="1" stopColor="#e9c56b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Rococo corner flourish (C-scroll, leaf and pearl). Rotate it for each corner. */
export function Corner({ className = '' }: { className?: string }) {
  return (
    <svg className={`orn-corner ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill="none" stroke="url(#gold)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 60 V22 C4 12 12 4 22 4 H60" />
        <path d="M10 60 V26 C10 17 17 10 26 10 H60" strokeWidth="1" opacity="0.8" />
        <path d="M22 4 C22 14 30 18 36 14 C41 11 38 4 32 6" />
        <path d="M4 22 C14 22 18 30 14 36 C11 41 4 38 6 32" />
        <path d="M18 18 C24 22 28 28 26 34" strokeWidth="1.4" />
      </g>
      <circle cx="18" cy="18" r="3.2" fill="url(#gold)" />
      <circle cx="44" cy="4" r="1.6" fill="url(#gold)" />
      <circle cx="4" cy="44" r="1.6" fill="url(#gold)" />
    </svg>
  );
}

/** A gilded frame: four corners around any content. */
export function Gilded({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'article' | 'section' | 'li' }) {
  return (
    <Tag className={`gilded ${className}`}>
      <Corner className="tl" />
      <Corner className="tr" />
      <Corner className="bl" />
      <Corner className="br" />
      {children}
    </Tag>
  );
}

/** Horizontal divider: rules with a central rosette. */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <svg className={`orn-divider ${className}`} viewBox="0 0 240 24" aria-hidden="true" focusable="false">
      <g fill="none" stroke="url(#gold)" strokeLinecap="round">
        <path d="M4 12 H92" strokeWidth="1.4" />
        <path d="M148 12 H236" strokeWidth="1.4" />
        <path d="M92 12 C100 4 108 4 112 12 C108 20 100 20 92 12 Z" strokeWidth="1.6" />
        <path d="M148 12 C140 4 132 4 128 12 C132 20 140 20 148 12 Z" strokeWidth="1.6" />
      </g>
      <circle cx="120" cy="12" r="5" fill="url(#gold)" />
      <circle cx="120" cy="12" r="2" fill="#fff7dc" />
    </svg>
  );
}
