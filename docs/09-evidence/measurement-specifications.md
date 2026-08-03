# Measurement Specifications

**Status:** Active
**Authority:** Canonical standard for defining, instrumenting, qualifying, governing, and revising FlowOS measurements
**Owner:** Product Architect + Engineering Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Success Model](../01-product/success-model.md) · [Roadmap](../07-strategy-and-delivery/roadmap.md) · [Data Architecture](../06-engineering/data-architecture.md) · [Quality Architecture](../06-engineering/quality-architecture.md) · [Operations Architecture](../06-engineering/operations-architecture.md)
**Children:** Individual measurement specifications in `09-evidence/measurements/`, instrumentation contracts, data-quality assessments, metric change records, measurement evidence records, and linked analyses or reviews
**Last Updated:** 2026-08-03
**Review trigger:** A proposed document changes the definition, required contents, authority boundary, collection limit, quality rule, lifecycle, or revision process for FlowOS measurements.

---

## Document Ownership

### Owner
**Role:** Product Architect + Engineering Architect
**Responsibility:** Product Architect maintains metric meaning and product alignment; Engineering Architect maintains technical implementation and data quality

### Modification Process
1. Product Architect proposes metric definition changes (based on product strategy or success model needs)
2. Engineering Architect proposes technical implementation changes (based on data architecture or quality needs)
3. Both architects review cross-functional implications
4. Submit to Founder for approval
5. Founder reviews for Vision and product alignment
6. If approved: Product Architect and Engineering Architect update document
7. Document change in decision record if consequential
8. Update Last Updated date

### Authority Level
- Product Architect can: Propose metric definition updates, maintain product alignment, coordinate with Engineering Architect
- Engineering Architect can: Propose technical implementation updates, maintain data quality, coordinate with Product Architect
- Requires approval for: Changes to metric meaning, collection limits, or quality rules

---

## 1. Scope

This document defines what a FlowOS measurement specification is, when one is required, and the single responsibility of each specification.

It answers:

> How does FlowOS define a meaningful, bounded, traceable measurement before collecting or interpreting it, so that numbers retain their connection to product meaning, people, source authority, and decision context?

It does not choose product outcomes, establish user value, define feature behavior, collect data without authorization, prescribe database implementation, display a dashboard, interpret an observed result, or decide a course of action. Those responsibilities belong to the Success Model, product and feature contracts, Data Architecture, research records, analyses, decision records, and review records.

---

## 2. Measurement-Specification Responsibility

An individual measurement specification owns one answer to this question:

> What exactly is being measured, why is it relevant, how is it validly observed, what are its boundaries and limitations, and how will its quality and interpretation be governed?

Each specification must link to a named product outcome, strategic hypothesis, validation criterion, operational need, guardrail, or anti-metric. It must never treat activity, collection volume, or ease of calculation as proof of meaning.

The specification precedes durable instrumentation or consequential use. Small exploratory collection may be allowed under a bounded research or operational protocol, but it must not become a canonical metric, persistent tracking behavior, or decision input without an approved specification.

| Artifact | Measurement specification owns | It does not own |
|---|---|---|
| Metric definition | Meaning, unit, population, time boundary, calculation, and limitations. | The product outcome it serves. |
| Instrumentation contract | The required observable event or state and its provenance requirements. | The implementation method or vendor configuration. |
| Measurement evidence record | Factual observed values and collection context. | Interpretation, recommendation, or decision. |
| Analysis | Interpretation of measured evidence under stated assumptions. | A change to metric meaning or a decision. |
| Decision record | Choice informed by evidence. | The raw measurement or its definition. |

---

## 3. Required Measurement Specification Contents

Every individual specification in `09-evidence/measurements/` must contain:

| Section | Required content |
|---|---|
| Identity and status | Title, owner, state, created date, review date, and change trigger. |
| Intended use | Linked outcome, hypothesis, validation criterion, guardrail, or anti-metric; the decision it may inform; and explicit prohibited uses. |
| Definition | Plain-language meaning, unit of observation, formula, numerator, denominator, inclusion and exclusion rules, time window, segmentation, and aggregation rule. |
| Population and authority | Who or what is represented, eligibility, consent or legal basis where relevant, source relationship, and treatment of missing or withdrawn authority. |
| Observation contract | Events, states, timestamps, source and transformation provenance, identity-resolution rule, and expected ordering or duplication behavior. |
| Quality and limitations | Completeness, accuracy, freshness, consistency, bias risks, uncertainty, known failure modes, and acceptable quality thresholds. |
| Access and retention | Minimum necessary collection, sensitivity classification, access roles, retention, correction, deletion, and export constraints. |
| Evidence and revision | Links to evidence records, validation results, definition version, migration treatment, and invalidation or supersession conditions. |

The owner must be identifiable and accountable for semantic correctness. Engineering, analysis, or operations contributors may be responsible for implementation or monitoring, but they do not silently redefine the measurement.

---

## 4. Meaning Before Instrumentation

Metrics are instruments, not proxies for a person's worth or self-direction. A specification must state what a metric can reasonably indicate and what it cannot establish.

No metric may be introduced merely because an event is easy to emit, a dashboard exists, an external system provides a field, or a target is convenient. A metric must have a plausible causal or diagnostic relationship to its stated use, with its uncertainty made visible.

The definition must distinguish:

1. **event** — an observed occurrence with a provenance and timestamp;
2. **recorded value** — a stored representation of an event or state;
3. **derived measure** — a calculation from recorded values;
4. **metric** — an interpreted measure used for a named product or operational purpose; and
5. **decision signal** — a metric considered alongside other relevant evidence.

When a Success Model term is measured, the specification applies that term without redefining it. If the metric exposes an ambiguity in the outcome, success signal, or anti-metric, update the owning document through its own governance instead of fixing meaning locally.

---

## 5. Collection, Authority, and Provenance Boundaries

Collection is permitted only when it serves a defined use and respects user authority, source scope, privacy, security, accessibility, and data-lifecycle controls. Measure the minimum necessary; do not create a durable measurement trail simply because it could later be useful.

Each observable input must identify its origin: person-provided, product-generated, connected source, operator-entered, or derived. Derived values retain links to their inputs, calculation version, and material transformation. A metric must distinguish unknown, unavailable, not authorized, zero, and false; these states must not be silently collapsed.

Identity resolution, account changes, source revocation, duplicate events, delayed delivery, clock differences, and reprocessing can materially change a value. The specification states how each is handled, and whether historical values are restated or retained under their prior definition.

Data may be aggregated, de-identified, or sampled where that reduces risk, but these methods do not remove the need for a documented purpose, access boundary, and re-identification safeguard. Measurement must never override a person's request to correct, remove, or limit information where the governing data policy requires it.

---

## 6. Measurement Quality and Validation

Every specification defines proportionate checks for:

- **completeness:** whether required observations arrive for the stated population and period;
- **accuracy:** whether observed values correspond to the defined event or state;
- **consistency:** whether the same rules produce comparable values across surfaces, sources, and time;
- **freshness:** whether values are available within the stated decision horizon;
- **integrity:** whether duplication, loss, ordering, transformation, and access issues are detected; and
- **interpretability:** whether a user of the metric can understand its definition, limits, and recent changes.

Validation links to Quality Architecture and the relevant delivery design or operational runbook. A passing pipeline check is not proof that the metric represents the intended product meaning. Conversely, a meaningful metric with delayed data may still be usable if its limits are explicit and fit the decision.

If quality falls below the stated threshold, the measurement is marked degraded or invalid for its prohibited uses. Dashboards and analyses must surface this status rather than displaying an apparently precise value.

---

## 7. Evidence, Analysis, and Decision Boundaries

Observed values are stored as measurement evidence records with date range, specification version, source coverage, quality state, and material caveats. They may support research, validation, operations, reviews, or decisions, but do not contain conclusions beyond factual collection context.

Analysis must link to the specification and evidence records it uses, state assumptions and segmentation choices, preserve counterexamples and uncertainty, and avoid claims the metric cannot support. A result may motivate research, a review, or a decision; it does not compel any of them.

Targets and thresholds require a stated purpose. They must not become hidden incentives that encourage collection, manipulation, or product behavior inconsistent with the product's governing commitments. Any target that could materially affect a person's experience, release decision, or investment direction receives proportionate review and a linked decision record.

---

## 8. Lifecycle, Versioning, and Correction

Specifications move through **proposed**, **active**, **deprecated**, **superseded**, or **retired** states. An active specification has a stable identifier and version. A material definition change creates a new version; it never silently rewrites the history of earlier evidence.

A change record must say whether historical values are retained, recalculated, partially comparable, or invalid for comparison. It identifies the owner, rationale, affected dashboards or analyses, migration and communication plan, quality validation, and links to any decision record. A definition may be deprecated while existing evidence remains historically valid under its stated version.

Corrections preserve the original observation or result where permitted, identify the basis for correction, and trigger review of dependent analyses, decisions, and records. When data cannot be corrected reliably, mark the affected evidence invalid rather than manufacturing continuity.

---

## 9. Relationship to Adjacent Documents

| Document | Measurement specification owns | Adjacent document owns |
|---|---|---|
| Success Model | How a named signal is observed and qualified. | Outcome, success-signal, and anti-metric meaning. |
| Research Program | Quantitative definition and collection constraints. | Human research method, participant evidence, and synthesis. |
| Data Architecture | Measurement-specific provenance and use requirements. | Durable data lifecycle, integrity, access, and deletion rules. |
| Quality and Operations Architecture | Measurement quality obligations and monitoring intent. | Reusable verification and operational systems. |
| Validation Plans | Reusable metric definition and evidence expectations. | Feature-specific acceptance assessment. |
| Decision and Review Records | Underlying evidence and metric limits. | Accountable choice or bounded assessment and disposition. |

---

## 10. Non-Goals and Change Control

Measurement Specifications do not serve as dashboards, analytics notebooks, data dictionaries for every implementation field, quotas, personal scores, experimental results, research reports, decisions, or release approvals.

This standard changes only when FlowOS changes the enduring meaning-first rule, required specification contents, collection limit, quality boundary, lifecycle, or correction process. A change requires a decision record, impact assessment for active specifications and dependent evidence, and confirmation that product meaning, factual evidence, interpretation, and decision authority remain distinct.
