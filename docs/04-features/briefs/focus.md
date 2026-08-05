# Focus - Feature Brief

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder); Focus domain owns session persistence
**Sprint tasks:** P1.3, P1.5, P4.5
**Parent systems:** [Action and Evidence](../../02-systems/action-and-evidence.md) - [Direction and Commitment](../../02-systems/direction-and-commitment.md)
**Journey stage:** Action and Evidence
**Canonical owner:** Focus owns the factual session lifecycle, session timing, session correction, and session-level evidence. It does not own task completion or adaptation.
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Focus behavior contract](../behavior/focus.md)

## Product decision

Focus is the deliberate-attention action mode. It records what the Focus session actually recorded: lifecycle state, persisted instants, and verified attribution when available. Duration and session existence are evidence of a session, not proof of task completion, quality, causality, or outcome.

## Person need and outcome

The person needs a bounded way to begin, pause, resume, and conclude an action session while retaining honest recovery after interruption. The desired outcome is a factual session record and an optional Reflection handoff, with uncertainty visible when attribution or persistence is unavailable.

## Scope

- Start, pause, resume, conclude, leave, and re-enter a Focus session.
- Preserve session timing as persisted instants and display date context using `Asia/Singapore` date keys.
- Accept a selected task as planned context; confirm task attribution only when the owning attribution path is available and succeeds.
- Hand session-end context to Reflection without automatically writing adaptation or changing commitments.
- Expose loading, active, paused, concluded, unreliable, unavailable, pending, and failed states.

## Resolved P4.5 decision: attribution fallback

`focus_session_task_totals.sql` is pending/unverified. Until it is applied and verified, Focus may retain a selected task as planned/user-provided session context when the existing owner path confirms that context, but it must not claim factual task attribution or write task totals. The fallback record is a session-level factual record with attribution unavailable. The person may add task relationship or interpretation explicitly in Reflection; no inferred backfill is allowed.

## Non-goals and exclusions

- Focus does not complete, defer, withdraw, or otherwise mutate tasks.
- Focus does not apply Reflection adaptation, score productivity, infer quality, or claim causality from elapsed time.
- No autonomous task selection, new migration, new route, or broader analytics admission is implied.

## Success and validation intent

Focus succeeds when a person can record and recover a truthful session without confusing planned selection, elapsed duration, task attribution, or outcome. The behavior contract defines `FOCUS-*` questions for later design and validation.

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Session meaning, attribution fallback, Reflection handoff, and Action/Evidence-stage role are approved for design specification. This approval does not authorize implementation or migration application.

## Change control

Changing session ownership, attribution truth, outcome language, or the Reflection handoff reopens this brief, the Focus behavior contract, the journey contract, and record rules.
