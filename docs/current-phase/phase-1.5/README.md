# Phase 1.5: Foundation Infrastructure

**Purpose:** Establish the validation, form-management, and date/time foundations that Phase 2 contracts and Phase 3 implementation may safely rely on.
**Status:** ACTIVE — implementation authorized; Gate 1.5 not yet assessed
**Owner:** Founder (executed via the 6-hat solo workflow)
**Gate:** Gate 1.5 — Foundation Ready
**Created:** 2026-08-04
**Last Updated:** 2026-08-05

**Execution plan:** [Current Sprint](../current-sprint.md)
**Gate record:** [Gate 1.5 checklist](./gate-checklist.md)
**Masterplan authority:** [MVP Implementation Masterplan](../mvp-implementation-masterplan.md)
**Technology authority:** [Technology Integration Masterplan](../../06-engineering/technology-integration-masterplan.md)
**Authorization:** [D-006 — Gate 1 PASS and Phase 1.5 handoff](../../08-decisions/records/D-006-phase-1-gate-pass-and-phase-1-5-handoff.md)

---

## Phase Boundary

Phase 1.5 is a bounded engineering-foundation phase between implementation-truth discovery and Phase 2 product contracting. It may change dependencies, shared engineering patterns, selected form implementations, and date/time utilities. It must not add MVP breadth, write the Phase 2 coherent-loop contracts, or perform unrelated refactoring.

### In scope

- Add and record `zod`, `react-hook-form`, `@hookform/resolvers`, and `date-fns`.
- Establish a reusable schema, form, error, and recovery pattern.
- Migrate authentication forms first and one retained-domain form as the pilot; the pilot must be confirmed at the Plan checkpoint.
- Establish date/time and timezone rules, then apply them to the retained focus and schedule calculation paths required by the masterplan.
- Add invalid-input, loading, error, correction, recovery, and date-boundary tests for every migrated surface.
- Reconcile package, source, test, client-architecture, engineering-standards, and technology-roadmap claims.

### Out of scope

- New product behavior, new routes, new MVP admission, or Phase 2 feature briefs and behavior contracts.
- Broad replacement of every form or every date operation without a recorded scope and semantic review.
- Pomodoro re-admission, Goals, AI Coach, Progress as a destination, or promotion of Growth Areas.
- Reworking the carried-forward Phase 1 technical debt unless it is directly required by a migrated foundation path.

## Entry Conditions

- Gate 1 is `PASS`; Phase 1 records are archived.
- The Founder authorized this handoff through D-006.
- The Phase 1 Free-plan backup/PITR limitation remains visible and is not silently resolved by this phase.
- The current sprint and Gate 1.5 checklist are the active execution and evidence records.

## Exit Condition

Gate 1.5 may pass only when the dependency versions and lockfile are recorded, the approved form and validation patterns are working on auth plus the selected pilot form, date/time rules are implemented and tested on the required focus/schedule paths, recovery behavior is documented, quality checks pass, and all remaining migration gaps have an owner and disposition. The Founder must record exactly one `PASS`, `HOLD`, or `REWORK` decision in the Gate 1.5 checklist.

## Carried-Forward Work

The following remains visible but is not automatically part of this phase's implementation scope: focus save-retry smoke, reflection provenance/concurrency, shared scheduling ownership, habit completion atomicity, the existing lint warnings, the deprecated middleware convention, and the accepted Supabase Free-plan backup/PITR limitation. A Phase 1.5 change may touch one of these only when its dependency impact is explicit in the sprint and gate evidence.

## Related Records

- [Archived Phase 1 README](../../11-archive/phases/phase-1/README.md)
- [Archived Gate 1 checklist](../../11-archive/phases/phase-1/gate-checklist.md)
- [Technology Integration Masterplan — Phase 1.5 handoff](../../06-engineering/technology-integration-masterplan.md#phase-15-readiness-handoff--2026-08-04)
- [D-004 — Add Phase 1.5 to the MVP sequence](../../08-decisions/records/D-004-add-phase-1-5-foundation-infrastructure-to-mvp-masterplan.md)
- [UX and Performance Improvements](./ux-and-performance-improvements.md)
