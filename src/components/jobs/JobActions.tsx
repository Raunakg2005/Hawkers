'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CircleCheck, Flag, Hand, Phone, Share2, ShieldAlert, X } from 'lucide-react';
import { useLang } from '@/lib/prefs';
import { T } from '../T';

interface Props {
  id: string;
  pay: string;
  unitEn: string;
  unitHi: string;
  paidEn: string;
  paidHi: string;
  hours: string;
  startEn: string;
  startHi: string;
  phone: string;
  employer: string;
  risky: boolean;
  shareEn: string;
  shareHi: string;
}

type Stage = 'idle' | 'confirm' | 'sent';

/**
 * "I'm interested" flow. Before anything is sent the worker re-confirms the
 * key terms (pay, payday, hours, start) — the Work Promise — so nobody
 * commits to something unclear. Risky listings get no apply button at all.
 */
export default function JobActions(p: Props) {
  const { t, lang } = useLang();
  const [stage, setStage] = useState<Stage>('idle');
  const [checks, setChecks] = useState([false, false, false]);
  const [toast, setToast] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const applied: string[] = JSON.parse(localStorage.getItem('naka-applied') ?? '[]');
      if (applied.includes(p.id)) setStage('sent');
    } catch {
      /* ignore */
    }
  }, [p.id]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openConfirm = () => {
    setStage('confirm');
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const send = () => {
    setStage('sent');
    try {
      const applied: string[] = JSON.parse(localStorage.getItem('naka-applied') ?? '[]');
      localStorage.setItem('naka-applied', JSON.stringify([...new Set([...applied, p.id])]));
    } catch {
      /* ignore */
    }
    setToast(t('Sent! The employer will call you.', 'भेज दिया! मालिक आपको फ़ोन करेंगे।'));
  };

  const share = async () => {
    const text = lang === 'hi' ? p.shareHi : p.shareEn;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Naka', text, url });
      } catch {
        /* cancelled */
      }
    } else {
      window.location.href = `sms:?&body=${encodeURIComponent(`${text} ${url}`)}`;
    }
  };

  const report = (reason: string) => {
    setReporting(false);
    setToast(t(`Thanks — reported as “${reason}”. We will check it.`, `धन्यवाद — “${reason}” के रूप में रिपोर्ट किया। हम जाँच करेंगे।`));
  };

  const allChecked = checks.every(Boolean);
  const confirmItems = [
    { en: `Pay is ${p.pay} ${p.unitEn} — ${p.paidEn.toLowerCase()}`, hi: `मज़दूरी ${p.pay} ${p.unitHi} — ${p.paidHi}` },
    { en: `Work time ${p.hours}, starting ${p.startEn}`, hi: `काम का समय ${p.hours}, ${p.startHi} से` },
    { en: 'I will not pay any fee to anyone for this job', hi: 'इस काम के लिए मैं किसी को कोई फ़ीस नहीं दूँगा/दूँगी' },
  ];

  return (
    <>
      <div className="action-card" id="apply" ref={cardRef}>
        <div className="action-pay">
          <span className="money">{p.pay}</span>
          <span className="muted">
            <T en={p.unitEn} hi={p.unitHi} />
          </span>
        </div>
        <p className="chip chip-success" style={{ justifySelf: 'start' }}>
          <T en={p.paidEn} hi={p.paidHi} />
        </p>

        {p.risky ? (
          <div className="callout callout-danger">
            <ShieldAlert aria-hidden="true" />
            <div className="stack">
              <strong>
                <T en="We blocked applying to this listing." hi="इस काम के लिए आवेदन बंद किया गया है।" />
              </strong>
              <p className="muted">
                <T en="Never pay a fee or share your ATM card / OTP. If you already paid, call 1930." hi="कभी फ़ीस न दें, न ATM कार्ड / OTP बताएँ। अगर पैसे दे चुके हैं तो 1930 पर फ़ोन करें।" />
              </p>
              <a className="btn btn-danger btn-sm" href="tel:1930">
                <Phone aria-hidden="true" /> 1930
              </a>
            </div>
          </div>
        ) : stage === 'idle' ? (
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={openConfirm} data-magnetic="">
            <Hand aria-hidden="true" />
            <T en="I’m interested" hi="मुझे यह काम चाहिए" />
          </button>
        ) : stage === 'confirm' ? (
          <div className="stack" aria-live="polite">
            <p className="label">
              <T en="Before you say yes — check the Work Promise:" hi="हाँ कहने से पहले — काम का वादा जाँचें:" />
            </p>
            <div className="confirm-list">
              {confirmItems.map((c, i) => (
                <label key={c.en}>
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => setChecks((arr) => arr.map((v, k) => (k === i ? !v : v)))}
                  />
                  <span>
                    <T en={c.en} hi={c.hi} />
                  </span>
                </label>
              ))}
            </div>
            <button type="button" className="btn btn-primary btn-block" disabled={!allChecked} aria-disabled={!allChecked} onClick={send} style={{ opacity: allChecked ? 1 : 0.5 }}>
              <CircleCheck aria-hidden="true" />
              <T en="Agree & send" hi="सहमत हूँ, भेजें" />
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStage('idle')}>
              <T en="Not now" hi="अभी नहीं" />
            </button>
          </div>
        ) : (
          <div className="sent" aria-live="polite">
            <span className="sent-check">
              <CircleCheck aria-hidden="true" />
            </span>
            <strong>
              <T en={`Sent to ${p.employer}`} hi={`${p.employer} को भेजा गया`} />
            </strong>
            <p className="muted">
              <T en="They usually reply within 30 minutes. The Work Promise is saved in your diary." hi="वे आमतौर पर 30 मिनट में जवाब देते हैं। काम का वादा आपकी डायरी में सेव है।" />
            </p>
            <Link href="/my-work" className="btn btn-sm">
              <T en="Open my diary" hi="मेरी डायरी खोलें" />
            </Link>
          </div>
        )}

        <div className="action-row">
          {!p.risky && (
            <a className="btn" href={`tel:${p.phone.replace(/\s/g, '')}`}>
              <Phone aria-hidden="true" />
              <T en="Call" hi="फ़ोन करें" />
            </a>
          )}
          <button type="button" className="btn" onClick={share} style={p.risky ? { gridColumn: '1 / -1' } : undefined}>
            <Share2 aria-hidden="true" />
            <T en="Send to family" hi="परिवार को भेजें" />
          </button>
        </div>

        {reporting ? (
          <div className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="label">
                <T en="What is wrong?" hi="क्या गड़बड़ है?" />
              </span>
              <button type="button" className="icon-btn" onClick={() => setReporting(false)} aria-label={t('Close', 'बंद करें')}>
                <X aria-hidden="true" />
              </button>
            </div>
            {[
              [t('Asked me for money', 'मुझसे पैसे माँगे'), 'fee'],
              [t('Wrong address', 'ग़लत पता'), 'addr'],
              [t('Pay was different', 'मज़दूरी अलग निकली'), 'pay'],
              [t('Rude or unsafe', 'बुरा बर्ताव / असुरक्षित'), 'unsafe'],
            ].map(([label, key]) => (
              <button key={key} type="button" className="filter-chip" onClick={() => report(label)}>
                {label}
              </button>
            ))}
          </div>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReporting(true)}>
            <Flag aria-hidden="true" />
            <T en="Report this listing" hi="इस काम की शिकायत करें" />
          </button>
        )}
      </div>

      {!p.risky && stage !== 'sent' && (
        <div className="mobile-cta">
          <span>
            <span className="money">{p.pay}</span>{' '}
            <small className="muted">
              <T en={p.unitEn} hi={p.unitHi} />
            </small>
          </span>
          <button type="button" className="btn btn-primary" onClick={openConfirm}>
            <Hand aria-hidden="true" />
            <T en="I’m interested" hi="मुझे यह काम चाहिए" />
          </button>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <CircleCheck aria-hidden="true" />
          {toast}
        </div>
      )}
    </>
  );
}
