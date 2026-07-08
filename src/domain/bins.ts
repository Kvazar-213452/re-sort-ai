export type WasteBin = "plastic" | "paper" | "organic" | "hazardous" | "general";

export const DISPLAY_BINS: WasteBin[] = ["plastic", "organic", "paper", "hazardous"];

export const BIN_META: Record<
  WasteBin,
  { label: string; dot: string; text: string; bg: string; ring: string }
> = {
  plastic: {
    label: "Plastic",
    dot: "bg-blue-500",
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/40",
  },
  organic: {
    label: "Organic",
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    ring: "ring-green-500/40",
  },
  paper: {
    label: "Paper",
    dot: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
    ring: "ring-yellow-500/40",
  },
  hazardous: {
    label: "Hazardous",
    dot: "bg-red-500",
    text: "text-red-500",
    bg: "bg-red-500/10",
    ring: "ring-red-500/40",
  },
  general: {
    label: "General waste",
    dot: "bg-zinc-400",
    text: "text-zinc-500",
    bg: "bg-zinc-500/10",
    ring: "ring-zinc-400/40",
  },
};
