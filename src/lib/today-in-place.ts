export const TODAY_FOCUS_ANCHOR_ID = "today-focus-card";
export const TODAY_TASKS_SECTION_ID = "today-tasks-section";
export const TODAY_HABITS_SECTION_ID = "today-habits-section";

export function todayTaskAnchorId(taskId: string): string {
  return `today-task-${taskId}`;
}

export function todayHabitAnchorId(habitId: string): string {
  return `today-habit-${habitId}`;
}

const HIGHLIGHT_CLASSES = [
  "ring-2",
  "ring-primary",
  "ring-offset-2",
  "ring-offset-background",
  "rounded-md",
] as const;

export function scrollToTodayTarget(elementId: string): boolean {
  if (typeof document === "undefined") return false;

  const element = document.getElementById(elementId);
  if (!element) return false;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
  element.classList.add(...HIGHLIGHT_CLASSES);

  window.setTimeout(() => {
    element.classList.remove(...HIGHLIGHT_CLASSES);
  }, 2000);

  return true;
}
