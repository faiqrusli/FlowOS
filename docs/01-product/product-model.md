# FlowOS Product Model

**Status:** Active
**Authority:** Canonical conceptual model for the FlowOS product
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../strategy/Vision.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System documents, experience architecture, feature briefs, product glossary
**Last Updated:** 2026-08-03
**Review trigger:** A proposed product capability introduces a new enduring concept, changes a conceptual relationship, or exposes an ambiguity that system contracts cannot resolve.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain product model, propose changes based on product evidence, ensure conceptual consistency across product documents

### Modification Process
1. Product Architect proposes changes (based on product evidence or system requirements)
2. Submit to Founder for approval
3. Founder reviews for Vision alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose conceptual model changes, maintain definitions, ensure consistency
- Requires approval for: Any change to core concepts, relationships, or invariants

---

## 1. Scope

This document defines the conceptual objects and relationships that make FlowOS one product rather than a collection of tools.

It answers:

> What does FlowOS understand, and how do those things relate?

It does not restate the purpose, beliefs, principles, or boundaries owned by the Vision. It does not define feature behavior, information architecture, interface design, technical schemas, or delivery plans.

The [Product Glossary](./product-glossary.md) is the canonical source for concise term definitions. This document expands those terms only where necessary to define conceptual relationships and invariants.

---

## 2. Model at a Glance

FlowOS is a connected model of self-direction. Its central objects are:

```text
Direction
    ↓ informs
Commitment
    ↓ is met through
Action
    ↓ produces
Evidence
    ↓ is interpreted through
Sensemaking
    ↓ enables
Adaptation
    ↓ revises or reinforces
Direction and Commitment
```

Two supporting forms of context remain available throughout the model:

- **Knowledge and context** inform a person’s choices and interpretation.
- **Sources and connected systems** provide context or work references without automatically becoming FlowOS-owned data.

Trust, provenance, and user authority apply to every object and relationship. They are not separate destinations in the model.

---

## 3. Core Concepts

### Direction

Direction is the personally chosen context that helps a person judge what deserves attention. It may express a value, responsibility, desired future, area of concern, or priority.

Direction gives work meaning but does not require every action to carry a formal link. It is deliberately revisable. A direction is not a prediction, score, identity label, or permanent promise.

### Commitment

Commitment is a present, intentional choice to direct attention or effort toward something. It is more specific than direction and more grounded than a plan that has not yet become actionable.

Commitments may be fulfilled, continued, revised, deferred, withdrawn, or superseded. Their history must preserve the distinction between the original choice and later reality.

### Action

Action is a deliberate behavior that occurs in the world. It can represent work, practice, care, recovery, communication, or another chosen use of attention.

Action is not assumed merely because a commitment exists. A model of action must preserve actual occurrence separately from intended occurrence.

### Evidence

Evidence is a factual record related to an action, commitment, or outcome. It can describe occurrence, duration, result, state change, or other observable information.

Evidence records what is known to have happened. It does not contain causal claims, judgments, diagnoses, or conclusions about a person.

### Sensemaking

Sensemaking is the human interpretation of evidence in context. It can identify a pattern, explain a constraint, preserve an insight, or articulate an unanswered question.

Sensemaking may be uncertain, provisional, and corrected over time. It is distinct from the factual evidence it considers.

### Adaptation

Adaptation is a deliberate change informed by sensemaking. It can reinforce, revise, pause, remove, or replace a direction or commitment; it can also change conditions around future action.

Adaptation is an outcome of learning, not a mandatory step or proof of progress.

### Knowledge and context

Knowledge and context are information that help a person make or interpret choices. They may originate in FlowOS or in another system.

FlowOS owns the relationship between relevant knowledge and self-direction when that relationship matters. It does not require ownership of every source, document, or reference.

### Sources and connected systems

A source is the origin of context, work, or evidence that FlowOS can reference. Sources may be native to FlowOS or remain managed elsewhere.

Source identity and provenance must remain visible. An external source may contribute to the model without being copied, controlled, or transformed into a separate product category.

---

## 4. Canonical Relationships

The product model recognizes the following relationships:

| Relationship | Meaning |
|---|---|
| Direction → Commitment | A commitment may serve a chosen direction. The link is valuable when it clarifies meaning, but it is not universally required. |
| Commitment → Action | A commitment may lead to action, partial action, deferral, withdrawal, or no action. |
| Action → Evidence | Action can produce factual evidence about what occurred and what resulted. |
| Evidence + Context → Sensemaking | A person interprets evidence in light of context that data alone cannot contain. |
| Sensemaking → Adaptation | An interpretation may inform a deliberate change to a future choice or condition. |
| Adaptation → Direction or Commitment | Adaptation can revise, reinforce, pause, or replace prior direction and commitments. |
| Knowledge → Choice or Sensemaking | Knowledge can inform direction, commitment, action, or interpretation without becoming the destination itself. |
| Source → Any relevant concept | A source can provide traceable context without surrendering its ownership to FlowOS. |

Relationships must remain explicit when they affect meaning, traceability, or a future decision. They must not be inferred merely to create a more complete-looking model.

---

## 5. Product Invariants

Every system, feature, and technical design that represents this model must preserve these invariants.

### Intention, commitment, and actuality are distinct

An intended future, an active commitment, and an action that actually occurred are different facts. A lower-level document must not collapse them into one state.

### Facts and interpretations are distinct

Evidence, sensemaking, and recommendations are different kinds of information. A system can connect them, but must not present an interpretation as an observed fact.

### Direction is optional at the level of an individual action

Some important actions are practical, emergent, or restorative and may not link to an explicit direction. The model supports meaningful connections without requiring artificial ones.

### Change is part of the model

Deferral, cancellation, revision, and reconsideration are meaningful historical states. The model must preserve them without treating them as corruption or failure.

### Provenance remains visible

The origin of imported, linked, derived, or user-provided information must be understandable. Derived information must retain a trace to the evidence or source that supports it.

### The person retains authority

No system, feature, automation, or integration may silently convert a recommendation, inference, or source update into a change to a person’s direction, commitment, interpretation, or record.

### The model is connected, not compulsory

FlowOS should support progressively richer relationships as they become useful. It must not require every person to fully formalize their life before gaining value from the product.

---

## 6. System Boundaries

This model establishes the boundaries for future system documents. Those documents will own their detailed rules; this document does not.

| System | Conceptual responsibility | Excluded responsibility |
|---|---|---|
| Direction and Commitment | Represents chosen context and present commitments. | Recording actual actions or interpreting evidence. |
| Action and Evidence | Represents occurrence and factual records. | Determining meaning or recommending a life direction. |
| Sensemaking and Adaptation | Represents interpretation and deliberate revision. | Rewriting factual evidence or silently changing commitments. |
| Continuity and Interoperability | Represents relationships to knowledge, history, and external sources. | Replacing every external system or hiding provenance. |
| Intelligence and Trust | Governs recommendations, uncertainty, control, and correction. | Defining product direction or acting as an autonomous authority. |

When two systems need a shared semantic rule, that rule belongs in a system interface contract. It must not be duplicated across both system documents.

---

## 7. Implications for Lower-Level Documents

### Experience architecture

Information architecture and cross-surface experience rules must preserve the difference between a person’s chosen context, current commitment, actual action, factual evidence, and interpretation.

### Feature contracts

A feature may introduce a new capability only by applying existing model concepts or by proposing a deliberate update to this model. It must state which concepts it reads, creates, changes, or connects.

### Design system

Shared design rules must make provenance, uncertainty, status, and user control legible where they affect a person’s judgment.

### Engineering architecture

Technical, data, integration, and trust architecture must preserve the conceptual ownership and distinctions in this model. Technical convenience is not a reason to merge concepts that remain distinct at the product level.

### Measurement and review

Metrics and reviews may measure behavior within the model, but they must not turn the model into a single measure of a person’s worth, growth, or productivity.

---

## 8. Non-Goals

This product model does not:

- define the interface, navigation, or interaction flow for any concept;
- prescribe technical entities, database tables, APIs, or event names;
- define a roadmap, target market, release sequence, or metric target;
- require every source, action, or direction to be represented in FlowOS;
- replace system interface contracts; or
- restate the Vision’s constitutional content.

---

## 9. Change Control

This document changes only when FlowOS needs a new enduring concept, a changed relationship between concepts, or a clarified invariant that affects multiple systems.

Feature-specific needs do not justify changing the product model unless they expose a genuine product-wide gap. A proposed change requires:

1. a decision record explaining the conceptual change;
2. an impact assessment across system, experience, feature, design, and engineering documents; and
3. explicit confirmation that the change remains consistent with the Vision.

Changes to terminology alone belong in the product glossary unless they alter the model itself.
