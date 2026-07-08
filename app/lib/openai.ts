import { config } from "./config";

export class OpenAIError extends Error {}

export async function chatCompletion(body: Record<string, unknown>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIError(
      "OPENAI_API_KEY is not configured. Add it to .env.local and restart the dev server."
    );
  }

  const res = await fetch(config.openai.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || config.openai.defaultModel,
      ...body,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new OpenAIError(`OpenAI request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  return res.json();
}
