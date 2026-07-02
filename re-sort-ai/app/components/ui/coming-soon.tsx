import { Construction, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

export function ComingSoon({
  icon: Icon,
  title,
  description,
  points,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Reveal className="flex flex-col items-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Icon className="size-6" />
        </span>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
          <Construction className="size-3.5 text-accent" />
          Coming soon
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>

        <ul className="mt-8 w-full space-y-3 text-left text-sm text-muted-foreground">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors duration-300 hover:border-accent/40"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}