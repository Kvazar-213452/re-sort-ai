import type { Metadata } from "next";
import { Award } from "lucide-react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { ComingSoon } from "../components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Awards — ReSort AI",
  description: "Badges, levels, and daily challenges for sorting waste the right way.",
};

export default function AwardsPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ComingSoon
          icon={Award}
          title="Badges & challenges"
          description="Earn XP for every correct scan, level up from Eco Beginner to Eco Hero, and unlock badges."
          points={[
            "Full badge collection with unlock progress",
            "Daily and weekly challenges",
            "Leaderboard among friends",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}