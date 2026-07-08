"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Flame,
  Leaf,
  Lock,
  Newspaper,
  Package,
  PartyPopper,
  Recycle,
  ScanLine,
  Sparkles,
  Target,
  Trophy,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Reveal } from "@/components/ui/reveal";
import type { ChallengeIconName } from "@/domain/challenge-catalog";

const ICONS: Record<ChallengeIconName, LucideIcon> = {
  ScanLine,
  Sparkles,
  Recycle,
  Newspaper,
  Wine,
  Leaf,
  Package,
  AlertTriangle,
  Zap,
  Trophy,
};

interface ChallengeState {
  challenge: {
    id: string;
    title: string;
    description: string;
    target: number;
    reward: number;
    iconName: ChallengeIconName;
  };
  progress: number;
  completed: boolean;
  claimed: boolean;
  streak: number;
  last7Days: { date: string; claimed: boolean }[];
  resetsAt: string;
}

function formatCountdown(resetsAt: string): string {
  const ms = new Date(resetsAt).getTime() - Date.now();
  if (ms <= 0) return "any moment now";
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export function DailyChallenge() {
  const { user, loading: authLoading, refresh } = useAuth();
  const [state, setState] = useState<ChallengeState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [celebration, setCelebration] = useState<number | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    fetch("/api/challenge")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setState(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load today's challenge."));
  }, [authLoading, user]);

  async function claim() {
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch("/api/challenge/claim", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setState((prev) => (prev ? { ...prev, claimed: true, streak: prev.streak + 1 } : prev));
      setCelebration(data.awarded);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setClaiming(false);
    }
  }

  if (authLoading) {
    return <div className="mx-auto max-w-lg px-6 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Target className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in for today&apos;s challenge</h1>
        <p className="mt-3 text-muted-foreground">
          A new eco challenge drops every day. Sign in to track your progress and build a streak.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Sign in / Register
        </Link>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center text-muted-foreground">
        Loading today&apos;s challenge...
      </div>
    );
  }

  const Icon = ICONS[state.challenge.iconName];
  const percent = Math.round((state.progress / state.challenge.target) * 100);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
          <Target className="size-3.5 text-accent" />
          Daily Challenge
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Today&apos;s challenge</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A fresh eco challenge every day. Complete it to earn bonus XP and keep your streak alive.
        </p>
      </div>

      <Reveal className="mt-10">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-300 ${
                  state.completed && !state.claimed ? "animate-pop" : ""
                }`}
              >
                <Icon className="size-7" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{state.challenge.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{state.challenge.description}</p>
              </div>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              +{state.challenge.reward} XP
            </span>
          </div>

          <div className="relative mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {state.progress} / {state.challenge.target}
              </span>
            </div>
            <ProgressBar value={percent} />
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" />
              New challenge in {formatCountdown(state.resetsAt)}
            </div>

            {state.claimed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 className="size-4" />
                Claimed today
              </span>
            ) : state.completed ? (
              <button
                type="button"
                onClick={claim}
                disabled={claiming}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-[0_0_0_4px_var(--color-accent-soft)] transition-transform duration-300 enabled:hover:scale-105 disabled:opacity-60"
              >
                <PartyPopper className="size-4" />
                {claiming ? "Claiming..." : `Claim +${state.challenge.reward} XP`}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                <Lock className="size-3.5" />
                Keep scanning
              </span>
            )}
          </div>

          {celebration !== null && (
            <div className="relative mt-4 animate-fade-up rounded-xl bg-accent-soft px-3 py-2.5 text-sm font-medium text-accent">
              Nice work — +{celebration} XP added to your total.
            </div>
          )}

          {error && (
            <p className="relative mt-4 animate-fade-up rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </Reveal>

      <Reveal delay={100} className="mt-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Flame className={`size-4 ${state.streak > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
              {state.streak} day{state.streak === 1 ? "" : "s"} streak
            </div>
          </div>

          <div className="mt-4 flex justify-between gap-2">
            {state.last7Days.map((day, index) => {
              const isToday = index === state.last7Days.length - 1;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                      day.claimed
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    } ${isToday ? "ring-2 ring-accent/50 ring-offset-2 ring-offset-card" : ""}`}
                  >
                    {day.claimed ? <CheckCircle2 className="size-4" /> : ""}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(day.date).toLocaleDateString(undefined, { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}