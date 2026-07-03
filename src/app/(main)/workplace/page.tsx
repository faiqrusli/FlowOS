import type { Metadata } from "next";
import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";

export const metadata: Metadata = {
  title: "Workplace",
  description:
    "Execute today's work — focus, schedule, habits, and tasks in one place.",
};

export default function WorkplacePage() {
  return (
    <div className="-m-6 flex h-[calc(100dvh-3rem)] min-h-0 flex-col overflow-hidden lg:-ml-10 lg:-mt-8">
      <WorkplacePageContent />
    </div>
  );
}
