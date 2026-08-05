# Reflection - Behavior Contract

**Status:** Product Architect complete; approved for Design Architect handoff on 2026-08-05
**Owner:** Product Architect (Founder); technical persistence owner is Reflection
**Sprint tasks:** P1.4, P1.5, P4.5, P5.5
**Authorized brief:** [Reflection feature brief](../briefs/reflection.md)
**Parent systems:** [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md) - [Action and Evidence](../../02-systems/action-and-evidence.md) - [Continuity and Interoperability](../../02-systems/continuity-and-interoperability.md)
**Journey stage:** Sensemaking and optional Adaptation
**Canonical owner:** Reflection owns daily records, custom entries, session-end entries, correction, withdrawal, and skip state. Receiving domains own applied adaptation.
**Consumers:** `/reflection`, sidebar reflection, Focus session-end entry, Today, and reflection history
**Record rules:** [MVP record rules](../record-rules.md)
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)

## Scope and non-goals

Reflection is voluntary, user-provided sensemaking. It may refer to factual records but must not rewrite them. It may propose adaptation but must not apply commitments or other consequential changes without an explicit receiving-owner action.

## Record model and authority

| Record | Meaning | Owner |
|---|---|---|
| Daily reflection | Canonical date-scoped sensemaking record for one user/date key | Reflection |
| Custom entry | Separate user-owned reflection record with its own identity/history | Reflection |
| Session-end entry | Custom entry linked to a concluded Focus session and appended to reflection history | Reflection; Focus only supplies handoff context |
| Local draft | Recoverable client values not confirmed durable | Client continuity only |
| Adaptation proposal | User-provided proposed change with explicit status | Reflection until receiving owner applies/declines |

A session-end entry never silently replaces the daily reflection, and a daily save never silently overwrites custom/session-end history. The person may relate records, but relationship is not an automatic commitment mutation.

## State model

| State | Meaning | Required truth language |
|---|---|---|
| Empty | No confirmed reflection record for the selected date/context | Voluntary absence, not failure |
| Local draft | Values held locally for recovery | Not a durable save |
| Saving/pending | Owner write is in flight | Not confirmed |
| Saved/current | Durable owner-confirmed record | User-provided interpretation, not fact |
| Historical | Prior saved entry retained for context | Not current unless selected |
| Corrected/superseded | A later explicit revision replaced the current representation | Prior meaning/history remains traceable |
| Skipped/withdrawn | Person explicitly declined or retracted a reflection/proposal | Not evidence that nothing happened |
| Failed | Save/correction/withdrawal was not confirmed | Prior confirmed state remains |
| Unavailable | Owner/source cannot be read or written | Do not show an empty record |
| Disconnected | Linked Focus/Notes/source relationship ended | Preserve prior entry and disclose link limitation |

## Entry, re-entry, pause, exit, and correction

- **Direct entry:** the person opens Reflection for a date or starts a custom entry without a Focus session.
- **Deep entry:** Today, Focus session end, or another owner provides context and record identity; Reflection remains the write owner.
- **Re-entry:** restore the last confirmed record plus local draft/pending/failed status. Do not label a local draft saved.
- **Pause:** leave the editor, close the sidebar, or defer sensemaking. Retain a local draft only with explicit local-draft disclosure; no durable record or adaptation occurs.
- **Exit:** save, retry, correct, withdraw, skip, propose adaptation, decline proposal, or leave. Every exit is valid and voluntary.
- **Correction:** Reflection creates an explicit corrected/superseding representation while preserving factual source records and enough history to understand the change. Correcting interpretation does not correct Focus/task facts.

## Transitions and adaptation handoff

| Person action | Reflection result | Unchanged state |
|---|---|---|
| Type/close | Local draft or no record | No durable save unless confirmed |
| Save daily reflection | Reflection-owned saved/current daily record | Tasks, Focus, habits, and evidence unchanged |
| Add session-end entry | Separate saved custom entry linked to Focus session | Daily reflection not replaced |
| Correct/withdraw entry | Reflection history records the correction/withdrawal | Supporting facts remain intact |
| Propose adaptation | Proposed, user-provided adaptation | No commitment or schedule mutation |
| Accept/apply adaptation | Explicit handoff to receiving owner; that owner confirms application | Reflection proposal remains historical/provenance context |
| Decline/defer | Proposal remains declined/deferred/unapplied | No receiving-domain change |
| Skip/leave | No new durable record or explicit skipped state as applicable | No negative inference |
| Retry failed write | Owner retries same record operation | Last confirmed state remains authoritative |

## Persistence, permissions, and validation

- All Reflection reads/writes resolve `requireUserId()` and use user-scoped filters plus RLS for `reflections` and `reflection_entries`. A client date, route, or Focus link cannot authorize another user's record.
- Reflection forms use shared Zod schemas and React Hook Form with the shared resolver. Required/length/format errors and root save errors remain associated and recoverable.
- Daily date keys use `Asia/Singapore` and `date-fns` calendar checks; persisted `created_at`, `updated_at`, and linked session timestamps remain instants. A browser timezone cannot move an entry to a different product date.
- Autosave or flush may attempt an owner write, but only an owner-confirmed response is durable. Local drafts never count as saved records.
- Pending migrations or unverified sources are unavailable behavior and must not be represented as available relationships or history.

## Loading, empty, partial, unavailable, and error behavior

- **Loading:** daily/custom entries are being requested; do not show blank fields as an empty saved record.
- **Empty:** owner confirmed no record for the selected date/context; offer voluntary capture or leave.
- **Partial/stale:** show available daily/custom/session entries with record identity and freshness; missing source context is not missing reflection.
- **Unavailable/disconnected:** preserve known local/historical context and disclose what source or owner cannot be reached; allow local draft/retry without claiming save.
- **Error/failed:** identify the save/correction/withdrawal failure, preserve the input and prior confirmed record, and offer retry or leave.

## Interruption and recovery

Page hide, navigation, network loss, or closing a sidebar can leave a local draft or pending write. Re-entry shows which values are local, pending, saved, failed, or unavailable and offers retry/reconcile/discard/leave according to explicit person choice. A failed session-end entry does not undo a concluded Focus session. A successful reflection save does not apply an adaptation.

## Evidence, provenance, and authority

Factual Focus/task/habit records remain direct or source-provided evidence; a reflection is user-provided interpretation; a derived summary remains derived; an adaptation is proposed until the receiving owner confirms applied state. Reflection may quote or link evidence but must not recast an interpretation as a direct fact.

## Accessibility

The editor exposes date, record type, source/link status, save state, local-draft disclosure, errors, and next available action as semantic text. Validation and save failures are announced and associated with fields. Autosave status does not steal focus. Keyboard and assistive-technology users can save, retry, correct, withdraw, skip, decline, and leave; responsive sidebar/full-page changes preserve record identity and recovery.

## Acceptance questions

- **REFLECT-01:** Can a person enter directly, from Today, or at Focus session end and understand which record is being edited or appended?
- **REFLECT-02:** Are empty, local-draft, saving, saved, failed, corrected, historical, skipped/withdrawn, unavailable, and disconnected states distinguishable?
- **REFLECT-03:** Does a local draft or autosave attempt remain non-durable until Reflection confirms persistence?
- **REFLECT-04:** Does Reflection remain distinct from factual evidence, derived summaries, recommendations, and applied adaptation?
- **REFLECT-05:** Do correction and withdrawal preserve interpretation history and leave source facts unchanged?
- **REFLECT-06:** Is the daily reflection distinct from custom entries and appended Focus session-end entries without duplicate or replacement semantics?
- **REFLECT-07:** Can a person propose, accept, defer, decline, or leave an adaptation without Reflection mutating commitments implicitly?
- **REFLECT-08:** Are `requireUserId`, RLS, Zod/RHF, date-fns, `Asia/Singapore`, instant timestamps, local-draft semantics, and unavailable migration/source behavior testable?

## Product Architect checkpoint

**Approved by Founder/Product Architect on 2026-08-05.** The contract is ready for design specification. Design may express voluntary sensemaking and recovery but may not create a second save owner or implicit adaptation path.
