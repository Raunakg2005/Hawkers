import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { T } from './T';
import { trustLevel } from '@/data/trades';

/** Traffic-light trust signal: colour + icon + word, never colour alone. */
export default function TrustBadge({ score, compact = false }: { score: number; compact?: boolean }) {
  const level = trustLevel(score);
  const Icon = level === 'safe' ? ShieldCheck : level === 'check' ? ShieldQuestion : ShieldAlert;
  const cls = level === 'safe' ? 'chip-success' : level === 'check' ? 'chip-warning' : 'chip-danger';
  return (
    <span className={`chip ${cls}`} title={`Trust score ${score}/100`}>
      <Icon aria-hidden="true" />
      {level === 'safe' && <T en="Looks safe" hi="सुरक्षित लगता है" />}
      {level === 'check' && <T en="Check first" hi="पहले जाँचें" />}
      {level === 'risky' && <T en="Risky" hi="ख़तरा" />}
      {!compact && <span style={{ opacity: 0.75, fontWeight: 500 }}>· {score}</span>}
    </span>
  );
}
