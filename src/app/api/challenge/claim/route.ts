import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { ChallengeClaimError, claimTodayChallenge } from "@/server/services/challenge-service";
import { errorResponse } from "@/utils/api-error";

export async function POST() {
  const user = await getOptionalUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to claim your reward." }, { status: 401 });
  }

  try {
    return NextResponse.json(await claimTodayChallenge(user._id!));
  } catch (error) {
    if (error instanceof ChallengeClaimError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return errorResponse(error, "Could not claim your reward.");
  }
}
