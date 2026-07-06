import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { ScanWorkspace } from "../components/scan/scan-workspace";
import { ChatGate } from "../components/scan/chat-gate";

export const metadata: Metadata = {
  title: "Scan — ReSort AI",
  description: "Scan any item with your camera or a photo and let AI tell you exactly how to sort it.",
};

export default function ScanPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
              <Sparkles className="size-3.5 text-accent" />
              Live scan
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Scan an item</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Use your camera or upload a photo. AI identifies the object, the material, and exactly how to
              dispose of it — in full detail or fast-scan mode.
            </p>
          </div>

          <div className="mt-10">
            <ScanWorkspace />
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight">Ask the Eco Assistant</h2>
            <p className="mt-2 text-muted-foreground">Not sure where something goes? Just ask.</p>
            <div className="mt-6 max-w-2xl">
              <ChatGate />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}