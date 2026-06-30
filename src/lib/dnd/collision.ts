import {
  closestCenter,
  pointerWithin,
  type CollisionDetection,
} from "@dnd-kit/core";

/** Prefer pointer position, fall back to closest center for column/task targeting. */
export const taskCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return closestCenter(args);
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
