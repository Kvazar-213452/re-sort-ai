import { createHash } from "crypto";
import { config } from "@/config";
import { getHistoryCollection } from "@/server/repositories/history-repository";
import { getUsersCollection, type UserDocument } from "@/server/repositories/user-repository";
import type { ScanResult, XpInfo } from "@/types/scan";
import type { WasteBin } from "@/domain/bins";

const BINS: readonly WasteBin[] = ["plastic", "paper", "organic", "hazardous", "general"];

const XP_HINT =
  `"xpReward": number // a whole number from ${config.scan.minXp} to ${config.scan.maxXp}. Rate how much environmental` +
  ` harm results from sorting this item incorrectly — low for easily recyclable low-impact items, high for` +
  ` hazardous or long-lasting pollutants.`;

export const FULL_SCHEMA_HINT = `Respond with strict JSON only, matching this exact shape:
{
  "object": string,              // short name of the item, e.g. "Plastic bottle"
  "material": string,            // e.g. "plastic", "glass", "metal", "paper", "organic", "other"
  "confidence": number,          // 0-100, how confident you are in this identification
  "bin": "plastic" | "paper" | "organic" | "hazardous" | "general",
  "needsCleaning": boolean,      // should it be rinsed or cleaned before disposal
  "recyclable": boolean,
  "decompositionTime": string,   // e.g. "450 years", "2-4 weeks"
  "environmentalImpact": string, // one short sentence
  "reuseIdea": string,           // one short, creative reuse or DIY idea
  ${XP_HINT}
}`;

export const FAST_SCHEMA_HINT = `Respond with strict JSON only, matching this exact shape:
{
  "object": string,
  "bin": "plastic" | "paper" | "organic" | "hazardous" | "general",
  "confidence": number, // a whole number from 0 to 100, e.g. 92. Never a fraction like 0.92.
  ${XP_HINT}
}`;

export function normalizeBin(value: unknown): WasteBin {
  return BINS.includes(value as WasteBin) ? (value as WasteBin) : "general";
}

export function normalizeConfidence(value: unknown): number {
  let n = Number(value);
  if (Number.isNaN(n)) return 0;
  // Some responses return a 0-1 fraction instead of a 0-100 percentage — rescale those.
  if (n > 0 && n <= 1) n *= 100;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function normalizeXp(value: unknown): number {
  const n = Number(value);
  if (Number.isNaN(n)) return config.scan.minXp;
  return Math.max(config.scan.minXp, Math.min(config.scan.maxXp, Math.round(n)));
}

export async function recordScan(
  image: string,
  result: ScanResult,
  xpReward: number,
  user: UserDocument
): Promise<{ xp: XpInfo; historyId: string | null }> {
  const imageHash = createHash("sha256").update(image).digest("hex");
  const duplicate = user.scannedHashes.includes(imageHash);
  const awarded = duplicate ? 0 : xpReward;
  const total = user.xp + awarded;
  let historyId: string | null = null;

  try {
    if (!duplicate) {
      const users = await getUsersCollection();
      await users.updateOne(
        { _id: user._id },
        {
          $inc: { xp: awarded },
          $push: { scannedHashes: { $each: [imageHash], $slice: -500 } },
        }
      );
    }

    const history = await getHistoryCollection();
    const inserted = await history.insertOne({
      userId: user._id!,
      image,
      result,
      xpAwarded: awarded,
      duplicate,
      chatMessages: [],
      scannedAt: new Date(),
    });
    historyId = inserted.insertedId.toString();
  } catch {
    // XP/history bookkeeping is best-effort — the scan result itself already succeeded.
  }

  return { xp: { awarded, total, duplicate }, historyId };
}
