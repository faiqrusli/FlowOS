# Insight Syntheses

**Status:** Active
**Authority:** Canonical standard for interpreting multiple FlowOS evidence records into bounded, traceable, decision-relevant insights
**Owner:** Product and research leadership
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Research Program](./research-program.md) · [Measurement Specifications](./measurement-specifications.md) · [Product Strategy](../01-product/product-strategy.md) · [Success Model](../01-product/success-model.md)
**Children:** Individual insight syntheses in `09-evidence/insights/`, evidence analyses, follow-up research questions, and linked roadmap, review, or decision records
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed document changes the definition, required contents, evidence boundary, confidence model, lifecycle, or relationship between observation, interpretation, recommendation, and decision.

---

## 1. Scope

This document defines what an insight synthesis is, when one is justified, and the responsibility of each individual synthesis.

It answers:

> What bounded pattern, contradiction, uncertainty, or implication becomes intelligible when relevant research and measurement evidence are interpreted together—and what remains unproven?

It does not create raw research evidence, define a metric, choose a product or roadmap action, revise a living contract, or record a release result. Those responsibilities belong to research and measurement records, measurement specifications, decision records, product documents, delivery and release plans, and review records.

---

## 2. Insight-Synthesis Responsibility

An insight synthesis owns the interpretation layer between factual evidence and accountable choice. It makes reasoning inspectable without converting a plausible pattern into an assertion of certainty.

| Artifact | Owns | Must not become |
|---|---|---|
| Evidence record | What was observed, measured, or collected within a bounded method. | An interpretation across records. |
| Insight synthesis | The traceable interpretation of multiple relevant evidence records. | A product decision, metric definition, or replacement specification. |
| Recommendation | A proposed response to an insight, stated as conditional and owned by its recipient. | An approved commitment or automatic change. |
| Decision record | An accountable consequential choice under stated uncertainty. | A synthesis or raw evidence store. |

A synthesis is warranted when a decision, review, or roadmap question depends on a pattern across records that cannot be responsibly inferred from one study, one metric period, or a single vivid anecdote. It is not warranted merely to summarize documents or create a report cadence.

---

## 3. Required Contents

Each individual synthesis in `09-evidence/insights/` contains:

| Section | Required content |
|---|---|
| Identity and status | Title, owner, created date, state, review trigger, intended users, and time boundary. |
| Question and purpose | The exact uncertainty or pattern examined, linked parent artifacts, decision or review context, and non-questions. |
| Evidence register | Included research and measurement records, selection rationale, date range, provenance, quality state, and access limitations. |
| Method | The interpretation or triangulation method, segmentation rules, assumptions, conflicts of interest, and material deviations. |
| Insights | Bounded claims with traceable support, counterevidence, confidence conditions, and limits of transfer. |
| Uncertainty and gaps | What remains unknown, contradictory, degraded, unrepresentative, or unsuitable for the intended use. |
| Implications | Conditional options, questions, or areas for further work, explicitly separated from decisions. |
| Disposition | Links to follow-up research, reviews, decisions, roadmap changes, or closure without action. |

An insight must cite the evidence that supports it. It may quote or summarize only within the access and sensitivity boundary of its sources. A synthesis must not copy participant-identifying or restricted raw material into a broadly available document.

---

## 4. Interpretation Discipline

The synthesis distinguishes four statements:

1. **Observation:** what a cited record directly shows.
2. **Interpretation:** the explanatory or pattern claim derived from one or more observations.
3. **Hypothesis:** a testable possibility that the evidence has not established.
4. **Implication:** a question or possible response for a document owner to consider.

Confidence is relative to the declared use, not a universal rating. It reflects relevance, source provenance, method fit, consistency, data quality, time, population, alternative explanations, and contradiction. A quantified measure may be precise but irrelevant; a participant account may be deeply relevant but not representative. The synthesis states the difference.

When evidence conflicts, preserve the conflict and explain plausible reasons without selecting the preferred answer by omission. A useful result may be that no reliable cross-record pattern exists yet.

---

## 5. Synthesis Boundaries

Synthesis must not use data beyond the authority under which it was collected. It cannot join sources, identities, cohorts, or sensitive contexts in a way that broadens access, enables re-identification, or changes the purpose of collection without the required governing approval.

Do not make causal, universal, diagnostic, or person-level claims unless the source methods and evidence actually support them. Do not turn a stated preference into a verified behavior, a metric movement into a user outcome, or an operational convenience into a product principle.

Recommendations are optional and conditional. The recipient—the Roadmap, a feature brief, a validation plan, a review, or a decision record—owns whether and how to act. If no action is warranted, record that disposition rather than manufacturing a recommendation.

---

## 6. Lifecycle and Correction

Syntheses move through **draft**, **active**, **superseded**, **corrected**, or **closed** states. Once issued for a decision or review, the version used is preserved. Material changes create a correction or successor that identifies new or invalidated evidence, revised interpretation, and impacted parent artifacts.

An older synthesis may remain historically useful while no longer representing current evidence. Supersession must link both ways. A correction never silently upgrades confidence or removes disconfirming evidence.

---

## 7. Relationship to Adjacent Documents

| Document | Insight synthesis owns | Adjacent document owns |
|---|---|---|
| Research Program | Cross-record interpretation and its confidence limits. | Study method, participant protection, and research evidence. |
| Measurement Specifications | Interpretation of a set of qualified measurement records. | Metric definition, instrumentation, collection, and quality rules. |
| Product Strategy and Roadmap | Evidence-supported implications and unanswered questions. | Strategic choices, investment sequence, and commitment. |
| Feature and Validation Documents | Relevant interpretation and follow-up questions. | Problem scope, behavior, delivery, and acceptance assessment. |
| Decision and Review Records | Evidence context for a choice or assessment. | Accountable choice or review disposition. |

---

## 8. Non-Goals and Change Control

Insight Syntheses do not serve as a dashboard, research archive, metric definition, feature specification, roadmap, decision log, or release retrospective.

This standard changes only when FlowOS changes the durable evidence-to-interpretation boundary, required contents, confidence discipline, lifecycle, or correction process. A change requires a decision record, review of affected active syntheses and evidence practices, and confirmation that factual evidence, interpretation, and accountable decisions remain separate.
