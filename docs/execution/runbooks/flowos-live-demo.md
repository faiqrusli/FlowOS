# Runbook — FlowOS Live Demo

**Status:** Active — founder approved spec 2026-07-20 (v1.2 reminder audit)  
**Authority:** [flowos-live-demo-spec.md](../../review/design/flowos-live-demo-spec.md) (v1.2)  
**Decision:** [decision-log.md](../logs/decision-log.md) · 2026-07-20 Live Demo (+ v1.2 amendment)  
**Branch pattern:** `demo/live-guest-workspace` (from updated `main`) — not an M2 exit gate  
**Production:** https://flowos-sage.vercel.app

---

## Goal

Ship a no-signup guest demo: anonymous session, seeded Aisha workspace, 30-minute TTL, restart/reset, public feedback wall, and **schedule reminders MVP** (in-app toast + optional browser notifications). Visitors can use shipped modules like a real account.

---

## Locked decisions (do not re-litigate)

| Item | Choice |
|------|--------|
| Auth | Option A — `signInAnonymously` + seed clone |
| TTL | 30 minutes |
| Feedback | Public wall + soft-hide; no login |
| Search | Gated — do not claim |
| Schedule reminders MVP | **Include** — seed + live fire (§21); no permission prompt on Enter Demo |
| Smart / push notifications | Gated |
| Dates | Relative to visitor local today (`D-2…D+4`) |
| Restart | Purge + re-clone + wipe client keys (§18) |
| Scope | Dedicated workstream; not required for M2 exit |

Full matrices: spec §16–§21.

---

## Ops prerequisites (before P2)

- [ ] Enable **Anonymous Auth** on the Supabase project  
- [ ] Confirm service-role path for purge / auth user delete  
- [ ] Note expected row cost after seed pack size is known  
- [ ] Confirm `tasks.notification_enabled` / `notification_lead_minutes` migrated on prod (`supabase/tasks_notification_lead.sql`)  

---

## Sessions / phases

Work in order. Each phase ends with local `npm run build` && `npm run lint` on the demo branch before merge ask.

### P1 — Seed pack

**Deliverable:** Typed seed + relative date resolver.

- [ ] `src/lib/demo/` (or equivalent): `DEMO_SEED_VERSION`, persona constants, seed data  
- [ ] Relative date helper from `demoAnchorDate`  
- [ ] Entity volumes/fields per spec §17  
- [ ] **Schedule reminders:** clone-time offsets per spec §21 (`T0+6m` task, habit timed, etc.)  
- [ ] Unit tests for date offsets + ID remap (optional but preferred)

### P2 — Guest session shell

**Deliverable:** Enter Demo → clone → banner → refresh restore → expiry → restart/exit.

- [ ] Landing CTA: Enter Demo Workspace  
- [ ] Anonymous sign-in + metadata (`is_demo`, expiry, seed version, anchor)  
- [ ] `cloneSeed` / `purgeDemoUserData` (§19)  
- [ ] Client wipe (§18) including `flowos.schedule-reminders.delivered`  
- [ ] Demo banner + account menu Restart / Exit / Feedback  

### P3 — Surface QA

**Deliverable:** Walk every **Required** row in spec §16 on a live seeded session.

- [ ] Today, Tasks, Habits, Schedule, Focus, Notes, Reflection  
- [ ] No empty primary pages  
- [ ] Search UI hidden or honest gated copy  
- [ ] **US-10 / §21.3:** schedule-reminder toast fires in-session; once-only; Alert-before editable; no permission prompt on Enter Demo  

### P4 — Public feedback

**Deliverable:** `demo_feedback` table + UI.

- [ ] Migration + RLS (insert public; select public & not hidden)  
- [ ] Comment / rating / bug form  
- [ ] Rate limit + honeypot + max length  
- [ ] Public list (newest first)  

### P5 — Landing polish

- [ ] Login/marketing CTA + disclaimer  
- [ ] Real Sign in / Register still available  

### P6 — Hardening

- [ ] Hourly (or similar) TTL cleanup job  
- [ ] Assign purge job owner  
- [ ] Failure UX for clone errors  
- [ ] Soft cap / logging for demo volume  

### P7 — Announce

- [ ] Production smoke of §16 Required rows  
- [ ] Share URL for resume / portfolio  
- [ ] Append [july-log.md](../logs/july-log.md) after merge to `main`  

---

## Out of scope (v1)

- Goals / AI Coach / Weekly Review productization  
- Global search / command palette  
- Smart notification center  
- Client-only (Option C) or shared-user overlay (Option B)  
- Full moderation admin UI (soft-hide via Supabase is enough)

---

## Merge rule

Ask founder before merging to `main`. Bundle: treat as its own demo track (not B1–B5 M2 bundles unless founder says otherwise).

---

## Done when

1. Guest can enter from production URL with no signup.  
2. Seeded workspace tells a believable multi-day story.  
3. Restart restores known-good seed.  
4. Feedback persists in DB and appears on the public wall.  
5. Expired sessions show restart dialog.  
6. §16 Required actions pass manual QA.
