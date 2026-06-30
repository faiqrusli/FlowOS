"use client";

import type { LucideIcon } from "lucide-react";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleSquareClass,
} from "@/lib/panel-toggle-styles";
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

  return (
    <aside
      className={cn(
        "flex h-full w-full shrink-0 flex-col bg-card shadow-sm",
        onRight ? "border-l border-border/40" : "border-r border-border/40",
        expanded &&
          (onRight
            ? "animate-in slide-in-from-right-4 duration-200"
            : "animate-in slide-in-from-left-4 duration-200"),
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
        {expanded ? (
          <h2 className="min-w-0 truncate text-sm font-semibold leading-none tracking-tight">
            {title}
          </h2>
        ) : null}
      </div>

      {expanded ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {hasContent ? children : emptyState}
        </div>
      ) : null}
    </aside>
  );
}
