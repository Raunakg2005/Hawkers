'use client';

import type { ReactNode } from 'react';
import { land, range, useScrollFx } from './engine';

/**
 * Effect 4 · Falling blocks. Each word of the statement is a block that drops
 * from above as you scroll and lands with a bounce; when the last one lands,
 * the line gives a small thud.
 */
export default function BlockDrop({ children, after }: { children: ReactNode; after?: ReactNode }) {
  const ref = useScrollFx<HTMLDivElement>((p, el) => {
    const words = el.querySelectorAll<HTMLElement>('.bd-word');
    const n = words.length;
    words.forEach((w, i) => {
      // words fall in a scattered (not left-to-right) order
      const k = ((i * 7) % n) / n;
      const t = range(p, 0.12 + k * 0.3, 0.26 + k * 0.3);
      const y = (1 - land(t)) * -120;
      const r = (1 - t) * (i % 2 ? 14 : -12);
      w.style.transform = `translate3d(0, ${y}vh, 0) rotate(${r}deg)`;
      w.style.opacity = t > 0 ? '1' : '0';
    });
    const settle = range(p, 0.56, 0.62);
    const thud = settle > 0 && settle < 1 ? Math.sin(settle * Math.PI * 4) * (1 - settle) * 6 : 0;
    const line = el.querySelector<HTMLElement>('.bd-line');
    if (line) line.style.transform = `translate3d(0, ${thud}px, 0)`;
    el.style.setProperty('--bd', range(p, 0.55, 0.7).toFixed(3));
  });

  return (
    <section ref={ref} className="fx-drop">
      <div className="bd-inner">
        <h2 className="bd-line">{children}</h2>
        {after}
      </div>
    </section>
  );
}

/** Split a sentence into droppable word blocks; *word* is highlighted. */
export function DropWords({ t }: { t: string }) {
  return (
    <span aria-label={t.replace(/\*/g, '')}>
      {t.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 && ' '}
          <span className={w.startsWith('*') ? 'bd-word hot' : 'bd-word'}>{w.replace(/\*/g, '')}</span>
        </span>
      ))}
    </span>
  );
}
