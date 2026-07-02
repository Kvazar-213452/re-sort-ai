import { Camera, Recycle, Sparkles } from "lucide-react";
import { Reveal } from "../ui/reveal";

const steps = [
  {
    icon: Camera,
    title: "Scan",
    description: "Point your camera or upload a photo of any object — a bottle, a battery, a box, or food.",
  },
  {
    icon: Sparkles,
    title: "AI analyzes",
    description: "A vision model identifies the object and material in seconds and shows its recognition confidence.",
  },
  {
    icon: Recycle,
    title: "Get a recommendation",
    description: "The right bin, prep before recycling, environmental impact, and a reuse idea — all on one screen.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Three steps to sorting it right</h2>
          <p className="mt-4 text-lg text-muted-foreground">No guides, no searching the internet — just point your camera.</p>
        </Reveal>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute top-6 left-0 right-0 hidden border-t border-dashed border-border sm:block" />
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 120} className="group relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-background font-semibold transition-transform duration-300 group-hover:scale-110 group-hover:border-accent/50">
                {index + 1}
              </div>
              <span className="mt-5 inline-flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <step.icon className="size-4.5" />
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}