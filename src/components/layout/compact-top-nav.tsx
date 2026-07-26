"use client";

import { Menu } from "lucide-react";
import { useShellNavStage } from "@/hooks/use-shell-nav-stage";

type CompactTopNavProps = {
  onOpenNav: () => void;
};

/**
 * Compact top bar: hamburger + brand.
 * Shown below 50% shell width — replaces the left rail; KPI hides with this stage.
 */
export function CompactTopNav({ onOpenNav }: CompactTopNavProps) {
  const stage = useShellNavStage();
  if (stage !== "top") return null;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 bg-surface-canvas px-3">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation menu"
        className="flex size-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
      >
        <Menu className="size-4.5 stroke-[1.5]" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary">
          <span className="text-[12px] font-semibold tracking-tight text-sidebar-primary-foreground">
            F
          </span>
        </div>
        <span className="truncate text-sm font-semibold tracking-tight">
          FlowOS
        </span>
      </div>
    </header>
  );
}
