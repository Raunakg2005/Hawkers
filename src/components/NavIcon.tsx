import { House, IdCard, Landmark, NotebookPen, Search, ShieldCheck, UsersRound, WalletCards } from 'lucide-react';
import type { NavItem } from '@/lib/nav';

const MAP = {
  home: House,
  search: Search,
  users: UsersRound,
  card: IdCard,
  rights: Landmark,
  shield: ShieldCheck,
  wallet: WalletCards,
  post: NotebookPen,
} as const;

export default function NavIcon({ name, size = 20 }: { name: NavItem['icon']; size?: number }) {
  const Icon = MAP[name];
  return <Icon size={size} aria-hidden="true" />;
}
