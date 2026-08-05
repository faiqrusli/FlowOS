# Phase 3: Implement and Harden the Core Loop

**Purpose:** Make the admitted MVP useful in one continuous experience, not as a collection of disconnected polished pages.
**Status:** `ACTIVE` — authorized by Gate 2 `PASS` on 2026-08-05; P1 Today implementation in progress; P2–P6 implementation packages ready for Founder checkpoints
**Owner:** Founder, executing the six-hat workflow
**Gate:** Gate 3 — Core-loop readiness
**Created:** 2026-08-05
**Last updated:** 2026-08-05

**Single implementation reference:** The [Current Sprint](../current-sprint.md) is the authoritative Phase 3 execution register. It links each package to its approved Phase 2 contract/design authority, delivery design, validation plan, implementation tasks, acceptance IDs, and Gate 3 evidence requirement.

**Execution plan:** [Current Sprint](../current-sprint.md)
**Gate record:** [Gate 3 checklist](./gate-checklist.md)
**Masterplan:** [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Phase 2 handoff:** [Archived Phase 2 sprint](../../11-archive/phases/phase-2/phase-2-sprint.md) · [D-008](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)

## Entry condition

Gate 2 passed because every admitted behavior has a parent system, journey stage, behavior contract, design expression, technical/data owner, and validation question. Phase 3 may create delivery designs and implementation within that boundary. It may not silently widen the MVP or replace an unresolved contract with code.

## P0 handoff baseline

**State:** `COMPLETE` on `sprint/phase3`; completed before P1 implementation began.

The archived Phase 2 sprint record and Gate 2 checklist, four core behavior contracts, bounded coherent-loop journey, supporting-domain decisions, record/provenance/correction/continuity rules, and four feature design specifications were reviewed as the implementation authority. The Phase 2 limitations remain active: pending/unverified Next Up and Focus attribution migrations, outstanding two-account RLS verification, Singapore midnight testing, Schedule keyboard review, existing lint/audit/middleware technical debt, and the incomplete local production-build environment.

## Implementation order

1. Today orientation and route recovery.
2. Task commitment and action.
3. Focus action mode and interruption recovery.
4. Factual evidence.
5. Reflection and explicit adaptation handoff.
6. Minimum supporting Habits, Schedule, and Notes paths.
7. Gate 3 evidence and Founder decision.

## Package readiness

| Package | Delivery/validation package | State |
|---|---|---|
| P1 Today orientation | [Delivery design](../../04-features/delivery/today-orientation.md) · [Validation plan](../../04-features/validation/today-orientation.md) | `APPROVED` / implementation in progress |
| P2 Tasks commitment/action | [Delivery design](../../04-features/delivery/tasks-core-loop.md) · [Validation plan](../../04-features/validation/tasks-core-loop.md) | `READY_FOR_FOUNDER_CHECKPOINT` |
| P3 Focus action mode | [Delivery design](../../04-features/delivery/focus-core-loop.md) · [Validation plan](../../04-features/validation/focus-core-loop.md) | `READY_FOR_FOUNDER_CHECKPOINT` |
| P4 Factual evidence | [Delivery design](../../04-features/delivery/factual-evidence.md) · [Validation plan](../../04-features/validation/factual-evidence.md) | `READY_FOR_FOUNDER_CHECKPOINT` |
| P5 Reflection/adaptation | [Delivery design](../../04-features/delivery/reflection-core-loop.md) · [Validation plan](../../04-features/validation/reflection-core-loop.md) | `READY_FOR_FOUNDER_CHECKPOINT` |
| P6 Supporting surfaces | [Delivery design](../../04-features/delivery/supporting-surfaces.md) · [Validation plan](../../04-features/validation/supporting-surfaces.md) | `READY_FOR_FOUNDER_CHECKPOINT` |
| P7 Gate 3 evidence | [Gate 3 checklist](./gate-checklist.md) | `NOT_STARTED` until implementation evidence exists |

The package artifacts are complete for Founder review but remain drafts until explicitly approved. Gate 3 remains open and is not implied by planning readiness.

## Guardrails

- Today composes; Tasks owns task commitments and Next Up; Focus owns session facts; Reflection owns interpretation; receiving owners apply adaptations.
- Keep pending or unverified migrations unavailable until applied and verified.
- Use user-scoped access/RLS, shared validation, `Asia/Singapore` date keys, instant timestamps, and local-draft semantics.
- No new route, deferred-domain admission, autonomous prioritization, inferred attribution, implicit adaptation, or production release is authorized by Phase 3 entry alone.
- All implementation tasks, acceptance IDs, evidence requirements, and Founder checkpoints are maintained in the [Current Sprint](../current-sprint.md), not in this summary page.

## Work status

- **P0 — Handoff baseline:** `COMPLETE` on `sprint/phase3`; completed before P1 implementation began.
- **P1 — Today orientation:** Delivery design and validation plan `APPROVED` by Founder on 2026-08-05; read-only composition baseline implemented, automated evidence passing, manual validation pending.
- **P2–P6 — Core-loop implementation:** Delivery/validation packages ready for Founder checkpoints; implementation not authorized until each checkpoint is explicit.
- **P7 — Gate 3 evidence:** `NOT_STARTED`.

## Exit condition

Gate 3 passes only when the Founder can perform the full journey with seeded and real data, recover from interruptions and errors, distinguish factual from interpretive meaning, and reach the owning surface for every consequential change. Gate 4 remains required before release.
