import { describe, expect, it } from "vitest";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import {
  getTimelineTaskFocusClock,
  isTimelineTaskInFocus,
} from "@/lib/timeline-task-focus";

function makeSession(
  overrides: Partial<StoredActiveFocusSession> = {}
): StoredActiveFocusSession {
  return {
    timer_type: "quick",
    mode: "focus",
    session_status: "in_progress",
    started_at: new Date(0).toISOString(),
    focus_duration: 25,
    break_duration: 5,
    phase_started_at: null,
    phase_end_at_ms: null,
    paused_segment_seconds: 0,
    accumulated_focus_seconds: 0,
    accumulated_break_seconds: 0,
    label: "Focus",
    target_type: "task",
    target_id: "task-1",
    task_focus_totals: { "task-1": 65 },
    task_focus_started_at: null,
    ...overrides,
  };
}

describe("timeline-task-focus", () => {
  it("is active only for the focused task in focus mode", () => {
    const session = makeSession();
    expect(isTimelineTaskInFocus(session, "task-1")).toBe(true);
    expect(isTimelineTaskInFocus(session, "task-2")).toBe(false);
    expect(isTimelineTaskInFocus(null, "task-1")).toBe(false);
  });

  it("hides focus chrome during break", () => {
    const session = makeSession({ mode: "break" });
    expect(isTimelineTaskInFocus(session, "task-1")).toBe(false);
  });

  it("keeps focus chrome while paused", () => {
    const session = makeSession({ session_status: "paused" });
    expect(isTimelineTaskInFocus(session, "task-1")).toBe(true);
  });

  it("formats the per-task elapsed clock", () => {
    const session = makeSession({
      task_focus_totals: { "task-1": 125 },
      task_focus_started_at: null,
    });
    expect(getTimelineTaskFocusClock(session, "task-1")).toBe("02:05");
  });
});
