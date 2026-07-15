"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Menu, PanelLeft, X, type LucideProps } from "lucide-react";
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
  SHELL_BRAND_LETTER_PX,
  SHELL_BRAND_LOGO_PX,
  SHELL_BRAND_LOGO_RADIUS_PX,
  SHELL_BRAND_WORDMARK_PX,
  SHELL_HEADER_HEIGHT_PX,
  SHELL_NAV_ICON_COLUMN_PX,
  SHELL_NAV_ICON_PX,
  SHELL_NAV_ITEM_GAP_PX,
  SHELL_NAV_LABEL_SLOT_PX,
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
const NAV_ACTIVE_ROW = "bg-primary-soft font-semibold text-foreground";

function NavActiveIndicator({ collapsed }: { collapsed: boolean }) {
  const inset = collapsed
    ? -((SHELL_SIDEBAR_COLLAPSED_WIDTH_PX - SHELL_NAV_ROW_PX) / 2)
    : 0;

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

/** Single F mark — identical in collapsed and expanded. */
function SidebarLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "box-border flex shrink-0 items-center justify-center bg-sidebar-primary",
        className
      )}
      style={{
        width: SHELL_BRAND_LOGO_PX,
        height: SHELL_BRAND_LOGO_PX,
        borderRadius: SHELL_BRAND_LOGO_RADIUS_PX,
      }}
    >
      <span
        className="font-semibold leading-none tracking-tight text-sidebar-primary-foreground"
        style={{ fontSize: SHELL_BRAND_LETTER_PX }}
      >
        F
      </span>
    </div>
  );
}

function SidebarToggleIcon({ className }: { className?: string }) {
  return (
    <PanelLeft
      className={cn(
        "size-[18px] shrink-0 stroke-[1.75] text-sidebar-foreground/70",
        className
      )}
    />
  );
}

/** Fixed 18×18 optical box — prevents SVG viewBox variance. */
function NavIcon({
  icon: Icon,
  active,
}: {
  icon: ComponentType<LucideProps>;
  active: boolean;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      style={{ width: SHELL_NAV_ICON_PX, height: SHELL_NAV_ICON_PX }}
      aria-hidden
    >
      <Icon
        className={cn(
          "shrink-0 stroke-[1.75] transition-colors duration-150",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover/nav:text-foreground/75"
        )}
        width={SHELL_NAV_ICON_PX}
        height={SHELL_NAV_ICON_PX}
      />
    </span>
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

/**
 * Brand row — logo lives in a fixed collapsed-width column so X/Y never change.
 * Expansion reveals FlowOS + collapse control to the right only.
 */
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
        "box-border flex shrink-0 items-center border-b border-border-subtle",
        sidebarNavGeometryTransitionClass(),
        !collapsed && "pr-3"
      )}
      style={{
        height: SHELL_HEADER_HEIGHT_PX,
        minHeight: SHELL_HEADER_HEIGHT_PX,
        maxHeight: SHELL_HEADER_HEIGHT_PX,
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: SHELL_NAV_ICON_COLUMN_PX }}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="group/logo relative flex items-center justify-center"
            style={{
              width: SHELL_BRAND_LOGO_PX,
              height: SHELL_BRAND_LOGO_PX,
              borderRadius: SHELL_BRAND_LOGO_RADIUS_PX,
            }}
            aria-label="Expand sidebar"
          >
            <SidebarLogoMark className="transition-opacity duration-150 group-hover/logo:opacity-0" />
            <span
              className="absolute inset-0 flex items-center justify-center border border-sidebar-border bg-sidebar-accent/60 opacity-0 transition-opacity duration-150 group-hover/logo:opacity-100"
              style={{ borderRadius: SHELL_BRAND_LOGO_RADIUS_PX }}
            >
              <SidebarToggleIcon />
            </span>
          </button>
        ) : (
          <SidebarLogoMark />
        )}
      </div>

      <div
        className={cn(
          "flex items-center overflow-hidden",
          sidebarNavGeometryTransitionClass(),
          collapsed
            ? "pointer-events-none w-0 min-w-0 flex-none opacity-0"
            : "min-w-0 flex-1"
        )}
        style={{ gap: SHELL_BRAND_GAP_PX }}
        aria-hidden={collapsed}
      >
        <p
          className="min-w-0 flex-1 truncate font-semibold leading-none tracking-tight text-sidebar-foreground"
          style={{ fontSize: SHELL_BRAND_WORDMARK_PX, fontWeight: 600 }}
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
          tabIndex={collapsed ? -1 : 0}
        >
          <SidebarToggleIcon />
        </button>
      </div>
    </div>
  );
}

/**
 * Section label slot — always reserved. Text visible only when expanded.
 * Prevents HOME/WORKSPACE from shifting nav icon Y on expand/collapse.
 */
function SidebarSectionLabel({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-end"
      style={{
        height: SHELL_NAV_LABEL_SLOT_PX,
        paddingLeft: collapsed ? 0 : 20,
        paddingRight: collapsed ? 0 : 12,
      }}
    >
      <p
        className={cn(
          "w-full truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/75",
          collapsed && "invisible"
        )}
      >
        {label}
      </p>
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
          className={sidebarNavGeometryTransitionClass()}
          style={{
            marginTop: sectionIndex > 0 ? SHELL_NAV_SECTION_GAP_PX : undefined,
          }}
        >
          <SidebarSectionLabel label={section.label} collapsed={collapsed} />
          <ul
            className="flex flex-col"
            style={{ gap: SHELL_NAV_ITEM_GAP_PX }}
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
                      "group/nav relative flex items-center text-sm",
                      sidebarNavGeometryTransitionClass(),
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
                            justifyContent: "center",
                          }
                        : {
                            height: SHELL_NAV_ROW_PX,
                            borderRadius: SHELL_NAV_RADIUS_PX,
                            marginRight: 12,
                          }
                    }
                  >
                    {isActive ? (
                      <NavActiveIndicator collapsed={collapsed} />
                    ) : null}

                    {collapsed ? (
                      <NavIcon icon={Icon} active={isActive} />
                    ) : (
                      <>
                        <span
                          className="inline-flex shrink-0 items-center justify-center"
                          style={{ width: SHELL_NAV_ICON_COLUMN_PX }}
                        >
                          <NavIcon icon={Icon} active={isActive} />
                        </span>
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate pr-3",
                            isActive ? "font-semibold" : "font-normal"
                          )}
                        >
                          {item.label}
                        </span>
                      </>
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
        "flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-surface-nav text-sidebar-foreground",
        collapsed && "overflow-visible",
        className
      )}
    >
      <SidebarBrand collapsed={collapsed} onToggleCollapse={onToggleCollapse} />

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
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
        <span className="truncate font-semibold tracking-tight" style={{ fontSize: SHELL_BRAND_WORDMARK_PX }}>
          FlowOS
        </span>
      </div>
    </header>
  );
}
