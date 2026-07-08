import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon } from "../ui/github-icon";
import { ScanDemo } from "./scan-demo";

const stats = [
  { value: "4", label: "sorting categories" },
  { value: "<2s", label: "average analysis time" },
  { value: "10+", label: "interface languages" },
  { value: "24/7", label: "AI eco-assistant" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[36rem] w-[36rem] animate-drift rounded-full bg-accent/25 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 lg:pt-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
            <Sparkles className="size-3.5 text-accent" />
            AI assistant for sorting waste
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Point your camera.
            <br />
            AI tells you <span className="text-accent">where it goes</span>.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            ReSort AI recognizes any object from a photo or your camera, identifies the material, and instantly
            shows you the right bin, its environmental impact, and reuse ideas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/scan"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              Try scanning
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight">{s.value}</dd>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <ScanDemo />
        </div>
      </div>
    </section>
  );
}