# Current Sprint — Phase 2: Contract the Coherent MVP Loop

**Sprint Period:** 2026-08-05 → 2026-08-08
**Current Phase:** Phase 2 — Product Contracting (authorized after Gate 1.5 PASS)
**Status:** ACTIVE — Phase 2 authorized by Founder on 2026-08-05
**Owner:** Founder (executed via 6-hat solo workflow)
**Last Updated:** 2026-08-05

**📋 Gate 2 Checklist:** [phase-2/gate-checklist.md](./phase-2/gate-checklist.md)
**🗺️ MVP Masterplan:** [mvp-implementation-masterplan.md](./mvp-implementation-masterplan.md)
**🎯 Workflow:** [Solo Founder Workflow](../start-here/solo-founder-workflow.md)

---

## Phase Transition

- **Prior phase:** Phase 1.5 — Foundation Infrastructure (CLOSED, Gate 1.5 PASS 2026-08-05)
- **Archived record:** [phase-1.5-sprint.md](../11-archive/phases/phase-1.5/phase-1.5-sprint.md)
- **Current authorization:** Phase 2 authorized by Founder on 2026-08-05
- **Decision record:** [D-006 — Gate 1.5 PASS and Phase 2 Authorization](../08-decisions/records/D-006-phase-1-gate-pass-and-phase-1-5-handoff.md)

### Prior Phase Summary (Phase 1.5 — CLOSED)

**Status:** ✅ CLOSED — Gate 1.5 PASSED 2026-08-05; Phase 2 authorized

**What Phase 1.5 did:**
- Restored `zod`, `react-hook-form`, `@hookform/resolvers`, and `date-fns` shared contracts with invalid-input and date-boundary tests.
- Migrated auth forms and the retained Task dialog to shared resolver-driven form state; added server task validation and write-error propagation.
- Restored reflection autosave and Focus-kanban append behavior with recovery fallbacks.
- Quality evidence: 246/246 tests across 24 files, lint 0 errors / 211 warnings, build passed with 24 routes.
- Founder accepted the `npm audit` result temporarily and the Singapore midnight boundary / Schedule keyboard review as explicit MVP limitations.

*Full implementation record:* archived as [phase-1.5-sprint.md](../11-archive/phases/phase-1.5/phase-1.5-sprint.md).

---

## Sprint Contract

### Objective

Turn the changed product model into a small set of cross-surface contracts that Phase 3 can implement without inventing missing rules — traceable from parent system to journey, design, technical owner, and validation question.

### In scope

- **Core MVP contracts:** Today, Tasks, Focus, and Reflection feature briefs and behavior contracts.
- **Journey contract:** the bounded loop connecting orientation, commitment, action, evidence, sensemaking, and adaptation.
- **Supporting decisions:** minimum Habits, Schedule, and Notes behavior that supports the journey.
- **Record rules:** source ownership, provenance, correction, and continuity for the MVP records.
- **Design specifications:** content, accessibility, responsive, loading, empty, error, interruption, and recovery states.
- Contracts reference the Phase 1.5 validation, form, and date/time patterns.

### Out of scope

- Phase 3 implementation or hardening of the core loop.
- New MVP breadth, new routes, or re-admission of deferred domains (Goals, AI Coach, Progress as a destination).
- Trust, quality, and release readiness (Phase 4).
- Broad refactoring or unrelated technical debt.

### Definition of done

- [ ] Every core domain has a feature brief and behavior contract.
- [ ] Every admitted behavior traces to a parent system, a journey, a design expression, a data/technical owner, and a validation question.
- [ ] The bounded journey contract is written and cross-references the core contracts.
- [ ] Supporting domains have an explicit minimum-behavior decision.
- [ ] Source ownership, provenance, correction, and continuity rules are defined.
- [ ] Feature design specifications cover all required states.
- [ ] Delivery designs are created only after behavior and design contracts are approved.
- [ ] The Founder records `PASS`, `HOLD`, or `REWORK` in the Gate 2 checklist.

---

## Work Packages

| Package | Requirement | Concrete work | Output / exit condition | Owner | State |
|---|---|---|---|---|---|
| **P1. Core contracts** | Today, Tasks, Focus, Reflection briefs + behavior contracts | Write feature briefs and behavior contracts for the four core domains using the Phase 1.5 foundation patterns | Four contracts with traceable journey, design, technical owner, and validation questions | Product Architect | `NOT_STARTED` |
| **P2. Journey contract** | Bounded coherent loop | Write the journey contract connecting orientation, commitment, action, evidence, sensemaking, and adaptation | Bounded journey contract cross-referencing core contracts | Product Architect | `NOT_STARTED` |
| **P3. Supporting decisions** | Minimum Habits, Schedule, Notes behavior | Decide and document the minimum supporting behavior that serves the journey | Explicit retention/disposition per supporting domain | Product Architect | `NOT_STARTED` |
| **P4. Record rules** | Ownership, provenance, correction, continuity | Define source ownership, provenance, correction, and continuity rules for MVP records | Record-rules section referenced by all contracts | Engineering Architect | `NOT_STARTED` |
| **P5. Design specifications** | Full state coverage | Create feature design specifications with content, accessibility, responsive, loading, empty, error, interruption, and recovery states | Design specs approved for each core contract | Design Architect | `NOT_STARTED` |
| **P6. Gate package** | Gate 2 evidence | Run the gate review; record the single Gate 2 decision | Gate 2 checklist signed with `PASS`, `HOLD`, or `REWORK` | Release Manager + Founder | `NOT_STARTED` |

---

## Dated Execution Sequence

### 2026-08-05 — Phase 2 kickoff and contract baseline

- **Product Architect:** Confirm the masterplan boundary, freeze the contract set, and establish the contract templates referencing Phase 1.5 patterns.
- **Engineering Architect:** Confirm the technical ownership, provenance, and continuity rules template.
- **Design Architect:** Confirm the design-spec state coverage template.
- **Founder checkpoint:** Approve the frozen contract set and templates; no new MVP admission is proposed.

**Exit:** P1–P5 templates are ready and Gate 2 rows have owners.

### 2026-08-06 — Core contracts and journey

- Write Today, Tasks, Focus, and Reflection feature briefs and behavior contracts.
- Write the bounded journey contract; trace every admitted behavior to journey, design, owner, and validation question.

**Exit:** Core contracts and the journey contract are drafted.

### 2026-08-07 — Supporting decisions, record rules, and design specs

- Decide and document minimum Habits, Schedule, and Notes behavior.
- Define source ownership, provenance, correction, and continuity rules.
- Create feature design specifications with full state coverage.

**Exit:** All contract drafts and design specs exist with no `Unknown` traceability.

### 2026-08-08 — Gate 2 review and handoff

- **Release Manager:** Verify contract traceability and prepare the readiness assessment.
- **Founder:** Review every contract, supporting decision, record rule, and design spec; record `PASS`, `HOLD`, or `REWORK`.
- If Gate 2 passes, hand Phase 3 preparation to the MVP Masterplan and carry unresolved work into the next approved backlog.

**Exit:** Gate 2 checklist is signed with evidence, decision, date, owner, and explicit next-phase authorization or hold conditions.

---

## Hat and checkpoint responsibilities

| Hat / mode | Phase 2 responsibility | Required checkpoint |
|---|---|---|
| **Product Architect / Plan** | Freeze contract set, write briefs + behavior contracts, journey contract, supporting decisions | Approve contract scope and behavior before design/build interpretation |
| **Design Architect / Plan** | Create feature design specifications with full state coverage | Approve design specs before delivery designs |
| **Engineering Architect / Build** | Define technical ownership, provenance, correction, and continuity rules; review delivery designs | Approve technical truth and ownership rules |
| **Implementation Engineer / Build** | Prepare contract references to Phase 1.5 patterns; create delivery designs after contract approval | Approve delivery design readiness |
| **Release Manager / Ship** | Verify contract traceability and prepare the gate package | Recommend `PASS`, `HOLD`, or `REWORK` from evidence |
| **Founder / Ship** | Approve consequential scope, contract, and next-phase decisions | Record the final Gate 2 decision on 2026-08-08 |

---

## Risks & Mitigation (Phase 2)

| Risk | Impact | Mitigation |
|---|---|---|
| Contracts encode accidental behavior | Phase 3 implements wrong loop | Trace every admitted behavior to current implementation truth + journey before writing |
| Deferred domains slip into scope | MVP breadth grows | Require a decision record for any admission change; no silent promotion |
| Contracts invent missing rules | Unimplementable specs | Require traceability to parent system, journey, design, owner, and validation question |
| Supporting decisions expand the journey | Second product model appears | Verify only journey-supporting behavior; record retention/disposition |
| Delivery designs start before contract approval | Rework | Gate delivery designs on approved behavior and design contracts |

---

## Related Documents

- [Phase 2 README](./phase-2/README.md) — Overview
- [Phase 2 Gate Checklist](./phase-2/gate-checklist.md) — Gate 2 criteria/evidence
- [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) — Phase authority
- [Archived Phase 1.5 sprint record](../11-archive/phases/phase-1.5/phase-1.5-sprint.md) — prior phase history
- [Feature Catalog](../04-features/feature-catalog.md) — Coverage map
- [Technology Integration Masterplan](../06-engineering/technology-integration-masterplan.md) — foundation patterns
