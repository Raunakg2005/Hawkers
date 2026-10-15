'use client';

import { Camera, ImagePlus, X } from 'lucide-react';
import { T } from '@/components/T';
import { useLang } from '@/lib/prefs';
import { PHOTO_SLOTS } from './profile-data';
import s from './profile.module.css';

/**
 * Three "add a work photo" slots. Opens the back camera on phones. Images stay
 * in memory only (privacy + storage limits); the profile just keeps a count.
 */
export default function PhotoSlots({
  urls,
  count,
  onAdd,
  onRemove,
}: {
  urls: (string | null)[];
  count: number;
  onAdd: (slot: number, file: File) => void;
  onRemove: (slot: number) => void;
}) {
  const { t } = useLang();
  return (
    <ul className={s.photos}>
      {Array.from({ length: PHOTO_SLOTS }, (_, i) => {
        const url = urls[i] ?? null;
        const savedOnly = !url && i < count;
        const id = `work-photo-${i}`;
        if (url || savedOnly) {
          return (
            <li key={i} className={s.photo}>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={t(`Work photo ${i + 1}`, `काम की फ़ोटो ${i + 1}`)} />
              ) : (
                <span className={s.photoSaved}>
                  <Camera aria-hidden="true" />
                  <T en={`Photo ${i + 1} added`} hi={`फ़ोटो ${i + 1} जुड़ी`} />
                </span>
              )}
              <button type="button" className={s.photoRemove} onClick={() => onRemove(i)} aria-label={t(`Remove photo ${i + 1}`, `फ़ोटो ${i + 1} हटाएँ`)}>
                <X aria-hidden="true" />
              </button>
            </li>
          );
        }
        return (
          <li key={i} className={s.photo}>
            <input
              id={id}
              type="file"
              accept="image/*"
              capture="environment"
              className={`sr-only ${s.photoInput}`}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onAdd(i, f);
                e.target.value = '';
              }}
            />
            <label htmlFor={id} className={s.photoAdd}>
              <ImagePlus aria-hidden="true" />
              <span>
                <T en="Add work photo" hi="काम की फ़ोटो जोड़ें" />
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
