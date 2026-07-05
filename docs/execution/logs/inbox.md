# UX / UI Fix Inbox

**Purpose:** Catch random product fixes **before** they deserve a runbook session or a formal doc.  
**Ceremony:** None — one line per idea is enough.  
**Host:** Production https://flowos-sage.vercel.app when possible (localhost OK for pure UI bugs).

---

## Not the same as friction-log

| File | Use when |
|------|----------|
| **This inbox** | "That button feels wrong", "this should stay on Today", quick UI/UX ideas |
| [friction-log.md](./friction-log.md) | Daily dogfood evidence — what / when / cost / loop metrics (M2 exit) |
| [decision-log.md](./decision-log.md) | Product *choices* with rationale and rejected alternatives |

Ideas can start here and later move to friction-log if they become recurring, measured pain.

---

## Pipeline (where ideas go)

```
inbox (scratch)
    → runbook session / WP when scoped
        → july-log when that chunk ships
            → review/SRAI when milestone exits
```

| Stage | File |
|-------|------|
| Capture | **This file** — Inbox section |
| Scoped | **Promoted** section + link to runbook session |
| Shipped | **Done** section + one line in [july-log.md](./july-log.md) |
| Milestone close | [review/milestones/](../../review/milestones/) SRAI |

**Rule:** Do not open a new doc per idea. Do not skip july-log when a runbook session lands — that's the session memory.

---

## Inbox

<!-- One line each. Newest at top. -->

- _Example: Next-action card scrolls target row behind timeline on narrow viewport_

---

## Promoted (in runbook — not shipped yet)

| Idea | Runbook | Session / WP |
|------|---------|--------------|
| _None — 2026-07-05 Today UX polish items shipped or on B4 branch_ | [m2-today-ux-polish.md](../runbooks/m2-today-ux-polish.md) | B4 merge pending |

---

## Done (shipped — summarized in july-log)

| Idea | Shipped | Log |
|------|---------|-----|
| Tasks card scroll; habit Start now guard; context-menu bus; Enter refocus | 2026-07-05 B1 `c717428` | [july-log.md](./july-log.md) § 2026-07-05 |
| Slim timeline task menu; task details complete toggle; reflection drawer link | 2026-07-05 B2 `b182f40` | [july-log.md](./july-log.md) § 2026-07-05 |
| Quick-add icons + daily note copy/shortcuts; optimistic Enter capture | 2026-07-05 B3 `783f26a` | [july-log.md](./july-log.md) § 2026-07-05 |
| Today compact status rail; density Full/Work/Focus; card nav icons; ListPlus quick capture | 2026-07-05 B4 `5ae47b2` (branch, merge pending) | [july-log.md](./july-log.md) § 2026-07-05 |
| Task details checkbox layout (list-row style) | 2026-07-05 `a7c72c9` | [july-log.md](./july-log.md) § 2026-07-05 |
| `/` = Today home | 2026-07-04 `aa29917` | [july-log.md](./july-log.md) § 2026-07-04 |

---

*Founder scratch pad. Promote to runbook when ready to build; never delete — move to Done.*
