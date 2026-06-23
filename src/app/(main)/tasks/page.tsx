import type { Metadata } from "next";
import { TasksPageContent } from "@/components/tasks/tasks-page-content";

export const metadata: Metadata = {
  title: "Tasks",
};

export default function TasksPage() {
  return <TasksPageContent />;
}
