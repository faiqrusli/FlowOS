# FlowOS Design Specification v1.0 — Superseded

**Feature:** Next Up Queue  
**Status:** Superseded by V2  
**Version:** 1.0  
**Owner:** FlowOS Product  
**Purpose:** Historical record of the session-scoped task/habit queue design.

**Superseded by:** [Decision Log — Next Up V2](../../execution/logs/decision-log.md#2026-07-10--next-up-v2-persistent-task-execution-queue). V2 is task-only, persists `tasks.queue_order`, and separates execution controls from planning.

**Related:** [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) · [m2-next-up-queue.md](../../execution/runbooks/m2-next-up-queue.md) · `workplace-focus-card.tsx`

---

## 1. Status

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Version** | 1.0 |
| **Owner** | FlowOS Product |
| **Purpose** | Single source of truth for design and implementation |

---

## 2. Product Vision

Next Up is FlowOS's **execution layer**.

| Layer | Question it answers |
|-------|---------------------|
| **Tasks & Habits** | What exists? |
| **Timeline** | What was planned? |
| **Next Up** | What should I do now? |
| **Focus** | What am I doing right now? |
| **Reflection** | What did I learn? |

Next Up bridges planning and execution without forcing users to constantly edit their schedule. It sits between the day's inventory (tasks, habits, timeline) and the active focus session — a short, ordered queue of actionable items the user controls.

---

## 3. Frozen Decisions

No discussion. Only decisions.

- ✓ Feature name is **Next Up**.
- ✓ Next Up belongs to **Focus**.
- ✓ Maximum **3** preview items.
- ✓ Queue **never scrolls** inside Focus (collapsed state).
- ✓ Overflow opens an **expandable right-side drawer**.
- ✓ Timer **always remains the hero element**.
- ✓ Drawer transforms the Focus card into a **split workspace**.
- ✓ Timeline **never interrupts focus**.
- ✓ Scheduled tasks become **actionable suggestions**.
- ✓ Users **always control** context switching.
- ✓ Tasks and Habits can both be queued.
- ✓ Drag-and-drop supported from Tasks, Habits, and Timeline.

---

## 4. Information Architecture

```
Tasks
      │
Habits
      │
Timeline
      │
      ▼
──────────────
   Next Up
──────────────
      │
      ▼
──────────────
    Focus
──────────────
      │
      ▼
──────────────
  Reflection
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **Tasks** | Inventory of work items. Source material for the queue — not the execution surface. |
| **Habits** | Recurring commitments. Source material for the queue — interleaved with tasks when queued. |
| **Timeline** | Planned schedule. Supplies time-aware suggestions; never hijacks the focus session. |
| **Next Up** | Short ordered queue of what to do next. User-controlled. Bridges planning → execution. |
| **Focus** | Active work session. Timer is hero. One item is "current"; queue feeds what follows. |
| **Reflection** | Session and day close. Captures what happened after execution. |

---

## 5. UX Principles

1. **Focus first** — The timer and session controls dominate. Everything else is secondary.
2. **Execution before planning** — Next Up is for doing, not reorganizing the day.
3. **Minimal UI** — Preview shows only what matters now; full queue is one click away.
4. **Never force context switching** — Timeline suggestions are offers, not interruptions.
5. **Always preserve timer visibility** — Timer height, font, and prominence never change.
6. **One-click queue management** — Add, remove, reorder, and expand with minimal friction.
7. **Progressive disclosure** — 3-item preview → drawer for the full queue.

---

## 6. Focus Card (Collapsed)

```
┌──────────────────────────────────────────────────────────┐
│ Focus                                           Reflect  │
│                                                          │
│                     Session 3                            │
│                                                          │
│                      42:13                               │
│                                                          │
│                Pause  Break  Stop                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Next Up (6)                                  + Add       │
│                                                          │
│ ● Draft Product Spec                    Current          │
│ ○ Morning Stretch                                        │
│ ○ Review PR                                              │
│                                                          │
│ View all (3 more) →                                     │
└──────────────────────────────────────────────────────────┘
```

### Collapsed layout rules

- **Header row:** "Next Up (N)" with count + **+ Add** action.
- **Preview:** Up to 3 items. No internal scroll.
- **Current item:** Marked with filled bullet (●) and "Current" label when it matches the active focus task.
- **Queued items:** Hollow bullet (○).
- **Overflow:** When queue length > 3, show `View all (N more) →` — opens the expanded drawer.
- **Timer:** Unchanged height and font. Hero element above the Next Up strip.

---

## 7. Expanded State

### Overview

Clicking **Next Up** or **View all (N more)** transforms the Focus card into a split workspace.

This is **not** a modal or overlay.

The Focus card itself expands into two panes:

- **Left:** Focus Workspace
- **Right:** Next Up Drawer

The transition should feel like extending the Focus experience rather than opening a new page.

### Layout

```
┌──────────────────────────────┬──────────────────────────────────────┐
│ Focus                        │ Next Up (6)                    ✕     │
│                              ├──────────────────────────────────────┤
│ Session 3                    │ + Add Item                          │
│                              │                                      │
│         42:13                │ ☰ Draft Product Spec        Current  │
│                              │ ☰ Morning Stretch                  ✕ │
│ Pause  Break  Stop           │ ☰ Review PR                       ✕ │
│                              │ ☰ Study Algorithms                ✕ │
│ Focus 42m                    │ ☰ Workout                         ✕ │
│                              │ ☰ Reading                         ✕ │
│                              │                                      │
│                              │──────────────────────────────────────│
│                              │ Drop tasks or habits here           │
└──────────────────────────────┴──────────────────────────────────────┘
```

### Split layout

When expanded:

- Focus Workspace occupies approximately **60–65%** of the available width.
- Next Up Drawer occupies approximately **35–40%**.
- The exact ratio may adapt responsively.
- The timer remains visually dominant.

### Focus Workspace (left pane)

**Visible**

- Session name
- Focus timer
- Focus controls (Pause · Break · Stop)
- Current focus duration

**Hidden**

- Next Up preview
- Secondary statistics
- Any redundant metadata

**Frozen**

- The timer never changes height.
- The timer font remains unchanged.

### Next Up Drawer (right pane)

The drawer becomes the complete queue management interface.

**Contains**

- Queue title + count
- Close (✕) action
- **+ Add Item** action
- Full queue list with drag handles (☰)
- Per-item remove (✕)
- Current item indicator
- Drop zone at bottom

**Supports**

- Drag & Drop
- Reordering
- Removing
- Unlimited queue length
- Independent scrolling

### Scrolling

| Pane | Behavior |
|------|----------|
| **Focus Workspace** | Never scrolls. |
| **Next Up Drawer** | Scrolls independently. Only the queue list scrolls. |

The running timer must never move while scrolling.

### Animation

**Opening**

- Slides drawer from the right.
- Expands the Focus card into two panes.
- Duration: **200–250ms**.
- Easing: **ease-out**.
- Respect `prefers-reduced-motion`.

**Closing**

- Reverses the animation.
- Restores the collapsed layout.
- Preserves queue state.

The timer must never restart or flicker.

### Responsive behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| **Desktop** | Split workspace (60–65% / 35–40%). |
| **Tablet** | Reduced drawer width. Timer remains readable. |
| **Mobile** | Replace split layout with a **full-screen slide-over panel**. Do not attempt a two-column layout. |

### Interaction

**Opening**

- Click **Next Up** header
- Click **View all (N more)**

**Closing**

- Close button (✕)
- `ESC`
- Click **Next Up** again (toggle)

### Expanded-state frozen constraints

- ✓ Focus card transforms instead of opening a modal.
- ✓ Timer remains the primary visual element.
- ✓ Timer height never changes.
- ✓ Queue preview is replaced by the drawer.
- ✓ Queue drawer manages the complete queue.
- ✓ Queue preview never exists simultaneously with the expanded drawer.
- ✓ Queue drawer scrolls independently.
- ✓ Focus Workspace never scrolls.
- ✓ Drag-and-drop remains enabled while expanded.
- ✓ Closing the drawer preserves queue order and scroll position.

---

## 8. Queue Preview Rules

| State | Display |
|-------|---------|
| **Empty** | `Drag tasks or habits here.` |
| **One item** | `● Draft Product Spec` |
| **Three items** | `● Draft` · `○ Workout` · `○ Reading` |
| **Overflow (>3)** | First 3 items + `View all (N more) →` |

### Preview constraints (frozen)

- Preview always displays a maximum of **3 items**.
- Preview **never scrolls**.
- Preview and drawer share the same queue state.
- Only one Next Up queue exists per focus session.

---

## 9. Queue Drawer

Everything inside the drawer.

### Row anatomy

```
☰  Title                              Status    ✕
│    │                                   │       │
│    │                                   │       └── Remove
│    │                                   └── Current (when active)
│    └── Item title
└── Drag handle
```

### Drawer regions (top → bottom)

| Region | Content |
|--------|---------|
| **Header** | `Next Up (N)` · close (✕) |
| **Actions** | `+ Add Item` |
| **List** | Scrollable queue rows |
| **Drop zone** | `Drop tasks or habits here` — fixed at bottom of drawer |

### Spacing & styling

- Queue items reuse the standard FlowOS interactive list component.
- Spacing, padding, border radius, and row height inherit from [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md).
- Drawer opens from the **right side** of the Focus card.

### Ordering

- Position is user-controlled via drag-and-drop.
- Default insert position: end of queue.
- Reorder persists immediately.

### Interactions

| Action | Behaviour |
|--------|-----------|
| **Drag handle (☰)** | Reorder within queue |
| **Remove (✕)** | Remove item from queue (does not delete source task/habit) |
| **Click row** | Set as current focus context (user-initiated) |
| **Drop zone** | Accept drops from Tasks, Habits, Timeline |

---

## 10. Drag & Drop

### Supported sources → Next Up

```
Today's Tasks  ──→  Next Up
Today's Habits ──→  Next Up
Timeline       ──→  Next Up
```

### Supported destinations

| Destination | Action |
|-------------|--------|
| **Next Up queue** | Add item |
| **Drop zone (drawer bottom)** | Add item (explicit target) |
| **Within queue** | Reorder |

### Operations

| Operation | Behaviour |
|-----------|-----------|
| **Reordering** | Drag handle within drawer list; position persists |
| **Removing** | ✕ on row; item leaves queue, source entity unchanged |
| **Completion** | Mark complete from queue row; item moves to completed state, removed from queue |

### Constraints

- Drag-and-drop enabled in both collapsed (preview) and expanded (drawer) states.
- Dropping a duplicate of an already-queued item is a no-op (see Edge Cases).

---

## 11. Scheduled Task Logic

Timeline items become **suggestions**, not interruptions.

```
Timeline
   │
   ▼
 3:58  — user focusing
   │
   ▼
 4:00  — "Study" scheduled start time reached
   │
   ▼
Notification appears (non-blocking)
   │
   ├── Keep Current  — dismiss; continue current focus
   │
   └── Start Study   — switch focus context to scheduled item
```

### Rules (frozen)

- Timeline **never interrupts focus** automatically.
- Scheduled tasks surface as **actionable suggestions** at their start time.
- User **always controls** context switching.
- No auto-start. No modal takeover. Notification only.

---

## 12. Notifications

### Scheduled task suggestion

```
┌────────────────────────────────────────────┐
│  Study Algorithms is scheduled now         │
│                                            │
│         [ Keep Current ]  [ Start Study ]  │
└────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| **Message** | `{title} is scheduled now` |
| **Primary action** | `Start Study` — switches focus to scheduled item |
| **Secondary action** | `Keep Current` — dismisses notification, no context switch |
| **Dismiss** | Clicking outside or `ESC` equivalent to Keep Current |

### Behaviour

- Appears as an in-app card/toast — not a modal.
- Does not obscure the timer.
- Does not pause or reset the focus timer.
- Multiple snoozes are allowed; each re-surfaces the suggestion after the snooze interval (see Edge Cases).
- OS browser notifications may fire as a bonus channel when tab is backgrounded; in-app card remains primary.

---

## 13. Component Architecture

```
FocusCard
├── Timer
├── Controls
├── NextUpPreview
├── QueueDrawer
│   ├── QueueList
│   │   └── QueueItem
│   └── DropZone
├── ScheduledTaskBanner
└── Notifications
```

| Component | Responsibility |
|-----------|----------------|
| **FocusCard** | Container; manages collapsed ↔ expanded layout |
| **Timer** | Session name, countdown, ring — hero element |
| **Controls** | Pause · Break · Stop · Schedule Break |
| **NextUpPreview** | Collapsed 3-item strip + overflow affordance |
| **QueueDrawer** | Expanded right pane; full queue management |
| **QueueList** | Scrollable ordered list |
| **QueueItem** | Single row: handle, title, status, remove |
| **DropZone** | Bottom drop target in drawer |
| **ScheduledTaskBanner** | Inline suggestion when timeline item is due |
| **Notifications** | Toast/card for scheduled-task prompts |

---

## 14. Data Model

### NextUpItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique queue entry ID |
| `type` | `"task" \| "habit"` | Entity type |
| `source` | `"tasks" \| "habits" \| "timeline" \| "manual"` | Where the item was added from |
| `originId` | `string` | ID of the source task or habit |
| `title` | `string` | Display title (denormalized for fast render) |
| `position` | `number` | Sort order (0-based) |
| `createdAt` | `string` (ISO) | When added to queue |
| `completedAt` | `string \| null` (ISO) | When marked complete; `null` if active |

### Session scope

- One Next Up queue per active focus session.
- Queue state persists across drawer open/close.
- Queue survives browser refresh when focus session is persisted (same persistence layer as `StoredActiveFocusSession`).

---

## 15. State Machine

```
                    ┌─────────┐
                    │  Idle   │  (not in queue)
                    └────┬────┘
                         │ add to queue
                         ▼
                    ┌─────────┐
         ┌─────────│ Queued  │─────────┐
         │         └────┬────┘         │
         │ remove       │ start focus  │ remove
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐    ┌─────────┐
    │ Removed │   │ Active  │    │ Removed │
    └─────────┘   └────┬────┘    └─────────┘
                       │
              ┌────────┼────────┐
              │        │        │
         complete  switch   remove
              │    context      │
              ▼        │        ▼
         ┌─────────┐   │   ┌─────────┐
         │Completed│   │   │ Removed │
         └─────────┘   │   └─────────┘
                       ▼
                  ┌─────────┐
                  │ Queued  │  (previous active returns to queued)
                  └─────────┘
```

### Transitions

| From | Event | To |
|------|-------|----|
| Idle | Added to queue | Queued |
| Queued | User starts focus on item | Active |
| Queued | User removes | Removed |
| Active | User completes item | Completed |
| Active | User switches to another item | Queued (previous) + Active (new) |
| Active | User removes | Removed |
| Active | User stops focus session | Queued (all items remain queued) |
| Any | Source entity deleted elsewhere | Removed (queue entry pruned) |
| Any | Source entity completed elsewhere | Completed (queue entry pruned) |

---

## 16. Edge Cases

| Case | Expected behaviour |
|------|-------------------|
| **Queue empty** | Preview shows empty hint: "Drag tasks or habits here." Timer unaffected. |
| **Queue >100 items** | Drawer scrolls; no performance degradation target beyond smooth scroll. No cap on queue length. |
| **Drag duplicate** | No-op — item already in queue is not added again. |
| **Timeline item deleted** | Queue entry removed on next sync; no orphan rows. |
| **Task completed elsewhere** | Queue entry marked completed / removed on sync. |
| **Browser refresh** | Queue rehydrates from persisted session state. Order preserved. |
| **Offline** | Queue operations work locally; sync on reconnect. |
| **Multiple tabs** | Same persisted session source of truth; no independent queue drift. |
| **Snooze multiple times** | Each snooze re-schedules the suggestion; no cap on snooze count. |
| **Scheduled notification while drawer open** | Notification appears without closing drawer or moving timer. |
| **Expand drawer mid-drag** | Drop target remains valid; drag session continues. |
| **Mobile viewport** | Full-screen slide-over replaces split; all drawer features preserved. |

---

## 17. Implementation Plan

Small phases. Every phase independently mergeable.

| Phase | Scope | Mergeable alone |
|-------|-------|-----------------|
| **1 — Data model + persistence** | `NextUpItem` type, session-scoped storage, CRUD helpers | ✓ |
| **2 — Collapsed preview** | 3-item preview strip in `workplace-focus-card.tsx`, empty/overflow states | ✓ |
| **3 — Expanded drawer** | Split layout, animation, scroll isolation, open/close interactions | ✓ |
| **4 — Drag & drop** | Sources (Tasks, Habits, Timeline) → queue; reorder; drop zone | ✓ |
| **5 — Scheduled suggestions** | Timeline start-time detection, notification card, Keep Current / Start | ✓ |
| **6 — Polish + accessibility** | Keyboard nav, reduced motion, responsive mobile slide-over, zero layout shift audit | ✓ |

---

## 18. Acceptance Criteria

This is what implementation must satisfy.

- ✓ Timer never changes height.
- ✓ Queue preview shows max three items.
- ✓ Drawer scrolls independently.
- ✓ Focus never scrolls.
- ✓ Split layout animates smoothly (200–250ms ease-out).
- ✓ Drag-and-drop works from Tasks, Habits, and Timeline.
- ✓ Queue order persists.
- ✓ Timeline notification works (Keep Current / Start).
- ✓ Keyboard accessible.
- ✓ Responsive (mobile slide-over, no broken two-column).
- ✓ Zero layout shift on expand/collapse.

---

## Appendix A — Design Constraints

The following constraints are part of the product design and must remain consistent.

### Product constraints (frozen)

- Preview always displays a maximum of **3 items**.
- Preview never scrolls.
- The drawer opens from the **right side** of the Focus card.
- The drawer scrolls independently.
- The Focus workspace never scrolls.
- The Focus Timer remains the primary visual element.
- The timer never changes height or loses prominence.
- Focus controls remain visible in both collapsed and expanded states.
- The preview and drawer share the same queue state.
- Only one Next Up queue exists per focus session.

### Design constraints

- The expanded layout allocates approximately **60–65%** to the Focus workspace and **35–40%** to the Next Up drawer, adapting responsively.
- Queue items reuse the standard FlowOS interactive list component.
- Spacing, padding, border radius, and row height inherit from the FlowOS design system.
- Use the standard FlowOS motion token (approximately **200–250ms ease-out**) and respect reduced-motion preferences.
