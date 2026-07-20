"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { BookOpen, ListPlus, NotebookPen, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

/** Hold longer before showing — avoids flicker on pass-through hover. */
const SHORTCUT_TOOLTIP_DELAY_MS = 700;

function QuickAddHint({
  label,
  shortcut,
  children,
}: {
  label: string;
  shortcut?: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        delay={SHORTCUT_TOOLTIP_DELAY_MS}
        render={<span className="inline-flex max-w-full" />}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top" className="text-center">
        <p>{label}</p>
        {shortcut ? (
          <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
            {shortcut}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

const textActionClass =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[12px] font-medium text-muted-foreground/80 transition-colors hover:bg-surface-hover hover:text-foreground";

export function WorkplaceQuickAddRow({
  onOpenTaskDetails,
}: WorkplaceQuickAddRowProps) {
  const {
    createNewNote,
    openDailyNote,
    openReflection,
    notifyWorkplaceTaskCreated,
  } = useGlobalRightSidebar();
  const boardGroups = useOptionalTaskBoardGroups();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);
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
              todayViewDate,
            );
          }
        })
        .catch((err) => {
          setError(
            err instanceof TasksError ? err.message : "Failed to create task.",
          );
        });
    },
    [notifyWorkplaceTaskCreated],
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

  function handleAddClick() {
    const trimmed = title.trim();
    if (trimmed) {
      setTitle("");
      enqueueInlineTask(trimmed);
      return;
    }
    onOpenTaskDetails();
  }

  const showCaptureHint = focused || title.trim().length > 0;

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex w-full min-w-0 flex-nowrap items-center gap-1.5">
        <div className="relative flex min-w-0 flex-1 items-center">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Capture a task…"
            title="Type a task and press Enter to add to Today · Inbox"
            className={cn(
              "h-[34px] min-w-0 flex-1 rounded-md border-0 bg-transparent px-1 text-[13px] shadow-none",
              "dark:bg-transparent dark:hover:bg-surface-ghost-hover dark:focus-visible:bg-transparent",
              "placeholder:text-muted-foreground/85",
              "transition-[background-color] duration-150",
              "hover:bg-surface-ghost-hover",
              "focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              "hover:focus-visible:bg-surface-ghost-hover dark:hover:focus-visible:bg-surface-ghost-hover",
              showCaptureHint && "pr-[7.25rem]",
            )}
          />
          {showCaptureHint ? (
            <span className="pointer-events-none absolute right-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
              <span className="hidden sm:inline">Today · Inbox</span>
              <span className="tabular-nums">↵ Add</span>
            </span>
          ) : null}
        </div>
        <QuickAddHint
          label="Daily reflection in sidebar"
          shortcut="Ctrl+Shift+R"
        >
          <button
            type="button"
            onClick={openReflection}
            className={textActionClass}
            aria-label="Reflection (Ctrl+Shift+R)"
          >
            <NotebookPen className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Reflection</span>
          </button>
        </QuickAddHint>
        <QuickAddHint label="Today's note or blank note in sidebar">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(textActionClass, "gap-1.5")}
              aria-label="Notes"
            >
              <BookOpen className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">Note</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="min-w-[11rem]"
            >
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
        <QuickAddHint
          label="Full task form — or Enter in the field to quick-add"
          shortcut="Ctrl+Shift+A"
        >
          <Button
            type="button"
            size="sm"
            onClick={handleAddClick}
            className="h-8 shrink-0 gap-1 rounded-lg px-2.5 text-[12px]"
            aria-label="Add task (Ctrl+Shift+A)"
          >
            <ListPlus className="size-3.5" />
            <span className="hidden sm:inline">Add task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </QuickAddHint>
      </div>
      {error ? (
        <p className={cn("truncate px-0.5 text-[11px] text-destructive")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
