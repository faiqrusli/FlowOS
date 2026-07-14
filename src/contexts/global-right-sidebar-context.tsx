"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getTodayDateString } from "@/lib/date-utils";
import {
  createBlankNoteInDailyNotes,
  getOrCreateDailyNote,
} from "@/lib/daily-notes";
import {
  GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX,
  GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
  clampSidebarWidth,
  readPersistedSidebarExpanded,
  readPersistedSidebarPanel,
  readPersistedSidebarWidth,
  writePersistedSidebarExpanded,
  writePersistedSidebarPanel,
  writePersistedSidebarWidth,
  type GlobalRightSidebarPanel,
} from "@/lib/global-right-sidebar-persistence";
import { getSidebarCollapsed } from "@/lib/sidebar-preference";
import {
  SHELL_MAIN_WORKSPACE_MIN_WIDTH_PX,
  SHELL_SIDEBAR_COLLAPSED_WIDTH_PX,
  SHELL_SIDEBAR_EXPANDED_WIDTH_PX,
} from "@/lib/shell-dimensions";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";
import type { Note } from "@/types/notes";

const FLOATING_NOTES_STORAGE_KEY = "flowos.floating-notes";
export const SHELL_LAYOUT_EVENT = "flowos-shell-layout";

export function dispatchShellLayoutChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHELL_LAYOUT_EVENT));
}

function computeOverlayMode(expanded: boolean, panelWidth: number): boolean {
  if (typeof window === "undefined") return false;
  const leftCollapsed = getSidebarCollapsed();
  const leftWidth = leftCollapsed
    ? SHELL_SIDEBAR_COLLAPSED_WIDTH_PX
    : SHELL_SIDEBAR_EXPANDED_WIDTH_PX;
  const rightReserve = expanded
    ? panelWidth
    : GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX;
  const remaining = window.innerWidth - leftWidth - rightReserve;
  return remaining < SHELL_MAIN_WORKSPACE_MIN_WIDTH_PX;
}

export type TaskDetailSource = {
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  getTask: (taskId: string) => Task | null;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onMoveToGroup: (taskId: string, groupId: string) => void;
  onPlanningStateChange?: (taskId: string, planningState: PlanningState) => void;
  onToggleComplete?: (task: Task) => void;
};

type SelectTaskOptions = {
  openDetails?: boolean;
};

type GlobalRightSidebarContextValue = {
  activePanel: GlobalRightSidebarPanel;
  expanded: boolean;
  width: number;
  hoverRevealed: boolean;
  setHoverRevealed: (value: boolean) => void;
  /** @deprecated Use overlayMode — responsive min-workspace overlay */
  workplaceHoverMode: boolean;
  overlayMode: boolean;
  visibleWidthPx: number;
  selectedTaskId: string | null;
  selectedNoteId: string | null;
  focusTitleNoteId: string | null;
  notesRefreshKey: number;
  taskDetailSource: TaskDetailSource | null;
  openPanel: (panel: GlobalRightSidebarPanel) => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  setWidth: (width: number) => void;
  adjustWidthByDelta: (delta: number) => void;
  persistSidebarWidth: () => void;
  selectTask: (taskId: string | null, options?: SelectTaskOptions) => void;
  selectNote: (noteId: string | null, options?: { focusTitle?: boolean }) => void;
  clearFocusTitleNoteId: () => void;
  registerTaskDetailSource: (source: TaskDetailSource | null) => void;
  openDailyNote: (dateKey?: string) => Promise<string | null>;
  createNewNote: () => Promise<string | null>;
  openReflection: () => void;
  refreshNotes: () => void;
  requestQuickCapture: () => void;
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
  floatingNotes: Note[];
  openFloatingNote: (note: Note) => void;
  closeFloatingNote: (noteId: string) => void;
  updateFloatingNote: (note: Note) => void;
  openNoteInSidebar: (noteId: string) => void;
  registerWorkplaceTaskHandler: (
    handler: ((task: Task) => void) | null
  ) => void;
  notifyWorkplaceTaskCreated: (task: Task) => void;
};

const GlobalRightSidebarContext =
  createContext<GlobalRightSidebarContextValue | null>(null);

export function GlobalRightSidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activePanel, setActivePanel] = useState<GlobalRightSidebarPanel>(
    readPersistedSidebarPanel
  );
  const [expanded, setExpandedState] = useState(readPersistedSidebarExpanded);
  const [width, setWidthState] = useState(GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX);
  const [hoverRevealed, setHoverRevealed] = useState(false);
  const [overlayMode, setOverlayMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [focusTitleNoteId, setFocusTitleNoteId] = useState<string | null>(null);
  const [notesRefreshKey, setNotesRefreshKey] = useState(0);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState<Note[]>([]);
  const taskDetailSourceRef = useRef<TaskDetailSource | null>(null);
  const workplaceTaskHandlerRef = useRef<((task: Task) => void) | null>(null);
  const [taskDetailSource, setTaskDetailSource] =
    useState<TaskDetailSource | null>(null);
  const expandedRef = useRef(expanded);
  const activePanelRef = useRef(activePanel);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

  useEffect(() => {
    setWidthState(readPersistedSidebarWidth());
  }, []);

  useEffect(() => {
    function recompute() {
      setOverlayMode(computeOverlayMode(expanded, width));
    }
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener(SHELL_LAYOUT_EVENT, recompute);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener(SHELL_LAYOUT_EVENT, recompute);
    };
  }, [expanded, width]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(FLOATING_NOTES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Note[];
      if (Array.isArray(parsed)) setFloatingNotes(parsed);
    } catch {
      // Ignore corrupt session data.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      FLOATING_NOTES_STORAGE_KEY,
      JSON.stringify(floatingNotes)
    );
  }, [floatingNotes]);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
    writePersistedSidebarExpanded(value);
    if (value) setHoverRevealed(false);
    dispatchShellLayoutChange();
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpandedState((previous) => {
      const next = !previous;
      writePersistedSidebarExpanded(next);
      if (next) setHoverRevealed(false);
      queueMicrotask(() => dispatchShellLayoutChange());
      return next;
    });
  }, []);

  const setWidth = useCallback((nextWidth: number) => {
    const clamped = clampSidebarWidth(nextWidth);
    setWidthState(clamped);
    writePersistedSidebarWidth(clamped);
    dispatchShellLayoutChange();
  }, []);

  const adjustWidthByDelta = useCallback((delta: number) => {
    setWidthState((previous) => clampSidebarWidth(previous + delta));
  }, []);

  const persistSidebarWidth = useCallback(() => {
    setWidthState((current) => {
      writePersistedSidebarWidth(current);
      dispatchShellLayoutChange();
      return current;
    });
  }, []);

  const openPanel = useCallback(
    (panel: GlobalRightSidebarPanel) => {
      if (expandedRef.current && activePanelRef.current === panel) {
        setExpanded(false);
        return;
      }
      setActivePanel(panel);
      writePersistedSidebarPanel(panel);
      setExpanded(true);
    },
    [setExpanded]
  );

  const selectTask = useCallback(
    (taskId: string | null, options?: SelectTaskOptions) => {
      setSelectedTaskId(taskId);
      if (taskId && options?.openDetails !== false) {
        setActivePanel("details");
        writePersistedSidebarPanel("details");
        setExpanded(true);
      }
    },
    [setExpanded]
  );

  const selectNote = useCallback(
    (noteId: string | null, options?: { focusTitle?: boolean }) => {
      setSelectedNoteId(noteId);
      if (options?.focusTitle && noteId) {
        setFocusTitleNoteId(noteId);
      }
    },
    []
  );

  const clearFocusTitleNoteId = useCallback(() => {
    setFocusTitleNoteId(null);
  }, []);

  const registerTaskDetailSource = useCallback(
    (source: TaskDetailSource | null) => {
      taskDetailSourceRef.current = source;
      setTaskDetailSource(source);
    },
    []
  );

  const refreshNotes = useCallback(() => {
    setNotesRefreshKey((key) => key + 1);
  }, []);

  const openDailyNote = useCallback(
    async (dateKey = getTodayDateString()) => {
      try {
        const note = await getOrCreateDailyNote(dateKey);
        setActivePanel("notes");
        writePersistedSidebarPanel("notes");
        setExpanded(true);
        setSelectedNoteId(note.id);
        setFocusTitleNoteId(null);
        refreshNotes();
        return note.id;
      } catch {
        return null;
      }
    },
    [refreshNotes, setExpanded]
  );

  const createNewNote = useCallback(async () => {
    try {
      const note = await createBlankNoteInDailyNotes();
      setActivePanel("notes");
      writePersistedSidebarPanel("notes");
      setExpanded(true);
      setSelectedNoteId(note.id);
      setFocusTitleNoteId(note.id);
      refreshNotes();
      return note.id;
    } catch {
      return null;
    }
  }, [refreshNotes, setExpanded]);

  const openReflection = useCallback(() => {
    openPanel("reflection");
  }, [openPanel]);

  const requestQuickCapture = useCallback(() => {
    setQuickCaptureOpen(true);
  }, []);

  const openFloatingNote = useCallback((note: Note) => {
    setFloatingNotes((current) => {
      if (current.some((item) => item.id === note.id)) {
        return current.map((item) => (item.id === note.id ? note : item));
      }
      return [...current, note];
    });
  }, []);

  const closeFloatingNote = useCallback((noteId: string) => {
    setFloatingNotes((current) => current.filter((note) => note.id !== noteId));
  }, []);

  const updateFloatingNote = useCallback((note: Note) => {
    setFloatingNotes((current) => {
      const index = current.findIndex((item) => item.id === note.id);
      if (index === -1) return current;

      const existing = current[index];
      if (
        existing.title === note.title &&
        existing.content === note.content &&
        existing.updated_at === note.updated_at &&
        existing.is_menu_pinned === note.is_menu_pinned
      ) {
        return current;
      }

      return current.map((item) => (item.id === note.id ? note : item));
    });
  }, []);

  const openNoteInSidebar = useCallback(
    (noteId: string) => {
      setSelectedNoteId(noteId);
      setActivePanel("notes");
      writePersistedSidebarPanel("notes");
      setExpanded(true);
    },
    [setExpanded]
  );

  const registerWorkplaceTaskHandler = useCallback(
    (handler: ((task: Task) => void) | null) => {
      workplaceTaskHandlerRef.current = handler;
    },
    []
  );

  const notifyWorkplaceTaskCreated = useCallback((task: Task) => {
    workplaceTaskHandlerRef.current?.(task);
  }, []);

  // Overlay: reserve rail only. Push: reserve full expanded width.
  const visibleWidthPx = overlayMode
    ? GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX
    : expanded
      ? width
      : GLOBAL_RIGHT_SIDEBAR_COLLAPSED_WIDTH_PX;

  const value = useMemo<GlobalRightSidebarContextValue>(
    () => ({
      activePanel,
      expanded,
      width,
      hoverRevealed,
      setHoverRevealed,
      workplaceHoverMode: overlayMode,
      overlayMode,
      visibleWidthPx,
      selectedTaskId,
      selectedNoteId,
      focusTitleNoteId,
      notesRefreshKey,
      taskDetailSource,
      openPanel,
      toggleExpanded,
      setExpanded,
      setWidth,
      adjustWidthByDelta,
      persistSidebarWidth,
      selectTask,
      selectNote,
      clearFocusTitleNoteId,
      registerTaskDetailSource,
      openDailyNote,
      createNewNote,
      openReflection,
      refreshNotes,
      requestQuickCapture,
      quickCaptureOpen,
      setQuickCaptureOpen,
      floatingNotes,
      openFloatingNote,
      closeFloatingNote,
      updateFloatingNote,
      openNoteInSidebar,
      registerWorkplaceTaskHandler,
      notifyWorkplaceTaskCreated,
    }),
    [
      activePanel,
      expanded,
      width,
      hoverRevealed,
      overlayMode,
      visibleWidthPx,
      selectedTaskId,
      selectedNoteId,
      focusTitleNoteId,
      notesRefreshKey,
      taskDetailSource,
      openPanel,
      toggleExpanded,
      setExpanded,
      setWidth,
      adjustWidthByDelta,
      persistSidebarWidth,
      selectTask,
      selectNote,
      clearFocusTitleNoteId,
      registerTaskDetailSource,
      openDailyNote,
      createNewNote,
      openReflection,
      refreshNotes,
      requestQuickCapture,
      quickCaptureOpen,
      floatingNotes,
      openFloatingNote,
      closeFloatingNote,
      updateFloatingNote,
      openNoteInSidebar,
      registerWorkplaceTaskHandler,
      notifyWorkplaceTaskCreated,
    ]
  );

  return (
    <GlobalRightSidebarContext.Provider value={value}>
      {children}
    </GlobalRightSidebarContext.Provider>
  );
}

export function useGlobalRightSidebar() {
  const context = useContext(GlobalRightSidebarContext);
  if (!context) {
    throw new Error(
      "useGlobalRightSidebar must be used within GlobalRightSidebarProvider"
    );
  }
  return context;
}

export function useGlobalRightSidebarOffsetPx() {
  const { visibleWidthPx } = useGlobalRightSidebar();
  return visibleWidthPx;
}
