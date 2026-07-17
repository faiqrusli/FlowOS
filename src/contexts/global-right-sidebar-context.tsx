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
import { usePathname } from "next/navigation";
import { getTodayDateString } from "@/lib/date-utils";
import {
  createBlankNoteInDailyNotes,
  getOrCreateDailyNote,
} from "@/lib/daily-notes";
import {
  GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX,
  GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
  GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX,
  GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX,
  readPersistedSidebarExpanded,
  readPersistedSidebarPanel,
  readPersistedSidebarWidth,
  writePersistedSidebarExpanded,
  writePersistedSidebarPanel,
  writePersistedSidebarWidth,
  type GlobalRightSidebarPanel,
} from "@/lib/global-right-sidebar-persistence";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";
import type { Note } from "@/types/notes";

const FLOATING_NOTES_STORAGE_KEY = "flowos.floating-notes";

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
  workplaceHoverMode: boolean;
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
  const pathname = usePathname();
  const workplaceHoverMode =
    pathname === "/" || pathname === "/workplace";

  const [activePanel, setActivePanel] = useState<GlobalRightSidebarPanel>(
    readPersistedSidebarPanel
  );
  const [expanded, setExpandedState] = useState(readPersistedSidebarExpanded);
  const [width, setWidthState] = useState(GLOBAL_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX);
  const [hoverRevealed, setHoverRevealed] = useState(false);
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

  useEffect(() => {
    setWidthState(readPersistedSidebarWidth());
  }, []);

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
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpandedState((previous) => {
      const next = !previous;
      writePersistedSidebarExpanded(next);
      if (next) setHoverRevealed(false);
      return next;
    });
  }, []);

  const setWidth = useCallback((nextWidth: number) => {
    const clamped = Math.min(
      GLOBAL_RIGHT_SIDEBAR_MAX_WIDTH_PX,
      Math.max(GLOBAL_RIGHT_SIDEBAR_MIN_WIDTH_PX, nextWidth)
    );
    setWidthState(clamped);
    writePersistedSidebarWidth(clamped);
  }, []);

  const openPanel = useCallback(
    (panel: GlobalRightSidebarPanel) => {
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

  // Today/workplace: always reserve collapsed rail width in layout so
  // expand/collapse overlay does not reflow the page. Other routes consume full width.
  const visibleWidthPx = GLOBAL_RIGHT_SIDEBAR_LAYOUT_RESERVE_PX;

  const value = useMemo<GlobalRightSidebarContextValue>(
    () => ({
      activePanel,
      expanded,
      width,
      hoverRevealed,
      setHoverRevealed,
      workplaceHoverMode,
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
      workplaceHoverMode,
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
