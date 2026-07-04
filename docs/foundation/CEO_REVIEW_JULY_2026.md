# CEO Review — July 2026

**Date:** July 3, 2026  
**Reviewers:** Independent product, UX, architecture, and startup advisory panel  
**Method:** Full read of `docs/project/`, `docs/design/`, `docs/foundation/`; codebase inspection where docs claim implementation state  
**Rule:** Code wins when documentation and implementation disagree  

**Status:** Highest-level decision document in the repository. Supersedes informal Canvas conversations. Does not modify other docs — reports drift where found.

---

## Section 1 — Executive Summary

### What FlowOS actually is today

FlowOS is a **feature-rich personal productivity web app** built by a solo founder on Next.js 16 + Supabase. It is **not** yet a daily productivity operating system in practice.

**What exists and works:**

| Area | Evidence | Assessment |
|------|----------|------------|
| Auth (login/register/email confirm) | `flowos/src/middleware.ts`, `components/auth/*` | Works for standard flows |
| Tasks (board, groups, priorities, scheduling) | `/tasks`, `tasks-board-view.tsx` (~2,500 lines) | Functional; complex |
| Habits (create, schedule, complete) | `/habits`, Workplace habits card | Functional |
| Workplace (timer, timeline, tasks, habits) | `/workplace`, `workplace-page-content.tsx` | **Best surface** — where real work happens |
| Dashboard (KPIs, next-action) | `/` → `DashboardPageContent` | Functional but **wrong default home** |
| Focus (sessions, history, heatmap) | `/focus` | Functional; disconnected from timer UX |
| Reflection (daily + weekly layout) | `/reflection`, sidebar panel | Functional; inconsistent save UX |
| Notes (editor, kanban, growth areas) | `/notes` | Functional; scope exceeds thesis MVP |
| Design system (Phases 0–2) | `docs/design/PROJECT_STATE.md`, commit `9f7e7c4` | Genuinely improved; frozen credibly at 7.8/10 visual |

**What does not work (product level):**

1. **No single daily home.** App opens on Dashboard (`/`); execution lives on Workplace (`/workplace`). Documented in [ux-friction-review.md](../design/ux-friction-review.md); confirmed in `page.tsx` and `sidebar-navigation.tsx`.
2. **Next-action routing is wrong.** Active focus → `/focus`; tasks → `/tasks` list; habits → `/habits` list. Code: `dashboard-command.ts` lines 118–124, 152, 164, 190; `schedule.ts` lines 46, 65.
3. **Eight equal nav items** with no hierarchy. Code: `sidebar-navigation.tsx`.
4. **No command palette.** Four global shortcuts only. Code: `use-global-shortcuts.ts`.
5. **Hover-gated focus controls.** Code: `workplace-focus-card.tsx` line 57 (`opacity-0` until `group-hover/timer`).
6. **Production build currently fails.** `npm run build` errors on `workplace-recover-day-bar.tsx` — imports non-existent `addMinutesToTime` from `date-utils.ts`. **Contradicts** [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) checklist implying build passes.

**What is overstated in documentation:**

| Doc claim | Code reality |
|-----------|--------------|
| Fake Agenda card "destroys trust daily" | `WorkplaceAgendaCard` exists but is **not imported anywhere** — dead code, not user-visible |
| `PROJECT_STATE.md`: `/` = "Today / Workplace", `/overview` = Dashboard | **`/` = Dashboard**, `/workplace` = Workplace, **no `/overview` route exists** |
| DEPLOYMENT: RLS "verify for production" | Core tables use **`using (true)`** — wide open. `tasks.sql`, `habits.sql`, `focus_sessions.sql`, `reflections.sql`. Notes module has proper user-scoped RLS (`notes.sql`) — inconsistent |
| Phase 3 "not started" | Partial stubs exist (`workplace-recover-day-bar.tsx`) — abandoned mid-implementation, breaking build |

### Maturity score

| Dimension | Score | Note |
|-----------|-------|------|
| Feature breadth | 8/10 | Too much for one engineer |
| Feature depth (core modules) | 7/10 | Tasks/habits/focus/reflection work |
| Product coherence | 4/10 | Eight modules, no center |
| Visual design | 7.8/10 | Phase 2 complete |
| Daily workflow UX | 4/10 | Friction review accurate |
| Engineering hygiene | 5/10 | Build broken; open RLS; no tests |
| Launch readiness | 3/10 | **Lower than DEPLOYMENT_READINESS.md (4/10)** due to build failure + RLS |
| Documentation quality | 8/10 | Excellent history; some drift from code |
| **Overall product** | **5.5/10** | Below foundation doc estimate of 6.0 |

### Classification

**Advanced portfolio MVP trending toward early startup — not yet either.**

| Label | Fits? | Why |
|-------|-------|-----|
| Student project | No | Scope, auth, 8 modules, design system program exceed typical thesis demo |
| Portfolio project | Partially | Visual quality supports this; workflow gaps undermine demo narrative |
| **MVP** | **Yes — best fit** | Core loops exist but minimum *product* loop (open → act → return) is broken |
| Early startup | Not yet | No users, no retention data, no deployable build, open RLS |
| Commercial product | No | Would not charge money today |

**Why MVP, not portfolio alone:** You are past "screenshot quality." You have real data persistence, multi-module workflows, and a documented roadmap toward retention. But you have not validated that anyone returns daily — which is the line between MVP and startup.

---

## Section 2 — Vision Review

### Is the vision differentiated?

**Academically yes. Commercially weak.**

The SRL cycle (forethought → performance → reflection) in [PRODUCT_VISION.md](./PRODUCT_VISION.md) and [../project/02-related-works.md](../project/02-related-works.md) is a coherent design framework. It is **not** a moat. Users do not search for "self-regulated learning apps." They search for less app switching and a clearer daily plan.

Competitors already market adjacent promises:

- **Sunsama** — "plan your day, execute, reflect"
- **Akiflow** — unified task + calendar workflow
- **Motion** — AI daily planning (different wedge, same category)

FlowOS's honest wedge today is **breadth at indie scale** — tasks + habits + focus + reflection in one dark workspace — **not** SRL terminology.

### Is SRL enough competitive advantage?

**No.** SRL is an **internal design lens**, not a user-facing differentiator. Keep it in [PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md). Remove it from elevator pitches until the experience proves it.

What *could* become differentiated:

- A genuinely seamless **plan → focus → reflect** loop in one screen (not yet built)
- Reflection informed by actual task/habit/focus data (partially exists, not surfaced in UX)
- "Lamplit desk" aesthetic for people who hate bright productivity apps (niche but real)

### Is "One Continuous Day" compelling?

**Internally yes. Externally unproven.**

The phrase is excellent **engineering direction** ([PRODUCT_PHILOSOPHY.md](./PRODUCT_PHILOSOPHY.md)). It is not yet **marketing copy** because the product contradicts it: two homes, three schedulers, modal capture, list-page detours.

A user would not understand "One Continuous Day" without experiencing it. They *would* understand: **"Stop opening four apps every morning."** Lead with the pain, not the philosophy.

### Would a user understand the positioning?

**Not from the product alone.** They would understand "task app with extras." The reflection and focus modules feel bolted on because navigation treats them as equals to Workplace.

### Is anything missing from the vision?

Yes:

1. **Explicit wedge statement** — who wins vs Sunsama/Todoist on day one (price? privacy? offline? thesis depth? pick one)
2. **Mobile stance in user terms** — "desktop-first daily driver" is honest; burying mobile in non-goals is correct but users will ask immediately
3. **Trust/privacy promise** — especially given open RLS on core tables; vision silent on data safety
4. **What "success" feels like emotionally** — not just metrics (WAD) but "end day without guilt" — reflection module hints at this but vision doesn't claim it

### Would we change the vision?

**Refine, not replace.**

| Keep | Change |
|------|--------|
| Integrated personal productivity OS | Lead with **outcome** ("one app for your whole day") not **theory** (SRL) |
| Self-directed knowledge workers as primary | Narrow alpha wedge: **people already using 3+ apps** |
| Non-goals (no AI, no teams, no mobile yet) | Add: **"We win on daily loop coherence, not feature count"** |
| One Continuous Day as internal principle | Don't market it until Phase 3.1 ships |

---

## Section 3 — Architecture Review

### Information architecture — challenge every decision

| Decision | Verdict | Evidence | Recommendation |
|----------|---------|----------|----------------|
| Dashboard separate from Workplace | **Wrong** | `/` vs `/workplace`; friction #1 | Merge KPIs + next-action into Workplace; redirect `/` → workplace or unified Today |
| Dashboard should exist long-term | **Optional at best** | KPIs have value; separate page doesn't | Collapse to collapsible header or weekly email digest later — not a nav item for alpha |
| Workplace → Today as home | **Correct** | `workplace-page-content.tsx` is the richest surface | Do it — but **rename in UI to "Today"** not "Workplace" (user language) |
| Focus as mode | **Correct** | Timer on Workplace; `/focus` is analytics | `/focus` becomes "Focus History"; start/continue always on Today |
| Notes independent module | **Questionable** | Overlaps daily note card; kanban is FE-2++ | **Demote** nav; keep route. Don't kill — but stop investing until retention proven |
| Reflection separate page | **Keep but secondary** | Sidebar auto-save vs page manual save | Default evening flow = sidebar on Today; full page for history/editing |
| Schedule standalone page | **Cut for alpha IA** | Third scheduling surface | Embed timeline on Today only; Schedule becomes fullscreen **action** not nav item |
| Eight sidebar items | **Too many** | `sidebar-navigation.tsx` | Alpha nav: **Today, Tasks, Habits, Focus History, Reflection** (5). Notes + Schedule as command-palette targets |
| Goals / AI Coach routes | **Delete from prod** | `goals/page.tsx`, `ai-coach/page.tsx` — roadmap placeholders | 404 or remove routes; middleware lists them as protected — pointless surface area |
| `/overview` route | **Doc fiction** | Planned in IA docs; **not implemented** | Either implement when demoting Dashboard or update docs (drift) |

### Feature architecture — simplify radically for alpha

**Minimum lovable architecture (MLA), not current architecture:**

```
Today (/)     — timeline + tasks + habits + focus timer + inline KPIs
Tasks         — board management (secondary)
Habits        — habit CRUD (secondary)
Focus History — analytics
Reflection    — daily + history
[Command K]   — jump to Notes, Schedule fullscreen, Settings
```

Delete from **navigation** (not codebase): Schedule, Notes, Dashboard as top-level items.

### Code architecture — honest assessment

| Pattern | Assessment |
|---------|------------|
| Next.js App Router + Supabase | Appropriate for solo founder |
| `tasks-board-view.tsx` ~2,528 lines | **Risk.** Hard to change safely during Phase 3 |
| Dual drag systems (pointer + dnd-kit) | Tolerable debt; not alpha blocker |
| Dead components (`WorkplaceAgendaCard`, `WorkplaceRecoverDayBar`) | **Delete or fix immediately** — recover-day breaks build |
| Split mock/supabase reflection paths | Complexity; verify only Supabase used in prod |
| Notes RLS proper; core tables RLS open | **Architecture inconsistency** — suggests Notes added later with more care |

**Could architecture become dramatically simpler?**

Yes. The simplest credible FlowOS is **Today + Tasks + Reflection** with habits inline and focus as timer mode. Schedule page, Notes kanban, weekly reflection, Goals, AI Coach, weekly-review route — all **optional layers** that can wait. You built a thesis **platform** when you need a **daily driver** first.

---

## Section 4 — UX Review (Workflow Only)

Simulated day for persona Alex ([USER_PERSONAS.md](./USER_PERSONAS.md)) — knowledge worker, desktop, 3 existing apps.

### Morning (open app → plan)

| Step | What happens | Problem | Impact |
|------|--------------|---------|--------|
| 1 | Lands on **Dashboard** `/` | Not where work happens | Critical |
| 2 | Reads next-action card | Suggests task/habit/focus | Good intelligence |
| 3 | Clicks next action | Routes to `/tasks`, `/habits`, or `/focus` **list pages** | Critical — breaks promise |
| 4 | User learns to click Workplace manually | Extra nav every session | Critical |
| 5 | Optional: open Schedule to plan | Third mental model | High |

**Unnecessary clicks to start work:** 2–3 minimum, every day.

### Planning (assign time, organize day)

| Friction | Impact |
|----------|--------|
| Planning model: group vs Today vs Later vs date | High — 10–30 decisions/day ([ux-friction-review.md](../design/ux-friction-review.md) #5) |
| Schedule on `/schedule`, drawer on Tasks, timeline on Workplace | High — triple surface (#4) |
| Manual sort mode for reorder | Medium (#19) |

### Execution (complete tasks, habits)

| Friction | Impact |
|----------|--------|
| Task edit paths: board, dialog, detail panel, Workplace row | Medium (#13) |
| Module switch to Tasks for board work | High |
| No global search | Critical (#3) |

### Focus (deep work)

| Step | Problem | Impact |
|------|---------|--------|
| Start focus from Dashboard suggestion | Sends to `/focus` page, not timer | Critical |
| Timer on Workplace | Hover to reveal pause/stop (`workplace-focus-card.tsx:57`) | High |
| Multi-step: pick task, start session, maybe enable habit track_with_focus | High (#9, #17) |

### Break / context switch

| Friction | Impact |
|----------|--------|
| Eight modules, no command layer | High (#6) |
| Modal quick capture (Ctrl+Shift+A) — tasks only | High (#7) |

### Reflection (evening)

| Friction | Impact |
|----------|--------|
| Sidebar: auto-save after 900ms debounce | `sidebar-reflection-panel.tsx:52–75` |
| Full page: explicit Save button | `reflection-page-content.tsx` — different mental model |
| No evening nudge on Today | Medium (#18) |

### Night (plan tomorrow)

| Friction | Impact |
|----------|--------|
| No real tomorrow flow | Medium (#14) |
| Later vs date vs Today confusion | High |

### Pages users probably never visit (or shouldn't need daily)

| Page | Verdict |
|------|---------|
| `/goals`, `/ai-coach`, `/future-work`, `/weekly-review` | Placeholder — **zero daily value** |
| `/focus` during active session | Wrong destination |
| `/` Dashboard after user learns Workplace | Becomes skip-or-detour |
| `/notes` kanban for daily driver | Power-user only |
| `/schedule` if timeline on Today suffices | Redundant |

### Top 10 workflow frictions (ranked by impact)

1. Dashboard vs Workplace split — every session  
2. Next-action wrong routing — daily trust damage  
3. No command palette — power user killer  
4. `/workplace` not auth-protected — security + confusion if shared links  
5. Triple scheduling surfaces — planning fatigue  
6. Modal-first capture — flow break  
7. Hover-gated timer controls — focus session friction  
8. Eight nav items — context switch tax  
9. Reflection dual save models — evening confusion  
10. Planning state overload (Today/Later/group/date) — cognitive load  

*(Fake Agenda card removed from top 10 — not rendered in UI per codebase grep.)*

---

## Section 5 — Deployment Review

### Can FlowOS be deployed today?

**No — not even for private alpha.**

Internal solo use on `npm run dev` may work. **Production build fails.** Hosted multi-user deployment with current Supabase policies would **leak user data across accounts**.

### Blockers by severity

#### Critical (hard stop)

| Blocker | Evidence | Fix effort |
|---------|----------|------------|
| **Production build fails** | `workplace-recover-day-bar.tsx` → missing `addMinutesToTime` | 1 hour (fix or delete file) |
| **RLS wide open on core data** | `tasks.sql`, `habits.sql`, `focus_sessions.sql`, `reflections.sql` — `using (true)` | 1–2 days |
| **`/workplace` unauthenticated** | Not in `middleware.ts` PROTECTED_PREFIXES | 5 minutes |

#### High (before any external user)

| Blocker | Evidence |
|---------|----------|
| Daily loop broken (wrong home, wrong routing) | `page.tsx`, `dashboard-command.ts` |
| No error boundaries | No `error.tsx` in repo |
| No loading boundaries | No `loading.tsx` in repo |
| Placeholder routes live (`/goals`, `/ai-coach`) | Accessible if URL known |

#### Medium (before beta)

| Blocker | Evidence |
|---------|----------|
| No onboarding | LAUNCH_PLAN acknowledges |
| No automated tests | `package.json` — no test script |
| README is Next.js boilerplate | `flowos/README.md` |
| Middleware deprecation warning | Next.js 16 middleware → proxy |

#### Low (before production)

| Blocker | Evidence |
|---------|----------|
| 542 hardcoded palette refs | PROJECT_STATE |
| Typography under-applied | PROJECT_STATE |
| dnd-kit dual system | PROJECT_STATE |
| Empty states uncrafted | Phase 4 deferred |

### Weeks to each stage (realistic, one engineer)

| Stage | Ready? | Weeks from today | Preconditions |
|-------|--------|------------------|---------------|
| **Internal alpha (hosted)** | Almost | **1 week** | Fix build + RLS + auth middleware |
| **Private alpha (5 users)** | No | **4–6 weeks** | Above + Phase 3.1 core (home merge, routing fix) + error/loading |
| **Closed beta (50 users)** | No | **12–16 weeks** | Phase 3.1–3.3 + onboarding + D7 gate |
| **Public beta** | No | **24–30 weeks** | Retention proven + Phase 5 QA + legal/privacy |

**Challenge to LAUNCH_PLAN:** Private alpha in "~3–4 weeks" is achievable **only if** scope is ruthlessly cut to home merge + routing + security — not full Phase 3.1–3.2 including command palette.

---

## Section 6 — Product Validation (Investing Own Money)

### Would you deploy?

**Deploy hosted for yourself:** Yes, after 1 week of security/build fixes.  
**Deploy for external users:** Not until RLS fixed — **non-negotiable**.

### Would you recruit users?

**Not yet.** Recruiting now wastes the one chance at first impressions. Users will hit Dashboard → wrong link → churn → tell you "it's confusing" without isolating fixable IA issues.

**Exception:** 2 **co-designers** (not "users") who agree to broken UX for weekly calls — only after RLS + build fixed.

### Would you wait?

**Wait 4–6 weeks** for Wave 1 alpha. **Do not wait** to fix Critical blockers — those are days, not weeks.

### Biggest risk (ranked)

| Risk | Severity | Why |
|------|----------|-----|
| **Retention / daily loop UX** | **#1** | No evidence anyone returns; architecture splits intelligence and execution |
| **Too many features for one loop** | **#2** | Notes kanban, weekly reflection, 8 modules — founder spread thin validating none |
| **Positioning vagueness** | #3 | SRL doesn't sell; "productivity OS" is crowded |
| **Wrong audience** | #4 | Students want simple; founders tolerate broken UX — both bad alpha signals |
| **Technology** | #5 | Stack is fine; RLS is fixable; build break is embarrassing but trivial |

Technology is **not** the bet-the-company risk. **Daily habit formation in your app** is.

---

## Section 7 — Roadmap Review

### Is Phase 3 correct?

**Direction yes. Scope and sequencing no.**

The UX friction review ([ux-friction-review.md](../design/ux-friction-review.md)) correctly identifies the problem. But the 6-sub-phase Phase 3 plan ([ROADMAP.md](../design/ROADMAP.md)) is **too large before first external validation** — classic solo-founder planning comfort.

### What should come BEFORE Phase 3.1?

**Architecture/security week** — missing from roadmap:

1. Fix production build (delete or fix dead Phase 3 stubs)  
2. RLS policies on all core tables  
3. Auth middleware complete  
4. Delete dead code (`WorkplaceAgendaCard`, broken `WorkplaceRecoverDayBar`)  

**This is not optional.** It should be **Week 1**, not parallel "deployment blockers."

### What should move later?

| Item | Current plan | Revised |
|------|--------------|---------|
| Phase 3.4 Planning simplification | Before alpha | **After alpha feedback** |
| Phase 3.5 Day arc | Weeks 9–11 | **After D7 gate** |
| Phase 3.6 Keyboard OS | Weeks 11–12 | **Beta**, not alpha |
| Command palette v1 | Phase 3.2 pre-alpha | **Phase 3.2 — but acceptable to slip 2 weeks post-alpha if routing fixed** |
| Phase 4 signature moments | Post Phase 3 | Correct — keep |

### What should be deleted?

- Nav entries for Schedule, Notes (keep routes)  
- `/goals`, `/ai-coach` routes from production builds (or static "coming soon" off middleware)  
- Dead components breaking build  
- **Not deleted from codebase yet:** Notes module — deprioritize, don't invest

### Should deployment happen earlier?

**Yes — with nuance.**

- **Earlier:** Hosted internal + 2 co-designers after security week  
- **Not earlier:** Marketing, Product Hunt, 15-user alpha before routing fix  

Docs say "don't recruit until Phase 3.1." **Agree on quality bar. Disagree on implying build is deployable today** — it isn't.

### Revised roadmap (high level)

```
Week 1:     Security & build gate (RLS, auth, build green, dead code removed)
Week 2–4:   Phase 3.1 "Minimum Daily Home" (merge Dashboard → Today, fix routing, visible timer)
Week 5:     Private alpha Wave 1 (5 users) — command palette optional
Week 6–8:   Iterate from alpha; Phase 3.3 focus mode polish
Week 9–12:  Phase 3.2 command palette + onboarding if D7 gate passes
Month 4–6:  Phase 3.4–3.6 based on feedback, not spec
```

**Merge:** Phase 3.1 + deployment blockers → **"Alpha Gate"** single phase  
**Split:** Phase 3.4–3.6 → post-alpha tracks, not pre-alpha promise

---

## Section 8 — Business Review

### Would someone pay?

**Not today.** Maybe **$8–12/month** if daily loop works and rivals Sunsama ($20) — in 12+ months with retention proof.

No one pays for eight modules. People pay for **reliable daily clarity**.

### Who pays?

| Segment | Pays? | Notes |
|---------|-------|-------|
| Knowledge workers (Alex) | Most likely | Already pay for Superhuman, Sunsama, etc. |
| Graduate students (Sam) | Unlikely early | Price-sensitive; Notion free tier sufficient |
| Developers | Wrong reason | Pay for tools that save code time; tolerate UX debt |
| Founders | Maybe | Time-starved but will abandon if loop broken |
| Remote workers | Same as knowledge workers | Not distinct enough yet |

### Perfect first user

**Alex with a twist:** A knowledge worker who **already pays for Sunsama or Akiflow** and is frustrated by price or missing habit/focus integration — willing to try indie alternative for 2 weeks with founder on call.

**Not:** Students, developers evaluating stack, friends being polite.

### Smallest possible launch

1. Today view with task + habit + focus + inline next-action  
2. Auth + secure RLS  
3. Reflection sidebar auto-save  
4. **Nothing else in nav** for v0 alpha  

That's 4 weeks after security week — not 8 modules.

### Who to ignore (for 90 days)

- Casual todo users  
- Team leads wanting shared workspaces  
- Mobile-first users  
- AI-feature seekers  
- Thesis evaluators who need FE-1 through FE-13 checked off  

---

## Section 9 — Technical Review

### Must fix before alpha

| Item | Action |
|------|--------|
| Production build | Fix or delete `workplace-recover-day-bar.tsx` |
| RLS on tasks, habits, focus_sessions, reflections, habit_completions | Replace `using (true)` with `auth.uid() = user_id` |
| `/workplace` in middleware | Add to PROTECTED_PREFIXES |
| Remove or 404 placeholder product routes | goals, ai-coach |
| Verify all writes attach `user_id` | Audit server actions / supabase clients |

### Must fix before beta

| Item | Action |
|------|--------|
| `error.tsx` + `loading.tsx` on `(main)` | User trust when Supabase slow/fails |
| Minimal smoke tests (auth, create task, save reflection) | CI gate |
| README + deploy runbook | Reproducible hosting |
| Reflection save UX unified | One model |

### Can wait

| Item | Why |
|------|-----|
| dnd-kit migration | Works today |
| `tasks-board-view` split | Painful but not blocking if careful |
| 542 palette refs | Visual debt |
| SegmentedControl primitive | Functional inline recipes exist |
| Typography scale rollout | Phase 4 |
| Full WCAG audit | Beta gate |

### Never fix (or defer indefinitely)

| Item | Why |
|------|-----|
| Light theme | Explicit non-goal |
| Glyph checkbox replacement | Cosmetic |
| Zero hardcoded colors | Diminishing returns |
| Perfect Select primitive consolidation | Three dropdowns work |
| FlowOS-old/ legacy directory relationship | Archive or ignore |

---

## Section 10 — CEO Decision Memo

**To: Founder**  
**From: Advisory panel**  
**Re: What to do with six months**

You built something most solo developers never finish. The design documentation is exceptional. The visual product is credible. **None of that matters until one person opens FlowOS tomorrow without you asking.**

### What you're doing well

- Documentation discipline (contract model, preserved history)  
- Correct diagnosis in UX friction review  
- Resisting AI/Goals as distraction (mostly)  
- Phase 0–2 improved real quality — not vanity metrics  

### Where you're wasting time

- Maintaining 8-module parity in nav and docs  
- Placeholder routes that signal "unfinished startup"  
- Dead code (`WorkplaceAgendaCard`, broken recover-day bar)  
- Planning Phase 3.4–3.6 before anyone uses 3.1  
- Foundation docs that slightly overshoot code state (fix drift as you ship)  

### One plan — not twenty options

**Bet the next 90 days on: "Can we make 5 people return on day 7?"**

Everything else is noise.

#### Month 1 — Make it deployable and coherent

| Week | Focus |
|------|-------|
| 1 | Build green. RLS locked. Auth complete. Dead code out. Deploy to Vercel for yourself. |
| 2 | Merge Dashboard KPIs + next-action into Workplace. Redirect `/` → Today. Fix all `dashboard-command.ts` and `schedule.ts` hrefs to in-page actions. |
| 3 | Always-visible focus controls. Start focus from next-action in place. Remove hover gate on timer. |
| 4 | Inline task capture on Today (no modal default). Error/loading boundaries. **Recruit user 1.** |

#### Month 2 — Learn from humans

| Week | Focus |
|------|-------|
| 5 | Users 2–3. Weekly calls. Fix top friction only. |
| 6 | Command palette v1 if users ask "where is X?" — otherwise defer. |
| 7 | Users 4–5. Measure D7. |
| 8 | **Decision gate:** 3/5 D7? Continue. If not, cut modules from nav before adding features. |

#### Month 3 — Double down or simplify

| Week | Focus |
|------|-------|
| 9–10 | If D7 pass: reflection evening nudge, planning simplification from real feedback. |
| 11–12 | If D7 fail: **cut to Today + Tasks + Reflection** experiment. Re-test 3 users. |

**Do not build:** Goals, AI, weekly auto-summary, Notes kanban features, Schedule as nav item, keyboard OS, gamification, mobile.

**Do not rewrite:** Visual design system. It's frozen and good enough.

---

## Section 11 — 90-Day Execution Plan

### Week 1 — Security & build gate

**Objectives:** Deployable artifact; data safe for multi-user.

**Deliverables:**
- Fix or delete `workplace-recover-day-bar.tsx`  
- RLS migration for core tables  
- Add `/workplace` to middleware  
- Remove dead `WorkplaceAgendaCard` or wire it (prefer delete)  
- `npm run build` passes on CI/local  
- Deploy to Vercel + Supabase (founder instance)

**Success criteria:** Two test accounts cannot read each other's tasks.

**NOT building:** Phase 3 UI, command palette, onboarding.

---

### Week 2 — Minimum daily home (Part 1)

**Objectives:** One front door.

**Deliverables:**
- `/` serves Today (Workplace content) OR redirects to `/workplace` with unified branding "Today"  
- Dashboard KPI block embedded on Today  
- Sidebar: Dashboard item removed or renamed Overview linking to KPI-only view if needed

**Success criteria:** Founder opens app → lands on execution surface without clicking.

**NOT building:** Command palette, Schedule merge, Notes changes.

---

### Week 3 — Routing truth

**Objectives:** Next-action does what it says.

**Deliverables:**
- `getNextActionRecommendation`: focus active → scroll to timer on Today, not `/focus`  
- Scheduled items → highlight entity on Today timeline/list  
- Tasks/habits fallback → open detail on Today, not list pages  
- `schedule.ts` hrefs → in-page anchors or query params, not `/tasks` `/habits`

**Success criteria:** Every next-action click keeps user on Today.

**NOT building:** Inline capture, keyboard shortcuts, day arc.

---

### Week 4 — Focus & capture minimum

**Objectives:** Deep work and quick add without modal default.

**Deliverables:**
- Timer controls visible without hover during active session  
- One-click start focus from current/next task  
- Inline "add task" input on Today  
- `error.tsx` / `loading.tsx` on main layout  
- Recruit alpha user #1 (co-designer)

**Success criteria:** User #1 completes one full day loop with founder watching.

**NOT building:** Reflection changes, Schedule page removal, analytics.

---

### Week 5 — Alpha Wave 1 begins

**Objectives:** 3 users onboarded.

**Deliverables:**
- Users 2–3 recruited  
- 30-min onboarding call script  
- Feedback doc template (5 questions from SUCCESS_METRICS)  
- Fix top 2 frictions from user #1

**Success criteria:** 2/3 users return day 2 voluntarily.

**NOT building:** New modules, visual Phase 4.

---

### Week 6 — Command layer (conditional)

**Objectives:** Reduce hunt friction **if users requested search/jump in Week 5.**

**Deliverables:**
- If needed: Cmd+K palette — search tasks/habits, jump to routes  
- If not needed: reflection save unification instead

**Success criteria:** Users report finding things faster OR reflection completion up.

**NOT building:** AI, Goals, gamification.

---

### Week 7 — Alpha Wave 1 complete

**Objectives:** 5 users total; D7 data.

**Deliverables:**
- Users 4–5 onboarded  
- D7 retention measured  
- Module switch count (manual observation)

**Success criteria:** **3/5 D7 retention** — LAUNCH_PLAN gate.

**NOT building:** Phase 3.4 planning simplification unless blocking retention.

---

### Week 8 — Decision gate

**Objectives:** Continue, pivot, or simplify.

**Deliverables:**
- Written decision: continue Phase 3 / cut nav to 5 items / cut modules  
- Update DECISION_LOG (future — not this task)

**Success criteria:** Clear go/no-go for Wave 2 (15 users).

**NOT building:** Anything new until decision written.

---

### Weeks 9–10 — Iterate or simplify

**If D7 pass:** Evening reflection nudge on Today; unify reflection save UX; "recover day" if users report missed schedules.

**If D7 fail:** Strip nav to Today + Tasks + Reflection; re-test with 3 fresh users.

**NOT building:** Weekly reflection auto-summary, Notes kanban, mobile.

---

### Weeks 11–12 — Beta prep or loop fix

**If D7 pass:** Onboarding v1 (3 steps); Phase 5 contrast/keyboard spot-check; expand to 8–10 users.

**If D7 fail:** Full architecture simplification sprint; postpone beta 6 weeks.

**Success criteria for 90 days:** **Proven D7 ≥ 40% with 5 users** OR **honest pivot doc** explaining cut scope.

---

## Section 12 — Final Verdict

| Question | Answer |
|----------|--------|
| **Is FlowOS solving a real problem?** | **Yes** — app fragmentation for daily productivity is real and experienced daily by millions. |
| **Is it differentiated?** | **Not yet in experience.** Potentially differentiated in breadth + reflection integration + indie privacy story — **after loop works**. SRL is not market differentiation. |
| **Would you continue building it?** | **Yes** — but only the daily loop path. Stop treating thesis completeness as product progress. |
| **Would you pivot?** | **Micro-pivot, not full pivot.** Same vision, **radically smaller surface area** for alpha. "Today + reflection" not "8 modules." |
| **Would you simplify?** | **Yes — immediately.** Nav, routes, placeholder pages, dead code. |
| **Would you deploy?** | **Hosted for yourself in 1 week. External users in 4–6 weeks.** Not today. |
| **What would you bet the company on?** | **Weekly Active Days for 5 strangers.** If they return on day 7 without you texting them, FlowOS is a startup. If not, no amount of design phases saves it. |

---

## Documentation Drift Register

Fix these in future doc updates (not part of this review task):

| Document | Drift | Code truth |
|----------|-------|------------|
| [PROJECT_STATE.md](../design/PROJECT_STATE.md) module map | `/` = Today/Workplace, `/overview` = Dashboard | `/` = Dashboard, `/workplace` = Workplace, no `/overview` |
| [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) | Implies build passes | **`npm run build` fails** (TypeScript error) |
| [FEATURE_INVENTORY.md](./FEATURE_INVENTORY.md), friction review | Agenda card daily trust issue | Component **not mounted** — dead code |
| [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) | RLS "verify" | Core tables **provably open** — must rewrite policies |
| [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | `/overview` in target nav | Route **does not exist** |
| Phase 3 "not started" | ROADMAP, PROJECT_STATE | Partial stub caused **build break** |

---

## Related documents

- [PRODUCT_VISION.md](./PRODUCT_VISION.md) — vision under review  
- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) — timeline to adjust after this review  
- [DEPLOYMENT_READINESS.md](./DEPLOYMENT_READINESS.md) — ratings revised downward here for build + RLS  
- [../design/ux-friction-review.md](../design/ux-friction-review.md) — workflow diagnosis **still valid**  
- [../design/ROADMAP.md](../design/ROADMAP.md) — Phase 3 direction valid; sequencing should change  
- [DECISION_LOG.md](./DECISION_LOG.md) — append outcomes from 90-day plan  

---

*This review intentionally challenges prior decisions. Agreement with foundation docs is not a goal. User retention is.*
