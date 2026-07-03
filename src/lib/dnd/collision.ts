import { pointerWithin, type CollisionDetection } from "@dnd-kit/core";

/**
 * Pointer-only collision — no rect-intersection fallback loop.
 * Board drop targeting uses cached pointer math in board-drag-measurements.
 */
export const taskCollisionDetection: CollisionDetection = (args) => {
  return pointerWithin(args);
};

export const COLLISION_STRATEGY = {
  closestCenter: "closestCenter",
  closestCorners: "closestCorners",
  pointerWithin: "pointerWithin",
  rectIntersection: "rectIntersection",
  custom: "custom",
} as const;

export type CollisionStrategyName =
  (typeof COLLISION_STRATEGY)[keyof typeof COLLISION_STRATEGY];
