import type { FocusTargetType } from "@/types/focus";

export type NextUpItemType = FocusTargetType;

export type NextUpItemSource = "tasks" | "habits" | "timeline" | "manual";

export type NextUpItem = {
  id: string;
  type: NextUpItemType;
  source: NextUpItemSource;
  originId: string;
  title: string;
  position: number;
  createdAt: string;
  completedAt: string | null;
};

export type NextUpAddInput = {
  type: NextUpItemType;
  source: NextUpItemSource;
  originId: string;
  title: string;
};

const NEXT_UP_ITEM_TYPES: NextUpItemType[] = ["task", "habit"];
const NEXT_UP_ITEM_SOURCES: NextUpItemSource[] = [
  "tasks",
  "habits",
  "timeline",
  "manual",
];

export function isNextUpItemType(value: unknown): value is NextUpItemType {
  return typeof value === "string" && NEXT_UP_ITEM_TYPES.includes(value as NextUpItemType);
}

export function isNextUpItemSource(value: unknown): value is NextUpItemSource {
  return (
    typeof value === "string" &&
    NEXT_UP_ITEM_SOURCES.includes(value as NextUpItemSource)
  );
}

export function isNextUpItem(value: unknown): value is NextUpItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<NextUpItem>;

  return (
    typeof item.id === "string" &&
    isNextUpItemType(item.type) &&
    isNextUpItemSource(item.source) &&
    typeof item.originId === "string" &&
    typeof item.title === "string" &&
    typeof item.position === "number" &&
    Number.isFinite(item.position) &&
    typeof item.createdAt === "string" &&
    (item.completedAt === null || typeof item.completedAt === "string")
  );
}
