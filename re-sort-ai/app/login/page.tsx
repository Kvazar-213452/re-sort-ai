import type { Metadata } from "next";
import { Recycle } from "lucide-react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { AuthForm } from "../components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in — ReSort AI",
  description: "Sign in or create a ReSort AI account to earn XP, save your scan history, and chat with the Eco Assistant.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-accent/20 blur-[110px]" />

        <div className="w-full animate-fade-up">
          <div className="mx-auto mb-8 flex max-w-sm flex-col items-center text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Recycle className="size-6" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome to ReSort AI</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to save your scans, earn XP, and chat with the Eco Assistant.
            </p>
          </div>
          <AuthForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}