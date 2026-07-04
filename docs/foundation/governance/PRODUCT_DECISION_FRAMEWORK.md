# Product Decision Framework

**Status:** Active  
**Audience:** Founder, product, engineers proposing features  
**Last updated:** July 3, 2026

---

## Purpose

Standard process for build, defer, or reject decisions. Prevents feature creep and thesis-driven scope expansion.

Test against [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md) first.

---

## Decision types

| Outcome | Meaning |
|---------|---------|
| **Build** | Approved for current or next phase; enters ROADMAP |
| **Defer** | Valid idea; blocked by gate (retention, capacity, dependency) |
| **Reject** | Violates principles, strategy, or non-goals |
| **Kill** | Remove existing surface; simplify |

---

## Build decision checklist

Answer **yes** to all five:

1. **Loop** — Strengthens plan → execute → reflect for [USER_PERSONAS.md](../USER_PERSONAS.md) primary?  
2. **Metric** — Impact measurable on WAD or D7 within 30 days of shipping to alpha?  
3. **Principle** — Passes all applicable [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md)?  
4. **Capacity** — Completable by solo engineer without delaying security week or Phase 3.1?  
5. **Stage** — Matches current [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md) stage?

If any **no** → default **Defer**.

---

## Reject triggers (automatic)

| Trigger | Example |
|---------|---------|
| New top-level nav item before D7 gate | Goals, AI Coach in sidebar |
| Competitor copy without loop value | Notion-style databases in Notes |
| AI/automation before retention proof | FE-4 AI Coach |
| Mobile/calendar without strategy | FE-9, FE-11 |
| Fake or placeholder UI | Dead "Open" buttons |
| Breadth for thesis/SRS checkbox | FE-10 gamification |

---

## Prioritization formula (solo founder)

Rank candidates by:

```
Priority = (Retention impact × 3) + (Loop coherence × 3) + (User pain × 2) − (Engineering cost × 1) − (Scope expansion × 2)
```

**Retention impact:** High if directly affects open→act, D7, or reflection completion.  
**Scope expansion:** High if new module, route, or data model.

When tied: **fix broken loop before new capability.**

---

## Feature creep prevention

1. **One in, one out** — New nav item requires demoting or removing another.  
2. **Alpha scope cap** — Max 5 top-level nav items until BETA_SUCCESS_CRITERIA pass.  
3. **DECISION_LOG** — Every Build/Kill recorded in [../DECISION_LOG.md](../DECISION_LOG.md).  
4. **CEO review test** — "Would 5 strangers return D7 because of this?"  
5. **Competitor filter** — See [COMPETITOR_ANALYSIS.md](./COMPETITOR_ANALYSIS.md) copy rejection list.

---

## Defer queue (standing)

These are valid but **not now** per [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md):

- Goals (FE-1), AI (FE-4), Calendar sync (FE-11), Mobile (FE-9)  
- Notes kanban expansion  
- Weekly reflection auto-summary (FE-5)  
- Phase 4 visual polish until alpha validates loop  
- Keyboard OS (Phase 3.6) until users request it  

---

## Escalation

| Situation | Action |
|-----------|--------|
| User requests feature in alpha | Log; do not build unless 3+ users cite as churn risk |
| Engineering "while we're here" improvement | Route through ENGINEERING_DECISION_FRAMEWORK |
| Thesis/SRS pressure | FE items remain deferred until metric gates in SUCCESS_METRICS |

---

## Workflow

```
Idea → Principles test → Build checklist → Prioritization score
    → Build: add to ROADMAP + DECISION_LOG
    → Defer: add to defer queue + reason
    → Reject/Kill: DECISION_LOG + remove from codebase if applicable
```

Design phases follow contract model in [../../design/README.md](../../design/README.md): review → spec → implement → post-review.

---

## Related documents

- [ENGINEERING_DECISION_FRAMEWORK.md](./ENGINEERING_DECISION_FRAMEWORK.md)  
- [PRODUCT_STRATEGY.md](./PRODUCT_STRATEGY.md)  
- [../DECISION_LOG.md](../DECISION_LOG.md)  
