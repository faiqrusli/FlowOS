# Reflection - Design Specification

**Status:** Design Architect complete; checkpoint and cross-surface review completed 2026-08-05; Gate 2 PASSED; Phase 3 authorized
**Owner:** Design Architect
**Authorized behavior contract:** [Reflection behavior contract](../../04-features/behavior/reflection.md)
**Authorized brief:** [Reflection feature brief](../../04-features/briefs/reflection.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md) - Sensemaking and optional Adaptation
**Affected destinations:** [Information Structure](../../03-experience/information-structure.md) - Reflection, Today context, Focus session-end entry, sidebar/full-page entry, and reflection history
**Reusable standards:** [Design System Architecture](../design-system-architecture.md), [Design System v3](../DESIGN_SYSTEM_V3.md), [Tokyo Night Warm](../DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md), [Content Standards](../content-standards.md), [Accessibility Standards](../accessibility-standards.md), [Design Implementation Map](../design-implementation-map.md)
**Design exceptions:** None
**Validation plan:** [Validation plan standard](../../04-features/validation-plans.md) and the `REFLECT-*` acceptance questions below; a feature-specific delivery validation plan is a downstream Engineering Architect artifact.
**Review trigger:** Any change to Reflection record identity, save ownership, daily/custom/session-end relationship, correction/withdrawal, voluntary entry, adaptation handoff, or recovery semantics.

## Identity and status

This document is the feature-specific design authority for the approved Reflection behavior during Phase 2. Its status, owner, parents, affected destinations, reusable standards, exceptions, and validation reference are recorded in the metadata above.

## Authorized behavior and scope

Reflection inherits its brief, behavior contract, record rules, supporting-domain decisions, and journey contract. It is voluntary, user-provided sensemaking. Reflection owns daily records, custom entries, Focus session-end entries, correction, withdrawal, and skip state. A receiving domain owns any applied adaptation.

The daily reflection, a custom entry, and a Focus session-end entry are separate records with clear identity/history. A session-end entry is appended and linked; it does not replace the daily reflection. A save does not silently apply a commitment, schedule, task, habit, Focus, or other source mutation.

## Experience intent

Give a person a quiet, voluntary place to describe meaning and uncertainty, understand what context is factual versus interpretive, recover writing without mistaking a draft for a saved record, and decide whether a proposed adaptation should remain unapplied or move to its receiving owner.

## Information hierarchy and access

### Reflection destination

The authenticated Reflection destination is a direct Workspace peer. The main reading order is:

1. `Reflection` heading with date/context identity, including the product `Asia/Singapore` date key where daily reflection applies.
2. Record identity/type: Daily reflection, Custom entry, or Focus session-end entry. The type is never implied only by placement.
3. Record status: loading, empty, local draft, saving/pending, saved/current, historical, corrected/superseded, skipped/withdrawn, failed, unavailable, or disconnected.
4. The editor and the current confirmed/local values, with save state adjacent to the writing surface.
5. Optional factual/source context, such as a linked concluded Focus session, clearly marked as source-provided/direct context rather than interpretation.
6. Explicit reflection actions: Save, Retry, Correct, Withdraw, Skip, Leave, and proposal actions where the contract permits them.
7. Historical entries and relationships, available without presenting them as current.

The visual hierarchy gives writing room and calm attention. It does not make Reflection mandatory, convert it into a score, or claim that a person must complete a daily ritual.

### Record identity and entry paths

Direct entry opens a date-scoped daily record or a custom entry as selected by the person. A Focus session-end entry carries the concluded session identity and is presented as a separate appended entry. Today and other contextual links preserve record identity and source context. Sidebar and full-page forms are two entry expressions of the same Reflection owner and recovery model, not separate save owners.

### Editor anatomy

Every editor exposes:

- record type and identity;
- selected date or source/session relationship;
- editable user-provided content;
- local/saving/saved/failed status;
- source/link status and provenance where material;
- validation/root error feedback; and
- next available action, including voluntary leave, retry, correction, withdrawal, skip, or proposal handling.

## State and semantic expression

### Default, loading, empty, partial, stale, and degraded states

| State | Normative expression | Available action and constraint |
|---|---|---|
| Default / saved/current | Show the identified daily/custom/session-end record as owner-confirmed user-provided interpretation. | Edit/correct, withdraw, propose adaptation, or leave according to the confirmed state. |
| Loading | Preserve record heading/type/context and show a neutral loading status. Do not render blank fields as an empty saved record. | Wait, navigate safely, or leave. Do not enable a conflicting save until the owner state is known. |
| Empty | State that Reflection confirmed no record for the selected date/context. Offer voluntary capture or leave. | Start writing or leave; no shame, urgency, or negative inference. |
| Partial | Show available entries with their identities and freshness while labeling missing Focus/Notes/source context separately. Missing context is not missing reflection. | Write or inspect confirmed Reflection; retry the missing source context. |
| Stale | Show last-confirmed Reflection and freshness/history language. Do not present it as current if the owner cannot refresh it. | Retry, inspect history, correct at owner, or leave. |
| Unavailable | Identify that Reflection owner or linked source cannot be read/written. Preserve local/historical context where safe. | Retry, keep a clearly local draft, or leave. Do not show unavailable as empty. |
| Disconnected | Preserve the reflection and identify the ended Focus/Notes/source relationship. | Inspect the Reflection owner or leave; do not silently remove the entry. |
| Error | Name the read, validation, save, correction, or withdrawal failure; preserve content and last confirmed record. | Retry the same operation, correct, discard only by explicit choice, or leave. |

### Reflection state and semantic expression

| Contract state | Visual/content treatment | Must not imply |
|---|---|---|
| Empty | Voluntary empty explanation and optional editor entry. | Failure, inactivity, or required completion. |
| Local draft | Strong but calm `Local draft - not saved` status tied to the values. | Durable Reflection record. |
| Saving/pending | `Saving - awaiting confirmation`; preserve values and record identity. | Saved/current or applied adaptation. |
| Saved/current | Owner-confirmed record marked as user-provided interpretation. | Direct factual evidence or universal truth. |
| Historical | Date/source/relationship visible with historical treatment. | Current meaning unless selected. |
| Corrected/superseded | Current explicit representation links to prior history/meaning. | Erasure of prior interpretation or correction of source facts. |
| Skipped/withdrawn | Explicit state and voluntary meaning. | Evidence that nothing happened or deletion of all history. |
| Failed | Last confirmed record and input remain visible; operation failure is named. | Requested save/correction/withdrawal happened. |
| Unavailable/disconnected | Owner/source limitation visible with prior history retained. | Empty record, absent experience, or a guessed relationship. |

### Pending, confirmed success, failed, and rollback states

| Operation | Pending expression | Owner-confirmed success | Failed/rollback expression |
|---|---|---|---|
| Daily/custom/session-end save | Preserve record identity and values with `Saving - awaiting confirmation`. | Mark the exact record type `Saved` and keep it user-provided. Session-end success shows an appended linked entry, not a daily replacement. | Restore the prior confirmed record or empty state; preserve input as local draft and offer Retry. |
| Autosave/flush | Identify that a save attempt is pending; local values remain non-durable. | Only an owner-confirmed response changes the durable status to Saved. | Keep `Local draft - not saved` or prior confirmed record; never silently drop values. |
| Correction | Show the current record and requested corrected representation as pending. | Mark corrected/superseded with history relationship. | Restore prior confirmed interpretation and preserve correction input for retry. |
| Withdrawal/skip | State the requested withdrawal/skip is pending and keep prior current state authoritative. | Show explicit skipped/withdrawn state with retained history as defined by owner. | Restore prior confirmed record; do not show it as withdrawn/skip. |
| Adaptation proposal/handoff | Mark proposal as proposed/pending receiving-owner action. | Show applied only after the receiving owner confirms application; Reflection retains proposal provenance. | Keep proposal deferred/declined/unapplied or last confirmed state; do not claim source mutation. |

Rollback is a restoration of the last confirmed owner state, not an implicit new reflection or deletion. A successful Reflection save never applies an adaptation. A failed Focus session-end Reflection save does not undo the confirmed Focus session.

### Interruption and re-entry

Page hide, navigation, network loss, process interruption, or closing a sidebar can leave local values or a pending owner write. Re-entry shows, in one visible status area:

1. record type and identity;
2. last confirmed record state;
3. local draft values, pending operation, failed operation, or unavailable source;
4. link/source status and freshness; and
5. explicit choices to retry, reconcile, correct, withdraw, skip, discard local values, or leave where allowed.

Discarding a local draft is always an explicit person choice. A local draft is never labeled Saved. Re-entry from Focus preserves session identity and factual context; it does not make Reflection own Focus facts. Re-entry from Today converges on the same Reflection owner. Sidebar-to-full-page transition preserves record identity, content, and save/recovery status.

### Ownership, provenance, uncertainty, and recovery

| Context | Canonical owner/provenance | Design treatment |
|---|---|---|
| Daily reflection | Reflection; user-provided interpretation keyed by `Asia/Singapore` date | Label daily record and date; keep interpretation distinct from facts. |
| Custom entry | Reflection; separate user-owned record | Preserve its own identity/history; do not merge into daily record. |
| Focus session-end entry | Reflection; appended custom entry linked to concluded Focus session | Show Focus identity/facts as source context; Reflection owns save. No replacement or duplicate daily save. |
| Focus/task/habit evidence | Source owner; direct or source-provided factual context | Label source and scope. Reflection may quote/link but cannot rewrite. |
| Derived summary | Identified derived read model | Mark derived and retain source/rule context where material. |
| Adaptation proposal | Reflection; user-provided proposed change | Show proposed/unapplied until receiving owner confirms. |
| Applied adaptation | Receiving source owner | Reflection may show the confirmed relationship/history; it cannot claim application from proposal alone. |
| Local draft | Client continuity | Show local/not saved and offer explicit recovery/discard. |
| Unavailable/disconnected | Owner/source relationship cannot be verified | Preserve known Reflection/history and state the limitation; do not infer absence. |

Every Reflection owner boundary remains subject to `requireUserId()`, user-scoped filters/RLS, shared Zod/RHF validation, `date-fns`, `Asia/Singapore` date keys, instant timestamps, non-durable local drafts, and unavailable pending migrations/sources. The design keeps these constraints legible without inventing technical behavior.

## Interaction and decision behavior

- The editor makes record type and date/session identity visible before writing.
- Daily, custom, and session-end entry paths use the same save/recovery status treatment while keeping records distinct.
- Save is voluntary and owner-confirmed. Autosave/flush status is disclosed as pending/local until Reflection confirms persistence.
- Correct creates an explicit corrected/superseding representation and preserves traceable history. It does not rewrite Focus/task/habit facts.
- Withdraw and Skip are distinct from Save and from deleting history. Their consequence is stated before confirmation.
- An adaptation proposal is visibly proposed and user-provided. Accept/apply routes to the receiving owner; Reflection does not provide a hidden commitment mutation.
- Decline/defer/leave are valid and do not infer that no experience occurred.
- A failed operation keeps input and prior confirmed state. Retry repeats the same owner operation; it does not create a duplicate entry.
- A session-end entry is offered only in the context of a concluded Focus session and is labeled as an appended Reflection entry.

## Content and communication

### Content and status language

| Meaning | Preferred expression | Avoid |
|---|---|---|
| Voluntary entry | `Add a reflection` / `You can write something or leave.` | `Complete your reflection` or moral pressure |
| Record type | `Daily reflection`, `Custom entry`, `Focus session-end entry` | Blending all entries into `Today’s reflection` |
| Interpretation | `User-provided reflection` / `Your interpretation` | `Evidence`, `Fact`, or objective certainty |
| Source context | `From concluded Focus session` with session identity | Making source facts appear authored by Reflection |
| Draft | `Local draft - not saved` | `Saved locally` if that wording implies durable owner persistence |
| Pending | `Saving - awaiting confirmation` | `Saved` before owner response |
| Saved | `Saved reflection` plus record type | `Outcome recorded` or `Truth established` |
| Corrected | `Corrected reflection; earlier version retained in history.` | Erased or rewritten meaning |
| Withdrawn/skipped | `Reflection withdrawn` / `Skipped for this entry` | `Nothing happened` or `Failed to reflect` |
| Proposed adaptation | `Proposed change - not applied` | `Apply change` when no receiving-owner confirmation exists |
| Applied adaptation | `[Receiving owner] confirmed the change was applied.` | Claiming application from a Reflection save |
| Failed | `[Operation] was not confirmed. Your last confirmed reflection is unchanged.` | Blame, silent loss, or an unqualified success toast |
| Unavailable | `[Owner/source] is unavailable; known reflection history is preserved.` | Empty or absent interpretation claim |

Content follows [Content Standards](../content-standards.md), avoids anthropomorphic certainty, and makes source, scope, freshness, consequence, and next action available in context. Date-only display uses the product `Asia/Singapore` date key; persisted timestamps are instants.

## Responsive and adaptive behavior

| Condition | Expression |
|---|---|
| Desktop / wide full page | Use the Reflection canvas (Surface 3) with record identity/date, editor, save state, and source context in a calm primary region. History and supporting context remain subordinate and inspectable. |
| Sidebar entry | Use the existing utility/sidebar region without changing ownership or save semantics. The sidebar identifies record type, identity, local/saved status, and recovery before the person leaves or expands. |
| Tablet / medium | Preserve the same record order and status. Supporting context may move below or into an explicit disclosure; material source limitation and recovery cannot be hidden. |
| Mobile / narrow | Use a single-column editor with record identity/date, status, writing area, source context, primary save/retry, and voluntary exit/proposal actions. A full-page transition preserves values and record identity. |
| Touch / coarse pointer | Separate Save, Leave, Withdraw, Skip, and proposal actions; use explicit confirmation for consequential withdrawal/application paths. Do not rely on hover. |
| Slow/interrupted connection | Keep local draft and last confirmed record visible. Pending is not Saved; unavailable linked context is labeled. |
| Reduced motion | Avoid auto-expanding panels or distracting save animations. Status text and focus identify state changes. |

## Accessibility requirements

### Keyboard and focus behavior

- Provide a skip link to Reflection main content and preserve global navigation.
- DOM order is heading/date/type, record status, editor, source/link context, validation/root errors, save/recovery actions, and historical/proposal context.
- The editor is keyboard-operable with labels and visible focus rings. Save, Retry, Correct, Withdraw, Skip, Decline, Leave, and proposal handoff controls are explicit controls.
- Autosave or save status never steals focus. Pending changes do not disable safe leave; they disclose the recovery consequence.
- On validation failure, focus moves to the first invalid field or an error summary. On owner-confirmed save/correction/withdrawal, focus moves to the durable status or changed record heading when initiated by the person.
- On failed save, focus moves to the error/retry region and content remains intact. On sidebar/full-page transition, focus moves to the same record heading/editor context without losing cursor/content where technically supported.
- Confirmation dialogs for withdrawal or receiving-owner application have accessible consequence text, keyboard cancel, and predictable focus restoration. They do not silently apply a change.

### Screen-reader semantics

- Use one `main` landmark headed `Reflection`; identify the editor and record context as labeled regions.
- Expose record type, date/session identity, source/link state, provenance, save status, local-draft disclosure, and available next action as semantic text.
- Associate field validation and root persistence errors with the editor and announce them in a concise live region. Do not announce every autosave attempt as a disruptive alert.
- A saved daily record, custom entry, and session-end entry have distinct accessible names. The session-end entry name includes its concluded Focus session identity.
- Proposed/unapplied, applied, corrected, historical, withdrawn, skipped, unavailable, disconnected, pending, and failed states are textually available and not color-only.
- Adaptation controls announce that Reflection is handing off a proposal to another owner. The receiving owner’s confirmed result is separate status from the Reflection save.
- Sidebar/full-page changes preserve the same record identity in the accessibility tree and do not create duplicate landmarks or duplicate save announcements.

## Reusable standards and exceptions

- Map Reflection to the active Surface 0–10 ladder: shell Surface 0, workspace Surface 1, Reflection canvas Surface 3, reflection entries/context cards Surface 4, editor/input Surface 5, hover Surface 6, selected/focused entry Surface 7, sidebar/floating utility Surface 2 or 7 according to shell placement, and confirmation dialogs Surface 9.
- Use the locked Tokyo Night Warm / Soft Indigo palette. Reflection’s identity must not use a parallel accent; semantic colors support status only with text.
- Give the writing surface calm space and readable contrast. Do not use decorative progress, streak, score, or urgency treatment.
- Reuse existing editor, sidebar, date/context, status, disclosure, dialog, skeleton, error/retry, button, and focus-ring patterns. Sidebar and full page are composition variants, not separate components with separate save authority.
- Prefer tonal elevation and whitespace over dense borders. Critical recovery and consequence controls are visible without hover.
- Respect reduced motion, contrast, target-size, focus, timing, and live-region requirements in [Accessibility Standards](../accessibility-standards.md).

## Annotated artifacts

### Normative Reflection wireframe

```text
Application shell / global navigation
└── main [Reflection]
    ├── h1 Reflection + date/session identity + record type
    ├── record status [empty | local draft | saving | saved | historical | corrected |
    │                  skipped/withdrawn | failed | unavailable | disconnected]
    ├── editor [user-provided interpretation]
    │   ├── validation/root errors
    │   └── save/retry/leave controls
    ├── factual/source context [optional, source-labeled]
    ├── proposal context [proposed | receiving-owner handoff | applied/declined]
    └── history/relationships [daily, custom, session-end remain distinct]
```

The wireframe establishes identity, state, source, and recovery priority. It does not prescribe editor implementation, autosave mechanics, or receiving-owner APIs.

## Handoff, validation, and open questions

### Delivery constraints

- Preserve Reflection as the sole durable write owner for daily, custom, and session-end reflection records.
- Preserve separate record identity/history and append-only relationship for Focus session-end entries.
- Preserve local draft/autosave non-durability until owner confirmation, including sidebar/full-page re-entry.
- Preserve factual/source context versus user-provided interpretation versus derived/proposed/applied meaning.
- Preserve receiving-owner authority for adaptation and `requireUserId()`, user-scoped RLS, shared Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, and unavailable-source behavior.

### Validation questions

- **REFLECT-01:** Can a person enter directly, from Today, or at Focus session end and understand which record is being edited or appended?
- **REFLECT-02:** Are empty, local-draft, saving, saved, failed, corrected, historical, skipped/withdrawn, unavailable, and disconnected states distinguishable?
- **REFLECT-03:** Does a local draft or autosave attempt remain non-durable until Reflection confirms persistence?
- **REFLECT-04:** Does Reflection remain distinct from factual evidence, derived summaries, recommendations, and applied adaptation?
- **REFLECT-05:** Do correction and withdrawal preserve interpretation history and leave source facts unchanged?
- **REFLECT-06:** Is the daily reflection distinct from custom entries and appended Focus session-end entries without duplicate or replacement semantics?
- **REFLECT-07:** Can a person propose, accept, defer, decline, or leave an adaptation without Reflection mutating commitments implicitly?
- **REFLECT-08:** Are `requireUserId`, RLS, Zod/RHF, `date-fns`, `Asia/Singapore`, instant timestamps, local-draft semantics, and unavailable migration/source behavior testable?

### Design Architect checkpoint

Completed 2026-08-05. The specification was checked against the Reflection brief, behavior contract, journey contract, record rules, supporting-domain decisions, reusable standards, and all `REFLECT-*` questions. No new record type, save owner, mandatory ritual, adaptation authority, source fact, or route was introduced.

### Open questions

No product or design decision is unresolved for this specification. Engineering must confirm implementation details and validation evidence in the next hat; any pending migration or unavailable source remains unavailable until verified.

## Change control

Changes to record identity/relationship, save ownership, correction/withdrawal meaning, voluntary entry, or adaptation authority reopen the Reflection brief/behavior contract, record rules, and cross-surface journey review. Visual or content refinements that preserve those contracts follow the feature-specification review path.
