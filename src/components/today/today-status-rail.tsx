"use client";

import { LayoutGrid } from "lucide-react";
import { TodayEscapeLink } from "@/components/shared/today-escape-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTodayHeading } from "@/lib/date-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import type { WorkplaceDensity } from "@/lib/workplace-density";
import { cn } from "@/lib/utils";

const DENSITY_LABELS: Record<WorkplaceDensity, string> = {
  full: "Full",
  work: "Work",
  focus: "Focus",
};

type TodayStatusRailProps = {
  loading?: boolean;
  onTrack: OnTrackStatus;
  density: WorkplaceDensity;
  onDensityChange: (density: WorkplaceDensity) => void;
};

export function TodayStatusRail({
  loading,
  onTrack,
  density,
  onDensityChange,
}: TodayStatusRailProps) {
  const dateLabel = loading ? "…" : formatTodayHeading();
  const onTrackLabel = loading ? "…" : `${onTrack.percent}% on track`;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-6 py-1 text-[13px] text-muted-foreground lg:pl-10">
      <span className="font-medium text-foreground">{dateLabel}</span>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <span>{onTrackLabel}</span>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <TodayEscapeLink
        href="/schedule"
        className="h-7 rounded-full px-2.5 text-[13px]"
      >
        Timeline
      </TodayEscapeLink>
      <span aria-hidden className="text-muted-foreground/50">
        ·
      </span>
      <TodayEscapeLink
        href="/notes"
        className="h-7 rounded-full px-2.5 text-[13px]"
      >
        Notes
      </TodayEscapeLink>

      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            )}
            aria-label={`Workspace density: ${DENSITY_LABELS[density]}`}
            title="Workspace density"
          >
            <LayoutGrid className="size-3.5 shrink-0" />
            {DENSITY_LABELS[density]}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="min-w-[8rem]">
            {(Object.keys(DENSITY_LABELS) as WorkplaceDensity[]).map((preset) => (
              <DropdownMenuItem
                key={preset}
                onClick={() => onDensityChange(preset)}
                className={cn(
                  "text-[13px]",
                  preset === density && "bg-muted font-medium"
                )}
              >
                {DENSITY_LABELS[preset]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
