# FlowOS Execution Layer

**Current milestone:** M2 — Founder Daily Driver  
**Status:** Engineering Sessions 1–6 complete (July 4, 2026); Sessions 7–8 (recruiting + dogfooding) in progress  
**Production:** https://flowos-sage.vercel.app

This folder is the index for **how FlowOS ships right now**. Strategy lives in the masterplan; these docs are the operating manual.

---

## Primary document

| Document | Purpose |
|----------|---------|
| [execution-masterplan.md](../strategy/execution-masterplan.md) | Milestones M0–M5, exit gates, scope rules |

**Authority:** The masterplan supersedes [roadmap-pre-masterplan.md](../archive/design/july-3/roadmap-pre-masterplan.md) (Phase 3+) and [launch-plan-july-2026.md](../archive/planning/launch-plan-july-2026.md) (timeline).

---

## Milestone runbooks

| Milestone | Runbook | Status |
|-----------|---------|--------|
| M0 — Custody | (covered in masterplan) | Complete |
| M1 — Deployed & Secure | [m1-ship-gate.md](./runbooks/m1-ship-gate.md) | **Complete** — RLS verified, production live |
| M2 — Founder Daily Driver | [m2-founder-daily-driver.md](./runbooks/m2-founder-daily-driver.md) | **In progress** — Sessions 1–6 shipped |
| M2 — Surface hierarchy | [m2-surface-hierarchy.md](./runbooks/m2-surface-hierarchy.md) | In progress — Session 1 |
| M2 — Today UX polish | [m2-today-ux-polish.md](./runbooks/m2-today-ux-polish.md) | **Complete** — production sign-off 2026-07-05 |
| M3 — First Strangers | (masterplan Step 2) | Not started — recruiting prep underway |

**M2 recruiting:** [recruiting-pipeline.md](./ops/recruiting-pipeline.md)

Runbook index: [runbooks/README.md](./runbooks/README.md)

**After milestone exit:** Write or update SRAI review in [../review/milestones/](../review/milestones/) — see [../review/README.md](../review/README.md).

---

## Operational state

| Document | Purpose |
|----------|---------|
| [supabase/APPLIED_STATE.md](../../supabase/APPLIED_STATE.md) | Migration apply record, RLS verification, production URL |
| [foundation/governance/GATES.md](../foundation/governance/GATES.md) | Launch gates and blockers |

---

## Evidence logs (append-only)

| Log | Purpose |
|-----|---------|
| [inbox.md](./logs/inbox.md) | Scratch UI/UX fixes — promote to runbook when scoped |
| [friction-log.md](./logs/friction-log.md) | Live founder friction from production use |
| [decision-log.md](./logs/decision-log.md) | Product decisions with rationale |
| [july-log.md](./logs/july-log.md) | July session narrative |

Log index: [logs/README.md](./logs/README.md)

**Historical friction audit (simulated, July 3):** [ux-friction-review.md](../archive/design/july-3/ux-friction-review.md) — superseded by live friction log for evidence.

---

## M2 exit criteria (reminder)

From the masterplan — all must pass before M3:

1. Zero clicks to execution surface on production
2. Open → first meaningful action **< 5 seconds**
3. Every next-action stays on Today
4. Founder uses hosted FlowOS **≥ 5 days/week**
5. **≥ 3 recruiting candidates** in pipeline

---

## Governance (still in force)

Release gates and decision rules are unchanged:

- [governance/GATES.md](../foundation/governance/GATES.md) — metrics and release gates
- [governance/](../foundation/governance/)
