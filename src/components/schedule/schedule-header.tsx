"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTodayHeading } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type ScheduleHeaderProps = {
  onAutoscheduleAll?: () => void;
  autoscheduling?: boolean;
};

export function ScheduleHeader({
  onAutoscheduleAll,
  autoscheduling,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Daily planning
        </p>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {formatTodayHeading()}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Timebox your day — drag tasks onto the calendar, or let FlowOS find the
          next open slot.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onAutoscheduleAll && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-xl border-border/60 bg-card shadow-sm"
            onClick={onAutoscheduleAll}
            disabled={autoscheduling}
          >
            <Sparkles className="size-3.5" />
            {autoscheduling ? "Scheduling..." : "Autoschedule day"}
          </Button>
        )}

        <Button variant="outline" size="sm" className="h-9 rounded-xl">
          Today
        </Button>
        <div className="flex items-center overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-none"
            aria-label="Previous day"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-9 rounded-none"
            aria-label="Next day"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          className="size-9 rounded-xl"
          aria-label="Open calendar"
        >
          <CalendarDays className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground px-3 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/90"
            )}
          >
            <Plus className="size-3.5" />
            Add
            <ChevronDown className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="rounded-xl">
            <DropdownMenuLinkItem href="/tasks">Task</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="/habits">Habit</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="/focus">Focus Session</DropdownMenuLinkItem>
            <DropdownMenuLinkItem href="/reflection">Reflection</DropdownMenuLinkItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
