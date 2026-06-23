import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";

type DashboardPanelProps = {
  title: string;
  href: string;
  actionLabel?: string;
  count?: { completed: number; total: number };
  className?: string;
  children: ReactNode;
};

export function DashboardPanelAction({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {label}
      <ArrowRight className="size-3 stroke-[2]" aria-hidden />
    </Link>
  );
}

export function DashboardPanel({
  title,
  href,
  actionLabel = "View",
  count,
  className,
  children,
}: DashboardPanelProps) {
  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-lg border border-border/50 bg-card px-4 py-4",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className={type.sectionTitle}>
          {title}
          {count && count.total > 0 && (
            <span className="ml-1.5 font-normal tabular-nums text-muted-foreground">
              {count.completed}/{count.total}
            </span>
          )}
        </h2>
        <DashboardPanelAction href={href} label={actionLabel} />
      </div>
      <div className="min-w-0 flex-1 space-y-2">{children}</div>
    </section>
  );
}

export function DashboardEmptyLine({ message }: { message: string }) {
  return <p className={cn(type.bodyMuted, "leading-relaxed")}>{message}</p>;
}

export function DashboardMetric({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn(type.contentPrimary, "leading-snug", className)}>
      {children}
    </p>
  );
}

export function DashboardSupportingText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn(type.meta, "leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}
