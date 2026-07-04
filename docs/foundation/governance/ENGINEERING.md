# Engineering Rules

**Status:** Active  
**Audience:** Engineers, founder  
**Last updated:** July 4, 2026 (consolidates former Engineering Decision Framework; M1 blockers removed)

Product scope: [PRINCIPLES.md](./PRINCIPLES.md). Stack detail: [../TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md).

---

## Core rule

**User-visible loop value beats internal perfection — except for security and data integrity.**

Security and RLS are never deferred for features.

---

## Technical checklist

1. **Security** — Does this expose user data or bypass auth? Fix first.
2. **Build** — Does `npm run build` pass?
3. **Scope** — Smallest diff that solves the problem?
4. **Convention** — Matches [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)?
5. **Rollback** — Can founder revert if production breaks?
6. **Docs** — Update FEATURE_INVENTORY or TECHNICAL_ARCHITECTURE if behavior changes?

---

## Build vs defer vs reject

### Build now (M2 / current)

| Item | Why |
|------|-----|
| M2 runbook sessions | Current milestone |
| Routing fixes on Today | Product loop |
| Inline capture, visible focus controls | Product loop |
| Error/loading boundaries | Alpha reliability |

### Defer (until beta or user evidence)

| Item | Why |
|------|-----|
| dnd-kit full migration | Works today; regression risk |
| `tasks-board-view.tsx` split | Large refactor |
| Select/SegmentedControl primitives | Functional patterns exist |
| Hardcoded palette cleanup | Visual debt |
| Automated test suite expansion | Before closed beta |
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
4. Record significant choices in [decision-log.md](../../execution/logs/decision-log.md).

---

## Deploy cadence

```
npm run build && npm run lint → commit → push → verify production
```

See [m1-ship-gate.md](../../execution/runbooks/m1-ship-gate.md) and [m2-founder-daily-driver.md](../../execution/runbooks/m2-founder-daily-driver.md).

---

## Related

- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [GATES.md](./GATES.md)
- [../../supabase/APPLIED_STATE.md](../../../supabase/APPLIED_STATE.md)
