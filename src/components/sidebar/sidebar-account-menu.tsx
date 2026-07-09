"use client";

import {
  ChevronDown,
  CircleHelp,
  LogOut,
  Palette,
  Settings,
  UserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettingsModal } from "@/contexts/settings-modal-context";
import type { SettingsModalSection } from "@/types/settings-modal";
import { cn } from "@/lib/utils";

type SidebarAccountMenuProps = {
  displayName: string;
  initials: string;
  userRole: string;
  signingOut: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  compact?: boolean;
};

export function SidebarAccountMenu({
  displayName,
  initials,
  userRole,
  signingOut,
  onLogout,
  onNavigate,
  compact = false,
}: SidebarAccountMenuProps) {
  const { openSettings } = useSettingsModal();

  function openSection(section: SettingsModalSection) {
    onNavigate?.();
    openSettings(section);
  }

  return (
    <div className={cn("shrink-0 pt-2 pb-3", compact ? "px-2" : "px-3")}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={compact ? displayName : undefined}
          className={cn(
            // Quiet on chrome — menu popover carries card elevation, not the trigger.
            "group/account relative flex items-center rounded-xl text-left transition-colors duration-150",
            compact
              ? "mx-auto size-9 justify-center border-transparent bg-transparent p-0 hover:bg-sidebar-accent"
              : "w-full gap-2.5 border border-sidebar-border bg-transparent px-2.5 py-2 hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent"
          )}
        >
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
            aria-hidden
          >
            {initials}
          </div>
          {!compact && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-[11px] leading-tight text-muted-foreground">
                  {userRole}
                </p>
              </div>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-180"
                strokeWidth={2}
              />
            </>
          )}
          {compact && (
            <span
              role="tooltip"
              className="flow-surface-elevated pointer-events-none absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden -translate-y-1/2 scale-95 whitespace-nowrap px-2.5 py-1 text-xs font-medium text-popover-foreground opacity-0 transition-[opacity,transform] duration-150 group-hover/account:block group-hover/account:scale-100 group-hover/account:opacity-100"
            >
              {displayName}
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[15rem] rounded-xl p-1.5"
          side="top"
          align={compact ? "center" : "start"}
          sideOffset={8}
        >
          <DropdownMenuItem
            className="rounded-md px-2.5 py-2"
            onClick={() => openSection("account")}
          >
            <UserRound />
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-md px-2.5 py-2"
            onClick={() => openSection("settings")}
          >
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-md px-2.5 py-2"
            onClick={() => openSection("appearance")}
          >
            <Palette />
            Appearance
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-md px-2.5 py-2"
            onClick={() => openSection("help")}
          >
            <CircleHelp />
            Help & Feedback
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            disabled={signingOut}
            className="rounded-md px-2.5 py-2 text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
            onClick={() => {
              onNavigate?.();
              void onLogout();
            }}
          >
            <LogOut />
            {signingOut ? "Signing out…" : "Log Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
