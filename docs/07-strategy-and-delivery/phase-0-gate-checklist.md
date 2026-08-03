# Phase 0 Gate Checklist (Authority Aligned)

**Owner:** Release Manager  
**Approver:** Founder  
**Status:** Draft  
**Last Updated:** 2026-08-04

---

## Overview

This checklist defines the formal exit criteria for **Gate 0 — Authority Aligned** (Phase 0: Freeze Ambiguity and Establish Document Authority).

Per the [MVP Implementation Masterplan](./mvp-implementation-masterplan.md), the Gate 0 target is:

> Every proposed MVP work item points to a feature domain, parent system, design/engineering contract, and this masterplan phase. Work that cannot do so pauses.

**Gate decision date:** 2026-08-06

**Decision rule:** Phase 1 (Establish Implementation Truth) may begin **only** after the Founder signs off on this checklist with all seven criteria marked **Pass**. Any criterion marked **Fail** or **In Progress** blocks the gate.

**Status legend:** ⚪ Not Started | 🟡 In Progress | ✅ Pass | ❌ Fail

---

## Gate 0 Exit Criteria

### Criterion 1 — MVP Implementation Masterplan adopted as implementation source

- [ ] **Status:** Pass / Fail / In Progress
- **Description:** `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md` is the authoritative source for all implementation work. No new work may be initiated from legacy plans.
- **Verification Method:** Confirm the masterplan is referenced as the implementation source in `.ai/context.md` and `docs/07-strategy-and-delivery/current-sprint.md`. Confirm no active work item references a legacy plan as its source.
- **Required Evidence:**
  - Reference to the masterplan present in `.ai/context.md` (Documentation Authority section)
  - Reference to the masterplan present in `docs/07-strategy-and-delivery/current-sprint.md`
  - No open work item citing `docs/strategy/execution-masterplan.md` as its source

### Criterion 2 — Feature Catalog adopted as current feature coverage map

- [ ] **Status:** Pass / Fail / In Progress
- **Description:** `docs/04-features/feature-catalog.md` is the accepted map of current feature coverage. Feature coverage questions are answered from this catalog, not ad hoc lists.
- **Verification Method:** Confirm the Feature Catalog is referenced as the coverage map in the masterplan Phase 0 deliverables and in `.ai/context.md`. Confirm it carries Document Ownership metadata.
- **Required Evidence:**
  - `docs/04-features/feature-catalog.md` listed in masterplan Phase 0 deliverables
  - Feature Catalog referenced in `.ai/context.md` (Key Documents)
  - Document Ownership section present in `docs/04-features/feature-catalog.md`

### Criterion 3 — Design Implementation Map adopted as current design reconciliation

- [ ] **Status:** Pass / Fail / In Progress
- **Description:** `docs/05-design/design-implementation-map.md` is the accepted record of how the design system is reconciled with implementation. It is the source for design-vs-implementation gap questions.
- **Verification Method:** Confirm the Design Implementation Map is referenced as the design reconciliation in the masterplan Phase 0 deliverables and in `.ai/context.md`. Confirm it carries Document Ownership metadata.
- **Required Evidence:**
  - `docs/05-design/design-implementation-map.md` listed in masterplan Phase 0 deliverables
  - Design Implementation Map referenced in `.ai/context.md`
  - Document Ownership section present in `docs/05-design/design-implementation-map.md`

### Criterion 4 — AI Skills System v2.0 deployed and referencing 6-role structure

- [✅] **Status:** Pass
- **Description:** The AI skills system (`.ai/`) references the 6-role team structure, the MVP Implementation Masterplan, and the current sprint workflow. Any AI working on FlowOS loads the correct context.
- **Verification Method:** Confirm `.ai/context.md` is version v2.0, documents the 6 active roles with their responsibilities, and references the masterplan and current sprint. Confirm `AGENTS.md` and role workflow files reference the 6-role structure.
- **Required Evidence:**
  - `.ai/context.md` header states v2.0 and 6-role team
  - `AGENTS.md` includes the FlowOS AI Skills System v2.0 section
  - `.ai/workflows/role-assignment.md` and `.ai/README.md` reference the 6 active roles

### Criterion 5 — Legacy documents archived, cleaned up, and marked historical

- [✅] **Status:** Pass
- **Description:** Legacy specifications, logs, runbooks, and folders are cleaned up and archived to prevent pollution, and surviving legacy documents (such as execution-masterplan.md) carry warning banners.
- **Verification Method:** Open each legacy document and confirm a visible historical warning banner is present, and confirm that all unneeded legacy operational files and folders have been moved to `docs/archive/` and removed from active paths.
- **Required Evidence:**
  - Legacy specs, logs, and runbooks archived to `docs/archive/execution/...` and `docs/archive/design/...`.
  - Empty legacy directories (`docs/design/`, `docs/execution/runbooks/`, etc.) cleaned up.
  - Fresh August 2026 logs structure established in `docs/execution/` with `august-log.md` and a clean `developer-log/`.
  - `docs/strategy/execution-masterplan.md` carries historical warning banner.
  - New AI real-time logging rules deployed and active.

### Criterion 6 — Core product, design, and engineering docs updated with 6-role ownership

- [ ] **Status:** Pass / Fail / In Progress
- **Description:** Every core product, design, and engineering document carries a Document Ownership section naming its Owner and Approval Required, with roles aligned to the 6-role structure.
- **Verification Method:** Spot-check each core document for a Document Ownership section containing an explicit `Owner:` (Product Architect, Design Architect, or Engineering Architect as appropriate) and `Approval Required: Founder`. Confirm no core doc still uses generic "leadership" language.
- **Required Evidence:**
  - Product (Batch 1): `docs/01-product/product-model.md`, `docs/01-product/product-glossary.md`, `docs/01-product/product-strategy.md`, `docs/01-product/success-model.md`, `docs/02-systems/direction-and-commitment.md`, `docs/02-systems/action-and-evidence.md`, `docs/02-systems/sensemaking-and-adaptation.md`, `docs/04-features/feature-catalog.md`, `docs/04-features/feature-briefs.md`, `docs/04-features/behavior-contracts.md`
  - Design (Batch 1): `docs/05-design/design-system-architecture.md`, `docs/05-design/design-implementation-map.md`, `docs/05-design/content-standards.md`, `docs/05-design/accessibility-standards.md`, `docs/05-design/feature-design-specifications.md`, `docs/03-experience/experience-architecture.md`, `docs/03-experience/information-structure.md`, `docs/03-experience/journey-contracts.md`
  - Engineering (Batch 1): `docs/06-engineering/engineering-architecture.md`, `docs/06-engineering/engineering-standards.md`, `docs/06-engineering/data-architecture.md`, `docs/06-engineering/identity-and-access-architecture.md`, `docs/06-engineering/integration-architecture.md`, `docs/06-engineering/intelligence-and-trust-architecture.md`, `docs/06-engineering/quality-architecture.md`, `docs/06-engineering/operations-architecture.md`, `docs/06-engineering/client-architecture.md`, `docs/foundation/TECHNICAL_ARCHITECTURE.md`
  - One PR per role track with Document Ownership sections added and Founder approval recorded

### Criterion 7 — Implementation truth backlog created

- [ ] **Status:** Pass / Fail / In Progress
- **Description:** `docs/07-strategy-and-delivery/implementation-truth-backlog.md` exists and captures unresolved questions about the current implementation state (not speculative features).
- **Verification Method:** Confirm the backlog file exists, is organized by MVP domain (Today, Tasks, Focus, Reflection), and contains only "what exists now?" questions (e.g., "What are all Today page routes?", "How does task scheduling work?", "What's the complete data model for Focus?"). Confirm no item is a speculative/requested feature.
- **Required Evidence:**
  - `docs/07-strategy-and-delivery/implementation-truth-backlog.md` exists
  - Question list present for every MVP domain
  - Zero speculative feature items
  - No pre-existing backlog consumed; items are unresolved current-state questions only

---

## Summary

| # | Criterion | Status | Owner (Delivery) |
|---|-----------|--------|------------------|
| 1 | MVP Masterplan adopted as implementation source | ⚪ Not Started | Product Architect |
| 2 | Feature Catalog adopted as coverage map | ⚪ Not Started | Product Architect |
| 3 | Design Implementation Map adopted | ⚪ Not Started | Design Architect |
| 4 | AI Skills System v2.0 deployed (6-role reference) | ✅ Pass | Product Architect |
| 5 | Legacy docs archived and marked historical | ✅ Pass | Implementation Engineer |
| 6 | Core docs updated with 6-role ownership | ⚪ Not Started | Product / Design / Engineering Architects |
| 7 | Implementation truth backlog created | ⚪ Not Started | Implementation Engineer |

**Gate 0 Overall:** 28% — Criterion 4 and 5 passed, awaiting remaining roles

---

## Sign-off Section

This section is reserved for the **Founder** to explicitly sign off on Gate 0.

### Gate 0 Sign-off

**Phase 0 — Freeze Ambiguity and Establish Document Authority**

**Date:** ______________

**Decision:** (check one)

- [ ] **PASS Gate 0** — Proceed to Phase 1 (Establish Implementation Truth)
- [ ] **HOLD Gate 0** — Phase 0 extended pending items:
  - ______________________________________________
  - ______________________________________________

**Rationale:**

_______________________________________________

_______________________________________________

**Founder signature:**

_______________________________________________

**Name / Title:** Founder — FlowOS

**Attestation:**

> I confirm that all seven Gate 0 exit criteria above have been verified to my satisfaction, that the evidence listed for each criterion is accurate, and that Phase 1 work may begin only after this signature is recorded.

---

## Revision History

| Date | Change | By |
|------|--------|-----|
| 2026-08-04 | Initial draft — Gate 0 exit criteria, evidence requirements, sign-off process | Release Manager |

---

## Related Documents

- [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) — Phase 0 definition and Gate 0 target
- [Current Sprint](./current-sprint.md) — Phase 0 role assignments and gate progress
- [Implementation Truth Backlog](./implementation-truth-backlog.md) — Criterion 7 deliverable
- [Documentation Update Plan](./documentation-update-plan.md) — Ownership update scope
- [Authority Matrix](../12-team/authority-matrix.md) — Role ownership reference
- [Feature Catalog](../04-features/feature-catalog.md) — Criterion 2 deliverable
- [Design Implementation Map](../05-design/design-implementation-map.md) — Criterion 3 deliverable
