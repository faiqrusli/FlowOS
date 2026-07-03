"use client";

import {
  forwardRef,
  memo,
  useSyncExternalStore,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  getGroupDragBlockedTooltip,
  isGroupDragActive,
  isGroupDragReorderBlocked,
  isGroupDragSource,
  isGroupReorderBlockTarget,
  shouldShowGroupDropMarker,
  shouldShowGroupDropMarkerAtEnd,
  subscribeGroupDragSession,
} from "@/lib/group-drag-session";
import {
  getGroupDragCancelSlideX,
  isGroupDragCanceling,
  subscribeGroupDragCancel,
} from "@/lib/group-drag-cancel";
import {
  getGroupDropRevealSlideX,
  isGroupDropRevealing,
  subscribeGroupDropReveal,
} from "@/lib/group-drop-reveal";
import { getGroupDropMarkerStyle } from "@/lib/board-column-gap";
import { cn } from "@/lib/utils";

export const GroupColumnBoardSlot = memo(function GroupColumnBoardSlot({
  groupId,
  balanceInGap = false,
  className,
  collapsed,
  children,
}: {
  groupId: string;
  balanceInGap?: boolean;
  className?: string;
  collapsed?: boolean;
  children: ReactNode;
}) {
  const showDropMarker = useSyncExternalStore(
    subscribeGroupDragSession,
    () => shouldShowGroupDropMarker(groupId),
    () => false
  );
  const isReveal = useSyncExternalStore(
    subscribeGroupDropReveal,
    () => isGroupDropRevealing(groupId),
    () => false
  );
  const revealSlideX = useSyncExternalStore(
    subscribeGroupDropReveal,
    () => getGroupDropRevealSlideX(groupId),
    () => 0
  );
  const isCanceling = useSyncExternalStore(
    subscribeGroupDragCancel,
    () => isGroupDragCanceling(groupId),
    () => false
  );
  const cancelSlideX = useSyncExternalStore(
    subscribeGroupDragCancel,
    () => getGroupDragCancelSlideX(groupId),
    () => 0
  );
  const slideX = isCanceling ? cancelSlideX : revealSlideX;

  return (
    <div
      data-task-group-board-slot={groupId}
      data-task-group-column={groupId}
      data-task-group={groupId}
      data-task-group-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "relative flex shrink-0 items-stretch",
        className,
        isReveal && !isCanceling && "animate-group-drop-slide-in",
        isCanceling && "animate-group-drag-cancel-settle"
      )}
      style={
        isReveal || isCanceling
          ? ({ "--group-slide-x": `${slideX}px` } as CSSProperties)
          : undefined
      }
    >
      {showDropMarker ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 rounded-full bg-primary/35"
          style={getGroupDropMarkerStyle(balanceInGap)}
        />
      ) : null}
      {children}
    </div>
  );
});

export const BoardGroupDropTrailingMarker = memo(
  function BoardGroupDropTrailingMarker() {
    const visible = useSyncExternalStore(
      subscribeGroupDragSession,
      () => shouldShowGroupDropMarkerAtEnd(),
      () => false
    );
    if (!visible) return null;
    return (
      <div className="relative w-0 shrink-0 self-stretch" aria-hidden>
        <div
          className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 rounded-full bg-primary/35"
          style={getGroupDropMarkerStyle(true)}
        />
      </div>
    );
  }
);

export const GroupColumnDragShell = memo(function GroupColumnDragShell({
  groupId,
  className,
  children,
}: {
  groupId: string;
  className?: string;
  children: ReactNode;
}) {
  const isSource = useSyncExternalStore(
    subscribeGroupDragSession,
    () => isGroupDragSource(groupId),
    () => false
  );
  const isCanceling = useSyncExternalStore(
    subscribeGroupDragCancel,
    () => isGroupDragCanceling(groupId),
    () => false
  );
  const isBlockTarget = useSyncExternalStore(
    subscribeGroupDragSession,
    () => isGroupReorderBlockTarget(groupId),
    () => false
  );

  return (
    <div
      className={cn(
        className,
        isSource && !isCanceling && "opacity-40",
        isBlockTarget &&
          "border-destructive/35 bg-destructive/[0.06] ring-2 ring-destructive/30"
      )}
    >
      {children}
    </div>
  );
});

export const BoardGroupDragScrollChrome = memo(
  forwardRef<
    HTMLDivElement,
    {
      className?: string;
      children: ReactNode;
      onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
      onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    }
  >(function BoardGroupDragScrollChrome(
    { className, children, onDragOver, onDrop },
    ref
  ) {
    const blocked = useSyncExternalStore(
      subscribeGroupDragSession,
      () => isGroupDragReorderBlocked(),
      () => false
    );

    return (
      <div
        ref={ref}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(className, blocked && "cursor-not-allowed")}
      >
        {children}
      </div>
    );
  })
);

export function GroupDragBlockedTooltip({ message }: { message: string }) {
  const position = useSyncExternalStore(
    subscribeGroupDragSession,
    () => getGroupDragBlockedTooltip(),
    () => null
  );
  const active = useSyncExternalStore(
    subscribeGroupDragSession,
    () => isGroupDragActive(),
    () => false
  );

  if (!active || !position || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="flow-surface-elevated pointer-events-none fixed z-[200] max-w-[15rem] rounded-md px-2.5 py-1.5 text-[11px] leading-snug"
      style={{ left: position.x + 14, top: position.y + 14 }}
      role="status"
    >
      {message}
    </div>,
    document.body
  );
}
