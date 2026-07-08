import { BatteryCharging, Flame, Package, Recycle, Sprout, Trophy, Zap } from "lucide-react";
import { ProgressBar } from "../ui/progress-bar";
import { Reveal } from "../ui/reveal";

const levels = ["Eco Beginner", "Eco Explorer", "Eco Pro", "Eco Hero"];

const badges = [
  { icon: Sprout, label: "Zero Waste Starter", unlocked: true },
  { icon: Recycle, label: "Plastic Saver", unlocked: true },
  { icon: BatteryCharging, label: "Battery Buster", unlocked: true },
  { icon: Package, label: "Recycle Rookie", unlocked: false },
  { icon: Flame, label: "7-Day Streak", unlocked: false },
  { icon: Trophy, label: "Eco Hero", unlocked: false },
];

export function Gamification() {
  return (
    <section id="gamification" className="border-y border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
            <Trophy className="size-3.5 text-accent" />
            Gamification
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Turn sorting into a game</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Earn XP for every correct scan, level up from Eco Beginner to Eco Hero, and collect badges along the way.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Zap className="size-5" />
                  </span>
                  <div>
                    <div className="font-semibold">Eco Explorer</div>
                    <div className="text-xs text-muted-foreground">Level 3</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">640 / 1000 XP</div>
              </div>

              <ProgressBar value={64} className="mt-6" />

              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                {levels.map((level, index) => (
                  <span key={level} className={index <= 1 ? "font-medium text-foreground" : ""}>
                    {level}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                360 more XP to reach <span className="font-medium text-foreground">Eco Pro</span> — that&apos;s about 18
                correct scans.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((badge, index) => (
              <Reveal key={badge.label} delay={index * 70}>
                <div
                  className={`group flex h-full flex-col items-center justify-center gap-2 rounded-2xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 ${
                    badge.unlocked
                      ? "border-accent/30 bg-card hover:shadow-lg hover:shadow-accent/10"
                      : "border-border bg-card/50 opacity-50 grayscale hover:opacity-80"
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
                      badge.unlocked ? "bg-accent-soft text-accent" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <badge.icon className="size-4.5" />
                  </span>
                  <span className="text-xs font-medium leading-tight">{badge.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}