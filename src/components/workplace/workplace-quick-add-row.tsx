"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  BookOpen,
  ListPlus,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOptionalTaskBoardGroups } from "@/components/tasks/task-board-groups-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { getTodayDateString } from "@/lib/date-utils";
import { addTaskToBoard } from "@/lib/task-groups";
import { createQuickCaptureTask } from "@/lib/quick-capture-task";
import { TasksError } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import type { TaskGroupWithTasks } from "@/types/task";

type WorkplaceQuickAddRowProps = {
  onOpenTaskDetails: () => void;
};

function QuickAddHint({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="group/hint relative inline-flex max-w-full">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 max-w-[14rem] -translate-x-1/2 rounded-md border border-border/60 bg-popover px-2 py-1 text-center text-[11px] leading-snug text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/hint:opacity-100 group-focus-within/hint:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

const iconActionClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-muted/40";

export function WorkplaceQuickAddRow({ onOpenTaskDetails }: WorkplaceQuickAddRowProps) {
  const { createNewNote, openDailyNote, openReflection, notifyWorkplaceTaskCreated } =
    useGlobalRightSidebar();
  const boardGroups = useOptionalTaskBoardGroups();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pendingSaveRef = useRef<Promise<void>>(Promise.resolve());
  const boardGroupsRef = useRef<TaskGroupWithTasks[] | null>(boardGroups);

  useEffect(() => {
    boardGroupsRef.current = boardGroups;
  }, [boardGroups]);

  const enqueueInlineTask = useCallback(
    (taskTitle: string) => {
      setError(null);
      const todayViewDate = getTodayDateString();

      pendingSaveRef.current = pendingSaveRef.current
        .then(async () => {
          const created = await createQuickCaptureTask({
            title: taskTitle,
            boardGroups: boardGroupsRef.current ?? undefined,
          });
          notifyWorkplaceTaskCreated(created);
          if (boardGroupsRef.current) {
            boardGroupsRef.current = addTaskToBoard(
              boardGroupsRef.current,
              created,
              todayViewDate
            );
          }
        })
        .catch((err) => {
          setError(
            err instanceof TasksError ? err.message : "Failed to create task."
          );
        });
    },
    [notifyWorkplaceTaskCreated]
  );

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      setTitle("");
      enqueueInlineTask(trimmed);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex w-full min-w-0 flex-nowrap items-center gap-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task…"
            title="Type a task and press Enter to add to Today"
            className="h-8 min-w-0 flex-1 border-border/50 bg-background/80 px-2.5 text-[13px] shadow-none"
          />
          <QuickAddHint label="Quick capture — full task form · Ctrl+Shift+A">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onOpenTaskDetails}
              className="size-8 shrink-0 rounded-lg shadow-xs"
              aria-label="Quick capture task"
            >
              <ListPlus className="size-3.5" />
            </Button>
          </QuickAddHint>
        </div>
        <QuickAddHint label="Today's note or blank note in sidebar">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(iconActionClass, "gap-0")}
              aria-label="Notes"
            >
              <BookOpen className="size-3.5 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[11rem]">
              <DropdownMenuItem
                onClick={() => void openDailyNote()}
                className="gap-2 text-[13px]"
              >
                <BookOpen className="size-3.5 shrink-0" />
                Today&apos;s note
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Ctrl+Shift+D
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void createNewNote()}
                className="gap-2 text-[13px]"
              >
                <Plus className="size-3.5 shrink-0" />
                New note
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Ctrl+Alt+N
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </QuickAddHint>
        <QuickAddHint label="Daily reflection in sidebar · Ctrl+Shift+R">
          <button
            type="button"
            onClick={openReflection}
            className={iconActionClass}
            aria-label="Reflection"
          >
            <Sparkles className="size-3.5 shrink-0" />
          </button>
        </QuickAddHint>
      </div>
      {error ? (
        <p className={cn("truncate px-0.5 text-[11px] text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
}
