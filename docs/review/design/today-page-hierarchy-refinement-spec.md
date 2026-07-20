# Today Page Visual Hierarchy & Execution Flow Refinement

**Status:** **Shipped** — hierarchy refinement merged to `main` (2026-07-17). Spec retained as historical contract.  
**Scope:** Today / Focus workspace (`/`)  
**Priority:** High  
**Design direction:** Preserve current functionality while adopting stronger visual hierarchy and the PLAN → COMMIT → EXECUTE model.  
**Implementation:** [m2-today-hierarchy-refinement.md](../../execution/runbooks/m2-today-hierarchy-refinement.md)

---

## 1. Overview

The current FlowOS Today page already contains the necessary functional architecture:

- Daily progress summary
- Quick Capture
- Focus and Pomodoro modes
- Continuous focus timer
- Schedule Break system
- Current Focus
- Next Up preview
- Task and Habit launchers
- Daily Timeline

The next iteration should **not** rebuild the page architecture from scratch. The objective is to improve the existing implementation through:

- Stronger visual hierarchy
- Better surface hierarchy
- Reduced visual noise
- More compact Current Focus presentation
- Improved Timeline proportions
- A full Next Up Queue system
- Larger Task and Habit overlays
- Better drag-and-drop interactions between Tasks, Habits, Timeline, Queue, and Focus

The final Today page should communicate the following execution model:

```
PLAN          COMMIT          EXECUTE

Timeline  →  Next Up Queue  →  Current Focus
Planned       Next              Now
```

The primary product hierarchy is:

```
NOW      →      NEXT      →      PLANNED
Focus           Queue             Timeline
```

---

## 2. Design Principles

### 2.1 Focus is the primary state

The Focus timer should be the visual center of the workspace.

It should not feel like another card or widget.

The page background itself acts as the timer's surface.

**Do**

- Keep the timer large and visually dominant.
- Use whitespace around the timer.
- Use the primary blue accent for the active focus state.
- Keep supporting metadata visually quieter.

**Do not**

- Place the timer inside a large visible card.
- Add unnecessary borders around the entire Focus section.
- Give secondary statistics equal visual weight to the timer.

### 2.2 Cards are for content, not every section

FlowOS should avoid excessive card nesting.

| No card background | Card or surface background |
|--------------------|----------------------------|
| Focus timer area | Current Focus |
| General workspace area | Next Up preview |
| Basic section labels | Queue items |
| Supporting statistics | Timeline events |
| | Task/Habit overlays |
| | Selected task detail preview |

This creates a clear distinction:

> System state exists in the workspace. Content exists on surfaces.

### 2.3 Preserve functional depth

The current implementation contains functionality that should remain:

- Daily summary bar
- Schedule Break
- Next Break countdown
- Focus Reflection
- Current Focus details
- Timeline
- Task and Habit launchers

The goal is to visually refine these features rather than remove useful functionality simply to imitate an AI-generated mockup.

---

## 3. Target Page Architecture

### Default State

```
┌──────┬─────────────────────────────────────┬──────────────┐
│      │ Daily Summary                       │              │
│      ├─────────────────────────────────────┤              │
│      │ Quick Capture                       │              │
│      │                                     │              │
│ Nav  │ Focus                               │   Timeline   │
│      │                                     │              │
│      │               28:47                 │              │
│      │              IN FOCUS               │              │
│      │                                     │              │
│      │          Next Break                 │              │
│      │                                     │              │
│      │ ┌─────────────────────────────────┐ │              │
│      │ │ Current Focus                   │ │              │
│      │ └─────────────────────────────────┘ │              │
│      │                                     │              │
│      │ ┌─────────────────────────────────┐ │              │
│      │ │ Next Up Preview                 │ │              │
│      │ └─────────────────────────────────┘ │              │
│      │                                     │              │
│      │ [ Task ] [ Habit ] [ Music ]        │              │
└──────┴─────────────────────────────────────┴──────────────┘
```

### Queue Open State

```
┌──────┬──────────────────────────┬──────────────┬──────────────┐
│      │ Main Workspace           │ Next Up      │ Timeline     │
│      │                          │ Queue        │              │
│ Nav  │ Focus                    │              │ Planned      │
│      │ Current Focus            │ Next         │ Schedule     │
│      │ Next Up Preview          │ Actions      │              │
│      │                          │              │              │
└──────┴──────────────────────────┴──────────────┴──────────────┘

             NOW                     NEXT           PLANNED
```

---

## 4. Surface Hierarchy

The current UI uses too much contrast between the page background and the Current Focus card.

The new system should use gradual surface elevation.

### Recommended tokens

Adapt these to existing FlowOS design tokens rather than duplicating if equivalents already exist (see [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md)).

```css
:root {
  /* Foundation */
  --background-base: #080f18;

  /* Surface hierarchy */
  --surface-panel: #0d1522;
  --surface-card: #111b2a;
  --surface-elevated: #162235;
  --surface-hover: #1a2940;

  /* Borders */
  --border-subtle: rgba(148, 163, 184, 0.10);
  --border-default: rgba(148, 163, 184, 0.14);
  --border-strong: rgba(148, 163, 184, 0.22);

  /* Primary */
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-subtle: rgba(59, 130, 246, 0.12);
  --primary-border: rgba(59, 130, 246, 0.40);

  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-muted: #64748b;
}
```

### Surface order

| Level | Surface | Hex | Usage |
|-------|---------|-----|-------|
| 0 | Page Background | `#080F18` | Main application background |
| 1 | Structural Panel | `#0D1522` | Timeline, Queue, structural side regions |
| 2 | Content Card | `#111B2A` | Current Focus, Queue items, Timeline events |
| 3 | Elevated Overlay | `#162235` | Task/Habit overlays and detail panes |
| — | Hover / Selected | `#1A2940` | Selected rows, hover states, drag targets |

---

## 5. Focus Timer Refinement

### Current problems

The current timer section contains several competing pieces of information:

- Session number
- Timer
- Focusing state
- Focus duration
- Break duration
- Next Break

This weakens the timer hierarchy.

### New structure

```
Focus                                      Pomodoro   ···


                         28:47

                       IN FOCUS


                 Focused 28m 47s  •  Break 0s


        Next Break   35 min  •  10 min break  •  6:13
```

### Changes

**Remove from primary timer area:** Session count (e.g. "Session 7").

Session count can remain available in Focus history, Session details, or Reflection. It should not appear directly above the timer.

**Change state label:** `FOCUSING` → `IN FOCUS`

**Timer sizing:**

```css
font-size: clamp(64px, 5vw, 88px);
font-weight: 600;
letter-spacing: -0.03em;
```

The timer should remain dominant without becoming excessively large.

---

## 6. Schedule Break / Next Break

The Schedule Break system should remain. It is a differentiating part of the continuous Focus system.

### Default state

When no break is scheduled: `[ Schedule Break ]`

### Scheduled state

```
┌──────────────────────────────────────────────────┐
│ Next Break   35 min  •  10 min break  •  6:13   │
└──────────────────────────────────────────────────┘
```

The component should remain visually secondary to the timer.

### Recommended styling

- Low-contrast surface
- Subtle border
- Blue only for the active countdown
- No bright full-width background
- Compact height: **36–44px**

---

## 7. Current Focus Card

### Objective

Current Focus should remain the most important content card but should not consume excessive vertical space.

### Recommended structure

```
┌─────────────────────────────────────────────────────┐
│ CURRENT FOCUS                                       │
│                                                     │
│ Build Authentication API                    ···    │
│ [Inbox]                                             │
│                                                     │
│ Focused 16m 32s  •  Goal 45 min  •  In Focus       │
│─────────────────────────────────────────────────────│
│ Description                                         │
│                                                     │
│ Implement authentication endpoints...               │
│                                                     │
│ • Create login and register endpoints               │
│ • Generate JWT tokens                               │
│ • Implement refresh token rotation                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Height:** `height: clamp(220px, 28vh, 320px);` — test across viewport sizes.

### Internal scrolling

Only the content body should scroll. Fixed: card header, task title, metadata, action buttons.

```
┌──────────────────────┐
│ Fixed Header         │
│ Fixed Metadata       │
├──────────────────────┤
│                      │
│ Scrollable Content   │
│                      │
└──────────────────────┘
```

---

## 8. Next Up Preview

The existing Next Up section remains in the main workspace. It is **not** replaced by the full Queue.

Its purpose is to provide immediate awareness of the next execution item.

### Default state

Show the first item only:

```
┌───────────────────────────────────────────────────┐
│ ◷ Next Up (3)                                     │
├───────────────────────────────────────────────────┤
│ ○  🚩 Review Pull Request     Inbox      25 min  › │
│                                                   │
│    2 more  ⌄                                      │
└───────────────────────────────────────────────────┘
```

### Interaction

Clicking any of the following opens the full Queue:

- Next Up header
- Queue count
- `2 more`
- Expand chevron

The preview should remain compact.

---

## 9. Full Next Up Queue

### Product purpose

The Queue is not another task list. Its purpose is to define the user's immediate execution sequence.

| Surface | Answers |
|---------|---------|
| Task Management | What needs to be done |
| Timeline | When things are planned |
| Queue | What I intend to do next |
| Focus | What I am doing now |

### Queue location

The Queue opens **between** the Main Workspace and Timeline:

```
Main Workspace | Next Up Queue | Timeline
     NOW       |     NEXT      |  PLANNED
```

### Default state

The Queue is **closed by default**. It should not permanently consume horizontal space.

### Open triggers

- User clicks the Queue rail/icon
- User clicks the Next Up preview
- User clicks `2 more`
- User begins dragging a Task, Habit, or Timeline item

### Width

```
Minimum:     300px
Preferred:   320px
Maximum:     360px

width: clamp(300px, 22vw, 360px);
```

### Queue structure

```
┌──────────── NEXT UP QUEUE ────────────┐
│                                      │
│ Your upcoming focus sequence.        │
│ Drag to reorder.                     │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 1  ☑ Review Pull Request         │ │
│ │      Task              25 min    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 2  ↻ Study C++ Concepts          │ │
│ │      Habit             40 min    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 3  ◷ Project Review              │ │
│ │      Schedule          60 min    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │        + Drop here               │ │
│ │        to add to queue           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ 3 items  •  ~125 min      Clear All │
└──────────────────────────────────────┘
```

---

## 10. Queue Collapsed State

When closed, use a narrow Queue rail between the workspace and Timeline.

**Width:** 36–44px

```
Main Workspace │ ☷ 3 │ Timeline
```

The rail contains: Queue icon, item count badge, open/close affordance.

The rail should remain visually quiet until hovered, focused, or dragging an eligible item.

---

## 11. Queue Open/Close Behaviour

### Manually opened

```
Click Queue → Queue opens → Queue remains open
```

Closes when: user clicks close, clicks the Queue rail again, or presses Escape.

### Automatically opened during drag

```
Begin dragging eligible item
    ↓
Queue automatically opens
    ↓
Drop item into Queue
    ↓
Show successful insertion
    ↓
Queue may close after 600–900ms
```

Automatic closing only applies if the Queue was opened automatically. If it was already manually open, it remains open.

---

## 12. Queue Data Model

Queue items should reference their source object. Do not duplicate the full Task, Habit, or Schedule object.

```ts
type QueueSourceType = "task" | "habit" | "schedule";

interface QueueItem {
  id: string;
  sourceType: QueueSourceType;
  sourceId: string;
  position: number;
  addedAt: string;
}
```

The UI resolves display information from the original source. This prevents synchronization problems when a title changes, a habit updates, a scheduled event changes time, a task is completed, or an item is deleted.

**Note:** An earlier Next Up V2 decision persisted a task-only queue on `tasks.queue_order`. This refinement extends the product model to tasks, habits, and schedule references. Implementation must reconcile with that decision in the decision-log before Session 5 of the runbook.

---

## 13. Timeline Refinement

### Current issue

The current Timeline uses substantial horizontal space while much of that space remains empty.

### Recommended width

```
Minimum:   300px
Normal:    320–360px
```

The Timeline should remain a persistent planning context. It should not dominate the workspace.

### Timeline relationship with Queue

Dragging a Timeline item into Queue:

```
Timeline Event → Drag → Queue opens → Drop into Queue
```

The Timeline event **remains** on the Timeline. Queue stores a reference to it.

Example after adding:

- Timeline still shows: Project Review, 3:00 PM – 4:00 PM
- Queue shows: 1. Project Review

The schedule is not moved or deleted.

---

## 14. Task and Habit Launcher

The bottom controls should be treated as a persistent launcher dock.

```
[ ☑ Task ]   [ ↻ Habit ]   [ ♫ Music ]
```

**Location:** Bottom of the main workspace, aligned with the main content column, persistent while the Today workspace is active.

---

## 15. Task Overlay

**Trigger:** Click `[ Task ]`  
**Position:** Opens directly above the Task button — spatially connected to its trigger.

### Size

```
Width:  min(760px, available workspace width)
Height: clamp(380px, 52vh, 520px)
```

### Layout

Two-column structure:

```
┌─────────────────────────────────────────────────────┐
│ TASKS                                           ×   │
│                                                     │
│ Search tasks...                    Filter   ···     │
│                                                     │
│ All | High Priority | Today | Upcoming | Completed  │
│────────────────────────────┬────────────────────────│
│                            │                        │
│ TASK LIST                  │ SELECTED TASK          │
│                            │                        │
│ ○ Fix authentication      │ Review Pull Request    │
│ ○ Review Pull Request     │                        │
│ ○ Optimize database       │ Description            │
│ ○ Update documentation    │ Metadata               │
│                            │ Subtasks               │
│                            │                        │
│ + New Task                │              View Task │
└────────────────────────────┴────────────────────────┘
        ▲
        │
    [ Task ]
```

**Left pane:** Search, filters, task groups, task rows, drag handles, priority, estimated duration.  
**Right pane:** Title, priority, project, due date, duration, description preview, subtask progress, View Task.

---

## 16. Habit Overlay

Same interaction model as Task. Opens directly above `[ Habit ]`.

```
┌─────────────────────────────────────────────────────┐
│ HABITS                                          ×   │
│                                                     │
│ Search habits...                                    │
│────────────────────────────┬────────────────────────│
│                            │                        │
│ HABIT LIST                 │ SELECTED HABIT         │
│                            │                        │
│ ↻ Study C++               │ Study C++              │
│ ↻ Read                    │                        │
│ ↻ Exercise                │ Current streak         │
│ ↻ Mathurat                │ Today's status         │
│                            │ Goal                   │
│                            │ History                │
└────────────────────────────┴────────────────────────┘
             ▲
             │
         [ Habit ]
```

---

## 17. Drag and Drop

Sources that can be dragged into Queue:

```
Task Overlay ────────┐
                     │
Habit Overlay ───────┼──→ Next Up Queue
                     │
Timeline ────────────┘
```

### Drag initiation

When dragging begins:

- Reduce dragged source opacity
- Create a compact drag preview
- Open Queue automatically if closed
- Highlight the Queue drop region

### Drag preview

Do not drag the entire original card. Use a compact preview:

```
┌────────────────────────────────┐
│ ☑ Review Pull Request    25 min│
└────────────────────────────────┘
```

### Queue drag state

**Default:**

```
┌──────────────────────────┐
│ + Drop here              │
│   to add to queue        │
└──────────────────────────┘
```

**Active:**

```
╔══════════════════════════╗
║ + RELEASE TO ADD         ║
║   Position 2             ║
╚══════════════════════════╝
```

Use the primary blue only during active drag interaction.

---

## 18. Queue Reordering

Queue items can be reordered vertically. Use a clear insertion line rather than requiring the user to drop directly onto another card.

```
Before: 1 A, 2 B, 3 C
Drag C between A and B → 1 A, 2 C, 3 B
```

---

## 19. Focus Completion Flow

When a focus session ends:

```
┌───────────────────────────────────────┐
│ Focus complete                        │
│                                       │
│ Build Authentication API              │
│ 28m 47s                               │
│                                       │
│ NEXT UP                               │
│ Review Pull Request                   │
│ 25 min                                │
│                                       │
│ [ Start Next ]    [ Choose Another ]  │
└───────────────────────────────────────┘
```

### Start Next

1. Current Queue item becomes Current Focus
2. Item is removed from Queue
3. Remaining Queue positions update
4. Focus begins according to existing FlowOS focus-start behaviour

```
Before: 1 Review PR, 2 Study C++, 3 Project Review
After Start Next: 1 Study C++, 2 Project Review
```

---

## 20. Responsive Behaviour

| Breakpoint | Layout |
|------------|--------|
| Large desktop | Nav \| Workspace \| Queue \| Timeline \| Utility Rail — all panels coexist |
| Medium desktop | Workspace shrinks; Timeline → min width; Queue ~320px |
| Small desktop / tablet | Queue becomes overlay drawer over Workspace \| Timeline |

**Priority:** Focus > Queue > Timeline

---

## 21. Color Hierarchy

### Primary blue

Use for: Active Focus state, timer status, primary actions, selected navigation, current Timeline indicator, drag-and-drop active state, focus rings.

Do **not** use blue decoratively everywhere.

### Semantic colours (small accents only)

| Color | Use |
|-------|-----|
| Red | High priority, destructive actions |
| Amber | Medium priority, warning states |
| Green | Habits, success, completion |
| Purple | Schedule items, calendar-related categorisation |

These should not become large surface backgrounds.

---

## 22. Implementation Order

See the runbook for session-level steps. Spec phases:

| Phase | Focus |
|-------|-------|
| 1 | Visual foundation — surface hierarchy, borders, text |
| 2 | Focus hierarchy — timer, IN FOCUS, Next Break strip |
| 3 | Current Focus — compact card, fixed header, scroll body |
| 4 | Timeline — reduce width, event density |
| 5 | Queue foundation — model, rail, panel, preview wiring |
| 6 | Queue interactions — reorder, DnD from Task/Habit/Timeline |
| 7 | Task and Habit overlays — larger two-pane launchers |
| 8 | Execution flow — Start Next, persistence, orphan handling |
| 9 | Polish — motion, a11y, responsive, empty/loading/error |

---

## 23. Acceptance Criteria

The redesign is complete when:

- [ ] The timer is visually dominant without using a card background
- [ ] The Today page retains all existing functional capabilities
- [ ] Current Focus is visually important but more compact
- [ ] Current Focus content scrolls independently when necessary
- [ ] Timeline uses less unnecessary horizontal space
- [ ] Next Up preview shows the immediate next item
- [ ] Full Queue opens between Workspace and Timeline on large screens
- [ ] Queue is closed by default
- [ ] Queue can be opened manually
- [ ] Queue automatically opens when dragging an eligible item
- [ ] Tasks can be dragged into Queue
- [ ] Habits can be dragged into Queue
- [ ] Timeline items can be dragged into Queue
- [ ] Queue items can be reordered
- [ ] Timeline items remain scheduled after being queued
- [ ] Task overlay opens directly above the Task launcher
- [ ] Habit overlay opens directly above the Habit launcher
- [ ] Task and Habit overlays provide sufficient space for browsing and inspection
- [ ] Queue integrates with the Focus completion flow
- [ ] The interface maintains the established FlowOS surface hierarchy

---

## 24. Final Product Model

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  TASKS / HABITS        TIMELINE       QUEUE       FOCUS    │
│                                                            │
│  What exists      →    When       →   Next    →    Now     │
│                       planned          committed   executing│
│                                                            │
└────────────────────────────────────────────────────────────┘
```

Or, from the user's daily perspective:

```
CAPTURE → ORGANIZE → PLAN → COMMIT → FOCUS → REFLECT
```

**Key design principle:**

> FlowOS should make the next action obvious without making the entire system visible at once.

The current implementation provides the functional foundation. This refinement should make that functionality feel intentional, calm, and coherent, while establishing Focus → Queue → Timeline as the central execution model of the Today workspace.

---

## Relationship to other docs

| Doc | Relationship |
|-----|--------------|
| [today-v3-greenfield-design.md](./today-v3-greenfield-design.md) | Separate Day Engine rebuild. This spec **refines** the current page; it does not replace or resume V3 Phase C. |
| [m2-next-up-queue.md](../../execution/runbooks/m2-next-up-queue.md) | Historical / superseded queue plan. Use this spec + new runbook for the multi-source Queue. |
| [next-up-queue-spec.md](./next-up-queue-spec.md) | Earlier Next Up UX. Superseded where it conflicts with §§8–12, 17–19 here. |
| [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) | Visual token authority — adapt §4 tokens to v3, do not fork a parallel palette. |
| [schedule-break-modal-spec.md](./schedule-break-modal-spec.md) | Schedule Break behaviour preserved; §6 is visual refinement only. |
