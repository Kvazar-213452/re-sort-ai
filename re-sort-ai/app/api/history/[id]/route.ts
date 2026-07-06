import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/app/lib/auth";
import { getHistoryCollection, toHistoryEntry } from "@/app/lib/history";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to view this scan." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }

  try {
    const history = await getHistoryCollection();
    const doc = await history.findOne({ _id: new ObjectId(id), userId: user._id });
    if (!doc) {
      return NextResponse.json({ error: "Scan not found." }, { status: 404 });
    }

    return NextResponse.json({ entry: toHistoryEntry(doc) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load this scan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}