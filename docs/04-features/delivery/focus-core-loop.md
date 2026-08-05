# Focus Core-Loop Delivery Design

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated implementation evidence recorded, manual/live evidence pending
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Authorized behavior contract:** [Focus behavior contract](../behavior/focus.md)
**Authorized brief:** [Focus feature brief](../briefs/focus.md)
**Design specification:** [Focus design specification](../../05-design/features/focus-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) — Action and Evidence
**Record rules:** [MVP record rules](../record-rules.md)
**Affected engineering domains:** Focus owner UI/service | session persistence | Task handoff | Reflection handoff | security | date/time | recovery | operations
**Risk level:** `High`
**Migration required:** `No` for session lifecycle; `Conditional` for task attribution totals
**Rollout class:** `Direct` and reversible; attribution remains unavailable until verified
**Rollback owner:** Founder / Implementation Engineer; code rollback must preserve confirmed sessions
**Validation plan:** [Focus core-loop validation plan](../validation/focus-core-loop.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to session ownership, lifecycle, timing, attribution, interruption recovery, Reflection handoff, or outcome language.

> This design is complete for checkpoint review. It authorizes neither implementation nor migration application until the Founder records the checkpoint decision.

## Authorized behavior

Focus owns the factual lifecycle and timing of a bounded attention session. It may accept a selected Task as planned/user-provided context, but it does not complete tasks, infer task attribution, score productivity, claim quality/outcome, or apply Reflection adaptation. `FOCUS-01` through `FOCUS-07` remain the acceptance boundary.

## Delivery objective and constraints

Deliver start, pause, resume, conclude, leave, re-entry, history, and interruption recovery with explicit pending/confirmed/failed/unavailable states. Persisted timestamps are instants; calendar grouping uses `Asia/Singapore` and `date-fns`. A client timer is never authority.

Non-negotiable constraints:

- Resolve `requireUserId()` and apply user-scoped access/RLS for every session operation.
- Use shared Zod/RHF validation where forms/settings exist; server validation remains authoritative.
- Keep `focus_session_task_totals.sql` unavailable until it is applied and verified; no inferred totals or backfill.
- Distinguish elapsed session time from completion, quality, causality, and outcome.
- Preserve last confirmed session state through interruption, failed writes, refresh, and permission change.

## Affected boundaries

| Boundary | Delivery effect | Ownership constraint |
|---|---|---|
| Focus route/components | Normalize lifecycle controls, status, timer meaning, history, and recovery | Focus owns session facts only |
| Session data access | Use confirmed owner persistence and safe retry | Client timer is not authoritative |
| Tasks handoff | Accept selected task identity as planned context | No task completion or attribution from selection |
| Reflection handoff | Pass concluded session identity/facts | Reflection owns entry save; Focus does not apply adaptation |
| Attribution totals | Detect verified capability and disclose absence | No inferred task totals while migration pending |
| Validation/operations | Add interruption, recovery, security, timezone, and accessibility evidence | Gate 3/Gate 4 remain separate decisions |

## Proposed approach

1. Map current Focus entry paths and session persistence to the contract's lifecycle state machine.
2. Introduce an explicit owner state envelope for ready, starting, active, paused, resuming, concluding, concluded, interrupted/local-recovery, failed, unavailable, unreliable, historical, and attribution-unavailable states.
3. Make each lifecycle operation idempotent or safely retryable at the owner boundary; retain the last confirmed state while a request is pending.
4. Preserve session instants and derive elapsed display from confirmed data only. If timing cannot be verified, label it unreliable rather than inventing duration.
5. Carry selected Task identity through existing deep-entry conventions as planned context. Gate attribution display on live migration verification.
6. Offer Reflection handoff after a confirmed conclusion with session identity and factual context only.

## Data and state transition design

Existing Focus session records remain authoritative. Start, pause, resume, and conclude create confirmed lifecycle changes only after owner persistence succeeds. Leave does not imply success or completion. Browser close/network loss creates local recovery context at most; it does not silently pause or conclude the server session. Correction is Focus-owned and cannot rewrite Tasks, Reflection, or adaptation.

Attribution is a separate verified fact. While `focus_session_task_totals.sql` is pending/unverified, session-level facts may be shown and selected Task context may remain planned, but task attribution is `unavailable`.

## Authority, security, privacy, and trust

- Server identity and RLS protect every read/write; two-account isolation evidence is required before final release readiness.
- Session content and linked Task identity are shown only within the current user's scope and are not added to analytics.
- Accessible copy must say what the session records and what it does not prove. Duration, selection, and presence are never universal outcomes.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Tasks | Provides optional selected Task identity | Show planned context; keep task state unchanged |
| Reflection | Receives confirmed session facts at session end | Failed reflection save does not undo Focus conclusion |
| Today | Reads current/historical session context | Stale/unavailable is disclosed; Today does not write |
| Attribution migration | Enables verified task totals | Keep attribution unavailable until apply and verification |
| Auth/RLS | Authorizes session scope | Access failure becomes unavailable/access-required |

## Reliability and recovery

Re-entry offers resume/reconcile/retry/leave based on the last confirmed state and local recovery context. A late response cannot overwrite a newer confirmed session state. Failed conclude keeps the last active/paused state or reports unavailable when it cannot be verified. The UI never shows a requested result as confirmed.

## Observability and operational readiness

Evidence must capture operation, session identity, prior confirmed state, requested state, persisted instants, timing reliability, attribution status, and recovery disposition without exposing sensitive content. No new telemetry is required; safe state labels and owner logs must make failures diagnosable.

## Rollout and rollback

Implement on the existing Focus surface without applying attribution migrations. Roll back code for unauthorized task mutation, fabricated duration/outcome, lost session history, cross-account access, or an inaccessible recovery path. Code rollback cannot erase confirmed sessions; correction remains the owner path.

## Validation and open decisions

The linked validation plan maps `FOCUS-*` questions to lifecycle tests, interruption scenarios, accessibility review, security/date evidence, and seeded/real-data walkthroughs. Founder approval is required before implementation. Any change to attribution truth, lifecycle ownership, timing semantics, or Reflection handoff reopens the parent contract and Gate 2 traceability.

## Change control

Changes to session meaning, attribution, handoff authority, persistence, or recovery require review of the Focus brief, behavior contract, design specification, record rules, sprint, and Gate 3 checklist. Technical refinements preserving the boundary update this design and its validation plan together.
