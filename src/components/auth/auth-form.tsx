"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

type Mode = "login" | "register";

export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useAuth();
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "register" ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      await refresh();
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
      <div className="flex rounded-full bg-muted p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 transition-colors duration-300 ${
            mode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full py-2 transition-colors duration-300 ${
            mode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-accent/50">
              <User className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-accent/50">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-accent/50">
            <Lock className="size-4 shrink-0 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>

        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Confirm password</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-accent/50">
              <Lock className="size-4 shrink-0 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>
        )}

        {error && <p className="animate-fade-up rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground transition-transform duration-300 enabled:hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}