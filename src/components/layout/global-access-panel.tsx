"use client";

import type { LucideIcon } from "lucide-react";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleSquareClass,
} from "@/lib/panel-toggle-styles";
import {
  PANEL_LAYOUT_MS,
  panelSlideTransitionStyle,
} from "@/lib/panel-layout-animation";
import { cn } from "@/lib/utils";

export const GLOBAL_ACCESS_PANEL_WIDTH_PX = 240;
export const GLOBAL_ACCESS_PANEL_COLLAPSED_WIDTH_PX = 32;

export type GlobalAccessPanelProps = {
  icon: LucideIcon;
  title: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  side?: "left" | "right";
};

export function GlobalAccessPanel({
  icon: Icon,
  title,
  expanded,
  onToggleExpanded,
  children,
  emptyState,
  className,
  side = "right",
}: GlobalAccessPanelProps) {
  const hasContent = Boolean(children);
  const onRight = side === "right";
  const CollapseIcon = onRight ? PanelRightClose : PanelLeftClose;
  const ExpandIcon = onRight ? PanelRightOpen : PanelLeftOpen;
  const [showBody, setShowBody] = useState(expanded);

  useEffect(() => {
    if (expanded) {
      setShowBody(true);
      return;
    }

    const timer = window.setTimeout(() => setShowBody(false), PANEL_LAYOUT_MS);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  return (
    <aside
      className={cn(
        "flex h-full w-full shrink-0 flex-col bg-card shadow-sm",
        onRight ? "border-l border-border/40" : "border-r border-border/40",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-border/30",
          expanded ? "gap-1.5 px-2 py-2" : "justify-center px-0.5 py-1.5"
        )}
      >
        <button
          type="button"
          onClick={onToggleExpanded}
          className={panelToggleSquareClass(expanded ? "md" : "sm")}
          aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={expanded}
        >
          <Icon className={panelTogglePrimaryIconClass()} aria-hidden />
          {expanded ? (
            <CollapseIcon className={panelToggleHoverIconClass()} />
          ) : (
            <ExpandIcon className={panelToggleHoverIconClass()} />
          )}
        </button>
        <h2
          className={cn(
            "min-w-0 truncate text-sm font-semibold leading-none tracking-tight",
            expanded ? "opacity-100" : "pointer-events-none w-0 opacity-0"
          )}
          style={{ transition: panelSlideTransitionStyle() }}
        >
          {title}
        </h2>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-hidden",
          expanded
            ? "translate-x-0 opacity-100"
            : onRight
              ? "pointer-events-none translate-x-3 opacity-0"
              : "pointer-events-none -translate-x-3 opacity-0"
        )}
        style={{ transition: panelSlideTransitionStyle() }}
      >
        {showBody ? (
          <div className="h-full overflow-y-auto">
            {hasContent ? children : emptyState}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
