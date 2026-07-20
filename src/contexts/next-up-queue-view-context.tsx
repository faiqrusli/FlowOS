"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NextUpQueueViewValue = {
  /** 1-based queue position, or null when the task is not queued. */
  getTaskQueuePosition: (taskId: string) => number | null;
  /** Open Next Up (if needed), scroll to the task, and flash a brief highlight. */
  revealQueuedTask: (taskId: string) => void;
};

type NextUpQueueViewController = {
  setTaskPositions: (positions: ReadonlyMap<string, number>) => void;
  setRevealHandler: (handler: ((taskId: string) => void) | null) => void;
};

const NextUpQueueViewContext = createContext<NextUpQueueViewValue | null>(null);
const NextUpQueueViewControllerContext =
  createContext<NextUpQueueViewController | null>(null);

export function NextUpQueueViewProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<ReadonlyMap<string, number>>(
    () => new Map(),
  );
  const revealHandlerRef = useRef<((taskId: string) => void) | null>(null);

  const setRevealHandler = useCallback(
    (handler: ((taskId: string) => void) | null) => {
      revealHandlerRef.current = handler;
    },
    [],
  );

  const controller = useMemo<NextUpQueueViewController>(
    () => ({
      setTaskPositions: setPositions,
      setRevealHandler,
    }),
    [setRevealHandler],
  );

  const value = useMemo<NextUpQueueViewValue>(
    () => ({
      getTaskQueuePosition: (taskId: string) => positions.get(taskId) ?? null,
      revealQueuedTask: (taskId: string) => {
        revealHandlerRef.current?.(taskId);
      },
    }),
    [positions],
  );

  return (
    <NextUpQueueViewControllerContext.Provider value={controller}>
      <NextUpQueueViewContext.Provider value={value}>
        {children}
      </NextUpQueueViewContext.Provider>
    </NextUpQueueViewControllerContext.Provider>
  );
}

export function useNextUpQueueView(): NextUpQueueViewValue | null {
  return useContext(NextUpQueueViewContext);
}

export function useNextUpQueueViewController(): NextUpQueueViewController | null {
  return useContext(NextUpQueueViewControllerContext);
}
