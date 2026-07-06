import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/app/lib/auth";
import { chatCompletion, OpenAIError } from "@/app/lib/openai";
import { getHistoryCollection } from "@/app/lib/history";
import type { ChatMessage, ScanResult } from "@/app/lib/types";

const SYSTEM_PROMPT =
  "You are Eco Assistant inside the ReSort AI app. The user is asking about a specific item they scanned with " +
  "their camera — you can see a photo of it. Answer questions about how to dispose of it, whether it's " +
  "recyclable, reuse ideas, and its environmental impact. Keep answers short (2-4 sentences) and practical, " +
  "referencing the colored-bin system when relevant: blue = plastic, yellow = paper, green = organic, red = hazardous.";

function summarizeResult(result: ScanResult): string {
  if (result.mode === "full") {
    return (
      `Object: ${result.object}. Material: ${result.material}. Bin: ${result.bin}. ` +
      `Recyclable: ${result.recyclable ? "yes" : "no"}. Needs cleaning: ${result.needsCleaning ? "yes" : "no"}. ` +
      `Decomposition time: ${result.decompositionTime}. Environmental impact: ${result.environmentalImpact}`
    );
  }
  return `Object: ${result.object}. Bin: ${result.bin}.`;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to chat about this scan." }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Scan not found." }, { status: 404 });
  }

  let payload: { message?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = payload.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }

  try {
    const history = await getHistoryCollection();
    const doc = await history.findOne({ _id: new ObjectId(id), userId: user._id });
    if (!doc) {
      return NextResponse.json({ error: "Scan not found." }, { status: 404 });
    }

    const priorMessages = (doc.chatMessages ?? []).slice(-10);
    const userMessage: ChatMessage = { role: "user", content: message };

    const data = await chatCompletion({
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nScan result for this item: ${summarizeResult(doc.result)}` },
        {
          role: "user",
          content: [
            { type: "text", text: "Here is the photo I scanned." },
            { type: "image_url", image_url: { url: doc.image } },
          ],
        },
        ...priorMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "The AI returned an empty response." }, { status: 502 });
    }

    const assistantMessage: ChatMessage = { role: "assistant", content: reply };

    await history.updateOne(
      { _id: doc._id },
      { $push: { chatMessages: { $each: [userMessage, assistantMessage] } } }
    );

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof OpenAIError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const message2 = error instanceof Error ? error.message : "Could not reach the assistant. Please try again.";
    return NextResponse.json({ error: message2 }, { status: 500 });
  }
}