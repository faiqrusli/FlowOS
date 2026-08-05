"use client";

import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  CircleHelp,
  Clock3,
  FileText,
  RefreshCw,
  Repeat2,
  Timer,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ErrorBanner } from "@/components/shared/error-banner";
import { Button } from "@/components/ui/button";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  formatTodayHeading,
  formatTimeShort,
} from "@/lib/date-utils";
import { formatDurationCompact } from "@/lib/focus-utils";
import {
  loadTodayComposition,
  type TodayComposition,
  type TodayReadSource,
} from "@/lib/today-composition";
import { cn } from "@/lib/utils";
import { TodaySourceModule } from "@/components/today/today-source-module";

function compositionStatusCopy(state: TodayComposition["state"]): string {
  switch (state) {
    case "ready":
      return "Current source context is confirmed.";
    case "partial":
      return "Some source context is confirmed; limitations remain visible below.";
    case "stale":
      return "Some context is last-confirmed and may have changed at its owner.";
    case "unavailable":
      return "Current Today context is not fully verifiable.";
    case "error":
      return "Current Today context is unverified.";
  }
}

function reflectionPreview(
  reflection: NonNullable<TodayComposition["reflection"]["data"]>,
): string {
  const content = [
    reflection.went_well,
    reflection.went_wrong,
    ...reflection.custom_entries.map((entry) => `${entry.title}: ${entry.content}`),
  ]
    .map((value) => value.trim())
    .find(Boolean);

  if (!content) return "Reflection saved at the owner.";
  return content.length > 120 ? `${content.slice(0, 120)}…` : content;
}

function taskStatusLabel(completed: boolean): string {
  return completed ? "Completed at Tasks" : "Planned task";
}

export function TodayPageContent() {
  const { activeSession, lastSavedSession } = useFocusSessionContext();
  const [composition, setComposition] = useState<TodayComposition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryingSource, setRetryingSource] =
    useState<TodayReadSource | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const compositionRef = useRef<TodayComposition | null>(null);
  const requestIdRef = useRef(0);

  const loadComposition = useCallback(async (source?: TodayReadSource) => {
    const requestId = ++requestIdRef.current;
    const previous = compositionRef.current;

    if (source) {
      setRetryingSource(source);
    } else if (previous) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setPageError(null);

    try {
      const next = await loadTodayComposition({
        previous,
        sources: source ? [source] : undefined,
      });

      if (requestId !== requestIdRef.current) return;
      compositionRef.current = next;
      setComposition(next);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setPageError(
        "Today could not load its read model. Your source records remain unchanged; retry or open an owner surface.",
      );
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
      setRefreshing(false);
      setRetryingSource(null);
    }
  }, []);

  useEffect(() => {
    void loadComposition();
  }, [loadComposition]);

  useEffect(() => {
    if (!lastSavedSession?.id) return;
    void loadComposition("focus");
  }, [lastSavedSession?.id, loadComposition]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState !== "visible" || !compositionRef.current) {
        return;
      }
      void loadComposition();
    };

    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () =>
      document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [loadComposition]);

  const retry = useCallback(
    (source: TodayReadSource) => {
      void loadComposition(source);
    },
    [loadComposition],
  );

  const todayHeading = formatTodayHeading();
  const focusData = composition?.focus.data;
  const taskData = composition?.tasks.data;
  const habitData = composition?.habits.data;
  const scheduleData = composition?.schedule.data;
  const reflectionData = composition?.reflection.data;

  return (
    <main className="min-h-full flex-1 overflow-y-auto bg-surface-canvas">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Orientation · Asia/Singapore
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Today
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{todayHeading}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/tasks"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle bg-control-default px-2.5 text-xs font-medium text-foreground/85 transition-colors hover:bg-control-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <CheckSquare className="size-3.5" aria-hidden />
              Open Tasks
            </Link>
            <Link
              href="/focus"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle bg-control-default px-2.5 text-xs font-medium text-foreground/85 transition-colors hover:bg-control-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Timer className="size-3.5" aria-hidden />
              Open Focus
            </Link>
          </div>
        </header>

        <section
          aria-labelledby="today-composition-heading"
          className="rounded-2xl bg-surface-raised/50 p-4 ring-1 ring-border/30 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Composition status
              </p>
              <h2
                id="today-composition-heading"
                className="mt-1 text-lg font-semibold text-foreground"
              >
                {loading
                  ? "Loading source context"
                  : composition
                    ? compositionStatusCopy(composition.state)
                    : "Context unavailable"}
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void loadComposition()}
              disabled={loading || refreshing || retryingSource !== null}
              aria-label="Refresh Today context"
            >
              <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} aria-hidden />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground" role="status" aria-live="polite">
            {loading
              ? "Reading Tasks, Focus, Reflection, and Habits independently."
              : refreshing
                ? "Refreshing confirmed source context."
                : composition
                  ? compositionStatusCopy(composition.state)
                  : "No current read model is available."}
          </p>
          {pageError ? <div className="mt-3"><ErrorBanner message={pageError} /></div> : null}
        </section>

        {composition ? (
          <>
            <section aria-labelledby="today-current-heading">
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="size-4 text-primary" aria-hidden />
                <h2 id="today-current-heading" className="text-lg font-semibold text-foreground">
                  Current and planned context
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <TodaySourceModule
                  id="today-tasks"
                  label="Tasks · commitment owner"
                  envelope={composition.tasks}
                  ownerHref="/tasks"
                  ownerActionLabel="Open Tasks"
                  onRetry={() => retry("tasks")}
                >
                  {taskData?.tasks.length ? (
                    <ul className="space-y-2" aria-label="Today tasks">
                      {taskData.tasks.slice(0, 5).map((task) => (
                        <li key={task.id}>
                          <Link
                            href="/tasks"
                            aria-label={`Open Tasks: ${task.title}`}
                            className="flex items-start justify-between gap-3 rounded-lg bg-surface-base/60 px-3 py-2 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                          <span className="min-w-0 truncate">{task.title}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {taskStatusLabel(task.completed)}
                          </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : composition.tasks.state === "empty" ? (
                    <p className="text-muted-foreground">No Tasks for this view.</p>
                  ) : (
                    <p className="text-muted-foreground">Task context is not confirmed.</p>
                  )}
                </TodaySourceModule>

                <TodaySourceModule
                  id="today-focus"
                  label="Focus · session owner"
                  envelope={composition.focus}
                  ownerHref="/focus"
                  ownerActionLabel="Open Focus"
                  onRetry={() => retry("focus")}
                >
                  <div className="space-y-2">
                    {activeSession ? (
                      <p className="rounded-lg bg-info/10 px-3 py-2 text-info">
                        Focus session {activeSession.session_status === "paused" ? "paused" : "active"}
                        {activeSession.label ? ` · ${activeSession.label}` : ""}.
                      </p>
                    ) : null}
                    <p className="text-2xl font-semibold text-foreground">
                      {focusData
                        ? formatDurationCompact(focusData.stats.totalFocusSeconds)
                        : "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {focusData
                        ? `${focusData.stats.sessionCount} factual session${focusData.stats.sessionCount === 1 ? "" : "s"} recorded for this date.`
                        : "Focus session facts are not confirmed for this view."}
                    </p>
                  </div>
                </TodaySourceModule>
              </div>
            </section>

            <section aria-labelledby="today-supporting-heading">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" aria-hidden />
                <h2 id="today-supporting-heading" className="text-lg font-semibold text-foreground">
                  Supporting context
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <TodaySourceModule
                  id="today-schedule"
                  label="Schedule · planned context"
                  envelope={composition.schedule}
                  ownerHref="/schedule"
                  ownerActionLabel="Open Schedule"
                >
                  {scheduleData?.length ? (
                    <ul className="space-y-2" aria-label="Planned schedule">
                      {scheduleData.slice(0, 6).map((item) => (
                        <li key={item.id}>
                          <Link
                            href="/schedule"
                            aria-label={`Open Schedule: ${item.title}`}
                            className="flex items-center justify-between gap-3 rounded-lg bg-surface-base/60 px-3 py-2 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            <span className="min-w-0 truncate">{item.title}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {item.time ?? "Unscheduled"}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : composition.schedule.state === "empty" ? (
                    <p className="text-muted-foreground">No planned schedule for this view.</p>
                  ) : (
                    <p className="text-muted-foreground">Schedule context is not confirmed.</p>
                  )}
                </TodaySourceModule>

                <TodaySourceModule
                  id="today-habits"
                  label="Habits · recurring-action owner"
                  envelope={composition.habits}
                  ownerHref="/habits"
                  ownerActionLabel="Open Habits"
                  onRetry={() => retry("habits")}
                >
                  {habitData?.length ? (
                    <ul className="space-y-2" aria-label="Today habits">
                      {habitData.slice(0, 5).map((habit) => (
                        <li key={habit.id}>
                          <Link
                            href="/habits"
                            aria-label={`Open Habits: ${habit.name}`}
                            className="flex items-center justify-between gap-3 rounded-lg bg-surface-base/60 px-3 py-2 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            <span className="min-w-0 truncate">{habit.name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {habit.completed ? "Completed at Habits" : formatTimeShort(habit.scheduled_time) ?? "Planned"}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : composition.habits.state === "empty" ? (
                    <p className="text-muted-foreground">No Habits for this view.</p>
                  ) : (
                    <p className="text-muted-foreground">Habit context is not confirmed.</p>
                  )}
                </TodaySourceModule>

                <TodaySourceModule
                  id="today-notes"
                  label="Notes · optional source"
                  envelope={composition.notes}
                  ownerHref="/notes"
                  ownerActionLabel="Open Notes"
                >
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CircleHelp className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <p>Today does not infer Notes context when its read integration is not confirmed.</p>
                  </div>
                </TodaySourceModule>
              </div>
            </section>

            <section aria-labelledby="today-meaning-heading">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="size-4 text-primary" aria-hidden />
                <h2 id="today-meaning-heading" className="text-lg font-semibold text-foreground">
                  Factual and interpretive context
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <TodaySourceModule
                  id="today-reflection"
                  label="Reflection · interpretation owner"
                  envelope={composition.reflection}
                  ownerHref="/reflection"
                  ownerActionLabel="Open Reflection"
                  onRetry={() => retry("reflection")}
                >
                  {reflectionData ? (
                    <p className="leading-6 text-foreground/90">{reflectionPreview(reflectionData)}</p>
                  ) : composition.reflection.state === "empty" ? (
                    <p className="text-muted-foreground">No Reflection for this view.</p>
                  ) : (
                    <p className="text-muted-foreground">Reflection context is not confirmed.</p>
                  )}
                </TodaySourceModule>

                <section className="rounded-2xl bg-surface-raised/50 p-4 ring-1 ring-border/30 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Repeat2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Choose, hand off, or leave</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Today only composes confirmed context. Selecting a task, starting Focus, saving a Reflection, and completing a Habit remain actions at their owning surfaces.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Planned selection, elapsed time, completion, and absence are not an outcome score. You can leave this page without creating a Today record.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl bg-surface-raised/50 p-6 text-sm text-muted-foreground ring-1 ring-border/30">
            Today is loading its independent source regions. Navigation remains available while context is unconfirmed.
          </div>
        )}
      </div>
    </main>
  );
}
