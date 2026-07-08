import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { config } from "@/config";
import { getHistoryCollection, toHistoryEntry } from "@/server/repositories/history-repository";
import { errorResponse } from "@/utils/api-error";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your scan history." }, { status: 401 });
  }

  try {
    const history = await getHistoryCollection();
    const docs = await history
      .find({ userId: user._id }, { projection: { chatMessages: 0 } })
      .sort({ scannedAt: -1 })
      .limit(config.history.listLimit)
      .toArray();

    return NextResponse.json({ entries: docs.map(toHistoryEntry) });
  } catch (error) {
    return errorResponse(error, "Could not load your scan history.");
  }
}
