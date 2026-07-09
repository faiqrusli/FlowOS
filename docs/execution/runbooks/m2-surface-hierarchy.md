# M2 — Surface Hierarchy Runbook

**Scope:** M2 only — implements the four-level visual design system. Authoritative architecture: [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) (v2.0). This runbook executed the v1 surface contract preserved in [DESIGN_SYSTEM_v1.md](../../foundation/DESIGN_SYSTEM_v1.md). Does not add, remove, or weaken any M2 exit criterion.  
**Authority:** [decision-log.md](../logs/decision-log.md) 2026-07-08 "Four-level surface hierarchy (content first, chrome second)" is the product decision. This runbook does not re-litigate it.  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → this runbook → [july-log.md](../logs/july-log.md) after merge to `main`.

---

## Acceptance test

When Sessions 1–5 are complete, a founder opening production sees one continuous dark workspace: both sidebars at the same subtle elevation, no heavy top-bar seam, cards as the clearest visual objects, and no one-off dark hex backgrounds outside the four tokens. `npm run build` and `npm run lint` pass; `globals.css` exposes `--background`, `--surface`, `--card`, `--surface-hover` as the canonical dark surface stack.

---

## Resume protocol

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on the **session branch** (`WIP: Session N blocked — {reason}`) or `git stash`. Do **not** merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table below. |

---

## Session dependency table

| Session | Depends on (must be on `main`) | Blocks |
|---------|--------------------------------|--------|
| 1 — Token foundation | M1 ship gate | 2, 3, 4, 5 |
| 2 — Sidebar parity | 1 | 4, 5 |
| 3 — Continuous chrome | 1 | 4, 5 |
| 4 — High-traffic audit | 2, 3 | 5 |
| 5 — Theme layer cleanup | 4 | — |

Sessions 2 and 3 may run in parallel after Session 1 merges (different files; no shared state beyond tokens).

---

## Session plan

**Budget:** 5 sessions × 2–3 hours each.  
**Engineering sessions:** 1–5 (Agent-executable).  
**Founder-only:** Production visual sign-off after Session 5 (manual — no separate session number).

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b m2/session-N-surface-{short-name}` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → agent reports merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles:**

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — Tokens | 1 | Session 1 verified locally |
| B2 — Chrome shell | 2, 3 | Both sessions done |
| B3 — Full migration | 4, 5 | Both sessions done — runbook complete |

Ad-hoc follow-up tweaks: branch `tweak/surface-{description}` from `main` — same approval rule.

---

## Session 1 — Token foundation

**Type:** `engineering`  
**Goal:** Dark theme defines the four canonical surface tokens and maps existing shadcn/Tailwind aliases to them.  
**Time:** 2–3 hours  
**Prerequisites:** M1 ship gate complete.  
**Maps to:** DESIGN_SYSTEM.md migration Phase 1 + Phase 5 (token definitions)  
**Merge bundle:** B1

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Dark surfaces | `src/app/globals.css` `.dark` | Seven levels: `--surface-app`, `--surface-sidebar`, `--surface-page`, `--timeline-surface`, `--surface-card`, `--surface-elevated`, `--surface-popover`, `--surface-dialog` |
| Tailwind bridge | `src/app/globals.css` `@theme inline` | `--color-surface-sidebar`, `--color-surface-page`, etc. |
| Theme reference | `src/lib/theme/tokens.ts` | Documents old token names |
| Spec targets | [DESIGN_SYSTEM.md](../../foundation/DESIGN_SYSTEM.md) | Four tokens: `#0E111B`, `#121826`, `#1A2133`, `#232D45` |

### Numbered steps

| # | Step |
|---|------|
| 1 | In `globals.css` `.dark`, set canonical tokens: `--background: #0E111B`, `--surface: #121826`, `--card: #1A2133`, `--surface-hover: #232D45`. |
| 2 | **Alias** legacy names to the four tokens so downstream sessions can migrate incrementally: `--surface-app` → `var(--background)`; `--surface-sidebar` → `var(--surface)`; `--surface-page` → `var(--background)`; `--timeline-surface` → `var(--background)` (timeline is canvas, not a separate elevation); `--surface-card` → `var(--card)`; popover/dialog/elevated map to `--card` or `--surface-hover` per DESIGN_SYSTEM elevation model (dropdown/modal above cards). |
| 3 | Update card shadow token to match spec: `0 2px 12px rgba(0,0,0,.18)` for `.flow-surface-card`; modal shadow `0 12px 48px rgba(0,0,0,.35)` for `.flow-surface-modal`. |
| 4 | Add `@theme inline` entries for `--color-surface` and `--color-surface-hover` if missing; keep existing aliases working. |
| 5 | Set `--divider` / `--border` to align with spec borders (`rgba(255,255,255,.04–.05)` range) without breaking focus rings or input visibility. |
| 6 | `npm run build && npm run lint` → commit on **session branch** → push branch → **ask founder to approve merge to `main`**. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
git status -sb
```

**Production manual checks**

| Check | Expected |
|-------|----------|
| App loads | No broken styles; dark theme renders |
| Cards still visible | Cards distinguishable from background |
| DevTools `:root.dark` | `--background`, `--surface`, `--card`, `--surface-hover` present with spec hex values |

**Stop/fail if**

- Build or lint fails.
- Cards become indistinguishable from workspace (contrast regression).

**Rollback:** revert merge on `main` — never force-push `main`.

---

## Session 2 — Sidebar parity

**Type:** `engineering`  
**Goal:** Left and right sidebars use identical surface treatment per DESIGN_SYSTEM.md.  
**Time:** 2 hours  
**Prerequisites:** Session 1 on `main`.  
**Maps to:** DESIGN_SYSTEM.md migration Phase 2  
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Left sidebar | `src/components/app-sidebar.tsx` `SidebarPanel` | `bg-sidebar border-r border-sidebar-border` — maps to `--surface-sidebar` |
| Right sidebar | `src/components/layout/global-right-sidebar.tsx` | `bg-card shadow-sm border-l border-border/40` — **card elevation + shadow** (disconnect) |
| Access panel | `src/components/layout/global-access-panel.tsx` | `bg-card shadow-sm` |

### Numbered steps

| # | Step |
|---|------|
| 1 | Change `global-right-sidebar.tsx` outer shell: `bg-surface` (or `bg-sidebar` once aliased to `--surface`), remove `shadow-sm`, set `border-l` to `rgba(255,255,255,.05)` equivalent (`border-white/5` or `border-divider`). |
| 2 | Align `global-access-panel.tsx` if it renders as chrome (not content card): use surface, not card; no shadow. |
| 3 | Verify left sidebar `border-r` matches right `border-l` weight — both subtle, no double borders at collapse points. |
| 4 | Remove any sidebar-specific box shadows introduced in panel toggle styles (`src/lib/panel-toggle-styles.ts`) if they read as chrome elevation on the rail edge. |
| 5 | `npm run build && npm run lint` → commit → push → ask founder merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Today `/` with right panel open | Left and right rails same apparent darkness |
| Right panel | No card-like float; no shadow on rail |
| Cards inside right panel content | Still card elevation (content, not chrome) |

**Stop/fail if:** Right rail still visibly lighter than left; build/lint fails.

---

## Session 3 — Continuous chrome

**Type:** `engineering`  
**Goal:** Top bar and main workspace merge into one continuous canvas.  
**Time:** 2 hours  
**Prerequisites:** Session 1 on `main`.  
**Maps to:** DESIGN_SYSTEM.md migration Phase 3  
**Merge bundle:** B2

### Current code reality

| Area | File | Behavior today |
|------|------|----------------|
| Mobile top bar | `src/components/app-sidebar.tsx` `MobileSidebarTrigger` | `bg-background border-b border-border` — mostly correct; border may be too strong |
| Main workspace | `src/app/globals.css` `.flow-workspace` | `background: var(--surface-page)` — separate from `--background` today |
| App shell | `src/components/app-shell.tsx` | Outer `bg-background`; main uses `flow-workspace` |

### Numbered steps

| # | Step |
|---|------|
| 1 | Update `.flow-workspace` to `background: var(--background)` (after Session 1 aliases, this may already hold — verify visually). |
| 2 | Soften mobile header divider: `border-b border-white/5` or `border-divider` — must read as almost invisible per spec. |
| 3 | Grep for page wrappers that inject non-background canvas colors on high-traffic routes (`page.tsx` full-height shells) — ensure they do not reintroduce a seam. |
| 4 | Confirm no top-bar shadow classes on any header element. |
| 5 | `npm run build && npm run lint` → commit → push → ask founder merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Mobile viewport | Top bar blends into workspace; divider whisper-thin |
| Today `/` desktop | Uninterrupted canvas from edge to edge between sidebars |
| Scroll empty areas | Same background as chrome-adjacent space |

**Stop/fail if:** Visible horizontal seam between header and content; build/lint fails.

---

## Session 4 — High-traffic component audit

**Type:** `engineering`  
**Goal:** Shell-adjacent and highest-traffic surfaces use the four-token model — no stray dark hex or extra elevation layers.  
**Time:** 3 hours  
**Prerequisites:** Sessions 2 and 3 on `main`.  
**Maps to:** DESIGN_SYSTEM.md migration Phase 4 (scoped to shell + Today/Tasks/Workplace)  
**Merge bundle:** B3

### Audit scope (in order)

| Priority | Files / areas | Look for |
|----------|---------------|----------|
| 1 | `timeline-planner.tsx`, `workplace-page-content.tsx`, `workplace-focus-card.tsx` | Inline `#1a2035`, `bg-surface-elevated` as permanent backgrounds, `timeline-surface` |
| 2 | `tasks-board-view.tsx`, `task-compact-card.tsx` | Card shadows/heavy borders beyond spec |
| 3 | `dashboard-*` components still on `/` | Widget shells using non-card tokens |
| 4 | `dialog.tsx`, `dropdown-menu.tsx`, `card.tsx` | Modal/dropdown elevation matches spec |

### Numbered steps

| # | Step |
|---|------|
| 1 | `rg` for hardcoded dark hex in `src/components` (`#111`, `#1a`, `#121`, `oklch(0.1` patterns) — replace with token utilities. |
| 2 | Replace permanent `bg-surface-elevated` chrome uses with `bg-card`; reserve `bg-surface-hover` / hover utilities for interaction only. |
| 3 | Collapse `.dark .flow-surface-card` top-lit gradients if they fight the flat four-level model — founder prefers calm material over gloss (remove or reduce per visual check). |
| 4 | Timeline canvas: events on cards, canvas on background — not a third surface color. |
| 5 | `npm run build && npm run lint` → commit → push → ask founder merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| Today full loop | Cards pop; chrome recedes |
| Tasks board | No new surface colors in empty columns |
| Modals (Schedule Break, settings) | Modal shadow per spec; backdrop `rgba(0,0,0,.45)` where applicable |

**Stop/fail if:** Regressions in readability; build/lint fails; scope expands into unrelated module refactors.

---

## Session 5 — Theme layer cleanup

**Type:** `engineering`  
**Goal:** TypeScript theme helpers and docs reflect the four-token system; no stale references to seven levels.  
**Time:** 2 hours  
**Prerequisites:** Session 4 on `main`.  
**Maps to:** DESIGN_SYSTEM.md migration Phase 5  
**Merge bundle:** B3

### Numbered steps

| # | Step |
|---|------|
| 1 | Update `src/lib/theme/tokens.ts` to export `background`, `surface`, `card`, `surfaceHover` as canonical; mark legacy names deprecated or alias-only. |
| 2 | Update `src/lib/theme/surface-classes.ts` comments to match four-level model; add `surfaceHoverClass` if needed for shared hover rows. |
| 3 | Update [CODE_STANDARDS.md](../../foundation/governance/CODE_STANDARDS.md) styling section with one-line pointer to DESIGN_SYSTEM.md (docs-only cross-ref). |
| 4 | Final `rg` pass: zero unexplained custom dark backgrounds in `src/components` (semantic accents like schedule palette exempt). |
| 5 | `npm run build && npm run lint` → commit → push → ask founder merge approval. |

### Verification

| Check | Expected |
|-------|----------|
| `tokens.ts` | Canonical four tokens documented |
| Grep | No new violations in touched areas |
| Production | Founder sign-off: workspace feels larger, cards first |

**Stop/fail if:** Build/lint fails.

---

## Out of scope

- Light theme token rewrite (product is dark-only)
- Command palette, AI assistant, analytics modules (future — DESIGN_SYSTEM.md maps them only)
- `fable5` prototype routes
- dnd-kit migration, monolith splits, new modules
- Changing primary indigo accent system (CTA color is separate from surface hierarchy)
- New strategy docs (except decision-log, july-log, this runbook)

---

## Top execution risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contrast regression (cards vs background) | Illegible UI | Session 1 stop/fail; founder visual check each bundle |
| Scope creep into full-app palette sweep | Runbook never closes | Session 4 scoped list; defer low-traffic pages to `tweak/` branches |
| Breaking schedule/task semantic colors | Feature regression | Do not touch `schedule-palette.ts` accent colors — surfaces only |
| Removing gradients breaks perceived depth | Flat, cheap UI | Keep spec shadows; use borders before adding new surface colors |

---

## Explicitly deferred (not this runbook)

| Item | When / trigger |
|------|----------------|
| Low-traffic pages (Future Work, auth marketing shell) | `tweak/` after Session 5 or M3 polish |
| Command palette surface treatment | When command palette ships |
| Light theme | If light mode is ever enabled |

---

## M2 completion note

This runbook does **not** gate M2 exit criteria by itself — it is visual polish aligned with founder daily driver quality. Check off runbook acceptance test when Session 5 merges; record in [july-log.md](../logs/july-log.md).

---

## After runbook complete

1. Founder production sign-off on https://flowos-sage.vercel.app  
2. [july-log.md](../logs/july-log.md) entry with commits and before/after notes  
3. Update decision-log **Outcome** for 2026-07-08 surface hierarchy entry  
4. Optional: note any remaining `tweak/` backlog in [inbox.md](../logs/inbox.md)

---

*End of runbook.*
