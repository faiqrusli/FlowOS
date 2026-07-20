# FlowOS Documentation

**FlowOS** is a **personal execution and continuous improvement system** — connecting planning, focused work, progress, and reflection into one continuous workflow.

> Turn intention into execution.  
> Turn execution into progress.  
> Turn reflection into improvement.

**Core loop:** Plan → Commit → Focus → Reflect → Improve

**Status:** Implementation is **on hold for review** (GitHub + production dogfood + live demo). Prefer small fixes over new milestones until the hold is lifted.

**Production:** https://flowos-sage.vercel.app  
**Live demo:** [flowos-live-demo-spec.md](./review/design/flowos-live-demo-spec.md) · [flowos-live-demo.md](./execution/runbooks/flowos-live-demo.md)  
**GitHub product page:** [../README.md](../README.md)

---

## Read first (best docs)

| Document | Why |
|----------|-----|
| [**Vision & Product Strategy**](./strategy/flowos-vision-and-product-strategy.md) | **Highest authority** — philosophy, core loop, positioning, long-term architecture (hub + chapters) |
| [User Evolution & Market Positioning](./strategy/flowos-user-evolution-and-market-positioning.md) | Who FlowOS serves — students through founders; native-complete vs execution layer |
| [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) | What’s shipped today vs deferred |
| [execution-masterplan.md](./strategy/execution-masterplan.md) | Milestones M0–M5 and exit gates |

Vision chapters (full text): [strategy/vision/](./strategy/vision/)

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
| 1 | [strategy/flowos-vision-and-product-strategy.md](./strategy/flowos-vision-and-product-strategy.md) | **Highest** — product vision, philosophy, positioning, long-term architecture |
| 2 | [execution/logs/decision-log.md](./execution/logs/decision-log.md) | Dated product decisions (explicit amendments win for that change) |
| 3 | [strategy/execution-masterplan.md](./strategy/execution-masterplan.md) | Milestones M0–M5 |
| 4 | [foundation/governance/](./foundation/governance/) | Rules and release gates |
| 5 | [foundation/](./foundation/) + [execution/](./execution/) | Current product and ops truth |
| 6 | [archive/](./archive/) | Historical reference only |

**Visual / UI:** [DESIGN_SYSTEM_V3.md](./foundation/DESIGN_SYSTEM_V3.md) family + [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md). Code truth: `src/app/globals.css`. Do not treat Neutral Dark, Gruvbox, Everforest, or legacy navy `DESIGN_SYSTEM.md` as live paint authority.

---

## Folder map

| Directory | Contents | Status |
|-----------|----------|--------|
| [strategy/](./strategy/) | Vision hub, chapters, user evolution, masterplan | **Active** |
| [execution/](./execution/) | Runbooks, logs, ops | **Active** (hold = no new large runbooks) |
| [review/](./review/) | SRAI + design specs | **Active** |
| [design/](./design/) | Living feature design specifications | **Active** |
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
| [flowos-vision-and-product-strategy.md](./strategy/flowos-vision-and-product-strategy.md) | **Highest** — vision hub + chapter index |
| [strategy/vision/](./strategy/vision/) | Full vision chapters (§1–55) |
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
| [PRODUCT_VISION.md](./foundation/PRODUCT_VISION.md) | Stub → [vision hub](./strategy/flowos-vision-and-product-strategy.md) |

Full foundation index: [foundation/README.md](./foundation/README.md)

---

## Superseded documents (archive only)

| Document | Superseded by |
|----------|---------------|
| [roadmap-pre-masterplan.md](./archive/design/july-3/roadmap-pre-masterplan.md) (Phase 3+) | [execution-masterplan.md](./strategy/execution-masterplan.md) |
| [launch-plan-july-2026.md](./archive/planning/launch-plan-july-2026.md) | Same masterplan |
| [project-state-july-2026.md](./archive/design/july-3/project-state-july-2026.md) | [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) + [execution/README.md](./execution/README.md) |
| Short [PRODUCT_VISION.md](./foundation/PRODUCT_VISION.md) body | [flowos-vision-and-product-strategy.md](./strategy/flowos-vision-and-product-strategy.md) |
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
Vision hub + chapters + masterplan (docs/strategy/)  ← highest product authority
    ↓
Active execution (docs/execution/) ← ops / hold / logs
    ↓
Review after each milestone (docs/review/) ← SRAI
```

Doc map: [meta/document-map.md](./meta/document-map.md)
