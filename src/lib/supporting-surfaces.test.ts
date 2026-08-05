import { describe, expect, it } from "vitest";
import {
  buildHabitCompletionIntent,
  buildHabitsSupport,
  buildNotesSupport,
  buildScheduleOwnerRoute,
  buildScheduleSupport,
  buildSupportingReadError,
  buildUnavailableSupporting,
  getSupportingRecoveryChoices,
} from "@/lib/supporting-surfaces";
import type { Habit } from "@/types/habit";
import type { ScheduleItem } from "@/types/schedule";

const habit: Habit = {
  id: "habit-1",
  name: "Walk",
  scheduled_time: "09:00",
  days_of_week: null,
  completed: false,
  track_with_focus: false,
  user_id: "user-1",
  created_at: "2026-08-05T00:00:00.000Z",
};

const taskScheduleItem: ScheduleItem = {
  id: "task-task-1",
  entityId: "task-1",
  title: "Prepare review",
  type: "task",
  time: "09:00",
  timeSort: 540,
  completed: false,
  href: "/tasks",
};

describe("bounded supporting surfaces", () => {
  it("keeps empty Habits optional and avoids score/streak semantics", () => {
    const envelope = buildHabitsSupport([]);

    expect(envelope.state).toBe("empty");
    expect(envelope.data).toEqual([]);
    expect(envelope.limitation).toContain("progress or streaks");
    expect(JSON.stringify(envelope)).not.toContain("score");
  });

  it("routes explicit habit completion to the Habits owner", () => {
    expect(buildHabitCompletionIntent(habit, "2026-08-05")).toEqual({
      source: "habits",
      owner: "habits",
      habitId: "habit-1",
      dateKey: "2026-08-05",
      action: "complete",
      meaning: "user-provided",
      changesOnlyHabitCompletion: true,
    });
  });

  it("keeps Schedule planned and routes task changes to Tasks", () => {
    const envelope = buildScheduleSupport([taskScheduleItem]);
    expect(envelope.provenance).toBe("planned");
    expect(envelope.limitation).toContain("planning context only");
    expect(buildScheduleOwnerRoute(taskScheduleItem)).toMatchObject({
      owner: "tasks",
      recordId: "task-1",
      action: "open-owner",
    });
  });

  it("keeps Notes optional and distinguishes disconnected context", () => {
    const envelope = buildNotesSupport([], { disconnected: true });
    expect(envelope.state).toBe("disconnected");
    expect(envelope.data).toEqual([]);
    expect(envelope.limitation).toContain("not treated as absent");
  });

  it("preserves confirmed supporting context as stale on a failed refresh", () => {
    const confirmed = buildScheduleSupport([taskScheduleItem]);
    const stale = buildUnavailableSupporting({
      source: "schedule",
      previous: confirmed,
      limitation: "Schedule refresh failed.",
    });

    expect(stale.state).toBe("stale");
    expect(stale.freshness).toBe("last-confirmed");
    expect(stale.data).toEqual([taskScheduleItem]);
    expect(getSupportingRecoveryChoices(stale)).toEqual([
      "retry",
      "open-owner",
      "leave",
    ]);
  });

  it("maps an unconfirmed source to unavailable rather than empty", () => {
    const unavailable = buildSupportingReadError("notes");
    expect(unavailable.state).toBe("unavailable");
    expect(unavailable.provenance).toBe("unavailable");
    expect(unavailable.data).toBeNull();
    expect(unavailable.limitation).not.toContain("database");
  });
});
