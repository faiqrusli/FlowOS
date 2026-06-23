"use client";

import {
  DashboardEmptyLine,
  DashboardPanel,
  DashboardSupportingText,
} from "@/components/dashboard/dashboard-card-shell";
import { TaskChecklistRow } from "@/components/tasks/task-checklist-row";
import { sortTasksForPreview } from "@/lib/dashboard-command";
import type { Task } from "@/types/task";

const PREVIEW_LIMIT = 2;

type DashboardTasksCardProps = {
  tasks: Task[];
  pendingId: string | null;
  onToggle: (task: Task) => void;
};

export function DashboardTasksCard({
  tasks,
  pendingId,
  onToggle,
}: DashboardTasksCardProps) {
  const preview = sortTasksForPreview(tasks, PREVIEW_LIMIT);
  const remaining = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - remaining;

  return (
    <DashboardPanel
      title="Tasks"
      href="/tasks"
      actionLabel="View"
      count={
        tasks.length > 0
          ? { completed: completedCount, total: tasks.length }
          : undefined
      }
    >
      {tasks.length === 0 ? (
        <DashboardEmptyLine message="No tasks today." />
      ) : remaining === 0 ? (
        <DashboardEmptyLine message="All tasks complete for today." />
      ) : (
        <>
          <ul className="space-y-0.5">
            {preview.map((task) => (
              <TaskChecklistRow
                key={task.id}
                task={task}
                disabled={pendingId === task.id}
                onToggle={() => onToggle(task)}
                compact
              />
            ))}
          </ul>
          {remaining > PREVIEW_LIMIT && (
            <DashboardSupportingText>
              +{remaining - PREVIEW_LIMIT} more
            </DashboardSupportingText>
          )}
        </>
      )}
    </DashboardPanel>
  );
}
