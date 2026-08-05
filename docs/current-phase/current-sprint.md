# Current Sprint — Phase 2: Contract the Coherent MVP Loop

**Sprint period:** 2026-08-05 → 2026-08-08
**Phase:** Phase 2 — Contract the Coherent MVP Loop
**Status:** ACTIVE — P0 complete; P1–P4 drafted; P5 and P6 open
**Owner:** Founder, executing all six hats
**Authority:** Single implementation reference for Phase 2 execution
**Last updated:** 2026-08-05

**Gate record:** [Gate 2 checklist](./phase-2/gate-checklist.md)
**Phase boundary:** [Phase 2 README](./phase-2/README.md)
**Roadmap authority:** [MVP implementation masterplan](./mvp-implementation-masterplan.md)
**Workflow:** [Solo Founder Workflow](../start-here/solo-founder-workflow.md)

---

## 1. How to use this sprint

This document is the only execution reference for Phase 2. It defines the work, sequence, requirements, acceptance criteria, owners, dependencies, evidence paths, and completion conditions.

Use the related documents for their narrower authority:

| Authority | Owns | Does not own |
|---|---|---|
| [MVP masterplan](./mvp-implementation-masterplan.md) | Phase purpose, MVP boundary, phase dependency, and Gate 2 definition | Day-to-day task status |
| **This sprint** | Current Phase 2 tasks, outputs, acceptance, sequence, and status | Final Gate 2 decision |
| [Gate 2 checklist](./phase-2/gate-checklist.md) | Evidence register, pass criteria, review record, and Founder decision | Replacing the sprint task plan |
| Feature/design/engineering standards | Required contents and quality bar for each artifact | Phase scope or Founder authorization |
| Draft contracts | Proposed product behavior and traceability inputs | Authorization to implement Phase 3 |

If two current documents conflict, stop the affected task, preserve the smallest admitted scope, and record the conflict in the Gate checklist before proceeding. No draft artifact can authorize Phase 3 code.

## 2. Phase transition and entry conditions

- Phase 1 — Establish Implementation Truth: **CLOSED, Gate 1 PASS, 2026-08-05**. Evidence: [implementation-truth evidence](./phase-1/implementation-truth-evidence.md) and [D-007](../08-decisions/records/D-007-gate-1-current-build-truth-and-phase-2-authorization.md).
- Phase 1.5 — Foundation Infrastructure: **CLOSED, Gate 1.5 PASS, 2026-08-05**. Record: [archived Phase 1.5 sprint](../11-archive/phases/phase-1.5/phase-1.5-sprint.md).
- Phase 2 authorization exists; Gate 2 is open.
- Phase 1.5 foundation patterns are available: shared Zod validation, React Hook Form boundaries, and date-fns/calendar validity rules. Reference: [foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md).

The current build remains the baseline. Phase 2 may clarify the intended MVP contract, but it may not silently convert an existing route or partial behavior into a new admission.

## 3. Sprint objective and outcome

### Objective

Turn the admitted MVP boundary into a coherent, reviewable contract package so Phase 3 can implement the core loop without inventing product meaning, state transitions, ownership, provenance, design states, or recovery rules.

### Required outcome

At Gate 2 review, a designer, engineer, and reviewer can trace every admitted behavior through this chain:

```text
MVP boundary → parent system → journey stage → behavior contract
→ design expression → data/technical owner → validation question
```

The Founder then records exactly one `PASS`, `HOLD`, or `REWORK`. Phase 3 is authorized only by `PASS`.

## 4. Frozen scope

### Admitted core domains

- **Today:** primary entry and reorientation.
- **Tasks:** commitment and action choice.
- **Focus:** deliberate-attention action mode.
- **Reflection:** sensemaking and adaptation choice.

### Conditional supporting domains

- **Habits:** daily recurring-action visibility and explicit completion only.
- **Schedule:** planning context only; task and habit records remain sources of truth.
- **Notes / Knowledge:** user-owned context supporting choice or reflection; Growth Areas remain embedded.

### Explicitly deferred

Goals, AI Coach, Progress as a destination, standalone Knowledge, standalone Growth Areas, standalone Weekly Review, new routes, new MVP breadth, and autonomous prioritization or adaptation.

### Phase 2 work boundary

Phase 2 produces contracts and design specifications. It does not implement or harden the core loop, apply pending production migrations, remove unrelated technical debt, or create delivery designs before behavior/design approval. Any technical spike must be clearly labeled exploratory and cannot become shipped behavior.

## 5. Artifact register

| Artifact | Required path | Owner | Status | Gate use |
|---|---|---|---|---|
| Today brief | [brief](../04-features/briefs/today.md) | Product Architect | `DRAFT` | Core scope |
| Today behavior | [contract](../04-features/behavior/today.md) | Product Architect | `DRAFT` | Behavior and acceptance |
| Tasks brief | [brief](../04-features/briefs/tasks.md) | Product Architect | `DRAFT` | Core scope |
| Tasks behavior | [contract](../04-features/behavior/tasks.md) | Product + Engineering Architects | `DRAFT` | Behavior and acceptance |
| Focus brief | [brief](../04-features/briefs/focus.md) | Product Architect | `DRAFT` | Core scope |
| Focus behavior | [contract](../04-features/behavior/focus.md) | Product + Engineering Architects | `DRAFT` | Behavior and acceptance |
| Reflection brief | [brief](../04-features/briefs/reflection.md) | Product Architect | `DRAFT` | Core scope |
| Reflection behavior | [contract](../04-features/behavior/reflection.md) | Product + Engineering Architects | `DRAFT` | Behavior and acceptance |
| Bounded journey | [MVP coherent loop](../03-experience/journeys/mvp-coherent-loop.md) | Product Architect | `DRAFT` | Cross-surface traceability |
| Supporting decisions | [Habits, Schedule, Notes](../04-features/supporting-domain-decisions.md) | Product Architect | `DRAFT` | Supporting scope |
| Record rules | [ownership/provenance rules](../04-features/record-rules.md) | Product + Engineering Architects | `DRAFT` | Technical truth |
| Today design specification | `docs/05-design/features/today-design-spec.md` | Design Architect | `NOT_STARTED` | Required full state coverage |
| Tasks design specification | `docs/05-design/features/tasks-design-spec.md` | Design Architect | `NOT_STARTED` | Required full state coverage |
| Focus design specification | `docs/05-design/features/focus-design-spec.md` | Design Architect | `NOT_STARTED` | Required full state coverage |
| Reflection design specification | `docs/05-design/features/reflection-design-spec.md` | Design Architect | `NOT_STARTED` | Required full state coverage |
| Gate package | [Gate 2 checklist](./phase-2/gate-checklist.md) | Release Manager + Founder | `OPEN` | Evidence and decision |

## 6. Implementation task register

Status vocabulary: `COMPLETE` means accepted against this sprint; `DRAFT` means an artifact exists but is not Gate-ready; `IN_REVIEW` means self-review is underway; `NOT_STARTED` means no artifact; `BLOCKED` requires an explicit blocker and owner. `Unknown` is never an acceptable status at Gate 2.

### P0 — Baseline and scope freeze — COMPLETE

| ID | Task | Inputs | Acceptance | Evidence |
|---|---|---|---|---|
| P0.1 | Confirm Phase 1 and 1.5 entry conditions | Gate decisions, implementation truth, foundation record | Both gates are closed with explicit limitations and Phase 2 authorization | [D-007](../08-decisions/records/D-007-gate-1-current-build-truth-and-phase-2-authorization.md), archived Phase 1.5 record |
| P0.2 | Freeze admitted/deferred scope | MVP masterplan, Feature Catalog | Core/supporting/deferred domains are named; no new breadth enters this sprint | Sections 4 and 5 of this sprint |
| P0.3 | Establish contract baseline | Phase 1.5 foundation pattern and feature standards | Every contract task names validation, form, date/time, ownership, and recovery requirements | P1–P4 tasks below |

### P1 — Core feature briefs and behavior contracts — DRAFT

| ID | Task | Requirement | Acceptance criteria | Dependencies / output |
|---|---|---|---|---|
| P1.1 | Refine Today brief and behavior contract | Today is a read/composition entry; owning domains retain writes | Covers entry/re-entry, context priority, truthful projections, empty/partial/error states, owner handoffs, accessibility, and `TODAY-*` acceptance questions | P0; [Today artifacts](../04-features/briefs/today.md) · [behavior](../04-features/behavior/today.md) |
| P1.2 | Refine Tasks brief and behavior contract | Tasks owns explicit commitment changes; planning is not evidence | Covers create/revise/complete/restore/defer/withdraw, selection for Focus, validation, persistence failure, permissions, correction, and `TASK-*` acceptance questions | P0; [Tasks artifacts](../04-features/briefs/tasks.md) · [behavior](../04-features/behavior/tasks.md) |
| P1.3 | Refine Focus brief and behavior contract | Focus owns factual session lifecycle; duration is not outcome | Covers start/pause/resume/conclude/leave, interruption, attribution availability, date/time, persistence failure, Reflection handoff, and `FOCUS-*` acceptance questions | P0; [Focus artifacts](../04-features/briefs/focus.md) · [behavior](../04-features/behavior/focus.md) |
| P1.4 | Refine Reflection brief and behavior contract | Reflection owns voluntary sensemaking and adaptation choice history | Covers draft/save/retry/correct/skip/re-entry, full-page/sidebar/session-end convergence, evidence distinction, adaptation handoff, accessibility, and `REFLECT-*` acceptance questions | P0; [Reflection artifacts](../04-features/briefs/reflection.md) · [behavior](../04-features/behavior/reflection.md) |
| P1.5 | Normalize all core contracts | Every contract must be independently traceable | Each brief links parent systems, current-build evidence, journey, next behavior contract, and foundation pattern; each behavior contract links feature brief, journey, owner, validation standard, and record rules | P1.1–P1.4; cross-contract review |

### P2 — Bounded journey contract — DRAFT

| ID | Task | Requirement | Acceptance criteria | Dependencies / output |
|---|---|---|---|---|
| P2.1 | Map the six journey stages | Orientation → commitment → action → evidence → sensemaking → adaptation | Each stage names the participating contract, owning system, person choice, resulting state, and preserved state | P1; [journey contract](../03-experience/journeys/mvp-coherent-loop.md) |
| P2.2 | Define valid entries and exits | The loop is bounded but not a forced funnel | Today, Tasks, Focus, Reflection, deep entry, direct entry, pause, deferral, decline, correction, and departure are represented | P1; journey entry/exit sections |
| P2.3 | Define cross-surface handoffs | No hidden state change across surfaces | Task selection does not complete; Focus does not apply adaptation; Reflection does not mutate commitments without explicit authority | P1, P4; transition table |
| P2.4 | Define journey acceptance evidence | End-to-end behavior must be testable later | Journey has `JOURNEY-*` criteria covering normal, alternative, interrupted, unavailable, correction, and explicit adaptation paths | P2.1–P2.3 |

### P3 — Supporting-domain decisions — DRAFT

| ID | Task | Requirement | Acceptance criteria | Dependencies / output |
|---|---|---|---|---|
| P3.1 | Decide minimum Habits behavior | Habits supports recurring action without becoming a second loop | Daily visibility and explicit completion are retained; analytics, coaching, and expanded scheduling are excluded; `SUPPORT-*` criteria exist | P1/P2; supporting decisions |
| P3.2 | Decide minimum Schedule behavior | Schedule is planning context, not evidence | Task/Habit source ownership, overlapping surfaces, date/time limitations, and no new planning model are explicit | P1/P2/P4; supporting decisions |
| P3.3 | Decide minimum Notes behavior | Notes provides relevant user-owned context | Notes/Growth Areas ownership, contextual links, and no standalone Knowledge product are explicit | P1/P2; supporting decisions |
| P3.4 | Verify supporting domains cannot block the loop | Core journey works with empty/unavailable support | Each supporting domain has empty/unavailable behavior and no mandatory dependency in the journey | P2/P3.1–P3.3 |

### P4 — Record, provenance, correction, and continuity rules — DRAFT

| ID | Task | Requirement | Acceptance criteria | Dependencies / output |
|---|---|---|---|---|
| P4.1 | Assign canonical record ownership | Every consequential mutation has one owner | Ownership matrix covers tasks, focus sessions, attribution, reflection, habits, schedule planning, notes, and derived summaries | P1/P2; [record rules](../04-features/record-rules.md) |
| P4.2 | Define provenance classes | Facts, user input, source input, and derivation remain distinct | Direct, user-provided, source-provided, derived, planned, and unavailable records have required treatment | P4.1; provenance section |
| P4.3 | Define correction and continuity | Correction is not erasure; interruptions preserve confirmed truth | Corrected/superseded/current/historical/unavailable/disconnected/pending states and owner recovery paths are explicit | P4.1–P4.2; continuity section |
| P4.4 | Carry Phase 1.5 constraints forward | Foundation patterns must constrain Phase 3 design | Zod/RHF/date-fns, `Asia/Singapore` date keys, persisted instants, local-draft semantics, `requireUserId`, RLS, and pending migrations are named | P0; foundation references |
| P4.5 | Resolve known ownership questions | No open rule may remain unowned at Gate 2 | Explicit dispositions for task removal history, Next Up ownership, Focus attribution fallback, Reflection record relationship, and supporting writes | P1–P4; Founder/Engineering review |

### P5 — Feature design specifications — NOT STARTED

| ID | Task | Requirement | Acceptance criteria | Planned output |
|---|---|---|---|---|
| P5.1 | Establish design-spec coverage matrix | Apply the design-spec standard to every core domain | Matrix names content, hierarchy, state expression, interaction, responsive, accessibility, reusable standards, artifacts, handoff, and validation for each domain | `docs/05-design/features/` coverage section |
| P5.2 | Design Today | Express orientation and owner handoffs | Covers default, loading, empty, partial/stale, error/retry, deep entry, responsive hierarchy, keyboard/focus, and source/status meaning | `today-design-spec.md` |
| P5.3 | Design Tasks | Express commitment choices and recovery | Covers create/edit, confirmation, completion/defer/withdraw, validation, pending/failure/rollback, reorder alternative, responsive/dialog focus, and destructive consequence | `tasks-design-spec.md` |
| P5.4 | Design Focus | Express truthful active-session state | Covers ready/active/paused/concluded/unreliable, timing, attribution unavailable, interruption/re-entry, session handoff, keyboard/timing, and non-outcome language | `focus-design-spec.md` |
| P5.5 | Design Reflection | Express voluntary sensemaking and durable-save truth | Covers empty/draft/saving/saved/failed/corrected/skipped, autosave disclosure, recovery, session-end entry, adaptation proposal, accessibility, and source/evidence distinction | `reflection-design-spec.md` |
| P5.6 | Cross-surface design review | Design must not alter behavior or ownership | All four specs use active design standards, identify exceptions, preserve contract states, and link validation questions; no spec introduces new MVP scope | P5.1–P5.5; Design Architect checkpoint |

### P6 — Gate 2 evidence and Founder decision — NOT STARTED

| ID | Task | Requirement | Acceptance criteria | Output |
|---|---|---|---|---|
| P6.1 | Assemble traceability matrix | Every admitted behavior has a complete chain | Gate checklist has evidence for parent system, journey, behavior, design, owner, and validation question; no `Unknown` | Gate checklist evidence register |
| P6.2 | Run six-hat readiness review | Product, Design, Engineering, Implementation, and Release checks are explicit | Each hat records its review result, open condition, and artifact link; delivery designs are not treated as approved early | Gate checklist review record |
| P6.3 | Founder Gate 2 decision | Gate outcome must be explicit | Founder records exactly one `PASS`, `HOLD`, or `REWORK`, date, rationale, conditions, and whether Phase 3 is authorized | Gate checklist Decision section and decision record if consequential |
| P6.4 | Prepare commit/merge handoff | Branch must be reviewable | No unexpected files, links resolve, diff is clean, required verification is recorded, and no merge to `main` occurs without Founder authorization | Git review package |

## 7. Requirements and acceptance matrix

| Requirement ID | Requirement | Covered by | Phase 2 acceptance evidence |
|---|---|---|---|
| R2-01 | Core feature boundaries are explicit and remain within MVP admission | P1.1–P1.5 | Four briefs, four behavior contracts, scope/non-goals, Feature Catalog links |
| R2-02 | Every core behavior is observable, stateful, recoverable, and authority-aware | P1.1–P1.5 | Behavior rules, state tables, transitions, recovery, accessibility, acceptance IDs |
| R2-03 | The core loop is cross-surface and non-coercive | P2.1–P2.4 | Journey narrative, transition table, valid alternatives/exits, `JOURNEY-*` |
| R2-04 | Supporting domains have bounded retention/disposition | P3.1–P3.4 | Supporting-domain decision and `SUPPORT-*` |
| R2-05 | Record ownership, provenance, correction, and continuity are explicit | P4.1–P4.5 | Record-rules matrix, provenance classes, correction/continuity states, `RECORD-*` |
| R2-06 | Phase 1.5 validation, forms, and time patterns are carried into contracts | P1.5, P4.4 | Foundation links and explicit constraints in each contract |
| R2-07 | Design expresses every material state without inventing behavior | P5.1–P5.6 | Four design specs and cross-surface design review |
| R2-08 | Validation questions can be executed after design/engineering work | P1.5, P2.4, P5.6, P6.1 | Contract acceptance IDs mapped to validation questions and Gate evidence |
| R2-09 | Gate 2 decision is evidence-based and Phase 3 authorization is explicit | P6.1–P6.4 | Completed Gate checklist and one Founder decision |

## 8. Gate 2 pass conditions

The Gate 2 checklist is the decision record, but the sprint defines the required evidence. Gate 2 cannot pass when any of these is true:

- a core domain lacks a brief, behavior contract, or acceptance criteria;
- a behavior has no parent system, journey stage, design expression, technical owner, or validation question;
- a supporting domain has no minimum behavior or exclusion;
- a record owner or correction/recovery rule is unknown or unowned;
- a design spec omits a required state or changes behavior without contract revision;
- a delivery design was used to bypass missing product/design decisions;
- a deferred domain was silently promoted; or
- the Founder decision, rationale, date, and Phase 3 authorization condition are missing.

## 9. Execution sequence and checkpoints

| Date | Work | Exit check |
|---|---|---|
| 2026-08-05 | P0 baseline; P1–P4 draft refinement; freeze scope and traceability IDs | Draft artifacts exist, tasks are owned, open questions are converted into P4/P5/P6 tasks |
| 2026-08-06 | Complete P1 normalization and P2 journey; Product Architect checkpoint | Core behavior and journey agree; no silent scope expansion |
| 2026-08-07 | Complete P3/P4; execute P5 design specifications; Design/Engineering checkpoints | Supporting and record rules are resolved or explicitly conditioned; all required design states covered |
| 2026-08-08 | P6 traceability review and Founder decision | Gate checklist records `PASS`, `HOLD`, or `REWORK`; Phase 3 authorization is explicit only on `PASS` |

Checkpoint rule: the Founder may approve scope/behavior before design, design before delivery, and the Gate 2 package before Phase 3. A checkpoint does not authorize work outside its boundary.

## 10. Quality and repository readiness

Before this sprint is presented for commit/merge review:

- all required Phase 2 artifacts are listed in Section 5 and have the stated status;
- all local links in touched Markdown resolve;
- `git diff --check` passes;
- no Phase 3 source implementation or unrelated refactor is included;
- if source code changed, run `npm test`, `npm run lint`, `npm run build`, and the security checklist; for documentation-only changes, record that the prior code baseline is unchanged and run the documentation checks;
- the branch diff is reviewed against `main`, unexpected files are removed or explained, and the work remains on `sprint/phase1.5` until Founder approval;
- commit and merge are separate decisions. This sprint does not authorize pushing or merging to `main`.

## 11. Risks and controls

| Risk | Control |
|---|---|
| Contracts encode accidental current behavior | Use Phase 1 evidence as baseline and require explicit product decision for future behavior |
| Design invents behavior | Design specs inherit behavior contracts; P5.6 checks divergence |
| Supporting domains become a second product | P3 minimum behavior and exclusion decisions are Gate evidence |
| Technical convenience collapses record meaning | P4 ownership/provenance/correction rules precede delivery design |
| Pending migrations appear applied | Preserve `APPLIED_STATE.md` limitations; P4.5 requires truthful fallback |
| Sprint and Gate checklist drift | This sprint owns tasks; the Gate checklist links task IDs and records evidence/status |
| Phase 3 starts early | P6.3 requires explicit Founder `PASS`; all draft artifacts state they do not authorize implementation |

## 12. Change control

The Founder may change Phase 2 scope, sequence, or acceptance only through an update to this sprint and the Gate checklist. A change that alters MVP admission, phase dependency, parent-system meaning, or the Gate definition also requires a decision record and impact assessment. Historical evidence and prior decisions are not silently rewritten.

## 13. Related documents

- [Phase 2 README](./phase-2/README.md)
- [Gate 2 checklist](./phase-2/gate-checklist.md)
- [MVP implementation masterplan](./mvp-implementation-masterplan.md)
- [Feature Catalog](../04-features/feature-catalog.md)
- [Phase 1 implementation-truth evidence](./phase-1/implementation-truth-evidence.md)
- [Phase 1.5 foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
- [Technology Integration Masterplan](../06-engineering/technology-integration-masterplan.md)
