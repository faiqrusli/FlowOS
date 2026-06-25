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
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const SIDEBAR_WIDTH_EXPANDED = 256;
const SIDEBAR_WIDTH_COLLAPSED = 56;

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary",
        className
      )}
    >
      <span className="text-[11px] font-semibold tracking-tight text-sidebar-primary-foreground">
        F
      </span>
    </div>
  );
}

function SidebarToggleIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background",
        className
      )}
    >
      <PanelLeft className="size-4 stroke-[1.5] text-foreground/70" />
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
};

function SidebarBrand({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  if (collapsed) {
    return (
      <div className="relative z-20 flex shrink-0 justify-center overflow-visible border-b border-sidebar-border/25 py-3.5">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="group/logo relative size-7 rounded-md"
          aria-label="Open sidebar"
        >
          <SidebarLogoMark className="transition-opacity duration-150 group-hover/logo:opacity-0" />
          <SidebarToggleIcon className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover/logo:opacity-100" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/25 px-3 pb-3.5 pt-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarLogoMark />
        <div className="min-w-0 leading-none">
          <p className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
            FlowOS
          </p>
          <p className="mt-0.5 truncate text-[10px] leading-snug text-muted-foreground/60">
            Personal Productivity OS
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleCollapse}
        className="shrink-0 rounded-md transition-colors hover:bg-muted/60"
        aria-label="Collapse sidebar"
        title="Collapse sidebar"
      >
        <SidebarToggleIcon />
      </button>
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
        "min-h-0 flex-1 py-3",
        collapsed ? "overflow-visible px-2" : "overflow-y-auto px-3"
      )}
    >
      {sidebarSections.map((section, sectionIndex) => (
        <div
          key={section.label}
          className={cn(sectionIndex > 0 && (collapsed ? "mt-3" : "mt-5"))}
        >
          {!collapsed && (
            <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {section.label}
            </p>
          )}
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.label : undefined}
                    className={cn(
                      "group/nav relative flex h-9 items-center rounded-lg text-[14px] font-normal transition-colors",
                      collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
                      isActive
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground/85"
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute w-0.5 rounded-full bg-foreground/80",
                          collapsed
                            ? "bottom-2 left-1 top-2"
                            : "bottom-1.5 left-0 top-1.5"
                        )}
                      />
                    )}
                    <Icon className="size-[18px] shrink-0 stroke-[1.75] text-foreground/45 group-hover/nav:text-foreground/65" />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {collapsed && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover/nav:block"
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
      style={{ width }}
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border/25 bg-sidebar text-sidebar-foreground",
        animateWidth && "transition-[width] duration-200 ease-out",
        collapsed && "overflow-visible",
        className
      )}
    >
      <SidebarBrand
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

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
        style={{ width: effectiveWidth }}
      >
        <SidebarPanel {...panelProps} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => onMobileOpenChange(false)}
          />
          <div
            className="relative h-full shadow-xl"
            style={{ width: `min(${SIDEBAR_WIDTH_EXPANDED}px, 85vw)` }}
          >
            <button
              type="button"
              onClick={() => onMobileOpenChange(false)}
              aria-label="Close navigation menu"
              className="absolute top-3.5 right-3 z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/35 bg-background px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Menu className="size-4 stroke-[1.5]" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarLogoMark />
        <div className="min-w-0 leading-none">
          <span className="block truncate text-sm font-semibold tracking-tight">
            FlowOS
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground/60">
            Personal Productivity OS
          </span>
        </div>
      </div>
    </header>
  );
}
