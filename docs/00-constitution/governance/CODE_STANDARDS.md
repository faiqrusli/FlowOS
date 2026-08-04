# Code Standards

**Status:** Active — current engineering conventions; M2 scope notes are historical context  
**Audience:** Engineers, AI agents  
**Last updated:** August 4, 2026

Line-level conventions for FlowOS. Decision rules live in [ENGINEERING.md](./ENGINEERING.md); ship checklist in [GATES.md](./GATES.md); stack layout in [../../06-engineering/TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md).

---

## Core rule

**Smallest diff that solves the user-visible problem.** Match existing patterns in the touched area. Do not “clean up” unrelated files in the same PR.

Keep changes small and phase-aligned. Phase-specific scope comes from `docs/current-phase/current-sprint.md` and the MVP Implementation Masterplan.

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

**Do not** add new top-level `lib/` domains without updating [FEATURE_INVENTORY.md](../../04-features/FEATURE_INVENTORY.md).

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
- Do not refactor hook patterns repo-wide without an admitted phase objective.

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

1. **Tokens first** — use CSS variables and semantic Tailwind classes from [globals.css](../../../src/app/globals.css), not page-specific hex, slate/gray, border, shadow, radius, or text-scale combinations. Follow the active design standards and [design-implementation-map.md](../../05-design/design-implementation-map.md); archived workspace/interaction documents are historical.
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
3. Update [sidebar-navigation.tsx](../../../src/config/sidebar-navigation.tsx) and [FEATURE_INVENTORY.md](../../04-features/FEATURE_INVENTORY.md) if user-visible
4. Smoke: unauthenticated → redirect to `/login?next=…`

Placeholder modules (`/goals`, `/ai-coach`, …) stay behind placeholder handling until FEATURE_INVENTORY marks them shipped.

---

## Error and loading

For primary flows:

- Add `error.tsx` / `loading.tsx` at appropriate route segments for primary flows.
- Prefer graceful empty states over thrown errors in UI.

Until boundaries exist, match the error-handling style of the sibling file you edit.

---

## Testing

- Automated tests are required where the repository has coverage; run `npm test` before merge.
- Manual smoke remains required: login → primary flow touched → logout.
- Add tests for new business logic, negative paths, and edge cases.

---

## Tooling

| Command | When |
|---------|------|
| `npm run build` | Before every merge to `main` |
| `npm run lint` | Before every merge; no **new errors** in touched files |
| `npm test` | Before every merge; all relevant tests pass |
| `npm run dev` | Local verification |

ESLint: Next.js core-web-vitals + TypeScript ([eslint.config.mjs](../../../eslint.config.mjs)). Warnings on legacy hook patterns are accepted until M4 refactor pass.

---

## Git and scope

- Branch per runbook session — see [GIT_WORKFLOW.md](./GIT_WORKFLOW.md).
- **In scope:** Current sprint assignments and admitted MVP implementation truth.
- **Out of scope:** Work excluded by the current phase masterplan or an explicit Founder decision.

Record consequential Build/Kill choices in [Decision Records](../../08-decisions/decision-records.md).

---

## Pre-merge checklist (quick)

- [ ] Smallest diff; no drive-by refactors
- [ ] Matches folder conventions above
- [ ] Auth + RLS if data/route change
- [ ] `npm run build`, `npm run lint`, and `npm test` pass
- [ ] Manual smoke on changed flow
- [ ] FEATURE_INVENTORY / decision-log if behavior changed
- [ ] Founder approval before merge to `main`

---

## Related

| Document | Role |
|----------|------|
| [.cursor/rules/code-standards.mdc](../../../.cursor/rules/code-standards.mdc) | Always-on agent summary |
| [ENGINEERING.md](./ENGINEERING.md) | Build / defer / reject, debt priority |
| [GATES.md](./GATES.md) | Full gate matrix |
| [PRINCIPLES.md](./PRINCIPLES.md) | Product rules that affect code |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | Branches and merge approval |
| [TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md) | Stack, entities, key files |
| [m2-founder-daily-driver.md](../../11-archive/execution/runbooks/m2-founder-daily-driver.md) | Historical session scope example |
