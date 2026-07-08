export type ChallengeMetric = "totalScans" | "materialScans" | "binScans" | "fastScans" | "xpEarned";

export type ChallengeIconName =
  | "ScanLine"
  | "Sparkles"
  | "Recycle"
  | "Newspaper"
  | "Wine"
  | "Leaf"
  | "Package"
  | "AlertTriangle"
  | "Zap"
  | "Trophy";

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  metric: ChallengeMetric;
  filter?: string;
  target: number;
  reward: number;
  iconName: ChallengeIconName;
}

export const CHALLENGE_POOL: ChallengeTemplate[] = [
  {
    id: "scan-5",
    title: "Sort it out",
    description: "Analyze 5 items today, in any mode.",
    metric: "totalScans",
    target: 5,
    reward: 20,
    iconName: "ScanLine",
  },
  {
    id: "scan-10",
    title: "Sorting spree",
    description: "Analyze 10 items today — go all in.",
    metric: "totalScans",
    target: 10,
    reward: 32,
    iconName: "Sparkles",
  },
  {
    id: "plastic-3",
    title: "Plastic patrol",
    description: "Scan 3 plastic items today.",
    metric: "materialScans",
    filter: "plastic",
    target: 3,
    reward: 18,
    iconName: "Recycle",
  },
  {
    id: "paper-3",
    title: "Paper trail",
    description: "Scan 3 paper or cardboard items today.",
    metric: "materialScans",
    filter: "paper",
    target: 3,
    reward: 18,
    iconName: "Newspaper",
  },
  {
    id: "glass-2",
    title: "Glass detective",
    description: "Scan 2 glass items today.",
    metric: "materialScans",
    filter: "glass",
    target: 2,
    reward: 16,
    iconName: "Wine",
  },
  {
    id: "organic-3",
    title: "Compost crew",
    description: "Scan 3 organic or food-waste items today.",
    metric: "materialScans",
    filter: "organic",
    target: 3,
    reward: 16,
    iconName: "Leaf",
  },
  {
    id: "metal-3",
    title: "Metal detector",
    description: "Scan 3 metal items today.",
    metric: "materialScans",
    filter: "metal",
    target: 3,
    reward: 18,
    iconName: "Package",
  },
  {
    id: "hazard-1",
    title: "Hazard hunter",
    description: "Correctly sort 1 hazardous item.",
    metric: "binScans",
    filter: "hazardous",
    target: 1,
    reward: 15,
    iconName: "AlertTriangle",
  },
  {
    id: "fast-3",
    title: "Speed sorter",
    description: "Use Fast Scan mode 3 times today.",
    metric: "fastScans",
    target: 3,
    reward: 15,
    iconName: "Zap",
  },
  {
    id: "xp-30",
    title: "XP sprint",
    description: "Earn 30 XP from scanning today.",
    metric: "xpEarned",
    target: 30,
    reward: 20,
    iconName: "Trophy",
  },
];

export function todayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date = new Date()): Date {
  const d = startOfDay(date);
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

export function pickTodayChallenge(date: Date = new Date()): ChallengeTemplate {
  const key = todayKey(date);
  const hash = Array.from(key).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return CHALLENGE_POOL[hash % CHALLENGE_POOL.length];
}
