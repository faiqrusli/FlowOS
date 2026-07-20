import type { Metadata } from "next";
import { TasksPageContent } from "@/components/tasks/tasks-page-content";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Create, organize, and prepare tasks for your daily workspace.",
};

export default function TasksPage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <TasksPageContent />
    </div>
  );
}
