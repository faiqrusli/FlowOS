"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkplaceQuickAddRow } from "@/components/workplace/workplace-quick-add-row";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import { cn } from "@/lib/utils";

type WorkplaceQuickAddCardProps = {
  onOpenTaskDetails: () => void;
};

export function WorkplaceQuickAddCard({
  onOpenTaskDetails,
}: WorkplaceQuickAddCardProps) {
  const [hovered, setHovered] = useState(false);
  const [visibility, setVisibility] = useState<WorkplaceModuleVisibility>("always");

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
    <section
      className={cn(
        "group/qa flex shrink-0 items-center rounded-xl border px-2 py-1 transition-[border-color,background-color,box-shadow] duration-200",
        showChrome
          ? "border-border/35 bg-muted/20"
          : "border-transparent bg-transparent shadow-none"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
          "ml-1 flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground/55 transition-[opacity,colors] duration-200 hover:bg-muted/50 hover:text-muted-foreground",
          showChrome ? "opacity-100" : "opacity-0"
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
  );
}
