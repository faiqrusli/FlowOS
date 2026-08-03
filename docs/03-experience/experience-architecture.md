# Experience Architecture

**Status:** Active
**Authority:** Canonical cross-surface rules for how FlowOS makes product context, choices, states, and system transitions understandable in use
**Owner:** Product Architect + Design Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../00-constitution/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md) · [System Documents](../02-systems/)
**Children:** Information structure, journey contracts, feature briefs, behavior contracts, interaction specifications, content standards, accessibility standards, design-system applications
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes where a person finds or acts on core product context, how a system state is represented across surfaces, how a consequential transition is understood, or the cross-surface relationship among direction, commitment, action, evidence, sensemaking, adaptation, connected context, and computational assistance.

---

## Document Ownership

### Owner
**Role:** Design Architect
**Responsibility:** Maintain the cross-surface experience architecture and ensure product context, system states, and consequential transitions remain legible across surfaces.

### Contribution
**Role:** Product Architect
**Responsibility:** Review experience-architecture changes for product-concept and system-boundary alignment before Founder approval.

### Modification Process
1. Design Architect proposes experience-architecture changes (based on design or product evidence)
2. Product Architect reviews for product-concept and system-boundary alignment where applicable
3. Submit to Founder for approval
4. If approved: Design Architect updates document
5. Document change in decision record if consequential
6. Update the Last Updated date

### Authority Level
- Design Architect can: Propose and maintain cross-surface experience rules, define availability and legibility requirements, and apply product/system semantics in use
- Requires approval for: Any change to what context must be available, how product distinctions remain legible, or how consequential system transitions are understood

---

## 1. Scope

This document defines the cross-surface experience architecture for FlowOS: how the product helps a person locate relevant context, understand its status and origin, make a choice, and follow the result across system boundaries.

It answers:

> What must the FlowOS experience make findable, understandable, and actionable so that a person can move from chosen direction to deliberate action, learning, and adaptation without losing context or agency?

It does not define page layouts, navigation labels, visual components, interaction mechanics, content copy, accessibility techniques, feature scope, or implementation. Those responsibilities belong to lower-level experience, design, feature, and engineering documents.

---

## 2. Experience Responsibility

The Experience Architecture has six responsibilities:

1. give a person enough orientation to understand what is relevant now without requiring them to reconstruct their entire history;
2. make direction, commitments, action, evidence, sensemaking, adaptation, connected context, and assistance discoverable at the point they matter;
3. preserve the semantic distinctions and user authority defined by the Product Model and system documents as information moves across surfaces;
4. make consequential transitions, uncertainty, provenance, and current status understandable before a person acts;
5. support entry, re-entry, interruption, recovery, and departure without making a person feel lost or punished; and
6. enable progressive depth, so ordinary use remains focused while fuller context is available when it affects judgment or control.

The architecture organizes experience around a person’s need to orient, choose, act, understand, and adapt. It does not prescribe a mandatory workflow, a fixed set of screens, or a universal navigation model.

---

## 3. Experience Principles

### Orientation precedes demand

Before FlowOS asks a person to act, reflect, connect a source, or respond to assistance, the experience must provide enough context to understand why the demand is present and what is optional.

### The current moment has context

The experience must make relevant direction, commitment, action, evidence, source, or prior choice available when it materially changes what a person can reasonably decide. It must not require a person to remember hidden relationships or navigate a long history merely to understand the present.

### Intent, reality, and interpretation remain distinct

The experience must not make an intention appear completed, a commitment appear to be an action, an evidence record appear to be a conclusion, or a recommendation appear to be a person’s choice.

### Transitions are legible

When a person creates, revises, applies, pauses, corrects, connects, exports, or authorizes something consequential, the experience must make the affected object, resulting state, and available recovery path understandable.

### Depth is available, not imposed

Ordinary use should expose the minimum context needed for a grounded next step. Supporting history, provenance, uncertainty, and connections must remain accessible when they matter, without forcing every person into an exhaustive planning or reflection ritual.

### Agency is expressed in the interaction

The experience must make person-controlled choices genuine. A recommendation, automation, prompt, or connected source must not use framing, default selection, visual prominence, or hidden consequence to turn a suggestion into coercion.

### Re-entry is a first-class state

People will return after interruption, changed circumstances, or incomplete work. The experience must help them regain orientation without treating gaps, revisions, deferrals, or disconnected sources as personal failure.

---

## 4. Experience Domains

Experience domains describe the enduring kinds of understanding and action FlowOS must support. They are not necessarily pages, menu items, or sequential steps.

| Domain | Person’s need | System context that may be involved | Experience must make clear |
|---|---|---|---|
| **Orientation** | Understand what deserves attention now and why. | Direction, commitments, current action, evidence, adaptation, connected context. | Relevant current context, its status, and an available next choice. |
| **Choice** | Establish, revise, pause, resume, or release a direction or commitment. | Direction and Commitment; Sensemaking and Adaptation. | What the choice affects, what is optional, and resulting state. |
| **Action** | Begin, continue, pause, conclude, or record deliberate action. | Action and Evidence; Direction and Commitment. | What is actually occurring, its relationship to commitment where relevant, and what has not yet occurred. |
| **Reality** | Understand actual evidence, outcomes, reliability, and provenance. | Action and Evidence; Continuity and Interoperability. | What is known, where it came from, what is derived, and what remains unavailable or uncertain. |
| **Learning** | Reflect, preserve an insight, and consider a future adaptation. | Sensemaking and Adaptation; Action and Evidence. | Evidence versus interpretation, uncertainty, the voluntary nature of reflection, and adaptation choices. |
| **Connection** | Bring in, relate, pause, disconnect, or take out context from a source. | Continuity and Interoperability. | Source ownership, relationship scope, availability, exchange state, and recovery or exit choices. |
| **Assistance** | Understand and govern a computational transformation, inference, recommendation, or automation. | Intelligence and Trust; all adjacent systems. | Type, basis, uncertainty, limits, control, and any affected state. |

An experience may address multiple domains. It must not collapse their meanings merely because they are shown together.

---

## 5. Information Availability Rules

### Relevant context is available at decisions

When a person makes a consequential choice, the experience must provide access to the context that materially informs it. This can include related direction, active commitment, action state, evidence, reflection, source status, recommendation basis, or prior adaptation.

The architecture does not require every related record to be shown by default. It requires that the relationship is not hidden when it changes the meaning, consequence, or reversibility of the choice.

### Status is shown as status

State must be represented in a way that does not overstate it. For example, a proposed adaptation cannot appear applied; an unavailable source cannot appear current; a recommendation cannot appear accepted; a concluded action cannot imply a successful outcome.

### Origin and derivation are available when material

The experience must expose whether material context is native, source-provided, user-provided, directly recorded, derived, or computationally generated when that distinction affects trust, correction, or a person’s available choices.

### History supports understanding, not clutter

Historical context must remain reachable when it explains a current state, correction, adaptation, or source relationship. It must not crowd out a person’s ability to see what is current, relevant, and actionable now.

### Unavailable context remains intelligible

When evidence, source context, a relationship, or an assistive basis is incomplete, stale, disconnected, or unavailable, the experience must communicate the limitation and its practical effect. It must not substitute a false sense of completeness.

---

## 6. Cross-System Transitions

The experience must make the following semantic handoffs intelligible wherever they occur. A handoff is not required to appear as a discrete workflow or separate screen.

| Transition | Experience responsibility | Must not imply |
|---|---|---|
| Direction → commitment | Show that a person is turning chosen context into a present choice. | That every direction requires a commitment or that a commitment is permanent. |
| Commitment → action | Make clear that beginning or recording action concerns occurrence, not just intention. | That a commitment proves action happened. |
| Action → evidence or outcome | Preserve what was observed and the reliability or provenance of the record. | That an observed record explains meaning or success by itself. |
| Evidence → sensemaking | Provide evidence and contextual limits for a person’s interpretation. | That the system has determined what the evidence means. |
| Sensemaking → adaptation | Make the proposal, supporting context, and user-controlled choice clear. | That every insight requires a change or that a proposal is already applied. |
| Source context → product context | Show source identity, relationship state, availability, and scope. | That FlowOS owns the source or that the source controls product state. |
| Assistance → a choice or action | Make assistance type, basis, uncertainty, and control visible. | That an inference or recommendation has made the person’s decision. |

When a transition has semantic ambiguity or a distinct conflict rule, the relevant system interface contract owns the shared rule. This document owns only the requirement that the person can understand the transition in use.

---

## 7. State, Feedback, and Recovery

### Material state change

For a material change, the experience must tell the person what changed, what remains unchanged, and where the resulting state can be found or revisited. It must not rely on a transient confirmation alone when later understanding or correction matters.

### Pending, partial, and failed work

The experience must distinguish a requested action from a completed one. It must make partial exchange, unsaved input, unavailable evidence, interrupted automation, and failed synchronization understandable, including the next meaningful recovery choice when one exists.

### Correction and reversal

Where a person can correct, undo, withdraw, pause, disconnect, or revisit an action, the experience must make the scope and consequence of that recovery action clear. It must not present reversal as hidden, punitive, or equivalent to erasing history when history remains relevant.

### Empty and first-use states

An empty state must explain what is absent, why it may be absent, and how a person can proceed without implying that they are behind, inactive, or deficient. It must not manufacture urgency simply to produce activity.

### Interrupted and returning use

On re-entry, the experience should surface enough recent change, current state, and available next choice for a person to resume with confidence. It must not assume continuity that the person cannot verify or demand a retrospective account before they can continue.

---

## 8. Progressive Disclosure and Attention

FlowOS must balance clarity with attention. The architecture uses progressive disclosure to ensure that the amount of context shown matches the consequence and ambiguity of the moment.

| Context level | Use when | Must include |
|---|---|---|
| **Immediate** | A person needs a grounded next step with low ambiguity. | Current state, relevant choice, and enough context to avoid a misleading action. |
| **Supporting** | Context, status, source, history, or uncertainty may affect a person’s decision. | A direct path to the relevant relationship and its material limits. |
| **Inspecting** | A person needs to understand provenance, change history, basis, scope, or consequence in depth. | Traceable detail, correction path, and the owning system’s state. |

Progressive disclosure must not hide material consequence, reduce a person’s ability to decline assistance, obscure source ownership, or make a consequential choice appear simpler than it is.

---

## 9. Cross-Surface Consistency

The same product object or state may appear in multiple contexts. Cross-surface consistency does not require identical layout; it requires a person not to receive conflicting meaning or control.

Across surfaces, the experience must preserve:

- the same canonical identity and current state for a direction, commitment, action, evidence record, reflection, insight, adaptation, source relationship, or assistive result;
- the distinction between current, historical, proposed, applied, corrected, unavailable, and disconnected contexts where relevant;
- a path to the owning context when a displayed summary is not sufficient for action or correction;
- the appropriate authority level for creating, modifying, applying, or exporting something; and
- material provenance, uncertainty, and source limitations when a surface uses a condensed representation.

A surface may deliberately simplify an object for focus. It must not simplify away a distinction that would cause a person to misunderstand their choice, their history, or another system’s authority.

---

## 10. Boundaries With Other Documents

| Document family | Experience Architecture owns | That family owns |
|---|---|---|
| Product Model | How canonical concepts must remain legible in use. | The concepts, relationships, and invariants themselves. |
| System documents | Cross-surface representation of system state, boundaries, and handoffs. | Semantic system rules and shared interface contracts. |
| Information structure | The enduring experience domains and availability requirements. | The current organization, grouping, labels, and routes that apply these rules. |
| Journey contracts | Requirements for a bounded end-to-end user journey. | A specific sequence, entry condition, branch, and acceptance behavior. |
| Feature contracts | Requirements for a feature to fit the experience architecture. | The bounded problem, behavior, and scope of that capability. |
| Design standards | Semantic requirements that design must express. | Visual language, components, content patterns, interaction mechanics, and accessibility techniques. |
| Engineering architecture | Experience semantics that technical behavior must preserve. | Data, API, client, synchronization, performance, and operational implementation. |

Any document that tries to redefine a product state, source relationship, assistance policy, or system ownership must defer to the owning product or system document rather than revising it through experience work.

---

## 11. Implications for Lower-Level Documents

Information-structure documents must define the current organization and naming of domains, views, routes, and object access while preserving the experience responsibilities and system boundaries here.

Journey contracts must state the entry context, decision context, system states involved, transitions, recovery, and exit condition for a bounded journey. They must not assume that the general architecture is a linear required flow.

Feature behavior contracts must specify what contextual information, status, provenance, uncertainty, authority, feedback, and recovery a person must encounter at each consequential choice. They must link to the system documents that own those semantics.

Design standards and interaction specifications must give visible form to ownership, state, evidence, uncertainty, control, and recovery without replacing them with decorative signals or engagement pressure.

---

## 12. Non-Goals

This document does not:

- define a site map, route structure, navigation labels, screen inventory, or component hierarchy;
- prescribe a linear workflow from direction through adaptation;
- define visual style, interaction patterns, content copy, accessibility implementation, or responsive layout;
- alter product concepts, system state, source ownership, recommendation eligibility, or automation authority;
- define a feature’s scope or acceptance behavior; or
- prescribe analytics events, data schemas, technical state management, or release sequencing.

---

## 13. Change Control

This document changes only when FlowOS changes an enduring cross-surface rule about what context must be available, how a product distinction must remain legible, how a consequential system transition must be understood, or how a person must retain orientation and agency across product use.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for the Product Model, affected system documents and interface contracts, information structure, journey contracts, active feature contracts, design standards, accessibility standards, engineering architecture, and delivery work;
3. evidence that the change preserves context, truthful state, provenance, uncertainty, recovery, and person authority; and
4. confirmation of consistency with the Vision, Product Model, and applicable system documents.

A page redesign, navigation preference, visual refresh, or one feature’s convenience does not by itself justify changing this architecture.
