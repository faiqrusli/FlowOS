# Focus - Behavior Contract

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder); technical persistence owner is Focus
**Sprint tasks:** P1.3, P1.5, P4.5, P5.4
**Authorized brief:** [Focus feature brief](../briefs/focus.md)
**Parent systems:** [Action and Evidence](../../02-systems/action-and-evidence.md) - [Direction and Commitment](../../02-systems/direction-and-commitment.md)
**Journey stage:** Action and Evidence
**Canonical owner:** Focus owns session lifecycle, timing, session correction, and session-level evidence. Tasks owns task state; Reflection owns reflection records.
**Consumers:** Focus surface, Today, Tasks selection, Focus history, and Reflection session-end entry
**Record rules:** [MVP record rules](../record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Scope and non-goals

Focus records a bounded attention session. It does not record task completion, real-world outcome, quality, or automatic adaptation. A task passed into Focus is planned/user-selected context until factual attribution is separately confirmed.

## State model

| State | Meaning | Required truth language |
|---|---|---|
| Ready | No active session is confirmed | No action evidence yet |
| Starting/pending | Start was requested but not confirmed | Session is not durable yet |
| Active | Session is running from a confirmed start | Elapsed session time, not outcome |
| Paused | Confirmed session is paused | Work may or may not have continued outside the session |
| Resuming/pending | Resume was requested but not confirmed | Keep last confirmed paused state |
| Concluding/pending | Conclude was requested but not confirmed | Do not show a final record yet |
| Concluded | Session lifecycle is durably recorded | Factual session record only |
| Interrupted/local recovery | Client has recoverable context without confirmed durable change | Local context is not a save |
| Failed | A requested persistence operation failed | Prior confirmed state remains |
| Attribution unavailable | Session exists but task attribution cannot be verified | Do not claim task totals or completion |
| Unavailable/disconnected | Focus persistence or source is inaccessible | Do not fabricate session state |
| Historical | A concluded session is no longer current | Preserve its original instants and provenance |

## Entry, re-entry, pause, exit, and correction

- **Direct entry:** the person opens Focus and starts a session without a task, or chooses a task first.
- **Deep entry:** Tasks, Today, or a valid Focus link passes a task identity as planned context; selection never completes the task.
- **Re-entry:** return to the Focus owner with the last confirmed session state and any local recovery status.
- **Pause:** an explicit pause changes a confirmed active session to paused when persistence confirms it. A browser close or interruption is not silently treated as pause.
- **Exit:** conclude records the session; leave/departure preserves the last confirmed session and may leave local recovery. Leaving does not imply completion or success.
- **Correction:** Focus corrects session lifecycle/timing metadata under its owner. A correction must not rewrite the task, a reflection, or an adaptation.

## Lifecycle transitions

| Person action | Focus result | Unchanged state |
|---|---|---|
| Start | Confirmed active session after owner persistence | Task remains open/current |
| Pause | Confirmed paused session | No task completion or outcome |
| Resume | Confirmed active session | Prior pause remains historical session context |
| Conclude | Confirmed concluded session and optional Reflection handoff | No adaptation is applied |
| Leave | No additional confirmed state, or explicit concluded state if chosen | No hidden success claim |
| Retry | Same pending start/pause/resume/conclude request is retried | Last confirmed state remains authoritative |
| Re-enter | Restore confirmed state and uncertainty | No invented elapsed time or attribution |

## Attribution rule and fallback

Focus owns attribution only when a verified owner path records the basis and the write succeeds. The selected task may be stored/displayed as planned or user-provided context. While `focus_session_task_totals.sql` is pending or unverified, task-level attribution is `unavailable`; Focus records session-level facts only and does not infer totals from selection, time, or proximity. No automatic backfill is admitted. The person may explicitly provide context in Reflection, which remains user-provided interpretation/context rather than Focus attribution.

## Persistence, permissions, and validation

- Session operations resolve `requireUserId()` and use user-scoped queries plus RLS for every read/write. A client-held active timer is not authority.
- Session forms/settings use shared Zod schemas and React Hook Form with the shared resolver where a form boundary exists. Invalid duration/mode values and root persistence errors remain visible.
- Persisted timestamps are instants. Calendar date keys and day grouping use `Asia/Singapore` and `date-fns`; the browser timezone must not change the product date key.
- Pending migrations and unverified attribution state are unavailable behavior, not silent fallback guarantees. A migration cannot be represented as available merely because SQL exists in the repository.
- A local timer or recovery payload is `local-draft`/interrupted until the owner confirms persistence. It never becomes a durable session by display alone.

## Loading, empty, partial, unavailable, and error behavior

- **Loading:** session state is being requested; timer and controls must not imply a confirmed state.
- **Empty/ready:** no active session is confirmed; offer optional start.
- **Partial/stale:** show the last confirmed session state and identify missing attribution/history or freshness.
- **Unavailable/disconnected:** preserve known historical sessions and disclose that current session state/attribution cannot be verified.
- **Error/failed:** state the operation and last confirmed state, preserve recoverable context, and offer retry or safe departure.
- **Unreliable timing:** if instants or elapsed calculation cannot be verified, show the session as unreliable rather than inventing duration.

## Interruption and recovery

On tab close, navigation, network loss, or process interruption, the owner must distinguish confirmed session state from local recovery context. Re-entry offers resume/reconcile/retry/leave choices as appropriate. A recovered timer is not proof that the server session continued. If conclusion fails, the session remains active/paused as last confirmed, or unavailable if it cannot be verified; it is not shown as concluded.

## Reflection handoff

At session end, Focus may offer a Reflection entry linked to the concluded session. The handoff carries session identity and factual context only. Reflection owns the entry write; a failed handoff does not undo a confirmed Focus session, and Focus does not apply any proposed adaptation.

## Accessibility

Session state, elapsed-time meaning, attribution availability, pending work, and recovery action are available to assistive technology and text, not color alone. Controls have stable names and keyboard access. Timer updates must not steal focus or create an unbounded announcement stream; important state changes use a concise live status. Pause, resume, conclude, retry, and leave have an accessible path and consequence.

## Acceptance questions

- **FOCUS-01:** Can a person start, pause, resume, conclude, leave, and re-enter while preserving the last confirmed session state?
- **FOCUS-02:** Does Focus record factual lifecycle/timing state without presenting duration as outcome or task completion?
- **FOCUS-03:** Does selecting a task remain planned context and never complete or mutate the task?
- **FOCUS-04:** Does attribution become unavailable, rather than guessed, while `focus_session_task_totals.sql` is pending/unverified?
- **FOCUS-05:** Are loading, empty/ready, partial/stale, unavailable, disconnected, unreliable, failed, and local-recovery states observable and accessible?
- **FOCUS-06:** Does a session-end handoff let Reflection own interpretation without Focus applying adaptation or hiding a failed save?
- **FOCUS-07:** Are `requireUserId`, RLS, Zod/RHF, date-fns, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration limits testable?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** The contract is ready for design specification. Design may express timing and uncertainty but may not change attribution, ownership, or outcome meaning.
