"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, History, Home, LogIn, Menu, MapPinned, Recycle, ScanLine, Target, User, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Main", icon: Home },
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/map", label: "Map", icon: MapPinned, beta: true },
  { href: "/challenge", label: "Challenge", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/history", label: "History", icon: History },
  { href: "/awards", label: "Awards", icon: Award },
];

function BetaTag() {
  return (
    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-accent-foreground">
      BETA
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:rotate-180">
            <Recycle className="size-4.5" />
          </span>
          ReSort AI
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-foreground/65 hover:bg-muted hover:text-foreground"
                }`}
              >
                <link.icon className="size-4" />
                {link.label}
                {link.beta && <BetaTag />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!loading && (user ? <AuthChip name={user.name} avatar={user.avatar} xp={user.xp} /> : <SignInButton />)}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 transition-colors ${
                    active ? "bg-accent-soft font-medium text-accent" : "text-foreground/70 hover:bg-muted"
                  }`}
                >
                  <link.icon className="size-4" />
                  {link.label}
                  {link.beta && <BetaTag />}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-border pt-3">
              {!loading &&
                (user ? (
                  <AuthChip name={user.name} avatar={user.avatar} xp={user.xp} onNavigate={() => setOpen(false)} />
                ) : (
                  <SignInButton onNavigate={() => setOpen(false)} />
                ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function SignInButton({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
    >
      <LogIn className="size-3.5" />
      Sign in
    </Link>
  );
}

function AuthChip({
  name,
  avatar,
  xp,
  onNavigate,
}: {
  name: string;
  avatar: string | null;
  xp: number;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm transition-colors hover:border-accent/40 hover:bg-muted"
    >
      <span className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-xs font-semibold text-accent">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          name[0]?.toUpperCase()
        )}
      </span>
      <span className="font-medium">{xp} XP</span>
    </Link>
  );
}