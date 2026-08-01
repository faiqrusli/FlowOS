# Post-Release Learning Records

**Status:** Active
**Authority:** Canonical standard for preserving what a bounded FlowOS release taught the team after real conditions, without rewriting the release plan, review, evidence, or decision history
**Owner:** Product, engineering, and operations leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Release Plans](../07-strategy-and-delivery/release-plans.md) · [Review Records](./review-records.md) · [Research Program](../09-evidence/research-program.md) · [Measurement Specifications](../09-evidence/measurement-specifications.md) · [Operations Architecture](../06-engineering/operations-architecture.md)
**Children:** Individual post-release learning records in `10-reviews/post-release/`, linked follow-up research, review, decision, delivery, and roadmap artifacts
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, required contents, historical boundary, lifecycle, or relationship among release plans, evidence, reviews, decisions, and post-release learning.

---

## 1. Scope

This document defines what a FlowOS post-release learning record is, when one is required, and the responsibility of each individual record.

It answers:

> What did this bounded release teach FlowOS under real conditions when expected behavior, outcome, operation, evidence, and review are considered together—and what follow-up must be considered?

It does not approve a release, assess conformance to a contract, hold raw research or metrics, assign blame, create a future roadmap, or decide a consequential response. Those responsibilities belong to release plans, review records, evidence records, delivery/roadmap documents, and decision records.

---

## 2. Post-Release-Learning Responsibility

A post-release learning record is a time-bounded synthesis of a release in real use. It preserves the comparison between intention and observed conditions, then directs follow-up to the documents that own it.

| Artifact | Learning record owns | It does not own |
|---|---|---|
| Release plan | What was intended, scoped, monitored, and recoverable before and during availability. | The subsequent learning narrative. |
| Review record | Whether a defined contract or gate was met. | Broader learning across actual conditions. |
| Evidence record | Factual research, measurement, validation, or operational observations. | Cross-source release learning. |
| Learning record | Lessons, unknowns, and follow-up links arising from the release. | A decision, repair plan, or roadmap commitment. |
| Decision record | An accountable consequential response. | The learning synthesis. |

The record is required after a material release reaches its stated observation window, is withdrawn, has a significant incident or correction, expands meaningfully, or when its release plan or review requires a learning review. The depth is proportionate to impact, uncertainty, risk, and novelty.

---

## 3. Required Contents

Each individual record in `10-reviews/post-release/` contains:

| Section | Required content |
|---|---|
| Identity and boundary | Title, owner, release link, population, observation window, status, and exclusions. |
| Intended release | The release's stated purpose, scope, expected outcome, guardrails, known limits, and stop conditions. |
| Observed conditions | Linked factual evidence: rollout, behavior, outcomes, quality, operations, support, research, and measurement context. |
| Comparison | What aligned, diverged, remained unobserved, or was invalidated relative to the intended release. |
| Lessons and uncertainty | Traceable learning, counterevidence, confidence limits, unknowns, and the limits of transfer to future releases. |
| Follow-through | Linked research, review, decision, feature, delivery, release, or roadmap artifacts that own next actions. |
| Disposition | Closed, corrected, superseded, or kept open for a named observation condition. |

The record does not copy raw data, participant material, credentials, incident timelines, or implementation detail. It links to the records that preserve those facts.

---

## 4. Learning Discipline

Learning must distinguish expectation, observation, interpretation, and action. A release plan can have been followed while an outcome did not materialize; a metric can move while the intended value is unclear; an incident can be resolved while the underlying risk remains. The record names these differences.

Do not use the record to rationalize a prior choice, assign personal blame, manufacture success, or suppress failed assumptions. Preserve surprises, negative evidence, operational burden, support patterns, accessibility or trust concerns, source effects, and evidence gaps. A useful conclusion can be that the observation window was insufficient or that no conclusion is warranted.

When follow-up is consequential, create or link the appropriate decision record. When it changes a living contract, route it through that document's change control. When it needs more evidence, create a research question, measurement revision, or review condition rather than a speculative roadmap commitment.

---

## 5. Lifecycle and Historical Integrity

Learning records move through **planned**, **observing**, **issued**, **corrected**, **superseded**, or **closed** states. An issued record is append-only except for explicit corrections. A correction names the original statement, basis, consequence for follow-up, and evidence/records affected.

Closing a record means its observation window and stated follow-through are complete or explicitly transferred; it does not mean the release is permanently successful. A superseding record preserves the earlier learning context and explains the material new conditions.

---

## 6. Relationship to Adjacent Documents

| Document | Post-release learning owns | Adjacent document owns |
|---|---|---|
| Release Plans | Learning after the release observation window. | Release scope, readiness, rollout, containment, and recovery coordination. |
| Review Records | Cross-source release learning and open questions. | Assessment against stated criteria and disposition. |
| Research and Measurement | Comparison and implication links. | Evidence methods, definitions, raw findings, and values. |
| Roadmap and Delivery Plans | What needs to be reconsidered or explored. | Current priority, commitment, and coordination. |
| Decision Records | Learning context for a consequential response. | The accountable choice and rationale. |

---

## 7. Non-Goals and Change Control

Post-Release Learning Records do not serve as a release approval, incident postmortem, blame report, dashboard, research repository, feature specification, or decision log.

This standard changes only when FlowOS changes the durable boundary, required contents, lifecycle, correction process, or follow-up relationship for post-release learning. A change requires a decision record, impact assessment for active release and review practices, and confirmation that release planning, evidence, assessment, learning, and decision authority remain separate.
