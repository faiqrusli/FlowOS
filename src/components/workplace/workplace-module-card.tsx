"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import { cn } from "@/lib/utils";

type WorkplaceModuleCardProps = {
  moduleId: string;
  title: string;
  titleCount?: number;
  titleMeta?: string;
  anchorId?: string;
  children: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
  bodyClassName?: string;
};

export function WorkplaceModuleCard({
  moduleId,
  title,
  titleCount,
  titleMeta,
  anchorId,
  children,
  className,
  headerExtra,
  bodyClassName,
}: WorkplaceModuleCardProps) {
  const [visibility, setVisibility] = useState<WorkplaceModuleVisibility>("always");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setVisibility(readModuleVisibility(moduleId));
  }, [moduleId]);

  const hoverReveal = visibility === "hover";
  const contentVisible = !hoverReveal || hovered;
  const cardVisible = !hoverReveal || hovered;

  function toggleVisibility() {
    setVisibility((current) => {
      const next = current === "always" ? "hover" : "always";
      writeModuleVisibility(moduleId, next);
      return next;
    });
  }

  return (
    <section
      id={anchorId}
      className={cn(
        "flow-surface-card group/module flex min-h-0 flex-col overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-[color-mix(in_oklch,var(--border),var(--foreground)_12%)] hover:shadow-sm",
        !cardVisible && "border-transparent bg-transparent shadow-none",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-2 border-b border-divider px-2.5 py-2 transition-opacity duration-150",
          !cardVisible && "pointer-events-none opacity-0"
        )}
      >
        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">
          {title}
          {titleMeta ? (
            <span className="ml-1.5 font-medium text-muted-foreground">
              {titleMeta}
            </span>
          ) : titleCount !== undefined ? (
            <span className="ml-1 font-medium text-muted-foreground">
              {titleCount}
            </span>
          ) : null}
        </h3>
        <div className="flex items-center gap-1.5">
          {headerExtra}
          <button
            type="button"
            onClick={toggleVisibility}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-muted/50 hover:text-muted-foreground"
            aria-label={
              hoverReveal
                ? "Show on hover — click for always visible"
                : "Always visible — click for show on hover"
            }
            title={hoverReveal ? "Show on hover" : "Always visible"}
          >
            {hoverReveal ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </header>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-hidden transition-opacity duration-150",
          !contentVisible && "pointer-events-none opacity-0",
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
