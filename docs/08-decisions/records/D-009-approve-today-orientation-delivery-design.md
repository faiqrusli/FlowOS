# D-009: Approve Today Orientation Delivery Design and Validation Plan

**Status:** Accepted
**Authority:** Founder scope/design checkpoint for Phase 3 P1 implementation
**Owner:** Founder
**Parent:** [D-008 — Pass Gate 2 and Authorize Phase 3](./D-008-pass-gate-2-and-authorize-phase-3.md) · [Today behavior contract](../../04-features/behavior/today.md) · [Today design specification](../../05-design/features/today-design-spec.md)
**Affected documents:** [Today delivery design](../../04-features/delivery/today-orientation.md) · [Today validation plan](../../04-features/validation/today-orientation.md) · [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Created:** 2026-08-05
**Decision type:** Product scope and engineering delivery checkpoint
**Review trigger:** A change to Today’s source set, canonical owner, durable-write boundary, source settlement/recovery approach, route contract, or validation threshold
**Evidence links:** [Today delivery design](../../04-features/delivery/today-orientation.md) · [Today validation plan](../../04-features/validation/today-orientation.md) · [P0 handoff baseline](../../current-phase/phase-3/README.md#p0-handoff-baseline)
**Disposition:** Accepted — Founder approved the Today orientation scope/design checkpoint; P1 implementation authorized within the admitted Phase 2 boundary

## Context and trigger

Phase 3 P0 reviewed the archived Phase 2 contracts, journey, record rules, supporting-domain decisions, design specifications, and carried limitations. The Product Architect and Engineering Architect then drafted the Today orientation delivery design and validation plan before implementation.

The current implementation baseline combines all-or-nothing dashboard reads, score-like “on track” language, and editable task/habit surfaces inside the Today composition. Those behaviors require an explicit boundary decision before code can preserve the approved Today contract.

## Evidence and assumptions

- The [Today behavior contract](../../04-features/behavior/today.md) makes Today a composition, freshness, and handoff-disclosure owner; linked domains own durable mutations.
- The [Today design specification](../../05-design/features/today-design-spec.md) requires source identity, truth meaning, material state, recovery, and accessible owner entry across the composition.
- [D-008](./D-008-pass-gate-2-and-authorize-phase-3.md) authorizes Phase 3 within the admitted boundary and carries the pending migrations, RLS verification, Singapore midnight testing, Schedule keyboard review, technical debt, and build-environment conditions downstream.
- The delivery design and validation plan propose independent source settlement, source-scoped retry, read-only Today composition, owner handoff, and route recovery. They do not claim implementation or validation results.

## Options considered

1. **Approve the proposed bounded delivery path.** Preserve Today as read/composition-only, separate it from Workplace mutation ownership, settle source reads independently, and validate all `TODAY-*` questions. This preserves the contract and is selected.
2. **Keep the current Workplace composition as-is.** Rejected because it leaves Today mutation ownership and score-like meaning ambiguous and cannot represent partial source failure truthfully.
3. **Widen P1 with new source adapters, migrations, or autonomous prioritization.** Rejected because it expands the admitted MVP and would conceal pending migration truth.
4. **Defer Today implementation.** Not selected; the approved design and validation package is sufficient to begin the bounded P1 implementation while Gate 3 remains open.

## Decision

The Founder approves the Today orientation delivery design and validation plan and approves all four checkpoint decisions:

1. **P1 boundary:** Today orientation is read-only composition, source-aware state, canonical owner handoff, and route recovery. No new source, route, mutation, migration, score, inferred attribution, or implicit adaptation is admitted.
2. **Composition boundary:** Today composition must be separated from the current Workplace task/habit mutation surface, either by extracting read-only composition pieces or by an explicit read-only mode whose absent mutation handlers are testable.
3. **Recovery approach:** Source reads settle independently, and source-scoped retry preserves unrelated confirmed context instead of failing the entire composition.
4. **Carried conditions:** Pending migrations, two-account RLS verification, Singapore midnight testing, Schedule keyboard review, existing lint/audit/middleware technical debt, and the incomplete local production-build environment remain explicit downstream conditions.

This decision authorizes the Implementation Engineer to begin Today P1 work on `sprint/phase3` against the approved delivery design and validation plan. It does not pass Gate 3, authorize migration application, authorize a production release, or resolve any carried condition.

## Consequences and risks

- Today implementation may begin without changing the approved product or ownership contracts.
- The current `/` route remains the rollout surface; no new route or durable Today record is introduced.
- The Today status rail must lose score-like “on track” meaning and report neutral composition/source state instead.
- A source failure must not erase unrelated confirmed context; source limitations must be visible and recoverable.
- Tasks, Focus, Reflection, Habits, Schedule, and Notes remain canonical owners of their own records and mutations.
- Gate 3 remains `NOT_STARTED` until implementation and validation evidence exist. G3-01 is in progress because Today’s design package is approved while other phase surfaces remain pending.

## Follow-through

1. Implement Today orientation on `sprint/phase3` without applying pending migrations or expanding the MVP.
2. Add automated, accessibility, security, recovery, seeded, empty, unavailable, and real-data evidence according to the validation plan.
3. Update the Gate 3 checklist with factual evidence; do not convert this approval into a Gate 3 pass.
4. Reopen this record and the affected parent documents if implementation discovery changes ownership, source meaning, route admission, durable writes, or recovery semantics.

## Review and supersession

This decision is reconsidered if the Today contract, design specification, source ownership, migration availability, or validation evidence changes materially. A successor or correction record must preserve this accepted history.
