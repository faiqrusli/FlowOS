# Tasks Core-Loop Delivery Design

**Status:** `DRAFT` — ready for Founder scope/design checkpoint
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Authorized behavior contract:** [Tasks behavior contract](../behavior/tasks.md)
**Authorized brief:** [Tasks feature brief](../briefs/tasks.md)
**Design specification:** [Tasks design specification](../../05-design/features/tasks-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) — Commitment and Action
**Record rules:** [MVP record rules](../record-rules.md)
**Affected engineering domains:** Tasks owner UI/service | Focus handoff | Schedule/Today projections | validation | security | date/time | operations
**Risk level:** `High`
**Migration required:** `No` for the core lifecycle; `Conditional` for persistent Next Up behavior
**Rollout class:** `Direct` and reversible; migration-first behavior remains unavailable until verified
**Rollback owner:** Founder / Implementation Engineer; revert code while preserving confirmed task history
**Validation plan:** [Tasks core-loop validation plan](../validation/tasks-core-loop.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to task ownership, completion/removal meaning, Next Up authority, Task-to-Focus selection, validation, or recovery semantics.

> This design is complete for checkpoint review. It authorizes neither implementation nor migration application until the Founder records the checkpoint decision.

## Authorized behavior

Tasks is the canonical owner of explicit task commitment changes and task-owned Next Up membership/order. A task is commitment/planning context, not proof of action, quality, outcome, or adaptation. Selecting a task for Focus is planned context and must not complete or otherwise mutate the task.

The delivery must support `TASK-01` through `TASK-08`, preserve retained history for routine withdrawal, and keep hard deletion outside normal core-loop behavior.

## Delivery objective and constraints

Deliver a user-scoped Tasks owner path for create, clarify/revise, select, start, complete, restore, defer, withdraw, and correction/recovery. Every requested mutation must remain pending until the owner confirms it and failed writes must leave the last confirmed state authoritative.

Non-negotiable constraints:

- Resolve `requireUserId()` at every owner boundary and rely on RLS; client filtering is not authorization.
- Use shared Zod/RHF validation where a form boundary exists; server validation remains authoritative.
- Use `date-fns` and `Asia/Singapore` for date keys; persisted timestamps remain instants.
- Treat `tasks_next_up_queue.sql` as unavailable until it is applied and verified. Repository SQL is not live-state evidence.
- Preserve planned, current, historical, pending, failed, local-draft, withdrawn, and unavailable meanings.
- No autonomous prioritization, new task source, task-owned Focus session, universal score, or cross-owner mutation.

## Affected boundaries

| Boundary | Delivery effect | Ownership constraint |
|---|---|---|
| Tasks route/components | Implement owner controls and explicit state/recovery presentation | Tasks owns task mutations only |
| Task data access | Centralize user-scoped reads/writes and confirmed-state handling | No service-role or unscoped browser access |
| Focus handoff | Pass selected task identity as planned context | Focus owns session facts; selection does not complete/attribute |
| Today/Schedule projections | Consume source-confirmed task state and route changes to Tasks | Projections do not write or become competing owners |
| Next Up | Detect verified queue capability and expose truthful fallback | No reorder/persistence claim while migration is pending |
| Validation and operations | Add lifecycle, recovery, security, accessibility, and date-boundary evidence | Gate 3/Gate 4 remain separate decisions |

## Proposed approach

1. Inventory the current Tasks owner paths and retain existing route conventions where they satisfy the contract.
2. Add or normalize a typed task operation/state envelope so pending, confirmed, failed, withdrawn, and unavailable states cannot be collapsed into a boolean success path.
3. Put creation and revision behind the shared validation pattern. Preserve local draft values on interruption without calling them saved.
4. Implement explicit lifecycle actions: complete, restore, defer, withdraw, and correction. Routine Remove records withdrawal/history; it is not hard deletion or completion.
5. Pass Task identity to Focus through the existing deep-entry convention. Verify with an unchanged-state assertion that selection does not write task completion/history.
6. Gate Next Up reorder/membership behavior on live migration verification. Before that point, show the bounded fallback and its limitation.
7. Expose owner, provenance, date/freshness, and recovery copy in the accessible tree, not only through color or hover.

## Data and state transition design

No new task concept is introduced. Existing task records remain the source of truth. A requested operation is `pending` until owner confirmation; a rejected operation is `failed` and does not replace the prior confirmed record. Withdrawal retains history and removes the task from active/current projections. Correction creates the owner-approved corrected representation without rewriting Focus, Reflection, or evidence records.

Task selection is a planned/user-provided handoff value. It changes neither task completion nor task history. Next Up membership/order remains task-owned; if capability cannot be verified, the UI must represent it as unavailable rather than infer persistence from a local list or SQL file.

## Authority, security, privacy, and trust

- User identity is resolved server-side and every query is user-scoped; RLS is independently verified with two accounts before final release evidence.
- IDs, dates, status transitions, and free text are runtime validated. Error copy is safe and does not expose raw database/auth details.
- A task's completion, withdrawal, or correction is factual only within the task record's scope; it is never presented as a universal outcome.
- Cross-surface controls open the canonical owner and carry identity/provenance without transferring write authority.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Focus | Receives optional selected task identity as planned context | Keep task unchanged; show attribution unavailable when the migration is unverified |
| Today | Reads confirmed current task context | Source error/stale/unavailable is disclosed; Today never writes |
| Schedule | Reads task planning context | Planning remains non-evidence; task owner receives corrections |
| Next Up migration | Enables persistent membership/order | Keep capability unavailable until apply and live verification |
| Auth/RLS | Authorizes the current user's task scope | Access failure is unavailable/access-required, not empty |

## Reliability and recovery

The owner preserves the last confirmed task state across navigation, refresh, network loss, permission changes, and failed writes. Retry repeats the same owner operation only when safe; it does not duplicate a confirmed transition. Re-entry distinguishes local draft, pending, failed, current, historical, withdrawn, and unavailable states. Conflicts or stale responses must not overwrite a newer confirmed state.

## Observability and operational readiness

Automated and manual evidence must identify the operation, task identity, user scope, date key, prior confirmed state, requested state, and disposition without logging task content unnecessarily. A failed or unavailable owner operation must be diagnosable from safe state labels and recovery controls. No new analytics or user profiling is required.

## Rollout and rollback

Implement behind the existing Tasks surface with no production migration application in this package. A release is rollback-triggered by unauthorized writes, lost history, inferred completion/attribution, cross-account access, or an inaccessible recovery path. Code rollback must not rewrite confirmed task records. Applying or verifying `tasks_next_up_queue.sql` is a separate Founder-authorized migration step with its own evidence.

## Validation and open decisions

The linked validation plan maps all `TASK-*` questions to automated, interaction, manual, accessibility, security, timezone, and recovery evidence. Before implementation begins, the Founder must approve this design and its validation plan. Any discovery that changes task ownership, removal meaning, Next Up authority, or the Focus handoff reopens the parent contract and D-008 traceability.

## Change control

Changes to task meaning, owner, queue capability, deletion/withdrawal treatment, or cross-surface authority require review of the Tasks brief, behavior contract, design specification, record rules, sprint, and Gate 3 checklist. Technical refinements that preserve those boundaries update this design and its validation plan together.
