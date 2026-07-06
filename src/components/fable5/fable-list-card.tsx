"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  Flag,
  Flame,
  GripVertical,
  Plus,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatDurationShort,
  PRIORITY_META,
  type PlanHabit,
  type PlanItem,
  type PlanTask,
} from "@/components/fable5/data";

function SortableRow({
  item,
  activeId,
  liveSec,
  onToggle,
}: {
  item: PlanItem;
  activeId: string | null;
  liveSec: number;
  onToggle: (item: PlanItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { item } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isTask = item.kind === "task";
  const isActive = activeId === item.id;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/row flow-card-interactive flex items-center gap-2 rounded-lg border border-border/70 bg-card px-2 py-2",
        isActive && "flow-selected border-transparent",
        item.completed && "opacity-55",
        isDragging && "opacity-40",
      )}
    >
      <button
        type="button"
        className="flex size-5 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground/50 opacity-0 transition-opacity group-hover/row:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder or to focus"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => onToggle(item)}
        aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
          item.completed
            ? "border-success bg-success text-primary-foreground"
            : "border-border text-transparent hover:border-primary/60",
        )}
      >
        <Check className="size-3.5" />
      </button>

      {isTask ? (
        <Flag
          className="size-3.5 shrink-0"
          style={{ color: PRIORITY_META[(item as PlanTask).priority].color }}
          aria-hidden
        />
      ) : (
        <Repeat className="size-3.5 shrink-0 text-warning" aria-hidden />
      )}

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[14px] font-medium text-foreground",
          item.completed && "line-through",
        )}
      >
        {isTask ? (item as PlanTask).title : (item as PlanHabit).name}
      </span>

      {isTask ? (
        <span
          className="hidden shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium sm:inline"
          style={{
            color: (item as PlanTask).group.color,
            background: `color-mix(in oklch, ${(item as PlanTask).group.color} 14%, transparent)`,
          }}
        >
          {(item as PlanTask).group.name}
        </span>
      ) : (
        <span className="hidden shrink-0 items-center gap-1 text-[12px] text-warning sm:flex">
          <Flame className="size-3" />
          {(item as PlanHabit).streak}
        </span>
      )}

      <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
        {isTask
          ? formatDurationShort(
              (item as PlanTask).focusedSec + (isActive ? liveSec : 0),
            )
          : (item as PlanHabit).scheduled ?? (item as PlanHabit).cadence}
      </span>
    </li>
  );
}

export function FableListCard({
  title,
  icon,
  items,
  activeId,
  liveSec,
  emptyHint,
  onToggle,
  onAdd,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  items: PlanItem[];
  activeId: string | null;
  liveSec: number;
  emptyHint: string;
  onToggle: (item: PlanItem) => void;
  onAdd?: () => void;
  accent?: string;
}) {
  const remaining = items.filter((i) => !i.completed).length;
  return (
    <section className="flow-surface-card flex min-h-0 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-2 px-3.5 py-2.5">
        <span
          className="grid size-6 place-items-center rounded-md text-muted-foreground"
          style={
            accent
              ? { background: `color-mix(in oklch, ${accent} 14%, transparent)`, color: accent }
              : undefined
          }
        >
          {icon}
        </span>
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
          {remaining}
        </span>
        {onAdd ? (
          <Button
            size="icon-xs"
            variant="ghost"
            className="ml-auto"
            onClick={onAdd}
            aria-label={`Add to ${title}`}
          >
            <Plus />
          </Button>
        ) : null}
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5">
        {items.length === 0 ? (
          <div className="flow-empty flex h-20 items-center justify-center px-4 text-center text-[12px] text-muted-foreground">
            {emptyHint}
          </div>
        ) : (
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-1.5">
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  activeId={activeId}
                  liveSec={liveSec}
                  onToggle={onToggle}
                />
              ))}
            </ul>
          </SortableContext>
        )}
      </div>
    </section>
  );
}
