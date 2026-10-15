import { Phone, PhoneCall } from 'lucide-react';
import { HELPLINES } from '@/data/schemes';
import { T, Tx } from '@/components/T';
import { HELPLINE_META, telHref } from './meta';
import s from './rights-ui.module.css';

/**
 * Big tap-to-call cards. The whole card is the link, the number is the
 * biggest thing on it — recognisable even for someone who cannot read.
 * `compact` renders a horizontal strip (used on the safety page).
 */
export default function HelplineGrid({ compact = false, only }: { compact?: boolean; only?: string[] }) {
  const list = only ? HELPLINES.filter((h) => only.includes(h.number)) : HELPLINES;
  return (
    <ul className={compact ? s.helpStrip : s.helpGrid}>
      {list.map((h, i) => {
        const meta = HELPLINE_META[h.number];
        const Icon = meta?.icon ?? Phone;
        const tile = { '--tile': meta?.color ?? 'var(--color-brand)' } as React.CSSProperties;
        return (
          <li key={h.number} data-reveal="" style={{ '--d': i % 3 } as React.CSSProperties}>
            <a href={telHref(h.number)} className={s.helpCard} style={tile}>
              <span className="icon-tile" style={tile}>
                <Icon aria-hidden="true" />
              </span>
              <span className={s.helpText}>
                <span className={s.helpName}>
                  <Tx l={h.name} />
                </span>
                <span className={s.helpWhat}>
                  <Tx l={h.what} />
                </span>
              </span>
              <span className={s.helpNumber}>
                <span className="money">{h.number}</span>
                <span className={s.helpCall}>
                  <PhoneCall aria-hidden="true" />
                  <T en="Call free" hi="मुफ़्त कॉल" />
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
