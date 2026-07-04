# Technical Architecture

**Status:** Living document  
**Audience:** Engineers  
**Last updated:** July 4, 2026 (Pass 5 — M1 auth gap resolved)

---

## Purpose

Describe FlowOS's application stack, data model, authentication, key libraries, known technical debt, and deployment requirements. For current implementation snapshot, also see [../archive/design/project-state-july-2026.md](../archive/design/project-state-july-2026.md).

---

## Application stack

```
┌─────────────────────────────────────────────────┐
│  Browser (dark-theme web app)                   │
├─────────────────────────────────────────────────┤
│  Next.js 16 App Router (flowos/)              │
│  React 19 · TypeScript                          │
├─────────────────────────────────────────────────┤
│  Tailwind CSS v4 · OKLCH tokens (globals.css)  │
│  shadcn-style UI primitives (components/ui/)    │
├─────────────────────────────────────────────────┤
│  Supabase (Auth + PostgreSQL + RLS)           │
└─────────────────────────────────────────────────┘
```

| Layer | Technology | Location |
|-------|------------|----------|
| Framework | Next.js 16.2.7 App Router | `flowos/` |
| Styling | Tailwind v4 + CSS variables | `src/app/globals.css` |
| Components | shadcn / Base UI | `src/components/ui/` |
| Backend | Supabase | `src/lib/supabase/` |
| Drag-and-drop | Custom pointer + dnd-kit (partial) | `src/lib/dnd/` |
| Fonts | Geist Sans, Geist Mono | `src/app/layout.tsx` |

---

## Directory structure (high level)

```
flowos/
├── src/
│   ├── app/              # App Router pages and layouts
│   │   ├── (main)/       # Authenticated app shell
│   │   ├── auth/         # Auth callback
│   │   └── login|register/
│   ├── components/       # Feature and UI components
│   ├── config/           # sidebar-navigation.tsx
│   ├── contexts/         # React contexts (focus, sidebar)
│   ├── hooks/            # use-global-shortcuts, etc.
│   ├── lib/              # Business logic, Supabase, palettes
│   └── types/            # TypeScript types (database.ts)
├── supabase/             # SQL migrations (manual apply)
└── .env.example          # Required environment variables
```

---

## Authentication flow

1. User registers/logs in via Supabase Auth (`signUp` / `signInWithPassword`)
2. Email confirmation via `/auth/callback` (code exchange)
3. Middleware (`src/middleware.ts`) refreshes session on each request via `updateSession`
4. Unauthenticated users on protected routes → redirect to `/login?next=...`
5. Authenticated users on auth routes → redirect to `/`

`/workplace` is in `PROTECTED_PREFIXES` (M1 ship gate). Unauthenticated access redirects to `/login?next=...`.

---

## Data model (Supabase)

SQL migrations live in `flowos/supabase/`. Apply manually to Supabase project.

### Core entities

| Table | Purpose | Migration |
|-------|---------|-----------|
| `tasks` | Task management | `tasks.sql` + planning/timestamp migrations |
| `task_groups` | Kanban groups | `task_groups.sql` + appearance/sort migrations |
| `habits` | Habit definitions | `habits.sql` + `habits_track_with_focus.sql` |
| `habit_completions` | Daily habit completion | `habit_completions.sql` |
| `focus_sessions` | Focus session records | `focus_sessions.sql` + targets migration |
| `reflections` | Daily reflections | `reflections.sql` |
| `reflection_entries` | Custom reflection fields | `reflection_entries.sql` |
| `weekly_reflection_layouts` | Weekly reflection | `reflection_kanbans.sql` |
| `daily_notes` | Workplace daily notes | `daily_notes.sql` |
| `notes` | Notes module | `notes.sql` |
| `kanban_boards/columns/cards` | Notes kanban | `notes.sql` + archived/sort migrations |
| `growth_areas/goals` | Notes growth tracking | `notes.sql` |

All tables use **Row Level Security (RLS)**. Verify policies scope to `auth.uid()` before production — early migrations may use permissive policies for development.

Types: `flowos/src/types/database.ts`

---

## Central design libraries (Phase 2)

| Library | Purpose |
|---------|---------|
| `lib/task-group-appearance.ts` | Group color dots |
| `lib/schedule-palette.ts` | Schedule channel colors |
| `lib/timeline-habit-appearance.ts` | Habit row styling |
| `lib/task-priority.ts` | Priority semantics |
| `lib/panel-toggle-styles.ts` | Segmented toggle recipes |
| `lib/workplace-group-accent.ts` | Workplace accents |
| `components/ui/badge.tsx` | Unified entity/status variants |

Visual tokens: `src/app/globals.css`  
Navigation config: `src/config/sidebar-navigation.tsx`

---

## Key business logic paths

| Domain | Primary files |
|--------|---------------|
| Next action routing | `lib/dashboard-command.ts` |
| Schedule computation | `lib/schedule.ts`, `lib/schedule-utils.ts` |
| Workplace data | `lib/workplace-data.ts` |
| Global shortcuts | `hooks/use-global-shortcuts.ts` |
| Quick capture | `components/layout/quick-capture-dialog.tsx` |
| Focus timer | `components/workplace/workplace-focus-card.tsx` |

---

## Known technical debt

| Item | Severity | Target |
|------|----------|--------|
| Zero automated tests | High | Before beta |
| No `error.tsx` / `loading.tsx` boundaries | High | Before alpha |
| 542 hardcoded palette references (post-Phase 2 baseline) | Medium | Ongoing |
| dnd-kit dual system (passive context + legacy pointer drag) | Medium | Engineering track |
| `timeline-planner.tsx` monolith | Medium | Engineering track |
| Duplicate context menus across task surfaces | Low | Phase 3+ |
| Three card border radii in production | Low | Phase 4 |
| setState-in-effect lint in dialog components | Low | Pre-existing |

Source: [../archive/design/project-state-july-2026.md](../archive/design/project-state-july-2026.md)

---

## Deployment requirements

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-jwt-key
```

See `flowos/.env.example`. Use the **anon JWT** (`eyJ...`), not publishable keys.

### Build and run

```bash
cd flowos
npm install
npm run build
npm start
```

Recommended host: **Vercel** (Next.js native). Supabase project must have all SQL migrations applied.

### Pre-deploy checklist

- [ ] All Supabase migrations applied  
- [ ] RLS policies verified for production (user-scoped)  
- [ ] Environment variables set on host  
- [ ] Fake Agenda card removed  
- [ ] Error/loading boundaries on main routes  

Full gates: [governance/GATES.md](./governance/GATES.md)

---

## Engineering tracks (separate from design phases)

These are background engineering work, not blocking Phase 3:

- **dnd-kit migration** — replace custom pointer drag on Tasks board  
- **Monolith splits** — `timeline-planner.tsx` decomposition  
- **Select primitive consolidation** — Phase 4+ evaluation  
- **Test coverage** — critical paths before beta  

Do not document these in design phase contracts. Consider `docs/engineering/` if a dedicated track doc is needed later.

---

## Related documents

- [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md) — shipped features  
- [governance/GATES.md](./governance/GATES.md) — launch gates  
- [../archive/design/project-state-july-2026.md](../archive/design/project-state-july-2026.md) — design system state  
- [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md) — routing, nav, and feature status  
