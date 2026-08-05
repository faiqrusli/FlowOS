# Tasks - Behavior Contract

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder); technical persistence owner is the Tasks domain
**Sprint tasks:** P1.2, P1.5, P4.5, P5.3
**Authorized brief:** [Tasks feature brief](../briefs/tasks.md)
**Parent systems:** [Direction and Commitment](../../02-systems/direction-and-commitment.md) - [Action and Evidence](../../02-systems/action-and-evidence.md) - [Continuity and Interoperability](../../02-systems/continuity-and-interoperability.md)
**Journey stage:** Commitment and action choice
**Canonical owner:** Tasks owns task state, task history, task-owned Next Up membership/order, and task correction. Focus only consumes a selected task for session context.
**Consumers:** `/tasks`, Today, Workplace, task dialog, groups, Schedule, and Focus entry
**Record rules:** [MVP record rules](../record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Scope and non-goals

Tasks owns explicit commitment changes. A task can be selected for action, but selection is planned context, not completion or evidence. Tasks does not own Focus sessions, action outcomes, reflection meaning, habit completion, notes, or autonomous priority.

## Authority and state model

| State | Meaning | What it must not imply |
|---|---|---|
| Local draft | Unsubmitted form values held locally | Durable save |
| Pending | A requested Tasks write has not been confirmed | Saved state or completed operation |
| Open/current | An active commitment available for choice | Action occurred |
| Deferred | The person moved the commitment out of current context | Failure, abandonment, or deletion |
| Completed | The person explicitly closed the commitment | Successful outcome or quality |
| Withdrawn | The person explicitly removed the commitment from active work | Erasure or completion |
| Historical | Retained prior/withdrawn/completed context | Current availability |
| Superseded | Replaced by a later explicit task revision/state | Loss of history |
| Failed | Requested mutation was rejected or could not be confirmed | The requested state happened |
| Unavailable/disconnected | Task source or queue capability cannot be read or verified | Empty data or permission to guess |

## Entry, re-entry, pause, exit, and correction

- **Direct entry:** authenticated person opens Tasks and creates, revises, or inspects a task.
- **Deep entry:** Today, Focus, Schedule, group, or a note context opens the task owner with identity and current status.
- **Re-entry:** after interruption, show the last confirmed task state and any local draft/pending/failed status; do not convert the draft into a saved task.
- **Pause:** leaving an editor or deferring a decision preserves a local draft only when the UI says it is local; it does not change the task.
- **Exit:** save, complete, defer, withdraw, restore, duplicate, select for Focus, retry, or leave. Leaving without confirmation changes nothing.
- **Correction:** Tasks corrects task fields and task state. Correcting a task does not rewrite Focus evidence, reflection interpretation, or historical records.

## Transitions and handoffs

| Person action | Owner/result | Unchanged state |
|---|---|---|
| Create/edit and confirm | Tasks validates and persists a current task | No Focus or evidence record |
| Select for Focus | Passes a planned task identity to Focus | Task remains open/current |
| Mark complete | Tasks records explicit commitment closure | No claim about outcome or Focus |
| Restore | Tasks returns an eligible withdrawn/completed state to current context | Historical event remains visible to owner |
| Defer | Tasks changes planning/commitment context | No action evidence is created |
| Remove | Tasks records withdrawal and excludes active projections | History is not silently erased |
| Add/reorder Next Up | Tasks owns task queue order/membership if capability is available | Focus session state unchanged |
| Retry failed write | Tasks retries the same requested mutation | Old confirmed state remains until success |
| Decline/leave | No task mutation | All confirmed task data remains |

## Removal, deletion, and history

Routine Remove is withdrawal: retain the task record and meaningful state history, exclude it from active Tasks/Today/Next Up, and do not report completion. Restore is explicit and Tasks-owned. Hard deletion is not admitted as a routine core-loop behavior; if privacy/retention requires it, the deletion authority, audit treatment, user confirmation, and recovery limits must be specified outside this contract before delivery. Existing technical delete paths cannot be represented as a product guarantee that history is erased.

## Next Up ownership and fallback

Tasks owns task Next Up membership and order. Focus owns only the currently active session and selected task context. If the pending `tasks_next_up_queue.sql` migration is not applied and verified, the product must label persistent membership/reorder as unavailable. It may show a deterministic projection from confirmed task fields, but it must not claim that a reorder was saved. A selected item remains planned context until Focus records session facts; it never completes the task.

## Persistence, permissions, and validation

- Every Tasks read/write resolves `requireUserId()` and scopes by `user_id` at the server boundary; RLS remains an independent protection. Client identity or route visibility is not authority.
- Task forms use shared Zod schemas and React Hook Form with the shared resolver. Empty/invalid titles, invalid group or date values, and root persistence errors remain visible and recoverable.
- Date-only planning values use `date-fns` for calendar validity and the product timezone `Asia/Singapore` for `YYYY-MM-DD` keys. Persisted timestamps are instants; browser timezone must not alter a stored date key.
- Pending migrations are unavailable behavior until applied and verified. A failed/pending queue write cannot be shown as saved.
- Failed writes preserve the prior confirmed state and provide retry or correction; optimistic display must be marked pending and rolled back if unconfirmed.

## Loading, empty, partial, unavailable, and error behavior

- **Loading:** task list or owner record is requested; controls that would conflict with unknown state are disabled or guarded.
- **Empty:** the source confirms no tasks; offer optional creation without implying deficiency.
- **Partial/stale:** available task records remain usable, while missing groups, schedule values, or queue data are labeled by source and freshness.
- **Unavailable/disconnected:** preserve last confirmed task history and identify the unavailable source/capability; do not treat it as no tasks.
- **Error:** identify the failed operation, preserve input and confirmed state, and offer retry, correction, or safe exit.

## Interruption and recovery

An interrupted create/edit is a local draft unless the owner confirmed durable save. An interrupted completion, withdrawal, defer, restore, or reorder remains pending/failed until Tasks confirms it. Re-entry shows confirmed state plus the unresolved operation. Retrying must be idempotent from the person's perspective and must not duplicate a task or apply a hidden second transition.

## Accessibility

Every destructive or consequential action names its state consequence and has a keyboard-accessible confirmation or cancellation path. Validation and root errors are associated with fields and announced in a live status. Pending, failed, withdrawn, historical, unavailable, and queue limitations are textually available, not color-only. Focus moves to the created/updated task or error without trapping the person, and responsive layouts preserve order, owner, and recovery.

## Acceptance questions

- **TASK-01:** Can a person create and revise a task with Zod/RHF validation and truthful pending/failed recovery?
- **TASK-02:** Does selecting a task for Focus leave task completion and task history unchanged?
- **TASK-03:** Do complete, restore, defer, withdraw, and correction remain distinguishable and owner-confirmed?
- **TASK-04:** Does routine Remove retain history as withdrawal, while hard deletion remains outside normal core-loop behavior?
- **TASK-05:** Does Tasks own task Next Up membership/order, and does the pending migration fallback disclose unavailable persistence?
- **TASK-06:** Are task planning values, Focus facts, and outcomes kept distinct across Tasks, Today, Schedule, and Focus?
- **TASK-07:** Do direct/deep entry, pause, leave, retry, re-entry, permission failure, empty, partial, stale, unavailable, disconnected, and error paths preserve confirmed truth?
- **TASK-08:** Are `requireUserId`, RLS, date-fns, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration limits testable?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** The contract is ready for design specification. Design may express consequences and states but may not alter ownership, removal semantics, queue ownership, or the Task-to-Focus rule.
