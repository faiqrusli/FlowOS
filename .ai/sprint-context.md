# FlowOS Current Sprint Context (Quick Reference)

**Sprint Period:** 2026-08-05 onward (active; Today P1 implementation in progress)
**Phase:** Phase 3 — Implement and Harden the Core Loop
**Gate Target:** Gate 3 — Core-loop readiness
**Last Updated:** 2026-08-05
**Handoff branch:** `sprint/phase3` — Phase 2 closeout merged into `main` at `5b47360`; Today P1 implementation is in progress.

## Quick Overview

**What we're doing:** Implementing the admitted MVP as one coherent experience using the approved Phase 2 contracts, design specifications, ownership rules, and recovery states.

**Why:** Gate 2 passed because every admitted behavior is traceable. Phase 3 now makes that loop work with seeded and real data without inventing product meaning or collapsing canonical ownership.

**Authority:** [Current sprint](../docs/current-phase/current-sprint.md), [Phase 3 README](../docs/current-phase/phase-3/README.md), [Gate 3 checklist](../docs/current-phase/phase-3/gate-checklist.md), and the [MVP Implementation Masterplan](../docs/current-phase/mvp-implementation-masterplan.md).

## Phase 2 Handoff

- Gate 2 `PASS` recorded 2026-08-05 through [D-008](../docs/08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md).
- Complete sprint record and archived checklist: [Phase 2 archive](../docs/11-archive/phases/phase-2/).
- Approved briefs, behavior contracts, journey, supporting-domain decisions, record rules, and design specifications remain the implementation contract.
- Gate 2 authorization does not imply Gate 3 readiness or release readiness.

## Phase 3 Implementation Order

1. Today orientation, current context, next-action visibility, and route recovery.
2. Task commitment/action: create, clarify, select, start, complete, revise, defer, and recover.
3. Focus mode: deliberate attention, interruption handling, persistence, and truthful history.
4. Factual evidence without universal scoring or inferred outcomes.
5. Reflection/adaptation with provenance and receiving-owner authority.
6. Minimum supporting Habits, Schedule, and Notes paths justified by the journey.

## Gate 3 Exit Criteria

- [ ] Approved delivery designs and validation plans exist.
- [ ] Today orientation and route recovery work with seeded and real data.
- [ ] Tasks support commitment/action and explicit recovery.
- [ ] Focus records truthful session evidence and handles interruption.
- [ ] Reflection preserves interpretation and explicit adaptation handoff.
- [ ] Supporting surfaces remain bounded and non-blocking.
- [ ] Identity/RLS, validation, date/time, local-draft, and migration-truth boundaries hold.
- [ ] Founder completes the coherent loop and records a Gate 3 decision.

## Non-negotiable boundaries

- Today composes; Tasks owns task commitments; Focus owns session facts; Reflection owns interpretation; receiving owners apply adaptations.
- Pending `tasks_next_up_queue.sql` and `focus_session_task_totals.sql` behavior remains unavailable until applied and verified.
- No deferred domain, new route, autonomous prioritization, inferred attribution, implicit adaptation, or release claim is authorized by Phase 3 entry.

## Quality and approval

- Wear all six hats; create delivery designs before implementation and validation evidence before Gate 3.
- Run the security checklist and build/lint/test checks before merge review.
- Keep `main` read-only. Commit on the phase branch and request Founder approval; never merge without explicit authorization.
