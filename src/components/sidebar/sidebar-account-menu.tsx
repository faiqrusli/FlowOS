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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarAccountMenuProps = {
  displayName: string;
  initials: string;
  userRole: string;
  signingOut: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  compact?: boolean;
};

const NAV_TOOLTIP_DELAY_MS = 500;

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
    <div className="shrink-0 px-2 pt-2 pb-3">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            delay={NAV_TOOLTIP_DELAY_MS}
            disabled={!compact}
            closeOnClick
            render={
              <DropdownMenuTrigger
                aria-label={compact ? displayName : undefined}
                className={cn(
                  // Quiet on chrome — menu popover carries card elevation, not the trigger.
                  "group/account relative flex h-11 w-full items-center overflow-hidden rounded-xl text-left transition-colors duration-150",
                  compact
                    ? "border-transparent bg-transparent hover:bg-sidebar-accent"
                    : "border border-sidebar-border bg-transparent hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent",
                )}
              />
            }
          >
            <div
              className="flex h-full shrink-0 items-center justify-center"
              style={{ width: 40 }}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
                aria-hidden
              >
                {initials}
              </div>
            </div>
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden pr-2.5 transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                compact
                  ? "pointer-events-none opacity-0"
                  : "opacity-100",
              )}
              aria-hidden={compact}
            >
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
            </div>
          </TooltipTrigger>
          {compact ? (
            <TooltipContent
              side="right"
              sideOffset={8}
              className="px-2.5 py-1 font-medium whitespace-nowrap text-popover-foreground"
            >
              {displayName}
            </TooltipContent>
          ) : null}
        </Tooltip>

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
