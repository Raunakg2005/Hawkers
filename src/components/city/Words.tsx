import { Fragment } from 'react';

/**
 * Splits a headline into masked words so they can fall into place one by one.
 * Wrap a word in *asterisks* to set it in the accent colour. Screen readers
 * get the plain sentence.
 */
export default function Words({ t }: { t: string }) {
  const plain = t.replace(/\*/g, '');
  return (
    <span data-words="" aria-label={plain}>
      {t.split(' ').map((word, i) => {
        const hot = word.startsWith('*');
        const w = word.replace(/\*/g, '');
        return (
          <Fragment key={i}>
            {i > 0 && ' '}
            <span className="wm" aria-hidden="true">
            <span className={hot ? 'w hot' : 'w'}>{w}</span>
          </span>
          </Fragment>
        );
      })}
    </span>
  );
}
