# Code Standards

**Status:** Active (M2 baseline)  
**Audience:** Engineers, AI agents  
**Last updated:** July 4, 2026

Line-level conventions for FlowOS. Decision rules live in [ENGINEERING.md](./ENGINEERING.md); ship checklist in [QUALITY_GATES.md](./QUALITY_GATES.md); stack layout in [../TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md).

---

## Core rule

**Smallest diff that solves the user-visible problem.** Match existing patterns in the touched area. Do not “clean up” unrelated files in the same PR.

During M2, defer large refactors, new primitives, and palette sweeps unless the current runbook session explicitly calls for them.

---

## Folder layout

| Path | Put here |
|------|----------|
| `src/app/` | Routes, layouts, page shells (App Router) |
| `src/app/(main)/` | Authenticated app pages |
| `src/components/ui/` | Shared primitives (shadcn-style) |
| `src/components/{feature}/` | Feature UI (workplace, tasks, dashboard, …) |
| `src/lib/` | Reusable logic, Supabase helpers, palettes, pure functions |
| `src/hooks/` | Shared React hooks |
| `src/contexts/` | Cross-cutting client state (focus, sidebar) |
| `src/config/` | Static config (e.g. sidebar navigation) |
| `src/types/` | Shared TypeScript types (`database.ts`, domain types) |
| `supabase/` | SQL migrations (apply manually; see `APPLIED_STATE.md`) |

**Do not** add new top-level `lib/` domains without updating [FEATURE_INVENTORY.md](../FEATURE_INVENTORY.md).

---

## Naming

| Kind | Convention | Example |
|------|------------|---------|
| Files | `kebab-case` | `workplace-focus-card.tsx`, `schedule-palette.ts` |
| React components | `PascalCase` export | `WorkplaceFocusCard` |
| Hooks | `use` prefix | `useGlobalShortcuts` |
| Lib functions | verb or domain noun | `getChannelStyle`, `computeSchedule` |
| Types | `PascalCase` | `ChannelStyle`, `ScheduleItemType` |
| CSS variables | `--kebab-case` in `globals.css` | `--background`, `--primary` |

---

## TypeScript and React

### Server vs client

- Default to **Server Components** in `app/` when no browser APIs, hooks, or event handlers are needed.
- Add `"use client"` at the top when using `useState`, `useEffect`, contexts, or DOM events.
- Keep client boundaries **as low as possible** — leaf components, not whole pages, when feasible.

### Components

- **Compose, don’t fork** — reuse `WorkplacePageContent`, dashboard strips, existing dialogs before copying markup.
- **Props** — prefer explicit typed props; avoid `any`.
- **Imports** — use `@/` path alias (e.g. `@/lib/schedule-palette`).
- **No fake UI** — no placeholder buttons or “coming soon” controls in shipped surfaces ([PRINCIPLES.md](./PRINCIPLES.md)).

### Hooks and effects

- Prefer derived state over syncing with `useEffect`.
- Legacy code may trigger `react-hooks/*` ESLint **warnings**; do not introduce new violations in touched files when avoidable.
- Do not refactor hook patterns repo-wide in M2.

### Business logic

- **Pure logic → `lib/`** — scheduling, routing commands, appearance maps, priority semantics.
- **Data fetching** — Supabase via `src/lib/supabase/` (`server.ts` in RSC/actions, `client.ts` in client components).
- **Appearance maps** — extend existing palette modules (`schedule-palette.ts`, `task-group-appearance.ts`, …) rather than inline Tailwind color strings in components.

Example pattern (palette module):

```ts
// lib/schedule-palette.ts — maps domain → Tailwind token classes
export function getChannelStyle(type, priority?) { … }
```

---

## Styling

1. **Tokens first** — use CSS variables and semantic Tailwind classes from [globals.css](../../../src/app/globals.css) (`bg-background`, `bg-sidebar`, `bg-card`, `bg-surface-hover`, `text-foreground`, `border-border`, …). Surface hierarchy: [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md).
2. **Centralize channel colors** — schedule, habits, task groups go through `lib/*-appearance.ts` or `schedule-palette.ts`, not one-off hex in JSX.
3. **No light theme** — dark-only; do not add theme switching.
4. **Visible controls** — critical actions must not be hover-only ([PRINCIPLES.md](./PRINCIPLES.md) #10).

Known debt: many legacy hardcoded palette refs remain; fix only when touching that file for product work.

---

## Data and security

Every change that reads or writes user data:

- [ ] Queries filter by authenticated user (`auth.uid()` / session-scoped client).
- [ ] New tables have **RLS** policies; no `using (true)` on user data.
- [ ] Schema change → SQL file in `supabase/` + update `src/types/database.ts` + verify [APPLIED_STATE.md](../../../supabase/APPLIED_STATE.md).
- [ ] No secrets in client bundle; env via `.env.local` / Vercel.

---

## Routes and navigation

New authenticated route:

1. Add page under `src/app/(main)/…`
2. Add prefix to `PROTECTED_PREFIXES` in [middleware.ts](../../../src/middleware.ts) if not already covered
3. Update [sidebar-navigation.tsx](../../../src/config/sidebar-navigation.tsx) and [FEATURE_INVENTORY.md](../FEATURE_INVENTORY.md) if user-visible
4. Smoke: unauthenticated → redirect to `/login?next=…`

Placeholder modules (`/goals`, `/ai-coach`, …) stay behind placeholder handling until FEATURE_INVENTORY marks them shipped.

---

## Error and loading (target state)

Before private alpha (runbook Session 6+):

- Add `error.tsx` / `loading.tsx` at appropriate route segments for primary flows.
- Prefer graceful empty states over thrown errors in UI.

Until boundaries exist, match the error-handling style of the sibling file you edit.

---

## Testing

- **No automated test requirement** during M2.
- Manual smoke before merge: login → primary flow touched → logout.
- Automated suite expansion is **beta gate** ([ENGINEERING.md](./ENGINEERING.md)).

---

## Tooling

| Command | When |
|---------|------|
| `npm run build` | Before every merge to `main` |
| `npm run lint` | Before every merge; no **new errors** in touched files |
| `npm run dev` | Local verification |

ESLint: Next.js core-web-vitals + TypeScript ([eslint.config.mjs](../../../eslint.config.mjs)). Warnings on legacy hook patterns are accepted until M4 refactor pass.

---

## Git and scope (M2)

- Branch per runbook session — see [GIT_WORKFLOW.md](./GIT_WORKFLOW.md).
- **In scope:** Today home, routing, inline capture, focus visibility, error boundaries.
- **Out of scope:** command palette, new modules, dnd-kit migration, monolith file splits, visual polish sweeps.

Record significant Build/Kill in [decision-log.md](../../execution/logs/decision-log.md).

---

## Pre-merge checklist (quick)

- [ ] Smallest diff; no drive-by refactors
- [ ] Matches folder conventions above
- [ ] Auth + RLS if data/route change
- [ ] `npm run build` && `npm run lint` pass
- [ ] Manual smoke on changed flow
- [ ] FEATURE_INVENTORY / decision-log if behavior changed
- [ ] Founder approval before merge to `main`

---

## Related

| Document | Role |
|----------|------|
| [.cursor/rules/code-standards.mdc](../../../.cursor/rules/code-standards.mdc) | Always-on agent summary |
| [ENGINEERING.md](./ENGINEERING.md) | Build / defer / reject, debt priority |
| [QUALITY_GATES.md](./QUALITY_GATES.md) | Full gate matrix |
| [PRINCIPLES.md](./PRINCIPLES.md) | Product rules that affect code |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | Branches and merge approval |
| [TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md) | Stack, entities, key files |
| [m2-founder-daily-driver.md](../../execution/runbooks/m2-founder-daily-driver.md) | Current session scope |
