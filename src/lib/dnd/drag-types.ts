import type { TaskSortMode } from "@/lib/task-sort";
import type { PlanningState } from "@/types/task";

export type TaskDragData = {
  type: "task";
  taskId: string;
  groupId: string;
  zone: "active" | "completed";
  planningState: PlanningState;
  sortMode: TaskSortMode;
};

export type ColumnActiveDropData = {
  type: "column-active";
  groupId: string;
  planningState: PlanningState;
  sortMode: TaskSortMode;
};

export type ColumnActiveEndDropData = {
  type: "column-active-end";
  groupId: string;
  planningState: PlanningState;
  sortMode: TaskSortMode;
};

export type ColumnCompletedDropData = {
  type: "column-completed";
  groupId: string;
  planningState: PlanningState;
  sortMode: TaskSortMode;
};

export type GroupDragData = {
  type: "group";
  groupId: string;
};

export type TimelineDragData = {
  type: "timeline";
  taskId: string;
};

export type FlowOsDragData =
  | TaskDragData
  | ColumnActiveDropData
  | ColumnActiveEndDropData
  | ColumnCompletedDropData
  | GroupDragData
  | TimelineDragData;
