# D-014 — Defer Today Orientation and Make the Workspace Canonical

**Decision ID:** D-014  
**Date:** 2026-08-06  
**Status:** `ACCEPTED`  
**Owner:** Founder  
**Phase:** Phase 3 — Implement and Harden the Core Loop  
**Sprint:** [Current Sprint](../../current-phase/current-sprint.md)

## Context

The read-only Today orientation composition was introduced as a separate entry surface at `/`, while the existing interactive workspace remained at `/workplace`. That split makes the MVP core loop unnecessarily indirect: a person opens orientation first and must navigate to the surface where task, Focus, habit, and schedule work is actually performed.

The interactive workspace already provides the intended Today execution experience and keeps consequential domain ownership in its existing owner components. The separate orientation composition is useful future work, but it is not required to make the MVP core loop usable.

## Decision

For MVP, make the existing interactive workspace the canonical Today page:

- `/` renders `WorkplacePageContent` directly and retains the Today page title.
- `/workplace` becomes a compatibility redirect to `/` for existing links and bookmarks.
- The read-only Today orientation implementation and its validation package are deferred, not deleted, until a later Founder decision re-admits them.
- Gate 3 walkthroughs use `/` as the direct Today execution entry; they do not require the deferred orientation composition.

This decision does not remove the Tasks, Focus, Habits, Schedule, Reflection, or Notes owner surfaces. It removes only the separate orientation detour from the MVP entry path.

## Consequences

- A person can open FlowOS at `/` and perform the core Today work immediately.
- `/workplace` remains safe for old links without creating two competing workspace implementations.
- The deferred orientation code and documentation must not be presented as active MVP behavior or used as Gate 3 evidence until re-admitted.
- The root route now intentionally contains the interactive workspace, so the workspace’s existing owner-specific writes remain available through their canonical controls.

## Affected artifacts

- `src/app/(main)/page.tsx`
- `src/app/(main)/workplace/page.tsx`
- `src/components/app-shell.tsx`
- [Today orientation delivery design](../../04-features/delivery/today-orientation.md)
- [Today orientation validation plan](../../04-features/validation/today-orientation.md)
- [Phase 3 current sprint](../../current-phase/current-sprint.md)
- [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)

## References

- [D-009 — Approve Today Orientation Delivery Design and Validation Plan](./D-009-approve-today-orientation-delivery-design.md)
- [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
