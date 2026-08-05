# Focus - Design Specification

**Status:** Design Architect complete; checkpoint and cross-surface review completed 2026-08-05; Gate 2 PASSED; Phase 3 authorized
**Owner:** Design Architect
**Authorized behavior contract:** [Focus behavior contract](../../04-features/behavior/focus.md)
**Authorized brief:** [Focus feature brief](../../04-features/briefs/focus.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) - Action and Evidence
**Affected destinations:** [Information Structure](../../03-experience/information-structure.md) - Focus, Today session context, Tasks selection, Focus history, and Reflection session-end entry
**Reusable standards:** [Design System Architecture](../design-system-architecture.md), [Design System v3](../DESIGN_SYSTEM_V3.md), [Tokyo Night Warm](../DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md), [Content Standards](../content-standards.md), [Accessibility Standards](../accessibility-standards.md), [Design Implementation Map](../design-implementation-map.md)
**Design exceptions:** None
**Validation plan:** [Validation plan standard](../../04-features/validation-plans.md) and the `FOCUS-*` acceptance questions below; a feature-specific delivery validation plan is a downstream Engineering Architect artifact.
**Review trigger:** Any change to session ownership, timer meaning, attribution truth, lifecycle/recovery, Reflection handoff, or the distinction between session evidence and outcome.

## Identity and status

This document is the feature-specific design authority for the approved Focus behavior during Phase 2. Its status, owner, parents, affected destinations, reusable standards, exceptions, and validation reference are recorded in the metadata above.

## Authorized behavior and scope

Focus inherits its brief, behavior contract, record rules, and journey contract. It records a bounded attention session: lifecycle, persisted instants, session timing, and verified attribution only when the approved owner path confirms it. It does not complete tasks, prove outcomes or quality, score productivity, infer causality, or apply adaptation.

A task passed from Tasks or Today is planned/user-selected context until factual attribution is separately verified. While `focus_session_task_totals.sql` is pending or unverified, attribution is unavailable and must never be inferred from selection, elapsed time, or proximity.

## Experience intent

Give the person a calm, bounded action space where they can understand the last confirmed session state, choose to start/pause/resume/conclude/leave, and recover honestly after interruption. Timer prominence supports attention; it must not turn elapsed time into a claim about outcome.

## Information hierarchy and access

### Focus destination

The authenticated Focus destination is a direct Workspace peer. The main reading order is:

1. `Focus` heading and the session context identity, including task identity only when supplied as planned/user-provided context.
2. Session status: ready, starting/pending, active, paused, resuming/pending, concluding/pending, concluded, interrupted/local recovery, failed, unreliable, unavailable/disconnected, or historical.
3. The elapsed-session display when a confirmed timing basis exists, explicitly labeled as session time rather than outcome.
4. The lifecycle control appropriate to the confirmed state: Start, Pause, Resume, Conclude, Retry, or Leave.
5. Attribution/provenance limitation and source identity when material.
6. Optional concluded-session context and the Reflection session-end entry action after Focus confirms conclusion.

The timer is visually prominent within the Focus canvas, but state, owner, uncertainty, and available recovery remain adjacent and readable. A large timer never substitutes for a semantic status line.

### Entry and deep entry

Direct entry allows a session with no task or a task selected first. Deep entry from Tasks or Today passes task identity as planned context. Re-entry returns to Focus with the last confirmed session, local recovery, and uncertainty visible; it does not require visiting Today or Tasks first.

### History and context

If concluded sessions or history are shown, they are explicitly historical and retain original instants and provenance. A historical session is not presented as an active session and is not rewritten by a current timer or task state.

## State and semantic expression

### Default, loading, empty, partial, stale, and degraded states

| State | Normative expression | Available action and constraint |
|---|---|---|
| Default / ready / empty active state | Show that no active session is confirmed. Offer optional Start and preserve direct entry with or without task context. | Start or leave. Do not imply no action occurred elsewhere. |
| Loading | Keep the Focus heading and stable session region. Show a neutral loading status; do not show a running timer or imply Ready until the owner read completes. | Conflicting lifecycle controls are disabled or guarded. Safe navigation remains available. |
| Partial | Show last confirmed session state while identifying missing history, attribution, or supporting context. | Continue with confirmed session controls where safe, retry missing context, or leave. |
| Stale | Show last confirmed session state and the last verified time/freshness. Do not animate a stale timer as if current. | Retry/reconcile or leave. |
| Unavailable | Identify that Focus persistence, the current session source, or attribution cannot be read or verified. Preserve known historical sessions. | Retry, reauthenticate, or leave. Never fabricate Active, Paused, or Concluded. |
| Disconnected | Preserve prior session/history and disclose that the source relationship ended. | Inspect known history, retry/reconnect through the owner path where available, or leave. |
| Unreliable timing | State that timing/instants cannot be verified and do not show a precise duration as fact. | Retry/reconcile or leave; no outcome claim. |
| Error | Name the failed read or lifecycle operation and keep the last confirmed state. | Retry the same operation, recover local context, or leave safely. |

### Session state and semantic expression

| Contract state | Visual/content treatment | Must not imply |
|---|---|---|
| Ready | Calm idle canvas with `No active session confirmed` and optional Start. | No work happened or no prior history exists. |
| Starting/pending | Keep Ready/last confirmed state and show `Start pending confirmation`. | Durable session or active time. |
| Active | Show `Active`, confirmed start context, elapsed session time, and Pause/Conclude/Leave. | Task completion, outcome, quality, or causality. |
| Paused | Show `Paused`, confirmed pause context, and Resume/Conclude/Leave. | Work stopped entirely outside Focus or an unsuccessful action. |
| Resuming/pending | Keep Paused authoritative and show resume pending. | Active session until owner confirmation. |
| Concluding/pending | Keep Active/Paused authoritative and show conclusion pending. | Final record or Reflection handoff before confirmation. |
| Concluded | Show confirmed lifecycle/instants as factual session record. Offer optional Reflection session-end entry. | Adaptation applied, task completion, or outcome. |
| Interrupted/local recovery | Separate recoverable local timer/context from owner-confirmed session state. | Local timer equals durable session. |
| Failed | Show failed operation and last confirmed state. | Requested lifecycle transition happened. |
| Attribution unavailable | Keep session facts visible and label task relationship as planned/user-provided or unavailable. | Task attribution, totals, completion, or inferred relationship. |
| Historical | Show original instants, source, and historical label. | Current active state. |

### Pending, confirmed success, failed, and rollback states

| Operation | Pending expression | Owner-confirmed success | Failed/rollback expression |
|---|---|---|---|
| Start | `Starting - awaiting confirmation`; no running timer as a confirmed fact. | `Active` with confirmed start basis and elapsed-session display. | Return to Ready/last confirmed state; preserve any recoverable local context and offer Retry. |
| Pause | `Pausing - awaiting confirmation`; keep Active authoritative. | `Paused` with confirmed pause context. | Restore Active/last confirmed timing; do not claim paused. |
| Resume | `Resuming - awaiting confirmation`; keep Paused authoritative. | `Active` with confirmed resume/start basis. | Restore Paused and offer Retry. |
| Conclude | `Concluding - awaiting confirmation`; keep Active/Paused authoritative. | `Concluded` with factual session record and optional Reflection handoff. | Restore Active/Paused or show unavailable if current state cannot be verified; no final record claim. |
| Correction | Mark the requested correction pending at the Focus owner. | Show corrected owner-confirmed session metadata with history relationship. | Restore prior confirmed session facts and expose correction retry. |

Pending controls prevent conflicting duplicate transitions while preserving safe leave/navigation. A transient success treatment is supplemented by the durable state and session identity. If a local timer or optimistic state is rolled back, the previous confirmed owner state remains visible and the visual timer stops pretending to be authoritative.

### Interruption and re-entry

Tab close, navigation, network loss, process interruption, and page hide do not silently become Pause or Conclude. The surface distinguishes:

- the last confirmed owner state;
- local recovery context, if any;
- a pending operation awaiting owner confirmation;
- failed/unavailable verification; and
- the explicit choices available: resume/reconcile/retry/leave as applicable.

On re-entry, a recovered timer is labeled local/interrupted until the owner confirms persistence. If conclusion failed, the last confirmed Active/Paused state remains authoritative or Focus discloses that it is unavailable. A concluded Focus session remains concluded even if the optional Reflection handoff fails.

### Ownership, provenance, uncertainty, and recovery

| Context | Canonical owner/provenance | Design treatment |
|---|---|---|
| Session lifecycle/timing | Focus; direct owner-confirmed factual record | Show lifecycle and persisted instants, not a universal outcome. |
| Selected task | Tasks supplies planned/user-selected context | Label `Selected task` or `Planned context`; no completion or attribution from selection. |
| Task attribution/totals | Focus only through verified owner path | Show factual attribution only after verified success. Pending/unverified `focus_session_task_totals.sql` is `Attribution unavailable`. |
| Local timer/recovery | Client continuity; local-draft/interrupted | Show recoverable but not saved/durable. |
| Reflection handoff | Focus supplies confirmed session identity/facts; Reflection owns reflection write | Offer `Add reflection` only after Concluded. A failed Reflection save does not undo Focus. |
| Reflection adaptation | Reflection proposal; receiving owner applies | Focus never applies it. |
| Historical session | Focus retained owner record | Preserve original instants and provenance; do not relabel as current. |
| Unavailable/disconnected source | Source/capability/relationship cannot be verified | Preserve known history and limitation; do not infer session state or attribution. |

Every Focus owner boundary remains subject to `requireUserId()`, user-scoped access/RLS, shared Zod/RHF boundaries, `date-fns`, `Asia/Singapore` calendar keys, instant timestamps, local-draft semantics, and pending-migration truth. The design makes these limits inspectable; it does not define technical implementation.

## Interaction and decision behavior

- Start, Pause, Resume, Conclude, Retry, and Leave are explicit controls whose labels match the confirmed session state.
- Conclude is not labeled `Complete`, `Finished work`, or `Achieved`. It records the session lifecycle only.
- The task context, if present, has a clear planned/user-provided label. Focus does not expose task completion or mutation controls.
- Timer updates are visually calm and do not cause layout shift. The elapsed value is accompanied by text explaining its session meaning.
- A session-end Reflection entry appears only after Focus confirms Concluded. It is a handoff, not an automatic Reflection save or adaptation.
- Correction routes to Focus’s owner context. Task correction routes to Tasks; reflection correction routes to Reflection.
- A failed handoff keeps the confirmed Focus session and presents a retry/leave path for Reflection independently.
- Leave is valid and does not infer success, completion, pause, or conclusion.

## Content and communication

### Content and status language

| Meaning | Preferred expression | Avoid |
|---|---|---|
| Ready | `No active session confirmed.` | `You did nothing` or a negative empty state |
| Starting | `Starting Focus session - awaiting confirmation.` | `Started` before persistence |
| Active | `Focus session active` and `Elapsed session time` | `You are making progress`, `Task in progress`, or outcome claims |
| Paused | `Focus session paused.` | `Work stopped` or `Failed` |
| Concluding | `Concluding Focus session - awaiting confirmation.` | `Complete` before owner confirmation |
| Concluded | `Focus session concluded.` | `Task completed`, `Goal achieved`, or `Successful` |
| Attribution | `Selected task: [name] - planned context` or `Task attribution unavailable` | `Worked on [task]` without verified attribution |
| Local recovery | `Local recovery - not saved` | `Recovered session` as durable fact |
| Failed | `[Operation] was not confirmed. Last confirmed session: [state].` | Silent timer reset or blame |
| Unavailable | `Current Focus session cannot be verified.` | `No session` or an inferred pause/conclusion |
| Reflection handoff | `Add a Reflection entry for this concluded session` | `Reflect now` as an obligation or automatic save claim |

Persisted instants are presented with the approved date/time convention. Product date grouping uses the `Asia/Singapore` date key. Status copy identifies what is confirmed, what is pending, and what the person can do next.

## Responsive and adaptive behavior

| Condition | Expression |
|---|---|
| Desktop / wide | Use the existing Focus canvas (Surface 3) with the timer as a calm focal element, state/provenance nearby, and lifecycle controls in a stable action region. Supporting context remains subordinate and cannot obscure recovery. |
| Tablet / medium | Reduce secondary history/context detail while retaining session identity, state, elapsed-session meaning, primary lifecycle control, and retry/leave. Keep the timer readable without requiring horizontal scrolling. |
| Mobile / narrow | Stack heading, task/planned context, session status, timer, primary control, secondary controls, attribution limitation, and Reflection handoff in that order. The control consequence remains visible without hover or an overflow-only menu. |
| Touch / coarse pointer | Provide separated lifecycle controls and an explicit confirmation path for Conclude if required by the existing interaction pattern. Do not rely on hover. |
| Slow/interrupted connection | Keep last confirmed state and local recovery visible. Do not animate an unverified timer as current. |
| Reduced motion | Disable decorative timer pulsing and nonessential transitions. State changes remain communicated by text/status. |

## Accessibility requirements

### Keyboard and focus behavior

- Provide a skip link to Focus main content and preserve global navigation access.
- DOM order is heading/context, session state, timer meaning, primary lifecycle control, secondary controls, attribution limitation, and Reflection/historical context.
- Start, Pause, Resume, Conclude, Retry, Leave, correction, and Reflection handoff controls are keyboard-operable native controls with stable names.
- Pending lifecycle requests do not move focus or create a second conflicting control. On confirmed transition, focus moves to the new session status or primary next control only when the person initiated the operation.
- On failure, focus moves to the concise error/retry region without discarding local recovery. On re-entry, focus starts at the Focus heading or restored session status, not the timer.
- Timer updates never steal focus. No keyboard gesture depends on a continuously changing visual value.

### Screen-reader semantics

- Use one `main` landmark headed `Focus`; expose the active session as a labeled region with session identity and state.
- The elapsed timer is a semantic text value with an accessible description such as `Elapsed session time; this is not an outcome measure.` Do not announce every tick. Announce meaningful lifecycle changes through a concise polite status.
- Controls expose state-dependent names and disabled/pending status. `Conclude` is not exposed as `Complete`.
- Selected task context includes its planned/user-provided status. `Attribution unavailable` is text in the accessibility tree, not only a badge.
- Pending, failed, local recovery, unreliable timing, unavailable, disconnected, historical, and confirmed states are read in the session region and available without hover.
- A session-end Reflection link names the session context and is present only after Focus reports confirmed conclusion. A failed Reflection handoff is announced separately from the confirmed Focus result.

## Reusable standards and exceptions

- Map the Focus workspace to the active Surface 0–10 ladder: shell Surface 0, workspace Surface 1, Focus canvas Surface 3, supporting cards Surface 4, controls Surface 5, hover Surface 6, selected/current timer treatment Surface 7 only where it means active, and any owner confirmation dialog Surface 9.
- Use Soft Indigo for current timer/active control emphasis, not as a background glow or outcome signal. Use semantic colors with text for success, warning, danger, and information.
- Keep the timer calm and legible; do not add radial glows, decorative progress rings, or visual scoring that imply outcome.
- Reuse existing Focus canvas, timer, button, status, dialog, skeleton, error/retry, and focus-ring patterns. Stable implementation patterns remain subordinate to the behavior contract.
- Prefer fill/elevation and whitespace over heavy borders. Critical lifecycle controls are visible without hover.
- Respect reduced motion, contrast, target-size, and live-status obligations in [Accessibility Standards](../accessibility-standards.md).

## Annotated artifacts

### Normative Focus wireframe

```text
Application shell / global navigation
└── main [Focus]
    ├── h1 Focus + optional selected task [planned/user-provided]
    ├── session region
    │   ├── status [ready | loading | active | paused | pending | failed | unavailable]
    │   ├── timer + "elapsed session time, not outcome"
    │   └── lifecycle controls
    ├── attribution / timing limitation
    ├── local recovery or retry region when needed
    └── concluded session context + optional Reflection handoff
```

This wireframe defines semantic priority and recovery visibility. It does not prescribe timer implementation, state management, or component APIs.

## Handoff, validation, and open questions

### Delivery constraints

- Preserve Focus ownership of session lifecycle, timing, correction, and session-level evidence.
- Preserve Tasks ownership of task state and Reflection ownership of reflection records.
- Preserve planned selection versus verified attribution and the unavailable state for pending/unverified attribution migration.
- Preserve local timer/recovery as non-durable until owner confirmation, including after interruption.
- Preserve `requireUserId()`, user-scoped queries/RLS, shared Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, and no automatic adaptation.

### Validation questions

- **FOCUS-01:** Can a person start, pause, resume, conclude, leave, and re-enter while preserving the last confirmed session state?
- **FOCUS-02:** Does Focus record factual lifecycle/timing state without presenting duration as outcome or task completion?
- **FOCUS-03:** Does selecting a task remain planned context and never complete or mutate the task?
- **FOCUS-04:** Does attribution become unavailable, rather than guessed, while `focus_session_task_totals.sql` is pending/unverified?
- **FOCUS-05:** Are loading, empty/ready, partial/stale, unavailable, disconnected, unreliable, failed, local-recovery, pending, confirmed, and rollback states observable and accessible?
- **FOCUS-06:** Does a session-end handoff let Reflection own interpretation without Focus applying adaptation or hiding a failed save?
- **FOCUS-07:** Are `requireUserId`, RLS, Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, local-draft semantics, and pending-migration limits testable?

### Design Architect checkpoint

Completed 2026-08-05. The specification was checked against the Focus brief, behavior contract, journey contract, record rules, reusable standards, and all `FOCUS-*` questions. No new lifecycle state, owner, attribution guarantee, outcome meaning, route, or adaptation path was introduced.

### Open questions

No product or design decision is unresolved for this specification. Engineering must confirm implementation details and validation evidence in the next hat; attribution remains unavailable until its source is applied and verified.

## Change control

Changes to session meaning, timer semantics, attribution truth, lifecycle ownership, interruption recovery, or Reflection handoff reopen the Focus brief/behavior contract, record rules, and cross-surface journey review. Visual or content refinements that preserve those contracts follow the feature-specification review path.
