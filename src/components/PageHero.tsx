import type { ReactNode } from 'react';

/** Shared hero for inner pages. `tint` sets the glow colour (any CSS colour / token). */
export default function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  children,
  tint,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  tint?: string;
}) {
  return (
    <section className="page-hero" style={tint ? ({ '--hero-tint': tint } as React.CSSProperties) : undefined}>
      <div className={`container page-hero-grid${aside ? ' has-aside' : ''}`}>
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children && <div style={{ marginTop: 'var(--space-6)' }}>{children}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}
