# Reflection — Behavior Contract

**Status:** Draft
**Owner:** Product Architect + Engineering Architect
**Sprint tasks:** P1.4, P1.5, P4.5, P5.5
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Authorized feature brief:** [Reflection feature brief](../briefs/reflection.md)
**Participating systems:** [Sensemaking and Adaptation](../../02-systems/sensemaking-and-adaptation.md) · [Action and Evidence](../../02-systems/action-and-evidence.md) · [Continuity and Interoperability](../../02-systems/continuity-and-interoperability.md)
**Affected destinations:** `/reflection`, Today/sidebar reflection path, Focus session-end context
**Journey:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Validation plan:** [Validation plan standard](../validation-plans.md) — feature plan required before delivery
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Behavioral authority:** Reflection owns voluntary interpretation, correction, and adaptation-choice history while preserving factual evidence and person authority.

## Authorized feature boundary

Reflection is the MVP sensemaking and adaptation path. Contextual entry points must converge on understandable ownership and recovery. Reflection does not own factual action records, task state, or automatic direction/commitment changes.

## Participants and authority

| Participant | May do | Owning authority |
|---|---|---|
| Person | Write, pause, save, skip, retry, correct, revisit, and choose adaptation disposition | Person owns reflection meaning and consequential choices |
| Reflection | Maintain draft/save/correction state and interpretation history | `reflections`/entry owner and local draft recovery |
| Focus/Today | Provide optional context | No reflection write without Reflection owner |
| Direction/Commitment | Apply an explicit accepted adaptation to its own state | Receiving system owns resulting state |

## Objects and observable states

| State | Meaning | Must not imply |
|---|---|---|
| Empty | No reflection has been recorded for the context | A deficient day or absent experience |
| Draft | Input exists locally or in an unsaved form | Durable reflection |
| Saving/pending | A durable save is being attempted | Confirmed persistence |
| Saved | Reflection is confirmed durable | Factual truth of every interpretation |
| Save failed/retryable | Draft remains available but durable save is unconfirmed | Lost content or successful save |
| Corrected/superseded | The person changed the interpretation while history remains intelligible | Erased evidence or invalid experience |
| Skipped/left | The person chose not to reflect now | Failure or negative product state |

Reflection content is sensemaking. Related evidence, task state, and Focus records remain separate objects with their own owners.

## Entry conditions and access

- Valid entry is `/reflection`, Today/sidebar, or an explicit Focus session-end handoff.
- Entry may include date/context/session identity, but it must not imply a conclusion about the person’s experience.
- Returning use must restore the latest confirmed reflection and any recoverable draft with clear status.
- Reflection is voluntary; a person may skip, pause, or leave without penalty.

## Behavior rules

1. Given a person enters Reflection, FlowOS must identify the context and distinguish empty, draft, saved, unavailable, and historical information.
2. Given a person edits reflection input, FlowOS must keep it as draft/pending until the Reflection owner confirms durable save.
3. Given sidebar autosave or full-page save is used, both paths must express the same user-visible durable state, error, correction, and retry semantics.
4. Given a save fails, FlowOS must retain the recoverable local draft, state that durable save is unconfirmed, and provide retry without duplicating a confirmed record.
5. Given a person corrects a reflection, FlowOS must preserve the fact of correction and must not rewrite the factual evidence that informed it.
6. Given Focus provides session context, Reflection may relate it to the person’s entry, but must not treat duration as a conclusion or save without the person’s action.
7. Given a person identifies a possible adaptation, FlowOS must present it as a proposal; only an explicit person choice may accept, defer, decline, or apply it through the affected owner.
8. Given no reflection is recorded, FlowOS must offer optional entry or exit without claiming that no action, learning, or outcome occurred.

## Decision and transition table

| Choice | From | Result | What must not happen |
|---|---|---|---|
| Write | Empty/Saved | Draft | No automatic interpretation or adaptation |
| Save | Draft | Saved after owner confirmation | No success claim before confirmation |
| Retry | Save failed | Saving then Saved or failed | No duplicate confirmed record |
| Skip/leave | Any unsaved context | Valid exit; draft follows recovery rule | No negative state |
| Correct | Saved | Corrected/superseded history | No factual evidence erasure |
| Propose adaptation | Saved | Proposed adaptation context | No applied direction/commitment change |
| Accept/defer/decline | Proposed | Explicit choice history | No hidden application |

## Truth, provenance, and uncertainty

Reflection is user-provided sensemaking, not direct evidence. Links to tasks, sessions, sources, or outcomes must remain links/context, not causal proof. Incomplete context remains incomplete. Draft and saved status, correction history, and source/context origin must be inspectable when material.

## Assistance and automation

No automatic insight, diagnosis, causal claim, or adaptation is admitted. A future recommendation must be labeled, traceable to its basis, optional, correctable, and unable to apply a consequential change without person authority.

## Error, interruption, and recovery

- Local drafts are date-scoped using the Phase 1.5 pattern and must not be mistaken for durable records.
- Page hide/unmount or interruption flushes pending work where possible and preserves failure for retry.
- Full-page and sidebar paths must converge on one meaning for saved, failed, corrected, and current states.
- Permission loss or unavailable storage preserves confirmed history and identifies unconfirmed changes.
- A disconnected or stale source remains historical/unavailable rather than being silently rewritten.

## Accessibility and inclusive behavior

Draft, saving, saved, failed, corrected, and unavailable states must be announced in semantic text. Autosave cannot be the only way to understand whether work is durable; an explicit save/retry path remains available. Focus moves logically to validation and recovery messages. Timed prompts, sidebar panels, and session-end handoffs must be dismissible and keyboard/assistive-technology accessible.

## Acceptance behavior and open questions

- **REFLECT-01:** Reflection is optional and never treats absence or brevity as failure.
- **REFLECT-02:** Full-page, sidebar, and session-end paths expose one coherent save/recovery meaning.
- **REFLECT-03:** Draft versus durable save is always truthful and recoverable after failure/interruption.
- **REFLECT-04:** Reflection remains distinct from evidence, insight, recommendation, and applied adaptation.
- **REFLECT-05:** Correction preserves interpretation history and factual evidence.
- **REFLECT-06:** Adaptation requires explicit person choice and owning-system application.

P4.5 owns the remaining record-rule decision: canonical relationship among daily reflection, custom entries, and Focus session-end append records. Product and Engineering Architects must resolve it before Gate 2 approval.

## Change control

Revise this contract if reflection becomes mandatory, automated interpretation is admitted, or a contextual path gains separate persistence ownership. Parent-system and decision-record review is required.
