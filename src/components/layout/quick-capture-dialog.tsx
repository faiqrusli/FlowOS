"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchTaskBoard, isInboxGroup, isOrganizationGroup } from "@/lib/task-groups";
import { createQuickCaptureTask } from "@/lib/quick-capture-task";
import { TasksError } from "@/lib/tasks";
import { getTodayDateString } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleDatePickerField } from "@/components/ui/schedule-picker-field";
import { TaskPrioritySelect } from "@/components/tasks/task-priority-select";
import { useActionToast } from "@/contexts/action-toast-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  getTaskGroupAppearance,
  TASK_GROUP_SWATCH_CLASS,
} from "@/lib/task-group-appearance";
import type { TaskPriority } from "@/lib/task-priority";
import { DEFAULT_TASK_SORT_MODE, getTaskGroupSortMode } from "@/lib/task-sort";
import { cn } from "@/lib/utils";
import { compactControlTriggerClass } from "@/lib/theme/surface-classes";
import type { PlanningState, TaskGroupWithTasks } from "@/types/task";

export function QuickCaptureDialog() {
  const router = useRouter();
  const {
    quickCaptureOpen,
    setQuickCaptureOpen,
    notifyWorkplaceTaskCreated,
    selectTask,
  } = useGlobalRightSidebar();
  const { showActionToast } = useActionToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>("low");
  const [planningState, setPlanningState] = useState<PlanningState>("none");
  const [scheduledDate, setScheduledDate] = useState(getTodayDateString());
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSortMode = useMemo(() => {
    const group = groups.find((item) => item.id === selectedGroupId);
    return group
      ? (getTaskGroupSortMode(group) ?? DEFAULT_TASK_SORT_MODE)
      : DEFAULT_TASK_SORT_MODE;
  }, [groups, selectedGroupId]);
  const selectedGroupAppearance = useMemo(() => {
    const group = groups.find((item) => item.id === selectedGroupId);
    return group ? getTaskGroupAppearance(group) : null;
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!quickCaptureOpen) {
      setTitle("");
      setDescription("");
      setShowDescription(false);
      setShowPlanning(false);
      setPriority("low");
      setPlanningState("none");
      setScheduledDate(getTodayDateString());
      setGroups([]);
      setSelectedGroupId("");
      setError(null);
    }
  }, [quickCaptureOpen]);

  useEffect(() => {
    if (!quickCaptureOpen) return;
    void (async () => {
      try {
        const boardGroups = (await fetchTaskBoard()).filter(isOrganizationGroup);
        setGroups(boardGroups);
        const inbox = boardGroups.find(isInboxGroup);
        if (inbox) setSelectedGroupId(inbox.id);
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to load groups.",
        );
      }
    })();
  }, [quickCaptureOpen]);

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);

    try {
      const created = await createQuickCaptureTask({
        title: trimmed,
        description: showDescription ? description.trim() || null : null,
        groupId: selectedGroupId || undefined,
        priority,
        scheduledDate: scheduledDate || null,
        planningState: showPlanning ? planningState : "none",
      });

      const handled = notifyWorkplaceTaskCreated(created);
      if (!handled) {
        showActionToast({
          message: "Task created successfully",
          tone: "success",
          icon: "check",
          actionLabel: "View",
          onAction: () => {
            selectTask(created.id);
            router.push("/tasks");
          },
        });
      }

      setQuickCaptureOpen(false);
      setTitle("");
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to create task.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={quickCaptureOpen} onOpenChange={setQuickCaptureOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick capture</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSubmit();
              }
            }}
          />

          <div className="grid grid-cols-3 gap-2">
            <ScheduleDatePickerField
              value={scheduledDate}
              onChange={(dateKey) =>
                setScheduledDate(dateKey ?? getTodayDateString())
              }
              placeholder="Pick date"
              className="h-9"
            />
            <TaskPrioritySelect
              value={priority}
              onChange={setPriority}
              className="h-9"
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(compactControlTriggerClass, "h-9 w-full gap-2 px-2.5 text-sm")}
                aria-label="Group"
              >
                <span
                  className={cn(
                    "inline-flex size-4 shrink-0 items-center justify-center",
                    selectedGroupAppearance
                      ? ""
                      : "rounded-full bg-surface-overlay",
                  )}
                >
                  {selectedGroupAppearance ? (
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        TASK_GROUP_SWATCH_CLASS[
                          selectedGroupAppearance.colorKey
                        ],
                      )}
                      aria-hidden
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 truncate text-left">
                  {groups.find((group) => group.id === selectedGroupId)
                    ?.title ?? "Group"}
                </span>
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                className="min-w-[12rem]"
              >
                {groups.map((group) => {
                  const appearance = getTaskGroupAppearance(group);
                  return (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => setSelectedGroupId(group.id)}
                      className={cn(
                        "gap-2",
                        group.id === selectedGroupId &&
                          "bg-primary-soft font-medium",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          TASK_GROUP_SWATCH_CLASS[appearance.colorKey],
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {group.title}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowDescription((value) => !value)}
            >
              + Description
            </button>
            <button
              type="button"
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowPlanning((value) => !value)}
            >
              + Planning
            </button>
          </div>

          {showDescription ? (
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              rows={3}
              className="resize-none"
            />
          ) : null}

          {showPlanning ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Plan</span>
              <div className="inline-flex rounded-lg border border-border-subtle bg-control-default p-0.5">
                {(["none", "later"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPlanningState(item)}
                    className={cn(
                      "rounded-md px-2.5 py-0.5 text-[14px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
                      planningState === item
                        ? "bg-surface-base text-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-control-hover hover:text-foreground",
                    )}
                  >
                    {item === "none" ? "Normal" : "Later"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setQuickCaptureOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving || !title.trim()}
          >
            {saving ? "Adding…" : "Add task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
