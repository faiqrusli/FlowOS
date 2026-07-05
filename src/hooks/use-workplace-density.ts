"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readWorkplaceDensity,
  subscribeWorkplaceDensity,
  writeWorkplaceDensity,
  type WorkplaceDensity,
} from "@/lib/workplace-density";

export function useWorkplaceDensity() {
  const [density, setDensityState] = useState<WorkplaceDensity>("work");

  useEffect(() => {
    setDensityState(readWorkplaceDensity());
    return subscribeWorkplaceDensity(() => {
      setDensityState(readWorkplaceDensity());
    });
  }, []);

  const setDensity = useCallback((next: WorkplaceDensity) => {
    writeWorkplaceDensity(next);
    setDensityState(next);
  }, []);

  return { density, setDensity };
}
