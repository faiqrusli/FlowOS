"use client";

import Link from "next/link";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type {
  TodayRecoveryAction,
  TodaySourceEnvelope,
  TodaySourceState,
} from "@/lib/today-composition";
import { cn } from "@/lib/utils";

type TodaySourceModuleProps<T> = {
  id: string;
  label: string;
  envelope: TodaySourceEnvelope<T>;
  ownerHref: string;
  ownerActionLabel: string;
  onRetry?: () => void;
  children: ReactNode;
};

const stateLabel: Record<TodaySourceState, string> = {
  loading: "Loading",
  ready: "Confirmed",
  empty: "Empty for this view",
  partial: "Partial",
  stale: "Last confirmed",
  unavailable: "Unavailable",
  disconnected: "Disconnected",
  error: "Not confirmed",
};

const stateClass: Record<TodaySourceState, string> = {
  loading: "text-muted-foreground",
  ready: "text-success",
  empty: "text-muted-foreground",
  partial: "text-warning",
  stale: "text-warning",
  unavailable: "text-warning",
  disconnected: "text-warning",
  error: "text-destructive",
};

function stateDescription(
  state: TodaySourceState,
  recovery: TodayRecoveryAction,
): string {
  switch (state) {
    case "ready":
      return "This source confirmed the context shown below.";
    case "empty":
      return "This source confirmed no relevant record for this view.";
    case "partial":
      return "Some context is confirmed; the limitation below remains active.";
    case "stale":
      return "This is last-confirmed context and may have changed at the owner.";
    case "unavailable":
      return recovery === "reauthenticate"
        ? "Access is required before this source can be confirmed."
        : "This source or capability cannot be verified right now.";
    case "disconnected":
      return "The source relationship ended; prior context is retained where available.";
    case "error":
      return "The current source context was not confirmed.";
    case "loading":
      return "This source is being read; absence is not empty.";
  }
}

export function TodaySourceModule<T>({
  id,
  label,
  envelope,
  ownerHref,
  ownerActionLabel,
  onRetry,
  children,
}: TodaySourceModuleProps<T>) {
  const headingId = `${id}-heading`;
  const stateId = `${id}-state`;
  const canRetry = Boolean(
    onRetry &&
      ["stale", "unavailable", "disconnected", "error"].includes(
        envelope.state,
      ),
  );

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={stateId}
      data-today-source={envelope.source}
      className="flex min-h-[12rem] flex-col rounded-2xl bg-surface-raised/70 p-4 shadow-sm ring-1 ring-border/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <h2 id={headingId} className="mt-1 text-base font-semibold text-foreground">
            {stateLabel[envelope.state]}
          </h2>
        </div>
        <span
          className={cn("shrink-0 text-xs font-medium", stateClass[envelope.state])}
          data-today-source-state={envelope.state}
        >
          {envelope.freshness === "last-confirmed"
            ? "Last confirmed"
            : stateLabel[envelope.state]}
        </span>
      </div>

      <p id={stateId} className="mt-2 text-sm leading-6 text-muted-foreground">
        {stateDescription(envelope.state, envelope.recovery)}
      </p>

      <div className="mt-4 flex-1 text-sm text-foreground/90">{children}</div>

      {envelope.limitation ? (
        <p className="mt-4 rounded-lg bg-surface-base/70 px-3 py-2 text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground/80">Limitation: </span>
          {envelope.limitation}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={ownerHref}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle bg-control-default px-2.5 text-xs font-medium text-foreground/85 transition-colors hover:bg-control-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {ownerActionLabel}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
        {canRetry ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRetry}
            aria-label={`Retry ${label}`}
          >
            <RefreshCw className="size-3.5" aria-hidden />
            Retry
          </Button>
        ) : null}
      </div>
    </section>
  );
}
