import { BIN_META, DISPLAY_BINS } from "../../lib/bins";
import type { WasteBin } from "../../lib/types";

export function BinLegend({ active }: { active: WasteBin }) {
  return (
    <div className="flex flex-wrap gap-2">
      {DISPLAY_BINS.map((bin) => {
        const meta = BIN_META[bin];
        const isActive = bin === active;
        return (
          <div
            key={bin}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              isActive
                ? `${meta.bg} ${meta.text} animate-pop border-transparent ring-2 ${meta.ring}`
                : "border-border text-muted-foreground opacity-40 grayscale"
            }`}
          >
            <span className={`size-1.5 rounded-full ${meta.dot} ${isActive ? "animate-blink" : ""}`} />
            {meta.label}
          </div>
        );
      })}
    </div>
  );
}