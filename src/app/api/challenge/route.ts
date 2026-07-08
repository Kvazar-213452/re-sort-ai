import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { getTodayChallenge } from "@/server/services/challenge-service";
import { errorResponse } from "@/utils/api-error";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view today's challenge." }, { status: 401 });
  }

  try {
    return NextResponse.json(await getTodayChallenge(user._id!));
  } catch (error) {
    return errorResponse(error, "Could not load today's challenge.");
  }
}
