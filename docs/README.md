# FlowOS Documentation

**FlowOS** is an integrated productivity and reflection system — a personal daily driver for tasks, habits, focus, scheduling, reflection, and notes.

**Current milestone:** [M2 — Founder Daily Driver](./execution/README.md) (engineering Sessions 1–6 shipped; Sessions 7–8 in progress)

**Production:** https://flowos-sage.vercel.app

---

## Start here

| Role | Entry point |
|------|-------------|
| **Founder / product** | [start-here/founder.md](./start-here/founder.md) |
| **Engineer** | [start-here/engineer.md](./start-here/engineer.md) |
| **New contributor** | [start-here/new-contributor.md](./start-here/new-contributor.md) |

---

## Authority hierarchy

When documents conflict, this order wins:

| Priority | Source | Role |
|----------|--------|------|
| 1 | [execution/logs/decision-log.md](./execution/logs/decision-log.md) | Dated product decisions |
| 2 | [strategy/execution-masterplan.md](./strategy/execution-masterplan.md) | Milestones M0–M5 |
| 3 | [foundation/governance/](./foundation/governance/) | Rules and release gates |
| 4 | [foundation/](./foundation/) + [execution/](./execution/) | Current product and ops truth |
| 5 | [archive/](./archive/) | Historical reference only |

---

## Folder map

| Directory | Contents | Status |
|-----------|----------|--------|
| [strategy/](./strategy/) | Execution masterplan | **Active** |
| [execution/](./execution/) | Runbooks, ops, logs | **Active** |
| [foundation/](./foundation/) | Vision, features, architecture (3 files) | **Active** |
| [foundation/governance/](./foundation/governance/) | 4 rule docs (PRINCIPLES, GATES, QUALITY, ENGINEERING) | **Reference** |
| [archive/](./archive/) | Thesis, design history, superseded plans | **Archive** |
| [meta/](./meta/document-map.md) | Full doc inventory | Meta |

**Operational docs outside `docs/`:** [supabase/APPLIED_STATE.md](../supabase/APPLIED_STATE.md)

**Legacy redirects:** `docs/design/`, `docs/project/`, and `foundation/LAUNCH_PLAN.md` stub → canonical paths in [archive/](./archive/).

---

## Quick index — active documents

### Strategy and execution

| Document | Purpose |
|----------|---------|
| [execution-masterplan.md](./strategy/execution-masterplan.md) | Primary plan — milestones M0–M5 |
| [m1-ship-gate.md](./execution/runbooks/m1-ship-gate.md) | M1 deploy, migrations, RLS |
| [m2-founder-daily-driver.md](./execution/runbooks/m2-founder-daily-driver.md) | M2 Today home, routing, capture |
| [friction-log.md](./execution/logs/friction-log.md) | Live founder dogfood log |
| [decision-log.md](./execution/logs/decision-log.md) | Product decisions (append-only) |
| [recruiting-pipeline.md](./execution/ops/recruiting-pipeline.md) | M3 recruiting prep |

### Product and engineering

| Document | Purpose |
|----------|---------|
| [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) | Shipped vs deferred features + navigation / IA |
| [TECHNICAL_ARCHITECTURE.md](./foundation/TECHNICAL_ARCHITECTURE.md) | Stack, data model, debt |
| [governance/GATES.md](./foundation/governance/GATES.md) | Launch gates, WAD, D7 definitions |
| [PRODUCT_VISION.md](./foundation/PRODUCT_VISION.md) | North star and non-goals |

Full foundation index: [foundation/README.md](./foundation/README.md)

---

## Superseded documents (archive only)

| Document | Superseded by |
|----------|---------------|
| [roadmap-pre-masterplan.md](./archive/design/roadmap-pre-masterplan.md) (Phase 3+) | [execution-masterplan.md](./strategy/execution-masterplan.md) |
| [launch-plan-july-2026.md](./archive/planning/launch-plan-july-2026.md) | Same masterplan |
| [project-state-july-2026.md](./archive/design/project-state-july-2026.md) | [FEATURE_INVENTORY.md](./foundation/FEATURE_INVENTORY.md) + [execution/README.md](./execution/README.md) |

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
Active strategy + execution (docs/strategy/, docs/execution/) ← current
```

Doc map: [meta/document-map.md](./meta/document-map.md)
