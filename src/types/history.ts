import type { ChatMessage } from "@/types/chat";
import type { ScanResult } from "@/types/scan";

export interface ScanHistoryEntry {
  id: string;
  image: string;
  result: ScanResult;
  xpAwarded: number;
  duplicate: boolean;
  chatMessages: ChatMessage[];
  scannedAt: string;
}
