"use client";

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  ChevronDown,
  NotebookPen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { createQuickCaptureTask } from "@/lib/quick-capture-task";
import { TasksError } from "@/lib/tasks";
import { cn } from "@/lib/utils";

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

export function WorkplaceQuickAddRow({ onOpenTaskDetails }: WorkplaceQuickAddRowProps) {
  const { createNewNote, openDailyNote, openReflection, notifyWorkplaceTaskCreated } =
    useGlobalRightSidebar();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const submitInlineTask = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    setError(null);

    try {
      const created = await createQuickCaptureTask({ title: trimmed });
      notifyWorkplaceTaskCreated(created);
      setTitle("");
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to create task."
      );
    } finally {
      setSaving(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [notifyWorkplaceTaskCreated, saving, title]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void submitInlineTask();
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex w-full min-w-0 flex-nowrap items-center gap-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task…"
          disabled={saving}
          title="Type a task and press Enter to add to Today"
          className="h-8 min-w-0 flex-1 border-border/50 bg-background/80 px-2.5 text-[13px] shadow-none"
        />
        <QuickAddHint label="Full task form — priority, schedule, group · Ctrl+Shift+A">
          <button
            type="button"
            onClick={onOpenTaskDetails}
            className="inline-flex h-8 shrink-0 items-center px-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Details…
          </button>
        </QuickAddHint>
        <QuickAddHint label="Daily note or blank note in sidebar">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2.5 text-[12px] font-medium text-foreground shadow-xs transition-colors hover:bg-muted/40"
              )}
              aria-label="Notes"
            >
              <NotebookPen className="size-3.5 shrink-0" />
              Notes
              <ChevronDown className="size-3 shrink-0 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[11rem]">
              <DropdownMenuItem
                onClick={() => void openDailyNote()}
                className="gap-2 text-[13px]"
              >
                <CalendarDays className="size-3.5 shrink-0" />
                Daily note (today)
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 gap-1 rounded-full px-2.5 text-[12px]"
            onClick={openReflection}
            aria-label="Reflection"
          >
            Reflect
          </Button>
        </QuickAddHint>
      </div>
      {error ? (
        <p className={cn("truncate px-0.5 text-[11px] text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
}
