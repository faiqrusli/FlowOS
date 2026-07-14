import type { Metadata } from "next";
import { TodayPageContent } from "@/components/today/today-page-content";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Execute today's work — focus, schedule, habits, and tasks in one place.",
};

export default function Home() {
  return (
    // Cancel shell pad on top/left/bottom only — shell already uses pr-0,
    // so -mr would overflow and enable horizontal scroll on main.
    <div className="-ml-10 -mt-10 -mb-10 flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-surface-canvas lg:h-[calc(100dvh-3rem)]">
      <TodayPageContent />
    </div>
  );
}
