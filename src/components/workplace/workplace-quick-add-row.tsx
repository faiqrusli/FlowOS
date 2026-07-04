"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { createQuickCaptureTask } from "@/lib/quick-capture-task";
import { TasksError } from "@/lib/tasks";
import { cn } from "@/lib/utils";

type WorkplaceQuickAddRowProps = {
  onOpenTaskDetails: () => void;
};

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
      inputRef.current?.focus();
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to create task."
      );
    } finally {
      setSaving(false);
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
          className="h-7 min-w-0 flex-1 border-border/50 bg-background/80 px-2.5 text-[13px] shadow-none"
        />
        <button
          type="button"
          onClick={onOpenTaskDetails}
          className="shrink-0 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Details…
        </button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 gap-1 rounded-full px-2 text-[12px]"
          onClick={() => void createNewNote()}
          aria-label="New note"
        >
          <NotebookPen className="size-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 gap-1 rounded-full px-2 text-[12px]"
          onClick={() => void openDailyNote()}
          aria-label="Daily note"
        >
          <CalendarDays className="size-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 gap-1 rounded-full px-2 text-[12px]"
          onClick={openReflection}
          aria-label="Reflection"
        >
          Reflect
        </Button>
      </div>
      {error ? (
        <p className={cn("truncate px-0.5 text-[11px] text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
}
