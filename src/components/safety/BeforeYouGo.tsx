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
    title: { en: 'Share your live location with family', hi: 'परिवार को अपनी लाइव लोकेशन भेजें', mr: 'कुटुंबाला तुमचे लाइव्ह लोकेशन पाठवा', gu: 'પરિવારને તમારું લાઇવ લોકેશન મોકલો' },
    hint: { en: 'In your chat app: Attach → Location → Share live location.', hi: 'चैट ऐप में: अटैच → लोकेशन → लाइव लोकेशन भेजें।', mr: 'चॅट ॲपमध्ये: अटॅच → लोकेशन → लाइव्ह लोकेशन पाठवा.', gu: 'ચૅટ ઍપમાં: અટૅચ → લોકેશન → લાઇવ લોકેશન મોકલો.' },
  },
  {
    id: 'photo',
    icon: Camera,
    color: 'var(--color-accent)',
    title: { en: 'Take a photo of the gate or name board', hi: 'गेट या नाम के बोर्ड की फ़ोटो लें', mr: 'गेटचा किंवा नावाच्या पाटीचा फोटो काढा', gu: 'ગેટ કે નામના બોર્ડનો ફોટો પાડો' },
    hint: { en: 'It shows exactly where you worked — useful if pay is not given.', hi: 'इससे पता रहता है कि आपने कहाँ काम किया — पैसे न मिलें तो काम आता है।', mr: 'तुम्ही नेमके कुठे काम केले ते यातून कळते — पैसे मिळाले नाहीत तर उपयोगी पडते.', gu: 'તમે ક્યાં કામ કર્યું તે આનાથી ખબર પડે છે — પૈસા ન મળે તો કામ આવે છે.' },
  },
  {
    id: 'number',
    icon: Contact,
    color: 'var(--color-brand)',
    title: { en: 'Save the employer’s number', hi: 'मालिक का नंबर सेव करें', mr: 'मालकाचा नंबर सेव्ह करा', gu: 'માલિકનો નંબર સેવ કરો' },
    hint: { en: 'Give the number to your family too.', hi: 'यह नंबर परिवार को भी दें।', mr: 'हा नंबर कुटुंबालाही द्या.', gu: 'આ નંબર પરિવારને પણ આપો.' },
  },
  {
    id: 'promise',
    icon: Handshake,
    color: 'var(--color-success)',
    title: { en: 'Agree pay & payday in writing', hi: 'मज़दूरी और भुगतान का दिन लिखित में तय करें', mr: 'मजुरी आणि पैसे मिळण्याचा दिवस लेखी ठरवा', gu: 'મજૂરી અને પૈસા મળવાનો દિવસ લખીને નક્કી કરો' },
    hint: { en: 'Use the Naka Work Promise. A phone message also counts.', hi: 'नाका का “काम का वादा” इस्तेमाल करें। फ़ोन का मैसेज भी चलेगा।', mr: 'नाकाचे “कामाचे वचन” वापरा. फोनवरचा मेसेजही चालेल.', gu: 'નાકાનું “કામનું વચન” વાપરો. ફોનનો મેસેજ પણ ચાલશે.' },
  },
  {
    id: 'fare',
    icon: Bus,
    color: 'var(--trade-driver)',
    title: { en: 'Keep money for the way back', hi: 'वापसी के किराए के पैसे रखें', mr: 'परत येण्याच्या भाड्याचे पैसे जवळ ठेवा', gu: 'પાછા આવવાના ભાડાના પૈસા સાથે રાખો' },
    hint: { en: 'So you can leave any time if something feels wrong.', hi: 'ताकि कुछ ग़लत लगे तो कभी भी लौट सकें।', mr: 'म्हणजे काही चुकीचे वाटले तर कधीही परत येता येईल.', gu: 'જેથી કંઈ ખોટું લાગે તો ગમે ત્યારે પાછા આવી શકો.' },
  },
  {
    id: 'friend',
    icon: UsersRound,
    color: 'var(--trade-painter)',
    title: { en: 'Tell a friend at the naka where you are going', hi: 'नाके पर किसी दोस्त को बताएँ कि कहाँ जा रहे हैं', mr: 'तुम्ही कुठे जात आहात ते नाक्यावरच्या एखाद्या मित्राला सांगा', gu: 'તમે ક્યાં જાઓ છો તે નાકા પરના કોઈ મિત્રને કહો' },
    hint: { en: 'Better still — go together for a new employer.', hi: 'और भी अच्छा — नए मालिक के यहाँ साथ जाएँ।', mr: 'आणखी चांगले — नव्या मालकाकडे सोबत जा.', gu: 'હજી સારું — નવા માલિકને ત્યાં સાથે જાઓ.' },
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
              <T en="All done — go safely!" hi="सब हो गया — सुरक्षित जाएँ!" mr="सगळे झाले — सुरक्षित जा!" gu="બધું થઈ ગયું — સંભાળીને જજો!" />
            </>
          ) : (
            <T
              en={`${done.length} of ${ITEMS.length} done`}
              hi={`${ITEMS.length} में से ${done.length} हो गया`}
              mr={`${ITEMS.length} पैकी ${done.length} झाले`}
              gu={`${ITEMS.length}માંથી ${done.length} થઈ ગયું`}
            />
          )}
        </p>
        <div
          className="meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ITEMS.length}
          aria-valuenow={done.length}
          aria-label={t('Checklist progress', 'सूची की प्रगति', 'यादीची प्रगती', 'યાદીની પ્રગતિ')}
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
