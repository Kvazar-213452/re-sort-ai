import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { CITIES, type RecyclingPoint } from "@/app/lib/containers";
import { fetchRecyclingPointsFromOverpass } from "@/app/lib/overpass";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheDoc {
  city: string;
  points: RecyclingPoint[];
  fetchedAt: Date;
}

async function getCacheCollection() {
  try {
    const db = await getDb();
    return db.collection<CacheDoc>("recycling_points_cache");
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const citySlug = new URL(request.url).searchParams.get("city");
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) {
    return NextResponse.json({ error: "Unknown city." }, { status: 400 });
  }

  const cache = await getCacheCollection();
  const cached = await cache?.findOne({ city: city.slug });
  if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
    return NextResponse.json({ points: cached.points, source: "cache" });
  }

  try {
    const points = await fetchRecyclingPointsFromOverpass(city);
    await cache?.updateOne({ city: city.slug }, { $set: { city: city.slug, points, fetchedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ points, source: "live" });
  } catch (error) {
    if (cached) {
      return NextResponse.json({ points: cached.points, source: "stale-cache" });
    }
    const message = error instanceof Error ? error.message : "Could not load recycling points.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
