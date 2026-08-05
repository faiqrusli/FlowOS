# D-013 — Phase3 Worktree Environment Configuration

**Decision ID:** D-013  
**Date:** 2026-08-05  
**Status:** `ACCEPTED`  
**Owner:** Founder  
**Phase:** Phase 3 — Implement and Harden the Core Loop  
**Sprint:** [Current Sprint](../../current-phase/current-sprint.md)

## Context

The `sprint/phase3` worktree has no local `.env.local` file. P1 Today implementation evidence relied on transiently loading environment variables from the primary workspace (`C:\Users\faiqr\flowos\.env.local`) during build verification.

Phase 3 P2–P6 implementation, automated testing, local development server, and production build verification all require `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to be configured in the worktree.

## Decision

**Copy `.env.local` from primary workspace to phase3 worktree**

### Procedure
1. Founder copies `C:\Users\faiqr\flowos\.env.local` to `C:\Users\faiqr\flowos-worktrees\phase2\.env.local`
2. Verify `.env.local` is in `.gitignore` (already confirmed — environment files are never committed)
3. Test configuration with `npm run dev` and `npm run build` in phase3 worktree
4. If copy succeeds, phase3 worktree becomes self-sufficient for local verification

### Security
- `.env.local` contains Supabase anon JWT (public key) and project URL (public)
- These values are safe to copy locally but must never be committed to repository
- `.gitignore` already excludes `.env.local` and `.env*.local` patterns
- Worktree-local copy does not expose credentials beyond primary workspace scope

### Alternatives Considered
- **Transient load from primary workspace:** Current approach — rejected because it's non-repeatable and error-prone
- **Separate Supabase project for phase3:** Rejected — migrations/data would be out of sync; single source of truth is simpler
- **Defer environment configuration to Gate 4:** Rejected — blocks automated testing and local development during P2–P6

## Affected Artifacts

- Phase3 worktree root: `C:\Users\faiqr\flowos-worktrees\phase2\.env.local` (created)
- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md) — Environment configuration completed
- [Current Sprint](../../current-phase/current-sprint.md) — Verification evidence protocol updated

## Next Actions

1. Founder executes: `Copy-Item "C:\Users\faiqr\flowos\.env.local" "C:\Users\faiqr\flowos-worktrees\phase2\.env.local"`
2. Verify with `npm run dev` in phase3 worktree
3. Record completion in task list

## References

- [D-011 — Phase 3 Technical Debt Disposition](./D-011-phase-3-technical-debt-disposition.md)
- [TECHNICAL_ARCHITECTURE.md](../../06-engineering/TECHNICAL_ARCHITECTURE.md)
