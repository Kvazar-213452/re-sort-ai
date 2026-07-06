import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getUsersCollection } from "@/app/lib/user";
import { computeProgress, getClaimsCollection, pickTodayChallenge, startOfDay, todayKey } from "@/app/lib/challenges";

export async function POST() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to claim your reward." }, { status: 401 });
  }

  try {
    const template = pickTodayChallenge();
    const dayKey = todayKey();
    const claims = await getClaimsCollection();

    const existing = await claims.findOne({ userId: user._id, date: dayKey });
    if (existing) {
      return NextResponse.json({ error: "You've already claimed today's reward." }, { status: 409 });
    }

    const progress = await computeProgress(user._id!, template, startOfDay());
    if (progress < template.target) {
      return NextResponse.json({ error: "Finish today's challenge first." }, { status: 400 });
    }

    await claims.insertOne({
      userId: user._id!,
      date: dayKey,
      challengeId: template.id,
      reward: template.reward,
      claimedAt: new Date(),
    });

    const users = await getUsersCollection();
    await users.updateOne({ _id: user._id }, { $inc: { xp: template.reward } });

    return NextResponse.json({ awarded: template.reward, totalXp: user.xp + template.reward });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not claim your reward.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}