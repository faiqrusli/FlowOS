import {
  formatInAppTimezone,
  formatNowTimeInAppTimezone,
  getMinutesFromTimestamp,
  getNowMinutesInAppTimezone,
  parseTimestamp,
} from "@/lib/date-utils";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";
import type { ScheduleItem, ScheduleSummary } from "@/types/schedule";

export type TimelineEntry =
  | { kind: "item"; item: ScheduleItem; itemIndex: number }
  | { kind: "now" };

export type ItemTimelineStatus = "past" | "current" | "future";

export function buildFocusScheduleItem(
  session: StoredActiveFocusSession
): ScheduleItem {
  const startedAt = parseTimestamp(session.started_at);
  const startLabel = formatInAppTimezone(startedAt, {
    hour: "numeric",
    minute: "2-digit",
  });

  let endLabel: string | null = null;
  let timeEndSort: number | undefined;

  if (session.timer_type === "pomodoro" && session.phase_end_at_ms) {
    const endDate = new Date(session.phase_end_at_ms);
    endLabel = formatInAppTimezone(endDate, {
      hour: "numeric",
      minute: "2-digit",
    });
    timeEndSort = getMinutesFromTimestamp(endDate);
  }

  const subtitle =
    session.timer_type === "pomodoro"
      ? session.mode === "break"
        ? "Pomodoro · Break"
        : "Pomodoro"
      : session.mode === "break"
        ? "Quick Focus · Break"
        : "Quick Focus";

  return {
    id: "focus-active",
    entityId: "focus-active",
    title: "Focus Session",
    subtitle,
    type: "focus",
    time: startLabel,
    timeEnd: endLabel,
    timeSort: getMinutesFromTimestamp(startedAt),
    timeEndSort,
    completed: false,
    href: "/focus",
    isActiveFocus: true,
  };
}

export function mergeFocusIntoScheduleItems(
  items: ScheduleItem[],
  focusSession: StoredActiveFocusSession | null
): ScheduleItem[] {
  if (!focusSession) return items;

  const focusItem = buildFocusScheduleItem(focusSession);
  return [...items, focusItem].sort((a, b) => a.timeSort - b.timeSort);
}

export function buildTimelineEntries(
  items: ScheduleItem[],
  nowMinutes = getNowMinutesInAppTimezone()
): TimelineEntry[] {
  if (items.length === 0) {
    return [{ kind: "now" }];
  }

  const entries: TimelineEntry[] = [];
  let nowInserted = false;

  items.forEach((item, itemIndex) => {
    if (!nowInserted && item.timeSort > nowMinutes) {
      entries.push({ kind: "now" });
      nowInserted = true;
    }

    entries.push({ kind: "item", item, itemIndex });
  });

  if (!nowInserted) {
    entries.push({ kind: "now" });
  }

  return entries;
}

export function findCurrentItemIndex(
  items: ScheduleItem[],
  nowMinutes = getNowMinutesInAppTimezone()
): number | null {
  let currentIndex: number | null = null;

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (item.type === "focus" && item.isActiveFocus) {
      return index;
    }

    if (item.timeSort > nowMinutes) {
      continue;
    }

    if (!item.completed) {
      currentIndex = index;
    }
  }

  if (currentIndex !== null) {
    return currentIndex;
  }

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (item.timeSort > nowMinutes && !item.completed) {
      return index;
    }
  }

  return null;
}

export function getItemTimelineStatus(
  item: ScheduleItem,
  itemIndex: number,
  currentIndex: number | null,
  nowMinutes = getNowMinutesInAppTimezone()
): ItemTimelineStatus {
  if (item.type === "focus" && item.isActiveFocus) {
    return "current";
  }

  if (currentIndex === itemIndex) {
    return "current";
  }

  if (item.timeSort <= nowMinutes) {
    return "past";
  }

  return "future";
}

export function computeScheduleSummary(
  items: ScheduleItem[],
  nowMinutes = getNowMinutesInAppTimezone()
): ScheduleSummary {
  const completable = items.filter((item) => item.type !== "focus");
  const completed = completable.filter((item) => item.completed).length;
  const remaining = completable.filter((item) => !item.completed).length;

  const nextItem =
    completable.find(
      (item) => !item.completed && item.timeSort >= nowMinutes
    ) ??
    completable.find((item) => !item.completed) ??
    null;

  return {
    completed,
    total: completable.length,
    remaining,
    nextItem,
  };
}

export function formatNowMarkerLabel(date = new Date()): string {
  return `NOW (${formatNowTimeInAppTimezone(date)})`;
}

export function formatScheduleTimeRange(item: ScheduleItem): string | null {
  if (item.time && item.timeEnd) {
    return `${item.time} – ${item.timeEnd}`;
  }

  return item.time;
}
