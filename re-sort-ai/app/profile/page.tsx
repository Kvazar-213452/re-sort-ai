import type { Metadata } from "next";
import { User } from "lucide-react";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { ComingSoon } from "../components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Profile — ReSort AI",
  description: "Your ReSort AI profile — eco level, XP, and account settings.",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ComingSoon
          icon={User}
          title="Your profile"
          description="Sign in to track your eco level, XP, and personal sorting stats across every device."
          points={[
            "Avatar, display name, and account settings",
            "Current level, XP progress, and streaks",
            "Total items scanned and plastic saved",
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}