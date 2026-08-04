# Git Workflow

**Status:** Active  
**Audience:** Founder, AI agents, engineers  
**Last updated:** August 4, 2026

**Rule:** `main` is production-truth. All product work happens on **branches** until the founder explicitly approves merge to `main`.

---

## Principles

| Rule | Meaning |
|------|---------|
| **Branch first** | Every runbook session and every UI/UX tweak starts on a **new branch** from latest `main`. |
| **Commit on branch** | Commit as often as needed on the branch. Multiple commits per session is fine. |
| **Push branch** | Push the feature branch to `origin` for backup — **not** the same as merging to `main`. |
| **Test local** | `npm run build` && `npm run lint` && `npm test` on the branch before asking to merge. |
| **Pair the logs** | Every commit updates both today’s developer log and the active monthly narrative log; the monthly entry states whether work is committed, merged, or shipped. |
| **Main = founder approval** | Merge to `main` and push `main` **only** when the founder explicitly agrees. |
| **AI must ask** | Agents never merge, never push `main`, never assume approval. |

---

## Branch naming

| Work type | Pattern | Example |
|-----------|---------|---------|
| Feature or runbook session | `feature/short-description` | `feature/inline-task-capture` |
| Bug fix or UI/UX tweak | `fix/short-description` | `fix/focus-button-visible` |
| Docs-only (no product change) | `docs/short-description` | `docs/july-log-inbox` |
| Milestone / bundle merge prep | stay on session branch until merge | — |

Use lowercase kebab-case. Include the feature, fix, or documentation purpose.

---

## Session workflow

### 1. Start session (new branch)

```powershell
git checkout main
git pull origin main
git checkout -b feature/short-description
```

Confirm clean build on `main` before branching if the prior merge was large.

### 2. Work and commit (on branch)

```powershell
# after changes
npm run build
npm run lint
npm test
# update developer-log/YYYY-MM-DD.md and the active month log
git add -A
git commit -m "feature: describe the outcome"
git push -u origin HEAD
```

Commit messages: `{Milestone} Session {N}: {outcome}` or `tweak: {what changed}`.

### 3. End of session — AI must report

When a runbook session finishes, the agent **must** tell the founder:

1. Branch name and commit(s)  
2. Local build/lint result  
3. Whether this session completes a **merge bundle** (see below)  
4. **Ask:** merge to `main` now, or continue on branch / next session first?

**Do not merge to `main` without a clear yes.**

### 4. Merge to `main` (founder approved only)

```powershell
git checkout main
git pull origin main
git merge feature/short-description --no-ff
npm run build
npm run lint
npm test
git push origin main
```

Then verify https://flowos-sage.vercel.app and confirm the active [August log](../../current-phase/logs/august-log.md) records the merged/shipped state.

**Rollback:** `git revert` the merge commit on `main` — never force-push `main`.

---

## Merge bundles (optional)

A **merge bundle** groups one or more sessions where merging to `main` makes sense together. Bundles are **suggestions** — the Founder decides timing.

| Bundle | Contents | Merge when |
|--------|----------|------------|
| **B1** | One coherent feature or fix | Verification is complete |
| **B2** | Several dependent changes | All dependencies are verified |
| **B3** | Documentation-only batch | Links and affected checks are verified |

**AI reminder rules:**

| Event | Agent must say |
|-------|----------------|
| Session ends | "Session N done on `{branch}`. Merge bundle Bx {complete \| not yet}. Merge to `main`? (needs your approval)" |
| Merge bundle complete | "Bundle Bx complete (sessions …). App stable locally. **Ready to merge to `main` — do you approve?**" |
| Multiple sessions without merge | "Sessions N–M are on branch(es) not yet on `main`. Production may be behind local work." |
| Founder says yes | Merge, push `main`, verify production, confirm the active month log records the merged/shipped state |
| Founder says not yet | Stay on branch; do not push `main` |

Documentation-only work may use `docs/` branches; it still requires Founder approval before merging to `main`.

---

## When to merge to `main`

Merge when **all** of the following are true:

- [ ] Founder explicitly approved merge  
- [ ] `npm run build` passes on branch  
- [ ] `npm run lint` passes  
- [ ] `npm test` passes  
- [ ] Session verification steps from runbook passed **locally**  
- [ ] Dependency rule satisfied (e.g. Session 2 requires Session 1 already on `main`)  
- [ ] Optional: merge bundle complete if batching sessions  

**Also valid:** merge after a **single** session if stable; merge after **multiple** sessions on one branch if the founder kept working without merging; merge when **full runbook** engineering (Sessions 1–6) is done.

**Never merge:** red build, skipped verification, or without founder yes.

---

## Ad-hoc UI/UX tweaks

1. Capture idea in the archived [inbox.md](../../11-archive/execution/logs/inbox.md)  
2. `git checkout -b tweak/short-description` from `main`  
3. Fix, build, lint, commit, push branch  
4. Ask founder to merge — same approval rule  
5. On merge: move inbox item to Done + line in july-log  

Small tweaks do **not** skip the branch rule.

---

## Docs-only changes

Docs may use `docs/` branches. Same rule: no push to `main` without founder approval. Low-risk doc passes can batch several edits in one merge.

---

## Blocked session (resume protocol)

If blocked mid-session:

1. Commit WIP on the **session branch** with message `WIP: Session N blocked — {reason}` or stash  
2. **Do not** merge to `main`  
3. Record a consequential blocker or choice in [Decision Records](../../08-decisions/decision-records.md)
4. Resume on the **same branch** and session number  

---

## Related

- [RUNBOOK_TEMPLATE.md](../../11-archive/execution/runbooks/RUNBOOK_TEMPLATE.md) — historical runbook template  
- [m2-founder-daily-driver.md](../../11-archive/execution/runbooks/m2-founder-daily-driver.md) — historical M2 example  
- [ENGINEERING.md](./ENGINEERING.md) — technical checklist  
- [GATES.md](./GATES.md) — definition of done  
- [august-log.md](../../current-phase/logs/august-log.md) — record current merges and sessions  
