import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckSquare,
  Flame,
  NotebookPen,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NextAction } from "@/lib/dashboard-command";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

type DashboardNextActionProps = {
  action: NextAction;
  onQuickComplete?: () => void;
  completing?: boolean;
  onAction?: (action: NextAction) => void;
};

const TYPE_ICONS = {
  task: CheckSquare,
  habit: Flame,
  focus: Timer,
  reflection: NotebookPen,
  schedule: Sparkles,
  empty: Sparkles,
} as const;

export function DashboardNextAction({
  action,
  onQuickComplete,
  completing,
  onAction,
}: DashboardNextActionProps) {
  const Icon = TYPE_ICONS[action.type];
  const useInPlace = Boolean(onAction && action.inPlaceAction);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <p className={type.sectionLabel}>Next action</p>
          <p className={cn("mt-0.5 truncate", type.contentPrimaryLg)}>
            {action.title}
          </p>
          <p className={cn("mt-0.5 line-clamp-1", type.bodyMuted)}>
            {action.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 pl-11 sm:pl-0">
        {(action.type === "task" || action.type === "habit") &&
          onQuickComplete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={completing}
              onClick={onQuickComplete}
              className="h-8 gap-1.5 px-3 text-sm"
            >
              <Check className="size-3.5" />
              Mark complete
            </Button>
          )}
        {useInPlace ? (
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 px-3 text-sm"
            onClick={() => onAction?.(action)}
          >
            {action.actionLabel}
            <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button
            size="sm"
            nativeButton={false}
            className="h-8 gap-1.5 px-3 text-sm"
            render={<Link href={action.href} />}
          >
            {action.actionLabel}
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </section>
  );
}
