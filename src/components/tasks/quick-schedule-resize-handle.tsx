"use client";

import { useRef } from "react";

type QuickScheduleResizeHandleProps = {
  onResizeDelta: (deltaX: number) => void;
  onResizeEnd: () => void;
};

export function QuickScheduleResizeHandle({
  onResizeDelta,
  onResizeEnd,
}: QuickScheduleResizeHandleProps) {
  const draggingRef = useRef(false);

  function endDrag(target: HTMLElement, pointerId: number) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    target.releasePointerCapture(pointerId);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    onResizeEnd();
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize task list"
      className="group relative z-10 w-px shrink-0 bg-border/45 hover:bg-border/80"
    >
      <div
        className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize touch-none"
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          onResizeDelta(event.movementX);
        }}
        onPointerUp={(event) => {
          endDrag(event.currentTarget, event.pointerId);
        }}
        onPointerCancel={(event) => {
          endDrag(event.currentTarget, event.pointerId);
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-border group-hover:bg-foreground/25"
      />
    </div>
  );
}
