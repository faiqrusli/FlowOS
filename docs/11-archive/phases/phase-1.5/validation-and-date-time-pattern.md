# Phase 1.5 Foundation Pattern

**Status:** Implemented for authentication, the Tasks pilot, reflection autosave, and Focus reflection
**Owner:** Founder (executed via the 6-hat solo workflow)
**Last Updated:** 2026-08-05

This document records the recovered implementation. It does not claim that every retained form or every native `Date` operation has been migrated.

## Dependency foundation

The Phase 1.5 packages are recorded in `package.json` and `package-lock.json`:

| Package | Declared version | Use |
|---|---:|---|
| `zod` | `^4.4.3` | Runtime schemas and normalized field errors |
| `react-hook-form` | `^7.84.0` | Form state, pending lifecycle, correction, and retry |
| `@hookform/resolvers` | `^5.7.1` | Zod resolver adapter |
| `date-fns` | `^4.4.0` | Calendar validity checks without changing timezone semantics |

`npm audit` reports `11` vulnerabilities (`8` high, `2` moderate, `1` low). The Founder temporarily accepted this risk for the bounded restoration; no forced audit upgrade is included. Revisit it in a separate dependency-compatibility sprint.

## Validation and form contract

- `src/lib/validation.ts` owns login, registration, task-form, task-insert, and task-update schemas.
- Client forms use `react-hook-form` with `zodResolver`; invalid fields are associated with their messages through `aria-invalid` and `aria-describedby`.
- Server persistence validates after `requireUserId` and before Supabase writes through `parseTaskInsert` and `parseTaskUpdate`.
- Server errors are placed into a root error channel; loading is represented by the form submit lifecycle and controls are disabled only while the relevant save is active.
- `src/lib/validation.test.ts` covers invalid fields, password mismatch, invalid schedule values, impossible dates, valid inserts, and persistence-boundary rejection.

## Date and time semantics

- Date keys are date-only values in `YYYY-MM-DD` format and are interpreted in the approved `Asia/Singapore` product timezone.
- Scheduled wall-clock values use `HH:mm` or the existing database-compatible `HH:mm:ss` form; invalid hours, minutes, and seconds are rejected before persistence.
- Persisted timestamps remain instants and continue through the existing `date-utils.ts` formatting boundary.
- `date-fns` is used to reject impossible calendar dates such as `2026-02-31`; it does not convert existing UTC or Singapore-local semantics.
- Focus and schedule paths retain their existing `date-utils.ts` boundary and require authenticated/manual timezone evidence before Gate 1.5 can pass.

## Recovery and persistence

- Task board drag projections keep organization membership while projecting Today/Later planning views; failed layout writes now throw `TaskGroupsError` for rollback/reload recovery.
- Reflection drawer changes are written to a date-scoped local draft before the debounced Supabase save. Page-hide/unmount flushes pending saves and failed network saves retain the local draft for retry.
- Focus reflections append cards to the `Focus` kanban; the weekly board reads the latest card and retains legacy custom-entry fallback.
- Full authenticated browser accessibility, two-account isolation, forced-write recovery, and dependency-vulnerability disposition remain open evidence items.