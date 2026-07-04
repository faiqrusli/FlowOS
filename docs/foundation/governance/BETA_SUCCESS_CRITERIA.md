# Beta Success Criteria

**Status:** Active  
**Audience:** Founder  
**Last updated:** July 3, 2026  
**Stage:** Closed Beta (50 users) → Public Beta

---

## Purpose

Objective criteria to graduate from private alpha to closed beta, and from closed beta to public beta.

Prerequisite: [ALPHA_SUCCESS_CRITERIA.md](./ALPHA_SUCCESS_CRITERIA.md) passed.

---

## Enter closed beta (50 users)

### Must achieve (all)

| Criterion | Target |
|-----------|--------|
| Alpha D7 gate | > 30% sustained 4 weeks at 15 users |
| Phase 3 core | Command palette v1; reflection save unified; focus as mode on Today |
| Onboarding v1 | 3-step first-run live |
| Engineering | CI build green; smoke tests on auth, task CRUD, focus, reflection |
| Security | Full RLS audit documented; no open policies on user data |
| Documentation | Privacy policy draft; public README |

### Should achieve

| Criterion | Target |
|-----------|--------|
| D14 retention (alpha cohort) | > 20% |
| Weekly reflection rate | > 50% of weekly active users |
| Support load | Founder can respond to feedback within 48h |

---

## Graduate to public beta

### Must achieve (all)

| Criterion | Target |
|-----------|--------|
| **D7 retention** | ≥ 25% at 50+ users |
| **D30 retention** | ≥ 15% |
| Weekly reflection rate | ≥ 60% of weekly active users |
| P0 bug rate | Zero unresolved > 7 days |
| WCAG | Contrast pass on core flows (Phase 5 subset) |
| Legal | Terms + privacy published |

### Should achieve

| Criterion | Target |
|-----------|--------|
| Organic weekly active | Growing without founder DM reminders |
| NPS | Survey eligible (not primary gate) |
| Performance | No user-reported "slow" on standard hardware |

---

## Fail criteria (stay in closed beta)

| Signal | Action |
|--------|--------|
| D7 < 20% at 50 users | Do not open public beta; iterate loop |
| Churn clusters around one module | Fix or demote module before growth |
| Support exceeds 10h/week solo | Reduce beta size until automation/onboarding improves |

---

## Beta feature scope cap

**Do not add to beta scope:**

- AI Coach (FE-4)  
- Goals module (FE-1) unless alpha explicitly requests  
- Calendar sync (FE-11)  
- Mobile apps (FE-9)  
- Gamification (FE-10)  

Add only if D7 > 30% **and** user interviews name gap as #1 churn reason.

---

## Review cadence

| Cadence | Activity |
|---------|----------|
| Weekly | D7/D30 dashboard; top 3 friction fixes |
| Monthly | Risk register review ([RISK_REGISTER.md](./RISK_REGISTER.md)) |
| Per release | RELEASE_CRITERIA closed beta checklist |

---

## Related documents

- [ALPHA_SUCCESS_CRITERIA.md](./ALPHA_SUCCESS_CRITERIA.md)  
- [RELEASE_CRITERIA.md](./RELEASE_CRITERIA.md)  
- [../SUCCESS_METRICS.md](../SUCCESS_METRICS.md)  
