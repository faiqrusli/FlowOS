# M1 Ship Gate Runbook

**Scope:** M0 (Custody) + M1 (Deployed & Secure) only.  
**Authority:** Exit criteria in `FLOWOS_EXECUTION_MASTERPLAN.md` Step 2 (M0 + M1). This runbook does not add criteria.  
**Repo root for all commands:** `flowos/` (the git repository).  
**Platform note:** Founder environment is Windows 10 — CRLF/line-ending noise is expected in M0 git steps.

---

## Acceptance test

**Fresh clone → follow this runbook → live URL → two-account RLS pass.**

A senior engineer with no prior FlowOS context should be able to:

1. Clone `https://github.com/faiqrusli/flowos.git` (after M0 push).
2. Execute Sessions 1–8 in order.
3. Reach a Vercel-hosted URL, log in as the founder.
4. Confirm account A cannot read or write account B's tasks, habits, focus sessions, reflections, or habit completions on that hosted Supabase project.

When all M0 + M1 exit criteria pass, Ship Gate is complete.

---

## Session plan

### Session 1 — Repository custody & docs in VCS

**Goal:** `origin/main` is current; `docs/` is tracked; working tree committed deliberately; CRLF normalized.  
**Time:** 2–3 hours  
**Prerequisites:** GitHub access to `faiqrusli/flowos`; local clone at `c:\Users\faiqr\FlowOS\flowos`.

| # | Step |
|---|------|
| 1 | `cd flowos` — confirm branch: `git status -sb` should show `## main...origin/main [ahead 4]` (4 unpushed commits as of runbook authoring). |
| 2 | **Docs approach (decided):** Copy parent `docs/` tree into the repo as `flowos/docs/` (see Decision points). From workspace root: `Copy-Item -Recurse -Force ..\docs .\docs` (PowerShell). Do **not** relocate the git root — Vercel and GitHub already expect the Next.js app at repo root. |
| 3 | Record the decision in `docs/foundation/DECISION_LOG.md` (one entry: docs live at `flowos/docs/`). |
| 4 | Add `.gitattributes` at repo root (`flowos/.gitattributes`): |
|   | ```gitattributes |
|   | * text=auto eol=lf |
|   | *.ts text eol=lf |
|   | *.tsx text eol=lf |
|   | *.sql text eol=lf |
|   | *.md text eol=lf |
|   | *.json text eol=lf |
|   | *.yml text eol=lf |
|   | ``` |
| 5 | Normalize line endings: `git add --renormalize .` then inspect: `git diff --stat`. Expect most of the 22 modified files to collapse to zero substantive diff. |
| 6 | **Substantive working-tree diff:** `git diff src/contexts/global-right-sidebar-context.tsx` — one line adds `/` to hover-sidebar mode (Phase 3.1 fragment). Per founder decision (Session 1 Decision point #3): **revert** for M1 (`git checkout -- src/contexts/global-right-sidebar-context.tsx`) unless explicitly kept. M1 forbids UX changes. |
| 7 | Review remaining modified files. If `git diff <file>` is empty (CRLF only), stage as-is. If other Phase 3 diffs appear, revert or commit consciously with a decision-log line — do not silently ship feature work. |
| 8 | Stage docs + `.gitattributes` + any intentional code state: `git add docs .gitattributes` (+ other staged files as decided). |
| 9 | Commit: `git commit -m "M0: track docs in VCS, normalize line endings, close working tree"`. |
| 10 | Push: `git push origin main`. |

**Verification**

```powershell
git status -sb          # clean, not ahead of origin/main
git ls-files docs       # lists tracked files under docs/
git log origin/main -1  # shows custody commit
```

**Stop/fail if**

- Push rejected (fix auth/remote first; do not proceed to M1).
- `docs/` not listed by `git ls-files docs`.
- Working tree still has unstaged substantive diffs you did not consciously decide on.

**Rollback:** `git reset --soft HEAD~1` before push; fix and recommit. After push, revert via new commit (no force-push to main).

**Maps to:** WP-0.1 + M0 exit criteria #1, #2

---

### Session 2 — Dead code removal & FlowOS-old archive

**Goal:** Build-breaking stub and dead code removed; legacy repo archived.  
**Time:** 2 hours  
**Prerequisites:** Session 1 complete; clean `git status`.

| # | Step |
|---|------|
| 1 | Delete dead code (none are imported elsewhere): |
|   | - `src/components/workplace/workplace-agenda-card.tsx` |
|   | - `src/lib/reflections-mock-store.ts` |
|   | - `src/lib/reflections-mock-data.ts` |
|   | - `src/components/workplace/workplace-recover-day-bar.tsx` (untracked; imports missing `addMinutesToTime` from `date-utils.ts` — **verified build failure**) |
| 2 | Confirm no imports remain: `git grep -i "WorkplaceAgendaCard\|reflections-mock\|RecoverDayBar" src` → no matches. |
| 3 | **FlowOS-old archive:** At workspace root, `FlowOS-old/` exists (`Test-Path ..\FlowOS-old` → True). Choose one: |
|   | - **Option A (preferred):** `git branch archive/flowos-old` from inside `FlowOS-old` if it is a git repo, push branch, then delete folder. |
|   | - **Option B:** Zip to `flowos/docs/archive/FlowOS-old.zip` (or external backup), then `Remove-Item -Recurse -Force ..\FlowOS-old`. |
| 4 | Add one line to `docs/foundation/DECISION_LOG.md` describing archive method and date. |
| 5 | Commit: `git commit -am "M0: remove dead code; archive FlowOS-old"`. Push. |

**Verification**

```powershell
Test-Path src/components/workplace/workplace-recover-day-bar.tsx   # False
Test-Path src/components/workplace/workplace-agenda-card.tsx       # False
Test-Path ..\FlowOS-old                                            # False (after removal)
git status -sb                                                     # clean
```

**Stop/fail if**

- Deleted file still imported (grep finds references).
- FlowOS-old removed without any archive artifact or branch.

**Rollback:** `git revert HEAD`; restore files from previous commit.

**Maps to:** WP-0.2, WP-0.3 + M0 exit criteria #3, #4

---

### Session 3 — Green local build

**Goal:** `npm run build` passes locally.  
**Time:** 1–2 hours  
**Prerequisites:** Session 2 complete (recover-day-bar deleted).

| # | Step |
|---|------|
| 1 | `cd flowos`; `npm ci` (or `npm install` if no lockfile issue). |
| 2 | Copy env template: `Copy-Item .env.example .env.local` — fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon JWT `eyJ...`, **not** `sb_publishable_...` — enforced in `src/lib/supabase/env.ts`). |
| 3 | Run `npm run build`. |
| 4 | If TypeScript errors remain after deletions, fix **only** errors blocking build (imports, types). No feature work. |
| 5 | Run `npm run lint` — note warnings; fix errors only if they fail CI eslint config. |
| 6 | Commit any fix: `git commit -am "M1: green production build"`. Push. |

**Verification**

```powershell
npm run build   # exit code 0; ends with successful static generation
npm run lint    # exit code 0
```

**Stop/fail if**

- Build still fails after dead-code deletion (investigate remaining TS errors; do not add features).
- Build passes only by disabling strict checks.

**Rollback:** Revert fix commit; restore deleted files only if deletion caused unexpected import breakage (unlikely).

**Maps to:** WP-1.1 + M1 exit criterion #1 (local half)

---

### Session 4 — Minimal CI

**Goal:** GitHub Actions runs build + lint on every push to `main`.  
**Time:** 1 hour  
**Prerequisites:** Session 3 green build.

| # | Step |
|---|------|
| 1 | Create `.github/workflows/ci.yml`: |

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: .
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder
```

| 2 | Commit and push; open GitHub → Actions and confirm workflow runs green on `main`. |

**Verification**

- GitHub Actions tab: latest `main` push → **CI** workflow → green check on `npm run lint` and `npm run build`.

**Stop/fail if**

- CI red on lint or build — fix before Session 5 (do not apply migrations on a broken pipeline).

**Rollback:** Delete workflow file via revert commit.

**Maps to:** WP-1.2 + M1 exit criterion #1 (CI half)

---

### Session 5 — Migration runbook: apply all 26 SQL files

**Goal:** Live Supabase schema matches repo; apply order documented; applied state recorded.  
**Time:** 2–4 hours  
**Prerequisites:** Session 4 CI green; Supabase project chosen (fresh or salvage — Decision point #2).

| # | Step |
|---|------|
| 1 | **Fresh vs salvage:** If live DB state is unknown or messy, create a **new** Supabase project (masterplan mitigation). Alpha data is disposable. |
| 2 | In Supabase Dashboard → SQL Editor, run files **in this exact order** (one file per execution; confirm success before next). |
| 3 | After all 26 applied, create/update `flowos/supabase/APPLIED_STATE.md` (commit to repo): project ref, date, operator, "all 26 applied in order below", Supabase project URL. |
| 4 | Commit: `git add supabase/APPLIED_STATE.md`; push. |

#### Migration apply order (all 26 files — no skips)

| Order | File | Dependency note |
|------:|------|-----------------|
| 1 | `tasks.sql` | Creates `tasks` table; base for task module. |
| 2 | `habits.sql` | Creates `habits` table; no FK to other app tables. |
| 3 | `habit_completions.sql` | Requires `habits(id)` FK. |
| 4 | `focus_sessions.sql` | Creates `focus_sessions`; standalone base table. |
| 5 | `reflections.sql` | Creates `reflections`; standalone base table. |
| 6 | `reflection_entries.sql` | Requires `reflections(id)` FK. |
| 7 | `tasks_priority.sql` | Alters `tasks`; adds `priority` check constraint (idempotent on existing columns). |
| 8 | `tasks_timestamps.sql` | Alters `tasks`; adds `updated_at` / `completed_at` + trigger. |
| 9 | `tasks_planning_state.sql` | Alters `tasks`; adds `planning_state` column + check. |
| 10 | `tasks_planning_state_later.sql` | Requires #9; migrates legacy `backlog` → `later` (no-op on fresh DB). |
| 11 | `auth_migration.sql` | Requires base tables #1–6; adds `user_id`, drops open RLS, creates per-user policies on six core tables. **Must run before `notes.sql`** (per `notes.sql` header). |
| 12 | `notes.sql` | Requires `auth.users`; creates growth_areas/notes/kanban schema with correct RLS from birth. |
| 13 | `daily_notes.sql` | Requires `notes` table; adds `note_date` column + indexes. |
| 14 | `notes_pinned.sql` | Requires `notes`; adds `is_pinned` (idempotent — column may exist from #12). |
| 15 | `notes_menu_pinned.sql` | Requires `notes`; adds `is_menu_pinned`. |
| 16 | `kanban_boards_sort_order.sql` | Requires `kanban_boards` from #12; backfills `sort_order`. |
| 17 | `kanban_cards_archived.sql` | Requires `kanban_cards` from #12; adds `is_archived` (idempotent). |
| 18 | `task_groups.sql` | Requires `tasks` + #7 (`tasks_priority.sql` per file comment); creates `task_groups`, adds task board columns. |
| 19 | `task_groups_appearance.sql` | Requires `task_groups`; idempotent icon/color backfill. |
| 20 | `task_groups_inbox_rename.sql` | Requires `task_groups` with `slug = 'inbox'` rows. |
| 21 | `task_groups_sort_mode.sql` | Requires `task_groups`; adds `sort_mode` column. |
| 22 | `tasks_manual_order.sql` | Requires `tasks.sort_order` / `group_id` from #18; backfills manual order. |
| 23 | `batch_update_manual_order.sql` | Requires `tasks.user_id` + `sort_order`; creates `batch_update_task_manual_orders` RPC. |
| 24 | `habits_track_with_focus.sql` | Requires `habits`; adds `track_with_focus` boolean. |
| 25 | `focus_sessions_targets.sql` | Requires `focus_sessions`; adds `target_type` / `target_id`. |
| 26 | `reflection_kanbans.sql` | Requires `reflections` + auth; adds `custom_kanbans`, creates `weekly_reflection_layouts` with RLS. |

**Verification**

```sql
-- Run in Supabase SQL Editor after apply:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- Expect: habit_completions, habits, focus_sessions, reflections, reflection_entries, tasks, task_groups,
--         growth_areas, notes, kanban_*, weekly_reflection_layouts, etc.

SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN
  ('tasks','habits','habit_completions','focus_sessions','reflections','reflection_entries')
ORDER BY tablename;
-- Expect: NO policy named "Allow public access to *"; expect "Users * own *" policies from auth_migration.sql
```

- File `supabase/APPLIED_STATE.md` committed with project ref and date.

**Stop/fail if**

- Any SQL file errors mid-sequence (stop; fix or switch to fresh project; do not skip files).
- `auth_migration.sql` applied before base tables exist.
- Open policies (`using (true)`) remain on core six tables after #11.

**Rollback:** On fresh project, delete project and recreate. On salvage project, restore from Supabase backup/PITR if available; otherwise treat as contaminated and recreate.

**Maps to:** WP-1.3 + M1 exit criterion #2

---

### Session 6 — Two-account RLS verification

**Goal:** Account A cannot read or write account B's data on **hosted** Supabase for all core entity types.  
**Time:** 2–4 hours  
**Prerequisites:** Session 5 complete; app points at same Supabase project via `.env.local`.

| # | Step |
|---|------|
| 1 | Register **Account A** and **Account B** via the app (`/register`) or Supabase Auth dashboard. Use separate browsers or profiles (Chrome + Firefox, or normal + incognito). |
| 2 | As **Account A**, create one row of each type through the app UI (or Supabase client authenticated as A). Record UUIDs in a scratch pad. |
| 3 | As **Account B**, attempt to read and mutate A's rows (app UI + optional direct REST). |
| 4 | Record pass/fail per table in `supabase/APPLIED_STATE.md` under `## Two-account test (YYYY-MM-DD)`. |
| 5 | Commit test record; push. |

#### Per-table test matrix

| Table | Account A action | Account B must fail |
|-------|------------------|---------------------|
| `tasks` | Create task "RLS-test-task-A" | Cannot see task in app; direct `select * from tasks where id = '<A-task-id>'` via B's JWT returns 0 rows or policy error |
| `habits` | Create habit "RLS-test-habit-A" | Same isolation |
| `habit_completions` | Complete A's habit for today | B cannot insert completion for A's `habit_id`; cannot read A's completions |
| `focus_sessions` | Start and stop one focus session | B cannot see A's session in Focus history |
| `reflections` | Save today's reflection text | B cannot see A's reflection date/content |
| `reflection_entries` | Add custom entry under A's reflection | B cannot read A's entries (child of reflections RLS) |

**Optional SQL spot-check (Supabase SQL Editor — service role for inspection only, not a substitute for JWT test):**

```sql
SELECT id, user_id, title FROM tasks WHERE title LIKE 'RLS-test%';
-- Confirm each row has non-null user_id matching creating user
```

**Verification**

- All six rows in the matrix: **PASS** for both read and write isolation.
- Test results committed in `APPLIED_STATE.md`.

**Stop/fail if**

- B can see any of A's core data → **halt Ship Gate**; re-apply `auth_migration.sql`, check legacy rows with `user_id IS NULL`, fix policies; re-test. Do not deploy to Vercel until PASS.
- Any core table still has `"Allow public access to ..."` policy.

**Rollback:** Re-run #11 `auth_migration.sql` on clean schema; or recreate Supabase project and repeat Session 5.

**Maps to:** WP-1.4 + M1 exit criterion #3

---

### Session 7 — Middleware completion

**Goal:** `/workplace` requires auth; placeholder routes unreachable in production.  
**Time:** 1–2 hours  
**Prerequisites:** Session 6 RLS PASS.

| # | Step |
|---|------|
| 1 | Edit `src/middleware.ts`. Current `PROTECTED_PREFIXES` (lines 5–23) includes `/goals`, `/ai-coach`, `/weekly-review` but **omits `/workplace`** — add `"/workplace"` to the array. |
| 2 | Block placeholder routes in production. Add near top of `middleware()` after `pathname` is read: |

```typescript
const PLACEHOLDER_PREFIXES = ["/goals", "/ai-coach", "/weekly-review"];

if (
  process.env.NODE_ENV === "production" &&
  PLACEHOLDER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
) {
  return new NextResponse(null, { status: 404 });
}
```

| 3 | Verify locally: unauthenticated visit to `/workplace` redirects to `/login?next=/workplace`. |
| 4 | `npm run build`; commit; push; CI green. |

**Verification**

```powershell
npm run build
# After deploy (Session 8), production checks:
# GET https://<vercel-url>/workplace → 307/302 to /login (logged out)
# GET https://<vercel-url>/goals → 404
# GET https://<vercel-url>/ai-coach → 404
# GET https://<vercel-url>/weekly-review → 404
```

**Stop/fail if**

- `/workplace` reachable without login.
- Any placeholder route returns 200 in production.

**Rollback:** Revert middleware commit.

**Maps to:** WP-1.5 + M1 exit criterion #4

**Note:** Next.js 16 emits deprecation warning — `"middleware" file convention is deprecated. Please use "proxy" instead.` Do **not** migrate to proxy in M1 (masterplan: note only).

---

### Session 8 — Vercel deploy & founder login

**Goal:** FlowOS live on a public URL; env vars set; founder can log in from a second device.  
**Time:** 2–3 hours  
**Prerequisites:** Sessions 3–7 complete; RLS PASS; middleware pushed.

| # | Step |
|---|------|
| 1 | Push latest `main` (CI green). |
| 2 | Vercel → Import Git repo `faiqrusli/flowos` (or link existing project). **Root directory:** `.` (repo root). Framework: Next.js. |
| 3 | Set environment variables (Production + Preview): |
|   | - `NEXT_PUBLIC_SUPABASE_URL` = Supabase project URL |
|   | - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon JWT (`eyJ...`) |
| 4 | Deploy. Fix deploy errors (env missing, build failure) — no feature changes. |
| 5 | Supabase Dashboard → Authentication → URL configuration: add Vercel URL to **Site URL** and **Redirect URLs** (`https://<vercel-domain>/**`). |
| 6 | From a **second device or browser**, open Vercel URL → register/login → create a task → confirm it persists. |
| 7 | Append **Redeploy from scratch** steps to this section (see below). |

#### Redeploy from scratch (one page)

1. Clone `git clone https://github.com/faiqrusli/flowos.git && cd flowos`
2. `npm ci`
3. Create Supabase project (or reuse documented ref in `supabase/APPLIED_STATE.md`)
4. Apply all 26 SQL files in Session 5 order
5. Copy `.env.example` → `.env.local`; set Supabase vars
6. `npm run build`
7. Vercel: connect repo, set same two env vars, deploy
8. Supabase Auth: add Vercel URL to redirect allowlist
9. Run two-account RLS matrix (Session 6)
10. Confirm `/workplace` protected; `/goals`, `/ai-coach`, `/weekly-review` → 404 in production

**Verification**

- Live URL loads login page; founder authenticates successfully.
- Task created on device 1 visible after refresh on device 1; **not** visible to Account B (Session 6 still valid on hosted URL).
- `curl -I https://<vercel-url>/goals` → `404` (production).

**Stop/fail if**

- Deploy succeeds but auth redirect loops (fix Supabase redirect URLs).
- Build passes locally but fails on Vercel (check Node 20, env vars).
- Two-account test fails on production DB (halt; do not invite users).

**Rollback:** Vercel → previous deployment; revert env var changes in Supabase.

**Maps to:** WP-1.6 + M1 exit criterion #5

---

## Decision points (founder only — max 3)

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Where docs live in VCS | (A) Copy `docs/` → `flowos/docs/` **(recommended)** — keeps Vercel/GitHub root unchanged, ~30 min. (B) Relocate git root to workspace parent — requires reconfiguring GitHub default path and Vercel root directory. | **A** — copy into `flowos/docs/` |
| 2 | Supabase project | (A) **Fresh project** — apply all 26 SQL cleanly (recommended if live state unknown). (B) Salvage existing — only if you can account for which files already ran. | **A** if any doubt |
| 3 | Sidebar hover change on `/` | `global-right-sidebar-context.tsx` line 98: uncommitted change extends hover-sidebar to `/` (Phase 3.1). (A) **Revert** for M1 — no UX changes. (B) Keep — violates M1 NOT-allowed unless explicitly accepted as conscious debt. | **Revert** |

---

## Out of scope (M2+ from masterplan)

Do not execute during Ship Gate:

- M2: Today home merge, routing truth, nav reduction, visible focus controls, inline capture, error/loading boundaries, dogfooding, recruiting pipeline
- M3: Alpha wave, onboarding ops, metrics harness, weekly fix cadence, gate review
- M4: Smoke tests, command palette, reflection save unification, planning simplification, habit-completion persistence fix, Wave 2 expansion
- M5: Retention dossier, beta/contract decision
- Phase 3–6 roadmap items, dnd-kit migration, monolith splits, design-system work, new modules, onboarding automation, keyboard OS, `/overview` page
- Middleware → proxy migration (Next.js 16 deprecation)
- Any UX change beyond WP-1.5 middleware requirements
- Automated tests beyond CI build + lint
- ADRs, new process docs, strategy revisions

---

## Top 5 execution risks + mitigations (M0/M1 only)

| Risk | Impact | Mitigation |
|------|--------|------------|
| **1. Unpushed commits / docs outside git** | Company-ending data loss | Session 1 first; verify `git push` and `git ls-files docs` before any infra work |
| **2. Wrong SQL apply order or partial apply** | Open RLS on core tables; indeterminate security | Follow numbered table exactly; stop on first error; prefer fresh Supabase project |
| **3. Two-account test skipped or rushed** | Data leakage to strangers at M3 | Session 6 is a hard gate; halt deploy if any table fails; record results in `APPLIED_STATE.md` |
| **4. CRLF noise obscures real diffs** | Phase 3 fragments ship in "line ending" commit | `.gitattributes` + `--renormalize`; inspect `global-right-sidebar-context.tsx` explicitly; revert undocumented UX |
| **5. Vercel/Supabase auth misconfiguration** | "Deployed" but unusable | Set redirect URLs in Supabase; use anon JWT not publishable key; verify login from second device in Session 8 |

---

## Operational gotchas

1. **Git repo is `flowos/` only** — parent `docs/` was outside VCS until Session 1; parent workspace `FlowOS/` is not the git root.
2. **4 commits ahead of origin** as of authoring (`5fc780a` … `9f7e7c4`); GitHub lacks Workplace and design phases until push.
3. **Build fails today** because untracked `workplace-recover-day-bar.tsx` imports non-existent `addMinutesToTime` — delete file (Session 2); it is not imported anywhere else.
4. **`middleware.ts` shows modified in git status but diff may be CRLF-only** — still run Session 7 edit to add `/workplace`; do not assume protection exists.
5. **`/workplace` is not in `PROTECTED_PREFIXES`** today (lines 5–23 of `src/middleware.ts`); `/` is protected but `/workplace` is not — verified gap.
6. **`/goals`, `/ai-coach`, `/weekly-review` exist as pages** (`ModuleRoadmapPageContent`) and return 200 when logged in — M1 requires 404/unreachable in production (Session 7).
7. **`tasks.sql` already includes `user_id`**; `tasks_priority.sql` and `auth_migration.sql` also add `user_id` — redundant but idempotent (`IF NOT EXISTS`).
8. **`notes.sql` already includes `is_pinned`, kanban `is_archived`, `sort_order`** — files #14–17 are safe idempotent duplicates for fresh installs.
9. **Alphabetical SQL order is wrong** — `auth_migration.sql` before table creation would fail; never sort by filename.
10. **`.env.local` requires anon JWT** — `src/lib/supabase/env.ts` rejects `sb_publishable_...` keys at runtime.
11. **No `.github/workflows/` exists yet** — CI must be created in Session 4.
12. **No `.gitattributes` exists yet** — Windows CRLF caused 22-file dirty tree; normalize in Session 1.
13. **`FlowOS-old/` exists at workspace root** — archive before M1 feature work (Session 2).
14. **Next.js middleware deprecation warning** on build — informational only for M1; do not refactor to proxy.
15. **Legacy rows with `user_id IS NULL`** on a salvaged DB bypass RLS inserts — fresh project avoids; on salvage run `DELETE FROM tasks WHERE user_id IS NULL` (and equivalent) before go-live.

---

## Explicitly deferred (not M0/M1)

| Item | Rationale |
|------|-----------|
| Smoke tests (auth, CRUD, focus, reflection) | M4 mandatory item (WP-4.1); M1 allows CI build+lint only |
| Habit-completion localStorage/Supabase merge fix | M4 pull (WP-4.2); expected when multi-device reports surface |
| Middleware → Next.js proxy migration | Not in M1 exit criteria; note deprecation only |
| Monolith splits (`tasks-board-view`, `timeline-planner`) | Tripwire-gated in masterplan; not Ship Gate |
| dnd-kit migration completion | Deferred indefinitely; zero user value at Ship Gate |
| `/overview` page, Today home merge, nav reduction | M2 scope (WP-2.1–2.3) |
| Command palette, keyboard OS, planning simplification | M4 conditional pool |
| Onboarding automation, privacy policy, backup strategy | M5 GO path |
| Relocate git root to workspace parent | Valid alternative for docs; rejected here to minimize Vercel/GitHub churn — founder may override in Decision #1 |
| Writing tests beyond CI | Masterplan M1 NOT-allowed list |
| Supabase MCP / CLI migration runner setup | Operational convenience only; manual SQL Editor apply satisfies M1 #2 |

---

## Ship Gate checklist (final sign-off)

| # | Criterion | WP | Done |
|---|-----------|-----|------|
| M0-1 | `origin/main` contains all local commits | WP-0.1 | ☐ |
| M0-2 | `docs/` tracked and pushed | WP-0.1 | ☐ |
| M0-3 | Dead code deleted (AgendaCard, mock store/data, recover-day-bar) | WP-0.2 | ☐ |
| M0-4 | `FlowOS-old/` archived; decision log updated | WP-0.3 | ☐ |
| M1-1 | `npm run build` + lint pass locally and in CI | WP-1.1, WP-1.2 | ☐ |
| M1-2 | 26 SQL files applied in documented order; state recorded | WP-1.3 | ☐ |
| M1-3 | Two-account RLS pass (6 core tables) on hosted DB | WP-1.4 | ☐ |
| M1-4 | `/workplace` protected; placeholders 404 in production | WP-1.5 | ☐ |
| M1-5 | Vercel deploy; founder login from URL | WP-1.6 | ☐ |

**Acceptance test:** Fresh clone → this runbook → live URL → two-account RLS pass. ☐

---

*End of runbook. Do not add M2+ work until every box above is checked.*
