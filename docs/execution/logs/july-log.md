# July 2026 Log

**Purpose:** One narrative of what happened this month — sessions, undocumented moves, phases completed.  
**Not authority:** Structured decisions live in [decision-log.md](./decision-log.md). This is memory, not law.  
**Sources:** Inbox → runbook → this file → [review/SRAI](../../review/README.md).

**Next month:** add `august-log.md` beside this file (same format).

---

## How to use

After a runbook session (or doc pass) ships, add a dated block:

- What shipped (commits, production check)  
- Ideas that came from [inbox.md](./inbox.md)  
- Undocumented changes worth remembering  
- Decisions **promoted** to decision-log (link — don't duplicate full text)  
- Phases / milestones touched  

Low ceremony — bullets are fine.

---

## 2026-07-14 — Dark-only theme lock

**Shipped:**
- `main` `e165533` — remove light/system theme switching; Settings Appearance shows Dark only; force `.dark` on `<html>`

**Production:** https://flowos-sage.vercel.app — confirm Settings → Appearance and that surfaces stay dark after deploy.

---

## 2026-07-14 — Today Sunsama-style top bar + timeline rail polish

**Shipped:**
- Branch `tweak/today-sunsama-top-bar` merged to `main` (`2449230`)
- Lean Today status rail (date · on track · Tasks/Habits/Focus); remove Now slot, density picker, Schedule/Notes escape links
- Live focus-time truth for rail + Focus card; quiet demotion while focusing
- Right rail: collapsed strip always in layout on Today; expand overlays
- Timeline spacing vs scrollbar/right nav; opaque selected block fill shared across Today / Quick Schedule / Schedule
- Fix Today/Tasks `-mr-10` overflow under right nav (no horizontal scroll)

**Production:** https://flowos-sage.vercel.app — smoke Today top bar, timeline zoom chips, Quick Schedule vs right rail.

---

## 2026-07-13 — Visual Design System v3.0 migration (Sessions 1–4)

**Shipped:**
- Branches `m2/session-1-v3-phases-1-3` → `m2/session-2-v3-phases-4-5` → `m2/session-3-v3-phases-6-8` → `m2/session-4-v3-phases-9-11` merged to `main` (`cd647ba`)
- Phases 1–11: tokens/primitives/shell, domain appearance, Focus/Timeline/Notes/Reflection, Today/overlays polish
- Follow-ups on Session 4: shared Kanban/Tasks insert line, Schedule timeline parity with Quick Schedule/Today (group accents, selection, overlap cascade), Quick Schedule drawer depth without blocking board drag

**Build/lint:** pass on `main` after merge.

**Production:** https://flowos-sage.vercel.app — smoke Today, Tasks + Quick Schedule, Schedule, Notes Kanban after deploy.

**Decision:** [decision-log.md](./decision-log.md) — Visual Design System v3.0 (2026-07-13)

---

## 2026-07-13 — Next Up V2 + Visual Design System v3.0

**Shipped:**
- Branch `tweak/recover-next-up-queue-ship` → `main` (`0e524b0`, merge)
- Next Up V2: persistent task-only queue on `tasks.queue_order`; Focus card preview + drawer; intentional Start focus vs Add to Next Up; per-task active-session focus totals
- SQL: `supabase/tasks_next_up_queue.sql`, `supabase/focus_session_task_totals.sql` (apply on production if not already)
- Living design: [next-up.md](../../design/focus/next-up.md); historical runbook/spec retained
- [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) v3.0 + [design-system-v3-migration.md](../runbooks/design-system-v3-migration.md) (already on `main` earlier today)

**Build/lint:** pass on ship branch (0 errors; existing warnings only).

**Production:** https://flowos-sage.vercel.app — verify Focus Next Up after deploy; confirm SQL applied.

**Decision:** [decision-log.md](./decision-log.md) — Next Up V2 (2026-07-10) · Visual Design System v3.0 (2026-07-13)

---

## 2026-07-10 — Global nav B1 (Home + Workspace)

**Shipped:**
- Branch `m2/session-1-global-nav` → `main` (`eb4114e`, `dc922d7`, merge)
- Sidebar: HOME (Today) + WORKSPACE (Tasks → Habits → Schedule → Focus → Notes → Reflection)
- Icons: LayoutDashboard / CalendarDays / BookOpen / NotebookPen (no Sparkles/Home)
- Today shortcut: Timeline → Schedule ↗; Notes ↗ unchanged
- Reflection icon parity: left nav, right rail, Today quick-add
- FEATURE_INVENTORY IA updated; founder-daily-driver Session 3 demotion marked superseded
- Unmerged branch queue doc added (P2+ = Today V3 Phase C)

**Build/lint:** pass on branch and on `main` after merge.

**Production:** https://flowos-sage.vercel.app — smoke runbook matrix (groups, Schedule/Notes from any page, Today shortcuts).

**Decision:** [decision-log.md](./decision-log.md) — Global navigation: Home + Workspace workflow (2026-07-09)

**Runbook:** [m2-global-navigation.md](../runbooks/m2-global-navigation.md) B1 complete.

---

## 2026-07-10 — Kanban cards on `--card`; shared soft board borders

**Shipped:**
- Branch `tweak/kanban-cards-standard-card` → `main`
- Kanban list cards: `--card` + soft `border/30` (deploy-like elevation on `--surface-board` well)
- Tasks group + Kanban list borders aligned: outer `border-board/55`, header `/45`
- Tasks board rows unchanged

**Build/lint:** pass on branch before merge.

**Production:** https://flowos-sage.vercel.app — spot-check Reflection/Notes Kanban + Tasks groups.

**Documented:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) Layer 2 board chrome table.

**Decision:** [decision-log.md](./decision-log.md) — Kanban cards + shared soft board borders

---

## 2026-07-10 — Visual polish: surfaces, padding, workspace chrome

**Shipped:**
- Branch `tweak/tasks-group-surface-lift` → `main` (`435f0ee`, merge `554c56b`)
- Board/kanban surface lift, 40px page padding (Tasks full-bleed + header inset only)
- Right rail + Quick Schedule header/Unscheduled panel at 85/15 canvas→card mix
- Reflection drawer flat sections; Notes drawer polish; selection/kanban tweaks

**Build/lint:** pass on `main` before push.

**Production:** https://flowos-sage.vercel.app — spot-check Tasks, Today, Quick Schedule, right drawer.

---

## 2026-07-10 — Visual baseline reset to VDS Sessions 1–5

**Shipped:**
- `main` hard-reset to `33928bb` (drawer + Session 5 chrome; Today Focus tabs intact)
- DESIGN_SYSTEM Layer 0–5 freeze; Sessions 1–5 Today + navigation = source for future UI
- Sessions 6–14 product work discarded from `main`; related branches removed

**Decision:** [decision-log.md](./decision-log.md) — Layer 0–5 freeze; Sessions 1–5 visual baseline

**Production:** Redeploy from reset `main` — spot-check Today Focus + left/right chrome.

---

## 2026-07-04 — M2 Session 1 + docs reorganization

**Shipped (product):**
- Today home at `/`; `/workplace` redirects (commit `aa29917`)
- M2 runbook created — inbox ideas formalized as Sessions 1–6 + operational gotchas

**Shipped (docs):**
- Passes 1–5: execution/strategy/archive structure; governance 11→4; foundation 6→3
- `docs/review/` SRAI layer; milestone reviews m0/m1 complete, m2 in progress
- Commit `733aac3`

**From inbox → runbook (examples):**
- Dashboard at `/` vs execution at `/workplace` → Session 1 / WP-2.1
- Next-action routes away from Today → Session 2 / WP-2.2
- Eight-item sidebar → Session 3 / WP-2.3
- Hover-gated focus controls → Session 4 / WP-2.4
- Modal-only capture → Session 5 / WP-2.5

**Undocumented until this entry:**
- Bulk link fixes across 70+ markdown files during doc passes
- Design archive moved under `archive/design/july-3/`

**Decisions promoted:** → [decision-log.md](./decision-log.md) (M0 custody, docs in git, Pass 4 governance, Pass 5 foundation, review layer)

**Milestones:** M1 complete; M2 engineering Sessions 1–6 shipped; Sessions 7–8 open

---

## 2026-07-04 — Inbox + july-log added

**Why:** Founder needed scratch capture for random UI/UX fixes without opening a new doc; pipeline inbox → runbook → july-log → review.

**Files:** [inbox.md](./inbox.md), this log, wired into founder daily loop.

---

## 2026-07-09 — Remove Today's note; tall Focus

**Shipped (product):**
- Removed Workplace daily-note card from Today grid
- Focus card `row-span-2` fills the right column; Habits stays bottom-left
- Daily notes via Notes sidebar / `Ctrl+Shift+D` only

**Branch / merge:** `tweak/remove-workplace-daily-note` → `main`

**Build/lint:** Pass on merge.

**Decisions promoted:** → [decision-log.md](./decision-log.md) § 2026-07-09

**Milestones:** UI tweak; not a runbook session bundle

---

## 2026-07-08 — Surface hierarchy (Sessions 1–5)

**Runbook:** [m2-surface-hierarchy.md](../runbooks/m2-surface-hierarchy.md) — **merged to `main`** (`d9fed0b`).

**Shipped (product):**
- Four-level dark surface stack: `--background`, `--surface`, `--card`, `--surface-hover` in `globals.css`
- Right sidebar chrome matches left rail (no card elevation / shadow on rails)
- Continuous workspace: mobile header whisper divider, unified shell background, timeline seam cleanup
- High-traffic audit: workplace panels, schedule grid, dialog backdrop, removed card gloss gradients
- Theme helpers (`tokens.ts`, `surface-classes.ts`) aligned to design system

**Shipped (docs):**
- [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) — authoritative visual spec
- Decision-log entry 2026-07-08 surface hierarchy

**Build/lint/test:** Pass on branch before merge.

**Production:** https://flowos-sage.vercel.app — deploy pending Vercel; manual visual check recommended (Today `/`, right panel open, Schedule Break modal).

**Decisions promoted:** → [decision-log.md](./decision-log.md) (2026-07-08 four-level surface hierarchy)

**Milestones:** M2 visual polish; does not close M2 exit criteria by itself

---

<!-- Append new dated blocks above this line (newest first) -->

## 2026-07-05 — M2 Today UX Polish (Sessions 1–4)

**Runbook:** [m2-today-ux-polish.md](../runbooks/m2-today-ux-polish.md) — **B1–B4 merged to `main`** (`9685c02`).

**Shipped (product):**

| Bundle | Summary | Merge / tip |
|--------|---------|-------------|
| B1 | Tasks scroll chain; habit Start now guard; global context-menu bus; Enter refocus | `main` `c717428` |
| B2 | Slim timeline task menu; details complete toggle; reflection sidebar link to `/reflection` | `main` `b182f40` |
| B3 | Icon-only quick-add (BookOpen/Sparkles); daily note copy + `Ctrl+Shift+D`; optimistic Enter queue (no disabled input) | `main` `783f26a` |
| B4 | Compact `today-status-rail`; density Full/Work/Focus (`workplace-density.ts`); Full merges inline KPI + smart Next Action in rail; left-nav icons on 4 cards; ListPlus quick capture | `main` `9685c02` |

**Follow-up tweaks (same B4 branch):** task details title row + checkbox (`a7c72c9` on main via B3); card header icons; `today-rail-stats-row.tsx`.

**Build/lint:** Pass on each session branch.

**Production:** https://flowos-sage.vercel.app — B1–B4 deployed; **manual test matrix PASS** (founder sign-off 2026-07-05). Runbook **complete**.

**From inbox → runbook:** 2026-07-05 capture (Today chrome, menus, quick-add, P0 bugs) — see [inbox.md](./inbox.md) Done table.

**Decisions promoted:** → [decision-log.md](./decision-log.md) (next-action hidden by default; Full density smart coach; rail-merged chrome).

**Milestones:** M2 dogfood quality pass; does not close M2 exit — continue Sessions 7–8 per founder daily driver.

---
