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
const RIGHT_SIDEBAR_MOTION_MS = 340;
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

  // Panel occupies everything left of the fixed icon rail.
  const panelWidth = Math.max(
    0,
    width - GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX,
  );
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

      {/* Sliding panel — transform only; rail is a separate fixed layer. */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col overflow-hidden border-l border-border-subtle text-foreground",
          workspaceRailBackgroundClass,
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

            <div className="flex h-[49px] shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3">
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

      {/* Icon rail — inset strip with clear L/R borders; never translates. */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col items-center gap-0 border-x border-border-strong px-1 text-foreground",
          workspaceRailBackgroundClass,
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
                  "absolute inset-0 m-auto size-4.5 transition-opacity duration-150",
                  expanded
                    ? "opacity-100 group-hover/panel-toggle:opacity-0"
                    : "opacity-0",
                )}
                aria-hidden
              />
              <PanelRightClose
                className={cn(
                  "absolute inset-0 m-auto size-4.5 opacity-0 transition-opacity duration-150",
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
    </>
  );
}
