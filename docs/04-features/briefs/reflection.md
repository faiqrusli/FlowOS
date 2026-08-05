# Reflection — Feature Brief

**Status:** Draft
**Owner:** Product Architect
**Sprint tasks:** P1.4, P1.5, P4.5
**Foundation:** [Phase 1.5 foundation pattern](../../11-archive/phases/phase-1.5/validation-and-date-time-pattern.md)
**Parent:** [Product Model](../../01-product/product-model.md) · [Sensemaking and Adaptation System](../../02-systems/sensemaking-and-adaptation.md) · [Action and Evidence System](../../02-systems/action-and-evidence.md)
**Standard:** [Feature Briefs](../feature-briefs.md)
**Evidence:** [Phase 1 implementation truth](../../current-phase/phase-1/implementation-truth-evidence.md)
**Next contract:** [Reflection behavior contract](../behavior/reflection.md)
**Review trigger:** A change to reflection ownership, save/correction semantics, voluntary participation, or the handoff to adaptation.

## Feature decision

**Proceed to behavior contract.** Reflection is admitted as the MVP sensemaking and adaptation path. Full-page, sidebar, and session-end contexts must be made understandable as one bounded record model before Phase 3 implementation.

## Person need and context

“I need a place to record what I noticed, what constrained or helped me, and what I may want to change, without being forced to explain my whole day or pretend an interpretation is a fact.”

The current build supports full-page reflection, sidebar autosave, custom entries, and session-end capture. Phase 1 identified dual save paths, weekly partial behavior, and inconsistent recovery semantics as contract gaps.

## Desired outcome

The person can voluntarily capture, pause, correct, and revisit sensemaking connected to relevant action or context, and can choose whether any adaptation is proposed or applied.

## Evidence and assumptions

- **Observed:** Reflection persistence is user-scoped; autosave keeps a date-scoped local draft and retries failed saves.
- **Observed:** Focus session-end capture appends to Focus context and weekly review remains secondary/partial.
- **Assumption:** Daily reflection is the core record; contextual entries may reference the same sensemaking model without forcing a single ritual.
- **Uncertainty:** The final relationship between daily records, custom entries, and Focus append records requires the record-rules contract.

## Feature hypothesis

If reflection keeps facts, interpretation, uncertainty, and adaptation choice distinct while making save/recovery predictable, it can help the person learn from experience without turning disclosure or positivity into a product obligation.

## Scope

- Voluntary daily and contextual reflection capture from Reflection, Today/sidebar, and Focus session-end paths.
- Draft, save, retry, correction, pause, skip, and re-entry behavior.
- Links to relevant evidence, commitments, or sessions when the person chooses the context.
- Explicit proposal/acceptance/defer/decline handoff for adaptation; no automatic change.
- Historical visibility that distinguishes current, superseded, corrected, and unavailable context.

## Non-goals and exclusions

- No required daily ritual, sentiment score, disclosure score, positivity score, or completeness claim.
- No automatic causal explanation, diagnosis, insight certainty, or direction/commitment change.
- No standalone Weekly Review product admission; the partial route remains secondary.
- No second persistence owner hidden behind a contextual surface.

## Authority, trust, and risk

The person owns reflection content and controls whether to save, correct, skip, or apply an adaptation. Reflection owns interpretation and adaptation proposal history; the affected direction/commitment owner applies an explicit change. A corrected reflection must preserve the fact and context of correction without rewriting factual evidence.

## Alternatives and tradeoffs

- **Separate daily, sidebar, and session-end products:** preserves local affordances but creates conflicting records.
- **One forced reflection workflow:** simplifies implementation but violates voluntary sensemaking.
- **One contract with contextual entry and explicit ownership:** chosen for MVP; requires careful record and recovery rules.

## Next contract and open questions

The behavior contract must define draft versus saved state, autosave truth, correction, entry/exit, Focus handoff, evidence links, and adaptation choices. Record rules must resolve whether session-end entries are linked records or projections of the daily reflection.

## Change control

Revisit this brief if Reflection becomes mandatory, gains autonomous interpretation, or changes the meaning/ownership of evidence or adaptation. Such a change requires parent review and a decision record.
