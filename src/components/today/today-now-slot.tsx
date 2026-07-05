"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NextAction } from "@/lib/dashboard-command";
import { dismissKey } from "@/lib/next-action-dismiss";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

type TodayNowSlotProps = {
  loading?: boolean;
  visible: boolean;
  nextAction: NextAction;
  hasActiveFocus: boolean;
  focusSessionLabel?: string;
  focusIsPaused?: boolean;
  onAction: (action: NextAction) => void;
  onDismiss?: () => void;
  onQuickComplete?: () => void;
  completing?: boolean;
};

function useCrossfadeAction(nextAction: NextAction) {
  const contentKey = dismissKey(nextAction);
  const [displayed, setDisplayed] = useState(nextAction);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const prevKeyRef = useRef(contentKey);

  useEffect(() => {
    if (contentKey === prevKeyRef.current) {
      setDisplayed(nextAction);
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      prevKeyRef.current = contentKey;
      setDisplayed(nextAction);
      setPhase("in");
      return;
    }

    setPhase("out");
    const timer = window.setTimeout(() => {
      prevKeyRef.current = contentKey;
      setDisplayed(nextAction);
      setPhase("in");
    }, 250);

    return () => window.clearTimeout(timer);
  }, [contentKey, nextAction]);

  return { displayed, phase };
}

function NowSlotActions({
  action,
  onAction,
  onDismiss,
  onQuickComplete,
  completing,
  showQuickComplete,
}: {
  action: NextAction;
  onAction: (action: NextAction) => void;
  onDismiss?: () => void;
  onQuickComplete?: () => void;
  completing?: boolean;
  showQuickComplete?: boolean;
}) {
  const useInPlace = Boolean(action.inPlaceAction);

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {showQuickComplete && onQuickComplete ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={completing}
          onClick={onQuickComplete}
          className="h-8 gap-1.5 px-3"
        >
          <Check className="size-3.5" />
          Done
        </Button>
      ) : null}
      {useInPlace ? (
        <Button
          type="button"
          size="sm"
          className="h-8 gap-1.5 px-3"
          onClick={() => onAction(action)}
        >
          {action.actionLabel}
          <ArrowRight className="size-3.5" />
        </Button>
      ) : null}
      {onDismiss ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label="Dismiss"
          title="Dismiss"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

export function TodayNowSlot({
  loading,
  visible,
  nextAction,
  hasActiveFocus,
  focusSessionLabel,
  focusIsPaused,
  onAction,
  onDismiss,
  onQuickComplete,
  completing,
}: TodayNowSlotProps) {
  const { displayed, phase } = useCrossfadeAction(nextAction);

  if (!visible) return null;

  if (loading) {
    return (
      <div className="px-6 lg:pl-10" aria-busy="true">
        <div className="min-h-[4.5rem] py-2">
          <div className="h-5 w-48 max-w-full rounded bg-muted/40" />
        </div>
      </div>
    );
  }

  if (displayed.type === "empty") return null;

  const showQuickComplete =
    Boolean(onQuickComplete) &&
    Boolean(displayed.entityId) &&
    (displayed.type === "task" || displayed.type === "habit");

  const isActiveFocusCard = hasActiveFocus && displayed.type === "focus";
  const isReflectionTeaser = displayed.type === "reflection";

  const title = isActiveFocusCard
    ? focusSessionLabel?.trim() || "Focus session"
    : displayed.title;

  const reason = isActiveFocusCard
    ? focusIsPaused
      ? "Paused — pick up where you left off."
      : displayed.description
    : displayed.description;

  const eyebrow = isActiveFocusCard
    ? "Continue focus"
    : isReflectionTeaser
      ? "Close your day"
      : "Now";

  const primaryAction = isActiveFocusCard && focusIsPaused
    ? { ...displayed, actionLabel: "Resume" }
    : displayed;

  return (
    <section
      className="px-6 lg:pl-10"
      role="status"
      aria-live="polite"
      aria-label="Current recommendation"
    >
      <div
        className={cn(
          "min-h-[4.5rem] py-2 transition-opacity duration-300 motion-reduce:transition-none",
          phase === "out" ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <p className={type.metaMedium}>{eyebrow}</p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {reason ? (
              <p className={cn(type.bodyMuted, "line-clamp-2")}>{reason}</p>
            ) : null}
          </div>
          <NowSlotActions
            action={primaryAction}
            onAction={onAction}
            onDismiss={onDismiss}
            onQuickComplete={onQuickComplete}
            completing={completing}
            showQuickComplete={showQuickComplete}
          />
        </div>
      </div>
    </section>
  );
}
