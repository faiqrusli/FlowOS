# Product Governance

Documents that **guide long-term product and engineering decisions** for FlowOS. Read after [../CEO_REVIEW_JULY_2026.md](../CEO_REVIEW_JULY_2026.md) and before Phase 3 implementation.

**Created:** July 3, 2026  
**Owner:** Founder  
**Review cadence:** Monthly during alpha; quarterly after beta

---

## Governance documents

| Document | Use when |
|----------|----------|
| [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md) | Evaluating any feature or UX change |
| [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md) | Setting quarterly priorities |
| [COMPETITOR_ANALYSIS.md](./COMPETITOR_ANALYSIS.md) | Positioning or scope debates |
| [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md) | Deciding if a stage gate is met |
| [ALPHA_SUCCESS_CRITERIA.md](./ALPHA_SUCCESS_CRITERIA.md) | Private alpha go/no-go |
| [BETA_SUCCESS_CRITERIA.md](./BETA_SUCCESS_CRITERIA.md) | Closed beta go/no-go |
| [PRODUCT_DECISION_FRAMEWORK.md](./PRODUCT_DECISION_FRAMEWORK.md) | Build vs reject decisions |
| [ENGINEERING_DECISION_FRAMEWORK.md](./ENGINEERING_DECISION_FRAMEWORK.md) | Technical tradeoffs |
| [QUALITY_GATES.md](./QUALITY_GATES.md) | Feature completion checklist |
| [RISK_REGISTER.md](./RISK_REGISTER.md) | Risk review meetings |

---

## How governance relates to other docs

| Layer | Location | Answers |
|-------|----------|---------|
| History | [../../project/](../../project/), [../../design/](../../design/) | Why and how FlowOS was built |
| Foundation | [../](../) | What exists, architecture, launch plan |
| **Governance** | This folder | **Rules for future decisions** |
| Execution | [../../design/ROADMAP.md](../../design/ROADMAP.md) | Phase 3 implementation detail |

---

## Decision flow

```
New idea or request
    ↓
PRODUCT_PRINCIPLES.md — does it pass?
    ↓
PRODUCT_DECISION_FRAMEWORK.md — build, defer, or reject?
    ↓
ENGINEERING_DECISION_FRAMEWORK.md — how to implement?
    ↓
QUALITY_GATES.md — definition of done
    ↓
RELEASE_CRITERIA.md — which stage can ship to?
    ↓
DECISION_LOG.md — record outcome
```

---

## Related documents

- [GOVERNANCE_PASS_REPORT.md](./GOVERNANCE_PASS_REPORT.md) — audit and pass summary (July 2026)  
- [../CEO_REVIEW_JULY_2026.md](../CEO_REVIEW_JULY_2026.md) — strategic assessment  
- [../DECISION_LOG.md](../DECISION_LOG.md) — decision history  
