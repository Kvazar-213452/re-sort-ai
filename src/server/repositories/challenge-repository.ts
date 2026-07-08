import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/server/db";
import { getHistoryCollection } from "@/server/repositories/history-repository";
import type { ChallengeTemplate } from "@/domain/challenge-catalog";
import { todayKey } from "@/domain/challenge-catalog";

export interface ChallengeClaimDocument {
  _id?: ObjectId;
  userId: ObjectId;
  date: string;
  challengeId: string;
  reward: number;
  claimedAt: Date;
}

export async function getClaimsCollection(): Promise<Collection<ChallengeClaimDocument>> {
  const db = await getDb();
  return db.collection<ChallengeClaimDocument>("challengeClaims");
}

export async function computeProgress(
  userId: ObjectId,
  template: ChallengeTemplate,
  dayStart: Date
): Promise<number> {
  const history = await getHistoryCollection();
  const base = { userId, scannedAt: { $gte: dayStart } };

  switch (template.metric) {
    case "totalScans":
      return history.countDocuments(base);

    case "materialScans":
      return history.countDocuments({
        ...base,
        "result.mode": "full",
        $expr: { $eq: [{ $toLower: "$result.material" }, template.filter] },
      });

    case "binScans":
      return history.countDocuments({ ...base, "result.bin": template.filter });

    case "fastScans":
      return history.countDocuments({ ...base, "result.mode": "fast" });

    case "xpEarned": {
      const rows = await history
        .aggregate<{ _id: null; sum: number }>([{ $match: base }, { $group: { _id: null, sum: { $sum: "$xpAwarded" } } }])
        .toArray();
      return rows[0]?.sum ?? 0;
    }

    default:
      return 0;
  }
}

export async function getClaimedDateSet(userId: ObjectId): Promise<Set<string>> {
  const claims = await getClaimsCollection();
  const docs = await claims.find({ userId }, { projection: { date: 1 } }).sort({ date: -1 }).limit(400).toArray();
  return new Set(docs.map((doc) => doc.date));
}

export function streakFromDates(claimedDates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  if (!claimedDates.has(todayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (claimedDates.has(todayKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function last7DaysFromDates(claimedDates: Set<string>): { date: string; claimed: boolean }[] {
  const days: { date: string; claimed: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = todayKey(d);
    days.push({ date: key, claimed: claimedDates.has(key) });
  }
  return days;
}
