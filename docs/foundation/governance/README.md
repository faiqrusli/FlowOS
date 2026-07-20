# Governance

**Five active documents.** Rules and gates for product and engineering decisions.

**Last updated:** July 4, 2026 (Pass 4–5 consolidation)

---

## Active documents

| Document | Use when |
|----------|----------|
| [PRINCIPLES.md](./PRINCIPLES.md) | Evaluating any feature — rules + build/defer/reject |
| [GATES.md](./GATES.md) | Release stage (M2, alpha, beta) + WAD, D7 definitions |
| [QUALITY_GATES.md](./QUALITY_GATES.md) | Definition of done before ship |
| [ENGINEERING.md](./ENGINEERING.md) | Technical tradeoffs and debt |
| [CODE_STANDARDS.md](./CODE_STANDARDS.md) | TypeScript, React, styling, folder conventions |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | Branches, commits, merge to `main` (founder approval) |

## Decision flow

```
New idea
    → PRINCIPLES.md (feature test)
    → ENGINEERING.md (if technical)
    → QUALITY_GATES.md (before ship)
    → GATES.md (which stage?)
    → decision-log.md (record outcome)
```

---

## Related (outside governance)

| Document | Role |
|----------|------|
| [../../strategy/flowos-vision-and-product-strategy.md](../../strategy/flowos-vision-and-product-strategy.md) | **Highest** — vision & product strategy |
| [../../strategy/execution-masterplan.md](../../strategy/execution-masterplan.md) | Current milestone plan |
| [../PRODUCT_VISION.md](../PRODUCT_VISION.md) | Stub → vision strategy |
| [GATES.md](./GATES.md) | Release gates and metric definitions |
| [../../execution/logs/decision-log.md](../../execution/logs/decision-log.md) | Decision history |

Historical audits: [../../archive/foundation/](../../archive/foundation/)
