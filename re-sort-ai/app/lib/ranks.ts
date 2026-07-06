import { Globe2, Leaf, Sprout, TreeDeciduous, Trees, Trophy, type LucideIcon } from "lucide-react";

export interface Rank {
  name: string;
  icon: LucideIcon;
  minXp: number;
}

export const RANKS: Rank[] = [
  { name: "Seedling", icon: Sprout, minXp: 0 },
  { name: "Sprout", icon: Leaf, minXp: 100 },
  { name: "Eco Explorer", icon: TreeDeciduous, minXp: 300 },
  { name: "Green Guardian", icon: Trees, minXp: 700 },
  { name: "Eco Hero", icon: Globe2, minXp: 1500 },
  { name: "Planet Protector", icon: Trophy, minXp: 3000 },
];

export function getRank(xp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXp) current = rank;
  }
  return current;
}

export function getNextRank(xp: number): Rank | null {
  return RANKS.find((rank) => rank.minXp > xp) ?? null;
}