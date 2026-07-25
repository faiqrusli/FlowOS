"use client";

import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  NotebookPen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import Link from "next/link";
import { SidebarDetailsPanel } from "@/components/layout/sidebar-details-panel";
import { SidebarNotesPanel } from "@/components/layout/sidebar-notes-panel";
import { SidebarReflectionPanel } from "@/components/layout/sidebar-reflection-panel";
import { SidebarResizeHandle } from "@/components/layout/sidebar-resize-handle";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX,
  GLOBAL_RIGHT_RAIL_OUTER_GUTTER_PX,
  GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX,
  type GlobalRightSidebarPanel,
} from "@/lib/global-right-sidebar-persistence";
import {
  globalRailButtonClass,
  globalRailHoverIconClass,
  globalRailPrimaryIconClass,
  shellRailIconRowClass,
} from "@/lib/panel-toggle-styles";
import { PANEL_LAYOUT_EASE } from "@/lib/panel-layout-animation";
import { cn } from "@/lib/utils";
import { workspaceRailBackgroundClass } from "@/lib/theme/surface-classes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PANEL_ITEMS: {
  id: GlobalRightSidebarPanel;
  label: string;
  icon: typeof ClipboardList;
}[] = [
  { id: "details", label: "Details", icon: ClipboardList },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "reflection", label: "Reflection", icon: NotebookPen },
];

/** Slightly slower than shared panel chrome so open/close reads softer. */
const RIGHT_SIDEBAR_MOTION_MS = 220;
const NAV_TOOLTIP_DELAY_MS = 500;

const PANEL_SLIDE_TRANSITION = `transform ${RIGHT_SIDEBAR_MOTION_MS}ms ${PANEL_LAYOUT_EASE}`;
const railTooltipContentClass =
  "px-2.5 py-1 font-medium whitespace-nowrap text-popover-foreground";

function GlobalRightSidebarBody({
  activePanel,
}: {
  activePanel: GlobalRightSidebarPanel;
}) {
  switch (activePanel) {
    case "notes":
      return <SidebarNotesPanel />;
    case "reflection":
      return <SidebarReflectionPanel />;
    default:
      return <SidebarDetailsPanel />;
  }
}

/** Expanded header title — rail keeps short "Details" label. */
function panelHeaderTitle(activePanel: GlobalRightSidebarPanel): string {
  if (activePanel === "details") {
    // Habit Details when a habit drawer path exists; tasks use Task Details.
    return "Task Details";
  }
  return PANEL_ITEMS.find((item) => item.id === activePanel)?.label ?? "";
}

/** Full-page destination for drawer panels that have a matching route. */
function panelPageHref(activePanel: GlobalRightSidebarPanel): string | null {
  if (activePanel === "notes") return "/notes";
  if (activePanel === "reflection") return "/reflection";
  return null;
}

export function GlobalRightSidebar() {
  const { activePanel, expanded, width, openPanel, toggleExpanded, setWidth } =
    useGlobalRightSidebar();

  // One shared content width for Details / Notes / Reflection.
  // Drag-resize persists; switching panels must not change width.
  const panelWidth = Math.max(0, width - GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX);
  const railRightOffset = GLOBAL_RIGHT_RAIL_OUTER_GUTTER_PX;
  const panelRightOffset = GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX;

  return (
    <>
      {/* Permanent collapsed spacer — expand never reflows page content. */}
      <div
        className="h-full shrink-0"
        style={{ width: GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX }}
        aria-hidden
      />

      {/* Sliding panel — transform only; rail is a separate fixed layer.
          Outer overflow stays visible so left-edge drawer shadow isn’t clipped. */}
      <div
        className={cn(
          "flow-shell-right-drawer fixed inset-y-0 z-50 flex flex-col text-foreground",
          expanded && "flow-shell-right-drawer-elevated",
          !expanded && "pointer-events-none",
        )}
        style={{
          right: panelRightOffset,
          width: panelWidth,
          transform: expanded ? "translateX(0)" : "translateX(100%)",
          transition: PANEL_SLIDE_TRANSITION,
          willChange: "transform",
        }}
        aria-hidden={!expanded}
      >
        {/* Content drops on the same click as collapse — empty canvas slides away. */}
        {expanded ? (
          <>
            <SidebarResizeHandle
              onResizeDelta={(delta) => setWidth(width + delta)}
              onResizeEnd={() => undefined}
            />

            <div className="flex h-[43px] shrink-0 items-center justify-between gap-2 px-3 [&>*]:translate-y-px">
              <h2 className="text-sm font-semibold tracking-tight">
                {panelHeaderTitle(activePanel)}
              </h2>
              {panelPageHref(activePanel) ? (
                <Link
                  href={panelPageHref(activePanel)!}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-surface-hover hover:text-muted-foreground"
                  aria-label={`Open ${panelHeaderTitle(activePanel).toLowerCase()} page`}
                  title={`Open ${panelHeaderTitle(activePanel).toLowerCase()} page`}
                >
                  <ExternalLink className="size-4" />
                </Link>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <GlobalRightSidebarBody activePanel={activePanel} />
            </div>
          </>
        ) : null}
      </div>

      {/* Icon rail — quiet strip; soft surface contrast + near-invisible edge.
          Shadow only when collapsed — open drawer owns the left cast. */}
      <div
        className={cn(
          "flow-border-hairline-l fixed inset-y-0 z-50 flex h-full flex-col items-center px-2 pt-1.5 text-foreground",
          workspaceRailBackgroundClass,
          !expanded && "flow-shell-right-rail-elevated",
        )}
        style={{
          right: railRightOffset,
          width: GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX,
        }}
      >
        <div className={shellRailIconRowClass}>
          <Tooltip>
            <TooltipTrigger
              delay={NAV_TOOLTIP_DELAY_MS}
              render={
                <button
                  type="button"
                  onClick={toggleExpanded}
                  className={cn("group/panel-toggle", globalRailButtonClass())}
                  aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                  aria-expanded={expanded}
                />
              }
            >
              <PanelRightOpen
                className={cn(
                  globalRailPrimaryIconClass("sm"),
                  expanded && "opacity-0",
                )}
                aria-hidden
              />
              <PanelRightOpen
                className={cn(
                  globalRailHoverIconClass("sm"),
                  expanded && "!opacity-0",
                )}
                aria-hidden
              />
              <PanelRightClose
                className={cn(
                  "absolute inset-0 m-auto size-4.5 transition-opacity duration-[180ms] ease-out",
                  expanded
                    ? "opacity-100 group-hover/panel-toggle:opacity-0"
                    : "opacity-0",
                )}
                aria-hidden
              />
              <PanelRightClose
                className={cn(
                  "absolute inset-0 m-auto size-4.5 opacity-0 transition-opacity duration-[180ms] ease-out",
                  expanded && "group-hover/panel-toggle:opacity-100",
                )}
                aria-hidden
              />
            </TooltipTrigger>
            <TooltipContent
              side="left"
              sideOffset={8}
              className={railTooltipContentClass}
            >
              {expanded ? "Collapse sidebar" : "Expand sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-1 flex w-full flex-col items-center gap-1">
          {PANEL_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePanel === item.id;

            return (
              <div key={item.id} className={shellRailIconRowClass}>
                <Tooltip>
                  <TooltipTrigger
                    delay={NAV_TOOLTIP_DELAY_MS}
                    render={
                      <button
                        type="button"
                        onClick={() => openPanel(item.id)}
                        className={globalRailButtonClass(active)}
                        aria-label={item.label}
                      />
                    }
                  >
                    <Icon className="size-4.5" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    sideOffset={8}
                    className={railTooltipContentClass}
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
