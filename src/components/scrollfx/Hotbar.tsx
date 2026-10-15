'use client';

import { useRef, type ReactNode } from 'react';
import { easeOut, range, useScrollFx } from './engine';

/**
 * Effect 2 · Inventory hotbar. A pinned section: scrolling down slides a row
 * of item slots sideways, the slot under the selector pops up and its details
 * swap in below, like scrolling a game hotbar with the mouse wheel.
 */
export default function Hotbar({ head, slots, details }: { head: ReactNode; slots: ReactNode[]; details: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const last = useRef(-1);

  const ref = useScrollFx<HTMLDivElement>(
    (p, el) => {
      const t = track.current;
      if (!t) return;
      const n = slots.length;
      const q = range(p, 0.08, 0.92);
      const f = q * (n - 1);
      const active = Math.round(f);
      const slot = t.firstElementChild as HTMLElement | null;
      const size = slot ? slot.offsetWidth : 108;
      const step = size + 14;
      // keep the active slot centred under the selector
      t.style.transform = `translate3d(${-f * step - size / 2}px,0,0)`;
      Array.from(t.children).forEach((c, i) => {
        const d = Math.abs(i - f);
        const lift = easeOut(Math.max(0, 1 - d));
        (c as HTMLElement).style.transform = `translateY(${-lift * 18}px) scale(${1 + lift * 0.22})`;
        (c as HTMLElement).style.opacity = String(Math.max(0.35, 1 - d * 0.22));
      });
      if (active !== last.current) {
        last.current = active;
        el.dataset.active = String(active);
        el.querySelectorAll<HTMLElement>('.hb-detail').forEach((d, i) => {
          d.dataset.on = i === active ? 'true' : 'false';
        });
      }
      el.style.setProperty('--hb', q.toFixed(4));
    },
    { mode: 'pin' },
  );

  return (
    <section ref={ref} className="fx-hotbar" style={{ '--n': slots.length } as React.CSSProperties}>
      <div className="hb-stage">
        <div className="hb-head">{head}</div>
        <div className="hb-rail">
          <div className="hb-selector" aria-hidden="true" />
          <div ref={track} className="hb-track">
            {slots.map((s, i) => (
              <div key={i} className="hb-slot">
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="hb-details" aria-live="polite">
          {details.map((d, i) => (
            <div key={i} className="hb-detail" data-on={i === 0 ? 'true' : 'false'}>
              {d}
            </div>
          ))}
        </div>
        <div className="hb-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
