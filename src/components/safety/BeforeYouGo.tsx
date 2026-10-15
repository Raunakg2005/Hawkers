'use client';

import { useState } from 'react';
import { Bus, Camera, Check, Contact, Handshake, MapPinned, PartyPopper, UsersRound, type LucideIcon } from 'lucide-react';
import type { L } from '@/data/types';
import { T, Tx } from '@/components/T';
import { useLang } from '@/lib/prefs';
import s from './safety-ui.module.css';

const ITEMS: { id: string; icon: LucideIcon; color: string; title: L; hint: L }[] = [
  {
    id: 'location',
    icon: MapPinned,
    color: 'var(--color-trust)',
    title: { en: 'Share your live location with family', hi: 'परिवार को अपनी लाइव लोकेशन भेजें' },
    hint: { en: 'In your chat app: Attach → Location → Share live location.', hi: 'चैट ऐप में: अटैच → लोकेशन → लाइव लोकेशन भेजें।' },
  },
  {
    id: 'photo',
    icon: Camera,
    color: 'var(--color-accent)',
    title: { en: 'Take a photo of the gate or name board', hi: 'गेट या नाम के बोर्ड की फ़ोटो लें' },
    hint: { en: 'It shows exactly where you worked — useful if pay is not given.', hi: 'इससे पता रहता है कि आपने कहाँ काम किया — पैसे न मिलें तो काम आता है।' },
  },
  {
    id: 'number',
    icon: Contact,
    color: 'var(--color-brand)',
    title: { en: 'Save the employer’s number', hi: 'मालिक का नंबर सेव करें' },
    hint: { en: 'Give the number to your family too.', hi: 'यह नंबर परिवार को भी दें।' },
  },
  {
    id: 'promise',
    icon: Handshake,
    color: 'var(--color-success)',
    title: { en: 'Agree pay & payday in writing', hi: 'मज़दूरी और भुगतान का दिन लिखित में तय करें' },
    hint: { en: 'Use the Naka Work Promise. A phone message also counts.', hi: 'नाका का “काम का वादा” इस्तेमाल करें। फ़ोन का मैसेज भी चलेगा।' },
  },
  {
    id: 'fare',
    icon: Bus,
    color: 'var(--trade-driver)',
    title: { en: 'Keep money for the way back', hi: 'वापसी के किराए के पैसे रखें' },
    hint: { en: 'So you can leave any time if something feels wrong.', hi: 'ताकि कुछ ग़लत लगे तो कभी भी लौट सकें।' },
  },
  {
    id: 'friend',
    icon: UsersRound,
    color: 'var(--trade-painter)',
    title: { en: 'Tell a friend at the naka where you are going', hi: 'नाके पर किसी दोस्त को बताएँ कि कहाँ जा रहे हैं' },
    hint: { en: 'Better still — go together for a new employer.', hi: 'और भी अच्छा — नए मालिक के यहाँ साथ जाएँ।' },
  },
];

/** A per-trip checklist — deliberately not saved, so it starts fresh for every job. */
export default function BeforeYouGo() {
  const { t } = useLang();
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const all = done.length === ITEMS.length;

  return (
    <div className={s.go}>
      <div className={s.goHead}>
        <p className={s.goCount} aria-live="polite">
          {all ? (
            <>
              <PartyPopper aria-hidden="true" />
              <T en="All done — go safely!" hi="सब हो गया — सुरक्षित जाएँ!" />
            </>
          ) : (
            <T en={`${done.length} of ${ITEMS.length} done`} hi={`${ITEMS.length} में से ${done.length} हो गया`} />
          )}
        </p>
        <div
          className="meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ITEMS.length}
          aria-valuenow={done.length}
          aria-label={t('Checklist progress', 'सूची की प्रगति')}
          style={{ '--meter': 'linear-gradient(90deg, var(--color-trust), var(--color-success))' } as React.CSSProperties}
        >
          <span style={{ transform: `scaleX(${done.length / ITEMS.length})` }} />
        </div>
      </div>
      <ul className={s.goList}>
        {ITEMS.map((it, i) => {
          const checked = done.includes(it.id);
          const tile = { '--tile': it.color } as React.CSSProperties;
          return (
            <li key={it.id} data-reveal="" style={{ '--d': i % 2 } as React.CSSProperties}>
              <label className={`${s.goItem}${checked ? ` ${s.goDone}` : ''}`}>
                <input type="checkbox" className={s.goInput} checked={checked} onChange={() => toggle(it.id)} />
                <span className={s.goBox} aria-hidden="true">
                  <Check />
                </span>
                <span className="icon-tile sm" style={tile}>
                  <it.icon aria-hidden="true" />
                </span>
                <span className={s.goText}>
                  <span className={s.goTitle}>
                    <Tx l={it.title} />
                  </span>
                  <span className={s.goHint}>
                    <Tx l={it.hint} />
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
