# Phase 3 Gate Checklist — Gate 3: Core-loop Readiness

**Status:** `IN_PROGRESS` — P1 implementation in progress; P2–P6 approved for implementation by D-010; Gate 3 evidence incomplete
**Owner:** Founder, executing all six hats
**Parent:** [Phase 3 README](./README.md) · [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Entry decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Package approval:** [D-010 — Approve P2–P6 Delivery Designs](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-05

## Gate definition

Gate 3 passes only when a Founder can perform the complete admitted journey with seeded and real data, recover from interruptions and errors, understand what is factual versus interpretive, and reach the owning surface for every consequential change.

This checklist is the Gate 3 evidence register. `NOT_STARTED` is intentional until implementation and validation evidence exist. Package planning readiness, Founder checkpoint approval, implementation completion, and Gate 3 passage are separate states. Gate 2 authorization does not imply Gate 3 readiness.

## Phase 3 entry baseline

**P0 — Handoff baseline:** `COMPLETE` on `sprint/phase3`.

The archived Phase 2 sprint record and Gate 2 checklist, four core behavior contracts, bounded coherent-loop journey, supporting-domain decisions, record/provenance/correction/continuity rules, and four feature design specifications remain authoritative. Pending/unverified migrations, two-account RLS verification, Singapore midnight testing, Schedule keyboard review, existing lint/audit/middleware technical debt, and the incomplete local production-build environment are carried forward as downstream conditions.

**Today P1 checkpoint:** `APPROVED` by Founder on 2026-08-05 through [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md).

**P2–P6 checkpoint:** `APPROVED` by Founder on 2026-08-05 through [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md). All five packages authorized for implementation. Technical debt disposition: [D-011](../../08-decisions/records/D-011-phase-3-technical-debt-disposition.md). Migration protocol: [D-012](../../08-decisions/records/D-012-migration-application-protocol.md). Environment configuration: [D-013](../../08-decisions/records/D-013-phase3-environment-configuration.md).

## Exit criteria

| ID | Requirement | Evidence | State |
|---|---|---|---|
| G3-01 | Approved delivery designs and validation plans exist | All six packages approved: P1 Today ([D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md)), P2–P6 ([D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md)). Implementation authorized. Validation evidence collection in progress. | `APPROVED` |
| G3-02 | Today orientation and route recovery work | [Today implementation evidence](./today-orientation-implementation-evidence.md) plus seeded/real `/` walkthrough, direct/re-entry/handoff/retry/recovery, accessibility, and no-write evidence | `IN_PROGRESS` |
| G3-03 | Tasks support commitment and action | [Tasks validation plan](../../04-features/validation/tasks-core-loop.md) execution covering all `TASK-*` questions, lifecycle, selection unchanged-state, correction/defer/withdrawal, and recovery | `NOT_STARTED` |
| G3-04 | Focus and factual evidence are truthful | [Focus validation plan](../../04-features/validation/focus-core-loop.md) and [factual evidence validation plan](../../04-features/validation/factual-evidence.md) covering all `FOCUS-*`/`RECORD-*` questions, interruption, persistence, history, and attribution fallback | `NOT_STARTED` |
| G3-05 | Reflection preserves interpretation and adaptation authority | [Reflection validation plan](../../04-features/validation/reflection-core-loop.md) covering all `REFLECT-*` questions, draft/save/retry/correct/re-entry, and receiving-owner handoff | `NOT_STARTED` |
| G3-06 | Supporting surfaces are bounded and non-blocking | [Supporting surfaces validation plan](../../04-features/validation/supporting-surfaces.md) covering all `SUPPORT-*` questions, optional states, source ownership, accessibility, and non-blocking recovery | `NOT_STARTED` |
| G3-07 | Security, identity, validation, date/time, and recovery boundaries hold | Cross-package security checklist, two-account RLS, shared validation, Singapore boundary, instant timestamps, local drafts, pending-migration truth, and technical-debt disposition | `NOT_STARTED` |
| G3-08 | Founder can complete the coherent loop | Full seeded/real-data walkthrough linked to package evidence, with interruption, failure, correction, factual/interpretive distinction, and owner-routing evidence | `NOT_STARTED` |

## Package approval checkpoint

**Status:** `COMPLETE` — All packages approved by Founder on 2026-08-05

- P1 Today: [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md) — APPROVED
- P2 Tasks: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P3 Focus: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P4 Evidence: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P5 Reflection: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P6 Supporting: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED

Implementation may proceed in fixed sequence: P2 → P3 → P4 → P5 → P6 → P7.

## Carried conditions and disposition

**Disposition authority:** [D-011 — Phase 3 Technical Debt Disposition](../../08-decisions/records/D-011-phase-3-technical-debt-disposition.md)

| Condition | Gate 3 | Gate 4 | Status |
|---|---|---|---|
| Environment configuration | Required | Required | ✅ COMPLETE ([D-013](../../08-decisions/records/D-013-phase3-environment-configuration.md)) |
| Critical lint (refs/immutability) | Required | Required | ✅ COMPLETE (8 fixed on 2026-08-05) |
| Remaining lint warnings (203) | Partial | Required | 🔄 Address during P2-P6 |
| Pending migrations | Partial | Required | ⏳ P7 ([D-012](../../08-decisions/records/D-012-migration-application-protocol.md)) |
| Two-account RLS verification | Deferred | Required | ⏳ Pre-Gate-4 |
| Singapore midnight boundary | Deferred | Required | ⏳ Pre-Gate-4 |
| Schedule keyboard accessibility | Deferred | Required | ⏳ Pre-Gate-4 |
| Browser smoke/accessibility | Partial | Required | ⏳ Seeded walkthrough only for G3 |

**Migration protocol:** [D-012](../../08-decisions/records/D-012-migration-application-protocol.md) defines P7 application timing, two-account verification, and rollback procedure for `tasks_next_up_queue.sql` and `focus_session_task_totals.sql`.

**Technical debt:** Critical lint issues (refs/immutability) fixed on 2026-08-05. Remaining 203 non-critical warnings will be addressed during P2-P6 implementation per [D-011](../../08-decisions/records/D-011-phase-3-technical-debt-disposition.md). RLS, timezone, and accessibility verification deferred to pre-Gate-4 hardening sprint.

## Decision

**Decision:** Pending — choose exactly one: `PASS`, `HOLD`, or `REWORK`.
**Date:** TBD
**Founder:** Founder
**Rationale:** TBD
**Next-phase authorization:** TBD
