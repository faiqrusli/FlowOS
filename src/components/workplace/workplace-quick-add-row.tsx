"use client";

import { CalendarDays, NotebookPen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { cn } from "@/lib/utils";

type WorkplaceQuickAddRowProps = {
  visible: boolean;
  onNewTask: () => void;
};

export function WorkplaceQuickAddRow({
  visible,
  onNewTask,
}: WorkplaceQuickAddRowProps) {
  const { createNewNote, openDailyNote, openReflection } =
    useGlobalRightSidebar();

  return (
    <div
      className={cn(
        "flex w-full flex-nowrap items-center gap-2.5 transition-opacity duration-200",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-[13px]"
        onClick={onNewTask}
      >
        <Plus className="size-3" />
        Task
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-[13px]"
        onClick={() => void createNewNote()}
      >
        <Plus className="size-3" />
        Note
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-[13px]"
        onClick={() => void openDailyNote()}
      >
        <CalendarDays className="size-3" />
        Daily Note
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-[13px]"
        onClick={openReflection}
      >
        <NotebookPen className="size-3" />
        Reflection
      </Button>
    </div>
  );
}
