import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import { DRAG_DISTANCE } from "@/lib/dnd/constants";

export const TASK_POINTER_ACTIVATION = {
  distance: DRAG_DISTANCE,
} as const;

export const TASK_TOUCH_ACTIVATION = {
  delay: 150,
  tolerance: DRAG_DISTANCE,
} as const;

export type TaskSensorDefinitions = {
  pointer: {
    sensor: typeof PointerSensor;
    options: SensorOptions;
  };
  touch: {
    sensor: typeof TouchSensor;
    options: SensorOptions;
  };
};

/** Sensor configuration for the tasks board DndContext. */
export function createTaskSensors(): TaskSensorDefinitions {
  return {
    pointer: {
      sensor: PointerSensor,
      options: {
        activationConstraint: TASK_POINTER_ACTIVATION,
      },
    },
    touch: {
      sensor: TouchSensor,
      options: {
        activationConstraint: TASK_TOUCH_ACTIVATION,
      },
    },
  };
}

/** Wired sensors for TaskDndContext. */
export function useTaskDndSensors() {
  const definitions = createTaskSensors();
  return useSensors(
    useSensor(definitions.pointer.sensor, definitions.pointer.options),
    useSensor(definitions.touch.sensor, definitions.touch.options)
  );
}

export type TaskPointerSensor = SensorDescriptor<typeof PointerSensor>;
