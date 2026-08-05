# Tasks — Behavior Contract

**Status:** Draft
**Owner:** Product Architect + Engineering Architect
**Sprint tasks:** P1.2, P1.5, P4.5, P5.3
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Authorized feature brief:** [Tasks feature brief](../briefs/tasks.md)
**Participating systems:** [Direction and Commitment](../../02-systems/direction-and-commitment.md) · [Action and Evidence](../../02-systems/action-and-evidence.md) · [Continuity and Interoperability](../../02-systems/continuity-and-interoperability.md)
**Affected destinations:** `/tasks`, Today task projections, Workplace task board, task dialog, groups, and Focus entry
**Journey:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Validation plan:** [Validation plan standard](../validation-plans.md) — feature plan required before delivery
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Behavioral authority:** Tasks owns explicit person-authorized commitment changes and exposes their state without claiming action outcome.

## Authorized feature boundary

Tasks is the MVP owner for practical commitments. It may expose contextual planning and a Focus handoff. It does not own focus-session evidence, reflection interpretation, schedule projections, or autonomous prioritization.

## Participants and authority

| Participant | May do | Owning authority |
|---|---|---|
| Person | Create, revise, select, complete, restore, defer, withdraw/delete, duplicate, schedule, and reorder within available controls | Tasks authorizes task-state changes |
| Today/Focus/Schedule | Show or request a task-context handoff | No task-state write without Tasks owner |
| Tasks | Validate, persist, report, and recover task changes | `tasks`/`task_groups` domain paths and user-scoped access |

## Objects and observable states

| State | Meaning | Must not imply |
|---|---|---|
| Draft/pending | The person has entered or requested a change not yet confirmed durable | That the change is saved |
| Open | A current task/commitment remains available for choice or action | That action occurred |
| Completed | The person has explicitly marked the commitment sufficiently met/closed | A successful real-world outcome or universal progress |
| Deferred | The person chose to move the commitment out of the current context | Failure or abandonment |
| Withdrawn/removed | The person chose not to continue or requested removal | Silent erasure of relevant history |
| Failed/rollback | A requested persistence change did not become durable | That the requested state is current |

Task identity, group membership, planning values, and any Next Up/Focus attribution remain distinct records or projections according to the record-rules document.

## Entry conditions and access

- Valid entry is `/tasks`, Today, Workplace, quick capture, group context, planning controls, or Focus selection.
- A deep entry must expose task identity and current status before a consequential action.
- Authenticated access and user-scoped reads/writes are required.
- A person may leave, defer, or cancel without completing a task.

## Behavior rules

1. Given a valid authenticated person submits a task form, when shared validation accepts the input, FlowOS must persist the task through the Tasks owner and show pending then confirmed state.
2. Given validation rejects input, FlowOS must identify the invalid field or root issue, preserve safe input where possible, and not issue a write.
3. Given an open task, when the person completes, defers, restores, or withdraws it, FlowOS must show the explicit resulting commitment state and preserve the distinction from action occurrence.
4. Given a task is selected for Focus, FlowOS must pass identity and current status to Focus; selection must not complete, reprioritize, or alter the task by itself.
5. Given a task is scheduled or placed in Today/Later/group context, FlowOS must label that as planning context and use the approved date-only/wall-clock validation rules.
6. Given a board or ordering write fails, FlowOS must roll back or mark the projection unconfirmed, explain what is durable, and provide retry/reload recovery.
7. Given a person requests a destructive removal, FlowOS must make scope and consequence clear before confirmation and must not call removal completion.
8. Given a task is displayed on Today or Focus, those projections must reflect the owner’s latest confirmed state or disclose stale/unavailable state.

## Decision and transition table

| Choice | From | Result | What must not happen |
|---|---|---|---|
| Create/revise | Draft/Open | Tasks record becomes Open after confirmed save | No implied action evidence |
| Complete | Open | Commitment becomes Completed | No automatic outcome or Focus conclusion |
| Defer | Open | Commitment becomes Deferred with context retained | No moralized failure state |
| Restore/reopen | Completed/Deferred | Commitment returns to an explicit active/open state | History is not silently erased |
| Select for Focus | Open | Focus receives task identity | Task status remains unchanged |
| Save failure | Any pending write | Failed/rollback with retry | UI must not claim durable success |

## Truth, provenance, and uncertainty

Task input is user-provided commitment context. A scheduled date/time is planned context. Completion is an explicit commitment-state claim. Focus records and other evidence may relate to the task but do not become task completion automatically. User identity and source ownership must remain visible across projections.

## Assistance and automation

No autonomous task creation, completion, prioritization, or deferral is admitted. Any future suggestion must be labeled as a recommendation and require person action under Intelligence and Trust rules.

## Error, interruption, and recovery

- Invalid form values remain editable and are not written.
- Pending writes are visible and controls are scoped to the active save.
- Failed persistence must preserve safe local input or recover via retry/reload without fabricating a state.
- Duplicate submission must not create an unintended duplicate; the implementation validation plan must verify idempotent user experience.
- Permission loss must stop the write and disclose that the requested change was not applied.

## Accessibility and inclusive behavior

Every task state and validation error must be available in semantic text with associated controls. Dialog focus, error association, keyboard ordering, drag/reorder alternatives, and pending/failed announcements must remain understandable without pointer, color, or timing alone. Destructive actions require accessible consequence and recovery language.

## Acceptance behavior and open questions

- **TASK-01:** Person-authorized create/revise/complete/defer/restore actions show confirmed state or truthful failure.
- **TASK-02:** Completion and scheduling remain distinct from action occurrence and outcome.
- **TASK-03:** Focus selection does not mutate commitment state.
- **TASK-04:** Invalid input is rejected at the form and persistence boundary using Phase 1.5 validation patterns.
- **TASK-05:** Board/order failures recover without losing confirmed task identity or claiming an unconfirmed write.
- **TASK-06:** Tasks are consistent across `/tasks`, Today, Workplace, and Focus handoff.

P4.5 owns the remaining record-rule decisions: retention/history treatment for removal, canonical ownership of Next Up, and task-attribution behavior while the recorded migration is unapplied.

## Change control

Revise this contract if task semantics become project management, autonomous planning is admitted, or task completion is redefined as evidence/outcome. Such changes require parent-system and decision-record review.
