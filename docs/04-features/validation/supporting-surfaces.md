# Supporting Surfaces Validation Plan

**Status:** `APPROVED` — Founder checkpoint passed through D-010; automated evidence recorded, manual/live validation pending
**Owner:** Engineering Architect (Founder), with Product and Design review
**Created:** 2026-08-05
**Last updated:** 2026-08-05
**Decision this plan informs:** Supporting-surfaces implementation readiness and Gate 3 contribution
**Authorized boundary:** [Supporting-domain decisions](../supporting-domain-decisions.md)
**Delivery design:** [Supporting surfaces delivery design](../delivery/supporting-surfaces.md)
**Journey context:** [MVP coherent loop](../../03-experience/journeys/mvp-coherent-loop.md)
**Evidence record location:** [Supporting surfaces implementation evidence](../../current-phase/phase-3/supporting-surfaces-implementation-evidence.md) (automated record; manual/live record pending)
**Gate link:** [Gate 3 checklist](../../current-phase/phase-3/gate-checklist.md)
**Implementation evidence:** [Supporting surfaces implementation evidence](../../current-phase/phase-3/supporting-surfaces-implementation-evidence.md)
**Review trigger:** Any change to a `SUPPORT-*` question, minimum behavior, source owner, accessibility threshold, or optionality rule.

> This plan defines evidence to collect. It contains no implementation result, release approval, or Gate 3 decision.

## Decision scope and acceptance matrix

| ID | Acceptance question | Required evidence | Pass condition |
|---|---|---|---|
| `SUPPORT-01` | Core journey remains usable when supporting sources are empty/unavailable/stale/disconnected | Optional-source fault/empty walkthrough | Tasks, Focus, Reflection, and evidence remain usable |
| `SUPPORT-02` | Supporting records retain owner/provenance | Cross-surface owner review | Source identity and correction route are clear |
| `SUPPORT-03` | Schedule remains planning context; Tasks/Habits remain source | Planning/complete seeded scenario | Schedule never claims completion or edits competing fact |
| `SUPPORT-04` | Habits remain daily visibility/explicit completion only | Scope/copy and owner interaction review | No score, streak, or second loop is introduced |
| `SUPPORT-05` | Notes/Growth Areas remain user-owned context | Context/owner review | No standalone Knowledge/Goals/automatic adaptation appears |
| `SUPPORT-06` | Optional states/retry/re-entry remain accessible and non-blocking | Fault injection, keyboard/screen-reader/responsive review | Material state is named, operable, and does not block core loop |
| `SUPPORT-07` | Identity, RLS, validation, date/time, drafts, migration limits preserved | Static/service/two-account/Singapore review | No unscoped read, browser date drift, or hidden persistence claim |

## Methods and scenarios

- Automated tests cover independent source settlement, empty/unavailable/stale/disconnected mapping, scoped retry, owner-routing, and no cross-owner mutation.
- Manual seeded and real-data walkthrough covers habits visible/completed, schedule planned context, notes context, each source empty, one source failed, stale re-entry, permission failure, and safe continuation through the core loop.
- Accessibility review covers keyboard, visible focus, screen-reader source/state/recovery names, responsive layouts, touch targets, and reduced motion. Schedule's existing keyboard limitation is recorded as evidence or explicit Founder disposition.
- Fixtures include Account A and B, distinct source records, no-source state, failed optional source, disconnected link, local draft, and Singapore-midnight date boundary.

## Analysis and decision rules

Any supporting mutation through the wrong owner, planning-as-evidence claim, silent choice-relevant omission, cross-account exposure, or blocked core journey is `Block`. A deferred accessibility condition remains open until evidenced or explicitly dispositioned by the Founder; it is not a pass by omission.

## Quality and evidence handling

Run repository checks before the implementation checkpoint and Gate 3 evidence. Record source, state, fixture, date key, browser/viewport, result, limitation, and owner route while redacting user content.

## Change control

Changing optionality, minimum behavior, source ownership, accessibility threshold, or evidence interpretation requires review of the supporting decisions, delivery design, sprint, and Gate 3 checklist.
