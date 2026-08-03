# Implementation Truth Backlog

**Status:** Active — Phase 0 deliverable; input to Phase 1 (Establish Implementation Truth)  
**Owner:** Implementation Engineer  
**Approval Required:** Founder  
**Parent:** [MVP Implementation Masterplan](./mvp-implementation-masterplan.md) · [Feature Catalog](../04-features/feature-catalog.md) · [FEATURE_INVENTORY](../foundation/FEATURE_INVENTORY.md)  
**Last Updated:** 2026-08-03  
**Review trigger:** A question is answered in Phase 1 and promoted to a behavior doc, delivery design, or closed with evidence.

---

## Document Ownership

### Owner
**Role:** Implementation Engineer  
**Responsibility:** Maintain unresolved questions about what the current build actually does — not what it should do.

### Modification Process
1. Implementation Engineer adds or closes items based on code review and Phase 1 investigation
2. Product Architect validates that items remain "current state" questions (not speculative features)
3. Submit material changes to Founder for approval
4. When a question is answered, link the evidence doc and mark **Resolved**

### Authority Level
- Implementation Engineer can: Add questions, propose resolution evidence, close items with code/doc proof
- Requires approval for: Converting unanswered items into feature requests or scope changes

---

## Purpose

Phase 0 requires a clean list of **unresolved implementation truth** — questions about what exists in the codebase today. This backlog is **not** a feature wishlist. Each item should be answerable by reading code, running the app, or querying the database.

Phase 1 roles use this list to prioritize behavior documentation, design reconciliation, and architecture verification.

**Rules for this backlog:**
- ✅ "What routes compose the Today page?"
- ✅ "Where is task `scheduled_date` written?"
- ❌ "Should we add inline capture?" (product decision — not here)
- ❌ "Build command palette" (future work — not here)

---

## How to use

| Column | Meaning |
|--------|---------|
| **ID** | Stable reference (`T-01`, `K-03`, …) |
| **Question** | What we do not yet know about current behavior |
| **Starting points** | Files/routes to inspect first (not proof) |
| **Status** | `Open` until Phase 1 produces evidence; then `Resolved` + link |

---

## Today

| ID | Question | Starting points | Status |
|----|----------|-----------------|--------|
| T-01 | What is the complete route map for Today — is `/` the only entry, and what happens to `/dashboard` and `/workplace`? | `src/app/(main)/page.tsx`, `src/middleware.ts` (`/dashboard` → `/`), `src/app/(main)/workplace/page.tsx` | Open |
| T-02 | Which components compose the Today surface — status rail vs Workplace grid — and how is layout density (`full` / `work` / `focus`) selected and persisted? | `src/components/today/`, `src/components/workplace/workplace-page-content.tsx`, `src/lib/workplace-layout.ts` | Open |
| T-03 | What data does Today load on first paint, from which sources, and in what order? | `src/lib/dashboard.ts`, `src/lib/workplace-data.ts`, `TodayPageContent` | Open |
| T-04 | How is "on track" status computed and what inputs does it use? | `src/lib/dashboard-command.ts`, `src/lib/dashboard.ts` | Open |
| T-05 | How does "Next Action" recommendation work — when is it shown, hidden, and what task selection logic applies? | `src/lib/dashboard-command.ts`, Today status rail components | Open |
| T-06 | What global shortcuts are active on Today and how do they interact with focus mode and modals? | `src/lib/global-shortcuts.ts`, sidebar nav shortcuts | Open |
| T-07 | What is the relationship between Today KPI focus/break seconds and the active focus session (local vs persisted)? | `src/lib/focus-active-session.ts`, `TodayPageContent` display hooks | Open |
| T-08 | Which Workplace modules are visible at each density preset and can the user override visibility? | `src/lib/workplace-module-visibility.ts`, `src/lib/workplace-layout.ts` | Open |
| T-09 | Is the Agenda card dead code only, or referenced anywhere in runtime paths? | FEATURE_INVENTORY notes "not imported"; grep `Agenda` in `src/` | Open |
| T-10 | What schedule-reminder surfaces exist on Today (toast, browser notification, notification center) and what triggers each? | `src/lib/schedule-reminder-delivery.ts`, `src/lib/schedule-notifications.ts` | Open |

---

## Tasks

| ID | Question | Starting points | Status |
|----|----------|-----------------|--------|
| K-01 | What is the complete Tasks route surface — `/tasks` only, or also embedded cards on Today/Workplace? | `src/app/(main)/tasks/page.tsx`, Workplace task cards | Open |
| K-02 | What is the full task data model in Supabase (columns, defaults, constraints) vs `src/types/task.ts`? | `supabase/tasks*.sql`, `src/types/database.ts`, `src/types/task.ts` | Open |
| K-03 | What planning states exist in code vs UI (`none`, `later`, legacy `backlog`) and how do they affect scheduling? | `src/lib/task-planning.ts`, `supabase/tasks_planning_state*.sql` | Open |
| K-04 | How does "Today" assignment work for a task — which fields (`scheduled_date`, flags, groups) determine Today membership? | `src/lib/tasks.ts` (`isTaskToday`, `partitionTasks`), `fetchTodayTasks` | Open |
| K-05 | How many distinct scheduling UIs exist (Schedule page, quick schedule drawer, timeline, task dialog) and do they write the same fields? | `src/components/schedule/`, `src/components/tasks/`, timeline embed | Open |
| K-06 | What is the kanban board data model — groups, sort modes, manual order — and how is drag reorder persisted? | `src/lib/kanban.ts`, `src/lib/manual-order.ts`, `supabase/task_groups*.sql` | Open |
| K-07 | How does the Next Up queue relate to tasks (`queue_order`, focus handoff) and where is order stored? | `src/lib/next-up-queue.ts`, `src/lib/task-next-up*.ts`, `supabase/tasks_next_up_queue.sql` | Open |
| K-08 | What CRUD paths exist for tasks (dialog, quick add, inline capture, duplicate, delete) and do they share validation? | `src/lib/tasks.ts`, `src/lib/quick-capture-task.ts`, Workplace quick add | Open |
| K-09 | How are task priorities, durations, and alert-before values stored and surfaced? | `src/lib/task-priority.ts`, `src/lib/task-duration-options.ts`, `supabase/tasks_priority.sql`, `tasks_notification_lead.sql` | Open |
| K-10 | What happens to a task on complete, uncomplete, defer ("Later"), and missed-date states? | `toggleTaskComplete`, `task-planning.ts`, `isTaskMissed` | Open |
| K-11 | Which task-related data is user-scoped in queries and confirmed by RLS policies? | `supabase/auth_migration.sql`, `src/lib/tasks.ts` Supabase calls | Open |

---

## Focus

| ID | Question | Starting points | Status |
|----|----------|-----------------|--------|
| F-01 | What routes and embed surfaces run focus mode — `/focus` page vs Workplace focus card vs timeline? | `src/app/(main)/focus/page.tsx`, `workplace-focus-card.tsx` | Open |
| F-02 | What is the complete focus session lifecycle (quick vs pomodoro vs break) and where is state held during an active session? | `src/lib/focus-active-session.ts`, `src/contexts/focus-session-context.tsx` | Open |
| F-03 | When and how does an active session persist to Supabase — on stop, complete, interval, or page unload? | `src/lib/focus-session-persist.ts`, `supabase/focus_sessions.sql` | Open |
| F-04 | What is the focus session schema (columns, targets, task attribution) vs types in codebase? | `supabase/focus_sessions*.sql`, `src/types/database.ts` | Open |
| F-05 | How is focus time attributed to a task vs habit vs unattributed session? | `src/lib/focus-task-totals.ts`, `supabase/focus_session_task_totals.sql`, habit `track_with_focus` | Open |
| F-06 | What analytics exist on `/focus` (history, heatmap, targets) and what queries power them? | `src/lib/focus-analytics.ts`, Focus page components | Open |
| F-07 | How does scheduled break (modal, Next Break strip, notifications) integrate with the active session model? | `src/lib/focus-scheduled-break.ts`, schedule-break specs in archive | Open |
| F-08 | What reflection capture paths exist at session end (inline, modal, sidebar) and do they write to the same store? | `workplace-focus-reflection-modal.tsx`, `workplace-focus-inline-reflection.tsx`, `src/lib/focus-reflection.ts` | Open |
| F-09 | How do focus settings (durations, break activities) persist — localStorage vs Supabase vs settings page? | `src/lib/focus-settings.ts`, `src/lib/settings-preferences.ts` | Open |
| F-10 | What happens to an active session on navigation away, refresh, or auth logout? | `focus-active-session.ts` localStorage key, session context | Open |

---

## Reflection

| ID | Question | Starting points | Status |
|----|----------|-----------------|--------|
| R-01 | What is the complete Reflection route map — `/reflection`, `/reflection/WeeklyReflection`, sidebar panel? | `src/app/(main)/reflection/`, `sidebar-reflection-panel.tsx` | Open |
| R-02 | What is the daily reflection data model (tables, columns, custom entries, kanbans)? | `supabase/reflections.sql`, `reflection_entries.sql`, `reflection_kanbans.sql` | Open |
| R-03 | How does save behavior differ between the full Reflection page (explicit save) and the sidebar panel (debounced autosave)? | `reflection-page-content.tsx`, `sidebar-reflection-panel.tsx`, `src/lib/reflections-db.ts` | Open |
| R-04 | What fields constitute a "complete" daily reflection in code vs what the UI allows partial? | `ReflectionDraft` type, save handlers | Open |
| R-05 | How do custom reflection entries and kanban boards persist — same row, related tables, or separate stores? | `reflection-kanban-section.tsx`, Supabase schema | Open |
| R-06 | What is implemented for weekly reflection vs placeholder — layout persistence, auto-summary, data sources? | `weekly-reflection-page-content.tsx`, `src/lib/weekly-reflection-data.ts`, `/weekly-review` route | Open |
| R-07 | How does focus session-end reflection relate to daily reflection records? | `src/lib/focus-reflection.ts`, focus reflection components | Open |
| R-08 | What error and recovery behavior exists when reflection save fails (network, validation, RLS)? | `ReflectionsError`, error banners in reflection components | Open |
| R-09 | Which reflection queries are user-scoped and covered by RLS? | `src/lib/reflections-db.supabase.ts`, auth migration policies | Open |

---

## Cross-cutting (MVP loop)

| ID | Question | Starting points | Status |
|----|----------|-----------------|--------|
| X-01 | What is the canonical list of protected routes and placeholder routes (404 in production)? | `src/middleware.ts` `PROTECTED_PREFIXES`, `PLACEHOLDER_PREFIXES` | Open |
| X-02 | Which nav-visible modules are composed only on Today vs standalone routes? | `src/config/sidebar-navigation.tsx`, FEATURE_INVENTORY | Open |
| X-03 | Where does FEATURE_INVENTORY disagree with Feature Catalog status, and which is stale? | Compare both docs against `src/app/(main)/` routes | Open |
| X-04 | What dead code or unused components are confirmed (not just suspected)? | FEATURE_INVENTORY "Agenda card", grep unused exports | Open |
| X-05 | What duplicate scheduling or save paths exist across domains (tasks schedule, focus break, reflection)? | Schedule libs, task planning, reflection save paths | Open |
| X-06 | What is stored locally (localStorage/sessionStorage) vs Supabase per domain? | `safe-storage.ts`, focus session, sidebar prefs, note autosave | Open |
| X-07 | What feature-usage and analytics events are emitted and where are they stored? | `src/lib/feature-usage.ts`, `supabase/feature_usage.sql` | Open |

---

## Supporting domains (conditional MVP — Phase 1 if retained)

These domains are admitted conditionally per the masterplan. Questions remain open for Phase 1 scoping; they are **not** Gate 0 blockers but prevent "unknown" status at Gate 1 if retained.

| ID | Domain | Question | Starting points | Status |
|----|--------|----------|-----------------|--------|
| S-01 | Habits | What is the habit completion model (daily schedule, completions store, Today card behavior)? | `src/lib/habits.ts`, `habit-completions-store.ts`, `supabase/habits.sql` | Open |
| S-02 | Schedule | How many scheduling surfaces write to the same task/habit schedule fields? | `src/lib/schedule*.ts`, Schedule page, timeline, quick drawer | Open |
| S-03 | Notes | What is the Notes data model (daily notes vs kanban vs growth areas) and route entry? | `src/lib/notes.ts`, `supabase/notes.sql`, `daily_notes.sql` | Open |

---

## Resolution log

| ID | Resolved | Evidence | Resolved by |
|----|----------|----------|-------------|
| — | — | — | — |

*No items resolved yet. Phase 1 updates this table as questions are answered.*

---

## Related documents

- [MVP Implementation Masterplan — Phase 1](./mvp-implementation-masterplan.md) — consumes this backlog
- [Feature Catalog](../04-features/feature-catalog.md) — domain status and MVP disposition
- [FEATURE_INVENTORY](../foundation/FEATURE_INVENTORY.md) — detailed implementation snapshot (may be stale)
- [Phase 0 Gate Checklist](./phase-0-gate-checklist.md) — Criterion 7 evidence
- [Current Sprint](./current-sprint.md) — Implementation Engineer assignment
