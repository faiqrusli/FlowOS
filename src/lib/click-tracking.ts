import { createClient } from "@/lib/supabase/client";

export type ClickEventType = "demo_button_click" | "sign_up_button_click";

export async function trackClick(eventType: ClickEventType) {
  try {
    const supabase = createClient();
    await supabase
      .from("click_tracking")
      .insert({
        event_type: eventType,
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      } as any);
  } catch (error) {
    // Silently fail - tracking should not break the app
    console.error("Failed to track click:", error);
  }
}
