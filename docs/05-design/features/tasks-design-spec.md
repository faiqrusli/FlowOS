# Tasks - Design Specification

**Status:** Design Architect complete; checkpoint and cross-surface review completed 2026-08-05; Gate 2 PASSED; Phase 3 authorized
**Owner:** Design Architect
**Authorized behavior contract:** [Tasks behavior contract](../../04-features/behavior/tasks.md)
**Authorized brief:** [Tasks feature brief](../../04-features/briefs/tasks.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) - Commitment and action choice
**Affected destinations:** [Information Structure](../../03-experience/information-structure.md) - Tasks, Today projections, Focus selection, Schedule planning context, groups, and task detail
**Reusable standards:** [Design System Architecture](../design-system-architecture.md), [Design System v3](../DESIGN_SYSTEM_V3.md), [Tokyo Night Warm](../DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md), [Content Standards](../content-standards.md), [Accessibility Standards](../accessibility-standards.md), [Design Implementation Map](../design-implementation-map.md)
**Design exceptions:** None
**Validation plan:** [Validation plan standard](../../04-features/validation-plans.md) and the `TASK-*` acceptance questions below; a feature-specific delivery validation plan is a downstream Engineering Architect artifact.
**Review trigger:** Any change to task ownership, state meaning, Next Up ownership, removal/history, task-to-Focus handoff, or the task editor’s recovery model.

## Identity and status

This document is the feature-specific design authority for the approved Tasks behavior during Phase 2. Its status, owner, parents, affected destinations, reusable standards, exceptions, and validation reference are recorded in the metadata above.

## Authorized behavior and scope

Tasks inherits its brief, behavior contract, record rules, supporting-domain decisions, and journey contract. This specification defines the expression of explicit commitment changes. It does not make Tasks an action-evidence owner, outcome evaluator, autonomous priority system, project-management expansion, Goals surface, or competing Schedule source.

Routine Remove means withdrawal, not hard deletion and not completion. Next Up membership/order belongs to Tasks. Focus receives a selected task as planned context and does not complete or attribute it by selection.

## Experience intent

Make a commitment legible, revisable, and recoverable. A person should be able to see what is current, planned, deferred, completed, withdrawn, historical, or unavailable; understand the consequence before acting; and return after interruption without confusing a local draft, pending write, or failed write with a saved task.

## Information hierarchy and access

### Tasks destination

The authenticated Tasks destination is a direct Workspace peer. Its main reading order is:

1. `Tasks` page heading and the current collection/planning context.
2. Collection status: loading, empty, ready, partial/stale, unavailable, disconnected, or error.
3. Current/open commitments and their task-owned context, including group/collection placement and planning values where confirmed.
4. Next Up context, clearly labeled as task-owned membership/order. If persistent queue behavior is unavailable, the limitation appears beside the queue controls.
5. Task detail/editor context for the selected task, with state, source owner, and available consequence before controls.
6. Historical, completed, deferred, withdrawn, or superseded context only when the person enters or inspects that context; it must not be visually presented as current.

The page may use the existing board/list and planning arrangements, but all representations share the same task identity and owner. A layout arrangement is not a second task state.

### Task item anatomy

Every task representation exposes, in reading order:

- task identity/title;
- current task state, distinct from action evidence;
- task-owned group or collection context where present;
- task-owned planning values such as date/time where present, labeled as planned;
- Next Up membership/order status where present or unavailable;
- the available owner action(s); and
- pending, failed, rollback, stale, or unavailable information when material.

The detail/editor is the owning context for correction. Today, Focus, Schedule, and other projections link back to this identity; they do not create competing editors.

### Entry and deep entry

Direct entry opens the task collection or create flow. Deep entry from Today, Focus, Schedule, a group, or note context opens the owning task with identity and confirmed state. The task context must be understandable without first visiting Today.

## State and semantic expression

### Default, loading, empty, partial, stale, and unavailable states

| State | Normative expression | Available action and constraint |
|---|---|---|
| Default / ready | Show current/open tasks with state and owner context. A selected task may be inspected or edited without implying action. | Create, revise, select for Focus, complete, defer, withdraw, restore, duplicate, order, or leave according to the confirmed task state and available capability. |
| Loading | Preserve the Tasks heading and stable collection/editor landmarks. Use neutral placeholders and a semantic loading status. | Disable or guard controls that would conflict with unknown task state. Safe navigation remains available. |
| Empty | State that Tasks confirmed no tasks in the current bounded view. Offer optional creation without implying deficiency or a required routine. | Create or leave. Do not infer that no tasks means no commitments or no action. |
| Partial | Keep confirmed tasks usable and label missing groups, planning values, queue data, or other source context at the affected region. | Open the owner, retry the affected read, or continue with confirmed task context. Do not guess missing state. |
| Stale | Show last-confirmed task state with freshness/history language when the current source cannot be refreshed within its boundary. | Retry or inspect the owner. Do not present stale task state as current. |
| Unavailable | Identify the inaccessible task source or capability. Preserve known history and input where safe. | Retry, reauthenticate, or leave. Unavailable is not empty and does not authorize guessing. |
| Disconnected | Preserve prior task record/history and disclose that a related source or relationship ended. | Inspect the task owner or leave. Do not silently erase the task or relationship. |
| Error | Identify whether collection read, task read, validation, or owner write failed. Preserve confirmed state and input. | Retry the same request, correct input, or leave safely. |

### Task state and consequence expression

| Contract state | Visual/content treatment | Must not imply |
|---|---|---|
| Local draft | Editor values are visibly local and recoverable; show `Local draft` near the editor, not as a task-card status. | Durable save or current task state. |
| Pending | Keep the requested task identity and operation visible with `Pending confirmation`. | Saved, completed, withdrawn, or reordered state. |
| Open/current | Normal current task treatment with task owner and available choice. | Action occurred or outcome was achieved. |
| Deferred | Explicit `Deferred` label with the applicable task context. | Failure, abandonment, deletion, or completion. |
| Completed | Explicit commitment closure label and history access. | Successful outcome, quality, or Focus evidence. |
| Withdrawn | Explicit `Withdrawn` label and retained history/restore path where available. | Erasure or completion. |
| Historical | Lower-prominence but readable historical treatment with time/relation. | Current availability. |
| Superseded | Show the later explicit representation and relationship to prior history. | Loss of history or an implicit rewrite. |
| Failed | State the requested operation was not confirmed; keep last confirmed task state authoritative. | The requested state happened. |
| Queue unavailable | Label Next Up membership/order as unavailable or fallback projection. | A reorder or membership change was saved. |

### Pending, confirmed success, failed, and rollback states

Every owner mutation uses the same state treatment. This includes create/edit, complete, restore, defer, withdraw, duplicate, planning-field change, and Next Up membership/order when available.

| Operation state | Normative expression | Recovery |
|---|---|---|
| Pending | Keep the task in its last confirmed state and mark the requested operation as pending. For a new task, preserve the local draft and identify that a task is not yet durable. | Wait, retry the same request, correct, or leave according to the operation. |
| Owner-confirmed success | Show the resulting task state, identify the owner-confirmed operation, and place focus on the changed task or its status. | Continue, inspect history, open Focus as planned context, or leave. Success is limited to the task mutation. |
| Failed | Preserve the prior confirmed task state and editor input. Name the failed operation and show retry/correction. | Retry the same operation or correct/leave. Do not clear recoverable values. |
| Rollback / unconfirmed optimistic state | Restore the prior confirmed card/row, queue membership/order, group, or planning value. Remove any optimistic success styling and expose the failure/pending reason. | Retry or correct at Tasks. A rollback does not mean the opposite domain mutation occurred. |
| Unavailable capability | Keep the task state confirmed and disable only the unavailable capability with explanation, such as persistent Next Up reorder. | Continue with available task actions or leave. |

No transient toast is the only evidence of a material operation. The changed task and its persistent state line remain inspectable.

## Interaction and decision behavior

- Create/edit controls open the Tasks-owned form. The person sees the consequence and validation requirements before confirmation.
- Complete is distinct from Select for Focus, Defer, Remove/Withdraw, and Restore. Labels and confirmation copy name the different outcomes.
- Remove uses withdrawal language and explains that task history is retained. Hard deletion is not offered as routine core-loop behavior.
- Restore is available only where the confirmed task state permits it and returns the task to current context through an explicit Tasks action.
- Select for Focus passes planned task identity to Focus. The selection control does not complete, attribute, or create action evidence.
- Next Up add/reorder/remove controls identify Tasks as owner. If `tasks_next_up_queue.sql` is pending or unverified, the control exposes unavailable persistence and cannot claim saved order.
- Drag-and-drop is an interaction enhancement for task/group/order operations. The same operation has an explicit keyboard-operable control; a drag preview is never the only state feedback.
- Planning controls identify date/time as task-owned planning values. Schedule is a context surface and does not become a competing source.
- Duplicate creates a distinct task only after Tasks confirmation; the new identity is clearly separate from the source task.
- Leave, cancel, defer, decline, and close without confirmation do not mutate confirmed task data.

### Interruption and re-entry

An interrupted create/edit is a local draft only when the UI identifies it as local. An interrupted complete, restore, defer, withdrawal, duplicate, planning update, or reorder remains pending/failed until Tasks confirms it. Re-entry shows:

1. the last confirmed task state;
2. the local draft, pending operation, or failed operation, if present;
3. whether a queue or related planning capability is unavailable; and
4. explicit choices to retry, correct, discard a local draft, resume editing, or leave as permitted by the operation.

Retry must be safe from the person’s perspective and must not duplicate a task or apply a hidden second transition. Re-entry from Focus preserves task state; a session selection does not alter task completion/history. Re-entry from Today or Schedule converges on the same Tasks owner.

### Ownership, provenance, uncertainty, and recovery

| Context | Canonical owner/provenance | Design treatment |
|---|---|---|
| Task commitment/state/history | Tasks; owner-confirmed direct record | Show the task identity and current/historical relationship. |
| Selection for Focus | Focus receives Tasks-provided planned/user-selected context | Label as planned/selected; never as completed or attributed. |
| Next Up membership/order | Tasks; task-owned capability | Keep membership/order controls and confirmation in Tasks. Mark unavailable while the queue migration is pending/unverified. |
| Planning date/time | Tasks source record; planned | Show planned language and product date context; do not call it evidence. |
| Schedule projection | Schedule read context referencing Tasks | Preserve task identity and route changes back to Tasks. |
| Derived grouping/status | Identified derived read model | Mark as derived and do not treat it as a writable task fact. |
| Local draft | Client continuity | Show local and recoverable; never show saved/current. |
| Pending/failed | Requested operation without confirmed owner result | Keep last confirmed state authoritative and provide recovery. |
| Unavailable/disconnected | Source/capability/relationship cannot be verified | Preserve known history, identify the limitation, and do not replace it with empty or inferred state. |

Every owner boundary remains subject to `requireUserId()`, user-scoped access, RLS, shared Zod/RHF validation, `date-fns`, `Asia/Singapore` date keys, instant timestamps, and truthful pending-migration treatment. These are delivery constraints expressed for design handoff, not implementation instructions in this document.

## Content and communication

### Content and status language

| Meaning | Preferred expression | Avoid |
|---|---|---|
| Commitment | `Task`, `Open`, `Current commitment` | `Outcome`, `Proof`, or `Progress` unless an authorized source supplies that meaning |
| Selection | `Select for Focus`, `Planned context` | `Start task`, `Worked on`, or `Complete` |
| Complete | `Mark complete` / `Completed` | `Successful`, `Achieved`, or `Good work` |
| Defer | `Defer` / `Deferred` | `Failed`, `Skipped forever`, or blame |
| Remove | `Remove` with explanatory `This withdraws the task from active work and keeps its history.` | `Delete` for routine withdrawal |
| Next Up | `Add to Next Up`, `In Next Up`, `Next Up order` | `Priority` when only membership/order is known |
| Draft | `Local draft - not saved` | `Saved draft` unless owner confirmed a durable record |
| Pending | `Saving [operation] - awaiting confirmation` | `Done` or `Saved` before confirmation |
| Failed | `[Operation] was not confirmed. Your last confirmed task is unchanged.` | Clearing the task or blaming the person |
| Unavailable | `Next Up order is unavailable until the queue source is verified.` | `Queue empty` or a guessed order |
| Planning | `Planned for [date/time]` | `Happened at [date/time]` |

Validation copy is field-associated and concrete. Empty copy offers an optional action and does not moralize the absence of tasks. Dates use `Asia/Singapore` product date keys; persisted timestamps are instants.

## Responsive and adaptive behavior

| Condition | Expression |
|---|---|
| Desktop / wide | Keep the existing task collection canvas and detail/planning regions as peers in the workspace hierarchy. Current tasks, state, owner actions, and recovery remain visible without hover. A planning region may be attached as context, not as a new source owner. |
| Tablet / medium | Collapse secondary detail/planning regions into an ordered flow or drawer while preserving selected task identity, state, and recovery. Do not hide a pending/failed/withdrawal consequence behind an unlabeled icon. |
| Mobile / narrow | Use a single task-list reading order with the selected task editor or detail view following the task identity. Group, planning, Next Up, and owner actions remain reachable; secondary history/provenance may be disclosed explicitly. |
| Pointer / touch | Drag previews and drop zones are visually clear, but every drag operation has a non-drag alternative. Touch targets separate destructive and non-destructive actions. |
| Slow/interrupted connection | Keep local draft and last confirmed task visible. Pending or unavailable queue state is labeled; a skeleton never replaces known state with apparent emptiness. |
| Reduced motion | Avoid relying on card movement, drag animation, or optimistic motion to communicate a task state. State text and focus remain clear. |

## Accessibility requirements

### Keyboard and focus behavior

- Provide a skip link to the Tasks main content and preserve global navigation order.
- The DOM order is heading, collection status, current task collection, selected task/detail context, planning/Next Up context, and history/recovery actions.
- Task cards/rows expose native links/buttons with names that include the task title or context. The title itself is not the only route to the editor if an action is available.
- Keyboard users can create/edit, complete, defer, withdraw, restore, duplicate, select for Focus, change planning values, and use Next Up controls through explicit controls. Drag is never keyboard-only absent.
- Confirmation dialogs for withdrawal or other consequential operations trap focus only while open, return focus to the invoking control on cancel, and move focus to the changed task/status on confirmed success.
- Form errors move focus to the first invalid field or an error summary; root persistence errors are announced without discarding input.
- After a failed mutation, focus returns to the operation status/retry control. After rollback, the restored task remains identifiable.
- Pending writes do not steal focus. Hover, color, or drag position is not required to understand state.

### Screen-reader semantics

- Use one `main` landmark headed `Tasks`. Identify the task collection and selected task/detail as labeled sections.
- Expose task title, state, planned date/time, group, Next Up membership/order, owner, and pending/failed/unavailable status as semantic text.
- If the collection is list-like, expose list/listitem semantics; if the existing board uses columns, each column has a heading and its tasks remain navigable without spatial assumptions. Do not expose a visual board as the only relationship.
- Drag-and-drop offers an announced alternative such as `Move task to group` or `Change Next Up order`; drop success/failure uses a concise status region.
- Validation errors are associated with fields and summarized in a live region. Withdrawal, completion, restore, and other consequential actions announce their confirmed result and unchanged boundaries.
- Loading uses a polite status, not repeated announcements. Errors use an actionable alert only when immediate attention is needed.
- Dialogs have an accessible name, consequence text, cancel control, and predictable focus restoration.

## Reusable standards and exceptions

- Use the active Surface 0–10 ladder: shell Surface 0, workspace Surface 1, task/planning canvases Surface 3, task cards/rows Surface 4, inputs and selects Surface 5, hover Surface 6, selected/active cards and floating controls Surface 7, and dialogs Surface 9.
- Use Tokyo Night Warm and Soft Indigo for active/interactive treatment. Semantic green/amber/red/cyan communicate success, warning, danger, and information in addition to text; color never carries state alone.
- Prefer borderless task cards and tonal hierarchy. Reserve control/focus/drop-target borders for interaction or accessibility.
- Reuse existing task row/card, group, detail, schedule picker, disclosure, dialog, status, skeleton, and drag-preview patterns. Repeated exceptions require a reusable standard review.
- Critical actions are visible without hover. Destructive/withdrawal actions are visually distinct but not sensationalized.
- Use the existing typography, spacing, radius, focus-ring, motion, and reduced-motion patterns. Do not add a Tasks-only palette, token, or component API.

## Annotated artifacts

### Normative task-surface wireframe

```text
Application shell / global navigation
└── main [Tasks]
    ├── h1 Tasks + current collection/planning context
    ├── collection status [loading | empty | ready | partial | stale | unavailable | error]
    ├── current task collection
    │   ├── task identity/state/planned context
    │   ├── task-owned actions
    │   └── pending/failed/rollback status
    ├── Next Up [Tasks-owned]
    │   └── membership/order or unavailable capability disclosure
    ├── selected task detail/editor [Tasks-owned]
    │   └── field validation + durable save/recovery status
    └── historical/withdrawn/completed context when explicitly inspected
```

The wireframe establishes hierarchy, ownership, and state visibility. It does not prescribe component internals or a new board/list route.

## Handoff, validation, and open questions

### Delivery constraints

- Preserve one Tasks write owner for task state, task history, task correction, planning values, and Next Up membership/order.
- Preserve the difference between completion, withdrawal, defer, restore, duplicate, correction, selection, and ordering.
- Preserve local-draft, pending, failed, rollback, unavailable, and disconnected states through interruption and re-entry.
- Preserve `requireUserId()`, user-scoped queries/RLS, shared Zod/RHF validation, `date-fns`, `Asia/Singapore`, instant timestamps, and pending `tasks_next_up_queue.sql` truth.

### Validation questions

- **TASK-01:** Can a person create and revise a task with Zod/RHF validation and truthful pending/failed recovery?
- **TASK-02:** Does selecting a task for Focus leave task completion and task history unchanged?
- **TASK-03:** Do complete, restore, defer, withdraw, and correction remain distinguishable and owner-confirmed?
- **TASK-04:** Does routine Remove retain history as withdrawal, while hard deletion remains outside normal core-loop behavior?
- **TASK-05:** Does Tasks own task Next Up membership/order, and does the pending migration fallback disclose unavailable persistence?
- **TASK-06:** Are task planning values, Focus facts, and outcomes kept distinct across Tasks, Today, Schedule, and Focus?
- **TASK-07:** Do direct/deep entry, pause, leave, retry, re-entry, permission failure, empty, partial, stale, unavailable, disconnected, error, pending, success, failed, and rollback paths preserve confirmed truth?
- **TASK-08:** Are `requireUserId`, RLS, `date-fns`, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration limits testable?

### Design Architect checkpoint

Completed 2026-08-05. The specification was checked against the Tasks brief, behavior contract, journey contract, information structure, record rules, supporting-domain decisions, reusable standards, and all `TASK-*` questions. No new behavior, owner, route, source, removal meaning, queue guarantee, or Task-to-Focus meaning was introduced.

### Open questions

No product or design decision is unresolved for this specification. Engineering must confirm implementation details and validation evidence in the next hat; the pending queue migration remains an unavailable capability until applied and verified.

## Change control

Changes to task state meaning, routine removal/history, Next Up ownership, planning-source ownership, or the Task-to-Focus handoff reopen the Tasks brief/behavior contract, record rules, and cross-surface journey review. Visual or content refinements that preserve those contracts follow the feature-specification review path.
