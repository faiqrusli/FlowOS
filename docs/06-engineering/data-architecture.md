# Data Architecture

**Status:** Active
**Authority:** Canonical architecture for FlowOS durable information representation, lifecycle, lineage, integrity, access, portability, and data-quality controls
**Owner:** Engineering Architect
**Approval Required:** Founder
**Parent:** [Engineering Architecture](./engineering-architecture.md) · [Product Model](../01-product/product-model.md) · [Action and Evidence System](../02-systems/action-and-evidence.md) · [Continuity and Interoperability System](../02-systems/continuity-and-interoperability.md) · [Intelligence and Trust System](../02-systems/intelligence-and-trust.md)
**Children:** Data-model specifications, schema contracts, migration designs, retention and deletion policies, data-quality rules, data-access specifications, portability formats, data-operation runbooks, and data reviews
**Last Updated:** 2026-08-03
**Review trigger:** A proposed change alters durable data ownership, representation, lifecycle, lineage, mutation, derivation, access, retention, deletion, portability, integrity, or data-quality behavior.

---

## Document Ownership

### Owner
**Role:** Engineering Architect
**Responsibility:** Maintain the data architecture, propose data model changes and schema boundaries that preserve product semantics and authority

### Modification Process
1. Engineering Architect proposes data architecture changes (based on delivery design needs or data evidence)
2. Submit to Founder for approval
3. Founder reviews for alignment with product model and system documents
4. If approved: Engineering Architect updates the document
5. Document change in decision record if consequential
6. Update the Last Updated date

### Authority Level
- Engineering Architect can: propose and maintain data architecture, define data boundaries and lifecycle
- Requires approval for: any change to durable data ownership, representation, or lifecycle

---

## 1. Scope

This document defines how FlowOS represents and manages durable information so that product meaning, provenance, history, authority, and recovery survive technical implementation and change.

It answers:

> How does FlowOS store, transform, access, retain, correct, remove, and carry information without confusing product concepts, silently rewriting history, or treating technical possession as authority?

It does not define the Product Model, a database schema, storage technology, API, provider, retention duration, privacy policy, migration script, or operational procedure. Those responsibilities belong to parent product and system documents, data-model specifications, engineering architecture, delivery designs, security and privacy standards, and operations documents.

---

## 2. Data-Architecture Responsibility

Data Architecture has seven responsibilities:

1. represent product concepts and system state without collapsing their distinct meanings or owners;
2. preserve origin, actor, time, source scope, derivation, reliability, and correction context where product trust requires provenance;
3. govern how information is created, changed, derived, synchronized, archived, exported, deleted, and repaired;
4. enforce data access that reflects person authority, source boundaries, and the narrowest valid technical scope;
5. make historical, current, unavailable, corrected, and derived information distinguishable and recoverable;
6. provide data integrity, quality, observability, and compatibility rules that feature delivery designs can apply consistently; and
7. separate normative data architecture from current schemas, migrations, queries, storage configuration, and operational facts.

Data Architecture represents product semantics; it does not create them. A technical field, record, computed value, or cached copy cannot by itself establish a commitment, action, outcome, interpretation, source ownership, recommendation, or person authorization.

---

## 3. Data Authority Model

Data authority flows from product ownership to a durable representation and then to implementation and operations.

```text
Product Model and System Documents
  ↓
Data Architecture
  ↓
Data-model and data-access specifications
  ↓
Feature delivery design and migration design
  ↓
Schema, data store, service, job, and operational record
```

The sequence does not make data concerns subordinate in safety. Data evidence can reveal that a product rule cannot be implemented without loss, ambiguity, inappropriate access, or unacceptable risk. In that case, delivery pauses and the appropriate product, system, behavior, or delivery document is revised through its change process.

### Product owner and data steward

Every durable representation has two distinct accountabilities:

- **Product owner:** the document and role that own what the represented concept means and how its state may change; and
- **data steward:** the engineering role and document that own safe representation, integrity, access enforcement, lifecycle, observability, and repair.

Data stewardship does not transfer product authority. A product owner cannot require a representation that violates safety, access, recovery, or integrity constraints without an explicit, reviewed architecture decision.

---

## 4. Representation Classes and Lineage

Every material record must have a representation class. A class makes the record’s relationship to product truth and source ownership understandable to technical systems and, when material, to a person.

| Representation class | Meaning | Required treatment |
|---|---|---|
| **Native record** | Information created and managed directly by FlowOS within an authorized product system. | Preserve product owner, actor, lifecycle, current and historical state, and applicable access controls. |
| **User-provided record** | Information explicitly entered, asserted, or corrected by a person. | Preserve that it is user-provided; do not falsely represent it as direct observation or source verification. |
| **Source-provided record** | Information received from a connected system within a declared source relationship. | Preserve source identity, scope, receipt context, freshness, synchronization and availability state. |
| **Reference** | A durable pointer to information whose authoritative content remains elsewhere. | Preserve source, relationship scope, availability, and enough identity to resolve or explain the reference. |
| **Derived record** | Information computed or transformed from one or more other records. | Preserve inputs, derivation rule or version, derivation time, and limitations needed for correction and trust. |
| **Operational record** | Information required to secure, operate, observe, audit, repair, or support technical systems. | Limit access and retention to operational need; do not present it as product evidence by default. |
| **Historical snapshot** | A preserved representation of past context needed to understand prior state, decision, or exchange. | Label as historical, retain relevant provenance, and prevent it from appearing current without a basis. |

An individual record can be related to several classes over its lifecycle, but its current role and lineage must remain explicit. For example, a derived record may use a source-provided input; it does not become source-provided merely because its input was.

### Minimum lineage requirements

Where material to meaning, trust, correction, source boundary, or recovery, a representation must retain:

1. a stable identity appropriate to its owner;
2. the owning product system and relevant concept;
3. creation or receipt time and actor or source;
4. representation class and source or derivation relationship;
5. current lifecycle and reliability or availability state;
6. links to prior, superseded, corrected, or derived representations where applicable; and
7. access, retention, and portability constraints that limit future use.

The exact storage form belongs in a data-model specification. This architecture defines the information that must not be lost through that form.

---

## 5. Semantic Integrity and State

### Keep product concepts distinct

Data models and interfaces must preserve the distinct concepts and owners defined by the Product Model and system documents. In particular, an intention, plan, commitment, action, evidence record, outcome, reflection, insight, adaptation, source relationship, inference, recommendation, and automation record must not become interchangeable merely because they share fields or user interfaces.

### State is owned before it is stored

Every material state transition must identify the owning product system, actor, valid predecessor condition, and effect on related history. Technical persistence must not allow a state change that the owning system forbids, even if a client, background job, migration, or integration can produce the raw data.

### Current state and history are different views

Current state supports present use. Historical representation supports explanation, correction, review, and continuity. A model may optimize current access, but it must not discard the history required by the product’s correction, provenance, source, and continuity rules.

### Correct rather than conceal

A correction must preserve what changed, why, by whom or what authority, and what remains valid. The data model may support a person’s request to remove information within approved retention and deletion rules, but it must not use a generic update operation to obscure material historical change.

### Derived information retains a basis

Derived records—including calculations, summaries, classifications, inferred patterns, and assistive outputs—must retain sufficient link to their inputs and derivation context to support explanation, correction, withdrawal, reprocessing, and safe limitation. A derived value cannot overwrite the source record or a person’s interpretation.

---

## 6. Lifecycle, Retention, Deletion, and Portability

### Explicit lifecycle operations

Data-model and delivery documents must classify every material lifecycle operation as one or more of: create, receive, reference, update, correct, derive, synchronize, archive, supersede, export, transfer, restrict, delete, or repair. The operation must identify its product owner, authority, traceability, and recovery implications.

### Retention follows purpose and authority

Information is retained only for an approved product, legal, safety, security, continuity, support, or operational purpose. Technical convenience, speculative analytics, or possible future value is not sufficient by itself. The applicable retention and privacy policy defines duration and lawful constraints; this architecture requires that those limits remain enforceable and inspectable.

### Deletion is not a generic state transition

Deletion must distinguish the person-facing effect, technical erasure or restriction, retained operational obligations, source-owned information, derived records, backups, and historical context. A deletion design must state what can be removed, what must be retained, what becomes unavailable, and how the person or operator understands the result.

### Portability preserves meaning

Export and transfer must preserve a person’s native records, material status, relationships, provenance, and understandable context to the degree FlowOS owns and is permitted to carry them. Source-provided information must not be exported as FlowOS-owned content without the applicable right or clear reference boundary.

### Source disconnection changes availability, not history by default

When a source relationship ends, data architecture must preserve the distinction among previously received information, live source access, historical reference, retained permitted context, and information that must be removed or restricted. Disconnection must not silently rewrite the past or leave unauthorized ongoing access.

---

## 7. Access, Privacy, and Security

### Access is least-privilege and purpose-bound

Each read, write, export, transformation, background operation, and operational access path must have an identified actor, purpose, scope, and enforcement boundary. Access is granted for the narrowest valid purpose and must be reviewable, revocable, and auditable where consequence or sensitivity requires it.

### Data use does not exceed source or person authority

Possession of data, a technical role, cached content, or an integration credential does not authorize a new use. Data architecture must enforce the source relationship, person authority, privacy constraints, and Intelligence and Trust rules that bound processing, recommendation, automation, export, and external action.

### Sensitive information receives proportional protection

Data-model specifications and delivery designs must identify sensitivity, exposure paths, access classes, encryption or equivalent controls where appropriate, logging limits, test-data handling, support access, and breach or incident implications. Product meaning remains separate from sensitivity classification; a sensitive record is not automatically more authoritative.

### Operational access is constrained and traceable

Support, debugging, migration, quality, and operations access must be limited to the minimum information and duration required. Material access and changes must leave enough audit context for accountable investigation without unnecessarily retaining personal content.

---

## 8. Quality, Consistency, and Observability

### Define data quality in product terms

Data quality includes accuracy relative to source, completeness within declared scope, timeliness, consistency, lineage, accessibility to authorized actors, and fitness for the product decision it supports. A technically non-null field or successful job is not sufficient if the representation is stale, ambiguous, wrongly attributed, or misleading in use.

### Consistency model must be visible at boundaries

Where technical systems can be eventually consistent, asynchronous, partially available, or conflict-prone, the relevant data-model and delivery documents must define which representation is current, which is pending, how conflict is detected, what is displayed, and how repair occurs. They must not promise immediate truth that the system cannot provide.

### Validate at trusted boundaries

Material creation, transition, import, derivation, and export must be validated at an appropriate trusted boundary, not only in a client representation or an optimistic workflow. The implementation mechanism is an engineering decision; the preservation of product rules is mandatory.

### Observe material data behavior

Data operations must provide proportional signals for integrity failures, synchronization lag, unexpected access, derivation failure, migration outcome, deletion and export outcome, and repair. Observability must support investigation without becoming a second uncontrolled store of sensitive content.

### Repair is a first-class operation

Data repair must have an authorized owner, scope, audit context, compatibility assessment, rollback or containment strategy, and person-facing consequence when the repair affects visible state. Repair cannot become a path to silently alter product history.

---

## 9. Migration and Compatibility

### Model change before schema change

A schema, storage, or data-flow change begins with the owning product and system semantics, then the applicable data-model specification and delivery design. A migration must not become the first place where the team discovers or decides what a record means.

### State compatibility explicitly

For each material change, the migration design must state treatment for existing records, derived records, source-linked information, access scope, historical snapshots, current clients, exports, integrations, backups, and operational processes. The design must identify whether the strategy is additive, transitional, backfill, transform, archive, restrict, delete, or a deliberate non-migration.

### Prefer repairable evolution

When several paths satisfy the behavior contract, prefer the approach that preserves provenance, correction, compatibility, reversibility, and operational understanding. An irreversible transformation requires a decision record and a proportionate recovery or containment plan.

### Verify the result, not just completion

Migration validation must assess semantic integrity, access control, lineage, current and historical state, feature behavior, export and deletion effects, and repairability. A completed job, successful deployment, or row-count match is not sufficient proof that the product representation remains correct.

---

## 10. Current Implementation References and Transition

[TECHNICAL_ARCHITECTURE.md](../06-engineering/TECHNICAL_ARCHITECTURE.md) remains the current reference for the implemented data model, stack, known debt, and deployment facts. Current schema, migration, and database configuration artifacts remain actual implementation evidence.

All new reusable data architecture, data-model specifications, lifecycle policies, and migration designs belong in `06-engineering/`. Existing implementation references remain active for their factual scope until a material revision creates an explicit successor. Do not copy current schema listings or migration history into this architecture; link to the implementation reference and define only the durable rule it lacks.

---

## 11. Boundaries With Other Documents

| Document family | Data Architecture owns | That family owns |
|---|---|---|
| Product Model and system documents | Durable technical representation of their concepts and state. | Concept meaning, ownership, invariants, and person authority. |
| Continuity and Interoperability System | Technical enforcement of source, portability, history, and exchange constraints. | Product-level source relationship and continuity semantics. |
| Intelligence and Trust System | Representation and lineage controls for derived and assistive information. | Assistance eligibility, explanation, control, correction, and authority policy. |
| Identity and access architecture | Data access requirements and consumer boundaries. | Authentication, authorization mechanisms, delegation, and session enforcement. |
| Integration architecture | Data exchange, source representation, and synchronization constraints. | Provider contracts, exchange mechanics, and dependency operation. |
| Delivery design | Reusable data rules the feature must apply. | Feature-specific storage change, migration, rollout, and recovery approach. |
| Privacy, security, and retention policy | Architecture requirements that must be enforced. | Applicable policy, duration, legal interpretation, and specialist review. |
| Quality and operations architecture | Data-quality, observability, repair, and operational evidence requirements. | Verification methods, monitoring implementation, backup, incident response, and runbooks. |

---

## 12. Implications for Child Documents

Data-model specifications must map each representation to its product owner, representation class, lifecycle, access scope, lineage requirements, integrity rules, quality expectations, and relevant interface contracts. They must not redefine the Product Model or hide a state transition in a schema field.

Migration designs must identify the authorized behavior, affected representations, compatibility strategy, access and retention impact, validation, rollback or repair path, operational ownership, and evidence record. They must not become a replacement product decision.

Data-access specifications must define enforceable purpose, actors, scopes, authorization, audit, revocation, and failure behavior for material reads, writes, exports, derivations, and operations. They must inherit authority from the product and identity architecture.

Portability, deletion, quality, and repair documents must link to the relevant product system, delivery design, security and privacy requirements, and operations architecture. They must preserve the distinction between a person’s request, a technical operation, and the resulting product-visible state.

---

## 13. Non-Goals

This document does not:

- prescribe database technology, schema, table, column, index, query, event format, ORM, storage provider, migration tool, backup configuration, or API;
- redefine product concepts, ownership, user authority, state meaning, evidence reliability, source relationships, or recommendation policy;
- define retention duration, legal requirements, privacy policy, security controls, or deletion execution in detail;
- replace identity and access, integration, intelligence and trust, quality, operations, delivery-design, or implementation documents;
- treat technical possession, successful synchronization, record volume, or a populated field as proof of factual truth or permission; or
- allow storage optimization, analytics convenience, or migration speed to silently erase provenance, history, correction, access boundaries, or a person’s ability to leave.

---

## 14. Change Control

This document changes only when FlowOS changes an enduring rule about durable representation, lineage, semantic integrity, lifecycle, access, retention, deletion, portability, quality, migration, or data repair.

A change requires:

1. a decision record explaining the architecture-level need;
2. impact assessment for Product Model and affected system documents, Engineering Architecture, data-model and access specifications, identity and integration architecture, active delivery designs, privacy and security requirements, quality and operations architecture, implementation, and reviews;
3. evidence that the change preserves product semantics, person authority, provenance, historical truth, privacy, security, recoverability, and operational understanding; and
4. confirmation of consistency with the Vision, Documentation Architecture, Product Model, applicable system documents, Engineering Architecture, and affected Behavior Contracts.

A schema refactor, storage optimization, vendor change, analytics request, or one feature’s migration convenience does not by itself justify changing this architecture.
