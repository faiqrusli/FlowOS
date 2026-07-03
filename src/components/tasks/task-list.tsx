"use client";

import { TaskSection } from "@/components/tasks/task-section";
import { TasksTodayProgress } from "@/components/tasks/tasks-today-progress";
import { EntityGridSkeleton } from "@/components/shared/entity-grid-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { computeTodayTaskProgress, partitionTasks } from "@/lib/tasks";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  pendingId: string | null;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskList({
  tasks,
  loading,
  pendingId,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return <EntityGridSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No tasks yet. Click Add Task to create your first one.
        </CardContent>
      </Card>
    );
  }

  const {
    today,
    todayIncomplete,
    todayCompleted,
    missed,
    upcoming,
  } = partitionTasks(tasks);
  const progress = computeTodayTaskProgress(today);

  const todayActionTasks = [...missed, ...todayIncomplete];
  const overdueTaskIds = new Set(missed.map((task) => task.id));

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <TasksTodayProgress
        completed={progress.completed}
        total={progress.total}
      />

      <TaskSection
        title="Today's Tasks"
        count={today.length + missed.length}
        tasks={todayActionTasks}
        pendingId={pendingId}
        variant="today"
        layout="grid"
        showDelete
        showEdit
        overdueTaskIds={overdueTaskIds}
        emptyMessage="All done for today — nice work."
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TaskSection
        title="Upcoming Tasks"
        count={upcoming.length}
        tasks={upcoming}
        pendingId={pendingId}
        variant="upcoming"
        layout="grid"
        showDelete
        showEdit
        hideWhenEmpty
        emptyMessage="Nothing upcoming right now."
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TaskSection
        title="Completed Today"
        count={todayCompleted.length}
        tasks={todayCompleted}
        pendingId={pendingId}
        variant="completed"
        layout="grid"
        showDelete
        showEdit
        hideWhenEmpty
        collapsible
        defaultOpen={false}
        emptyMessage="Nothing completed yet today."
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
