import { ArrowRight, Lightbulb, Shirt, ShoppingBag, Sparkles, Sprout, Wine } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const ideas = [
  {
    from: Wine,
    to: Lightbulb,
    fromLabel: "Glass bottle",
    toLabel: "Table lamp",
    description: "Drill a hole for the cord, add a clip-on bulb, and you've got a one-of-a-kind handmade light.",
  },
  {
    from: ShoppingBag,
    to: Sprout,
    fromLabel: "Tin can",
    toLabel: "Herb planter",
    description: "Poke a few drainage holes in the bottom, paint it, and use it for basil or mint on the windowsill.",
  },
  {
    from: Shirt,
    to: ShoppingBag,
    fromLabel: "Old T-shirt",
    toLabel: "Tote bag",
    description: "No sewing required: cut off the sleeves and neckline, tie the bottom shut — a tote in 5 minutes.",
  },
];

export function ReuseIdeas() {
  return (
    <section id="reuse" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
          <Sparkles className="size-3.5 text-accent" />
          Smart Reuse Ideas
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A second life for everyday things</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          AI doesn&apos;t just say where to throw something away — it suggests how to turn it into something new.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {ideas.map((idea, index) => (
          <Reveal key={idea.toLabel} delay={index * 100} className="h-full">
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5">
              <div className="flex items-center justify-center gap-4 rounded-xl bg-muted py-8">
                <span className="flex size-11 items-center justify-center rounded-full bg-background text-foreground/70 transition-transform duration-300 group-hover:-translate-x-1">
                  <idea.from className="size-5" />
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:translate-x-1">
                  <idea.to className="size-5" />
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm font-medium">
                <span className="text-muted-foreground">{idea.fromLabel}</span>
                <span>{idea.toLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{idea.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}