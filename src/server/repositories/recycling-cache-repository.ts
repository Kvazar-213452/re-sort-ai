import { getDb } from "@/server/db";
import type { RecyclingPoint } from "@/domain/cities";

interface RecyclingCacheDocument {
  city: string;
  points: RecyclingPoint[];
  fetchedAt: Date;
}

export interface RecyclingCacheEntry {
  points: RecyclingPoint[];
  fetchedAt: Date;
}

async function getCacheCollection() {
  try {
    const db = await getDb();
    return db.collection<RecyclingCacheDocument>("recycling_points_cache");
  } catch {
    return null;
  }
}

export async function getCachedPoints(citySlug: string): Promise<RecyclingCacheEntry | null> {
  const cache = await getCacheCollection();
  const doc = await cache?.findOne({ city: citySlug });
  return doc ? { points: doc.points, fetchedAt: doc.fetchedAt } : null;
}

export async function setCachedPoints(citySlug: string, points: RecyclingPoint[]): Promise<void> {
  const cache = await getCacheCollection();
  await cache?.updateOne(
    { city: citySlug },
    { $set: { city: citySlug, points, fetchedAt: new Date() } },
    { upsert: true }
  );
}
