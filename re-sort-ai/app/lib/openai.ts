const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

export class OpenAIError extends Error {}

export async function chatCompletion(body: Record<string, unknown>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIError(
      "OPENAI_API_KEY is not configured. Add it to .env.local and restart the dev server."
    );
  }

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      ...body,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new OpenAIError(`OpenAI request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  return res.json();
}
