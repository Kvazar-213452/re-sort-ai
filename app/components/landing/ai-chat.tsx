import { MessageCircle, Recycle, Send } from "lucide-react";
import { Reveal } from "../ui/reveal";

const messages = [
  { from: "user" as const, text: "Where do I throw away batteries?" },
  {
    from: "ai" as const,
    text: "Batteries are hazardous waste. Don't put them in regular trash — drop them off at an electronics store or supermarket collection point.",
  },
  { from: "user" as const, text: "Can old clothes be recycled?" },
  {
    from: "ai" as const,
    text: "Yes! Clean clothes can go in a textile bin or thrift store, while damaged ones can be recycled into rags.",
  },
];

export function AiChat() {
  return (
    <section id="assistant" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
            <MessageCircle className="size-3.5 text-accent" />
            AI Eco Assistant
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Ask a question, get an answer</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            When a photo isn&apos;t enough, just ask. Eco Assistant explains where to throw away anything, whether a
            material is recyclable, and how to cut down on household waste.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "where do I throw away batteries?",
              "can old clothes be recycled?",
              "how do I reduce waste at home?",
            ].map((q) => (
              <li key={q} className="group flex items-center gap-2">
                <Recycle className="size-3.5 shrink-0 text-accent transition-transform duration-300 group-hover:rotate-45" />
                &ldquo;{q}&rdquo;
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-black/5 sm:p-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <MessageCircle className="size-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">Eco Assistant</div>
                <div className="text-xs text-muted-foreground">always online</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 350}ms` }}
                  className={`max-w-[85%] animate-fade-up rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.from === "user"
                      ? "self-end rounded-br-sm bg-accent text-accent-foreground"
                      : "self-start rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
              Ask about sorting...
              <Send className="ml-auto size-3.5 shrink-0 text-accent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}