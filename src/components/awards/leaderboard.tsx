"use client";

import { useEffect, useState } from "react";
import { Crown, Medal } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { getRank } from "@/domain/ranks";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  rankPosition: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEntries(data.leaderboard);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the leaderboard."));
  }, []);

  if (error) {
    return <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>;
  }

  if (!entries) {
    return <p className="text-sm text-muted-foreground">Loading leaderboard...</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No players yet — be the first to scan and earn XP.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {entries.map((entry, index) => {
        const rank = getRank(entry.xp);
        const isMe = user?.id === entry.id;
        return (
          <div
            key={entry.id}
            style={{ transitionDelay: `${Math.min(index * 40, 400)}ms` }}
            className={`flex animate-fade-up items-center gap-4 px-5 py-4 transition-colors ${
              isMe ? "bg-accent-soft" : ""
            }`}
          >
            <div className="flex w-8 shrink-0 items-center justify-center font-semibold text-muted-foreground">
              {entry.rankPosition === 1 ? (
                <Crown className="size-5 text-yellow-500" />
              ) : entry.rankPosition <= 3 ? (
                <Medal className="size-5 text-accent" />
              ) : (
                entry.rankPosition
              )}
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold">
              {entry.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                entry.name[0]?.toUpperCase()
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">
                {entry.name}
                {isMe && <span className="ml-2 text-xs text-accent">(you)</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <rank.icon className="size-3.5" />
                {rank.name}
              </div>
            </div>

            <div className="shrink-0 font-semibold">{entry.xp} XP</div>
          </div>
        );
      })}
    </div>
  );
}