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
import { useEffect, useState } from "react";
import { SidebarDetailsPanel } from "@/components/layout/sidebar-details-panel";
import { SidebarNotesPanel } from "@/components/layout/sidebar-notes-panel";
import { SidebarReflectionPanel } from "@/components/layout/sidebar-reflection-panel";
import { SidebarResizeHandle } from "@/components/layout/sidebar-resize-handle";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX,
  type GlobalRightSidebarPanel,
} from "@/lib/global-right-sidebar-persistence";
import {
  globalRailButtonClass,
  globalRailHoverIconClass,
  globalRailPrimaryIconClass,
} from "@/lib/panel-toggle-styles";
import {
  PANEL_LAYOUT_MS,
  panelSlideTransitionStyle,
  panelWidthTransitionStyle,
} from "@/lib/panel-layout-animation";
import { cn } from "@/lib/utils";
import { workspaceRailBackgroundClass } from "@/lib/theme/surface-classes";

const PANEL_ITEMS: {
  id: GlobalRightSidebarPanel;
  label: string;
  icon: typeof ClipboardList;
}[] = [
  { id: "details", label: "Details", icon: ClipboardList },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "reflection", label: "Reflection", icon: NotebookPen },
];

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
  const {
    activePanel,
    expanded,
    width,
    hoverRevealed,
    setHoverRevealed,
    workplaceHoverMode,
    visibleWidthPx,
    openPanel,
    toggleExpanded,
    setWidth,
  } = useGlobalRightSidebar();

  const [showBody, setShowBody] = useState(expanded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (expanded) {
      setShowBody(true);
      return;
    }

    const timer = window.setTimeout(() => setShowBody(false), PANEL_LAYOUT_MS);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  const sidebarVisible =
    expanded || !workplaceHoverMode || hoverRevealed;
  const renderedWidth = mounted && sidebarVisible ? visibleWidthPx : 0;

  return (
    <>
      {workplaceHoverMode && !expanded && (
        <div
          className="fixed inset-y-0 right-0 z-30 w-3"
          onMouseEnter={() => setHoverRevealed(true)}
        />
      )}

      {/* Quiet lift above page canvas — 15% toward card. */}
      <aside
        className={cn(
          "relative flex h-full shrink-0 overflow-hidden border-l border-sidebar-border text-foreground",
          workspaceRailBackgroundClass,
            workplaceHoverMode && "fixed inset-y-0 right-0 z-40",
            !sidebarVisible && workplaceHoverMode && "pointer-events-none opacity-0"
        )}
        style={{
          width: renderedWidth,
          transition: panelWidthTransitionStyle(),
        }}
        onMouseLeave={() => {
          if (workplaceHoverMode && !expanded) {
            setHoverRevealed(false);
          }
        }}
      >
        <div className="flex h-full w-full min-w-0">
          {expanded && (
            <SidebarResizeHandle
              onResizeDelta={(delta) => setWidth(width + delta)}
              onResizeEnd={() => undefined}
            />
          )}

          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
              expanded ? "opacity-100" : "pointer-events-none w-0 opacity-0"
            )}
            style={{
              width: expanded ? Math.max(0, width - GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX) : 0,
              transition: panelSlideTransitionStyle(),
            }}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2.5">
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
              {showBody ? <GlobalRightSidebarBody activePanel={activePanel} /> : null}
            </div>
          </div>

          <div
            className={cn(
              "flex h-full shrink-0 flex-col items-center px-1 py-3",
              // One edge only when collapsed (match left nav). Internal divider only when expanded.
              expanded && "border-l border-sidebar-border"
            )}
            style={{ width: GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX }}
          >
            <button
              type="button"
              onClick={toggleExpanded}
              className={cn("group/panel-toggle", globalRailButtonClass())}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  <PanelRightClose
                    className={globalRailPrimaryIconClass("sm")}
                    aria-hidden
                  />
                  <PanelRightClose
                    className={globalRailHoverIconClass("sm")}
                    aria-hidden
                  />
                </>
              ) : (
                <>
                  <PanelRightOpen
                    className={globalRailPrimaryIconClass("sm")}
                    aria-hidden
                  />
                  <PanelRightOpen
                    className={globalRailHoverIconClass("sm")}
                    aria-hidden
                  />
                </>
              )}
            </button>

            <div className="mt-3 flex w-full flex-col items-center gap-2.5 border-t border-sidebar-border pt-3">
              {PANEL_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activePanel === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openPanel(item.id)}
                    className={globalRailButtonClass(active)}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon className="size-4.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
