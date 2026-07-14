"use client";

import { Eye, EyeOff, X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import { workplacePanelSectionClassName } from "@/lib/workplace-panel-appearance";
import { cn } from "@/lib/utils";

type WorkplaceModuleCardProps = {
  moduleId: string;
  title: string;
  titleIcon?: LucideIcon;
  titleCount?: number;
  titleMeta?: string;
  anchorId?: string;
  children: ReactNode;
  className?: string;
  headerExtra?: ReactNode;
  bodyClassName?: string;
  /** Floating overlay mode — hide hover-visibility toggle; optional close. */
  overlay?: boolean;
  onClose?: () => void;
};

export function WorkplaceModuleCard({
  moduleId,
  title,
  titleIcon: TitleIcon,
  titleCount,
  titleMeta,
  anchorId,
  children,
  className,
  headerExtra,
  bodyClassName,
  overlay = false,
  onClose,
}: WorkplaceModuleCardProps) {
  const [visibility, setVisibility] =
    useState<WorkplaceModuleVisibility>("always");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (overlay) return;
    setVisibility(readModuleVisibility(moduleId));
  }, [moduleId, overlay]);

  const hoverReveal = !overlay && visibility === "hover";
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
        overlay
          ? "flex min-h-0 flex-col overflow-hidden border-0 bg-transparent shadow-none"
          : cn(
              workplacePanelSectionClassName,
              "group/module flex min-h-0 flex-col overflow-hidden",
              !cardVisible &&
                "border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent hover:shadow-none"
            ),
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <header
        className={cn(
          "flex shrink-0 items-center justify-between gap-2 border-b border-divider px-2.5 py-2 transition-opacity duration-150",
          !overlay && !cardVisible && "pointer-events-none opacity-0"
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {TitleIcon ? (
            <TitleIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          ) : null}
          <h3 className="truncate text-[14px] font-semibold tracking-tight text-foreground">
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
        </div>
        <div className="flex items-center gap-1.5">
          {headerExtra}
          {overlay && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label={`Close ${title}`}
            >
              <X className="size-3.5" />
            </button>
          ) : null}
          {!overlay ? (
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
          ) : null}
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
