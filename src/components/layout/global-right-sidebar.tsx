"use client";

import {
  BookOpen,
  ChevronLeft,
  ClipboardList,
  ExternalLink,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  GLOBAL_RAIL_ICON_CLASS,
  globalRailButtonClass,
  globalRailButtonStyle,
  globalRailCollapseButtonClass,
  globalRailCollapseButtonStyle,
  globalRailIconStyle,
} from "@/lib/panel-toggle-styles";
import {
  PANEL_LAYOUT_MS,
  panelShellTransitionStyle,
  panelSlideTransitionStyle,
} from "@/lib/panel-layout-animation";
import {
  SHELL_HEADER_HEIGHT_PX,
  SHELL_UTILITY_HEADER_ACTION_ICON_PX,
  SHELL_UTILITY_HEADER_ACTION_PX,
  SHELL_UTILITY_HEADER_PADDING_PX,
  SHELL_UTILITY_RAIL_GAP_PX,
  SHELL_UTILITY_RAIL_TOP_PX,
  SHELL_UTILITY_RAIL_WIDTH_PX,
} from "@/lib/shell-dimensions";
import { cn } from "@/lib/utils";
import {
  workspaceDrawerPanelClass,
  workspaceRailBackgroundClass,
} from "@/lib/theme/surface-classes";

const RAIL_WIDTH_PX = GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX;

const PANEL_ITEMS: {
  id: GlobalRightSidebarPanel;
  label: string;
  openLabel: string;
  icon: typeof ClipboardList;
}[] = [
  {
    id: "details",
    label: "Task Details",
    openLabel: "Open Task Details",
    icon: ClipboardList,
  },
  { id: "notes", label: "Notes", openLabel: "Open Notes", icon: BookOpen },
  {
    id: "reflection",
    label: "Reflection",
    openLabel: "Open Reflection",
    icon: NotebookPen,
  },
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

function panelHeaderTitle(activePanel: GlobalRightSidebarPanel): string {
  return PANEL_ITEMS.find((item) => item.id === activePanel)?.label ?? "";
}

function panelPageHref(activePanel: GlobalRightSidebarPanel): string | null {
  if (activePanel === "notes") return "/notes";
  if (activePanel === "reflection") return "/reflection";
  return null;
}

function UtilityHeaderAction({
  href,
  label,
  onClick,
  children,
}: {
  href?: string;
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const className =
    "flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground";
  const style = {
    width: SHELL_UTILITY_HEADER_ACTION_PX,
    height: SHELL_UTILITY_HEADER_ACTION_PX,
  };

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        aria-label={label}
        title={label}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={style}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function UtilityRailButtons({
  activePanel,
  expanded,
  onOpenPanel,
}: {
  activePanel: GlobalRightSidebarPanel;
  expanded: boolean;
  onOpenPanel: (panel: GlobalRightSidebarPanel) => void;
}) {
  return (
    <>
      {PANEL_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = expanded && activePanel === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenPanel(item.id)}
            className={globalRailButtonClass(active)}
            style={globalRailButtonStyle()}
            aria-label={item.openLabel}
            title={item.label}
            aria-pressed={active}
          >
            <Icon className={GLOBAL_RAIL_ICON_CLASS} style={globalRailIconStyle()} />
          </button>
        );
      })}
    </>
  );
}

function UtilityPanelHeader({
  activePanel,
}: {
  activePanel: GlobalRightSidebarPanel;
}) {
  const pageHref = panelPageHref(activePanel);

  return (
    <header
      className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle"
      style={{
        height: SHELL_HEADER_HEIGHT_PX,
        paddingInline: SHELL_UTILITY_HEADER_PADDING_PX,
      }}
    >
      <h2 className="min-w-0 truncate text-base font-semibold tracking-tight">
        {panelHeaderTitle(activePanel)}
      </h2>
      {pageHref ? (
        <UtilityHeaderAction
          href={pageHref}
          label={`Open ${panelHeaderTitle(activePanel).toLowerCase()} page`}
        >
          <ExternalLink
            style={{
              width: SHELL_UTILITY_HEADER_ACTION_ICON_PX,
              height: SHELL_UTILITY_HEADER_ACTION_ICON_PX,
            }}
            strokeWidth={1.75}
          />
        </UtilityHeaderAction>
      ) : null}
    </header>
  );
}

function UtilityRailColumn({
  activePanel,
  expanded,
  onCollapse,
  onOpenPanel,
}: {
  activePanel: GlobalRightSidebarPanel;
  expanded: boolean;
  onCollapse: () => void;
  onOpenPanel: (panel: GlobalRightSidebarPanel) => void;
}) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col items-center",
        workspaceRailBackgroundClass,
        expanded ? "border-l border-border-subtle/60" : undefined
      )}
      style={{ width: SHELL_UTILITY_RAIL_WIDTH_PX }}
    >
      {/* Shared 68px header band — collapse control only when panel is open */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center",
          expanded && "border-b border-border-subtle"
        )}
        style={{
          height: SHELL_HEADER_HEIGHT_PX,
          width: "100%",
        }}
      >
        {expanded ? (
          <button
            type="button"
            onClick={onCollapse}
            className={globalRailCollapseButtonClass()}
            style={globalRailCollapseButtonStyle()}
            aria-label="Collapse utility panel"
            aria-expanded={true}
          >
            <ChevronLeft
              className={GLOBAL_RAIL_ICON_CLASS}
              style={globalRailIconStyle()}
            />
          </button>
        ) : null}
      </div>
      <div
        className="flex flex-col items-center"
        style={{
          paddingTop: SHELL_UTILITY_RAIL_TOP_PX,
          gap: SHELL_UTILITY_RAIL_GAP_PX,
        }}
      >
        <UtilityRailButtons
          activePanel={activePanel}
          expanded={expanded}
          onOpenPanel={onOpenPanel}
        />
      </div>
    </aside>
  );
}

/**
 * Unified right utility sidebar — persistent rail + optional elevated panel.
 *
 * Only the spacer participates in the AppShell flex row. The visual shell is
 * `position: fixed` inside a zero-size flex slot so its width is not reserved twice
 * (that double-count caused the black gap / restricted main workspace).
 */
export function GlobalRightSidebar() {
  const {
    activePanel,
    expanded,
    width,
    overlayMode,
    openPanel,
    toggleExpanded,
    setExpanded,
    adjustWidthByDelta,
    persistSidebarWidth,
  } = useGlobalRightSidebar();

  const [showBody, setShowBody] = useState(expanded);
  const [isResizing, setIsResizing] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) {
      setShowBody(true);
      return;
    }

    const timer = window.setTimeout(() => setShowBody(false), PANEL_LAYOUT_MS);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const target = event.target as Node | null;
      if (target && shellRef.current?.contains(target)) {
        event.preventDefault();
        setExpanded(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, setExpanded]);

  const shellWidth = expanded ? width : RAIL_WIDTH_PX;
  const contentWidthPx = Math.max(0, width - SHELL_UTILITY_RAIL_WIDTH_PX);
  const widthTransition = isResizing ? "none" : panelShellTransitionStyle();
  const layoutReservePx = overlayMode
    ? RAIL_WIDTH_PX
    : expanded
      ? width
      : RAIL_WIDTH_PX;

  return (
    <>
      <div
        className="h-full shrink-0"
        style={{
          width: layoutReservePx,
          transition: widthTransition,
        }}
        aria-hidden
      />

      {/* Zero-size flex item — fixed shell must not consume a second flex width */}
      <div className="pointer-events-none relative h-0 w-0 shrink-0 overflow-visible">
        <div
          ref={shellRef}
          className={cn(
            "pointer-events-auto fixed inset-y-0 right-0 z-[21] flex overflow-hidden",
            !expanded &&
              cn("border-l border-border-subtle", workspaceRailBackgroundClass)
          )}
          style={{
            width: shellWidth,
            transition: widthTransition,
          }}
        >
          {expanded ? (
            <SidebarResizeHandle
              onResizeStart={() => setIsResizing(true)}
              onResizeDelta={adjustWidthByDelta}
              onResizeEnd={() => {
                setIsResizing(false);
                persistSidebarWidth();
              }}
            />
          ) : null}

          {expanded ? (
            <div
              className={cn(
                "flow-shell-right-drawer relative flex min-h-0 min-w-0 flex-1 flex-col",
                workspaceDrawerPanelClass,
                showBody ? "opacity-100" : "opacity-0"
              )}
              style={{
                width: contentWidthPx,
                transition: isResizing ? "none" : panelSlideTransitionStyle(),
              }}
            >
              <UtilityPanelHeader activePanel={activePanel} />
              <div className="min-h-0 flex-1 overflow-hidden">
                {showBody ? (
                  <GlobalRightSidebarBody activePanel={activePanel} />
                ) : null}
              </div>
            </div>
          ) : null}

          <UtilityRailColumn
            activePanel={activePanel}
            expanded={expanded}
            onCollapse={toggleExpanded}
            onOpenPanel={openPanel}
          />
        </div>
      </div>
    </>
  );
}
