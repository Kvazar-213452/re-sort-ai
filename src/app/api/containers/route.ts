import { NextResponse } from "next/server";
import { CITIES } from "@/domain/cities";
import { getPointsForCity } from "@/server/services/containers-service";
import { errorResponse } from "@/utils/api-error";

export async function GET(request: Request) {
  const citySlug = new URL(request.url).searchParams.get("city");
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) {
    return NextResponse.json({ error: "Unknown city." }, { status: 400 });
  }

  try {
    const { points, source } = await getPointsForCity(city);
    return NextResponse.json({ points, source });
  } catch (error) {
    return errorResponse(error, "Could not load recycling points.", 502);
  }
}
