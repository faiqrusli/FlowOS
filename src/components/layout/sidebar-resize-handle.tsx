"use client";

import { useRef } from "react";

type SidebarResizeHandleProps = {
  onResizeStart?: () => void;
  onResizeDelta: (deltaX: number) => void;
  onResizeEnd: () => void;
};

export function SidebarResizeHandle({
  onResizeStart,
  onResizeDelta,
  onResizeEnd,
}: SidebarResizeHandleProps) {
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
      suppressHydrationWarning
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      className="group absolute inset-y-0 left-0 z-20 w-px -translate-x-1/2 bg-border-subtle/40 hover:bg-border-subtle/80"
    >
      <div
        className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize touch-none"
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = true;
          onResizeStart?.();
          event.currentTarget.setPointerCapture(event.pointerId);
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          onResizeDelta(-event.movementX);
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
        className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-subtle/50 group-hover:bg-foreground/20"
      />
    </div>
  );
}

