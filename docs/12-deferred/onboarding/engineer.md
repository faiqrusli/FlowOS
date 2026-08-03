# Start Here — Engineer

~15 minute path to understand the codebase. **Implementation hold:** prefer small fixes; do not open large runbooks unless the founder lifts the pause.

---

## 1. Current state (5 min)

| Read | Why |
|------|-----|
| [FEATURE_INVENTORY.md](../04-features/FEATURE_INVENTORY.md) | What's shipped, partial, and deferred |
| [Feature Catalog](../04-features/feature-catalog.md) | Current feature-domain status and documentation coverage |
| [TECHNICAL_ARCHITECTURE.md](../06-engineering/TECHNICAL_ARCHITECTURE.md) | Stack, data model, auth, known debt |
| [DESIGN_SYSTEM_V3.md](../05-design/DESIGN_SYSTEM_V3.md) | Visual philosophy + Surface 0–10 |
| [DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md](../05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) | Active palette contract |
| [Design Implementation Map](../05-design/design-implementation-map.md) | Which design source is current, transitional, or historical |
| [MVP Implementation Masterplan](../07-strategy-and-delivery/mvp-implementation-masterplan.md) | Current pre-dogfood implementation phases and gates |
| [Engineering Lifecycle and SDLC Guide](../06-engineering/engineering-lifecycle-and-sdlc.md) | End-to-end procedure, ownership, testing, review, deployment, and release |
| [current-phase/logs/README.md](../current-phase/logs/README.md) | Hold / review mode + runbook status |

**Code truth for paint:** `src/app/globals.css`

**Do not use alone:** [11-archive/design/july-3/project-state-july-2026.md](../11-archive/design/july-3/project-state-july-2026.md) — frozen at July 3. Use feature inventory + execution index instead.

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
| [TECHNICAL_ARCHITECTURE.md](../06-engineering/TECHNICAL_ARCHITECTURE.md) | Env vars, folder layout, Supabase |
| [supabase/APPLIED_STATE.md](../../supabase/APPLIED_STATE.md) | Migration state on production project |

---

## 3. If you're shipping work (5 min)

While the hold is on, keep scope tiny (docs, bugs, demo polish).

| Read | Why |
|------|-----|
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | Hold rules + branch expectations |
| [Roadmap](../07-strategy-and-delivery/roadmap.md) | Current outcome sequence and investment gates |
| [execution-masterplan.md](../11-archive/strategy/execution-masterplan.md) | Archived detailed milestone context |
| [GIT_WORKFLOW.md](../00-constitution/governance/GIT_WORKFLOW.md) | Branch per change; merge to `main` needs founder yes |
| [flowos-live-demo.md](../11-archive/execution/runbooks/flowos-live-demo.md) | Historical guest demo workstream |

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
| [governance/GIT_WORKFLOW.md](../00-constitution/governance/GIT_WORKFLOW.md) | Branch per session; merge to `main` needs founder yes |
| [governance/ENGINEERING.md](../00-constitution/governance/ENGINEERING.md) | How to evaluate engineering choices |
| [governance/CODE_STANDARDS.md](../00-constitution/governance/CODE_STANDARDS.md) | Folder layout, TS/React, styling, pre-merge checklist |
| [governance/QUALITY_GATES.md](../00-constitution/governance/QUALITY_GATES.md) | What must pass before ship |
| [FEATURE_INVENTORY.md](../04-features/FEATURE_INVENTORY.md) | Target nav, module hierarchy, shipped vs deferred |

---

## Design history (reference only)

Visual design phases 0–2 and alternate themes are archived:

- [11-archive/design/july-3/README.md](../11-archive/design/july-3/README.md)
- [11-archive/design/themes/](../11-archive/design/themes/)
- Historical friction: [friction-log.md](../11-archive/current-phase/logs/friction-log.md)
