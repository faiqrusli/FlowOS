# Action and Evidence System

**Status:** Active
**Authority:** Canonical system rules for actual action, factual evidence, outcomes, and record provenance
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../strategy/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System interface contracts, experience architecture, feature briefs, behavior contracts, data architecture, measurement specification
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes how FlowOS represents occurrence, factual evidence, outcome, provenance, correction, or the relationship between action and commitment.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain system rules for action and evidence, ensure factual integrity and provenance, and coordinate with Engineering Architect on data architecture implications

### Modification Process
1. Product Architect proposes system changes (based on feature requirements or evidence needs)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose system rule updates, maintain evidence provenance rules, coordinate with Engineering Architect
- Requires approval for: Changes to action/evidence meaning, provenance rules, or system invariants

---

## 1. Scope

This document defines the system that represents deliberate action, factual evidence, and observable outcomes.

It answers:

> How does FlowOS preserve what actually occurred without confusing it with what was intended, interpreted, or recommended?

It does not define direction or commitment state, reflection, insight, adaptation, recommendations, interface layout, technical schemas, or provider-specific synchronization. Those responsibilities belong to the adjacent system documents, Experience Architecture, engineering architecture, and system interface contracts.

---

## 2. System Responsibility

The Action and Evidence System has five responsibilities:

1. represent actual action separately from intention, planning, and commitment;
2. preserve factual evidence related to action, commitment, or outcome;
3. make the source and derivation of evidence understandable;
4. support correction without silently rewriting historical truth; and
5. provide reliable factual context to sensemaking, adaptation, measurement, and review.

The system records reality as faithfully as available information permits. It does not determine a person’s motives, judge the quality of their effort, or decide what an action means.

---

## 3. Action

### Definition

Action is a deliberate behavior that actually occurs. It can represent work, practice, care, recovery, communication, or another chosen use of attention.

An action may relate to an active commitment, a source-linked responsibility, or an emergent choice. It does not require a formal commitment in order to be valid.

### Action rules

- An action record describes occurrence, not aspiration.
- An action may begin, continue, pause, resume, conclude, or be determined unreliable.
- A commitment may inform action, but a commitment does not establish that action occurred.
- An action can be linked to zero, one, or multiple commitments only where the relationship is meaningful and traceable.
- The system must preserve enough context to distinguish an active action from a concluded historical record.
- An action record may be corrected when new information is available; corrections must preserve provenance and the fact that a correction occurred.

### Action states

| State | Meaning | Must not imply |
|---|---|---|
| **Active** | The system has a reliable basis to represent action as currently occurring. | That the action will continue, be completed, or fulfill a commitment. |
| **Paused** | An active action has been deliberately or reliably interrupted. | Failure, abandonment, or a completed result. |
| **Concluded** | The action is no longer represented as occurring. | That it produced a desired outcome. |
| **Corrected** | A previously recorded action has been amended with explicit provenance. | That the original record was silently erased. |
| **Unreliable** | The record cannot be treated as dependable evidence. | That the person acted in bad faith or that all related evidence is invalid. |

The states describe record reliability and occurrence. They do not express productivity, moral value, or progress.

---

## 4. Evidence

### Definition

Evidence is a factual record related to an action, commitment, or outcome. It records what is known or reported to have occurred, not what the product concludes about it.

Evidence may be direct, user-provided, source-provided, or derived from other evidence. Every form has a different level of context and must retain its provenance.

### Evidence classes

| Evidence class | Meaning | Required treatment |
|---|---|---|
| **Direct record** | Information captured directly by FlowOS during an occurrence. | Preserve time, source, and relevant record context. |
| **User-provided record** | Information asserted, entered, or corrected by the person. | Preserve that it was user-provided; do not falsely present it as direct observation. |
| **Source-provided record** | Information received from a connected system. | Preserve source identity, receipt context, and synchronization status. |
| **Derived record** | Information computed from one or more factual records. | Preserve the inputs, calculation rule, and derivation time. |
| **Unverified record** | Information present but not sufficiently reliable for strong factual claims. | Make its uncertainty visible and prevent it from being treated as confirmed evidence. |

### Evidence rules

- Evidence must identify its source or derivation whenever that affects interpretation, trust, or correction.
- A derived record must remain traceable to the factual records and rules that produced it.
- Evidence may be incomplete. Absence of evidence is not proof that no action occurred.
- Evidence must not be transformed into an interpretation, recommendation, diagnosis, or personal score without passing through the appropriate system boundary.
- Corrections must identify what changed and why the earlier record is no longer the best available representation.

---

## 5. Outcome

### Definition

An outcome is an observable result or state change associated with an action or commitment.

Outcome is distinct from effort, duration, completion, and personal judgment. An action may consume significant effort without producing an immediate outcome; an outcome may arise from conditions beyond a single action.

### Outcome rules

- An action does not automatically establish an outcome.
- A completed commitment does not automatically establish a meaningful outcome.
- An outcome may be directly observed, user-reported, source-provided, or unknown.
- Outcome attribution must remain proportionate to available evidence. The product must not claim a single action caused a result without support.
- Outcomes can inform sensemaking but do not replace the person’s contextual interpretation.

---

## 6. Action–Evidence Relationships

| Relationship rule | Meaning |
|---|---|
| Action may produce evidence | An actual action can create direct or derived factual records. |
| Evidence may exist without a recorded action | A source, person, or outcome may provide relevant evidence even when FlowOS did not observe an action. |
| Action may exist with incomplete evidence | The product must not treat missing records as proof of non-action. |
| Evidence can clarify action | New evidence can correct timing, duration, source, or reliability of an action record. |
| Action may contribute to an outcome | A connection may be recorded when supported, but causality must not be overstated. |
| Evidence precedes interpretation | Sensemaking may use evidence but must preserve the distinction between fact and conclusion. |

The system preserves a truthful relationship between action and evidence without promising exhaustive observation of a person’s life.

---

## 7. Inputs and Outputs

| Type | System input or output | Responsibility |
|---|---|---|
| Input | Direct occurrence record | Establishes a factual basis for action or evidence. |
| Input | User-provided action, outcome, or correction | Adds context while preserving user-provided provenance. |
| Input | Source-provided record | Introduces source-linked factual context. |
| Input | Approved calculation rule | Produces a traceable derived record. |
| Output | Action state and history | Gives other systems factual context about occurrence. |
| Output | Evidence with provenance and reliability | Supports trustworthy sensemaking, measurement, and review. |
| Output | Outcome record and attribution context | Makes observable results available without overclaiming causality. |
| Output | Correction history | Preserves record integrity and enables auditability. |

The system may expose factual action and evidence to the Direction and Commitment System. It may not autonomously change a commitment’s state or direction’s relevance.

---

## 8. System Invariants

### Actuality is separate from planning

An intended, scheduled, or committed action is not evidence that action occurred.

### Evidence is separate from interpretation

Factual records must remain distinguishable from reflection, insight, recommendation, and judgment.

### Source and derivation are visible

The origin and transformation of relevant evidence must be traceable enough for a person to understand and correct it.

### Corrections preserve history

When a record changes, the system preserves the fact of correction and the basis for the revised representation.

### Missing information is not negative evidence

The system must not infer non-action, failure, or lack of progress from an absent record unless the source and context make that inference valid.

### Evidence does not create authority over the person

A factual record, aggregate, or derived pattern cannot silently alter a person’s direction, commitment, interpretation, or future choice.

---

## 9. Boundaries With Other Systems

| System | Action and Evidence System owns | Other system owns |
|---|---|---|
| Direction and Commitment | Factual action and evidence related to a commitment. | Meaning, relevance, and explicit commitment state. |
| Sensemaking and Adaptation | Factual records and provenance. | Interpretation, insight, and deliberate revision. |
| Continuity and Interoperability | The product-level meaning of evidence provenance. | Provider connection, transfer, synchronization, and export mechanics. |
| Intelligence and Trust | Reliable factual context available to a recommendation. | Whether and how a recommendation is appropriate, explained, corrected, or dismissed. |
| Measurement Specification | Product evidence semantics. | Event design, formulas, cohorts, and data-quality implementation. |
| Experience Architecture | System semantics and required distinctions. | Surface hierarchy, interaction patterns, and user journeys. |

Any handoff involving shared evidence ownership, correction, attribution, or transition rules requires a system interface contract.

---

## 10. Implications for Lower-Level Documents

Feature contracts must specify which action, evidence, outcome, and provenance concepts they create, display, modify, or derive. They must not describe an intention or source update as an actual action without a reliable basis.

Experience documents must make material distinctions visible when a person is deciding whether to trust or correct a record. Design documents must not visually imply causal certainty, completion, or progress when the available evidence does not support it.

Data and integration architecture must preserve correction history, source identity, derivation lineage, and the distinction between direct, user-provided, source-provided, and derived records.

Measurement documents may aggregate evidence, but aggregation must retain the limitations and definitions required for responsible interpretation.

---

## 11. Non-Goals

This system does not:

- define a person’s direction or active commitments;
- determine why an action occurred or whether it was meaningful;
- assess reflection quality, discipline, growth, or personal worth;
- decide that a commitment is fulfilled solely from action evidence;
- define source-provider APIs, synchronization frequency, or database schema;
- prescribe a feature, page, timer, task type, or interface component; or
- create a universal progress score.

---

## 12. Change Control

This system changes only when FlowOS changes the enduring meaning, reliability, ownership, provenance, correction, or conceptual relationship of action, evidence, or outcome.

A change requires:

1. a decision record explaining the system-level need;
2. impact assessment for the Product Model, system interface contracts, data and integration architecture, measurement specification, active feature contracts, and delivery work;
3. evidence that the change preserves factual integrity and user authority; and
4. confirmation of consistency with the Vision and Product Model.

Feature-specific instrumentation, provider behavior, or interface convenience alone does not justify changing this system.
