# Engineering Standards

**Status:** Active
**Authority:** Canonical standard for how FlowOS engineering work changes product software, data, infrastructure, dependencies, and technical documentation safely and accountably
**Owner:** Engineering Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [Engineering Architecture](./engineering-architecture.md) · [Data Architecture](./data-architecture.md) · [Identity and Access Architecture](./identity-and-access-architecture.md) · [Quality Architecture](./quality-architecture.md) · [Operations Architecture](./operations-architecture.md)
**Children:** Engineering change proposals, implementation plans, code and schema changes, dependency assessments, technical reviews, migrations, runbooks, and engineering decision records
**Last Updated:** 2026-08-03 (consolidated SDLC docs)
**Review trigger:** A proposed document changes the durable engineering practices for implementing, reviewing, verifying, documenting, releasing, recovering, or retiring product software and technical dependencies.
**Note:** Comprehensive SDLC documentation (123KB, archived Aug 2026) captured detailed lifecycle processes. This document now serves as the single SDLC authority, covering essential engineering standards established in practice.

---

## Document Ownership

### Owner
**Role:** Engineering Architect
**Responsibility:** Maintain engineering standards, define SDLC processes and code quality expectations, establish testing standards

### Modification Process
1. Engineering Architect proposes changes (based on engineering evidence or delivery design needs)
2. Submit to Founder for approval
3. Founder reviews for alignment with engineering architecture and product integrity
4. If approved: Engineering Architect updates the document
5. Document change in decision record if consequential
6. Update the Last Updated date

### Authority Level
- Engineering Architect can: maintain engineering standards within approved architecture, define SDLC and quality expectations
- Requires approval for: material changes to engineering practices or standards

---

## 1. Scope

This document defines the reusable practice for changing FlowOS safely. It governs the engineering work that turns approved product, feature, design, and delivery contracts into operating software.

It answers:

> How must engineering change FlowOS so that an approved outcome is implemented, verified, operated, documented, and recoverable without allowing implementation convenience to silently change product meaning or person authority?

It does not define product behavior, visual expression, a feature's technical design, programming-language style, an exact command, repository layout, release approval, or an operational procedure. Those belong to behavior and design contracts, delivery designs, code standards, implementation references, release plans, and runbooks.

---

## 2. Engineering-Standard Responsibility

Engineering standards own the change discipline across code, data, configuration, infrastructure, dependencies, and technical documentation.

| Concern | This document owns | Adjacent document owns |
|---|---|---|
| Change authorization | Whether engineering work has the necessary product, design, and delivery contracts. | The product, behavior, design, and delivery content of those contracts. |
| Implementation discipline | Required impact assessment, review, verification, documentation, and recovery thinking. | Specific architecture, code style, tool, or provider choice. |
| Technical integrity | The obligation to preserve authority, provenance, security, privacy, accessibility, reliability, and correction. | Domain-specific technical rules and controls. |
| Engineering evidence | What must be verifiable before a change is considered ready for its next gate. | Validation methods, operational observation, review disposition, or release decision. |

No engineering shortcut creates authority to redefine a product concept, alter a person-visible behavior, expand data access, change source scope, introduce automation, or silently weaken a control. Where a conflict exists, the affected parent contract or decision record must resolve it before implementation proceeds.

---

## 3. Change Entry Criteria

Before material engineering work begins, the accountable engineer confirms the smallest adequate set of active inputs:

1. a product, system, feature, or operational problem with a clear owner and scope;
2. an approved behavior contract and feature design specification when the change is person-visible;
3. a delivery design when the change has material data, integration, security, migration, performance, rollout, or recovery implications;
4. a validation plan proportionate to risk and an identified release path where availability changes; and
5. the relevant engineering, data, access, integration, intelligence, quality, and operations constraints.

Exploration may occur before every input is complete, but exploratory work must not be shipped, placed behind normal production authority, or treated as an approved behavior. Uncertainty discovered in implementation is recorded and escalated to the document that owns the unanswered question.

---

## 4. Required Engineering Change Assessment

Every material change records, in the delivery design, implementation plan, pull request, or equivalent execution artifact:

- the user-visible and technical scope, exclusions, owner, and parent contracts;
- affected product objects, state transitions, source relationships, data, access boundaries, integrations, assistive capabilities, and operational dependencies;
- compatibility, migration, backfill, rollback, correction, and removal implications;
- security, privacy, authority, provenance, accessibility, performance, reliability, observability, and support implications;
- validation evidence, monitoring or release constraints, and material unresolved risks; and
- technical-documentation updates, decisions, reviews, or successor records required by the change.

The assessment is proportionate. A small isolated visual fix may need only the behavior/design check and focused verification. A change that can alter access, durable records, historical truth, external effects, or availability needs deeper review and an explicit recovery path.

---

## 5. Implement Without Semantic Drift

Implementation preserves the meaning, authority, and distinctions defined above it. Engineers must not collapse states that the product needs to distinguish, silently convert an external source into native ownership, treat a recommendation as a command, or represent a partial result as a completed action.

Code, schema, configuration, and infrastructure changes must be coherent: a behavior change is not complete if its data rules, access control, user-visible state, tests, observability, and documentation contradict one another. A successful build or deployment is necessary evidence, not proof that a change is correct or valuable.

Reuse existing patterns only when their semantics, security posture, accessibility, operational behavior, and recovery implications fit the new scope. Avoiding a new abstraction is not a justification for misrepresenting meaning; creating a new abstraction is not a justification for broadening scope without an approved contract.

---

## 6. Review, Verification, and Readiness

Engineering review examines the implementation against its declared contracts, not merely style or local correctness. Review includes the appropriate combination of:

- correctness of affected product state and edge-case behavior;
- access control, input handling, dependency and secret management, and auditability;
- data integrity, migration, lineage, correction, retention, and deletion behavior;
- source and external-effect safety, idempotency, failure handling, and recovery;
- accessibility, performance, rendering, and resilience of person-visible behavior;
- automated and manual validation evidence, including regression boundaries; and
- documentation, operational readiness, monitoring, rollback, and support implications.

Reviewers identify gaps rather than approving by assumption. A finding that changes a requirement returns to the contract owner; a finding that requires an irreversible or consequential choice creates or updates a decision record. Exceptions are explicit, time-bounded where possible, and include a compensating control or re-review trigger.

---

## 7. Documentation, Dependencies, and Technical Debt

Engineering work updates the authoritative document that the change affects; it does not leave the implementation as the only account of a new rule. A change to a feature updates its feature documents. A reusable engineering-boundary change updates the applicable architecture. A decision, evidence, or review is recorded in its own family.

Dependencies are evaluated for scope, authority, data handling, reliability, lifecycle, security, licensing, operational support, migration, and exit path. Provider convenience or model capability does not justify access beyond the approved product and engineering boundaries.

Technical debt is a record of a known implementation liability, not a reason to conceal risk or postpone required integrity work. Debt items state affected scope, consequence, evidence, owner, intended disposition, and link to the delivery, review, or decision artifact that decides priority. They must not become an informal backlog that overrides the Roadmap.

---

## 8. Release, Recovery, and Learning

Engineering supplies implementation and operational readiness evidence to a release plan; it does not authorize release by itself. Before availability expands, the team must understand the intended scope, monitoring, containment, rollback or repair path, data and access implications, support path, and conditions for stopping or withdrawing.

After a release, incident, or material correction, engineers preserve factual evidence and participate in the appropriate review or post-release learning record. Correct a known defect through a traceable change; do not rewrite records, suppress an error state, or relabel an unresolved condition as complete.

---

## 9. Relationship to Existing Implementation References

[ENGINEERING.md](../00-constitution/governance/ENGINEERING.md) remains a transitional M2 execution-context reference. [CODE_STANDARDS.md](../00-constitution/governance/CODE_STANDARDS.md) remains the detailed repository-convention reference until it receives an explicit successor. [GATES.md](../00-constitution/governance/GATES.md) and current runbooks remain factual and operational references within their stated scope.

New reusable engineering-change practice belongs here. Existing implementation references do not override this standard, Engineering Architecture, or their parent contracts; they are revised or retired through their own transition path when their scope materially changes.

---

## 10. Non-Goals and Change Control

Engineering Standards do not serve as a coding-style guide, technical architecture, threat model, schema reference, feature design, validation result, release plan, incident runbook, or roadmap.

This standard changes only when FlowOS changes the durable engineering practice for authorizing, assessing, implementing, reviewing, verifying, documenting, releasing, recovering, or retiring technical work. A change requires a decision record, parent and child impact assessment, and confirmation of consistency with the applicable product, system, design, engineering, quality, operations, and documentation authorities.
