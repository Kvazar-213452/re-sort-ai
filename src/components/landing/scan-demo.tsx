import { Droplet, Leaf, Sparkles, Trophy } from "lucide-react";
import { BinLegend } from "@/components/ui/bin-legend";
import { ProgressBar } from "@/components/ui/progress-bar";

export function ScanDemo() {
  return (
    <div className="group relative mx-auto w-full max-w-sm">
      <div className="absolute -top-5 -right-4 z-10 flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground/80 shadow-lg rotate-3 animate-float">
        <span className="size-1.5 rounded-full bg-accent animate-blink" />
        AI analyzing image
      </div>

      <div className="absolute -bottom-5 -left-5 z-10 flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground/80 shadow-lg -rotate-2 animate-float [animation-delay:1.2s]">
        <Trophy className="size-3.5 text-accent" />
        +12 XP &nbsp;·&nbsp; Plastic Saver
      </div>

      <div className="rounded-3xl border border-border bg-card p-3 shadow-2xl shadow-black/5 transition-transform duration-500 hover:-translate-y-1">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent-soft to-muted">
          <span className="absolute left-4 top-4 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-accent/70" />
          <span className="absolute right-4 top-4 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-accent/70" />
          <span className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-accent/70" />
          <span className="absolute right-4 bottom-4 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-accent/70" />

          <div className="absolute left-4 top-4 flex translate-y-9 items-center gap-1.5 text-[11px] font-medium text-foreground/70">
            <span className="size-1.5 rounded-full bg-red-500 animate-blink" />
            Scanning
          </div>

          <svg
            viewBox="0 0 64 96"
            className="h-32 w-auto text-accent drop-shadow-sm transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105"
          >
            <path
              d="M24 4h16v10l6 8v58a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V22l6-8Z"
              fill="currentColor"
              opacity="0.9"
            />
            <rect x="24" y="0" width="16" height="6" rx="2" fill="currentColor" />
            <rect x="19" y="40" width="26" height="30" rx="3" fill="var(--color-card)" opacity="0.35" />
          </svg>

          <div className="absolute right-4 top-4 flex size-11 translate-y-9 items-center justify-center rounded-full border-2 border-accent bg-background/80 text-xs font-semibold text-accent">
            96%
          </div>
        </div>

        <div className="space-y-4 px-2 pb-1 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Plastic bottle</h3>
          </div>

          <BinLegend active="plastic" />

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>AI confidence</span>
              <span>96%</span>
            </div>
            <ProgressBar value={96} className="h-1.5" />
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplet className="size-3.5 shrink-0 text-accent" />
              Rinse it out before disposing
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="size-3.5 shrink-0 text-accent" />
              Takes ~450 years to decompose
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
            <span>
              <span className="font-medium text-foreground">Reuse idea:</span>{" "}
              <span className="text-muted-foreground">turn it into a vertical herb planter</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}