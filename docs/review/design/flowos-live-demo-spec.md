# FlowOS Live Demo Specification

**Date:** July 20, 2026  
**Status:** Spec v1.2 — **approved** (founder 2026-07-20) → runbook + implementation  
**Audience:** Founder, reviewers, implementers  
**Live target:** https://flowos-sage.vercel.app  
**Related:** [PRODUCT_VISION.md](../../foundation/PRODUCT_VISION.md) · [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md) · [notification-system-mvp-spec.md](./notification-system-mvp-spec.md) · [About page](../../../src/components/about/about-page-content.tsx) · [decision-log](../../execution/logs/decision-log.md) · [runbook](../../execution/runbooks/flowos-live-demo.md)

**v1.1 patch (2026-07-20):** Added entity seed matrix, page×action matrix, relative dating rule, search/notifications gating, clone/purge algorithm, client-state wipe list. Corrected overclaims vs FEATURE_INVENTORY.  
**v1.2 audit (2026-07-20):** Branch added **Schedule reminders MVP** (task/habit alert-before → in-app toast + browser Notification API). Live demo must seed and exercise that path. Still gated: global search, smart/push notification routing. See §9.8, §16, §17, §21.

---

## 1. Goal

Create a **fully interactive demo workspace** that showcases the complete FlowOS experience **without signup**.

The demo must feel like a real productivity system used by an ambitious student/professional over multiple days — not empty modules, not fake chrome.

Visitors should be able to:

- Explore every shipped module
- Edit, complete, and create tasks / habits / notes / reflections
- Start focus sessions and use Next Up
- Modify schedule / timeline
- Leave public feedback (comment / rate / report a bug) **without logging in**
- See **schedule reminders** fire for today’s timed tasks/habits (in-app toast; browser OS notification if permission granted)

**Not claimed for v1:** global search / command palette; smart/push notification routing; fake “reflection due / overdue inbox” center. See §9.8 and §16.

The demo must stay responsive and realistic while **preventing permanent corruption of the shared seed**. Each visitor gets an isolated session; seeded baseline can always be restored.

**Conversion intent (resume / portfolio demo):**  
A visitor opens the Vercel URL → clicks **Enter as Guest** → lands in a believable workspace → thinks *"I wish this were already my system"* — not *"this is obviously dummy data."*

---

## 2. Scope for this review

| In scope | Out of scope (defer) |
|----------|----------------------|
| Guest entry from marketing/login surface | Real account signup changes beyond a clear CTA |
| Seeded multi-day workspace + user story | Shipping Goals / AI Coach / future modules |
| 30-minute session + local persistence + reset | Mobile-first redesign |
| Demo banner + Restart Demo | Team / multiplayer demos |
| Public feedback wall (DB-backed, no auth) | Full moderation console (v1: light rate limits + admin read) |
| Spec + seed script design | Production billing / waitlist |

**Authority after review:** Promote accepted decisions to [decision-log.md](../../execution/logs/decision-log.md), then a runbook under `docs/execution/runbooks/`.

---

## 3. Demo entry (no signup)

### 3.1 Landing / login surface

On https://flowos-sage.vercel.app (login or marketing entry), primary guest path:

```
Try Live Demo
No signup required.
Explore every feature in a fully populated workspace.

[ Enter Demo Workspace ]

Small disclaimer:
Changes are temporary and automatically reset.
```

Secondary: existing **Sign in** / **Create account** for real users.

### 3.2 Click path (happy path)

1. Visitor opens production URL.
2. Clicks **Enter Demo Workspace** (alias: **Continue as Guest**).
3. App creates a **temporary anonymous demo session** (no email, no password).
4. Seeded workspace loads (persona + multi-day data + user-story narrative).
5. Visitor can do **anything a logged-in user can** on shipped modules.
6. Optional: open **Feedback** to comment / rate / report a bug (persists to DB globally).

### 3.3 Auth model (proposal for review)

| Option | How it works | Pros | Cons |
|--------|--------------|------|------|
| **A — Anonymous Supabase Auth** | `signInAnonymously()`; row scoped to `auth.uid()`; seed cloned into that user | Closest to real app; RLS works | Needs cleanup job for expired demo users |
| **B — Shared demo user + client overlay** | One DB user; all guests share reads; writes go to IndexedDB overlay | Simple seed | Isolation hard; race conditions; not true “do anything” |
| **C — Client-only demo store** | Full seed in IndexedDB; no server writes for workspace | Strong isolation; easy reset | Divergence from real Supabase paths; double maintenance |

**Recommended for v1:** **Option A** — anonymous auth + clone seed into the new user, with a `demo_sessions` metadata flag and TTL cleanup. Feedback table is separate and does **not** require the demo user to stay forever.

---

## 4. Session rules

### 4.1 Duration

- **Default TTL:** 30 minutes from session start.
- Persist `demoSessionStartedAt` (+ optional `demoSessionId`) in browser storage.

### 4.2 After expiry

Modal:

```
Your demo session has expired.
Start a new demo session to continue exploring.

[ Restart Demo ]
```

Restart = wipe local/session workspace state → re-clone seed → new 30-minute window.

### 4.3 Browser refresh

Refreshing must **not** wipe the workspace immediately.

**Source of truth:** Supabase rows for the anonymous user (Option A).

Also persist:

- `localStorage` for session metadata (TTL, flags, banner prefs) and UI prefs (§18)
- Do **not** maintain a second workspace copy in IndexedDB for v1 (avoids dual-write drift)

On reload: restore session if `now < demo_expires_at` (and local startedAt consistent), else show expiry dialog.

### 4.4 Reset conditions

Reset (restore original seed) when:

| Trigger | Behavior |
|---------|----------|
| Session expires | Expiry dialog → Restart |
| **Restart Demo Workspace** (profile menu) | Immediate re-seed |
| Explicit **Reset Demo** control | Same as restart |
| Storage / server session older than 30 minutes | Treat as expired |
| User starts a new demo from landing | Fresh session |

### 4.5 Isolation

- Each visitor receives an **isolated** workspace.
- No guest’s edits appear in another guest’s Today / Tasks / Focus / etc.
- Feedback comments are the **only** intentionally shared surface (public wall).

---

## 5. Demo chrome (UI)

### 5.1 Banner

Subtle, persistent badge — not a modal wall:

```
Demo Workspace · Changes reset after 30 minutes
```

Optional secondary line: “Leave feedback anytime.”

### 5.2 Profile / account menu (demo mode)

| Item | Behavior |
|------|----------|
| My Account | Show “Demo Guest” + session remaining time |
| Settings | Working prefs (same as product) |
| Appearance | Dark-only (current product) |
| About | Full About page |
| **Restart Demo Workspace** | Re-seed + new TTL |
| Feedback | Opens comment / rate / bug panel |
| Exit Demo | End session → return to login/landing |

Do **not** show fake “Edit profile / Change password / coming soon” stubs in demo mode.

### 5.3 Empty states

**Forbidden for demo.** Every nav-visible module must open with believable data so the visitor never asks: *“Does this feature actually exist?”*

---

## 6. Persona & narrative (the story)

### 6.1 Persona — “Aisha Rahman”

| Field | Value |
|-------|--------|
| Name | Aisha Rahman |
| Role | CS student · aspiring product engineer |
| Context | Final year; internship applications; building a side project (FlowOS-like habits) |
| Timezone | Asia/Kuala_Lumpur (or app default) |
| Tone | Ambitious, structured, slightly imperfect — misses habits, tweaks UI too long |

This is **not** placeholder lorem. It is one coherent person’s workspace across several weeks of use.

### 6.2 North-star loop (what “using FlowOS properly” means)

```
Capture → Plan → Execute → Reflect → Improve
```

| Phase | In FlowOS | Demo must show |
|-------|-----------|----------------|
| **Capture** | Quick add, inbox tasks, notes | Inbox + daily note with raw captures |
| **Plan** | Tasks planned/scheduled, habits, timeline | Today + future days populated |
| **Execute** | Today completion, Focus, Next Up | Active/queued focus work |
| **Reflect** | Reflection + mood/energy | Filled today + recent history |
| **Improve** | Streaks, stats, weekly patterns | Charts with believable variance |

---

## 7. Example user stories (for reviewers + seed narrative)

These stories both (a) explain how a real user should use FlowOS and (b) justify what the seed contains. Implementers should be able to walk the demo and *perform* each story.

### US-1 — Morning open (Today as home)

**As** Aisha, **I want** to open FlowOS and see today’s plan immediately, **so that** I know what to do next without opening four apps.

**Acceptance in demo:**

- `/` (Today) shows tasks, habits, timeline slice, focus entry, status rail with non-zero KPIs.
- Next action / Next Up is coherent with seeded “deep work” task.

### US-2 — Capture then plan

**As** Aisha, **I want** to dump a thought into inbox then schedule it, **so that** capture never blocks planning.

**Demo walk:**

1. Add task via quick add: “Email lecturer about FYP meeting”.
2. Move/schedule onto Tuesday afternoon.
3. Refresh — task still present (within TTL).

### US-3 — Deep work block

**As** Aisha, **I want** to start a focus session on my top task with a Next Up queue, **so that** I stay in one flow.

**Demo walk:**

1. Open Focus / Today focus card.
2. Active task: **Build FlowOS Demo Experience** (or seeded equivalent).
3. Next Up: Finalize Resume → Review Reflection → Read Research Paper.
4. Start session; pause; complete; optional post-session reflection prompt.

### US-4 — Habits without perfectionism

**As** Aisha, **I want** to check off habits and see streaks that aren’t 100%, **so that** the system feels honest.

**Demo walk:**

- Some habits completed today; some missed yesterday; streaks vary (3–40 days).

### US-5 — Evening reflection

**As** Aisha, **I want** to close the day with what went well / wrong + mood, **so that** tomorrow starts with context.

**Demo walk:**

- Reflection populated for Today; edit a field; navigate away and back — persisted in session.

### US-6 — Multi-day planning

**As** Aisha, **I want** to see past weekend work and next week blocks, **so that** FlowOS feels like a continuous system, not a single-day toy.

**Demo walk:**

- Schedule / timeline shows relative past days (D-2, D-1) and future (D+1…D+4).

### US-7 — Notes as a second brain

**As** Aisha, **I want** mindset + project notes beside execution, **so that** planning isn’t only a task list.

**Demo walk:**

- Folders exist; Daily Note, Mindset, Project notes open with real prose.

### US-8 — Guest feedback without account

**As** a visitor, **I want** to rate the demo and report a bug without signing up, **so that** founders get signal and I don’t hit a wall.

**Demo walk:**

1. Open Feedback.
2. Submit rating + comment or bug.
3. See own submission on the public list (or confirmation).
4. Reload — feedback still there (DB).

### US-9 — Restart cleanly

**As** a visitor who “broke” the seed, **I want** Restart Demo, **so that** I can show someone else the intended story.

### US-10 — Schedule reminder (MVP)

**As** Aisha, **I want** a reminder before a timed task starts, **so that** I don’t miss deep-work blocks.

**Demo walk:**

1. Seed includes ≥1 incomplete today-task with `scheduled_time` a few minutes after clone and `notification_enabled` + `notification_lead_minutes` (e.g. 5).
2. Stay on Today; when wall-clock hits reminder/start, in-app schedule-reminder toast appears.
3. Dismiss toast; refresh must **not** re-fire the same event (once-only delivery).
4. Optional: set Alert before on another task → may prompt browser notification permission (never on cold demo enter).

---

## 8. Demo workspace timeline (relative dates)

**Rule (non-negotiable):** Do **not** hardcode calendar weekdays like “Monday = today.”

Seed dates are computed from the visitor’s **local calendar date** at session start (`demoAnchorDate = todayLocal`):

| Band | Relative offsets | Example if today = Wed 2026-07-22 |
|------|------------------|-------------------------------------|
| **Past** | `D-2`, `D-1` | Mon, Tue |
| **Today** | `D+0` | Wed (current) |
| **Near future** | `D+1`, `D+2` | Thu, Fri |
| **Later week** | `D+3`, `D+4` | Sat, Sun |

Narrative copy in the seed pack may still *sound* like a weekday routine (morning planning, evening reflection); labels in UI come from real dates.

All `scheduled_date`, `reflection_date`, `note_date`, `habit_completions.completion_date`, and `focus_sessions.started_at` must be derived from `demoAnchorDate` + offset at **clone time**, then stored on the anonymous user rows.

Pin `DEMO_SEED_VERSION` (e.g. `2026-07-20.1`) so restarts always re-resolve relative to the new anchor.

This demonstrates planning history **and** future planning without lying about the visitor’s clock.

---

## 9. Seed content requirements

### 9.1 Dashboard / Today KPIs (example targets)

Believable, not perfect:

| Metric | Example |
|--------|---------|
| Tasks | 6 / 9 |
| Habits | 3 / 5 |
| Focus | 4h 12m |
| On Track | ~82% |

Charts: soft variance across the past week (not flat lines).

### 9.2 Tasks (~30)

Mix states: Inbox · Planned · Completed · High priority · Recurring · Deep work · Quick tasks.

**Example titles (seed list):**

- Finish Software Engineering Report  
- Prepare Internship Resume  
- Research AI Productivity Systems  
- Reply to Team Messages  
- Review Database Schema  
- Clean Workspace  
- Submit Assignment  
- Book Dentist Appointment  
- Call Parents  
- Buy Protein Powder  
- Design Landing Page  
- Fix Timeline Bug  
- Weekly Planning  
- Review Reflection  
- Build FlowOS Demo Experience  
- Study Distributed Systems  
- Read Research Paper  
- Finalize Resume  

Include: completed, overdue, today, future, inbox, scheduled.

### 9.3 Habits

Examples: Morning Planning · Exercise · Drink Water · Read Book · Mathurat · Skincare · Journal · Sleep Before 11PM · Meditation · Review Goals.

- Varied streaks  
- Some completed today  
- Some missed on Sat/Sun  

### 9.4 Timeline (Today looks alive)

Morning habits → Planning → Deep work → Lunch → Study → Meeting → Exercise → Reading → Reflection → Evening planning.

### 9.5 Focus

**Today analytics (example):**

| Stat | Value |
|------|-------|
| Today | 4h 18m |
| Longest | 1h 45m |
| Average | 42 min |
| Break | 26 min |
| Sessions | 8 |

Also: past-week history, monthly chart, daily totals, heatmap, productive hours.

**Focus workspace:**

- Current: Build FlowOS Demo Experience  
- Next Up: Finalize Resume · Review Reflection · Read Research Paper  
- Continue queue: Design Landing Page · Study Distributed Systems  
- Realistic accumulated focus time on tasks  

### 9.6 Reflection

Populate every shipped section for Today (+ light history):

- What went well (4 bullets)  
- What went wrong (3 bullets)  
- Custom entries  
- Mood / Energy / Sleep / Weight (example values OK)  
- Boards: Learning · Ideas · Life · Career with cards  

### 9.7 Notes

Folders: Pinned · Mindset · Daily Notes · Projects · Career · Learning  

Examples:

- **Daily Note** — priorities, workout, call mom, review reflections  
- **Mindset** — consistency, systems, protect focus  
- **Project** — FlowOS roadmap notes, launch checklist, competitor research  

*(Roadmap notes are personal notes content — not a product “Future roadmap” marketing section.)*

### 9.8 Statistics / search / notifications

**Statistics (shipped surfaces only):**

- Populate Today KPIs, Focus history/heatmap, habit streaks, task completion counts that the product already computes from DB rows.
- Do **not** invent a separate “Statistics” or “Monthly Review” page if it is not nav-shipped.
- `/weekly-review`, `/goals`, `/ai-coach` stay hidden/404 in production — **do not seed placeholders**.

**Global search — GATE (not shipped):**

- FEATURE_INVENTORY: Global search / command palette = **Not built**.
- Demo v1 must **not** claim search works.
- Hide search UI in demo mode or show honest empty: “Search comes in a later release.”
- Seed titles remain findable via module lists (Tasks, Notes, etc.).

**Schedule reminders MVP — INCLUDE (shipped):**

Authority: [notification-system-mvp-spec.md](./notification-system-mvp-spec.md) · FEATURE_INVENTORY “Schedule reminders (MVP)” · code: `schedule-reminder-events.ts`, `ScheduleReminderProvider`, `browser-notifications.ts`, `tasks.notification_lead_minutes`.

| Channel | Demo requirement |
|---------|------------------|
| In-app toast | Must fire within a typical 30m session via seeded near-future times (§21) |
| Browser Notification API | Bonus when guest grants permission; **never** request on Enter Demo |
| Once-only delivery | `flowos.schedule-reminders.delivered` — restart clears it (§18) |
| Alert-before UI | Tasks with `notification_enabled` + `notification_lead_minutes`; habits with `scheduled_time` |

**Still gated (do not fake):**

- Smart routing, push, service workers, quiet hours, snooze product
- Seeded “reflection available / generic overdue inbox” marketing feed
- Full Notification Center as a standalone product claim — if UI only lists real schedule-reminder deliveries, that is OK; do not invent other kinds

**Also allowed:** Schedule Break (focus) reminders when the visitor schedules a break — product behavior, not a seeded fake feed.

If a shipped surface has no data hook yet, either seed it or hide it in demo mode — **never leave a blank “coming soon” page** on the demo path.

---

## 10. Public feedback (comments / rate / bugs) — DB-backed

### 10.1 Goal

Any guest (and any visitor) can **comment, rate, and report bugs** without login. Submissions **persist in the database** so they survive session reset and are visible for founder review.

This is separate from the temporary demo workspace.

### 10.2 Entry points

- Demo banner link: **Feedback**  
- Account menu: **Feedback**  
- Optional: floating control (subtle) on demo sessions only  

### 10.3 Submission types

| Type | Fields |
|------|--------|
| **Comment** | Display name (optional), body, created_at |
| **Rating** | 1–5 stars + optional short note |
| **Bug** | Title, steps (optional), severity (low/med/high), body |

Single form with type toggle is fine for v1.

### 10.4 Suggested schema (`demo_feedback`)

```sql
create table public.demo_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('comment', 'rating', 'bug')),
  display_name text,                    -- optional; default 'Guest'
  body text not null,
  rating int check (rating is null or (rating between 1 and 5)),
  severity text check (severity is null or severity in ('low', 'medium', 'high')),
  page_path text,                       -- optional context
  user_agent text,
  demo_session_id text,                 -- correlate, not auth
  is_public boolean not null default true,
  is_hidden boolean not null default false  -- soft moderation
);

-- RLS: anyone can INSERT; anyone can SELECT where is_public and not is_hidden
-- UPDATE/DELETE: service role / founder only
```

### 10.5 Anti-abuse (minimum for live demo)

- Rate limit: e.g. 5 submissions / IP / hour (edge or DB function)  
- Max body length (e.g. 2k chars)  
- Honeypot field  
- Soft-hide flag for founder (no public delete UI in v1)  

### 10.6 UI

- List recent public feedback (newest first)  
- Empty list copy: “Be the first to leave feedback.”  
- Success toast; form clears  
- Bug type visually distinct  

---

## 11. What must work for a live resume demo (checklist)

Treat this as the **gate before announcing the demo URL**.

### 11.1 Product surfaces (shipped modules)

| Surface | Must work in demo |
|---------|-------------------|
| Today (`/`) | KPIs, tasks, habits, timeline/focus entry, quick add, density presets, right sidebar panels |
| Tasks | Board/groups, complete, create, edit, schedule, Next Up queue order |
| Habits | Check-in, streaks via completions, optional track_with_focus |
| Schedule | Multi-day relative seed; create/move |
| Focus | Start/pause/stop; history/analytics from seeded sessions; Next Up; Schedule Break |
| Notes | Growth areas + notes editable; pinned; light kanban if shown |
| Reflection | Read/edit today; custom entries; kanban boards; sidebar panel |
| Settings / Appearance / About | No stub “coming soon” traps |
| Auth exit | Return to landing; restart demo |
| Schedule reminders (MVP) | Seed near-future timed tasks/habits; toast fires; once-only; Alert-before editable (§21) |
| Search | **Out of v1** — gated until built |
| Smart / push notifications | **Out of v1** — gated |

### 11.2 Demo platform

| Capability | Required |
|------------|----------|
| Enter without signup | Yes |
| Isolated guest session | Yes |
| Seed clone on enter | Yes |
| Persist across refresh (≤30m) | Yes |
| Expiry + Restart | Yes |
| Restart from menu | Yes |
| Demo banner | Yes |
| Feedback → Supabase | Yes |
| TTL cleanup of demo users/data | Yes (cron or scheduled function) |
| RLS: guests can’t read other guests’ workspace | Yes |
| RLS: feedback insert/select public rules | Yes |

### 11.3 Content quality

| Bar | Required |
|-----|----------|
| Coherent persona | Yes |
| ~30 tasks with mixed states | Yes |
| Habits with imperfect streaks | Yes |
| Focus history + heatmap believable | Yes |
| Reflection + notes prose (not lorem) | Yes |
| No empty primary pages | Yes |
| User stories US-1…US-9 walkable | Yes |

### 11.4 Ops / resume readiness

| Item | Required |
|------|----------|
| Production URL stable | Yes |
| Seed version pinned (`DEMO_SEED_VERSION`) | Yes |
| One-click restart recovers known-good story | Yes |
| Founder can read feedback in Supabase or simple admin view | Yes |
| Disclaimer: temporary workspace | Visible |
| Real signup still available | Yes |

---

## 12. Implementation sketch (for later runbook)

Not implementation — sequencing for review.

| Phase | Deliverable |
|-------|-------------|
| **P0 — Spec lock** | This doc reviewed (§15); decisions in decision-log |
| **P1 — Seed pack** | Typed seed per §17 + relative date resolver (§8) |
| **P2 — Guest session** | Option A clone/purge (§19) + TTL + banner + restart + client wipe (§18) |
| **P3 — Surface QA** | Walk §16 page×action matrix on production seed |
| **P4 — Feedback** | `demo_feedback` migration + UI + rate limit |
| **P5 — Landing CTA** | Enter Demo on login/marketing |
| **P6 — Hardening** | Cleanup job, abuse checks, seed versioning, quota |
| **P7 — Announce** | Resume / portfolio / share link |

---

## 13. Demo philosophy (non-negotiable)

The demo should tell a **believable story**.

This is not fake placeholder data.  
This is the workspace of someone actively using FlowOS for several weeks.

Every page should reinforce:

> Capture ideas instantly.  
> Plan intentionally.  
> Execute deeply.  
> Reflect consistently.  
> Improve continuously.

**Success metric (qualitative):**  
Visitors think *"I wish this were already my workspace"* — not *"This is obviously dummy data."* That emotional shift is what converts curious visitors into actual users.

---

## 14. Open questions for review

| # | Question | Decision (2026-07-20) |
|---|----------|------------------------|
| 1 | Auth model | **A — Anonymous Supabase Auth** + seed clone |
| 2 | Session length | **30 minutes** |
| 3 | Feedback visibility | **Public wall** (newest first; soft-hide for moderation) |
| 4 | Display name | Optional free text; default **Guest** |
| 5 | Overview/Dashboard | **No** — do not seed |
| 6 | Restart wipes client prefs | **Yes** — §18 wipe list; theme optional keep |
| 7 | Milestone fit | **Dedicated demo workstream** — may ship to production when ready; **not** an M2 exit gate |
| 8 | Anonymous Auth + quota | **Ops prerequisite** before P2 — enable on Supabase project; monitor row cost |

---

## 15. Review outcome

| Decision | Outcome |
|----------|---------|
| Approve spec? | **Yes** (v1.1 as locked) |
| Auth option | **A** — anonymous Supabase + clone |
| Feedback visibility | **Public wall** |
| Next artifact | **decision-log** + **runbook** [`flowos-live-demo.md`](../../execution/runbooks/flowos-live-demo.md) |

**Founder approval:** 2026-07-20 — proceed to implementation via runbook phases P1–P7.

---

## 16. Appendix A — Page × action matrix (acceptance)

Implementers must be able to tick every **Required** row on a seeded guest session.  
**Gated** = hide UI or do not claim in demo v1.

| Page | Action | Required | Notes |
|------|--------|----------|-------|
| Landing / login | Enter Demo Workspace | Yes | Creates anonymous session + clone |
| Today | View KPI rail (tasks/habits/focus/on-track) | Yes | Driven by seed rows |
| Today | Complete / uncomplete task | Yes | Persists to `tasks` |
| Today | Complete habit for today | Yes | Writes `habit_completions` |
| Today | Quick-add task (Enter) | Yes | Creates task |
| Today | Start / pause / stop focus | Yes | Uses focus card + session APIs |
| Today | Schedule Break (if focus active) | Yes | Shipped product path |
| Today | Switch density full/work/focus | Yes | Client pref; restart restores default |
| Today | Open right sidebar Notes / Reflection | Yes | Seeded content visible |
| Today | Post-session reflection modal | Yes | If session ends with prompt |
| Tasks | View board by `task_groups` | Yes | Groups required in seed |
| Tasks | Create / edit / complete task | Yes | |
| Tasks | Set priority, duration, planning_state | Yes | Inbox / later / scheduled mix |
| Tasks | Drag reorder (if sort mode on) | Nice | Manual sort mode |
| Tasks | Quick schedule drawer | Yes | Schedule onto relative future day |
| Tasks | Next Up `queue_order` visible/edit | Yes | Seed queue for deep-work story |
| Tasks | Set Alert before (`notification_lead_minutes`) | Yes | May request browser permission on first use — not on Enter Demo |
| Tasks | Receive schedule-reminder toast for today timed task | Yes | Seeded near-future fire (§21); dismiss; no re-fire on refresh |
| Habits | List habits + streaks | Yes | From completions history |
| Habits | Toggle completion | Yes | |
| Habits | Edit habit schedule days/time | Nice | |
| Habits | Timed habit fires schedule reminder | Yes | ≥1 habit with `scheduled_time` near clone wall-clock (§21) |
| Schedule | See D-2…D+4 blocks | Yes | Relative dates |
| Schedule | Create / move scheduled task | Yes | |
| Focus | Analytics from `focus_sessions` | Yes | Heatmap/history non-empty |
| Focus | Next Up queue start handoff | Yes | |
| Focus | Session saves `focus_session_task_totals` | Yes | When attributing to task |
| Notes | Open growth areas + notes | Yes | Map “folders” → `growth_areas` |
| Notes | Edit note content | Yes | |
| Notes | Pin / unpin | Nice | |
| Notes | Kanban board open + move card | Nice | Seed ≥1 board if UI reachable |
| Reflection | Edit went_well / went_wrong | Yes | |
| Reflection | Custom entries + kanbans | Yes | |
| Reflection | Sidebar panel save | Yes | Same session persist |
| Reflection /weekly | Weekly layout | Gated | Partial product — hide or minimal; no auto-summary claim |
| Settings | Change focus/break defaults | Yes | Writes focus-settings storage + applies |
| Appearance | View dark-only | Yes | |
| About | Read full About | Yes | No future roadmap marketing |
| Feedback | Submit comment/rating/bug | Yes | `demo_feedback` |
| Feedback | See public list (if chosen) | Yes | Public wall — approved §15 |
| Demo chrome | Banner + remaining time | Yes | |
| Demo chrome | Restart Demo Workspace | Yes | Re-clone + wipe client (§17–18) |
| Demo chrome | Exit Demo | Yes | Sign out anonymous + wipe client |
| Global search | Search seed titles | **Gated** | Not built |
| Smart / push notification product | Invented inbox kinds | **Gated** | FE-8 smart routing / push still deferred |
| Schedule reminder center (if UI exists) | Show real delivered schedule events only | Nice | Do not seed fake reflection/overdue marketing rows |
| Goals / AI / Weekly Review routes | Browse as product | **Out** | 404/hidden |

---

## 17. Appendix B — Entity seed matrix (what to store)

`DEMO_SEED_VERSION` pins content. Clone assigns fresh UUIDs remapped through an ID map.  
Volumes are **targets**, not hard caps.

### 17.1 Insert order (FK-safe)

1. Auth user (anonymous) + `user_metadata.is_demo=true`, `demo_seed_version`, `demo_anchor_date`, `demo_expires_at`  
2. `task_groups`  
3. `tasks` (incl. `queue_order` for Next Up)  
4. `habits`  
5. `habit_completions`  
6. `focus_sessions`  
7. `focus_session_task_totals`  
8. `reflections`  
9. `reflection_entries`  
10. `growth_areas`  
11. `notes`  
12. `kanban_boards` → `kanban_columns` → `kanban_cards`  
13. `growth_goals` (optional)  
14. Skip `note_conversions` and `weekly_reflection_layouts` unless UI requires them  

### 17.2 Tables & required fields

| Table | ~Rows | Required fields / seed rules |
|-------|------:|------------------------------|
| **task_groups** | 4–6 | `title`, `slug`, `sort_order`, `icon?`, `color?`, `sort_mode?` — include Inbox + Deep Work + Quick + Career (example) |
| **tasks** | ~30 | `title`, `description?`, `group_id`, `sort_order`, `queue_order` (null or 1…n for Next Up), `priority`, `duration_minutes`, `planning_state` (`none`\|`later`), `scheduled_date`/`scheduled_time` (relative), `completed`, `completed_at?`, **`notification_enabled`**, **`notification_lead_minutes`** — see §21 for live reminder subset |
| **habits** | ~10 | `name`, **`scheduled_time?`** (include ≥1 for today reminders), `days_of_week`, `track_with_focus` (1–2 true), `completed` (legacy — prefer completions table) |
| **habit_completions** | 40–80 | `habit_id`, `completion_date` across D-14…D+0 with intentional misses for imperfect streaks |
| **focus_sessions** | 15–25 | `focus_duration`, `break_duration`, `started_at`, `ended_at`, `session_status` (`completed`/`stopped`), `target_type`/`target_id` where attributed; span ~2 weeks for heatmap |
| **focus_session_task_totals** | 10–20 | `focus_session_id`, `task_id`, `focused_seconds` — drives accumulated focus on tasks |
| **reflections** | 3–5 | `reflection_date` (D+0 + D-1 + D-2), `went_well`, `went_wrong`, `custom_kanbans` JSON (Learning/Ideas/Life/Career) |
| **reflection_entries** | 4–8 | `reflection_id`, `title`, `content` (mood/energy/sleep/weight style custom fields) |
| **growth_areas** | 5–6 | `name`, `emoji`, `description?`, `sort_order` — Mindset, Daily Notes, Projects, Career, Learning (+ Pinned area or use `is_pinned` on notes) |
| **notes** | 8–15 | `growth_area_id`, `title`, `content` (real prose), `is_pinned`, `is_menu_pinned`, `note_date?` for daily notes |
| **kanban_boards** | 1–3 | Under growth areas that expose boards |
| **kanban_columns** | 3–12 | Per board |
| **kanban_cards** | 8–20 | Believable titles (no lorem) |
| **growth_goals** | 0–5 | Optional |
| **weekly_reflection_layouts** | 0 | Skip unless weekly UI shown |
| **note_conversions** | 0 | Skip for v1 |
| **demo_feedback** | n/a | Not seeded; user-generated; survives reset |

### 17.3 Task state mix (acceptance)

Among ~30 tasks, include at least:

| Bucket | Count guide |
|--------|-------------|
| Inbox (unscheduled, `planning_state` none) | 4–6 |
| Later | 3–5 |
| Scheduled today | 5–8 |
| Scheduled future (D+1…D+4) | 5–8 |
| Completed (today + past) | 6–10 |
| Overdue (`scheduled_date` < D+0, not completed) | 1–3 |
| In Next Up (`queue_order` not null) | 5–7 |
| High priority | 3–5 |
| Reminder-enabled today timed (`notification_enabled` + time) | ≥2 (one for live fire in-session — §21) |
| Alert-before set (`notification_lead_minutes` > 0) | ≥3 |

### 17.4 Content sources

Use §9 example titles/prose as the narrative pack; expand to full typed JSON/TS seed file in the runbook (`src/lib/demo/seed/` or similar). Persona: Aisha Rahman (§6).

---

## 18. Appendix C — Client state wipe list

On **Restart Demo**, **Exit Demo**, and **session expiry → Restart**, clear:

| Key / prefix | Why |
|--------------|-----|
| `flowos.focus.active` | Active timer must not leak |
| `flowos-focus-settings` | Reset to seed defaults (or product defaults) |
| `flowos.settings` | Avoid stale preference overlays |
| `flowos.schedule.notifications` | Local break/schedule notify map |
| `flowos.schedule-reminders.delivered` | Once-only schedule reminder delivery set |
| `flowos.browser-notification.prompted` | Permission prompt flag — reset so Restart can re-demo consent path if needed |
| `flowos.next-up.unified-order.v1` | Legacy/local queue order |
| `flowos.next-up.habit-refs.v1` | Habit queue refs |
| `flowos-workplace-module-visibility:*` | Today module chrome |
| `flowos-global-right-sidebar-*` | Width / expanded / panel |
| `flowos-growth-areas-expanded` | Notes chrome |
| `flowos-sidebar-collapsed` | Optional — may keep for UX continuity |
| `flowos.habit.completions` | If any client cache still used |
| `flowos.sidebar-notes.cache` (sessionStorage) | Stale sidebar notes |
| `flowos:later-column-sort-mode` | Tasks UI mode |
| Demo meta keys | `demoSessionStartedAt`, `demoSessionId`, `demoAnchorDate`, `DEMO_SEED_VERSION` local mirrors |

**Decision default:** Restart wipes the list above, then re-clones seed and writes demo defaults (density = `work`, right sidebar collapsed or notes panel once).  
**Optional keep:** `flowos.theme` (always dark anyway).

---

## 19. Appendix D — Clone / purge algorithm (Option A)

### 19.1 Enter Demo

```
1. signInAnonymously()
2. Set user_metadata: { is_demo: true, demo_seed_version, demo_anchor_date, demo_expires_at = now+30m }
3. Persist local meta: sessionId, startedAt, anchorDate, seedVersion
4. Run cloneSeed(userId, anchorDate, seedVersion):
     - Load immutable seed pack
     - Build uuidMap for every entity
     - Insert in FK order (§17.1) with user_id = userId and relative dates
5. Navigate to /
6. Show demo banner
```

### 19.2 Refresh (within TTL)

```
1. If supabase session exists and metadata.is_demo and now < demo_expires_at → continue
2. Else → expiry modal
```

Source of truth for workspace data = **Supabase rows for this uid** (not IndexedDB overlay).  
localStorage only holds session meta + UI prefs (§18).

### 19.3 Restart Demo

```
1. purgeDemoUserData(userId)  // delete child tables then optional re-auth
2. wipeClientDemoKeys (§18)
3. Re-run Enter Demo steps 2–6 with new anchorDate and new expires_at
```

Prefer **same anonymous uid** + delete rows + re-clone (simpler cookies) OR signOut + new anonymous user (cleaner RLS). Pick one in runbook; default recommendation: **same uid + purge + re-clone**.

### 19.4 Purge SQL order (child → parent)

Delete where `user_id = :id` (and join deletes for tables keyed only by parent):

1. `focus_session_task_totals`  
2. `focus_sessions`  
3. `habit_completions` (via habit ids or cascade)  
4. `habits`  
5. `tasks`  
6. `task_groups`  
7. `reflection_entries`  
8. `reflections`  
9. `kanban_cards` → `kanban_columns` → `kanban_boards`  
10. `notes`  
11. `growth_goals`  
12. `growth_areas`  
13. `note_conversions` / `weekly_reflection_layouts` if any  

Do **not** delete `demo_feedback`.

### 19.5 Exit Demo

```
1. purgeDemoUserData(userId) OR leave for TTL job
2. wipeClientDemoKeys
3. supabase.auth.signOut()
4. Redirect /login
```

### 19.6 TTL cleanup job (server)

Scheduled function (hourly):

- Find users with `raw_user_meta_data.is_demo = true` AND `demo_expires_at < now()` (or `last_sign_in` older than 24h safety net)
- Purge data (§19.4)
- Delete auth user (admin API)

Protect against runaway cost: cap concurrent demo users if needed; log clone counts.

### 19.7 Failure modes

| Failure | Behavior |
|---------|----------|
| Clone partial failure | Rollback purge + show “Demo failed to load — retry” |
| Anonymous auth disabled | Block CTA; founder ops checklist |
| Visitor exceeds rate (optional) | Soft limit new demos per IP |

---

## 20. Appendix E — Implementation readiness checklist

Before writing the runbook as “ready to code”:

- [x] §16 page×action rows agreed  
- [x] §17 seed volumes + field list agreed  
- [x] §8 relative dating agreed  
- [x] Search stays gated; schedule reminders MVP included (v1.2)  
- [x] Option A confirmed (+ Anonymous Auth enabled on project — **ops before P2**)  
- [ ] §19 purge job owner (Supabase cron / Edge / GitHub Action) — assign in P6  
- [ ] Cost estimate: ~100–200 rows × N guests/day — measure after P1 seed size known  
- [x] Feedback RLS reviewed (open insert risk acceptable with rate limit)  
- [x] §21 live reminder seed offsets agreed  

---

## 21. Appendix F — Schedule reminders seed (v1.2)

Clone-time wall clock = `T0` in the app timezone. Resolve times at **clone**, not as fixed clock strings in the static pack.

### 21.1 Must-seed for a live demo fire

| Entity | Fields | Clone-time rule |
|--------|--------|-----------------|
| Task A (live reminder) | `scheduled_date = D+0`, `scheduled_time = T0 + 6 min`, `notification_enabled = true`, `notification_lead_minutes = 5`, incomplete | Reminder fires ~`T0+1m`; start ~`T0+6m` |
| Task B (start only) | `scheduled_date = D+0`, `scheduled_time = T0 + 12 min`, `notification_enabled = true`, `notification_lead_minutes = null`, incomplete | Start toast ~`T0+12m` |
| Task C (UI sample) | Today or future, `notification_enabled = true`, `notification_lead_minutes = 10` | Shows Alert-before in task UI; may be past fire — OK |
| Habit H | Scheduled today, `scheduled_time = T0 + 9 min` | Habit start reminder in-session |

If clone happens near midnight, clamp fire times into the same calendar day (or skip live-fire tasks and rely on Alert-before UI + US-10 step 4).

### 21.2 Demo chrome rules

- **Do not** call `Notification.requestPermission` on Enter Demo / seed load.
- In-app toast is enough to prove the feature if OS permission is denied.
- Restart clears `flowos.schedule-reminders.delivered` so the story can fire again after re-clone with new `T0` offsets.

### 21.3 QA acceptance (add to P3)

- [ ] Within ~15 minutes of Enter Demo, at least one schedule-reminder toast appears without user configuring anything.  
- [ ] Dismiss + refresh does not re-show that event id.  
- [ ] Guest can open a task and change Alert before.  
- [ ] Schedule Break path still works independently (focus).  

---

*End of spec v1.2. Approved 2026-07-20 — implement via [flowos-live-demo.md](../../execution/runbooks/flowos-live-demo.md). v1.2 adds schedule reminders MVP coverage.*
