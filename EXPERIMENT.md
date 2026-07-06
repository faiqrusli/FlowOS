# FlowOS — Fable5 Today (greenfield)

A design decision document + working prototype for the next Today page.
Every open question from the brief is resolved here with a concrete,
opinionated answer, and the prototype at **`/fable5`** implements the Full
page for real (interactive focus engine, drag, timeline, queue, modes).

> This artifact is the **design spec + prototype**. It is intentionally a
> standalone route with mock data so the *experience* can be judged before
> it is wired to Supabase. The "How to ship for real" section maps every
> prototype piece back to the production data layer and the
> `NEXT_PUBLIC_FABLE5_TODAY` flag.

---

## 1. Vision

Today is not a list — it is a **cockpit for one day**. When you open it you
should instantly know the single next thing to do, be able to *do it* without
leaving the page, and feel momentum as the day clears. Three principles:

1. **Focus is the sun.** The focus card is the centre of gravity in every
   mode. Tasks, habits, schedule and notes orbit it and feed it.
2. **Do, don't navigate.** Almost every action happens in place. You only
   leave Today when you *choose* a destination (a full Timeline, Notes, a
   left-nav page).
3. **One clear next move.** There is always a **Now**, a **Next**, and a
   **Queue**. The system, not the user, keeps them in sync.

---

## 2. The three modes (`Ctrl + Shift + F` cycles Full → Focus → Work)

| | **Full** | **Focus** | **Work** |
|---|---|---|---|
| Intent | Plan + execute the whole day | Deep work, distraction-free | Triage / heavy list work |
| Focus card | Hero, centre | Hero, centred + enlarged, everything else hidden | Present but **compact** (de-emphasised) |
| Tasks / Habits | Left column, always visible | Hidden; revealed on hover or pinned | Left column, **wider** |
| Queue | Under Focus | Hidden (Now/Next only) | Under Focus |
| Timeline | Right, toggleable | Hidden; revealed on demand | Right, visible |
| Right rail (Note/Details/Reflect) | Pinned open | Hidden by default | Pinned open |
| Quick capture bar | Sticky bottom | **Hidden** | Sticky bottom |

**Decision: one page, three modes — not three pages.** Focus and Work are the
same board with progressive disclosure. This keeps state (the running timer,
the active task, scroll positions) perfectly continuous when you switch, which
is impossible across separate routes. It also matches the mental model: "same
day, different amount of noise."

Focus mode's rule is the old "eye closed" Today: **everything that supports
focus is hidden by default and revealed on hover, or pinned open by choice**
(the "Show tasks, habits & timeline" affordance in the prototype).

---

## 3. Resolved design decisions

### 3.1 Tasks, Habits, and the Queue
- **Keep separate Today's Tasks and Today's Habits cards** (left column) — they
  are different objects with different affordances (priority/estimate vs.
  streak/cadence). Merging them hurt scannability.
- **Keep the Queue, but redefine it.** Queue = the *ordered runway of what you
  will focus on next*, shown directly under the focus card. It is derived from
  incomplete tasks; dragging reorders the runway. Now = queue[0], Next =
  queue[1].
- **Everything is drag-reorderable** (dnd-kit sortable) inside Tasks, Habits,
  and Queue. Dragging a row onto the focus card **arms it as Now**.
- Row redesign vs. the old UI: grab handle appears on hover only; single-line
  with priority flag, group pill, and a **live tracked-time readout** that
  ticks while that task is the active focus target. Completed rows dim + strike
  and drop to the bottom.

### 3.2 Today's note
- **Not a card on the board.** It lives in the **right rail** ("Note" tab),
  pinned open on Full/Work. A daily note is reference material, not an action —
  it does not deserve prime grid real estate. Its old card slot is reclaimed by
  the **Queue**, which is far more actionable for Today.

### 3.3 Focus UI / UX
- **Start focus is a large primary button** (44px), the loudest control on the
  card.
- **Pause / Break / Stop never cover the time.** They live in a hover overlay
  *over the progress ring*; the big clock fades out only while hovering, so the
  timer is always readable at a glance and controls are one hover away.
- **Per-task time tracking (implemented).** The engine banks one second per
  tick onto whatever target is *Now*. Each task row and the Now chip show
  accumulated focus time (`banked + live`). Only **one** target accrues at a
  time.
- **Three (really four) states:** `idle` → `running` → `paused`, plus `break`.
  The ring colour encodes state (indigo = focus, grey = paused, amber = break).
- **Drag ≠ auto-start.** Dragging a task to Focus *arms* it as Now but waits for
  Start — respecting intent. **Exception:** if a session is already running,
  dropping a new task **swaps the live target without stopping the clock**, so
  you can reprioritise mid-flow.
- **Done → auto-advance (default, toggleable).** Clicking Done plays a 900ms
  fade-out on the completed task, banks its time, then promotes the next queue
  item into Now. If a session was running it **keeps running** into the next
  task (momentum). Users who prefer a hard stop between tasks can turn
  auto-advance off; then Done parks on the next task and waits for Start.
- **Habits in focus:** a habit shows "Drag here to start" affordance; only
  habits with **Track with Focus** enabled are focusable. Non-focusable habits
  show an amber "can't focus this yet" state on drag-over (see edge cases).
- **Pomodoro placement:** folded into the same card as a mode of the timer, not
  a separate top-right widget. Pomodoro counts identically to normal focus (it
  banks the same per-task seconds); it just adds a target length + break
  cadence. One timer, one source of truth.

### 3.4 Timeline
- **Toggleable, hover-revealable.** The eye button in the top nav shows/hides
  it; in Focus mode it is hidden and summoned on demand. Clean by default,
  present when wanted.
- **Draggable, not just a display.** Blocks can be dragged to reschedule, and
  tasks/habits can be dragged **between** the list, the queue, and the timeline
  (and back). A "now" line tracks the current time.

### 3.5 Quick capture status bar
- **Sticky on Full and Work, hidden on Focus.** Task/Habit toggle + one input;
  Enter to add (IME-safe). Capture never navigates away.

### 3.6 Right menu bar (Details / Note / Reflection)
- **Pinned open on Full/Work** (not hover-only), as a proper right rail with
  three tabs. Hidden on Focus. This is the "Sunsama-like" direction below.

### 3.7 Top navbar (Sunsama-style)
- **Adopted.** The first row is a real navbar: date stepper + day title, a live
  **day-progress bar**, the Full/Focus/Work segmented control, and the
  timeline / right-rail toggles. This frees the board of chrome and gives every
  global control one stable home.

### 3.8 Notifications (my call)
- **In-app, quiet, corner toasts** anchored bottom-centre above the capture
  bar; a session-end toast offers a one-tap reflection. **On Focus mode,
  notifications are suppressed except session/break transitions** — deep work
  must stay silent. (Spec'd here; toast host is a small follow-up in the real
  build.)

---

## 4. Drag & interaction edge cases

| Situation | Behaviour | Feedback |
|---|---|---|
| Valid drop on Focus | Arms/swaps target | Focus card gets indigo ring + "Drop to focus on this now" |
| Invalid drop (non-focusable habit on Focus) | No-op | Amber card border + amber drag chip |
| Reorder within a list | `arrayMove` | Row lifts (40% opacity), neighbours slide |
| Drag chip while dragging | Always shown | Floating pill mirrors validity colour |
| Reduced motion | All the above, near-instant | Honors `prefers-reduced-motion` (global CSS) |

---

## 5. What I kept vs. rejected from old FlowOS

**Kept:** the focus-card-as-centre idea; hover-reveal timeline ("eye closed");
per-group colour pills; the calm OKLCH "FlowOS Night" material system and
`.flow-*` surface classes; quick capture bar.

**Rejected / replaced:**
- Pomodoro as a separate top-right widget → merged into the one timer.
- Timer controls overlapping the time → hover overlay off the clock.
- Today's-note card on the grid → moved to the right rail; slot reused for the
  Queue.
- Hover-only right sidebar → pinned rail on Full/Work.
- Ambiguous "does drag start focus?" → explicit arm-vs-swap rule.
- No visible per-task time → live tracked-time readouts everywhere.

---

## 6. How to ship this for real (production plan)

The prototype is deliberately standalone. To land it behind the flag:

1. **Branch:** `experiment/fable5-today-greenfield` (never merge to `main`).
2. **Flag:** read `NEXT_PUBLIC_FABLE5_TODAY`. In `app/(main)/page.tsx`, render
   the new experience when `=== "true"`, else the current `TodayPageContent`
   (flag off = today unchanged). Add `.env.local` with
   `NEXT_PUBLIC_FABLE5_TODAY=true`.
3. **Data:** replace the mock arrays in `components/fable5/data.ts` with the
   existing loaders — `fetchWorkplaceData()` for groups/habits, `fetchFocusSessions()` /
   `computeTodayStats()` for focus stats. Keep all queries **user-scoped**; do
   not weaken RLS.
4. **Focus engine:** back `use-focus-engine.ts` with the real
   `focus-session-context` + `workplace-focus-task-context` so sessions persist
   and per-task durations write to the tasks table (the `focusedSec` field maps
   to a `focus_seconds` column / focus_sessions rollup).
5. **Drag:** reuse `task-drag-utils`, `timeline-drag`, and
   `manual-order` so reorder + timeline drops persist exactly like production.
6. **Verify:** `npm run build && npm run lint` must pass.

Files added by this experiment (all under the `fable5` namespace, zero changes
to production components):

```
src/app/fable5/page.tsx
src/components/fable5/data.ts
src/components/fable5/use-focus-engine.ts
src/components/fable5/today-prototype.tsx
src/components/fable5/fable-top-nav.tsx
src/components/fable5/fable-focus-card.tsx
src/components/fable5/fable-list-card.tsx
src/components/fable5/fable-timeline.tsx
src/components/fable5/fable-right-rail.tsx
src/components/fable5/fable-quick-capture.tsx
```

---

## 7. Five-minute smoke test

1. Open `/fable5`. Full page renders: Tasks + Habits (left), Focus hero
   (centre) with **Now**, Queue under it, Timeline + Note rail (right), capture
   bar (bottom).
2. Click **Start focus** → timer counts up, state reads "In focus", the Now
   task's tracked time ticks up in the Tasks list.
3. Hover the timer ring → Pause / Break / Stop appear **without** hiding the
   clock. Pause → grey; Break → amber; Stop → back to Ready.
4. Drag a task row onto the focus card → card shows indigo "Drop to focus"
   ring; drop → that task becomes **Now**.
5. Drag a task onto another in the list → order changes; drag a non-focusable
   habit onto Focus → amber "invalid" feedback, no change.
6. Click **Done** → completed task fades out, next queue item slides into Now,
   timer keeps running.
7. Press **Ctrl+Shift+F** → Full → Focus (everything hidden, capture bar gone,
   "Show support panels" affordance) → Work (wider lists, compact focus) →
   Full.
8. Toggle the eye (timeline) and panel (right rail) buttons in the top nav.

---

## 8. Appendix — ranked future FlowOS features

Ranked by **(Impact × Fit) vs. (Risk + Effort)**. Impact = user love /
retention; Fit = belongs in FlowOS's "do today, grow over time" mission; Risk
includes scope creep and "another app already owns this."

| # | Feature | Why it wins users | Impact | Risk | Verdict |
|---|---|---|---|---|---|
| 1 | **Per-task time tracking + weekly "where did my focus go" review** | Turns focus data into insight; the loop that makes people return daily | ★★★★★ | Low | Build now (engine already tracks it) |
| 2 | **Auto-plan my day** (estimate-aware: fills the timeline from queue + calendar, respecting capacity) | Removes the hardest step (planning); Sunsama's killer feature | ★★★★★ | Med | Build next |
| 3 | **Goals → today link** (each task/habit can roll up to a goal; Today shows "this moves *Ship v1* forward") | Connects daily doing to long-term growth — FlowOS's core differentiator | ★★★★☆ | Med | High priority |
| 4 | **Streaks & gentle momentum system** (habit streaks, focus streaks, "don't break the chain") | Proven retention driver across cultures; already partly present | ★★★★☆ | Low | Build |
| 5 | **Calendar sync (read-only first)** — pull meetings into the timeline | Timeline is only trustworthy if it knows your meetings | ★★★★☆ | Med | Build (read-only), write later |
| 6 | **End-of-day shutdown ritual** (review done, roll over undone, reflect, set tomorrow's Now) | Creates a daily habit loop; emotional payoff | ★★★★☆ | Low | Build |
| 7 | **Focus soundscapes / DND OS integration** | Deepens the deep-work promise | ★★★☆☆ | Low | Nice-to-have |
| 8 | **Lightweight AI daily coach** (suggests what to focus on, flags overload) | Differentiator, but must augment not nag | ★★★★☆ | High | Prototype behind flag |
| 9 | **Shared/team Today** (see a teammate's plan, async standup) | Expands market to teams | ★★★☆☆ | High | Later; keep single-player great first |
| 10 | **Mobile "one glance" widget** (Now + Next + Start) | Meets users where they are | ★★★★☆ | Med | After web solidifies |

**Deliberately NOT building** (other apps own these, or off-mission): full
project management / Gantt, chat/messaging, docs/wiki, full email client,
CRM, invoicing. FlowOS should stay the *best place to run and grow a single
day*, not a horizontal suite.
