# Engineering Rules

**Status:** Active engineering decision rules; historical M2 examples retained below
**Audience:** Engineers, founder  
**Last updated:** August 4, 2026

**Authority:** The reusable standard for engineering change lives in [Engineering Standards](../../06-engineering/engineering-standards.md). Current phase scope lives in [current-sprint.md](../../current-phase/current-sprint.md) and the MVP Implementation Masterplan.

Product scope: [PRINCIPLES.md](./PRINCIPLES.md). Stack detail: [../../06-engineering/TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md).

---

## Core rule

**User-visible loop value beats internal perfection — except for security and data integrity.**

Security and RLS are never deferred for features.

---

## Technical checklist

1. **Security** — Does this expose user data or bypass auth? Fix first.
2. **Build** — Does `npm run build` pass?
3. **Scope** — Smallest diff that solves the problem?
4. **Convention** — Matches [TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md)?
5. **Rollback** — Can founder revert if production breaks?
6. **Docs** — Update FEATURE_INVENTORY or TECHNICAL_ARCHITECTURE if behavior changes?

---

## Build vs defer vs reject

### Build now (current phase)

| Item | Why |
|------|-----|
| Phase 1 implementation-truth work | Current sprint |
| Baseline quality, security, and production checks | Gate 1 evidence |
| P0/P1 fixes that affect admitted MVP truth | Current phase objective |

### Defer (until beta or user evidence)

| Item | Why |
|------|-----|
| dnd-kit full migration | Works today; regression risk |
| `tasks-board-view.tsx` split | Large refactor |
| Select/SegmentedControl primitives | Functional patterns exist |
| Hardcoded palette cleanup | Visual debt |
| New validation-library integration | Complete — Zod/RHF adopted in Phase 1.5; scoped form migrations remain |
| Command palette | M4 unless users ask |

### Reject (near-term)

| Item | Why |
|------|-----|
| Light theme | Non-goal |
| Microservices / second backend | Supabase sufficient |
| Real-time collaboration | Non-goal |
| Framework rewrite | No user value |

---

## Debt priority

| Priority | Debt | When |
|----------|------|------|
| P0 | RLS/auth gaps, build failure | Immediately |
| P1 | No error boundaries | Before private alpha |
| P2 | Monolith components, dual dnd | During beta if painful |
| P3 | Typography, palette refs | Phase 4 visual track |

M1 resolved: production build, RLS two-account test, production deploy.

---

## Effort vs value

| Effort | High user value | Low user value |
|--------|-----------------|----------------|
| **Small (< 1 day)** | Ship immediately | Skip |
| **Medium (1–3 days)** | Current sprint | Defer |
| **Large (> 1 week)** | Needs D7 or user evidence | Reject |

---

## Architecture change rules

1. No new top-level `lib/` domains without FEATURE_INVENTORY update.
2. Supabase schema changes require SQL migration in `supabase/` + RLS review.
3. New routes require middleware + navigation audit.
4. Record consequential choices in [Decision Records](../../08-decisions/decision-records.md).

---

## Deploy cadence

**Branch workflow:** [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) — work on branches; merge to `main` only with Founder approval and passing build, lint, and test checks.

```
branch → npm run build && npm run lint && npm test → commit → push branch
    → founder approves → merge to main → push main → verify production
```

See historical examples [m1-ship-gate.md](../../11-archive/execution/runbooks/m1-ship-gate.md) and [m2-founder-daily-driver.md](../../11-archive/execution/runbooks/m2-founder-daily-driver.md).

---

## Related

- [CODE_STANDARDS.md](./CODE_STANDARDS.md)
- [GATES.md](./GATES.md)
- [../../supabase/APPLIED_STATE.md](../../../supabase/APPLIED_STATE.md)
