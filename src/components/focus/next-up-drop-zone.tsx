"use client";

import type { DragEvent } from "react";
import { cn } from "@/lib/utils";
import {
  acceptNextUpScheduleDrag,
  isScheduleKindDrag,
} from "@/lib/next-up-drag";

type NextUpDropZoneProps = {
  className?: string;
  active?: boolean;
  onDragEnter?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
};

export function NextUpDropZone({
  className,
  active = false,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
}: NextUpDropZoneProps) {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={(event) => {
        if (isScheduleKindDrag(event)) {
          event.preventDefault();
          acceptNextUpScheduleDrag(event);
        }
        onDragOver?.(event);
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "shrink-0 rounded-md border border-dashed px-3 py-2.5 text-center text-[13px] transition-[border-color,background-color] duration-150",
        active
          ? "border-primary/45 bg-primary/5 text-foreground/90"
          : "border-border/60 bg-muted/20 text-muted-foreground/85",
        className
      )}
    >
      {active ? "Release to add at the end of Next Up" : "Drop a task to add it at the end"}
    </div>
  );
}
