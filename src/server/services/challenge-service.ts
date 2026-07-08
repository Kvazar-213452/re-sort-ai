import type { ObjectId } from "mongodb";
import {
  endOfDay,
  pickTodayChallenge,
  startOfDay,
  todayKey,
  type ChallengeTemplate,
} from "@/domain/challenge-catalog";
import {
  computeProgress,
  getClaimedDateSet,
  getClaimsCollection,
  last7DaysFromDates,
  streakFromDates,
} from "@/server/repositories/challenge-repository";
import { getUsersCollection } from "@/server/repositories/user-repository";

export interface TodayChallenge {
  challenge: Pick<ChallengeTemplate, "id" | "title" | "description" | "target" | "reward" | "iconName">;
  progress: number;
  completed: boolean;
  claimed: boolean;
  streak: number;
  last7Days: { date: string; claimed: boolean }[];
  resetsAt: string;
}

export async function getTodayChallenge(userId: ObjectId): Promise<TodayChallenge> {
  const template = pickTodayChallenge();
  const dayKey = todayKey();

  const [progress, claimedDates] = await Promise.all([
    computeProgress(userId, template, startOfDay()),
    getClaimedDateSet(userId),
  ]);

  return {
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
  };
}

export class ChallengeClaimError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function claimTodayChallenge(userId: ObjectId): Promise<{ awarded: number; totalXp: number }> {
  const template = pickTodayChallenge();
  const dayKey = todayKey();
  const claims = await getClaimsCollection();

  const existing = await claims.findOne({ userId, date: dayKey });
  if (existing) {
    throw new ChallengeClaimError("You've already claimed today's reward.", 409);
  }

  const progress = await computeProgress(userId, template, startOfDay());
  if (progress < template.target) {
    throw new ChallengeClaimError("Finish today's challenge first.", 400);
  }

  await claims.insertOne({
    userId,
    date: dayKey,
    challengeId: template.id,
    reward: template.reward,
    claimedAt: new Date(),
  });

  const users = await getUsersCollection();
  const updated = await users.findOneAndUpdate(
    { _id: userId },
    { $inc: { xp: template.reward } },
    { returnDocument: "after" }
  );

  return { awarded: template.reward, totalXp: updated?.xp ?? template.reward };
}
