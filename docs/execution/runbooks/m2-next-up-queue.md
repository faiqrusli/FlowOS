# M2 — Next Up Queue Runbook — Superseded

**Scope:** Historical M2 plan for the former session-scoped task/habit queue.  
**Authority:** Superseded by the [2026-07-10 Next Up V2 decision](../logs/decision-log.md#2026-07-10--next-up-v2-persistent-task-execution-queue).  
**Source of truth for behavior:** V2 persists a task-only queue on `tasks.queue_order`; do not use this runbook to extend the former localStorage queue.  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.

**Primary UI target:** `src/components/workplace/workplace-focus-card.tsx` (quick-focus tab only). Pomodoro tab is untouched. `/focus` hub (`focus-page-content.tsx`) is out of scope — Next Up lives on Workplace per spec.

**Naming disambiguation (critical):**

| Name | Where | What it is |
|------|-------|------------|
| **Next Up** | Focus card | User-controlled execution queue (this feature). Preview cap **3**. |
| **NEXT queue** | Today's Tasks card | Schedule-derived planning list (`partitionWorkplaceTasks`, cap **5**). Unrelated. |
| **`nextTask` row** | Focus card today | Single schedule-derived row from `findNextScheduledTask()` — **replaced** by Next Up in Session 2. |

---

## 0. Founder gate (before Session 1)

Append to [decision-log.md](../logs/decision-log.md):

```
### YYYY-MM-DD — Next Up queue (Focus execution layer)

**Context:** Focus card today shows one active task/habit and one schedule-derived "Next" row. Founder froze Next Up spec v1.0 — a user-controlled queue on the Focus card with 3-item preview, expandable drawer, DnD, and non-interrupting timeline suggestions.
**Decision:** Ship Next Up as an M2 addendum on `workplace-focus-card.tsx`. Replaces the single `nextTask` row and drop-to-set-active-only behavior with a persisted session-scoped queue. Today's Tasks NEXT queue (cap 5) is unchanged.
**Alternatives rejected:** Extend Today's NEXT queue into Focus (wrong layer — planning vs execution); modal/overlay drawer (spec frozen: split workspace); auto-start scheduled items (violates user-controlled context switching).
**Related:** [next-up-queue-spec.md](../../review/design/next-up-queue-spec.md) · this runbook
```

**Do not branch Session 1 until this entry exists or founder explicitly waives in chat.**

---

## Acceptance test

When Sessions 1–6 are complete, a founder opening `/` with an active Quick Focus session sees: timer unchanged as hero; a **Next Up** strip below with up to 3 items and overflow affordance; clicking overflow expands the Focus card into a 60–65% / 35–40% split workspace (not a modal); the drawer scrolls independently while the timer never moves; drag-and-drop from Today's Tasks, Today's Habits, and Timeline adds items; queue order persists across refresh; a scheduled timeline item at start time surfaces a **Keep Current / Start {title}** card without auto-switching. `npm run build` and `npm run lint` pass.

---

## 1. Product Understanding

**The feature in plain terms:** Next Up is FlowOS's execution layer on the Focus card — a short, user-ordered list of what to do after (or instead of) the current focus target. Tasks and Habits answer "what exists"; Timeline answers "what was planned"; Next Up answers "what should I do now?" without forcing schedule edits.

**Intended experience:** User starts focus. Below the timer they see up to three queued items and a count. They drag tasks or habits from Today into the queue, reorder in the drawer, and step through items at their own pace. When a scheduled block starts, a gentle suggestion appears — never a takeover. The timer never shrinks, never scrolls away, never auto-switches context.

**Mental model:** "This is my on-deck list for this focus session — I control order, I control when to switch, the app only suggests." Distinct from Today's NEXT queue (schedule-sorted planning list, cap 5, different card).

**Why this fits FlowOS:** Continuous focus philosophy (Schedule Break, manual Pause/Break/Stop) extends to context switching — timeline informs, user decides. Next Up bridges planning surfaces and the running timer without turning Focus into a second task manager or a modal stack.

---

## 2. UX Review

- **Clarity:** Preview (3 items max) + count + `View all` is scannable. Drawer owns full queue management — good progressive disclosure per spec §5.
- **Discoverability:** Empty state copy `Drag tasks or habits here.` plus `+ Add` gives two entry paths. Existing timeline/task drag users already drop on Focus card — behavior upgrades from "set active" to "add to queue" (Session 4); document in release notes.
- **Simplicity:** Resist `+ Add` opening a full task picker in V1 — prefer drag-from-Today and timeline drops per spec; `+ Add` can open a minimal picker only if drag is insufficient (defer to Session 4 stop/fail if picker scope explodes).
- **Cognitive load:** Split workspace hides preview while expanded — one queue surface at a time (spec frozen). Timer font/height locked — no layout shift anxiety.
- **Interaction flow:** Open drawer → reorder/remove → close preserves order and scroll position. Scheduled notification while drawer open must not close drawer or move timer (spec §16).
- **Accessibility:** Drawer needs `ESC` close, focus trap only if mobile slide-over (full-screen panel); desktop split should not trap focus away from timer controls. Drag handles need keyboard reorder alternative in Session 6 (move up/down or aria-dnd pattern).
- **Risk — coexistence with `nextTask`:** Shipping preview without removing the old "Next" row duplicates concepts. Session 2 **must** remove `nextTask` `TaskFocusRow` and the single active/next two-row layout in favor of Next Up preview + current indicator on queue row.

---

## 3. User Flow

| # | Flow | Result |
|---|------|--------|
| 1 | No active focus session | Next Up strip visible but inert OR hidden until session starts — **match spec mockup** (strip shown with session). Queue can be pre-built via drag only if session active; if spec requires queue while idle, queue persists in session storage keyed to next `started_at`. **Default:** queue CRUD requires active quick-focus session (same as Schedule Break attachment model). |
| 2 | Active session, empty queue | Preview shows `Drag tasks or habits here.` |
| 3 | Drag task from Today's Tasks onto Focus card | Item appended to queue (end); duplicate `originId` → no-op |
| 4 | Drag habit from Today's Habits onto Focus card | Same as 3 for focusable habits (`isFocusableHabit`) |
| 5 | Drag from Timeline onto Focus card | Item appended; `source: "timeline"` |
| 6 | Queue 1–3 items | All visible; current item shows ● + `Current` when matches `target_id` |
| 7 | Queue >3 items | Third row + `View all (N more) →` |
| 8 | Click `Next Up` header or `View all` | Card expands to split workspace; preview hidden |
| 9 | Drawer: drag ☰ handle | Reorder; positions persist immediately |
| 10 | Drawer: click ✕ on row | Remove from queue; source task/habit unchanged |
| 11 | Drawer: click row (not ✕) | Set as current focus context → updates `target_type`/`target_id` + optional `quick.startFocus` if not focusing |
| 12 | Close drawer (✕, ESC, toggle header) | Collapsed preview returns; order + scroll preserved |
| 13 | Complete item from queue row | Item → `completedAt`; removed from queue; source entity completed via existing handlers |
| 14 | Scheduled task start time while focusing | Notification: `{title} is scheduled now` — **Keep Current** / **Start {title}** |
| 15 | Keep Current | Dismiss; timer uninterrupted |
| 16 | Start {title} | Switch `target_id` to scheduled item; user-initiated |
| 17 | Stop focus session | Queue remains in storage until session cleared — spec: items stay queued on stop; **clear queue when session ends** (ephemeral per session). Align with Schedule Break: `quick.stopSession()` clears session envelope including queue. |
| 18 | Browser refresh mid-session | Queue rehydrates from `StoredActiveFocusSession` extension |
| 19 | Second tab open | `storage` event syncs queue + timer session |
| 20 | Mobile viewport | Split → full-screen slide-over; all drawer actions preserved |

---

## 4. Edge Cases

| Edge case | Resolution |
|-----------|------------|
| Queue empty | Preview hint only; timer unaffected |
| Queue >100 items | Drawer list scrolls; no hard cap |
| Drag duplicate (`originId` already queued) | No-op; no duplicate rows |
| Timeline item deleted | Prune queue entry on next tasks/habits sync |
| Task completed elsewhere (Tasks card) | Prune or mark completed on sync |
| Habit completed elsewhere | Same |
| `activeSource: "auto"` + `findTaskAtNow` | **Disable auto-promotion into queue** once Next Up ships — user controls order. `notifyTaskCompleted` should not inject schedule rows into Next Up. |
| Drop non-focusable habit | Reject with existing warning pattern (`habitDropWarning`) |
| Expand drawer mid-drag | Drop targets remain valid (spec §16) |
| Scheduled notification + drawer open | Card/toast mounts without closing drawer |
| Snooze scheduled suggestion multiple times | Re-surface after interval; no cap (spec §16) |
| Offline | Queue in localStorage; sync prune on reconnect |
| Multiple tabs race reorder | Last `writeActiveSession` wins — same as Schedule Break fields |
| Pomodoro tab active | No Next Up UI on Pomodoro tab |
| Queue item title stale after task rename | Refresh title from `tasks`/`habits` props on render; optional denormalize update on sync |

---

## 5. State Management

| State | Kind | Lives in |
|-------|------|----------|
| `nextUpItems: NextUpItem[]` | Persisted | `StoredActiveFocusSession` extension (preferred) or sibling key `flowos.focus.nextUp` keyed by `started_at` |
| `activeItemId` (derived) | Derived | Match `session.target_id` + `target_type` to queue row |
| `drawerOpen: boolean` | Temporary UI | `useState` in `WorkplaceFocusCard` or `NextUpQueueProvider` |
| `drawerScrollTop` | Temporary UI | Ref or state; restore on close (spec §7) |
| Drag preview index | Temporary UI | New `focus-queue-drag` store or extend `timeline-drag.ts` module state |
| Scheduled suggestion dismissed/snoozed | Persisted per item | `dismissedUntil` or snooze map on session — minimal V1: module-level `Set` + optional session field |

**Provider choice:** Extend `FocusSessionProvider` queue CRUD **or** new `NextUpQueueProvider` nested under `WorkplaceFocusTaskProvider`. Prefer **session colocation** — queue clears with session, same `storage` sync.

No Supabase table. Queue is client-side, session-scoped, like Schedule Break fields.

---

## 6. Component Architecture

```
workplace-focus-card.tsx (existing — quick-focus tab)
├── FocusTimerRing + TimerHoverControls (unchanged)
├── ScheduleBreakModal, FocusNextBreakStrip, FocusBreakNotification (unchanged)
├── NextUpPreview (new — src/components/focus/next-up-preview.tsx)
│   ├── NextUpPreviewRow
│   └── ViewAllAffordance
└── NextUpDrawer (new — src/components/focus/next-up-drawer.tsx)
    ├── NextUpDrawerHeader (+ Add, close)
    ├── NextUpQueueList (scrollable)
    │   └── NextUpQueueItem (☰ handle, title, Current, ✕)
    └── NextUpDropZone

NextUpScheduledNotification (new — src/components/focus/next-up-scheduled-notification.tsx)
```

| Component | Responsibility |
|-----------|----------------|
| `next-up-preview.tsx` | ≤3 items, count header, `+ Add`, overflow link; no scroll |
| `next-up-drawer.tsx` | Split layout shell; 60–65% / 35–40%; open/close animation |
| `next-up-queue-list.tsx` | Scrollable list only |
| `next-up-queue-item.tsx` | Row UI; emits reorder/remove/activate |
| `next-up-drop-zone.tsx` | Bottom drop target in drawer |
| `next-up-scheduled-notification.tsx` | Keep Current / Start actions |
| `next-up-queue.ts` (lib) | CRUD, dedupe, reorder, prune, type guards |
| `focus-active-session.ts` (extended) | `nextUpItems?: NextUpItem[]` on stored session |

**Layout:** `WorkplaceFocusCard` owns `drawerOpen` and applies CSS grid/flex split when expanded. Timer subtree is isolated — no conditional font sizes.

---

## 7. Data Model

### `NextUpItem` (new — `src/types/next-up.ts`)

| Field | Type | Stores |
|-------|------|--------|
| `id` | `string` | Unique queue entry ID (`crypto.randomUUID()` or nanoid) |
| `type` | `"task" \| "habit"` | Entity type |
| `source` | `"tasks" \| "habits" \| "timeline" \| "manual"` | Provenance |
| `originId` | `string` | Source task/habit ID |
| `title` | `string` | Denormalized display title |
| `position` | `number` | 0-based sort order |
| `createdAt` | `string` (ISO) | When queued |
| `completedAt` | `string \| null` | Set when completed; removed from active list |

### Session extension

Add to `StoredActiveFocusSession`:

```typescript
nextUpItems?: NextUpItem[] | null;
```

Optional V1 scheduled-suggestion state:

```typescript
nextUpDismissedSuggestions?: Record<string, string> | null; // originId → ISO snooze-until
```

Backward compatible — absent field = empty queue.

---

## 8. Event Timeline

```
Quick Focus starts (existing)
        │
        ▼
User drags task/habit/timeline item OR uses + Add
        │
        ▼
addToNextUpQueue(session, item) → writeActiveSession
        │
        ▼
Preview renders ≤3 items; overflow if len > 3
        │
        ├── User opens drawer → split layout animates (200–250ms)
        │         ├── reorder / remove / activate
        │         └── close → preview returns, state preserved
        │
        ├── User focuses queue row → target_id updated
        │
        ├── Scheduled start time reached (wall clock + viewDate)
        │         └── notification → Keep Current | Start
        │
        └── User completes item → completedAt + prune + existing complete handlers
        │
        ▼
Stop session → clearActiveSession (queue discarded with session)
```

---

## 9. Implementation Plan (phases → sessions)

| Phase | Session | Goal | Key files |
|-------|---------|------|-----------|
| 1 | 1 | Types + persistence + pure CRUD | `src/types/next-up.ts`, `src/lib/next-up-queue.ts`, `focus-active-session.ts`, `focus-session-context.tsx` |
| 2 | 2 | Collapsed preview; remove legacy `nextTask` row | `next-up-preview.tsx`, `workplace-focus-card.tsx` |
| 3 | 3 | Expanded drawer + animation + scroll isolation | `next-up-drawer.tsx`, `next-up-queue-list.tsx`, `next-up-queue-item.tsx`, `next-up-drop-zone.tsx` |
| 4 | 4 | DnD sources + reorder + drop zone | `timeline-drag.ts` or `focus-queue-drag.ts`, row components, focus card handlers |
| 5 | 5 | Scheduled suggestions | `next-up-scheduled-notification.tsx`, scheduler hook in focus task context |
| 6 | 6 | A11y, mobile slide-over, zero layout shift audit | responsive CSS, keyboard reorder, `prefers-reduced-motion` |

---

## 10. Testing Plan

**Functional**
- [ ] Empty / 1 / 3 / 4+ item preview states
- [ ] Drawer open/close/toggle/ESC; preview hidden while open
- [ ] Reorder persists; remove does not delete source entity
- [ ] Duplicate drop no-op
- [ ] Complete from queue updates source task/habit
- [ ] Refresh restores queue order
- [ ] Second tab shows same queue after write

**DnD**
- [ ] Task row → queue
- [ ] Habit row → queue (focusable only)
- [ ] Timeline → queue
- [ ] Intra-queue reorder via ☰
- [ ] Drop zone in drawer bottom

**Scheduled**
- [ ] Notification at scheduled start; Keep Current dismisses
- [ ] Start switches target without resetting timer
- [ ] No auto-switch

**UI / layout**
- [ ] Timer height unchanged expand/collapse (measure or visual regression)
- [ ] Focus workspace never scrolls
- [ ] Drawer scrolls independently
- [ ] Mobile slide-over (narrow viewport)

**Keyboard / a11y**
- [ ] ESC closes drawer
- [ ] Reorder accessible without pointer (Session 6)
- [ ] `prefers-reduced-motion` reduces animation

**Regression**
- [ ] Schedule Break unchanged
- [ ] Pomodoro tab unchanged
- [ ] Today's Tasks NEXT queue (cap 5) unchanged
- [ ] Focus reflection on stop unchanged

---

## 11. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Conflating Next Up with Today's NEXT queue | Wrong implementation | Naming table at top; code review grep for `QUEUE_CAP` |
| `nextTask` + Next Up shipped together | Duplicate UX | Session 2 removes `nextTask` row explicitly |
| `findTaskAtNow` auto-switch fights user queue | Surprise context changes | Disable auto target changes when queue non-empty; decision in Session 5 |
| Split layout shifts timer | Violates frozen spec | Timer in fixed-height container; test expand/collapse |
| DnD "drop on card" behavior change | User confusion | Same drop zone; append instead of replace-only |
| `workplace-focus-card.tsx` size | Maintainability | Extract Next Up components in Session 2–3, don't grow monolith inline |
| Scope creep: + Add full picker | Session 4 blowout | Defer picker; drag-only MVP for Session 4 pass |

---

## 12. Future Improvements (not V1)

- `+ Add` searchable picker across all today tasks/habits
- Queue templates across sessions
- Engine-suggested auto-fill from Today's NEXT queue (one-click import)
- OS notifications for scheduled suggestions (in-app only in V1)
- `/focus` hub read-only queue summary
- Analytics on queue throughput
- dnd-kit migration (M2 out of scope per code standards)

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at session stop/fail — do not skip dependent session |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, tried, next action |
| 3 | **Git:** WIP commit on session branch or stash — never merge to `main` |
| 4 | **Resume** same session number when unblocked |
| 5 | **Respect dependencies** — session table below |

---

## Session dependency table

| Session | Depends on (must be on `main`) | Blocks |
|---------|--------------------------------|--------|
| 1 — Data model + persistence | M1 ship gate; Schedule Break merged (shared `StoredActiveFocusSession`) | 2, 3, 4, 5, 6 |
| 2 — Collapsed preview | 1 | 3, 4 |
| 3 — Expanded drawer | 2 | 4, 6 |
| 4 — Drag & drop | 3 | 5, 6 |
| 5 — Scheduled suggestions | 4 | 6 |
| 6 — Polish + accessibility | 5 | — |

Sessions 5 and 6 could be parallelized only if Session 5 does not touch drawer layout CSS — **sequential recommended**.

---

## Session plan

**Budget:** 6 sessions × 2–4 hours each.  
**Engineering sessions:** 1–6 (Agent-executable).  
**Founder-only:** Decision-log entry (Section 0); production sign-off after Session 6.

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b m2/session-N-next-up-{short-name}` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → report merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → production check → [july-log.md](../logs/july-log.md) |

**Merge bundles:**

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — Data foundation | 1 | Session 1 verified |
| B2 — Preview shell | 2 | Session 2 verified |
| B3 — Drawer workspace | 3 | Session 3 verified |
| B4 — DnD | 4 | Session 4 verified |
| B5 — Timeline suggestions | 5 | Session 5 verified |
| B6 — Ship gate | 6 | Runbook complete |

Ad-hoc fixes: `tweak/next-up-{description}` from `main`.

---

## Session 1 — Data model + persistence

**Type:** `engineering`  
**Goal:** `NextUpItem` type, pure queue helpers, session persistence, context CRUD API — zero UI change visible to users.  
**Time:** 2–3 hours  
**Prerequisites:** Section 0 decision-log entry; `main` includes Schedule Break (`StoredActiveFocusSession` extensions pattern exists).  
**Maps to:** Spec §14, §17 phase 1  
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Session storage | `src/lib/focus-active-session.ts` | `StoredActiveFocusSession` in `localStorage` key `flowos.focus.active`; optional Schedule Break fields |
| Session context | `src/contexts/focus-session-context.tsx` | `updateSession` → `writeActiveSession`; `storage` listener for multi-tab |
| Focus target | `src/contexts/workplace-focus-task-context.tsx` | Single `activeTarget`; no queue array |
| Types | `src/types/focus.ts` | `FocusTargetType`; no `NextUpItem` |

### Numbered steps

| # | Step |
|---|------|
| 1 | Add `src/types/next-up.ts` with `NextUpItem`, `NextUpItemSource`, helpers. |
| 2 | Add `src/lib/next-up-queue.ts`: `addItem`, `removeItem`, `reorderItems`, `dedupeByOriginId`, `pruneCompleted`, `sortByPosition`, `normalizePositions`. Pure functions only. |
| 3 | Extend `StoredActiveFocusSession` with optional `nextUpItems`. Update `readActiveSession` validation to accept/absent array. |
| 4 | Expose `quick.nextUpItems` + `quick.addToNextUp` / `removeFromNextUp` / `reorderNextUp` on `FocusSessionProvider` (or dedicated provider wired to same write path). |
| 5 | Clear `nextUpItems` in `clearActiveSession` / stop paths alongside existing fields. |
| 6 | Update `FEATURE_INVENTORY.md` row (planned → in progress note optional). |
| 7 | `npm run build && npm run lint` → commit → push → ask founder merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| `npm run build` / `npm run lint` | Pass |
| Dev: call `addToNextUp` in console/context | `localStorage` shows `nextUpItems` array |
| Refresh | Array rehydrates |
| Stop session | Queue cleared |

**Stop/fail if:** Pomodoro session type breaks; existing sessions without `nextUpItems` fail to load.

---

## Session 2 — Collapsed preview

**Type:** `engineering`  
**Goal:** 3-item Next Up preview strip on quick-focus tab; remove legacy single `nextTask` row.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 on `main`  
**Maps to:** Spec §6, §8; phase 2  
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Focus card layout | `workplace-focus-card.tsx` | Active `TaskFocusRow`/`HabitFocusRow` + one `nextTask` "Next" row |
| Next task algo | `workplace-focus-task.ts` | `findNextScheduledTask()` — schedule sorted |
| Empty hint | `workplace-focus-card.tsx` | `"Hover timeline to drag..."` on drop zone |

### Numbered steps

| # | Step |
|---|------|
| 1 | Create `src/components/focus/next-up-preview.tsx` per spec mockup (header, bullets, Current, overflow). |
| 2 | Wire to `quick.nextUpItems`; slice(0, 3) for preview; compute overflow count. |
| 3 | **Remove** `nextTask` row and dedicated active/next two-row block — fold "current" into preview ● semantics tied to `activeTarget`. |
| 4 | Keep primary active focus row **or** merge into preview Current row only (prefer **preview-only** below timer to minimize height — timer hero preserved). |
| 5 | Empty state: `Drag tasks or habits here.` |
| 6 | `+ Add` stub → disabled or noop with tooltip "Drag items here" until Session 4 (document in code comment). |
| 7 | `npm run build && npm run lint` → commit → push → ask merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| 0 / 1 / 3 / 5 items | Correct preview + `View all (2 more)` |
| Preview | No internal scroll |
| Timer | Same height as pre-session baseline |
| `nextTask` row | Gone |

**Stop/fail if:** Preview scrolls; more than 3 rows without overflow link; timer height changes.

---

## Session 3 — Expanded drawer

**Type:** `engineering`  
**Goal:** Split workspace 60–65% / 35–40%; drawer with full list, scroll isolation, open/close animation.  
**Time:** 3–4 hours  
**Prerequisites:** Session 2 on `main`  
**Maps to:** Spec §7; phase 3  
**Merge bundle:** B3

### Numbered steps

| # | Step |
|---|------|
| 1 | Create `next-up-drawer.tsx`, `next-up-queue-list.tsx`, `next-up-queue-item.tsx`, `next-up-drop-zone.tsx`. |
| 2 | Add `drawerOpen` state; open via Next Up header + `View all`; close via ✕, ESC, toggle. |
| 3 | Implement CSS split; hide preview when `drawerOpen` (mutually exclusive). |
| 4 | Animation 200–250ms ease-out; `motion-reduce:transition-none`. |
| 5 | Scroll: list `overflow-y-auto`; focus pane `overflow-hidden`. |
| 6 | Wire remove (✕) and click-to-activate (updates `setActiveTaskId`/`setActiveHabitId`). |
| 7 | Preserve scroll position on close (ref). |
| 8 | `npm run build && npm run lint` → commit → push → ask merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Open/close | Smooth; no timer flicker |
| 20+ items | Drawer scrolls; timer fixed |
| Focus pane | Never scrolls |
| Preview + drawer | Never visible together |

**Stop/fail if:** Modal/dialog used instead of in-card split; timer restarts on open.

---

## Session 4 — Drag & drop

**Type:** `engineering`  
**Goal:** DnD from Tasks, Habits, Timeline → queue; intra-queue reorder; drawer drop zone.  
**Time:** 3–4 hours  
**Prerequisites:** Session 3 on `main`  
**Maps to:** Spec §9–10; phase 4  
**Merge bundle:** B4

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Timeline MIME | `src/lib/timeline-drag.ts` | `TIMELINE_DRAG_*_MIME`, `getActiveTimelineDrag()` |
| Task row drag | `workplace-compact-task-row.tsx` | `setBoardTaskDragData` |
| Habit row drag | `workplace-compact-habit-row.tsx` | timeline drag MIME |
| Focus drop | `workplace-focus-card.tsx` | Sets `activeTarget` only |

### Numbered steps

| # | Step |
|---|------|
| 1 | Change focus card drop handler: `addToNextUp` instead of/in addition to set-active (spec: append; activate on row click). |
| 2 | Drop zone at drawer bottom accepts same MIME types. |
| 3 | ☰ handle: HTML5 reorder or pointer drag within list; update `position` via `reorderNextUp`. |
| 4 | Duplicate detection via `originId`. |
| 5 | Enable `+ Add` minimum flow if drag-only is insufficient — optional thin menu of today's incomplete tasks. |
| 6 | DnD works while drawer open (drop targets on drawer + collapsed card edge). |
| 7 | `npm run build && npm run lint` → commit → push → ask merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Task/habit/timeline drop | Item in queue |
| Duplicate drop | Ignored |
| Reorder | Persists after refresh |
| Source entity | Still exists after remove from queue |

**Stop/fail if:** Drops still replace entire queue; Today's Tasks card DnD broken.

---

## Session 5 — Scheduled suggestions

**Type:** `engineering`  
**Goal:** Non-blocking notification when scheduled item start time reached; Keep Current / Start.  
**Time:** 2–3 hours  
**Prerequisites:** Session 4 on `main`  
**Maps to:** Spec §11–12; phase 5  
**Merge bundle:** B5

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Schedule at now | `workplace-focus-task.ts` | `findTaskAtNow` auto-sets target when `activeSource === "auto"` |
| Time compare | `parseTimeToMinutes`, `viewDate` | Used across workplace |

### Numbered steps

| # | Step |
|---|------|
| 1 | Add `next-up-scheduled-notification.tsx` — copy spec wording. |
| 2 | Hook: on tick (existing 1s interval), detect tasks/habits whose `scheduled_time` crossed now while quick-focus active. |
| 3 | Show card when due && not dismissed && user still on different target. |
| 4 | Keep Current → dismiss/snooze map entry. |
| 5 | Start → `setActiveTaskId`/`setActiveHabitId` + update session target. |
| 6 | **Do not** auto-switch; **do not** pause timer. |
| 7 | Revisit `findTaskAtNow` auto-promotion — prefer manual when Next Up enabled (comment + guard). |
| 8 | `npm run build && npm run lint` → commit → push → ask merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Scheduled time reached | Card appears |
| Keep Current | Timer runs; no target change |
| Start | Target switches |
| Ignored | No modal; no forced switch |

**Stop/fail if:** Auto-start focus on schedule; timer pauses on notification.

---

## Session 6 — Polish + accessibility

**Type:** `engineering`  
**Goal:** Mobile slide-over, keyboard access, reduced motion, zero layout shift, FEATURE_INVENTORY shipped row.  
**Time:** 2–3 hours  
**Prerequisites:** Session 5 on `main`  
**Maps to:** Spec §7 responsive, §18; phase 6  
**Merge bundle:** B6

### Numbered steps

| # | Step |
|---|------|
| 1 | Mobile breakpoint: full-screen slide-over instead of split (spec §7). |
| 2 | Keyboard: ESC close; tab order header → list → actions; reorder buttons on ☰ (up/down) as pointer-free fallback. |
| 3 | `prefers-reduced-motion` audit on drawer transition. |
| 4 | Layout shift audit: expand/collapse 10× — timer bounding box unchanged. |
| 5 | Prune queue on task/habit delete/complete from parent props effect. |
| 6 | Update `FEATURE_INVENTORY.md` — Next Up row **Shipped**. |
| 7 | Run full manual test matrix (below). |
| 8 | `npm run build && npm run lint` → commit → push → ask merge approval. |

### Verification

All items in Section 10 Testing Plan and Spec §18 Acceptance Criteria.

**Stop/fail if:** Any acceptance criterion fails; build/lint errors.

---

## Manual test matrix

Run on production after Session 6 merge.

| # | Scenario | Setup | Action | Expected | Pass |
|---|----------|-------|--------|----------|------|
| 1 | Empty queue | Active focus, no items | Observe preview | Hint text | ☐ |
| 2 | Preview cap | Queue 5 items | View collapsed | 3 rows + "View all (2 more)" | ☐ |
| 3 | Drawer split | Queue 6+ | Open drawer | 60/40 split; timer stable | ☐ |
| 4 | Scroll isolation | Queue 15+ | Scroll drawer | Timer does not move | ☐ |
| 5 | Task drag | Today's Tasks | Drag to Focus | Appended | ☐ |
| 6 | Habit drag | Focusable habit | Drag to Focus | Appended | ☐ |
| 7 | Timeline drag | Timeline block | Drag to Focus | Appended | ☐ |
| 8 | Duplicate | Same task twice | Drop again | No-op | ☐ |
| 9 | Reorder | 3 items | Drag ☰ | Order persists on refresh | ☐ |
| 10 | Scheduled | Task at now | Wait/trigger time | Keep Current / Start card | ☐ |
| 11 | Mobile | Narrow viewport | Open drawer | Full-screen slide-over | ☐ |
| 12 | Regression | — | Schedule Break flow | Unchanged | ☐ |

**Gate:** All rows PASS before declaring runbook complete.

---

## Decision points (founder)

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Queue while idle (no active session) | (A) Queue only when session active (B) Allow pre-queue | **(A)** — matches Schedule Break attachment model |
| 2 | Active task row below timer | (A) Preview only (B) Keep separate active row + preview | **(A)** — minimizes height; Current on preview row |
| 3 | Auto `findTaskAtNow` when queue empty | (A) Keep auto (B) Disable entirely (C) Disable when queue non-empty only | **(C)** — preserves empty-queue today behavior |

Record choices in decision-log if different from defaults.

---

## Out of scope

- Today's Tasks NEXT queue (`workplace-tasks-card.tsx`, `QUEUE_CAP = 5`) — unchanged
- Pomodoro tab on Focus card
- `/focus` hub queue UI
- `fable5` / greenfield prototypes
- dnd-kit migration
- Supabase persistence for queue
- Command palette integration
- Auto-start scheduled items
- New strategy docs except decision-log, july-log, FEATURE_INVENTORY touch

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep into Today V3 NEXT queue | Wrong feature | Naming disambiguation table; code review |
| Timer layout regression | Frozen spec violation | Session 6 bounding-box check |
| Auto-schedule vs user queue conflict | Trust loss | Decision point #3; Session 5 guards |
| Monolithic focus card | Hard to maintain | Component extraction Sessions 2–3 |

---

## Code baseline / operational gotchas

1. `StoredActiveFocusSession` already extended for Schedule Break — queue fields follow same optional-field pattern.
2. Multi-tab sync: extend existing `storage` listener in `focus-session-context.tsx`; do not add second listener.
3. `preview-context.tsx` is **task board only** — do not wire Focus queue through it.
4. `partitionWorkplaceTasks().queue` is **not** Next Up — never import for Focus queue data.
5. Habit drops require `isFocusableHabit()` — reuse existing gate.
6. `workplace-focus-card.tsx` is already large — new UI must live in `src/components/focus/next-up-*.tsx`.

---

## Explicitly deferred (not V1)

| Item | When |
|------|------|
| Full `+ Add` searchable picker | Post-V1 if drag-only insufficient |
| Import from Today's NEXT queue | Future convenience |
| Queue across sessions | Conflicts with session-scoped spec |
| Browser notifications for schedule | Optional bonus; in-app primary |

---

## M2-Next-Up completion checklist

| # | Criterion | Done |
|---|-----------|------|
| 1 | `NextUpItem` type + `next-up-queue.ts` helpers | ☐ |
| 2 | Session persistence + multi-tab sync | ☐ |
| 3 | Collapsed preview (max 3, no scroll) | ☐ |
| 4 | Expanded drawer split + animation | ☐ |
| 5 | DnD from Tasks, Habits, Timeline | ☐ |
| 6 | Reorder + remove + duplicate no-op | ☐ |
| 7 | Scheduled suggestion notification | ☐ |
| 8 | Mobile slide-over + keyboard + reduced motion | ☐ |
| 9 | `FEATURE_INVENTORY.md` updated | ☐ |
| 10 | `npm run build && npm run lint` clean | ☐ |
| 11 | Founder approval for merge to `main` | ☐ |

**Acceptance test:** Founder opens `/`, runs a focus session, builds a queue via drag, expands drawer, reorders, receives a scheduled suggestion and chooses Keep Current or Start — timer never changes height, never auto-switches. ☐

---

## After runbook complete

1. SRAI review note in `docs/review/focus/` (optional implementation review doc).  
2. Append [july-log.md](../logs/july-log.md) with branch/commits/production URL.  
3. Link runbook from [next-up-queue-spec.md](../../review/design/next-up-queue-spec.md) Related section if not already present.

---

## Self-critique

1. **Six sessions vs one mega-session:** Spec phases are independently mergeable; six branches reduce rollback blast radius but add merge overhead. Bundles B1–B6 allow founder to batch merges.
2. **Active row vs preview-only:** Default (A) reduces timer-adjacent chrome but may hide rich `TaskFocusRow` actions (Done/Start). Mitigation: queue rows carry Done; Start = activate row.
3. **No automated tests:** Mirror Schedule Break — pure `next-up-queue.ts` is test-ready if vitest coverage is extended later.
4. **`findTaskAtNow` interaction:** Highest product risk; Session 5 must explicitly guard to avoid fighting user queue.

---

*End of runbook.*
