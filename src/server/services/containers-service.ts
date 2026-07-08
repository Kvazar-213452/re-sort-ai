import { config } from "@/config";
import type { City, RecyclingPoint } from "@/domain/cities";
import { fetchRecyclingPointsFromOverpass } from "@/server/clients/overpass-client";
import { getCachedPoints, setCachedPoints } from "@/server/repositories/recycling-cache-repository";

export type RecyclingPointsSource = "cache" | "live" | "stale-cache";

export async function getPointsForCity(city: City): Promise<{ points: RecyclingPoint[]; source: RecyclingPointsSource }> {
  const cached = await getCachedPoints(city.slug);
  if (cached && Date.now() - cached.fetchedAt.getTime() < config.map.cacheTtlMs) {
    return { points: cached.points, source: "cache" };
  }

  try {
    const points = await fetchRecyclingPointsFromOverpass(city);
    await setCachedPoints(city.slug, points);
    return { points, source: "live" };
  } catch (error) {
    if (cached) {
      return { points: cached.points, source: "stale-cache" };
    }
    throw error;
  }
}
