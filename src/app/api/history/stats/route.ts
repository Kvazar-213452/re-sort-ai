import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { config } from "@/config";
import { getMaterialBreakdown } from "@/server/repositories/history-repository";
import { errorResponse } from "@/utils/api-error";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your stats." }, { status: 401 });
  }

  try {
    const since = new Date(Date.now() - config.history.statsWindowMs);
    const { totalScans, breakdown } = await getMaterialBreakdown(user._id!, since);

    return NextResponse.json({ totalScans, since: since.toISOString(), breakdown });
  } catch (error) {
    return errorResponse(error, "Could not load your stats.");
  }
}
