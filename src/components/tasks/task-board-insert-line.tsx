"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export const TaskBoardInsertLine = memo(function TaskBoardInsertLine({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("relative z-10 mx-1 h-0 shrink-0", className)}
      aria-hidden
    >
      <div className="absolute -top-px left-0 right-0 flex items-center gap-1">
        <div className="size-1.5 shrink-0 rounded-full bg-primary" />
        <div className="h-0.5 flex-1 rounded-full bg-primary/90 shadow-[0_0_6px_0] shadow-primary/25" />
      </div>
    </div>
  );
});
