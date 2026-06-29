import type { Metadata } from "next";
import { TasksPageContent } from "@/components/tasks/tasks-page-content";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Create, organize, and prepare tasks for your daily workspace.",
};

export default function TasksPage() {
  return (
    <div className="-mt-3 flex h-[calc(100dvh-6.5rem)] min-h-0 flex-col overflow-hidden lg:-mt-4 lg:h-[calc(100dvh-4rem)]">
      <TasksPageContent />
    </div>
  );
}
