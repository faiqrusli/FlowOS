"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Local writing buffer — ignores server/prop updates while focused so cursor
 * and in-progress text stay stable (task description pattern).
 */
export function useWritingField(entityId: string, serverValue: string) {
  const [value, setValue] = useState(serverValue);
  const focusedRef = useRef(false);
  const entityRef = useRef(entityId);

  useEffect(() => {
    if (entityRef.current !== entityId) {
      entityRef.current = entityId;
      focusedRef.current = false;
      setValue(serverValue);
      return;
    }
    if (!focusedRef.current) {
      setValue(serverValue);
    }
  }, [entityId, serverValue]);

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
