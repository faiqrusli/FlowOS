"use client";

import { createPortal } from "react-dom";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ExternalLink,
  Play,
  X,
} from "lucide-react";

type NextUpQueueMenuProps = {
  x: number;
  y: number;
  kind: "task" | "habit";
  onClose: () => void;
  onStartFocus: () => void;
  onOpen: () => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
  onRemove: () => void;
};

export function NextUpQueueMenu({
  x,
  y,
  kind,
  onClose,
  onStartFocus,
  onOpen,
  onMoveToTop,
  onMoveToBottom,
  onRemove,
}: NextUpQueueMenuProps) {
  if (typeof document === "undefined") return null;

  const run = (action: () => void) => {
    action();
    onClose();
  };

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close queue menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] min-w-48 overflow-hidden rounded-lg p-1"
        style={{
          left: Math.min(x, window.innerWidth - 208),
          top: Math.min(y, window.innerHeight - 200),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          data-pending-focus-anchor=""
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onStartFocus)}
        >
          <Play className="size-3.5 text-muted-foreground" />
          Start focus
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onOpen)}
        >
          <ExternalLink className="size-3.5 text-muted-foreground" />
          {kind === "habit" ? "Open habit" : "Open details"}
        </button>
        <div className="my-1 border-t border-divider" />
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onMoveToTop)}
        >
          <ArrowUpToLine className="size-3.5 text-muted-foreground" />
          Move to top
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onMoveToBottom)}
        >
          <ArrowDownToLine className="size-3.5 text-muted-foreground" />
          Move to bottom
        </button>
        <div className="my-1 border-t border-divider" />
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onRemove)}
        >
          <X className="size-3.5 text-muted-foreground" />
          Remove from queue
        </button>
      </div>
    </>,
    document.body
  );
}
