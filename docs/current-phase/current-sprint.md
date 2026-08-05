# Current Sprint — Phase 3: Implement and Harden the Core Loop

**Sprint period:** 2026-08-05 onward
**Phase:** Phase 3 — Implement and Harden the Core Loop
**Status:** ACTIVE — authorized by Gate 2; implementation not started
**Handoff branch:** `sprint/phase2` — Phase 2 closeout and handoff remain pending Founder approval; create a dedicated Phase 3 branch before implementation.
**Owner:** Founder, executing all six hats
**Last updated:** 2026-08-05

**Previous phase:** [Archived Phase 2 sprint record](../11-archive/phases/phase-2/phase-2-sprint.md)
**Previous gate decision:** [D-008 — Pass Gate 2 and Authorize Phase 3](../08-decisions/records/D-008-pass-gate-2-and-authorize-phase-3.md)
**Phase boundary:** [Phase 3 README](./phase-3/README.md)
**Gate record:** [Gate 3 checklist](./phase-3/gate-checklist.md)
**Roadmap authority:** [MVP implementation masterplan](./mvp-implementation-masterplan.md)
**Workflow:** [Solo Founder Workflow](../start-here/solo-founder-workflow.md)

## 1. Phase transition

Phase 2 closed with Gate 2 `PASS` on 2026-08-05. Its complete execution record and checklist are archived under [the Phase 2 archive](../11-archive/phases/phase-2/). The approved briefs, behavior contracts, journey, supporting-domain decisions, record rules, and design specifications are the implementation contract for this phase.

Phase 3 is authorized within the admitted MVP boundary. Gate 3 must still demonstrate a coherent seeded and real-data core loop, and Gate 4 remains required for trust, quality, security, accessibility, reliability, and release readiness.

## 2. Objective

Make the admitted MVP useful in one continuous experience rather than as a collection of disconnected polished pages, while preserving the Phase 2 ownership, provenance, correction, continuity, and recovery rules.

## 3. In scope

- Today orientation, current context, next-action visibility, and route recovery.
- Task commitment and action: create, clarify, select, start, complete, revise, defer, and recover.
- Focus mode: deliberate attention, interruption handling, persistence, and truthful history.
- Evidence: factual records of completed actions, Focus sessions, and relevant outcomes without universal scoring.
- Reflection and adaptation: interpretation, provenance, and explicit next choice with receiving-owner authority.
- Only the smallest Habits, Schedule, and Notes paths justified by the Phase 2 journey contract.

## 4. Out of scope and guardrails

- No Goals, AI Coach, standalone Knowledge, standalone Growth Areas, standalone Weekly Review, new MVP breadth, or autonomous prioritization.
- No implicit attribution, implicit adaptation, or cross-owner mutation.
- Pending migrations remain unavailable until applied and verified; the SQL definitions in the handoff branch do not represent live applied state.
- Phase 3 implementation must begin on a dedicated Phase 3 branch after the `sprint/phase2` closeout is approved and merged. `main` remains read-only.

## 5. Work packages

| Package | Outcome | Owner | State |
|---|---|---|---|
| P0 — Handoff baseline | Read the archived Phase 2 package, preserve admitted boundaries, and carry every unresolved condition into implementation plans | Founder / Engineering Architect | `ACTIVE` |
| P1 — Today orientation | Implement orientation, context, owner handoffs, and route recovery | Product + Design + Engineering | `NOT_STARTED` |
| P2 — Task commitment/action | Implement task lifecycle, selection, correction, defer/withdraw, and recovery | Product + Design + Engineering | `NOT_STARTED` |
| P3 — Focus action mode | Implement session lifecycle, interruption, persistence, and truthful history | Product + Design + Engineering | `NOT_STARTED` |
| P4 — Evidence | Implement factual action/session evidence without inferred outcomes | Engineering Architect | `NOT_STARTED` |
| P5 — Reflection/adaptation | Implement voluntary sensemaking, provenance, correction, and receiving-owner handoff | Product + Design + Engineering | `NOT_STARTED` |
| P6 — Supporting surfaces | Implement only the bounded Habits, Schedule, and Notes paths needed by the journey | Product + Design + Engineering | `NOT_STARTED` |
| P7 — Gate 3 evidence | Verify seeded/real-data loop completion, interruption recovery, truth distinctions, and owner routing | Release Manager + Founder | `NOT_STARTED` |

## 6. Six-hat responsibilities

| Hat | Phase 3 responsibility | Checkpoint |
|---|---|---|
| Product Architect | Preserve the admitted journey and resolve only contract-level questions | Scope checkpoint before each delivery design |
| Design Architect | Express approved behavior states accessibly and responsively | State-coverage review per surface |
| Engineering Architect | Create delivery designs, technical ownership, migration plan, and validation plan | Delivery/design approval before implementation |
| Implementation Engineer | Implement the approved contracts with tests, recovery, and security boundaries | Build checkpoint before release evidence |
| Release Manager | Run validation, review diff, record limitations, and prepare Gate 3 evidence | Gate 3 readiness package |
| Founder | Approve consequential scope, architecture, and release decisions | Explicit decision records when authority changes |

## 7. Risks and handoffs

| Risk | Control / next disposition | State |
|---|---|---|
| Pending Next Up and Focus attribution migrations appear available | Keep truthful unavailable fallback; apply and verify before attribution or release claims | `OPEN` |
| Implementation invents meaning not present in Phase 2 contracts | Link each delivery design and test to the approved contract and acceptance question | `OPEN` |
| Owner boundaries collapse across Today, Tasks, Focus, and Reflection | Require canonical-owner and unchanged-state review at each handoff | `OPEN` |
| Security, timezone, accessibility, lint, audit, and middleware limitations persist | Carry D-008 owners into Gate 3/Gate 4 validation and hardening | `OPEN` |

## 8. Definition of done for this sprint

- [ ] Delivery designs and validation plans exist for the admitted core-loop sequence.
- [ ] Implemented behavior is tested for normal, alternative, interrupted, unavailable, correction, and recovery paths.
- [ ] User-scoped access, RLS, validation, Singapore date keys, instant timestamps, local-draft semantics, and pending-migration truth are verified.
- [ ] Gate 3 evidence shows the full journey with seeded and real data and preserves factual versus interpretive meaning.
- [ ] Founder records the Gate 3 decision before any release-readiness claim.
