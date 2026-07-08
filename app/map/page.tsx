import type { Metadata } from "next";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { RecyclingMap } from "../components/map/recycling-map";

export const metadata: Metadata = {
  title: "Map — ReSort AI",
  description: "Find recycling containers near you — pick your city and browse nearby drop-off points.",
};

export default function MapPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <RecyclingMap />
      </main>
      <Footer />
    </div>
  );
}
