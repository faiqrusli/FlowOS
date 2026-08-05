"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
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
import {
  PANEL_LAYOUT_EASE,
  PANEL_LAYOUT_MS,
  panelSlideTransitionStyle,
} from "@/lib/panel-layout-animation";
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

const NAV_TOOLTIP_DELAY_MS = 500;
const COMPACT_MQ = "(max-width: 1023px)";

const CONTENT_FADE = `opacity ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;

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

function panelHeaderTitle(activePanel: GlobalRightSidebarPanel): string {
  if (activePanel === "details") {
    return "Task Details";
  }
  return PANEL_ITEMS.find((item) => item.id === activePanel)?.label ?? "";
}

function panelPageHref(activePanel: GlobalRightSidebarPanel): string | null {
  if (activePanel === "notes") return "/notes";
  if (activePanel === "reflection") return "/reflection";
  return null;
}

/**
 * Desktop: vertical utility rail + side drawer (transform slide, like left nav ease).
 * Compact (< lg): rail/spacer hidden — CompactUtilityFab; panel is a bottom sheet.
 */
export function GlobalRightSidebar() {
  const { activePanel, expanded, width, openPanel, toggleExpanded, setWidth } =
    useGlobalRightSidebar();
  const [compact, setCompact] = useState(false);
  const [showContent, setShowContent] = useState(expanded);

  const panelWidth = Math.max(0, width - GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX);
  const railRightOffset = GLOBAL_RIGHT_RAIL_OUTER_GUTTER_PX;
  const panelRightOffset = GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX;

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MQ);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Keep panel body mounted through the slide so close feels like left-nav fade.
  useEffect(() => {
    if (expanded) {
      // Keep content mounted during the sidebar's open transition.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize transition state with the external open flag
      setShowContent(true);
      return;
    }
    const timer = window.setTimeout(() => setShowContent(false), PANEL_LAYOUT_MS);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  const drawerTransform = compact
    ? expanded
      ? "translateY(0)"
      : "translateY(100%)"
    : expanded
      ? "translateX(0)"
      : "translateX(100%)";

  return (
    <>
      <div
        className="hidden h-full shrink-0 lg:block"
        style={{ width: GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX }}
        aria-hidden
      />

      <button
        type="button"
        aria-label="Collapse sidebar"
        tabIndex={expanded ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[48] bg-black/45 transition-opacity lg:hidden",
          expanded ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{
          transitionDuration: `${PANEL_LAYOUT_MS}ms`,
          transitionTimingFunction: PANEL_LAYOUT_EASE,
        }}
        onClick={toggleExpanded}
      />

      {/* Sliding panel — transform only (same easing as left nav width). */}
      <div
        className={cn(
          "flow-shell-right-drawer fixed z-50 flex flex-col text-foreground",
          compact
            ? "inset-x-0 bottom-0 h-[min(85dvh,720px)] w-full rounded-t-2xl"
            : "inset-y-0 right-0 h-full rounded-none",
          expanded && "flow-shell-right-drawer-elevated",
          !expanded && "pointer-events-none",
        )}
        style={
          {
            ...(compact
              ? {}
              : {
                  right: panelRightOffset,
                  width: panelWidth,
                }),
            transform: drawerTransform,
            transition: panelSlideTransitionStyle(),
            willChange: "transform",
          } as CSSProperties
        }
        aria-hidden={!expanded}
      >
        {showContent ? (
          <div
            className="flex h-full min-h-0 flex-col"
            style={{
              opacity: expanded ? 1 : 0,
              transition: CONTENT_FADE,
            }}
          >
            {!compact ? (
              <SidebarResizeHandle
                onResizeDelta={(delta) => setWidth(width + delta)}
                onResizeEnd={() => undefined}
              />
            ) : null}

            <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-3 [&>*]:translate-y-px lg:h-[43px]">
              <h2 className="text-sm font-semibold tracking-tight">
                {panelHeaderTitle(activePanel)}
              </h2>
              <div className="flex items-center gap-1">
                {panelPageHref(activePanel) ? (
                  <Link
                    href={panelPageHref(activePanel)!}
                    className="flex size-10 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-surface-hover hover:text-muted-foreground lg:size-6"
                    aria-label={`Open ${panelHeaderTitle(activePanel).toLowerCase()} page`}
                    title={`Open ${panelHeaderTitle(activePanel).toLowerCase()} page`}
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={toggleExpanded}
                  className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
                  aria-label="Close"
                >
                  <PanelRightClose className="size-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <GlobalRightSidebarBody activePanel={activePanel} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop icon rail only — compact uses CompactUtilityFab. */}
      <div
        className={cn(
          "flow-border-hairline-l fixed inset-y-0 z-50 hidden h-full flex-col items-center px-2 pt-1.5 text-foreground lg:flex",
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
