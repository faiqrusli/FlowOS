# Phase 2 — Strategic Review

**Date:** July 3, 2026  
**Baseline:** Phase 1 commit `04fe227`  
**Source artifact:** `flowos-phase-2-strategic-review.canvas.tsx`  
**Method:** Fresh-eyes lead product designer review. No code modified.

---

# Purpose

Independently assess whether the audit's Phase 2 plan (accent budget sweep) remains correct after Phase 0 and Phase 1. Challenge prior recommendations. Refine roadmap for Phases 2–5.

---

# Background

Phase 0 fixed critical bugs. Phase 1 fixed interaction consistency. Strategic review asked: is accent/chip work still the right next move? What should not be touched? What hidden debt exists?

---

# Problems identified

## Score progression

| Metric | Pre-Phase 0 | Post Phase 0+1 |
|--------|---------------|----------------|
| Overall | 5.5 / 10 | **7.0 / 10** |

## Dimension breakdown (post Phase 0+1)

| Dimension | Score |
|-----------|-------|
| Surface foundation | 8.5 |
| Typography rendering | 8.0 |
| Typography application | 5.5 |
| Color/accent | 4.5 |
| Interaction consistency | 7.0 |
| Component consistency | 6.0 |
| Premium feel | 6.5 |
| A11y baseline | 6.5 |

**Hardcoded palette references:** 542 (baseline for Phase 2)

## Biggest remaining weaknesses (ranked)

1. **Accent budget violation** — rainbow entity fills across Tasks, Workplace, Schedule  
2. **Chips bypass Badge** — 3+ chip systems with no shared primitive  
3. **Dual timeline/schedule styling** — duplicate color logic  
4. **Typography under-applied** — `typography.ts` exists but pages use ad-hoc sizes  
5. **Mixed surface recipes** — 3 card radii, inconsistent elevation  
6. **Hover-only row actions** — accessibility and discoverability gap  
7. **Micro-type 9–10px** — contrast failures on schedule labels

---

# Decisions

1. **Phase 2 concept confirmed** — accent language + chip consolidation is the correct next phase  
2. **Typography-first rejected** — accent chaos is louder than typography gaps  
3. **SegmentedControl extraction deferred** — Phase 1 Option A sufficient for now  
4. **Dashboard surface unification deferred** — not Phase 2  
5. **Partial a11y audit at end of Phase 2** — heatmap contrast spot-check only  
6. **Revised roadmap Phases 2–5** documented (see [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md))

## Phase 2 boundaries (frozen direction)

**In scope:** Accent rules, central lib refactor, Badge extension, group/habit/focus/priority migrations, dashboard KPI, panel toggles, drag preview, heatmap spot-check.

**Out of scope:** Layouts, radii, typography rollout, SegmentedControl, Select, checkbox glyphs, new OKLCH hues, light theme, notes/reflection/settings modules.

## Do NOT touch list

- Workplace grid layout  
- Sidebar structure  
- dnd-kit migration (engineering track)  
- Select primitive  
- Glyph checkboxes  
- Reflection page structure  
- Auth flows  
- Light theme  
- Emoji identity data model  

---

# Scope

Strategic assessment only. Output: refined Phase 2 direction leading to engineering contract.

---

# Out of scope

- Implementation  
- UX workflow changes (separate friction review)  
- Phase 3 UX redefinition (happened later same day)

---

# Files affected

None — review only. Identified high-impact files for Phase 2:

**Central libs:** `task-group-appearance.ts` (47 refs), `schedule-palette.ts` (30), `panel-toggle-styles.ts`, `timeline-habit-appearance.ts`, `task-priority.ts`, `workplace-group-accent.ts`

**Feature surfaces:** `schedule-timeline.tsx`, `workplace-focus-card.tsx`, `task-row.tsx`, `task-compact-card.tsx`, `focus-heatmap.tsx`, `task-drag-preview.ts`, `dashboard-kpi-strip.tsx`

---

# Verification

Review cross-checked grep counts for hardcoded palette, typography usage, and inverted pattern remnants. Findings drove Phase 2 spec task list.

---

# Deferred work

Explicitly deferred beyond Phase 2:

- Full typography scale rollout → Phase 3 (later superseded by UX Phase 3)  
- SegmentedControl primitive → Phase 4+  
- Select consolidation → Phase 4+  
- Hover-only actions → Phase 3+  
- Full WCAG audit → Phase 5  
- Hidden debt inventory: setState-in-effect lint, dnd-kit dual system, duplicate context menus, timeline-planner monolith size

---

# Lessons learned

1. Re-inspect after every phase — scores and priorities shift  
2. Central-lib-first refactor beats page-by-page color tweaks  
3. "Do NOT touch" list is as important as scope — prevents Phase 2 becoming Phase 2–4  
4. 542 hardcoded refs is a metric worth tracking across phases

---

# Related documents

- [03-phase2-spec.md](./03-phase2-spec.md)  
- [03-phase2-implementation.md](./03-phase2-implementation.md)  
- [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md)  
- Source: `.cursor/projects/.../canvases/flowos-phase-2-strategic-review.canvas.tsx`
