# Focus — Behavior Contract

**Status:** Draft
**Owner:** Product Architect + Engineering Architect
**Sprint tasks:** P1.3, P1.5, P4.5, P5.4
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Authorized feature brief:** [Focus feature brief](../briefs/focus.md)
**Participating systems:** [Action and Evidence](../../02-systems/action-and-evidence.md) · [Direction and Commitment](../../02-systems/direction-and-commitment.md) · [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md)
**Affected destinations:** `/focus`, active Focus in Today/Workplace, Tasks-to-Focus handoff
**Journey:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Validation plan:** [Validation plan standard](../validation-plans.md) — feature plan required before delivery
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Behavioral authority:** Focus owns the factual lifecycle of an intentional attention session and never presents duration as an outcome.

## Authorized feature boundary

Focus is a bounded action mode. It records session occurrence and elapsed time, optionally relates a selected task, and provides a contextual handoff to Reflection. It does not own task completion, outcomes, reflection meaning, or universal progress.

## Participants and authority

| Participant | May do | Owning authority |
|---|---|---|
| Person | Start, pause, resume, conclude, leave/cancel where offered, and recover a session | Person authorizes session lifecycle |
| Tasks | Supply optional selected-task identity and current commitment context | Tasks owns commitment state |
| Focus | Persist session state, timing evidence, and attribution status | Focus session persistence paths |
| Reflection | Receive an explicit session-end sensemaking handoff | Reflection owns interpretation/save |

## Objects and observable states

| State | Meaning | Must not imply |
|---|---|---|
| Ready | No active session is being represented | No action is possible or required |
| Active | Focus has a reliable basis to represent attention as occurring | Completion, quality, or outcome |
| Paused | The person/system deliberately interrupted an active session | Failure or completed result |
| Concluded | The session is no longer represented as occurring | Task fulfillment or desired outcome |
| Unreliable/unavailable | Timing or persistence cannot be treated as dependable | Bad faith or total loss of related action |
| Pending/failed | A lifecycle change is requested but not confirmed durable | The requested state is final |

## Entry conditions and access

- Valid entry is active Focus from Today/Workplace or a selected task handoff; `/focus` provides history and analytics context.
- A session may exist without a task; a task selection is optional and must be explicit.
- Re-entry after reload or interruption must show the last confirmed session state and its freshness/availability.
- Focus is voluntary; a person may leave without starting or concluding a session.

## Behavior rules

1. Given Focus is Ready and the person starts a session, FlowOS must record a pending request then show Active only after the owner confirms the session basis.
2. Given Focus is Active, when the person pauses, FlowOS must preserve confirmed elapsed evidence and show Paused without claiming a result.
3. Given Focus is Paused, when the person resumes, FlowOS must continue from the confirmed session identity without creating an accidental second session.
4. Given Focus is Active or Paused, when the person concludes, FlowOS must show Concluded with factual timing and optional task identity; it must not complete the task automatically.
5. Given a session has a selected task, Focus may attribute the session only when the identity and persistence basis are available; otherwise it must show attribution as unavailable/unverified.
6. Given a session ends, Focus may offer Reflection context. Accepting the offer does not save reflection or apply adaptation without the Reflection owner and person authority.
7. Given elapsed time is displayed, FlowOS must label it as session evidence and not as outcome, quality, success, or progress score.
8. Given persistence fails or the browser/session is interrupted, FlowOS must preserve only confirmed state, identify uncertain timing, and provide safe retry/recovery.

## Decision and transition table

| Choice | From | Result | What must not happen |
|---|---|---|---|
| Start | Ready | Active after confirmation | No task completion or outcome claim |
| Pause | Active | Paused with elapsed evidence | No failure judgment |
| Resume | Paused | Active same session identity | No duplicate session unless explicitly chosen |
| Conclude | Active/Paused | Concluded factual record | No automatic commitment fulfillment |
| Leave/cancel | Ready/Active/Paused | Valid exit; state follows confirmed owner rule | No fabricated conclusion |
| End reflection handoff | Concluded | Reflection context offered | No automatic reflection/adaptation |

## Truth, provenance, and uncertainty

Focus session records are direct FlowOS evidence of the session lifecycle. Task identity is related context, not proof of task outcome. Derived totals must retain their source sessions and calculation time. An unapplied `focus_session_task_totals` migration cannot be treated as available attribution evidence.

## Assistance and automation

No autonomous timer conclusion, task completion, prioritization, or adaptation is admitted. Timekeeping may continue as the explicitly authorized session behavior; any automatic pause or recovery must expose its basis and uncertainty and cannot claim an outcome.

## Error, interruption, and recovery

- Pending start/pause/resume/conclude states are distinguishable from confirmed states.
- A failed write must not turn an intended lifecycle change into a historical fact.
- Reload/re-entry must recover the last confirmed session identity and show any uncertain interval.
- Clock/date boundary handling follows the Phase 1.5 date/time pattern: date-only keys use `Asia/Singapore`, persisted timestamps remain instants, and impossible values are rejected.
- Permission or source loss preserves existing confirmed history while preventing an unverified mutation.

## Accessibility and inclusive behavior

Current session state, elapsed status, lifecycle controls, pending feedback, and recovery must be announced semantically and cannot rely on motion, color, or sound. Timed behavior must have keyboard and assistive-technology equivalents. A person must be able to pause, conclude, or leave without a precision-timing interaction.

## Acceptance behavior and open questions

- **FOCUS-01:** Session lifecycle states are explicit, recoverable, and do not overclaim outcome.
- **FOCUS-02:** Pause/resume does not create accidental duplicate sessions.
- **FOCUS-03:** Task identity remains optional and attribution limitations are visible.
- **FOCUS-04:** Session-end Reflection is an explicit handoff, not an automatic save or adaptation.
- **FOCUS-05:** Interrupted and failed persistence paths preserve only confirmed truth.
- **FOCUS-06:** Date/time handling follows the Phase 1.5 foundation pattern.

P4.5 owns the remaining record-rule decision: exact task-attribution representation and fallback while the recorded totals migration is unapplied. Engineering Architect must resolve it before Gate 2 approval.

## Change control

Revise this contract if Focus gains authority over task/reflection state, becomes a score destination, or changes the meaning of elapsed time. Parent-system and decision-record review is required.
