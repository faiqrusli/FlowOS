# M2 — Today Hierarchy & Execution Flow Refinement

**Scope:** M2 addendum — visual hierarchy and execution-flow refinement of the existing Today / Focus workspace. Preserves current functional architecture; does not rebuild Today as the Day Engine.  
**Authority:** Spec [today-page-hierarchy-refinement-spec.md](../../review/design/today-page-hierarchy-refinement-spec.md). Does not add, remove, defer, or weaken any M2 exit criterion from [execution-masterplan.md](../../strategy/execution-masterplan.md).  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.  
**Implementation branch:** `tweak/today-focus-queue-layout` — all Sessions 1–9 commit here. Do **not** create per-session branches.

**Product hierarchy (frozen for this runbook):**

```
NOW → NEXT → PLANNED
Focus → Queue → Timeline
```

**Not this runbook:** [m2-today-v3-day-engine.md](./m2-today-v3-day-engine.md) (Day Engine rebuild). Do not resume V3 Phase C under this branch naming. Historical queue plan: [m2-next-up-queue.md](./m2-next-up-queue.md) (superseded).

---

## Acceptance test

When Sessions 1–9 are complete on `tweak/today-focus-queue-layout` and merged to `main`, a founder opening `/` sees: timer dominant on the page background (no timer card chrome); compact Current Focus with fixed header + scrollable body; narrower Timeline; Next Up preview showing the first queued item; Queue closed by default behind a quiet rail; Queue opening between Workspace and Timeline (or as drawer on small screens); Task/Habit overlays anchored above their launchers with two-pane browse/inspect; drag from Task, Habit, and Timeline into Queue with auto-reveal; Queue reorder; Focus-complete → Start Next promoting the head of Queue. All existing capabilities (daily summary, Quick Capture, Schedule Break, Pomodoro tab, reflection) remain. `npm run build` and `npm run lint` pass.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on `tweak/today-focus-queue-layout` (`WIP: Session N blocked — {reason}`) or `git stash`. Do **not** merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table below. |
| 6 | **Parallel exception:** none — sessions are serial commits on this branch; do not open parallel branches for Sessions 1–9. |

---

## Session dependency table

| Session | Depends on (complete on this branch) | Blocks |
|---------|--------------------------------------|--------|
| 1 — Visual foundation | Branch checked out from current Today baseline | 2, 3, 4 |
| 2 — Focus hierarchy | 1 committed | 3 |
| 3 — Current Focus card | 1, 2 committed | 8 |
| 4 — Timeline width | 1 committed | 5, 6 |
| 5 — Queue foundation | 1, 4 committed + **decision-log: multi-source Queue** | 6, 8 |
| 6 — Queue interactions | 5 committed | 7, 8 |
| 7 — Task / Habit overlays | 5 committed | 6 (DnD from overlays), 9 |
| 8 — Execution flow | 3, 5, 6 committed | 9 |
| 9 — Polish | 6, 7, 8 committed | — |

Sessions 2 and 4 may run in either order after Session 1 if they do not touch the same files; prefer serial commits on this branch. Session 7 may start after Session 5 (overlay chrome) but DnD into Queue (Session 6) must land before claiming overlay→Queue complete.

---

## Founder gate (before Session 5)

Append to [decision-log.md](../logs/decision-log.md) before starting Session 5 work:

```
### YYYY-MM-DD — Next Up Queue: multi-source references

**Context:** Hierarchy refinement spec requires Queue items as references to task | habit | schedule (not duplicated objects). Prior Next Up V2 used task-only `tasks.queue_order`.
**Decision:** Adopt QueueItem { id, sourceType, sourceId, position, addedAt } with UI resolving display from source. Persistence approach: (A) localStorage session-scoped / (B) Supabase user-scoped table / (C) extend tasks.queue_order + parallel stores for habit/schedule — founder picks one.
**Alternatives rejected:** Duplicating full task/habit/schedule payloads in queue storage; replacing Timeline events when queued.
**Related:** today-page-hierarchy-refinement-spec.md §12 · m2-today-hierarchy-refinement.md Session 5
```

**Do not start Session 5 until this entry exists or founder explicitly waives in chat.**

---

## Session plan

**Budget:** 9 sessions × 2–4 hours each.  
**Engineering sessions:** 1–9 (Agent-executable).  
**Founder-only:** Production visual sign-off after Bundle B4 (manual — no separate session number).

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).  
**Exception for this runbook:** one shared branch for all sessions (not `m2/session-N-…` per session).

| Step | Rule |
|------|------|
| **Branch** | Stay on `tweak/today-focus-queue-layout` for Sessions 1–9 |
| **Start session** | Confirm `git branch --show-current` is `tweak/today-focus-queue-layout` — do **not** checkout `main` or create a new branch |
| **During session** | Commit on this branch (`feat:` / `fix:` / `WIP:` as needed); `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → commit → push this branch → report which session/bundle completed. **Do not** ask to merge to `main` after every session |
| **Merge ask** | After Bundle B4 (Session 9) — or earlier if founder requests a partial merge — agent **asks founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles** (progress markers on this branch; merge ask at B4 unless founder asks sooner):

| Bundle | Sessions | Remind when |
|--------|----------|-------------|
| B1 — Visual + Focus chrome | 1, 2, 3 | Session 3 verified — timer + Current Focus look right |
| B2 — Timeline + Queue shell | 4, 5 | Session 5 verified — rail + panel + preview wired (no DnD yet OK) |
| B3 — Interactions + overlays | 6, 7 | Both done — drag + two-pane launchers |
| B4 — Execution + polish | 8, 9 | Session 9 done — **ask merge to `main`** |

Follow-ups after this branch merges: `tweak/…` from `main` — same approval rule.

---

## Session 1 — Visual foundation

**Type:** `engineering`  
**Goal:** Apply gradual surface elevation on Today: reduce Current Focus / panel contrast, standardize borders and text hierarchy, remove unnecessary surface nesting. Adapt spec §4 tokens to existing v3 tokens — do not fork a parallel palette.  
**Time:** 2–3 hours  
**Prerequisites:** On `tweak/today-focus-queue-layout`.  
**Maps to:** Spec Phase 1  
**Merge bundle:** B1

### Current code reality

| Area | File / route | Behavior today |
|------|--------------|----------------|
| Today page | `src/app/(main)/page.tsx` → today/workplace content | Execution surface at `/` |
| Focus card | `src/components/workplace/workplace-focus-card.tsx` | Timer + Current Focus + Next Up chrome |
| Surfaces | `src/app/globals.css` + [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) | Canonical tokens — map spec levels to these |

### Numbered steps

| # | Step |
|---|------|
| 1 | Map spec levels 0–3 / hover to existing `--background`, `--surface`, `--card`, `--surface-hover` (or v3 equivalents). Document mapping in a short comment or decision-log note if values differ. |
| 2 | On Today workspace only: reduce nested card backgrounds around Focus timer area; keep content cards on Level 2. |
| 3 | Standardize borders to subtle/default; quiet supporting statistics vs primary text. |
| 4 | Smoke: daily summary, capture, focus controls still visible without hover (PRINCIPLES #10). |
| 5 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

```powershell
npm run build
npm run lint
git status -sb
```

| Check | Expected |
|-------|----------|
| `/` Focus area | Timer region not inside a heavy bordered card |
| Current Focus / Timeline | Clear but softer elevation vs page base |
| Controls | Schedule Break, Pause/Break/Stop visible without hover |

**Stop/fail if:** Global theme tokens broken outside Today; new hardcoded hex outside token mapping; build/lint fail.

**Rollback:** revert the session commit(s) on `tweak/today-focus-queue-layout` — never force-push `main`.

---

## Session 2 — Focus hierarchy

**Type:** `engineering`  
**Goal:** Timer is the visual center; remove Session N from primary timer area; change `FOCUSING` → `IN FOCUS`; refine metadata and Next Break strip (compact 36–44px, secondary to timer).  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 committed on this branch.  
**Maps to:** Spec Phase 2 + §5–6  
**Merge bundle:** B1

### Numbered steps

| # | Step |
|---|------|
| 1 | Remove session count from primary timer stack (keep in history/reflection if already present). |
| 2 | Relabel focusing state to **IN FOCUS**. |
| 3 | Apply timer sizing: `clamp(64px, 5vw, 88px)`, weight 600, tracking `-0.03em` (or closest existing type token). |
| 4 | Quiet focus/break elapsed metadata under timer; primary blue only for active focus accent. |
| 5 | Restyle Next Break / Schedule Break strip: low-contrast surface, subtle border, compact height; preserve Schedule Break behaviour (no logic rewrite). |
| 6 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Active quick focus | Large timer + IN FOCUS; no Session N above timer |
| Schedule Break | Still openable; scheduled strip secondary to timer |
| Pomodoro tab | Untouched or only shared chrome — no regression |

**Stop/fail if:** Schedule Break logic regresses; Pomodoro auto-transitions changed; timer becomes card-wrapped again.

---

## Session 3 — Current Focus card

**Type:** `engineering`  
**Goal:** Compact Current Focus: `clamp(220px, 28vh, 320px)`, fixed header/metadata, scrollable description/body only.  
**Time:** 2–3 hours  
**Prerequisites:** Sessions 1–2 committed on this branch.  
**Maps to:** Spec Phase 3 + §7  
**Merge bundle:** B1

### Numbered steps

| # | Step |
|---|------|
| 1 | Restructure Current Focus into fixed header (title, project chip, actions, metadata) + scrollable body. |
| 2 | Apply recommended height clamp; verify short and long descriptions. |
| 3 | Improve metadata hierarchy: Focused / Goal / In Focus quieter than title. |
| 4 | Ensure overflow does not push timer or Next Up off-screen on common laptop heights. |
| 5 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Long description | Body scrolls; header stays fixed |
| Short task | Card does not leave large empty chrome |
| Timer | Still above Current Focus, still dominant |

**Stop/fail if:** Current Focus loses edit/complete/actions; reflection entry broken.

---

## Session 4 — Timeline width

**Type:** `engineering`  
**Goal:** Narrow Timeline default to ~300–360px; improve event density; prepare for Queue column beside it.  
**Time:** 2–3 hours  
**Prerequisites:** Session 1 committed on this branch.  
**Maps to:** Spec Phase 4 + §13  
**Merge bundle:** B2

### Numbered steps

| # | Step |
|---|------|
| 1 | Set Timeline preferred width `clamp(300px, …, 360px)` (or layout grid min/max). |
| 2 | Tighten event row density without removing drag/create behaviours. |
| 3 | Confirm workspace flexes when Timeline is at minimum; no horizontal page scroll on large desktop. |
| 4 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Large desktop | More horizontal room for Focus column |
| Timeline events | Still readable and draggable |

**Stop/fail if:** Timeline planner loses create/edit/drag; schedule data regresses.

---

## Session 5 — Queue foundation

**Type:** `engineering`  
**Goal:** Queue data model (references only), collapsed rail (36–44px), open/close panel between Workspace and Timeline, wire Next Up preview to open Queue. Closed by default.  
**Time:** 3–4 hours  
**Prerequisites:** Sessions 1, 4 committed on this branch + **founder decision-log gate** above.  
**Maps to:** Spec Phase 5 + §§8–12  
**Merge bundle:** B2

### Numbered steps

| # | Step |
|---|------|
| 1 | Implement `QueueItem` types + storage per decision-log persistence choice. Resolve titles/durations from source entities at render time. |
| 2 | Add Queue rail between workspace and Timeline (icon + count); quiet until hover/focus. |
| 3 | Implement full Queue panel (`width: clamp(300px, 22vw, 360px)`): header copy, list shell, empty drop zone UI (non-functional OK until Session 6), footer (count, ~minutes, Clear All stub or wired). |
| 4 | Open/close: rail toggle, Escape, Next Up header / count / “N more” / chevron. Manual open stays open. |
| 5 | Next Up preview shows **first item only** + overflow affordance; does not duplicate full list in workspace. |
| 6 | Prune queue entries when source deleted/completed (basic sync). |
| 7 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Fresh load | Queue closed; rail visible |
| Click Next Up | Panel opens between workspace and Timeline |
| Escape / rail | Closes when manually open |
| Preview | One row + “N more” when queue length > 1 |

**Stop/fail if:** Queue permanently steals width when closed; duplicates full source objects in storage; removes Timeline events when “queued.”

---

## Session 6 — Queue interactions

**Type:** `engineering`  
**Goal:** Reorder with insertion line; drag Task / Habit / Timeline → Queue; auto-open on drag; auto-close 600–900ms only if auto-opened; compact drag preview.  
**Time:** 3–4 hours  
**Prerequisites:** Session 5 committed on this branch. Session 7 overlays optional for overlay sources — if overlays not ready, accept drag from existing task/habit lists + Timeline.  
**Maps to:** Spec Phase 6 + §§17–18  
**Merge bundle:** B3

### Numbered steps

| # | Step |
|---|------|
| 1 | Vertical reorder with clear insertion indicator; persist positions. |
| 2 | Drop target states: default “Drop here” / active “RELEASE TO ADD · Position N” (primary blue only when active). |
| 3 | Enable drag from Task list/overlay, Habit list/overlay, Timeline → append or insert; duplicate `sourceType+sourceId` → no-op. |
| 4 | On drag start of eligible item: open Queue if closed; mark `openedByDrag`. After successful drop, if `openedByDrag` and not manually pinned open, close after 600–900ms. |
| 5 | Compact drag preview (title + duration); reduce source opacity while dragging. |
| 6 | Timeline → Queue: **reference only** — event stays on Timeline. |
| 7 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Drag task into Queue | Item appears; Queue may auto-close if auto-opened |
| Drag timeline event | Event still on Timeline + in Queue |
| Reorder | Positions update; refresh preserves order |
| Manual open + drag | Queue stays open after drop |

**Stop/fail if:** Drop deletes or moves schedule rows; drag breaks Focus timer; duplicates stack.

---

## Session 7 — Task and Habit overlays

**Type:** `engineering`  
**Goal:** Larger Task and Habit overlays anchored above launcher buttons; two-pane list + detail; enough space to browse and inspect without leaving Today.  
**Time:** 3–4 hours  
**Prerequisites:** Session 5 committed on this branch (Queue exists for later DnD). Prefer Session 6 already committed so overlay rows are draggable into Queue.  
**Maps to:** Spec Phase 7 + §§14–16  
**Merge bundle:** B3

### Numbered steps

| # | Step |
|---|------|
| 1 | Treat bottom Task / Habit / Music as persistent launcher dock (layout only if already present). |
| 2 | Task overlay: `min(760px, available)`, `clamp(380px, 52vh, 520px)`, opens above Task button; two columns — list (search/filters/rows) + selected detail + View Task. |
| 3 | Habit overlay: same spatial model; list + streak/status/goal/history detail. |
| 4 | Ensure rows are draggable into Queue when Session 6 is present. |
| 5 | Close on Escape / outside click; focus management reasonable (no trap that blocks Focus controls permanently). |
| 6 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| Click Task | Large panel above button, not tiny popover |
| Select row | Detail pane updates without navigation away |
| Click Habit | Equivalent overlay |

**Stop/fail if:** Overlay covers timer with no dismiss path; Music launcher regresses; full-page navigation forced for basic inspect.

---

## Session 8 — Execution flow

**Type:** `engineering`  
**Goal:** Focus-complete card offers Start Next / Choose Another; Start Next promotes queue head to Current Focus and removes it; handle orphaned/completed sources; persist Queue per decision-log.  
**Time:** 3–4 hours  
**Prerequisites:** Sessions 3, 5, 6 committed on this branch.  
**Maps to:** Spec Phase 8 + §19  
**Merge bundle:** B4

### Numbered steps

| # | Step |
|---|------|
| 1 | On focus session end (existing completion/reflection path): show Next Up head when queue non-empty with **Start Next** and **Choose Another**. |
| 2 | Start Next: set Current Focus from head → remove from Queue → renumber → start focus via existing start behaviour. |
| 3 | Choose Another: dismiss promotion UI; leave Queue intact; user picks via preview/Queue/overlays. |
| 4 | Harden prune: completed/deleted/missing schedule sources removed from Queue on sync. |
| 5 | Confirm persistence matches Session 5 decision across refresh. |
| 6 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch. |

### Verification

| Check | Expected |
|-------|----------|
| End focus with queue | Card shows next item + Start Next |
| Start Next | New focus target = former #1; queue shifts |
| Empty queue | No Start Next; existing end flow only |

**Stop/fail if:** Auto-starts next without user click; clears Timeline; breaks reflection save.

---

## Session 9 — Polish

**Type:** `engineering`  
**Goal:** Responsive behaviour (§20), motion, hover/focus rings, keyboard (Escape, rail), empty/loading/error states, a11y pass on Queue and overlays.  
**Time:** 2–3 hours  
**Prerequisites:** Sessions 6–8 committed on this branch.  
**Maps to:** Spec Phase 9 + §§20–21  
**Merge bundle:** B4

### Numbered steps

| # | Step |
|---|------|
| 1 | Large: Workspace \| Queue \| Timeline. Medium: shrink workspace + Timeline min. Small: Queue as overlay drawer (Focus > Queue > Timeline). |
| 2 | Quiet motion for open/close Queue and overlay; no decorative blue flood. |
| 3 | Keyboard: Escape closes Queue/overlays; rail focusable; reorder keyboard alternative if DnD-only (min: move up/down buttons or documented follow-up). |
| 4 | Empty states for Queue and overlays; loading/error for source fetch failures. |
| 5 | Full acceptance criteria checklist in spec §23 — mark in july-log after merge. |
| 6 | `npm run build && npm run lint` → commit on `tweak/today-focus-queue-layout` → push branch → **ask founder to approve merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Narrow viewport | Queue drawer does not crush Focus |
| Escape | Closes Queue / overlays |
| Spec §23 | All criteria pass on production after merge |

**Stop/fail if:** Unusable layout below ~1100px width; focus trap dead-ends; build/lint fail.

---

## Manual test matrix

Run on **production** after Bundle B4 (Session 9). Gate: all applicable rows PASS.

| # | Scenario | Action | Expected | Pass |
|---|----------|--------|----------|------|
| 1 | Idle Today | Open `/` | Timer chrome calm; Queue closed; Timeline ~320–360 | ☐ |
| 2 | Start quick focus | Start focus | Large timer, IN FOCUS, no Session N | ☐ |
| 3 | Schedule Break | Schedule + wait strip | Compact secondary strip; timer still dominant | ☐ |
| 4 | Current Focus long body | Open long description | Header fixed; body scrolls | ☐ |
| 5 | Next Up preview | Queue ≥2 items | First only + N more | ☐ |
| 6 | Open Queue | Click preview / rail | Panel between workspace and Timeline | ☐ |
| 7 | Escape | Press Escape | Queue closes | ☐ |
| 8 | Drag task → Queue | Drag from Task overlay/list | Auto-open; item added; Timeline unchanged | ☐ |
| 9 | Drag habit → Queue | Drag habit | Same | ☐ |
| 10 | Drag timeline → Queue | Drag event | Event remains on Timeline + queued | ☐ |
| 11 | Reorder | Drag queue rows | Order persists after refresh | ☐ |
| 12 | Auto-close | Drag while Queue was closed | Closes ~600–900ms after drop | ☐ |
| 13 | Manual stay open | Open rail then drag | Stays open after drop | ☐ |
| 14 | Task overlay | Click Task | Large two-pane above button | ☐ |
| 15 | Habit overlay | Click Habit | Large two-pane above button | ☐ |
| 16 | Start Next | End focus with queue | Promotes head; queue shifts | ☐ |
| 17 | Small width | Resize narrow | Queue drawer; Focus usable | ☐ |

---

## Decision points

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | Queue persistence | (A) localStorage (B) Supabase table (C) hybrid with `queue_order` | **Founder gate before Session 5** — no code default |
| 2 | Queue while Pomodoro tab | (A) hide Queue (B) show read-only | **(A)** — Next Up / Queue is quick-focus execution layer |
| 3 | Keyboard reorder in Session 9 | (A) ship move up/down (B) defer | **(A)** if DnD-only fails a11y smoke; else document defer in decision-log |

---

## Out of scope

- Today V3 Day Engine (NOW slot morph, ambient rail, close-day, density retirement) — separate runbook
- Command palette, new modules, dnd-kit migration for unrelated surfaces
- Redesigning Pomodoro phase machine
- Replacing Schedule Break with Pomodoro-style auto transitions
- Global design-system token rewrite outside Today mapping (use v3 migration runbook if needed)
- New strategy docs except inbox, friction-log, decision-log, july-log, this runbook, the linked spec

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| 1. Scope creep into Day Engine | Rebuild instead of refine | Closed scope; stop/fail if Session morphs whole page |
| 2. Persistence conflict with `queue_order` | Data loss / dual queues | Founder gate Session 5; one storage path |
| 3. Timeline drop = move | Schedule deleted | Explicit reference-only tests in Session 6 |
| 4. Layout thrash (3 columns) | Unusable medium screens | Session 9 drawer rule; Focus > Queue > Timeline |
| 5. Overlay vs Focus controls | Can't pause/stop | Escape + click-outside; do not trap forever |

---

## Code baseline / operational gotchas

1. Primary Focus UI is `workplace-focus-card.tsx` on `/` via today/workplace page content — not a separate greenfield hero.
2. Schedule Break lives in quick-focus session envelope — visual-only changes in Sessions 1–2; do not touch auto-transition Pomodoro paths.
3. “NEXT queue” on Today's Tasks (schedule-derived, cap 5) is **not** Next Up Queue — do not merge the two concepts.
4. Prefer existing DnD patterns in workplace/timeline; do not introduce a second DnD library unless already present.
5. Adapt surface tokens to [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) — do not ship a parallel `:root` block that fights globals.

---

## Explicitly deferred

| Item | When / trigger |
|------|----------------|
| Day Engine Phase C/D | [m2-today-v3-day-engine.md](./m2-today-v3-day-engine.md) + unmerged-branch-queue P2–P5 |
| Music launcher redesign | Separate tweak if needed |
| OS notifications for Queue | Not in this runbook |
| Full command palette for queue add | Out of M2 closed scope |

---

## Completion checklist

| # | Criterion | Done |
|---|-----------|------|
| H1 | Timer dominant without card background | ☐ |
| H2 | All existing Today capabilities retained | ☐ |
| H3 | Current Focus compact + independent body scroll | ☐ |
| H4 | Timeline narrower (~300–360) | ☐ |
| H5 | Next Up preview = first item; full Queue between Workspace and Timeline | ☐ |
| H6 | Queue closed by default; manual + drag auto-open | ☐ |
| H7 | Task / Habit / Timeline → Queue; reorder; Timeline retained | ☐ |
| H8 | Task & Habit overlays large, anchored above launchers | ☐ |
| H9 | Focus-complete → Start Next | ☐ |
| H10 | Surface hierarchy coherent with FlowOS tokens | ☐ |

**Acceptance test:** Founder can run the manual test matrix on production with all rows PASS. ☐

---

## After runbook complete

1. Final [july-log.md](../logs/july-log.md) entry with commits and production verification.  
2. Move inbox Promoted row to Done.  
3. Optional SRAI note under [review/milestones/](../../review/milestones/) if treating as M2 addendum review.  
4. Freeze this runbook — append decision-log if scope changed mid-flight; do not silently rewrite history.

---

*End of runbook. Do not start Day Engine Phase C under this naming.*
