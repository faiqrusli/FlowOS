# FlowOS Audit History — Design Decision Rationale

This document records **why** major design decisions were made, not just what was decided. Each entry includes context, alternatives considered, and outcome.

---

## Critical bug decisions

### Why the serif font bug mattered

**Context:** Every screenshot in the design audit showed serif type (Times/Georgia fallback) across nav, titles, buttons, and dialogs.

**Root cause:** `layout.tsx` loads Geist as `--font-geist-sans`, but `globals.css` defined `--font-sans: var(--font-sans)` — a circular reference resolving to nothing.

**Why it mattered more than color work:** Typography is the highest-frequency visual element. A serif fallback on a modern productivity app signals "broken" or "unfinished" before users evaluate any interaction. The audit estimated this single bug caused more "unfinished dashboard" feeling than all color decisions combined.

**Decision:** Fix in Phase 0 Task 1 — CSS token indirection only, do not touch `layout.tsx`.

**Rejected:** Treating it as aesthetic preference; waiting until a typography phase; renaming font variables in layout.

---

### Why native controls were Phase 0, not Phase 1

**Context:** `<select>` and `<input type="time">` rendered light-theme browser popups in dark mode (Quick Capture group picker, Add Habit time, Settings duration selects).

**Why Phase 0:** These are trust-breaking immersion breaks — users see a foreign OS UI mid-flow. Components to replace them already existed (`ScheduleTimePickerField`, `TaskPrioritySelect`, `DropdownMenu`).

**Decision:** Adoption-gap fixes in Phase 0, not new primitive development.

**Rejected:** Building a reusable Select primitive first (would delay the fix and expand scope).

---

## Phase scoping decisions

### Why Phase 0 was intentionally tiny

**Context:** Original audit had 10 ranked findings spanning P0–P2. Temptation to bundle fixes.

**Decision:** Phase 0 = exactly 5 tasks: fonts, 4 native controls, 2 selected states, reduced-motion, inventory. ~0.5 day.

**Rationale:** Smallest phase with biggest visual ROI and least implementation risk. Creates stable baseline for evidence-based Phase 1 re-review.

**Rejected:** Fixing all 10+ inverted instances in Phase 0; any layout or spacing changes; color palette changes beyond light-leak fixes.

---

### Why SegmentedControl primitive was postponed

**Context:** Audit identified 4 different segmented-control styles across Workplace tabs, Schedule toolbar, Quick Capture Plan toggle, and timeline planner.

**Original plan:** Build `SegmentedControl` primitive in Phase 1 + migrate 4 instances.

**Phase 1 re-review finding:** With Geist fixed, the Quick Capture Plan toggle was the most divergent and highest-traffic. A full primitive extraction risked keyboard behavior regressions across 4 surfaces for marginal gain.

**Decision:** Option A — inline restyle of Quick Capture Plan toggle using Workplace Focus/Pomodoro recipe. Primitive deferred indefinitely until copy-paste pain threshold (3+ instances actively diverging).

**Rejected:** Shipping SegmentedControl primitive in Phase 1; migrating all 4 instances simultaneously.

**Current state:** `panel-toggle-styles.ts` holds shared recipes; no extracted React primitive.

---

### Why Select primitive was postponed

**Context:** Audit proposed consolidating 3+ select implementations into one primitive.

**Phase 0 reality:** Phase 0 added 2 more local `DropdownMenu`-based selects (Settings, Quick Capture). All three are keyboard-accessible and visually consistent via shared DropdownMenu primitive.

**Decision:** Postpone Select consolidation to Phase 4+ (or never — if DropdownMenu pattern remains stable).

**Rationale:** Consolidation carries regression risk without visual benefit. The problem was native `<select>` (fixed in Phase 0), not multiple custom implementations.

**Rejected:** Building `@/components/ui/select.tsx` wrapper in Phase 1.

---

### Why Badge primitive merged into Phase 2

**Context:** Original Phase 1 included Badge + chip migration. Phase 1 re-review moved it to Phase 2.

**Rationale:** Badge/chip work is a coordinated accent sweep — changing chip appearance without fixing habit row fills, focus dots, and group pills would leave the product in a half-migrated state. Phase 2's central-lib refactor made Badge migration safe and atomic.

**Decision:** Extend existing `badge.tsx` with entity/status variants in Phase 2 Task 2. No separate Chip primitive.

**Rejected:** Separate Chip primitive; migrating chips in Phase 1 without accent rule enforcement.

---

### Why accent budget became Phase 2 (not Phase 1)

**Context:** Audit P1 finding — orange HABIT chips, violet FOCUS chips, emoji group pills, colored flags all compete on one row.

**Phase 1 priority:** Interaction grammar (inverted pills) was louder than color after Geist fix.

**Phase 2 strategic review:** 542 hardcoded palette references confirmed accent chaos was the #1 remaining visual defect. Typography under-application was #4 — less urgent than color discipline.

**Decision:** Phase 2 = accent language + chip consolidation as one coordinated 12-task contract.

**Rejected:** Typography-first Phase 2; page-by-page color tweaks without central lib refactor.

**Accent rule frozen:** One entity, one accent — max 2 non-neutral colors per row/card/chip cluster. Indigo dominant.

---

## Product architecture decisions

### Why Dashboard remained (but was demoted in Phase 3 plan)

**Context:** UX friction review identified Dashboard as a "mandatory detour" — read-only intelligence while execution lives on Workplace.

**Decision (Phase 3 plan):** Merge Dashboard intelligence into Today/Workplace as default home. Dashboard becomes optional `/overview` — not deleted.

**Rationale:** Dashboard KPIs and next-action computation have value. The problem is routing and default landing, not the module's existence. Deleting would lose summary/analytics surface.

**Rejected:** Removing Dashboard entirely; keeping `/` as Dashboard landing.

---

### Why Workplace became the execution center

**Context:** FlowOS splits intelligence (Dashboard), execution (Workplace), analytics (Focus), and organization (Tasks). Daily users learn Workplace is where work happens but the app still opens elsewhere.

**Evidence:** Focus timer runs on Workplace but Dashboard next-action links to `/focus`. Scheduled items link to list pages, not entities. Three scheduling surfaces (Tasks drawer, Schedule page, Workplace embed) create decision fatigue.

**Decision (Phase 3.1):** Today/Workplace (`/`) as gravitational center with inline intelligence.

**Rationale:** Execution is the highest-frequency daily action. Intelligence should be ambient on the execution surface, not a separate page load away.

**Rejected:** Making Tasks board the home (Workplace already combines timer + timeline + tasks); adding a 9th "Today mode" nav item without merging surfaces.

---

### Why certain roadmap items moved

| Item | Original placement | Moved to | Reason |
|------|-------------------|----------|--------|
| Typography scale rollout | Audit Phase 3 | Phase 4 (visual) / Phase 3 (UX) | UX friction review superseded visual Phase 3 |
| Badge/chip migration | Audit Phase 1 | Phase 2 | Requires coordinated accent sweep |
| Group-dot identity | Audit Phase 1 | Phase 2 | Same — tied to accent language |
| SegmentedControl | Audit Phase 1 | Deferred | Option A inline fix sufficient |
| Select primitive | Audit Phase 1 | Phase 4+ | Working DropdownMenu pattern |
| TimeField primitive | Audit Phase 1 | Removed | Already exists; tokenize only |
| Goals / AI Coach | Various placeholders | Phase 4+ | UX review: not daily-loop critical |
| Command palette | Not in audit | Phase 3.2 | Friction review: table stakes for 2026 |

---

## Implementation decisions

### Why inverted `bg-foreground text-background` was remediated

**Context:** Near-black pills with white text used for selected/active states — reads as inverted primary buttons, not selection.

**Phase 0:** Fixed 2 worst instances (Notes kanban tab, Focus reflection history) — highest-trust light leaks.

**Phase 1:** Fixed 4 live instances + timeline zoom. Used surface-scale tokens (`flow-selected`, secondary button, popover surface, card elevation).

**Rejected:** Global find-replace of all 10+ instances in one pass (risk of breaking intentional primary CTAs).

---

### Why Phase 2 left notes/reflection/settings untouched

**Context:** Phase 2 contract explicitly excluded `notes/**`, `reflection/**`, `settings/**`.

**Rationale:** Scope control. Notes has growth-area color identity; reflection has its own accordion grammar. Migrating these without dedicated review risked breaking functional UX. Accent rules apply where daily execution happens (Tasks, Workplace, Schedule, Dashboard).

**Deferred:** Notes growth-area colors, kanban drop indicators, reflection structure.

---

### Why task-row high priority kept flag-only (post-release patch)

**Context:** Phase 2 release review noted `task-row.tsx` completion glyph still used hardcoded palette.

**Decision:** No change — contract explicitly allows flag-only treatment for high-priority rows.

**Rationale:** Changing row completion glyph risked altering task completion UX grammar. Priority edge/flag was the approved accent channel; row body stays neutral.

---

## Color direction decisions

### Why Midnight Focus was chosen

**Options evaluated in audit:**

| Option | Verdict |
|--------|---------|
| A · Midnight Focus | **Recommended** — refined navy-indigo, one indigo accent, amber=habits, violet=focus |
| B · Graphite Professional | Rejected — no differentiation from generic dark dashboards |
| C · Aurora Premium | Rejected except subtle `.flow-workspace` bloom idea |

**Rationale:** Midnight Focus aligns with "lamplit desk at night" identity. Single indigo accent creates premium restraint. Entity types get semantic accents (warning for habits, accent-text for focus) without rainbow competition.

---

## Process decisions

### Why the contract model was adopted

**Pattern:** Review → approve → spec (frozen) → implement (exact) → post-review → optional patch.

**Origin:** Phase 0 review caught overscoped tasks before implementation. Phase 1 re-review rejected 3 of 5 original tasks. Phase 2 strategic review refined scope before 12-task contract.

**Rationale:** AI-assisted implementation drifts toward "improvements." Explicit freezes and self-reviews prevent scope creep and preserve audit trail.

**Rejected:** Implement directly from audit without review gates; allowing post-hoc spec changes during implementation.

---

## Related documents

- [CHANGELOG.md](./CHANGELOG.md) — timeline of changes  
- [00-design-audit.md](./00-design-audit.md) — original findings  
- [02-phase1-review.md](./02-phase1-review.md) — Phase 1 task kill/move decisions  
- [03-phase2-strategic-review.md](./03-phase2-strategic-review.md) — Phase 2 scope defense  
- [ux-friction-review.md](./ux-friction-review.md) — Phase 3 architectural rationale  
