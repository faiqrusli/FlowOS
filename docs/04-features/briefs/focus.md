# Focus — Feature Brief

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P1.3, P1.5, P4.5
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [Product Model](../../01-product/product-model.md) · [Action and Evidence System](../../02-systems/action-and-evidence.md) · [Experience Architecture](../../03-experience/experience-architecture.md)
**Standard:** [Feature Briefs](../feature-briefs.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Focus behavior contract](../behavior/focus.md)
**Review trigger:** A change to active-session semantics, task attribution, elapsed-time meaning, interruption recovery, or Focus’s role in the MVP loop.

## Feature decision

**Proceed to behavior contract.** Focus is admitted as the deliberate-attention action mode. `/focus` remains primarily history/analytics context; active execution may be entered from Today, Workplace, or Tasks.

## Person need and context

“When I choose an action, I need a bounded way to begin, pause, resume, and conclude attention on it, then understand what the session actually records.”

The current build persists focus sessions and exposes active focus in contextual surfaces. Phase 1 identified unresolved active-session semantics, task-attribution migration state, and the need to distinguish elapsed time from outcome.

## Desired outcome

The person can deliberately enter and leave an action mode, recover after interruption, and inspect factual session history without FlowOS treating duration as proof of completion, quality, or outcome.

## Evidence and assumptions

- **Observed:** Focus history/analytics exist at `/focus`; active focus is embedded in Today/Workplace.
- **Observed:** `focus-session-persist.ts` and `focus-sessions.ts` own session persistence; session-end reflection is a separate handoff.
- **Observed:** `focus_session_task_totals.sql` remains listed as not applied in live-state records.
- **Assumption:** A session may relate to a selected task but must remain truthful if attribution is unavailable.

## Feature hypothesis

If Focus represents attention as an explicit, recoverable action record and keeps elapsed time separate from outcome, it can support deliberate action without creating false performance evidence.

## Scope

- Start, pause, resume, conclude, cancel/leave, and recover an active focus session where the current build supports the path.
- Preserve optional selected-task identity and truthful attribution status.
- Persist factual session state and elapsed-time evidence through the Focus owner.
- Provide a bounded handoff to session-end Reflection without automatically applying adaptation.
- Expose history/analytics as derived context, not a universal score or Progress destination.

## Non-goals and exclusions

- No claim that elapsed time proves completion, quality, causality, or outcome.
- No autonomous task completion, reprioritization, or reflection/adaptation.
- No requirement that every action use a timer or Focus.
- No silent dependency on an unapplied attribution migration; unavailable attribution remains visible.

## Authority, trust, and risk

The person controls session start, pause, resume, conclusion, and available cancellation/exit paths. Focus owns session occurrence and persistence; Tasks owns commitment state. A session record is direct FlowOS evidence of the session lifecycle, not proof of the task’s real-world result. Recovery must never fabricate elapsed time or a concluded state.

## Alternatives and tradeoffs

- **Timer as productivity score:** easy to summarize, but violates evidence meaning.
- **Focus only as a history page:** preserves truth but does not support action mode.
- **Bounded action mode plus factual history:** chosen for MVP, with attribution limitations explicit.

## Next contract and open questions

The behavior contract must define active/paused/concluded/unreliable states, re-entry after interruption, persistence failure, attribution availability, and the session-end reflection handoff. Engineering record rules must state how task identity and focus totals are represented when the live migration is unavailable.

## Change control

Revisit this brief if Focus becomes an autonomous planner, a score destination, or an authority over task or reflection state. Such a change requires parent and decision-record review.
