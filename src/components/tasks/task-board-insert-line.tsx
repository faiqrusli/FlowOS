"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

/** Canonical FlowOS list insert preview — same look as Tasks board. */
export const TaskBoardInsertLine = memo(function TaskBoardInsertLine({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-0.5 h-0.5 shrink-0 rounded-full bg-primary/70",
        className
      )}
      aria-hidden
    />
  );
});
