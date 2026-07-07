# FlowOS — Schedule Break Modal

**Date:** July 7, 2026  
**Status:** Spec captured — not implemented  
**Target surface:** Focus timer (primary: Fable greenfield `/fable` focus hero; eventual: production `workplace-focus-card.tsx` quick-focus tab)  
**Related code:** `focus-session-context.tsx`, `focus-active-session.ts`, `fable5-focus-hero.tsx`, `workplace-focus-card.tsx`

---

## Objective

Design and implement a **Schedule Break** modal for the FlowOS Focus Timer.

The goal is to let users schedule a future break while keeping the current flexible focus philosophy. This is **not** a Pomodoro mode. The user remains in full control. Nothing starts automatically.

---

## Product philosophy (non-negotiable)

FlowOS focus sessions are **continuous**.

Users may:

- Focus indefinitely.
- Schedule a break at any time.
- Ignore breaks completely.
- Create their own Pomodoro-like workflow.

The app **never** automatically starts a break or resumes focus.

This is distinct from the existing **Pomodoro tab** (`autoBreak` in focus settings), which runs fixed focus/break cycles. Schedule Break complements quick focus — it adds optional reminders without changing the open-ended session model.

---

## Relationship to shipped behavior

| Today | After this feature |
|-------|---------------------|
| **Break** button starts a break immediately (`quick.startBreak`) | Unchanged — immediate break remains |
| Pomodoro tab with fixed focus/break lengths | Unchanged — separate workflow |
| No future break scheduling | **New:** one scheduled break per active focus session |
| No “break ready” notification at a focus-duration threshold | **New:** user-initiated notification + snooze |

---

## Opening

When the user clicks **Schedule Break**, open a modal.

Entry point: add **Schedule Break** alongside existing timer controls (Pause / Break / Stop). Do not replace the immediate **Break** action.

---

## Modal layout

```
┌──────────────────────────────────────────────┐
│ Schedule Break                           ✕   │
├──────────────────────────────────────────────┤
│                                              │
│ Current Focus                    18:20       │
│                                              │
│ Break at ⓘ                                  │
│      [-5]   [ 60 min ]   [+5]               │
│      Break in 41 min 40 sec                 │
│                                              │
│ Break length ⓘ                              │
│      [-5]   [ 10 min ]   [+5]               │
│                                              │
├──────────────────────────────────────────────┤
│             Cancel       Save Break          │
└──────────────────────────────────────────────┘
```

---

## Fields

### Current Focus

Read-only. Shows the current elapsed focus duration (e.g. `18:20`). Updates live every second while the modal is open and the timer runs.

Source: same elapsed focus seconds as the main timer (`quick.currentFocusSeconds` / orchestration focus bank).

### Break at

Represents the **total focus duration** when the reminder should appear — not wall-clock time.

Example: Current Focus `18:20`, Break at `60 min` → notify when total focus reaches **60 minutes** of accumulated focus time, not “in exactly 60 minutes from now.”

### Live remaining text

Directly below Break at:

```
Break in 41 min 40 sec
```

Updates live every second.

```
remaining = breakAtMinutes × 60 − currentFocusSeconds
```

When `remaining <= 0`:

```
Break ready
```

### Break length

How long the break should last (e.g. `10 min`). When the user clicks **Start Break**, a countdown runs. When the countdown reaches zero, show a second notification. Focus does **not** automatically resume.

---

## Increment buttons

Both **Break at** and **Break length** use:

```
[-5]   [value]   [+5]
```

Rules:

- Decrement / increment by 5 minutes.
- Smooth value animation on change.
- **Hold-to-repeat:** holding a button continuously changes the value.
- Minimum **Break at** = `currentFocusMinutes + 5` (floor at next valid 5-min step).
- Minimum **Break length** = 5 minutes.

---

## Defaults

### Break at

Default to the **next milestone** strictly after current focus (minutes):

| Current focus (min) | Default Break at |
|--------------------:|-----------------:|
| 0 | 25 |
| 18 | 25 |
| 29 | 45 |
| 46 | 60 |
| 73 | 90 |
| 101 | 120 |

**Implementation note:** encode as milestone array `[25, 45, 60, 90, 120, …]` — pick first milestone `> currentFocusMinutes`; if past last milestone, extend by +30 min steps.

### Break length

Default **10 minutes**, matching the standard pairing shown on the Focus page:

```
Next Break
60 min
10 min break
```

Future enhancement (optional): pair break length to break-at tier (e.g. longer focus blocks → longer breaks). V1: fixed 10 min default.

---

## Info tooltips

### Break at

```
You'll be reminded when your focus reaches this duration.
Focus won't stop automatically.
```

### Break length

```
How long your break lasts.
You'll be notified when it ends, but focus won't resume automatically.
```

Use existing shadcn `Tooltip` / `Popover` patterns; `ⓘ` trigger icon.

---

## Save

On **Save Break**, persist on the active focus session:

| Field | Type | Meaning |
|-------|------|---------|
| `breakAtMinutes` | number | Total focus duration threshold for reminder |
| `breakLengthMinutes` | number | Break countdown length when started |
| `scheduledAtFocusTime` | number | Focus seconds elapsed when user saved (audit / snooze baseline) |

Modal closes. The session now has **one** scheduled break (save replaces any prior schedule for that session).

Suggested storage: extend `StoredActiveFocusSession` in `focus-active-session.ts` + mirror in session persistence layer.

---

## Focus page — Next Break section

Show beside the main duration timer:

```
Next Break

60 min

10 min break
```

### Interaction

- Entire block (durations + labels) wrapped in an invisible hover card.
- On hover, reveal inline: **Edit** · **Cancel**
- Controls hidden when not hovered (minimal UI).

**Edit** → reopens Schedule Break modal with current values.  
**Cancel** → clears scheduled break for this session.

### Compact alternative state

When space is tight:

```
Next Break

Break in 41 min
```

Live countdown; full detail on hover or edit.

---

## Break notification (focus threshold reached)

When `currentFocusSeconds >= breakAtMinutes × 60`:

```
Time for a break

You've reached 60 minutes of focus.

[Start Break]   [Snooze 5 min]
```

- Do **not** auto-start the break.
- Do **not** pause focus automatically.
- **Snooze 5 min:** add 5 minutes to `breakAtMinutes` (or equivalent offset); dismiss notification until new threshold.

Use existing notification/toast infrastructure (`focus-utils` browser notification + in-app toast) where appropriate; respect Focus mode notification suppression rules from EXPERIMENT.md §3.8 except for break transitions.

---

## Break screen

When **Start Break** is clicked:

- Start break countdown (e.g. `10:00`).
- Standard break controls (pause break, end break early — match existing break UI in quick focus).
- Focus timer may continue accruing in background or pause focus segment — **match existing `quickStartBreak` semantics** unless explicitly changed in decision-log.

---

## Break finished

When break countdown reaches zero:

```
Break finished

Ready to focus again?

[Resume Focus]   [Snooze 5 min]
```

- Do **not** auto-resume focus.
- **Resume Focus** → user-initiated return to focus state (`quickResumeFocus` or equivalent).
- **Snooze 5 min** → restart break countdown at 5 minutes (user-initiated).

---

## Technical requirements

- React, TypeScript, Tailwind CSS, shadcn/ui
- Responsive layout
- Keyboard accessible (tab order, Enter on Save, Escape closes modal)
- Proper focus trapping in modal
- Smooth transitions on stepper values
- Live countdown updates every second (reuse focus session `tick`)
- Clean component structure — no duplicated duration math
- Reusable state in focus session context / `focus-active-session.ts`
- Dark mode via semantic tokens (`bg-card`, `text-foreground`, …)
- Match existing FlowOS design language (Fable focus hero, workplace focus card)

### Suggested component split

| Component | Responsibility |
|-----------|----------------|
| `schedule-break-modal.tsx` | Modal shell, steppers, save/cancel |
| `focus-next-break-strip.tsx` | Focus page “Next Break” hover block |
| `focus-break-notification.tsx` | Threshold + break-finished prompts |
| `lib/focus-scheduled-break.ts` | Milestone defaults, remaining math, snooze helpers |

---

## UX principles

- Keep the interface minimal — only two user decisions: **Break at** and **Break length**.
- Show live remaining time to eliminate mental math.
- Never interrupt automatically — every action is user-initiated.
- Scheduling a break should feel lightweight, not like configuring a Pomodoro timer.

---

## Out of scope (V1)

- Multiple stacked scheduled breaks per session
- Replacing or removing Pomodoro tab
- Auto-break / auto-resume settings
- Persisting schedule templates across sessions
- OS-level Do Not Disturb integration

---

## Verification checklist

1. Open focus session → **Schedule Break** → defaults match milestone table.
2. Adjust Break at with ±5 and hold-to-repeat; floor enforced at current + 5 min.
3. Live “Break in …” updates every second; shows “Break ready” at threshold.
4. Save → modal closes → Next Break strip visible with correct values.
5. Hover strip → Edit / Cancel work.
6. At threshold → notification; focus keeps running until user acts.
7. Start Break → countdown; at zero → break-finished notification; no auto-resume.
8. Snooze 5 min works on both notifications.
9. Escape closes modal; focus trap and keyboard Save work.
10. `npm run build && npm run lint` pass.

---

## Doc cross-links

- Product decision: [decision-log.md](../../execution/logs/decision-log.md) — 2026-07-07 Schedule Break
- Promotion: [inbox.md](../../execution/logs/inbox.md) — Promoted section
- Planned inventory row: [FEATURE_INVENTORY.md](../../foundation/FEATURE_INVENTORY.md) — Focus sub-features
