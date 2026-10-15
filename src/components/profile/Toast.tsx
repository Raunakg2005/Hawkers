'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CircleCheck } from 'lucide-react';

export interface ToastMsg {
  id: number;
  text: ReactNode;
  action?: { label: ReactNode; run: () => void };
}

/**
 * Small confirmation pill (uses the global .toast style). Rendered into
 * <body> so page transforms can't trap the fixed position.
 */
export default function Toast({ msg, onDone }: { msg: ToastMsg | null; onDone: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!msg) return;
    const id = window.setTimeout(onDone, msg.action ? 6000 : 3200);
    return () => window.clearTimeout(id);
  }, [msg, onDone]);

  if (!mounted) return null;
  return createPortal(
    <div aria-live="polite" role="status">
      {msg && (
        <div className="toast" key={msg.id}>
          <CircleCheck aria-hidden="true" />
          <span>{msg.text}</span>
          {msg.action && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ marginLeft: 'var(--space-2)', minHeight: 'var(--tap-min)' }}
              onClick={() => {
                msg.action?.run();
                onDone();
              }}
            >
              {msg.action.label}
            </button>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
