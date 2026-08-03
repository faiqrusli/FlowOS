# Direction and Commitment System

**Status:** Active
**Authority:** Canonical system rules for chosen direction and present commitments
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../00-constitution/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System interface contracts, experience architecture, feature briefs, behavior contracts, delivery designs
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes the meaning, lifecycle, ownership, or relationship of direction and commitment; or evidence shows that the current distinction is not understandable to users.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain system rules for direction and commitment, ensure system invariants are preserved, and coordinate with Design Architect on experience implications

### Modification Process
1. Product Architect proposes system changes (based on feature requirements or user evidence)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose system rule updates, maintain invariants, coordinate with Design Architect
- Requires approval for: Changes to direction/commitment meaning, lifecycle rules, or system invariants

---

## 1. Scope

This document defines the system that represents a person’s chosen direction and their present commitments.

It answers:

> How does FlowOS preserve what a person has chosen to serve and what they have deliberately chosen to take on now?

It does not define action records, evidence, reflection, recommendations, interface layout, technical schemas, source-provider mechanics, or release sequencing. Those responsibilities belong to the Action and Evidence System, Sensemaking and Adaptation System, Experience Architecture, engineering documents, and delivery documents.

---

## 2. System Responsibility

The Direction and Commitment System has four responsibilities:

1. represent a person’s chosen direction without treating it as permanent or mandatory;
2. distinguish a present commitment from an earlier intention or future plan;
3. connect commitments to direction when that relationship is meaningful; and
4. preserve the history of explicit revision, deferral, withdrawal, and renewal without moralizing those changes.

The system enables FlowOS to provide relevant context for a person’s present choices. It does not decide what deserves attention on the person’s behalf.

---

## 3. Direction

### Definition

Direction is the chosen context that helps a person judge what deserves attention. It may be expressed through a value, responsibility, desired future, priority, area of concern, or explicit goal.

Direction establishes meaning. It does not establish a command.

### Direction rules

- A person may create, revise, pause, resume, or retire a direction.
- A direction remains user-defined. No system inference, external source, or recommendation may silently create or materially alter one.
- Direction can be broad or concrete. The system must not require a person to formalize a complete hierarchy before receiving value.
- A direction may exist without an active commitment, and a commitment may exist without an explicit direction.
- A direction may be connected to multiple commitments when the relationship clarifies meaning.
- Retired direction remains historical context unless the person explicitly removes it under an applicable data-control rule.

### Direction states

| State | Meaning | Must not imply |
|---|---|---|
| **Active** | The person currently recognizes this direction as relevant. | That it must receive immediate attention. |
| **Paused** | The person has deliberately suspended active relevance for now. | Failure, abandonment, or deletion. |
| **Retired** | The person no longer treats this direction as current. | Erasure of the historical relationship to prior commitments. |

Direction state describes current relevance. It does not measure achievement, identity, or personal worth.

---

## 4. Commitment

### Definition

Commitment is a present, intentional choice to direct attention or effort toward something. It represents what a person has actively chosen to take on, not merely what they once hoped or planned to do.

A commitment may arise from an explicit direction, a practical need, an external responsibility, an emerging opportunity, or another source of context. Its value does not depend on whether it can be linked to a named direction.

### Commitment rules

- A commitment must be distinguishable from an intention, a plan, an action, and an outcome.
- A person controls whether a proposed commitment becomes active.
- A commitment may be revised before, during, or after action when the person or reliable evidence makes revision appropriate.
- A commitment may be deferred, withdrawn, superseded, partially met, or fulfilled. These are different historical outcomes and must not collapse into one generic failure state.
- A commitment may have zero, one, or multiple direction links. Multiple links must be meaningful rather than decorative categorization.
- A commitment may retain a source reference without transferring the source’s ownership to FlowOS.

### Commitment states

| State | Meaning | Must not imply |
|---|---|---|
| **Proposed** | A possible commitment exists but the person has not adopted it. | An obligation, active work, or future action. |
| **Active** | The person currently recognizes the commitment as live. | That action is occurring at this moment. |
| **Deferred** | The person has intentionally moved the commitment out of its prior present context. | Deletion, failure, or loss of importance. |
| **Revised** | The commitment’s scope, context, or relationship changed explicitly. | That the original commitment never existed. |
| **Withdrawn** | The person has decided not to continue the commitment. | A moral judgment or erased history. |
| **Superseded** | A later commitment has explicitly replaced this one. | Automatic completion. |
| **Partially met** | Some intended result or action occurred, but the commitment remains materially incomplete or changed. | A simple completion state. |
| **Fulfilled** | The person recognizes the commitment as sufficiently met in its current form. | A universal measure of success or permanent progress. |

System interface contracts may define further state transitions only when they preserve these meanings.

---

## 5. Direction–Commitment Relationships

The system maintains the following relationship rules:

| Relationship rule | Meaning |
|---|---|
| Direction may inform commitment | A chosen direction can help a person decide whether to take on a commitment. |
| Commitment need not prove direction | Practical, restorative, or emergent commitments remain valid without explicit direction links. |
| Commitment may serve multiple directions | One commitment can genuinely support more than one chosen context. |
| Direction does not guarantee commitment | A direction may remain active even when it has no current commitment. |
| A link is explicit or clearly attributed | The product must not invent a directional relationship merely to make activity appear aligned. |
| Relationship history is preserved | Later revision of a direction or commitment does not erase the meaning it held when linked. |

The system should help a person understand connections they chose or confirmed. It must not force all life activity into a goal hierarchy.

---

## 6. Inputs and Outputs

| Type | System input or output | Responsibility |
|---|---|---|
| Input | User-created or user-confirmed direction | Establishes chosen context. |
| Input | User-created, source-linked, or adaptation-informed proposed commitment | Offers a candidate for explicit adoption. |
| Input | Explicit revision, deferral, withdrawal, or fulfillment choice | Preserves the person’s change in judgment. |
| Input | Confirmed source context | Preserves provenance without importing source ownership. |
| Output | Current direction and active commitments | Provides context to experience and action systems. |
| Output | Direction–commitment links and their history | Enables traceable meaning across the product model. |
| Output | Commitment state and transition history | Provides factual context for action, evidence, and sensemaking. |
| Output | Explicitly approved revision context | Enables adaptation without rewriting historical facts. |

The Action and Evidence System may report that action occurred. It cannot mark a commitment fulfilled, withdrawn, or revised without an applicable interface contract and the person’s authority.

---

## 7. System Invariants

### User authority is required for consequential change

The system may surface a proposed commitment or recommendation. It must not silently create, activate, revise, defer, withdraw, fulfill, or retire a direction or commitment.

### Plans do not become commitments automatically

Scheduling, importing, or recording an intention does not establish an active commitment by itself.

### Action does not equal fulfillment

An action record can contribute evidence about a commitment. It does not alone establish that the commitment is fulfilled, successful, or aligned.

### Revision preserves history

The system must retain the distinction between what was originally chosen and what changed later. It must not rewrite an earlier commitment to match a later outcome.

### Directional links remain meaningful

The product must not create links solely to improve appearance, reporting, or a generic alignment metric.

### Formalization is optional

The system must remain useful to people who begin with a practical commitment, an external source, or a small amount of context.

---

## 8. Boundaries With Other Systems

| System | Direction and Commitment System owns | Other system owns |
|---|---|---|
| Action and Evidence | The meaning and state of direction and commitment. | Actual occurrence, factual records, and outcomes. |
| Sensemaking and Adaptation | The current direction and commitment history. | Interpretation, insight, and the proposal of an adaptation. |
| Continuity and Interoperability | Whether a source-linked commitment is accepted and how its provenance appears. | Provider-specific connection, synchronization, and portability mechanics. |
| Intelligence and Trust | The explicit user-controlled state of direction and commitment. | Recommendation constraints, uncertainty, explanation, and correction rights. |
| Experience Architecture | System semantics and invariants. | Navigation, journeys, surface hierarchy, and interaction patterns. |

Any cross-system handoff that needs shared state, ownership, or transition rules requires a system interface contract.

---

## 9. Implications for Lower-Level Documents

Feature briefs must identify whether they introduce, display, modify, or connect direction and commitment. A feature behavior contract must preserve the distinction between proposed, active, deferred, revised, withdrawn, superseded, partially met, and fulfilled commitments where those states are relevant.

Experience documents must make consequential state and provenance legible before a person acts on them. Design documents must not use visual emphasis to imply that one type of direction or commitment is morally superior to another.

Engineering documents must preserve explicit user authority, relationship history, and the separation between planning, commitment, action, and fulfillment. Technical convenience is not a valid reason to remove those distinctions.

---

## 10. Non-Goals

This system does not:

- record actual action or determine factual outcomes;
- evaluate the quality of a person’s direction;
- assign a universal priority score to commitments;
- require a commitment to link to a goal or direction;
- define any page, task type, scheduling flow, or component;
- define source-provider synchronization; or
- decide when a person should change their mind.

---

## 11. Change Control

This system changes only when FlowOS changes the enduring meaning, state, relationship, ownership, or invariant of direction or commitment.

A change requires:

1. a decision record explaining the system-level need;
2. impact assessment for the Product Model, interface contracts, experience architecture, feature contracts, data architecture, and active delivery work;
3. evidence that the new rule is understandable and preserves user authority; and
4. confirmation of consistency with the Vision and Product Model.

Feature-specific convenience, screen layout, or provider behavior alone does not justify changing this system.
