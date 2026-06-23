"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NotesContentTab = "notes" | "kanban";

type NotesTabTransitionProps = {
  tab: NotesContentTab;
  slideFrom: "left" | "right";
  animKey: number;
  notes: ReactNode;
  kanban: ReactNode;
};

export function NotesTabTransition({
  tab,
  slideFrom,
  animKey,
  notes,
  kanban,
}: NotesTabTransitionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      setHeight(el.getBoundingClientRect().height);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab, animKey, notes, kanban]);

  return (
    <div
      className={cn(
        "overflow-hidden transition-[height] duration-[250ms] ease-out",
        height === null && "h-auto"
      )}
      style={height !== null ? { height } : undefined}
    >
      <div
        ref={contentRef}
        key={`${tab}-${animKey}`}
        className={cn(
          animKey > 0 &&
            (slideFrom === "right"
              ? "notes-tab-enter-right"
              : "notes-tab-enter-left")
        )}
      >
        {tab === "notes" ? notes : kanban}
      </div>
    </div>
  );
}
