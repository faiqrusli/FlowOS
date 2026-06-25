"use client";

import { type ReactNode } from "react";
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
  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div
        key={`${tab}-${animKey}`}
        className={cn(
          "h-full min-h-0",
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
