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
        → chronicle when that chunk ships
            → review/SRAI when milestone exits
```

| Stage | File |
|-------|------|
| Capture | **This file** — Inbox section |
| Scoped | **Promoted** section + link to runbook session |
| Shipped | **Done** section + one line in [chronicle/july-2026.md](./chronicle/july-2026.md) |
| Milestone close | [review/milestones/](../../review/milestones/) SRAI |

**Rule:** Do not open a new doc per idea. Do not skip the chronicle when a runbook session lands — that's the session memory.

---

## Inbox

<!-- One line each. Newest at top. -->

- _Example: Next-action card scrolls target row behind timeline on narrow viewport_

---

## Promoted (in runbook — not shipped yet)

| Idea | Runbook | Session / WP |
|------|---------|--------------|
| _Example: hover-gated timer controls_ | [m2-founder-daily-driver.md](../runbooks/m2-founder-daily-driver.md) | Session 4 / WP-2.4 |

---

## Done (shipped — summarized in chronicle)

| Idea | Shipped | Chronicle |
|------|---------|-----------|
| _Example: `/` = Today home_ | 2026-07-04 `aa29917` | [july-2026.md](./chronicle/july-2026.md) § 2026-07-04 |

---

*Founder scratch pad. Promote to runbook when ready to build; never delete — move to Done.*
