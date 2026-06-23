"use client";

import { useCallback, useEffect, useState } from "react";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import {
  createTask,
  deleteTask,
  fetchTasks,
  TasksError,
  toggleTaskComplete,
  updateTask,
} from "@/lib/tasks";
import type { Task, TaskInsert } from "@/types/task";

export function TasksPageContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to load tasks."
      );
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSave(input: TaskInsert, taskId?: string) {
    if (taskId) {
      const updated = await updateTask(taskId, input);
      setTasks((prev) =>
        prev.map((task) => (task.id === updated.id ? updated : task))
      );
      return;
    }

    const created = await createTask(input);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleCreate(input: TaskInsert) {
    await handleSave(input);
  }

  async function handleToggleComplete(task: Task) {
    setPendingId(task.id);
    setError(null);

    try {
      const updated = await toggleTaskComplete(task);
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task."
      );
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    setError(null);

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to delete task."
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="See today's progress, finish what's due, then catch up on missed items."
        action={<CreateTaskDialog onCreate={handleCreate} />}
      />

      {error && <ErrorBanner message={error} />}

      <TaskList
        tasks={tasks}
        loading={loading}
        pendingId={pendingId}
        onToggleComplete={handleToggleComplete}
        onEdit={setEditingTask}
        onDelete={handleDelete}
      />

      {editingTask && (
        <TaskDialog
          mode="edit"
          task={editingTask}
          open={Boolean(editingTask)}
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
