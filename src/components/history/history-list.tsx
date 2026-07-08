"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, History as HistoryIcon, Sparkles, Trophy } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { BIN_META } from "@/domain/bins";
import { formatRelativeTime } from "@/utils/format";
import { Reveal } from "@/components/ui/reveal";
import { WeeklyStats } from "./weekly-stats";
import { HistoryDetailModal } from "./history-detail-modal";
import type { ScanHistoryEntry } from "@/types/history";

export function HistoryList() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<ScanHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEntries(data.entries);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your history."));
  }, [authLoading, user]);

  if (authLoading) {
    return <div className="mx-auto max-w-lg px-6 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to view your history</h1>
        <p className="mt-3 text-muted-foreground">Every item you scan will show up here once you&apos;re signed in.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Sign in / Register
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!entries) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center text-muted-foreground">Loading your history...</div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <HistoryIcon className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">No scans yet</h1>
        <p className="mt-3 text-muted-foreground">Scan your first item and it will show up here.</p>
        <Link
          href="/scan"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Scan an item
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
          <Clock className="size-3.5 text-accent" />
          {entries.length} scan{entries.length === 1 ? "" : "s"}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your scan history</h1>
        <p className="mt-4 text-lg text-muted-foreground">Everything you&apos;ve scanned, most recent first.</p>
      </div>

      <div className="mt-10 max-w-xl">
        <WeeklyStats />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <Reveal key={entry.id} delay={Math.min(index * 40, 300)}>
            <HistoryCard entry={entry} onOpen={() => setSelectedId(entry.id)} />
          </Reveal>
        ))}
      </div>

      {selectedId && <HistoryDetailModal entryId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

function HistoryCard({ entry, onOpen }: { entry: ScanHistoryEntry; onOpen: () => void }) {
  const meta = BIN_META[entry.result.bin];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group h-full w-full overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.image}
          alt={entry.result.object}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium">{entry.result.object}</h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${meta.bg} ${meta.text}`}
          >
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(entry.scannedAt)}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="size-3" />
            {entry.result.confidence}%
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
            entry.duplicate ? "bg-muted text-muted-foreground" : "bg-accent-soft text-accent"
          }`}
        >
          <Trophy className="size-3.5" />
          {entry.duplicate ? "No XP (duplicate)" : `+${entry.xpAwarded} XP`}
        </div>
      </div>
    </button>
  );
}