# M2 — Global Navigation Architecture

**Scope:** M2 only — refactor global sidebar IA, icons, and user-facing “Timeline” → “Schedule” naming. Does **not** change page functionality, routes, or the internal Timeline component.  
**Authority:** Product decision recorded in [decision-log.md](../logs/decision-log.md) 2026-07-09 “Global navigation: Home + Workspace workflow”. Supersedes M2 Session 3’s “sidebar ≤ 5 / demote Schedule & Notes” IA for primary nav only. Does not add, remove, or weaken masterplan exit criteria.  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.

---

## 1. Product Understanding

**In plain terms:** FlowOS is a daily workflow — Capture → Plan → Execute → Reflect — not a flat list of independent apps. The sidebar must teach that loop while keeping every major workspace one click away from anywhere.

**Mental model**

| Layer | Role | Nav group |
|-------|------|-----------|
| **Dashboard** | Entry point and day overview | HOME → Today only |
| **Workspace** | Dedicated work surfaces | WORKSPACE → Tasks, Habits, Schedule, Focus, Notes, Reflection |
| **Review** | End-of-day close (Reflection) | Lives in Workspace for V1 (no third group yet) |

**Why this replaces the five-item sidebar:** Demoting Schedule and Notes forced users back through Today for planning and knowledge. That violated “every first-class feature is globally accessible.” Shortcuts on Today remain convenience only; the sidebar is the single source of truth.

**What does not change:** `/schedule` and `/notes` routes already exist. `TimelinePlanner` and related timeline-* internals stay named Timeline. Quick Schedule (Tasks drawer) is a different surface — do not rename it to Schedule.

---

## 2. Target navigation (source of truth)

```
HOME
  └── Today          (/)              LayoutDashboard

WORKSPACE
  ├── Tasks          (/tasks)         CheckSquare
  ├── Habits         (/habits)        Repeat
  ├── Schedule       (/schedule)      CalendarDays
  ├── Focus          (/focus)         Timer
  ├── Notes          (/notes)         BookOpen
  └── Reflection     (/reflection)    NotebookPen
```

**Order rationale:** Today → define work (Tasks, Habits) → plan (Schedule) → execute (Focus) → support (Notes) → close the day (Reflection).

**Icon rules (non-negotiable)**

| Item | Icon | Do not use |
|------|------|------------|
| Today | `LayoutDashboard` | `Home` (Today is a dashboard, not a homepage) |
| Schedule | `CalendarDays` | — |
| Notes | `BookOpen` | — |
| Reflection | `NotebookPen` | `Sparkles` (reserved for future AI) |

**Future scalability (do not build now):** keep `sidebarSections` as an ordered array of `{ label, items }` so a later section (Goals, Projects, Analytics, AI) is an append, not a redesign.

---

## Acceptance test

When Sessions 1–2 are complete on production: the left sidebar shows two labeled groups (Home, Workspace); Home contains only Today; Workspace lists Tasks → Habits → Schedule → Focus → Notes → Reflection with the icons above; Today’s header shortcut reads **Schedule** (with ↗) and still links to `/schedule`; Notes ↗ remains; no user-facing “Timeline” label for the Schedule page; users can open Schedule and Notes from any page without visiting Today. Build and lint pass. Page behavior is unchanged.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, next action. |
| 3 | **Git:** commit WIP on the session branch or `git stash`. Do **not** merge to `main`. |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — Session 2 requires Session 1 on `main` only if Session 1 already merged; otherwise both may ship as one merge bundle (see below). |

---

## Session dependency table

| Session | Depends on | Blocks |
|---------|------------|--------|
| 1 — Sidebar groups + icons | M1 ship gate; Today home on `/` | 2 (soft — same bundle OK) |
| 2 — Schedule rename + docs | Session 1 code (same branch OK) | — |

Sessions 1 and 2 are intentionally small and may ship as **one branch / one merge** if done in a single sitting. Split only if rename sweep needs a second pass.

---

## Session plan

**Budget:** 2 sessions × 1–2 hours (or one combined session ≈ 2–3 hours).  
**Engineering sessions:** 1–2.  
**Founder-only:** Visual sign-off after merge (no separate session).

### Git workflow (required)

| Step | Rule |
|------|------|
| **Start** | `git checkout main && git pull` → `git checkout -b m2/session-N-global-nav` |
| **During** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End** | `npm run build && npm run lint` → report merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → production check → [july-log.md](../logs/july-log.md) |

**Merge bundles**

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — Global nav | 1–2 | Both verified locally (or combined session done) |

Ad-hoc follow-ups: `tweak/nav-{description}` from `main`.

---

## Session 1 — Sidebar groups, items, and icons

**Type:** `engineering`  
**Goal:** Replace the flat Productivity list with Home + Workspace sections, add Schedule and Notes, apply final icons and order.  
**Time:** 1–2 hours  
**Prerequisites:** Today lives at `/`; `/schedule` and `/notes` routes exist (already true).  
**Maps to:** Global navigation product decision 2026-07-09  
**Merge bundle:** B1

### Current code reality

| Area | File / route | Behavior today |
|------|--------------|----------------|
| Nav config | `src/config/sidebar-navigation.tsx` | One section `"Productivity"`: Today, Tasks, Habits, Focus, Reflection. Today uses `LayoutTemplate`. No Schedule/Notes. |
| Sidebar render | `src/components/app-sidebar.tsx` (`SidebarNav`) | Already maps `sidebarSections` with section labels + spacing — **no structural change required** if config grows to two sections. |
| Schedule route | `src/app/(main)/schedule/page.tsx` | Exists; metadata title already `"Schedule"`. |
| Notes route | `src/app/(main)/notes/page.tsx` | Exists; in `PROTECTED_PREFIXES`. |
| Middleware | `src/middleware.ts` | `/schedule`, `/notes` already protected. |

### Numbered steps

| # | Step |
|---|------|
| 1 | In `sidebar-navigation.tsx`, replace `sidebarSections` with two sections: `"Home"` (Today → `/`, `LayoutDashboard`) and `"Workspace"` (Tasks, Habits, Schedule, Focus, Notes, Reflection) in the final order. |
| 2 | Import Lucide icons: `LayoutDashboard`, `CheckSquare`, `Repeat`, `CalendarDays`, `Timer`, `BookOpen`, `NotebookPen`. Remove unused icons (`LayoutTemplate` if unused). |
| 3 | Update the file comment — remove “five items per M2 IA”; document Home + Workspace workflow. |
| 4 | Smoke: collapsed and expanded sidebar — section labels hide when collapsed (existing behavior); tooltips still show item labels. |
| 5 | `npm run build && npm run lint` → commit → push branch → if Session 2 is deferred, ask merge approval; else continue on the same branch. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
git status -sb
```

**Manual checks**

| Check | Expected |
|-------|----------|
| Expanded sidebar | Two headings: HOME / WORKSPACE (casing matches existing uppercase section style) |
| Home | Only Today; `LayoutDashboard` icon |
| Workspace order | Tasks → Habits → Schedule → Focus → Notes → Reflection |
| Icons | CalendarDays (Schedule), BookOpen (Notes), NotebookPen (Reflection); no Sparkles, no Home |
| Deep link | From `/tasks`, click Schedule → `/schedule`; click Notes → `/notes` |
| Active state | Each href highlights correctly (existing `isNavItemActive`) |

**Stop/fail if**

- Flat single-section list remains.
- Schedule or Notes missing from sidebar.
- Wrong icons (Home / Sparkles / LayoutTemplate for Today).
- Build or lint fails.

**Rollback:** revert merge on `main` — never force-push `main`.

---

## Session 2 — Timeline → Schedule rename + inventory

**Type:** `engineering`  
**Goal:** User-facing “Timeline” that means the Schedule **page** becomes “Schedule”; Today shortcut updated; docs/inventory aligned. Internal Timeline components untouched.  
**Time:** 1 hour  
**Prerequisites:** Session 1 config in place (same branch OK).  
**Maps to:** Rename Timeline product decision 2026-07-09  
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Today shortcut | `src/components/today/today-status-rail.tsx` | Label `"Timeline"` → `href="/schedule"` (↗ via `TodayEscapeLink`) |
| Schedule page metadata | `src/app/(main)/schedule/page.tsx` | Already `title: "Schedule"` |
| Internal planner | `src/components/tasks/timeline-planner.tsx` | **Keep** name Timeline / Quick Schedule UI strings |
| Feature inventory | `docs/foundation/FEATURE_INVENTORY.md` | Stale: still describes eight-item Overview/Productivity IA and “sidebar ≤ 5” M2 target |

### Rename scope (do / do not)

| Do rename (user-facing Schedule page) | Do **not** rename |
|---------------------------------------|-------------------|
| Today shortcut label Timeline → Schedule | `TimelinePlanner`, `timeline-*.ts(x)`, `timeline-drag`, etc. |
| Nav label (Session 1) | “Quick Schedule” drawer on Tasks |
| Any breadcrumb / route label / help copy that calls the **page** “Timeline” | In-page headings that describe the **timeline grid** (e.g. “Today’s Timeline” summary inside Schedule) unless they clearly mean the page name |
| FEATURE_INVENTORY current + target nav | Fable prototypes under `src/components/fable5/` unless founder asks |

**Search before finishing Session 2** (repo-wide, then triage):

```powershell
rg -n "Timeline" src docs/foundation --glob "!**/timeline-*" --glob "!**/fable5/**"
```

Triage each hit: page/nav/shortcut → Schedule; component/grid/Quick Schedule → leave.

### Numbered steps

| # | Step |
|---|------|
| 1 | In `today-status-rail.tsx`, change shortcut children from `Timeline` to `Schedule` (↗ stays from `TodayEscapeLink`). Keep `href="/schedule"` and Notes shortcut. |
| 2 | Grep user-facing strings for Schedule-page “Timeline”; fix only page/nav/shortcut/breadcrumb/route-label hits. |
| 3 | Update `FEATURE_INVENTORY.md` **Information architecture**: Current navigation = Home + Workspace structure above; remove stale “eight equal items” / “sidebar ≤ 5 demote Schedule & Notes” as *current* truth. Note M2 Session 3 demotion as superseded by this runbook. Keep module role table accurate (Schedule and Notes are primary workspace nav again). |
| 4 | Optional: one-line cross-link in `m2-founder-daily-driver.md` Session 3 verification that primary-nav demotion was superseded — do not rewrite Session 3 history. |
| 5 | `npm run build && npm run lint` → commit → push → **ask founder to approve merge to `main`**. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
rg -n "Timeline" src/components/today src/config
```

**Manual checks**

| Check | Expected |
|-------|----------|
| Today header | `Schedule ↗` and `Notes ↗` (visual ↗ from icon) |
| Schedule page | Browser tab / metadata still Schedule; planner still works |
| Tasks Quick Schedule | Still labeled Quick Schedule |
| Sidebar | Unchanged from Session 1 |

**Stop/fail if**

- Today still says Timeline for the Schedule link.
- `TimelinePlanner` or timeline-* files renamed.
- Quick Schedule renamed to Schedule.
- Build or lint fails.

**Rollback:** revert merge on `main`.

---

## Manual test matrix

Run on production after B1 merges.

| # | Scenario | Action | Expected | Pass/Fail |
|---|----------|--------|----------|-----------|
| 1 | Groups | Open any page, expand sidebar | HOME + WORKSPACE headings | ☐ |
| 2 | Home singleton | Count Home items | Exactly Today | ☐ |
| 3 | Order | Read Workspace top→bottom | Tasks, Habits, Schedule, Focus, Notes, Reflection | ☐ |
| 4 | Global Schedule | From Focus, open Schedule via sidebar | Lands on `/schedule` without visiting Today | ☐ |
| 5 | Global Notes | From Habits, open Notes via sidebar | Lands on `/notes` | ☐ |
| 6 | Today shortcut | On Today, click Schedule ↗ | `/schedule` | ☐ |
| 7 | Notes shortcut | On Today, click Notes ↗ | `/notes` | ☐ |
| 8 | Icons | Visual check | LayoutDashboard / CalendarDays / BookOpen / NotebookPen; no Sparkles/Home | ☐ |
| 9 | Regression | Start focus, complete a task, open Quick Schedule on Tasks | Behavior unchanged | ☐ |
| 10 | Collapsed rail | Collapse sidebar | Icons only; hover tooltips show labels | ☐ |

**Gate:** All applicable rows PASS before treating the runbook complete.

---

## Decision points

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Reflection in Workspace vs separate Review group | (A) Workspace (B) Third “Review” section | **(A)** — matches founder spec; third group deferred until more review modules exist |
| 2 | Section label casing | (A) Keep existing CSS uppercase treatment of `"Home"` / `"Workspace"` (B) Title case only | **(A)** — match `app-sidebar` today |
| 3 | In-Schedule copy “Today’s Timeline” | (A) Leave (component name) (B) Rename to “Today’s Schedule” | **(A)** — Timeline is the grid; only page/nav rename in V1 |

---

## Out of scope

- Route renames or redirects (`/timeline` does not exist; keep `/schedule`)
- Renaming `TimelinePlanner` or timeline-* modules
- Renaming Quick Schedule
- Command palette / new modules (Goals, Projects, Analytics, AI)
- Visual polish beyond icons/labels/section structure
- Changing Today page layout, focus behavior, or Schedule planner features
- Demoting Focus page or merging Overview (separate IA track)

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| 1. Scope creep into timeline refactor | Large unrelated diff | Rename strings only; ban file renames for timeline-* |
| 2. Conflict with M2 “sidebar ≤ 5” docs | Agents re-demote Schedule/Notes | Decision-log + FEATURE_INVENTORY update in Session 2 |
| 3. Accidental Quick Schedule rename | Tasks UX confusion | Explicit do-not list in Session 2 |
| 4. Stale inventory confuses next sessions | Wrong nav assumptions | Session 2 step 3 required before merge |

---

## Code baseline / operational gotchas

1. **Config is the product surface** — almost all nav work is `sidebar-navigation.tsx`; `app-sidebar.tsx` already supports multiple sections.
2. **Routes already shipped** — adding Schedule/Notes to nav is config-only; do not recreate pages.
3. **Today shortcut ≠ nav** — `today-status-rail.tsx` is independent; updating sidebar does not update the shortcut label.
4. **M2 Session 3 history** — founder-daily-driver Session 3 intentionally demoted Schedule/Notes; this runbook **supersedes** that for primary nav. Do not “fix” Session 3 by re-demoting.
5. **Icon imports** — Lucide tree-shakes named imports; unused icons will fail lint if left behind.
6. **Reflection icon** — already `NotebookPen` in current config; keep it; do not introduce Sparkles.

---

## Explicitly deferred

| Item | When / trigger |
|------|----------------|
| Third nav group “Review” | More than one review module (e.g. Weekly Review promoted) |
| Future sections (Goals, Projects, Analytics, AI) | Product evidence + masterplan |
| Command palette as secondary nav | Masterplan / post-M2 |
| Renaming in-page “Timeline” grid copy | Only if users confuse grid with page name |
| Fable5 prototype nav parity | Prototype track, not production |

---

## M2 completion checklist (this runbook)

| # | Criterion | Done |
|---|-----------|------|
| N-1 | Sidebar has two groups: Home and Workspace | ☐ |
| N-2 | Today is the only Home item | ☐ |
| N-3 | Schedule and Notes in global Workspace nav | ☐ |
| N-4 | Final order: Today, Tasks, Habits, Schedule, Focus, Notes, Reflection | ☐ |
| N-5 | Icons match spec (incl. LayoutDashboard, CalendarDays, BookOpen, NotebookPen) | ☐ |
| N-6 | Reflection does not use Sparkles; Today does not use Home | ☐ |
| N-7 | Today shortcut label is Schedule (↗); Notes ↗ remains | ☐ |
| N-8 | User-facing Schedule page no longer called Timeline in nav/shortcuts | ☐ |
| N-9 | TimelinePlanner / Quick Schedule unchanged | ☐ |
| N-10 | FEATURE_INVENTORY current nav updated | ☐ |
| N-11 | Users reach every workspace from any page via sidebar | ☐ |

**Acceptance test:** Two-group workflow sidebar + Schedule naming + global access; functionality unchanged. ☐

---

## After runbook complete

1. Production smoke using the manual test matrix.  
2. [july-log.md](../logs/july-log.md) entry with branch/commits.  
3. Leave [m2-founder-daily-driver.md](./m2-founder-daily-driver.md) Session 3 historical text intact; inventory + decision-log carry the supersession.  
4. Do not rewrite this runbook after ship — append decision-log if IA changes again.

---

*End of runbook. Implementation starts only when a session branch is opened from `main`.*
