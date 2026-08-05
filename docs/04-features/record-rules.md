# MVP Record, Provenance, Correction, and Continuity Rules

**Status:** Draft
**Owner:** Engineering Architect + Product Architect
**Sprint tasks:** P4.1–P4.5, P5.6
**Parent:** [Product Model](../01-product/product-model.md) · [Action and Evidence](../02-systems/action-and-evidence.md) · [Continuity and Interoperability](../02-systems/continuity-and-interoperability.md) · [MVP Masterplan](../current-phase/mvp-implementation-masterplan.md)
**Consumers:** [MVP coherent loop](../03-experience/journeys/mvp-coherent-loop.md) · Today, Tasks, Focus, and Reflection behavior contracts
**Evidence:** [Phase 1 implementation truth](../current-phase/phase-1/implementation-truth-evidence.md) · [Phase 1.5 foundation pattern](../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Review trigger:** A new source owner, record relationship, correction path, persistence path, or continuity state is proposed for the MVP loop.

## Purpose and authority

These rules define which domain owns a record, how its origin is expressed, how corrections remain intelligible, and how context survives interruption or change. They do not replace system semantics, database schemas, or delivery designs. They are draft Gate 2 inputs and do not authorize Phase 3 implementation.

## Ownership matrix

| Record/context | Canonical owner | May project to | Must not become |
|---|---|---|---|
| Task/commitment | Tasks (`tasks`, `task_groups`, task owner paths) | Today, Focus selection, Schedule | Action evidence or outcome by existence/completion alone |
| Focus session | Focus session persistence / Action and Evidence | Today, Focus history, Reflection context | Task completion or outcome |
| Focus attribution | Focus owner when identity/basis is confirmed | Focus history/derived totals | Confirmed attribution while migration/state is unavailable |
| Daily reflection | Reflection persistence (`reflections`) | Today/sidebar, Reflection history | Factual action/evidence |
| Contextual reflection entry | Reflection entry owner (`reflection_entries`) | Focus/history/context views | A second interpretation source with conflicting save semantics |
| Focus session-end reflection | Reflection entry linked to a session; Focus may project it | Focus history and Reflection context | An unrelated duplicate or automatic adaptation |
| Habit definition/completion | Habits (`habits`, `habit_completions`) | Today, Schedule | A second commitment/action loop |
| Planning date/time | Task or Habit source record | Schedule, Today | Evidence that an action occurred |
| Note/context | Notes (`notes` and embedded growth-area records) | Today, Tasks, Reflection, kanban context | A standalone Knowledge authority |
| Derived status/summary | The derived view, with source references | Today/Focus context | A factual record without derivation |

## Provenance classes

Every material record or projection must be understandable as one of:

1. **Direct record:** captured by FlowOS during a represented occurrence; preserve source, timestamp/instant, and relevant identity.
2. **User-provided:** entered, asserted, or corrected by the person; do not present it as direct observation.
3. **Source-provided:** received or referenced from another source; retain source identity, scope, freshness, and connection state.
4. **Derived:** calculated from factual records; retain inputs, rule, and derivation time.
5. **Unverified/unavailable:** present but not reliable or currently accessible; do not overstate it.

Planned, scheduled, selected, or proposed information is not factual evidence merely because it is stored.

## Correction rules

- The owner of a record owns its correction path.
- A correction must identify the record/context changed, the new representation, and that a correction occurred.
- Correcting a reflection or derived summary must not rewrite its supporting factual evidence.
- Correcting factual evidence must not silently change a task commitment, interpretation, or adaptation; the receiving owner must apply any consequential change explicitly.
- A failed correction remains unconfirmed and recoverable; the old confirmed state remains visible until the owner confirms the new state.
- Removal/withdrawal must be distinguishable from completion and correction. Retention details for destructive deletion require the delivery design and release/security review.

## Continuity rules

Use these observable context states:

| State | Meaning |
|---|---|
| Current | Available and relevant to the present context |
| Historical | Earlier context retained for understanding |
| Superseded | Replaced in current role by a later explicit choice |
| Unavailable | Cannot currently be accessed, verified, or refreshed |
| Disconnected | Active source relationship ended; prior context is not silently erased |

Re-entry after interruption restores the last confirmed owner state and identifies pending or uncertain work. Local drafts can support continuity but are not durable records until the owner confirms persistence.

## Phase 1.5 foundation requirements

- Use shared Zod schemas and resolver-driven React Hook Form for admitted form boundaries; invalid fields and root write errors remain observable.
- Use date-fns for calendar validity checks without changing existing timezone semantics.
- Treat date keys as `YYYY-MM-DD` in approved `Asia/Singapore` product timezone; persisted timestamps remain instants; scheduled wall-clock values use approved `HH:mm`/`HH:mm:ss` forms.
- Keep reflection autosave and Focus recovery semantics explicit: local draft/retry is continuity support, not proof of durable save.
- Keep user identity/RLS boundaries on every domain owner. Pending migrations or unverified live state cannot silently become a contract guarantee.

## Validation questions

- **RECORD-01:** Can each displayed core-loop item identify its owner and provenance?
- **RECORD-02:** Does correction preserve the changed record’s history and leave supporting facts intact?
- **RECORD-03:** Can interruption distinguish confirmed, pending, failed, local-draft, unavailable, and historical state?
- **RECORD-04:** Do planning values and elapsed sessions remain distinct from outcomes?
- **RECORD-05:** Are two-account/RLS and pending-migration limitations preserved for release validation?

## Open decisions and change control

P4.5 owns the exact durable retention semantics for destructive deletion, the final representation/fallback for Focus attribution, and the implementation reconciliation of current reflection projections. Delivery designs and validation evidence may be required after Gate 2; these decisions must not be resolved by a UI-only shortcut. Any ownership change updates all consumer contracts and the Gate 2 register.
