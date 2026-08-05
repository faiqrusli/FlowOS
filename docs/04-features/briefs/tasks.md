# Tasks - Feature Brief

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder)
**Sprint tasks:** P1.2, P1.5, P4.5
**Parent systems:** [Product Model](../../01-product/product-model.md) - [Direction and Commitment](../../02-systems/direction-and-commitment.md) - [Action and Evidence](../../02-systems/action-and-evidence.md)
**Journey stage:** Commitment and action choice
**Canonical owner:** Tasks owns explicit person-authorized task commitment mutations, including task-owned Next Up membership/order.
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Tasks behavior contract](../behavior/tasks.md)

## Product decision

Tasks is the practical commitment surface for the MVP. A task records what the person chose to do and its commitment state. It does not prove action, quality, outcome, or adaptation.

## Person need and outcome

The person needs to turn a chosen intention into a clear, revisable commitment, select an action without accidentally completing it, and understand what was planned versus what later occurred. The desired outcome is an explicit task state with recoverable history and an honest Focus handoff.

## Scope

- Create and revise a task commitment.
- Assign/remove bounded context such as Today, group, and task-owned planning values.
- Select a task for Focus without completing it or claiming attribution.
- Explicitly complete, restore, defer, withdraw/remove, duplicate, reorder, and recover task persistence where the owner supports the operation.
- Expose consistent task state in Tasks, Today, Focus entry, and Schedule projections.
- Use shared validation and approved date/time patterns for admitted task forms.

## Resolved P4.5 decisions

- **Removal/history:** routine Remove is a person-authorized withdrawal. The task remains as historical/superseded record context, leaves active lists and Next Up, and is not evidence of completion. Restore is a separate explicit Tasks action where available. A hard deletion is not a normal core-loop action; it is a privacy/retention operation that requires explicit security and delivery rules.
- **Next Up:** task membership and order are owned by Tasks because Next Up is a task-commitment projection. Focus owns the active session and consumes a selected task; it does not own queue membership or order. While `tasks_next_up_queue.sql` is pending/unverified, the queue may be read as a truthful fallback projection, but reorder/persistent queue guarantees are unavailable.

## Non-goals and exclusions

- Completion does not claim successful real-world outcome or universal progress.
- Tasks do not own Focus session lifecycle, Focus attribution totals, reflection interpretation, habit completion, note context, or Schedule as a competing source of truth.
- No autonomous prioritization, project-management expansion, Goals admission, new route, or production migration is implied.

## Success and validation intent

Tasks succeeds when a person can make, revise, choose, complete, defer, withdraw, restore, and recover a commitment while the product preserves history and the planned/factual distinction. The behavior contract defines `TASK-*` questions for later design and validation.

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Scope, removal/history semantics, Next Up ownership, commitment meaning, and the Commitment-stage role are approved for design specification. This approval does not authorize implementation or migration application.

## Change control

Changing task completion meaning, routine removal retention, Next Up ownership, or the Task-to-Focus handoff reopens the brief, behavior contract, record rules, and Gate 2 traceability.
