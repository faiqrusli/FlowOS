# FlowOS Design Roadmap

> **Status: Superseded (Phase 3+ planning)** — For milestones M0–M5 and current execution, use [execution-masterplan.md](../../strategy/execution-masterplan.md) and [execution/README.md](../../execution/README.md). This file remains as **historical reference** for Phase 0–2 (complete) and the original Phase 3 UX outline.

**Last updated:** July 3, 2026  
**Baseline:** Phase 2 complete (`9f7e7c4`)

This roadmap tracks **approved and planned design/UX phases**. It merges the original design audit roadmap (Phases 0–5 visual) with the Phase 3 UX friction rewrite.

---

## Completed phases

### Phase 0 — Foundation & Critical Visual Bug Fixes ✅

**Goal:** Remove critical visual bugs; create stable baseline.  
**Effort:** ~0.5 day | **Commit:** `5fc780a`

- Fix serif font circular reference  
- Replace 4 native browser controls  
- Fix 2 white selected-state leaks  
- Global reduced-motion guard  
- Deferred-work inventory  

### Phase 1 — Interaction & Control Consistency ✅

**Goal:** One interaction recipe for toggles; eliminate inverted control pattern.  
**Effort:** ~1–1.5 days | **Commit:** `04fe227`

- Quick Capture Plan toggle inline restyle (Option A — primitive deferred)  
- Inverted-surface remediation (4 instances + timeline zoom)  
- Time picker highlight tokenization  
- Dead code deletion  

### Phase 2 — Accent Language & Chip Consolidation ✅

**Goal:** Indigo-dominant accent budget; unified Badge primitive.  
**Effort:** ~2–2.5 days | **Commit:** `9f7e7c4`

- Central palette lib refactor (12 tasks)  
- Badge entity/status variants  
- Group dots, habit neutral+edge, focus dots, priority edges  
- Dashboard KPI, panel toggles, drag preview, heatmap contrast  
- Post-release patch (4 approved observations)  

---

## Active roadmap

### Phase 3 — Effortless Daily Loop 🔄 NEXT

**Thesis:** Stop adding modules. Make the existing OS feel like one continuous day.

**Success metrics:**

| Metric | Target |
|--------|--------|
| Open → first meaningful action | < 5 seconds |
| Module switches per active day | −50% |
| Keyboard capture flow | < 2 seconds, no modal |
| Focus start from scheduled task | 1 action |
| Reflection completion rate | +25% |
| "Where do I go?" confusion | Near zero |

**Phase 3 is NOT:** visual redesign, Goals/AI Coach builds, new sidebar items, more timeline variants, planning-model documentation.

#### Phase 3.1 — Gravitational Center (Weeks 1–3)

- Merge Dashboard intelligence into Workplace as default landing (`/` → Today execution view)  
- Dashboard becomes optional Overview or collapsible Today header  
- Next action executes in place — no full-page navigation  
- Fix routing: active focus → Workplace timer; scheduled items → scroll/highlight on Today  
- Remove or wire Agenda card (no dead buttons)  

**User feeling:** "I open FlowOS and I'm already in my day."

#### Phase 3.2 — Command Layer (Weeks 3–5)

- Global command palette (`Cmd/Ctrl+K`): search tasks, habits, notes, reflections; jump; trigger actions  
- Inline quick capture (default): type → Enter creates task; prefixes for note/habit/reflection  
- Modal capture becomes secondary  
- Shortcut cheat sheet; Mac Cmd equivalents  
- Shortcut hints on hover for power actions  

**User feeling:** "I never hunt for anything."

#### Phase 3.3 — Focus Without Friction (Weeks 5–7)

- `/focus` reframed as History & Analytics only  
- One-click / one-shortcut "Start focus on current task"  
- Timer controls always visible during active session  
- Timeline "Start now" → starts timer immediately  
- Optional: pin right sidebar during active focus  

**User feeling:** "Focus is a mode, not a page."

#### Phase 3.4 — Planning Simplification (Weeks 7–9)

- One default scheduling surface on Today view  
- Demote standalone Schedule to "open timeline fullscreen" action  
- Smart defaults: capture → Inbox; add to today → sets date; Later is one action  
- "Recover today" actions: reschedule missed, push block +30min, move unscheduled to tomorrow  
- Auto-enable manual sort when user drags to reorder  

**User feeling:** "I plan by dragging time, not by learning the system."

#### Phase 3.5 — Day Arc (Weeks 9–11)

- Day open: optional 15-second strip on first visit — dismissible  
- Day close: nudge to reflection sidebar; one-click "move incomplete to tomorrow"  
- Unify reflection on auto-save everywhere  
- Weekly reflection stays secondary  

**User feeling:** "The app knows what time of day it is."

#### Phase 3.6 — Keyboard OS (Weeks 11–12)

- `j/k` navigate today list; `Space` complete; `Enter` open; `e` edit inline  
- Module jumps via command palette  
- `?` shortcut overlay  
- Shortcuts work from Today view without focus trapped in inputs  

**User feeling:** "FlowOS is fast the way power users expect."

#### Recommended MVP bundle (if Phase 3 must start small)

Ship first to address friction #1, #2, #7, #8, #16:

1. Today as home — Workplace + Dashboard next-action inline, fixed deep links  
2. Inline capture bar on Today  
3. Always-visible focus controls when session active  
4. Remove fake Agenda or replace with real "Plan tomorrow"  
5. Command palette v1 — search + jump only  

---

### Phase 4 — Signature Moments (planned)

**From original audit roadmap — visual polish, not workflow:**

- Focus hero treatment  
- Timeline now-line signal  
- Heatmap legend and contrast pass  
- KPI open-stats styling  
- Empty state craft  
- SegmentedControl primitive extraction (if copy-paste pain threshold reached)  
- Goals / AI Coach / Weekly Review (product features — separate scoping required)  

**Effort:** ~2–3 days (visual only)

---

### Phase 5 — QA & Audit Gates (planned)

- Full WCAG contrast audit  
- Keyboard navigation completeness  
- Motion audit  
- Screenshot regression diff  
- Select primitive consolidation evaluation  

**Effort:** ~1–2 days

---

## Original audit roadmap vs actual

| Original audit phase | Actual outcome |
|---------------------|----------------|
| Phase 0: Stop the bleeding | ✅ As planned |
| Phase 1: One primitive each (SegmentedControl, Badge, Select, TimeField) | ⚠️ Restructured — only interaction consistency shipped; Badge/Select/TimeField moved or removed |
| Phase 2: Accent budget sweep | ✅ Expanded to full chip consolidation + central lib refactor |
| Phase 3: Typography & density | ➡️ Merged into Phase 3 UX roadmap (workflow-first) |
| Phase 4: Signature moments | ➡️ Renumbered to Phase 4 |
| Phase 5: QA gates | ➡️ Renumbered to Phase 5 |

---

## Explicitly out of roadmap (for now)

- Light theme  
- Layout redesign of Workplace grid  
- Sidebar structure change (until Phase 3.1 gravitational center)  
- dnd-kit migration (engineering track, not design phase)  
- Glyph checkbox replacement  
- Reflection page structure redesign  
- Auth flow changes  

---

## Related documents

- [ux-friction-review.md](./ux-friction-review.md) — Phase 3 detailed friction analysis  
- [00-design-audit.md](./00-design-audit.md) — original 5-phase visual roadmap  
- [03-phase2-strategic-review.md](./03-phase2-strategic-review.md) — revised Phases 2–5  
- [project-state-july-2026.md](./project-state-july-2026.md) — current snapshot  
- [CHANGELOG.md](./CHANGELOG.md) — evolution history  
