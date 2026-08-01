# Feature Inventory

**Status:** Living document  
**Audience:** Engineers, product lead  
**Last updated:** July 13, 2026 (Visual Design System v3.0 migration sessions 1–4 complete on branch)

**Visual system:** [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md) + [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) (Surface 0–10 live in `globals.css`). Historical themes: [archive/design/themes/](../archive/design/themes/). Canonical helpers: `src/lib/theme/surface-classes.ts`, `src/lib/theme/tokens.ts`.

---

## Purpose

Single source of truth for what FlowOS has **shipped**, **partially built**, **placeholder**, or **deferred** — and how modules relate in navigation. Prevents re-debating built vs planned features.

For SRS future enhancements (FE-1–FE-13), see [../archive/project/03-future-enhancements.md](../archive/project/03-future-enhancements.md).

---

## Navigation status

[Information Structure](../03-experience/information-structure.md) owns the current organization, grouping, labels, and experiential role of primary destinations. This inventory owns delivery status and implementation-level notes for the modules that realize it.

The currently configured navigation is an implementation reference at `src/config/sidebar-navigation.tsx`. Current sequencing and unresolved delivery work belong in the [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md) and the relevant delivery records, not in this inventory. The [Feature Catalog](../04-features/feature-catalog.md) is the canonical bridge from this detailed snapshot to feature dossiers.

---

## Shipped modules (nav-visible)

| Module | Route | Status | SRL phase | Phase 3 impact |
|--------|-------|--------|-----------|----------------|
| Today | `/` | **Shipped** — default home (execution + intelligence) | Performance | Keep; focus as mode long-term |
| Schedule | `/schedule` | **Shipped** — primary Workspace nav | Forethought | Keep global; simplify third scheduling surface later |
| Tasks | `/tasks` | **Shipped** | Forethought | Keep; secondary access via command palette + inline capture |
| Habits | `/habits` | **Shipped** | Forethought + Performance | Keep; inline on Today |
| Focus | `/focus` | **Shipped** | Performance | Reframe page as history/analytics; focus becomes mode |
| Reflection | `/reflection` | **Shipped** | Self-reflection | Keep; unify save behavior; evening nudge |
| Notes | `/notes` | **Shipped** — primary Workspace nav | Self-reflection (supplementary) | Keep global; no kanban expansion in Phase 3 |

---

## Authentication & account

| Feature | Route | Status | Notes |
|---------|-------|--------|-------|
| Login | `/login` | Shipped | Supabase email/password |
| Register | `/register` | Shipped | Email confirmation flow |
| Auth callback | `/auth/callback` | Shipped | OAuth/code exchange |
| Settings | `/settings` | Shipped | Preferences, durations |
| Account | `/account` | Shipped | Profile management |
| Session middleware | — | Shipped | `/workplace` in `PROTECTED_PREFIXES` (M1) |
| Live demo (guest) | `/login` CTA | **In progress** | Anonymous auth + seed clone; spec [flowos-live-demo-spec.md](../review/design/flowos-live-demo-spec.md) · runbook [flowos-live-demo.md](../execution/runbooks/flowos-live-demo.md) |
| Demo feedback wall | — | **In progress** | `demo_feedback` table SQL — run `supabase/demo_feedback.sql` on project |

---

## Workplace sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Focus timer card | Shipped | Controls always visible (`TimerHoverControls alwaysVisible` on both call sites) |
| Timeline embed | Shipped | Third scheduling surface — Phase 3.4 simplification |
| Today's tasks card | Shipped | Primary task execution on Workplace |
| Habits card | Shipped | Daily habit completion |
| Daily note card | **Removed** | Dropped from Today grid; use Notes sidebar / `Ctrl+Shift+D` |
| Quick add card | Shipped | Inline Enter capture (optimistic queue); icon strip; `ListPlus` full form |
| Workplace density presets | Shipped | `full` \| `work` (default) \| `focus` — `workplace-density.ts` |
| Today status rail | Shipped | Compact chrome on `/`; Full density inline KPI + smart Next Action |
| Schedule reminders (MVP) | **Shipped** | Today tasks/habits → in-app toast + browser Notification API; once-only local delivery; spec: [notification-system-mvp-spec.md](../review/design/notification-system-mvp-spec.md) |
| **Agenda card** | **Dead code** | Component exists but **not imported** — delete in security week; not user-visible |
| Focus reflection modal | Shipped | Post-session capture |

---

## Dashboard sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| KPI tiles (tasks, habits, focus) | Shipped | Full density only on Today (inline in status rail) |
| On-track status | Shipped | Shown in Today status rail |
| Next action recommendation | Shipped | Hidden by default (Work density); in-place on `/` when shown |
| Upcoming schedule preview | Shipped | Links to wrong surfaces |
| Task/habit previews | Shipped | — |

Logic: `flowos/src/lib/dashboard-command.ts`

---

## Tasks sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Kanban board by group | Shipped | Custom pointer drag; dnd-kit foundation installed |
| Quick schedule drawer | Shipped | Second scheduling surface |
| Task dialog (create/edit) | Shipped | Modal capture path |
| Priority, duration, alerts | Shipped | GTD clarify |
| Planning states (Today/Later/date) | Shipped | Planning model overload — Phase 3.4 |
| Manual sort mode | Shipped | Requires explicit enable for drag reorder |
| Task groups with appearance | Shipped | Phase 2 accent dots |

---

## Focus sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Pomodoro / custom timer | Shipped | Workplace + Focus page |
| Session history | Shipped | `/focus` analytics |
| Focus heatmap | Shipped | Phase 2 contrast pass |
| Session targets | Shipped | SQL migration exists |
| Habit focus tracking | Shipped | Requires `track_with_focus` opt-in per habit |
| Reflection on session end | Shipped | Modal on Workplace |
| Schedule Break (modal + Next Break strip + break notifications) | **Shipped** | Quick-focus tab on Workplace focus card; preset/custom duration picker; spec: [schedule-break-modal-spec.md](../review/design/schedule-break-modal-spec.md) |
| Next Up queue (Focus execution layer) | **Shipped** | V2: persistent task-only ordered queue (`tasks.queue_order`), positional drop insertion, intentional start-focus handoff, and per-task active-session focus attribution; see [decision log](../execution/logs/decision-log.md#2026-07-10--next-up-v2-persistent-task-execution-queue) · [next-up.md](../design/focus/next-up.md) |

---

## Reflection sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Daily reflection questions | Shipped | Achievements, challenges, etc. |
| Custom reflection entries | Shipped | User-defined fields |
| Sidebar reflection (Workplace) | Shipped | **Dual save behavior** vs full page — Phase 3.5 |
| Weekly reflection layout | **Partial** | `/reflection/WeeklyReflection` exists; no auto-summary (FE-5) |
| Reflection kanbans | Shipped | SQL migration exists |

---

## Notes sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Daily notes list | Shipped | FE-2 implemented |
| Note editor | Shipped | — |
| Kanban boards | Shipped | Feature-rich; disconnected from daily loop |
| Growth areas | Shipped | Phase 2 explicitly excluded from accent sweep |
| Pinned notes / menu pin | Shipped | SQL migrations exist |

---

## Placeholder / hidden routes

| Feature | Route | Status | SRS | Action |
|---------|-------|--------|-----|--------|
| Goals | `/goals` | Placeholder | FE-1 | Hidden from nav; defer to Phase 4+ |
| AI Coach | `/ai-coach` | Not built | FE-4 | In middleware; hide or 404 |
| Weekly Review | `/weekly-review` | Partial | FE-5 | Secondary; no auto-summary |
| Future Work | `/future-work` | Info page | — | Portfolio/thesis reference |

---

## Global UX features

| Feature | Status | Notes |
|---------|--------|-------|
| Quick capture dialog | Shipped | Modal, tasks-only — Phase 3.2 inline capture replaces as default |
| Global shortcuts | Shipped | 4 shortcuts only — Phase 3.6 keyboard OS |
| Command palette | **Not built** | Phase 3.2 — table stakes |
| Global search | **Not built** | Part of command palette v1 |
| Onboarding | **Not built** | Post Phase 3.1 |
| Right sidebar (hover) | Shipped | Hover-reveal — accessibility concern |
| Feature usage tracking | Shipped | `src/lib/feature-usage.ts` + `supabase/feature_usage.sql` — module view/create/update/delete/complete/focus start-stop (owner reads via service role) |
| Vercel Web Analytics | Shipped | `@vercel/analytics` in root layout |

---

## SRS future enhancements (FE-1–FE-13)

| ID | Enhancement | Status | Phase / notes |
|----|-------------|--------|---------------|
| FE-1 | Goal Management | Partial / placeholder | Phase 4+ |
| FE-2 | Daily Notes | **Implemented** | Notes module |
| FE-3 | Daily Manifesto | Not implemented | Agenda card is fake placeholder |
| FE-4 | AI Assistant | Not implemented | Explicitly deferred |
| FE-5 | Weekly Reflection | Partial | Layout exists; no auto-summary |
| FE-6 | Music / Focus Integration | Not implemented | — |
| FE-7 | Advanced Analytics | Partial | Dashboard KPIs, heatmap; no report engine |
| FE-8 | Smart Notifications | Partial | MVP schedule reminders shipped (Today toast + browser API + center); smart routing / push still deferred — [notification-system-mvp-spec.md](../review/design/notification-system-mvp-spec.md) |
| FE-9 | Mobile Apps | Not planned | Web-only |
| FE-10 | Gamification | Not implemented | — |
| FE-11 | Calendar Sync | Not planned | Out of original scope |
| FE-12 | Voice Assistant | Not implemented | — |
| FE-13 | Distraction Management | Not implemented | Focus sessions exist; no OS-level blocking |

Full detail: [../archive/project/03-future-enhancements.md](../archive/project/03-future-enhancements.md)

---

## Explicitly deferred (do not build until daily loop validated)

- Goals module build-out  
- AI Coach  
- Gamification  
- Calendar sync  
- Mobile apps  
- Music integration  
- Voice assistant  
- Light theme  
- Distraction management (OS-level)  
- Notes kanban expansion  
- Weekly reflection auto-summary  

---

## Design system (not features)

| System | Status | Source |
|--------|--------|--------|
| Visual Design System V3 + Tokyo Night Warm | **Shipped** | [DESIGN_SYSTEM_V3.md](./DESIGN_SYSTEM_V3.md) · [TOKYO_NIGHT_WARM](./DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) |
| Visual Design System (legacy navy / v2 / Neutral Dark) | Historical | [archive/design/themes/](../archive/design/themes/) |
| Design audit / Phases 0–2 | Historical | [archive/design/july-3/](../archive/design/july-3/) |

---

## Related documents

- [../archive/project/03-future-enhancements.md](../archive/project/03-future-enhancements.md) — SRS FE-1–FE-13  
- [../04-features/feature-catalog.md](../04-features/feature-catalog.md) — canonical feature-domain coverage and documentation status
- [../07-strategy-and-delivery/mvp-implementation-masterplan.md](../07-strategy-and-delivery/mvp-implementation-masterplan.md) — current pre-dogfood implementation sequence
- [../strategy/execution-masterplan.md](../strategy/execution-masterplan.md) — transitional historical milestone context
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) — implementation stack  
- [../archive/foundation/INFORMATION_ARCHITECTURE.md](../archive/foundation/INFORMATION_ARCHITECTURE.md) — full IA doc (archived)  
