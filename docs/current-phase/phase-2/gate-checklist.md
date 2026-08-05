# Phase 2 Gate Checklist - Gate 2: Contract Coherence

**Status:** CLOSED / ARCHIVED - P0-P6 complete; Gate 2 PASS recorded; Phase 3 authorized
**Owner:** Founder, executing all six hats
**Parent:** [Phase 2 README](./README.md) - [MVP implementation masterplan](../mvp-implementation-masterplan.md)
**Execution reference:** [Current sprint](../current-sprint.md)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Archived sprint:** [Complete Phase 2 sprint record](../../11-archive/phases/phase-2/phase-2-sprint.md)
**Handoff branch:** `sprint/phase2`

## 1. Gate definition

Gate 2 passes only when a designer, engineer, and reviewer can trace every admitted behavior to its parent system, bounded journey stage, design expression, data/technical owner, and validation question without inventing missing rules. The Founder recorded the required `PASS` below. This authorizes Phase 3 to begin; Gate 3 and Gate 4 remain required before release.

## 2. Exit criteria and evidence status

| ID | Exit requirement | Required evidence | Current state |
|---|---|---|---|
| G2-01 | Each core domain has a feature brief and behavior contract | Four linked brief/contract pairs with scope and non-goals | `COMPLETE` |
| G2-02 | Every admitted behavior is observable and authority-aware | State tables, transitions, recovery, accessibility, and acceptance IDs | `COMPLETE` |
| G2-03 | Journey connects six stages without becoming a forced funnel | Entries/exits, alternatives, handoffs, unchanged state, `JOURNEY-*` | `COMPLETE` |
| G2-04 | Supporting domains have minimum behavior and exclusions | Owner, provenance, optionality, empty/unavailable behavior, `SUPPORT-*` | `COMPLETE` |
| G2-05 | Record ownership, provenance, correction, and continuity are explicit | Ownership matrix, lifecycle states, recovery, correction/deletion/withdrawal, `RECORD-*` | `COMPLETE` |
| G2-06 | Design specifications cover all required states | Four state-complete specifications | `COMPLETE` |
| G2-07 | Delivery designs do not bypass product/design contracts | Review confirms no premature delivery design | `COMPLETE` |
| G2-08 | Phase 1.5 patterns are carried into applicable contracts | Zod/RHF/date-fns/timezone/recovery/identity constraints | `COMPLETE` |
| G2-09 | Founder makes one explicit Gate 2 decision | Dated `PASS`, `HOLD`, or `REWORK` with rationale | `COMPLETE` |

## 3. Contract and traceability register

| Contract/surface | Parent system | Journey stage | Behavior evidence | Canonical owner | Validation IDs | State |
|---|---|---|---|---|---|---|
| Today | Experience Architecture; Action and Evidence | Orientation | [brief](../../04-features/briefs/today.md) - [behavior](../../04-features/behavior/today.md) | Today composes; linked owner writes | `TODAY-01`-`06` | `COMPLETE` |
| Tasks | Direction and Commitment; Action and Evidence | Commitment | [brief](../../04-features/briefs/tasks.md) - [behavior](../../04-features/behavior/tasks.md) | Tasks | `TASK-01`-`08` | `COMPLETE` |
| Focus | Action and Evidence; Direction and Commitment | Action/Evidence | [brief](../../04-features/briefs/focus.md) - [behavior](../../04-features/behavior/focus.md) | Focus; attribution only when verified | `FOCUS-01`-`07` | `COMPLETE` |
| Reflection | Sensemaking and Adaptation; Action and Evidence | Sensemaking/Adaptation | [brief](../../04-features/briefs/reflection.md) - [behavior](../../04-features/behavior/reflection.md) | Reflection; receiving owner applies adaptation | `REFLECT-01`-`08` | `COMPLETE` |
| MVP coherent loop | Experience Architecture; Information Structure | All six stages | [journey contract](../../03-experience/journeys/mvp-coherent-loop.md) | Stage owner per handoff | `JOURNEY-01`-`08` | `COMPLETE` |
| Habits | Action and Evidence; supporting ownership | Orientation/action support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Habits | `SUPPORT-01`-`07` | `COMPLETE` |
| Schedule | Continuity and Interoperability | Orientation/planning support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Task/Habit source record | `SUPPORT-01`-`07` | `COMPLETE` |
| Notes/Growth Areas | Continuity; Sensemaking and Adaptation | Context/sensemaking support | [supporting decisions](../../04-features/supporting-domain-decisions.md) | Notes | `SUPPORT-01`-`07` | `COMPLETE` |
| MVP record rules | Product Model; Action and Evidence; Continuity | All stages | [record rules](../../04-features/record-rules.md) | One owner per mutation | `RECORD-01`-`08` | `COMPLETE` |

Design evidence is present in the four linked feature specifications. The package still does not claim Phase 3 implementation, migration application, or release readiness.

**P6 traceability evidence:** [Gate 2 evidence package](./gate-2-evidence-package.md) contains one complete chain for each of the 52 admitted acceptance IDs across Today, Tasks, Focus, Reflection, the six-stage journey, supporting domains, and record rules.

## 4. Product Architect checkpoint

**Completed:** Founder/Product Architect approved scope, behavior, non-goals, journey meaning, supporting boundaries, and canonical ownership on 2026-08-05. P1-P4 are ready for Design Architect work. This is not a Gate 2 pass and does not authorize implementation or migration application.

## 5. Design Architect checkpoint and cross-surface review

**Completed:** Design Architect completed the four state-complete specifications and checkpointed them against their approved briefs, behavior contracts, journey contract, information structure, record rules, supporting-domain decisions, reusable design standards, and acceptance questions on 2026-08-05. No new behavior, owner, route, source, state meaning, or delivery design was introduced.

| Surface | Design evidence | Review result |
|---|---|---|
| Today | [Today design specification](../../05-design/features/today-design-spec.md) | Read composition, source/freshness disclosure, owner handoffs, and non-writing recovery remain explicit. |
| Tasks | [Tasks design specification](../../05-design/features/tasks-design-spec.md) | Commitment states, withdrawal/history, Next Up ownership, Task-to-Focus selection, and rollback remain explicit. |
| Focus | [Focus design specification](../../05-design/features/focus-design-spec.md) | Session facts, elapsed-time limits, attribution-unavailable fallback, lifecycle recovery, and Reflection handoff remain explicit. |
| Reflection | [Reflection design specification](../../05-design/features/reflection-design-spec.md) | Daily/custom/session-end identity, one save owner, interpretation provenance, correction, and adaptation handoff remain explicit. |

### Cross-surface invariants reviewed

| Handoff or shared concern | Required invariant | Review result |
|---|---|---|
| Today -> Tasks | Today exposes task context and routes mutation to Tasks; selection is not completion. | Consistent in Today and Tasks specifications. |
| Tasks -> Focus | Tasks passes planned task identity; Focus does not complete or attribute the task by selection. | Consistent in Tasks and Focus specifications. |
| Focus -> Reflection | Focus supplies confirmed session identity/facts after conclusion; Reflection owns the appended entry save. | Consistent in Focus and Reflection specifications; failed Reflection save does not undo Focus. |
| Reflection -> receiving owner | Reflection may propose; only the receiving owner confirms applied adaptation. | Consistent in Reflection, Today, and journey references. |
| Owner -> Today | Projections carry identity, source, freshness, and confirmed/pending/failed/unavailable state; a projection never reports owner success alone. | Consistent across all four specifications. |
| Supporting context | Habits, Schedule, and Notes remain optional; Schedule is planning context; no supporting source becomes a competing owner. | Consistent in Today, Tasks, Reflection, and supporting-domain references. |
| Continuity | Pending, failed, local-draft, stale, unavailable, disconnected, correction, withdrawal, and re-entry retain last confirmed truth and explicit recovery. | State and recovery coverage present on all four surfaces. |
| Accessibility/content | State, ownership, provenance, consequence, and recovery are semantic text, keyboard reachable, responsive, and not color/hover-only. | Required in all four specifications and linked reusable standards. |
| Foundation/security | `requireUserId`, user-scoped access/RLS, Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration truth remain handoff constraints. | Repeated in all four specifications; no implementation claim made. |

**Disposition:** Cross-surface review passed for design coherence. The remaining limitations below are intentionally preserved as unavailable or later validation work; none is silently resolved by design.

## 6. Known limitations and truthful dispositions

- `tasks_next_up_queue.sql` remains pending/unverified. Tasks owns queue semantics, but persistent membership/reorder is unavailable until applied and verified.
- `focus_session_task_totals.sql` remains pending/unverified. Focus records session facts; task attribution is unavailable and never inferred.
- Reflection has daily, custom, and Focus session-end entry paths, but Reflection owns all durable records under one correction/recovery model.
- Schedule remains planning context; Task/Habit source records own planning mutations.
- Two-account RLS verification, Singapore midnight boundary testing, deferred Schedule keyboard review, existing lint warnings, audit vulnerabilities, and middleware deprecation remain later validation/hardening work. None is represented as resolved by this documentation package.

## 7. Review protocol

1. **Product Architect:** confirm scope, behavior, journey meaning, non-goals, and no deferred-domain promotion. Complete for P1-P4 on 2026-08-05.
2. **Design Architect:** create four design specifications that express every contract state without changing behavior or ownership. Complete on 2026-08-05; cross-surface review recorded in section 5.
3. **Engineering Architect:** review owner boundaries, provenance, correction, continuity, RLS, identity, and Phase 1.5 constraints after design.
4. **Implementation Engineer:** confirm the package is implementable without inventing rules; no Phase 3 code is started as a substitute.
5. **Release Manager:** verify links, traceability, acceptance IDs, states, and guardrails.
6. **Founder:** recorded exactly one Gate 2 `PASS` decision on 2026-08-05.

## 8. Repository readiness

- [x] P1-P5 are complete and linked in the artifact register and evidence package.
- [x] No admitted behavior has an unresolved or unowned placeholder state; no traceability row is `UNKNOWN`.
- [x] All local Markdown links in the Phase 2 package resolve.
- [x] `git diff --check` passes.
- [x] No Phase 3 implementation, production migration, unrelated refactor, or unlabelled technical spike is included.
- [x] Habits, Schedule, and Notes remain optional supporting context with explicit exclusions and source ownership.
- [x] Ownership, provenance, correction, withdrawal, interruption, re-entry, and recovery are explicit in [record rules](../../04-features/record-rules.md) and the [P6 evidence package](./gate-2-evidence-package.md).
- [x] The six-hat readiness review is recorded in the [P6 evidence package](./gate-2-evidence-package.md).
- [x] Known limitations remain explicit and are not represented as resolved; see [P6 limitations](./gate-2-evidence-package.md#known-limitations-carried-honestly).
- [x] The repository diff was reviewed against `main`; no merge or push to `main` occurs without Founder authorization.

### Release Manager verification record

| Check | Evidence | Result |
|---|---|---|
| P1-P5 completion | [Artifact register](../current-sprint.md) and [P6 evidence package](./gate-2-evidence-package.md#coverage-result) | `PASS` |
| Traceability coverage | 52 of 52 admitted acceptance IDs have all seven chain links | `PASS` |
| Local Markdown links | 503 local links across 26 changed Markdown artifacts checked from repository paths | `PASS` |
| Diff whitespace | `git diff --check` | `PASS` |
| Phase boundary | No `src/` changes; four pending `supabase/` SQL definitions were security-reviewed but not applied; no Phase 3 source or production migration application | `PASS - unapplied SQL disclosed` |
| Supporting-domain boundary | [Supporting-domain decisions](../../04-features/supporting-domain-decisions.md) and `SUPPORT-*` rows | `PASS` |
| Ownership and recovery | [Record rules](../../04-features/record-rules.md) and `RECORD-*` rows | `PASS` |
| Six-hat readiness | [Six-hat readiness review](./gate-2-evidence-package.md#six-hat-readiness-review) | `PASS` |
| Known limitations | [Known limitations](./gate-2-evidence-package.md#known-limitations-carried-honestly) | `PASS - retained as limitations` |
| Diff against `main` | Tracked `git diff main` plus untracked files from `git status --short` reviewed; changes are Phase 2 contracts/design/handoff docs, AI context, and bounded pending SQL hardening | `PASS - all explained` |
| Quality baseline | `npm test`: 246/246; `npm run lint`: 0 errors / 211 existing warnings; `npm run build`: compiled and type-checked but `/about` prerender requires missing `NEXT_PUBLIC_SUPABASE_URL` | `PASS - build environment limitation recorded` |

## 9. Decision

**Decision:** `PASS` — Gate 2 Contract Coherence passed; Phase 3 authorized.
**Date:** 2026-08-05
**Founder:** Founder
**Rationale:** P1-P5 are complete, and P6 provides a complete traceability chain for all 52 admitted acceptance IDs. G2-01 through G2-08 are complete; supporting domains are bounded; ownership, provenance, correction, continuity, recovery, accessibility, foundation constraints, link checks, diff hygiene, and repository scope review are evidenced. No contract or design requires substantive revision for Gate 2.
**Unresolved conditions:** Pending Next Up and Focus attribution migrations, two-account RLS/security verification, Singapore midnight boundary testing, deferred Schedule keyboard review, existing lint warnings, audit vulnerabilities, and middleware deprecation remain explicitly recorded with owners in [D-008](../../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md). They are downstream implementation/hardening conditions, not unresolved Gate 2 contract decisions.
**Owners:** Engineering Architect owns migrations, RLS/security, date-boundary testing, lint, audit, and middleware follow-through; Tasks and Focus remain the canonical data owners; Design Architect owns Schedule keyboard review.
**Next-phase authorization:** `AUTHORIZED` — Phase 3 implementation may begin within the admitted MVP boundary. This decision does not authorize production release; Gate 3 and Gate 4 remain required.
