import { createClient } from "@/lib/supabase/client";

export type ClickEventType = "demo_button_click" | "sign_up_button_click";

export async function trackClick(eventType: ClickEventType) {
  try {
    const supabase = createClient();
    const clickTrackingPayload: {
      event_type: ClickEventType;
      page_path: string;
      user_agent: string;
      referrer: string;
    } = {
      event_type: eventType,
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    };

    await supabase.from("click_tracking").insert(clickTrackingPayload);
  } catch (error) {
    // Silently fail - tracking should not break the app
    console.error("Failed to track click:", error);
  }
}
