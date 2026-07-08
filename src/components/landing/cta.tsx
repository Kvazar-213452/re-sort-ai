import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/github-icon";
import { Reveal } from "@/components/ui/reveal";
import { config } from "@/config";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="group relative overflow-hidden rounded-3xl bg-accent px-8 py-16 text-center text-accent-foreground sm:px-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to sort smarter today?</h2>
            <p className="mx-auto mt-4 max-w-xl text-accent-foreground/80">
              Point your camera at any object and get an answer in seconds. No sign-up, no confusing rules.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/scan"
                className="group/btn inline-flex h-11 items-center gap-2 rounded-full bg-background px-6 text-sm font-medium text-foreground transition-transform duration-300 hover:scale-[1.05]"
              >
                Try scanning
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
              <a
                href={config.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-accent-foreground/30 px-6 text-sm font-medium transition-colors hover:bg-accent-foreground/10"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}