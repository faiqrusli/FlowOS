import { describe, expect, it } from "vitest";
import { getTodayDateString } from "@/lib/date-utils";
import {
  collectScheduledSuggestionsAtNow,
  findNextUpScheduledSuggestion,
  isSuggestionDismissed,
  snoozeNextUpSuggestion,
} from "@/lib/next-up-scheduled-suggestion";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

const VIEW_DATE = getTodayDateString();

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Study Algorithms",
    description: null,
    completed: false,
    priority: null,
    scheduled_date: VIEW_DATE,
    scheduled_time: "16:00",
    sort_order: 0,
    group_id: null,
    planning_state: "today",
    user_id: null,
    created_at: "2026-07-08T08:00:00.000Z",
    ...overrides,
  } as Task;
}

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    name: "Morning Stretch",
    scheduled_time: "16:00",
    days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    completed: false,
    track_with_focus: true,
    user_id: null,
    created_at: "2026-07-08T08:00:00.000Z",
    ...overrides,
  };
}

describe("next-up-scheduled-suggestion", () => {
  it("finds due scheduled tasks and habits sorted by start time", () => {
    const suggestions = collectScheduledSuggestionsAtNow({
      tasks: [
        makeTask({ id: "task-late", title: "Late", scheduled_time: "16:30" }),
        makeTask({ id: "task-early", title: "Early", scheduled_time: "16:00" }),
      ],
      habits: [],
      viewDate: VIEW_DATE,
      isFocusableHabit: () => true,
      nowMinutes: 16 * 60 + 40,
    });

    expect(suggestions.map((item) => item.originId)).toEqual([
      "task-early",
      "task-late",
    ]);
  });

  it("returns the first due suggestion that is not active or dismissed", () => {
    const suggestion = findNextUpScheduledSuggestion({
      tasks: [makeTask()],
      habits: [],
      viewDate: VIEW_DATE,
      activeTarget: { type: "task", id: "other-task" },
      dismissedUntil: null,
      isFocusableHabit: () => true,
      nowMinutes: 16 * 60,
    });

    expect(suggestion?.title).toBe("Study Algorithms");
  });

  it("skips suggestions matching the active target", () => {
    const suggestion = findNextUpScheduledSuggestion({
      tasks: [makeTask()],
      habits: [],
      viewDate: VIEW_DATE,
      activeTarget: { type: "task", id: "task-1" },
      dismissedUntil: null,
      isFocusableHabit: () => true,
      nowMinutes: 16 * 60,
    });

    expect(suggestion).toBeNull();
  });

  it("respects snooze dismissals until the timestamp passes", () => {
    expect(
      isSuggestionDismissed(
        "task-1",
        { "task-1": "2026-07-08T17:00:00.000Z" },
        Date.parse("2026-07-08T16:30:00.000Z")
      )
    ).toBe(true);

    expect(
      isSuggestionDismissed(
        "task-1",
        { "task-1": "2026-07-08T17:00:00.000Z" },
        Date.parse("2026-07-08T17:01:00.000Z")
      )
    ).toBe(false);
  });

  it("persists snooze timestamps on the active session", () => {
    const session: StoredActiveFocusSession = {
      timer_type: "quick",
      session_status: "in_progress",
      started_at: "2026-07-08T15:00:00.000Z",
      focus_duration: 0,
      break_duration: 0,
      mode: "focus",
      phase_started_at: "2026-07-08T15:00:00.000Z",
      phase_end_at_ms: null,
      paused_segment_seconds: 0,
      accumulated_focus_seconds: 0,
      accumulated_break_seconds: 0,
      label: "Quick Focus",
    };

    const snoozed = snoozeNextUpSuggestion(session, "task-1", 60_000);
    expect(snoozed.nextUpDismissedSuggestions?.["task-1"]).toBeTruthy();
  });
});
