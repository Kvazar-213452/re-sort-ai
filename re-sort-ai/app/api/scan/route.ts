import { NextResponse } from "next/server";
import { chatCompletion, OpenAIError } from "@/app/lib/openai";
import type { ScanMode, ScanResult, WasteBin } from "@/app/lib/types";

const BINS: readonly WasteBin[] = ["plastic", "paper", "organic", "hazardous", "general"];

const FULL_SCHEMA_HINT = `Respond with strict JSON only, matching this exact shape:
{
  "object": string,              // short name of the item, e.g. "Plastic bottle"
  "material": string,            // e.g. "plastic", "glass", "metal", "paper", "organic", "other"
  "confidence": number,          // 0-100, how confident you are in this identification
  "bin": "plastic" | "paper" | "organic" | "hazardous" | "general",
  "needsCleaning": boolean,      // should it be rinsed or cleaned before disposal
  "recyclable": boolean,
  "decompositionTime": string,   // e.g. "450 years", "2-4 weeks"
  "environmentalImpact": string, // one short sentence
  "reuseIdea": string            // one short, creative reuse or DIY idea
}`;

const FAST_SCHEMA_HINT = `Respond with strict JSON only, matching this exact shape:
{
  "object": string,
  "bin": "plastic" | "paper" | "organic" | "hazardous" | "general",
  "confidence": number // a whole number from 0 to 100, e.g. 92. Never a fraction like 0.92.
}`;

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
      temperature: 0.3,
      max_tokens: 400,
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

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OpenAIError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Could not analyze the image. Please try again." }, { status: 500 });
  }
}

function normalizeBin(value: unknown): WasteBin {
  return BINS.includes(value as WasteBin) ? (value as WasteBin) : "general";
}

function normalizeConfidence(value: unknown): number {
  let n = Number(value);
  if (Number.isNaN(n)) return 0;
  // Some responses return a 0-1 fraction instead of a 0-100 percentage — rescale those.
  if (n > 0 && n <= 1) n *= 100;
  return Math.max(0, Math.min(100, Math.round(n)));
}
