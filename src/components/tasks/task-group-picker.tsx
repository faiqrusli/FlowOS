"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGroupDisplayTitle, isLaterGroup, isTodayGroup } from "@/lib/task-groups";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";
import { compactControlTriggerClass } from "@/lib/theme/surface-classes";
import type { TaskGroup } from "@/types/task";

type TaskGroupPickerProps = {
  groups: TaskGroup[];
  currentGroupId: string | null;
  todayViewDate?: string;
  onSelect: (groupId: string) => void;
  className?: string;
};

function organizationGroups(groups: TaskGroup[]) {
  return groups.filter((group) => !isTodayGroup(group) && !isLaterGroup(group));
}

export function TaskGroupPicker({
  groups,
  currentGroupId,
  todayViewDate,
  onSelect,
  className,
}: TaskGroupPickerProps) {
  const [open, setOpen] = useState(false);
  const targets = organizationGroups(groups);
  const currentGroup =
    targets.find((group) => group.id === currentGroupId) ??
    targets.find((group) => group.slug === "inbox") ??
    targets[0];

  if (!currentGroup) return null;

  const currentAppearance = getTaskGroupAppearance(currentGroup);
  const currentName = getGroupDisplayTitle(currentGroup, todayViewDate);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "max-w-full justify-between gap-1.5 px-2 font-medium",
          compactControlTriggerClass,
          className,
        )}
        aria-label={`Group: ${currentName}`}
      >
        <TaskGroupPill
          variant="plain"
          icon={currentAppearance.icon}
          name={currentName}
          appearance={currentAppearance}
        />
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-52 p-1">
        {targets.map((group) => {
          const appearance = getTaskGroupAppearance(group);
          const name = getGroupDisplayTitle(group, todayViewDate);
          const selected = group.id === currentGroup.id;

          return (
            <DropdownMenuItem
              key={group.id}
              onClick={() => {
                onSelect(group.id);
                setOpen(false);
              }}
              className={cn("py-2", selected && "bg-primary-soft")}
            >
              <TaskGroupPill
                variant="plain"
                icon={appearance.icon}
                name={name}
                appearance={appearance}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
