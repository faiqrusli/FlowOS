"use client";

import { Clock, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  TimelinePlanner,
  type TimelinePlannerFocusRequest,
  type TimelinePlannerProps,
} from "@/components/tasks/timeline-planner";
import { TIMELINE_DRAWER_WIDTH_PX } from "@/lib/timeline-drag";
import { cn } from "@/lib/utils";

type TimelineDrawerProps = Omit<TimelinePlannerProps, "variant" | "onClose"> & {
  open: boolean;
  onClose: () => void;
};

function TimelineTabButton({
  onClick,
  active,
  className,
  style,
}: {
  onClick: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
        className={cn(
        "group/timeline-tab relative z-30 flex size-8 items-center justify-center rounded-l-lg border border-r-0 border-border/35 bg-card/95 text-muted-foreground shadow-[0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-colors hover:border-sky-400/30 hover:text-foreground",
        className
      )}
      aria-label={active ? "Collapse Quick Schedule" : "Open Quick Schedule"}
    >
      <Clock
        className={cn(
          "size-4 transition-opacity duration-150 group-hover/timeline-tab:opacity-0",
          active && "text-sky-600"
        )}
      />
      {active ? (
        <PanelRightClose className="absolute size-4 opacity-0 transition-opacity duration-150 group-hover/timeline-tab:opacity-100" />
      ) : (
        <PanelRightOpen className="absolute size-4 opacity-0 transition-opacity duration-150 group-hover/timeline-tab:opacity-100" />
      )}
    </button>
  );
}

export function TimelineDrawer({ open, onClose, ...props }: TimelineDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="relative h-full shrink-0"
      style={{ width: `min(100%, ${TIMELINE_DRAWER_WIDTH_PX}px)` }}
    >
      <TimelineTabButton
        active
        onClick={onClose}
        className="absolute top-1/2 -left-8 -translate-y-1/2"
      />
      <TimelinePlanner variant="drawer" onClose={onClose} {...props} />
    </div>
  );
}

export function TimelineDrawerToggle({
  open,
  detailPanelOffsetPx = 0,
  onToggle,
}: {
  open: boolean;
  detailPanelOffsetPx?: number;
  onToggle: () => void;
}) {
  if (open) return null;

  return (
    <TimelineTabButton
      onClick={onToggle}
      className="absolute top-1/2 -translate-y-1/2"
      style={{ right: detailPanelOffsetPx }}
    />
  );
}
