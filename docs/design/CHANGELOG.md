# FlowOS Design Changelog

Chronological record of design evolution from audit through Phase 2, with rationale and tradeoffs.

---

## Design Audit (July 3, 2026)

### What changed

Comprehensive design audit delivered from 23 UI screenshots + full codebase inspection. Overall score **5.5/10**. Identified P0 bugs (serif font, native controls, light-surface leaks) and P1 systemic issues (no accent budget, control inconsistency, density problems). Proposed "Midnight Focus" color direction and 5-phase visual roadmap.

### Why

The app had strong OKLCH token architecture (7/10 foundations) undermined by implementation bugs and missing design discipline. Visual polish work would be wasted until P0 bugs were fixed.

### Impact

Established the design program's contract-based workflow: audit → review → spec → implement → validate. Every subsequent phase traced back to audit findings.

### Tradeoffs

- **Chosen:** Bug-fix-first phased approach (~11–14 days total visual work)  
- **Rejected:** Big-bang redesign (too risky for a shipping MVP)  
- **Rejected:** Graphite Professional palette (no differentiation)  
- **Rejected:** Aurora Premium full palette (too decorative; workspace bloom only retained as `.flow-workspace` idea)

### Rejected alternatives

- Immediate color palette overhaul before font fix  
- Building new primitives before fixing adoption gaps  
- Treating serif rendering as a "design choice" rather than a bug  

---

## Phase 0 — Foundation & Critical Visual Bug Fixes

**Commit:** `5fc780a`

### What changed

- Fixed `--font-sans` / `--font-heading` circular references → Geist Sans app-wide  
- Replaced 4 native controls with existing FlowOS components  
- Fixed 2 white selected-state surfaces → `flow-selected` tokens  
- Added global `prefers-reduced-motion` guard  
- Produced deferred-work inventory (13 items) for Phase 1+  

### Why

Single largest visual improvement with lowest risk. Serif fallback made every surface feel unfinished. Native controls broke dark-theme immersion. Two inverted selected states were trust-breaking light leaks.

### Impact

App immediately read as a professional product. Geist Sans removal of visual noise exposed the next-loudest defect: inverted `bg-foreground text-background` pills — which became Phase 1's focus.

### Tradeoffs

- **Chosen:** Fix only 2 of 10+ inverted instances in Phase 0; inventory the rest  
- **Rejected:** Fixing all inverted instances in Phase 0 (scope creep into redesign)  
- **Rejected:** Building reusable Select primitive for settings/quick-capture (deferred to Phase 1 evaluation)  
- **Rejected:** Modifying `layout.tsx` font loading (fix tokens in CSS only)

### Rejected alternatives

- Renaming next/font variables instead of fixing CSS indirection  
- Replacing habit duration number input (explicitly excluded — working acceptably)  
- Bundling segmented control unification into Phase 0  

---

## Phase 0 Review (pre-spec)

### What changed

Self-review challenged original Phase 0 task sizing. Discovered TimeField and TaskPrioritySelect already existed — tasks became adoption gaps, not new builds. Identified Plan toggle as third light-surface leak. Confirmed settings has two native duration selects.

### Why

Prevent over-scoping Phase 0 into component development. Evidence from codebase inspection changed task estimates from "build" to "swap."

### Impact

Produced frozen engineering contract (`01-phase0-spec.md`) with exact file paths and trap warnings. Reduced Phase 0 from ambiguous to ~0.5 day deterministic work.

---

## Phase 1 — Interaction & Control Consistency

**Commit:** `04fe227`

### What changed

Original 5-task Phase 1 plan rejected. Revised scope:

- Quick Capture Plan toggle inline restyle (Option A — no SegmentedControl primitive)  
- 4 inverted-surface remediations + timeline zoom active state  
- Time picker sky-blue highlight → semantic tokens  
- Deleted `native-picker-input.tsx` and `schedule-header.tsx`  

**Not shipped:** SegmentedControl primitive, TimeField primitive, Select consolidation, Badge migration, Focus settings pill fix (premise was false).

### Why

Phase 0 changed ground truth. With Geist rendering correctly, inverted pills became the loudest defect. Building new primitives before fixing the inverted pattern would cement bad interaction grammar. Three working dropdown-selects made Select consolidation premature.

### Impact

Score rose to **7.0/10** (strategic review). Interaction consistency improved on highest-traffic toggles. Badge/accent work correctly deferred to Phase 2 as a coordinated sweep.

### Tradeoffs

- **Chosen:** Option A inline toggle restyle referencing Workplace recipe  
- **Rejected:** Full SegmentedControl primitive + 4 migrations (regression risk, scope)  
- **Rejected:** Select primitive consolidation (three working implementations)  
- **Rejected:** TimeField primitive (already exists as ScheduleTimePickerField)  
- **Chosen:** Delete dead `native-picker-input.tsx` (zero user impact)  

### Rejected alternatives

- Keeping SegmentedControl as Phase 1 Task 1 (fresh-eyes review removed it)  
- Fixing all 10+ inverted instances (only 4 live + zoom qualified as Phase 1 scope)  
- Treating `convert-actions.tsx` 5% tint as inverted (correctly excluded)  

---

## Phase 1 Fresh-Eyes Correction (pre-implementation)

### What changed

Final scope correction before implementation:

- Removed Task 3 (Focus settings pill inputs) — already standard Input components  
- SegmentedControl downgraded from primitive to Option A inline restyle  
- Timeline toggle handled separately from Quick Capture  

### Why

Prevent implementing a task based on a false premise. Reduce diff size and review surface.

### Impact

Phase 1 shipped as 4 tasks in ~9 files (+23/−170 lines). Clean, reviewable commit.

---

## Phase 2 — Accent Language & Chip Consolidation

**Commit:** `9f7e7c4`

### What changed

12-task engineering contract executed across ~39 files:

- Central palette libs refactored with frozen accent exports  
- Badge extended with entity/status variants  
- Group pills → dots; habit rows neutralized; focus markers → accent dots  
- Priority → edge/flag semantics; schedule channels aligned  
- Dashboard KPI, panel toggles, drag preview, heatmap contrast migrated  

Post-release patch (4 items): planner sky removal, habit card tokens, schedule capacity/KPI tokens.

### Why

542 hardcoded palette references and rainbow entity fills violated the accent budget rule. Phase 1 proved that coordinated central-lib refactors are safer than page-by-page tweaks. Typography and layout work would be undermined if color chaos remained.

### Impact

Release review score **7.8/10** (implementation), **8.2/10** (engineering quality). Core accent thesis realized on Tasks, Workplace, Schedule, Dashboard. Product reads as one coherent indigo workspace.

### Tradeoffs

- **Chosen:** Extend Badge rather than create separate Chip primitive  
- **Chosen:** Leave notes/reflection/settings untouched (explicit contract boundary)  
- **Chosen:** Spot-check heatmap contrast rather than full rebuild  
- **Rejected:** Typography rollout in Phase 2 (would blur accent focus)  
- **Rejected:** SegmentedControl extraction (still copy-paste; deferred)  
- **Rejected:** New OKLCH hue introduction (work within existing tokens)  
- **Rejected:** Removing emoji from data model (display-only changes allowed)  

### Rejected alternatives

- Typography-first Phase 2 (strategic review rejected — accent chaos is louder)  
- Dashboard surface recipe unification in Phase 2 (deferred)  
- Full hardcoded palette zero (542 → significant reduction, not elimination)  

---

## Phase 2 Post-Release Patch

### What changed

Four approved observations from release review closed:

- `tasks-board-view.tsx` — planner sky accent removal  
- `habit-card.tsx` — green wash → semantic tokens  
- `schedule-capacity-bar.tsx`, `schedule-kpi-row.tsx` — legacy palette → semantic tokens  
- `task-row.tsx` — no change (contract allows flag-only for high priority)  

### Why

Release review scored 7.8/10 with specific residual hardcoded palette on adjacent surfaces. Patch scope explicitly approved — not a new phase.

### Impact

Phase 2 permanently closed. No further visual work until Phase 3.

---

## UX Friction Review (July 3, 2026)

### What changed

Perspective shift from design system to daily workflow friction. Top 20 productivity blockers ranked. Original Phase 3 (typography & density) **superseded** by "Effortless Daily Loop" UX roadmap (6 sub-phases).

### Why

Design system assumed complete after Phase 2. User research simulation (6-month power user) revealed navigation and workflow architecture — not visual polish — as the primary retention blocker.

### Impact

Phase 3 redefined. Visual typography/density work deferred to Phase 4. Product architecture direction: Workplace/Today as gravitational center, Dashboard demoted to optional overview.

### Tradeoffs

- **Chosen:** Workflow-first Phase 3 (gravitational center, command layer, focus friction)  
- **Rejected:** Continuing visual-only Phase 3 from original audit  
- **Rejected:** Goals/AI Coach/Weekly Review in Phase 3 (defer to Phase 4+)  
- **Rejected:** Adding more sidebar modules  

### Rejected alternatives

- Phase 3 as typography scale rollout (important but not highest ROI for daily users)  
- Merging Schedule and Tasks pages immediately without routing fixes first  
- Removing Dashboard entirely (demote, don't delete — intelligence still valuable)  

---

## Design Documentation Preservation (July 3, 2026)

### What changed

All Canvas artifacts, agent transcripts, and plan files normalized into `docs/design/` permanent Markdown documentation before Phase 3 begins.

### Why

Design history existed only in Cursor Canvases and chat transcripts — not in the repository. Phase 3 requires stable reference for decisions already made.

### Impact

`docs/design/` becomes the official source of truth for all design history going forward.

---

## Related documents

- [PROJECT_STATE.md](./PROJECT_STATE.md)  
- [ROADMAP.md](./ROADMAP.md)  
- [AUDIT_HISTORY.md](./AUDIT_HISTORY.md)  
- Phase documents `00-*` through `03-*`  
