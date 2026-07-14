"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, PanelLeft, X } from "lucide-react";
import { sidebarSections } from "@/config/sidebar-navigation";
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
import { dispatchShellLayoutChange } from "@/contexts/global-right-sidebar-context";
import {
  sidebarNavGeometryTransitionClass,
  sidebarWidthTransitionStyle,
} from "@/lib/sidebar-layout-animation";
import {
  SHELL_ACTIVE_INDICATOR_HEIGHT_PX,
  SHELL_BRAND_GAP_PX,
  SHELL_BRAND_LOGO_PX,
  SHELL_HEADER_HEIGHT_PX,
  SHELL_NAV_ICON_PX,
  SHELL_NAV_ITEM_GAP_PX,
  SHELL_NAV_RADIUS_PX,
  SHELL_NAV_ROW_PX,
  SHELL_NAV_SECTION_GAP_PX,
  SHELL_NAV_TOP_PADDING_PX,
  SHELL_SECONDARY_CONTROL_PX,
  SHELL_SIDEBAR_COLLAPSED_WIDTH_PX,
  SHELL_SIDEBAR_EXPANDED_WIDTH_PX,
} from "@/lib/shell-dimensions";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const SIDEBAR_WIDTH_EXPANDED = SHELL_SIDEBAR_EXPANDED_WIDTH_PX;
const SIDEBAR_WIDTH_COLLAPSED = SHELL_SIDEBAR_COLLAPSED_WIDTH_PX;
const NAV_ICON_CLASS = "shrink-0 stroke-[1.75]";
const NAV_ACTIVE_ROW = "bg-primary-soft font-semibold text-foreground";

function NavActiveIndicator({ collapsed }: { collapsed: boolean }) {
  const inset = collapsed
    ? -((SHELL_SIDEBAR_COLLAPSED_WIDTH_PX - SHELL_NAV_ROW_PX) / 2)
    : -12;

  return (
    <span
      className="flow-shell-nav-active-indicator"
      style={{
        left: inset,
        height: SHELL_ACTIVE_INDICATOR_HEIGHT_PX,
      }}
      aria-hidden
    />
  );
}

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLogoMark({
  className,
  size = SHELL_BRAND_LOGO_PX,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] bg-sidebar-primary",
        className
      )}
      style={{ width: size, height: size }}
    >
      <span className="text-sm font-semibold tracking-tight text-sidebar-primary-foreground">
        F
      </span>
    </div>
  );
}

function SidebarToggleIcon({ className }: { className?: string }) {
  return (
    <PanelLeft
      className={cn(
        "size-[18px] stroke-[1.75] text-sidebar-foreground/70",
        className
      )}
    />
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
};

function SidebarBrand({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-b border-border-subtle",
        sidebarNavGeometryTransitionClass(),
        collapsed ? "justify-center" : "px-4"
      )}
      style={{ height: SHELL_HEADER_HEIGHT_PX }}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="group/logo relative flex items-center justify-center rounded-[10px]"
          style={{
            width: SHELL_BRAND_LOGO_PX,
            height: SHELL_BRAND_LOGO_PX,
          }}
          aria-label="Expand sidebar"
        >
          <SidebarLogoMark
            className="transition-opacity duration-150 group-hover/logo:opacity-0"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-[10px] border border-sidebar-border bg-sidebar-accent/60 opacity-0 transition-opacity duration-150 group-hover/logo:opacity-100">
            <SidebarToggleIcon />
          </span>
        </button>
      ) : (
        <>
          <SidebarLogoMark />
          <p
            className="min-w-0 flex-1 truncate font-semibold tracking-tight text-sidebar-foreground"
            style={{
              marginLeft: SHELL_BRAND_GAP_PX,
              fontSize: 19,
              lineHeight: 1.2,
            }}
          >
            FlowOS
          </p>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex shrink-0 items-center justify-center rounded-[10px] border border-sidebar-border bg-sidebar-accent/60 transition-colors duration-150 hover:bg-sidebar-accent"
            style={{
              width: SHELL_SECONDARY_CONTROL_PX,
              height: SHELL_SECONDARY_CONTROL_PX,
            }}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <SidebarToggleIcon />
          </button>
        </>
      )}
    </div>
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
    <nav
      className={cn(
        "relative min-h-0 flex-1",
        sidebarNavGeometryTransitionClass(),
        collapsed ? "overflow-visible" : "overflow-y-auto"
      )}
      style={{ paddingTop: SHELL_NAV_TOP_PADDING_PX }}
    >
      {sidebarSections.map((section, sectionIndex) => (
        <div
          key={section.label}
          className={cn("relative", sidebarNavGeometryTransitionClass())}
          style={{
            marginTop: sectionIndex === 1 ? SHELL_NAV_SECTION_GAP_PX : undefined,
          }}
        >
          {!collapsed && (
            <p
              className="pointer-events-none absolute left-5 right-3 truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/75"
              style={
                sectionIndex === 0
                  ? {
                      /* Sit inside nav top padding, below brand divider — not through it */
                      top: -SHELL_NAV_TOP_PADDING_PX + 2,
                    }
                  : {
                      /* Sit inside the section gap above workspace items */
                      top: -SHELL_NAV_SECTION_GAP_PX + 2,
                    }
              }
            >
              {section.label}
            </p>
          )}
          <ul
            className="flex flex-col"
            style={{ gap: collapsed ? SHELL_NAV_ITEM_GAP_PX : 0 }}
          >
            {section.items.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <li
                  key={item.href}
                  className={cn(
                    collapsed ? "flex justify-center" : "w-full",
                    sidebarNavGeometryTransitionClass()
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group/nav relative flex items-center text-sm ease-[cubic-bezier(0.22,1,0.36,1)]",
                      sidebarNavGeometryTransitionClass(),
                      collapsed ? "justify-center" : "font-normal",
                      isActive
                        ? NAV_ACTIVE_ROW
                        : "font-normal text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                    style={
                      collapsed
                        ? {
                            width: SHELL_NAV_ROW_PX,
                            height: SHELL_NAV_ROW_PX,
                            borderRadius: SHELL_NAV_RADIUS_PX,
                          }
                        : {
                            height: SHELL_NAV_ROW_PX,
                            marginInline: 12,
                            paddingLeft: 15,
                            paddingRight: 16,
                            gap: 14,
                            borderRadius: SHELL_NAV_RADIUS_PX,
                          }
                    }
                  >
                    {isActive ? (
                      <NavActiveIndicator collapsed={collapsed} />
                    ) : null}
                    <Icon
                      className={cn(
                        NAV_ICON_CLASS,
                        "transition-colors duration-150",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover/nav:text-foreground/75"
                      )}
                      style={{
                        width: SHELL_NAV_ICON_PX,
                        height: SHELL_NAV_ICON_PX,
                      }}
                    />
                    {!collapsed && (
                      <span
                        className={cn(
                          "min-w-0 truncate",
                          isActive ? "font-semibold" : "font-normal"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                    {collapsed && (
                      <span
                        role="tooltip"
                        className="flow-surface-elevated flow-shell-nav-tooltip absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden whitespace-nowrap px-2.5 py-1 text-xs font-medium text-popover-foreground group-hover/nav:block"
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
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
}: SidebarPanelProps) {
  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <aside
      style={{
        width,
        transition: animateWidth ? sidebarWidthTransitionStyle() : undefined,
      }}
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border-subtle bg-surface-nav text-sidebar-foreground",
        collapsed && "overflow-visible",
        className
      )}
    >
      <SidebarBrand collapsed={collapsed} onToggleCollapse={onToggleCollapse} />

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          collapsed ? "overflow-visible" : "overflow-hidden"
        )}
      >
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

export function AppSidebar({ mobileOpen, onMobileOpenChange }: AppSidebarProps) {
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
      queueMicrotask(() => dispatchShellLayoutChange());
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

  const effectiveWidth = collapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED;

  const panelProps: Omit<SidebarPanelProps, "className" | "onNavigate"> = {
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
      <div
        className="hidden h-full shrink-0 lg:block"
        style={{
          width: effectiveWidth,
          transition: sidebarReady ? sidebarWidthTransitionStyle() : undefined,
        }}
      >
        <SidebarPanel {...panelProps} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
    <header
      className="flow-shell-topbar flex shrink-0 items-center gap-3 border-b border-border-subtle bg-background px-4 lg:hidden"
      style={{ height: SHELL_HEADER_HEIGHT_PX }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
      >
        <Menu className="size-4 stroke-[1.5]" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <SidebarLogoMark />
        <span className="truncate text-[19px] font-semibold tracking-tight">
          FlowOS
        </span>
      </div>
    </header>
  );
}
