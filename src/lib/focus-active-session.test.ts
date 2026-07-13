import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createQuickFocusSession,
  finalizeCurrentTaskFocus,
  getTaskFocusedSeconds,
  quickResumeFocus,
  quickStartBreak,
  resumeSession,
  setQuickFocusTarget,
  pauseSession,
} from "@/lib/focus-active-session";

const START = new Date("2026-07-10T10:00:00.000Z");

describe("task focus attribution", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps focused time with each task across switches", () => {
    let session = createQuickFocusSession({
      target_type: "task",
      target_id: "task-a",
      label: "Task A",
    });

    vi.advanceTimersByTime(120_000);
    session = setQuickFocusTarget(session, {
      type: "task",
      id: "task-b",
      label: "Task B",
    });

    vi.advanceTimersByTime(90_000);
    session = setQuickFocusTarget(session, {
      type: "task",
      id: "task-a",
      label: "Task A",
    });

    vi.advanceTimersByTime(30_000);
    const finalized = finalizeCurrentTaskFocus(session);

    expect(getTaskFocusedSeconds(finalized, "task-a")).toBe(150);
    expect(getTaskFocusedSeconds(finalized, "task-b")).toBe(90);
  });

  it("does not credit pause or break time to the active task", () => {
    let session = createQuickFocusSession({
      target_type: "task",
      target_id: "task-a",
    });

    vi.advanceTimersByTime(60_000);
    session = pauseSession(session);
    vi.advanceTimersByTime(10 * 60_000);
    session = resumeSession(session);
    vi.advanceTimersByTime(60_000);
    session = quickStartBreak(session);
    vi.advanceTimersByTime(5 * 60_000);
    session = quickResumeFocus(session);
    vi.advanceTimersByTime(60_000);

    const finalized = finalizeCurrentTaskFocus(session);
    expect(getTaskFocusedSeconds(finalized, "task-a")).toBe(180);
  });
});
