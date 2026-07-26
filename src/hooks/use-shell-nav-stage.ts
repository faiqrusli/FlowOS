"use client";

import { useEffect, useState } from "react";
import {
  resolveShellNavStage,
  type ShellNavStage,
} from "@/lib/shell-nav-layout";

/** Live shell nav stage from viewport width (70% collapse / 50% top). */
export function useShellNavStage(): ShellNavStage {
  const [stage, setStage] = useState<ShellNavStage>("comfortable");

  useEffect(() => {
    const sync = () => setStage(resolveShellNavStage(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return stage;
}
