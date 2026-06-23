import { createClient } from "@/lib/supabase/client";

/** Browser Supabase client — use in Client Components and client-side data helpers. */
export const supabase = createClient();

export { createClient };
