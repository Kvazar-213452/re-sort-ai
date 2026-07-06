"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getMaterialColor } from "../../lib/materials";
import { ProgressBar } from "../ui/progress-bar";
import { Reveal } from "../ui/reveal";

interface MaterialBreakdown {
  material: string;
  label: string;
  count: number;
  percent: number;
}

interface StatsResponse {
  totalScans: number;
  breakdown: MaterialBreakdown[];
}

export function WeeklyStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetch("/api/history/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {});
  }, []);

  if (!stats || stats.breakdown.length === 0) return null;

  return (
    <Reveal>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4 text-accent" />
            This week by material
          </div>
          <span className="text-xs text-muted-foreground">
            {stats.totalScans} scan{stats.totalScans === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {stats.breakdown.map((item) => {
            const color = getMaterialColor(item.material);
            return (
              <div key={item.material}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className={`size-2 rounded-full ${color.dot}`} />
                    {item.label}
                  </span>
                  <span className="text-muted-foreground">{item.percent}%</span>
                </div>
                <ProgressBar value={item.percent} className="h-1.5" barClassName={color.bar} />
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}