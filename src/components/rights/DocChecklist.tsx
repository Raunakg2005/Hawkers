'use client';

import { useEffect, useState } from 'react';
import { Check, FolderCheck, PartyPopper, RotateCcw } from 'lucide-react';
import { DOCS, SCHEMES } from '@/data/schemes';
import { T, Tx } from '@/components/T';
import { useLang } from '@/lib/prefs';
import { DOC_ICON } from './meta';
import s from './rights-ui.module.css';

const KEY = 'naka-docs';
const DOC_IDS = Object.keys(DOCS);

/** "Which papers do I already have?" — saved only on this phone. */
export default function DocChecklist() {
  const { t } = useLang();
  const [have, setHave] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setHave(parsed.filter((k): k is string => typeof k === 'string' && k in DOCS));
    } catch {
      /* storage blocked or corrupt — start empty */
    }
  }, []);

  const save = (next: string[]) => {
    setHave(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* not saved — still works for this visit */
    }
  };
  const toggle = (id: string) => save(have.includes(id) ? have.filter((k) => k !== id) : [...have, id]);

  const ready = SCHEMES.filter((sc) => sc.docs.every((d) => have.includes(d)));
  const pct = have.length / DOC_IDS.length;
  const all = have.length === DOC_IDS.length;

  return (
    <div className={s.docs}>
      <aside className={s.docSummary} data-reveal="left">
        <div className={s.docScore}>
          <span className="icon-tile lg" style={{ '--tile': 'var(--color-trust)' } as React.CSSProperties}>
            {all ? <PartyPopper aria-hidden="true" /> : <FolderCheck aria-hidden="true" />}
          </span>
          <p aria-live="polite">
            <span className={`money ${s.docBig}`}>
              {have.length}
              <small>/{DOC_IDS.length}</small>
            </span>
            <span className={s.docBigLabel}>
              <T en="papers ready" hi="कागज़ तैयार" mr="कागदपत्रे तयार" gu="દસ્તાવેજ તૈયાર" />
            </span>
          </p>
        </div>
        <div
          className="meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={DOC_IDS.length}
          aria-valuenow={have.length}
          aria-label={t('Papers ready', 'तैयार कागज़', 'तयार कागदपत्रे', 'તૈયાર દસ્તાવેજ')}
          style={{ '--meter': 'linear-gradient(90deg, var(--color-trust), var(--color-success))' } as React.CSSProperties}
        >
          <span style={{ transform: `scaleX(${pct})` }} />
        </div>

        <div className={s.readyFor}>
          <p className={s.blockTitle}>
            <T en="With these papers you can apply for" hi="इन कागज़ों से आप आवेदन कर सकते हैं" mr="या कागदपत्रांवर तुम्ही अर्ज करू शकता" gu="આ દસ્તાવેજોથી તમે અરજી કરી શકો છો" />
          </p>
          {ready.length ? (
            <ul className={s.likelyChips}>
              {ready.map((sc) => (
                <li key={sc.id}>
                  <a href={`#${sc.id}`} className="chip chip-success">
                    <Check aria-hidden="true" />
                    {sc.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="subtle">
              <T en="Tick the papers you already have. We will show which schemes you are ready for." hi="जो कागज़ आपके पास हैं उन पर निशान लगाएँ। हम बताएँगे कि आप किन योजनाओं के लिए तैयार हैं।" mr="तुमच्याकडे असलेल्या कागदपत्रांवर खूण करा. तुम्ही कोणत्या योजनांसाठी तयार आहात ते आम्ही दाखवू." gu="તમારી પાસે હોય તે દસ્તાવેજ પર ટિક કરો. તમે કઈ યોજનાઓ માટે તૈયાર છો તે અમે બતાવીશું." />
            </p>
          )}
        </div>

        <p className="subtle">
          <T en="Saved only on this phone. Nobody else can see it." hi="सिर्फ़ इसी फ़ोन में सेव होता है। कोई और नहीं देख सकता।" mr="फक्त याच फोनमध्ये सेव्ह होते. दुसरे कोणी पाहू शकत नाही." gu="ફક્ત આ જ ફોનમાં સેવ થાય છે. બીજું કોઈ જોઈ શકતું નથી." />
        </p>
        {have.length > 0 && (
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => save([])}>
            <RotateCcw aria-hidden="true" />
            <T en="Clear ticks" hi="निशान हटाएँ" mr="खुणा काढा" gu="ટિક હટાવો" />
          </button>
        )}
      </aside>

      <ul className={s.docList}>
        {DOC_IDS.map((id, i) => {
          const doc = DOCS[id];
          const Icon = DOC_ICON[id];
          const usedBy = SCHEMES.filter((sc) => sc.docs.includes(id));
          const checked = have.includes(id);
          return (
            <li key={id} data-reveal="" style={{ '--d': i % 2 } as React.CSSProperties}>
              <label className={`${s.docItem}${checked ? ` ${s.docHave}` : ''}`}>
                <input type="checkbox" className={s.docInput} checked={checked} onChange={() => toggle(id)} />
                <span className={s.docBox} aria-hidden="true">
                  <Check />
                </span>
                {Icon && (
                  <span className="icon-tile sm" style={{ '--tile': 'var(--color-trust)' } as React.CSSProperties}>
                    <Icon aria-hidden="true" />
                  </span>
                )}
                <span className={s.docText}>
                  <span className={s.docName}>
                    <Tx l={doc.name} />
                    {checked && (
                      <span className={`chip chip-success ${s.docHaveChip}`}>
                        <T en="I have it" hi="मेरे पास है" mr="माझ्याकडे आहे" gu="મારી પાસે છે" />
                      </span>
                    )}
                  </span>
                  <span className={s.docTip}>
                    <Tx l={doc.tip} />
                  </span>
                  <span className={s.docUsed}>
                    <T en={`Needed for ${usedBy.length}:`} hi={`${usedBy.length} योजनाओं में ज़रूरी:`} /> {usedBy.map((sc) => sc.name).join(' · ')}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
