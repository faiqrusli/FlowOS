import { useCallback, useEffect, useRef, type PointerEvent } from "react";

export const KANBAN_CARD_DRAG_THRESHOLD_PX = 8;
const DOUBLE_CLICK_MS = 450;
const DOUBLE_CLICK_DISTANCE_PX = 12;
const SINGLE_CLICK_DELAY_MS = 180;

type GestureState = {
  pointerId: number;
  startX: number;
  startY: number;
  isDragging: boolean;
  rowElement: HTMLDivElement;
};

type LastTapState = {
  time: number;
  x: number;
  y: number;
};

export type KanbanCardPointerCoords = {
  clientX: number;
  clientY: number;
};

type UseKanbanCardPointerGestureOptions = {
  enabled: boolean;
  isInteractiveTarget: (target: EventTarget | null) => boolean;
  onSingleClickEdit: () => void;
  onDoubleClickWord: (coords: KanbanCardPointerCoords) => void;
  onPointerDragStart: (coords: KanbanCardPointerCoords) => void;
  onPointerDragEnd: () => void;
};

export function useKanbanCardPointerGesture({
  enabled,
  isInteractiveTarget,
  onSingleClickEdit,
  onDoubleClickWord,
  onPointerDragStart,
  onPointerDragEnd,
}: UseKanbanCardPointerGestureOptions) {
  const gestureRef = useRef<GestureState | null>(null);
  const lastTapRef = useRef<LastTapState | null>(null);
  const singleClickTimerRef = useRef<number | null>(null);
  const onSingleClickEditRef = useRef(onSingleClickEdit);
  const onDoubleClickWordRef = useRef(onDoubleClickWord);
  const onPointerDragStartRef = useRef(onPointerDragStart);
  const onPointerDragEndRef = useRef(onPointerDragEnd);

  onSingleClickEditRef.current = onSingleClickEdit;
  onDoubleClickWordRef.current = onDoubleClickWord;
  onPointerDragStartRef.current = onPointerDragStart;
  onPointerDragEndRef.current = onPointerDragEnd;

  const clearSingleClickTimer = useCallback(() => {
    if (singleClickTimerRef.current !== null) {
      window.clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }
  }, []);

  const clearGesture = useCallback(() => {
    gestureRef.current = null;
  }, []);

  const tryStartDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId || gesture.isDragging) {
        return false;
      }

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (
        dx * dx + dy * dy <
        KANBAN_CARD_DRAG_THRESHOLD_PX * KANBAN_CARD_DRAG_THRESHOLD_PX
      ) {
        return false;
      }

      gesture.isDragging = true;
      clearSingleClickTimer();
      lastTapRef.current = null;
      window.getSelection()?.removeAllRanges();

      if (gesture.rowElement.hasPointerCapture(event.pointerId)) {
        gesture.rowElement.releasePointerCapture(event.pointerId);
      }

      onPointerDragStartRef.current({
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return true;
    },
    []
  );

  const finishGesture = useCallback(
    (event: PointerEvent<HTMLDivElement>, rowElement: HTMLDivElement) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (rowElement.hasPointerCapture(event.pointerId)) {
        rowElement.releasePointerCapture(event.pointerId);
      }

      if (gesture.isDragging) {
        clearSingleClickTimer();
        lastTapRef.current = null;
        onPointerDragEndRef.current();
      } else if (event.button === 0) {
        const now = Date.now();
        const lastTap = lastTapRef.current;
        const isDoubleClick =
          lastTap &&
          now - lastTap.time <= DOUBLE_CLICK_MS &&
          Math.abs(event.clientX - lastTap.x) <= DOUBLE_CLICK_DISTANCE_PX &&
          Math.abs(event.clientY - lastTap.y) <= DOUBLE_CLICK_DISTANCE_PX;

        if (isDoubleClick) {
          clearSingleClickTimer();
          lastTapRef.current = null;
          onDoubleClickWordRef.current({
            clientX: event.clientX,
            clientY: event.clientY,
          });
        } else {
          const tapTime = now;
          lastTapRef.current = {
            time: tapTime,
            x: event.clientX,
            y: event.clientY,
          };
          clearSingleClickTimer();
          singleClickTimerRef.current = window.setTimeout(() => {
            singleClickTimerRef.current = null;
            if (lastTapRef.current?.time === tapTime) {
              lastTapRef.current = null;
              onSingleClickEditRef.current();
            }
          }, SINGLE_CLICK_DELAY_MS);
        }
      }

      clearGesture();
    },
    [clearGesture]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      event.preventDefault();
      const rowElement = event.currentTarget;
      rowElement.setPointerCapture(event.pointerId);

      gestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        isDragging: false,
        rowElement,
      };
    },
    [enabled, isInteractiveTarget]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;

      if (!gesture.isDragging) {
        if (tryStartDrag(event)) {
          event.preventDefault();
        }
        return;
      }

      event.preventDefault();
    },
    [tryStartDrag]
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

      if (gesture.isDragging) {
        onPointerDragEndRef.current();
      }

      clearSingleClickTimer();
      lastTapRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      clearGesture();
    },
    [clearGesture]
  );

  useEffect(
    () => () => {
      clearSingleClickTimer();
      lastTapRef.current = null;
      clearGesture();
    },
    [clearGesture, clearSingleClickTimer]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}

export function expandToWordBoundaries(text: string, index: number): [number, number] {
  const clamped = Math.max(0, Math.min(index, text.length));
  if (!text.length) return [0, 0];

  let start = clamped;
  let end = clamped;

  while (start > 0 && !/\s/.test(text[start - 1] ?? "")) start -= 1;
  while (end < text.length && !/\s/.test(text[end] ?? "")) end += 1;

  return [start, end];
}
