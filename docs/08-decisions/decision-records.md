# Decision Records

**Status:** Active
**Authority:** Canonical standard for recording consequential FlowOS decisions, alternatives, evidence, impact, disposition, and historical correction
**Owner:** Accountable decision owner
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Roadmap](../07-strategy-and-delivery/roadmap.md) · [Product Strategy](../01-product/product-strategy.md) · [Engineering Architecture](../06-engineering/engineering-architecture.md)
**Children:** Individual decision records in `08-decisions/records/`, decision reviews, correction records, supersession records, and child-document impact assessments
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, threshold, required contents, authority boundary, lifecycle, correction process, or review standard of a FlowOS decision record.

---

## 1. Scope

This document defines what a FlowOS decision record is, when one is required, and the single responsibility each individual record must own.

It answers:

> How does FlowOS preserve why one consequential choice was made, what alternatives existed, what evidence informed it, what it changes, and how later teams should understand or supersede it?

It does not make a decision, define a living product or engineering contract, collect raw evidence, assess a result, coordinate delivery, or silently update child documents. Those responsibilities belong to the accountable decision owner and the parent documents, evidence records, reviews, roadmaps, delivery plans, and specifications the record links.

---

## 2. Decision-Record Responsibility

An individual decision record owns one historical answer to this question:

> Why was this consequential option chosen over its alternatives at this time, with this evidence and these known consequences?

Every decision record must:

1. state one precise decision and its accountable owner;
2. distinguish observed evidence, assumptions, interpretation, constraints, and the resulting choice;
3. describe material alternatives, tradeoffs, dissent or uncertainty where relevant, and reasons they were not chosen;
4. identify affected parent and child documents, product behavior, data, source, trust, delivery, or operations boundaries;
5. record the disposition, review trigger, and path to correction or supersession; and
6. preserve historical truth after acceptance without becoming a duplicate living specification.

A decision record explains a choice. It does not become the ongoing authority for every subject it cites.

---

## 3. When a Decision Record Is Required

A decision record is required for a choice that materially:

- changes or interprets a product, system, experience, design, engineering, roadmap, release, or documentation-architecture boundary;
- commits, narrows, defers, retires, or expands a roadmap outcome, feature, release, or material investment;
- selects among significant alternatives in data, access, integration, intelligence, security, privacy, quality, operations, or recovery;
- accepts, mitigates, or declines a material product, trust, safety, legal, security, privacy, data, or operational risk;
- creates an exception to a reusable standard or a change that future contributors would otherwise need to rediscover; or
- resolves a conflict among active documents or accountable owners.

Records are not required for routine implementation choices contained by an active delivery design, low-risk editorial changes, or a correction that restores an existing clear contract. If a “routine” choice has durable cross-team impact, it is consequential and requires a record.

---

## 4. Required Contents of an Individual Decision Record

| Section | Must establish | Must not contain |
|---|---|---|
| **Identity and disposition** | Title, created date, owner, status, linked parent, decision type, and accepted, superseded, corrected, or closed disposition. | A mutable living specification. |
| **Decision statement** | One unambiguous choice and its scope. | Several independent decisions or vague intent. |
| **Context and trigger** | Why the decision was needed now and the boundary it affects. | A restatement of the Vision or unrelated history. |
| **Evidence and assumptions** | Linked factual evidence, uncertainty, constraints, and assumptions. | Raw evidence copied without source or unsupported certainty. |
| **Options considered** | Material alternatives, including defer, narrow, non-build, or repair where applicable. | A retrospective justification that hides real choices. |
| **Decision and rationale** | What was chosen and why it best satisfies the relevant contracts and evidence. | A substitute for an unmodified parent contract. |
| **Consequences and risks** | Expected effects, tradeoffs, debts, exceptions, and boundaries that remain. | An unbounded task list or hidden risk acceptance. |
| **Impact and follow-up** | Parent and child documents to revise, validate, review, or retire; accountable owners and deadlines only where necessary. | Silent document or implementation changes. |
| **Review and supersession** | Trigger for reconsideration and how a correction or successor will be linked. | Retroactive rewriting of the accepted choice. |

Required metadata includes `Created`, `Evidence links`, `Decision type`, `Disposition`, `Owner`, `Affected documents`, and `Review trigger` in addition to durable-document metadata.

---

## 5. Authority and Historical Rules

### A record cannot silently override a parent

A decision record may identify that a parent contract must change. It does not itself override the Vision, Product Model, system documents, behavior contract, engineering architecture, or roadmap. The owner must revise the valid parent through its change-control process and link the record.

### Accepted records are append-only

After acceptance, correct errors through a linked correction record or supersede the decision with a new record. Do not rewrite the historical context, alternatives, rationale, or outcome to make past reasoning appear cleaner.

### Evidence is linked, not rewritten

The record states the decision-relevant implication of evidence and links the underlying research, measurement, validation, operational, or review record. It must distinguish fact from interpretation and decision.

### Decision scope is bounded

One record owns one consequential choice. If several choices depend on one another, create linked records that state the dependency rather than a monolithic record no one can review or supersede precisely.

---

## 6. Lifecycle, Correction, and Supersession

| State | Meaning | Required treatment |
|---|---|---|
| **Draft** | Decision is being considered and has no historical authority. | Label uncertainty and avoid treating it as commitment. |
| **Accepted** | The accountable choice is made and its impacts are known. | Preserve the record; update affected living documents. |
| **Implemented** | Required child-document or delivery impacts were completed. | Link factual implementation and review evidence; do not rewrite rationale. |
| **Superseded** | A later decision replaced this record’s active choice. | Link successor and preserve this record. |
| **Corrected** | A factual or representational error is addressed by a linked correction. | Preserve original and state correction scope. |
| **Closed** | No further action remains under this decision’s stated scope. | Retain for historical reasoning. |

Supersession is not failure. It is the correct outcome when new evidence, changed conditions, or a revised parent contract makes the prior choice no longer valid.

---

## 7. Relationship to Adjacent Documents

| Document | Decision record owns | Adjacent document owns |
|---|---|---|
| Roadmap | Why a material outcome or gate changed. | Current outcome sequence and investment state. |
| Product, system, experience, design, and engineering documents | Rationale for a consequential change. | The active ongoing contract. |
| Delivery and release plans | Why a material sequencing, scope, risk, or release choice was made. | Current coordination and release execution. |
| Evidence record | The decision-relevant implication. | Factual observation, study, measurement, test, or operational data. |
| Review record | The choice that follows an assessment. | Assessment, findings, and disposition evidence. |
| Implementation and runbooks | Decision constraints and exception rationale. | Actual code, procedure, configuration, and operation. |

---

## 8. Legacy Decision-Log Transition

[decision-log.md](../11-archive/current-phase/logs/decision-log.md) remains an append-only historical collection of prior decisions. All new consequential decisions belong in `08-decisions/records/` and follow this standard. Existing entries are not rewritten or duplicated; when one must be revisited, create a linked successor or correction record.

The legacy log remains discoverable until its historical entries are indexed or explicitly archived. It must not receive new records that compete with the individual-record authority model.

---

## 9. Non-Goals

Decision Records do not:

- replace the Vision or any living product, system, feature, design, engineering, roadmap, delivery, or release specification;
- serve as a backlog, meeting note, research repository, review, implementation plan, or release approval;
- convert evidence into a decision without accountable judgment;
- erase uncertainty, rejected alternatives, correction, or supersession from history; or
- create authority to bypass person control, source boundaries, security, privacy, accessibility, quality, or recovery requirements.

---

## 10. Change Control

This standard changes only when FlowOS changes the enduring definition, threshold, required contents, authority boundary, lifecycle, or correction process for decision records.

A change requires a decision record, impact assessment for active parent documents and records, evidence that historical truth and single responsibility remain preserved, and confirmation of consistency with Documentation Architecture and the Roadmap.
