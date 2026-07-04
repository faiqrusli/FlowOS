"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  CalendarDays,
  Check,
  ClipboardList,
  Play,
  Trash2,
} from "lucide-react";

const MENU_ARROW_PX = 10;
const MENU_GAP_PX = 8;
const MENU_ESTIMATED_WIDTH_PX = 220;

type WorkplaceTodayTaskMenuProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  taskTitle: string;
  completed: boolean;
  anchorRect: DOMRect;
  onClose: () => void;
  onStartFocus: () => void;
  onOpenDetail: () => void;
  onMoveToTomorrow: () => void;
  onPlanLater: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
};

function useWorkplaceAnchoredMenuPosition(
  anchorRect: DOMRect,
  menuRef: RefObject<HTMLDivElement | null>
) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    arrowTop: 16,
    menuOnRight: true,
  });

  const updatePosition = useCallback(() => {
    const menu = menuRef.current;
    const menuWidth = menu?.offsetWidth ?? MENU_ESTIMATED_WIDTH_PX;
    const menuHeight = menu?.offsetHeight ?? 220;
    const padding = 8;

    let left = anchorRect.right + MENU_GAP_PX;
    let menuOnRight = true;

    if (left + menuWidth > window.innerWidth - padding) {
      left = anchorRect.left - menuWidth - MENU_ARROW_PX - MENU_GAP_PX;
      menuOnRight = false;
    }
    left = Math.max(padding, left);

    let top = anchorRect.top;
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - menuHeight - padding)
    );

    const taskCenterY = anchorRect.top + anchorRect.height / 2;
    const arrowTop = Math.min(
      Math.max(12, taskCenterY - top),
      menuHeight - 20
    );

    setPosition({ left, top, arrowTop, menuOnRight });
  }, [anchorRect, menuRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [updatePosition]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  return { mounted, position };
}

export function WorkplaceTodayTaskMenu({
  menuRef,
  taskTitle,
  completed,
  anchorRect,
  onClose,
  onStartFocus,
  onOpenDetail,
  onMoveToTomorrow,
  onPlanLater,
  onToggleComplete,
  onDelete,
}: WorkplaceTodayTaskMenuProps) {
  const { mounted, position } = useWorkplaceAnchoredMenuPosition(
    anchorRect,
    menuRef
  );

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        data-timeline-context-menu
        className="flow-surface-elevated fixed z-[100] w-[13.5rem] overflow-visible rounded-xl"
        style={{ left: position.left, top: position.top }}
        onClick={(event) => event.stopPropagation()}
      >
        {position.menuOnRight ? (
          <>
            <span
              className="pointer-events-none absolute -left-[9px] size-0 border-y-[9px] border-r-[9px] border-y-transparent border-r-popover drop-shadow-sm"
              style={{ top: position.arrowTop }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -left-[10px] size-0 border-y-[10px] border-r-[10px] border-y-transparent border-r-border/50"
              style={{ top: position.arrowTop - 1 }}
              aria-hidden
            />
          </>
        ) : (
          <>
            <span
              className="pointer-events-none absolute -right-[9px] size-0 border-y-[9px] border-l-[9px] border-y-transparent border-l-popover drop-shadow-sm"
              style={{ top: position.arrowTop }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -right-[10px] size-0 border-y-[10px] border-l-[10px] border-y-transparent border-l-border/50"
              style={{ top: position.arrowTop - 1 }}
              aria-hidden
            />
          </>
        )}

        <div className="border-b border-border/30 px-3 py-2">
          <p className="truncate text-sm font-semibold leading-snug text-foreground">
            {taskTitle}
          </p>
        </div>

        <div className="p-1">
          {!completed ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
              onClick={onStartFocus}
            >
              <Play className="size-3.5 shrink-0" />
              Start focus
            </button>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
            onClick={onOpenDetail}
          >
            <ClipboardList className="size-3.5 shrink-0 text-muted-foreground" />
            Open details
          </button>
          {!completed ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
                onClick={onMoveToTomorrow}
              >
                <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                Move to tomorrow
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
                onClick={onPlanLater}
              >
                <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
                Plan later
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
            onClick={onToggleComplete}
          >
            <Check className="size-3.5 shrink-0 text-muted-foreground" />
            {completed ? "Mark incomplete" : "Mark complete"}
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-destructive hover:bg-muted"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5 shrink-0" />
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
