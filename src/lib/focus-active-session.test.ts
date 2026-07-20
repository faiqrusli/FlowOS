import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createQuickFocusSession,
  finalizeCurrentTaskFocus,
  formatQuickClock,
  getQuickClockSeconds,
  getQuickExecutionSeconds,
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

describe("continuous quick execution timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows break segment on break, then resumes focus from accumulated time", () => {
    let session = createQuickFocusSession();

    vi.advanceTimersByTime(45 * 60_000);
    expect(getQuickClockSeconds(session)).toBe(45 * 60);
    expect(formatQuickClock(session)).toBe("45:00");

    session = quickStartBreak(session);
    vi.advanceTimersByTime(5 * 60_000);
    // Break clock counts break elapsed (same as before)
    expect(getQuickClockSeconds(session)).toBe(5 * 60);
    expect(formatQuickClock(session)).toBe("05:00");
    // Focused total is preserved while on break
    expect(getQuickExecutionSeconds(session)).toBe(45 * 60);

    session = quickResumeFocus(session);
    expect(getQuickClockSeconds(session)).toBe(45 * 60);
    expect(formatQuickClock(session)).toBe("45:00");

    vi.advanceTimersByTime(5 * 60_000);
    expect(getQuickClockSeconds(session)).toBe(50 * 60);
    expect(formatQuickClock(session)).toBe("50:00");
  });

  it("pause freezes the current clock; resume continues it", () => {
    let session = createQuickFocusSession();
    vi.advanceTimersByTime(10 * 60_000);
    session = pauseSession(session);
    vi.advanceTimersByTime(3 * 60_000);
    expect(formatQuickClock(session)).toBe("10:00");

    session = resumeSession(session);
    vi.advanceTimersByTime(2 * 60_000);
    expect(formatQuickClock(session)).toBe("12:00");
  });

  it("formats multi-hour sessions with an hours segment", () => {
    const session = createQuickFocusSession();
    vi.advanceTimersByTime(92 * 60_000 + 18_000);
    expect(formatQuickClock(session)).toBe("1:32:18");
  });
});
