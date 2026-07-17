"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, PanelLeft, X } from "lucide-react";
import {
  sidebarPrimaryItem,
  sidebarWorkspaceItems,
  type SidebarNavItem,
} from "@/config/sidebar-navigation";
import { SidebarAccountMenu } from "@/components/sidebar/sidebar-account-menu";
import {
  getUserDisplayName,
  getUserInitials,
  getUserRole,
} from "@/lib/user-profile";
import { createClient } from "@/lib/supabase/client";
import {
  getSidebarCollapsed,
  setSidebarCollapsed,
} from "@/lib/sidebar-preference";
import {
  PANEL_LAYOUT_EASE,
  PANEL_LAYOUT_MS,
} from "@/lib/panel-layout-animation";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_WIDTH_EXPANDED = 210;
/** Primary nav rail — icon column stays put on expand. */
const SIDEBAR_WIDTH_COLLAPSED = 56;
/** Horizontal padding on nav lists (`px-2` = 8×2). */
const SIDEBAR_NAV_INLINE_PAD_PX = 16;
/** Icon column inside padded nav — keeps centers locked with the brand mark. */
const SIDEBAR_ICON_COLUMN_PX =
  SIDEBAR_WIDTH_COLLAPSED - SIDEBAR_NAV_INLINE_PAD_PX;

const SIDEBAR_WIDTH_TRANSITION = `width ${PANEL_LAYOUT_MS}ms ${PANEL_LAYOUT_EASE}`;
/** Collapsed-rail label delay — matches shell nav tooltip timing. */
const NAV_TOOLTIP_DELAY_MS = 500;

const navTooltipContentClass =
  "px-2.5 py-1 font-medium whitespace-nowrap text-popover-foreground";

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary",
        className,
      )}
    >
      <span className="text-[12px] font-semibold tracking-tight text-sidebar-primary-foreground">
        F
      </span>
    </div>
  );
}

function SidebarToggleIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Stay on chrome — do not use canvas `bg-background` inside the sidebar.
        "flex size-7 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent/60",
        className,
      )}
    >
      <PanelLeft className="size-3.5 stroke-[1.5] text-sidebar-foreground/70" />
    </div>
  );
}

type SidebarPanelProps = {
  pathname: string;
  displayName: string;
  initials: string;
  userRole: string;
  signingOut: boolean;
  collapsed: boolean;
  animateWidth: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
  /** When true, aside is position:fixed and does not push the page. */
  overlay?: boolean;
};

function SidebarBrand({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div className="flex h-[47px] w-full shrink-0 items-center">
      {/* Logo column = collapsed rail width — F never moves */}
      <div
        className="flex h-full shrink-0 items-center justify-center"
        style={{ width: SIDEBAR_WIDTH_COLLAPSED }}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="group/logo relative size-7 rounded-md"
            aria-label="Open sidebar"
          >
            <SidebarLogoMark className="transition-opacity duration-150 group-hover/logo:opacity-0" />
            <SidebarToggleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/logo:opacity-100" />
          </button>
        ) : (
          <SidebarLogoMark />
        )}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden pr-3 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed
            ? "pointer-events-none opacity-0"
            : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        <div className="min-w-0 leading-none">
          <p className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
            FlowOS
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="shrink-0 rounded-md transition-colors duration-150 hover:bg-sidebar-accent/70"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          tabIndex={collapsed ? -1 : 0}
        >
          <SidebarToggleIcon />
        </button>
      </div>
    </div>
  );
}

function SidebarNavLink({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: SidebarNavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  const linkClassName = cn(
    "group/nav relative flex h-9 w-full items-center overflow-hidden rounded-md text-[13.5px] transition-[background-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
    isActive
      ? "font-medium text-foreground"
      : "font-normal text-muted-foreground",
    !collapsed && isActive && "bg-primary-soft",
    !collapsed &&
      !isActive &&
      "hover:bg-surface-hover hover:text-foreground",
  );

  const linkBody = (
    <>
      {/* Fixed icon column — same geometry collapsed/expanded so icons never shift. */}
      <span
        className="flex h-9 shrink-0 items-center justify-center p-px"
        style={{ width: SIDEBAR_ICON_COLUMN_PX }}
      >
        <span
          className={cn(
            "flex size-full items-center justify-center overflow-hidden rounded-md transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isActive
              ? collapsed
                ? "bg-primary-soft"
                : undefined
              : "group-hover/nav:bg-surface-hover",
          )}
        >
          <Icon
            className={cn(
              "size-[18px] shrink-0 stroke-[1.75] transition-colors duration-150",
              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover/nav:text-foreground",
            )}
          />
        </span>
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate whitespace-nowrap pr-2.5 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "opacity-0" : "opacity-100",
        )}
        aria-hidden={collapsed}
      >
        {item.label}
      </span>
    </>
  );

  return (
    <Tooltip>
      <TooltipTrigger
        delay={NAV_TOOLTIP_DELAY_MS}
        disabled={!collapsed}
        render={
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-label={collapsed ? item.label : undefined}
            aria-current={isActive ? "page" : undefined}
            className={linkClassName}
          />
        }
      >
        {linkBody}
      </TooltipTrigger>
      {collapsed ? (
        <TooltipContent
          side="right"
          sideOffset={8}
          className={navTooltipContentClass}
        >
          {item.label}
        </TooltipContent>
      ) : null}
    </Tooltip>
  );
}

function SidebarNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pt-2.5 pb-3">
      <ul className="space-y-1 px-2">
        <li>
          <SidebarNavLink
            item={sidebarPrimaryItem}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </li>
      </ul>

      {/* Same divider + spacing in both states so icon Y positions stay locked */}
      <div
        className="mx-2.5 my-1.5 border-t border-sidebar-border/50"
        role="separator"
        aria-hidden
      />

      <ul className="space-y-1 px-2">
        {sidebarWorkspaceItems.map((item) => (
          <li key={item.href}>
            <SidebarNavLink
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SidebarPanel({
  pathname,
  displayName,
  initials,
  userRole,
  signingOut,
  collapsed,
  animateWidth,
  onToggleCollapse,
  onLogout,
  onNavigate,
  className,
  overlay = false,
}: SidebarPanelProps) {
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  // Navigation chrome — shared environment with canvas; never a content surface.
  return (
    <aside
      style={{
        width,
        transition: animateWidth ? SIDEBAR_WIDTH_TRANSITION : undefined,
      }}
      className={cn(
        // In-flow rail: border-r (not outer shadow) — overflow-hidden would clip a 1px shadow.
        "flex h-full shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-surface-nav text-sidebar-foreground",
        overlay && "fixed inset-y-0 left-0 z-40",
        className,
      )}
    >
      <SidebarBrand collapsed={collapsed} onToggleCollapse={onToggleCollapse} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SidebarNav
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
        <SidebarAccountMenu
          displayName={displayName}
          initials={initials}
          userRole={userRole}
          signingOut={signingOut}
          onLogout={onLogout}
          onNavigate={onNavigate}
          compact={collapsed}
        />
      </div>
    </aside>
  );
}

type AppSidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function AppSidebar({
  mobileOpen,
  onMobileOpenChange,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
    setSidebarReady(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      setSidebarCollapsed(next);
      return next;
    });
  }

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onMobileOpenChange(false);
  }, [pathname, onMobileOpenChange]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const displayName = getUserDisplayName(user);
  const initials = useMemo(() => getUserInitials(displayName), [displayName]);
  const userRole = useMemo(() => getUserRole(user), [user]);

  const panelProps: Omit<
    SidebarPanelProps,
    "className" | "onNavigate" | "overlay"
  > = {
    pathname,
    displayName,
    initials,
    userRole,
    signingOut,
    collapsed,
    animateWidth: sidebarReady,
    onToggleCollapse: toggleCollapsed,
    onLogout: handleLogout,
  };

  return (
    <>
      {/* In-flow rail — expand/collapse pushes the main content with the width. */}
      <SidebarPanel {...panelProps} className="flex" />

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px] dark:bg-black/55"
            onClick={() => onMobileOpenChange(false)}
          />
          <div
            className="relative h-full"
            style={{
              width: `min(${SIDEBAR_WIDTH_EXPANDED}px, 85vw)`,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <button
              type="button"
              onClick={() => onMobileOpenChange(false)}
              aria-label="Close navigation menu"
              className="absolute top-3.5 right-3 z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <X className="size-4 stroke-[1.5]" />
            </button>
            <SidebarPanel
              {...panelProps}
              collapsed={false}
              animateWidth={false}
              overlay={false}
              onNavigate={() => onMobileOpenChange(false)}
              className="h-full border-r-0"
            />
          </div>
        </div>
      )}
    </>
  );
}

type MobileSidebarTriggerProps = {
  onOpen: () => void;
};

export function MobileSidebarTrigger({ onOpen }: MobileSidebarTriggerProps) {
  return (
    // Merges into canvas — `--background`, not a floating `--surface` band.
    <header className="flex h-[47px] shrink-0 items-center gap-3 border-b border-divider bg-surface-nav px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
      >
        <Menu className="size-4.5 stroke-[1.5]" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarLogoMark />
        <span className="truncate text-sm font-semibold tracking-tight">
          FlowOS
        </span>
      </div>
    </header>
  );
}
