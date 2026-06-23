import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalSettingsRowProps = {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ModalSettingsRow({
  label,
  description,
  children,
  className,
}: ModalSettingsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
