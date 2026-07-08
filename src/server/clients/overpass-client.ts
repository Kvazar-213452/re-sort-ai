import { config } from "@/config";
import type { City, RecyclingBin, RecyclingPoint } from "@/domain/cities";

const BIN_TAG_MAP: Record<string, RecyclingBin> = {
  "recycling:plastic": "plastic",
  "recycling:plastic_packaging": "plastic",
  "recycling:plastic_bottles": "plastic",
  "recycling:paper": "paper",
  "recycling:cardboard": "paper",
  "recycling:newspaper": "paper",
  "recycling:organic_waste": "organic",
  "recycling:green_waste": "organic",
  "recycling:garden_waste": "organic",
  "recycling:glass": "glass",
  "recycling:glass_bottles": "glass",
  "recycling:batteries": "hazardous",
  "recycling:hazardous_waste": "hazardous",
  "recycling:oil": "hazardous",
  "recycling:electrical_items": "hazardous",
  "recycling:electronics": "hazardous",
  "recycling:fluorescent_tubes": "hazardous",
  "recycling:waste": "general",
  "recycling:general_waste": "general",
  "recycling:household_waste": "general",
};

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function binsFromTags(tags: Record<string, string>): RecyclingBin[] {
  const bins = new Set<RecyclingBin>();
  for (const [tag, bin] of Object.entries(BIN_TAG_MAP)) {
    if (tags[tag] === "yes") bins.add(bin);
  }
  return [...bins];
}

function distanceSq(point: { lat: number; lng: number }, city: City): number {
  const dLat = point.lat - city.lat;
  const dLng = point.lng - city.lng;
  return dLat * dLat + dLng * dLng;
}

function addressFromTags(tags: Record<string, string>, cityName: string): string {
  const street = tags["addr:street"];
  const houseNumber = tags["addr:housenumber"];
  if (street) return houseNumber ? `${street} ${houseNumber}, ${cityName}` : `${street}, ${cityName}`;
  return cityName;
}

export async function fetchRecyclingPointsFromOverpass(city: City): Promise<RecyclingPoint[]> {
  const [south, west, north, east] = city.bbox;
  // Cap the raw result set server-side (`out body N`) so a dense city can't
  // balloon the response; we then keep only the points nearest the center.
  const query = `[out:json][timeout:25];node["amenity"="recycling"](${south},${west},${north},${east});out body 800;`;

  let lastError: unknown;
  for (const endpoint of config.map.overpassEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
          "User-Agent": "ReSortAI-RecyclingMap/1.0",
        },
        body: query,
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`Overpass responded with ${res.status}`);

      const data: OverpassResponse = await res.json();
      const points = data.elements
        .filter((el) => el.tags?.amenity === "recycling")
        .map((el) => {
          const tags = el.tags ?? {};
          const bins = binsFromTags(tags);
          return {
            id: `osm-${el.id}`,
            name: tags.name || tags.operator || "Recycling point",
            address: addressFromTags(tags, city.name),
            hours: tags.opening_hours || "See on-site signage",
            bins: bins.length > 0 ? bins : (["general"] as RecyclingBin[]),
            lat: el.lat,
            lng: el.lon,
          } satisfies RecyclingPoint;
        });

      return points
        .sort((a, b) => distanceSq(a, city) - distanceSq(b, city))
        .slice(0, config.map.maxPoints);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Overpass API request failed.");
}
