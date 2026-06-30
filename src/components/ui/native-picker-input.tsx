"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Full-field click target; hides the browser's calendar/clock icon. */
export const nativePickerInputClassName =
  "relative cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

type NativePickerInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  type: "date" | "time";
};

export function NativePickerInput({
  className,
  onClick,
  ...props
}: NativePickerInputProps) {
  function handleClick(event: React.MouseEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        // Picker already open or unsupported.
      }
    }
    onClick?.(event);
  }

  return (
    <Input
      {...props}
      className={cn(nativePickerInputClassName, className)}
      onClick={handleClick}
    />
  );
}
