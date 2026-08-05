# Phase 2 Gate Checklist — Gate 2: Contract Coherence

**Status:** OPEN — P0 complete; P1–P4 drafted; P5/P6 open
**Owner:** Founder, executing all six hats
**Parent:** [Phase 2 README](./README.md) · [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-05

---

## 1. Gate definition

**Gate 2 — Contract coherence:** A designer, engineer, and reviewer can trace every admitted behavior to a parent system, a bounded journey stage, a design expression, a data/technical owner, and a validation question without inventing missing rules.

Gate 2 measures contract completeness and traceability. It does not require Phase 3 implementation, production hardening, or release readiness. A draft can support work, but only a complete and reviewed package can pass.

## 2. Gate scope and entry evidence

The gate covers:

- Today, Tasks, Focus, and Reflection feature briefs and behavior contracts;
- the bounded journey connecting orientation, commitment, action, evidence, sensemaking, and adaptation;
- minimum Habits, Schedule, and Notes behavior;
- source ownership, provenance, correction, and continuity rules;
- feature design specifications with full state coverage; and
- validation questions and repository evidence needed to assess the above.

Entry evidence:

- Gate 1 PASS: [Phase 1 implementation-truth evidence](../phase-1/implementation-truth-evidence.md) and [D-007](../../08-decisions/records/D-007-gate-1-current-build-truth-and-phase-2-authorization.md).
- Gate 1.5 PASS: [archived Phase 1.5 sprint record](../../11-archive/phases/phase-1.5/phase-1.5-sprint.md) and [foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md).
- Current execution: [Phase 2 current sprint](../current-sprint.md).

## 3. Exit criteria and evidence status

All criteria must be `PASS` for a Founder `PASS`. `PARTIAL` is permitted only when the remaining gap is explicit, owned, and has a dated disposition that does not require inventing a rule during Phase 3. `UNKNOWN` cannot pass.

| ID | Exit requirement | Required evidence | Current state |
|---|---|---|---|
| G2-01 | Each core domain has a feature brief and behavior contract | Four linked brief/contract pairs with scope and non-goals | `DRAFT` |
| G2-02 | Every admitted behavior is observable and authority-aware | Behavior rules, state tables, transitions, recovery, accessibility, acceptance IDs | `DRAFT` |
| G2-03 | Journey connects the six loop stages without becoming a forced funnel | Journey narrative, entry/exit contexts, handoff table, alternatives, `JOURNEY-*` | `DRAFT` |
| G2-04 | Supporting domains have minimum behavior and exclusions | Supporting decision with owner, provenance, empty/unavailable behavior, `SUPPORT-*` | `DRAFT` |
| G2-05 | Record ownership, provenance, correction, and continuity are explicit | Record rules matrix, state distinctions, recovery and correction rules, `RECORD-*` | `DRAFT` |
| G2-06 | Design specifications cover all required states | Four specs covering content, hierarchy, semantic state, interaction, responsive, accessibility, loading, empty, error, interruption, recovery, and handoff | `NOT_STARTED` |
| G2-07 | Delivery designs do not bypass approved product/design contracts | Review confirms no premature delivery design or unapproved behavior change | `PENDING_REVIEW` |
| G2-08 | Phase 1.5 patterns are carried into every applicable contract | Foundation links and explicit Zod/RHF/date-fns/timezone/recovery constraints | `DRAFT` |
| G2-09 | Founder makes one explicit Gate 2 decision | Dated `PASS`, `HOLD`, or `REWORK`, rationale, conditions, and Phase 3 authorization | `PENDING` |

## 4. Contract and traceability register

`State` describes readiness for Gate 2, not whether code exists. The design path is planned until P5 creates it. Validation IDs are the acceptance questions that later validation plans must assess.

| Contract/surface | Parent system(s) | Journey stage | Behavior evidence | Design evidence | Data/technical owner | Validation IDs | State |
|---|---|---|---|---|---|---|---|
| **Today** | Experience Architecture; Action and Evidence | Orientation | [brief](../../04-features/briefs/today.md) · [behavior](../../04-features/behavior/today.md) | `docs/05-design/features/today-design-spec.md` | Today composes; linked domain owns writes | `TODAY-01`–`05` | `DRAFT` |
| **Tasks** | Direction and Commitment; Action and Evidence | Commitment | [brief](../../04-features/briefs/tasks.md) · [behavior](../../04-features/behavior/tasks.md) | `docs/05-design/features/tasks-design-spec.md` | Tasks owner paths; user-scoped records | `TASK-01`–`06` | `DRAFT` |
| **Focus** | Action and Evidence; Direction and Commitment | Action | [brief](../../04-features/briefs/focus.md) · [behavior](../../04-features/behavior/focus.md) | `docs/05-design/features/focus-design-spec.md` | Focus session persistence; attribution only when verified | `FOCUS-01`–`06` | `DRAFT` |
| **Reflection** | Sensemaking and Adaptation; Action and Evidence | Sensemaking/adaptation | [brief](../../04-features/briefs/reflection.md) · [behavior](../../04-features/behavior/reflection.md) | `docs/05-design/features/reflection-design-spec.md` | Reflection persistence/entries; receiving owner applies adaptation | `REFLECT-01`–`06` | `DRAFT` |
| **MVP coherent loop** | Experience Architecture; Information Structure | All six stages | [journey contract](../../03-experience/journeys/mvp-coherent-loop.md) | Four linked feature specs | Product/feature owners named per handoff | `JOURNEY-01`–`05` | `DRAFT` |
| **Habits** | Action and Evidence; supporting ownership | Orientation/action support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Included in Today/supporting design review | Habits and completion owner | `SUPPORT-01`–`05` | `DRAFT` |
| **Schedule** | Continuity and Interoperability; task/habit ownership | Orientation/planning support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Included in Today/supporting design review | Task/Habit source records | `SUPPORT-01`–`05` | `DRAFT` |
| **Notes / Knowledge** | Continuity and Interoperability; Sensemaking and Adaptation | Context/sensemaking support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Included in Reflection/supporting design review | Notes source relationship | `SUPPORT-01`–`05` | `DRAFT` |
| **MVP record rules** | Product Model; Action and Evidence; Continuity | All stages | [record rules](../../04-features/record-rules.md) | Expressed by each feature spec | Product + Engineering Architects | `RECORD-01`–`05` | `DRAFT` |

## 5. Gate evidence requirements by work package

| Work package | Sprint tasks | Evidence required to mark complete | Current state |
|---|---|---|---|
| P0 Baseline/scope | P0.1–P0.3 | Entry gates, frozen MVP boundary, foundation references | `COMPLETE` |
| P1 Core contracts | P1.1–P1.5 | Four brief/contract pairs, normalized metadata/links, acceptance IDs | `DRAFT` |
| P2 Journey | P2.1–P2.4 | Journey stages, entries/exits, handoffs, recovery, acceptance IDs | `DRAFT` |
| P3 Supporting decisions | P3.1–P3.4 | Minimum behavior, exclusions, ownership, empty/unavailable handling | `DRAFT` |
| P4 Record rules | P4.1–P4.5 | Ownership/provenance/correction/continuity matrix and resolved owners | `DRAFT` |
| P5 Design specifications | P5.1–P5.6 | Four complete design specs and cross-surface review | `NOT_STARTED` |
| P6 Gate package | P6.1–P6.4 | Traceability review, six-hat review, Founder decision, repository readiness | `NOT_STARTED` |

## 6. Review protocol

The Release Manager prepares the package; the Founder executes the review through the six hats:

1. **Product Architect:** confirm need, scope, journey meaning, non-goals, and no deferred-domain promotion.
2. **Design Architect:** confirm every behavior state has an understandable, accessible, responsive design expression.
3. **Engineering Architect:** confirm ownership, provenance, correction, continuity, security boundaries, and Phase 1.5 patterns.
4. **Implementation Engineer:** confirm the package is implementable without inventing rules and that no Phase 3 code was started as a substitute for missing contracts.
5. **Release Manager:** verify all Gate rows, links, acceptance IDs, open conditions, and repository checks.
6. **Founder:** record exactly one Gate 2 decision.

The reviewer must sample at least one normal, alternative, interruption/failure, correction, unavailable, and authority-sensitive path for each core contract. A positive visual review or passing link check cannot substitute for missing behavior or ownership evidence.

## 7. Known limitations and explicit dispositions

These are carried forward from Phase 1.5 and do not become hidden Gate 2 assumptions:

- `tasks_next_up_queue.sql`, `focus_session_task_totals.sql`, and `security_hardening.sql` remain recorded as not applied in live state; contracts must specify truthful fallback and release owners.
- Two-account RLS verification must be rerun before release hardening.
- Singapore midnight boundary remains untested.
- Schedule keyboard review remains deferred to accessibility hardening.
- Reflection has dual current save paths and must receive one user-visible correction/recovery model.
- Schedule has overlapping planning surfaces and must receive one ownership rule.
- `npm audit` reports 11 vulnerabilities, lint has 211 existing warnings, and middleware-to-proxy deprecation remains; none is silently treated as resolved by Phase 2 documents.

These limitations may not be used to leave a Phase 2 contract `UNKNOWN`. Each has an owner in the Phase 1 evidence and a relevant P4/P5 or later hardening task.

## 8. Repository and merge-readiness checks

Before a commit/merge request is prepared, confirm:

- all files in the sprint artifact register are present or explicitly `NOT_STARTED` planned outputs;
- all touched Markdown links resolve;
- `git diff --check` passes;
- no Phase 3 implementation or unrelated refactor is included;
- source verification is rerun if source files changed; documentation-only changes record that the existing code baseline is unchanged;
- the branch diff against `main` is reviewed and the working tree contains no unexplained artifact;
- no commit, push, or merge to `main` occurs without Founder authorization.

## 9. Decision

**Decision:** Pending — choose exactly one: `PASS`, `HOLD`, or `REWORK`.
**Date:** TBD
**Founder:** Founder
**Rationale:** TBD
**Unresolved conditions:** TBD
**Next-phase authorization:** Phase 3 may be authorized only on `PASS`; otherwise state the hold/rework conditions and owner.
**Decision record:** Create/update a decision record if the outcome changes phase authority, MVP scope, or a consequential parent rule.
