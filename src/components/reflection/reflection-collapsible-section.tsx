"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Optional bordered collapsible — prefer flat section titles on Reflection rail.
 * Use `flat` when the parent already provides chrome (spacing + dividers).
 */
type ReflectionCollapsibleSectionProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  /** No outer card — title row + content on parent surface. */
  flat?: boolean;
};

export function ReflectionCollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
  className,
  flat = false,
}: ReflectionCollapsibleSectionProps) {
  return (
    <details
      className={cn(
        "group",
        flat
          ? "space-y-3"
          /* Surface 5 inset — quiet on page + on modal (Surface 9); avoid surface-base/hover ladder jumps. */
          : "rounded-lg border-0 bg-surface-5",
        className,
      )}
      open={defaultOpen}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-2 text-sm font-semibold tracking-tight text-foreground marker:content-none [&::-webkit-details-marker]:hidden",
          /* Use surface-6 directly — modal rebinds --surface-hover to Surface 10 (too bright). */
          flat ? "py-0" : "px-3 py-2.5 font-medium hover:bg-surface-6",
        )}
      >
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        />
        <span>
          {title} ({count})
        </span>
      </summary>
      <div className={cn(flat ? "pt-0" : "px-3 py-2.5")}>{children}</div>
    </details>
  );
}
