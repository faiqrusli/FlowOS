# Supporting Domain Decisions - MVP Contracting

**Status:** Product Architect complete; approved by Founder on 2026-08-05
**Owner:** Product Architect (Founder)
**Sprint tasks:** P3.1-P3.4, P4.1, P5.6
**Parent:** [MVP coherent loop](../03-experience/journeys/mvp-coherent-loop.md) - [MVP masterplan](../current-phase/mvp-implementation-masterplan.md)
**Record authority:** [MVP record rules](./record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Decision summary

Habits, Schedule, and Notes are optional supporting context. They remain bounded so the core journey works without them. No supporting domain is a second loop, a new MVP admission, or a blocker to Orientation, Commitment, Action, Evidence, Sensemaking, or Adaptation.

## Minimum behavior and ownership

| Domain | Retain for MVP | Canonical write owner | Explicitly exclude |
|---|---|---|---|
| Habits | Daily visibility and explicit completion only | Habits (`habits`, `habit_completions`) | Analytics, coaching, moral scoring, expanded scheduling, second loop |
| Schedule | Planning context and source-owned task/habit placement context | Task or Habit source record; Schedule is a read/planning context surface | Schedule as evidence, competing source of truth, new planning model |
| Notes | User-owned context for choice/reflection; Growth Areas remain embedded | Notes and embedded growth-area records | Standalone Knowledge, standalone Growth Areas, automatic meaning or commitment |

## Domain rules

### Habits

Today may show whether a recurring action is visible for the Asia/Singapore day. Only an explicit person action can create or change a completion. A completion is user-provided evidence about that habit occurrence; it is not a score, outcome, or substitute for task/action evidence. Empty habits are normal.

### Schedule

Schedule provides calendar/planning context. A task or habit remains the source of truth for identity, state, completion, and correction. A planning move may be offered from Schedule only when it routes to the Task/Habit owner. Scheduled time is planned state, not factual action. If overlapping surfaces disagree, the source owner and its confirmed state win; Schedule shows the conflict or limitation rather than silently choosing.

### Notes and embedded Growth Areas

Notes are user-owned context that can inform choice or reflection. A note, link, or embedded Growth Area does not become a task, evidence, interpretation, or adaptation automatically. Growth Areas remain embedded in the existing Notes/context boundary and are not a standalone destination in this MVP.

## Optionality and failure behavior

| State | Habits | Schedule | Notes |
|---|---|---|---|
| Empty | Show no recurring actions; core loop continues | Show no planning context; task/habit views continue | Show no related context; person may continue |
| Loading | Identify that daily visibility is pending | Identify planning read is pending | Identify context read is pending |
| Partial/stale | Show known habit state with date/freshness | Show known plan with source/freshness and conflict if needed | Show known note/context with source/freshness |
| Unavailable | Core loop remains usable; do not infer non-completion | Core loop remains usable; do not infer unscheduled work | Core loop remains usable; do not infer absent context |
| Disconnected | Preserve historical habit records and disclose source break | Preserve historical plan and disclose source break | Preserve prior note/context and disclose link break |
| Error | Retry or leave; no core blocker | Retry or route to source owner; no core blocker | Retry or leave; no core blocker |

Supporting state must be represented as empty, stale, unavailable, or disconnected rather than silently omitted when the difference could affect a person's choice.

## Cross-surface ownership

- Today composes supporting context and owns no supporting mutation.
- Tasks owns task commitment/planning fields and task Next Up order.
- Focus owns session lifecycle and does not convert supporting context into evidence or completion.
- Reflection owns reflection records and may reference, but not mutate, supporting context.
- Habits owns habit definitions/completions.
- Schedule owns no competing task/habit record; it routes source changes.
- Notes owns notes and embedded Growth Area context.
- Derived summaries retain source references and are not writable facts.

## Interruption, re-entry, and permissions

Re-entry restores the last confirmed supporting state and identifies local/pending/failed/unavailable context. A local draft is never a durable source record. All source reads/writes resolve `requireUserId()`, use user-scoped access, and rely on RLS. Forms use shared Zod and React Hook Form boundaries; `date-fns` validates calendar values; date keys use `Asia/Singapore`; persisted timestamps are instants. Pending migrations remain unavailable until applied and verified.

## Acceptance questions

- **SUPPORT-01:** Does the core journey remain usable when Habits, Schedule, and Notes are empty, unavailable, stale, or disconnected?
- **SUPPORT-02:** Do supporting records retain their canonical owner and provenance across Today, Tasks, Focus, Reflection, and Schedule?
- **SUPPORT-03:** Does Schedule remain planning context while Tasks and Habits remain the sources of truth for state, completion, and correction?
- **SUPPORT-04:** Is Habit behavior limited to daily visibility and explicit completion, without scoring or a second loop?
- **SUPPORT-05:** Do Notes and embedded Growth Areas remain user-owned context without becoming standalone Knowledge, Goals, or automatic adaptation?
- **SUPPORT-06:** Do loading, empty, partial/stale, unavailable, disconnected, error, retry, and re-entry states remain accessible and non-blocking?
- **SUPPORT-07:** Are `requireUserId`, RLS, Zod/RHF, date-fns, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration limits preserved for supporting boundaries?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Minimum behavior, exclusions, ownership, optionality, and failure handling are approved for design expression. Any promotion of a supporting domain requires a new brief, parent review, and decision record.
