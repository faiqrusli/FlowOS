# FlowOS — Project State

> **Status: Superseded (July 4, 2026)** — Frozen at end of Phase 2. For current product state use [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md), [execution/README.md](../../execution/README.md), and [supabase/APPLIED_STATE.md](../../../supabase/APPLIED_STATE.md). For engineering setup, see [start-here/engineer.md](../../start-here/engineer.md).

**As of:** July 3, 2026 (end of Phase 2)  
**Audience:** New engineers — read this first (~5 minutes)

> **Original academic vision:** [../project/01-introduction.md](../project/01-introduction.md) and [../project/02-related-works.md](../project/02-related-works.md) describe the thesis foundations (SRL, GTD, focus theory). [../project/03-future-enhancements.md](../project/03-future-enhancements.md) lists SRS items FE-1–FE-13 with 2026 status.

---

## Current completed phases

| Phase | Name | Commit | Score (end state) |
|-------|------|--------|-------------------|
| Audit | Design Audit | — | 5.5 / 10 overall |
| 0 | Foundation & Critical Visual Bug Fixes | `5fc780a` | Professional baseline |
| 1 | Interaction & Control Consistency | `04fe227` | 7.0 / 10 (strategic review) |
| 2 | Accent Language & Chip Consolidation | `9f7e7c4` | 7.8 / 10 (release review) |

**Next:** Phase 3 — Effortless Daily Loop (UX workflow, not visual redesign)

---

## Current design language

### Visual identity: "Lamplit desk at night"

- **Palette:** Midnight Focus — refined navy-indigo neutrals (OKLCH hue ~258–264), one indigo accent for primary actions, selection, and focus rings  
- **Entity accents:** Habits use warning-edge semantics on neutral surfaces; Focus uses accent-text dots (not violet pills); Groups use 8px chart-color dots; High priority uses destructive edge/flag only  
- **Surfaces:** Layered ladder — app → sidebar → page → timeline → card → elevated → popover → dialog  
- **Typography:** Geist Sans (body), Geist Mono (timers). Token scale exists in `lib/typography.ts` but is under-applied (Phase 3+ work)  
- **Selection:** `flow-selected` token — never `bg-foreground text-background` inverted pills  
- **Motion:** Global `prefers-reduced-motion` guard in `globals.css`

### Accent budget rule (Phase 2)

**One entity, one accent — max 2 non-neutral colors per row/card/chip cluster.** Indigo is dominant; entity types are distinguished by dots, edges, and flags — not rainbow fills.

---

## Current architecture

### Application stack

- **Framework:** Next.js App Router (`flowos/`)  
- **Styling:** Tailwind v4 + OKLCH CSS variables in `src/app/globals.css`  
- **Components:** shadcn-style primitives in `src/components/ui/`  
- **Backend:** Supabase  

### Module map (shipped in nav)

> **Code truth (July 2026):** `/` = Dashboard; `/workplace` = execution surface. Phase 3.1 will merge Dashboard into Today. Target `/overview` route does not exist yet.

| Route | Module | Role |
|-------|--------|------|
| `/` | Dashboard | Default landing — read-only KPIs, next action (Phase 3: demote) |
| `/workplace` | Workplace / Today | Primary execution — timer, timeline, tasks, habits |
| `/schedule` | Schedule | Fullscreen timeline planner |
| `/tasks` | Tasks | Board + quick schedule drawer |
| `/habits` | Habits | Habit tracking |
| `/focus` | Focus | Analytics & session history |
| `/reflection` | Reflection | Daily/weekly reflection |
| `/notes` | Notes | Notes + kanban |

### Central design libs (Phase 2)

- `lib/task-group-appearance.ts` — group color dots  
- `lib/schedule-palette.ts` — schedule channel colors  
- `lib/timeline-habit-appearance.ts` — habit row styling  
- `lib/task-priority.ts` — priority semantics  
- `lib/panel-toggle-styles.ts` — segmented toggle recipes  
- `lib/workplace-group-accent.ts` — workplace accents  
- `components/ui/badge.tsx` — unified entity/status variants  

### Drag-and-drop

Custom pointer-based drag on Tasks board. dnd-kit foundation installed (`lib/dnd/`) with passive DndContext — migration in progress, separate from design phases.

---

## Current UX philosophy

**Design system (Phases 0–2):** Fix bugs first, then interaction consistency, then accent language. No layout redesigns during foundation work.

**Product direction (Phase 3+):** FlowOS should feel like **one continuous day**, not eight disconnected modules. Success metric: **open app → doing the right thing in under 5 seconds**. Intelligence should live where execution happens (Today/Workplace), not on a read-only detour (Dashboard).

Key UX diagnosis from [ux-friction-review.md](./ux-friction-review.md): no single gravitational center; next-action routing sends users to wrong modules; three scheduling surfaces; no command palette; hover-gated critical controls.

---

## Current roadmap

See [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md) for full detail.

| Phase | Focus | Status |
|-------|-------|--------|
| 3 | Effortless Daily Loop — gravitational center, command layer, focus friction, planning simplification, day arc, keyboard OS | **Next** |
| 4 | Signature moments — Focus hero, now-line, heatmap legend, empty states | Planned |
| 5 | QA & audit gates — contrast, keyboard, screenshot diff | Planned |

Deferred from original audit: typography scale application (Phase 3), SegmentedControl primitive extraction, Select primitive consolidation, light theme, Goals/AI Coach modules.

---

## Deferred work

### From Phase 0 inventory (partially addressed in later phases)

- Remaining `bg-foreground text-background` instances beyond the two Phase 0 fixes  
- Timeline planner segmented toggles, panel-toggle sky accents  
- Notes growth-area colors, kanban drop indicators  
- Task group swatch grid oversized selection ring  

### Explicitly postponed

| Item | Target | Reason |
|------|--------|--------|
| SegmentedControl primitive | Phase 4+ or when 3+ copy-pastes hurt | Phase 1 used inline restyle (Option A) |
| Select primitive consolidation | Phase 4+ | Three working dropdown-selects; regression risk |
| Typography scale rollout | Phase 3 | Under-applied across pages |
| Dashboard surface recipes | Phase 3+ | Mixed card radii and surface recipes remain |
| Hover-only row actions | Phase 3+ | Accessibility and discoverability |
| Light theme | Not scheduled | Dark-first product |
| Goals / AI Coach / Weekly Review placeholders | Phase 4+ | UX friction review deprioritized |

---

## Known technical debt

- **542 hardcoded palette references** remaining after Phase 2 (per strategic review baseline)  
- **dnd-kit dual system** — passive context + legacy pointer drag coexist  
- **`timeline-planner.tsx` size** — large monolith, duplicate styling with schedule  
- **Duplicate context menus** across task surfaces  
- **setState-in-effect lint** in dialog components (pre-existing)  
- **Three card border radii** in production  
- **Schedule vs Workplace color drift** on adjacent surfaces  

---

## Known UX debt

Ranked by daily productivity impact (see friction review):

1. No single execution home — Dashboard vs Workplace split  
2. Next action routes to wrong module  
3. No command palette / global search  
4. Three scheduling surfaces with no clear default  
5. Planning model overload (group vs Today vs Later vs date)  
6. Eight sidebar modules — constant context switching  
7. Modal quick capture (tasks only)  
8. Hover-gated timer controls and quick-add  
9. Multi-step focus start  
10. Keyboard workflow nearly absent  

---

## Current source of truth

| Domain | Source of truth |
|--------|-----------------|
| Design history | `docs/design/` (this directory) |
| Phase 3 UX strategy | `docs/design/ux-friction-review.md` + `roadmap-pre-masterplan.md` |
| Visual tokens | `flowos/src/app/globals.css` |
| Accent rules | Phase 2 contract → central libs listed above |
| Component primitives | `flowos/src/components/ui/` |
| Navigation | `flowos/src/config/sidebar-navigation.tsx` |

**Not authoritative:** Cursor Canvas files, `.cursor/plans/` files, agent chat transcripts.

---

## Current implementation status

- **Design system foundation:** Complete through Phase 2  
- **Application features:** MVP v1 shipped — all core modules functional  
- **Phase 3:** Not started — UX friction review complete, roadmap written  
- **Git:** `main` at `9f7e7c4`, 4 commits ahead of origin (unpushed at documentation time)

---

## Current next phase

**Phase 3.1 — Gravitational Center** (recommended first ship bundle):

1. Merge Dashboard intelligence into Today/Workplace as default home  
2. Fix next-action deep links and focus routing  
3. Inline capture bar on Today  
4. Always-visible focus controls when session active  
5. Remove or wire fake Agenda card  
6. Command palette v1 (search + jump)

Full Phase 3 breakdown: [roadmap-pre-masterplan.md](./roadmap-pre-masterplan.md) and [ux-friction-review.md](./ux-friction-review.md).
