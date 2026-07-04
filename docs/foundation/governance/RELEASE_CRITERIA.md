# Release Criteria

**Status:** Active  
**Audience:** Founder, engineers  
**Last updated:** July 3, 2026

Objective gates for each release stage. Subjective "feels ready" is not sufficient.

Supersedes informal readiness in [../DEPLOYMENT_READINESS.md](../DEPLOYMENT_READINESS.md) for **gate decisions**. CEO review revised launch readiness to **3/10** ([CEO_REVIEW_JULY_2026.md](../CEO_REVIEW_JULY_2026.md)).

Stage-specific success metrics: [ALPHA_SUCCESS_CRITERIA.md](./ALPHA_SUCCESS_CRITERIA.md), [BETA_SUCCESS_CRITERIA.md](./BETA_SUCCESS_CRITERIA.md).

---

## Gate overview

| Stage | Audience | Code truth (Jul 2026) |
|-------|----------|------------------------|
| Internal Development | Founder, local only | **Partial** — build fails |
| Founder Daily Use | Founder, hosted optional | **Blocked** — fix build + RLS first |
| Internal Alpha | Founder, hosted prod-like | Not met |
| Private Alpha | 5–15 invited users | Not met |
| Closed Beta | 50 users | Not met |
| Public Beta | Open/waitlist | Not met |
| Production | Paying / public GA | Not met |

---

## 1. Internal Development

**Purpose:** Local iteration; broken states acceptable with caveats.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Core modules runnable via `npm run dev` |
| **UX quality** | Not gated |
| **Engineering** | TypeScript compiles for active worktrees preferred |
| **Documentation** | Change documented if altering contracts |
| **Testing** | Manual smoke test by founder |
| **Deployment confidence** | Local only |

**Exit:** Ready to fix blockers for Founder Daily Use.

---

## 2. Founder Daily Use

**Purpose:** Founder uses FlowOS as daily driver on hosted instance.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Auth, tasks, habits, focus, reflection, Today/Workplace usable end-to-end |
| **UX quality** | Founder accepts friction; issues logged |
| **Engineering** | `npm run build` passes; no known data-loss bugs |
| **Documentation** | `.env.example` accurate; founder can redeploy |
| **Testing** | Founder completes full loop 5 days/week |
| **Deployment confidence** | Hosted on Vercel + Supabase; **RLS user-scoped on all core tables** |

**Hard blockers (CEO review):**
- [ ] Build green (fix/delete `workplace-recover-day-bar.tsx`)
- [ ] RLS: `auth.uid() = user_id` on tasks, habits, focus_sessions, reflections, habit_completions
- [ ] `/workplace` in auth middleware

**Exit:** Founder Daily Use stable 2 weeks → Internal Alpha.

---

## 3. Internal Alpha

**Purpose:** Production-like environment; still founder-only or +1 co-designer.

| Dimension | Required |
|-----------|----------|
| **Functionality** | All MVP modules; placeholder routes hidden or 404 |
| **UX quality** | No fake/non-functional UI in active paths |
| **Engineering** | `error.tsx` + `loading.tsx` on `(main)` route group |
| **Documentation** | [FEATURE_INVENTORY.md](../FEATURE_INVENTORY.md) matches code |
| **Testing** | Manual regression checklist per deploy |
| **Deployment confidence** | Rollback procedure documented; separate Supabase project optional |

**Exit:** Phase 3.1 minimum daily home ready → Private Alpha recruitment.

---

## 4. Private Alpha

**Purpose:** 5–15 invited users; retention validation.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Today as home; next-action routes in-place; inline capture; focus controls visible |
| **UX quality** | Open → act < 5 sec (founder-observed); no hover-gated timer during active focus |
| **Engineering** | All Founder Daily Use gates + no P0 security issues |
| **Documentation** | [USER_PERSONAS.md](../USER_PERSONAS.md); onboarding call script in [LAUNCH_PLAN.md](../LAUNCH_PLAN.md) |
| **Testing** | Smoke tests: auth, create task, start focus, save reflection |
| **Deployment confidence** | Monitoring: founder can detect auth/DB failures within 24h |

**Product gates (Phase 3.1 minimum):**
- [ ] `/` = Today (Workplace content or redirect)
- [ ] Dashboard intelligence inline on Today
- [ ] `dashboard-command.ts` hrefs execute on Today
- [ ] Fake/dead UI removed from codebase

**Success:** See [ALPHA_SUCCESS_CRITERIA.md](./ALPHA_SUCCESS_CRITERIA.md).

**Exit:** 3/5 D7 retention Wave 1 → expand alpha.

---

## 5. Closed Beta

**Purpose:** 50 users; scalability and onboarding validation.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Phase 3 core complete; command palette v1; reflection save unified |
| **UX quality** | Onboarding v1 (3 steps); empty states on primary surfaces |
| **Engineering** | CI runs build; smoke tests on critical paths; RLS audited |
| **Documentation** | Privacy policy draft; README not boilerplate |
| **Testing** | Automated smoke suite; manual a11y spot-check |
| **Deployment confidence** | Error reporting process; backup strategy documented |

**Success:** See [BETA_SUCCESS_CRITERIA.md](./BETA_SUCCESS_CRITERIA.md).

---

## 6. Public Beta

**Purpose:** Open or waitlist; growth without paid support team.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Stable loop for 90% of sessions (founder-defined) |
| **UX quality** | Phase 4 signature moments on primary surfaces |
| **Engineering** | Performance profiled; WCAG contrast pass on core flows |
| **Documentation** | Public-facing positioning; terms of service |
| **Testing** | Regression suite; cross-browser smoke |
| **Deployment confidence** | D7 ≥ 25% at closed beta scale |

---

## 7. Production

**Purpose:** General availability; optional monetization.

| Dimension | Required |
|-----------|----------|
| **Functionality** | Feature set declared in public changelog |
| **UX quality** | NPS eligible; support channel defined |
| **Engineering** | Full RLS audit; incident response; tests on critical paths |
| **Documentation** | Complete deploy runbook; data export documented |
| **Testing** | Pre-release checklist; staged rollout |
| **Deployment confidence** | D30 ≥ 15%; D7 ≥ 25%; paid/refund policy if charging |

---

## Gate dependency chain

```
Internal Development
    → Founder Daily Use (build + RLS + auth)
        → Internal Alpha (error boundaries, dead UI out)
            → Private Alpha (Phase 3.1 + ALPHA_SUCCESS_CRITERIA)
                → Closed Beta (BETA_SUCCESS_CRITERIA)
                    → Public Beta
                        → Production
```

---

## Related documents

- [../DEPLOYMENT_READINESS.md](../DEPLOYMENT_READINESS.md) — category ratings  
- [QUALITY_GATES.md](./QUALITY_GATES.md) — per-feature completion  
- [../LAUNCH_PLAN.md](../LAUNCH_PLAN.md) — timeline  
