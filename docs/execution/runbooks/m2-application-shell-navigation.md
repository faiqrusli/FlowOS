# M2 — Application Shell Navigation System

**Scope:** M2 addendum — unify global left primary nav + right utility rail + expanded utility panels into one coherent application shell. Does not add new modules, routes, or command palette.  
**Authority:** Spec [application-shell-navigation-spec.md](../../review/design/application-shell-navigation-spec.md). Does not add, remove, defer, or weaken any M2 exit criterion from [execution-masterplan.md](../../strategy/execution-masterplan.md).  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.  
**Implementation branch:** `tweak/today-focus-queue-layout` — all Sessions 1–5 commit here. Do **not** create per-session branches.

**Shared branch note:** This runbook continues on the same branch as [m2-today-hierarchy-refinement.md](./m2-today-hierarchy-refinement.md) (Today hierarchy Sessions 1–9 already committed as B1–B4 on this tip). Shell sessions are **serial after** hierarchy commits; do not rewind or rewrite hierarchy history.

**Product rule (frozen for this runbook):**

```
Left rail  = primary application navigation  (Where am I?)
Right rail = contextual workspace utilities  (What supporting workspace?)
Expansion  = horizontal reveal only — vertical geometry stays stable
```

**Not this runbook:** [m2-global-navigation.md](./m2-global-navigation.md) (IA / Home+Workspace order — already shipped). Do not re-litigate route order or icons unless a visual parity bug appears.

---

## Acceptance test

When Sessions 1–5 are complete on `tweak/today-focus-queue-layout` and merged to `main`, a founder opening any authenticated page sees: one shared **68px** header band (F logo cell aligned with the main top/status bar and utility panel header, shared bottom divider); left rail **88px** collapsed / **260px** expanded with a **36×36** F logo that does not resize or jump on expand; **18px** nav icons in **48px** rows with stable Y across collapse/expand; HOME/WORKSPACE labels as expanded decoration only; right utility rail a persistent **64px** structural edge with **40×40** targets clustered near the top; utility panel (~**500px**) elevated beside the rail (not replacing it) with left-edge separator + directional shadow; clicking utility icons opens/switches/toggles without close-then-reopen churn; main workspace resizes until min width forces overlay; `npm run build` and `npm run lint` pass. Task Details, Notes, and Reflection remain the only right utilities.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on `tweak/today-focus-queue-layout` (`WIP: Shell Session N blocked — {reason}`) or `git stash`. Do **not** merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table below. |
| 6 | **Parallel exception:** none — sessions are serial commits on this branch; do not open parallel branches for Sessions 1–5. |

---

## Session dependency table

| Session | Depends on (complete on this branch) | Blocks |
|---------|--------------------------------------|--------|
| 1 — Canonical dimensions | Branch checked out (`tweak/today-focus-queue-layout`) | 2, 3, 4, 5 |
| 2 — Shared header alignment | 1 committed | 3, 4 |
| 3 — Left nav one-geometry | 1, 2 committed | 5 (left a11y smoke) |
| 4 — Right rail + elevated panel | 1, 2 committed | 5 |
| 5 — Behavior, overlay, a11y | 3, 4 committed | — |

Sessions 3 and 4 may run in either order after Session 2 if they do not fight over the same files; prefer serial commits. Session 5 requires both rails visually correct.

---

## Session plan

**Budget:** 5 sessions × 2–4 hours each.  
**Engineering sessions:** 1–5 (Agent-executable).  
**Founder-only:** Production visual sign-off after Bundle B4 (manual — no separate session number).

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).  
**Exception for this runbook:** one shared branch for all sessions (not `m2/session-N-…` per session).

| Step | Rule |
|------|------|
| **Branch** | Stay on `tweak/today-focus-queue-layout` for Sessions 1–5 |
| **Start session** | Confirm `git branch --show-current` is `tweak/today-focus-queue-layout` — do **not** checkout `main` or create a new branch |
| **During session** | Commit on this branch (`feat:` / `fix:` / `tweak:` / `WIP:` as needed); `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → commit → push this branch → report which session/bundle completed. **Do not** ask to merge to `main` after every session |
| **Merge ask** | After Bundle B4 (Session 5) — or earlier if founder requests a partial merge — agent **asks founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles** (progress markers on this branch; merge ask at B4 unless founder asks sooner):

| Bundle | Sessions | Remind when |
|--------|----------|-------------|
| B1 — Dimensions + shared header | 1, 2 | Session 2 verified — F + status bar one continuous 68px row |
| B2 — Left rail geometry | 3 | Session 3 verified — expand/collapse does not jump icons |
| B3 — Right rail + panel elevation | 4 | Session 4 verified — rail persists; panel elevated beside it |
| B4 — Behavior + a11y | 5 | Session 5 done — **ask merge to `main`** |

Follow-ups after this branch merges: `tweak/…` from `main` — same approval rule.

---

## Current code reality (baseline)

| Area | File / route | Behavior today (pre-shell sessions) |
|------|--------------|-------------------------------------|
| Shell orchestrator | `src/components/app-shell.tsx` | Left sidebar + main + right utility chrome |
| Left sidebar | `src/components/app-sidebar.tsx` | 72px collapsed / 260px expanded; brand header 72px; logo 28/32px |
| Nav config | `src/config/sidebar-navigation.tsx` | Home + Workspace IA (shipped) |
| Profile | `src/components/sidebar/sidebar-account-menu.tsx` | Bottom account menu |
| Right utility | `src/components/layout/global-right-sidebar.tsx` | Fixed shell; 56px rail; panel + inner rail when expanded |
| Panel content | `sidebar-details-panel.tsx`, `sidebar-notes-panel.tsx`, `sidebar-reflection-panel.tsx` | Content inside utility shell |
| Dimensions | `src/lib/shell-dimensions.ts` + `globals.css` `:root` | Canonical TS constants; currently compact baseline ≠ final spec |
| Right state | `src/contexts/global-right-sidebar-context.tsx` | Panel, width, persistence, workplace overlay mode |
| Persistence | `src/lib/sidebar-preference.ts`, `src/lib/global-right-sidebar-persistence.ts` | Left collapse; right width/panel/expanded |
| Elevation helpers | `flow-shell-right-drawer`, `workspaceDrawerPanelClass` | Defined but not fully wired on expanded panel |

**Spec frozen dimensions (implementation target):**

| Element | Target |
|---------|--------|
| Global shell header | 68px |
| Left collapsed / expanded | 88px / 260px |
| F logo | 36×36px (both states) |
| Nav icon / left row | 18×18 / 48px |
| Right utility rail / hit | 64px / 40×40 |
| Utility panel default | 500px |
| Panel animation | 200–250ms ease-out |

---

## Session 1 — Canonical shell dimensions

**Type:** `engineering`  
**Goal:** Freeze shell geometry in one TS + CSS source of truth to match the spec baseline. Wire components to constants; do not redesign chrome yet beyond dimension application.  
**Time:** 2–3 hours  
**Prerequisites:** On `tweak/today-focus-queue-layout`.  
**Maps to:** Spec §§4, 6, 8, 10, 11, 20, 21, 29, 46  
**Merge bundle:** B1

### Numbered steps

| # | Step |
|---|------|
| 1 | Update `src/lib/shell-dimensions.ts` to frozen targets: header **68**, left **88/260**, logo **36** (same collapsed/expanded), nav row **48** (Today + Workspace), right rail **64**, utility button **40**, panel default **500** (content = 500 − rail), header heights unified to 68. Remove dual logo sizes and dual workspace-row heights. |
| 2 | Mirror the same values in `src/app/globals.css` `:root` shell variables (`--shell-header-height`, `--left-rail-width`, `--left-sidebar-expanded-width`, `--right-rail-width`, `--brand-logo-size`, `--nav-row-height`, `--nav-icon-size`, `--utility-hit-size`, etc.). Keep legacy aliases pointing at the new values. |
| 3 | Update consumers (`app-sidebar.tsx`, `global-right-sidebar.tsx`, `global-right-sidebar-persistence.ts`, `panel-toggle-styles.ts`, `today-status-rail.tsx` / topbar helpers) so widths/heights read from constants — no hardcoded 56/72/28 leftovers in shell chrome. |
| 4 | Smoke: collapse/expand left; open Notes utility; no layout crash. |
| 5 | `npm run build && npm run lint` → commit on branch → push. |

### Verification

```powershell
npm run build
npm run lint
git status -sb
```

| Check | Expected |
|-------|----------|
| Collapsed left | ~88px wide |
| Expanded left | ~260px wide |
| Right rail | ~64px wide |
| Default open panel total | ~500px (content + rail) |
| Logo constant | 36px both states |

**Stop/fail if:** Dimensions diverge between TS and CSS; build/lint fail; pages unusable from width overflow.

---

## Session 2 — Shared global header alignment

**Type:** `engineering`  
**Goal:** Make the F brand cell part of one continuous 68px top row with the main status/top bar (and utility panel header). Kill the oversized/separate brand region.  
**Time:** 2–4 hours  
**Prerequisites:** Session 1 committed.  
**Maps to:** Spec §§3, 4, 7, 9, 23, 30, 52  
**Merge bundle:** B1

### Numbered steps

| # | Step |
|---|------|
| 1 | Set left `SidebarBrand` height to `SHELL` / `--shell-header-height` (68) in **both** collapsed and expanded states. Vertically center 36×36 F; expanded = `[F] FlowOS` with ~12px gap, text ~18–20px / weight 600 — **no taller header**. |
| 2 | Align main-column top chrome (Today status rail / page top bars that use `flow-shell-topbar`) to the same 68px height and shared bottom divider language so logo cell + status bar read as one horizontal system. |
| 3 | Align utility panel header + utility rail header collapse control to the same 68px shell header height. |
| 4 | Remove collapsed-only top padding hacks that push the logo below the shared header band (e.g. large `paddingTop` brand offsets). |
| 5 | Smoke desktop: Today + Tasks with Notes open — three header cells share one baseline. |
| 6 | Build/lint → commit → push. |

### Verification

| Check | Expected |
|-------|----------|
| Logo vs date/status | Same vertical center; shared bottom divider |
| Collapse → expand | Logo size and Y unchanged; only “FlowOS” appears |
| Utility header | Title Y matches rail collapse control |

**Stop/fail if:** Brand region returns to ~120px; logo grows on expand; headers misaligned by more than ~2px.

---

## Session 3 — Left navigation one-geometry

**Type:** `engineering`  
**Goal:** Collapsed and expanded left rail share one vertical structure. Expansion reveals text/labels horizontally; icons and profile do not jump.  
**Time:** 3–4 hours  
**Prerequisites:** Sessions 1–2 committed.  
**Maps to:** Spec §§5, 11–18, 39–41, 47, 50  
**Merge bundle:** B2

### Numbered steps

| # | Step |
|---|------|
| 1 | Unify nav row geometry: **48px** rows / hit areas for Today and Workspace items in both states; **18px** icons; radius ~12–14px; icon center X/Y stable via fixed icon column (`SHELL_NAV_ICON_COLUMN_PX` = collapsed width). |
| 2 | Vertical rhythm: 12–16px top breathing room under header; compact group (not icons spread full viewport height); 12–16px semantic gap between Home and Workspace; flexible spacer; profile at bottom. |
| 3 | HOME / WORKSPACE labels: expanded-state decoration only. Prefer absolute/grid label placement or fixed group containers so collapsing does **not** reserve large invisible label gaps. |
| 4 | Active state: subtle accent surface + accent icon + restrained 3×28–32px left indicator (`rounded-r`). Same component collapsed/expanded — not a brighter filled block. |
| 5 | Profile: simplify avatar chrome (one subtle border); 40–44px avatar; expanded reveals name/role horizontally without moving avatar Y. |
| 6 | Tooltips on collapsed icons: delay 400–600ms; `aria-label` / `aria-current="page"` present. |
| 7 | Build/lint → commit → push. |

### Verification

| Check | Expected |
|-------|----------|
| Expand/collapse | Today→Reflection + Profile Y stable |
| Collapsed density | Coherent cluster, not lift-shaft spacing |
| Active Today | Quiet indigo surface + thin indicator |
| Labels | Visible when expanded; no dead gaps when collapsed |

**Stop/fail if:** Icons jump >2px on transition; invisible label padding recreates sparse collapsed rail; profile rings overcomplicated again.

---

## Session 4 — Right utility rail + elevated panel

**Type:** `engineering`  
**Goal:** Persistent 64px utility rail + elevated panel beside it. Rail surface stays stable; panel separates from main workspace.  
**Time:** 3–4 hours  
**Prerequisites:** Sessions 1–2 committed.  
**Maps to:** Spec §§19–28, 31, 36–38, 48, 50–51  
**Merge bundle:** B3

### Numbered steps

| # | Step |
|---|------|
| 1 | Confirm rail width 64px always visible when panel open; panel content sits to the **left** of the rail — rail must not morph into the panel. |
| 2 | Compact top cluster: header 68px; top padding 12–16px; 40×40 targets; ~8px gaps; utilities near top — do not distribute icons down the viewport. |
| 3 | Active utility: compact 40×40, radius 10–12px, subtle accent surface — no giant pills/glow. |
| 4 | Surfaces: rail = persistent nav/structural (`surface-nav`); panel = elevated drawer surface; wire directional left-edge shadow (`flow-shell-right-drawer` / equivalent tokens). Do not let rail inherit panel background when open. |
| 5 | Borders: panel left separator; avoid strong borders on every shell region. |
| 6 | Keep Task Details / Notes / Reflection as content inside one UtilityPanel shell (`sidebar-*-panel.tsx`) — pages must not recreate the right rail. |
| 7 | Build/lint → commit → push. |

### Verification

| Check | Expected |
|-------|----------|
| Panel closed | Rail alone; same rail surface as when open |
| Panel open | Elevated panel + persistent rail; clear separation from main |
| Active icon | Compact 40px treatment |
| Icon cluster | Near top, not full-height spread |

**Stop/fail if:** Rail disappears or restyles to panel fill when open; panel flat/fused with workspace; 56–72px giant active pills return.

---

## Session 5 — Behavior, overlay, a11y, persistence

**Type:** `engineering`  
**Goal:** Correct open/switch/toggle behavior, transitions, responsive overlay, accessibility, and persistence rules.  
**Time:** 2–4 hours  
**Prerequisites:** Sessions 3–4 committed.  
**Maps to:** Spec §§32–35, 41–45  
**Merge bundle:** B4

### Numbered steps

| # | Step |
|---|------|
| 1 | Opening: closed → click Notes opens Notes; Task Details open → click Notes **switches content** (no close-then-reopen); click active utility **toggles closed**. |
| 2 | Transition: 200–250ms ease-out horizontal slide + slight fade; no spring/overshoot. Align `panel-layout-animation.ts` / CSS transitions. |
| 3 | Desktop: main workspace **resizes** when panel opens. Define `--main-workspace-min-width` (~720px); if viewport − left − panel − rail < min, switch panel to **overlay** mode (reuse/extend `workplaceHoverMode` or a shell-wide overlay flag — prefer one global rule, not page-specific forks). |
| 4 | Persistence: left collapse across sessions (keep); utility open/closed session-scoped preferred; last utility optional; do **not** auto-reopen large panel on every future visit unless already product-proven. |
| 5 | A11y: `aria-label` on icon-only controls; `aria-pressed` on active utility; `aria-current="page"` on left nav; Escape closes panel when focus inside; visible restrained focus rings. |
| 6 | Smoke: Today, Tasks, Habits, Schedule, Focus, Notes, Reflection — open each utility; switch; toggle; keyboard Escape. |
| 7 | Build/lint → commit → push → **ask founder merge to `main`**. |

### Verification

| Check | Expected |
|-------|----------|
| Switch Notes ↔ Reflection | Direct content swap |
| Toggle active | Closes panel |
| Narrow viewport | Overlay instead of crushing main < ~720px |
| Escape | Closes utility panel |
| Persistence | Left collapse survives reload; panel does not surprise-reopen on cold visit |

**Stop/fail if:** Close-then-reopen animation returns; overlay logic only on Today; a11y names missing; build/lint fail.

---

## Manual test matrix (founder / agent end of B4)

| # | Scenario | Expected | Pass |
|---|----------|----------|------|
| M1 | Desktop Today — collapsed left | 88px rail; 36px F aligned with status bar | ☐ |
| M2 | Expand left | Width → 260; icons Y stable; FlowOS + labels appear | ☐ |
| M3 | Collapse left | Icons Y stable; no dead label gaps | ☐ |
| M4 | Open Notes from rail | Panel ~500 elevated left of 64px rail | ☐ |
| M5 | Switch to Reflection | Content swaps; no close/reopen | ☐ |
| M6 | Click active Reflection | Panel closes; rail remains | ☐ |
| M7 | Task Details with task selected | Same shell header Y as Notes | ☐ |
| M8 | Narrow window | Panel overlays before main becomes unusable | ☐ |
| M9 | Reload | Left collapse persisted; panel not forced open | ☐ |
| M10 | Keyboard | Tab to rail; Escape closes panel | ☐ |

---

## Explicitly deferred

| Item | When / trigger |
|------|----------------|
| Command palette | Out of M2 closed scope |
| New utility panels beyond Details/Notes/Reflection | Future product decision |
| Hover-reveal right rail (unused `hoverRevealed`) | Separate decision if still desired after this shell |
| Day Engine Phase C/D | [m2-today-v3-day-engine.md](./m2-today-v3-day-engine.md) |
| Today hierarchy leftover polish | Same branch OK as tiny follow-ups; do not reopen Sessions 1–9 |

---

## Completion checklist

| # | Criterion | Done |
|---|-----------|------|
| S1 | Frozen dimensions match spec baseline (68/88/260/36/18/48/64/500) | ☑ |
| S2 | Shared 68px header band — logo + status + utility headers aligned | ☑ |
| S3 | Left one-geometry — stable Y; labels decoration; quiet active | ☑ |
| S4 | Persistent 64px rail + elevated panel beside it | ☑ |
| S5 | Open/switch/toggle; overlay min-width; a11y; persistence | ☑ |
| S6 | Manual test matrix all PASS | ☐ |

**Acceptance test:** Founder can run the manual test matrix on production with all rows PASS. ☐

---

## After runbook complete

1. Final [july-log.md](../logs/july-log.md) entry with commits and production verification.  
2. Move inbox Promoted row to Done.  
3. Optional SRAI note under [review/milestones/](../../review/milestones/) if treating as M2 addendum review.  
4. Freeze this runbook — append decision-log if scope changed mid-flight; do not silently rewrite history.

---

*End of runbook. Stay on `tweak/today-focus-queue-layout`. Do not invent per-session branches for shell work.*
