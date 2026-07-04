# Success Metrics

**Status:** Active  
**Audience:** Founder, product lead  
**Last updated:** July 3, 2026

---

## Purpose

Define what FlowOS measures at each stage of product validation — and explicitly what **not** to measure. Prevents vanity metrics and premature optimization.

**Primary goal (90 days):** Validate FlowOS as a real product with early users — retention over breadth.

---

## North star metric

**Weekly Active Days (WAD)** — number of days per week a user opens FlowOS and completes at least one meaningful action.

Why: FlowOS is a daily productivity OS. If users don't return daily or near-daily, the integrated loop thesis fails — regardless of feature count.

Governance: [governance/PRODUCT_STRATEGY.md](./governance/PRODUCT_STRATEGY.md). Alpha gates: [governance/ALPHA_SUCCESS_CRITERIA.md](./governance/ALPHA_SUCCESS_CRITERIA.md).

---

## Metric definitions

### Weekly Active Days (WAD) — North Star

| Field | Definition |
|-------|------------|
| **Formula** | Count of calendar days in a 7-day window where user performs ≥ 1 meaningful action |
| **Meaningful action** | Task completed, habit checked complete, focus session started (≥ 1 min), or reflection saved |
| **Target (active alpha user)** | ≥ 4 days/week |
| **Source** | Supabase events or manual interview corroboration |
| **Why north star** | Captures habit formation better than DAU alone for a daily OS |

### Daily Active Users (DAU)

| Field | Definition |
|-------|------------|
| **Formula** | Unique users with ≥ 1 sign-in or session event on a calendar day |
| **Use** | Operational health; secondary to WAD for FlowOS |
| **Caution** | Opening app without action is **not** success — pair with meaningful action rate |

### Day-1 retention (D1)

| Field | Definition |
|-------|------------|
| **Formula** | % of cohort who return any time on day after first use |
| **Alpha target** | > 60% (Wave 1: at least 3/5 users) |
| **Source** | Auth logs or `session_start` events |

### Day-7 retention (D7)

| Field | Definition |
|-------|------------|
| **Formula** | % of cohort who return any time on day 7 ± 1 after first use |
| **Alpha Wave 1 gate** | **3 of 5 users** (60%) |
| **Alpha expanded target** | > 30% cohort at 15 users |
| **Beta target** | ≥ 25% at 50+ users |

### Day-30 retention (D30)

| Field | Definition |
|-------|------------|
| **Formula** | % of cohort active on day 30 ± 3 after first use |
| **Beta gate** | ≥ 15% |
| **Not measured in alpha** | Sample too small |

### Focus sessions started

| Field | Definition |
|-------|------------|
| **Formula** | Count of focus sessions initiated per user per week (from `focus_sessions`) |
| **Alpha target** | ≥ 3/week per active user |
| **Why** | Validates performance phase of loop |

### Reflection completion

| Field | Definition |
|-------|------------|
| **Formula** | Days per week user saves a reflection (from `reflections`) |
| **Alpha target** | ≥ 3 days/week per active user |
| **Why** | Validates self-reflection phase; key differentiator vs task-only apps |

### Tasks completed

| Field | Definition |
|-------|------------|
| **Formula** | Count of task completions per user per week |
| **Use** | Diagnostic — high completions with low D7 may indicate drive-by usage without habit |
| **Not north star** | Completing tasks in another app doesn't count against FlowOS if loop fails |

### Habits completed

| Field | Definition |
|-------|------------|
| **Formula** | Count of habit check-offs per user per week (from `habit_completions`) |
| **Use** | Diagnostic for forethought + performance phases |
| **Pair with** | WAD — habit-only users should still reflect |

### Supporting UX metrics (Phase 3)

| Metric | Definition | Target |
|--------|------------|--------|
| Open → first meaningful action | Seconds from app open to first action | < 5 sec |
| Module switches per session | Nav changes + full route changes | −50% post Phase 3 |
| "Where am I supposed to be?" | User-reported confusion instances/week | → 0 by week 2 alpha |

---

## Metrics by stage

### Internal alpha (solo dogfooding — now)

| Metric | Target | Method |
|--------|--------|--------|
| Full daily loop completed | 5+ days/week | Self-tracking |
| Module switches per session | Baseline count | Manual observation |
| Open → first action time | Baseline seconds | Stopwatch |

Purpose: Establish baseline before Phase 3.1.

---

### Private alpha (5–15 users — after Phase 3.1)

| Metric | Target | Method |
|--------|--------|--------|
| **D1 retention** | > 60% | Sign-in logs |
| **D7 retention** | > 40% (stretch: 50%) | Sign-in logs |
| Open → first meaningful action | < 5 seconds | User self-report + observation |
| Module switches per session | −50% vs baseline | Observation on onboarding call |
| Focus sessions started per week | ≥ 3 per active user | Supabase query |
| Reflection completion | ≥ 3 days/week per active user | Supabase query |
| "Where am I supposed to be?" moments | Near zero by week 2 | Weekly interview question |

**Wave 1 success gate:** 3 of 5 users return on D7. If not, pause recruitment and fix loop before Wave 2.

---

### Private alpha expanded (15 users — after Phase 3 complete)

| Metric | Target | Method |
|--------|--------|--------|
| **D7 retention** | > 30% | Sign-in logs |
| **D14 retention** | > 20% | Sign-in logs |
| Reflection completion rate | +25% vs pre-Phase 3 baseline | Supabase query |
| Weekly focus sessions | > 3 per active user | Supabase query |
| External tool fallback | Decreasing week-over-week | Interview question #5 |

---

### Closed beta (50 users — ~6 months)

| Metric | Target | Method |
|--------|--------|--------|
| **D7 retention** | > 25% | Analytics |
| **D30 retention** | > 15% | Analytics |
| Weekly reflection rate | > 60% of active users | Supabase query |
| Organic weekly active | Growing without founder prompts | Analytics |
| NPS | Eligible to survey (not primary gate) | Survey |

---

### Public beta / v1.0 (~12 months)

| Metric | Target | Method |
|--------|--------|--------|
| Total users | 200+ | Analytics |
| D7 retention | > 25% | Analytics |
| Organic weekly active | > 40% of registered | Analytics |
| Paid conversion | Hypothesis only — not required for beta | Stripe/waitlist |

---

## Phase 3 success metrics (UX — from design roadmap)

These are **implementation success criteria** for Phase 3, distinct from user retention:

| Metric | Target |
|--------|--------|
| Open → first meaningful action | < 5 seconds |
| Module switches per active day | −50% |
| Keyboard capture flow | < 2 seconds, no modal |
| Focus start from scheduled task | 1 action |
| Reflection completion rate | +25% |
| "Where do I go?" confusion | Near zero |

Source: [../design/ROADMAP.md](../design/ROADMAP.md)

---

## Anti-metrics (do NOT optimize yet)

| Anti-metric | Why ignore (for now) |
|-------------|----------------------|
| NPS | Too few users; scores meaningless before loop works |
| Revenue / MRR | Premature; validation phase |
| Feature click heatmaps per module | Encourages module parity over loop completion |
| Social sharing / virality | Not a social product |
| Total registered users | Vanity without retention |
| Time on site | Long sessions may indicate friction, not engagement |
| Module count / feature checklist | Breadth ≠ product-market fit |

---

## Measurement methods

### Alpha (manual — sufficient for 5–15 users)

- **Retention:** Supabase auth `last_sign_in_at` or simple event log table  
- **Focus/reflection:** SQL queries on `focus_sessions`, `reflections` tables  
- **Qualitative:** Weekly 15-minute check-in call; five standard questions ([USER_PERSONAS.md](./USER_PERSONAS.md))  
- **Friction:** Count "where am I supposed to be?" mentions in interviews  

### Beta (lightweight analytics)

- Add minimal client events: `session_start`, `task_complete`, `focus_start`, `reflection_save`  
- Prefer privacy-respecting, self-hosted or Supabase-stored events  
- No third-party analytics required until 50+ users  

---

## Decision gates tied to metrics

| Gate | Metric threshold | Action if failed |
|------|------------------|----------------|
| Expand alpha Wave 1 → Wave 2 | 3/5 D7 retention | Fix Phase 3 gaps; do not recruit more |
| Alpha → closed beta | D7 > 30% sustained 4 weeks | Extend alpha; iterate loop |
| Beta → public | D30 > 15%; D7 > 25% | Stay in closed beta |
| Build Goals (FE-1) | D7 > 30% without Goals | Do not build |
| Build AI (FE-4) | D7 > 30% + loop proven | Do not build |

---

## Related documents

- [governance/ALPHA_SUCCESS_CRITERIA.md](./governance/ALPHA_SUCCESS_CRITERIA.md) — alpha gates  
- [governance/BETA_SUCCESS_CRITERIA.md](./governance/BETA_SUCCESS_CRITERIA.md) — beta gates  
- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) — timeline tied to these metrics  
- [USER_PERSONAS.md](./USER_PERSONAS.md) — who to measure  
- [PRODUCT_VISION.md](./PRODUCT_VISION.md) — what success looks like  
- [../design/ROADMAP.md](../design/ROADMAP.md) — Phase 3 UX metrics  
