# FlowOS Execution Layer

**Current milestone:** M2 — Founder Daily Driver  
**Status:** **Paused / review mode** (2026-07-21) — production dogfood + GitHub review + live demo; no large new feature runbooks until the hold is lifted.  
**Production:** https://flowos-sage.vercel.app  
**Live demo:** [runbooks/flowos-live-demo.md](./runbooks/flowos-live-demo.md) · [spec](../review/design/flowos-live-demo-spec.md)

This folder is the index for **how FlowOS ships**. Strategy lives in the masterplan; these docs are the operating manual.

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
| M1 — Deployed & Secure | [m1-ship-gate.md](./runbooks/m1-ship-gate.md) | **Complete** |
| M2 — Founder Daily Driver | [m2-founder-daily-driver.md](./runbooks/m2-founder-daily-driver.md) | **Paused** — engineering shipped; recruiting/dogfood open; hold for review |
| M2 — Global navigation | [m2-global-navigation.md](./runbooks/m2-global-navigation.md) | **Complete** — on `main` 2026-07-10 |
| M2 — Today UX polish | [m2-today-ux-polish.md](./runbooks/m2-today-ux-polish.md) | **Complete** — 2026-07-05 |
| M2 — Today hierarchy refinement | [m2-today-hierarchy-refinement.md](./runbooks/m2-today-hierarchy-refinement.md) | **Complete** — merged via `tweak/today-focus-queue-layout` (2026-07-17) |
| Schedule Break | [m2-schedule-break.md](./runbooks/m2-schedule-break.md) | **Complete** |
| Design System V3 migration | [design-system-v3-migration.md](./runbooks/design-system-v3-migration.md) | **Complete** — merged; palette now Tokyo Night Warm + V3 Surface 0–10 |
| Live demo (guest) | [flowos-live-demo.md](./runbooks/flowos-live-demo.md) | **Approved / in progress** — dedicated workstream, not an M2 exit gate |
| Today V3 Day Engine | [m2-today-v3-day-engine.md](./runbooks/m2-today-v3-day-engine.md) | **Deferred indefinitely** during hold — aspirational rebuild |
| M3 — First Strangers | (masterplan Step 2) | Not started — recruiting prep |

**Historical runbooks (archive):** [../archive/runbooks/](../archive/runbooks/) — surface hierarchy, visual v2, Next Up V1, agent prompt.

**Visual authority:** [DESIGN_SYSTEM_V3.md](../foundation/DESIGN_SYSTEM_V3.md) + [Tokyo Night Warm](../foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md)

**M2 recruiting:** [recruiting-pipeline.md](./ops/recruiting-pipeline.md)

Runbook index: [runbooks/README.md](./runbooks/README.md)

**After milestone exit:** SRAI in [../review/milestones/](../review/milestones/) — see [../review/README.md](../review/README.md).

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
| [inbox.md](./logs/inbox.md) | Scratch UI/UX fixes — promote when scoped |
| [friction-log.md](./logs/friction-log.md) | Live founder friction from production use |
| [decision-log.md](./logs/decision-log.md) | Product decisions with rationale |
| [july-log.md](./logs/july-log.md) | July session narrative |

Log index: [logs/README.md](./logs/README.md)

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

- [governance/GATES.md](../foundation/governance/GATES.md)
- [governance/GIT_WORKFLOW.md](../foundation/governance/GIT_WORKFLOW.md) — merge to `main` needs founder approval
- [governance/](../foundation/governance/)
