# Tasks Core-Loop Validation Plan

**Status:** `DRAFT` — ready for Founder scope/design checkpoint
**Owner:** Engineering Architect (Founder), with Product and Design review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Tasks implementation readiness and Gate 3 contribution
**Authorized behavior contract:** [Tasks behavior contract](../behavior/tasks.md)
**Delivery design:** [Tasks core-loop delivery design](../delivery/tasks-core-loop.md)
**Design specification:** [Tasks design specification](../../05-design/features/tasks-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Evidence record location:** `docs/current-phase/phase-3/evidence/tasks-core-loop/` (planned)
**Gate link:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to a `TASK-*` question, acceptance threshold, owner handoff, state meaning, migration limitation, or recovery rule.

> This plan defines evidence to collect. It contains no implementation result, migration result, release approval, or Gate 3 decision.

## Decision scope and acceptance matrix

| ID | Acceptance question | Required evidence | Pass condition |
|---|---|---|---|
| `TASK-01` | Create/revise with Zod/RHF and truthful pending/failed recovery | Validation tests, pending/failure interaction, local-draft walkthrough | Invalid input is rejected; confirmed state is preserved through retry/failure |
| `TASK-02` | Selection for Focus leaves task completion/history unchanged | Selection interaction and before/after owner-record assertion | Focus receives planned identity; no task mutation occurs |
| `TASK-03` | Complete, restore, defer, withdraw, correction are distinct and confirmed | Lifecycle tests plus manual owner walkthrough | Each state has distinct copy and owner-confirmed transition |
| `TASK-04` | Remove is retained withdrawal; hard deletion is outside core loop | History/withdrawal test and copy review | Remove does not erase history or claim completion |
| `TASK-05` | Tasks owns Next Up and pending migration is unavailable | Migration-state fixture and owner/read projection review | No persistence/reorder claim exists until live verification |
| `TASK-06` | Planning, Focus facts, and outcomes stay distinct | Cross-surface seeded walkthrough and semantic assertions | No selection/planning/session duration is presented as completion/outcome |
| `TASK-07` | Entry, pause, leave, retry, re-entry, permission and degraded paths preserve truth | Fault-injected state tests and interruption walkthrough | Last confirmed state remains authoritative; recovery is explicit |
| `TASK-08` | Identity, RLS, validation, date/time, drafts, migration limits are testable | Static/service review, two-account plan, Singapore boundary test | No unscoped access, browser date drift, or inferred capability |

## Methods and scenarios

- Automated tests cover validation, lifecycle transitions, unchanged-state Focus selection, migration-unavailable mapping, stale response protection, and safe error states.
- Interaction tests cover owner labels, pending/failed/retry controls, correction/withdrawal, keyboard operation, and accessible state announcements.
- Manual seeded and real-data walkthrough covers direct/deep entry, create, revise, select, start/complete, defer, withdraw, restore, failed write, re-entry, and safe departure.
- Fixtures include Account A and distinct Account B data, empty tasks, selected-but-not-completed task, pending Next Up capability, a failed operation, and a Singapore-midnight date boundary.
- Accessibility review covers keyboard-only use, visible focus, responsive layouts, screen-reader names/status, touch targets, and reduced motion.

## Analysis and decision rules

`Pass` requires all `TASK-*` questions to have evidence or an explicitly accepted limitation, with no owner, security, history, or truth breach. `Concern` requires an owner and downstream disposition. `Rework` or `Block` stops the package when a contract is not met, a mutation crosses owners, a migration is misrepresented, or recovery is inaccessible. `Inconclusive` is not a pass.

## Quality and evidence handling

Run `npm test`, `npm run lint`, configured `npm run build`, and `git diff --check` before the implementation checkpoint and again before Gate 3 evidence. Record environment, fixture, date key, browser/viewport, migration applied-state, result, and limitation. Do not log real task content or treat test counts as product value evidence.

## Change control

Changing an acceptance question, owner, threshold, fixture meaning, or migration assumption requires review of the Tasks contract, delivery design, current sprint, and Gate 3 checklist before evidence is interpreted.
