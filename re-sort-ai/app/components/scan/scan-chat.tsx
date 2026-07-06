"use client";

import { useState } from "react";
import { Eye, Send } from "lucide-react";
import type { ChatMessage } from "../../lib/types";

export function ScanChat({
  historyId,
  objectName,
  initialMessages = [],
}: {
  historyId: string;
  objectName: string;
  initialMessages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/history/${historyId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Eye className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Ask about this scan</div>
          <div className="truncate text-xs text-muted-foreground">Eco Assistant can see the photo of {objectName}</div>
        </div>
      </div>

      <div className="flex max-h-80 min-h-24 flex-col gap-3 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Try asking: &ldquo;Is this actually recyclable where I live?&rdquo;
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] animate-fade-up rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              message.role === "user"
                ? "self-end rounded-br-sm bg-accent text-accent-foreground"
                : "self-start rounded-bl-sm bg-muted text-foreground"
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && (
          <div className="flex animate-fade-up items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && send()}
          placeholder="Ask about this item..."
          className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-300 enabled:hover:scale-110 disabled:opacity-40"
        >
          <Send className="size-3.5" />
        </button>
      </div>
    </div>
  );
}