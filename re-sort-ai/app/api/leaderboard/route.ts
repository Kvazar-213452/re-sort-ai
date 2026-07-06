import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getUsersCollection } from "@/app/lib/user";

export async function GET() {
  try {
    const users = await getUsersCollection();
    const top = await users
      .find({}, { projection: { name: 1, avatar: 1, xp: 1 } })
      .sort({ xp: -1 })
      .limit(50)
      .toArray();

    let currentUserId: string | null = null;
    try {
      const currentUser = await getCurrentUser();
      currentUserId = currentUser?._id?.toString() ?? null;
    } catch {
      currentUserId = null;
    }

    return NextResponse.json({
      leaderboard: top.map((user, index) => ({
        id: user._id!.toString(),
        name: user.name ?? "Eco Explorer",
        avatar: user.avatar,
        xp: user.xp,
        rankPosition: index + 1,
      })),
      currentUserId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load the leaderboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}