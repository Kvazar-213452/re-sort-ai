import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getHistoryCollection, toHistoryEntry } from "@/app/lib/history";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your scan history." }, { status: 401 });
  }

  try {
    const history = await getHistoryCollection();
    const docs = await history
      .find({ userId: user._id }, { projection: { chatMessages: 0 } })
      .sort({ scannedAt: -1 })
      .limit(60)
      .toArray();

    return NextResponse.json({ entries: docs.map(toHistoryEntry) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load your scan history.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}