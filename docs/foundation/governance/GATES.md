# Release Gates

**Status:** Active  
**Audience:** Founder, engineers  
**Last updated:** July 4, 2026 (Pass 5 — metrics merged from SUCCESS_METRICS)

Objective gates for each stage. Per-feature DOD: [QUALITY_GATES.md](./QUALITY_GATES.md).

**Production:** https://flowos-sage.vercel.app · **M1 complete** · **M2 in progress**

---

## Current status (July 4, 2026)

| Stage | Status |
|-------|--------|
| M0 Custody | Complete |
| M1 Deployed & Secure | **Complete** — build green, RLS verified, production live |
| M2 Founder Daily Driver | **In progress** — Sessions 1–6 shipped |
| M3 First Strangers (Private Alpha) | Not started |
| Closed Beta | Not started |
| Production GA | Not started |

---

## Gate dependency chain

```
Internal Development
    → Founder Daily Use (M1: build + RLS + production)
        → M2 complete (Today home, routing, capture, dogfood)
            → Private Alpha (M3: 5 strangers, D7 gate)
                → Closed Beta (50 users)
                    → Public Beta → Production
```

---

## 1. Internal Development

| Required |
|----------|
| Core modules runnable via `npm run dev` |
| Manual smoke test by founder |

**Exit:** Fix blockers for hosted use.

---

## 2. Founder Daily Use (M1) — complete

| Required | Status |
|----------|--------|
| `npm run build` passes | Done |
| RLS user-scoped on core tables | Done (two-account test PASS) |
| Hosted on Vercel + Supabase | Done |
| Production URL live | https://flowos-sage.vercel.app |

**Exit:** Stable founder daily use → M2.

---

## 3. M2 — Founder Daily Driver (current)

From [execution-masterplan.md](../../strategy/execution-masterplan.md) and [m2 runbook](../../execution/runbooks/m2-founder-daily-driver.md):

| Required |
|----------|
| `/` = Today (execution surface) |
| Next-action stays on Today |
| Sidebar ≤ 5 items |
| Visible focus controls on Today |
| Inline task capture on Today |
| Error/loading boundaries on `(main)` |
| Founder uses production **≥ 5 days/week** |
| Friction logged in [friction-log.md](../../execution/logs/friction-log.md) |
| **≥ 3 recruiting candidates** for M3 |

**Exit:** All M2 exit criteria pass → start M3 recruitment.

---

## 4. Private Alpha (M3) — Wave 1 (5 users)

### Must achieve (all)

| Criterion | Target |
|-----------|--------|
| **D7 retention** | ≥ 3 of 5 users return without founder prompt |
| **Zero P0 incidents** | No data leak, auth bypass, or data loss |
| **Full loop completion** | Each retained user completes ≥ 1 plan→focus→reflect day in week 1 |
| **"Where am I?" confusion** | ≤ 1 mention per user by end of week 2 |

### Should achieve

| Criterion | Target |
|-----------|--------|
| D1 retention | > 60% (3/5) |
| Open → first action | < 5 seconds |
| WAD | ≥ 4 days/week per active user |

### Fail criteria (stop recruitment)

| Signal | Action |
|--------|--------|
| < 3/5 D7 Wave 1 | Pause; fix loop; re-test with 2 users |
| Any RLS/auth incident | Halt users; post-mortem in decision-log |
| Users use external app for capture | Fix inline capture first |

### Pivot (if Wave 1 fails twice)

Cut nav to **Today + Tasks + Reflection**; re-test 3 fresh users for 2 weeks; log in decision-log.

---

## 5. Closed Beta (50 users) — future

**Prerequisite:** Private alpha D7 gate passed.

| Must achieve |
|--------------|
| D7 > 30% sustained 4 weeks at 15 users |
| Command palette v1; reflection save unified |
| Onboarding v1 (3 steps) |
| CI green; smoke tests on auth, task CRUD, focus, reflection |
| Privacy policy draft |

| Fail |
|------|
| D7 < 20% at 50 users → do not open public beta |

**Scope cap:** No AI Coach, Goals, calendar sync, mobile, gamification unless D7 > 30% and users cite as #1 churn reason.

---

## 6. Production GA — future

| Must achieve |
|--------------|
| D7 ≥ 25%; D30 ≥ 15% |
| Full RLS audit; incident response |
| Public changelog; terms + privacy published |

---

## Metric definitions

**Primary goal (90 days):** Validate FlowOS with early users — retention over breadth.

### North star: Weekly Active Days (WAD)

Count of calendar days in a 7-day window where the user performs ≥ 1 **meaningful action** (task completed, habit checked, focus session ≥ 1 min, or reflection saved).

| Context | Target |
|---------|--------|
| Active alpha user | ≥ 4 days/week |

WAD beats DAU alone for a daily OS — opening without action is not success.

### Retention

| Metric | Formula | Alpha Wave 1 | Alpha expanded | Beta |
|--------|---------|--------------|----------------|------|
| **D1** | Return day after first use | > 60% (3/5) | — | — |
| **D7** | Return day 7 ± 1 | **≥ 3/5 users** (gate) | > 30% at 15 users | ≥ 25% at 50+ |
| **D30** | Active day 30 ± 3 | Not measured | — | ≥ 15% |

### Loop validation (alpha)

| Metric | Target | Source |
|--------|--------|--------|
| Focus sessions | ≥ 3/week per active user | `focus_sessions` |
| Reflection days | ≥ 3/week per active user | `reflections` |
| Open → first action | < 5 seconds | Interview + observation |
| Module switches | −50% vs M2 baseline | Observation |
| "Where am I?" confusion | → 0 by week 2 | Weekly interview |

### Phase 3 UX criteria (implementation)

Distinct from retention — M2/M3 engineering success:

| Metric | Target |
|--------|--------|
| Keyboard capture | < 2 sec, no modal |
| Focus from scheduled task | 1 action |
| Reflection completion rate | +25% vs pre-M2 baseline |

### Anti-metrics (do not optimize yet)

NPS, revenue/MRR, total registrations, time-on-site, feature click heatmaps, virality — all meaningless or misleading before the daily loop works.

### Measurement methods

| Stage | Method |
|-------|--------|
| Alpha (5–15 users) | Supabase auth logs; SQL on `focus_sessions` / `reflections`; weekly 15-min calls (five standard questions in [recruiting-pipeline.md](../../execution/ops/recruiting-pipeline.md)) |
| Beta (50+) | Lightweight client events (`session_start`, `task_complete`, `focus_start`, `reflection_save`) stored in Supabase |

### Decision gates tied to metrics

| Gate | Threshold | If failed |
|------|-----------|-----------|
| Wave 1 → Wave 2 | 3/5 D7 | Fix loop; do not recruit more |
| Alpha → closed beta | D7 > 30% for 4 weeks | Extend alpha |
| Beta → public | D30 > 15%; D7 > 25% | Stay in closed beta |
| Build Goals (FE-1) | D7 > 30% without Goals | Do not build |
| Build AI (FE-4) | D7 > 30% + loop proven | Do not build |

Full historical definitions: [../archive/foundation/SUCCESS_METRICS.md](../archive/foundation/SUCCESS_METRICS.md).

---

## Related

- [../../strategy/execution-masterplan.md](../../strategy/execution-masterplan.md)
- [../../execution/runbooks/m2-founder-daily-driver.md](../../execution/runbooks/m2-founder-daily-driver.md)
- [../../execution/ops/recruiting-pipeline.md](../../execution/ops/recruiting-pipeline.md) — M3 recruiting criteria
