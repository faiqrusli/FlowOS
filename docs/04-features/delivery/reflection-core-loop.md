# Reflection Core-Loop Delivery Design

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated implementation evidence recorded, manual/live evidence pending
**Owner:** Engineering Architect (Founder)
**Product scope owner:** Product Architect (Founder)
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Implementation evidence:** [Reflection implementation evidence](../../current-phase/phase-3/reflection-implementation-evidence.md)
**Authorized behavior contract:** [Reflection behavior contract](../behavior/reflection.md)
**Authorized brief:** [Reflection feature brief](../briefs/reflection.md)
**Design specification:** [Reflection design specification](../../05-design/features/reflection-design-spec.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) — Sensemaking and Adaptation
**Record rules:** [MVP record rules](../record-rules.md)
**Affected engineering domains:** Reflection owner UI/service | local drafts | Focus handoff | receiving-owner handoff | validation | security | date/time | recovery
**Risk level:** `High`
**Migration required:** `No`
**Rollout class:** `Direct` and reversible at existing Reflection entry paths
**Rollback owner:** Founder / Implementation Engineer; preserve confirmed reflection history and use owner correction
**Validation plan:** [Reflection core-loop validation plan](../validation/reflection-core-loop.md)
**Evidence links:** [Phase 3 current sprint](../../current-phase/current-sprint.md) · [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Review trigger:** Any change to record relationship, save owner, interpretation meaning, adaptation authority, local-draft semantics, or recovery behavior.

> This design is complete for checkpoint review. It authorizes neither implementation nor migration application until the Founder records the checkpoint decision.

## Authorized behavior

Reflection is voluntary, user-provided sensemaking. It owns daily records, custom entries, Focus session-end entries, correction, withdrawal, and skip state. It may propose adaptation, but the receiving owner must explicitly apply or decline it. A reflection never rewrites factual Task/Focus records and a session-end entry never silently replaces the daily reflection.

The delivery must support `REFLECT-01` through `REFLECT-08` and the adaptation/authority portions of the coherent journey.

## Delivery objective and constraints

Deliver direct, Today, sidebar, and Focus session-end entry paths using one record/recovery model. Support local draft, pending, saved, failed, corrected, historical, skipped/withdrawn, unavailable, and disconnected states with clear identity and provenance.

- Resolve `requireUserId()` and use user-scoped access/RLS for every read/write.
- Use shared Zod/RHF validation; server validation remains authoritative.
- Use `Asia/Singapore` date keys and `date-fns`; persisted timestamps remain instants.
- Local drafts/autosave attempts are never called saved until Reflection confirms persistence.
- No implicit Task/Focus/Habit/Schedule/Notes mutation, coaching, score, required ritual, or new route.

## Affected boundaries

| Boundary | Delivery effect | Ownership constraint |
|---|---|---|
| Reflection destination/sidebar | Normalize editor identity, record type, status, validation, and recovery | Reflection owns reflection records |
| Focus session-end entry | Append linked custom entry with confirmed session identity | Focus facts remain unchanged; daily record is not replaced |
| Local continuity | Preserve recoverable values across interruption | Local draft is not durable |
| Adaptation handoff | Send explicit proposal to receiving owner | Reflection cannot apply commitments |
| Today/other projections | Read owner-confirmed interpretation with provenance | Projections do not write |

## Proposed approach

1. Inventory direct, full-page, sidebar, and session-end paths and route all writes through one Reflection owner service/state model.
2. Represent record identity and type explicitly: daily, custom, or Focus-linked session-end entry.
3. Add form validation and state-aware save/retry/correction/withdraw/skip controls. Preserve input and last confirmed record on failure.
4. Keep local draft and pending save visible through re-entry; never promote client continuity to a durable record.
5. Render factual source context as linked context, not as reflection fact. Mark reflection as user-provided interpretation.
6. Represent adaptation as proposed/declined/deferred until a receiving owner confirms applied state.

## Data and state transition design

Existing Reflection records remain authoritative. Daily, custom, and session-end entries retain separate identity/history. Correction creates an explicit superseding representation; withdrawal/skip is not proof that nothing happened. A failed save leaves prior confirmed state authoritative. No new cross-owner record is created by a Reflection write.

## Authority, security, privacy, and trust

- Every read/write is authenticated, user-scoped, and RLS-protected; two-account evidence remains required.
- Reflection text is user-provided and must not be presented as direct evidence. Source links retain owner/freshness/identity.
- Save/correction/withdrawal errors expose safe recovery, not raw database or private content.
- Adaptation controls require explicit person choice and receiving-owner confirmation.

## Integration and dependency design

| Dependency | Contract | Failure treatment |
|---|---|---|
| Focus | Provides confirmed session identity/facts | Failed Reflection save does not undo concluded session |
| Tasks/planning owner | Receives proposed adaptation | Proposal remains unapplied until owner confirmation |
| Today | Provides optional context and return path | Today does not write or imply save |
| Notes/Habits/Schedule | Optional source context | Missing source is disclosed; no inference or mutation |
| Auth/RLS | Authorizes Reflection scope | Access failure is unavailable/access-required, not empty |

## Reliability and recovery

Page hide, navigation, network loss, and sidebar close may leave a local draft or pending write. Re-entry offers retry/reconcile/discard/leave with explicit status. A late response cannot overwrite newer confirmed state. Correction and withdrawal preserve history; rollback of code cannot erase confirmed interpretation records.

## Observability and operational readiness

Validation and review evidence records record identity/type, owner, source links, save state, local-draft status, date key, persisted instants, and adaptation disposition while redacting reflection content. No analytics or profiling is required.

## Rollout and rollback

Implement within existing Reflection entry paths. Roll back code for hidden saves, duplicate/replaced records, implicit adaptation, cross-account access, fabricated factual meaning, or inaccessible recovery. Source records remain intact; owner correction handles data repair.

## Validation and open decisions

The linked validation plan maps all `REFLECT-*` questions to record identity, state, save/retry, correction/withdrawal, adaptation handoff, interruption, accessibility, security, and date-boundary evidence. Founder approval is required before implementation. Any change to record relationships or adaptation authority reopens the parent contract and Gate 2 traceability.

## Change control

Changes to Reflection ownership, record types, local-draft durability, factual/interpretive language, or adaptation authority require review of the Reflection brief, behavior contract, design specification, record rules, journey, sprint, and Gate 3 checklist.
