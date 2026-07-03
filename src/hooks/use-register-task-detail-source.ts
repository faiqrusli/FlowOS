"use client";

import { useEffect } from "react";
import {
  useGlobalRightSidebar,
  type TaskDetailSource,
} from "@/contexts/global-right-sidebar-context";

export function useRegisterTaskDetailSource(
  source: TaskDetailSource | null,
  deps: React.DependencyList
) {
  const { registerTaskDetailSource } = useGlobalRightSidebar();

  useEffect(() => {
    registerTaskDetailSource(source);
    return () => registerTaskDetailSource(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
