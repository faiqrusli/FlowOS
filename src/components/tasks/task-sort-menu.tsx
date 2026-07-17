"use client";

import { ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TASK_SORT_MODE_LABELS,
  TASK_SORT_MODES,
  type TaskSortMode,
} from "@/lib/task-sort";

type TaskSortMenuProps = {
  sortMode: TaskSortMode;
  onSortModeChange: (mode: TaskSortMode) => void;
};

export function TaskSortMenu({ sortMode, onSortModeChange }: TaskSortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-surface-hover/80 hover:text-foreground data-[state=open]:bg-surface-raised data-[state=open]:text-foreground"
        aria-label="Sort tasks"
      >
        <ArrowUpDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-44 rounded-xl">
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Sort by
        </p>
        {TASK_SORT_MODES.map((mode) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => onSortModeChange(mode)}
            className="gap-2 text-xs"
          >
            <span className="flex size-3.5 shrink-0 items-center justify-center">
              {sortMode === mode ? (
                <Check className="size-3.5" strokeWidth={2.5} />
              ) : null}
            </span>
            {TASK_SORT_MODE_LABELS[mode]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
