import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackToTodayLinkProps = {
  className?: string;
};

export function BackToTodayLink({ className }: BackToTodayLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-surface-raised px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
      Today
    </Link>
  );
}
