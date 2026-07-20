import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export type DemoFeedbackKind = "comment" | "rating" | "bug";

export type DemoFeedbackRow =
  Database["public"]["Tables"]["demo_feedback"]["Row"];

const MAX_BODY = 2000;
const RATE_KEY = "flowos.demo.feedback.lastSubmit";
const RATE_MS = 60_000;

export type SubmitDemoFeedbackInput = {
  kind?: DemoFeedbackKind;
  body: string;
  displayName?: string;
  /** Honeypot — must be empty. */
  website?: string;
  pagePath?: string;
  demoSessionId?: string | null;
};

export async function submitDemoFeedback(
  input: SubmitDemoFeedbackInput,
): Promise<void> {
  if (input.website && input.website.trim()) {
    // Bot honeypot — pretend success.
    return;
  }

  const body = input.body.trim();
  if (!body) {
    throw new Error("Please write a short message.");
  }
  if (body.length > MAX_BODY) {
    throw new Error(`Keep feedback under ${MAX_BODY} characters.`);
  }

  try {
    const last = window.localStorage.getItem(RATE_KEY);
    if (last && Date.now() - Number(last) < RATE_MS) {
      throw new Error("Please wait a moment before sending another message.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Please wait")) {
      throw error;
    }
  }

  const supabase = createClient();
  const { error } = await supabase.from("demo_feedback").insert({
    kind: input.kind ?? "comment",
    body,
    display_name: input.displayName?.trim() || "Guest",
    rating: null,
    severity: null,
    page_path: input.pagePath ?? null,
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 400) : null,
    demo_session_id: input.demoSessionId ?? null,
    is_public: true,
    is_hidden: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  try {
    window.localStorage.setItem(RATE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}
