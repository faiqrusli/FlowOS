import type { Metadata } from "next";
import { TodayPageContent } from "@/components/today/today-page-content";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Execute today's work — focus, schedule, habits, and tasks in one place.",
};

export default function Home() {
  return (
    // AppShell skips padding on `/` — fill the main column edge-to-edge.
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface-canvas">
      <TodayPageContent />
    </div>
  );
}
