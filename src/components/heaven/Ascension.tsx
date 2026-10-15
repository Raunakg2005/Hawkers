'use client';

import type { ReactNode } from 'react';
import { T } from '@/components/T';
import { Corner } from './Ornament';
import { useScrollVar } from './useScrollVar';

const ACTS = 6;

/**
 * "Ascension": the home page story. You look up into painted Baroque ceilings
 * and rise through them: the Room of the Giants, through its oculus into
 * Tiepolo's sky, past a gilded oval into Correggio's dome of angels and up into
 * its light. One CSS variable (--s, 0 → 1) drives every layer; see heaven.css.
 */
export default function Ascension({ rail, children }: { rail: ReactNode; children: ReactNode }) {
  const ref = useScrollVar<HTMLDivElement>('--s', (el, p) => {
    const act = String(Math.round(p * (ACTS - 1)));
    if (el.dataset.act !== act) el.dataset.act = act;
  });

  return (
    <div ref={ref} className="asc" data-act="0">
      <div className="asc-stage" aria-hidden="true">
        {/* the frescoes, bottom to top */}
        <div className="fr fr-giants" />
        <div className="fr fr-apollo" />
        <div className="fr fr-merit" />
        <div className="fr fr-dome" />
        <div className="rays" />

        {/* the gilded vault you look up through in the opening */}
        <div className="vault" />
        <div className="vault-frame">
          <svg className="vault-ring" viewBox="0 0 400 520">
            <ellipse cx="200" cy="260" rx="186" ry="246" fill="none" stroke="url(#gold)" strokeWidth="10" />
            <ellipse cx="200" cy="260" rx="172" ry="232" fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.8" />
            <ellipse cx="200" cy="260" rx="198" ry="258" fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.6" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return <circle key={i} cx={(200 + Math.cos(a) * 186).toFixed(2)} cy={(260 + Math.sin(a) * 246).toFixed(2)} r="4.2" fill="url(#gold)" />;
            })}
          </svg>
        </div>

        {/* Act 2 · job medallions rising through the sky */}
        <div className="props props-jobs">
          {['₹900', '₹750', '₹1,100', '₹850', '₹1,000', '₹680'].map((p, i) => (
            <span key={p} className="medal" style={{ '--i': i } as React.CSSProperties}>
              <b>{p}</b>
              <small>
                <T en="a day" hi="रोज़" mr="रोज" gu="રોજ" />
              </small>
            </span>
          ))}
        </div>

        {/* Act 3 · the skill card, a gilded cartouche */}
        <div className="props props-card">
          <div className="scard">
            <Corner className="tl" />
            <Corner className="tr" />
            <Corner className="bl" />
            <Corner className="br" />
            <div className="scard-face">
              <span className="scard-seal">SJ</span>
              <div>
                <p className="scard-name">Suresh Jadhav</p>
                <p className="scard-trade">
                  <T en="Carpenter · 14 years" hi="बढ़ई · 14 साल" mr="सुतार · 14 वर्षे" gu="સુથાર · 14 વર્ષ" />
                </p>
                <p className="scard-stars">★★★★★ 4.8</p>
              </div>
            </div>
            <div className="scard-foot">
              <span className="scard-avail">
                <T en="Available today" hi="आज उपलब्ध" mr="आज उपलब्ध" gu="આજે ઉપલબ્ધ" />
              </span>
              <span className="scard-qr" />
            </div>
          </div>
        </div>

        {/* Act 4 · a false promise breaks, a shield of gold rises */}
        <div className="props props-trust">
          <div className="seal">
            <span className="seal-half l">
              <T en="Pay ₹500 fee first" hi="पहले ₹500 फ़ीस दो" mr="आधी ₹500 फी द्या" gu="પહેલાં ₹500 ફી આપો" />
            </span>
            <span className="seal-half r">
              <T en="Pay ₹500 fee first" hi="पहले ₹500 फ़ीस दो" mr="आधी ₹500 फी द्या" gu="પહેલાં ₹500 ફી આપો" />
            </span>
          </div>
          <svg className="shield" viewBox="0 0 120 140">
            <path d="M60 6 C80 16 98 18 112 18 V62 C112 98 90 122 60 134 C30 122 8 98 8 62 V18 C22 18 40 16 60 6 Z" fill="#14254f" stroke="url(#gold)" strokeWidth="6" />
            <path d="M60 18 C76 26 90 28 100 28 V62 C100 92 82 112 60 122 C38 112 20 92 20 62 V28 C30 28 44 26 60 18 Z" fill="none" stroke="url(#gold)" strokeWidth="1.5" opacity="0.8" />
            <path d="M38 70 L54 86 L84 54" fill="none" stroke="url(#gold)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Act 5 · a charter unrolls */}
        <div className="props props-scroll">
          <div className="charter">
            <span className="charter-rod top" />
            <div className="charter-paper">
              <p className="charter-head">
                <T en="Your entitlements" hi="आपके हक़" mr="तुमचे हक्क" gu="તમારા હક" />
              </p>
              <ul>
                <li>e-Shram</li>
                <li>PM-SYM</li>
                <li>PMSBY</li>
                <li>PM-JAY</li>
                <li>BOCW</li>
              </ul>
              <p className="charter-call">☎ 14434</p>
            </div>
            <span className="charter-rod bottom" />
          </div>
        </div>

        <div className="asc-scrim" />
      </div>
      {rail}
      <div className="asc-acts">{children}</div>
    </div>
  );
}
