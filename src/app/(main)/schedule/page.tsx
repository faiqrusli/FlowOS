import type { Metadata } from "next";
import { SchedulePageContent } from "@/components/schedule/schedule-page-content";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Plan your day on the timeline",
};

export default function SchedulePage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <SchedulePageContent />
    </div>
  );
}
