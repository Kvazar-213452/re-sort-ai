import type { WasteBin } from "@/domain/bins";

export interface ScanResultFull {
  mode: "full";
  object: string;
  material: string;
  confidence: number;
  bin: WasteBin;
  needsCleaning: boolean;
  recyclable: boolean;
  decompositionTime: string;
  environmentalImpact: string;
  reuseIdea: string;
}

export interface ScanResultFast {
  mode: "fast";
  object: string;
  bin: WasteBin;
  confidence: number;
}

export type ScanResult = ScanResultFull | ScanResultFast;

export type ScanMode = ScanResult["mode"];

export interface XpInfo {
  awarded: number;
  total: number;
  duplicate: boolean;
}

export interface ScanApiResponse {
  result: ScanResult;
  xp: XpInfo | null;
  historyId: string | null;
}
