"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Repeat, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  convertToGoal,
  convertToHabit,
  convertToReflection,
  convertToTask,
  NoteConversionsError,
} from "@/lib/note-conversions";
import type { NoteSourceType } from "@/types/notes";

type ConvertActionsProps = {
  growthAreaId: string;
  sourceType: NoteSourceType;
  sourceId: string;
  title: string;
  description?: string;
  onConverted?: () => void;
  compact?: boolean;
};

export function ConvertActions({
  growthAreaId,
  sourceType,
  sourceId,
  title,
  description,
  onConverted,
  compact,
}: ConvertActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function run(
    action: string,
    fn: () => Promise<unknown>,
    success: string,
    href?: string
  ) {
    setLoading(action);
    setMessage(null);
    try {
      await fn();
      setMessage(success);
      onConverted?.();
      if (href) {
        setTimeout(() => {
          window.location.href = href;
        }, 600);
      }
    } catch (err) {
      setMessage(
        err instanceof NoteConversionsError
          ? err.message
          : "Conversion failed."
      );
    } finally {
      setLoading(null);
    }
  }

  const base = { growthAreaId, sourceType, sourceId, title, description };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1 rounded-lg bg-foreground/5 px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground/10">
          <Sparkles className="size-3" />
          Convert
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuItem onClick={() => run("goal", () => convertToGoal(base), "Added as goal")}>
            <Target className="size-3.5" /> Goal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run("habit", () => convertToHabit(base), "Added as habit", "/habits")}>
            <Repeat className="size-3.5" /> Habit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run("task", () => convertToTask(base), "Added as task", "/tasks")}>
            <ArrowRight className="size-3.5" /> Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run("reflection", () => convertToReflection({ ...base, content: description }), "Added to reflection", "/reflection")}>
            <Sparkles className="size-3.5" /> Reflection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Turn into action
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg"
          disabled={!!loading}
          onClick={() =>
            run("goal", () => convertToGoal(base), "Saved as a personal goal")
          }
        >
          <Target className="size-3.5" />
          Goal
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg"
          disabled={!!loading}
          onClick={() =>
            run("habit", () => convertToHabit(base), "Added as habit", "/habits")
          }
        >
          <Repeat className="size-3.5" />
          Habit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg"
          disabled={!!loading}
          onClick={() =>
            run("task", () => convertToTask(base), "Added as task", "/tasks")
          }
        >
          <ArrowRight className="size-3.5" />
          Task
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg"
          disabled={!!loading}
          onClick={() =>
            run(
              "reflection",
              () => convertToReflection({ ...base, content: description }),
              "Added to today's reflection",
              "/reflection"
            )
          }
        >
          <Sparkles className="size-3.5" />
          Reflection
        </Button>
      </div>
      {message && (
        <p className="text-xs text-muted-foreground">
          {message}{" "}
          {message.includes("task") && (
            <Link href="/tasks" className="underline">
              View tasks
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
