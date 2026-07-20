# FlowOS Today V3 — Greenfield Design: the Day Engine

**Date:** July 6, 2026  
**Status:** Design exercise / aspirational Day Engine — **deferred indefinitely** during implementation hold (2026-07-21). Not current work. See [m2-today-v3-day-engine.md](../../execution/runbooks/m2-today-v3-day-engine.md).  
**Source artifact:** `flowos-today-v3-greenfield-design.canvas.tsx`  
**Inputs treated as evidence, not truth:** ChatGPT.md, both mockups/screenshots, PRINCIPLES.md, FEATURE_INVENTORY.md, shipped code, and the prior executive review.

---

## The design in one paragraph

Today V3 is not a dashboard, a grid, or a planner. It is a **state machine for one day**, rendered as three temporal bands: **NOW** (one polymorphic slot that is always the single most important thing — a running focus session, the current scheduled block, one recommendation, or the close-day ritual), **NEXT** (a short ordered queue of 3–5 items with tasks and habits interleaved, capped by Miller's law), and **the rest** (collapsed: later, done, and a thin ambient time rail). Capture is a permanent one-line input with zero syntax. Focus is a page state, not a card. Reflection is the day's terminal state, not a module. The page morphs through the day — triage → execute → focus → recover → close — without the user ever choosing a view.

---

## 1. Design thesis

**What is Today for?** A person does exactly one thing at a time. The whole job of Today is to make "the one thing" unmistakable within one saccade, keep the next few things pre-attentively visible, and keep everything else silent until it becomes the one thing. Both existing designs fail this differently: the shipped grid gives five regions equal weight, so the eye arbitrates on every visit — a scan tax paid 10–20 times a day. The ChatGPT mockup adds a guidance banner but keeps the egalitarian grid under it, and spends its ambition on a command bar, which optimizes capture (seconds per day) instead of orientation and sequencing (the whole day).

**Why this wins at month six, not day one.** Grids demo well because they show everything; they age badly because showing everything forever means deciding nothing. A state machine ages well: the 500th open is faster than the 5th, because the user has stopped reading the page and started trusting the slot — the same reason Superhuman users stop seeing their inbox and start seeing one message. The failure mode of guidance systems is banner blindness, and the cure is built into the thesis: the NOW slot is silent when nothing matters, changes only when day-state changes, and is always dismissible — so when it does speak, it retains authority.

---

## 2. Explore before converging: three concepts

### A — The Spine (timeline-first)

- **Philosophy:** the day is time. One vertical timeline is the page; tasks, habits, and focus blocks live on it. Unscheduled work sits in a tray waiting to be placed.
- **Strengths:** matches the natural mental model of "a day"; superb temporal awareness; meetings and habits get equal citizenship; scheduling is direct manipulation.
- **Weaknesses:** punishes unscheduled work — the majority of real tasks. Forces a planning ceremony every morning (the Sunsama tax) and drifts toward calendar theater (the Motion trap). Empty hours read as guilt.
- **Ideal user:** calendar-dense managers. Not the FlowOS founder persona, whose day is mostly self-directed work.

### B — Now + Next (execution-first) ✓

- **Philosophy:** the day is a sequence, not a surface. Render the current state large, the next few items small, and everything else collapsed. The page morphs as the day advances.
- **Strengths:** 3-second orientation by construction; one obvious action always; absorbs focus mode and the close-day ritual as states instead of destinations; density scales with workload.
- **Weaknesses:** demands a trustworthy ordering engine and legible state transitions; power users must be given escape hatches to "see everything" or they revolt.
- **Ideal user:** a maker who opens the app 10–20×/day and wants it to answer, not ask.

### C — The Monolith (focus-first)

- **Philosophy:** the page is a timer and one task. Lists, timeline, and habits live in drawers summoned by keyboard. Deep work is the default, everything else is interruption.
- **Strengths:** ultimate calm; zero distraction during the product's highest-value state; beautiful.
- **Weaknesses:** terrible at triage mornings, meeting days, and admin afternoons — most hours of most days. Hides workload until it becomes an ambush. Drawer-diving reintroduces navigation, the exact cost FlowOS exists to remove.
- **Ideal user:** a writer with one project. Too narrow to be Today.

**Choice: Concept B.** It is the only concept that contains the other two: the Monolith is exactly Concept B's focus state, and the Spine survives as B's ambient time rail — always visible as context, expandable to a full planner on demand, never a mandatory ceremony. Hick's law argues for B (the visible choice set is 1 + ~4, not 22); Jakob's law is satisfied because "one big current thing + a short list" is the grammar of Things 3's Today, Superhuman's split, and every music player's now-playing — users already know how to read it.

---

## 3. Challenge every component

Every permanent region of the current shipped page and the ChatGPT mockup, interrogated for its right to permanent pixels.

| Component | Verdict | Reason |
|-----------|---------|--------|
| Date + day header | Keep | Orientation anchor; one line; costs nothing. Gains a day-state word (Morning · Deep work · Winding down) so the header tells you where you are in the day, not just which day. |
| KPI strip / status tiles | Merge | Five tiles restate what the queue already shows. Collapse to inline text chips in the header (7/9 · 2/3 · 1h40m). Clickable, not decorative. Tiles are dashboard theater. |
| Next-action recommendation | Keep — promote | Becomes the NOW slot, the page's primary region. It was the most important logic in the codebase rendered as the least visible pixel. |
| Tasks card (tabbed Queue/Missed/…) | Merge | Becomes the NEXT queue. Tabs become collapsed disclosure rows (Later · Missed · Done) below the queue — progressive disclosure instead of tab arbitration. |
| Habits card | Merge | A separate card implies habits are a different kind of work; the loop says they aren't. Due habits interleave into NEXT at their scheduled time with a HABIT glyph. The card disappears; the module remains for management. |
| Focus card | Contextual | A permanently idle timer is the single largest waste of hero pixels in both designs. Focus is a state: starting a session morphs the page. Idle, focus exists only as the F key and a button on every queue row. |
| Timeline column | Contextual | Full-width column demotes to a thin ambient rail (now-line, block silhouettes, next-event tick). One keypress (T) or click expands to the full drag-planner overlay. Time context is ambient; time management is on demand. |
| Daily note card | Contextual | A persistent half-empty textarea is guilt UI. Note becomes a slide-over on ⌘J / capture affordance; a one-line chip appears in the header only when today's note has content. |
| Quick-add row | Keep — promote | The best shipped component. Becomes the single permanent capture line above the queue, keyboard-summoned from anywhere. |
| Reflection sidebar | Contextual | Reflection is the day's terminal state, not a parallel surface. It appears as the NOW slot in the evening and after focus sessions. Sidebar access remains as an escape hatch. |
| Density picker (Full/Work/Focus) | Remove | Manual density is an admission the page doesn't know what matters. The state machine is density: focus state is 'Focus', a clear day is calm, a heavy day is dense. Kill the picker; keep a compact-mode preference. |
| Universal command bar (ChatGPT) | Remove | Recall-based syntax as the primary path violates recognition-over-recall. Capture line + keyboard verbs beat it for speed; a palette can arrive later (M4) as chrome, not identity. |
| Left module sidebar | Contextual | If the loop lives on one page, eight nav items are legacy. Collapse to icon rail; modules become depth (opened from chips/rows), not siblings competing with Today. |

---

## 4. Concept B — full specification

### Information hierarchy & reading order

Four levels, read strictly top-to-bottom, sized by decision value: (1) **Header** — where am I in the day (1 line, smallest); (2) **NOW slot** — what is the one thing (largest type on the page); (3) **Capture + NEXT queue** — what follows (body type, 3–5 rows); (4) **Collapsed strata** — Later · Missed · Done (single disclosure lines). The ambient time rail sits at the right edge outside the reading flow — peripheral vision territory, by design (Gestalt: proximity groups the bands; the rail's separation marks it as context, not content).

### Wireframes across the day

**Morning — triage state**

```
┌──────────────────────────────────────────────┬──┐
│ Mon 6 Jul · Morning   7 tasks · 3 habits ⌘J │▒▒│
├──────────────────────────────────────────────┤▒▒│
│ NOW                                          │  │
│ ▶ Finish product design review    9:00 · 90m │──│ ← now-line
│   [ Start focus ]                    skip ✕  │░░│
├──────────────────────────────────────────────┤░░│
│ + Capture…                              (N)  │  │
│ NEXT                                         │▒▒│
│ ○ HABIT Morning exercise        due now  ✓   │  │
│ ○ Write onboarding flow      Med · 11:30 F ✓ │  │
│ ○ Reply to customer emails    Low · 1:30 F ✓ │  │
│ ▸ Later today (4)   ▸ Missed (1)  ▸ Done (0) │  │
└──────────────────────────────────────────────┴──┘
```

**Midday — executing**

```
┌──────────────────────────────────────────────┬──┐
│ Mon 6 Jul · Midday  4/7 · 2/3 · 40m focus    │▒▒│
├──────────────────────────────────────────────┤  │
│ NOW                                          │──│
│ ● Standup in 12 min                    1:30  │▒▒│
│   [ Open agenda note ]               skip ✕  │  │
├──────────────────────────────────────────────┤░░│
│ + Capture…                              (N)  │  │
│ NEXT                                         │  │
│ ○ Reply to customer emails    Low · 1:30 F ✓ │  │
│ ○ HABIT Read book              8:15 pm   ✓   │  │
│ ▸ Later (2)  ▸ Done (4)                      │  │
└──────────────────────────────────────────────┴──┘
```

**Deep work — page state, not a card**

```
┌──────────────────────────────────────────────┬──┐
│                                              │  │
│         Finish product design review         │  │
│                                              │──│
│                   47:12                      │  │
│                                              │  │
│       [ Pause ]   [ Break ]   [ Stop ]       │  │
│                                              │  │
│  ↓ next · Write onboarding flow · 11:30      │  │
└──────────────────────────────────────────────┴──┘
Chrome dims; queue collapses to one 'on deck' line;
capture still answers N (thought → inbox, no exit).
```

**Evening — close-day state**

```
┌──────────────────────────────────────────────┬──┐
│ Mon 6 Jul · Winding down    7/9 · 3/3 · 2h10m│  │
├──────────────────────────────────────────────┤  │
│ CLOSE THE DAY                                │  │
│ Done today: 7 tasks · 3 habits · 2 sessions  │▒▒│
│ What went well?  ____________________________│▒▒│
│ What to change?  ____________________________│──│
│ [ Close day ]      carry 2 open → tomorrow ▸ │  │
├──────────────────────────────────────────────┤  │
│ ▸ Done (7)   ▸ Carried (2)                   │  │
└──────────────────────────────────────────────┴──┘
After close: calm end-state. "Day closed. See you
tomorrow." Nothing else renders. Silence is the reward.
```

**Everything done — silence**

```
┌──────────────────────────────────────────────┬──┐
│ Mon 6 Jul · Clear     9/9 · 3/3 · 2h10m      │  │
├──────────────────────────────────────────────┤  │
│                                              │──│
│        All clear. Nothing needs you.         │  │
│     [ Close the day ]   [ + add something ]  │  │
│                                              │  │
└──────────────────────────────────────────────┴──┘
No confetti, no ring, no stats card. Absence of
demands IS the success state.
```

**Half-screen (laptop split)**

```
┌────────────────────────────────┐
│ Mon 6 Jul · Midday   4/7 · 40m │  rail hidden
├────────────────────────────────┤  chips truncate
│ NOW ● Standup in 12m    [Open] │  NOW → one line
├────────────────────────────────┤
│ + Capture…                (N)  │
│ ○ Reply to emails     1:30 F ✓ │
│ ○ HABIT Read book    8:15p  ✓  │
│ ▸ Later (2) ▸ Done (4)         │
└────────────────────────────────┘
```

### Region inventory

| Region | Purpose | Interactions | Empty / error / loading |
|--------|---------|--------------|-------------------------|
| Header line | Temporal + workload orientation in one saccade | Chips click-scroll to their strata; day-state word is passive; ⌘J note chip | Never empty (date always exists) · errors never render here · loads instantly from cache, counts hydrate in |
| NOW slot | The one thing. Polymorphic: focus session > imminent schedule (≤15m) > recommendation > close-day > silence | One primary action (Enter) · skip/dismiss (✕ or Esc) · state-aware relabel | Empty = collapses to zero height (silence) · error = never blocks; falls back to queue · loading = reserves one line, no spinner |
| Capture line | Zero-friction, zero-syntax intake | N or plain typing focuses it from anywhere · Enter creates into Today · post-create chips (time, priority, group) for refinement · ⌘Enter opens full form | Never empty (it is the empty state) · failure = row stays inline with retry, input never blocks (optimistic queue) · no loading state |
| NEXT queue | The ordered short list: max 5 visible (Miller), tasks + due habits interleaved by engine (schedule → priority → age) | ✓ complete (C) · F focus · S schedule (opens rail) · Enter details slide-over · j/k move · hold-drag to pin order | Empty = 'All clear' state · error = per-row inline retry · loading = 3 skeleton rows |
| Collapsed strata (Later · Missed · Done) | Progressive disclosure of the rest of the day | Click/L,M,D expands inline; Missed shows amber count only when >0 — information scent without alarm | Zero-count rows do not render at all |
| Ambient time rail | Peripheral time awareness: now-line, block silhouettes, next-event tick | Hover/T expands to full planner overlay with drag-to-schedule; S on a row targets it | No events = bare now-line only · never errors visibly · rendered from local data, no load state |
| Close-day panel (evening NOW) | Reflection as terminal state, pre-filled with the day's actual data (P: 'close the loop with data') | Two prompts + custom entries · carry-forward review of open items · Close day commits | Skippable (Esc) — reappears once next morning as 'Yesterday unclosed?' then goes silent |

### The guidance layer — beating ChatGPT's notification

ChatGPT's notification is a banner *above* a grid that still shows everything — guidance as garnish. In V3 the recommendation **is the primary region**. Exactly one item, computed deterministically from state (never polled): active session → imminent schedule → engine's top pick → reflection window → silence. Dismiss (Esc) hides that specific recommendation until day-state changes — keyed by type + entity, so it never nags twice about the same thing. When nothing qualifies, the slot renders nothing: no placeholder, no "you're all caught up" card occupying pixels. Silence is a feature with a cost of zero and an authority payoff every time the slot does speak.

### Capture — faster than a command bar

The bar is permanent (recognition), reachable by a single letter (N) or by simply typing on an idle page (Fitts cost ≈ 0: the target is the whole page). No syntax required — plain text becomes a Today task in one Enter. Refinement is **post-hoc and optional**: after creation the row flashes with tappable chips (today · time · priority · group), so scheduling costs one more tap only when wanted. Light recognition of trailing time tokens ("email Sam 3pm") is offered as a *confirmable chip*, never auto-applied — forgiving beats clever. During focus, N captures to inbox without leaving the session. ⌘Enter opens the full form for the 5% case. This beats `/habit …` syntax on every axis: fewer keystrokes, zero recall, zero failure states, undoable.

### Focus — four states

| State | Page behavior |
|-------|---------------|
| Idle | No timer chrome exists. Focus is the F key on any row, the NOW slot's Start action, or drag row → rail block. The absence of an idle timer is a feature: hero pixels go to the current state, not a hypothetical one. |
| Running | Page morphs (300ms ease, chrome dims and recedes — motion explains the state change, Arc-style). Timer becomes the largest object. Pause/Break/Stop permanently visible (never hover). One 'on deck' line keeps the next item in peripheral vision. Attached task shows an in-place Done. |
| Break | Palette cools (existing tokens, reduced contrast), countdown replaces timer, one line: back at 3:45. Queue stays collapsed — a break is not triage time unless the user scrolls, which is allowed (adaptation never locks doors). |
| Ending → reflection transition | Stop slides a one-line inline prompt into the same space: 'What did this session produce?' + skip. One line, same surface, no modal (inline before modal). Feeds the evening close-day summary so reflection references real data. |

### Tasks, habits, timeline, reflection

- **Tasks:** a row is checkbox · title · time/duration chip · two visible quick actions (F, ✓) — details live one Enter away in a slide-over, not in the row (density without clutter). Full kanban/groups remain in the Tasks module as depth.
- **Habits:** due habits are queue rows with a HABIT glyph and streak count; completing one animates it into Done like any work. Habit management (schedules, streak history) stays in its module.
- **Timeline:** ambient rail always; full planner as overlay on T; drag from queue to rail schedules.
- **Reflection:** appears exactly three ways — after each focus session (one line), as the evening NOW slot (two prompts + data summary), and via escape hatch. Never a permanent panel.

### Motion, typography, density, responsive

- **Motion** exists only to explain state change: page-morphs 300ms; row completion 150ms slide-to-Done; NOW slot content cross-fades on state change so the user notices the recommendation changed. Nothing loops, nothing bounces; respects prefers-reduced-motion.
- **Typography** is a strict 4-step scale: NOW title (~20px semibold) > running timer (display, tabular) > queue rows (14px) > chrome (12px muted). The header date is deliberately small — orientation, not celebration.
- **Density** is automatic: it comes from workload and state, not a picker.
- **Responsive:** one column by construction — half-screen drops the rail and truncates chips; nothing reflows into a different grammar, so muscle memory survives every window size (the shipped 3-column grid cannot say this).
- **Accessibility:** zero hover-gated controls; NOW slot is a role=status live region; full j/k/Enter/C/F/S/N/T/Esc keyboard grammar; focus-visible rings on everything; timer readable at AA contrast.

---

## 5. Adaptive interface — states, not surprises

Adaptation obeys three laws so it never feels haunted: (1) only the NOW slot and ordering adapt — geography never changes; (2) every adaptation is explained by a visible day-state word in the header; (3) every adaptation is overridable and no door locks.

| Situation | What changes | What never changes |
|-----------|--------------|-------------------|
| Morning open | NOW = first scheduled block or top pick; Missed-from-yesterday appears once as a quiet amber disclosure; capture prominent for brain-dump | Queue geography, keyboard grammar |
| Heavy workload (20+ items) | Queue still shows 5 + '14 more' disclosure; NOW adds a one-line overload hint ('more than fits — 3 unscheduled have times today'); nothing auto-reschedules | The cap. Showing 22 rows is how tools become guilt engines |
| Deep work | Full page morph (see focus states); notifications suppressed; capture routes to inbox silently | N still works; Esc always returns |
| Meeting-dense day | Rail widens one step; NOW prefers imminent events with join/open actions; queue orders short tasks into gaps | Tasks never hidden — meetings are context, not the job |
| Low energy (2+ skips in an hour) | Engine offers the smallest queued item ('Two minutes: reply to Sam?') or a break — once, not repeatedly | No streak-guilt, no motivational copy, ever |
| Everything completed | Silence state: All clear + two quiet actions (close day / add). Chrome at minimum contrast | Capture remains one keypress away |
| Reflection pending (evening) | NOW becomes close-day panel pre-filled with real data; skippable; resurfaces once next morning then stays silent | Never a modal, never blocks capture or queue |

---

## 6. Cognitive load audit

| Region | Attention | Decisions | Read time | Frequency | Verdict |
|--------|-----------|-----------|-----------|-----------|---------|
| Header line | Low | 0 | ~1s | Every open | Pays rent: orientation at a glance |
| NOW slot | High (by design) | 1 (act or skip) | ~2s | Every open | The page's entire decision budget is spent here — correct |
| Capture line | Near zero until used | 0 | 0s | 5–15×/day | Permanent affordance, zero idle cost |
| NEXT queue (≤5) | Medium | 0 (pre-ordered) | ~3s | Most opens | Pre-ordering converts a choice into a read |
| Collapsed strata | Near zero | 0 | <1s | 1–3×/day | Information scent only (counts); content on demand |
| Ambient rail | Peripheral | 0 | 0s (pre-attentive) | Passive | Now-line position is absorbed, not read |
| Close-day panel | Medium, once | 2 prompts | ~60s | 1×/day | The one deliberate ritual; pre-filled data halves its cost |

Removed because cost exceeded value: idle timer (high pixels, zero decisions), KPI tiles (read time with no action), persistent note textarea (guilt without function), density picker (a meta-decision about decisions), permanent reflection panel (attention rent all day for a 60-second evening task).

---

## 7. Competitive benchmark

| Product | What they'd do | FlowOS position |
|---------|----------------|-----------------|
| Linear | One opinionated ordered list, keyboard verbs, no dashboard | Agree — the NEXT queue and j/k/C/F grammar are Linear's discipline applied to a personal day |
| Things 3 | Calm Today list, gorgeous restraint, no time model, no guidance | Half agree: adopt the calm and the anti-badge stance; disagree on passivity — Things never tells you what's next, FlowOS's entire thesis is that it should |
| TickTick | Ship every feature; tabs, matrices, widgets | Intentionally disagree — breadth is the anti-thesis; FlowOS wins by refusing |
| Motion | Auto-schedule everything into calendar slots by algorithm | Intentionally disagree — recommend, never rearrange. Motion users fight the robot; FlowOS's engine proposes in one slot and touches nothing |
| Sunsama | Mandatory daily planning + shutdown ritual | Adapt — steal the closing ritual (close-day state), reject the mandatory morning ceremony; triage is offered, never gated |
| Apple Reminders | Recognition-pure, zero learning curve, no opinion | Agree on zero-syntax capture; disagree on opinionlessness |
| Arc | Chrome recedes, interface morphs by mode, motion explains state | Agree — the focus page-morph and auto-density are Arc's philosophy applied to a workday |
| Raycast | Everything behind one keystroke, capture in <2s | Adopt the latency budget for capture; reject launcher-as-home — a launcher is for a thousand rare actions, Today is for five constant ones |
| Superhuman | One item at a time, keyboard-only, speed as brand | Agree — the NOW slot is 'inbox zero' logic applied to a day; but FlowOS keeps the queue visible because a day, unlike an inbox, benefits from a visible horizon |
| Notion | Infinitely configurable blocks; user builds their own Today | Intentionally disagree — configurability outsources design to the user and bills them daily. FlowOS is opinionated or it is nothing |

---

## 8. Failure analysis

| Horizon | Predicted feedback | Design response |
|---------|-------------------|-----------------|
| Day 1 | "Where did my grid go? Where's the timer?" | Migration matters more than the design: first-run overlay maps old regions to new keys (T = your timeline, F = your timer); rail and disclosures make everything findable in one gesture. Nothing was deleted, it was re-staged. |
| Week 1 | "The NOW slot keeps suggesting the wrong thing." | Skip is one key and teaches the engine (skipped types sink for the rest of the day); pinning a queue row overrides the engine visibly. Trust is built by being correctable, not by being right. |
| Month 1 | "I've stopped seeing the NOW slot." (banner blindness) | The slot only changes on state change, is silent when empty, and cross-fades on content change — three habituation breakers. Dismiss-rate is the tracked health metric; if >40% of recommendations are dismissed unread, the engine is wrong, not the user. |
| Month 6 | "My Later pile is a graveyard; mornings feel like debt." | Close-day carry-forward forces a daily decision on open items (carry / tomorrow / drop) so piles can't silently accrete; Missed strata shows a count, not a wall of red. |
| Year 1 | "I'm a power user now — I want more views, saved filters, widgets." | Depth lives in modules (kanban, analytics, planner overlay), reachable in one keystroke — growth goes down into depth, not sideways into Today. Today's grammar stays frozen; that stability is the product's compounding asset. |

---

## 9. Success metrics

| Metric | Target | What it validates |
|--------|--------|-------------------|
| Time to first meaningful action after open | < 3s median | The thesis itself — orientation is pre-computed |
| Capture latency (intent → task persisted) | < 2s | Capture beats a command bar in practice, not rhetoric |
| NOW-slot acceptance rate (acted / shown) | > 50% | Guidance has authority; < 40% dismiss-unread = engine failure alarm |
| Focus sessions started from NOW or F key | > 60% of sessions | Focus-as-state works; timer page is dead weight |
| Days closed with reflection | > 50% of active days | The loop actually closes (P#16); the single strongest retention predictor to watch |
| Navigation events away from Today per day | Falling trend | One-screen thesis: depth on demand, not by default |
| Scroll distance on Today | ~0 at ≤15 items | The cap + disclosures hold; scrolling is a design failure here |
| Same-day return opens | 10–20/day sustained | The page is the OS, not a morning report |
| WAD / D7 (per GATES.md) | Up vs current baseline | The governance-level outcome all of the above serve |

---

## 10. Comparison: Current vs ChatGPT vs Concept B

| Dimension | Current | ChatGPT | Concept B | Winner — why |
|-----------|---------|---------|-----------|--------------|
| Orientation speed | Scan 5 equal regions | Banner + scan grid | One slot, pre-computed | B — decision made before the page is read |
| First action | Good (inline capture) | Unknown (unbuilt bar) | One keypress from anywhere | B — inherits current's best part, removes reach |
| Guidance | Built but hidden | Visible banner over grid | Guidance IS the page | B — promotion, not decoration |
| Focus | Card, hover controls | Permanent hero timer | Page state; idle = invisible | B — hero pixels only when the state is real |
| Habits | Separate card | Separate, demoted card | Interleaved into the day | B — 'one continuous day' taken literally |
| Time awareness | Full third column | Full third column | Ambient rail + overlay | B — context at peripheral cost, planning on demand |
| Reflection | Sidebar + modal | A status chip | Terminal state w/ real data | B — the loop closes by architecture |
| Cognitive load | Medium-high, constant | Medium + recall syntax | Low idle, spent on one decision | B — Hick's law enforced structurally |
| Long-term trust | Density picker fatigue | Banner blindness risk | Silence + dismiss + correctable engine | B — habituation countermeasures designed in |
| Eng. reality | Shipped | Weeks (parser, engine) | Months for full vision; staged path exists (§13) | Current today; B on any horizon past a sprint |

---

## 11. Anti-patterns deliberately rejected

1. **NLP command bar as primary workflow** — recall tax daily, parser failure tail; capture line beats it on keystrokes.
2. **KPI tiles / completion rings** — reading without acting; the ring restates the fraction beside it.
3. **Polling "AI engine"** — state is event-driven; polling is cost plus mysticism with identical output.
4. **Auto-rescheduling (Motion-style)** — software that moves your things while you sleep loses custody of trust.
5. **Hover-gated critical controls** — fails keyboard, touch, and glance; visible-before-hover is absolute.
6. **Permanent idle timer** — the largest object on both prior designs encodes a state that isn't happening.
7. **Unbounded task lists** — 22 visible rows is guilt UI; cap + disclosure or the page becomes a debt ledger.
8. **Modal-first capture** — a dialog between thought and text loses the thought.
9. **Streak-guilt gamification** — fire icons that shame create avoidance, not habits; streaks inform, never scold.
10. **User-configurable layout** — outsources design to the user and bills them a meta-decision daily.
11. **Motivational copy / celebration states** — "You're crushing it!" is noise on visit 4,000; calm is the brand.
12. **Badges and unread counts** — manufactured urgency teaches users to fear the app they live in.

---

## 12. Executive decision log

| Decision | Status | Reasoning · trade-offs · complexity · reconsider when |
|----------|--------|--------------------------------------------------------|
| NOW slot as primary region | Accepted | Direct implementation of P#2. Trade-off: engine must earn trust (skip/pin mitigations). Complexity: low — cascade exists; this is promotion + polymorphic rendering. Reconsider: never; only recalibrate the engine. |
| Habits interleaved into queue | Accepted | One continuous day, literally. Trade-off: habit-block visibility lost (glyph + streak compensate). Complexity: medium — unified ordering over two entities. Reconsider if habit completion drops >20% post-launch. |
| Focus as page state, no idle card | Accepted | Hero pixels for real states only. Trade-off: day-one discoverability (F affordance on rows + NOW action mitigate). Complexity: medium — layout state machine. Reconsider if session starts/day fall below current baseline. |
| Timeline → ambient rail + overlay | Modified | From ChatGPT's 'timeline supports, never competes' — taken further than either design dared. Trade-off: at-a-glance detail lost (rail widens on meeting-dense days). Complexity: medium-high — the planner exists; the rail is new. Reconsider for calendar-heavy users at alpha. |
| Kill density picker | Modified | Replaced by state-driven density + one compact preference. Trade-off: removes explicit control some users like. Complexity: trivial (deletion). Reconsider if alpha users ask for manual override >2× — then it returns as a keyboard-only toggle. |
| Command palette | Deferred | M4 per PRINCIPLES defer queue. As chrome for rare actions it's fine; as identity it's rejected. Reconsider at M4 with navigation-frequency data. |
| Energy/low-mode detection | Deferred | Highest surprise risk of any adaptive behavior; needs behavioral data to avoid patronizing misfires. Ship the static states first. Reconsider after 3 months of skip-pattern telemetry. |
| NLP parsing as capture default | Rejected | Recognition over recall; failure tail; the confirmable time-chip gives 80% of the value at 5% of the risk. Reconsider only if capture latency data shows the chip flow failing its 2s budget. |
| Auto-scheduling engine | Rejected | Category error for a trust-first product (see Motion). The engine recommends in one slot and never mutates user data. Reconsider: not on any current horizon. |

---

## 13. Implementation reality

The vision is a destination; the codebase is closer to it than the greenfield framing implies. The staged path below reuses the shipped cascade, quick-add queue, planner, and reflection surfaces. Every stage is independently shippable and independently reversible.

### Ship this week

**UX ★★★★ · effort XS–S · risk low · confidence high · fully reversible**

Next-action visible in default density as a one-line strip with dismiss — the NOW slot's embryo (rule change in workplace-density.ts + compact row). Un-gate focus controls (Phase 3.3). Widen the cascade allowlist. These are the same P0s as the prior review; V3 makes them the foundation, not the finish.

### Ship this month

**UX ★★★★ · effort M · risk low-med · confidence high · reversible**

NOW slot v1: promote the strip to the primary region with polymorphic content (focus / imminent event / recommendation / reflection) and dismiss-until-state-change. Queue cap at 5 with Later/Missed/Done disclosures. Inline one-line session-end reflection. Keyboard grammar v1 (N, F, C, Enter, Esc).

### Ship this quarter

**UX ★★★★★ · effort L · risk medium · confidence medium · reversible w/ flag**

Focus page-morph (retire the idle card). Habits interleaved into the queue. Timeline → ambient rail with T-overlay planner (reuses shipped planner wholesale). Close-day state with data pre-fill and carry-forward. Retire the density picker once state-density proves itself behind a flag.

### Future vision

**UX ★★★ · effort L–XL · risk high · confidence low-med · needs telemetry**

Full day-state engine (meeting-dense, low-energy, overload adaptations). Engine learning from skip/pin patterns. Command palette as chrome (M4). Sidebar collapse to icon rail. Each gated on the metrics in §9 — especially NOW-slot acceptance rate and reflection completion.

---

## ✦ Final question — the review panel

### What they'd criticize

- **Apple:** the queue rows still carry two visible quick-actions and chips — they'd want one, and softer state transitions. Fair; worth a polish pass post-validation.
- **Linear:** any interaction that requires the mouse (rail drag-scheduling) — they'd demand S-key scheduling parity, and they'd be right; it's in the spec.
- **Things 3:** the engine's opinionation — "software shouldn't tell people what to do." This is the one criticism to accept and ignore: it is the thesis.
- **Superhuman:** the visible queue dilutes one-thing purity. Intentional: a day benefits from a horizon; an inbox doesn't.
- **Arc:** the adaptations are conservative — they'd push further, faster. Deliberately resisted until telemetry earns it.

### What they'd admire — and the ship decision

The silence states (Things-grade restraint), the keyboard grammar and latency budgets (Linear/Superhuman-grade), focus-as-morph (Arc-grade), and reflection as architecture rather than appendix — which none of the five has attempted. **Would I ship it? Yes** — as staged in §13, not as a big bang: the week-1 diff is provably safe, each subsequent stage is reversible, and the two metrics that would force a halt (NOW-slot dismiss rate, habit completion) are named in advance. Confidence comes not from the mockup but from the fact that the riskiest ideas are gated on data and the safest ideas are live within days.

---

*Greenfield exercise · governance note: everything in "ship this week/month" fits M2 scope on existing components; quarter+ items require a masterplan/decision-log entry per PRINCIPLES workflow before build. Authority order respected: PRINCIPLES > FEATURE_INVENTORY > shipped UI > ChatGPT.md.*
