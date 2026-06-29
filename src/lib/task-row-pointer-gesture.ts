import { useCallback, useEffect, useRef, type PointerEvent } from "react";

export const TASK_ROW_DRAG_THRESHOLD_PX = 6;

type GestureState = {
  pointerId: number;
  startX: number;
  startY: number;
  isDragging: boolean;
};

export type TaskRowPointerCoords = {
  clientX: number;
  clientY: number;
};

type UseTaskRowPointerGestureOptions = {
  dragEnabled: boolean;
  gestureEnabled: boolean;
  isInteractiveTarget: (target: EventTarget | null) => boolean;
  onOpenDetail: () => void;
  onPointerDragStart: (coords: TaskRowPointerCoords) => void;
  onPointerDragEnd: () => void;
};

export function useTaskRowPointerGesture({
  dragEnabled,
  gestureEnabled,
  isInteractiveTarget,
  onOpenDetail,
  onPointerDragStart,
  onPointerDragEnd,
}: UseTaskRowPointerGestureOptions) {
  const gestureRef = useRef<GestureState | null>(null);
  const selectBlockCleanupRef = useRef<(() => void) | null>(null);
  const onOpenDetailRef = useRef(onOpenDetail);
  const onPointerDragStartRef = useRef(onPointerDragStart);
  const onPointerDragEndRef = useRef(onPointerDragEnd);

  onOpenDetailRef.current = onOpenDetail;
  onPointerDragStartRef.current = onPointerDragStart;
  onPointerDragEndRef.current = onPointerDragEnd;

  const clearGesture = useCallback(() => {
    gestureRef.current = null;
  }, []);

  const unblockTextSelection = useCallback(() => {
    selectBlockCleanupRef.current?.();
    selectBlockCleanupRef.current = null;
  }, []);

  const blockTextSelection = useCallback(() => {
    unblockTextSelection();

    const preventSelect = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("selectstart", preventSelect);

    const cleanup = () => {
      document.removeEventListener("selectstart", preventSelect);
      document.removeEventListener("pointerup", cleanup);
      document.removeEventListener("pointercancel", cleanup);
      if (selectBlockCleanupRef.current === cleanup) {
        selectBlockCleanupRef.current = null;
      }
    };

    document.addEventListener("pointerup", cleanup);
    document.addEventListener("pointercancel", cleanup);
    selectBlockCleanupRef.current = cleanup;
  }, [unblockTextSelection]);

  const finishGesture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (gesture.isDragging) {
        onPointerDragEndRef.current();
      } else if (event.button === 0) {
        onOpenDetailRef.current();
      }

      unblockTextSelection();
      clearGesture();
    },
    [clearGesture, unblockTextSelection]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!gestureEnabled || event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      event.preventDefault();
      blockTextSelection();
      window.getSelection()?.removeAllRanges();

      gestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        isDragging: false,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [blockTextSelection, gestureEnabled, isInteractiveTarget]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      event.preventDefault();

      if (!dragEnabled || gesture.isDragging) return;

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (
        dx * dx + dy * dy <
        TASK_ROW_DRAG_THRESHOLD_PX * TASK_ROW_DRAG_THRESHOLD_PX
      ) {
        return;
      }

      gesture.isDragging = true;
      window.getSelection()?.removeAllRanges();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onPointerDragStartRef.current({
        clientX: event.clientX,
        clientY: event.clientY,
      });
    },
    [dragEnabled]
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishGesture(event);
    },
    [finishGesture]
  );

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (gesture.isDragging) {
        onPointerDragEndRef.current();
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      unblockTextSelection();
      clearGesture();
    },
    [clearGesture, unblockTextSelection]
  );

  useEffect(
    () => () => {
      unblockTextSelection();
      clearGesture();
    },
    [clearGesture, unblockTextSelection]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}
