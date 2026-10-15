import { BrickWall, Car, ChefHat, Hammer, HardHat, PaintRoller, SprayCan, Sprout, Wrench, Zap } from 'lucide-react';
import type { TradeId } from '@/data/types';

const ICONS = {
  plumber: Wrench,
  electrician: Zap,
  carpenter: Hammer,
  painter: PaintRoller,
  mason: BrickWall,
  cleaner: SprayCan,
  labour: HardHat,
  driver: Car,
  cook: ChefHat,
  gardener: Sprout,
} as const;

export const tradeColor = (id: TradeId) => `var(--trade-${id})`;

export function TradeIcon({ trade, size }: { trade: TradeId; size?: number }) {
  const Icon = ICONS[trade];
  return <Icon size={size} aria-hidden="true" />;
}

/** Coloured square tile with the trade icon — the visual "word" for a trade. */
export function TradeTile({ trade, size = '' }: { trade: TradeId; size?: '' | 'sm' | 'lg' }) {
  return (
    <span className={`icon-tile ${size}`} style={{ '--tile': tradeColor(trade) } as React.CSSProperties}>
      <TradeIcon trade={trade} />
    </span>
  );
}
