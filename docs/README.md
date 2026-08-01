# FlowOS Documentation

**FlowOS** is an **operating system for self-direction** — helping people turn chosen direction into deliberate action, learn from reality, and adapt with agency.

> Direction → Commitment → Action → Evidence → Sensemaking → Adaptation

**Status:** Implementation is **on hold for review** (GitHub + production dogfood + live demo). Prefer small fixes over new milestones until the hold is lifted.

**Production:** https://flowos-sage.vercel.app  
**Live demo:** [flowos-live-demo-spec.md](./review/design/flowos-live-demo-spec.md) · [flowos-live-demo.md](./execution/runbooks/flowos-live-demo.md)  
**GitHub product page:** [../README.md](../README.md)

---

## Read first (best docs)

| Document | Why |
|----------|-----|
| [**Vision**](./strategy/Vision.md) | **Highest authority** — timeless purpose, philosophy, boundaries, and north star |
| [Documentation Architecture](./00-constitution/documentation-architecture.md) | Where every durable document belongs, what it owns, and how it changes |
| [Product Model](./01-product/product-model.md) | Canonical product concepts, relationships, and invariants |
| [Product Glossary](./01-product/product-glossary.md) | Canonical vocabulary for product concepts and documentation artifacts |
| [Product Strategy](./01-product/product-strategy.md) | Current audience, positioning, strategic choices, and hypotheses |
| [Success Model](./01-product/success-model.md) | Product outcomes, success signals, metric meanings, and anti-metrics |
| [Direction and Commitment System](./02-systems/direction-and-commitment.md) | System rules for chosen direction, present commitments, and their history |
| [Action and Evidence System](./02-systems/action-and-evidence.md) | System rules for actual action, factual evidence, outcomes, and provenance |
| [Sensemaking and Adaptation System](./02-systems/sensemaking-and-adaptation.md) | System rules for reflection, insight, and deliberate adaptation |
| [Continuity and Interoperability System](./02-systems/continuity-and-interoperability.md) | System rules for context across time, source relationships, and portability |
| [Intelligence and Trust System](./02-systems/intelligence-and-trust.md) | System rules for computational assistance, user control, and trust |
| [Experience Architecture](./03-experience/experience-architecture.md) | Cross-surface rules for product context, states, choices, and system transitions |
| [Information Structure](./03-experience/information-structure.md) | Current organization of experience domains, destinations, labels, and access relationships |
| [Journey Contracts](./03-experience/journey-contracts.md) | Standard for bounded end-to-end experience journey contracts |
| [Feature Briefs](./04-features/feature-briefs.md) | Standard for deciding, scoping, and governing bounded feature briefs |
| [Behavior Contracts](./04-features/behavior-contracts.md) | Standard for defining and governing observable feature behavior |
| [Delivery Designs](./04-features/delivery-designs.md) | Standard for feature-specific technical designs, rollout, and recovery |
| [Validation Plans](./04-features/validation-plans.md) | Standard for feature validation, evidence planning, and assessment boundaries |
| [Design System Architecture](./05-design/design-system-architecture.md) | Architecture for design-system responsibilities, documents, and implementation boundaries |
| [Feature Design Specifications](./05-design/feature-design-specifications.md) | Standard for feature-specific visual, interaction, content, and accessibility design |
| [Engineering Architecture](./06-engineering/engineering-architecture.md) | Architecture for technical domains, product-semantic preservation, and operations boundaries |
| [Data Architecture](./06-engineering/data-architecture.md) | Architecture for durable information, lineage, lifecycle, integrity, and access |
| [User Evolution & Market Positioning](./strategy/flowos-user-evolution-and-market-positioning.md) | Supporting strategy — target users and entry points |
| [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) | What’s shipped today vs deferred |
| [execution-masterplan.md](./strategy/execution-masterplan.md) | Milestones M0–M5 and exit gates |

Previous vision chapters (historical reference): [strategy/vision/](./strategy/vision/)

---

## Start here by role

| Role | Entry point |
|------|-------------|
| **Founder / product** | [start-here/founder.md](./start-here/founder.md) |
| **Engineer** | [start-here/engineer.md](./start-here/engineer.md) |
| **New contributor / reviewer** | [start-here/new-contributor.md](./start-here/new-contributor.md) |

---

## Authority hierarchy

When documents conflict, this order wins:

| Priority | Source | Role |
|----------|--------|------|
| 1 | [strategy/Vision.md](./strategy/Vision.md) | **Highest** — timeless product vision, philosophy, boundaries, and north star |
| 2 | [00-constitution/documentation-architecture.md](./00-constitution/documentation-architecture.md) | Documentation ownership, structure, and lifecycle |
| 3 | [01-product/product-model.md](./01-product/product-model.md) | Canonical product concepts, relationships, and invariants |
| 4 | [01-product/product-glossary.md](./01-product/product-glossary.md) | Canonical product vocabulary |
| 5 | [01-product/product-strategy.md](./01-product/product-strategy.md) | Current market choices, initial audience, positioning, and strategic hypotheses |
| 6 | [01-product/success-model.md](./01-product/success-model.md) | Product outcomes, success signals, metric meanings, and anti-metrics |
| 7 | [02-systems/direction-and-commitment.md](./02-systems/direction-and-commitment.md) | System rules for chosen direction, present commitments, and their history |
| 8 | [02-systems/action-and-evidence.md](./02-systems/action-and-evidence.md) | System rules for actual action, factual evidence, outcomes, and provenance |
| 9 | [02-systems/sensemaking-and-adaptation.md](./02-systems/sensemaking-and-adaptation.md) | System rules for reflection, insight, and deliberate adaptation |
| 10 | [02-systems/continuity-and-interoperability.md](./02-systems/continuity-and-interoperability.md) | System rules for context across time, source relationships, and portability |
| 11 | [02-systems/intelligence-and-trust.md](./02-systems/intelligence-and-trust.md) | System rules for computational assistance, user control, and trust |
| 12 | [03-experience/experience-architecture.md](./03-experience/experience-architecture.md) | Cross-surface rules for product context, states, choices, and system transitions |
| 13 | [03-experience/information-structure.md](./03-experience/information-structure.md) | Current organization of experience domains, destinations, labels, and access relationships |
| 14 | [03-experience/journey-contracts.md](./03-experience/journey-contracts.md) | Standard for bounded end-to-end experience journey contracts |
| 15 | [04-features/feature-briefs.md](./04-features/feature-briefs.md) | Standard for deciding, scoping, and governing bounded feature briefs |
| 16 | [04-features/behavior-contracts.md](./04-features/behavior-contracts.md) | Standard for defining and governing observable feature behavior |
| 17 | [04-features/delivery-designs.md](./04-features/delivery-designs.md) | Standard for feature-specific technical designs, rollout, and recovery |
| 18 | [04-features/validation-plans.md](./04-features/validation-plans.md) | Standard for feature validation, evidence planning, and assessment boundaries |
| 19 | [05-design/design-system-architecture.md](./05-design/design-system-architecture.md) | Architecture for design-system responsibilities, documents, and implementation boundaries |
| 20 | [05-design/feature-design-specifications.md](./05-design/feature-design-specifications.md) | Standard for feature-specific visual, interaction, content, and accessibility design |
| 21 | [06-engineering/engineering-architecture.md](./06-engineering/engineering-architecture.md) | Architecture for technical domains, product-semantic preservation, and operations boundaries |
| 22 | [06-engineering/data-architecture.md](./06-engineering/data-architecture.md) | Architecture for durable information, lineage, lifecycle, integrity, and access |
| 23 | [execution/logs/decision-log.md](./execution/logs/decision-log.md) | Dated product decisions; cannot override the vision without a deliberate revision of it |
| 24 | [strategy/execution-masterplan.md](./strategy/execution-masterplan.md) | Milestones M0–M5 |
| 25 | [foundation/governance/](./foundation/governance/) | Rules and release gates |
| 26 | [foundation/](./foundation/) + [execution/](./execution/) | Current product and ops truth |
| 27 | [archive/](./archive/) | Historical reference only |

**Visual / UI:** [Design System Architecture](./05-design/design-system-architecture.md) governs design-document ownership. The active visual-foundation family is [DESIGN_SYSTEM_V3.md](./foundation/DESIGN_SYSTEM_V3.md) + [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md); code actuality is `src/app/globals.css`. Do not treat Neutral Dark, Gruvbox, Everforest, or legacy navy `DESIGN_SYSTEM.md` as live paint authority.

---

## Folder map

| Directory | Contents | Status |
|-----------|----------|--------|
| [00-constitution/](./00-constitution/) | Documentation governance; Vision remains at `strategy/Vision.md` | **Active** |
| [01-product/](./01-product/) | Product model and future product-level documents | **Active** |
| [02-systems/](./02-systems/) | Enduring product-system definitions and future interface contracts | **Active** |
| [03-experience/](./03-experience/) | Cross-surface experience architecture and future information-structure and journey contracts | **Active** |
| [04-features/](./04-features/) | Bounded feature briefs, behavior contracts, delivery designs, and validation plans | **Active** |
| [05-design/](./05-design/) | Design-system architecture and future reusable design standards | **Active** |
| [06-engineering/](./06-engineering/) | Engineering architecture and future data, integration, quality, and operations standards | **Active** |
| [strategy/](./strategy/) | Canonical vision, supporting strategy, historical chapters, masterplan | **Active** |
| [execution/](./execution/) | Runbooks, logs, ops | **Active** (hold = no new large runbooks) |
| [review/](./review/) | SRAI + design specs | **Active** |
| [design/](./design/) | Transitional legacy feature design specifications; migrate on material revision | **Transitional** |
| [foundation/](./foundation/) | Features, architecture, design system | **Active** |
| [foundation/governance/](./foundation/governance/) | PRINCIPLES, GATES, QUALITY, ENGINEERING, CODE_STANDARDS, GIT_WORKFLOW | **Reference** |
| [archive/](./archive/) | Thesis, design history, superseded plans/themes | **Archive** |
| [meta/](./meta/document-map.md) | Full doc inventory | Meta |
| [screenshots/](./screenshots/) | README product screenshots | Assets |

**Operational docs outside `docs/`:** [supabase/APPLIED_STATE.md](../supabase/APPLIED_STATE.md)

**Legacy redirects:** `foundation/LAUNCH_PLAN.md` stub → [archive/planning/](./archive/planning/). Historical design program: [archive/design/july-3/](./archive/design/july-3/). Alternate palettes: [archive/design/themes/](./archive/design/themes/).

---

## Quick index — active documents

### Strategy and execution

| Document | Purpose |
|----------|---------|
| [Vision.md](./strategy/Vision.md) | **Highest** — canonical vision and product constitution |
| [flowos-vision-and-product-strategy.md](./strategy/flowos-vision-and-product-strategy.md) | Previous vision and strategy synthesis — historical reference |
| [strategy/vision/](./strategy/vision/) | Previous vision chapters — historical reference |
| [flowos-user-evolution-and-market-positioning.md](./strategy/flowos-user-evolution-and-market-positioning.md) | Supporting — user stages & market posture |
| [execution-masterplan.md](./strategy/execution-masterplan.md) | Primary plan — milestones M0–M5 |
| [execution/README.md](./execution/README.md) | Current ops index (hold / review mode) |
| [flowos-live-demo.md](./execution/runbooks/flowos-live-demo.md) | Guest live demo runbook |
| [friction-log.md](./execution/logs/friction-log.md) | Live founder dogfood log |
| [inbox.md](./execution/logs/inbox.md) | Scratch UI/UX fix ideas |
| [july-log.md](./execution/logs/july-log.md) | July session narrative |
| [decision-log.md](./execution/logs/decision-log.md) | Product decisions (append-only) |
| [recruiting-pipeline.md](./execution/ops/recruiting-pipeline.md) | M3 recruiting prep |

### Review

| Document | Purpose |
|----------|---------|
| [review/README.md](./review/README.md) | SRAI cycle |
| [review/milestones/](./review/milestones/) | M0–M5 milestone reviews |
| [review/design/](./review/design/) | Specs + historical design index → [archive/design/july-3/](./archive/design/july-3/) |
| [review/template.md](./review/template.md) | Blank SRAI template |

### Product and engineering

| Document | Purpose |
|----------|---------|
| [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) | Shipped vs deferred features + navigation / IA |
| [TECHNICAL_ARCHITECTURE.md](./foundation/TECHNICAL_ARCHITECTURE.md) | Stack, data model, debt |
| [DESIGN_SYSTEM_V3.md](./foundation/DESIGN_SYSTEM_V3.md) | Visual philosophy + Surface 0–10 |
| [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) | Active palette contract |
| [design/focus/next-up.md](./design/focus/next-up.md) | Living Focus Next Up design |
| [governance/GATES.md](./foundation/governance/GATES.md) | Launch gates, WAD, D7 definitions |
| [PRODUCT_VISION.md](./foundation/PRODUCT_VISION.md) | Redirect → [Vision.md](./strategy/Vision.md) |

Full foundation index: [foundation/README.md](./foundation/README.md)

---

## Superseded documents (archive only)

| Document | Superseded by |
|----------|---------------|
| [roadmap-pre-masterplan.md](./archive/design/july-3/roadmap-pre-masterplan.md) (Phase 3+) | [execution-masterplan.md](./strategy/execution-masterplan.md) |
| [launch-plan-july-2026.md](./archive/planning/launch-plan-july-2026.md) | Same masterplan |
| [project-state-july-2026.md](./archive/design/july-3/project-state-july-2026.md) | [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) + [execution/README.md](./execution/README.md) |
| Short [PRODUCT_VISION.md](./foundation/PRODUCT_VISION.md) body | [Vision.md](./strategy/Vision.md) |
| Alternate themes (v1/v2, Neutral Dark, Gruvbox, …) | [archive/design/themes/](./archive/design/themes/) · live: V3 + Tokyo |

Full archive index: [archive/README.md](./archive/README.md)

---

## Document lineage

```
Thesis & SRS (docs/archive/project/)        ← origin
    ↓
Design Audit → Phase 0–2 (docs/archive/design/)
    ↓
Foundation + governance (docs/foundation/)
    ↓
Vision.md + supporting strategy + masterplan (docs/strategy/)  ← highest product authority
    ↓
Active execution (docs/execution/) ← ops / hold / logs
    ↓
Review after each milestone (docs/review/) ← SRAI
```

Doc map: [meta/document-map.md](./meta/document-map.md)
