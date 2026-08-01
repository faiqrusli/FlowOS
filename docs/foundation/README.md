# FlowOS Foundation Documentation

Current implementation references for FlowOS features, stack, and visual system. Canonical product and engineering authority lives in the 00–10 documentation ecosystem.

**Status:** Implementation hold for review — see [../execution/README.md](../execution/README.md)  
**Governance:** [governance/README.md](./governance/README.md)

**Last updated:** July 21, 2026 (hold cleanup — V3 + Tokyo authority)

---

## Core documents

| File | Purpose |
|------|---------|
| [PRODUCT_VISION.md](./PRODUCT_VISION.md) | Redirect → [Vision.md](../strategy/Vision.md) |
| [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md) | Shipped vs deferred features + navigation / IA |
| [../04-features/feature-catalog.md](../04-features/feature-catalog.md) | Canonical feature-domain coverage and next documentation artifact |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Stack, data model, debt, deployment |

**Canonical counterparts:** [Product Index](../01-product/README.md) · [Engineering Index](../06-engineering/README.md) · [Design Index](../05-design/README.md) · [Document Map](../meta/document-map.md)

**Metrics and release gates:** [governance/GATES.md](./governance/GATES.md) (WAD, D7, alpha/beta thresholds)

---

## Visual system (current authority)

| File | Purpose |
|------|---------|
| [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md) | Philosophy, Surface 0–10, Soft Indigo brand |
| [DESIGN_SYSTEM_V3_WORKSPACE.md](./DESIGN_SYSTEM_V3_WORKSPACE.md) | Shell, borderless workspace, per-module maps |
| [DESIGN_SYSTEM_V3_INTERACTION.md](./DESIGN_SYSTEM_V3_INTERACTION.md) | Type, spacing, motion, states |
| [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) | Active palette / implementation contract |

**Code truth:** `src/app/globals.css`

Historical / alternate themes: [../archive/design/themes/](../archive/design/themes/) (v1, v2, Neutral Dark, Gruvbox, Everforest, Borderless snapshot, legacy navy stub path).

---

## Governance

| File | Purpose |
|------|------|
| [PRINCIPLES.md](./governance/PRINCIPLES.md) | Product rules + build/defer/reject |
| [GATES.md](./governance/GATES.md) | Release stages + metric definitions |
| [QUALITY_GATES.md](./governance/QUALITY_GATES.md) | Definition of done |
| [ENGINEERING.md](./governance/ENGINEERING.md) | Transitional M2 execution context; reusable practice is [Engineering Standards](../06-engineering/engineering-standards.md) |
| [CODE_STANDARDS.md](./governance/CODE_STANDARDS.md) | Code conventions (TS, React, styling) |
| [GIT_WORKFLOW.md](./governance/GIT_WORKFLOW.md) | Branches; merge to `main` needs founder approval |

---

## Strategy and execution

| File | Purpose |
|------|---------|
| [roadmap.md](../07-strategy-and-delivery/roadmap.md) | Canonical outcome sequencing and investment gates |
| [mvp-implementation-masterplan.md](../07-strategy-and-delivery/mvp-implementation-masterplan.md) | Canonical pre-dogfood MVP implementation sequence |
| [documentation-refinement-plan.md](../07-strategy-and-delivery/documentation-refinement-plan.md) | Documentation reconciliation plan |
| [execution-masterplan.md](../strategy/execution-masterplan.md) | Transitional historical milestone context |
| [execution/README.md](../execution/README.md) | Ops index (hold / review mode) |
| [review/milestones/](../review/milestones/) | SRAI reviews after milestone exit |
| [decision-register.md](../08-decisions/decision-register.md) | Canonical consequential decision discovery |
| [decision-log.md](../execution/logs/decision-log.md) | Historical decision collection |
| [friction-log.md](../execution/logs/friction-log.md) | Live friction |

---

## Reading order

**Founder:** [../start-here/founder.md](../start-here/founder.md)  
**Engineer:** [../start-here/engineer.md](../start-here/engineer.md)

**Merged / archived (Pass 5):** [../archive/foundation/](../archive/foundation/) — IA, metrics, personas, CEO review, etc.

Doc map: [../meta/document-map.md](../meta/document-map.md)
