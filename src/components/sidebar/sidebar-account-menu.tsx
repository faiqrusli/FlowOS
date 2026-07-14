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
import {
  SHELL_NAV_RADIUS_PX,
  SHELL_PROFILE_AVATAR_PX,
  SHELL_PROFILE_CARD_HEIGHT_PX,
  SHELL_PROFILE_HIT_PX,
} from "@/lib/shell-dimensions";
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
    <div className="shrink-0 px-3 pb-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={displayName}
          className={cn(
            "group/account relative flex w-full items-center text-left transition-colors duration-150",
            compact
              ? "mx-auto justify-center border border-transparent bg-transparent p-0 hover:bg-sidebar-accent"
              : "gap-2.5 rounded-[10px] border border-transparent bg-transparent px-2.5 hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent"
          )}
          style={
            compact
              ? {
                  width: SHELL_PROFILE_HIT_PX,
                  height: SHELL_PROFILE_HIT_PX,
                  borderRadius: SHELL_NAV_RADIUS_PX,
                }
              : { height: SHELL_PROFILE_CARD_HEIGHT_PX }
          }
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-full border border-sidebar-border/80 bg-primary text-xs font-semibold text-primary-foreground"
            style={{
              width: SHELL_PROFILE_AVATAR_PX,
              height: SHELL_PROFILE_AVATAR_PX,
            }}
            aria-hidden
          >
            {initials}
          </div>
          {!compact && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs leading-tight text-muted-foreground">
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
              className="flow-surface-elevated flow-shell-nav-tooltip absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden whitespace-nowrap px-2.5 py-1 text-xs font-medium text-popover-foreground group-hover/account:block"
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
