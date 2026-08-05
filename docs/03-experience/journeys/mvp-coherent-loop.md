# MVP Coherent Loop - Journey Contract

**Status:** Product Architect complete; approved by Founder on 2026-08-05
**Owner:** Product Architect (Founder)
**Sprint tasks:** P2.1-P2.4, P5.6
**Parent systems:** [Experience Architecture](../experience-architecture.md) - [Information Structure](../information-structure.md) - [Product Model](../../01-product/product-model.md)
**Participating contracts:** [Today](../../04-features/behavior/today.md) - [Tasks](../../04-features/behavior/tasks.md) - [Focus](../../04-features/behavior/focus.md) - [Reflection](../../04-features/behavior/reflection.md)
**Supporting decisions:** [Habits, Schedule, Notes](../../04-features/supporting-domain-decisions.md)
**Record rules:** [MVP record rules](../../04-features/record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Journey intent and boundary

FlowOS helps a person orient, choose, act, understand what occurred, and decide what - if anything - to change. The bounded journey is:

**Orientation -> Commitment -> Action -> Evidence -> Sensemaking -> Adaptation**

This is a set of valid relationships, not a forced funnel. A person may enter at any stage, pause, defer, decline, correct, retry, or leave. Habits, Schedule, and Notes are optional context and cannot block the six stages.

## Stage and authority contract

| Stage | Participating contract/system | Person choice | State that may change | State that remains unchanged |
|---|---|---|---|---|
| Orientation | Today / Experience Architecture | Inspect, choose an entry, or leave | No durable domain state; a handoff context may be created | All source records and meanings |
| Commitment | Tasks / Direction and Commitment | Create, revise, complete, defer, withdraw, restore, or select | Task commitment state only | Focus facts, reflection meaning, outcome |
| Action | Focus / Action and Evidence | Start, pause, resume, conclude, or leave | Focus session lifecycle only | Task completion and adaptation |
| Evidence | Focus and source records / Action and Evidence | Inspect factual session/source records and limits | A factual record may be confirmed/corrected by its owner | Commitment, interpretation, proposal |
| Sensemaking | Reflection / Sensemaking and Adaptation | Draft, save, correct, withdraw, skip, or revisit | Reflection record/interpretation only | Source facts and commitments |
| Adaptation | Reflection proposal -> receiving owner | Accept, modify, defer, decline, or explicitly apply | Receiving owner applies a consequential change after authority | Reflection history and source evidence |

## Truth and provenance distinctions

Every handoff preserves these meanings:

- **Planned:** a task, schedule, selection, or proposed next step; not proof of action.
- **Factual:** an owner-confirmed session, completion, or source event; scoped to what it records, not a universal outcome.
- **Interpretive:** a user-provided reflection or meaning; not direct evidence.
- **Proposed:** an insight or adaptation awaiting explicit authority; not applied state.
- **Applied:** a receiving owner confirmed a consequential mutation; not merely a reflection save or suggestion.
- **Unavailable:** a source, migration, or relationship cannot be verified; never fill the gap by inference.

Provenance remains `direct`, `user-provided`, `source-provided`, `derived`, `planned`, or `unavailable` as defined in the record rules.

## Valid entry and deep-entry contexts

| Entry | Starting meaning | Required reorientation |
|---|---|---|
| Today `/` | Current composition and choice | Source, freshness, and owner for each material context |
| Tasks | Commitment creation/revision or task inspection | Task current state and available consequence |
| Focus | Active/paused session or direct action start | Last confirmed session state and uncertainty |
| Reflection | Direct sensemaking for a date or custom entry | Record identity, save state, and voluntary options |
| Task deep link | A specific commitment from Today/Schedule/Focus | Task state; selection is not completion |
| Session-end deep link | Concluded Focus facts offered to Reflection | Session identity; reflection write remains Reflection-owned |
| Supporting deep link | Habit, planning, or note context | Source owner and optional relationship |

No entry requires visiting Today first. A direct entry must not fabricate missing earlier stages.

## Normal cross-surface flow

1. **Orientation:** Today composes available context. The person may choose, request a handoff, or leave.
2. **Commitment:** Tasks confirms a task change. Selecting it for Focus changes neither completion nor evidence.
3. **Action:** Focus confirms session lifecycle and records instants. It may run with no task.
4. **Evidence:** Focus and source owners expose what was actually recorded, including attribution availability. Elapsed time is not an outcome.
5. **Sensemaking:** Reflection receives facts as context and stores user interpretation separately. It may be daily, custom, or a linked session-end entry.
6. **Adaptation:** A reflection may propose a change. The person must explicitly choose, and the receiving owner must confirm application. Reflection cannot mutate commitments implicitly.

## Alternative, interruption, and recovery paths

| Path | Allowed behavior | State protection |
|---|---|---|
| Pause | Pause a Focus session, leave an editor, defer a task/Reflection choice, or stop orientation | Last confirmed owner state remains authoritative |
| Defer | Move a task/choice/reflection proposal out of current context | Deferred is not failed, deleted, or applied |
| Decline | Decline an entry, proposal, supporting context, or adaptation | No consequential mutation |
| Correction | Use the canonical owner's correction path | Correction preserves history and does not rewrite another owner |
| Retry | Retry the same pending/failed owner operation | Pending is not success; prior confirmed state remains |
| Departure | Navigate away, close, or leave without completing a stage | No stage is inferred complete |
| Interruption | Re-enter directly at the last owning surface | Restore confirmed state; disclose local/pending/unavailable context |
| Unavailable source | Continue with core stages without support | Unavailable is not empty or negative evidence |

## Handoff rules

- Today -> Tasks: opens the task owner; Today does not write.
- Tasks -> Focus: passes a planned task selection; selecting never completes or attributes the task.
- Focus -> Reflection: passes confirmed session facts and identity; Reflection owns the entry save.
- Reflection -> receiving owner: passes a proposed adaptation; only the receiving owner can apply it after explicit authority.
- Schedule/Habits/Notes -> any core surface: provide optional context; source owners retain writes and provenance.
- Any owner -> Today: return with refreshed or explicitly stale projection; no owner reports success through a projection alone.

## Re-entry contract

At re-entry, the owner must distinguish current, historical, superseded, pending, failed, local-draft, unavailable, and disconnected states. A local draft is recoverable continuity, not a durable save. A pending migration is unavailable behavior, not a partially available feature. Re-entry restores the last confirmed record and offers retry, correction, resume, decline, or leave without forcing the person through the loop again.

## Security and foundation constraints

Every owner boundary resolves `requireUserId()`, uses user-scoped access, and relies on RLS. Forms use shared Zod schemas and React Hook Form with the shared resolver. Calendar checks use `date-fns`; product date keys use `Asia/Singapore`; persisted timestamps are instants. These constraints apply to handoffs and do not turn client state into authority.

## Acceptance questions

- **JOURNEY-01:** Can a person enter directly or deeply at Today, Tasks, Focus, Reflection, or a supporting context without a prescribed funnel?
- **JOURNEY-02:** Does every stage name its contract, canonical owner, person choice, changed state, and unchanged state?
- **JOURNEY-03:** Does the journey preserve planned, factual, interpretive, proposed, applied, and unavailable distinctions?
- **JOURNEY-04:** Does selecting a Task leave it uncompleted, Focus record only session facts, and Reflection avoid implicit commitment mutation?
- **JOURNEY-05:** Can a person pause, defer, decline, correct, retry, or depart at each applicable stage without a negative or fabricated state?
- **JOURNEY-06:** Does re-entry after interruption restore confirmed owner state while disclosing pending, failed, local-draft, stale, unavailable, or disconnected context?
- **JOURNEY-07:** Can the core journey continue when Habits, Schedule, Notes, attribution, or another supporting source is empty or unavailable?
- **JOURNEY-08:** Can a complete seeded path reach an explicit adaptation applied by the receiving owner, while a partial path remains valid without it?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** The six-stage meaning, valid alternatives, handoffs, authority boundaries, and non-funnel behavior are approved for design specification. Design may not add a stage, force a stage, or change an owner.
