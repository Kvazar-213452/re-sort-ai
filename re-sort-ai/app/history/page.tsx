import type { Metadata } from "next";
import { History } from "lucide-react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { ComingSoon } from "../components/ui/coming-soon";

export const metadata: Metadata = {
  title: "History — ReSort AI",
  description: "Your full scan history, stats, and recycling impact over time.",
};

export default function HistoryPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ComingSoon
          icon={History}
          title="Scan history"
          description="Every item you've ever scanned will show up here, with filters and charts to track your progress."
          points={[
            "Searchable list of every scanned item",
            "Filter by bin, material, or date range",
            "Weekly and monthly recycling charts",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}