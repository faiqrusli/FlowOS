# Documentation Refinement Plan

**Status:** Active
**Authority:** Canonical plan for reconciling FlowOS's current implementation references into the documentation architecture before MVP dogfood
**Owner:** Product Architect
**Approval Required:** Founder
**Parent:** [Documentation Architecture](../00-constitution/documentation-architecture.md) · [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) · [Roadmap](./roadmap.md)
**Children:** Feature dossiers, design specifications, engineering delivery designs, evidence records, decisions, and reviews created by this plan
**Last Updated:** 2026-08-03
**Review trigger:** A documentation source is added, removed, renamed, promoted, archived, or its responsibility or authority changes.

---

## Document Ownership

### Owner
**Role:** Product Architect
**Responsibility:** Maintain documentation refinement plan, ensure documentation architecture alignment, and coordinate with Design Architect and Engineering Architect on cross-role documentation needs

### Modification Process
1. Product Architect proposes refinement plan changes (based on documentation gaps or architectural updates)
2. Design Architect and Engineering Architect review for design and engineering documentation implications
3. Submit to Founder for approval
4. Founder reviews for Vision and documentation architecture alignment
5. If approved: Product Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Product Architect can: Propose refinement plan updates, maintain documentation priorities, coordinate with Design and Engineering Architects
- Requires approval for: Changes to documentation architecture, work package sequencing, or disposition rules

---

## 1. Purpose

FlowOS currently contains three kinds of documentation mixed together:

1. canonical product and engineering architecture;
2. current implementation references and operational runbooks; and
3. historical plans, audits, and future feature intent.

This plan turns that mixed collection into a navigable system without rewriting the immutable Vision or preserving old assumptions as requirements. It is a work plan for documentation itself. The [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) remains the source for application implementation order.

## 2. Refinement principles

- **One responsibility per document.** An inventory does not become a behavior contract; a design reference does not become a roadmap.
- **Current truth before desired state.** Reconcile code, data, routes, and rendered UI before documenting what should change.
- **Explicit lifecycle.** Every source is labeled canonical active, current implementation reference, transitional, operational, historical, or retired.
- **No empty dossiers.** Create an individual feature document only when its behavior, decision, or implementation is sufficiently bounded to own.
- **Evidence over inherited intent.** Old future plans are inputs to review, not commitments.
- **Promotion rather than duplication.** When a legacy reference contains a still-valid rule, promote or link the rule and mark the old source's remaining role.
- **Lower documents inherit; they do not redefine.** A feature can apply a system, but cannot silently change its semantics.

## 3. Current documentation layers

| Layer | Current authority | Refinement responsibility |
|---|---|---|
| Constitution and product meaning | `strategy/Vision.md`, `00-constitution/`, `01-product/`, `02-systems/` | Leave Vision immutable; resolve any conflicts in the owning active document. |
| Experience and feature standards | `03-experience/`, `04-features/` standards | Keep standards normative; add feature-domain coverage through the Feature Catalog. |
| Design standards and implementation | `05-design/` plus `foundation/DESIGN_SYSTEM_V3*.md` and CSS | Use the Design Implementation Map to name one source per layer. |
| Engineering architecture | `06-engineering/` plus `foundation/TECHNICAL_ARCHITECTURE.md` and governance | Promote durable boundaries; keep stack and code notes implementation-specific. |
| Strategy and delivery | `07-strategy-and-delivery/` | Use the MVP Masterplan for implementation order and Roadmap for outcome governance. |
| Decisions, evidence, and reviews | `08-decisions/`, `09-evidence/`, `10-reviews/` | Preserve why, what was observed, and what changed as separate records. |
| Current operations | `execution/`, `review/`, `foundation/` references | Keep operational truth useful; do not let it override the canonical layers. |
| Historical material | `archive/`, old strategy/design folders | Retain for context, label clearly, and never start new work from it directly. |

## 4. Work packages

Each work package has one output and one completion test. The status is intentionally set to **Planned** until the work is performed against the current code and evidence.

| ID | Work package | Output | Depends on | Status |
|---|---|---|---|---|
| DOC-0 | Authority and lifecycle cleanup | Updated indexes, document map, redirects, and supersession notes | Documentation Architecture | **In progress** |
| DOC-1 | Feature implementation inventory | [Feature Catalog](../04-features/feature-catalog.md) reconciled with routes, components, data, and middleware | DOC-0, current code | **Started** |
| DOC-2 | Design implementation reconciliation | [Design Implementation Map](../05-design/design-implementation-map.md) with source, status, and migration ownership | DOC-0, live CSS/UI | **Started** |
| DOC-3 | MVP core-loop contracts | Today, Tasks, Focus, and Reflection feature briefs, behavior contracts, journey contract, and linked design specs | DOC-1, DOC-2, systems | Planned |
| DOC-4 | Supporting-surface decisions | Admission or deferral decisions for Habits, Schedule, Notes/Knowledge, and Growth Areas | DOC-3, evidence | Planned |
| DOC-5 | Technical delivery coverage | Delivery designs for admitted feature changes plus data, identity, quality, client, and operations links | DOC-3, DOC-4 | Planned |
| DOC-6 | Validation and release coverage | Validation plans, release plan, review record, and post-release learning template for MVP | DOC-5 | Planned |
| DOC-7 | Historical retirement and archive pass | Retired/merged/redirected legacy documents with no ambiguous active authority | DOC-3 through DOC-6 | Planned |

## 5. Feature documentation worklist

This is the implementation plan for the feature domains the previous tree made difficult to find. The Feature Catalog owns current status; this table owns the order and minimum documentation package.

| Domain | First documentation action | Minimum package before code change | Current decision |
|---|---|---|---|
| Today | Confirm current home and reorientation behavior | Brief + behavior contract + journey link + design spec + validation plan | Start first; primary MVP surface |
| Tasks | Trace task identity across Today, Tasks, Focus, and Schedule | Brief + behavior contract + delivery design + design spec + validation plan | Start with Today contract dependency |
| Focus | Separate action mode from analytics/history | Brief + behavior contract + design spec + validation plan | Core action path |
| Reflection | Resolve full-page/sidebar/session-end save differences | Brief + behavior contract + journey link + validation plan | Core adaptation path |
| Habits | Test whether habits strengthen or distract from the loop | Brief + behavior contract if retained | Conditional supporting path |
| Schedule | Name one planning responsibility and remove overlap | Brief + behavior contract + design reconciliation | Conditional supporting context |
| Notes / Knowledge | Define user-owned context and source boundaries | Brief + behavior contract + continuity review | Conditional supporting context |
| Growth Areas | Document as Notes sub-capability first | Notes behavior addendum | Embedded; no new top-level module yet |
| Goals | Record why placeholder is not MVP | Decision record or catalog disposition | Deferred |
| Progress | Define measurement meaning before surface design | Measurement specification + Success Model link | Derived; no new destination |
| AI Coach | Reconcile assistance policy, authority, safety, and evaluation | Decision record + intelligence/trust contract + feature brief | Deferred |

## 6. Design-system worklist

The Design Implementation Map is the active map; this plan defines the order in which its gaps are resolved.

1. **Name current paint authority:** confirm `globals.css`, token helpers, and component classes for the live build.
2. **Remove ambiguity:** label V3, Tokyo Night Warm, workspace, and interaction references as active implementation references while they remain in use.
3. **Extract stable rules:** promote only reusable token, workspace, interaction, content, accessibility, or component rules into their canonical 05-design documents.
4. **Specify admitted surfaces:** create feature design specifications for Today, Tasks, Focus, and Reflection before material implementation changes.
5. **Cover states:** include loading, empty, error, permission, interruption, correction, undo, responsive, accessibility, and assistance states.
6. **Retire duplicates:** archive or redirect any source that no longer has a distinct responsibility.

The visual system is not considered refined merely because the palette is consistent. It is refined when meaning, state, control, content, accessibility, and implementation ownership are all inspectable.

## 7. Legacy-document disposition rules

Before a legacy document is removed or archived, perform this sequence:

1. identify any still-used rule, decision, evidence, or implementation detail;
2. link it to its current owner or create the minimum missing active document;
3. mark the legacy document's status and successor;
4. update the Document Map and relevant folder README; and
5. search the repository for references and update or intentionally preserve them.

The following are immediate examples:

| Legacy/current source | Action |
|---|---|
| `strategy/execution-masterplan.md` | Keep as transitional historical context; new implementation begins only from the MVP Masterplan. |
| `foundation/FEATURE_INVENTORY.md` | Keep as detailed current snapshot until the Feature Catalog absorbs all still-valid facts. |
| `foundation/DESIGN_SYSTEM_V3*.md` | Keep as implementation references until stable rules are promoted; do not duplicate them wholesale. |
| `review/design/` and `design/` feature specs | Keep transitional; migrate a spec when it is materially reused or changed. |
| `archive/project/03-future-enhancements.md` | Keep historical; re-admit only through the current feature catalog and a decision record. |
| `foundation/governance/` | Keep repository and operational guidance; do not treat it as replacement for 06-engineering standards. |

## 8. Definition of documentation-ready MVP implementation

The documentation refinement is complete enough to support MVP implementation when:

- the masterplan, Roadmap, and delivery plans have non-overlapping responsibilities;
- every admitted MVP feature has a feature brief, behavior contract, and linked design/engineering/validation ownership;
- every supporting or deferred feature has an explicit disposition;
- every active design source has one layer, owner, and lifecycle label;
- current implementation truth is separated from desired design and historical intent;
- every consequential decision and validation result has a durable record; and
- a new contributor can choose the correct document by responsibility without asking which file is “the real one.”

## 9. Implementation order and rationale

The order is strict because later documents inherit from earlier ones:

1. **Authority cleanup:** without lifecycle labels, every later document can be contradicted by an old one.
2. **Feature catalog:** without current status, feature briefs would document assumptions instead of the actual product.
3. **Design map:** without named design sources, feature specifications would duplicate or conflict with CSS and legacy references.
4. **Core-loop contracts:** only after current truth and design ownership can product behavior be made coherent.
5. **Supporting-surface decisions:** only after the core loop is explicit can breadth be admitted or removed responsibly.
6. **Technical delivery designs:** engineering should implement approved behavior and expression, not invent product rules.
7. **Validation and release records:** release readiness must assess the contracts that were actually approved.
8. **Historical retirement:** archive only after the surviving knowledge has a named home and repository references are safe.

## 10. Change control

Update this plan when the documentation tree, authority model, work-package order, or completion criteria change. A new document belongs in the tree only if its responsibility cannot be fulfilled by an existing document without overlap. A deleted or merged document must record where its still-valid content moved.
