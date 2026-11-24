import {
  Beaker,
  ShieldCheck,
  Factory,
  Search,
  Leaf,
  BadgeCheck,
  Microscope,
  Gauge,
  TrendingUp,
  Sparkles,
  Package,
  Clock3,
  Layers,
  Award,
  LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  flask: Beaker,
  shield: ShieldCheck,
  factory: Factory,
  search: Search,
  leaf: Leaf,
  check: BadgeCheck,
  microscope: Microscope,
  gauge: Gauge,
  trend: TrendingUp,
  spark: Sparkles,
  package: Package,
  clock: Clock3,
  layers: Layers,
  badge: Award,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] || Beaker;
  return <Icon className={className} strokeWidth={1.4} />;
}
