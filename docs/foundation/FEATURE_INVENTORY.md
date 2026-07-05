# Feature Inventory

**Status:** Living document  
**Audience:** Engineers, product lead  
**Last updated:** July 6, 2026 (Pass 5 — IA merged here; Session 3 focus-controls audit)

---

## Purpose

Single source of truth for what FlowOS has **shipped**, **partially built**, **placeholder**, or **deferred** — and how modules relate in navigation. Prevents re-debating built vs planned features.

For SRS future enhancements (FE-1–FE-13), see [../archive/project/03-future-enhancements.md](../archive/project/03-future-enhancements.md).

---

## Information architecture

### Current navigation

Eight sidebar items with **equal visual weight**. Source: `src/config/sidebar-navigation.tsx`

```
Overview
  └── Dashboard (/)          ← default landing (read-only intelligence)

Productivity
  ├── Workplace (/workplace) ← primary execution surface
  ├── Schedule (/schedule)
  ├── Tasks (/tasks)
  ├── Habits (/habits)
  ├── Focus (/focus)
  ├── Reflection (/reflection)
  └── Notes (/notes)
```

**Known problems (M2 addressing):** Dashboard at `/` vs execution at `/workplace`; eight equal nav items; three scheduling surfaces; focus as a destination page; no command layer. Diagnosis: [../archive/design/july-3/ux-friction-review.md](../archive/design/july-3/ux-friction-review.md).

### Target navigation (post M2/M3)

| Tier | Modules |
|------|---------|
| **Primary** | Today (`/`) — execution + inline intelligence; focus as overlay mode |
| **Secondary** | Overview (`/overview`), Tasks, Habits, Focus (history/analytics), Reflection |
| **Tertiary** | Schedule (fullscreen planner), Notes |

**Target flow:** Open → Today → inline capture / execute / focus → evening reflection. Command palette (`Cmd+K`) for search and jump.

### Module roles (target state)

| Module | Route | Verdict |
|--------|-------|---------|
| Dashboard | `/` | Demote to `/overview`; merge KPIs into Today |
| Workplace | `/workplace` | Become default home Today |
| Tasks | `/tasks` | Keep; secondary via palette + inline capture |
| Schedule | `/schedule` | Tertiary — "open fullscreen timeline" from Today |
| Habits | `/habits` | Keep; primary completion on Today |
| Focus | `/focus` | Mode on Today; page = history/analytics only |
| Reflection | `/reflection` | Keep; unify save behavior; evening nudge |
| Notes | `/notes` | Keep secondary; no kanban expansion until loop proven |

**M2 MVP bundle:** Today as home, next-action stays on Today, sidebar ≤ 5 items, inline capture, visible focus controls. Full plan: [../strategy/execution-masterplan.md](../strategy/execution-masterplan.md).

---

## Shipped modules (nav-visible)

| Module | Route | Status | SRL phase | Phase 3 impact |
|--------|-------|--------|-----------|----------------|
| Dashboard | `/` | **Shipped** — wrong default home | Performance (monitor) | Merge intelligence into Today; demote to `/overview` |
| Workplace | `/workplace` | **Shipped** — true execution surface | Performance | Become default home `/` |
| Schedule | `/schedule` | **Shipped** | Forethought | Demote to "open fullscreen timeline" action |
| Tasks | `/tasks` | **Shipped** | Forethought | Keep; secondary access via command palette + inline capture |
| Habits | `/habits` | **Shipped** | Forethought + Performance | Keep; inline on Today |
| Focus | `/focus` | **Shipped** | Performance | Reframe page as history/analytics; focus becomes mode |
| Reflection | `/reflection` | **Shipped** | Self-reflection | Keep; unify save behavior; evening nudge |
| Notes | `/notes` | **Shipped** (beyond original MVP) | Self-reflection (supplementary) | Keep secondary; no kanban expansion in Phase 3 |

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

---

## Workplace sub-features

| Feature | Status | Notes |
|---------|--------|-------|
| Focus timer card | Shipped | Controls always visible (`TimerHoverControls alwaysVisible` on both call sites) |
| Timeline embed | Shipped | Third scheduling surface — Phase 3.4 simplification |
| Today's tasks card | Shipped | NEXT queue (cap 5 + disclosures); unified task+habit rows when `NEXT_PUBLIC_TODAY_UNIFIED_QUEUE=true` |
| Habits card | Shipped | Interleaved into Today NEXT queue (V3 Session 6, flag); standalone card remains on `/habits` for management |
| Daily note card | Shipped | Overlaps Notes module |
| Quick add card | Shipped | Inline Enter capture (optimistic queue); icon strip; `ListPlus` full form |
| Workplace density presets | Shipped | `full` \| `work` (default) \| `focus` — `workplace-density.ts` |
| Today status rail | Shipped | Compact chrome on `/`; Full density inline KPI + smart Next Action |
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
| FE-8 | Smart Notifications | Not implemented | — |
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

## Design system (not features, but shipped)

| Phase | Status | Commit |
|-------|--------|--------|
| Design Audit | Complete | — |
| Phase 0 — Foundation | Complete | `5fc780a` |
| Phase 1 — Interaction | Complete | `04fe227` |
| Phase 2 — Accent language | Complete | `9f7e7c4` |
| Phase 3 — Daily loop | **Not started** | — |

Source: [../archive/design/july-3/project-state-july-2026.md](../archive/design/july-3/project-state-july-2026.md)

---

## Related documents

- [../archive/project/03-future-enhancements.md](../archive/project/03-future-enhancements.md) — SRS FE-1–FE-13  
- [../strategy/execution-masterplan.md](../strategy/execution-masterplan.md) — current milestone plan  
- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) — implementation stack  
- [../archive/foundation/INFORMATION_ARCHITECTURE.md](../archive/foundation/INFORMATION_ARCHITECTURE.md) — full IA doc (archived)  
