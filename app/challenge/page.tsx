import type { Metadata } from "next";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { DailyChallenge } from "../components/challenge/daily-challenge";

export const metadata: Metadata = {
  title: "Daily Challenge — ReSort AI",
  description: "A new eco challenge every day — complete it for bonus XP and build your streak.",
};

export default function ChallengePage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <DailyChallenge />
      </main>
      <Footer />
    </div>
  );
}