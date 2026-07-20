# Contributing to FlowOS

FlowOS is currently in an **implementation hold** for GitHub and live-demo review. Prefer small fixes and docs clarity over new milestones.

## Before you build

1. Read [docs/start-here/new-contributor.md](./docs/start-here/new-contributor.md) (or [engineer.md](./docs/start-here/engineer.md)).
2. Check [FEATURE_INVENTORY.md](./docs/foundation/FEATURE_INVENTORY.md) — is it already shipped or deferred?
3. Check [execution/README.md](./docs/execution/README.md) — is the milestone paused?

## Git

Follow [docs/foundation/governance/GIT_WORKFLOW.md](./docs/foundation/governance/GIT_WORKFLOW.md):

- Branch from updated `main` (`tweak/…`, `docs/…`, or `m2/session-…`)
- Never push or merge to `main` without founder approval
- Locally: `npm run build` && `npm run lint` before asking to merge

## Design & product rules

- Visual: [DESIGN_SYSTEM_V3.md](./docs/foundation/DESIGN_SYSTEM_V3.md) + [Tokyo Night Warm](./docs/foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md); code truth `src/app/globals.css`
- Product rules: [PRINCIPLES.md](./docs/foundation/governance/PRINCIPLES.md)
- Decisions: append [decision-log.md](./docs/execution/logs/decision-log.md)

## Questions

Use GitHub issues on this repo, or founder feedback via the live demo path when that ships.
