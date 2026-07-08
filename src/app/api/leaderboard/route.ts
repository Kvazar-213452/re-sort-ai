import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { config } from "@/config";
import { getUsersCollection } from "@/server/repositories/user-repository";
import { errorResponse } from "@/utils/api-error";

export async function GET() {
  try {
    const users = await getUsersCollection();
    const top = await users
      .find({}, { projection: { name: 1, avatar: 1, xp: 1 } })
      .sort({ xp: -1 })
      .limit(config.leaderboard.limit)
      .toArray();

    const currentUser = await getOptionalUser();

    return NextResponse.json({
      leaderboard: top.map((user, index) => ({
        id: user._id!.toString(),
        name: user.name ?? "Eco Explorer",
        avatar: user.avatar,
        xp: user.xp,
        rankPosition: index + 1,
      })),
      currentUserId: currentUser?._id?.toString() ?? null,
    });
  } catch (error) {
    return errorResponse(error, "Could not load the leaderboard.");
  }
}
