<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

FlowOS is a single Next.js 16 / React 19 app. Its only backend is Supabase (Postgres + Auth); there is no separate API service. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).

### Running the app (services not started by the update script)
- **Local Supabase** must be running before the app works (the app throws at startup if `NEXT_PUBLIC_SUPABASE_*` env vars are missing). Supabase runs in Docker.
  - Start the Docker daemon if not running: `sudo dockerd` (background), then `sudo chmod 666 /var/run/docker.sock` so `supabase`/`docker` work without sudo.
  - Start Supabase from the repo root: `supabase start` (uses `supabase/config.toml`). Get credentials with `supabase status -o env`.
- **`.env.local`** (gitignored) must contain `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. For local Supabase these are `http://127.0.0.1:54321` and the local `ANON_KEY` (a JWT starting with `eyJ...`). Note: `env.ts` rejects `sb_publishable_...` keys — you must use the anon JWT.
- **Dev server**: `npm run dev` → http://localhost:3000. Unauthenticated visits to `/` redirect to `/login`; register at `/register`.

### Database schema (gotcha)
- The repo's SQL schema is a set of loose files in `supabase/` (NOT Supabase CLI migrations), and they must be applied in dependency order: `tasks.sql`, `tasks_priority.sql`, `habits.sql`, `habit_completions.sql`, `focus_sessions.sql`, `reflections.sql`, `reflection_entries.sql`, `notes.sql`, then `auth_migration.sql` last (it drops the legacy public policies and adds per-user RLS). Apply them against a freshly started local Supabase, e.g. via `docker exec -i supabase_db_<project> psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/<file>` (a fresh `supabase start` has an empty DB, so re-apply after recreating it).
- Auth email confirmation is disabled in `supabase/config.toml` (`enable_confirmations = false`), so `signUp` returns a session immediately and registration redirects straight to the dashboard — no email step needed for local testing.

### Lint
- `npm run lint` currently reports pre-existing errors/warnings in app code; that is the repo's current state, not an environment problem.
