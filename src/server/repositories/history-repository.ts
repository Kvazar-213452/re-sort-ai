import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/server/db";
import type { ChatMessage } from "@/types/chat";
import type { ScanResult } from "@/types/scan";
import type { ScanHistoryEntry } from "@/types/history";

export interface ScanHistoryDocument {
  _id?: ObjectId;
  userId: ObjectId;
  image: string;
  result: ScanResult;
  xpAwarded: number;
  duplicate: boolean;
  chatMessages: ChatMessage[];
  scannedAt: Date;
}

export interface MaterialBreakdownRow {
  material: string;
  label: string;
  count: number;
  percent: number;
}

export function toHistoryEntry(doc: ScanHistoryDocument): ScanHistoryEntry {
  return {
    id: doc._id!.toString(),
    image: doc.image,
    result: doc.result,
    xpAwarded: doc.xpAwarded,
    duplicate: doc.duplicate,
    chatMessages: doc.chatMessages ?? [],
    scannedAt: doc.scannedAt.toISOString(),
  };
}

export async function getHistoryCollection(): Promise<Collection<ScanHistoryDocument>> {
  const db = await getDb();
  return db.collection<ScanHistoryDocument>("history");
}

export async function getMaterialBreakdown(
  userId: ObjectId,
  since: Date
): Promise<{ totalScans: number; breakdown: MaterialBreakdownRow[] }> {
  const history = await getHistoryCollection();

  const rows = await history
    .aggregate<{ _id: string; count: number }>([
      {
        $match: {
          userId,
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

  return { totalScans, breakdown };
}
