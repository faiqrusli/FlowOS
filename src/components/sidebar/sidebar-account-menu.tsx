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
            "group/account relative flex items-center rounded-lg border border-border/70 bg-background text-left shadow-sm transition-colors",
            "hover:bg-muted/40 aria-expanded:border-border aria-expanded:bg-muted/30",
            compact
              ? "mx-auto size-9 justify-center border-transparent bg-transparent p-0 shadow-none hover:bg-muted/60"
              : "w-full gap-2.5 px-2.5 py-2"
          )}
        >
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground"
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
              className="pointer-events-none absolute top-1/2 left-[calc(100%+0.5rem)] z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover/account:block"
            >
              {displayName}
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[15rem] rounded-xl border border-border/80 p-1.5 shadow-lg"
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
