# Phase 3 Gate Checklist — Gate 3: Core-loop Readiness

**Status:** NOT_STARTED — Phase 3 authorized; implementation not started
**Owner:** Founder, executing all six hats
**Parent:** [Phase 3 README](./README.md) · [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Entry decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-05

## Gate definition

Gate 3 passes only when a Founder can perform the complete admitted journey with seeded and real data, recover from interruptions and errors, understand what is factual versus interpretive, and reach the owning surface for every consequential change.

This checklist is a starting record for Phase 3. `NOT_STARTED` is intentional until implementation and validation evidence exist. Gate 2 authorization does not imply Gate 3 readiness.

## Exit criteria

| ID | Requirement | Evidence | State |
|---|---|---|---|
| G3-01 | Approved delivery designs and validation plans exist | Per-surface delivery and validation artifacts linked to Phase 2 contracts | `NOT_STARTED` |
| G3-02 | Today orientation and route recovery work | Seeded and real-data entry, re-entry, owner handoff, and recovery evidence | `NOT_STARTED` |
| G3-03 | Tasks support commitment and action | Create, clarify, select, start, complete, revise, defer, withdrawal, correction, and recovery evidence | `NOT_STARTED` |
| G3-04 | Focus records truthful action/session evidence | Start, pause, resume, conclude, interruption, persistence, history, and unavailable attribution evidence | `NOT_STARTED` |
| G3-05 | Reflection preserves interpretation and adaptation authority | Draft/save/retry/correct/re-entry and receiving-owner handoff evidence | `NOT_STARTED` |
| G3-06 | Supporting surfaces remain bounded and non-blocking | Habits, Schedule, and Notes empty/unavailable behavior and source ownership evidence | `NOT_STARTED` |
| G3-07 | Security, identity, validation, date/time, and recovery boundaries hold | User-scoped access/RLS, shared validation, Singapore date keys, instant timestamps, local drafts, and pending-migration evidence | `NOT_STARTED` |
| G3-08 | Founder can complete the coherent loop | Manual seeded/real-data walkthrough with interruption, failure, correction, and owner-routing evidence | `NOT_STARTED` |

## Carried conditions

- `tasks_next_up_queue.sql` and `focus_session_task_totals.sql` remain unavailable until applied and verified.
- Two-account RLS/security verification, Singapore midnight boundary testing, deferred Schedule keyboard review, existing lint warnings, audit vulnerabilities, and middleware deprecation remain owned downstream conditions.
- The local production build currently cannot prerender `/about` because `NEXT_PUBLIC_SUPABASE_URL` is not configured in this worktree; repeat the build with the required environment before Gate 3 evidence is accepted.
- No Gate 3 pass or production-release claim may be recorded until these conditions are evidenced or explicitly dispositioned by the Founder.

## Decision

**Decision:** Pending — choose exactly one: `PASS`, `HOLD`, or `REWORK`.
**Date:** TBD
**Founder:** Founder
**Rationale:** TBD
**Next-phase authorization:** TBD
