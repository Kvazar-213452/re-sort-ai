import type { Collection, ObjectId } from "mongodb";
import { getDb } from "./db";
import type { ChatMessage, ScanResult } from "./types";

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

export interface ScanHistoryEntry {
  id: string;
  image: string;
  result: ScanResult;
  xpAwarded: number;
  duplicate: boolean;
  chatMessages: ChatMessage[];
  scannedAt: string;
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