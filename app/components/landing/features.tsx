import {
  BarChart3,
  Check,
  Droplet,
  Globe,
  Leaf,
  MessageCircle,
  Recycle,
  Sparkles,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import { BinLegend } from "../ui/bin-legend";
import { Reveal } from "../ui/reveal";

const features = [
  {
    icon: Leaf,
    title: "Eco insights",
    description: "Decomposition time in nature, environmental impact, and whether the item can be reused.",
  },
  {
    icon: Sparkles,
    title: "Smart reuse ideas",
    description: "AI suggests how to turn the item into something new, with DIY tips for a creative second life.",
  },
  {
    icon: BarChart3,
    title: "History & stats",
    description: "Every item you've scanned, how much plastic you've saved, how much has been recycled — with weekly and monthly charts.",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "XP for every correct scan, levels from Eco Beginner to Eco Hero, badges, and daily challenges.",
  },
  {
    icon: MessageCircle,
    title: "AI Eco Assistant",
    description: "Ask questions like \"where do I throw away batteries?\" and get an instant answer in chat.",
  },
  {
    icon: Video,
    title: "Live camera mode",
    description: "Real-time object recognition right in the browser, with an instant tip overlaid on the image.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "English, Ukrainian, and more, with automatic detection of the user's language.",
  },
  {
    icon: Zap,
    title: "Fast scan mode",
    description: "A no-frills quick mode that just says where to throw it — for instant decisions in real life.",
  },
];

const confidenceChips = [
  { label: "Plastic", value: "94%" },
  { label: "Glass", value: "91%" },
  { label: "Metal", value: "97%" },
  { label: "Organic", value: "89%" },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to sort smarter
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From instant recognition to a daily habit — ReSort AI covers the whole journey.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal className="col-span-full">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Sparkles className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">AI object recognition</h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Take a photo or upload an image — the system identifies the object, analyzes the material, and
                  shows the AI&apos;s confidence as a percentage.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {confidenceChips.map((chip) => (
                  <div
                    key={chip.label}
                    className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-transform duration-300 hover:-translate-y-0.5 hover:border-accent/40"
                  >
                    {chip.label}
                    <span className="text-accent">{chip.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="col-span-full">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5 lg:p-10">
            <div className="pointer-events-none absolute -left-24 -bottom-24 size-64 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Recycle className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">Sorting recommendations</h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  After analyzing a photo, ReSort AI shows exactly which bin the item belongs in, whether it
                  needs to be cleaned or prepped first, and whether it&apos;s recyclable at all.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Droplet className="size-4 text-accent" />
                    Cleaning needed?
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-accent" />
                    Recyclable or not
                  </span>
                </div>
              </div>
              <div className="lg:justify-self-end">
                <BinLegend active="plastic" />
              </div>
            </div>
          </div>
        </Reveal>

        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={Math.min(index * 60, 300)}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-4.5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}