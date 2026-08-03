# Continuity and Interoperability System

**Status:** Active
**Authority:** Canonical system rules for continuity of context, source relationships, and movement of information across product boundaries
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../00-constitution/Vision.md) · [Product Model](../01-product/product-model.md) · [Product Glossary](../01-product/product-glossary.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** System interface contracts, experience architecture, feature briefs, behavior contracts, integration architecture, data architecture, portability and deletion policies
**Last Updated:** 2026-08-03
**Review trigger:** A proposed capability changes how FlowOS preserves context over time, connects to a source, represents source ownership or provenance, synchronizes information, or enables a person to take information in or out of FlowOS.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain system rules for continuity and interoperability, ensure source ownership and provenance, and coordinate with Engineering Architect on integration and data architecture implications

### Modification Process
1. Product Architect proposes system changes (based on feature requirements or source integration needs)
2. Submit to Founder for approval
3. Founder reviews for Vision and product model alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose system rule updates, maintain source ownership rules, coordinate with Engineering Architect
- Requires approval for: Changes to continuity/interoperability meaning, source relationship rules, or system invariants

---

## 1. Scope

This document defines the system that preserves relevant context across time and enables FlowOS to work responsibly with information that originates outside the product.

It answers:

> How does FlowOS keep a person’s past, current, and connected context intelligible without claiming ownership of every source or turning an integration into an opaque replacement for that source?

It does not define direction or commitment state, factual evidence semantics, interpretation, recommendation policy, interface layout, provider-specific behavior, technical protocols, database retention, or security implementation. Those responsibilities belong to the adjacent system documents, Intelligence and Trust System, Experience Architecture, engineering architecture, and system interface contracts.

---

## 2. System Responsibility

The Continuity and Interoperability System has five responsibilities:

1. preserve the contextual continuity a person needs to understand a present choice in relation to earlier choices and records;
2. make the origin, ownership, and current relationship of source-provided context intelligible;
3. enable explicitly scoped exchange with connected systems without concealing what changed, where, or why;
4. preserve a person’s ability to correct, revoke, disconnect, or carry their information elsewhere; and
5. prevent convenience features from turning incomplete, stale, or inaccessible source context into apparent product truth.

The system connects relevant context. It does not require FlowOS to become the home of every task, document, calendar, data stream, or external workflow.

---

## 3. Continuity

### Definition

Continuity is FlowOS’s ability to retain and relate relevant context through time, change, and transitions between sources without erasing the history that makes the context understandable.

Continuity helps a person see the thread between past direction, present commitments, actual evidence, prior sensemaking, and source context. It is not a demand to preserve every detail forever or to keep every earlier choice active.

### Continuity rules

- Current context may refer to earlier context when the relationship helps a person understand, continue, revise, or close a present choice.
- A changed, retired, disconnected, or no-longer-available source must not cause the system to silently rewrite the history of what FlowOS previously knew or displayed.
- Historical records must remain distinguishable from current state, current availability, and current interpretation.
- A person must be able to understand whether related context is native to FlowOS, originates from a source, was derived from other records, or is no longer available.
- Continuity must be selective. The system must not imply that an exhaustive history, constant synchronization, or complete personal archive is required for value.
- A relationship across time must preserve its basis where that basis affects trust, correction, or later interpretation.

### Continuity states

| State | Meaning | Must not imply |
|---|---|---|
| **Current** | The context is presently available and intended to inform current work or judgment. | That it is permanent, complete, or universally relevant. |
| **Historical** | The context remains part of an intelligible record of an earlier state or choice. | That it remains active or should govern a current choice. |
| **Superseded** | Later context explicitly takes the former context’s current role. | That the earlier context was false, erased, or irrelevant to history. |
| **Unavailable** | The context cannot currently be accessed, verified, or refreshed. | That it never existed, is incorrect, or reflects user failure. |
| **Disconnected** | The person or system ended the active relationship to a source. | That all prior source context must disappear or that ownership transferred to FlowOS. |

These states describe the role and availability of context, not a person’s consistency, productivity, or quality of use.

---

## 4. Source Relationships

### Definition

A source relationship is a person-authorized, explicitly scoped connection between FlowOS and a source or connected system.

The relationship identifies what FlowOS may receive, display, relate, or send. It does not make FlowOS the owner of the source’s original records or give a connected system authority over a person’s FlowOS direction, commitments, interpretations, or choices.

### Source relationship rules

- The system must identify the relevant source and the scope of the relationship whenever source origin affects meaning, trust, correction, availability, or a user decision.
- A person must be able to understand what information is involved, the direction of exchange, and the current state of the relationship before authorizing a consequential connection or change.
- A source relationship is limited to its declared scope. Access or synchronization in one context does not establish permission in another.
- Source-provided context remains source-provided even when FlowOS relates it to native context or derives a new record from it.
- A source relationship may be paused, reauthorized, narrowed, disconnected, or corrected without treating the person’s prior use of it as invalid.
- FlowOS must not represent a source as current when it is stale, unavailable, unauthorized, or outside the relationship’s declared scope.
- The source relationship must distinguish a link or reference from information that FlowOS stores, derives, or is permitted to send onward.

### Source relationship states

| State | Meaning | Must not imply |
|---|---|---|
| **Proposed** | A source relationship is available for the person to consider. | Permission, active access, or a completed exchange. |
| **Authorized** | The person has granted the stated scope of access or exchange. | Successful synchronization, permanent permission, or universal access. |
| **Active** | The relationship is authorized and currently able to support its declared scope. | That every source record is current, complete, or imported. |
| **Paused** | The relationship remains known but is not currently exchanging or refreshing information. | Deletion, rejection, or lost historical context. |
| **Needs attention** | The relationship cannot reliably support its declared scope without review or reauthorization. | User error, loss of all historical information, or a hidden automatic repair. |
| **Disconnected** | The active relationship has ended. | Transfer of source ownership, erasure of retained history, or inability to reconnect later. |

---

## 5. Exchange and Portability

### Exchange rules

An exchange is a bounded movement or refresh of information between FlowOS and a connected system. It may provide context to FlowOS, provide user-approved information to a source, or update the known state of an existing source relationship.

- Every consequential exchange must have a comprehensible direction: into FlowOS, out of FlowOS, or a defined two-way relationship.
- FlowOS must preserve whether a displayed record is a source reference, source-provided record, native record, or derived record when the distinction affects user judgment or correction.
- A source update must not silently become a new direction, commitment, interpretation, adaptation, or recommendation. The receiving system’s authority and applicable interface contract govern any such handoff.
- A FlowOS-originated update to a source requires the person’s applicable authority and a clear record of what FlowOS requested or sent.
- A failed, partial, delayed, or conflicting exchange must remain visible as such. The system must not imply successful alignment merely because a connection exists.
- An exchange must be reversible or correctable to the degree its source and technical constraints permit; any irreversibility must be clear before the person authorizes it.

### Portability rules

Portability means a person can take their FlowOS information and its understandable context elsewhere without making FlowOS the sole interpreter of their history.

- A person must be able to obtain the native information they entrusted to FlowOS, with enough context to understand its meaning, status, provenance, and relevant relationships.
- An export or transfer must not misrepresent source-provided information as FlowOS-owned information or claim rights FlowOS does not have.
- Where a source record cannot be carried because FlowOS does not own it, the system must preserve a clear reference or explain the boundary rather than silently substituting a misleading copy.
- Portability must preserve human-readable meaning as well as machine-readable structure where practical; a bare technical extraction is insufficient if it loses material status or provenance.
- A person’s decision to export, disconnect, or move information elsewhere is a valid exercise of authority, not a failure state.

---

## 6. Continuity and Interoperability Relationships

| Relationship rule | Meaning |
|---|---|
| Source context can inform the product model | External knowledge, work, or evidence may be relevant without becoming a native source of authority. |
| Continuity can relate historical and current records | Earlier context can remain intelligible without staying active. |
| Evidence retains provenance through exchange | A connected source can contribute factual context without obscuring its origin or derivation. |
| Sensemaking can consider source context | A person may interpret relevant external information, while the interpretation remains distinct from the source record. |
| Adaptation requires explicit application | Connected context may inform an adaptation; it cannot silently apply a consequential change. |
| A connection does not establish equivalence | FlowOS and a connected system retain separate responsibilities, states, and sources of truth. |

The system must preserve these relationships without forcing a person to centralize their work, reflect on every imported record, or keep a connection active forever.

---

## 7. Inputs and Outputs

| Type | System input or output | Responsibility |
|---|---|---|
| Input | Native records and their history | Provides FlowOS-owned context that may need to remain intelligible across change. |
| Input | Source identity, declared scope, and authorization state | Defines the permitted relationship to connected context. |
| Input | Source-provided, referenced, or derived records | Supplies external context with visible provenance and availability. |
| Input | User request to connect, pause, correct, disconnect, export, or transfer | Exercises authority over the relationship and movement of information. |
| Output | Continuity state and traceable contextual links | Preserves how current and historical context relate. |
| Output | Source relationship state and exchange history | Makes ownership, scope, availability, and consequential changes understandable. |
| Output | Portable native information and contextual metadata | Enables a person to carry their FlowOS context elsewhere. |
| Output | Explicit handoff to another system | Makes source context available without assigning it responsibility for the next semantic decision. |

The system may make connected context available to an adjacent system. It cannot assign a meaning to that context, change a person’s consequential state, or authorize a source action on the person’s behalf without the receiving system’s rules and an applicable interface contract.

---

## 8. System Invariants

### Source ownership remains legible

FlowOS must not imply that it created, owns, or can guarantee source-provided information merely because it displays, relates, or retains contextual information about it.

### Provenance survives movement

The origin, derivation, scope, and availability of connected context must remain distinguishable whenever they affect a person’s trust, correction, or choice.

### History is not silently rewritten

Source changes, disconnection, reauthorization, and later corrections may change what is current. They must not silently change the record of what was previously known, shown, or chosen.

### Connection is voluntary and bounded

No person must connect an external source, grant unnecessary scope, or maintain an active relationship to receive meaningful FlowOS value.

### Exchange does not transfer authority

An incoming source update, outgoing request, or derived record cannot override user authority or bypass the owning system’s state and approval rules.

### Leaving remains possible

FlowOS must not make a person’s own history, choices, or native context unintelligible or inaccessible merely because they stop using a feature, disconnect a source, or choose another system.

---

## 9. Boundaries With Other Systems

| System | Continuity and Interoperability System owns | Other system owns |
|---|---|---|
| Direction and Commitment | Source relationship and continuity context relevant to a choice. | Meaning and resulting state of a person’s direction or commitment. |
| Action and Evidence | Source origin, availability, and exchange context for connected information. | Whether a record represents actual occurrence, factual evidence, or an outcome. |
| Sensemaking and Adaptation | Availability and provenance of context that a person may consider. | Reflection, insight, adaptation proposal, and explicit adaptation choice. |
| Intelligence and Trust | Source relationship boundaries and exchange semantics. | Eligibility, explanation, uncertainty, correction, and control of automated recommendations. |
| Experience Architecture | Required semantics for ownership, scope, freshness, and continuity. | How those semantics appear across surfaces and journeys. |
| Engineering architecture | Product-level source, portability, and continuity requirements. | Provider protocols, authorization mechanisms, storage, deletion execution, reliability, and security controls. |

Any shared rule about source-to-evidence conversion, conflict handling, source-initiated changes, portability format, or retention handoff requires a system interface contract.

---

## 10. Implications for Lower-Level Documents

Experience documents must make source origin, current availability, scope, and material exchange state intelligible without overwhelming ordinary use. They must distinguish a reference to source context from a FlowOS-owned record where that distinction changes a person’s judgment or available action.

Feature contracts must state whether they connect, reference, import, derive, export, refresh, pause, disconnect, or transfer information. They must name the user authority required, the relevant source relationship state, and the receiving system that owns each consequential outcome.

Engineering and integration documents must define provider-specific authorization, synchronization, conflict, reliability, retention, deletion, and recovery behavior while preserving these product-level rules. They must not let technical convenience obscure provenance, availability, source ownership, or a person’s ability to leave.

Measurement documents may assess connection reliability, context usefulness, and portability success. They must not treat connection count, exchange volume, retained history, or integration adoption as direct evidence of user value.

---

## 11. Non-Goals

This system does not:

- replace connected systems or prescribe a universal way to organize every external source;
- define provider-specific protocols, synchronization schedules, conflict algorithms, retention periods, security controls, or data schemas;
- establish factual truth, interpret source context, or determine the meaning of a person’s history;
- make source connection, exhaustive history, constant sync, or data import a prerequisite for value;
- transfer user authority to a provider, an automation, or FlowOS; or
- define interface layout, feature scope, or a roadmap for integrations.

---

## 12. Change Control

This system changes only when FlowOS changes an enduring rule about continuity, source ownership, provenance through exchange, portability, the boundaries of a source relationship, or the authority involved in moving information across product boundaries.

A change requires:

1. a decision record explaining the system-level need;
2. impact assessment for the Product Model, product glossary, adjacent system contracts, experience architecture, integration and data architecture, privacy and security controls, active feature contracts, and delivery work;
3. evidence that the change preserves legible ownership, provenance, bounded authority, and a person’s ability to disconnect or leave; and
4. confirmation of consistency with the Vision and Product Model.

A provider addition, protocol upgrade, interface layout, or synchronization optimization does not by itself justify changing this system.
