# Phase 2: Contract the Coherent MVP Loop

**Purpose:** Turn the changed product model into cross-surface contracts that Phase 3 can implement without inventing product meaning.
**Status:** CLOSED - Gate 2 PASSED 2026-08-05; Phase 3 authorized
**Owner:** Founder, executing the six-hat workflow
**Gate:** Gate 2 - Contract Coherence
**Created:** 2026-08-05
**Last updated:** 2026-08-05

**Archived sprint:** [Complete Phase 2 sprint record](../../11-archive/phases/phase-2/phase-2-sprint.md)
**Archived checklist:** [Archived Gate 2 checklist](../../11-archive/phases/phase-2/gate-checklist.md)
**Next phase:** [Phase 3 README](../phase-3/README.md) · [Current Sprint](../current-sprint.md)
**Gate record:** [Gate 2 checklist](./gate-checklist.md)
**Masterplan:** [MVP implementation masterplan](../mvp-implementation-masterplan.md)

The archived Phase 2 sprint is the historical execution reference. This README defines the closed phase boundary; the Gate 2 checklist and evidence package record the decision and traceability; feature, journey, and design documents define narrower contracts. The current sprint now carries the Phase 3 implementation structure.

## Phase boundary

Phase 2 writes feature briefs, behavior contracts, design specifications, and the bounded journey contract for the admitted MVP loop. It does not implement or harden Phase 3 behavior.

## Founder guardrails

- Phase 2 closeout was completed on `sprint/phase2` and merged into `main` via `5b47360` after explicit Founder authorization. Phase 3 work is now on `sprint/phase3`; `main` remains read-only for Phase 3 changes.
- Do not implement new core-loop behavior, create or apply production migrations, or refactor unrelated technical debt.
- Do not turn an existing route into a new MVP admission or promote Goals, AI Coach, Progress, Weekly Review, standalone Knowledge, or standalone Growth Areas.
- Do not create a delivery design to bypass an unresolved product or design decision.
- Any technical spike must be labeled `EXPLORATORY`, remain non-shipping, and not become contract evidence for an admitted behavior.
- Phase 2 artifacts alone do not authorize implementation, migration application, or release; the recorded Gate 2 `PASS` authorizes Phase 3 to begin within the admitted boundary. Phase 3 implementation must start on a dedicated Phase 3 branch after this handoff is approved and merged.

## In scope

- Today, Tasks, Focus, and Reflection feature briefs and behavior contracts.
- The six-stage journey: Orientation, Commitment, Action, Evidence, Sensemaking, Adaptation.
- Minimum optional Habits, Schedule, and Notes behavior.
- Source ownership, provenance, correction, deletion/withdrawal, and continuity rules.
- Feature design specifications after product behavior approval.

## Out of scope

- Phase 3 implementation or hardening of the core loop.
- New routes, new MVP breadth, deferred-domain admission, or production migrations.
- Broad refactoring, unrelated technical debt, release hardening, and delivery designs before product/design approval.

## Work status

- **P0 - Baseline and scope freeze:** `COMPLETE`.
- **P1 - Core feature briefs and behavior contracts:** `COMPLETE` - Product Architect checkpoint approved 2026-08-05.
- **P2 - Bounded journey contract:** `COMPLETE` - Product Architect checkpoint approved 2026-08-05.
- **P3 - Supporting-domain decisions:** `COMPLETE` - Product Architect checkpoint approved 2026-08-05.
- **P4 - Record/provenance/correction/continuity rules:** `COMPLETE` - ownership decisions resolved 2026-08-05.
- **P5 - Feature design specifications:** `COMPLETE` - four state-complete design specifications, Design Architect checkpoint, and cross-surface review completed 2026-08-05.
- **P6 - Gate evidence and Founder decision:** `COMPLETE` - Gate 2 `PASS` recorded 2026-08-05; Phase 3 authorized.

## Exit condition

Gate 2 passed on 2026-08-05 because each admitted behavior traces to a parent system, journey stage, behavior contract, design expression, data/technical owner, and validation question without inventing missing rules. The recorded `PASS` authorizes Phase 3; Gate 3 and Gate 4 remain required before release.

## Related records

- [Gate 2 checklist](./gate-checklist.md)
- [P6 traceability evidence package](./gate-2-evidence-package.md)
- [Current Sprint](../current-sprint.md)
- [MVP implementation masterplan](../mvp-implementation-masterplan.md)
- [Phase 1 implementation-truth evidence](../phase-1/implementation-truth-evidence.md)
- [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
- [Archived Phase 2 sprint record](../../11-archive/phases/phase-2/phase-2-sprint.md)
