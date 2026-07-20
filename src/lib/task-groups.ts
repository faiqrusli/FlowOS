import { requireUserId } from "@/lib/auth";
import { formatRelativeDateLabel,
  getTodayDateString,
} from "@/lib/date-utils";
import { supabase } from "@/lib/supabase";
import type {
  PlanningState,
  Task,
  TaskGroup,
  TaskGroupInsert,
  TaskGroupWithTasks,
} from "@/types/task";
import {
  isLaterPlanningState,
  LATER_PLANNING_TASK_UPDATES,
  normalizePlanningState,
} from "@/lib/task-planning";
import { normalizeTaskManualOrder } from "@/lib/manual-order";
import { repairMissingManualOrders } from "@/lib/tasks";
import {
  applyLaterColumnSortMode,
  getSortContextForGroup,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  normalizeTaskSortMode,
  sortActiveAndCompletedForContext,
  sortTasksForTodayView,
  type TaskSortContext,
  type TaskSortMode,
} from "@/lib/task-sort";

export { normalizePlanningState } from "@/lib/task-planning";
export type { TaskSortMode } from "@/lib/task-sort";
export {
  canReorderTasksInGroup,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  isSortableTaskColumn,
  REORDER_DISABLED_TOOLTIP,
} from "@/lib/task-sort";

export class TaskGroupsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskGroupsError";
  }
}

export const TODAY_GROUP_SLUG = "today";
export const INBOX_GROUP_SLUG = "inbox";
export const INBOX_GROUP_TITLE = "Inbox";
export const INBOX_GROUP_ICON = "📥";
export const LATER_GROUP_COLOR = "later";
export const INBOX_GROUP_COLOR = "inbox";
export const LATER_GROUP_SLUG = "later";
export const LATER_COLUMN_ID = "__flowos_later_column__";

/** @deprecated Use LATER_GROUP_SLUG */
export const BACKLOG_GROUP_SLUG = LATER_GROUP_SLUG;
/** @deprecated Use LATER_COLUMN_ID */
export const BACKLOG_COLUMN_ID = LATER_COLUMN_ID;

export function taskBelongsInLaterView(
  task: Pick<Task, "planning_state">
): boolean {
  return isLaterPlanningState(task.planning_state);
}

/** @deprecated Use taskBelongsInLaterView */
export const taskBelongsInBacklogView = taskBelongsInLaterView;

export function isLaterGroup(
  group: Pick<TaskGroup, "slug"> & Partial<Pick<TaskGroup, "id" | "title">>
): boolean {
  if (group.id === LATER_COLUMN_ID || group.id === BACKLOG_COLUMN_ID) {
    return true;
  }
  if (group.slug === LATER_GROUP_SLUG || group.slug === BACKLOG_GROUP_SLUG) {
    return true;
  }
  return group.title === "Later" || group.title === "Backlog";
}

/** @deprecated Use isLaterGroup */
export const isBacklogGroup = isLaterGroup;

export function createLaterColumn(userId: string): TaskGroup {
  return {
    id: LATER_COLUMN_ID,
    user_id: userId,
    title: "Later",
    slug: LATER_GROUP_SLUG,
    sort_order: 1,
    icon: "",
    color: LATER_GROUP_COLOR,
    sort_mode: "manual",
    created_at: new Date(0).toISOString(),
  };
}

/** @deprecated Use createLaterColumn */
export const createBacklogColumn = createLaterColumn;

function injectLaterColumn(groups: TaskGroup[], userId: string): TaskGroup[] {
  const withoutLater = groups.filter((group) => !isLaterGroup(group));
  const ordered = orderPinnedTaskGroups(withoutLater);
  const todayIndex = ordered.findIndex(isTodayGroup);
  const later = createLaterColumn(userId);

  if (todayIndex === -1) {
    return [later, ...ordered];
  }

  return [
    ...ordered.slice(0, todayIndex + 1),
    later,
    ...ordered.slice(todayIndex + 1),
  ];
}

const DEFAULT_GROUPS: {
  title: string;
  slug: string;
  icon?: string;
  color?: string;
}[] = [
  { title: "Today", slug: TODAY_GROUP_SLUG },
  {
    title: INBOX_GROUP_TITLE,
    slug: INBOX_GROUP_SLUG,
    icon: INBOX_GROUP_ICON,
    color: INBOX_GROUP_COLOR,
  },
  { title: "Study C++", slug: "study-cpp" },
];

export function isTodayGroup(
  group: Pick<TaskGroup, "slug"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  if (group.slug === TODAY_GROUP_SLUG) return true;
  return group.title === "Today" || group.title === "Today's Tasks";
}

export function isInboxGroup(
  group: Pick<TaskGroup, "slug"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  if (group.slug === INBOX_GROUP_SLUG) return true;
  return group.title === INBOX_GROUP_TITLE || group.title === "Tasks";
}

export function isPinnedTaskGroup(
  group: Pick<TaskGroup, "slug" | "id"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  return isTodayGroup(group) || isInboxGroup(group) || isLaterGroup(group);
}

export function isCollapsibleSystemColumn(
  group: Pick<TaskGroup, "slug" | "id" | "title">
): boolean {
  return isLaterGroup(group) || isInboxGroup(group);
}

export function orderPinnedTaskGroups<T extends TaskGroup>(groups: T[]): T[] {
  const inbox = groups.find(isInboxGroup);
  const today = groups.find(isTodayGroup);
  const later = groups.find(isLaterGroup);
  const rest = groups.filter(
    (group) => !isTodayGroup(group) && !isInboxGroup(group) && !isLaterGroup(group)
  );
  const ordered = [
    ...(today ? [today] : []),
    ...(later ? [later] : []),
    ...(inbox ? [inbox] : []),
    ...rest,
  ];

  return ordered.map((group, index) => ({ ...group, sort_order: index }));
}

export function formatTodayColumnTitle(
  dateKey: string,
  todayKey = getTodayDateString()
): string {
  return formatRelativeDateLabel(dateKey, todayKey);
}

export function getGroupDisplayTitle(
  group: Pick<TaskGroup, "title" | "slug">,
  todayViewDate?: string
): string {
  if (isTodayGroup(group) && todayViewDate) {
    return formatTodayColumnTitle(todayViewDate);
  }
  return group.title;
}

export function filterTasksForGroup(
  group: Pick<TaskGroup, "slug" | "id">,
  tasks: Task[],
  todayViewDate: string
): Task[] {
  if (isLaterGroup(group)) {
    return tasks.filter((task) => taskBelongsInLaterView(task));
  }
  if (isTodayGroup(group)) {
    return tasks.filter(
      (task) =>
        taskBelongsInTodayView(task, todayViewDate) &&
        !taskBelongsInLaterView(task)
    );
  }
  return tasks.filter((task) =>
    taskBelongsInOrgGroupView(task, group.id, todayViewDate)
  );
}

export function taskBelongsInTodayView(
  task: Pick<Task, "scheduled_date">,
  todayViewDate: string
): boolean {
  return task.scheduled_date === todayViewDate;
}

/** Org columns show tasks assigned to the group, including those also on Today/Later. */
export function taskBelongsInOrgGroupView(
  task: Pick<Task, "group_id">,
  groupId: string,
  _todayViewDate?: string
): boolean {
  return task.group_id === groupId;
}

export function isOrganizationGroup(
  group: Pick<TaskGroup, "slug" | "id"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  return !isTodayGroup(group) && !isLaterGroup(group);
}

export function migrateTasksFromTodayGroup(
  tasks: Task[],
  todayGroupId: string | undefined,
  inboxGroupId: string | undefined
): Task[] {
  if (!todayGroupId || !inboxGroupId) return tasks;

  return tasks.map((task) =>
    task.group_id === todayGroupId ? { ...task, group_id: inboxGroupId } : task
  );
}

export function buildBoardFromTasks(
  groups: TaskGroup[],
  tasks: Task[],
  todayViewDate: string
): TaskGroupWithTasks[] {
  const orderedGroups = applyLaterColumnSortMode(orderPinnedTaskGroups(groups));

  return orderedGroups.map((group) => {
    const context = getSortContextForGroup(group);
    let filteredTasks: Task[];

    if (isLaterGroup(group)) {
      filteredTasks = tasks.filter((task) => taskBelongsInLaterView(task));
    } else if (isTodayGroup(group)) {
      filteredTasks = tasks.filter(
        (task) =>
          taskBelongsInTodayView(task, todayViewDate) &&
          !taskBelongsInLaterView(task)
      );
    } else {
      filteredTasks = tasks.filter((task) =>
        taskBelongsInOrgGroupView(task, group.id, todayViewDate)
      );
    }

    const { active, completed } = sortActiveAndCompletedForContext(
      filteredTasks,
      context
    );

    return { ...group, tasks: [...active, ...completed] };
  });
}

export function syncTaskOnBoard(
  groups: TaskGroupWithTasks[],
  updated: Task,
  todayViewDate: string
): TaskGroupWithTasks[] {
  const withoutTask = groups.map((group) => ({
    ...group,
    tasks: group.tasks.filter((task) => task.id !== updated.id),
  }));

  return withoutTask.map((group) => {
    const context = getSortContextForGroup(group);

    if (isLaterGroup(group)) {
      if (!taskBelongsInLaterView(updated)) return group;
      const { active, completed } = sortActiveAndCompletedForContext(
        [...group.tasks, updated],
        context
      );
      return { ...group, tasks: [...active, ...completed] };
    }

    if (isTodayGroup(group)) {
      if (
        !taskBelongsInTodayView(updated, todayViewDate) ||
        taskBelongsInLaterView(updated)
      ) {
        return group;
      }
      const { active, completed } = sortActiveAndCompletedForContext(
        [...group.tasks, updated],
        context
      );
      return { ...group, tasks: [...active, ...completed] };
    }

    if (group.id !== updated.group_id) {
      return group;
    }

    const { active, completed } = sortActiveAndCompletedForContext(
      [...group.tasks, updated],
      context
    );
    return { ...group, tasks: [...active, ...completed] };
  });
}

export function replaceTaskOnBoard(
  groups: TaskGroupWithTasks[],
  taskId: string,
  updater: (task: Task) => Task,
  todayViewDate: string
): TaskGroupWithTasks[] {
  let updatedTask: Task | null = null;

  const replaced = groups.map((group) => {
    if (!group.tasks.some((task) => task.id === taskId)) return group;
    const nextTasks = group.tasks.map((task) => {
      if (task.id !== taskId) return task;
      updatedTask = updater(task);
      return updatedTask;
    });
    const { active, completed } = sortActiveAndCompletedForContext(
      nextTasks,
      getSortContextForGroup(group)
    );
    return { ...group, tasks: [...active, ...completed] };
  });

  if (!updatedTask) return groups;
  return syncTaskOnBoard(replaced, updatedTask, todayViewDate);
}

export function addTaskToBoard(
  groups: TaskGroupWithTasks[],
  task: Task,
  todayViewDate: string
): TaskGroupWithTasks[] {
  return groups.map((group) => {
    const context = getSortContextForGroup(group);

    if (isLaterGroup(group)) {
      if (!taskBelongsInLaterView(task)) return group;
      const { active, completed } = sortActiveAndCompletedForContext(
        [...group.tasks, task],
        context
      );
      return { ...group, tasks: [...active, ...completed] };
    }

    if (isTodayGroup(group)) {
      if (
        !taskBelongsInTodayView(task, todayViewDate) ||
        taskBelongsInLaterView(task)
      ) {
        return group;
      }
      const { active, completed } = sortActiveAndCompletedForContext(
        [...group.tasks, task],
        context
      );
      return { ...group, tasks: [...active, ...completed] };
    }

    if (group.id !== task.group_id) {
      return group;
    }

    const { active, completed } = sortActiveAndCompletedForContext(
      [...group.tasks, task],
      context
    );
    return { ...group, tasks: [...active, ...completed] };
  });
}

export function rebuildPlanningColumns(
  groups: TaskGroupWithTasks[],
  todayViewDate: string
): TaskGroupWithTasks[] {
  const tasksById = new Map<string, Task>();

  for (const group of groups) {
    for (const task of group.tasks) {
      tasksById.set(task.id, task);
    }
  }

  const allTasks = [...tasksById.values()];

  return groups.map((group) => {
    if (!isTodayGroup(group)) return group;

    const context = getSortContextForGroup(group);
    const { active, completed } = sortActiveAndCompletedForContext(
      allTasks.filter(
        (task) =>
          taskBelongsInTodayView(task, todayViewDate) &&
          !taskBelongsInLaterView(task)
      ),
      context
    );
    return { ...group, tasks: [...active, ...completed] };
  });
}

/** @deprecated Use rebuildPlanningColumns */
export function rebuildTodayColumn(
  groups: TaskGroupWithTasks[],
  todayViewDate: string
): TaskGroupWithTasks[] {
  return rebuildPlanningColumns(groups, todayViewDate);
}

export function removeTaskFromBoard(
  groups: TaskGroupWithTasks[],
  taskId: string
): TaskGroupWithTasks[] {
  return groups.map((group) => ({
    ...group,
    tasks: group.tasks.filter((task) => task.id !== taskId),
  }));
}

/** @deprecated Use sortTasksForTodayView from @/lib/task-sort */
export function sortTasksForDisplay(tasks: Task[]): Task[] {
  return sortTasksForTodayView(tasks);
}

export function sortActiveAndCompleted(
  tasks: Task[],
  group: TaskGroup | TaskSortContext
) {
  const context: TaskSortContext =
    "sortMode" in group && !("id" in group)
      ? group
      : getSortContextForGroup(group as TaskGroup);
  return sortActiveAndCompletedForContext(tasks, context);
}

async function mergeTaskGroupInto(
  userId: string,
  fromGroupId: string,
  toGroupId: string
): Promise<void> {
  const { error: taskError } = await supabase
    .from("tasks")
    .update({ group_id: toGroupId })
    .eq("group_id", fromGroupId)
    .eq("user_id", userId);

  if (taskError) throw new TaskGroupsError(taskError.message);

  const { error: deleteError } = await supabase
    .from("task_groups")
    .delete()
    .eq("id", fromGroupId)
    .eq("user_id", userId);

  if (deleteError) throw new TaskGroupsError(deleteError.message);
}

async function normalizeUserTaskGroups(
  userId: string,
  groups: TaskGroup[]
): Promise<TaskGroup[]> {
  let next = [...groups].sort((a, b) => a.sort_order - b.sort_order);

  const todayMatches = next.filter((group) => isTodayGroup(group));
  if (todayMatches.length > 1) {
    const keeper =
      todayMatches.find((group) => group.slug === TODAY_GROUP_SLUG) ??
      todayMatches[0];
    const duplicates = todayMatches.filter((group) => group.id !== keeper.id);

    for (const duplicate of duplicates) {
      await mergeTaskGroupInto(userId, duplicate.id, keeper.id);
    }

    if (keeper.title !== "Today" || keeper.slug !== TODAY_GROUP_SLUG) {
      const { data: updated, error } = await supabase
        .from("task_groups")
        .update({ title: "Today", slug: TODAY_GROUP_SLUG })
        .eq("id", keeper.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new TaskGroupsError(error.message);
      next = next
        .filter((group) => !duplicates.some((item) => item.id === group.id))
        .map((group) => (group.id === keeper.id ? updated : group));
    } else {
      next = next.filter(
        (group) => !duplicates.some((item) => item.id === group.id)
      );
    }
  } else if (todayMatches.length === 1) {
    const todayGroup = todayMatches[0];
    if (
      todayGroup.title !== "Today" ||
      todayGroup.slug !== TODAY_GROUP_SLUG
    ) {
      const { data: updated, error } = await supabase
        .from("task_groups")
        .update({ title: "Today", slug: TODAY_GROUP_SLUG })
        .eq("id", todayGroup.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new TaskGroupsError(error.message);
      next = next.map((group) =>
        group.id === todayGroup.id ? updated : group
      );
    }
  }

  const inboxMatches = next.filter((group) => isInboxGroup(group));
  if (inboxMatches.length > 1) {
    const keeper =
      inboxMatches.find((group) => group.slug === INBOX_GROUP_SLUG) ??
      inboxMatches[0];
    const duplicates = inboxMatches.filter((group) => group.id !== keeper.id);

    for (const duplicate of duplicates) {
      await mergeTaskGroupInto(userId, duplicate.id, keeper.id);
    }

    next = next.filter(
      (group) => !duplicates.some((item) => item.id === group.id)
    );
  } else if (inboxMatches.length === 1) {
    const inboxGroup = inboxMatches[0];
    if (
      inboxGroup.title !== INBOX_GROUP_TITLE ||
      inboxGroup.slug !== INBOX_GROUP_SLUG ||
      inboxGroup.icon !== INBOX_GROUP_ICON ||
      inboxGroup.color !== INBOX_GROUP_COLOR
    ) {
      const { data: updated, error } = await supabase
        .from("task_groups")
        .update({
          title: INBOX_GROUP_TITLE,
          slug: INBOX_GROUP_SLUG,
          icon: INBOX_GROUP_ICON,
          color: INBOX_GROUP_COLOR,
        })
        .eq("id", inboxGroup.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw new TaskGroupsError(error.message);
      next = next.map((group) =>
        group.id === inboxGroup.id ? updated : group
      );
    }
  }

  return orderPinnedTaskGroups(next);
}

async function ensureDefaultGroups(userId: string): Promise<TaskGroup[]> {
  const { data: existing, error } = await supabase
    .from("task_groups")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) throw new TaskGroupsError(error.message);

  if (!existing || existing.length === 0) {
    const { data: created, error: insertError } = await supabase
      .from("task_groups")
      .insert(
        DEFAULT_GROUPS.map((group, index) => ({
          user_id: userId,
          title: group.title,
          slug: group.slug,
          sort_order: index,
          ...(group.icon ? { icon: group.icon } : {}),
          ...(group.color ? { color: group.color } : {}),
        }))
      )
      .select();

    if (insertError) throw new TaskGroupsError(insertError.message);
    return created ?? [];
  }

  let groups = await normalizeUserTaskGroups(userId, existing);

  const missingDefaults = DEFAULT_GROUPS.filter(
    (defaults) =>
      !groups.some(
        (group) =>
          group.slug === defaults.slug ||
          (defaults.slug === TODAY_GROUP_SLUG && isTodayGroup(group)) ||
          (defaults.slug === INBOX_GROUP_SLUG && isInboxGroup(group))
      )
  );

  if (missingDefaults.length > 0) {
    const startOrder = groups.length;
    const { data: created, error: insertError } = await supabase
      .from("task_groups")
      .insert(
        missingDefaults.map((group, index) => ({
          user_id: userId,
          title: group.title,
          slug: group.slug,
          sort_order: startOrder + index,
          ...(group.icon ? { icon: group.icon } : {}),
          ...(group.color ? { color: group.color } : {}),
        }))
      )
      .select();

    if (insertError) throw new TaskGroupsError(insertError.message);
    groups = [...groups, ...(created ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }

  return orderPinnedTaskGroups(
    groups.map((group) => ({
      ...group,
      sort_mode: normalizeTaskSortMode(group.sort_mode),
    }))
  );
}

export async function fetchTaskBoard(
  todayViewDate = getTodayDateString()
): Promise<TaskGroupWithTasks[]> {
  const userId = await requireUserId();
  const groups = await ensureDefaultGroups(userId);

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (tasksError) throw new TaskGroupsError(tasksError.message);

  const inboxGroup = groups.find(isInboxGroup);
  const todayGroup = groups.find(isTodayGroup);

  let normalizedTasks: Task[] = (tasks ?? []).map((task) =>
    normalizeTaskManualOrder({
      ...task,
      group_id: task.group_id ?? inboxGroup?.id ?? null,
      notification_enabled: task.notification_enabled ?? true,
      notification_lead_minutes: task.notification_lead_minutes ?? null,
      planning_state: normalizePlanningState(task.planning_state),
      updated_at: task.updated_at ?? task.created_at,
      completed_at: task.completed_at ?? null,
    })
  );

  const legacyTodayTasks = normalizedTasks.filter(
    (task) => todayGroup && task.group_id === todayGroup.id
  );

  if (legacyTodayTasks.length > 0 && inboxGroup) {
    await Promise.all(
      legacyTodayTasks.map((task) =>
        supabase
          .from("tasks")
          .update({ group_id: inboxGroup.id })
          .eq("id", task.id)
          .eq("user_id", userId)
      )
    );
    normalizedTasks = migrateTasksFromTodayGroup(
      normalizedTasks,
      todayGroup?.id,
      inboxGroup.id
    ).map((task) =>
      normalizeTaskManualOrder({
        ...task,
        updated_at: task.updated_at ?? task.created_at,
        completed_at: task.completed_at ?? null,
      })
    );
  }

  normalizedTasks = await repairMissingManualOrders(normalizedTasks);

  return buildBoardFromTasks(
    injectLaterColumn(groups, userId),
    normalizedTasks,
    todayViewDate
  );
}

export async function createTaskGroup(
  title: string,
  options?: { icon?: string | null; color?: string }
): Promise<TaskGroup> {
  const userId = await requireUserId();
  const trimmed = title.trim();

  if (
    trimmed.toLowerCase() === "today" ||
    trimmed.toLowerCase() === "today's tasks"
  ) {
    throw new TaskGroupsError(
      "A Today group already exists. Use the built-in Today column."
    );
  }

  if (trimmed.toLowerCase() === "tasks") {
    throw new TaskGroupsError(
      "An Inbox already exists. Use the built-in Inbox column."
    );
  }

  if (trimmed.toLowerCase() === "later" || trimmed.toLowerCase() === "backlog") {
    throw new TaskGroupsError(
      "Later is a built-in plan column, not a task group."
    );
  }

  const { data: lastGroup } = await supabase
    .from("task_groups")
    .select("sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = lastGroup ? lastGroup.sort_order + 1 : 0;
  const icon = options?.icon?.trim() ? options.icon.trim() : null;

  const { data, error } = await supabase
    .from("task_groups")
    .insert({
      user_id: userId,
      title: trimmed,
      sort_order,
      icon,
      color: options?.color ?? null,
    })
    .select()
    .single();

  if (error) throw new TaskGroupsError(error.message);
  return data;
}

export async function updateTaskGroup(
  groupId: string,
  input: Partial<{
    title: string;
    sort_order: number;
    icon: string | null;
    color: string | null;
    sort_mode: TaskSortMode;
  }>
): Promise<TaskGroup> {
  const userId = await requireUserId();

  if (input.title) {
    const trimmed = input.title.trim();
    const { data: current } = await supabase
      .from("task_groups")
      .select("slug, title")
      .eq("id", groupId)
      .eq("user_id", userId)
      .maybeSingle();

    if (current?.slug === INBOX_GROUP_SLUG) {
      throw new TaskGroupsError("The Inbox group cannot be renamed.");
    }

    if (current?.slug === TODAY_GROUP_SLUG) {
      throw new TaskGroupsError("Today cannot be renamed.");
    }

    if (
      (trimmed === "Today" || trimmed === "Today's Tasks") &&
      current?.slug !== TODAY_GROUP_SLUG
    ) {
      throw new TaskGroupsError("Today is a reserved group name.");
    }

    if (
      (trimmed === "Tasks" || trimmed === INBOX_GROUP_TITLE) &&
      current?.slug !== INBOX_GROUP_SLUG
    ) {
      throw new TaskGroupsError("Inbox is a reserved group name.");
    }
  }

  if (input.icon !== undefined || input.color !== undefined) {
    const { data: current } = await supabase
      .from("task_groups")
      .select("slug")
      .eq("id", groupId)
      .eq("user_id", userId)
      .maybeSingle();

    if (current?.slug === INBOX_GROUP_SLUG) {
      throw new TaskGroupsError("The Inbox group appearance cannot be changed.");
    }
  }

  const { data, error } = await supabase
    .from("task_groups")
    .update({
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.sort_order !== undefined ? { sort_order: input.sort_order } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.sort_mode !== undefined ? { sort_mode: input.sort_mode } : {}),
    })
    .eq("id", groupId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new TaskGroupsError(error.message);
  return data;
}

export async function deleteTaskGroup(groupId: string): Promise<void> {
  const userId = await requireUserId();

  const { data: current } = await supabase
    .from("task_groups")
    .select("slug")
    .eq("id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (
    current?.slug === INBOX_GROUP_SLUG ||
    current?.slug === TODAY_GROUP_SLUG ||
    current?.slug === LATER_GROUP_SLUG
  ) {
    throw new TaskGroupsError("Default groups cannot be deleted.");
  }

  const { error } = await supabase
    .from("task_groups")
    .delete()
    .eq("id", groupId)
    .eq("user_id", userId);

  if (error) throw new TaskGroupsError(error.message);
}

export async function reorderTaskGroups(orderedIds: string[]): Promise<void> {
  const userId = await requireUserId();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("task_groups")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("user_id", userId)
    )
  );
}

function persistableGroupOrderIds(groups: TaskGroupWithTasks[]): string[] {
  return orderPinnedTaskGroups(groups)
    .filter((group) => !isLaterGroup(group))
    .map((group) => group.id);
}

/** Persist only when movable group order changed — fast path for column reorder. */
export async function persistTaskGroupOrderDiff(
  previous: TaskGroupWithTasks[],
  next: TaskGroupWithTasks[]
): Promise<void> {
  const prevIds = persistableGroupOrderIds(previous);
  const nextIds = persistableGroupOrderIds(next);
  if (
    prevIds.length === nextIds.length &&
    prevIds.every((id, index) => id === nextIds[index])
  ) {
    return;
  }
  await reorderTaskGroups(nextIds);
}

export async function persistTaskBoardLayout(
  groups: TaskGroupWithTasks[],
  options?: {
    todayViewDate?: string;
    taskDateAssignments?: { taskId: string; scheduledDate: string }[];
  }
): Promise<void> {
  const userId = await requireUserId();
  const todayViewDate = options?.todayViewDate ?? getTodayDateString();
  const orderedGroups = orderPinnedTaskGroups(groups);
  const persistableGroups = orderedGroups.filter((group) => !isLaterGroup(group));

  await reorderTaskGroups(persistableGroups.map((group) => group.id));

  const dateByTaskId = new Map(
    (options?.taskDateAssignments ?? []).map((item) => [
      item.taskId,
      item.scheduledDate,
    ])
  );

  const updates = new Map<
    string,
    {
      id: string;
      group_id: string | null;
      sort_order: number;
      completed: boolean;
      scheduled_date: string | null;
      scheduled_time: string | null;
      planning_state: PlanningState;
      queue_order?: number | null;
    }
  >();

  for (const group of orderedGroups) {
    if (isTodayGroup(group) || isLaterGroup(group)) continue;

    const manualSort = isManualTaskSortMode(getTaskGroupSortMode(group));

    group.tasks.forEach((task, index) => {
      if (task.group_id !== group.id) return;

      const scheduledDate =
        dateByTaskId.get(task.id) ?? task.scheduled_date ?? null;
      const existing = updates.get(task.id);
      updates.set(task.id, {
        id: task.id,
        group_id: group.id,
        sort_order: manualSort
          ? task.sort_order
          : (existing?.sort_order ?? task.sort_order),
        completed: task.completed,
        scheduled_date: scheduledDate,
        scheduled_time: task.scheduled_time ?? null,
        planning_state: normalizePlanningState(task.planning_state),
      });
    });
  }

  for (const group of orderedGroups.filter(isLaterGroup)) {
    const manualSort = isManualTaskSortMode(getTaskGroupSortMode(group));

    group.tasks.forEach((task, index) => {
      const existing = updates.get(task.id);
      updates.set(task.id, {
        id: task.id,
        group_id: existing?.group_id ?? task.group_id,
        sort_order: manualSort
          ? task.sort_order
          : (existing?.sort_order ?? task.sort_order ?? index),
        completed: task.completed,
        ...LATER_PLANNING_TASK_UPDATES,
        queue_order: null,
      });
    });
  }

  for (const group of orderedGroups.filter(isTodayGroup)) {
    group.tasks.forEach((task, index) => {
      const existing = updates.get(task.id);
      const scheduledDate =
        dateByTaskId.get(task.id) ?? task.scheduled_date ?? todayViewDate;

      updates.set(task.id, {
        id: task.id,
        group_id: existing?.group_id ?? task.group_id,
        sort_order: existing?.sort_order ?? task.sort_order ?? index,
        completed: task.completed,
        scheduled_date: scheduledDate,
        scheduled_time: task.scheduled_time ?? null,
        planning_state: "none",
      });
    });
  }

  await Promise.all(
    [...updates.values()].map((item) =>
      supabase
        .from("tasks")
        .update({
          group_id: item.group_id,
          sort_order: item.sort_order,
          completed: item.completed,
          scheduled_date: item.scheduled_date,
          scheduled_time: item.scheduled_time,
          planning_state: item.planning_state,
          ...(item.queue_order !== undefined
            ? { queue_order: item.queue_order }
            : {}),
        })
        .eq("id", item.id)
        .eq("user_id", userId)
    )
  );
}

type TaskLayoutSnapshot = {
  group_id: string | null;
  sort_order: number;
  completed: boolean;
  scheduled_date: string | null;
  scheduled_time: string | null;
  planning_state: PlanningState;
};

function taskLayoutSnapshot(task: Task): TaskLayoutSnapshot {
  return {
    group_id: task.group_id,
    sort_order: task.sort_order,
    completed: task.completed,
    scheduled_date: task.scheduled_date ?? null,
    scheduled_time: task.scheduled_time ?? null,
    planning_state: normalizePlanningState(task.planning_state),
  };
}

function taskLayoutChanged(previous: Task, next: Task): boolean {
  const a = taskLayoutSnapshot(previous);
  const b = taskLayoutSnapshot(next);
  return (
    a.group_id !== b.group_id ||
    a.sort_order !== b.sort_order ||
    a.completed !== b.completed ||
    a.scheduled_date !== b.scheduled_date ||
    a.scheduled_time !== b.scheduled_time ||
    a.planning_state !== b.planning_state
  );
}

function collectBoardTasks(
  groups: TaskGroupWithTasks[]
): Map<string, Task> {
  const byId = new Map<string, Task>();
  for (const group of groups) {
    for (const task of group.tasks) {
      byId.set(task.id, task);
    }
  }
  return byId;
}

/** Persist only tasks whose layout fields changed — fast path for drag-and-drop. */
export async function persistTaskBoardDiff(
  previous: TaskGroupWithTasks[],
  next: TaskGroupWithTasks[],
  options?: {
    todayViewDate?: string;
    taskDateAssignments?: { taskId: string; scheduledDate: string }[];
  }
): Promise<void> {
  void options?.todayViewDate;
  const userId = await requireUserId();
  const prevById = collectBoardTasks(previous);
  const nextById = collectBoardTasks(next);
  const dateByTaskId = new Map(
    (options?.taskDateAssignments ?? []).map((item) => [
      item.taskId,
      item.scheduledDate,
    ])
  );

  const changed: Task[] = [];
  for (const [id, nextTask] of nextById) {
    const prevTask = prevById.get(id);
    if (!prevTask || !taskLayoutChanged(prevTask, nextTask)) continue;
    changed.push(nextTask);
  }

  if (changed.length === 0) return;

  await Promise.all(
    changed.map((task) => {
      const scheduledDate =
        dateByTaskId.get(task.id) ?? task.scheduled_date ?? null;
      const planningState = normalizePlanningState(task.planning_state);
      return supabase
        .from("tasks")
        .update({
          group_id: task.group_id,
          sort_order: task.sort_order,
          completed: task.completed,
          scheduled_date: scheduledDate,
          scheduled_time: task.scheduled_time ?? null,
          planning_state: planningState,
          ...(planningState === "later" ? { queue_order: null } : {}),
        })
        .eq("id", task.id)
        .eq("user_id", userId);
    })
  );
}

export function getInboxGroupId(groups: TaskGroupWithTasks[]): string | null {
  return groups.find((group) => group.slug === "inbox")?.id ?? groups[0]?.id ?? null;
}

export function defaultTaskDate(): string {
  return getTodayDateString();
}
