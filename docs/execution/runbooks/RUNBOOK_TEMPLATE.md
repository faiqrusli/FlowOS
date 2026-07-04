# {M#} — {Runbook Title}

**Scope:** {M#} only — {one-line milestone name}.  
**Authority:** Exit criteria in [execution-masterplan.md](../../strategy/execution-masterplan.md) Step 2 ({M#}). This runbook does **not** add, remove, defer, or weaken any exit criterion from the masterplan.  
**Repo root:** repository root (Next.js app).  
**Production baseline:** https://flowos-sage.vercel.app  
**Docs path:** `docs/` (tracked in VCS)  
**Idea capture:** [inbox.md](../logs/inbox.md) → sessions below when scoped → [july-log.md](../logs/july-log.md) after merge to `main`.

**How to author:** Copy this file to `m{N}-{short-name}.md`. Replace all `{…}` placeholders. Delete optional sections you do not need.

---

## Acceptance test

**One paragraph:** What must be true when this runbook is fully complete? A stranger (or agent) should be able to execute sessions in order and verify the outcome.

_{Example: Fresh engineer follows sessions 1–N → production shows X → founder exit criteria Y pass.}_

---

## Resume protocol

Use when a session is blocked (env failure, ambiguous product decision, production regression).

| Step | Action |
|------|--------|
| 1 | **Stop** at the session stop/fail condition — do not skip to a dependent session. |
| 2 | **Record blocker** in [decision-log.md](../logs/decision-log.md): date, session #, WP id, symptom, what was tried, next action. |
| 3 | **Git:** commit WIP on the **session branch** (`WIP: Session N blocked — {reason}`) or `git stash`. Do **not** merge to `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md). |
| 4 | **Resume** the same session number when unblocked. |
| 5 | **Respect dependencies** — see session dependency table below. |
| 6 | **Parallel exceptions:** list founder-only sessions that may run alongside engineering without unblocking blocked work. |

---

## Session dependency table

Fill before writing sessions. Prevents starting Session N before prerequisites are on `main`.

| Session | Depends on (must be on `main`) | Blocks |
|---------|----------------------------------|--------|
| 1 | {M#-1 complete / M1 ship gate} | 2, 3, … |
| 2 | 1 | … |
| _…_ | | |

---

## Session plan

**Budget:** {N} sessions × {hours} each.  
**Engineering sessions:** {list — Agent-executable}.  
**Founder-only sessions:** {list — no Agent code; ops/logs/recruiting}.

### Git workflow (required)

Full rules: [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

| Step | Rule |
|------|------|
| **Start session** | `git checkout main && git pull` → `git checkout -b {m#}/session-N-short-name` |
| **During session** | Commit on branch; `git push -u origin HEAD` (not `main`) |
| **End session** | `npm run build && npm run lint` → agent reports merge bundle → **ask founder to approve merge to `main`** |
| **After merge** | Push `main` → CI/Vercel → manual production check → [july-log.md](../logs/july-log.md) |

**Merge bundles** (AI reminds when bundle complete; founder decides merge timing):

| Bundle | Sessions | Remind merge when |
|--------|----------|-------------------|
| B1 — {name} | {e.g. 1} | Session {N} verified locally |
| B2 — {name} | {e.g. 2–3} | All sessions in bundle done |
| _…_ | | |

Ad-hoc UI/UX: branch `tweak/short-description` from `main` — same approval rule.

---

## Session {N} — {Short title}

**Type:** `engineering` | `founder-only`  
**Goal:** {One sentence outcome.}  
**Time:** {hours}  
**Prerequisites:** {Prior session on `main` / milestone / decision.}  
**Maps to:** WP-{x.y} + {exit criterion or scope item id}  
**Merge bundle:** B{n}

### Current code reality _(optional — fill for engineering sessions)_

Ground truth before changing code. Prevents re-debating what exists.

| Area | File / route | Behavior today |
|------|--------------|------------------|
| | | |

### Numbered steps

| # | Step |
|---|------|
| 1 | |
| 2 | |
| _last_ | `npm run build && npm run lint` → commit on **session branch** → push branch → **ask founder to approve merge to `main`**. |

### Verification

**Commands**

```powershell
npm run build
npm run lint
git status -sb
```

**Production manual checks** (https://flowos-sage.vercel.app) — skip for founder-only / docs-only sessions.

| Check | Expected |
|-------|----------|
| | |

**Stop/fail if**

- 
- Build or lint fails.

**Rollback:** revert merge on `main` — never force-push `main`. See [GIT_WORKFLOW.md](../../foundation/governance/GIT_WORKFLOW.md).

---

<!-- Copy the "Session {N}" block above for each session. -->

---

## Manual test matrix _(optional — use when one session gates many scenarios)_

Run on **production** after Session {N}. Reference from session verification.

| # | Scenario | Setup | Action | Expected | Pass/Fail |
|---|----------|-------|--------|----------|-----------|
| 1 | | | | | ☐ |

**Gate:** All applicable rows **PASS** before Session {N+1} begins.

---

## Decision points _(optional — founder only, max 3)_

Use only when truly blocked. Record choice in [decision-log.md](../logs/decision-log.md).

| # | Decision | Options | Runbook default |
|---|----------|---------|-----------------|
| 1 | | (A) … (B) … | **(A)** — {rationale} |

---

## Out of scope

Do not execute during {M#} (masterplan closed scope + NOT-allowed):

- 
- New strategy docs (except inbox, friction-log, decision-log, july-log, this runbook)

---

## Top execution risks _(recommended: 3–5)_

| Risk | Impact | Mitigation |
|------|--------|------------|
| 1. Scope creep | Milestone never closes | Closed scope list; revert out-of-scope commits |
| 2. | | |
| 3. | | |

---

## Code baseline / operational gotchas _(optional — fill when authoring; delete if empty)_

Numbered list of non-obvious code truths agents must not ignore. Update when codebase changes.

1. 
2. 

---

## Explicitly deferred (not {M#})

| Item | When / trigger |
|------|----------------|
| | M{#+1} pull — {user evidence} |

---

## {M#} completion checklist

Copy exit criteria from masterplan. Check only when evidence exists.

| # | Criterion | WP | Done |
|---|-----------|-----|------|
| {M#}-1 | | | ☐ |
| {M#}-2 | | | ☐ |

**Scope items (if separate from exit criteria):**

| # | Scope item | WP | Done |
|---|------------|-----|------|
| S1 | | | ☐ |

**Acceptance test:** {Repeat one-line pass condition.} ☐

---

## After runbook complete

1. Complete SRAI review → [review/milestones/m{N}-{name}.md](../../review/milestones/) (create if missing).  
2. Update [GATES.md](../../foundation/governance/GATES.md) status if milestone exited.  
3. Final [july-log.md](../logs/july-log.md) entry with commits and production verification.  
4. Archive or freeze this runbook — do not rewrite history; append decision-log if scope changed mid-flight.

---

*End of runbook. {Next milestone} waits until every exit criterion above is checked.*

---

## Template notes (delete this section in real runbooks)

### Kept from M1/M2 (works)

| Section | Why |
|---------|-----|
| Acceptance test | Defines "done" for the whole runbook |
| Resume protocol | Unblocks without skipping dependencies |
| Session dependency table | **New in template** — was implicit in M2 prose |
| Git workflow + merge bundles | Branch-first; founder approves `main` |
| Per-session: goal, steps, verification, stop/fail, rollback | Agent-executable contract |
| Out of scope + deferred | Stops scope creep |
| Completion checklist | Tied to masterplan exit criteria |
| After runbook complete | **New** — links to SRAI + july-log |

### Optional (include when needed)

| Section | When |
|---------|------|
| Current code reality | Engineering sessions touching existing behavior |
| Manual test matrix | One session gates many UI states (like M2 Session 2) |
| Decision points | ≤3 founder forks; avoid open-ended design in runbook |
| Operational gotchas | Large milestone with known code traps |

### Removed from default template

| Was in M2 | Why removed from default |
|-----------|--------------------------|
| 15 static gotchas | Milestone-specific — use optional "Code baseline" instead |
| Inline deploy "push main every session" | Replaced by GIT_WORKFLOW |

### Session types

| Type | Agent code? | Typical verification |
|------|-------------|----------------------|
| `engineering` | Yes | build + lint + production manual checks |
| `founder-only` | No | Log/template filled (recruiting, friction log) |
| `docs-only` | No | Links updated; no production product change |
