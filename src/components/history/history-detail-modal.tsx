"use client";

import { useEffect, useState } from "react";
import { Check, Droplet, Leaf, Sparkles, X } from "lucide-react";
import { BIN_META } from "@/domain/bins";
import { formatRelativeTime } from "@/utils/format";
import { ScanChat } from "@/components/scan/scan-chat";
import type { ScanHistoryEntry } from "@/types/history";

export function HistoryDetailModal({ entryId, onClose }: { entryId: string; onClose: () => void }) {
  const [entry, setEntry] = useState<ScanHistoryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetching the selected scan whenever entryId changes is a legitimate
    // effect — there's no external-store equivalent for an async request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntry(null);
    setError(null);
    fetch(`/api/history/${entryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEntry(data.entry);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this scan."));
  }, [entryId]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scan details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}

        {!entry && !error && <p className="mt-6 text-center text-sm text-muted-foreground">Loading...</p>}

        {entry && (
          <div className="mt-4 space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.image} alt={entry.result.object} className="h-full w-full object-cover" />
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{entry.result.object}</h3>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${BIN_META[entry.result.bin].bg} ${BIN_META[entry.result.bin].text}`}
              >
                <span className={`size-1.5 rounded-full ${BIN_META[entry.result.bin].dot}`} />
                {BIN_META[entry.result.bin].label}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatRelativeTime(entry.scannedAt)}</span>
              <span className="flex items-center gap-1">
                <Sparkles className="size-3" />
                {entry.result.confidence}% confidence
              </span>
            </div>

            {entry.result.mode === "full" && (
              <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-muted px-3 py-2.5">
                    <div className="text-xs text-muted-foreground">Material</div>
                    <div className="mt-0.5 font-medium capitalize">{entry.result.material}</div>
                  </div>
                  <div className="rounded-xl bg-muted px-3 py-2.5">
                    <div className="text-xs text-muted-foreground">Recyclable</div>
                    <div className="mt-0.5 flex items-center gap-1 font-medium">
                      {entry.result.recyclable ? (
                        <Check className="size-3.5 text-accent" />
                      ) : (
                        <X className="size-3.5 text-red-500" />
                      )}
                      {entry.result.recyclable ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Droplet className="size-4 shrink-0 text-accent" />
                    {entry.result.needsCleaning ? "Rinse before disposing" : "No cleaning needed"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="size-4 shrink-0 text-accent" />
                    Decomposes in {entry.result.decompositionTime}
                  </div>
                </div>

                {entry.result.reuseIdea && (
                  <div className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{entry.result.reuseIdea}</span>
                  </div>
                )}
              </>
            )}

            <ScanChat
              key={entry.id}
              historyId={entry.id}
              objectName={entry.result.object}
              initialMessages={entry.chatMessages}
            />
          </div>
        )}
      </div>
    </div>
  );
}