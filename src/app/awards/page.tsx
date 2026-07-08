import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Leaderboard } from "@/components/awards/leaderboard";
import { RankLadder } from "@/components/awards/rank-ladder";

export const metadata: Metadata = {
  title: "Awards — ReSort AI",
  description: "Leaderboard and eco ranks for sorting waste the right way.",
};

export default function AwardsPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
            <Trophy className="size-3.5 text-accent" />
            Leaderboard
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Top eco players</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Earn 6-17 XP for every unique scan — the more an item harms the environment when sorted wrong, the
            more it&apos;s worth.
          </p>

          <div className="mt-10">
            <Leaderboard />
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-semibold tracking-tight">Eco ranks</h2>
            <p className="mt-2 text-muted-foreground">Climb the ranks as your XP grows.</p>
            <div className="mt-6">
              <RankLadder />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}