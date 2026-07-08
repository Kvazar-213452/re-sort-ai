import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getOptionalUser } from "@/server/session";
import { getHistoryCollection, toHistoryEntry } from "@/server/repositories/history-repository";
import { errorResponse } from "@/utils/api-error";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getOptionalUser();
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
    return errorResponse(error, "Could not load this scan.");
  }
}
