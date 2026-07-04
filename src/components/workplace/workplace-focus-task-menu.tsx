"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, CalendarDays, Clock } from "lucide-react";

type WorkplaceFocusTaskMenuProps = {
  x: number;
  y: number;
  completed?: boolean;
  onClose: () => void;
  onContinueLater: () => void;
  onContinueTomorrow: () => void;
  onPlanLater: () => void;
};

export function WorkplaceFocusTaskMenu({
  x,
  y,
  completed = false,
  onClose,
  onContinueLater,
  onContinueTomorrow,
  onPlanLater,
}: WorkplaceFocusTaskMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const padding = 8;
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    let left = x;
    let top = y;

    if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
    }
    if (top + menuHeight > window.innerHeight - padding) {
      top = window.innerHeight - menuHeight - padding;
    }

    setPosition({
      left: Math.max(padding, left),
      top: Math.max(padding, top),
    });
  }, [x, y]);

  if (!mounted) return null;

  if (completed) {
    return null;
  }

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
        className="flow-surface-elevated fixed z-[100] min-w-[11rem] p-1"
        style={{ left: position.left, top: position.top }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onContinueLater}
        >
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          Continue Later
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onContinueTomorrow}
        >
          <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
          Continue Tomorrow
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onPlanLater}
        >
          <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
          Plan Later
        </button>
      </div>
    </>,
    document.body
  );
}
