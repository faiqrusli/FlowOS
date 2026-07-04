# Start Here — Engineer

~15 minute path to understand the codebase and current execution work.

---

## 1. Current state (5 min)

| Read | Why |
|------|-----|
| [FEATURE_INVENTORY.md](../foundation/FEATURE_INVENTORY.md) | What's shipped, partial, and deferred |
| [TECHNICAL_ARCHITECTURE.md](../foundation/TECHNICAL_ARCHITECTURE.md) | Stack, data model, auth, known debt |
| [execution/README.md](../execution/README.md) | Current milestone and runbooks |

**Do not use alone:** [archive/design/july-3/project-state-july-2026.md](../archive/design/july-3/project-state-july-2026.md) — frozen at July 3 (Phase 2). Use feature inventory + execution index instead.

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

## 3. If you're shipping M2/M3 work (5 min)

| Read | Why |
|------|-----|
| [execution-masterplan.md](../strategy/execution-masterplan.md) | Scope rules — what's in/out of current milestone |
| [m2-founder-daily-driver.md](../execution/runbooks/m2-founder-daily-driver.md) | Session dependencies and verification steps |
| [m1-ship-gate.md](../execution/runbooks/m1-ship-gate.md) | Deploy cadence, CI, RLS expectations |

**Deploy cadence:** `npm run build` + `npm run lint` → commit → push → verify https://flowos-sage.vercel.app

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
| [governance/GIT_WORKFLOW.md](../foundation/governance/GIT_WORKFLOW.md) | Branch per session; merge to `main` needs your yes |
| [governance/ENGINEERING.md](../foundation/governance/ENGINEERING.md) | How to evaluate engineering choices |
| [governance/CODE_STANDARDS.md](../foundation/governance/CODE_STANDARDS.md) | Folder layout, TS/React, styling, pre-merge checklist |
| [governance/QUALITY_GATES.md](../foundation/governance/QUALITY_GATES.md) | What must pass before ship |
| [FEATURE_INVENTORY.md](../foundation/FEATURE_INVENTORY.md) | Target nav, module hierarchy, shipped vs deferred |

---

## Design history (reference only)

Visual design phases 0–2 are complete. Read for context, not current plan:

- [archive/design/july-3/README.md](../archive/design/july-3/README.md)
- [ux-friction-review.md](../archive/design/july-3/ux-friction-review.md) — July 3 simulated audit; live evidence is [friction-log.md](../execution/logs/friction-log.md)
