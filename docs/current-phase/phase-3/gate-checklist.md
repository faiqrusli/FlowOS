# Phase 3 Gate Checklist — Gate 3: Core-loop Readiness

**Status:** `IN_PROGRESS` — P2–P6 automated implementation evidence is recorded; the P1 orientation is deferred by D-014; manual/live evidence and the Gate 3 Founder decision remain
**Owner:** Founder, executing all six hats
**Parent:** [Phase 3 README](./README.md) · [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Entry decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Package approval:** [D-010 — Approve P2–P6 Delivery Designs](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-06

## Gate definition

Gate 3 passes only when a Founder can perform the complete admitted journey with seeded and real data, recover from interruptions and errors, understand what is factual versus interpretive, and reach the owning surface for every consequential change.

This checklist is the Gate 3 evidence register. `NOT_STARTED` is intentional until implementation and validation evidence exist. Package planning readiness, Founder checkpoint approval, implementation completion, and Gate 3 passage are separate states. Gate 2 authorization does not imply Gate 3 readiness.

## Phase 3 entry baseline

**P0 — Handoff baseline:** `COMPLETE` on `sprint/phase3`.

The archived Phase 2 sprint record and Gate 2 checklist, four core behavior contracts, bounded coherent-loop journey, supporting-domain decisions, record/provenance/correction/continuity rules, and four feature design specifications remain authoritative. Pending/unverified migrations, two-account RLS verification, Singapore midnight testing, Schedule keyboard review, audit/middleware technical debt, and the incomplete local production-build environment are carried forward as downstream conditions. Warning-free lint is tracked as an explicit P7 hardening requirement.

**Today P1 checkpoint:** `APPROVED` historically on 2026-08-05 through [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md); the separate orientation composition is deferred for MVP by D-014.

**P2–P6 checkpoint:** `APPROVED` by Founder on 2026-08-05 through [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md). All five packages authorized for implementation. Technical debt disposition: [D-011](../../08-decisions/records/D-011-phase-3-technical-debt-disposition.md). Migration protocol: [D-012](../../08-decisions/records/D-012-migration-application-protocol.md). Environment configuration: [D-013](../../08-decisions/records/D-013-phase3-environment-configuration.md).

**MVP route decision:** `ACCEPTED` by Founder on 2026-08-06 through [D-014](../../08-decisions/records/D-014-defer-today-orientation-and-make-workspace-canonical.md). The interactive workspace is the canonical Today entry at `/`; `/workplace` redirects to `/`; the separate read-only orientation package is deferred.

## Exit criteria

| ID | Requirement | Evidence | State |
|---|---|---|---|
| G3-01 | Approved delivery designs and validation plans exist | P2–P6 remain active approved packages ([D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md)); P1 orientation approval is retained historically but deferred by [D-014](../../08-decisions/records/D-014-defer-today-orientation-and-make-workspace-canonical.md). | `APPROVED` |
| G3-02 | Canonical Today workspace and route recovery work | Route regression evidence plus seeded/real `/` workspace walkthrough, direct/re-entry/handoff/retry/recovery, accessibility, and owner-boundary evidence | `IN_PROGRESS` |
| G3-03 | Tasks support commitment and action | [Tasks implementation evidence](./tasks-implementation-evidence.md) plus validation plan covering all `TASK-*` questions, lifecycle, selection unchanged-state, correction/defer/withdrawal, and recovery | `AUTOMATED_EVIDENCE` — manual/live pending |
| G3-04 | Focus and factual evidence are truthful | [Focus implementation evidence](./focus-implementation-evidence.md) and [factual evidence implementation evidence](./factual-evidence-implementation-evidence.md) plus validation plans covering all `FOCUS-*`/`RECORD-*` questions | `AUTOMATED_EVIDENCE` — manual/live pending |
| G3-05 | Reflection preserves interpretation and adaptation authority | [Reflection implementation evidence](./reflection-implementation-evidence.md) plus validation plan covering all `REFLECT-*` questions, draft/save/retry/correct/re-entry, and receiving-owner handoff | `AUTOMATED_EVIDENCE` — manual/live pending |
| G3-06 | Supporting surfaces are bounded and non-blocking | [Supporting surfaces implementation evidence](./supporting-surfaces-implementation-evidence.md) plus validation plan covering all `SUPPORT-*` questions, optional states, source ownership, accessibility, and non-blocking recovery | `AUTOMATED_EVIDENCE` — manual/live pending |
| G3-07 | Security, identity, validation, date/time, and recovery boundaries hold | [P7 repository quality and runtime evidence](./p7-quality-evidence.md) plus automated owner/validation/date/recovery assertions and migration gates; two-account RLS, Singapore boundary, accessibility, and migration application remain open | `IN_PROGRESS` |
| G3-08 | Founder can complete the coherent loop | Full seeded/real-data walkthrough linked to package evidence, with interruption, failure, correction, factual/interpretive distinction, and owner-routing evidence | `NOT_STARTED` |

## Package approval checkpoint

**Implementation update (2026-08-05):** P2 Tasks automated implementation is complete and linked from [Tasks implementation evidence](./tasks-implementation-evidence.md). Manual/live evidence is held for the final P7 pass, per the current sprint instruction.

**Implementation update (2026-08-05):** P3 Focus automated implementation is complete and linked from [Focus implementation evidence](./focus-implementation-evidence.md). Manual/live evidence is held for the final P7 pass.

**Implementation update (2026-08-05):** P4, P5, and P6 automated implementation evidence is linked above. Manual/browser/RLS/timezone/accessibility checks are held until all Phase 3 implementation packages are complete, then collected as the final P7 validation pass.

**Status:** `COMPLETE` — Active P2–P6 packages approved by Founder on 2026-08-05; P1 orientation deferred by D-014

- P1 Today orientation: [D-009](../../08-decisions/records/D-009-approve-today-orientation-delivery-design.md) — APPROVED historically; deferred for MVP by [D-014](../../08-decisions/records/D-014-defer-today-orientation-and-make-workspace-canonical.md)
- P2 Tasks: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P3 Focus: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P4 Evidence: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P5 Reflection: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED
- P6 Supporting: [D-010](../../08-decisions/records/D-010-approve-p2-p6-delivery-designs.md) — APPROVED

Active implementation packages P2–P6 are complete. P1 orientation is deferred for MVP, and P7 now owns final automated/manual evidence collection for the canonical `/` workspace plus the Founder Gate 3 decision; no migration-backed capability is claimed before live application and verification.

## Carried conditions and disposition

**Disposition authority:** [D-011 — Phase 3 Technical Debt Disposition](../../08-decisions/records/D-011-phase-3-technical-debt-disposition.md)

| Condition | Gate 3 | Gate 4 | Status |
|---|---|---|---|
| Environment configuration | Required | Required | ✅ COMPLETE ([D-013](../../08-decisions/records/D-013-phase3-environment-configuration.md)) |
| Critical lint (refs/immutability) | Required | Required | ✅ COMPLETE (8 fixed on 2026-08-05) |
| Remaining lint warnings | Required | Required | ✅ COMPLETE — `npm run lint -- --max-warnings=0` passes with 0 warnings and 0 errors |
| Pending migrations | Partial | Required | ⏳ P7 ([D-012](../../08-decisions/records/D-012-migration-application-protocol.md)) |
| Two-account RLS verification | Deferred | Required | ⏳ Pre-Gate-4 |
| Singapore midnight boundary | Deferred | Required | ⏳ Pre-Gate-4 |
| Schedule keyboard accessibility | Deferred | Required | ⏳ Pre-Gate-4 |
| Browser smoke/accessibility | Partial | Required | ⏳ Seeded walkthrough only for G3 |

**Migration protocol:** [D-012](../../08-decisions/records/D-012-migration-application-protocol.md) defines P7 application timing, two-account verification, and rollback procedure for `tasks_next_up_queue.sql`, `focus_session_task_totals.sql`, and the pending Tasks lifecycle migration.

**Technical debt:** Critical lint issues (refs/immutability) and the remaining 202 lint warnings were resolved on 2026-08-05. Gate 3 quality evidence now records warning-free lint, passing tests/build/diff checks, and a clean focused secret/RLS-bypass scan. RLS, timezone, accessibility, browser, and migration verification remain open for the manual/live validation pass; the middleware convention deprecation remains carried technical debt.

## Decision

**Decision:** Pending — choose exactly one: `PASS`, `HOLD`, or `REWORK`.
**Date:** TBD
**Founder:** Founder
**Rationale:** TBD
**Next-phase authorization:** TBD
