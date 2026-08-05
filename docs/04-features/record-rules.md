# MVP Record, Provenance, Correction, and Continuity Rules

**Status:** Product Architect complete; ownership decisions resolved on 2026-08-05
**Owner:** Product Architect (Founder) with Engineering Architect as implementation-consistency reviewer
**Sprint tasks:** P4.1-P4.5, P5.6
**Parent systems:** [Product Model](../01-product/product-model.md) - [Action and Evidence](../02-systems/action-and-evidence.md) - [Continuity and Interoperability](../02-systems/continuity-and-interoperability.md)
**Consumers:** Today, Tasks, Focus, Reflection, the bounded journey, and supporting decisions
**Foundation:** [Phase 1.5 foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Purpose and authority rule

These rules define source ownership, provenance, lifecycle, correction, deletion/withdrawal, and continuity for the Phase 2 MVP contract. They do not authorize implementation, migrations, or a delivery design. Every consequential mutation has exactly one canonical owner. A projection, handoff, client state, derived summary, or convenience route cannot become a second owner.

## Canonical ownership matrix

| Record or mutation | Canonical owner | Allowed projections/consumers | Explicit boundary |
|---|---|---|---|
| Task commitment and task history | Tasks | Today, Focus selection, Schedule, groups | Not action evidence or outcome by existence/completion |
| Task Next Up membership/order | Tasks | Today and Focus queue views | Focus consumes selection; pending queue migration is unavailable |
| Focus session lifecycle/timing | Focus / Action and Evidence | Today, Focus history, Reflection context | Not task completion, attribution, or adaptation |
| Focus task attribution | Focus, only through verified attribution owner/path | Focus history and derived totals | Unavailable while `focus_session_task_totals.sql` is pending/unverified; no guessing |
| Daily reflection | Reflection | Today and Reflection history | Not factual evidence or commitment mutation |
| Custom reflection entry | Reflection | Reflection/history/context | Separate record; not a second interpretation owner |
| Focus session-end reflection entry | Reflection, linked to a Focus session | Focus history and Reflection | Focus supplies handoff context; entry is appended, not a replacement or automatic adaptation |
| Habit definition/completion | Habits | Today and Schedule | Visibility/completion only; not task or Focus owner |
| Planning date/time for task/habit | Task or Habit source record | Schedule and Today | Schedule is context; planning is not evidence |
| Note/context and embedded Growth Area | Notes | Today, Tasks, Focus, Reflection | Not standalone Knowledge, Goals, or automatic meaning |
| Derived status/summary | The derived read model with source references | Today, Focus, history | Not a writable factual record or new owner |
| Adaptation applied state | Receiving source owner (usually Tasks or planning source) | Reflection and Today | Reflection can propose; it cannot apply implicitly |

## P4.5 resolved decisions

### Task removal and history

Routine Remove is **withdrawal**, not hard deletion and not completion. Tasks retains the record/history, excludes it from active projections and Next Up, and can expose an explicit restore path. Completion is a separate commitment closure. Defer is a current commitment moved out of context. Correction changes a representation while preserving prior history. Hard deletion is reserved for an explicit privacy/retention operation with separately approved authority, audit, recovery, and security semantics; it is not a routine core-loop behavior.

### Next Up ownership

Tasks owns task Next Up membership and order. Focus owns the active session and selected item for that session. Today and Focus may project the queue. Habits remain daily visibility/completion support and do not become queue-owner by implication. If `tasks_next_up_queue.sql` is pending/unverified, persistent membership/reorder is unavailable; a fallback may show confirmed task context without claiming saved queue order.

### Focus attribution fallback

Focus may retain a selected task as planned/user-provided context where an existing owner path confirms that selection. Factual task attribution and totals require the verified attribution path. While `focus_session_task_totals.sql` is pending/unverified, attribution is `unavailable`, session lifecycle/duration remains factual, and no task completion or inferred attribution is written. Reflection can hold explicit user-provided context, not a hidden backfill.

### Reflection relationship

Reflection owns one canonical date-scoped daily record per user/date key, separate custom entries, and appended Focus session-end entries linked to their session. A session-end entry is not a replacement for the daily record, not a duplicate daily save, and not an automatic adaptation. All entry surfaces use Reflection ownership and the same durable-save/recovery truth.

### Supporting-domain writes

Habits owns habit definitions/completions. Tasks/Habits own planning values. Schedule owns no competing source record. Notes owns notes and embedded Growth Areas. Today owns no domain write. Focus owns sessions. Reflection owns reflections/entries. Derived views do not write facts. Cross-surface controls route to the relevant owner.

## Provenance classes

Every material record or projection is classified as one or more of the following, with origin and freshness retained where material:

| Class | Meaning | Product treatment |
|---|---|---|
| Direct | FlowOS recorded an owner-confirmed represented occurrence or mutation | State only what the record proves |
| User-provided | Person entered, asserted, corrected, withdrew, or proposed it | Do not present as independent observation |
| Source-provided | Another owned source supplied/referenced it | Retain source identity, scope, freshness, and connection |
| Derived | Calculated from identified source records/rules | Retain inputs/rule/derivation time; not a new fact |
| Planned | Intended, scheduled, selected, queued, or proposed future context | Never action evidence by storage alone |
| Unavailable | Source, owner, migration, relationship, or verification is inaccessible | Do not replace with empty, success, or inference |

Interpretive reflection is user-provided. An adaptation is proposed until a receiving owner confirms it applied. `Unavailable` is a provenance/truth limitation, not a record deletion.

## Lifecycle and continuity states

| State | Meaning | Re-entry behavior |
|---|---|---|
| Current | Confirmed and relevant now | Show as current with owner |
| Historical | Retained prior context | Show as historical, not current |
| Superseded | Replaced by a later explicit representation | Link prior and current meaning |
| Pending | Requested mutation not confirmed | Show pending; keep prior confirmed state authoritative |
| Failed | Mutation rejected or unconfirmed | Show reason/safe recovery; do not show requested result |
| Local-draft | Client-held recoverable values | Never call durable or saved |
| Unavailable | Cannot access/verify current source/capability | Preserve known history; offer retry/owner route |
| Disconnected | Source relationship ended | Preserve prior source context and disclose break |

Interruption, re-entry, and recovery must always reveal which of these states applies. A local draft can be discarded or retried only with person choice. A pending migration is unavailable behavior until live apply and verification evidence exists.

## Correction, deletion, and withdrawal

- **Correction:** canonical owner records a new explicit representation, identifies what changed, and preserves history/lineage. Correction does not erase supporting facts or mutate another owner's record.
- **Withdrawal:** person retracts a commitment, reflection, proposal, or relationship from active/current use. The owner records withdrawal and its history; withdrawal is not completion, correction, or proof that the underlying event never happened.
- **Deletion:** data is removed under explicit privacy/retention authority and documented irreversibility/security treatment. It is not the default meaning of a Remove control in the core loop.
- **Failed operation:** old confirmed state remains visible as current/historical as applicable until the owner confirms the change.

## Persistence, time, identity, and security constraints

- Every owner boundary calls `requireUserId()` and applies user-scoped filters. RLS is required and independently tested; UI visibility and client-supplied IDs are not permission.
- Shared Zod schemas validate runtime inputs. React Hook Form with the shared resolver owns form-level field/root error presentation; server validation remains authoritative.
- `date-fns` is used for calendar validity and date calculations without changing approved timezone semantics. Product date keys are `YYYY-MM-DD` in `Asia/Singapore`.
- Persisted timestamps (`created_at`, `updated_at`, session start/end, correction time) are instants. Date-only planning/reflection keys are not browser-local timestamps.
- Local drafts/autosave attempts are continuity support, never durable saves until owner confirmation.
- Pending migrations (`tasks_next_up_queue.sql`, `focus_session_task_totals.sql`, and any other unapplied migration) cannot be represented as available behavior. Repository SQL is not live-state evidence.

## Recovery and cross-surface rule

A projection may display a source, but only the source owner can report consequential success. Handoffs carry identity, provenance, and confirmed state; they do not copy ownership. On return, show last confirmed state plus pending/failed/local-draft/unavailable limitations. Retry, correction, resume, decline, withdrawal, or departure must remain explicit person choices.

## Acceptance questions

- **RECORD-01:** Can every material displayed record identify one canonical owner and provenance class?
- **RECORD-02:** Are task removal/withdrawal, completion, defer, correction, and hard deletion distinguishable with retained history rules?
- **RECORD-03:** Is Next Up task-owned while Focus remains session-owned, including truthful pending-migration fallback?
- **RECORD-04:** Is unavailable Focus attribution never inferred from selection, duration, or proximity?
- **RECORD-05:** Are daily reflection, custom entries, and session-end entries separate Reflection-owned records with clear links and no replacement/duplication semantics?
- **RECORD-06:** Can correction, withdrawal, deletion, current, historical, superseded, pending, failed, local-draft, unavailable, and disconnected states be distinguished after interruption?
- **RECORD-07:** Are planned, direct, user-provided, source-provided, derived, proposed, factual, and applied meanings kept distinct?
- **RECORD-08:** Do RLS, `requireUserId`, Zod/RHF, date-fns, `Asia/Singapore`, instant timestamps, local-draft, and pending-migration constraints remain testable?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** Canonical ownership, provenance, correction/deletion/withdrawal, continuity, time, identity, and migration-truth rules are resolved for Gate 2. No ownership question remains unknown or unowned.
