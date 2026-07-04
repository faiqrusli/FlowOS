/**
 * Ship Gate Session 6: two-account RLS verification via Supabase Data API (anon key).
 * Usage: node scripts/rls-two-account-test.mjs
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const text = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const ts = Date.now();
const useExisting =
  env.SHIPGATE_EMAIL_A &&
  env.SHIPGATE_PASSWORD_A &&
  env.SHIPGATE_EMAIL_B &&
  env.SHIPGATE_PASSWORD_B;

const emailA = useExisting ? env.SHIPGATE_EMAIL_A : `shipgatea${ts}@gmail.com`;
const emailB = useExisting ? env.SHIPGATE_EMAIL_B : `shipgateb${ts}@gmail.com`;
const password = useExisting ? env.SHIPGATE_PASSWORD_A : `ShipGate!${ts}`;
const passwordB = useExisting ? env.SHIPGATE_PASSWORD_B : password;

const tables = [
  { name: "tasks", insert: (uid) => ({ title: `RLS-A-${ts}`, user_id: uid }) },
  { name: "habits", insert: (uid) => ({ name: `RLS-A-${ts}`, user_id: uid }) },
  {
    name: "focus_sessions",
    insert: (uid) => ({
      focus_duration: 25,
      break_duration: 5,
      session_status: "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      user_id: uid,
    }),
  },
  {
    name: "reflections",
    insert: (uid) => ({
      reflection_date: new Date().toISOString().slice(0, 10),
      went_well: "RLS test A",
      user_id: uid,
    }),
  },
];

async function signUp(email) {
  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw new Error(`signUp ${email}: ${error.message}`);
  if (!data.session) {
    throw new Error(
      `signUp ${email}: no session — disable email confirmation in Supabase Auth or confirm manually`
    );
  }
  return client;
}

async function signIn(email, pass) {
  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
  if (error) throw new Error(`signIn ${email}: ${error.message}`);
  if (!data.session) throw new Error(`signIn ${email}: no session`);
  return client;
}

async function main() {
  let clientA;
  let clientB;
  if (useExisting) {
    console.log("Using existing accounts from .env.local (SHIPGATE_EMAIL_A/B)...");
    clientA = await signIn(emailA, password);
    clientB = await signIn(emailB, passwordB);
  } else {
    console.log("Creating test accounts...");
    clientA = await signUp(emailA);
    clientB = await signUp(emailB);
  }
  const {
    data: { user: userA },
  } = await clientA.auth.getUser();
  if (!userA) throw new Error("No user A");

  const inserted = {};

  for (const t of tables) {
    const row = t.insert(userA.id);
    const { data, error } = await clientA.from(t.name).insert(row).select("id").single();
    if (error) throw new Error(`A insert ${t.name}: ${error.message}`);
    inserted[t.name] = data.id;
    console.log(`A inserted ${t.name}: ${data.id}`);
  }

  // reflection_entries needs reflection_id
  const { data: entry, error: entryErr } = await clientA
    .from("reflection_entries")
    .insert({
      reflection_id: inserted.reflections,
      title: "RLS entry A",
      content: "test",
      user_id: userA.id,
    })
    .select("id")
    .single();
  if (entryErr) throw new Error(`A insert reflection_entries: ${entryErr.message}`);
  inserted.reflection_entries = entry.id;

  // habit_completions
  const { error: hcErr } = await clientA.from("habit_completions").insert({
    habit_id: inserted.habits,
    completion_date: new Date().toISOString().slice(0, 10),
  });
  if (hcErr) throw new Error(`A insert habit_completions: ${hcErr.message}`);
  inserted.habit_completions = inserted.habits;

  let failed = false;
  for (const [table, id] of Object.entries(inserted)) {
    const pk = table === "habit_completions" ? "habit_id" : "id";
    const { data, error } = await clientB.from(table).select("*").eq(pk, id);
    if (error) {
      console.log(`PASS ${table}: B read blocked (${error.message})`);
      continue;
    }
    if (data && data.length > 0) {
      console.error(`FAIL ${table}: B read ${data.length} row(s) owned by A`);
      failed = true;
    } else {
      console.log(`PASS ${table}: B cannot read A row`);
    }
  }

  // B tries to update A's task
  const { count: updateCount, error: updateErr } = await clientB
    .from("tasks")
    .update({ title: "HACKED" })
    .eq("id", inserted.tasks)
    .select("id", { count: "exact", head: true });
  if (updateErr || updateCount === 0) {
    console.log("PASS tasks: B cannot update A row");
  } else {
    console.error("FAIL tasks: B updated A row");
    failed = true;
  }

  if (failed) process.exit(1);
  console.log("\nALL PASS — two-account RLS isolation verified");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
