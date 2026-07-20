# FlowOS

An integrated productivity and reflection system — tasks, habits, focus, scheduling, reflection, and notes in one daily driver.

**Status:** Implementation is **on hold for review**. The product is live and used for dogfooding / GitHub review; we are not taking large new feature work right now.

**Production:** https://flowos-sage.vercel.app  
**Documentation:** [docs/README.md](./docs/README.md)  
**What’s shipped:** [docs/foundation/FEATURE_INVENTORY.md](./docs/foundation/FEATURE_INVENTORY.md)

**Live demo (guest workspace):** Spec [flowos-live-demo-spec.md](./docs/review/design/flowos-live-demo-spec.md) · Runbook [flowos-live-demo.md](./docs/execution/runbooks/flowos-live-demo.md)

---

## Quick start

```powershell
cd flowos
npm install
# Add Supabase vars to .env.local — see docs/foundation/TECHNICAL_ARCHITECTURE.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stack

Next.js 16 · React 19 · Tailwind v4 · Supabase · TypeScript

---

## Where to read

| Role | Start here |
|------|------------|
| Founder | [docs/start-here/founder.md](./docs/start-here/founder.md) |
| Engineer | [docs/start-here/engineer.md](./docs/start-here/engineer.md) |
| New contributor / GitHub reviewer | [docs/start-here/new-contributor.md](./docs/start-here/new-contributor.md) |
| Contributing (branches, merge) | [CONTRIBUTING.md](./CONTRIBUTING.md) · [GIT_WORKFLOW.md](./docs/foundation/governance/GIT_WORKFLOW.md) |
| Full index | [docs/README.md](./docs/README.md) |

**Milestone:** M2 — Founder Daily Driver ([docs/execution/README.md](./docs/execution/README.md)) — **paused / review mode**

**Visual system (current):** [DESIGN_SYSTEM_V3.md](./docs/foundation/DESIGN_SYSTEM_V3.md) + [Tokyo Night Warm](./docs/foundation/DESIGN_SYSTEM_TOKYO_NIGHT_WARM.md) · code truth: `src/app/globals.css`

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run start` | Start production server |
