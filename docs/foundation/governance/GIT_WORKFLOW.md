# Git Workflow

**Status:** Active  
**Audience:** Founder, AI agents, engineers  
**Last updated:** July 4, 2026

**Rule:** `main` is production-truth. All product work happens on **branches** until the founder explicitly approves merge to `main`.

---

## Principles

| Rule | Meaning |
|------|---------|
| **Branch first** | Every runbook session and every UI/UX tweak starts on a **new branch** from latest `main`. |
| **Commit on branch** | Commit as often as needed on the branch. Multiple commits per session is fine. |
| **Push branch** | Push the feature branch to `origin` for backup — **not** the same as merging to `main`. |
| **Test local** | `npm run build` && `npm run lint` on the branch before asking to merge. |
| **Main = founder approval** | Merge to `main` and push `main` **only** when the founder explicitly agrees. |
| **AI must ask** | Agents never merge, never push `main`, never assume approval. |

---

## Branch naming

| Work type | Pattern | Example |
|-----------|---------|---------|
| Runbook session | `m2/session-N-short-name` | `m2/session-2-routing` |
| Ad-hoc UI/UX tweak | `tweak/short-description` | `tweak/focus-button-visible` |
| Docs-only (no product change) | `docs/short-description` | `docs/july-log-inbox` |
| Milestone / bundle merge prep | stay on session branch until merge | — |

Use lowercase kebab-case. Match runbook session number when applicable.

---

## Session workflow

### 1. Start session (new branch)

```powershell
git checkout main
git pull origin main
git checkout -b m2/session-2-routing
```

Confirm clean build on `main` before branching if the prior merge was large.

### 2. Work and commit (on branch)

```powershell
# after changes
npm run build
npm run lint
git add -A
git commit -m "M2 Session 2: next-action stays on Today"
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
git merge m2/session-2-routing --no-ff
npm run build
npm run lint
git push origin main
```

Then verify https://flowos-sage.vercel.app and add a block to [july-log.md](../../execution/logs/july-log.md).

**Rollback:** `git revert` the merge commit on `main` — never force-push `main`.

---

## Merge bundles (M2 runbook)

A **merge bundle** groups one or more sessions where merging to `main` makes sense together. Bundles are **suggestions** — the founder decides timing.

| Bundle | Sessions | Scope | AI reminds merge when |
|--------|----------|-------|------------------------|
| **B1 — Today home** | 1 | `/` = Today, `/workplace` redirect | Session 1 verified locally (and production if already merged earlier) |
| **B2 — Routing truth** | 2 | Next-action stays on Today | Session 2 complete; **requires B1 on `main`** |
| **B3 — Navigation** | 3 | Sidebar ≤ 5 items | Session 3 complete |
| **B4 — Interaction** | 4, 5 | Focus controls + inline capture | **Both** sessions complete, or founder accepts partial merge |
| **B5 — Reliability** | 6 | Error/loading boundaries | Session 6 complete — **engineering track done** |
| **B6 — Founder ops** | 7, 8 | Recruiting + dogfood | No code merge; update logs only |

**AI reminder rules:**

| Event | Agent must say |
|-------|----------------|
| Session ends | "Session N done on `{branch}`. Merge bundle Bx {complete \| not yet}. Merge to `main`? (needs your approval)" |
| Merge bundle complete | "Bundle Bx complete (sessions …). App stable locally. **Ready to merge to `main` — do you approve?**" |
| Multiple sessions without merge | "Sessions N–M are on branch(es) not yet on `main`. Production may be behind local work." |
| Founder says yes | Merge, push `main`, verify production, update july-log |
| Founder says not yet | Stay on branch; do not push `main` |

Sessions 7–8 never require a product branch merge unless docs change — use `docs/` branches if needed.

---

## When to merge to `main`

Merge when **all** of the following are true:

- [ ] Founder explicitly approved merge  
- [ ] `npm run build` passes on branch  
- [ ] `npm run lint` passes  
- [ ] Session verification steps from runbook passed **locally**  
- [ ] Dependency rule satisfied (e.g. Session 2 requires Session 1 already on `main`)  
- [ ] Optional: merge bundle complete if batching sessions  

**Also valid:** merge after a **single** session if stable; merge after **multiple** sessions on one branch if the founder kept working without merging; merge when **full runbook** engineering (Sessions 1–6) is done.

**Never merge:** red build, skipped verification, or without founder yes.

---

## Ad-hoc UI/UX tweaks

1. Capture idea in [inbox.md](../../execution/logs/inbox.md)  
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
3. Log blocker in [decision-log.md](../../execution/logs/decision-log.md)  
4. Resume on the **same branch** and session number  

---

## Related

- [RUNBOOK_TEMPLATE.md](../../execution/runbooks/RUNBOOK_TEMPLATE.md) — author new milestone runbooks  
- [m2-founder-daily-driver.md](../../execution/runbooks/m2-founder-daily-driver.md) — M2 example (reference)  
- [ENGINEERING.md](./ENGINEERING.md) — technical checklist  
- [QUALITY_GATES.md](./QUALITY_GATES.md) — definition of done  
- [july-log.md](../../execution/logs/july-log.md) — record merges and sessions  
