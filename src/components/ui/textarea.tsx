import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border-subtle bg-transparent px-2.5 py-2 text-base transition-[border-color,box-shadow,background-color] duration-150 outline-none placeholder:text-muted-foreground hover:border-border-strong focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-input/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/25 md:text-sm dark:bg-surface-base/40 dark:hover:bg-surface-hover/40 dark:focus-visible:bg-surface-base/60 dark:disabled:bg-input/15 dark:aria-invalid:ring-destructive/35",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
