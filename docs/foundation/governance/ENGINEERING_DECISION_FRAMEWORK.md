# Engineering Decision Framework

**Status:** Active  
**Audience:** Engineers, founder  
**Last updated:** July 3, 2026

---

## Purpose

How to decide technical approaches, debt paydown, and infrastructure work — balanced against user value for a solo-engineer product.

Product scope decisions use [PRODUCT_DECISION_FRAMEWORK.md](./PRODUCT_DECISION_FRAMEWORK.md).

---

## Core rule

**User-visible loop value beats internal perfection — except for security and data integrity.**

Security and RLS are never deferred for features.

---

## Build vs defer vs reject (engineering)

### Build now (before Phase 3 feature work)

| Item | Why |
|------|-----|
| Fix production build | Deploy blocker |
| RLS user-scoping on core tables | Security blocker |
| `/workplace` auth middleware | Security blocker |
| Delete dead/broken code | Build + trust |
| `error.tsx` / `loading.tsx` on main routes | Alpha reliability |

### Build with Phase 3

| Item | Why |
|------|-----|
| Routing fixes (`dashboard-command.ts`, `schedule.ts`) | Product loop |
| Inline capture, command palette | Product loop |
| Focus control visibility | Product loop |

### Defer (can wait until beta)

| Item | Why |
|------|-----|
| dnd-kit full migration | Works today; regression risk |
| `tasks-board-view.tsx` split | Large refactor; careful timing |
| Select/SegmentedControl primitives | Functional patterns exist |
| 542 hardcoded palette cleanup | Visual debt |
| Automated test suite expansion | Required before closed beta, not alpha Wave 1 |
| Performance profiling | No user reports yet |

### Reject / never (near-term)

| Item | Why |
|------|-----|
| Light theme | Non-goal |
| Microservices / second backend | Supabase sufficient |
| Real-time collaboration | Non-goal |
| Rewrite in different framework | No user value |

---

## Technical decision checklist

1. **Security** — Does this expose user data or bypass auth? If yes, fix first.  
2. **Build** — Does `npm run build` pass after change?  
3. **Scope** — Smallest diff that solves the problem?  
4. **Convention** — Matches patterns in [../TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)?  
5. **Rollback** — Can founder revert if alpha breaks?  
6. **Docs** — Update FEATURE_INVENTORY or TECHNICAL_ARCHITECTURE if behavior changes?

---

## Debt paydown priority

| Priority | Debt | When |
|----------|------|------|
| P0 | Open RLS, auth gaps, build failure | Week 1 pre-Phase 3 |
| P1 | No error boundaries, no smoke tests | Before private alpha |
| P2 | Monolith components, dual dnd | During beta if pain reported |
| P3 | Typography, palette refs, radii | Phase 4 visual track |
| P4 | Lint in legacy dialogs | When touching files |

---

## Balance: effort vs user value

| Effort | User value high | User value low |
|--------|-----------------|----------------|
| **Small (< 1 day)** | Ship immediately | Batch or skip |
| **Medium (1–3 days)** | Schedule in current sprint | Defer |
| **Large (> 1 week)** | Requires D7 or alpha user evidence | Reject |

**Example:** Command palette = medium effort, high value for power users → build in Phase 3.2.  
**Example:** dnd-kit migration = large effort, low immediate user value → defer.

---

## Architecture change rules

1. No new top-level `lib/` domains without FEATURE_INVENTORY update.  
2. Supabase schema changes require SQL migration in `flowos/supabase/` + RLS review.  
3. New routes require middleware + navigation audit.  
4. Design system changes follow frozen Phase 0–2 rules; workflow changes follow Phase 3 contract model.

---

## Phase 3 engineering contract

Follow [../../design/README.md](../../design/README.md):

```
Review → Spec (frozen) → Implement (exact) → Post-review → DECISION_LOG
```

Do not expand scope during implementation. Ground truth changes require spec amendment before coding.

---

## Related documents

- [../TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)  
- [QUALITY_GATES.md](./QUALITY_GATES.md)  
- [RISK_REGISTER.md](./RISK_REGISTER.md)  
- [../../design/ROADMAP.md](../../design/ROADMAP.md)  
