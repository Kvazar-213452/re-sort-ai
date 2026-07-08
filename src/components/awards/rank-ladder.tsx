import { RANKS } from "@/domain/ranks";
import { Reveal } from "@/components/ui/reveal";

export function RankLadder() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {RANKS.map((rank, index) => (
        <Reveal key={rank.name} delay={index * 70}>
          <div className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <rank.icon className="size-5" />
            </span>
            <span className="text-sm font-medium">{rank.name}</span>
            <span className="text-xs text-muted-foreground">{rank.minXp}+ XP</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}