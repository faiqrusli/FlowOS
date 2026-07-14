import type { Metadata } from "next";
import { TasksPageContent } from "@/components/tasks/tasks-page-content";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Create, organize, and prepare tasks for your daily workspace.",
};

export default function TasksPage() {
  return (
    // Cancel shell pad on top/left/bottom only — shell already uses pr-0,
    // so -mr would slide Quick Schedule under the right nav.
    <div className="-ml-10 -mt-10 -mb-10 flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden lg:h-[calc(100dvh-3rem)]">
      <TasksPageContent />
    </div>
  );
}
