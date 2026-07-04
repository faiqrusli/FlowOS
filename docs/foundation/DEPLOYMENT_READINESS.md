# Deployment Readiness

**Status:** Active assessment  
**Audience:** Founder, engineers  
**Last updated:** July 3, 2026  
**Overall readiness:** Not production-ready. Private alpha after security week + Phase 3.1 MVP.

> **CEO review (July 2026):** Revised overall launch readiness to **3/10** due to failing production build and open RLS on core tables. See [CEO_REVIEW_JULY_2026.md](./CEO_REVIEW_JULY_2026.md). Objective release gates: [governance/RELEASE_CRITERIA.md](./governance/RELEASE_CRITERIA.md).

---

## Purpose

Provide an honest, category-by-category assessment of whether FlowOS can be deployed at each stage (internal alpha, private alpha, public beta, production). Prevents premature launch.

---

## Readiness ratings

| Category | Rating | Notes |
|----------|--------|-------|
| Product readiness | 5/10 | Features exist; daily loop broken |
| UX readiness | 5/10 | Visual 7.8/10; workflow 4.5/10 |
| Feature completeness | 7/10 | MVP modules shipped |
| Reliability | 6/10 | No automated tests; no error boundaries |
| Navigation | 4/10 | 8 modules; Dashboard vs Workplace split |
| Discoverability | 4/10 | No command palette; hover-gated controls |
| Onboarding | 2/10 | None |
| Empty states | 5/10 | Phase 4 deferred |
| Loading states | 4/10 | No route-level `loading.tsx` |
| Error handling | 4/10 | No route-level `error.tsx` |
| Authentication | 7/10 | Supabase works; `/workplace` middleware gap |
| Data integrity | 5/10 | Core tables: RLS enabled but **`using (true)`** — not user-scoped |
| Security | 4/10 | Auth gap on `/workplace`; open RLS on core data |
| Performance | 7/10 | Next.js 16; no profiling data |
| Accessibility | 5.5/10 | Hover-gated controls; partial reduced-motion |
| Responsive behaviour | 6/10 | Desktop-first productivity app |
| Visual consistency | 7.8/10 | Phase 2 complete |
| Professional appearance | 7.5/10 | Credible dark workspace |
| Trustworthiness | 5/10 | Fake Agenda card; placeholder routes |

---

## Deployment stage decision

| Stage | Ready today? | Gate to reach |
|-------|--------------|---------------|
| **Internal development** (local dev) | **Partial** | `npm run dev` works; **`npm run build` fails** (Jul 2026) |
| **Founder daily use** (hosted) | **No** | Build green + RLS + auth middleware |
| **Internal alpha** (solo hosted) | **No** | Founder daily use gates |
| **Private alpha** (5–15 users) | **No** | Security week + Phase 3.1 MVP (~4–6 weeks) |
| **Public beta** (50+ users) | **No** | Phase 3 complete + onboarding + QA (~90 days) |
| **Production** | **No** | Phase 3 + Phase 5 + retention validated |

---

## Critical blockers (must fix before private alpha)

### 1. Auth middleware gap on `/workplace`

**File:** `flowos/src/middleware.ts`  
**Issue:** `/workplace` is not in `PROTECTED_PREFIXES`. Primary execution surface may be accessible without login.  
**Fix:** Add `/workplace` to protected prefixes.  
**Effort:** Minutes.

### 2. Fake Agenda card

**File:** `flowos/src/components/workplace/workplace-agenda-card.tsx`  
**Issue:** Hardcoded agenda items with non-functional "Open" buttons. Destroys trust with alpha users.  
**Fix:** Remove card or wire to real "Plan tomorrow" flow.  
**Effort:** Hours.

### 3. Daily loop not unified (Phase 3.1)

**Issue:** Dashboard at `/`, execution at `/workplace`; next-action routes incorrectly.  
**Fix:** Phase 3.1 MVP bundle — see [../design/ROADMAP.md](../design/ROADMAP.md).  
**Effort:** 2–3 weeks.

---

## High-priority blockers (before private alpha)

| Blocker | Fix |
|---------|-----|
| No onboarding | Minimal 3-step first-run after Phase 3.1 IA stabilizes |
| No error boundaries | Add `error.tsx` on main route groups |
| No loading states | Add `loading.tsx` on data-fetching routes |
| Placeholder routes visible | Hide `/goals`, `/ai-coach` until built |

---

## Pre-private-alpha checklist

### Product

- [ ] Phase 3.1 MVP shipped (Today as home, inline next-action, fixed routing)
- [ ] Fake Agenda card removed or wired
- [ ] Command palette v1 (search + jump) — Phase 3.2, strongly recommended before alpha
- [ ] Inline capture bar on Today

### Security & auth

- [ ] `/workplace` in middleware protected prefixes
- [ ] Supabase RLS policies scoped to authenticated user (not permissive dev policies)
- [ ] Environment variables documented and set on host

### Reliability

- [ ] `error.tsx` on `(main)` route group
- [ ] `loading.tsx` on primary data routes
- [ ] `npm run build` passes on clean CI/host (**currently fails** — fix `workplace-recover-day-bar.tsx`)

### Trust

- [ ] No non-functional buttons in UI
- [ ] No placeholder routes reachable from nav
- [ ] README updated from Next.js boilerplate

### Operations

- [ ] Supabase project provisioned for alpha (separate from dev if possible)
- [ ] Deployment host configured (Vercel recommended)
- [ ] Founder can reproduce deploy from docs

---

## Pre-public-beta checklist (additional)

- [ ] Phase 3 complete (3.1–3.6)
- [ ] Onboarding v1
- [ ] D7 retention > 30% in private alpha
- [ ] Phase 5 QA subset (keyboard nav, contrast spot-check)
- [ ] 15+ alpha users with documented feedback
- [ ] Reflection save behavior unified

---

## Pre-production checklist (additional)

- [ ] D7 retention > 25% at scale
- [ ] Automated tests on critical paths (auth, task CRUD, focus session)
- [ ] Full WCAG contrast audit
- [ ] Performance profiling under load
- [ ] Privacy policy and terms (if collecting user data publicly)
- [ ] Incident response plan (solo founder: at minimum, backup strategy)

---

## Environment setup

```bash
# Clone and install
cd flowos
npm install

# Configure (copy from .env.example)
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Apply Supabase migrations (via Supabase SQL editor or CLI)
# See flowos/supabase/*.sql in dependency order

# Run locally
npm run dev

# Production build
npm run build && npm start
```

---

## Rollback criteria

Pause alpha recruitment and revert to internal-only if:

- Data loss or corruption reported by any alpha user
- Auth bypass confirmed on any protected route
- Critical workflow completely broken (cannot create task, start focus, or save reflection)
- More than 2 of 5 alpha users abandon within 48 hours without feedback

---

## Related documents

- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) — alpha timeline and recruitment  
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) — stack and debt register  
- [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) — what to measure during alpha  
- [../design/ROADMAP.md](../design/ROADMAP.md) — Phase 3 work that unblocks alpha  
