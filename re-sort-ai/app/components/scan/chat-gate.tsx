"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "../providers/auth-provider";
import { EcoChat } from "./eco-chat";

export function ChatGate() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Lock className="size-4.5" />
        </span>
        <p className="max-w-xs text-sm text-muted-foreground">
          Sign in to chat with the Eco Assistant. Scanning items still works without an account.
        </p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Sign in / Register
        </Link>
      </div>
    );
  }

  return <EcoChat />;
}