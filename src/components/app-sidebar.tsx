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
        // Stay on chrome — do not use canvas `bg-background` inside the sidebar.
        "flex size-7 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent/60",
        className
      )}
    >
      <PanelLeft className="size-4 stroke-[1.5] text-sidebar-foreground/70" />
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
      <div className="relative z-20 flex shrink-0 justify-center overflow-visible border-b border-sidebar-border py-3.5">
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
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3 pb-3.5 pt-3.5">
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
        className="shrink-0 rounded-md transition-colors duration-150 hover:bg-sidebar-accent/70"
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
            <p className="mb-2 px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground/75">
              {section.label}
            </p>
          )}
          <ul className="space-y-0.5">
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
                      "group/nav relative flex h-9 items-center rounded-lg text-[13.5px] transition-[background-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
                      isActive
                        ? "bg-primary-soft font-medium text-foreground shadow-[inset_3px_0_0_0_var(--primary)]"
                        : "font-normal text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[17px] shrink-0 stroke-[1.75] transition-colors duration-150",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover/nav:text-foreground/75"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {collapsed && (
                      <span
                        role="tooltip"
                        className="flow-surface-elevated pointer-events-none absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden -translate-y-1/2 scale-95 whitespace-nowrap px-2.5 py-1 text-xs font-medium text-popover-foreground opacity-0 transition-[opacity,transform] duration-150 group-hover/nav:block group-hover/nav:scale-100 group-hover/nav:opacity-100"
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

  // Navigation chrome — darker than canvas; never a content surface.
  return (
    <aside
      style={{ width }}
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border-subtle bg-surface-nav text-sidebar-foreground",
        animateWidth &&
          "transition-[width] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
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
    // Merges into canvas — `--background`, not a floating `--surface` band.
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-divider bg-background px-4 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open navigation menu"
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
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
