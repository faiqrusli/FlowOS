# FlowOS Foundation Documentation

Permanent product and company documentation for **FlowOS**. These documents answer **what the company should do next** — complementing [../project/](../project/) (why FlowOS was conceived) and [../design/](../design/) (how the product was refined).

**Created:** July 3, 2026  
**Status:** Living documents — update when major product decisions are made.

---

## Documents

| File | Purpose |
|------|---------|
| [PRODUCT_VISION.md](./PRODUCT_VISION.md) | North star, positioning, target user, non-goals |
| [PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md) | SRL cycle, design principles, decision rules |
| [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md) | Shipped, partial, placeholder, and deferred features |
| [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Module hierarchy, nav model, Phase 3 target IA |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Stack, data model, auth, debt register |
| [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) | Launch gates, blockers, readiness ratings |
| [USER_PERSONAS.md](./USER_PERSONAS.md) | Primary and secondary users for validation |
| [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) | What to measure; what to ignore |
| [DECISION_LOG.md](./DECISION_LOG.md) | Product-level decisions with rationale |
| [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) | Alpha → beta → production timeline |
| [CEO_REVIEW_JULY_2026.md](./CEO_REVIEW_JULY_2026.md) | Highest-level strategic assessment (July 2026) |
| [GOVERNANCE_PASS_REPORT.md](./GOVERNANCE_PASS_REPORT.md) | Documentation governance audit |
| [governance/](./governance/) | Product decision rules, release gates, risks |

---

## Reading order

### Founder / product lead

1. [CEO_REVIEW_JULY_2026.md](./CEO_REVIEW_JULY_2026.md)  
2. [governance/PRODUCT_STRATEGY.md](./governance/PRODUCT_STRATEGY.md)  
3. [governance/PRODUCT_PRINCIPLES.md](./governance/PRODUCT_PRINCIPLES.md)  
4. [governance/RELEASE_CRITERIA.md](./governance/RELEASE_CRITERIA.md)  
5. [LAUNCH_PLAN.md](./LAUNCH_PLAN.md)  
6. [design/ROADMAP.md](../design/ROADMAP.md) — Phase 3 execution detail  

### New engineer

1. [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)  
2. [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md)  
3. [design/PROJECT_STATE.md](../design/PROJECT_STATE.md)  

### Preparing for alpha users

1. [USER_PERSONAS.md](./USER_PERSONAS.md)  
2. [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md)  
3. [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)  

---

## Document lineage

```
Thesis & SRS (docs/project/)
    ↓
MVP + Design Phases 0–2 (docs/design/)
    ↓
Foundation layer (docs/foundation/)
    ↓
Governance layer (docs/foundation/governance/)
    ↓
Phase 3 — Effortless Daily Loop (docs/design/ROADMAP.md)
```

---

## Maintenance rules

- Update foundation docs when making **product-level** decisions (not every bug fix).
- Append to [DECISION_LOG.md](./DECISION_LOG.md) for reversible or significant choices.
- Do not duplicate design phase history — link to [../design/](../design/) instead.
- Roadmap execution detail stays in [../design/ROADMAP.md](../design/ROADMAP.md).
