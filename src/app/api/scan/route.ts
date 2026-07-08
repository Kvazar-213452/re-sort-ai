import { NextResponse } from "next/server";
import { getOptionalUser } from "@/server/session";
import { config } from "@/config";
import { chatCompletion, OpenAIError } from "@/server/clients/openai-client";
import {
  FAST_SCHEMA_HINT,
  FULL_SCHEMA_HINT,
  normalizeBin,
  normalizeConfidence,
  normalizeXp,
  recordScan,
} from "@/server/services/scan-service";
import type { ScanApiResponse, ScanMode, ScanResult } from "@/types/scan";

export async function POST(request: Request) {
  let payload: { image?: string; mode?: ScanMode };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { image, mode = "full" } = payload;
  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  try {
    const data = await chatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are ReSort AI, a waste-sorting vision assistant. Identify the single main object in the photo " +
            "and explain how it should be disposed of. " +
            (mode === "fast" ? FAST_SCHEMA_HINT : FULL_SCHEMA_HINT),
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this object and how to sort it." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: config.scan.temperature,
      max_tokens: config.scan.maxTokens,
    });

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "The AI returned an empty response." }, { status: 502 });
    }

    const parsed = JSON.parse(content);
    const result: ScanResult =
      mode === "fast"
        ? {
            mode: "fast",
            object: String(parsed.object ?? "Unknown object"),
            bin: normalizeBin(parsed.bin),
            confidence: normalizeConfidence(parsed.confidence),
          }
        : {
            mode: "full",
            object: String(parsed.object ?? "Unknown object"),
            material: String(parsed.material ?? "unknown"),
            confidence: normalizeConfidence(parsed.confidence),
            bin: normalizeBin(parsed.bin),
            needsCleaning: Boolean(parsed.needsCleaning),
            recyclable: Boolean(parsed.recyclable),
            decompositionTime: String(parsed.decompositionTime ?? "Unknown"),
            environmentalImpact: String(parsed.environmentalImpact ?? ""),
            reuseIdea: String(parsed.reuseIdea ?? ""),
          };

    const user = await getOptionalUser();
    const recorded = user ? await recordScan(image, result, normalizeXp(parsed.xpReward), user) : null;

    const response: ScanApiResponse = {
      result,
      xp: recorded?.xp ?? null,
      historyId: recorded?.historyId ?? null,
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof OpenAIError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Could not analyze the image. Please try again." }, { status: 500 });
  }
}
