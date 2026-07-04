# Supabase Applied State — FlowOS Ship Gate

**Project ref:** `liwifpvrcbdbbjzcmlox`  
**Project URL:** `https://liwifpvrcbdbbjzcmlox.supabase.co`  
**Region:** ap-southeast-2  
**Operator:** Founder + agent (M1 Session 5)  
**Date:** 2026-07-04  
**Strategy:** Salvage existing project (founder data retained; alpha disposable per masterplan)

## Migration apply record

All 26 SQL files in runbook order — status on this project:

| Order | File | Status | Notes |
|------:|------|--------|-------|
| 1 | `tasks.sql` | Pre-applied | Table existed |
| 2 | `habits.sql` | Pre-applied | Table existed |
| 3 | `habit_completions.sql` | **Applied 2026-07-04** | Table was missing; created |
| 4 | `focus_sessions.sql` | Pre-applied | |
| 5 | `reflections.sql` | Pre-applied | |
| 6 | `reflection_entries.sql` | Pre-applied | |
| 7 | `tasks_priority.sql` | Pre-applied | |
| 8 | `tasks_timestamps.sql` | Pre-applied | |
| 9 | `tasks_planning_state.sql` | Pre-applied | |
| 10 | `tasks_planning_state_later.sql` | Pre-applied / no-op | |
| 11 | `auth_migration.sql` | **Applied 2026-07-04** | Salvage prelude dropped live `Allow all *` policies; enabled RLS; created per-user policies |
| 12 | `notes.sql` | Pre-applied | |
| 13 | `daily_notes.sql` | Pre-applied | `note_date` present |
| 14 | `notes_pinned.sql` | Pre-applied | |
| 15 | `notes_menu_pinned.sql` | Pre-applied | |
| 16 | `kanban_boards_sort_order.sql` | Pre-applied | |
| 17 | `kanban_cards_archived.sql` | Pre-applied | |
| 18 | `task_groups.sql` | Pre-applied | |
| 19 | `task_groups_appearance.sql` | Pre-applied | |
| 20 | `task_groups_inbox_rename.sql` | Pre-applied | |
| 21 | `task_groups_sort_mode.sql` | Pre-applied | |
| 22 | `tasks_manual_order.sql` | Pre-applied | |
| 23 | `batch_update_manual_order.sql` | Pre-applied | RPC exists |
| 24 | `habits_track_with_focus.sql` | Pre-applied | |
| 25 | `focus_sessions_targets.sql` | Pre-applied | |
| 26 | `reflection_kanbans.sql` | Pre-applied | |

## RLS structural verification (2026-07-04)

```text
tasks              RLS on  policies: 4
habits             RLS on  policies: 4
habit_completions  RLS on  policies: 3
focus_sessions     RLS on  policies: 4
reflections        RLS on  policies: 4
reflection_entries RLS on  policies: 4
```

No `Allow public access to *` or `Allow all *` policies remain on core tables.

All core rows have non-null `user_id` (verified before RLS lockdown).

## Two-account test (2026-07-04)

| Table | Read isolation | Write isolation | Status |
|-------|----------------|-----------------|--------|
| `tasks` | — | — | **PENDING** — API test blocked by Supabase signup rate limit; run `node scripts/rls-two-account-test.mjs` or manual browser test |
| `habits` | — | — | PENDING |
| `habit_completions` | — | — | PENDING |
| `focus_sessions` | — | — | PENDING |
| `reflections` | — | — | PENDING |
| `reflection_entries` | — | — | PENDING |

**Manual test accounts on project:** `faiqrusli9@gmail.com`, `faiqrusli12@gmail.com` — use separate browsers; confirm neither sees the other's data after RLS apply.

---

*Update this file when two-account test completes and after any future migration.*
