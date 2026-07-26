"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Local writing buffer — ignores server/prop updates while focused so cursor
 * and in-progress text stay stable (task description pattern).
 */
export function useWritingField(entityId: string, serverValue: string) {
  const [value, setValue] = useState(serverValue);
  const focusedRef = useRef(false);

  useEffect(() => {
    setValue(serverValue);
    focusedRef.current = false;
  }, [entityId]);

  useEffect(() => {
    if (!focusedRef.current) {
      setValue(serverValue);
    }
  }, [serverValue]);

  return {
    value,
    onFocus: () => {
      focusedRef.current = true;
    },
    onBlur: () => {
      focusedRef.current = false;
    },
    setValue,
    isFocused: () => focusedRef.current,
  };
}
