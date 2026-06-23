"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ReflectionCollapsibleSectionProps = {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function ReflectionCollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
  className,
}: ReflectionCollapsibleSectionProps) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-neutral-200 bg-white",
        className
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-900 marker:content-none [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        />
        <span>
          {title} ({count})
        </span>
      </summary>
      <div className="border-t border-neutral-100 px-3 py-2.5">{children}</div>
    </details>
  );
}
