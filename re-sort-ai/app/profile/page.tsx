import type { Metadata } from "next";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { ProfileEditor } from "../components/profile/profile-editor";

export const metadata: Metadata = {
  title: "Profile — ReSort AI",
  description: "Your ReSort AI profile — eco rank, XP, and account settings.",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ProfileEditor />
      </main>
      <Footer />
    </div>
  );
}