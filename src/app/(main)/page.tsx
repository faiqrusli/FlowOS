import type { Metadata } from "next";
import { TodayPageContent } from "@/components/today/today-page-content";

export const metadata: Metadata = {
  title: "Today",
  description:
    "Execute today's work — focus, schedule, habits, and tasks in one place.",
};

export default function Home() {
  return (
    <div className="-m-10 flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-background lg:h-[calc(100dvh-3rem)]">
      <TodayPageContent />
    </div>
  );
}
