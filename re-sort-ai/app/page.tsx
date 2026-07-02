import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { Hero } from "./components/landing/hero";
import { Features } from "./components/landing/features";
import { HowItWorks } from "./components/landing/how-it-works";
import { ReuseIdeas } from "./components/landing/reuse-ideas";
import { Gamification } from "./components/landing/gamification";
import { AiChat } from "./components/landing/ai-chat";
import { Cta } from "./components/landing/cta";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <ReuseIdeas />
        <Gamification />
        <AiChat />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}