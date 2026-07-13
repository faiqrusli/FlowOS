"use client";

import { Button } from "@/components/ui/button";

type NextUpScheduledNotificationProps = {
  title: string;
  onKeepCurrent: () => void;
  onStart: () => void;
};

export function NextUpScheduledNotification({
  title,
  onKeepCurrent,
  onStart,
}: NextUpScheduledNotificationProps) {
  return (
    <div
      role="alert"
      className="mx-auto w-full max-w-sm rounded-lg border border-primary/30 bg-primary/[0.06] px-3.5 py-3 text-center"
    >
      <p className="text-sm font-semibold text-foreground">
        {title} is scheduled now
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3.5"
          onClick={onKeepCurrent}
        >
          Keep Current
        </Button>
        <Button type="button" size="sm" className="h-8 px-4" onClick={onStart}>
          Start {title}
        </Button>
      </div>
    </div>
  );
}
