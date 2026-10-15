'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Handshake, Phone } from 'lucide-react';
import { T } from '@/components/T';
import { useLang } from '@/lib/prefs';
import s from './workers.module.css';

const KEY = 'naka-saved-workers';

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Call (through a masked relay number — neither side's real number is shown)
 * and Save for later. The saved list lives only on this device.
 */
export default function ProfileActions({ id, name, relay }: { id: string; name: string; relay: string }) {
  const { t } = useLang();
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState('');
  const first = name.split(' ')[0];

  useEffect(() => {
    setSaved(readSaved().includes(id));
  }, [id]);

  const toggle = () => {
    const list = readSaved();
    const next = saved ? list.filter((x) => x !== id) : [...new Set([...list, id])];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked — still reflect the choice for this visit */
    }
    setSaved(!saved);
    setNote(saved ? t(`${first} removed from saved workers`, `${first} को सेव सूची से हटाया`, `${first} यांना जतन यादीतून काढले`, `${first}ને સાચવેલી યાદીમાંથી કાઢ્યા`) : t(`${first} saved on this phone`, `${first} इस फ़ोन पर सेव हो गए`, `${first} या फोनवर जतन झाले`, `${first} આ ફોનમાં સચવાઈ ગયા`));
  };

  return (
    <div className={s.actions}>
      <a href="#hire" className={`btn btn-primary ${s.hireJump}`}>
        <Handshake aria-hidden="true" />
        <T en="Make an offer" hi="ऑफ़र दें" mr="ऑफर द्या" gu="ઑફર આપો" />
      </a>
      <a href={`tel:${relay.replace(/\s/g, '')}`} className="btn btn-accent" aria-label={t(`Call ${first} through Karigar’s private line`, `कारीगर की प्राइवेट लाइन से ${first} को कॉल करें`, `कारागीरच्या प्रायव्हेट लाइनवरून ${first} यांना फोन करा`, `કારીગરની પ્રાઇવેટ લાઇનથી ${first}ને ફોન કરો`)}>
        <Phone aria-hidden="true" />
        <T en="Call" hi="कॉल करें" mr="फोन करा" gu="ફોન કરો" />
      </a>
      <button type="button" className="btn" aria-pressed={saved} onClick={toggle}>
        {saved ? <BookmarkCheck aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
        {saved ? <T en="Saved" hi="सेव है" mr="जतन केले" gu="સાચવેલ છે" /> : <T en="Save worker" hi="कारीगर सेव करें" mr="कारागीर जतन करा" gu="કારીગર સાચવો" />}
      </button>
      <p className="sr-only" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
