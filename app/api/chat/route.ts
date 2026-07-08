import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { config } from "@/app/lib/config";
import { chatCompletion, OpenAIError } from "@/app/lib/openai";
import type { ChatMessage } from "@/app/lib/types";

const SYSTEM_PROMPT =
  "You are Eco Assistant, a friendly waste-sorting and sustainability expert inside the ReSort AI app. " +
  "Answer questions about recycling, waste disposal, and reducing household waste. Keep answers short " +
  "(2-4 sentences), practical, and reference the colored-bin system when relevant: blue = plastic, " +
  "yellow = paper, green = organic, red = hazardous.";

export async function POST(request: Request) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Sign in to chat with the Eco Assistant." }, { status: 401 });
  }

  let payload: { messages?: ChatMessage[] };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = payload.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  try {
    const data = await chatCompletion({
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-config.chat.historyLimit)],
      temperature: config.chat.temperature,
      max_tokens: config.chat.maxTokens,
    });

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "The AI returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof OpenAIError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Could not reach the assistant. Please try again." }, { status: 500 });
  }
}
