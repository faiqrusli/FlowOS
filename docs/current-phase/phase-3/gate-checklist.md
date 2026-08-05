# Phase 3 Gate Checklist — Gate 3: Core-loop Readiness

**Status:** `NOT_STARTED` — Phase 3 authorized; P1 implementation is in progress, P2–P6 planning packages are ready for Founder checkpoints, and Gate 3 evidence is incomplete
**Owner:** Founder, executing all six hats
**Parent:** [Phase 3 README](./README.md) · [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Entry decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-05

## Gate definition

Gate 3 passes only when a Founder can perform the complete admitted journey with seeded and real data, recover from interruptions and errors, understand what is factual versus interpretive, and reach the owning surface for every consequential change.

This checklist is the Gate 3 evidence register. `NOT_STARTED` is intentional until implementation and validation evidence exist. Package planning readiness, Founder checkpoint approval, implementation completion, and Gate 3 passage are separate states. Gate 2 authorization does not imply Gate 3 readiness.

## Phase 3 entry baseline

**P0 — Handoff baseline:** `COMPLETE` on `sprint/phase3`.

The archived Phase 2 sprint record and Gate 2 checklist, four core behavior contracts, bounded coherent-loop journey, supporting-domain decisions, record/provenance/correction/continuity rules, and four feature design specifications remain authoritative. Pending/unverified migrations, two-account RLS verification, Singapore midnight testing, Schedule keyboard review, existing lint/audit/middleware technical debt, and the incomplete local production-build environment are carried forward as downstream conditions.

**Today P1 checkpoint:** `APPROVED` by Founder on 2026-08-05 through [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md). This authorizes Today implementation only; it does not change the Gate 3 status.

## Exit criteria

| ID | Requirement | Evidence | State |
|---|---|---|---|
| G3-01 | Approved delivery designs and validation plans exist | [Current sprint artifact register](../current-sprint.md#4-artifact-register-and-checkpoint-status) links the approved Today package and complete draft delivery/validation pairs for Tasks, Focus, factual evidence, Reflection, and supporting surfaces. Each remaining pair requires an explicit Founder checkpoint before implementation. | `IN_PROGRESS` |
| G3-02 | Today orientation and route recovery work | [Today implementation evidence](./today-orientation-implementation-evidence.md) plus seeded/real `/` walkthrough, direct/re-entry/handoff/retry/recovery, accessibility, and no-write evidence | `IN_PROGRESS` |
| G3-03 | Tasks support commitment and action | [Tasks validation plan](../../04-features/validation/tasks-core-loop.md) execution covering all `TASK-*` questions, lifecycle, selection unchanged-state, correction/defer/withdrawal, and recovery | `NOT_STARTED` |
| G3-04 | Focus and factual evidence are truthful | [Focus validation plan](../../04-features/validation/focus-core-loop.md) and [factual evidence validation plan](../../04-features/validation/factual-evidence.md) covering all `FOCUS-*`/`RECORD-*` questions, interruption, persistence, history, and attribution fallback | `NOT_STARTED` |
| G3-05 | Reflection preserves interpretation and adaptation authority | [Reflection validation plan](../../04-features/validation/reflection-core-loop.md) covering all `REFLECT-*` questions, draft/save/retry/correct/re-entry, and receiving-owner handoff | `NOT_STARTED` |
| G3-06 | Supporting surfaces are bounded and non-blocking | [Supporting surfaces validation plan](../../04-features/validation/supporting-surfaces.md) covering all `SUPPORT-*` questions, optional states, source ownership, accessibility, and non-blocking recovery | `NOT_STARTED` |
| G3-07 | Security, identity, validation, date/time, and recovery boundaries hold | Cross-package security checklist, two-account RLS, shared validation, Singapore boundary, instant timestamps, local drafts, pending-migration truth, and technical-debt disposition | `NOT_STARTED` |
| G3-08 | Founder can complete the coherent loop | Full seeded/real-data walkthrough linked to package evidence, with interruption, failure, correction, factual/interpretive distinction, and owner-routing evidence | `NOT_STARTED` |

## Package approval checkpoint

The following package pairs are ready for Founder scope/design approval before their implementation starts:

- [Tasks delivery design](../../04-features/delivery/tasks-core-loop.md) · [validation plan](../../04-features/validation/tasks-core-loop.md)
- [Focus delivery design](../../04-features/delivery/focus-core-loop.md) · [validation plan](../../04-features/validation/focus-core-loop.md)
- [Factual evidence delivery design](../../04-features/delivery/factual-evidence.md) · [validation plan](../../04-features/validation/factual-evidence.md)
- [Reflection delivery design](../../04-features/delivery/reflection-core-loop.md) · [validation plan](../../04-features/validation/reflection-core-loop.md)
- [Supporting surfaces delivery design](../../04-features/delivery/supporting-surfaces.md) · [validation plan](../../04-features/validation/supporting-surfaces.md)

Approval must be explicit and recorded before the corresponding package changes from `READY_FOR_FOUNDER_CHECKPOINT` to implementation authorized. This checklist remains a Gate 3 evidence register, not an approval record.

## Carried conditions

- `tasks_next_up_queue.sql` and `focus_session_task_totals.sql` remain unavailable until applied and verified.
- Two-account RLS/security verification, Singapore midnight boundary testing, deferred Schedule keyboard review, existing lint warnings, audit vulnerabilities, and middleware deprecation remain owned downstream conditions.
- A configured production build passed all 24 routes on 2026-08-05 with the required environment loaded transiently from the primary workspace; this worktree still has no local environment file, so future build runs require secure environment configuration before their result can be relied on.
- Browser smoke validation could not run in the current execution environment; no browser-based manual pass is claimed.
- No Gate 3 pass or production-release claim may be recorded until these conditions are evidenced or explicitly dispositioned by the Founder.

## Decision

**Decision:** Pending — choose exactly one: `PASS`, `HOLD`, or `REWORK`.
**Date:** TBD
**Founder:** Founder
**Rationale:** TBD
**Next-phase authorization:** TBD
