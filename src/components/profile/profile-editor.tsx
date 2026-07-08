"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, LogOut, Save } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import type { PublicUser } from "@/types/user";
import { fileToDataUrl, resizeDataUrl } from "@/utils/image";
import { getNextRank, getRank } from "@/domain/ranks";
import { ProgressBar } from "@/components/ui/progress-bar";

const MAX_AVATAR_SIZE = 8 * 1024 * 1024;

export function ProfileEditor() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-lg px-6 py-24 text-center text-muted-foreground">Loading your profile...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to view your profile</h1>
        <p className="mt-3 text-muted-foreground">
          Track your eco rank, XP, and account settings once you&apos;re signed in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
        >
          Sign in / Register
        </Link>
      </div>
    );
  }

  return <ProfileForm user={user} />;
}

function ProfileForm({ user }: { user: PublicUser }) {
  const { refresh, logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const progressPct = nextRank
    ? Math.round(((user.xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100)
    : 100;

  async function handleAvatarChange(file: File) {
    if (file.size > MAX_AVATAR_SIZE) {
      setMessage({ type: "error", text: "Image is too large (max 8MB)." });
      return;
    }
    setAvatarUploading(true);
    setMessage(null);
    try {
      const raw = await fileToDataUrl(file);
      const resized = await resizeDataUrl(raw, 256, 0.8);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: resized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update avatar.");
      await refresh();
      setMessage({ type: "success", text: "Avatar updated." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setAvatarUploading(false);
    }
  }

  async function saveAccount(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match." });
      return;
    }

    const body: Record<string, unknown> = {};
    if (name !== user.name) body.name = name;
    if (email !== user.email) body.email = email;
    if (newPassword) {
      body.newPassword = newPassword;
      body.currentPassword = currentPassword;
    }

    if (Object.keys(body).length === 0) {
      setMessage({ type: "success", text: "Nothing to save." });
      return;
    }

    setSavingAccount(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save changes.");
      await refresh();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setSavingAccount(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <label className="group relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-accent-soft text-accent">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold">{user.name[0]?.toUpperCase()}</span>
          )}
          <span
            className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity ${
              avatarUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Camera className={`size-5 ${avatarUploading ? "animate-pulse" : ""}`} />
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={avatarUploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleAvatarChange(file);
              event.target.value = "";
            }}
          />
        </label>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-accent sm:justify-start">
            <rank.icon className="size-4" />
            {rank.name}
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{user.xp} XP</span>
          <span className="text-muted-foreground">
            {nextRank ? `${nextRank.minXp - user.xp} XP to ${nextRank.name}` : "Max rank reached"}
          </span>
        </div>
        <ProgressBar value={progressPct} className="mt-3" />
      </div>

      <form onSubmit={saveAccount} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Account</h2>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</span>
          <input
            type="text"
            value={name}
            minLength={2}
            maxLength={60}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Required to change password"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50"
          />
        </label>

        {message && (
          <p
            className={`animate-fade-up rounded-lg px-3 py-2 text-sm ${
              message.type === "success" ? "bg-accent-soft text-accent" : "bg-red-500/10 text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={savingAccount}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform duration-300 enabled:hover:scale-[1.02] disabled:opacity-50"
        >
          <Save className="size-4" />
          {savingAccount ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}