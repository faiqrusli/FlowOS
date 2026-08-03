# FlowOS Design Audit

**Date:** July 3, 2026  
**Reviewer role:** Head of Product Design  
**Source artifact:** `flowos-design-audit.canvas.tsx`  
**Method:** 23 UI screenshots + full codebase inspection. No code modified.

---

# Purpose

Establish an honest baseline score, rank every visual and UX defect by impact, propose a color direction, and produce a phased redesign roadmap. This audit is the root document for all subsequent design phases.

---

# Background

FlowOS is a dark-theme productivity application built on Next.js, Tailwind v4, and OKLCH design tokens. Pre-audit, the app had layered surface tokens and shared `flow-*` utilities suggesting intentional design system work — but screenshots revealed serif typography, native control leaks, and rainbow accent competition that made the product read as an unfinished developer dashboard rather than a premium productivity tool.

---

# Problems identified

## Scores

| Metric | Score |
|--------|-------|
| **Overall UI** | **5.5 / 10** |
| Foundations (tokens, surfaces) | 7 / 10 |
| Consistency | 5 / 10 |
| Craft & polish | 4 / 10 |

## P0 — Critical (fix before any redesign)

1. **Serif font fallback** — `--font-sans: var(--font-sans)` circular reference in `globals.css`; Geist loaded as `--font-geist-sans` in `layout.tsx` but never wired  
2. **Native `<select>` and `<input type="time">`** — light-theme browser popups in Quick Capture, Add Habit, Settings  
3. **Light-surface leaks** — white active tab (Notes kanban), light-gray selected card (Focus reflection history), white segmented pill (Plan Normal/Later)

## P1 — High impact

4. No accent budget — orange HABIT, violet FOCUS, emoji pills, colored flags compete per row  
5. Task rows: equal title/meta weight; 3–4 always-visible muted icons × 20+ rows  
6. Boxes inside boxes — KPI tiles in bordered cards; accordion rows styled as inputs  
7. Contrast failures — heatmap nearly invisible, ~10px hour labels, muted on orange habit rows  
8. Control shape inconsistency — pill inputs in Focus settings, 4 segmented styles, near-black dropdown chips

## P2 — Medium impact

9. Density/rhythm — Workplace tabs wrap, Schedule empty blocks, Reflection undifferentiated column  
10. Group-color swatch grid oversized with heavy white selection ring

## Page-level findings

Each module audited (Dashboard, Workplace, Tasks, Schedule, Habits, Focus, Reflection, Notes, Dialogs) with Current / Problems / Fix recommendations documented in source canvas.

---

# Decisions

1. **Midnight Focus palette recommended** — navy-indigo neutrals, single indigo accent, semantic entity colors  
2. **Bug-fix-first phasing** — Phase 0 must complete before any redesign work  
3. **"Lamplit desk at night" visual identity** — mono time, timeline centerpiece, indigo pill = current  
4. **Workplace attention order** — Current Focus → Timeline now → Today's Tasks → Habits → Daily Note/Agenda  
5. **Accent budget rule introduced** — one entity, one accent per row  
6. **5-phase visual roadmap** — 0: bleeding → 1: primitives → 2: accent → 3: typography → 4: signature → 5: QA

---

# Scope

- Complete visual audit of dark theme  
- Token architecture review (`globals.css`, `components/ui/`)  
- Page-by-page assessment  
- Color direction options (3 evaluated)  
- Design system specification (surfaces, typography, spacing, elevation, states, motion)  
- Component guidelines for all major patterns  
- Accessibility baseline review  
- Phased implementation roadmap (~11–14 working days)

---

# Out of scope

- Code changes (audit only)  
- Light theme design  
- Feature/product roadmap (UX workflow — addressed later in friction review)  
- Backend or data model changes  
- Implementation of any recommended fixes

---

# Files affected

None — review only. Key files referenced:

- `flowos/src/app/globals.css`  
- `flowos/src/app/layout.tsx`  
- `flowos/src/components/ui/*`  
- Feature components across all modules

---

# Verification

Audit verified against 23 screenshots and codebase grep/read inspection. Font bug confirmed in CSS. Native controls confirmed in habit form, task dialog, quick capture, settings. Light leaks confirmed in kanban, focus history, plan toggle.

---

# Deferred work

All findings deferred to phased roadmap:

| Phase | Scope |
|-------|-------|
| 0 | Font, native controls, 2 light leaks, reduced-motion |
| 1 | SegmentedControl, Badge, Select, TimeField, group-dot |
| 2 | Accent budget sweep |
| 3 | Typography & density |
| 4 | Signature moments |
| 5 | QA & audit gates |

*Note: Phases 1–3 were subsequently restructured — see [CHANGELOG.md](./CHANGELOG.md).*

---

# Lessons learned

1. Strong token architecture can coexist with catastrophic wiring bugs — always verify computed styles, not just token definitions  
2. Adoption gaps (existing components not used) are cheaper to fix than building new primitives  
3. Visual "unfinished" feeling often traces to one P0 bug (serif font) rather than many small polish items  
4. Accent color competition is a discipline problem, not a palette problem

---

# Related documents

- [01-phase0-review.md](./01-phase0-review.md) — Phase 0 scope refinement  
- [01-phase0-spec.md](./01-phase0-spec.md) — Phase 0 engineering contract  
- [CHANGELOG.md](./CHANGELOG.md) — how audit roadmap evolved  
- [AUDIT_HISTORY.md](./AUDIT_HISTORY.md) — decision rationale  
- Source: `.cursor/projects/.../canvases/flowos-design-audit.canvas.tsx`
