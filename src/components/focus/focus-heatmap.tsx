"use client";

import { useMemo, useState } from "react";
import { buildHeatmapWeeks, type FocusDayMetrics } from "@/lib/focus-analytics";
import { formatDuration } from "@/lib/focus-utils";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { FocusSession } from "@/types/focus";

type FocusHeatmapProps = {
  sessions: FocusSession[];
  loading?: boolean;
};

function intensityClass(focusSeconds: number): string {
  if (focusSeconds <= 0) return "bg-surface-base";
  if (focusSeconds < 900) return "bg-success-muted";
  if (focusSeconds < 3600) return "bg-success/25";
  if (focusSeconds < 7200) return "bg-success/45";
  return "bg-success/70";
}

function HeatmapCell({
  day,
  onHover,
}: {
  day: FocusDayMetrics;
  onHover: (day: FocusDayMetrics | null) => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "size-3 rounded-sm transition-colors sm:size-3.5",
        intensityClass(day.focusSeconds),
      )}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(day)}
      onBlur={() => onHover(null)}
      aria-label={`${day.date}: ${formatDuration(day.focusSeconds)} focused`}
    />
  );
}

export function FocusHeatmap({ sessions, loading }: FocusHeatmapProps) {
  const weeks = useMemo(() => buildHeatmapWeeks(sessions, 16), [sessions]);
  const [hovered, setHovered] = useState<FocusDayMetrics | null>(null);

  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Focus heatmap</h2>
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className={typography.bodyMuted}>Loading heatmap…</p>
        ) : (
          <>
            <div className="overflow-x-auto pb-1">
              <div className="inline-flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <HeatmapCell
                        key={day.date}
                        day={day}
                        onHover={setHovered}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="min-h-[3rem] rounded-lg bg-surface-base px-3 py-2 text-xs">
              {hovered ? (
                <>
                  <p className="font-medium text-foreground">{hovered.date}</p>
                  <p className="mt-0.5 text-foreground-secondary">
                    Focused {formatDuration(hovered.focusSeconds)} ·{" "}
                    {hovered.sessionCount}{" "}
                    {hovered.sessionCount === 1 ? "session" : "sessions"}
                  </p>
                </>
              ) : (
                <p className="text-foreground-secondary">
                  Hover a cell to see date, focused duration, and sessions.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
