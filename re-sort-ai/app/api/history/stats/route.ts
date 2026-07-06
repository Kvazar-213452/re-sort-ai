import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { getHistoryCollection } from "@/app/lib/history";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your stats." }, { status: 401 });
  }

  try {
    const history = await getHistoryCollection();
    const since = new Date(Date.now() - WEEK_MS);

    const rows = await history
      .aggregate<{ _id: string; count: number }>([
        {
          $match: {
            userId: user._id,
            scannedAt: { $gte: since },
            "result.mode": "full",
          },
        },
        { $addFields: { materialKey: { $toLower: { $trim: { input: "$result.material" } } } } },
        { $match: { materialKey: { $nin: ["", "unknown"] } } },
        { $group: { _id: "$materialKey", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const totalScans = rows.reduce((sum, row) => sum + row.count, 0);
    const breakdown = rows.map((row) => ({
      material: row._id,
      label: row._id.charAt(0).toUpperCase() + row._id.slice(1),
      count: row.count,
      percent: totalScans ? Math.round((row.count / totalScans) * 100) : 0,
    }));

    return NextResponse.json({ totalScans, since: since.toISOString(), breakdown });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load your stats.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}