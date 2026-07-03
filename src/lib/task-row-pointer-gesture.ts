import { useCallback, useEffect, useRef, type PointerEvent } from "react";

export const TASK_ROW_DRAG_THRESHOLD_PX = 8;

const TASK_ROW_DOUBLE_CLICK_MS = 500;
const TASK_ROW_TITLE_OPEN_DELAY_MS = 100;
const TASK_ROW_DOUBLE_CLICK_DISTANCE_PX = 12;

type GestureState = {
  pointerId: number;
  startX: number;
  startY: number;
  isDragging: boolean;
  captureDeferred: boolean;
  rowElement: HTMLDivElement;
};

type LastTapState = {
  time: number;
  x: number;
  y: number;
  onTitle: boolean;
};

export type TaskRowPointerCoords = {
  clientX: number;
  clientY: number;
};

type PointerGestureEvent = Pick<
  PointerEvent<HTMLDivElement>,
  "pointerId" | "clientX" | "clientY" | "button"
> & {
  target: EventTarget | null;
};

type UseTaskRowPointerGestureOptions = {
  dragEnabled: boolean;
  gestureEnabled: boolean;
  isInteractiveTarget: (target: EventTarget | null) => boolean;
  isDoubleClickTarget?: (target: EventTarget | null) => boolean;
  onOpenDetail: () => void;
  onDoubleClick?: () => void;
  onPointerDragStart: (coords: TaskRowPointerCoords) => void;
  onPointerDragEnd: () => void;
};

export function useTaskRowPointerGesture({
  dragEnabled,
  gestureEnabled,
  isInteractiveTarget,
  isDoubleClickTarget,
  onOpenDetail,
  onDoubleClick,
  onPointerDragStart,
  onPointerDragEnd,
}: UseTaskRowPointerGestureOptions) {
  const gestureRef = useRef<GestureState | null>(null);
  const selectBlockCleanupRef = useRef<(() => void) | null>(null);
  const deferredListenersCleanupRef = useRef<(() => void) | null>(null);
  const lastTapRef = useRef<LastTapState | null>(null);
  const pendingOpenDetailRef = useRef<number | null>(null);
  const onOpenDetailRef = useRef(onOpenDetail);
  const onDoubleClickRef = useRef(onDoubleClick);
  const onPointerDragStartRef = useRef(onPointerDragStart);
  const onPointerDragEndRef = useRef(onPointerDragEnd);
  const isDoubleClickTargetRef = useRef(isDoubleClickTarget);

  onOpenDetailRef.current = onOpenDetail;
  onDoubleClickRef.current = onDoubleClick;
  onPointerDragStartRef.current = onPointerDragStart;
  onPointerDragEndRef.current = onPointerDragEnd;
  isDoubleClickTargetRef.current = isDoubleClickTarget;

  const cancelPendingOpenDetail = useCallback(() => {
    if (pendingOpenDetailRef.current !== null) {
      window.clearTimeout(pendingOpenDetailRef.current);
      pendingOpenDetailRef.current = null;
    }
  }, []);

  const isTitleDoubleClickInProgress = useCallback(
    (target: EventTarget | null, clientX: number, clientY: number) => {
      const onTitle = isDoubleClickTargetRef.current?.(target) ?? false;
      if (!onTitle) return false;

      const lastTap = lastTapRef.current;
      if (!lastTap?.onTitle) return false;

      const now = Date.now();
      return (
        now - lastTap.time <= TASK_ROW_DOUBLE_CLICK_MS &&
        Math.abs(clientX - lastTap.x) <= TASK_ROW_DOUBLE_CLICK_DISTANCE_PX &&
        Math.abs(clientY - lastTap.y) <= TASK_ROW_DOUBLE_CLICK_DISTANCE_PX
      );
    },
    []
  );

  const scheduleOpenDetail = useCallback(
    (delayMs: number) => {
      cancelPendingOpenDetail();
      pendingOpenDetailRef.current = window.setTimeout(() => {
        pendingOpenDetailRef.current = null;
        lastTapRef.current = null;
        onOpenDetailRef.current();
      }, delayMs);
    },
    [cancelPendingOpenDetail]
  );

  const clearGesture = useCallback(() => {
    gestureRef.current = null;
  }, []);

  const detachDeferredListeners = useCallback(() => {
    deferredListenersCleanupRef.current?.();
    deferredListenersCleanupRef.current = null;
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

  const tryStartDrag = useCallback(
    (event: PointerGestureEvent, rowElement: HTMLDivElement) => {
      const gesture = gestureRef.current;
      if (
        !gesture ||
        gesture.pointerId !== event.pointerId ||
        gesture.isDragging ||
        !dragEnabled
      ) {
        return false;
      }

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (
        dx * dx + dy * dy <
        TASK_ROW_DRAG_THRESHOLD_PX * TASK_ROW_DRAG_THRESHOLD_PX
      ) {
        return false;
      }

      gesture.isDragging = true;
      cancelPendingOpenDetail();
      lastTapRef.current = null;
      detachDeferredListeners();
      blockTextSelection();
      window.getSelection()?.removeAllRanges();

      if (rowElement.hasPointerCapture(event.pointerId)) {
        rowElement.releasePointerCapture(event.pointerId);
      }

      onPointerDragStartRef.current({
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return true;
    },
    [
      blockTextSelection,
      cancelPendingOpenDetail,
      detachDeferredListeners,
      dragEnabled,
    ]
  );

  const finishGesture = useCallback(
    (event: PointerGestureEvent, rowElement: HTMLDivElement) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      detachDeferredListeners();

      if (rowElement.hasPointerCapture(event.pointerId)) {
        rowElement.releasePointerCapture(event.pointerId);
      }

      if (gesture.isDragging) {
        cancelPendingOpenDetail();
        lastTapRef.current = null;
        onPointerDragEndRef.current();
      } else if (event.button === 0) {
        const onTitle =
          isDoubleClickTargetRef.current?.(event.target) ?? false;
        const now = Date.now();
        const lastTap = lastTapRef.current;
        const isDoubleClick =
          onTitle &&
          lastTap?.onTitle &&
          now - lastTap.time <= TASK_ROW_DOUBLE_CLICK_MS &&
          Math.abs(event.clientX - lastTap.x) <=
            TASK_ROW_DOUBLE_CLICK_DISTANCE_PX &&
          Math.abs(event.clientY - lastTap.y) <=
            TASK_ROW_DOUBLE_CLICK_DISTANCE_PX;

        if (isDoubleClick && onDoubleClickRef.current) {
          cancelPendingOpenDetail();
          lastTapRef.current = null;
          onDoubleClickRef.current();
        } else {
          lastTapRef.current = {
            time: now,
            x: event.clientX,
            y: event.clientY,
            onTitle,
          };

          if (onTitle && onDoubleClickRef.current) {
            scheduleOpenDetail(TASK_ROW_TITLE_OPEN_DELAY_MS);
          } else {
            cancelPendingOpenDetail();
            lastTapRef.current = null;
            onOpenDetailRef.current();
          }
        }
      }

      unblockTextSelection();
      clearGesture();
    },
    [
      cancelPendingOpenDetail,
      clearGesture,
      detachDeferredListeners,
      scheduleOpenDetail,
      unblockTextSelection,
    ]
  );

  const attachDeferredListeners = useCallback(
    (rowElement: HTMLDivElement, pointerId: number) => {
      detachDeferredListeners();

      const onDocPointerMove = (event: globalThis.PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        if (tryStartDrag(event, rowElement)) {
          event.preventDefault();
        }
      };

      const onDocPointerEnd = (event: globalThis.PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        finishGesture(event, rowElement);
      };

      document.addEventListener("pointermove", onDocPointerMove);
      document.addEventListener("pointerup", onDocPointerEnd);
      document.addEventListener("pointercancel", onDocPointerEnd);

      deferredListenersCleanupRef.current = () => {
        document.removeEventListener("pointermove", onDocPointerMove);
        document.removeEventListener("pointerup", onDocPointerEnd);
        document.removeEventListener("pointercancel", onDocPointerEnd);
      };
    },
    [detachDeferredListeners, finishGesture, tryStartDrag]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!gestureEnabled || event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      const onTitle = isDoubleClickTargetRef.current?.(event.target) ?? false;
      const rowElement = event.currentTarget;

      if (
        onTitle &&
        isTitleDoubleClickInProgress(
          event.target,
          event.clientX,
          event.clientY
        )
      ) {
        cancelPendingOpenDetail();
      }

      gestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        isDragging: false,
        captureDeferred: onTitle,
        rowElement,
      };

      if (onTitle) {
        attachDeferredListeners(rowElement, event.pointerId);
        return;
      }

      event.preventDefault();
      blockTextSelection();
      window.getSelection()?.removeAllRanges();
      rowElement.setPointerCapture(event.pointerId);
    },
    [
      attachDeferredListeners,
      blockTextSelection,
      cancelPendingOpenDetail,
      gestureEnabled,
      isInteractiveTarget,
      isTitleDoubleClickInProgress,
    ]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (gesture.captureDeferred) {
        if (tryStartDrag(event, event.currentTarget)) {
          event.preventDefault();
        }
        return;
      }

      event.preventDefault();

      if (!dragEnabled || gesture.isDragging) return;

      tryStartDrag(event, event.currentTarget);
    },
    [dragEnabled, tryStartDrag]
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      finishGesture(event, event.currentTarget);
    },
    [finishGesture]
  );

  const onPointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      detachDeferredListeners();

      if (gesture.isDragging) {
        onPointerDragEndRef.current();
      }

      cancelPendingOpenDetail();
      lastTapRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      unblockTextSelection();
      clearGesture();
    },
    [
      cancelPendingOpenDetail,
      clearGesture,
      detachDeferredListeners,
      unblockTextSelection,
    ]
  );

  useEffect(
    () => () => {
      cancelPendingOpenDetail();
      lastTapRef.current = null;
      detachDeferredListeners();
      unblockTextSelection();
      clearGesture();
    },
    [
      cancelPendingOpenDetail,
      clearGesture,
      detachDeferredListeners,
      unblockTextSelection,
    ]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    cancelPendingOpenDetail,
  };
}
