import { createClient } from "@/lib/supabase/client";

export type Feature =
  | "tasks"
  | "focus"
  | "habits"
  | "notes"
  | "schedule"
  | "reflection"
  | "goals"
  | "ai_coach";

export type FeatureAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "complete"
  | "start"
  | "stop";

export function trackFeatureUsage(
  feature: Feature,
  action: FeatureAction,
  metadata?: Record<string, unknown>,
) {
  void (async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("feature_usage").insert({
        user_id: user.id,
        feature,
        action,
        metadata: metadata ?? {},
      });
    } catch (error) {
      console.error("Failed to track feature usage:", error);
    }
  })();
}
