# Release Gates

**Status:** Active  
**Audience:** Founder, engineers  
**Last updated:** August 5, 2026

Objective gates for each release stage and per-feature quality checks.

**Production:** https://flowos-sage.vercel.app · **Gate 0 passed** · **Gate 1.5 passed** · **Gate 2 passed** · **Phase 3 authorized**

**Current implementation authority:** [MVP Implementation Masterplan](../../current-phase/mvp-implementation-masterplan.md). The M0–M2 gates below are a historical implementation snapshot and do not authorize new work by themselves.

---

## Current status (August 5, 2026)

| Stage | Status |
|-------|--------|
| Phase 0 / Gate 0 | **Complete** — passed and archived |
| Phase 1 / Gate 1 | **Complete** — passed and folded into the Phase 1.5 handoff |
| Phase 1.5 / Gate 1.5 | **Complete** — passed and archived (foundation infrastructure) |
| Phase 2 / Gate 2 | **Complete** — passed 2026-08-05; Phase 3 authorized |
| M3 First Strangers (Private Alpha) | Not started |
| Closed Beta | Not started |
| Production GA | Not started |

Current Gate 3 authority: [phase-3/gate-checklist.md](../../current-phase/phase-3/gate-checklist.md). Gate 2 remains the closed contract-coherence record at [phase-2/gate-checklist.md](../../current-phase/phase-2/gate-checklist.md). The M0–M2 sections below are historical milestone snapshots and do not block Phase 3.

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

## 3. M2 — Founder Daily Driver (historical snapshot)

Historical M2 baseline from [execution-masterplan.md](../../11-archive/strategy/execution-masterplan.md) and [m2 runbook](../../11-archive/execution/runbooks/m2-founder-daily-driver.md). Current work must be admitted through the [MVP Implementation Masterplan](../../current-phase/mvp-implementation-masterplan.md):

| Required |
|----------|
| `/` = Today (execution surface) |
| Next-action stays on Today |
| Sidebar ≤ 5 items |
| Visible focus controls on Today |
| Inline task capture on Today |
| Error/loading boundaries on `(main)` |
| Founder uses production **≥ 5 days/week** |
| Friction logged in [friction-log.md](../../11-archive/execution/logs/friction-log.md) |
| **≥ 3 recruiting candidates** for M3 |

**Historical exit:** All M2 exit criteria pass → start M3 recruitment. Current sequencing is governed by the current-phase masterplan.

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
| Alpha (5–15 users) | Supabase auth logs; SQL on `focus_sessions` / `reflections`; weekly 15-min calls (five standard questions in [recruiting-pipeline.md](../../11-archive/execution/ops/recruiting-pipeline.md)) |
| Beta (50+) | Lightweight client events (`session_start`, `task_complete`, `focus_start`, `reflection_save`) stored in Supabase |

### Decision gates tied to metrics

| Gate | Threshold | If failed |
|------|-----------|-----------|
| Wave 1 → Wave 2 | 3/5 D7 | Fix loop; do not recruit more |
| Alpha → closed beta | D7 > 30% for 4 weeks | Extend alpha |
| Beta → public | D30 > 15%; D7 > 25% | Stay in closed beta |
| Build Goals (FE-1) | D7 > 30% without Goals | Do not build |
| Build AI (FE-4) | D7 > 30% + loop proven | Do not build |

Full historical definitions: [SUCCESS_METRICS.md](../../11-archive/foundation/SUCCESS_METRICS.md).

---

## Related

- [../../current-phase/mvp-implementation-masterplan.md](../../current-phase/mvp-implementation-masterplan.md) — current implementation authority
- [../../11-archive/strategy/execution-masterplan.md](../../11-archive/strategy/execution-masterplan.md) — historical milestone context
- [../../11-archive/execution/runbooks/m2-founder-daily-driver.md](../../11-archive/execution/runbooks/m2-founder-daily-driver.md)
- [../../11-archive/execution/ops/recruiting-pipeline.md](../../11-archive/execution/ops/recruiting-pipeline.md) — M3 recruiting criteria



---

## Quality Gates (Per-Feature Definition of Done)

**Consolidated from QUALITY_GATES.md (Aug 2026)**

Definition of done for any feature shipment before it can pass through the release gates above.

### Gate Matrix

| Gate | Required when | Pass criteria |
|------|---------------|---------------|
| **Product** | User-facing change | [PRINCIPLES.md](./PRINCIPLES.md) feature test |
| **UX** | Workflow, nav, routing, capture | Reduces clicks/switches |
| **Architecture** | Routes, data model, lib boundaries | Matches [TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md) |
| **Accessibility** | Interactive controls | No hover-only critical controls |
| **Performance** | Large lists, new fetches | No obvious regression |
| **Security** | Auth, RLS, middleware | User-scoped data |
| **Deployment** | Shipped to hosted env | Build green; production verified |
| **Documentation** | Behavior changes | FEATURE_INVENTORY + Decision Record if consequential |

Solo founder: self-review checklist, still mandatory.

### Minimum Per Change Type

| Change type | Gates required |
|-------------|----------------|
| Bug fix (internal) | Deployment |
| Security fix | Security, Deployment, Documentation |
| Feature addition | Product, UX, Architecture, Security, Deployment, Documentation |
| Refactor (no behavior change) | Architecture, Deployment |
| New module | **Reject** unless all gates + alpha gate |

### Security Gate (Non-Negotiable)

- [ ] Route in middleware if authenticated content
- [ ] Supabase queries scoped to `auth.uid()`
- [ ] RLS policies verified for new tables
- [ ] No secrets in client bundle
- [ ] No `using (true)` on user data tables

### Deployment Gate

- [ ] `npm run build` passes
- [ ] `npm run lint` no new errors in touched files
- [ ] Manual smoke: login → primary flow → logout
- [ ] Hosted deploy tested on https://flowos-sage.vercel.app

### Documentation Gate

- [ ] [FEATURE_INVENTORY.md](../../04-features/FEATURE_INVENTORY.md) updated if user-visible
- [ ] [Decision Records](../../08-decisions/decision-records.md) for consequential Build/Kill decisions
