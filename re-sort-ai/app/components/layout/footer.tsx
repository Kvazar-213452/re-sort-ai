import Link from "next/link";
import { Recycle } from "lucide-react";
import { GithubIcon } from "../ui/github-icon";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Scan", href: "/scan" },
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Gamification", href: "/#gamification" },
      { label: "AI Chat", href: "/#assistant" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/profile" },
      { label: "History", href: "/history" },
      { label: "Awards", href: "/awards" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "README", href: "https://github.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:rotate-180">
                <Recycle className="size-4.5" />
              </span>
              ReSort AI
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Point your camera at any object — AI instantly tells you where it goes.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="mt-5 inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ReSort AI. Built for a hackathon.</span>
          <span>Built with Next.js &amp; Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}