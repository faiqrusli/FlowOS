import { describe, expect, it } from "vitest";
import {
  adaptFocusAttributionEvidence,
  adaptFocusEvidence,
  adaptTaskEvidence,
  buildDerivedEvidence,
  buildUnavailableEvidence,
} from "@/lib/factual-evidence";
import type { FocusSession } from "@/types/focus";
import type { Task } from "@/types/task";

const task: Task = {
  id: "task-1",
  title: "Prepare review",
  description: null,
  scheduled_date: "2026-08-05",
  scheduled_time: null,
  priority: "high",
  user_id: "user-1",
  group_id: null,
  sort_order: 1,
  queue_order: null,
  duration_minutes: 30,
  notification_enabled: false,
  notification_lead_minutes: null,
  completed: false,
  planning_state: "none",
  withdrawn_at: null,
  created_at: "2026-08-05T00:00:00.000Z",
  updated_at: "2026-08-05T01:00:00.000Z",
  completed_at: null,
};

const session: FocusSession = {
  id: "session-1",
  focus_duration: 600,
  break_duration: 0,
  started_at: "2026-08-05T01:00:00.000Z",
  ended_at: "2026-08-05T01:10:00.000Z",
  session_status: "completed",
  target_type: "task",
  target_id: task.id,
  user_id: "user-1",
  created_at: "2026-08-05T01:10:00.000Z",
};

describe("factual evidence envelopes", () => {
  it("retains task owner, identity, provenance, scope, and correction route", () => {
    const evidence = adaptTaskEvidence(task, { dateKey: "2026-08-05" });

    expect(evidence).toMatchObject({
      source: "tasks",
      owner: "tasks",
      recordId: "task-1",
      provenance: "direct",
      freshness: "current",
      scope: { kind: "task", userScoped: true, dateKey: "2026-08-05" },
      correction: { owner: "tasks", recordId: "task-1", action: "open-owner" },
    });
  });

  it("keeps withdrawn history factual without relabelling it completion", () => {
    const evidence = adaptTaskEvidence({
      ...task,
      withdrawn_at: "2026-08-05T02:00:00.000Z",
    });

    expect(evidence.freshness).toBe("historical");
    expect(evidence.limitation).toContain("not completion");
    expect(evidence.data?.completed).toBe(false);
  });

  it("keeps Focus timing session-scoped and attribution unavailable", () => {
    const evidence = adaptFocusEvidence(session, {
      dateKey: "2026-08-05",
      attributionAvailable: false,
    });
    const attribution = adaptFocusAttributionEvidence(session, [], {
      available: false,
      limitation: "Migration is pending.",
    });

    expect(evidence.provenance).toBe("direct");
    expect(evidence.scope.kind).toBe("session");
    expect(evidence.limitation).toContain("session evidence");
    expect(attribution.provenance).toBe("unavailable");
    expect(attribution.data).toBeNull();
    expect(attribution.limitation).toBe("Migration is pending.");
  });

  it("records derivation inputs instead of promoting a summary to a direct fact", () => {
    const evidence = buildDerivedEvidence({
      source: "focus",
      owner: "focus",
      scope: { kind: "date", dateKey: "2026-08-05", userScoped: true },
      data: { totalSeconds: 600 },
      inputs: ["session-1"],
      rule: "Sum confirmed session focus_duration values for the date key.",
      derivedAt: "2026-08-05T02:00:00.000Z",
    });

    expect(evidence.provenance).toBe("derived");
    expect(evidence.derivation).toEqual({
      rule: "Sum confirmed session focus_duration values for the date key.",
      inputs: ["session-1"],
      derivedAt: "2026-08-05T02:00:00.000Z",
    });
  });

  it("does not turn an unavailable source into empty evidence", () => {
    const evidence = buildUnavailableEvidence<string[]>({
      source: "notes",
      owner: "notes",
      limitation: "Notes could not be confirmed.",
    });

    expect(evidence.provenance).toBe("unavailable");
    expect(evidence.data).toBeNull();
    expect(evidence.limitation).toBe("Notes could not be confirmed.");
  });
});

