# Current Sprint — Phase 3: Implement and Harden the Core Loop

**Sprint period:** 2026-08-05 onward
**Phase:** Phase 3 — Implement and Harden the Core Loop
**Status:** `ACTIVE` — P2–P6 implementation is complete with automated evidence; P1 orientation is deferred by D-014; P7 Gate 3 evidence and Founder decision remain
**Branch:** `sprint/phase3`
**Owner:** Founder, executing all six hats
**Last updated:** 2026-08-06

**Single implementation reference:** This document governs Phase 3 sequence, package status, implementation tasks, acceptance traceability, evidence ownership, and Gate 3 readiness. It does not replace the approved behavior contracts or design specifications. Package delivery designs define the technical approach; package validation plans define executable evidence; this sprint links and sequences them.

**Phase boundary:** [Phase 3 README](./phase-3/README.md)
**Gate record:** [Gate 3 checklist](./phase-3/gate-checklist.md)
**Roadmap authority:** [MVP implementation masterplan](./mvp-implementation-masterplan.md)
**Previous phase:** [Archived Phase 2 sprint record](../11-archive/phases/phase-2/phase-2-sprint.md)
**Previous gate decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Workflow:** [Solo Founder Workflow](../start-here/solo-founder-workflow.md)

**P7 live validation update (2026-08-06):** The production anonymous route probe passed for `/`, `/workplace`, and `/login`; an authenticated report recorded a `BLOCK` for Later cross-group task movement, and the Founder-authorized local fix now passes regression, repository, type, lint, build, and diff checks. The merged production retest and several unreported drag scenarios remain open. See the [P7 quality record](./phase-3/p7-quality-evidence.md) and the linked redacted evidence records; no Gate 3 criterion is closed by this probe.

## 1. Authority and phase outcome

Phase 2 passed Gate 2 on 2026-08-05. Its approved briefs, behavior contracts, coherent-loop journey, supporting-domain decisions, record/provenance/correction/continuity rules, and four design specifications are the product and design authority for this sprint.

Phase 3 earns Gate 3 only when the Founder can perform the admitted journey with seeded and real data, recover from interruption and error, distinguish factual from planned/interpretive/proposed/applied meaning, and reach the canonical owner for every consequential change. Gate 4 remains required before release.

The implementation order is fixed unless the Founder records a consequential change:

```text
Today workspace entry/route recovery → P2 Tasks → P3 Focus → P4 factual evidence
→ P5 Reflection/adaptation → P6 supporting surfaces → P7 Gate 3 evidence
```

## 2. Entry baseline and carried conditions

**P0 handoff:** `COMPLETE` on `sprint/phase3`, before P1 implementation began.

The Founder reviewed the archived Phase 2 package and confirmed that Phase 3 may implement only within the admitted MVP boundary. The following are active constraints, not resolved facts:

- `tasks_next_up_queue.sql` and `focus_session_task_totals.sql` are pending/unverified. Their SQL definitions do not prove live capability; related behavior remains unavailable until applied and verified.
- Two-account RLS/security isolation evidence is outstanding.
- Singapore midnight boundary evidence is outstanding.
- Schedule keyboard accessibility review is carried as an explicit condition.
- Audit vulnerabilities and middleware deprecation remain technical debt and require disposition; warning-free lint is an explicit P7 hardening requirement.
- A configured production build is required before relying on build evidence; this worktree has no local environment file.

No implementation may widen a source set, add a route/table/migration, infer attribution or outcomes, create a cross-owner mutation, or convert unavailable/failed/pending/local-draft state into success.

## 3. Scope

### In scope

- Today workspace entry, canonical owner handoffs, and route recovery; the separate read-only orientation is deferred for MVP.
- Tasks commitment/action lifecycle: create, clarify, select, start, complete, revise, defer, restore, withdraw, correct, and recover.
- Focus session lifecycle: start, pause, resume, conclude, leave, re-enter, persist, recover, and disclose attribution limits.
- Factual evidence from owner-confirmed task/session/source records without universal scoring or inferred outcomes.
- Voluntary Reflection records, local drafts, correction/withdrawal, Focus handoff, and explicit receiving-owner adaptation.
- Minimum bounded Habits, Schedule, and Notes paths that keep the journey usable when optional sources are empty or unavailable.
- Automated, manual, accessibility, security, identity, date/time, recovery, and repository evidence required by Gate 3.

### Out of scope and guardrails

- Goals, AI Coach, standalone Knowledge, standalone Growth Areas, standalone Weekly Review, new MVP breadth, autonomous prioritization, universal progress scoring, or implicit adaptation.
- Applying migrations, changing schema, or claiming live migration behavior without a separately recorded Founder-authorized migration step and verification evidence.
- Treating Today, Schedule, a projection, task selection, Focus duration, Reflection text, or source absence as a universal outcome.
- Merging to `main`, deploying, or claiming release readiness from Phase 3 implementation work alone.

## 4. Artifact register and checkpoint status

| Package | Behavior/design authority | Delivery design | Validation plan | Current state | Implementation checkpoint |
|---|---|---|---|---|---|
| P1 Today orientation | [Today behavior](../04-features/behavior/today.md) · [Today design](../05-design/features/today-design-spec.md) | [Today delivery](../04-features/delivery/today-orientation.md) | [Today validation](../04-features/validation/today-orientation.md) | `DEFERRED_FOR_MVP` — retained as historical/future work | `APPROVED` by D-009; deferred by D-014 |
| P2 Tasks | [Tasks behavior](../04-features/behavior/tasks.md) · [Tasks design](../05-design/features/tasks-design-spec.md) | [Tasks delivery](../04-features/delivery/tasks-core-loop.md) | [Tasks validation](../04-features/validation/tasks-core-loop.md) | `IMPLEMENTED_AUTOMATED` — manual/live evidence pending | `APPROVED` by D-010 |
| P3 Focus | [Focus behavior](../04-features/behavior/focus.md) · [Focus design](../05-design/features/focus-design-spec.md) | [Focus delivery](../04-features/delivery/focus-core-loop.md) | [Focus validation](../04-features/validation/focus-core-loop.md) | `IMPLEMENTED_AUTOMATED` — manual/live evidence pending | `APPROVED` by D-010 |
| P4 Evidence | [Record rules](../04-features/record-rules.md) · [Journey](../03-experience/journeys/mvp-coherent-loop.md) | [Evidence delivery](../04-features/delivery/factual-evidence.md) | [Evidence validation](../04-features/validation/factual-evidence.md) | `IMPLEMENTED_AUTOMATED` — manual/live evidence pending | `APPROVED` by D-010 |
| P5 Reflection/adaptation | [Reflection behavior](../04-features/behavior/reflection.md) · [Reflection design](../05-design/features/reflection-design-spec.md) | [Reflection delivery](../04-features/delivery/reflection-core-loop.md) | [Reflection validation](../04-features/validation/reflection-core-loop.md) | `IMPLEMENTED_AUTOMATED` — manual/live evidence pending | `APPROVED` by D-010 |
| P6 Supporting surfaces | [Supporting decisions](../04-features/supporting-domain-decisions.md) · [Record rules](../04-features/record-rules.md) | [Supporting delivery](../04-features/delivery/supporting-surfaces.md) | [Supporting validation](../04-features/validation/supporting-surfaces.md) | `IMPLEMENTED_AUTOMATED` — manual/live evidence pending | `APPROVED` by D-010 |
| P7 Gate 3 evidence | [Gate 3 checklist](./phase-3/gate-checklist.md) · [P7 quality evidence](./phase-3/p7-quality-evidence.md) | This sprint's evidence protocol | Package evidence records and review | `IN_PROGRESS` — automated repository/runtime evidence assembled; authenticated manual/live checks and Founder decision pending | Founder build/release checkpoint after active P2–P6 work |

P2–P6 package artifacts were explicitly approved by D-010. Their implementation evidence is now recorded separately; package automated completion does not close Gate 3 or substitute for manual/live evidence.

## 5. Phase requirements

**Implementation status update (2026-08-05):** P2 Tasks is `IMPLEMENTED_AUTOMATED`; its manual/live evidence is held for the final P7 pass in [Tasks implementation evidence](./phase-3/tasks-implementation-evidence.md). The P2 package checkpoint is approved by D-010.

**Implementation status update (2026-08-05):** P3 Focus is `IMPLEMENTED_AUTOMATED`; its manual/live evidence is held for the final P7 pass in [Focus implementation evidence](./phase-3/focus-implementation-evidence.md). The P3 package checkpoint is approved by D-010.

**Implementation status update (2026-08-05):** P4 factual evidence is `IMPLEMENTED_AUTOMATED`; evidence envelopes/adapters and Today integration are recorded in [Factual evidence implementation evidence](./phase-3/factual-evidence-implementation-evidence.md). Manual/live evidence is held for the final P7 pass.

**Implementation status update (2026-08-05):** P5 Reflection/adaptation is `IMPLEMENTED_AUTOMATED`; identity, validation, draft/save recovery, Focus handoff, and receiving-owner proposal state are recorded in [Reflection implementation evidence](./phase-3/reflection-implementation-evidence.md). Manual/live evidence is held for the final P7 pass.

**Implementation status update (2026-08-05):** P6 supporting surfaces is `IMPLEMENTED_AUTOMATED`; bounded Habits, Schedule, and Notes states and owner routing are recorded in [Supporting surfaces implementation evidence](./phase-3/supporting-surfaces-implementation-evidence.md). Manual/live evidence is held for the final P7 pass.

| ID | Requirement | Completion condition | Primary evidence |
|---|---|---|---|
| `R3-01` | Implement only the admitted MVP loop | No new route/domain/owner/meaning; all divergence escalated | Package delivery designs; scope review |
| `R3-02` | Every stage has an implemented owner path | Today/workspace provides the execution entry; Tasks owns commitments; Focus owns sessions; Reflection owns interpretation; receiving owner applies adaptation | Journey walkthrough; owner matrix |
| `R3-03` | Preserve factual/planned/interpretive/proposed/applied/unavailable distinctions | UI, state model, and tests never strengthen meaning through projection or absence | Evidence validation; semantic review |
| `R3-04` | Normal, alternative, interrupted, unavailable, failed, correction, and recovery paths work | Last confirmed state remains authoritative; retry/leave/correct are explicit | Package validation plans; manual evidence |
| `R3-05` | Apply foundation constraints at every owner boundary | `requireUserId`, RLS, shared Zod/RHF, `date-fns`, Singapore date keys, instant timestamps, local drafts, pending-migration truth are testable | Security/date/service evidence |
| `R3-06` | Supporting surfaces remain optional and non-blocking | Empty/unavailable/stale/disconnected Habits/Schedule/Notes do not block the core loop | Supporting validation |
| `R3-07` | Material states are accessible and responsive | Keyboard, screen reader, visible focus, responsive, touch, reduced-motion, and non-color state meaning are reviewed | Accessibility evidence; carried-condition disposition |
| `R3-08` | Evidence is reproducible and safe | Fixtures, account, date key, environment, method, result, limitation, and owner are recorded; sensitive content is redacted | Evidence records and review |
| `R3-09` | Repository quality is verified before merge request | Configured build, warning-free lint, tests, diff check, security checklist, manual smoke, and known limitations are recorded | Merge-prep report |
| `R3-10` | Founder decides Gate 3 explicitly | Exactly one `PASS`, `HOLD`, or `REWORK` with rationale and next authorization | Gate 3 checklist and decision record |

## 6. Implementation task register

Tasks below are the execution checklist. Each task must link its code/tests/evidence to the package acceptance IDs; implementation may refine file-level details without changing the behavior boundary.

**MVP route decision (2026-08-06):** [D-014](../08-decisions/records/D-014-defer-today-orientation-and-make-workspace-canonical.md) defers the separate read-only Today orientation. The existing interactive workspace is now the canonical Today experience at `/`; `/workplace` is a compatibility redirect. The P1 orientation package remains historical/deferred and is not required for the current MVP route.

### P1 — Today orientation (`TODAY-01`…`TODAY-06`) — deferred for MVP

The tasks below are retained as future re-admission work. They do not define the active MVP entry experience or add a separate Gate 3 requirement.

| Task | Implementation requirement | Done when |
|---|---|---|
| `P1.1` | Preserve read-only composition and remove mutation ownership from Today | No Today durable write; all consequential controls route to canonical owner |
| `P1.2` | Implement independent source settlement and semantic source envelopes | Ready/empty/partial/stale/unavailable/disconnected/error/loading are distinguishable |
| `P1.3` | Implement Singapore date-key forwarding, source-scoped retry, request identity, and re-entry | Late/failed refresh cannot erase newer confirmed context |
| `P1.4` | Remove score-like orientation meaning and label factual/planned/interpretive context | No universal score, inferred attribution, or outcome claim appears |
| `P1.5` | Complete seeded/real-data, accessibility, owner-handoff, interruption, and configured-build evidence | Today validation plan is executed; P1 evidence is linked to G3-02 |

### P2 — Tasks commitment/action (`TASK-01`…`TASK-08`)

| Task | Implementation requirement | Done when |
|---|---|---|
| `P2.1` | Normalize user-scoped task reads/writes and Zod/RHF form validation | Create/revise/pending/failed/local-draft states are truthful |
| `P2.2` | Implement complete, restore, defer, withdraw, correction, and retained history | Each lifecycle state is explicit and owner-confirmed; Remove is not deletion/completion |
| `P2.3` | Implement Task-to-Focus planned selection with unchanged-state protection | Selection changes neither completion nor task history |
| `P2.4` | Gate Next Up membership/order on applied-and-verified migration | Pending capability is unavailable; no local or SQL-based persistence claim |
| `P2.5` | Execute lifecycle, recovery, accessibility, two-account, timezone, and seeded/real-data evidence | All `TASK-*` questions have evidence or Founder disposition |

### P3 — Focus action mode (`FOCUS-01`…`FOCUS-07`)

| Task | Implementation requirement | Done when |
|---|---|---|
| `P3.1` | Implement confirmed start/pause/resume/conclude/leave state machine | Pending/confirmed/failed states preserve last confirmed session |
| `P3.2` | Preserve persisted instants and truthful elapsed-time meaning | Timer is not authority; duration is not outcome |
| `P3.3` | Implement interruption/local recovery and safe re-entry | Re-entry offers explicit resume/reconcile/retry/leave without invented state |
| `P3.4` | Implement attribution-unavailable fallback and Reflection handoff | No inferred totals; failed Reflection save does not undo Focus |
| `P3.5` | Execute lifecycle, recovery, accessibility, two-account, timezone, and seeded/real-data evidence | All `FOCUS-*` questions have evidence or Founder disposition |

### P4 — Factual evidence (`RECORD-01`…`RECORD-08`, `JOURNEY-03`, `JOURNEY-04`, `JOURNEY-08`)

| Task | Implementation requirement | Done when |
|---|---|---|
| `P4.1` | Define source-labelled factual evidence envelopes/adapters | Source, record identity, provenance, scope, freshness, and derivation are retained |
| `P4.2` | Integrate task/session/source facts into approved consuming surfaces | Projections do not become a write owner or erase limitations |
| `P4.3` | Route correction/withdrawal/deletion to canonical owners | History and neighboring source records remain intact |
| `P4.4` | Enforce planned/derived/user-provided/proposed/applied/unavailable semantics | No selection, duration, reflection, or absence becomes outcome evidence |
| `P4.5` | Execute seeded full-loop and partial-loop evidence | Factual and interpretive meaning is explainable; explicit adaptation reaches receiving owner |

### P5 — Reflection and adaptation (`REFLECT-01`…`REFLECT-08`)

| Task | Implementation requirement | Done when |
|---|---|---|
| `P5.1` | Unify daily, custom, and Focus session-end record identity/ownership | No duplicate or replacement semantics are introduced |
| `P5.2` | Implement validation, local draft, pending/save failure, retry, correction, withdrawal, skip, and re-entry | Draft is never called saved; prior confirmed state remains authoritative |
| `P5.3` | Preserve factual source context as linked context and interpretation as user-provided | Reflection does not rewrite Task/Focus facts |
| `P5.4` | Implement explicit proposal and receiving-owner apply/decline/defer handoff | Reflection cannot mutate commitments implicitly |
| `P5.5` | Execute record, recovery, accessibility, two-account, timezone, and seeded/real-data evidence | All `REFLECT-*` questions have evidence or Founder disposition |

### P6 — Supporting surfaces (`SUPPORT-01`…`SUPPORT-07`)

| Task | Implementation requirement | Done when |
|---|---|---|
| `P6.1` | Implement bounded Habits daily visibility/explicit completion | No score, streak, moral language, or second loop |
| `P6.2` | Implement Schedule planning context from Task/Habit owners | Schedule never becomes evidence or competing source |
| `P6.3` | Implement Notes/embedded Growth Areas optional context only through existing owner path | No standalone Knowledge/Goals/automatic meaning |
| `P6.4` | Add independent optional-source state, retry, owner handoff, and re-entry | Empty/unavailable/stale/disconnected/error is truthful and non-blocking |
| `P6.5` | Execute optional-source, accessibility, two-account, timezone, and seeded/real-data evidence | All `SUPPORT-*` questions have evidence or Founder disposition |

### P7 — Gate 3 readiness evidence

| Task | Requirement | Done when |
|---|---|---|
| `P7.1` | Assemble package evidence and traceability | Every G3 row links to executed evidence, result, limitation, and owner |
| `P7.2` | Run release-quality checks and security review | `npm run lint -- --max-warnings=0`, build, tests, diff, security, and manual checks are recorded; no warning exception remains |
| `P7.3` | Run seeded and real-data complete journey plus interruption/failure/correction paths | Founder can repeat the journey and reach each canonical owner |
| `P7.4` | Prepare Gate 3 decision package | Gate checklist is complete; Founder records exactly `PASS`, `HOLD`, or `REWORK` |

**P7.2 implementation update (2026-08-05):** Repository lint hardening is complete. `npm run lint -- --max-warnings=0` passes with zero warnings and zero errors; the remaining checks also pass for `npm test` (31 files, 284 tests), `npm run build`, `git diff --check`, and the focused secret/RLS-bypass scan. `npx tsc --noEmit` still reports four test/fixture/export issues documented in the developer log; the production build TypeScript phase passes. Manual seeded/real-data, browser, RLS, timezone, accessibility, and migration checks remain held for P7.3/P7.4.

## 7. Acceptance traceability

| Acceptance family | IDs | Implementation package | Validation authority | Gate contribution |
|---|---|---|---|---|
| Today/workspace entry | `TODAY-01`…`TODAY-06` | P1 route decision; orientation deferred | Today validation plan and D-014 | G3-02, G3-08 |
| Tasks | `TASK-01`…`TASK-08` | P2 | Tasks validation plan | G3-03, G3-07, G3-08 |
| Focus | `FOCUS-01`…`FOCUS-07` | P3 | Focus validation plan | G3-04, G3-07, G3-08 |
| Factual records | `RECORD-01`…`RECORD-08` | P4 | Factual evidence validation plan | G3-04, G3-07, G3-08 |
| Journey | `JOURNEY-01`…`JOURNEY-08` | P1–P7 | Full-loop evidence and review | G3-02, G3-03, G3-04, G3-05, G3-08 |
| Reflection | `REFLECT-01`…`REFLECT-08` | P5 | Reflection validation plan | G3-05, G3-07, G3-08 |
| Supporting | `SUPPORT-01`…`SUPPORT-07` | P6 | Supporting surfaces validation plan | G3-06, G3-07, G3-08 |

Every acceptance ID remains owned by its parent contract. This table is the execution join, not a redefinition of those questions.

### Journey acceptance coverage

| ID | Implementation coverage | Required evidence |
|---|---|---|
| `JOURNEY-01` | P1/P2/P3/P5/P6 direct and deep entry paths | Each owner can be entered directly/deeply without a Today-first funnel |
| `JOURNEY-02` | P1–P6 owner/state/changed-state/unchanged-state review | Cross-surface ownership matrix and unchanged-state assertions |
| `JOURNEY-03` | P4 factual evidence plus P1/P2/P3/P5 semantics | Seeded walkthrough names planned, factual, interpretive, proposed, applied, and unavailable meaning |
| `JOURNEY-04` | P2 Task selection, P3 Focus, P5 Reflection | Before/after assertions prove selection, session, and interpretation do not cross owners |
| `JOURNEY-05` | P2/P3/P5/P6 pause, defer, decline, correct, retry, depart | Alternative-path walkthrough preserves confirmed truth and valid non-action exits |
| `JOURNEY-06` | P1–P6 re-entry and interruption recovery | Owner re-entry restores confirmed state and discloses pending/failed/local/stale/unavailable context |
| `JOURNEY-07` | P1/P4/P6 optional-source and attribution fallback | Core journey continues when support, attribution, or another source is unavailable |
| `JOURNEY-08` | P4/P5/P7 complete and partial journey | Seeded path reaches explicit receiving-owner application; partial path remains valid |

## 8. Cross-cutting implementation rules

### Owner and truth rules

- Today/workspace provides the primary execution entry; Tasks owns commitments/Next Up; Focus owns session facts; Reflection owns interpretation; Habits owns habits; Tasks/Habits own planning values; Notes owns notes/context; receiving owners apply adaptation.
- A projection may display a source but cannot report consequential success on its behalf.
- `planned`, `factual`, `user-provided`, `source-provided`, `derived`, `proposed`, `applied`, and `unavailable` are product meanings, not styling variants.
- `pending`, `failed`, `local-draft`, `historical`, `superseded`, and `disconnected` must remain visible when relevant.

### Security, foundation, and data rules

- User-scoped data access and RLS are mandatory. No `using (true)` on user data, service-role browser access, or client-only authorization.
- Runtime validation uses the shared Zod/RHF patterns; server validation remains authoritative.
- Product date keys use `Asia/Singapore` and `date-fns`; persisted timestamps are instants; browser timezone cannot change a product date.
- Local drafts are recoverable continuity, not durable saves. Repository SQL is not applied-state evidence.
- Error messages are safe and actionable without raw database, auth, or sensitive content.

### Quality and accessibility rules

- Use existing semantic tokens and accessible primitives; material state/owner/recovery information cannot depend on color, hover, or tooltip.
- Cover normal, alternative, empty, unavailable, partial/stale, failed, interrupted, correction/withdrawal, permission, and safe-departure paths.
- Before each implementation checkpoint and before Gate 3: run `npm test`, `npm run lint -- --max-warnings=0`, configured `npm run build`, and `git diff --check` as applicable; run the six-point security checklist.

## 9. Gate 3 evidence protocol

Gate 3 is a decision gate, not a progress label. The checklist remains `NOT_STARTED` until implementation evidence exists, even when package plans are ready.

| Gate ID | Requirement | Minimum evidence to close | Current state |
|---|---|---|---|
| `G3-01` | Approved delivery designs and validation plans exist | Active Founder-approved delivery/validation pairs for P2–P6, plus the D-014 route decision for the canonical Today workspace | `IN_PROGRESS` — P1 orientation deferred; P2–P6 ready for checkpoint |
| `G3-02` | Canonical Today workspace and route recovery work | Seeded/real `/` workspace walkthrough, direct/re-entry/handoff/retry/recovery, accessibility, and owner-boundary evidence | `IN_PROGRESS` — automated route evidence; manual evidence pending |
| `G3-03` | Tasks support commitment/action | All `TASK-*` evidence plus create/select/lifecycle/correction/defer/withdraw/recovery and owner routing | `NOT_STARTED` |
| `G3-04` | Focus and factual evidence are truthful | All `FOCUS-*`/`RECORD-*` evidence plus interruption/persistence/history/attribution fallback | `NOT_STARTED` |
| `G3-05` | Reflection preserves interpretation/adaptation authority | All `REFLECT-*` evidence plus save/retry/correct/re-entry and receiving-owner handoff | `NOT_STARTED` |
| `G3-06` | Supporting surfaces are bounded/non-blocking | All `SUPPORT-*` evidence for empty/unavailable/stale/error/owner states and accessibility disposition | `NOT_STARTED` |
| `G3-07` | Security, identity, validation, date/time, recovery boundaries hold | User scope/RLS, shared validation, Singapore boundary, instant timestamps, local drafts, migration truth, and technical-debt disposition | `NOT_STARTED` |
| `G3-08` | Founder can complete coherent loop | Repeatable seeded and real-data journey with interruption, failure, correction, truthful meaning, and owner-routing evidence | `NOT_STARTED` |

Gate 3 cannot pass while any material unauthorized write, cross-account exposure, inferred attribution/outcome, hidden pending state, lost confirmed history, unsafe error, or inaccessible recovery path remains. Carried conditions require evidence or explicit Founder disposition; they are not waived by a passing happy path.

## 10. Founder checkpoints and decisions

| Checkpoint | Timing | Required decision/evidence |
|---|---|---|
| P0 handoff | Complete | D-008 scope and limitations accepted; no Phase 3 breadth added |
| P1 Today scope/design | Deferred for MVP | D-009 remains historical; D-014 makes the interactive workspace canonical at `/` |
| P2–P6 package checkpoints | Before each package implementation | Founder approves each delivery design and validation plan, or requests rework |
| Build checkpoint | After implementation packages and automated/manual checks | Founder reviews known gaps, security checklist, test/build evidence, and authorizes Gate 3 evidence collection |
| Gate 3 decision | After P7 evidence | Founder records exactly `PASS`, `HOLD`, or `REWORK`; no release claim follows automatically |
| Gate 4/release | Downstream | Separate trust, quality, security, accessibility, reliability, and deployment decision |

## 11. Risks, stop conditions, and handoffs

| Risk/condition | Control | Stop/escalate when |
|---|---|---|
| Pending migrations appear available | Keep capability unavailable; verify live state before any claim | Code or copy implies queue/attribution capability |
| Implementation invents meaning | Link code/tests to acceptance IDs and parent contracts | New state, owner, route, source, score, or inference is needed |
| Owner boundaries collapse | Test unchanged state and owner routing at every handoff | A projection or downstream surface writes another owner's record |
| Recovery hides uncertainty | Preserve last confirmed state and label pending/failed/local/unavailable | Requested result is shown as confirmed or recovery is inaccessible |
| Security/date/accessibility gaps persist | Carry to G3/G4 evidence with owner and disposition | Cross-account access, browser date drift, unsafe error, or material inaccessible state appears |
| Environment prevents verification | Load required environment securely and record limitation | Build result is relied on without configured environment |

## 12. Definition of done

Phase 3 is ready for the Founder Gate 3 decision only when:

- Active P2–P6 implementation tasks are complete against approved package designs; the P1 orientation package is deferred by D-014.
- Every acceptance family in the traceability table has evidence or an explicit Founder disposition.
- Normal, alternative, empty, partial/stale, unavailable, failed, interrupted, correction/withdrawal, permission, and safe-departure paths are tested where applicable.
- User scope/RLS, validation, Singapore date keys, instant timestamps, local drafts, pending migration truth, accessibility, warning-free lint/build/test, and known technical debt are evidenced.
- The Founder can perform the full seeded and real-data loop and identify the canonical owner for every consequential change.
- Gate 3 is decided in the checklist before any release-readiness or merge-to-main claim.
