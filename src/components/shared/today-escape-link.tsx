import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TodayEscapeLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TodayEscapeLink({
  href,
  children,
  className,
}: TodayEscapeLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
        className
      )}
    >
      {children}
      <ArrowUpRight className="size-3.5 shrink-0 opacity-70" aria-hidden />
    </Link>
  );
}
