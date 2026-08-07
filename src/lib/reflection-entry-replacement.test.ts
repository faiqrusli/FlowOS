import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(
  new URL("./reflections-db.supabase.ts", import.meta.url),
  "utf8",
);
const migrationSource = readFileSync(
  new URL("../../supabase/reflection_entries_replace.sql", import.meta.url),
  "utf8",
);

describe("reflection entry replacement", () => {
  it("uses the atomic owner-checked RPC instead of delete-first writes", () => {
    expect(clientSource).toContain('supabase.rpc("replace_reflection_entries"');
    expect(clientSource).not.toContain('.from("reflection_entries")\n    .delete()');
    expect(clientSource).not.toContain('.from("reflection_entries")\n    .insert(');
    expect(migrationSource).toContain("for update");
    expect(migrationSource).toContain("delete from reflection_entries");
    expect(migrationSource).toContain("return query");
    expect(migrationSource).toContain("auth.uid()");
  });
});
