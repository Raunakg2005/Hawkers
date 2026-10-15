'use client';

import { useMemo } from 'react';
import { qrMatrix } from './profile-data';

/**
 * Decorative QR-style code generated from the profile (no dependency, not
 * scannable). Rendered as a single SVG path so it stays crisp when printed.
 */
export default function DemoQR({ seed, size = 25, className, label }: { seed: string; size?: number; className?: string; label: string }) {
  const d = useMemo(() => {
    const m = qrMatrix(seed, size);
    let path = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) if (m[r][c]) path += `M${c} ${r}h1v1h-1z`;
    }
    return path;
  }, [seed, size]);

  return (
    <svg className={className} viewBox={`-2 -2 ${size + 4} ${size + 4}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={size + 4} height={size + 4} rx="2" fill="var(--paper-0)" />
      <path d={d} fill="var(--ink-900)" />
    </svg>
  );
}
