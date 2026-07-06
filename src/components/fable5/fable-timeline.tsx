"use client";

import { minutesToLabel, type TimelineBlock } from "@/components/fable5/data";
import { cn } from "@/lib/utils";

const START_HOUR = 8;
const END_HOUR = 18;
const PX_PER_MIN = 1.1;

export function FableTimeline({
  blocks,
  nowMinutes,
}: {
  blocks: TimelineBlock[];
  nowMinutes: number;
}) {
  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i,
  );
  const top = (min: number) => (min - START_HOUR * 60) * PX_PER_MIN;
  const nowTop = top(nowMinutes);
  const showNow = nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;

  return (
    <section className="flow-surface-card flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between px-3.5 py-2.5">
        <h3 className="text-[14px] font-semibold text-foreground">Timeline</h3>
        <span className="text-[12px] text-muted-foreground">Today</span>
      </header>
      <div className="workplace-timeline-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <div
          className="relative"
          style={{ height: (END_HOUR - START_HOUR) * 60 * PX_PER_MIN }}
        >
          {/* hour gridlines */}
          {hours.map((h) => (
            <div
              key={h}
              className="absolute inset-x-0 flex items-center gap-2"
              style={{ top: top(h * 60) }}
            >
              <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground/70">
                {minutesToLabel(h * 60).replace(":00", "")}
              </span>
              <span className="h-px flex-1 bg-divider" />
            </div>
          ))}

          {/* blocks */}
          {blocks.map((b) => (
            <div
              key={b.id}
              className={cn(
                "flow-card-interactive absolute left-12 right-1 overflow-hidden rounded-lg border px-2 py-1",
                b.kind === "meeting" ? "border-dashed" : "border-transparent",
              )}
              style={{
                top: top(b.start) + 1,
                height: Math.max(18, (b.end - b.start) * PX_PER_MIN - 2),
                background:
                  b.kind === "meeting"
                    ? "var(--muted)"
                    : `color-mix(in oklch, ${b.color} 18%, var(--card))`,
                borderLeft: `3px solid ${b.color}`,
              }}
            >
              <p className="truncate text-[12px] font-medium text-foreground">
                {b.label}
              </p>
              <p className="truncate text-[10px] tabular-nums text-muted-foreground">
                {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
              </p>
            </div>
          ))}

          {/* now line */}
          {showNow ? (
            <div
              className="absolute inset-x-0 z-10 flex items-center gap-1"
              style={{ top: nowTop }}
            >
              <span className="ml-9 size-2 rounded-full bg-primary shadow-[0_0_0_3px_var(--selected)]" />
              <span className="h-px flex-1 bg-primary/60" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
