# Alpha Success Criteria

**Status:** Active  
**Audience:** Founder  
**Last updated:** July 3, 2026  
**Stage:** Private Alpha (5–15 users)

---

## Purpose

Objective go/no-go criteria for private alpha. If Wave 1 fails, **do not recruit Wave 2** until root cause fixed.

Metrics definitions: [../SUCCESS_METRICS.md](../SUCCESS_METRICS.md). Release gates: [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md).

---

## Wave 1 (5 users) — primary gate

### Must achieve (all)

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| **D7 retention** | ≥ 3 of 5 users return without founder prompt | Auth `last_sign_in_at` or sign-in events |
| **Zero P0 incidents** | No data leak, auth bypass, or data loss | Founder monitoring |
| **Full loop completion** | Each retained user completes ≥ 1 plan→focus→reflect day in week 1 | Interview + DB |
| **"Where am I supposed to be?"** | ≤ 1 mention per user by end of week 2 | Weekly interview |

### Should achieve (stretch)

| Criterion | Target |
|-----------|--------|
| D1 retention | > 60% (3/5 minimum) |
| Open → first action | < 5 seconds (observed on onboarding call) |
| WAD (active users) | ≥ 4 days/week |
| Focus sessions | ≥ 3/week per active user |
| Reflection saves | ≥ 3 days/week per active user |
| Module switches/session | −50% vs founder baseline |

---

## Wave 2 (15 users total) — expansion gate

Expand only if Wave 1 passes.

| Criterion | Target |
|-----------|--------|
| D7 retention (cohort) | > 30% sustained over 4 weeks |
| D14 retention | > 20% |
| External tool fallback | Decreasing week-over-week (interview Q5) |
| Reflection completion | +25% vs pre-Phase 3 founder baseline |

---

## Fail criteria (stop recruitment)

| Signal | Action |
|--------|--------|
| < 3/5 D7 Wave 1 | Pause recruitment; fix loop; re-test with 2 users |
| Any RLS/auth incident | Halt all users; fix; post-mortem in [DECISION_LOG.md](../DECISION_LOG.md) |
| > 2/5 abandon within 48h without feedback | Pause; interview churners |
| Users consistently use external task app for capture | Fix inline capture before continuing |

---

## Pivot criteria (simplify product)

If Wave 1 fails **twice** after Phase 3.1 fixes:

- Cut nav to **Today + Tasks + Reflection** only  
- Re-test with 3 fresh users for 2 weeks  
- Document pivot in DECISION_LOG  

---

## Alpha explicitly not measured

- NPS, revenue, MRR, total signups  
- Feature heatmaps per module  
- Social sharing, virality  
- Thesis FE-1–FE-13 completion  

---

## Review cadence

| When | Activity |
|------|----------|
| Day 0 | Onboarding call; baseline observation |
| Day 3 | Async check-in |
| Day 7 | Retention count; interview |
| Day 14 | Wave 1 retrospective |
| Weekly | Founder reviews WAD + friction log |

---

## Related documents

- [BETA_SUCCESS_CRITERIA.md](./BETA_SUCCESS_CRITERIA.md)  
- [../LAUNCH_PLAN.md](../LAUNCH_PLAN.md)  
- [../USER_PERSONAS.md](../USER_PERSONAS.md)  
