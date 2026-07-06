import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
  computeProgress,
  endOfDay,
  getClaimedDateSet,
  last7DaysFromDates,
  pickTodayChallenge,
  startOfDay,
  streakFromDates,
  todayKey,
} from "@/app/lib/challenges";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to view today's challenge." }, { status: 401 });
  }

  try {
    const template = pickTodayChallenge();
    const dayKey = todayKey();

    const [progress, claimedDates] = await Promise.all([
      computeProgress(user._id!, template, startOfDay()),
      getClaimedDateSet(user._id!),
    ]);

    return NextResponse.json({
      challenge: {
        id: template.id,
        title: template.title,
        description: template.description,
        target: template.target,
        reward: template.reward,
        iconName: template.iconName,
      },
      progress: Math.min(progress, template.target),
      completed: progress >= template.target,
      claimed: claimedDates.has(dayKey),
      streak: streakFromDates(claimedDates),
      last7Days: last7DaysFromDates(claimedDates),
      resetsAt: endOfDay().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load today's challenge.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}