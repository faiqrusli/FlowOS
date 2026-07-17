"use client";

import { Eye, EyeOff, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkplaceQuickAddRow } from "@/components/workplace/workplace-quick-add-row";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import {
  WORKPLACE_FOCUS_MIN_PX,
  WORKPLACE_NEXT_UP_RAIL_PX,
  WORKPLACE_PANEL_TRAILING_INSET_CLASS,
} from "@/lib/workplace-layout";
import { cn } from "@/lib/utils";

type WorkplaceQuickAddCardProps = {
  onOpenTaskDetails: () => void;
};

export function WorkplaceQuickAddCard({
  onOpenTaskDetails,
}: WorkplaceQuickAddCardProps) {
  const [hovered, setHovered] = useState(false);
  const [visibility, setVisibility] =
    useState<WorkplaceModuleVisibility>("always");

  useEffect(() => {
    setVisibility(readModuleVisibility("quick-add", "always"));
  }, []);

  const hoverReveal = visibility === "hover";
  const showActions = hoverReveal ? hovered : true;
  const showChrome = !hoverReveal || hovered;

  function toggleVisibility() {
    setVisibility((current) => {
      const next = current === "always" ? "hover" : "always";
      writeModuleVisibility("quick-add", next);
      return next;
    });
  }

  return (
    <div
      className={cn("w-full shrink-0", WORKPLACE_PANEL_TRAILING_INSET_CLASS)}
      style={{
        minWidth: WORKPLACE_FOCUS_MIN_PX + WORKPLACE_NEXT_UP_RAIL_PX,
      }}
    >
      <section
        className={cn(
          "group/qa flex w-full items-center gap-2 rounded-xl border border-border-subtle bg-surface-base px-2.5 py-1.5 shadow-sm",
          !showChrome &&
            "border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent hover:shadow-none",
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary",
            !showChrome && "opacity-0",
          )}
          aria-hidden
        >
          <Zap className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          {showActions ? (
            <WorkplaceQuickAddRow onOpenTaskDetails={onOpenTaskDetails} />
          ) : (
            <div className="h-8" aria-hidden />
          )}
        </div>
        <button
          type="button"
          onClick={toggleVisibility}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground/55 transition-[opacity,colors] duration-200 hover:bg-surface-hover hover:text-muted-foreground",
            showChrome ? "opacity-100" : "opacity-0",
          )}
          aria-label={
            hoverReveal
              ? "Show on hover — click for always visible"
              : "Always visible — click for show on hover"
          }
        >
          {hoverReveal ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </button>
      </section>
    </div>
  );
}
