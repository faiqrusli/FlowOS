# Start Here — Engineer

~15 minute path to understand the codebase. **Implementation hold:** prefer small fixes; do not open large runbooks unless the founder lifts the pause.

---

## 1. Current state (5 min)

| Read | Why |
|------|-----|
| [FEATURE_INVENTORY.md](../foundation/FEATURE_INVENTORY.md) | What's shipped, partial, and deferred |
| [TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) | Stack, data model, auth, known debt |
| [DESIGN_SYSTEM_V3.md](../foundation/DESIGN_SYSTEM_V3.md) | Visual philosophy + Surface 0–10 |
| [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](../foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) | Active palette contract |
| [execution/README.md](../execution/README.md) | Hold / review mode + runbook status |

**Code truth for paint:** `src/app/globals.css`

**Do not use alone:** [archive/design/july-3/project-state-july-2026.md](../archive/design/july-3/project-state-july-2026.md) — frozen at July 3. Use feature inventory + execution index instead.

---

## 2. Local setup (5 min)

```powershell
cd flowos
npm install
# Copy Supabase vars into .env.local (see TECHNICAL_ARCHITECTURE.md)
npm run dev
```

| Read | Why |
|------|-----|
| [TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) | Env vars, folder layout, Supabase |
| [supabase/APPLIED_STATE.md](../../supabase/APPLIED_STATE.md) | Migration state on production project |

---

## 3. If you're shipping work (5 min)

While the hold is on, keep scope tiny (docs, bugs, demo polish).

| Read | Why |
|------|-----|
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | Hold rules + branch expectations |
| [execution-masterplan.md](../strategy/execution-masterplan.md) | Scope rules — what's in/out |
| [GIT_WORKFLOW.md](../foundation/governance/GIT_WORKFLOW.md) | Branch per change; merge to `main` needs founder yes |
| [flowos-live-demo.md](../execution/runbooks/flowos-live-demo.md) | Guest demo workstream (allowed under hold) |

**Deploy cadence:** `npm run build` + `npm run lint` → commit → push branch → ask founder before `main`

---

## 4. Code map

| Area | Location |
|------|----------|
| App routes | `src/app/(main)/` |
| Today / Workplace | `src/components/workplace/`, `src/components/today/` |
| Sidebar nav | `src/config/sidebar-navigation.tsx` |
| Supabase client | `src/lib/supabase/` |
| Design tokens | `src/app/globals.css` |
| Drag-and-drop | `src/lib/dnd/` |

---

## 5. Rules and gates

| Read | Why |
|------|-----|
| [governance/GIT_WORKFLOW.md](../foundation/governance/GIT_WORKFLOW.md) | Branch per session; merge to `main` needs founder yes |
| [governance/ENGINEERING.md](../foundation/governance/ENGINEERING.md) | How to evaluate engineering choices |
| [governance/CODE_STANDARDS.md](../foundation/governance/CODE_STANDARDS.md) | Folder layout, TS/React, styling, pre-merge checklist |
| [governance/QUALITY_GATES.md](../foundation/governance/QUALITY_GATES.md) | What must pass before ship |
| [FEATURE_INVENTORY.md](../foundation/FEATURE_INVENTORY.md) | Target nav, module hierarchy, shipped vs deferred |

---

## Design history (reference only)

Visual design phases 0–2 and alternate themes are archived:

- [archive/design/july-3/README.md](../archive/design/july-3/README.md)
- [archive/design/themes/](../archive/design/themes/)
- Live friction: [friction-log.md](../execution/logs/friction-log.md)
