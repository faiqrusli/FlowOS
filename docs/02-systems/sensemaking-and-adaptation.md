# Sensemaking and Adaptation System

**Status:** Active
**Authority:** Canonical system rules for reflection, sensemaking, insight, and deliberate adaptation
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../strategy/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System interface contracts, experience architecture, feature briefs, behavior contracts, intelligence and trust system, validation plans
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes how FlowOS represents reflection, context, insight, uncertainty, adaptation, or the boundary between interpretation and factual evidence.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain system rules for sensemaking and adaptation, ensure interpretation/fact distinction, and coordinate with Design Architect on experience implications

### Modification Process
1. Product Architect proposes system changes (based on feature requirements or user evidence)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose system rule updates, maintain interpretation/fact boundaries, coordinate with Design Architect
- Requires approval for: Changes to sensemaking/adaptation meaning, state rules, or system invariants

---

## 1. Scope

This document defines the system that helps a person interpret their evidence in context and deliberately adapt future choices.

It answers:

> How does FlowOS help a person turn experience into a more grounded next choice without treating an interpretation as fact or a recommendation as authority?

It does not define factual action records, direction or commitment state, recommendation policy, interface layout, technical storage, or source-provider synchronization. Those responsibilities belong to the Action and Evidence System, Direction and Commitment System, Intelligence and Trust System, Experience Architecture, engineering documents, and system interface contracts.

---

## 2. System Responsibility

The Sensemaking and Adaptation System has five responsibilities:

1. connect factual evidence with relevant human context;
2. preserve reflection without treating it as a mandatory ritual;
3. represent insights as provisional interpretations rather than established facts;
4. turn a chosen insight into a visible adaptation proposal or deliberate change; and
5. preserve the distinction between considering a change, choosing a change, and applying a change.

The system supports a person’s judgment. It does not diagnose their motives, determine what their evidence means, or decide what they should do next.

---

## 3. Sensemaking

### Definition

Sensemaking is human interpretation of evidence in context. It can identify a pattern, explain a constraint, preserve an insight, raise an unanswered question, or clarify what should be considered next.

Sensemaking may be brief or deep, private or connected to a specific period of activity. It is useful when it helps a person understand their experience; it is not valuable merely because it produces more text.

### Sensemaking rules

- Sensemaking may refer to evidence, direction, commitments, actions, outcomes, knowledge, or external context.
- The system must preserve the distinction between source evidence and a person’s interpretation of that evidence.
- A person may create sensemaking without complete evidence, provided uncertainty and context remain visible.
- Sensemaking may remain unresolved. The system must not require an insight, conclusion, or adaptation.
- A person may revise, supersede, or retire an interpretation without rewriting the evidence that informed it.
- Sensemaking can be connected across time when the relationship is meaningful and traceable.

### Sensemaking states

| State | Meaning | Must not imply |
|---|---|---|
| **Open** | The person is exploring or recording context without a settled conclusion. | Incompleteness, failure, or a missing required response. |
| **Retained** | The person considers the sensemaking useful current context. | A permanent truth or mandatory action. |
| **Revised** | The interpretation changed explicitly as new context emerged. | That the earlier interpretation was erased. |
| **Superseded** | A later interpretation explicitly replaced the role of an earlier one. | That the original evidence no longer exists. |
| **Retired** | The interpretation is no longer current but remains historical context. | Deletion or invalidation of the person’s experience. |

State describes the current role of an interpretation, not the value of the person who made it.

---

## 4. Reflection

### Definition

Reflection is a structured act of sensemaking in which a person supplies context or interpretation about experience.

Reflection can occur after an action, around a commitment, across a period of time, or when a person recognizes a relevant pattern. It is one expression of sensemaking, not the only valid one.

### Reflection rules

- Reflection may be prompted by evidence, but the prompt must not assume a conclusion.
- Reflection must not present incomplete evidence as a full account of a person’s day, work, or life.
- A person may skip, pause, or stop reflection without creating a negative product state.
- Reflection may identify what helped, what constrained, what changed, what remains uncertain, or what deserves attention next.
- The system must not score reflection length, emotional disclosure, frequency, or apparent positivity as quality.
- Reflection can be linked to evidence and commitments when the person considers the context useful; it must not create causal claims automatically.

---

## 5. Insight

### Definition

An insight is a provisional conclusion or useful pattern produced through sensemaking.

An insight can support a later decision, but it must retain the evidence, context, limitations, and uncertainty that make it trustworthy. It is not a fact merely because it is stored or repeated.

### Insight rules

- An insight must be traceable to the evidence, reflection, or source context that supports it where such context exists.
- An insight may be personal, tentative, conditional, or time-bound.
- An insight can be challenged by later evidence, reflection, or a person’s changed circumstances.
- The system must distinguish an insight from an automated recommendation and from an observable fact.
- Multiple insights may conflict. The system should preserve the conflict rather than forcing premature resolution.

---

## 6. Adaptation

### Definition

Adaptation is a deliberate revision, reinforcement, pause, removal, or replacement of a future choice or condition informed by sensemaking.

Adaptation applies learning to a next choice. It is not a requirement that every reflection produce a change, and it is not proof that a prior choice was wrong.

### Adaptation rules

- An adaptation begins as a proposal, whether it originates with the person or through an eligible recommendation.
- A proposal must identify what it could change, the context that informed it, and the person’s available choices.
- Only a person can accept, decline, modify, or defer a consequential adaptation.
- Applying an adaptation must be explicit and traceable to the direction, commitment, condition, or rule it affects.
- A person can revisit an adaptation when later evidence shows that it did not fit their circumstances.
- Declining or deferring an adaptation is valid information, not evidence of poor product use.

### Adaptation states

| State | Meaning | Must not imply |
|---|---|---|
| **Proposed** | A possible adaptation is available for consideration. | A decision, automatic change, or a conclusion that the current approach failed. |
| **Accepted** | The person has chosen the adaptation in principle. | That the affected change has already been applied everywhere. |
| **Applied** | The identified change was explicitly made to the affected context. | That it will succeed or remain appropriate forever. |
| **Deferred** | The person chose not to act on the proposal now. | Rejection, failure, or loss of agency. |
| **Declined** | The person chose not to use the proposal. | Incorrectness, non-compliance, or a negative user outcome. |
| **Revisited** | The person is reconsidering a prior adaptation in light of new context. | That the prior choice should be erased. |

The Direction and Commitment System owns the resulting state of a direction or commitment. This system owns the adaptation’s context, proposal, and explicit choice history.

---

## 7. Sensemaking–Adaptation Relationships

| Relationship rule | Meaning |
|---|---|
| Evidence can inform sensemaking | Factual records can provide context without determining an interpretation. |
| Reflection can produce insight | A person’s context may reveal a useful, provisional pattern. |
| Insight can inform adaptation | A useful pattern may become a proposal for a future change. |
| Adaptation need not follow insight | Understanding may be sufficient, or conditions may not yet support change. |
| Adaptation can require new evidence | A person may choose to observe more before changing a direction or commitment. |
| Later experience can revise sensemaking | New evidence or context can change an interpretation without invalidating the original experience. |

The system must preserve this chain without turning it into an obligatory workflow.

---

## 8. Inputs and Outputs

| Type | System input or output | Responsibility |
|---|---|---|
| Input | Evidence with provenance and reliability | Provides factual context without carrying an interpretation. |
| Input | User-provided reflection or contextual note | Adds human meaning and relevant circumstance. |
| Input | Knowledge or source context | Informs interpretation when the person considers it relevant. |
| Input | Eligible recommendation | May create a proposal only within Intelligence and Trust System constraints. |
| Output | Sensemaking state and history | Preserves interpretation separately from evidence. |
| Output | Insight with supporting context and uncertainty | Makes a provisional pattern available for later consideration. |
| Output | Adaptation proposal and choice state | Supports deliberate revision without automatic action. |
| Output | Explicit applied-adaptation context | Enables the affected system to make a user-approved change. |

The system may request an explicit change from the Direction and Commitment System. It cannot write a consequential change directly into that system without user authority and an applicable interface contract.

---

## 9. System Invariants

### Interpretation remains separate from fact

Reflection, insight, and adaptation context must remain distinguishable from the evidence they consider.

### Uncertainty is preserved

The system must not present a tentative insight, incomplete reflection, or recommendation as certainty.

### Reflection is voluntary

No person is required to reflect, disclose context, produce an insight, or accept an adaptation in order to be considered successful by FlowOS.

### Adaptation is user-controlled

No adaptation may silently modify a direction, commitment, record, rule, or source relationship.

### History remains intelligible

Revised or superseded sensemaking and adaptation records retain enough context for a person to understand what changed and why.

### The system does not moralize change

Revision, deferral, uncertainty, and declining a recommendation must not be represented as failure, weakness, or reduced product value.

---

## 10. Boundaries With Other Systems

| System | Sensemaking and Adaptation System owns | Other system owns |
|---|---|---|
| Direction and Commitment | Adaptation context, proposal, and explicit choice. | Resulting direction and commitment state. |
| Action and Evidence | Interpretation of factual context. | Actual occurrence, evidence, outcome records, and provenance. |
| Continuity and Interoperability | Relevance of knowledge or source context to sensemaking. | Source ownership, transfer, synchronization, and portability mechanics. |
| Intelligence and Trust | The human sensemaking and adaptation lifecycle. | Eligibility, explanation, uncertainty, correction, and control of automated recommendations. |
| Experience Architecture | System semantics and required choice points. | How reflection, insight, and adaptation appear across surfaces. |

Any shared handoff involving insight provenance, adaptation application, or recommendation state requires a system interface contract.

---

## 11. Implications for Lower-Level Documents

Feature contracts must state whether they create, display, revise, or apply reflection, insight, or adaptation. They must make the evidence and context supporting consequential proposals available to the person before requiring a choice.

Experience documents must support thoughtful interruption, deferral, and correction. Design documents must not frame reflection as a compliance task or use visual language that treats uncertainty as a defect.

Engineering and data documents must preserve the separation among evidence, reflection, insight, recommendation, and applied adaptation. A derived pattern must never overwrite a person’s own account or choice history.

Measurement documents may assess whether FlowOS supports learning value, but they must not treat adaptation frequency, recommendation acceptance, or reflection volume as direct proof of that value.

---

## 12. Non-Goals

This system does not:

- record factual action or determine evidence reliability;
- define a person’s direction or directly modify commitment state;
- diagnose mental health, motives, or personality;
- require reflection, disclosure, insight, or adaptation;
- decide whether an interpretation is objectively correct;
- define AI model behavior, source-provider synchronization, or technical storage; or
- provide a universal score for learning, growth, discipline, or reflection quality.

---

## 13. Change Control

This system changes only when FlowOS changes the enduring meaning, state, ownership, provenance, or user-authority rule for reflection, sensemaking, insight, or adaptation.

A change requires:

1. a decision record explaining the system-level need;
2. impact assessment for the Product Model, adjacent system contracts, experience architecture, intelligence and trust rules, data architecture, active feature contracts, and delivery work;
3. evidence that the change preserves voluntary reflection, uncertainty, and user authority; and
4. confirmation of consistency with the Vision and Product Model.

Feature-specific prompting, interface layout, or automation convenience alone does not justify changing this system.
