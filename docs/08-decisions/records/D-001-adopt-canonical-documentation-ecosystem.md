# D-001: Adopt the Canonical FlowOS Documentation Ecosystem

**Status:** Accepted
**Authority:** Historical record of the decision to operate FlowOS documentation through the canonical 00–10 ecosystem
**Owner:** Product and documentation leadership
**Parent:** [Documentation Architecture](../../00-constitution/documentation-architecture.md)
**Children:** Updates, corrections, or superseding decisions; child-document impact assessments
**Last reviewed:** 2026-08-01
**Review trigger:** A proposed change alters the constitutional location, authority, lifecycle, or responsibility boundaries of the active documentation ecosystem.
**Created:** 2026-08-01
**Evidence links:** [Documentation Architecture](../../00-constitution/documentation-architecture.md) · [Document Map](../../meta/document-map.md) · [Historical Documentation Planning](../../archive/documentation/documentation-planning-2026-08-01.md)
**Disposition:** Accepted

---

## Context

FlowOS required a durable documentation system in which every authoritative document has one responsibility, inherits from higher authority, and can be discovered without treating legacy planning, logs, implementation references, or historical material as competing product truth.

The canonical Vision remains immutable and is not reproduced, interpreted, or modified by this decision.

## Options Considered

1. Continue using the existing strategy, foundation, execution, review, and archive documents as a distributed, overlapping authority model.
2. Create new high-level product-philosophy or execution-system documents alongside the Vision.
3. Adopt a single 00–10 documentation ecosystem, with explicit responsibility boundaries, active standards, record families, transition notes for legacy material, and archive preservation for superseded planning.

## Decision

Adopt option 3.

The Documentation Architecture governs the ecosystem. Active documents are organized by constitutional, product, system, experience, feature, design, engineering, delivery, decision, evidence, and review responsibility. Templates and directory indexes support discovery and consistent record creation but do not become authorities.

Existing material remains current only within its explicitly narrowed scope, becomes transitional where a successor now owns the reusable responsibility, or is preserved as historical material. No document is deleted merely because it is superseded; it retains a direct replacement path or is archived.

## Consequences

- Every new durable document must identify its parent, children, scope, exclusions, owner, status, and review trigger.
- Future product, feature, engineering, evidence, and review work uses the corresponding standard and starter template rather than creating ad hoc forms.
- Material document-boundary changes receive an impact assessment and a linked decision record.
- The global document map and folder indexes remain discovery views; they do not override the active documents they link to.

## Follow-Through

- Maintain the Decision Register whenever consequential records change state.
- Archive the superseded documentation-planning artifact with a direct link to its active replacement.
- Create individual record-level documents only from real product work, evidence, releases, incidents, reviews, or decisions. Do not create synthetic studies, measurement reports, reviews, or post-release learning records merely to populate the tree.

## Review

This decision remains valid while the documentation ecosystem preserves the immutable Vision, one responsibility per document, and explicit historical transitions. A material restructuring requires a successor decision record and child-document impact assessment.
