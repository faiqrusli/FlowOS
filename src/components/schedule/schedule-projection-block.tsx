"use client";

import { formatDurationLabel } from "@/lib/schedule-layout";
import { getChannelStyle } from "@/lib/schedule-palette";
import type { ProjectionLayout } from "@/lib/schedule-projections";
import { cn } from "@/lib/utils";

type ScheduleProjectionBlockProps = {
  layout: ProjectionLayout;
};

export function ScheduleProjectionBlock({
  layout,
}: ScheduleProjectionBlockProps) {
  const { item, topPx, heightPx, durationMinutes } = layout;
  const channel = getChannelStyle(item.type, item.priority);

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-3 left-3 z-[5] overflow-hidden rounded-xl border border-dashed shadow-none",
        channel.projection
      )}
      style={{ top: topPx, height: heightPx }}
    >
      <div className={cn("absolute top-0 bottom-0 left-0 w-1", channel.accent)} />
      <div className="flex h-full flex-col justify-center px-3 py-1.5 pl-4 opacity-70">
        <p className="truncate text-[11px] font-semibold tracking-wide uppercase opacity-80">
          Projection
        </p>
        <p className="truncate text-sm font-medium text-foreground/80">
          {item.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {formatDurationLabel(durationMinutes)}
        </p>
      </div>
    </div>
  );
}
