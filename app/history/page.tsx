import type { Metadata } from "next";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { HistoryList } from "../components/history/history-list";

export const metadata: Metadata = {
  title: "History — ReSort AI",
  description: "Your full scan history and recycling impact over time.",
};

export default function HistoryPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HistoryList />
      </main>
      <Footer />
    </div>
  );
}