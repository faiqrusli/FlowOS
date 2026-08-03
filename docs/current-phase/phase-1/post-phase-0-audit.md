# Post-Phase-0 Documentation & Workflow Audit

**Status:** Active — first Phase 1 document  
**Author:** Documentation Manager (6-hat solo workflow)  
**Date:** 2026-08-04  
**Phase:** Phase 1 — Establish Implementation Truth  
**Location:** First document of `docs/current-phase/phase-1/`  
**Purpose:** Post-Phase-0 continuous-improvement audit. Findings below are scheduled into Phase 1; they do NOT gate or block Phase 1.

---

## Scope & Method

Audited the full repository: `/docs`, AI skills (`.ai/`, `AGENTS.md`, `.cursor/`, `.idea/`, `.aiassistant/`, `.github/agents/`), workflows, engineering docs, specifications, and supporting docs. Method: full file inventory, parallel targeted audits (AI-skills/workflows consistency; doc hierarchy/link integrity; code-vs-doc truth), then spot verification of every Critical Issue in code and filesystem.

**Overall verdict:** The Phase 0 re-organization landed correctly. The hierarchy, archives, and Phase 1 scaffolding are sound. Remaining issues are mostly (a) stale relative links from the big folder moves, (b) tool-config files still narrating Phase 0/M2, and (c) engineering docs drifting from the code base. None of these block Phase 1 work.

---

## 1. Overall Documentation Health

**Grade: B+**

| Dimension | Assessment |
|---|---|
| Vision alignment | Strong. `00-constitution/Vision.md` is canonical and immutable; archived vision copies correctly labeled historical. No active conflict. |
| Documentation hierarchy | Correct. `00-constitution/` (rules) → `01–07` (domains) → `08–10` (records/team) → `11-archive`/`12-deferred` (storage) is coherent and matches `document-map.md`. |
| Phase-1 status propagation | Excellent. `AGENTS.md`, `.ai/context.md`, `.ai/sprint-context.md`, `current-sprint.md`, `current-phase/README.md`, `docs/README.md`, `phase-1/` all updated to Phase 1 / Gate 1. |
| Link integrity | Poor-to-fair. ~30 broken links in ACTIVE docs, concentrated in `governance/` (13), `current-phase/logs/README.md` (7), and the Roadmap↔Masterplan pair. |
| Code-vs-doc truth | Drifting. `TECHNICAL_ARCHITECTURE.md` has 3 stale claims; design-system values and "active reference" statuses out of date. |
| Maintainability | Good. Archive discipline held; `12-deferred/` cleanly separated. Duplication is moderate and mostly intentional. |

---

## 2. Critical Issues

Issues that mislead AI tools or a reader following authority links. Fix in Phase 1, early.

### 2.1 Tool-config files still narrate Phase 0 / "Phase 1 not authorized" — MISLEADS EVERY AI TOOL

- `.cursor/rules/flowos-core.mdc:28–32,42,51,54–55` — header still says "Current Phase: Phase 0", "Gate 0 Target", "Gate 0 is held pending cleanup confirmation… **Phase 1 is not authorized**". Directly contradicts `AGENTS.md`, `.ai/context.md`, and decision `D-003`. **Highest priority — this actively steers Cursor agents wrong.**
- `.cursor/rules/flowos-core.mdc:10` — `.ai/context.md` described as containing "Phase 0 status".
- `.idea/ai-rules.md:10–11,29–32,42,70–72,119,198` — Phase 0 header, "Progress: 42% complete", "decision: 2026-08-06", Phase-0 assignments.
- `.aiassistant/rules/Ai.md:17,22–23,47–51,60,129` — same Phase-0 narrative, "Progress: 42% complete", "Decision: 2026-08-06".
- `AGENTS.md:18` — says `.ai/context.md` holds "Current Phase 0 status and objectives" (now Phase 1).

### 2.2 Roadmap ↔ MVP Masterplan cross-links are broken both ways

- `docs/07-strategy-and-delivery/roadmap.md:101,197` link `./mvp-implementation-masterplan.md` → **file does not exist** there; the masterplan lives at `docs/current-phase/mvp-implementation-masterplan.md`.
- `docs/current-phase/mvp-implementation-masterplan.md:7,43` link `./roadmap.md` → **file does not exist** in `current-phase/`; roadmap lives at `docs/07-strategy-and-delivery/roadmap.md`.
- Effect: the two governing implementation documents cannot navigate to each other. A reader from either hits a dead end.

### 2.3 Broken "decision-log" archive path — 7 active files point to a nonexistent folder

`docs/11-archive/current-phase/logs/` does not exist; historical logs live at `docs/11-archive/execution/logs/`. Broken references in active docs:

- `docs/current-phase/logs/README.md:3,9–14` (six links: inbox, friction-log, july-log, decision-log, unmerged-branch-queue)
- `docs/08-decisions/decision-records.md:127`
- `docs/08-decisions/decision-register.md:17`
- `docs/00-constitution/governance/README.md:42`
- `docs/04-features/FEATURE_INVENTORY.md:113`
- `docs/00-constitution/governance/GATES.md:78` (friction-log)
- `docs/00-constitution/governance/GIT_WORKFLOW.md:136` (inbox)

### 2.4 Governance folder has 13 stale `../` links (systematic path break)

`docs/00-constitution/governance/*` was written before TECHNICAL_ARCHITECTURE / FEATURE_INVENTORY / DESIGN_SYSTEM moved down one level. Files now link `../TECHNICAL_ARCHITECTURE.md` (→ `00-constitution/`, wrong), should be `../../06-engineering/TECHNICAL_ARCHITECTURE.md`, `../../04-features/FEATURE_INVENTORY.md`, `../../05-design/DESIGN_SYSTEM_V3.md`, `../../05-design/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md`. Locations: `CODE_STANDARDS.md:7,34,89,115,184`; `ENGINEERING.md:9,26`; `GATES.md:238,274`.

### 2.5 `mvp-implementation-masterplan.md:106` links `./documentation-refinement-plan.md`

File is archived at `docs/11-archive/strategy/documentation-refinement-plan.md`.

### 2.6 `current-sprint.md` Phase-0 log section links archived files in place

`current-sprint.md:844` (`./implementation-truth-backlog.md`), `:848` (`./gate-0-readiness-report.md`), `:959` (`./roadmap.md`) — files moved to `11-archive/phases/phase-0/` and `07-strategy-and-delivery/`.

### 2.7 `.ai/context.md` uses root-relative paths that won't resolve as markdown links

`.ai/context.md:34–36,40` write `docs/current-phase/current-sprint.md` etc. as `[text](docs/...)` links. As relative links from `.ai/`, GitHub resolves them to `.ai/docs/...` → broken. Should be `../docs/...` or plain text.

---

## 3. Consistency Issues

### 3.1 The "6-role" vs "11-role" org conflict (in active role docs)

The 6 active hats are canonical (`.ai/context.md:54–60`, `AGENTS.md:42–59`). But `docs/10-team/6-role-hats/*.md` still carry old-org content:

- `6-role-hats/implementation-engineer.md:196,214,259,271,276,380,394,484,490–491,513,521` — "Role: Senior Full Stack Engineer", "Hand Off To: QA Lead", "escalate to Principal Product Architect / Design System Architect".
- `6-role-hats/engineering-architect.md:54,148,183,207,234–235,309,323,349,354` — "with QA Lead", "Hand Off To: Senior Full Stack Engineer".
- `6-role-hats/release-manager.md:23,147` — receives from "QA Lead".
- `6-role-hats/founder.md:224,240,284–289,388–394,490–568,664` — assigns to Planning Lead, Principal Product Architect, UX Architect, Design System Architect, Senior Full Stack Engineer, QA Lead.
- `6-role-hats/design-architect.md:182–184`, `product-architect.md:22–25,407,409` — link to `roles/*.md`, `authority-matrix.md`, `streamlined-organization.md` that are NOT in `10-team/` (they live only in `12-deferred/team/`).
- `6-role-hats/README.md:1` — title still "Active 6-Role Configuration"; role files carry `Configuration: Active 6-Role` headers; `README.md:60–92` describes a "5 approval gates" flow that contradicts the "no approval delays" canon.

### 3.2 "3-mode workflow" narrative conflicts with the 6-hat canon

- `docs/start-here/how-to-develop-flowos.md:5,14,22,231–251` and `docs/start-here/founder.md:13,148–154` and `docs/start-here/README.md:28,50` and `docs/10-team/README.md:99` and `docs/README.md:24` present a "3-mode workflow (Plan/Build/Ship)" that **replaced/archived** the 6-role structure.
- `.ai/context.md:74,243–256` and `AGENTS.md:46–57` present the 3 modes as an **organization of the 6 hats** — canonical framing.
- Resolution: keep the 6-hat canon; reword the start-here docs so "3 modes" = grouping of hats, not a replacement of the team structure.

### 3.3 Duplicate checklist content (drives maintenance cost, not errors)

- Security 6-point checklist exists in **8 places**: `.ai/checklists/security.md` (canonical), `.ai/checklists/quality.md:148–161`, `.ai/context.md:422–429`, `.ai/README.md:196–211`, `.aiassistant/rules/Ai.md:68–77`, `.idea/ai-rules.md:229–239`, `docs/start-here/how-to-develop-flowos.md:129–140`, `.cursor/rules/code-standards.mdc:41–43`.
- Pre-merge verification duplicated across `.ai/workflows/merge-prep.md`, `.ai/workflows/code-review.md:211–240`, `.ai/checklists/quality.md`, `.ai/testing-guide.md:388–423`, `.ai/README.md:144–168`.
- August-log post-merge update procedure appears in `.ai/workflows/merge-prep.md:386–417`, `.ai/workflows/documentation.md:267–344`, `.cursor/rules/developer-log.mdc`, `.cursor/rules/git-workflow.mdc`.
- Recommendation: make `.ai/checklists/` the single source; tool configs should link, not restate.

### 3.4 Stale "Last Updated" dates

Role docs (`10-team/6-role-hats/*`, README) all dated 2026-08-02; `solo-founder-workflow.md`, `how-to-develop-flowos.md`, `founder.md`, `start-here/README.md`, `10-team/README.md`, masterplan dated 2026-08-03 — all pre-Gate-0-pass. Refresh when edited.

### 3.5 `docs/README.md` minor issues

- Roadmap appears twice in the reading-sequence table (`docs/README.md:121,130` — duplicate row).
- `12-deferred/` missing from the folder-map table (only in "Removed folders" note).

### 3.6 CI gap

`.github/workflows/ci.yml` runs only `npm run lint` + `npm run build`; `npm test` is NOT in CI, contradicting `.ai/testing-guide.md` pre-merge verification story and `.ai/context.md` "Build + lint + test pass".

### 3.7 `.ai/context.md:…` still says gate-checklist "to be created with the sprint"

`phase-1/gate-checklist.md` now exists. Stale wording; minor.

---

## 4. Workflow Improvements

1. **Add `npm test` to CI.** Tests exist (20 Vitest files) and pass locally; the gap between local pre-merge checks and CI is an inconsistency that erodes the quality story. Small change, high value.
2. **Make `.ai/checklists/` the single source of truth for security/quality/pre-merge checklists.** Tool configs (`.cursor/`, `.idea/`, `.aiassistant/`, `AGENTS.md`) should link to `.ai/checklists/*.md` rather than restate them, so a checklist update happens in one place.
3. **Add a link-integrity check to the quality gate.** A lightweight script (e.g., a small `scripts/check-docs-links.mjs` or a `remark` link check) run before merge would have caught all ~30 broken links. Schedule as a Phase 1 tooling item.
4. **Settle one canonical archive path for logs.** `docs/11-archive/execution/logs/` is the real location; stop referencing `11-archive/current-phase/logs/` anywhere.
5. **Establish the phase-transition checklist as a repeatable procedure.** The Gate-0 close-out (decision record → archive → status propagation across `AGENTS.md`, `.ai/*`, tool configs, `start-here`, logs) was done manually. Document it as a runbook so Gate 1 and later gates are cheaper and consistent. (Good candidate: `docs/start-here/phase-transition-runbook.md`.)

---

## 5. Documents to Update

| Priority | Document | Action |
|---|---|---|
| 🔴 P0 | `.cursor/rules/flowos-core.mdc` | Rewrite status header to Phase 1 / Gate 1 / D-003; remove "Phase 1 is not authorized" |
| 🔴 P0 | `.idea/ai-rules.md`, `.aiassistant/rules/Ai.md` | Same Phase-1 status propagation; fix "decision: 2026-08-06" / "42% complete" |
| 🟠 P1 | `AGENTS.md:18` | Fix `.ai/context.md` description (Phase 1, not Phase 0) |
| 🟠 P1 | `docs/07-strategy-and-delivery/roadmap.md` (101,197) | Point masterplan links to `../current-phase/mvp-implementation-masterplan.md` |
| 🟠 P1 | `docs/current-phase/mvp-implementation-masterplan.md` (7,43,106) | Point roadmap links to `../07-strategy-and-delivery/roadmap.md`; refinement-plan link to archive |
| 🟠 P1 | `docs/current-phase/logs/README.md` | Fix 6 archive-log links → `../../11-archive/execution/logs/*` |
| 🟠 P1 | `docs/08-decisions/{decision-records.md,decision-register.md}` | Fix decision-log links → `11-archive/execution/logs/` |
| 🟠 P1 | `docs/00-constitution/governance/` (5 files) | Fix 13 stale `../` links (TECH_ARCH, FEATURE_INVENTORY, DESIGN_SYSTEM, log paths) |
| 🟡 P2 | `docs/06-engineering/TECHNICAL_ARCHITECTURE.md` | Update Next.js pin (16.2.7 → 16.2.11); add real `.env.example`; delete resolved debt items (zero tests → 20; no error/loading boundaries → both exist); fix `timeline-planner` path |
| 🟡 P2 | `docs/04-features/FEATURE_INVENTORY.md` | Remove "Agenda card — dead code" (component gone); fix decision-log link; note `/dashboard` ghost route |
| 🟡 P2 | `docs/05-design/design-implementation-map.md`, `client-architecture.md`, `DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md` | Stop citing V3_WORKSPACE/V3_INTERACTION as active (they're archived); fix related links |
| 🟡 P2 | `docs/current-phase/current-sprint.md` (844,848,959) | Fix archived-file links in Phase-0 log section |
| 🟡 P2 | `docs/10-team/6-role-hats/*` (7 files) | Strip 11-role names/gates; `Active 6-Role` → `6 Hats`; fix missing `authority-matrix`/`streamlined-organization`/`roles/*` references; align to "no approval delays" |
| 🟡 P2 | `docs/start-here/{how-to-develop-flowos.md,founder.md,README.md}`, `docs/10-team/README.md`, `docs/README.md:24` | Reword 3-mode narrative to "3 modes = 6 hats organized"; fix duplicate roadmap row; add `12-deferred/` to map |
| 🟢 P3 | `.ai/context.md` (34–36,40; gate-checklist wording) | Fix root-relative links + stale "to be created" wording |
| 🟢 P3 | `docs/04-features/feature-dossier-standard.md` (692,696) | Fix `_templates/` and `start-here/implementing-a-feature.md` links → `12-deferred/onboarding/` |
| 🟢 P3 | `docs/start-here/README.md:18` | Fix `engineer.md` link → `../12-deferred/onboarding/engineer.md` |
| 🟢 P3 | `docs/00-constitution/documentation-architecture.md:163` | Fix lifecycle-guide link → `12-deferred/onboarding/` |

---

## 6. Documents to Merge / Split / Move / Archive / Remove / Defer

| Recommendation | Item | Rationale |
|---|---|---|
| **Create** | `docs/start-here/phase-transition-runbook.md` | Captures the Gate-0 close-out procedure for reuse at every gate |
| **Create** | `.env.example` | Referenced as required by `TECHNICAL_ARCHITECTURE.md`; missing from repo |
| **Merge (single source)** | Security/quality/pre-merge checklists → `.ai/checklists/` | Remove duplicated copies from tool configs; link instead |
| **Move** | `docs/10-team/authority-matrix.md` + `streamlined-organization.md` | Decide either promote from `12-deferred/team/` to `10-team/` (if still authoritative) or fix all references to `12-deferred/team/`. Recommended: promote `authority-matrix.md` (still referenced as live by role docs) or remove the references if obsolete. **Founder decision required.** |
| **Archive** | `src/lib/task-drag-pipeline-debug.md` + `task-drag-pipeline-debug.ts` | Debug artifacts sitting in the source tree; move to `11-archive/` or delete |
| **Archive** | `11-archive/runbooks/*` (6 files) | Duplicates of `11-archive/execution/runbooks/*`; consolidate |
| **Remove** | Root repo cruft: `eslint-report.err`, `eslint-report.json`, `lint.txt`, `lint-output.txt`, `hs_err_pid*.log`, `replay_pid*.log`, `tsconfig.tsbuildinfo` | Build/lint/JVM crash artifacts committed at repo root |
| **Defer** | `12-deferred/onboarding/*` (complete-feature-dossier-lifecycle, implementing-a-feature, etc.) | Templates they reference (`04-features/_templates/`) were removed; keep deferred, fix links |
| **Keep (intentional)** | Archived vision/design/strategy copies in `11-archive/` | Correctly labeled historical; not duplicates of active docs |
| **Split?** | `docs/08-decisions/decision-records.md` vs `decision-register.md` | Both exist and are correctly documented (standard vs index). **No change needed.** |

---

## 7. Improvements to Schedule for Phase 1

Ordered by effort/value:

1. **Fix tool-config Phase-1 status** (`.cursor/flowos-core.mdc`, `.idea/ai-rules.md`, `.aiassistant/Ai.md`, `AGENTS.md`) — hours, stops active misdirection. (P0)
2. **Fix broken links in active docs** (~30 links across governance, logs README, roadmap↔masterplan, decision files, current-sprint, masterplan) — half-day. (P0/P1)
3. **Add `npm test` to CI** — small, closes quality-story gap. (P1)
4. **Update `TECHNICAL_ARCHITECTURE.md` + `FEATURE_INVENTORY.md` to code truth** — this IS Gate-1 evidence work for the Today/Tasks/etc. domains; fold into the implementation-truth backlog rather than separate. (P1)
5. **Reconcile design system** (V3 / Tokyo Night Warm hex drift vs `globals.css`; light-theme legacy tokens; archived V3_WORKSPACE/INTERACTION status) — Gate-1 reconciliation item. (P1)
6. **Purge role docs of 11-role content + 3-mode-replaces-6-role narrative** — aligns start-here + role docs with the 6-hat canon. (P2)
7. **Add docs link-check to quality gate / CI** — tooling improvement. (P2)
8. **Create phase-transition runbook** — reusable at Gate 1 close. (P2)
9. **Repo cruft removal + debug-artifact archive + `11-archive/runbooks` consolidation** — hygiene. (P2)

Items 4 and 5 should be executed **inside** the normal Phase-1 truth work (they produce Gate-1 evidence), not as separate doc work.

---

## 8. Founder Decisions Required

1. **`authority-matrix.md` / `streamlined-organization.md` disposition** — promote from `12-deferred/team/` to `10-team/` (they're still referenced as live by role docs), or declare obsolete and fix/remove all references? Recommendation: **promote `authority-matrix.md`** to `10-team/` (small, still useful); **leave `streamlined-organization.md` deferred** and fix references.
2. **Legacy light-theme tokens in `globals.css`** (`:root` block, L148–325, commented "retire separately") — retire now (delete) or keep for a planned light theme? Recommendation: **retire in Phase 1** since product is dark-only; document in the design reconciliation.
3. **`11-archive/runbooks/*` duplicates** — consolidate into `11-archive/execution/runbooks/` (delete dupes) or keep both? Recommendation: **consolidate**, keeping the execution copies.
4. **Repo-root cruft** (`eslint-report.*`, `lint*.txt`, `hs_err_*`, `replay_*`, `tsconfig.tsbuildinfo`) — delete, or add to `.gitignore` and keep local? Recommendation: **add `*.tsbuildinfo`, lint/report artifacts to `.gitignore`, delete from repo**, and keep JVM crash logs out.
5. **CI test gate** — add `npm test` to `.github/workflows/ci.yml` now, or defer? Recommendation: **add it now** (20 tests already pass).
6. **Zod input-validation claim** — `.ai/context.md`/`AGENTS.md` claim "Zod schemas" but Zod isn't installed. Either **add Zod** (recommended, standard) or **rewrite the security claim to match current validation**. Needs a decision record.

---

## 9. Final Recommendations

1. **Phase 1 starts now.** None of the findings block Gate-1 truth work. The audit is continuous improvement, per its purpose.
2. **Do the P0/P1 link + status fixes first** (Section 7, items 1–2) — they are cheap, mechanical, and remove active misdirection of AI tools and readers. This is the "docs hygiene sprint."
3. **Fold the code-truth updates into the Gate-1 work itself** — updating `TECHNICAL_ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, and the design reconciliation ARE the Gate-1 evidence for their domains. Do not treat them as separate documentation chores.
4. **Confirm the 6 Founder decisions (Section 8)** at the next founder check-in; each is small and unblocks a cleanup cluster. D-004 (decision record) should capture the aggregate decisions.
5. **Adopt the phase-transition runbook** so Gate 1 close-out is procedural, not improvised.
6. **Add the docs link-check + `npm test` to CI** before the next big doc re-organization; this prevents the current class of regression.

---

## Related

- Phase 1: [README](./README.md) · [gate-checklist](./gate-checklist.md)
- Masterplan Phase 1 scope: [mvp-implementation-masterplan.md](../mvp-implementation-masterplan.md)
- Prior audit (archived): [documentation-audit-2026-08-03.md](../../11-archive/phases/phase-0/documentation-audit-2026-08-03.md)
- Starting question list: [implementation-truth-backlog](../../11-archive/phases/phase-0/implementation-truth-backlog.md)