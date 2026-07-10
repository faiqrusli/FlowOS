import type { Metadata } from "next";
import { SchedulePageContent } from "@/components/schedule/schedule-page-content";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Plan your day on the timeline",
};

export default function SchedulePage() {
  return (
    <div className="-my-10 flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden lg:h-[calc(100dvh-3rem)]">
      <SchedulePageContent />
    </div>
  );
}
