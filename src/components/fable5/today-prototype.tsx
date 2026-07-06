"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CalendarClock, ListChecks, Repeat, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INITIAL_HABITS,
  INITIAL_TASKS,
  INITIAL_TIMELINE,
  type PlanHabit,
  type PlanItem,
  type PlanTask,
} from "@/components/fable5/data";
import { useFocusEngine } from "@/components/fable5/use-focus-engine";
import { FableFocusCard } from "@/components/fable5/fable-focus-card";
import { FableListCard } from "@/components/fable5/fable-list-card";
import { FableTimeline } from "@/components/fable5/fable-timeline";
import { FableTopNav, type PageMode } from "@/components/fable5/fable-top-nav";
import { FableRightRail } from "@/components/fable5/fable-right-rail";
import { FableQuickCapture } from "@/components/fable5/fable-quick-capture";

type DragState = "idle" | "valid" | "invalid";

export function TodayPrototype() {
  const [mode, setMode] = useState<PageMode>("full");
  const [tasks, setTasks] = useState<PlanTask[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<PlanHabit[]>(INITIAL_HABITS);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [railOpen, setRailOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false); // focus-mode hover panels pinned
  const [clock, setClock] = useState("00:00");
  const [nowMinutes, setNowMinutes] = useState(9 * 60 + 45);

  const [activeDrag, setActiveDrag] = useState<PlanItem | null>(null);
  const [dragState, setDragState] = useState<DragState>("idle");
  const [completingId, setCompletingId] = useState<string | null>(null);

  const banked = useCallback((targetId: string, delta: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === targetId ? { ...t, focusedSec: t.focusedSec + delta } : t,
      ),
    );
  }, []);

  const engine = useFocusEngine(banked);
  const engineRef = useRef(engine);
  useEffect(() => {
    engineRef.current = engine;
  }, [engine]);

  // live clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  // Ctrl+Shift+F cycles modes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        setMode((m) => (m === "full" ? "focus" : m === "focus" ? "work" : "full"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const openHabits = useMemo(() => habits.filter((h) => !h.completed), [habits]);

  const nowTask = useMemo(() => {
    if (engine.activeId) {
      const found = tasks.find((t) => t.id === engine.activeId);
      if (found && !found.completed) return found;
    }
    return openTasks[0] ?? null;
  }, [engine.activeId, tasks, openTasks]);

  const nextTask = useMemo(
    () => openTasks.find((t) => t.id !== nowTask?.id) ?? null,
    [openTasks, nowTask],
  );

  const totalCount = tasks.length + habits.length;
  const doneCount =
    tasks.filter((t) => t.completed).length +
    habits.filter((h) => h.completed).length;
  const progressPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const liveSec = engine.mode === "running" ? engine.sessionFocusSec : 0;

  const handleStart = useCallback(() => {
    const target = nowTask?.id ?? null;
    engineRef.current.start(target);
  }, [nowTask]);

  const handleToggle = useCallback((item: PlanItem) => {
    if (item.kind === "task") {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === item.id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } else {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, completed: !h.completed } : h,
        ),
      );
    }
  }, []);

  // Done with completion animation + auto-advance to next
  const handleDone = useCallback(
    (task: PlanTask) => {
      if (completingId) return;
      const upcoming = openTasks.find((t) => t.id !== task.id) ?? null;
      setCompletingId(task.id);
      window.setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)),
        );
        setCompletingId(null);
        const eng = engineRef.current;
        const wasActive = eng.mode === "running" || eng.mode === "paused";
        if (upcoming && eng.autoAdvance && wasActive) {
          eng.setActive(upcoming.id); // keep the timer running into the next task
        } else if (upcoming) {
          eng.setActive(upcoming.id);
          if (!eng.autoAdvance) eng.stop();
        } else {
          eng.stop();
        }
      }, 900);
    },
    [completingId, openTasks],
  );

  const handleSkip = useCallback(() => {
    if (nextTask) engineRef.current.setActive(nextTask.id);
  }, [nextTask]);

  const handleCapture = useCallback(
    (title: string, kind: "task" | "habit") => {
      if (kind === "task") {
        setTasks((prev) => [
          ...prev,
          {
            id: `t-${Date.now()}`,
            title,
            group: { name: "Inbox", color: "var(--muted-foreground)" },
            priority: "none",
            estimateMin: 25,
            focusedSec: 0,
            completed: false,
            kind: "task",
          },
        ]);
      } else {
        setHabits((prev) => [
          ...prev,
          {
            id: `h-${Date.now()}`,
            name: title,
            cadence: "Daily",
            streak: 0,
            trackWithFocus: true,
            completed: false,
            kind: "habit",
          },
        ]);
      }
    },
    [],
  );

  // ---- Drag handling -------------------------------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = (e: DragStartEvent) => {
    setActiveDrag((e.active.data.current?.item as PlanItem) ?? null);
  };

  const onDragOver = (e: DragOverEvent) => {
    const item = e.active.data.current?.item as PlanItem | undefined;
    if (e.over?.id === "focus-dropzone" && item) {
      const focusable = item.kind === "task" || item.trackWithFocus;
      setDragState(focusable ? "valid" : "invalid");
    } else {
      setDragState("idle");
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const item = e.active.data.current?.item as PlanItem | undefined;
    const overId = e.over?.id;
    setActiveDrag(null);
    setDragState("idle");
    if (!item || !overId) return;

    // Dropped on the focus card
    if (overId === "focus-dropzone") {
      if (item.kind === "task") {
        // arm as Now; if a session is live, swap without stopping
        engineRef.current.setActive(item.id);
      } else if (item.trackWithFocus) {
        engineRef.current.setActive(item.id);
      }
      return; // invalid habit: no-op (visual feedback already shown)
    }

    // Reorder within the matching list
    if (item.kind === "task") {
      setTasks((prev) => {
        const from = prev.findIndex((t) => t.id === item.id);
        const to = prev.findIndex((t) => t.id === overId);
        if (from === -1 || to === -1) return prev;
        return arrayMove(prev, from, to);
      });
    } else {
      setHabits((prev) => {
        const from = prev.findIndex((h) => h.id === item.id);
        const to = prev.findIndex((h) => h.id === overId);
        if (from === -1 || to === -1) return prev;
        return arrayMove(prev, from, to);
      });
    }
  };

  const isFocus = mode === "focus";
  const isWork = mode === "work";
  const showSidePanels = !isFocus || supportOpen;

  return (
    <div className="flow-workspace flex h-full min-h-0 flex-col">
      <FableTopNav
        mode={mode}
        onModeChange={setMode}
        timelineOpen={timelineOpen}
        onToggleTimeline={() => setTimelineOpen((v) => !v)}
        railOpen={railOpen}
        onToggleRail={() => setRailOpen((v) => !v)}
        progressPct={progressPct}
        remaining={openTasks.length + openHabits.length}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
          {/* LEFT COLUMN: tasks + habits (hidden-by-default in Focus) */}
          {!isFocus ? (
            <div
              className={cn(
                "flex min-h-0 w-[300px] shrink-0 flex-col gap-3",
                isWork && "w-[340px]",
              )}
            >
              <div className="min-h-0 flex-1">
                <FableListCard
                  title="Tasks"
                  icon={<ListChecks className="size-4" />}
                  items={tasks}
                  activeId={engine.activeId}
                  liveSec={liveSec}
                  emptyHint="All clear — capture something below."
                  onToggle={handleToggle}
                  onAdd={() => {}}
                />
              </div>
              <div className="min-h-0 flex-1">
                <FableListCard
                  title="Habits"
                  icon={<Repeat className="size-4" />}
                  items={habits}
                  activeId={engine.activeId}
                  liveSec={liveSec}
                  emptyHint="Drag a habit here to start tracking."
                  onToggle={handleToggle}
                  accent="var(--warning)"
                />
              </div>
            </div>
          ) : null}

          {/* CENTER: focus hero */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <FableFocusCard
              engine={engine}
              nowTask={nowTask}
              nextTask={nextTask}
              clock={clock}
              dragState={dragState}
              completingId={completingId}
              onStart={handleStart}
              onDone={handleDone}
              onSkip={handleSkip}
              compact={isWork}
            />

            {/* Queue lives directly under Focus on Full/Work */}
            {!isFocus ? (
              <div className="h-[168px] shrink-0">
                <FableListCard
                  title="Up next — queue"
                  icon={<Target className="size-4" />}
                  items={openTasks.slice(1)}
                  activeId={engine.activeId}
                  liveSec={liveSec}
                  emptyHint="Nothing queued. Drag tasks here to line them up."
                  onToggle={handleToggle}
                  accent="var(--primary)"
                />
              </div>
            ) : null}

            {/* Focus-mode reveal affordance */}
            {isFocus ? (
              <button
                type="button"
                onClick={() => setSupportOpen((v) => !v)}
                className="shrink-0 self-center rounded-full border border-border bg-card px-3 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {supportOpen ? "Hide support panels" : "Show tasks, habits & timeline"}
              </button>
            ) : null}
          </div>

          {/* TIMELINE */}
          {timelineOpen && (showSidePanels || isWork) ? (
            <div className="w-[260px] shrink-0">
              <FableTimeline blocks={INITIAL_TIMELINE} nowMinutes={nowMinutes} />
            </div>
          ) : null}

          {/* RIGHT RAIL */}
          {railOpen && showSidePanels ? (
            <div className="w-[280px] shrink-0">
              <FableRightRail />
            </div>
          ) : null}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDrag ? (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-surface-dialog px-3 py-2 text-[14px] font-medium shadow-lg",
                dragState === "invalid"
                  ? "border-warning/60 text-warning"
                  : "border-primary/50 text-foreground",
              )}
            >
              <CalendarClock className="size-4 text-muted-foreground" />
              {activeDrag.kind === "task"
                ? activeDrag.title
                : activeDrag.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* QUICK CAPTURE — sticky on Full/Work, hidden in Focus */}
      {!isFocus ? (
        <div className="shrink-0 px-3 pb-3">
          <FableQuickCapture onCapture={handleCapture} />
        </div>
      ) : null}
    </div>
  );
}
