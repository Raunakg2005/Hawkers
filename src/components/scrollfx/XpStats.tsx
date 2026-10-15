'use client';

import type { ReactNode } from 'react';
import { range, useScrollFx } from './engine';

/**
 * Effect 3 · XP level-up. As the section scrolls through, an XP bar fills and
 * each stat counts up in turn; when one completes it "levels up" with a burst
 * of pixel sparks.
 */
export default function XpStats({ head, stats }: { head: ReactNode; stats: { value: number; label: ReactNode; prefix?: string; suffix?: string }[] }) {
  const ref = useScrollFx<HTMLDivElement>((p, el) => {
    const q = range(p, 0.1, 0.42);
    el.style.setProperty('--xp', q.toFixed(4));
    const n = stats.length;
    el.querySelectorAll<HTMLElement>('.xp-stat').forEach((card, i) => {
      const local = range(q, i / n, (i + 1) / n);
      const v = Math.round(stats[i].value * local);
      const num = card.querySelector<HTMLElement>('.xp-num');
      if (num && num.dataset.v !== String(v)) {
        num.dataset.v = String(v);
        num.textContent = `${stats[i].prefix ?? ''}${v.toLocaleString('en-IN')}${stats[i].suffix ?? ''}`;
      }
      const done = local >= 1;
      if ((card.dataset.lvl === 'true') !== done) card.dataset.lvl = done ? 'true' : 'false';
    });
    const level = Math.min(n, Math.floor(q * n + 0.0001));
    const lv = el.querySelector<HTMLElement>('.xp-level');
    if (lv && lv.dataset.v !== String(level)) {
      lv.dataset.v = String(level);
      lv.textContent = String(level);
    }
  });

  return (
    <section ref={ref} className="fx-xp">
      <div className="xp-inner">
        {head}
        <div className="xp-bar" aria-hidden="true">
          <span className="xp-badge">
            <span className="xp-level">0</span>
          </span>
          <span className="xp-fill" />
        </div>
        <ul className="xp-grid">
          {stats.map((s, i) => (
            <li key={i} className="xp-stat" data-lvl="false">
              <span className="xp-num" aria-hidden="true">
                {s.prefix ?? ''}0{s.suffix ?? ''}
              </span>
              <span className="sr-only">
                {s.prefix ?? ''}
                {s.value}
                {s.suffix ?? ''}
              </span>
              <span className="xp-label">{s.label}</span>
              <span className="xp-sparks" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
