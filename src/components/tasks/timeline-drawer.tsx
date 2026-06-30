"use client";

import { Clock, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  TimelinePlanner,
  type TimelinePlannerProps,
} from "@/components/tasks/timeline-planner";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleTabClass,
} from "@/lib/panel-toggle-styles";
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
      className={cn(panelToggleTabClass(), className)}
      aria-label={active ? "Collapse Quick Schedule" : "Open Quick Schedule"}
    >
      <Clock className={panelTogglePrimaryIconClass()} />
      {active ? (
        <PanelRightClose className={panelToggleHoverIconClass()} />
      ) : (
        <PanelRightOpen className={panelToggleHoverIconClass()} />
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
