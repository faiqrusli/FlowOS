# FlowOS Success Model

**Status:** Active
**Authority:** Canonical definition of product outcomes, success signals, metric meaning, and anti-metrics
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Vision.md](../00-constitution/Vision.md) · [Product Model](./product-model.md) · [Product Strategy](./product-strategy.md) · [Documentation Architecture](../00-constitution/documentation-architecture.md)
**Children:** Measurement Specification, Measurement Reports, Validation Plans, Roadmap, Release Plans, Review Records
**Last Updated:** 2026-08-03
**Review trigger:** New strategic evidence, a change to an outcome or metric definition, a discovered metric failure mode, or a request to use a metric as a release or investment criterion.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain outcome definitions, success signals, metric meaning, and ensure success model aligns with Vision and product strategy

### Modification Process
1. Product Architect proposes success model changes (based on evidence, strategic shifts, or metric learnings)
2. Submit to Founder for approval
3. Founder reviews for Vision alignment and strategic coherence
4. If approved: Product Architect updates document
5. Document change in decision record if consequential
6. Update Last Updated date

### Authority Level
- Product Architect can: Propose outcome definition updates, maintain success signals, track metric meaning
- Requires approval for: Changes to core outcome dimensions, new success signals, metric definition changes, or anti-metric additions

---

## 1. Scope

This document defines what product success means for FlowOS and how the team can responsibly recognize it.

It answers:

> What outcomes must FlowOS create, what evidence would indicate them, and which measurements must never be mistaken for success?

It does not define event instrumentation, store measurement results, set release-stage thresholds, prescribe feature behavior, or sequence work. Those responsibilities belong to the Measurement Specification, Measurement Reports, release plans and gates, feature contracts, and roadmap.

The Success Model is not a score for users. It is a decision framework for the FlowOS team.

---

## 2. Product Outcome

FlowOS succeeds when a person can direct themselves with greater clarity, honesty, and agency than they could with disconnected alternatives.

This outcome has five required dimensions:

| Dimension | Product success means | Product failure means |
|---|---|---|
| **Clarity** | A person can identify what deserves attention and make a realistic present choice. | The product adds ambiguity, decision fatigue, or planning overhead. |
| **Deliberate action** | A person can move from a chosen commitment into meaningful action with less unnecessary friction. | The product becomes another layer of organization that delays action. |
| **Reality contact** | A person can distinguish intention, commitment, action, and outcome. | The product rewards plans or activity while obscuring what actually happened. |
| **Learning** | A person can use evidence and context to make a more grounded next choice. | The product records history without changing understanding or future judgment. |
| **Agency and trust** | A person understands, controls, corrects, and can decline the product’s suggestions. | The product becomes opaque, judgmental, coercive, or silently controlling. |

No one dimension is sufficient. High engagement without agency, accurate records without learning, or planning without action is not product success.

---

## 3. Evidence Hierarchy

FlowOS evaluates success using complementary evidence. No metric or study can establish success alone.

| Evidence type | What it can establish | What it cannot establish |
|---|---|---|
| User research | Whether people understand, trust, and find value in the product’s role in their lives. | Population-scale behavior or causal certainty. |
| Behavioral evidence | Whether people complete meaningful actions and return to the product’s core loop. | Why they acted or whether the experience was valuable. |
| Product records | Whether the system accurately represents actions, evidence, and user control. | Whether the person’s life improved. |
| Measurement reports | Trends, cohorts, changes over time, and anomalies. | Motive, interpretation, or strategic choice by themselves. |
| Reviews and post-release learning | Whether a bounded release met its existing contract and what it taught. | A replacement strategy or product model. |

Strategic conclusions require at least one behavioral or product record and one source of human context when the conclusion concerns user value, trust, or understanding.

---

## 4. Outcome Signals

The following signals indicate whether FlowOS is creating the intended outcome. The Measurement Specification will define their instrumentation; feature validation plans may select the signals relevant to their scope.

### 4.1 Decision value

**Definition:** The degree to which active users report that FlowOS helped them make a clearer or better-grounded next choice.

**Primary evidence:** Structured user research and periodic in-product prompts designed to gather context rather than demand approval.

**Interpretation rule:** A positive response is meaningful only when paired with an identifiable product moment, decision, or pattern. Generic satisfaction is insufficient.

### 4.2 Deliberate-action activation

**Definition:** The proportion of new or returning users who move from opening FlowOS to a meaningful deliberate action without avoidable navigation or setup friction.

**Primary evidence:** Observed first-use sessions and behavioral records.

**Interpretation rule:** Faster movement is valuable only when the action remains intentional. Accidental, coerced, or low-value activity does not improve this signal.

### 4.3 Commitment-to-evidence continuity

**Definition:** The degree to which meaningful commitments can be connected to honest evidence about what occurred.

**Primary evidence:** Product records and user observation.

**Interpretation rule:** This does not require every action to be formalized or every commitment to be completed. It measures whether the product preserves reality when users choose to use the loop.

### 4.4 Learning value

**Definition:** The degree to which users can identify a useful pattern, constraint, or adjustment from their own evidence and context.

**Primary evidence:** Research, reflections, and post-release learning.

**Interpretation rule:** FlowOS must not optimize for reflection volume or forced adaptation. An unchanged choice can be a valid outcome of good sensemaking.

### 4.5 Agency and trust

**Definition:** The degree to which users understand what FlowOS records or recommends, can correct it, and retain authority over consequential choices.

**Primary evidence:** Research, correction behavior, consent and security records, and review findings.

**Interpretation rule:** Recommendation acceptance is not a trust metric. Dismissal, correction, and non-use can all be evidence of healthy user authority.

### 4.6 Sustained voluntary return

**Definition:** The degree to which users return to FlowOS over time to perform meaningful actions without external prompting.

**Primary evidence:** Cohort retention and meaningful active-day reporting.

**Interpretation rule:** Return is a viability signal, not the purpose of the product. It must be read alongside decision value, agency, and evidence quality.

---

## 5. Operational Metrics

Operational metrics support the outcome signals above. Their exact events, formulas, and data-quality rules belong in the Measurement Specification.

| Metric | Meaning | Supports | Must not be used as |
|---|---|---|---|
| **Meaningful active day** | A calendar day on which a user performs at least one meaningful product action, defined by the Measurement Specification. | Sustained voluntary return. | Proof of user value or life improvement. |
| **Weekly active days** | Number of meaningful active days in a rolling seven-day period. | Engagement pattern and return frequency. | The product’s north star or a personal productivity score. |
| **D1, D7, and D30 retention** | Return of an eligible cohort on the defined day window. | Product viability and repeat relevance. | An explanation of why users return or churn. |
| **Open-to-deliberate-action time** | Time from opening an eligible FlowOS surface to a meaningful deliberate action. | Deliberate-action activation. | A measure of quality without observed intent. |
| **Connected-loop participation** | Use of a meaningful connection between commitment, action, evidence, and, where useful, sensemaking. | Continuity of the product model. | A mandatory daily ritual or a universal completion rate. |
| **Record correction rate** | User corrections to records, provenance, or recommendations. | Agency, data quality, and usability diagnosis. | A failure metric without qualitative investigation. |
| **Recommendation comprehension** | Whether users can explain the evidence, uncertainty, and choice behind a recommendation. | Agency and trust. | Recommendation acceptance or automation success. |
| **Data integrity incidents** | Verified loss, incorrect ownership, unauthorized access, or provenance failures. | Trust and reliability. | A normal trade-off for engagement or speed. |

Release gates may set thresholds for these metrics. A threshold belongs to the relevant release gate or release plan; the meaning of the metric remains here.

---

## 6. Guardrails and Anti-Metrics

FlowOS must not optimize for measures that can increase while the intended product outcome worsens.

| Do not optimize for | Why it is unsafe |
|---|---|
| Total tasks created or completed | Activity can rise while clarity, direction, and meaningful outcomes decline. |
| Total focus time | Time spent is not evidence of useful action or outcome. |
| Reflection count or length | Forced reflection creates compliance behavior rather than learning. |
| Recommendation acceptance rate | Acceptance can indicate pressure, opacity, or unhealthy deference. |
| Uninterrupted streaks | Streaks can punish recovery, changing conditions, and wise revision. |
| Time in product | Attention captured by FlowOS is not attention directed by the user. |
| Aggregate “growth,” “discipline,” or “productivity” score | A person cannot be represented responsibly by a universal behavioral score. |
| Feature usage parity | Equal use of every capability is not a sign of a coherent product. |

Any proposal that promotes an anti-metric to a primary measure requires an explicit decision record and evidence that it can be interpreted safely.

---

## 7. Success by Maturity Stage

The meaning of success remains constant, but the evidence required becomes stronger as FlowOS matures.

| Stage | What must be learned | Strongest evidence |
|---|---|---|
| **Foundational use** | Whether the core model is understandable and usable by intended people. | Observed use, user research, and accurate product records. |
| **Early repeat use** | Whether users voluntarily return for meaningful self-direction. | Cohort behavior paired with user explanation. |
| **Retention proof** | Whether value persists across a meaningful cohort and varied circumstances. | Repeated retention patterns, research synthesis, and trust evidence. |
| **Sustained product** | Whether FlowOS remains trusted and valuable as the user’s responsibilities and connected systems evolve. | Longitudinal research, reliability evidence, and durable voluntary return. |

Stage names do not set dates, release thresholds, or roadmap commitments. Those belong to delivery documents.

---

## 8. Responsibilities

| Document | Responsibility relative to this model |
|---|---|
| Product Strategy | Chooses which audience and strategic assumptions this model evaluates. |
| Measurement Specification | Defines events, cohorts, formulas, instrumentation, and data-quality checks. |
| Measurement Report | Records factual values for a bounded period or cohort. |
| Research Program and Study Records | Define and preserve human evidence. |
| Insight Synthesis | Interprets evidence across studies and reports. |
| Validation Plan | Selects success signals and acceptance checks for one feature. |
| Release Plan or Gate | Applies time-bounded thresholds and readiness criteria. |
| Review Record | Assesses whether an existing contract met its stated criteria. |
| Roadmap | Sequences work in response to validated outcomes and evidence. |

No child document may change a metric’s meaning without updating this Success Model.

---

## 9. Change Control

The Success Model changes only when FlowOS changes the outcome it seeks, the meaning of success, the definition of a metric, or an anti-metric rule.

A change requires:

1. evidence that the current model is incomplete, misleading, or unsafe;
2. a decision record explaining the change and its expected consequences;
3. an impact assessment for measurement, validation, release gates, roadmap, and active feature work; and
4. confirmation that the change remains consistent with the Vision, Product Model, and Product Strategy.

Changing a threshold, time window, or reporting format does not change this model unless it changes the meaning of success itself.
