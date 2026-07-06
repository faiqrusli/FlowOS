"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Focus,
  LayoutGrid,
  PanelRightClose,
  PanelRightOpen,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageMode = "full" | "focus" | "work";

const MODES: { id: PageMode; label: string; icon: React.ReactNode }[] = [
  { id: "full", label: "Full", icon: <Sun className="size-3.5" /> },
  { id: "focus", label: "Focus", icon: <Focus className="size-3.5" /> },
  { id: "work", label: "Work", icon: <LayoutGrid className="size-3.5" /> },
];

export function FableTopNav({
  mode,
  onModeChange,
  timelineOpen,
  onToggleTimeline,
  railOpen,
  onToggleRail,
  progressPct,
  remaining,
}: {
  mode: PageMode;
  onModeChange: (m: PageMode) => void;
  timelineOpen: boolean;
  onToggleTimeline: () => void;
  railOpen: boolean;
  onToggleRail: () => void;
  progressPct: number;
  remaining: number;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-divider px-5 py-3">
      {/* date nav */}
      <div className="flex items-center gap-1">
        <Button size="icon-sm" variant="ghost" aria-label="Previous day">
          <ChevronLeft />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold leading-tight text-foreground">
            Today
          </h1>
          <p className="truncate text-[12px] leading-tight text-muted-foreground">
            {today}
          </p>
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="Next day">
          <ChevronRight />
        </Button>
      </div>

      {/* progress */}
      <div className="hidden min-w-[140px] flex-1 items-center gap-2 md:flex">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
          {remaining} left
        </span>
      </div>

      {/* mode segmented control */}
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border/70 bg-muted/50 p-0.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150",
              mode === m.id
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* view toggles */}
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onToggleTimeline}
          aria-label={timelineOpen ? "Hide timeline" : "Show timeline"}
          aria-pressed={timelineOpen}
        >
          {timelineOpen ? <Eye /> : <EyeOff />}
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onToggleRail}
          aria-label={railOpen ? "Collapse right panel" : "Open right panel"}
          aria-pressed={railOpen}
        >
          {railOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
      </div>

      <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground lg:inline">
        Ctrl+Shift+F
      </kbd>
    </header>
  );
}
