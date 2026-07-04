# FlowOS UX Friction Review & Phase 3 Strategy

**Date:** July 3, 2026  
**Perspective:** 6-month daily power user of productivity software  
**Assumption:** Design system complete (Phases 0–2 done)  
**Source:** `.cursor/plans/flowos_ux_friction_review_632d3c3e.plan.md` + agent transcript  
**Focus:** Workflow friction only — not visual design, colors, tokens, or implementation quality

---

# Purpose

Identify the top productivity blockers for daily FlowOS usage and propose a rewritten Phase 3 roadmap focused on **effortlessness** — making the existing OS feel like one continuous day rather than eight disconnected modules.

---

# Background

After completing the visual design system (5.5 → 7.8/10), the product still fails the "daily OS" promise. Users with six months of muscle memory still ask: **"Where am I supposed to be right now?"** Intelligence lives on Dashboard; execution on Workplace; analytics on Focus; organization on Tasks.

This review deliberately ignores design system work and evaluates workflow architecture, navigation, routing, capture flows, focus execution, planning surfaces, keyboard affordances, and day open/close rituals.

---

# Problems identified

## Core diagnosis

FlowOS has the *pieces* of a daily OS but not a *single gravitational center*. After 6 months, daily users still pay a navigation and decision tax.

## Daily loop breakdown

```
Morning → Dashboard → next action links to wrong module
Execution → actually happens on /workplace
Planning → scattered across Tasks drawer, Schedule page, Workplace embed
Evening → /reflection OR sidebar with different save behavior
```

## Top 20 friction points (ranked by daily productivity impact)

| Rank | Friction | Severity | Frequency |
|------|----------|----------|-----------|
| 1 | No single execution home — intelligence and action split | Critical | Every session |
| 2 | Next action routes to wrong module (focus → `/focus`, items → list pages) | Critical | Daily |
| 3 | No command palette or global search | Critical | 5–20×/day |
| 4 | Three scheduling surfaces, no clear default | High | 2–5×/day |
| 5 | Planning model overload: group vs Today vs Later vs date | High | 10–30×/day |
| 6 | Eight sidebar modules = constant context switching | High | 20–50×/day |
| 7 | Quick capture is modal, tasks-only, flow-breaking | High | 5–15×/day |
| 8 | Critical controls hidden behind hover (timer, quick-add) | High | Every focus session |
| 9 | Focus start requires multiple deliberate steps | High | 2–8×/day |
| 10 | Keyboard workflow nearly absent for core actions | High | Power users |
| 11 | Reflection: two save behaviors for same data | Medium-high | 1×/day |
| 12 | Dashboard is mandatory detour, not launcher | Medium-high | 1–2×/day |
| 13 | Task editing has four competing paths | Medium | 10–30×/day |
| 14 | No day recovery flow for busy/missed days | Medium-high | 2–4×/week |
| 15 | Workplace right sidebar hover-reveal during execution | Medium | 3–10×/day |
| 16 | Fake Agenda card destroys trust (dead buttons) | Medium | Daily |
| 17 | Habit focus requires opt-in `track_with_focus` | Medium | First attempt per habit |
| 18 | No morning/evening arc despite OS positioning | Medium | 2×/day |
| 19 | Manual sort mode required for drag reorder | Low-medium | 1–5×/day |
| 20 | 1-second task completion animation in focus card | Low | 2–10×/day |

## Friction heatmap by daily phase

| Phase | Highest friction |
|-------|------------------|
| Morning planning | Dashboard detour, triple scheduling, planning model |
| Task execution | Module switching, no search, task edit paths |
| Deep work | Wrong focus routing, hover timer, multi-step focus start |
| Schedule adjustments | Scattered reschedule, triple timeline |
| Breaks / context switch | 8 modules, no command layer |
| Habit completion | Fine on Workplace; bad on Schedule (hover checkbox) |
| Reflection | Dual save UX, no evening arc |
| Tomorrow planning | No real flow, fake Agenda, Later vs date confusion |

## Key code paths referenced

- `flowos/src/lib/dashboard-command.ts` — next action routing  
- `flowos/src/lib/schedule.ts` — scheduled item routing  
- `flowos/src/components/layout/quick-capture-dialog.tsx` — modal capture  
- `flowos/src/hooks/use-global-shortcuts.ts` — 4 global shortcuts only  
- `flowos/src/components/workplace/workplace-focus-card.tsx` — hover-gated timer  
- `flowos/src/components/workplace/workplace-agenda-card.tsx` — fake Agenda  
- `flowos/src/contexts/global-right-sidebar-context.tsx` — hover sidebar

---

# Decisions

1. **Phase 3 redefined** — "Effortless Daily Loop" replaces audit's visual Phase 3 (typography & density)  
2. **Workplace/Today becomes gravitational center** — Dashboard demoted to optional Overview  
3. **Command palette is table stakes** — Phase 3.2 priority  
4. **Visual typography work deferred to Phase 4** — workflow ROI is higher  
5. **Goals/AI Coach/Weekly Review deferred to Phase 4+**  
6. **Recommended MVP bundle** defined for 2–3 week first ship

## Phase 3 thesis

Stop adding modules. Make the existing OS feel like one continuous day.

**Success metric:** Time from open app → doing the right thing **under 5 seconds**; module switches per day **cut in half**.

---

# Scope

This review covers:

- Workflow simulation across 10 user personas  
- Top 20 ranked friction points with frequency/severity/ROI  
- Rewritten Phase 3 roadmap (6 sub-phases)  
- Phase 3 success metrics (UX, not engineering)  
- Recommended MVP first ship bundle

---

# Out of scope

- Visual design, colors, tokens, typography  
- Design system implementation quality  
- New feature modules (Goals, AI Coach)  
- dnd-kit migration  
- Backend/data model changes (except routing fixes)

---

# Files affected

None — review only. Implementation will touch routing, layout, command layer, capture, focus, and scheduling files listed in [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md).

---

# Verification

Review grounded in codebase exploration:

- 8 sidebar modules confirmed  
- 3 scheduling surfaces confirmed (Tasks drawer, Schedule page, Workplace embed)  
- 4 global shortcuts confirmed  
- Next-action routing logic verified in source  
- Fake Agenda card verified as non-functional

---

# Deferred work

Explicitly deprioritized for Phase 3:

- Goals module build-out  
- AI Coach  
- Weekly Review placeholders  
- Visual polish pass  
- New sidebar items  
- More timeline variants  
- Planning model documentation (goal is to eliminate need to understand it)

Visual work from original audit deferred to Phase 4:

- Typography scale application  
- Task row anatomy  
- Reflection structure  
- Signature moments (Focus hero, now-line, heatmap legend)

---

# Lessons learned

1. A complete design system does not equal a usable daily OS — workflow architecture is a separate track  
2. The smartest feature (next action) currently destroys trust by routing incorrectly  
3. Hover-gated controls are the enemy of deep work and accessibility  
4. Power users (most likely to retain daily) are most penalized by missing keyboard/command layer

---

# Related documents

- [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md) — Phase 3.1–3.6 detailed breakdown  
- [project-state-july-2026.md](./project-state-july-2026.md) — current UX debt summary  
- [AUDIT_HISTORY.md](./AUDIT_HISTORY.md) — Dashboard/Workplace architecture decisions  
- [CHANGELOG.md](./CHANGELOG.md) — UX Friction Review entry  
- Source plan: `.cursor/plans/flowos_ux_friction_review_632d3c3e.plan.md`
